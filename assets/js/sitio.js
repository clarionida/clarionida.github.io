/* clarionida.com — comportamiento común a todas las páginas. Sin dependencias. */
(function () {
  'use strict';

  var C = window.CLARIONIDA || {};
  var enlaces = C.enlaces || {};

  function sinBarraFinal(url) { return String(url).replace(/\/+$/, ''); }

  /* ---------- Enlaces configurables ----------
     data-enlace="clave"     → pone href = enlaces[clave] si existe.
     data-si-enlace="clave"  → el elemento (con atributo hidden) se muestra solo si existe. */
  document.querySelectorAll('[data-enlace]').forEach(function (el) {
    var url = enlaces[el.getAttribute('data-enlace')];
    if (url) el.setAttribute('href', url);
  });
  document.querySelectorAll('[data-si-enlace]').forEach(function (el) {
    if (enlaces[el.getAttribute('data-si-enlace')]) el.hidden = false;
  });
  document.querySelectorAll('[data-sin-enlace]').forEach(function (el) {
    if (enlaces[el.getAttribute('data-sin-enlace')]) el.hidden = true;
  });

  /* ---------- Año del pie ---------- */
  document.querySelectorAll('[data-anio]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Mensajes de formularios (según el idioma de la sección) ---------- */
  var TEXTOS = {
    es: {
      cartasPendiente: '[Mensaje mientras las cartas no estén conectadas a Substack]',
      formPendiente: '[Formulario sin conectar: falta el endpoint de Formspree en config.js]',
      enviado: 'Enviado. Gracias.',
      error: 'No se pudo enviar. Inténtalo de nuevo en un momento.'
    },
    en: {
      cartasPendiente: '[Message while the letters are not connected to Substack]',
      formPendiente: '[Form not connected: Formspree endpoint missing in config.js]',
      enviado: 'Sent. Thank you.',
      error: 'Could not send. Please try again in a moment.'
    },
    pt: {
      cartasPendiente: '[Mensagem enquanto as cartas não estiverem conectadas ao Substack]',
      formPendiente: '[Formulário não conectado: falta o endpoint do Formspree em config.js]',
      enviado: 'Enviado. Obrigado.',
      error: 'Não foi possível enviar. Tente de novo em um momento.'
    }
  };
  function texto(el, clave) {
    var nodo = el.closest('[lang]') || document.documentElement;
    var lang = (nodo.getAttribute('lang') || 'es').slice(0, 2);
    return (TEXTOS[lang] || TEXTOS.es)[clave];
  }

  function mensaje(form, contenido, esError) {
    var p = form.querySelector('[data-mensaje]');
    if (!p) {
      p = document.createElement('p');
      p.setAttribute('data-mensaje', '');
      p.setAttribute('role', 'status');
      form.appendChild(p);
    }
    p.className = 'mensaje-form' + (esError ? ' mensaje-form--error' : '');
    p.textContent = contenido;
  }

  /* ---------- Formulario de las cartas (Substack) ----------
     Con Substack configurado, el formulario envía el correo directamente a
     Substack (que muestra su propia página de confirmación). Sin Substack,
     queda como marcador. */
  document.querySelectorAll('form[data-cartas]').forEach(function (form) {
    if (enlaces.substack) {
      form.setAttribute('action', sinBarraFinal(enlaces.substack) + '/api/v1/free?nojs=true');
      form.setAttribute('method', 'post');
      return;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      mensaje(form, texto(form, 'cartasPendiente'), false);
    });
  });

  /* ---------- Formulario "Cuéntanos tu clariónida" (Formspree) ---------- */
  document.querySelectorAll('form[data-clarionida]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var destino = C.formularioClarionida;
      if (!destino) {
        mensaje(form, texto(form, 'formPendiente'), true);
        return;
      }
      var boton = form.querySelector('button[type="submit"]');
      if (boton) boton.disabled = true;
      fetch(destino, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        form.reset();
        mensaje(form, texto(form, 'enviado'), false);
      }).catch(function () {
        mensaje(form, texto(form, 'error'), true);
      }).then(function () {
        if (boton) boton.disabled = false;
      });
    });
  });

  /* ---------- Videoensayos (data/videos.json, lo actualiza una GitHub Action) ---------- */
  document.querySelectorAll('[data-videos]').forEach(function (lista) {
    var cantidad = parseInt(lista.getAttribute('data-videos'), 10) || 3;
    fetch('/data/videos.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (videos) {
        if (!Array.isArray(videos) || !videos.length) return;
        videos.slice(0, cantidad).forEach(function (v) {
          var a = document.createElement('a');
          a.className = 'video';
          a.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id);

          var mini = document.createElement('span');
          mini.className = 'video__mini';
          var img = document.createElement('img');
          img.src = v.miniatura || ('https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg');
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.onerror = function () { img.remove(); };
          img.width = 480;
          img.height = 360;
          mini.appendChild(img);

          var titulo = document.createElement('span');
          titulo.className = 'video__titulo';
          titulo.textContent = v.titulo;

          a.appendChild(mini);
          a.appendChild(titulo);
          lista.appendChild(a);
        });
        lista.hidden = false;
      })
      .catch(function () { /* sin videos: queda solo el enlace al canal */ });
  });

  /* ---------- Analítica sin cookies (Cloudflare Web Analytics) ---------- */
  if (C.cloudflareToken) {
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: C.cloudflareToken }));
    document.head.appendChild(s);
  }
})();
