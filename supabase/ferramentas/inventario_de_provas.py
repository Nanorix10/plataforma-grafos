# -*- coding: utf-8 -*-
r"""Inventaria os documentos de PROVA da escola, por topico e por materia.

Uso:
    python supabase/ferramentas/inventario_de_provas.py <pasta-com-docx> -s <saida>

## Por que este arquivo existe

Os outros dois extratores servem a documentos que viram conteudo: o
`docx_para_migration.py` despeja um `.docx` de resumo, e o
`edital_para_migration.py` transforma um edital em linhas de `edital_topicos`.
Este nao produz conteudo nenhum — produz um MAPA.

A pasta "pro site" tem 59 documentos de prova da escola (`Resumos 2025/` e
`Resumos 2026/`, ~185 MB). Eles sao organizados **por prova**: cada um cobre o
bimestre inteiro de uma turma, misturando Fisica, Filosofia e Sociologia na
mesma pagina. O site e organizado **por materia**. Sem inverter isso primeiro,
importar qualquer um deles significa espalhar uma materia por dezenas de
migrations e repetir o mesmo topico muitas vezes — em 2026-08-24 a contagem deu
1.117 topicos de nivel 0 para apenas 814 distintos.

O inventario existe para responder, antes de escrever uma linha de SQL: **o que
tem ali dentro, de que materia e, e o que disso ja esta publicado.**

## Ele NAO decide sozinho a materia nem o que ja esta publicado

Essas duas respostas dependem do banco, e o banco muda a cada importacao. Entao
a ferramenta faz a parte que e estavel — ler os .docx e deduplicar — e emite um
`classificar.sql` pronto para rodar, que cruza os topicos contra
`edital_topicos` (1.114 linhas que ja tem `materia_slug`) e contra os titulos
dos resumos publicados.

E por isso que ela e versionada e nao descartavel: a coluna "ja publicado"
envelhece, e o autor vai querer regerar o mapa depois de cada leva.

## Duas armadilhas que ele ja desconta

- **PNG de 1x1** e o marcador que o Word deixa quando a imagem se perde. A
  Gametogenese da Biologia apontava quatro vezes para um; o documento-mestre de
  Quimica, sete. Aqui eles nao entram na contagem de figuras.
- **Caixa de texto flutuante** nao e paragrafo, e some de qualquer leitura por
  paragrafo — foi assim que o titulo "QUIMICA (ETAPA 3)" quase levou 21 topicos
  para a materia errada. O inventario conta quantas existem em cada documento,
  para quem for importar saber onde olhar.
"""
import sys, os, re, glob, zipfile, struct, argparse, unicodedata
import xml.etree.ElementTree as ET
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docx_para_migration import paragrafo, W  # reuso, nao reescrita

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass


def _dimensoes(dados):
    """Largura e altura de um PNG ou JPEG, sem depender de Pillow."""
    if dados[:8] == b'\x89PNG\r\n\x1a\n':
        return struct.unpack('>II', dados[16:24])
    if dados[:2] == b'\xff\xd8':
        i = 2
        while i < len(dados) - 9:
            if dados[i] != 0xFF:
                i += 1
                continue
            if dados[i + 1] in (0xC0, 0xC1, 0xC2, 0xC3):
                h, w = struct.unpack('>HH', dados[i + 5:i + 9])
                return w, h
            i += 2 + struct.unpack('>H', dados[i + 2:i + 4])[0]
    return None


def normalizar(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]', ' ', s)).strip()


def limpar_titulo(t):
    t = t.split(':')[0]
    t = t.replace('**', '').replace('__', '').replace('//', '')
    t = re.sub(r'⟦[^⟧]*⟧', '', t)
    return t.strip(' ();.').strip()


