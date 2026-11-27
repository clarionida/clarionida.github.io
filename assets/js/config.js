/*
 * Configuración del sitio. Es el único archivo que hay que tocar para
 * conectar lo que todavía está pendiente. Deja '' mientras no exista.
 *
 * Lo que está vacío se oculta (WhatsApp, Amazon) o queda como marcador
 * (formulario de las cartas, formulario "Cuéntanos tu clariónida").
 */
window.CLARIONIDA = {
  enlaces: {
    // Ej.: 'https://whatsapp.com/channel/XXXX' o 'https://wa.me/XXXX'
    whatsapp: '',
    // Ej.: 'https://clarionida.substack.com' (sin barra al final)
    substack: '',
    // Enlace de la libreta en Amazon, cuando KDP la apruebe
    amazonLibreta: '',
    // Enlace a la última carta publicada en Substack
    ultimaCarta: ''
  },

  // Formulario "Cuéntanos tu clariónida".
  // Crea un formulario gratis en https://formspree.io y pega aquí su
  // endpoint, por ejemplo 'https://formspree.io/f/abcdwxyz'.
  formularioClarionida: '',

  // Analítica sin cookies: Cloudflare Web Analytics.
  // En dash.cloudflare.com → Web Analytics → Add a site → clarionida.com,
  // copia el "token" del fragmento que te dan y pégalo aquí.
  cloudflareToken: ''
};
