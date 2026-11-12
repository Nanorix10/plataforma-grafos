"""
Constrói a célula animal no Blender, do zero, numa cena própria ("Celula").

Por que um script, e não um .blend editado à mão:
  - o Blender caiu na primeira tentativa e levou a cena junto (nada salvo).
    Com o script, reconstruir é rodar de novo;
  - o script é texto: o PR mostra exatamente o que mudou na célula;
  - as posições saem de sorteio COM SEMENTE, então rodar duas vezes dá a
    mesma célula.

Como rodar (dentro do Blender, pelo MCP ou pelo editor de texto):
    exec(open(r"<caminho>/celula_blender.py", encoding="utf-8").read())
    construir()            # monta tudo
    previa_corte(True)     # liga o corte em cunha só para render de prévia

Cada objeto da coleção "Celula" é UMA estrutura e leva a propriedade
`parte` (id usado pelo visualizador do site). Vai para o glTF como `extras`.

Escala: unidades do Blender, célula com ~6 de diâmetro. Esquemática, como a
figura do livro: tamanhos relativos exagerados para cada organela ser
reconhecível.
"""
import bpy, bmesh, math, random
from mathutils import Vector, Matrix, Quaternion, noise

# Os valores abaixo são os da célula ANIMAL; `construir("vegetal")` troca
# todos de uma vez (ver VARIANTES no fim do arquivo).
FORMA = (3.2, 3.0, 2.55)          # semi-eixos da célula (x, y, z)
E = 1.0                           # expoente da superelipsoide: 1 = elipsoide, <1 = caixa arredondada
# Centro do núcleo: perto do meio, para o corte (que tira o quadrante x>0, y<0)
# atravessar o núcleo e mostrar nucléolo e cromatina, e não só beliscá-lo.
NC = Vector((-0.05, 0.12, 0.15))
NR = 1.08                         # raio do núcleo
CENTROSSOMO = Vector((0.75, 0.25, 1.05))
VAC = None                        # (centro, semi-eixos) do vacúolo central, só na vegetal
DIR_RER = Vector((-0.35, 0.75, -0.55))
BASE_REL = Vector((-1.55, -1.05, -0.7))
CENTRO_GOLGI = Vector((1.45, 1.15, -0.35))

# ----------------------------------------------------------------- base

def cena():
    sc = bpy.data.scenes.get("Celula") or bpy.data.scenes.new("Celula")
    if "Celula" not in sc.collection.children:
        sc.collection.children.link(bpy.data.collections.get("Celula") or bpy.data.collections.new("Celula"))
    if "Estudio" not in sc.collection.children:
        sc.collection.children.link(bpy.data.collections.get("Estudio") or bpy.data.collections.new("Estudio"))
    bpy.context.window.scene = sc
    return sc


def colecao():
    return bpy.data.collections["Celula"]


def hexc(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def mat(nome, cor, rough=0.5, sss=0.0, alpha=1.0, coat=0.0, sheen=0.0, metal=0.0):
    """Material simples: tudo em entradas constantes, que é o que o glTF exporta."""
    m = bpy.data.materials.get(nome) or bpy.data.materials.new(nome)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*hexc(cor), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Subsurface Weight"].default_value = sss
    b.inputs["Subsurface Radius"].default_value = (0.5, 0.3, 0.25)
    b.inputs["Subsurface Scale"].default_value = 0.12
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = 0.2
    b.inputs["Sheen Weight"].default_value = sheen
    b.inputs["Alpha"].default_value = alpha
    m.diffuse_color = (*hexc(cor), alpha)
    m.use_backface_culling = False
    m["cor"] = cor
    return m


def novo(nome, bm, material, parte):
    col = colecao()
    velho = bpy.data.objects.get(nome)
    if velho:
        bpy.data.objects.remove(velho, do_unlink=True)
    me = bpy.data.meshes.new(nome)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(nome, me)
    col.objects.link(ob)
    me.materials.append(material)
    ob["parte"] = parte
    return ob


def esfera(r=1.0, sub=3):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=r)
    return bm


def uvesfera(r=1.0, seg=24, aneis=12):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=aneis, radius=r)
    return bm


def ondular(bm, amp, freq, off=(0, 0, 0), oit=3):
    bm.normal_update()
    o = Vector(off)
    for v in bm.verts:
        v.co += v.normal * amp * noise.fractal(v.co * freq + o, 0.5, 2.0, oit)


def escalar(bm, s):
    bmesh.ops.scale(bm, vec=Vector(s), verts=bm.verts)


def mover(bm, loc=(0, 0, 0), rot=None):
    m = Matrix.Translation(Vector(loc))
    if rot is not None:
        m = m @ (rot.to_matrix().to_4x4() if isinstance(rot, Quaternion) else rot)
    bmesh.ops.transform(bm, matrix=m, verts=bm.verts)


def juntar(lista):
    alvo = bmesh.new()
    for b in lista:
        me = bpy.data.meshes.new("_tmp")
        b.to_mesh(me)
        b.free()
        alvo.from_mesh(me)
        bpy.data.meshes.remove(me)
    return alvo


def casca_dupla(bm, espessura):
    """Dá espessura a uma superfície (como o Solidify), já aplicada na malha."""
    bm.normal_update()
    bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=espessura)
    return bm


