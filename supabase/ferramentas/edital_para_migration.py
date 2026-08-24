# -*- coding: utf-8 -*-
r"""Le um edital de conteudo programatico em .docx e devolve as linhas de
`edital_topicos` (processo, etapa, materia, ordem, texto).

Uso:
    python supabase/ferramentas/edital_para_migration.py caminho.docx --fonte passe1

## Por que este arquivo existe

O irmao dele, `docx_para_migration.py`, serve aos documentos de RESUMO do autor
e para com o texto — o HTML do `corpo` e escrito a mao porque o mapeamento e
julgamento (decisao 9c). Edital nao e assim: a saida e uma tabela de linhas
curtas, sempre a mesma forma, e o julgamento esta todo em QUAL linha entra.
Entao aqui vale automatizar ate o fim.

E edital chega todo ano. Em 2026-08-24 os tres primeiros (PASSE 1a e 2a etapa,
PAS/UEM com as tres) foram lidos a mao e cada um mordeu de um jeito diferente;
o que se aprendeu esta abaixo, para o de 2027 nao morder de novo.

## As tres armadilhas que este script resolve

1. **A hierarquia nao esta no texto.** "1.1 Formulas estruturais" e um
   paragrafo cujo texto e so "Formulas estruturais" — o "1.1" e desenhado pelo
   Word a partir de `numPr` + `numbering.xml`.

   Reconstruir esse numero foi tentado e DESCARTADO: os contadores do Word tem
   `startOverride` e `lvlRestart`, e sem imitar essa semantica inteira 44 dos
   625 itens numerados saiam com numero errado — "1.1" onde o edital diz "3.1".
   Numero errado e pior que numero nenhum, porque o aluno cita o item pelo
   numero. Tirar a numeracao do PDF tambem nao serve: so 76% das linhas tem par
   la, porque o PDF quebra dois blocos de Fisica dentro de tabelas.

   Entao o texto sai limpo e a hierarquia vai no `ilvl`, que vem direto do
   .docx e nao depende de contador nenhum. Em Literatura o `numFmt` e `bullet`
   nos poemas — la nao ha nivel a inventar.

2. **Cabecalho dentro de caixa de texto.** Em `progpas26.docx` o titulo
   "QUIMICA (ETAPA 3)" e uma caixa de texto flutuante, nao um paragrafo. Quem
   le so os paragrafos do corpo nao o ve, e os 21 topicos de quimica organica e
   eletroquimica caem debaixo de FISICA (ETAPA 3) — em silencio. O texto da
   caixa ainda aparece DUPLICADO no paragrafo-ancora, porque o .docx guarda a
   forma moderna (`Choice`) e a legada (`Fallback`) lado a lado.

3. **Nome de eixo colado no fim do item anterior.** Nos dois editais da UFMS
   alguns eixos ("MATERIA E ENERGIA", "TERRITORIO E FRONTEIRA") nao sao
   paragrafo proprio: estao grudados no fim do ultimo item do eixo anterior.
   Sao cinco casos nos dois arquivos.

## O que ele NAO faz

Nao gera SQL e nao decide materia nova. As materias sem correspondente no banco
(Lingua Inglesa, Espanhola, Francesa e Educacao Fisica) saem com `materia=None`
e cabe a quem chama descartar ou criar. Em 2026-08-24 o autor escolheu
descartar.
"""
import sys, re, zipfile, argparse
import xml.etree.ElementTree as ET

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

# Materias do edital -> slug em `materias`. None = nao existe no banco.
MAPA = {
    'LÍNGUA PORTUGUESA': 'portugues',
    'LITERATURA': 'literatura',
    'LITERATURAS EM LÍNGUA PORTUGUESA': 'literatura',
    'NÚMEROS E ÁLGEBRA': 'matematica',
    'GEOMETRIA E MEDIDAS': 'matematica',
    'PROBABILIDADE E ESTATÍSTICA': 'matematica',
    'MATEMÁTICA': 'matematica',
    'BIOLOGIA': 'biologia',
    'FÍSICA': 'fisica',
    'QUÍMICA': 'quimica',
    'FILOSOFIA': 'filosofia',
    'GEOGRAFIA': 'geografia',
    'HISTÓRIA': 'historia',
    'SOCIOLOGIA': 'sociologia',
    'ARTE': 'arte',
    'REDAÇÃO': 'redacao',
    'LÍNGUA INGLESA': None,
    'LÍNGUA ESPANHOLA': None,
    'LÍNGUA FRANCESA': None,
    'EDUCAÇÃO FÍSICA': None,
}

# Eixos estruturantes da UFMS. Nao viram topico: agrupam.
EIXOS = [
    'PROCESSOS E PRÁTICAS EM INVESTIGAÇÃO',
    'TERRITÓRIO E FRONTEIRA',
    'SOCIEDADE E NATUREZA',
    'VIDA, TERRA E COSMOS',
    'MATÉRIA E ENERGIA',
    'TEMPO E ESPAÇO',
]

AREAS = re.compile(r'^(I|II|III|IV)\s*-\s')


def _texto(p):
    """Texto do paragrafo. Se ele carrega uma caixa de texto, usa so a primeira
    copia dela — senao o titulo sai duplicado (armadilha 2)."""
    caixas = [tb for tb in p.iter() if tb.tag.split('}')[-1] == 'txbxContent']
    alvo = caixas[0] if caixas else p
    t = ''.join(n.text or '' for n in alvo.iter(W + 't'))
    return re.sub(r'\s+', ' ', t).strip()


