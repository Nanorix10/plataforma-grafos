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


def tubo(pontos, raio, res=6, lados=6):
    """Curva suave com espessura, devolvida como malha."""
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
    sp.use_endpoint_u = True
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

def membrana_e_citoplasma(vegetal=False):
    # Na vegetal a membrana fica colada por DENTRO da parede, e é lisa: quem
    # dá a forma é a parede. Na animal ela é livre, e ondula.
    esc = 0.93 if vegetal else 1.0
    amp = 0.05 if vegetal else 0.22
    bm = esfera(1.0, 6)
    superficie(bm, esc)
    ondular(bm, amp, 0.45, (3.1, 1.7, 0.2), 3)
    ondular(bm, 0.03, 2.4, (8, 2, 5), 2)
    casca_dupla(bm, 0.07 if vegetal else 0.09)
    novo("membrana", bm, mat("Membrana", "#e9a9b8", rough=0.4, sss=0.35, coat=0.3, sheen=0.25), "membrana")

    bm = esfera(1.0, 4)
    superficie(bm, esc * 0.96)
    ondular(bm, amp, 0.45, (3.1, 1.7, 0.2), 3)
    novo("citoplasma", bm, mat("Citoplasma", "#f7dfcc", rough=0.3, alpha=0.16), "citoplasma")


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
    pecas, matriz_l, cristas_l = [], [], []
    for c in esp.sortear(8, 0.6, folga=0.2):
        comp = rnd.uniform(0.5, 0.68)
        q = aleatoria(rnd)
        ext = uvesfera(1.0, 32, 16)
        escalar(ext, (comp, 0.25, 0.25))
        ondular(ext, 0.02, 3, (c.x, c.y, c.z), 2)
        inn = uvesfera(1.0, 32, 16)
        escalar(inn, (comp - 0.04, 0.21, 0.21))
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
        escalar(mz, (comp - 0.06, 0.19, 0.19))
        mover(mz, c, q)
        pecas += [ext, inn]
        cristas_l.append(cristas)
        matriz_l.append(mz)
    novo("mitocondria", juntar(pecas), mat("Mitocondria", "#dc6a4c", rough=0.42, sss=0.3, coat=0.3), "mitocondria")
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