def tubo(pontos, raio, res=6, lados=6, ciclico=False):
    """Curva suave com espessura, devolvida como malha. `ciclico` fecha a
    curva num anel (o DNA circular da mitocôndria)."""
    sc = bpy.context.scene
    cu = bpy.data.curves.new("_c", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = raio
    cu.bevel_resolution = max(0, lados // 2 - 2)
    cu.resolution_u = res
    cu.use_fill_caps = True
    sp = cu.splines.new("NURBS")
    sp.points.add(len(pontos) - 1)
    for p, c in zip(sp.points, pontos):
        p.co = (*c, 1)
    sp.use_endpoint_u = not ciclico
    sp.use_cyclic_u = ciclico
    sp.order_u = min(4, len(pontos))
    ob = bpy.data.objects.new("_c", cu)
    sc.collection.objects.link(ob)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob)
    bpy.data.curves.remove(cu)
    bm = bmesh.new()
    bm.from_mesh(me)
    bpy.data.meshes.remove(me)
    return bm


def dentro(p, folga=0.0):
    """O ponto está dentro da célula, com folga? Vale para a elipsoide (E=1)
    e para a caixa arredondada da vegetal (E<1)."""
    a, b, c = (x - folga for x in FORMA)
    k = 2 / E
    return abs(p.x / a) ** k + abs(p.y / b) ** k + abs(p.z / c) ** k < 1


def no_vacuolo(p, folga=0.0):
    if VAC is None:
        return False
    c, s = VAC
    d = p - c
    return (d.x / (s[0] + folga)) ** 2 + (d.y / (s[1] + folga)) ** 2 + (d.z / (s[2] + folga)) ** 2 < 1


def superficie(bm, escala=1.0):
    """Leva uma esfera unitária para a forma da célula (superelipsoide)."""
    sp = lambda x: math.copysign(abs(x) ** E, x)
    for v in bm.verts:
        n = v.co.normalized()
        v.co = Vector((sp(n.x) * FORMA[0], sp(n.y) * FORMA[1], sp(n.z) * FORMA[2])) * escala


class Espaco:
    """Lista do que já ocupa lugar, para as organelas não se atravessarem."""

    def __init__(self, rnd):
        self.rnd = rnd
        self.bolas = []

    def ocupar(self, c, r):
        self.bolas.append((Vector(c), r))

    def livre(self, p, r):
        return all((p - c).length > r + rc + 0.06 for c, rc in self.bolas)

    def sortear(self, n, r, folga=0.3, aceita=lambda p: True, tentativas=6000):
        res = []
        for _ in range(tentativas):
            if len(res) >= n:
                break
            p = Vector([self.rnd.uniform(-f, f) for f in FORMA])
            if dentro(p, r + folga) and not no_vacuolo(p, r + 0.08) and self.livre(p, r) and aceita(p):
                self.ocupar(p, r)
                res.append(p)
        return res


def aleatoria(rnd):
    """Rotação uniforme sorteada."""
    u1, u2, u3 = rnd.random(), rnd.random(), rnd.random()
    return Quaternion((
        math.sqrt(1 - u1) * math.sin(2 * math.pi * u2),
        math.sqrt(1 - u1) * math.cos(2 * math.pi * u2),
        math.sqrt(u1) * math.sin(2 * math.pi * u3),
        math.sqrt(u1) * math.cos(2 * math.pi * u3),
    ))


# ----------------------------------------------------------------- estruturas

def _superficie_membrana(vegetal, sub):
    """A face EXTERNA da membrana: a forma da célula, ondulada. Todas as
    camadas e proteínas partem desta mesma superfície."""
    esc = 0.93 if vegetal else 1.0
    amp = 0.05 if vegetal else 0.22
    bm = esfera(1.0, sub)
    superficie(bm, esc)
    ondular(bm, amp, 0.45, (3.1, 1.7, 0.2), 3)
    ondular(bm, 0.03, 2.4, (8, 2, 5), 2)
    return bm


def deslocar(bm, d):
    """Empurra cada vértice ao longo da normal (d < 0 = para dentro)."""
    bm.normal_update()
    for v in bm.verts:
        v.co += v.normal * d


def membrana_e_citoplasma(vegetal=False, rnd=None):
    """BICAMADA: duas faixas de cabeças (rosa) com as caudas (amarelo) entre
    elas — no corte, a borda mostra as três faixas, como no esquema do
    mosaico fluido. Por cima, proteínas atravessando e, na animal, o
    glicocálix. Na vegetal a membrana fica colada por DENTRO da parede, e é
    lisa: quem dá a forma é a parede. Na animal ela é livre, e ondula."""
    rnd = rnd or random.Random(3)
    T = 0.07 if vegetal else 0.09
    cabeca = mat("Membrana", "#e9a9b8", rough=0.4, sss=0.35, coat=0.3, sheen=0.25)
    cauda = mat("Membrana_caudas", "#f3d98a", rough=0.55, sss=0.2)
    # Onde as vesículas se fundem, a membrana tem uma ABERTURA: a da
    # vesícula vira parte da membrana da célula (ver `endo_exocitose`).
    furos = [] if vegetal else [(_ponto_da_membrana(d)[0], r) for d, r in FUSOES]
    fora = _superficie_membrana(vegetal, 6)
    furar(fora, furos)
    casca_dupla(fora, T * 0.3)
    dentro_ = _superficie_membrana(vegetal, 6)
    furar(dentro_, furos)
    deslocar(dentro_, -T * 0.7)
    casca_dupla(dentro_, T * 0.3)
    novo("membrana", juntar([fora, dentro_]), cabeca, "membrana")
    meio = _superficie_membrana(vegetal, 5)
    furar(meio, furos)
    deslocar(meio, -T * 0.3)
    casca_dupla(meio, T * 0.4)
    novo("membrana_caudas", meio, cauda, "membrana")

    # Proteínas: pontos sorteados na própria superfície, cada uma alongada na
    # direção da normal, atravessando as duas camadas (integrais) ou só
    # encostadas por dentro (periféricas).
    base = _superficie_membrana(vegetal, 5)
    base.normal_update()
    vs = list(base.verts)
    prot, acucar = [], []
    for _ in range(420 if not vegetal else 260):
        v = vs[rnd.randrange(len(vs))]
        p, n = v.co.copy(), v.normal.copy()
        if any((p - c).length < r + 0.06 for c, r in furos):
            continue
        q = Vector((0, 0, 1)).rotation_difference(n)
        integral = rnd.random() < 0.75
        b = esfera(1.0, 2)
        if integral:
            escalar(b, (rnd.uniform(0.045, 0.065), rnd.uniform(0.045, 0.065), T * 0.5 + 0.055))
            ondular(b, 0.008, 30, (p.x, p.y, p.z), 2)
            mover(b, p - n * T * 0.5, q)
        else:
            escalar(b, (0.04, 0.035, 0.025))
            mover(b, p - n * (T + 0.02), q)
        prot.append(b)
        # Glicocálix (só animal): cadeias de açúcar presas às proteínas, do
        # lado de FORA — é ele que marca qual face é a externa.
        if integral and not vegetal and rnd.random() < 0.6:
            d = n.copy()
            ponto = p + n * 0.05
            for k in range(rnd.randint(3, 5)):
                d = (d + Vector([rnd.uniform(-0.5, 0.5) for _ in range(3)])).normalized()
                if d.dot(n) < 0.3:
                    d = (d + n).normalized()
                ponto = ponto + d * 0.036
                s = esfera(0.02, 1)
                mover(s, ponto)
                acucar.append(s)
                if k == 1:  # um galho
                    g = ponto + (d.cross(n).normalized() + n).normalized() * 0.036
                    s = esfera(0.02, 1)
                    mover(s, g)
                    acucar.append(s)
    base.free()
    novo("proteinas_membrana", juntar(prot), mat("ProteinaMembrana", "#4a90d9", rough=0.4, sss=0.2, coat=0.2), "proteinas_membrana")
    if acucar:
        novo("glicocalix", juntar(acucar), mat("Glicocalix", "#f0a33a", rough=0.5), "glicocalix")

    if not vegetal:
        endo_exocitose(rnd, T)

    esc = 0.93 if vegetal else 1.0
    amp = 0.05 if vegetal else 0.22
    bm = esfera(1.0, 4)
    superficie(bm, esc * 0.96)
    ondular(bm, amp, 0.45, (3.1, 1.7, 0.2), 3)
    novo("citoplasma", bm, mat("Citoplasma", "#f7dfcc", rough=0.3, alpha=0.16), "citoplasma")


# (direção, raio da abertura): exocitose e endocitose, na célula animal.
FUSOES = [((0.55, -0.75, 0.35), 0.085), ((-0.6, -0.7, -0.4), 0.07)]


def furar(bm, furos):
    """Apaga a membrana em volta de cada ponto de fusão."""
    fora = [v for v in bm.verts if any((v.co - c).length < r for c, r in furos)]
    if fora:
        bmesh.ops.delete(bm, geom=fora, context="VERTS")


def _ponto_da_membrana(direcao):
    """O ponto da face externa mais próximo de uma direção, e a normal ali."""
    base = _superficie_membrana(False, 5)
    base.normal_update()
    d = Vector(direcao).normalized()
    v = max(base.verts, key=lambda v: v.co.normalized().dot(d))
    p, n = v.co.copy(), v.normal.copy()
    base.free()
    return p, n


def _taca(r, abertura):
    """Esfera oca com uma boca virada para +z (a vesícula que se abre na
    membrana). `abertura` = cosseno do ângulo da boca."""
    b = uvesfera(r, 24, 12)
    fora = [v for v in b.verts if v.co.normalized().z > abertura]
    bmesh.ops.delete(b, geom=fora, context="VERTS")
    casca_dupla(b, 0.012)
    return b


def endo_exocitose(rnd, T):
    """Duas vesículas no ato: uma se FUNDINDO à membrana e despejando o
    conteúdo para fora (exocitose), outra se formando a partir de uma
    dobra para dentro, revestida (endocitose)."""
    pecas, conteudo = [], []
    p, n = _ponto_da_membrana(FUSOES[0][0])
    q = Vector((0, 0, 1)).rotation_difference(n)
    b = _taca(0.14, 0.55)
    mover(b, p - n * 0.1, q)
    pecas.append(b)
    for k in range(6):  # o conteúdo saindo
        s = esfera(0.022, 1)
        off = Vector((rnd.uniform(-0.08, 0.08), rnd.uniform(-0.08, 0.08), rnd.uniform(0.0, 0.12)))
        mover(s, p - n * 0.05 + q @ off)
        conteudo.append(s)

    p, n = _ponto_da_membrana(FUSOES[1][0])
    q = Vector((0, 0, 1)).rotation_difference(n)
    b = _taca(0.13, 0.7)
    mover(b, p - n * 0.16, q)
    pecas.append(b)
    for i in range(40):  # o revestimento (clatrina), por fora da dobra
        a = Vector([rnd.uniform(-1, 1) for _ in range(3)]).normalized()
        if a.z > 0.6:
            continue
        s = esfera(0.016, 1)
        mover(s, p - n * 0.16 + q @ (a * 0.155))
        conteudo.append(s)
    novo("vesiculas_membrana", juntar(pecas), mat("Vesicula", "#f3cf78", rough=0.3, sss=0.2, alpha=0.85), "vesiculas")
    novo("vesiculas_conteudo", juntar(conteudo), mat("VesiculaConteudo", "#c98a2e", rough=0.4), "vesiculas")


def parede():
    """Camada grossa de celulose por fora da membrana, com textura de fibras
    (ondulação fina e cruzada) e plasmodesmos atravessando."""
    bm = esfera(1.0, 6)
    superficie(bm, 1.0)
    ondular(bm, 0.025, 1.2, (2, 7, 1), 2)
    for v in bm.verts:  # fibras: sulcos finos em duas direções
        v.co += v.normal * 0.012 * (math.sin(v.co.x * 22 + v.co.z * 9) + math.sin(v.co.y * 19 - v.co.z * 13))
    casca_dupla(bm, 0.2)
    novo("parede", bm, mat("Parede", "#6aa645", rough=0.72, sss=0.05, sheen=0.3), "parede")

    canais = []
    for i in range(22):
        y = 1 - 2 * (i + 0.5) / 22
        rr = math.sqrt(1 - y * y)
        t = i * 2.39996
        n = Vector((math.cos(t) * rr, y, math.sin(t) * rr))
        sp = lambda x: math.copysign(abs(x) ** E, x)
        p = Vector((sp(n.x) * FORMA[0], sp(n.y) * FORMA[1], sp(n.z) * FORMA[2]))
        b = bmesh.new()
        # Do comprimento da espessura da parede, e dentro dela: são canais, não pinos.
        bmesh.ops.create_cone(b, cap_ends=False, segments=10, radius1=0.045, radius2=0.045, depth=0.19)
        casca_dupla(b, 0.015)
        mover(b, p * 0.972, Vector((0, 0, 1)).rotation_difference(p.normalized()))
        canais.append(b)
    novo("plasmodesmos", juntar(canais), mat("Plasmodesmo", "#e9a9b8", rough=0.4, sss=0.3), "plasmodesmos")


def vacuolo():
    c, s = VAC
    bm = esfera(1.0, 5)
    escalar(bm, s)
    ondular(bm, 0.09, 0.9, (5, 1, 3), 3)
    mover(bm, c)
    casca_dupla(bm, 0.025)
    novo("vacuolo", bm, mat("Tonoplasto", "#7fbfe6", rough=0.25, sss=0.2, alpha=0.55, coat=0.4), "vacuolo")
    bm = esfera(1.0, 4)
    escalar(bm, [x * 0.97 for x in s])
    ondular(bm, 0.09, 0.9, (5, 1, 3), 3)
    mover(bm, c)
    novo("suco_vacuolar", bm, mat("SucoVacuolar", "#bfe3f7", rough=0.15, alpha=0.22), "vacuolo")


def cloroplastos(rnd, esp):
    """Lente achatada com membrana dupla; dentro, o estroma e os GRANA (pilhas
    de tilacoides em forma de moeda) ligados pelas lamelas. Ficam na faixa de
    citoplasma entre o vacúolo e a membrana, deitados ao longo da parede."""
    cascas, estromas, grana = [], [], []
    for c in esp.sortear(18, 0.5, folga=0.1, tentativas=20000):
        sp = lambda x: math.copysign(abs(x) ** E, x)
        fora = c.normalized()
        q = Vector((0, 0, 1)).rotation_difference(fora) @ Quaternion(Vector((0, 0, 1)), rnd.uniform(0, math.pi))
        ext = uvesfera(1.0, 40, 20)
        escalar(ext, (0.6, 0.38, 0.2))
        ondular(ext, 0.015, 3, (c.x, c.y, 0), 2)
        inn = uvesfera(1.0, 40, 20)
        escalar(inn, (0.56, 0.34, 0.17))
        casca_dupla(ext, 0.014)
        casca_dupla(inn, 0.012)
        est = uvesfera(1.0, 24, 12)
        escalar(est, (0.54, 0.32, 0.155))
        g = []
        posicoes = [(-0.33, -0.08), (-0.12, 0.12), (0.1, -0.1), (0.3, 0.08), (-0.05, -0.02)]
        # Um pouco menor que o desenho original, para caberem mais na faixa
        # estreita entre o vacúolo e a membrana.
        ESC = 0.85
        for gx, gy in posicoes:
            for j in range(6):
                d = bmesh.new()
                bmesh.ops.create_cone(d, cap_ends=True, segments=16, radius1=0.085, radius2=0.085, depth=0.018)
                mover(d, (gx, gy, -0.07 + j * 0.028))
                g.append(d)
        for (ax, ay), (bx, by) in zip(posicoes, posicoes[1:]):  # lamelas ligando os grana
            for z in (-0.04, 0.02):
                lam = bmesh.new()
                bmesh.ops.create_cube(lam, size=1.0)
                comp = math.hypot(bx - ax, by - ay)
                escalar(lam, (comp, 0.035, 0.008))
                ang = math.atan2(by - ay, bx - ax)
                mover(lam, ((ax + bx) / 2, (ay + by) / 2, z), Quaternion(Vector((0, 0, 1)), ang))
                g.append(lam)
        gb = juntar(g)
        for b in (ext, inn, est, gb):
            escalar(b, (ESC, ESC, ESC))
            mover(b, c, q)
        cascas += [ext, inn]
        estromas.append(est)
        grana.append(gb)
    # Levemente translúcido: os grana aparecem por dentro mesmo sem corte.
    novo("cloroplasto", juntar(cascas), mat("Cloroplasto", "#4c9c3c", rough=0.38, sss=0.2, coat=0.3, alpha=0.62), "cloroplasto")
    novo("cloroplasto_estroma", juntar(estromas), mat("Estroma", "#a6d58a", rough=0.35, alpha=0.45), "cloroplasto")
    novo("cloroplasto_grana", juntar(grana), mat("Grana", "#1f6a24", rough=0.5, sss=0.15), "cloroplasto")


def microtubulos_corticais(rnd):
    """Na vegetal os microtúbulos correm em anéis paralelos logo abaixo da
    membrana (guiam a deposição de celulose), e não saem de um centrossomo."""
    tubos = []
    sp = lambda x: math.copysign(abs(x) ** E, x)
    for k in range(14):
        z = -0.85 + k * 0.13
        pts = []
        for i in range(40):
            t = i / 39 * 2 * math.pi * 0.92 + k * 0.4
            n = Vector((math.cos(t), math.sin(t), z)).normalized()
            pts.append(Vector((sp(n.x) * FORMA[0], sp(n.y) * FORMA[1], sp(n.z) * FORMA[2])) * 0.89)
        tubos.append(tubo(pts, 0.009, 4, 4))
    novo("citoesqueleto", juntar(tubos), mat("Microtubulo", "#a9cdbd", rough=0.6, alpha=0.7), "citoesqueleto")


def nucleo(rnd, esp):
    esp.ocupar(NC, NR + 0.05)

    def casca(r):
        b = esfera(r, 5)
        ondular(b, 0.05, 1.4, (1, 2, 1), 2)
        mover(b, NC)
        return casca_dupla(b, 0.03)

    pecas = [casca(NR), casca(NR * 0.945)]
    n = 110
    for i in range(n):
        y = 1 - 2 * (i + 0.5) / n
        rr = math.sqrt(1 - y * y)
        t = i * 2.39996
        nrm = Vector((math.cos(t) * rr, y, math.sin(t) * rr))
        b = bmesh.new()
        bmesh.ops.create_cone(b, cap_ends=False, segments=12, radius1=0.07, radius2=0.07, depth=0.085)
        casca_dupla(b, 0.022)
        mover(b, NC + nrm * NR * 0.973, Vector((0, 0, 1)).rotation_difference(nrm))
        pecas.append(b)
    novo("nucleo", juntar(pecas), mat("Carioteca", "#8f7bcb", rough=0.38, sss=0.3, coat=0.25), "nucleo")

    b = esfera(NR * 0.93, 4)
    mover(b, NC)
    novo("nucleoplasma", b, mat("Nucleoplasma", "#cdbcf2", rough=0.3, alpha=0.25), "nucleo")

    centro_ncl = NC + Vector((0.12, -0.08, 0.05))
    b = esfera(0.4, 4)
    ondular(b, 0.08, 3.2, (4, 4, 4), 3)
    ondular(b, 0.02, 13, (1, 9, 3), 2)
    mover(b, centro_ncl)
    novo("nucleolo", b, mat("Nucleolo", "#4a3a8b", rough=0.8, sss=0.1), "nucleolo")

    fios = []
    for _ in range(30):
        p = Vector([rnd.uniform(-1, 1) for _ in range(3)]).normalized() * rnd.uniform(0.2, 0.75) * NR
        pts = []
        for _ in range(20):
            pts.append(NC + p)
            p = p + Vector([rnd.uniform(-1, 1) for _ in range(3)]) * 0.2
            if p.length > NR * 0.8:
                p = p.normalized() * NR * 0.78
            d = NC + p - centro_ncl
            if d.length < 0.48:
                p = p + d.normalized() * 0.12
        fios.append(tubo(pts, 0.02, 5, 6))
    for k in range(18):
        d = Vector([rnd.uniform(-1, 1) for _ in range(3)]).normalized()
        b = esfera(0.17, 3)
        escalar(b, (1.4, 1.4, 0.5))
        ondular(b, 0.05, 6, (k, 1, 2), 2)
        mover(b, NC + d * NR * 0.855, Vector((0, 0, 1)).rotation_difference(d))
        fios.append(b)
    novo("cromatina", juntar(fios), mat("Cromatina", "#b39be8", rough=0.6, sss=0.2), "cromatina")


def reticulo_rugoso(rnd, esp):
    """Sacos achatados (cisternas) concêntricos ao núcleo, num lado dele, com
    ribossomos nas duas faces. A primeira cisterna nasce colada à carioteca:
    o RE rugoso é continuação da membrana externa do núcleo."""
    # Para trás e para baixo do núcleo: de frente, as lâminas escondiam o
    # corte da carioteca, que é o que a vista aberta existe para mostrar.
    direcao = DIR_RER.normalized()
    sacos, ribos = [], []
    pontos_ribo = []
    for i in range(5):
        r = NR * (1.14 + i * 0.15)
        b = esfera(r, 5)
        dentro_cone = lambda v: v.co.normalized().dot(direcao) > math.cos(math.radians(62 - i * 4))
        bmesh.ops.delete(b, geom=[f for f in b.faces if not all(dentro_cone(v) for v in f.verts)], context="FACES")
        bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context="VERTS")
        # ondas que fazem a lâmina parecer membrana, não casca de ovo
        for v in b.verts:
            n = v.co.normalized()
            v.co = n * (r + 0.05 * math.sin(n.x * 9 + i) * math.cos(n.z * 7))
        mover(b, NC)
        b.normal_update()
        for k, v in enumerate(b.verts):
            if k % 3 == 0:
                pontos_ribo.append((v.co.copy(), v.normal.copy()))
        casca_dupla(b, 0.05)
        sacos.append(b)
        esp.ocupar(NC + direcao * r, 0.25)
    for co, nrm in pontos_ribo:
        for lado in (1, -1):
            if rnd.random() < 0.55:
                rb = esfera(0.026, 1)
                mover(rb, co + nrm * (0.045 * lado + (0.0 if lado > 0 else -0.05)))
                ribos.append(rb)
    for k in range(5):
        esp.ocupar(NC + direcao * NR * (1.2 + 0.25 * k), 0.3)
    novo("rer", juntar(sacos + ribos), mat("RER", "#5aa6cf", rough=0.45, sss=0.25, coat=0.2), "rer")


