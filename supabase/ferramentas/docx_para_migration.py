# -*- coding: utf-8 -*-
r"""Despeja um .docx do autor em texto estruturado, para virar migration.

Uso: `python supabase/ferramentas/docx_para_migration.py caminho.docx > saida.txt`

## Por que este arquivo existe

A decisao 9c manda migrar a partir do `.docx`, e nao do texto exportado do
Google Docs — a exportacao em texto perde formula, imagem e subscrito. Ler o
`.docx` exige um extrator, e ate 23/08 esse extrator era escrito na hora, a cada
sessao. **Isso publicou tres erros.**

O defeito: no `.docx` uma frase vem partida em varios `<w:r>`, e quando o autor
sublinha so um pedaco o espaco entre as palavras pode acabar num run marcado
sozinho — `a` + `<u> </u>` + `qualidade`. A versao descartada juntava as marcas
vizinhas com um `re.sub` que trocava `__ __` por vazio, apagando o espaco
palavras colavam: "aqualidade", "linhademontagem". Consertado na migration
`20260823200000`, e o conserto vive aqui para nao se perder de novo.

## O que a saida traz

Uma linha por paragrafo, com o numero do paragrafo e o nivel de lista:

    00042 [n2] __Termo__: definicao;
    00043 [IMG] media/image7.png

- `[n0]`..`[nN]` — nivel de recuo, que decide se o item vira titulo do resumo,
  `h2/h3/h4` corrido ou item de lista (ver o cabecalho de qualquer migration de
  importacao);
- `**negrito**`, `__sublinhado__`, `//italico//` — as tres marcas que o autor
  usa; o sublinhado e o mais importante, porque e com ele que ele marca o termo
  definido, e a exportacao em texto do Drive o perde;
- `_{sub}` e `^{sup}` para subscrito e sobrescrito de TEXTO (decisao 8b);
- `⟦...⟧` para equacao OMML ja convertida em LaTeX;
- `[TABELA]` seguida das linhas, uma celula por `|`;
- `[IMG] media/...` na ancora exata, para saber onde a figura entra.

## O que ele NAO faz

Nao gera SQL. O HTML do `corpo` continua sendo escrito a mao, porque o
mapeamento (o que vira grafo, o que vira `<strong>`, que imagem vira tabela)
e julgamento, e e justamente onde "transportar nao e reescrever" se decide.

As imagens saem com `zipfile` a parte, de `word/media/`, e vao para
`public/img/resumos/<materia>/` em WebP q82.
"""
import sys, zipfile, re
import xml.etree.ElementTree as ET

# O console do Windows abre em cp1252 e engasga no ⟦ das formulas e nos acentos.
# Forcar UTF-8 aqui evita depender de PYTHONIOENCODING no ambiente de quem roda.
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
M = '{http://schemas.openxmlformats.org/officeDocument/2006/math}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'


# ---------- OMML -> LaTeX ----------
def omml_text(e):
    return ''.join(t.text or '' for t in e.iter(M + 't'))


CONTAINERS = {M + 'oMath', M + 'oMathPara', M + 'e', M + 'num', M + 'den',
              M + 'sub', M + 'sup', M + 'lim', M + 'fName', M + 'deg'}