def _formatos(z):
    """numId -> {ilvl: (numFmt, lvlText)}, resolvido por numbering.xml."""
    try:
        num = ET.fromstring(z.read('word/numbering.xml'))
    except KeyError:
        return {}
    abstrato = {}
    for a in num.findall(W + 'abstractNum'):
        d = {}
        for lv in a.findall(W + 'lvl'):
            f = lv.find(W + 'numFmt')
            t = lv.find(W + 'lvlText')
            d[int(lv.get(W + 'ilvl'))] = (
                f.get(W + 'val') if f is not None else '',
                t.get(W + 'val') if t is not None else '',
            )
        abstrato[a.get(W + 'abstractNumId')] = d
    saida = {}
    for n in num.findall(W + 'num'):
        a = n.find(W + 'abstractNumId')
        if a is not None:
            saida[n.get(W + 'numId')] = abstrato.get(a.get(W + 'val'), {})
    return saida


def paragrafos(caminho):
    """Devolve (estilo, numId, ilvl, texto, numero) por paragrafo do corpo.

    `numero` e a numeracao renderizada ("2.1.3") ou '' quando o nivel e
    marcador. Os contadores seguem a semantica do Word: subir um nivel zera os
    mais fundos.
    """
    z = zipfile.ZipFile(caminho)
    fmt = _formatos(z)
    corpo = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    contadores = {}
    for p in corpo.iter(W + 'p'):
        txt = _texto(p)
        if not txt:
            continue
        est = p.find(W + 'pPr/' + W + 'pStyle')
        est = est.get(W + 'val') if est is not None else None
        npr = p.find(W + 'pPr/' + W + 'numPr')
        numero = ''
        nid = ilvl = None
        if npr is not None:
            n = npr.find(W + 'numId')
            i = npr.find(W + 'ilvl')
            nid = n.get(W + 'val') if n is not None else None
            ilvl = int(i.get(W + 'val')) if i is not None else 0
            f, texto_nivel = fmt.get(nid, {}).get(ilvl, ('', ''))
            if f == 'decimal':
                c = contadores.setdefault(nid, {})
                c[ilvl] = c.get(ilvl, 0) + 1
                for fundo in [k for k in c if k > ilvl]:
                    del c[fundo]
                numero = texto_nivel
                for k in range(9):
                    numero = numero.replace('%%%d' % (k + 1), str(c.get(k, 1)))
        yield est, nid, ilvl, txt, numero


def _descolar(t):
    """Tira o nome de eixo grudado no fim do item (armadilha 3)."""
    for e in EIXOS:
        if t.upper().rstrip('.').endswith(e):
            corte = t.upper().rstrip('.').rfind(e)
            return t[:corte].strip().rstrip('.').strip()
    return t


def ler_passe(caminho, etapa):
    """UFMS: area e materia sao Heading1 (ou paragrafo comum, na primeira
    materia de cada area); eixo e BodyText no 296 e Heading2 no 297."""
    linhas = []
    materia = None
    comecou = False
    for est, nid, ilvl, txt, numero in paragrafos(caminho):
        limpo = txt.rstrip(':').strip()
        if 'ANEXO ÚNICO' in limpo.upper():
            comecou = True
            continue
        if not comecou:
            continue
        if AREAS.match(limpo):
            continue
        if limpo.upper() in EIXOS:
            continue
        if limpo.upper() in MAPA:
            materia = MAPA[limpo.upper()]
            continue
        if est != 'ListParagraph' or materia is None:
            continue
        t = _descolar(txt)
        if t:
            linhas.append(('passe', etapa, materia, t, ilvl or 0))
    return linhas


def ler_uem(caminho):
    """UEM: materia e Heading2 com "(ETAPA n)". A Quimica da etapa 3 nao tem
    Heading2 — o titulo dela e caixa de texto (armadilha 2) —, entao ela e
    reconhecida pelo primeiro topico, "Funcoes organicas"."""
    linhas = []
    materia = etapa = None
    for est, nid, ilvl, txt, numero in paragrafos(caminho):
        m = re.search(r'\(ETAPA (\d)\)', txt)
        if m and (est == 'Heading2' or txt.upper().startswith('QUÍMICA')):
            etapa = int(m.group(1))
            nome = re.sub(r'\s*\(ETAPA \d\)', '', txt).strip().upper()
            materia = MAPA.get(nome, '?')
            continue
        if etapa is None:
            continue
        if etapa == 3 and txt.startswith('Funções orgânicas'):
            materia = 'quimica'
        if materia in (None, '?'):
            continue
        if est in ('Heading1',):
            continue
        linhas.append(('pas-uem', etapa, materia, txt, ilvl or 0))
    return linhas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('docx')
    ap.add_argument('--fonte', required=True, choices=['passe1', 'passe2', 'uem'])
    a = ap.parse_args()
    if a.fonte == 'uem':
        linhas = ler_uem(a.docx)
    else:
        linhas = ler_passe(a.docx, 1 if a.fonte == 'passe1' else 2)
    ordem = {}
    for proc, etapa, mat, txt, nivel in linhas:
        k = (proc, etapa, mat)
        ordem[k] = ordem.get(k, 0) + 1
        print('%s\t%d\t%s\t%d\t%d\t%s' % (proc, etapa, mat, ordem[k], nivel, txt))


if __name__ == '__main__':
    main()