def reticulo_liso(rnd, esp):
    base = BASE_REL.copy()
    esp.ocupar(base, 0.8)
    tubos = []
    nos = [base + Vector([rnd.uniform(-0.6, 0.6) for _ in range(3)]) for _ in range(9)]
    for i, a in enumerate(nos):
        for b in sorted(nos, key=lambda x: (x - a).length)[1:3]:
            meio = (a + b) / 2 + Vector([rnd.uniform(-0.18, 0.18) for _ in range(3)])
            tubos.append(tubo([a, meio, b], 0.055, 8, 8))
        bola = esfera(0.085, 2)
        mover(bola, a)
        tubos.append(bola)
    novo("rel", juntar(tubos), mat("REL", "#8ad3c0", rough=0.4, sss=0.25, coat=0.2), "rel")


def golgi(rnd, esp):
    """Pilha de 6 cisternas encurvadas, com as bordas DILATADAS (é ali que as
    vesículas brotam), e vesículas soltando da face trans."""
    centro = CENTRO_GOLGI.copy()
    esp.ocupar(centro, 0.95)
    rot = Vector((0, 0, 1)).rotation_difference(Vector((0.45, 0.35, 0.82)).normalized())
    pecas = []
    for i in range(6):
        comp = 0.82 - abs(i - 2.5) * 0.08
        b = uvesfera(1.0, 40, 16)
        for v in b.verts:
            x, y, z = v.co
            borda = (x * x + y * y)
            # achata, alarga a borda e encurva (z cresce com x²)
            v.co = Vector((x * comp, y * comp * 0.42, z * (0.035 + 0.06 * borda ** 3) + 0.42 * (x * comp) ** 2))
        mover(b, (0, 0, i * 0.14 - 0.35))
        pecas.append(b)
    for k in range(20):
        lado = 1 if k % 2 else -1
        b = esfera(rnd.uniform(0.05, 0.085), 2)
        x = lado * rnd.uniform(0.7, 1.05)
        mover(b, (x, rnd.uniform(-0.3, 0.3), 0.42 * x * x + rnd.uniform(-0.3, 0.45)))
        pecas.append(b)
    alvo = juntar(pecas)
    mover(alvo, centro, rot)
    novo("golgi", alvo, mat("Golgi", "#eab04a", rough=0.4, sss=0.3, coat=0.25), "golgi")