def omml(e):
    tag = e.tag
    if tag in CONTAINERS:
        return ''.join(omml(c) for c in e)
    if tag == M + 'r':
        return omml_text(e)
    if tag == M + 't':
        return e.text or ''
    if tag == M + 'f':
        num = e.find(M + 'num')
        den = e.find(M + 'den')
        return '\\frac{%s}{%s}' % (omml(num) if num is not None else '',
                                   omml(den) if den is not None else '')
    if tag == M + 'sSup':
        b = e.find(M + 'e')
        s = e.find(M + 'sup')
        return '{%s}^{%s}' % (omml(b) if b is not None else '',
                              omml(s) if s is not None else '')
    if tag == M + 'sSub':
        b = e.find(M + 'e')
        s = e.find(M + 'sub')
        return '{%s}_{%s}' % (omml(b) if b is not None else '',
                              omml(s) if s is not None else '')
    if tag == M + 'sSubSup':
        b = e.find(M + 'e')
        sb = e.find(M + 'sub')
        sp = e.find(M + 'sup')
        return '{%s}_{%s}^{%s}' % (omml(b) if b is not None else '',
                                   omml(sb) if sb is not None else '',
                                   omml(sp) if sp is not None else '')
    if tag == M + 'sPre':
        b = e.find(M + 'e')
        sb = e.find(M + 'sub')
        sp = e.find(M + 'sup')
        return '{}_{%s}^{%s}{%s}' % (omml(sb) if sb is not None else '',
                                     omml(sp) if sp is not None else '',
                                     omml(b) if b is not None else '')
    if tag == M + 'rad':
        deg = e.find(M + 'deg')
        b = e.find(M + 'e')
        d = omml(deg) if deg is not None else ''
        corpo = omml(b) if b is not None else ''
        return ('\\sqrt[%s]{%s}' % (d, corpo)) if d else ('\\sqrt{%s}' % corpo)
    if tag == M + 'd':
        beg, end = '(', ')'
        pr = e.find(M + 'dPr')
        if pr is not None:
            b = pr.find(M + 'begChr')
            en = pr.find(M + 'endChr')
            if b is not None:
                beg = b.get(M + 'val', '(')
            if en is not None:
                end = en.get(M + 'val', ')')
        inner = ''.join(omml(c) for c in e.findall(M + 'e'))
        return '%s%s%s' % (beg, inner, end)
    if tag == M + 'nary':
        pr = e.find(M + 'naryPr')
        sinal = '∫'
        if pr is not None:
            c = pr.find(M + 'chr')
            if c is not None:
                sinal = c.get(M + 'val', sinal)
        op = {'∑': '\\sum', '∏': '\\prod', '∫': '\\int'}.get(sinal, sinal)
        sb = e.find(M + 'sub')
        sp = e.find(M + 'sup')
        b = e.find(M + 'e')
        out = op
        if sb is not None and omml(sb):
            out += '_{%s}' % omml(sb)
        if sp is not None and omml(sp):
            out += '^{%s}' % omml(sp)
        return out + ' ' + (omml(b) if b is not None else '')
    if tag == M + 'func':
        n = e.find(M + 'fName')
        b = e.find(M + 'e')
        return '%s(%s)' % (omml(n) if n is not None else '',
                           omml(b) if b is not None else '')
    if tag == M + 'bar':
        b = e.find(M + 'e')
        return '\\overline{%s}' % (omml(b) if b is not None else '')
    if tag == M + 'acc':
        b = e.find(M + 'e')
        return '\\bar{%s}' % (omml(b) if b is not None else '')
    if tag.startswith(M):
        return ''.join(omml(c) for c in e)
    return ''


# ---------- runs ----------
def run_text(r):
    partes = []
    for c in r:
        if c.tag == W + 't':
            partes.append(c.text or '')
        elif c.tag == W + 'tab':
            partes.append('\t')
        elif c.tag == W + 'br':
            partes.append('\n')
    return ''.join(partes)


def run_marca(r, rels):
    pr = r.find(W + 'rPr')
    negrito = False
    sublinhado = False
    italico = False
    va = None
    if pr is not None:
        b = pr.find(W + 'b')
        if b is not None and b.get(W + 'val') not in ('0', 'false'):
            negrito = True
        u = pr.find(W + 'u')
        if u is not None and u.get(W + 'val') not in ('none', None):
            sublinhado = True
        i = pr.find(W + 'i')
        if i is not None and i.get(W + 'val') not in ('0', 'false'):
            italico = True
        v = pr.find(W + 'vertAlign')
        if v is not None:
            va = v.get(W + 'val')
    imgs = []
    for blip in r.iter(A + 'blip'):
        rid = blip.get(R + 'embed')
        if rid and rid in rels:
            imgs.append(rels[rid])
    return (negrito, sublinhado, italico), va, imgs


