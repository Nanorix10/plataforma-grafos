// Gera a migration que grava as medidas das figuras antigas (decisão 32, onda 1).
// Uso: node gera.js <pasta public/img/resumos> <pasta das baixadas> <saida.sql>
const fs = require('fs')
const path = require('path')
const [, , pastaLocal, pastaBaixadas, saida] = process.argv

function dimsWebp(b) {
  if (b.toString('ascii', 0, 4) !== 'RIFF') return null
  const t = b.toString('ascii', 12, 16)
  if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
  if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
  if (t === 'VP8L') {
    const n = b.readUInt32LE(21)
    return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]
  }
  return null
}
function dimsPng(b) {
  if (b.readUInt32BE(0) !== 0x89504e47) return null
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

const itens = []
function andar(dir, base) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) andar(p, base)
    else if (p.endsWith('.webp')) {
      const d = dimsWebp(fs.readFileSync(p))
      if (!d) throw new Error('sem medida: ' + p)
      const src = '/img/resumos/' + path.relative(base, p).split(path.sep).join('/')
      itens.push([src, d[0], d[1]])
    }
  }
}
andar(pastaLocal, pastaLocal)
for (const f of fs.readdirSync(pastaBaixadas)) {
  const d = dimsPng(fs.readFileSync(path.join(pastaBaixadas, f)))
  if (!d) throw new Error('sem medida: ' + f)
  itens.push([`https://fprcopgihmxegagsqfqw.supabase.co/storage/v1/object/public/imagens/${f}`, d[0], d[1]])
}

const esc = (s) => s.replace(/[.\\+*?^$()[\]{}|]/g, '\\$&')
const sqlStr = (s) => "'" + s.replace(/'/g, "''") + "'"
const valores = itens
  .map(([src, l, a]) => `    (${sqlStr(src)}, ${sqlStr(esc(src))}, ${l}, ${a})`)
  .join(',\n')

const sql = `-- Decisão 32, onda 1: as figuras antigas ganham as medidas do arquivo.
--
-- O QUE FAZ: acrescenta data-natural="L A", width="L" e height="A" em cada
-- <img> do corpo que ainda não tem data-natural. Com as medidas, o navegador
-- reserva o espaço da imagem antes de ela chegar, e a página para de saltar.
-- Medido em 19/11/2026: 249 de 304 figuras sem medida, em 83 resumos.
--
-- O QUE NÃO FAZ: não apaga nem troca nada. Nenhum texto muda — a prova está
-- no fim deste arquivo. Imagem que já tem data-natural não é tocada (o
-- lookahead do padrão). As medidas foram lidas dos próprios arquivos: os WebP
-- de public/img/resumos no repositório e os 13 PNG do bucket "imagens".
--
-- CÓPIA DE SEGURANÇA: o corpo de antes fica em backup.corpo_antes_medidas,
-- num schema que a API não expõe (decisão 14: corpo é só para quem tem plano).
--
-- PARA DESFAZER:
--   update public.resumos r set corpo = b.corpo
--     from backup.corpo_antes_medidas b where b.id = r.id;

create schema if not exists backup;
revoke all on schema backup from public, anon, authenticated;

create table backup.corpo_antes_medidas as
  select id, slug, corpo, versao, now() as guardado_em
  from public.resumos
  where corpo ~ '<img src="[^"]*"(?![^>]*data-natural)';

revoke all on backup.corpo_antes_medidas from public, anon, authenticated;

do $$
declare
  m record;
begin
  for m in
    select * from (values
${valores}
    ) as v(src, padrao, l, a)
  loop
    update public.resumos
       set corpo = regexp_replace(
             corpo,
             '<img src="' || m.padrao || '"(?![^>]*data-natural)',
             '<img src="' || m.src || '" data-natural="' || m.l || ' ' || m.a
               || '" width="' || m.l || '" height="' || m.a || '"',
             'g')
     where position('<img src="' || m.src || '"' in corpo) > 0
       and corpo ~ ('<img src="' || m.padrao || '"(?![^>]*data-natural)');
  end loop;
end;
$$;

-- A PROVA: o texto de cada resumo, sem as tags, é idêntico ao de antes, e
-- nenhuma <img> ficou sem medida. Se algo falhar, a migration inteira volta.
do $$
declare
  diferentes int;
  faltando int;
begin
  select count(*) into diferentes
    from backup.corpo_antes_medidas b
    join public.resumos r on r.id = b.id
   where regexp_replace(b.corpo, '<[^>]+>', '', 'g')
      <> regexp_replace(r.corpo, '<[^>]+>', '', 'g');
  if diferentes > 0 then
    raise exception 'O texto de % resumo(s) mudou. Nada foi gravado.', diferentes;
  end if;

  select count(*) into faltando
    from public.resumos r, regexp_matches(r.corpo, '(<img[^>]*>)', 'g') t
   where t[1] !~ 'data-natural';
  if faltando > 0 then
    raise exception '% imagem(ns) continuam sem medida. Nada foi gravado.', faltando;
  end if;
end;
$$;
`
fs.writeFileSync(saida, sql)
console.log('itens', itens.length, 'bytes', sql.length)
