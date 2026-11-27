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
| cualquier otra | `404.html` |

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

## Publicar en clarionida.com

### 1. Repositorio

Para que los project sites de la cuenta sin dominio propio (como `antiResumenIA`) queden también en `clarionida.com/antiResumenIA`, este repo tiene que ser el **sitio de usuario**, es decir, llamarse `clarionida.github.io`. Renómbralo en Settings → General → Repository name. GitHub redirige el nombre viejo.

Si se queda como `clarionida.com`, el sitio funciona igual en `clarionida.com`, pero la extensión seguirá en `clarionida.github.io/antiResumenIA/`.

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