def mitocondrias(rnd, esp):
    """Membrana externa lisa, membrana interna dobrada em cristas (placas que
    saem alternadamente de cada lado), matriz por dentro. As cristas só
    aparecem quando a mitocôndria é cortada — como no livro."""
    pecas, matriz_l, cristas_l, dna_l = [], [], [], []
    rg = random.Random(11)
    for c in esp.sortear(8, 0.6, folga=0.2):
        comp = rnd.uniform(0.5, 0.68)
        q = aleatoria(rnd)
        ext = uvesfera(1.0, 32, 16)
        escalar(ext, (comp, 0.25, 0.25))
        ondular(ext, 0.02, 3, (c.x, c.y, c.z), 2)
        inn = uvesfera(1.0, 32, 16)
        escalar(inn, (comp - 0.05, 0.195, 0.195))  # folga = espaço intermembranas
        casca_dupla(ext, 0.018)
        casca_dupla(inn, 0.015)
        cr = []
        n = int(comp * 14)
        for j in range(n):
            x = -comp + 0.1 + j * (2 * comp - 0.2) / max(n - 1, 1)
            lado = 1 if j % 2 else -1
            # Placa larga que parte da parede e passa do meio: é o "pente"
            # alternado que o livro desenha.
            placa = uvesfera(1.0, 16, 8)
            escalar(placa, (0.022, 0.15, 0.19))
            mover(placa, (x, lado * 0.06, 0))
            cr.append(placa)
        cristas = juntar(cr)
        for b in (ext, inn, cristas):
            mover(b, c, q)
        mz = uvesfera(1.0, 24, 12)
        escalar(mz, (comp - 0.07, 0.178, 0.178))
        mover(mz, c, q)
        pecas += [ext, inn]
        cristas_l.append(cristas)
        matriz_l.append(mz)
        # Na matriz: o DNA próprio (anel) e grânulos densos, entre as cristas.
        for j in range(2):
            x0 = -comp * 0.5 + j * comp
            anel = [Vector((x0 + 0.05 * math.cos(a), 0.05 * math.sin(a) + 0.07 * (1 if j else -1),
                            0.02 * math.sin(3 * a))) for a in (k * 2 * math.pi / 8 for k in range(8))]
            d = tubo(anel, 0.005, 4, 4, ciclico=True)
            mover(d, c, q)
            dna_l.append(d)
        for _ in range(4):  # sorteio à parte: não mexe no lugar das outras organelas
            g = esfera(0.016, 1)
            mover(g, c + q @ Vector((rg.uniform(-comp * 0.7, comp * 0.7), rg.uniform(-0.1, 0.1), rg.uniform(-0.1, 0.1))))
            dna_l.append(g)
    novo("mitocondria", juntar(pecas), mat("Mitocondria", "#dc6a4c", rough=0.42, sss=0.3, coat=0.3), "mitocondria")
    novo("mitocondria_dna", juntar(dna_l), mat("DNAMito", "#1f6f8b", rough=0.5), "mitocondria")
    novo("mitocondria_cristas", juntar(cristas_l), mat("Cristas", "#f2a582", rough=0.5, sss=0.2), "mitocondria")
    novo("mitocondria_matriz", juntar(matriz_l), mat("Matriz", "#f6c3a6", rough=0.4, alpha=0.45), "mitocondria")


