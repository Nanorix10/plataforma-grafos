# -*- coding: utf-8 -*-
r"""Procura um assunto nos cadernos do autor e extrai o documento que o tem.

Uso:
  python busca_caderno.py procurar "regex"
  python busca_caderno.py extrair "trecho do caminho no zip" PASTA_DE_SAIDA

`procurar` lista cada paragrafo que casa, com o arquivo, o numero do paragrafo
e o cabecalho de materia acima dele (`MATEMÁTICA B`, `BIOLOGIA A`...). O
cabecalho e a regua da materia do resumo.

`extrair` grava em PASTA: `doc.docx`, `doc.txt` (saida do extrator versionado
`supabase/ferramentas/docx_para_migration.py`, com formulas em LaTeX e a marca
[IMG] na ancora de cada figura) e `media/` com as imagens.

O mesmo assunto costuma aparecer em varios documentos (o caderno de uma prova
e copiado para o simulado seguinte). `procurar` mostra todos; use o mais
completo e cite os outros no PR.
"""
import sys, re, io, os, zipfile, subprocess

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

ZIP = os.environ.get('CADERNOS_ZIP',
                     r'C:/Users/leand/Downloads/pro site-20260823T061718Z-1-001.zip')
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
EXTRATOR = os.path.join(REPO, 'supabase', 'ferramentas', 'docx_para_migration.py')


def paragrafos(dados):
    x = zipfile.ZipFile(io.BytesIO(dados)).read('word/document.xml').decode('utf8')
    return [re.sub(r'<[^>]+>', '', p) for p in re.findall(r'<w:p[ >].*?</w:p>', x, flags=re.S)]


def procurar(regex):
    rx = re.compile(regex, re.I)
    z = zipfile.ZipFile(ZIP)
    for n in z.namelist():
        if not n.endswith('.docx'):
            continue
        cab = ''
        for i, p in enumerate(paragrafos(z.read(n))):
            t = p.strip()
            if re.match(r'^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{4,}( [A-Z])?\s*✅?$', t):
                cab = t
            if rx.search(t):
                print(f'{n} | §{i:05d} | {cab} | {t[:160]}')


def extrair(trecho, pasta):
    z = zipfile.ZipFile(ZIP)
    nomes = [n for n in z.namelist() if n.endswith('.docx') and trecho in n]
    if len(nomes) != 1:
        sys.exit(f'O trecho casa com {len(nomes)} arquivos: {nomes}')
    os.makedirs(os.path.join(pasta, 'media'), exist_ok=True)
    dados = z.read(nomes[0])
    doc = os.path.join(pasta, 'doc.docx')
    open(doc, 'wb').write(dados)
    d = zipfile.ZipFile(io.BytesIO(dados))
    for m in d.namelist():
        if m.startswith('word/media/'):
            open(os.path.join(pasta, 'media', os.path.basename(m)), 'wb').write(d.read(m))
    saida = subprocess.run([sys.executable, EXTRATOR, doc], capture_output=True)
    open(os.path.join(pasta, 'doc.txt'), 'wb').write(saida.stdout)
    print(f'{nomes[0]} -> {pasta} (doc.txt, media/)')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'procurar':
        procurar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'extrair':
        extrair(sys.argv[2], sys.argv[3])
    else:
        sys.exit(__doc__)