def par_nivel(p):
    ppr = p.find(W + 'pPr')
    if ppr is None:
        return None, None
    numpr = ppr.find(W + 'numPr')
    ilvl = None
    if numpr is not None:
        i = numpr.find(W + 'ilvl')
        if i is not None:
            ilvl = int(i.get(W + 'val', '0'))
    st = ppr.find(W + 'pStyle')
    estilo = st.get(W + 'val') if st is not None else None
    if ilvl is None:
        ind = ppr.find(W + 'ind')
        if ind is not None and ind.get(W + 'left'):
            ilvl = int(int(ind.get(W + 'left')) / 360) - 1
            if ilvl < 0:
                ilvl = None
    return ilvl, estilo


def paragrafo(p, rels):
    ilvl, estilo = par_nivel(p)
    out = []
    imgs = []
    for filho in p:
        if filho.tag == W + 'r':
            (negrito, sublinhado, italico), va, ii = run_marca(filho, rels)
            imgs += ii
            t = run_text(filho)
            if not t:
                continue
            if va == 'subscript':
                t = '_{%s}' % t
            elif va == 'superscript':
                t = '^{%s}' % t
            if italico:
                t = '//%s//' % t
            if sublinhado:
                t = '__%s__' % t
            if negrito:
                t = '**%s**' % t
            out.append(t)
        elif filho.tag == M + 'oMath':
            out.append('⟦%s⟧' % omml(filho).strip())
        elif filho.tag == M + 'oMathPara':
            for om in filho.findall(M + 'oMath'):
                out.append('⟦%s⟧' % omml(om).strip())
        elif filho.tag == W + 'hyperlink':
            for r in filho.findall(W + 'r'):
                out.append(run_text(r))
    texto = ''.join(out)
    # Junta marcas vizinhas SEM comer o espaco entre elas: `a__ __b` tem de
    # continuar sendo `a b`. A versao antiga usava '' no lugar de \1 e
    # colava as palavras.
    texto = re.sub(r'\*\*(\s*)\*\*', r'\1', texto)
    texto = re.sub(r'__(\s*)__', r'\1', texto)
    #  e o marcador de objeto embutido do Word, nao e texto.
    texto = texto.replace('\x01', '')
    return ilvl, estilo, texto, imgs


def tabela(tb, rels):
    linhas = []
    for tr in tb.findall(W + 'tr'):
        cels = []
        for tc in tr.findall(W + 'tc'):
            partes = []
            for p in tc.findall(W + 'p'):
                _, _, t, _ = paragrafo(p, rels)
                if t.strip():
                    partes.append(t.strip())
            cels.append(' / '.join(partes))
        linhas.append(cels)
    return linhas


def main(caminho):
    z = zipfile.ZipFile(caminho)
    rels = {}
    reldoc = ET.fromstring(z.read('word/_rels/document.xml.rels'))
    for rel in reldoc:
        rels[rel.get('Id')] = rel.get('Target')
    doc = ET.fromstring(z.read('word/document.xml'))
    body = doc.find(W + 'body')
    n = 0
    for el in body:
        if el.tag == W + 'p':
            ilvl, estilo, texto, imgs = paragrafo(el, rels)
            n += 1
            if not texto.strip() and not imgs:
                continue
            marca = ''
            if estilo:
                marca += '[%s]' % estilo
            if ilvl is not None:
                marca += '[n%d]' % ilvl
            print('%05d %s %s' % (n, marca or '[p]', texto.strip()))
            for i in imgs:
                print('%05d [IMG] %s' % (n, i))
        elif el.tag == W + 'tbl':
            n += 1
            print('%05d [TABELA]' % n)
            for lin in tabela(el, rels):
                print('        | ' + ' | '.join(lin))


if __name__ == '__main__':
    main(sys.argv[1])