def lisossomos_e_peroxissomos(rnd, esp):
    lis = []
    for c in esp.sortear(6, 0.2):
        r = rnd.uniform(0.15, 0.21)
        b = esfera(r, 3)
        ondular(b, 0.02, 6, (c.x, 0, c.z), 2)
        mover(b, c)
        lis.append(b)
        for _ in range(5):  # conteúdo granuloso em digestão
            g = esfera(r * 0.22, 1)
            mover(g, c + Vector([rnd.uniform(-1, 1) for _ in range(3)]).normalized() * r * 0.45)
            lis.append(g)
    novo("lisossomo", juntar(lis), mat("Lisossomo", "#ae78d8", rough=0.35, sss=0.3, coat=0.3), "lisossomo")

    peroxissomos(rnd, esp)


def peroxissomos(rnd, esp):
    per, nucleos = [], []
    for c in esp.sortear(4, 0.16):
        b = esfera(0.15, 3)
        mover(b, c)
        casca_dupla(b, 0.012)
        per.append(b)
        k = bmesh.new()
        bmesh.ops.create_cube(k, size=0.1)
        mover(k, c, aleatoria(rnd))
        nucleos.append(k)
    novo("peroxissomo", juntar(per), mat("Peroxissomo", "#9cc350", rough=0.35, sss=0.25, alpha=0.75), "peroxissomo")
    novo("peroxissomo_cristal", juntar(nucleos), mat("Cristaloide", "#4f7a1f", rough=0.3), "peroxissomo")


def centrossomo_e_microtubulos(rnd, esp):
    """Dois centríolos perpendiculares, cada um com 9 TRIOS de microtúbulos
    (a contagem que a prova cobra), e microtúbulos irradiando do centrossomo."""
    esp.ocupar(CENTROSSOMO, 0.45)
    pecas = []
    for k, eixo in enumerate((Vector((0, 0, 1)), Vector((1, 0, 0)))):
        q = Vector((0, 0, 1)).rotation_difference(eixo)
        desloc = Vector((0, 0, 0)) if k == 0 else Vector((0.05, 0, 0.28))
        for i in range(9):
            a = i * 2 * math.pi / 9
            for j in range(3):
                b = bmesh.new()
                bmesh.ops.create_cone(b, cap_ends=True, segments=8, radius1=0.017, radius2=0.017, depth=0.42)
                # o trio é inclinado como uma pá de catavento
                rr = 0.11 + j * 0.028
                pos = Vector((math.cos(a + j * 0.18) * rr, math.sin(a + j * 0.18) * rr, 0))
                mover(b, CENTROSSOMO + desloc + q @ pos, q)
                pecas.append(b)
    novo("centriolos", juntar(pecas), mat("Centriolo", "#3aa07a", rough=0.35, coat=0.3), "centriolos")

    tubos = []
    for i in range(30):
        d = Vector([rnd.uniform(-1, 1) for _ in range(3)]).normalized()
        pts = [CENTROSSOMO + d * 0.3]
        p = pts[0].copy()
        for _ in range(6):
            d = (d + Vector([rnd.uniform(-0.3, 0.3) for _ in range(3)])).normalized()
            p = p + d * 0.55
            if not dentro(p, 0.18):
                break
            if (p - NC).length < NR + 0.1:
                p = NC + (p - NC).normalized() * (NR + 0.12)
            pts.append(p.copy())
        if len(pts) >= 3:
            tubos.append(tubo(pts, 0.007, 8, 4))
    # Discreto de propósito: é a armação da célula, não a estrela da cena.
    novo("citoesqueleto", juntar(tubos), mat("Microtubulo", "#a9cdbd", rough=0.6, alpha=0.7), "citoesqueleto")


def ribossomos_livres(rnd, esp):
    pecas = []
    n = 0
    for _ in range(9000):
        if n >= 520:
            break
        p = Vector([rnd.uniform(-f, f) for f in FORMA])
        if not dentro(p, 0.22) or no_vacuolo(p, 0.05) or (p - NC).length < NR + 0.12 or not esp.livre(p, 0.02):
            continue
        if rnd.random() < 0.15:  # polissomo: colar de ribossomos lendo o mesmo RNA
            d = Vector([rnd.uniform(-1, 1) for _ in range(3)]).normalized()
            for j in range(7):
                q = esfera(0.03, 1)
                mover(q, p + d * j * 0.07 + Vector((0, 0, 0.04 * math.sin(j))))
                pecas.append(q)
            n += 7
        else:
            q = esfera(0.03, 1)
            mover(q, p)
            pecas.append(q)
            n += 1
    novo("ribossomo", juntar(pecas), mat("Ribossomo", "#2c5d8f", rough=0.5), "ribossomo")


def vesiculas(rnd, esp):
    pecas = []
    for c in esp.sortear(16, 0.1, folga=0.15):
        b = esfera(rnd.uniform(0.07, 0.11), 2)
        mover(b, c)
        casca_dupla(b, 0.012)
        pecas.append(b)
    novo("vesiculas", juntar(pecas), mat("Vesicula", "#f3cf78", rough=0.3, sss=0.2, alpha=0.85), "vesiculas")


# ----------------------------------------------------------------- estúdio e prévia