def ler_documento(caminho):
    """Devolve (topicos, caixas_de_texto) de um .docx de prova.

    Cada topico e um dicionario com titulo, texto (chars), formulas, figuras
    (ja sem os PNG de 1x1) e o nome do documento.
    """
    z = zipfile.ZipFile(caminho)
    rels = {}
    for rel in ET.fromstring(z.read('word/_rels/document.xml.rels')):
        rels[rel.get('Id')] = rel.get('Target')
    doc = ET.fromstring(z.read('word/document.xml'))
    body = doc.find(W + 'body')

    caixas = sum(1 for tb in doc.iter()
                 if tb.tag.split('}')[-1] == 'txbxContent')

    nome = os.path.basename(caminho)[:-5]
    topicos = []
    atual = None
    for el in body:
        if el.tag != W + 'p':
            continue
        ilvl, estilo, texto, imgs = paragrafo(el, rels)
        if not texto.strip() and not imgs:
            continue

        reais = 0
        for i in imgs:
            try:
                d = z.read('word/' + i)
            except KeyError:
                continue
            if _dimensoes(d) != (1, 1):     # descarta o marcador de imagem perdida
                reais += 1

        if ilvl == 0:
            titulo = limpar_titulo(texto)
            if titulo and 3 <= len(titulo) <= 70:
                atual = {'titulo': titulo, 'doc': nome, 'texto': 0,
                         'formulas': 0, 'figuras': 0}
                topicos.append(atual)
            else:
                atual = None

        if atual is None:
            continue
        limpo = re.sub(r'⟦[^⟧]*⟧', '', texto)
        limpo = limpo.replace('**', '').replace('__', '').replace('//', '')
        atual['texto'] += len(limpo.strip())
        atual['formulas'] += texto.count('⟦')
        atual['figuras'] += reais
    return topicos, caixas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pasta', help='pasta com os .docx das provas')
    ap.add_argument('-s', '--saida', default='.', help='onde escrever os arquivos')
    a = ap.parse_args()

    arquivos = sorted(glob.glob(os.path.join(a.pasta, '*.docx')))
    if not arquivos:
        sys.exit('nenhum .docx em %s' % a.pasta)

    linhas = []
    caixas_por_doc = {}
    for f in arquivos:
        tops, caixas = ler_documento(f)
        linhas.extend(tops)
        caixas_por_doc[os.path.basename(f)[:-5]] = caixas

    # bruto: uma linha por (topico, documento)
    with open(os.path.join(a.saida, 'inventario.tsv'), 'w', encoding='utf-8') as fh:
        fh.write('titulo\tdocumento\ttexto\tformulas\tfiguras\n')
        for t in linhas:
            fh.write('%s\t%s\t%d\t%d\t%d\n' % (t['titulo'], t['doc'],
                                               t['texto'], t['formulas'], t['figuras']))

    # deduplicado por titulo normalizado
    grupos = defaultdict(list)
    for t in linhas:
        grupos[normalizar(t['titulo'])].append(t)

    with open(os.path.join(a.saida, 'topicos.tsv'), 'w', encoding='utf-8') as fh:
        fh.write('titulo\tdocumentos\tmais_longo_em\ttexto\tformulas\tfiguras\n')
        for k in sorted(grupos):
            g = grupos[k]
            melhor = max(g, key=lambda x: x['texto'])
            fh.write('%s\t%d\t%s\t%d\t%d\t%d\n' % (
                melhor['titulo'], len(g), melhor['doc'],
                melhor['texto'], melhor['formulas'], max(x['figuras'] for x in g)))

    # o SQL que classifica: materia inferida e situacao
    def esc(s):
        return "'" + s.replace("'", "''") + "'"

    with open(os.path.join(a.saida, 'classificar.sql'), 'w', encoding='utf-8') as fh:
        fh.write("-- Gerado por inventario_de_provas.py. Roda contra o banco e\n"
                 "-- devolve, por topico de prova, a materia inferida e se ele ja\n"
                 "-- tem resumo publicado. Cascata: edital_topicos -> titulo de\n"
                 "-- resumo -> nada (fica 'indefinido').\n"
                 "with prova(titulo) as (values\n")
        titulos = [max(grupos[k], key=lambda x: x['texto'])['titulo'] for k in sorted(grupos)]
        fh.write(',\n'.join('  (%s)' % esc(t) for t in titulos))
        fh.write("\n)\n"
                 "-- Casamento por FRONTEIRA DE PALAVRA, nunca substring cru:\n"
                 "-- sondar 'Pascal' casa com a unidade de pressao listada em\n"
                 "-- grandezas-fisicas, e 'Dinamica' casa dentro de 'termodinamica'.\n"
                 "select p.titulo,\n"
                 "       coalesce(\n"
                 "         (select e.materia_slug from edital_topicos e\n"
                 # o titulo entra num regex, entao os metacaracteres dele
                 # precisam ser escapados — ha titulos com "(" solto, como
                 # "Volume do Trafico ... (1550-1850"
                 r"           where lower(e.texto) ~ ('\m' || lower(regexp_replace("
                 r"p.titulo,'([().\[\]{}*+?^$|\\])','\\\1','g')) || '\M')" "\n"
                 "           order by length(e.texto) limit 1),\n"
                 "         (select r.materia_slug from resumos r\n"
                 "           where lower(r.titulo) = lower(p.titulo) limit 1),\n"
                 "         'indefinido') as materia,\n"
                 "       exists (select 1 from resumos r\n"
                 "                where lower(r.titulo) = lower(p.titulo)) as ja_publicado\n"
                 "  from prova p order by 2, 1;\n")

    print('%d documentos | %d topicos | %d distintos' %
          (len(arquivos), len(linhas), len(grupos)))
    print('figuras reais (sem PNG de 1x1): %d' % sum(t['figuras'] for t in linhas))
    com_caixa = {k: v for k, v in caixas_por_doc.items() if v}
    print('documentos com caixa de texto: %d' % len(com_caixa))
    for k, v in sorted(com_caixa.items())[:10]:
        print('   %s: %d' % (k, v))
    print('\nescritos em %s: inventario.tsv, topicos.tsv, classificar.sql' % a.saida)


if __name__ == '__main__':
    main()
