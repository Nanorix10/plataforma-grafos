# -*- coding: utf-8 -*-
r"""Procura questoes de prova real da UEM pelo texto, com o gabarito oficial.

Uso: python busca_questoes.py "regex" [--pas] [--max 20] [--inteira]

- regex: casa contra o enunciado inteiro, sem diferenciar maiusculas;
- --pas: so o PAS-UEM (os editais do site sao PAS e PASSE);
- --inteira: imprime o texto completo, nao so o comeco.

O texto vem de `work/final_q.json`, extraido dos PDFs: formula sai achatada
e as vezes com glifo duplicado (`𝑓𝑓` por `f`). Antes de transcrever uma
questao, abra o PDF na pagina indicada e confira.
"""
import sys, re, json, csv, os, argparse

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

RAIZ = os.environ.get('UEM_PROVAS', r'C:/Users/leand/Documents/UEM-Provas')

ap = argparse.ArgumentParser()
ap.add_argument('regex')
ap.add_argument('--pas', action='store_true')
ap.add_argument('--max', type=int, default=20)
ap.add_argument('--inteira', action='store_true')
a = ap.parse_args()

# Gabarito: (prova, parte, questao) -> (soma, materia)
gab = {}
with open(os.path.join(RAIZ, 'UEM - Índice das questões.csv'), encoding='utf-8-sig') as f:
    for l in csv.DictReader(f, delimiter=';'):
        gab.setdefault((l['Prova'], l['Parte'], l['Questão']), []).append(
            (l['Gabarito (soma)'], l['Matéria']))

def chave(arquivo, n):
    # ../pdfs/pas25/E3.pdf -> ('PAS-UEM 2025', 'Etapa 3', '27')
    m = re.search(r'/pas(\d\d)/[Ee](\d)', arquivo)
    if not m:
        return None
    return ('PAS-UEM 20' + m.group(1), 'Etapa ' + m.group(2), str(n))

qs = json.load(open(os.path.join(RAIZ, 'work', 'final_q.json'), encoding='utf8'))
rx = re.compile(a.regex, re.I)
achou = 0
for q in qs:
    if a.pas and '/pas' not in q['file']:
        continue
    if not rx.search(q['text']):
        continue
    k = chave(q['file'], q['n'])
    g = gab.get(k) if k else None
    rot = f'{k[0]}, {k[1]}, questão {k[2]}' if k else f"{q['file']} questão {q['n']}"
    gtxt = '; '.join(f'gabarito {s} ({m})' for s, m in g) if g else 'gabarito: conferir no índice'
    print(f"=== {rot} | {gtxt} | PDF {q['file'].replace('../', '')} p. {q['p']}")
    t = re.sub(r'\s+', ' ', q['text'])
    print(t if a.inteira else t[:400])
    print()
    achou += 1
    if achou >= a.max:
        break
print(f'{achou} questão(ões).')
