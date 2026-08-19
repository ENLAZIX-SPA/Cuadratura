/* ============================================================
   SCRIPT.JS
   Interactividad de la plantilla. No depende de librerías
   externas, así que funciona igual sin importar qué colores,
   tipografías o textos uses.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  iniciarMenuMovil();
  iniciarRevelarAlScroll();
  iniciarTestimonios();
  iniciarFormulario();
  actualizarAnioFooter();
});

/* ---------- 1. MENÚ MÓVIL ---------- */
function iniciarMenuMovil() {
  const boton = document.querySelector('.boton-menu');
  const nav = document.querySelector('.nav-links');
  if (!boton || !nav) return;

  boton.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', String(abierto));
  });

  // Cierra el menú al elegir un link (útil en una sola página)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 2. REVELAR SECCIONES AL HACER SCROLL ---------- */
function iniciarRevelarAlScroll() {
  const elementos = document.querySelectorAll('.revelar');
  if (!elementos.length) return;

  // Si el usuario prefiere menos movimiento, mostramos todo directo
  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefiereMenosMovimiento) {
    elementos.forEach(el => el.classList.add('visible'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observador.observe(el));
}

/* ---------- 3. CARRUSEL SIMPLE DE TESTIMONIOS ---------- */
function iniciarTestimonios() {
  const testimonios = document.querySelectorAll('[data-testimonio]');
  const puntos = document.querySelectorAll('.testimonio__punto');
  if (!testimonios.length || !puntos.length) return;

  let indiceActual = 0;
  let intervalo = null;

  function mostrar(indice) {
    testimonios.forEach((t, i) => t.hidden = i !== indice);
    puntos.forEach((p, i) => p.setAttribute('aria-current', String(i === indice)));
    indiceActual = indice;
  }

  puntos.forEach((punto, i) => {
    punto.addEventListener('click', () => {
      mostrar(i);
      reiniciarAutoplay();
    });
  });

  function avanzar() {
    mostrar((indiceActual + 1) % testimonios.length);
  }

  function reiniciarAutoplay() {
    if (intervalo) clearInterval(intervalo);
    intervalo = setInterval(avanzar, 7000);
  }

  mostrar(0);
  reiniciarAutoplay();
}

/* ---------- 4. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO ----------
   Conectado a una función de Supabase (Edge Function "hyper-action"),
   que guarda el mensaje en la tabla "consultas" y envía una alerta por
   correo vía Resend. Ver GUIA-FORMULARIO-SUPABASE.md para el detalle. */
function iniciarFormulario() {
  const form = document.querySelector('#formulario-contacto');
  if (!form) return;

  const estado = form.querySelector('.formulario__estado');

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores(form);

    const datos = new FormData(form);
    const errores = validar(datos);

    if (Object.keys(errores).length > 0) {
      mostrarErrores(form, errores);
      return;
    }

    const boton = form.querySelector('button[type="submit"]');
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';

    try {
      await enviarFormulario(datos);
      mostrarEstado(estado, 'exito', 'Gracias, recibimos tu mensaje. Te contactaremos a la brevedad.');
      form.reset();
    } catch (error) {
      mostrarEstado(estado, 'error', 'No pudimos enviar tu mensaje. Intenta nuevamente o escríbenos directo por correo.');
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

function validar(datos) {
  const errores = {};
  const nombre = (datos.get('nombre') || '').toString().trim();
  const correo = (datos.get('correo') || '').toString().trim();
  const mensaje = (datos.get('mensaje') || '').toString().trim();

  if (nombre.length < 2) errores.nombre = 'Ingresa tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Ingresa un correo válido.';
  if (mensaje.length < 10) errores.mensaje = 'Cuéntanos un poco más (mínimo 10 caracteres).';

  return errores;
}

function mostrarErrores(form, errores) {
  Object.entries(errores).forEach(([campo, texto]) => {
    const contenedor = form.querySelector(`[data-error-de="${campo}"]`);
    if (contenedor) contenedor.textContent = texto;
    const input = form.querySelector(`[name="${campo}"]`);
    if (input) input.setAttribute('aria-invalid', 'true');
  });
}

function limpiarErrores(form) {
  form.querySelectorAll('[data-error-de]').forEach(el => el.textContent = '');
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  const estado = form.querySelector('.formulario__estado');
  if (estado) {
    estado.className = 'formulario__estado';
    estado.textContent = '';
  }
}

function mostrarEstado(elemento, tipo, texto) {
  if (!elemento) return;
  elemento.className = `formulario__estado ${tipo}`;
  elemento.textContent = texto;
}

// Envía el mensaje a la función de Supabase (guarda en la base de datos
// y dispara la alerta por correo vía Resend).
async function enviarFormulario(datos) {
  const respuesta = await fetch('https://oevrohzugjilhyommkby.supabase.co/functions/v1/hyper-action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'sb_publishable_JYZxaJ7p0CKcZzIoQNIpcw_SkSZK38T',
    },
    body: JSON.stringify({
      nombre: datos.get('nombre'),
      correo: datos.get('correo'),
      empresa: datos.get('empresa'),
      mensaje: datos.get('mensaje'),
    }),
  });
  if (!respuesta.ok) throw new Error('Error al enviar');
}

/* ---------- 5. AÑO AUTOMÁTICO EN EL FOOTER ---------- */
function actualizarAnioFooter() {
  const el = document.querySelector('#anio-actual');
  if (el) el.textContent = new Date().getFullYear();
}