def estudio():
    sc = bpy.context.scene
    aux = bpy.data.collections["Estudio"]
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.resolution_x, sc.render.resolution_y = 1400, 900
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Medium High Contrast"
    sc.eevee.taa_render_samples = 32
    w = bpy.data.worlds.get("CelulaMundo") or bpy.data.worlds.new("CelulaMundo")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.05, 0.055, 0.07, 1)
    bg.inputs["Strength"].default_value = 1.0
    sc.world = w

    def luz(nome, loc, energia, tam, cor):
        ob = bpy.data.objects.get(nome)
        if not ob:
            ob = bpy.data.objects.new(nome, bpy.data.lights.new(nome, "AREA"))
            aux.objects.link(ob)
        ob.location = loc
        ob.data.energy = energia
        ob.data.size = tam
        ob.data.color = cor
        ob.rotation_euler = (-Vector(loc)).to_track_quat("-Z", "Y").to_euler()

    luz("Chave", (6, -7, 7), 1600, 6, (1, 0.96, 0.92))
    luz("Recheio", (-8, -4, 2), 450, 8, (0.85, 0.9, 1))
    luz("Recorte", (0, 8, 5), 800, 5, (0.95, 0.9, 1))
    cam = bpy.data.objects.get("CamCelula")
    if not cam:
        cam = bpy.data.objects.new("CamCelula", bpy.data.cameras.new("CamCelula"))
        aux.objects.link(cam)
    cam.location = (9.0, -11.0, 6.2)
    cam.rotation_euler = (Vector((-0.2, 0.3, -0.2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam.data.lens = 50
    sc.camera = cam


def previa_corte(ligar=True):
    """Corte em cunha NO MATERIAL, só para a prévia: a região x>0 e y<0 (o
    quadrante virado para a câmera) fica transparente, e o avesso das
    superfícies ganha um tom mais escuro, que é o que lê como "corte".
    Nenhuma malha é recortada: o recorte por boolean derrubou o Blender."""
    for m in bpy.data.materials:
        if "cor" not in m.keys():
            continue
        nt = m.node_tree
        bsdf = nt.nodes["Principled BSDF"]
        saida = nt.nodes["Material Output"]
        for n in [n for n in nt.nodes if n.name.startswith("corte_")]:
            nt.nodes.remove(n)
        nt.links.new(bsdf.outputs[0], saida.inputs[0])
        if not ligar:
            continue
        geo = nt.nodes.new("ShaderNodeNewGeometry"); geo.name = "corte_geo"
        sep = nt.nodes.new("ShaderNodeSeparateXYZ"); sep.name = "corte_sep"
        gx = nt.nodes.new("ShaderNodeMath"); gx.name = "corte_gx"; gx.operation = "GREATER_THAN"; gx.inputs[1].default_value = 0.0
        ly = nt.nodes.new("ShaderNodeMath"); ly.name = "corte_ly"; ly.operation = "LESS_THAN"; ly.inputs[1].default_value = 0.0
        mul = nt.nodes.new("ShaderNodeMath"); mul.name = "corte_mul"; mul.operation = "MULTIPLY"
        tr = nt.nodes.new("ShaderNodeBsdfTransparent"); tr.name = "corte_tr"
        mix = nt.nodes.new("ShaderNodeMixShader"); mix.name = "corte_mix"
        nt.links.new(geo.outputs["Position"], sep.inputs[0])
        nt.links.new(sep.outputs["X"], gx.inputs[0])
        nt.links.new(sep.outputs["Y"], ly.inputs[0])
        nt.links.new(gx.outputs[0], mul.inputs[0])
        nt.links.new(ly.outputs[0], mul.inputs[1])
        nt.links.new(mul.outputs[0], mix.inputs[0])
        nt.links.new(bsdf.outputs[0], mix.inputs[1])
        nt.links.new(tr.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], saida.inputs[0])
        m.surface_render_method = "DITHERED"


# ----------------------------------------------------------------- tudo

VARIANTES = {
    "animal": dict(
        FORMA=(3.2, 3.0, 2.55), E=1.0, NC=Vector((-0.05, 0.12, 0.15)), NR=1.08,
        VAC=None, DIR_RER=Vector((-0.35, 0.75, -0.55)),
        BASE_REL=Vector((-1.55, -1.05, -0.7)), CENTRO_GOLGI=Vector((1.45, 1.15, -0.35)),
    ),
    # Vegetal madura: caixa de cantos arredondados, vacúolo enorme no meio e
    # o núcleo empurrado para a borda. O núcleo fica ATRAVESSADO pelo plano
    # x=0, para o corte (x>0, y<0) abri-lo ao meio; inteiro dentro da cunha,
    # ele sumia junto com ela (achado na primeira prévia). Golgi e RE liso
    # vão para o fundo (y>0), que é o que se vê pela abertura.
    "vegetal": dict(
        FORMA=(3.7, 2.7, 2.35), E=0.45, NC=Vector((-0.25, -1.62, 0.3)), NR=0.78,
        VAC=(Vector((-0.35, 0.5, -0.05)), (2.2, 1.3, 1.45)),
        DIR_RER=Vector((-0.85, -0.1, -0.5)),
        BASE_REL=Vector((-2.65, 1.45, -0.85)), CENTRO_GOLGI=Vector((2.45, 1.55, -0.5)),
    ),
}


def construir(variante="animal", semente=7):
    global FORMA, E, NC, NR, VAC, DIR_RER, BASE_REL, CENTRO_GOLGI
    v = VARIANTES[variante]
    FORMA, E, NC, NR, VAC = v["FORMA"], v["E"], v["NC"], v["NR"], v["VAC"]
    DIR_RER, BASE_REL, CENTRO_GOLGI = v["DIR_RER"], v["BASE_REL"], v["CENTRO_GOLGI"]
    vegetal = variante == "vegetal"
    cena()
    col = colecao()
    for ob in list(col.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    rnd = random.Random(semente)
    esp = Espaco(rnd)
    if vegetal:
        parede()
    membrana_e_citoplasma(vegetal)
    if vegetal:
        vacuolo()
    nucleo(rnd, esp)
    reticulo_rugoso(rnd, esp)
    reticulo_liso(rnd, esp)
    golgi(rnd, esp)
    if vegetal:
        microtubulos_corticais(rnd)
        cloroplastos(rnd, esp)
    else:
        centrossomo_e_microtubulos(rnd, esp)
    mitocondrias(rnd, esp)
    if vegetal:
        peroxissomos(rnd, esp)
    else:
        lisossomos_e_peroxissomos(rnd, esp)
    vesiculas(rnd, esp)
    ribossomos_livres(rnd, esp)
    estudio()
    for me in [m for m in bpy.data.meshes if m.users == 0]:
        bpy.data.meshes.remove(me)
    return {o.name: len(o.data.polygons) for o in col.objects}


# ----------------------------------------------------------------- lupas
#
# Duas vistas AMPLIADAS, cada uma num .glb próprio. Na célula inteira a
# membrana tem ~0,1 de espessura num objeto de ~6: fosfolipídio por
# fosfolipídio, ninguém veria. Os livros resolvem com um quadro "de lupa" ao
# lado da célula; aqui é o mesmo, em 3D.

def _limpar_colecao():
    cena()
    for ob in list(colecao().objects):
        bpy.data.objects.remove(ob, do_unlink=True)


def _bastao(a, b, r, lados=8):
    """Cilindro de a até b (as caudas, as hélices, os pedúnculos)."""
    a, b = Vector(a), Vector(b)
    d = b - a
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=lados, radius1=r, radius2=r, depth=d.length)
    mover(bm, (a + b) / 2, Vector((0, 0, 1)).rotation_difference(d.normalized()))
    return bm


def _contas(pontos, r, sub=1):
    """Contas de colar: cadeias de açúcar, íons, ribossomos."""
    out = []
    for p in pontos:
        s = esfera(r, sub)
        mover(s, p)
        out.append(s)
    return out


def _fim_da_lupa(cam_loc, alvo=(0, 0, 0)):
    estudio()
    cam = bpy.data.objects["CamCelula"]
    cam.location = cam_loc
    cam.rotation_euler = (Vector(alvo) - cam.location).to_track_quat("-Z", "Y").to_euler()
    for me in [m for m in bpy.data.meshes if m.users == 0]:
        bpy.data.meshes.remove(me)
    return {o.name: len(o.data.polygons) for o in colecao().objects}


def lupa_membrana(semente=5):
    """Mosaico fluido: um retalho de membrana visto de lado e de cima.
    +z é o lado de FORA da célula (onde fica o glicocálix); -z, o citosol."""
    _limpar_colecao()
    rnd = random.Random(semente)
    LX, LY = 3.4, 2.2           # meio-tamanho do retalho
    H = 0.5                     # altura das cabeças em relação ao meio da bicamada
    onda = lambda x, y: 0.14 * math.sin(0.62 * x + 0.4) + 0.08 * math.cos(0.85 * y)

    # Onde ficam as proteínas: os fosfolipídios abrem espaço para elas.
    integrais = [(-1.9, 0.6, 0.5), (0.45, -0.9, 0.55), (2.3, 0.9, 0.45)]
    canal = (-0.4, 1.1, 0.38)
    helices = (1.25, -0.05)
    perifericas = [(0.45, -0.9), (-1.2, -1.2)]
    ocupados = [(x, y, r + 0.05) for x, y, r in integrais] + [(canal[0], canal[1], canal[2] + 0.05), (*helices, 0.42)]
    livre = lambda x, y: all((x - a) ** 2 + (y - b) ** 2 > r * r for a, b, r in ocupados)

    cabecas, caudas, glicolip_cab, chol = [], [], [], []
    acucar_lip = []
    passo = 0.25
    nx, ny = int(2 * LX / passo), int(2 * LY / (passo * 0.87))
    for lado in (1, -1):        # camada externa (+1) e interna (-1)
        for i in range(nx + 1):
            for j in range(ny + 1):
                x = -LX + i * passo + rnd.uniform(-0.04, 0.04) + (passo / 2 if j % 2 else 0)
                y = -LY + j * passo * 0.87 + rnd.uniform(-0.04, 0.04)
                if abs(x) > LX or abs(y) > LY or not livre(x, y):
                    continue
                z0 = onda(x, y)
                topo = Vector((x, y, z0 + lado * H))
                # Colesterol: rígido, entre as caudas, com a "cabeça" (OH)
                # na altura das cabeças dos fosfolipídios.
                if rnd.random() < 0.09:
                    c = topo - Vector((0, 0, lado * 0.12))
                    chol.append(_bastao(c, c - Vector((0, 0, lado * 0.26)), 0.045, 6))
                    s = esfera(0.045, 1)
                    mover(s, topo - Vector((0, 0, lado * 0.06)))
                    chol.append(s)
                    continue
                glico = lado == 1 and rnd.random() < 0.035
                s = esfera(0.1, 2)
                mover(s, topo)
                (glicolip_cab if glico else cabecas).append(s)
                # Duas caudas; uma delas com a "dobra" da ligação dupla
                # (insaturada), que é o que deixa a membrana fluida.
                for k, dx in enumerate((-0.045, 0.045)):
                    a = topo + Vector((dx, 0, -lado * 0.08))
                    if k == 1 and rnd.random() < 0.5:
                        m = a + Vector((0, 0, -lado * 0.2))
                        b = m + Vector((dx * 1.6, 0.04, -lado * 0.18))
                        caudas += [_bastao(a, m, 0.022, 5), _bastao(m, b, 0.022, 5)]
                    else:
                        caudas.append(_bastao(a, a + Vector((rnd.uniform(-0.02, 0.02), 0, -lado * 0.38)), 0.022, 5))
                if glico:
                    p, d = topo + Vector((0, 0, 0.12)), Vector((0, 0, 1))
                    cadeia = []
                    for _ in range(rnd.randint(3, 5)):
                        d = (d + Vector((rnd.uniform(-0.4, 0.4), rnd.uniform(-0.4, 0.4), 0))).normalized()
                        p = p + d * 0.13
                        cadeia.append(p.copy())
                    acucar_lip += _contas(cadeia, 0.06)

    cab = mat("Lupa_cabeca", "#e7798d", rough=0.35, sss=0.2, coat=0.3)
    novo("fosfolipidio_cabecas", juntar(cabecas), cab, "fosfolipidio")
    novo("fosfolipidio_caudas", juntar(caudas), mat("Lupa_cauda", "#f5d784", rough=0.5), "fosfolipidio")
    novo("colesterol", juntar(chol), mat("Colesterol", "#5d6b8f", rough=0.35, coat=0.2), "colesterol")
    novo("glicolipidio_cabecas", juntar(glicolip_cab), cab, "glicolipidio")
    novo("glicolipidio_acucar", juntar(acucar_lip), mat("Glicolipidio", "#c7d64a", rough=0.45), "glicolipidio")

    # Proteínas integrais globulares: atravessam as duas camadas.
    integ, acucar_prot = [], []
    for k, (x, y, r) in enumerate(integrais):
        b = esfera(1.0, 4)
        escalar(b, (r, r * 0.85, 0.82))
        ondular(b, 0.07, 2.2, (x, y, k), 3)
        mover(b, (x, y, onda(x, y) + 0.05))
        integ.append(b)
        if k != 1:  # glicoproteína: cadeia de açúcar ramificada, do lado de fora
            base = Vector((x, y, onda(x, y) + 0.85))
            tronco = [base + Vector((0.03 * t, 0, 0.13 * t)) for t in range(5)]
            ramos = []
            for sgn in (1, -1):
                q = tronco[2]
                for t in range(1, 4):
                    ramos.append(q + Vector((sgn * 0.12 * t, 0.05 * t, 0.07 * t)))
            q = tronco[4]
            ramos += [q + Vector((-0.11 * t, -0.06 * t, 0.06 * t)) for t in range(1, 3)]
            acucar_prot += _contas(tronco + ramos, 0.065)
    # Proteína em hélices: 7 bastões inclinados em roda, o jeito como os
    # livros desenham as α-hélices que cruzam a membrana.
    for i in range(7):
        a = i * 2 * math.pi / 7
        c = Vector((helices[0] + 0.24 * math.cos(a), helices[1] + 0.24 * math.sin(a), onda(*helices)))
        inc = Vector((0.12 * math.cos(a + 1.2), 0.12 * math.sin(a + 1.2), 0))
        integ.append(_bastao(c - inc - Vector((0, 0, 0.72)), c + inc + Vector((0, 0, 0.72)), 0.085, 10))
    novo("proteina_integral", juntar(integ), mat("ProteinaIntegral", "#4a90d9", rough=0.4, sss=0.2, coat=0.25), "proteina_integral")
    novo("glicoproteina", juntar(acucar_prot), mat("Glicoproteina", "#f0a33a", rough=0.45), "glicoproteina")

    # Proteína canal: um anel de subunidades com um poro no meio, e
    # partículas (água/íons) passando por ele.
    can = []
    cx, cy, _ = canal
    for i in range(6):
        a = i * 2 * math.pi / 6
        b = esfera(1.0, 3)
        escalar(b, (0.14, 0.14, 0.78))
        ondular(b, 0.02, 4, (i, 0, 0), 2)
        mover(b, (cx + 0.24 * math.cos(a), cy + 0.24 * math.sin(a), onda(cx, cy)))
        can.append(b)
    ions = _contas([Vector((cx, cy, onda(cx, cy) + z)) for z in (-1.0, -0.35, 0.3, 0.95)], 0.07, 2)
    novo("proteina_canal", juntar(can), mat("ProteinaCanal", "#2bb3a3", rough=0.4, sss=0.2, coat=0.25), "proteina_canal")
    novo("proteina_canal_ions", juntar(ions), mat("Ions", "#e8f4ff", rough=0.2, coat=0.5), "proteina_canal")

    # Periféricas: encostadas na face de DENTRO, sem atravessar.
    per = []
    for k, (x, y) in enumerate(perifericas):
        b = esfera(1.0, 3)
        escalar(b, (0.3, 0.24, 0.17))
        ondular(b, 0.04, 3, (k, 5, 1), 2)
        mover(b, (x + 0.15, y - 0.1, onda(x, y) - H - 0.3 - (0.25 if k == 0 else 0)))
        per.append(b)
    novo("proteina_periferica", juntar(per), mat("ProteinaPeriferica", "#9b6fd1", rough=0.4, sss=0.2, coat=0.25), "proteina_periferica")

    # Citoesqueleto logo abaixo: filamentos de actina.
    fil = []
    for k, y in enumerate((-1.3, 0.2, 1.4)):
        pts = [Vector((x, y + 0.15 * math.sin(x * 1.3 + k), onda(x, y) - H - 0.75 - 0.05 * k))
               for x in [-LX + 0.2 + t * 0.6 for t in range(12)]]
        fil.append(tubo(pts, 0.05, 8, 6))
    novo("filamentos", juntar(fil), mat("Filamento", "#7fb38f", rough=0.5), "filamentos")

    return _fim_da_lupa((6.0, -7.5, 4.2), (0, 0, -0.1))


def lupa_mitocondria(semente=9):
    """Uma mitocôndria grande, EM PÉ (eixo maior em z). O visualizador gira
    o modelo em torno da vertical e o corte em cunha também é vertical: em
    pé, a abertura pega sempre o comprimento inteiro (deitada, ficava de
    ponta para a câmera a cada meia volta).

    De fora para dentro: membrana externa (lisa, com porinas) → espaço
    intermembranas → membrana interna, dobrada em cristas cobertas de ATP
    sintases → matriz, com DNA circular, ribossomos e grânulos."""
    _limpar_colecao()
    rnd = random.Random(semente)
    R, L = 1.25, 2.6            # raio e meio-comprimento da membrana externa
    RI, LI = 1.08, 2.42         # membrana interna
    raio_em = lambda z, r, l: r * math.sqrt(max(0.0, 1 - (z / l) ** 2))

    def capsula(r, l, seg=48, aneis=32):
        b = uvesfera(1.0, seg, aneis)
        escalar(b, (r, r, l))
        return b

    ext = capsula(R, L)
    ondular(ext, 0.03, 1.2, (1, 2, 3), 2)
    casca_dupla(ext, 0.07)
    novo("membrana_externa", ext, mat("MitoExterna", "#dc6a4c", rough=0.42, sss=0.3, coat=0.3), "membrana_externa")

    # Porinas: canais que furam a membrana externa (deixam passar moléculas
    # pequenas — por isso o espaço intermembranas parece com o citosol).
    por = []
    for _ in range(70):
        d = Vector([rnd.uniform(-1, 1) for _ in range(3)])
        if d.length < 0.2:
            continue
        d.normalize()
        p = Vector((d.x * R, d.y * R, d.z * L))
        n = Vector((d.x / R, d.y / R, d.z / L)).normalized()
        b = bmesh.new()
        bmesh.ops.create_cone(b, cap_ends=False, segments=10, radius1=0.07, radius2=0.07, depth=0.14)
        casca_dupla(b, 0.03)
        mover(b, p - n * 0.03, Vector((0, 0, 1)).rotation_difference(n))
        por.append(b)
    novo("porina", juntar(por), mat("Porina", "#8e2f1f", rough=0.4, coat=0.2), "porina")

    ims = capsula((R + RI) / 2 - 0.02, (L + LI) / 2 - 0.02, 32, 20)
    novo("espaco_intermembranas", ims, mat("Intermembranas", "#fbe3d6", rough=0.3, alpha=0.18), "espaco_intermembranas")

    inn = capsula(RI, LI)
    casca_dupla(inn, 0.06)
    novo("membrana_interna", inn, mat("MitoInterna", "#e8875a", rough=0.42, sss=0.3, coat=0.3), "membrana_interna")

    # Cristas: lâminas que saem da membrana interna, alternando os lados, e
    # passam do meio. Cada uma acompanha a largura da cápsula na sua altura.
    cristas, atp, zs = [], [], []
    n = 11
    for k in range(n):
        z = -LI * 0.82 + k * (2 * LI * 0.82) / (n - 1)
        zs.append(z)
        lado = 1 if k % 2 else -1
        rz = raio_em(z, RI, LI) - 0.04
        comp = rz * 1.45                     # da parede até além do meio
        larg = rz * 0.92
        b = uvesfera(1.0, 32, 12)
        escalar(b, (comp / 2, larg, 0.07))
        ondular(b, 0.02, 3, (k, 0, 0), 2)
        cx = lado * (rz - comp / 2)
        mover(b, (cx, 0, z))
        cristas.append(b)
        # ATP sintases nas duas faces da crista, viradas para a matriz:
        # o "pirulito" (pedúnculo + cabeça).
        for _ in range(26):
            u, v = rnd.uniform(-0.85, 0.85), rnd.uniform(-0.85, 0.85)
            if u * u + v * v > 0.72:
                continue
            x, y = cx + u * comp / 2, v * larg
            for f in (1, -1):
                z0 = z + f * 0.06
                atp.append(_bastao((x, y, z0), (x, y, z0 + f * 0.09), 0.018, 5))
                s = esfera(0.05, 1)
                mover(s, (x, y, z0 + f * 0.13))
                atp.append(s)
    novo("cristas", juntar(cristas), mat("Cristas", "#f2a582", rough=0.45, sss=0.25, coat=0.2), "cristas")
    novo("atp_sintase", juntar(atp), mat("ATPsintase", "#8e5bd0", rough=0.4, coat=0.25), "atp_sintase")

    mz = capsula(RI - 0.07, LI - 0.07, 32, 20)
    novo("matriz", mz, mat("Matriz", "#f6c3a6", rough=0.4, alpha=0.28), "matriz")

    # No meio do caminho entre duas cristas: DNA circular, ribossomos e
    # grânulos. Assim nada atravessa as lâminas.
    meios = [(zs[i] + zs[i + 1]) / 2 for i in range(len(zs) - 1)]
    dna, ribo, gran = [], [], []
    for i, z in enumerate(meios):
        rz = raio_em(z, RI, LI) - 0.25
        if i % 3 == 1:
            c = Vector((rnd.uniform(-0.3, 0.3), rnd.uniform(-0.3, 0.3), z))
            anel = [c + Vector((0.32 * math.cos(a) + 0.05 * math.sin(5 * a), 0.24 * math.sin(a), 0.035 * math.sin(4 * a)))
                    for a in (t * 2 * math.pi / 14 for t in range(14))]
            dna.append(tubo(anel, 0.022, 6, 6, ciclico=True))
        for _ in range(7):
            a, r = rnd.uniform(0, 2 * math.pi), rnd.uniform(0.1, rz)
            ribo += _contas([Vector((r * math.cos(a), r * math.sin(a), z + rnd.uniform(-0.03, 0.03)))], 0.055, 1)
        if i % 2 == 0:
            a, r = rnd.uniform(0, 2 * math.pi), rnd.uniform(0.1, rz)
            gran += _contas([Vector((r * math.cos(a), r * math.sin(a), z))], 0.09, 2)
    novo("dna_mito", juntar(dna), mat("DNAMito", "#1f6f8b", rough=0.45, coat=0.2), "dna_mito")
    novo("ribossomo_mito", juntar(ribo), mat("RibossomoMito", "#2c5d8f", rough=0.5), "ribossomo_mito")
    novo("granulos", juntar(gran), mat("Granulo", "#4a2f24", rough=0.35, coat=0.3), "granulos")

    return _fim_da_lupa((6.5, -6.5, 2.5), (0, 0, 0))


# ----------------------------------------------------------------- exportar

def exportar(caminho):
    """Exporta a coleção Celula como .glb (Draco), com `parte` em extras."""
    previa_corte(False)
    # Só a coleção Celula: com `use_selection`, o cubo padrão do arquivo
    # novo do Blender entrava junto em todo .glb.
    vl = bpy.context.view_layer
    vl.active_layer_collection = vl.layer_collection.children["Celula"]
    bpy.ops.export_scene.gltf(
        filepath=caminho, export_format="GLB", use_active_collection=True, use_active_scene=True,
        export_extras=True, export_yup=True, export_apply=True,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
        export_draco_position_quantization=13, export_draco_normal_quantization=9,
        export_texcoords=False, export_cameras=False, export_lights=False,
    )


def exportar_tudo(pasta):
    """As quatro vistas do visualizador: celula-<id>.glb."""
    feitos = {}
    for nome, fazer in (
        ("animal", lambda: construir("animal")),
        ("vegetal", lambda: construir("vegetal")),
        ("lupa_membrana", lupa_membrana),
        ("lupa_mitocondria", lupa_mitocondria),
    ):
        fazer()
        exportar(f"{pasta}/celula-{nome}.glb")
        feitos[nome] = sum(len(o.data.polygons) for o in colecao().objects)
    return feitos
