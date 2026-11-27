// Baja el feed RSS del canal de YouTube, descarta los Shorts y actualiza
// data/videos.json. Lo ejecuta .github/workflows/videos.yml una vez al día.
// Sin dependencias: necesita Node 18 o superior.
//
// Uso:  node scripts/actualizar-videos.mjs
//       node scripts/actualizar-videos.mjs --feed ruta/a/feed.xml   (para probar sin red)

import { readFile, writeFile } from 'node:fs/promises';

const CANAL = 'UC_zpQjl26KRszwl7FwtH82g';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CANAL}`;
const ARCHIVO = new URL('../data/videos.json', import.meta.url);
const MAXIMO = 50; // cuántos videos se guardan como máximo

function decodificar(texto) {
  return texto
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function etiqueta(xml, nombre) {
  const m = xml.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`));
  return m ? decodificar(m[1]) : '';
}

function leerFeed(xml) {
  const entradas = xml.match(/<entry[\s>][\s\S]*?<\/entry>/g) || [];
  return entradas.map((e) => {
    const enlace = (e.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/) ||
                    e.match(/<link[^>]*href="([^"]+)"/) || [])[1] || '';
    const id = etiqueta(e, 'yt:videoId');
    return {
      id,
      titulo: etiqueta(e, 'title'),
      fecha: etiqueta(e, 'published'),
      miniatura: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      esShort: enlace.includes('/shorts/'),
    };
  });
}

async function obtenerXml() {
  const i = process.argv.indexOf('--feed');
  if (i !== -1) return readFile(process.argv[i + 1], 'utf8');
  const r = await fetch(FEED, { headers: { 'User-Agent': 'clarionida.com videos' } });
  if (!r.ok) throw new Error(`El feed respondió ${r.status}`);
  return r.text();
}

const entradas = leerFeed(await obtenerXml());
if (!entradas.length) throw new Error('El feed no trajo entradas; no se toca videos.json.');

const nuevos = entradas
  .filter((v) => v.id && !v.esShort)
  .map(({ esShort, ...v }) => v);
const shorts = new Set(entradas.filter((v) => v.esShort).map((v) => v.id));

let anteriores = [];
try {
  anteriores = JSON.parse(await readFile(ARCHIVO, 'utf8'));
  if (!Array.isArray(anteriores)) anteriores = [];
} catch { /* primera vez */ }

// Se combinan con los ya guardados para no perder videoensayos cuando el feed
// (que solo trae ~15 entradas) se llena de Shorts. Lo del feed manda.
const porId = new Map();
for (const v of anteriores) if (v && v.id && !shorts.has(v.id)) porId.set(v.id, v);
for (const v of nuevos) porId.set(v.id, v);

const videos = [...porId.values()]
  .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
  .slice(0, MAXIMO);

const salida = JSON.stringify(videos, null, 2) + '\n';
const antes = await readFile(ARCHIVO, 'utf8').catch(() => '');
if (salida === antes) {
  console.log(`Sin cambios (${videos.length} videos).`);
} else {
  await writeFile(ARCHIVO, salida);
  console.log(`videos.json actualizado: ${videos.length} videos (${shorts.size} Shorts descartados del feed).`);
}
