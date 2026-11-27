# clarionida.com

Sitio estático de Clariónida: HTML, CSS y JS sin framework, publicado con GitHub Pages en `clarionida.com`.

## Estructura

| Ruta | Archivo |
|---|---|
| `/` | `index.html` (home, entrada de diccionario) |
| `/clarionida` | `clarionida/index.html` (la palabra) |
| `/libreta` | `libreta/index.html` (destino del QR de la libreta Habit tracker 2027) |
| `/enlaces` | `enlaces/index.html` (link-in-bio) |
| `/apoya` | `apoya/index.html` (donaciones con Stripe) |
| `/en`, `/pt` | `en/index.html`, `pt/index.html` (presentación breve en inglés y portugués) |
| `/antiResumenIA`, `/antiResumenIA/en` | redirigen a `/buscar-sin-ia/` (ruta vieja de la extensión) |
| cualquier otra | `404.html` (si empieza con `/antiResumenIA/`, también redirige a `/buscar-sin-ia/`) |

`/buscar-sin-ia/` no está en este repo: es el project site del repo `clarionida/buscar-sin-ia` (antes `antiResumenIA`), que GitHub Pages publica bajo este dominio.

- `assets/css/estilo.css`: todos los estilos. Los colores y las tipografías están al principio, como variables.
- `assets/js/config.js`: **lo único que hay que tocar para conectar lo pendiente** (WhatsApp, Substack, Amazon, Formspree, analítica).
- `assets/js/sitio.js`: comportamiento común (formularios, videos, analítica).
- `data/videos.json`: lo escribe la GitHub Action, no se edita a mano.
- Los textos entre `[corchetes]` son marcadores que faltan por escribir.

## Ver el sitio en tu computadora

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000.

## Videos de YouTube

`.github/workflows/videos.yml` corre una vez al día y también a mano (Actions → "Actualizar videos de YouTube" → Run workflow). Baja el feed RSS del canal, descarta los Shorts (enlaces con `/shorts/`) y escribe `data/videos.json` con título, id, fecha y miniatura. Solo hace commit si algo cambió. Además combina lo nuevo con lo que ya estaba guardado, así no se pierden videoensayos cuando el feed (que trae unas 15 entradas) se llena de Shorts. La home muestra los 3 más recientes.

Después de fusionar a `main`, ejecútala una vez a mano para llenar `data/videos.json`.

## Pendientes en `assets/js/config.js`

- `whatsapp`: el enlace aparece solo cuando tenga valor.
- `substack`: cuando exista, el formulario de las cartas envía el correo directo a Substack (`<substack>/api/v1/free`), sin cambiar el diseño. Si prefieres el embed oficial de Substack (un iframe), se reemplaza el `<form data-cartas>` por el código que da Substack.
- `ultimaCarta`: enlace a la última carta.
- `amazonLibreta`: el botón aparece en `/libreta` y `/enlaces` cuando tenga valor.
- `formularioClarionida`: endpoint de Formspree (plan gratis) para "Cuéntanos tu clariónida".
- `cloudflareToken`: Cloudflare Web Analytics (sin cookies). Cuenta visitas por página, incluida `/libreta`.

## Idiomas

El sitio principal está en español, igual que los videoensayos y las cartas. Los videoensayos tienen subtítulos oficiales y pista de audio en inglés y portugués en YouTube; las cartas son solo en español. `/en` y `/pt` son páginas breves que presentan el proyecto y llevan a las versiones en ese idioma de las herramientas del taller. `/libreta` tiene una sección en inglés (`#english`) porque la libreta es bilingüe. Las traducciones de los textos provisionales también son provisionales.

## Publicar en clarionida.com

### 1. Repositorios (en este orden)

1. Renombra **este** repo a `clarionida.github.io` (Settings → General → Repository name). Así es el sitio de usuario y los project sites sin dominio propio quedan bajo `clarionida.com/<repo>`.
2. Renombra `antiResumenIA` a `buscar-sin-ia`. Su página queda en `clarionida.com/buscar-sin-ia/`. No vuelvas a crear un repo llamado `antiResumenIA`: rompería la redirección que GitHub hace de los enlaces viejos del repo.
3. Fusiona a `main` los cambios de los dos repos y vuelve a correr el workflow "Publicar página web" de `buscar-sin-ia` (pestaña Actions).

GitHub Pages no redirige solo después de renombrar un repo. Por eso este sitio tiene páginas en `/antiResumenIA/` que mandan a `/buscar-sin-ia/`, y `clarionida.github.io/antiResumenIA/` llega a ellas porque GitHub manda todo `clarionida.github.io` al dominio propio.

### 2. GitHub Pages

1. Settings → Pages → Source: "Deploy from a branch", rama `main`, carpeta `/ (root)`.
2. Antes del DNS, verifica el dominio: tu foto de perfil → Settings → Pages → Add a domain → `clarionida.com`. GitHub te da un registro TXT (`_github-pages-challenge-clarionida`), que agregas en Squarespace.
3. En Settings → Pages → Custom domain del repo debe quedar `clarionida.com` (el archivo `CNAME` ya lo trae).

### 3. DNS en Squarespace (Domains → clarionida.com → DNS)

Borra los registros predeterminados de Squarespace que apunten el apex o `www` a Squarespace, y agrega estos:

| Tipo | Host | Valor |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | clarionida.github.io |
| TXT | _github-pages-challenge-clarionida | (el valor que da GitHub) |

### 4. HTTPS

Cuando GitHub muestre "DNS check successful" (puede tardar desde unos minutos hasta 24 horas), marca **Enforce HTTPS** en Settings → Pages.

### 5. Antes de cambiar el QR

Abre https://clarionida.com/libreta en el celular y confirma que carga con HTTPS. Recién entonces cambia el QR del manuscrito.

### 6. Después de publicar

Guarda en el Wayback Machine (https://web.archive.org → Save Page Now):
- https://clarionida.com/clarionida/
- https://www.youtube.com/watch?v=t9_IRkidehw
