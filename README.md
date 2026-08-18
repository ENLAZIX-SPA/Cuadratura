# Plantilla — Contabilidad & RR.HH.

Plantilla base en HTML/CSS/JS puro, pensada para reutilizarse en distintos
clientes cambiando solo colores, tipografías, imágenes y textos.

## Estructura de archivos

```
├── index.html          → contenido y estructura
├── css/
│   ├── variables.css    → PANEL DE CONTROL: colores, tipografías, espaciados
│   └── style.css        → layout y componentes (normalmente no se toca)
├── js/
│   └── script.js         → menú móvil, animaciones, testimonios, formulario
└── img/                  → logo y fotos del cliente
```

**Para adaptar el sitio a un cliente nuevo, el 90% de las veces solo editas
`css/variables.css`.** El resto del código usa esas variables, así que el
sitio se re-tiñe y re-tipografía solo.

---

## 1. Cómo elegimos la paleta (y cómo cambiarla bien)

El concepto visual de esta versión es el **libro contable**: fondo color
papel, tinta profunda y un dorado tipo "sello" para los acentos. No es
casualidad — cada color tiene un rol:

| Variable | Rol | Por qué |
|---|---|---|
| `--color-paper` | Fondo principal | Un blanco cálido (no blanco puro) es más cómodo de leer en secciones largas y evita el look "plantilla de PowerPoint". |
| `--color-ink` | Texto y fondos oscuros | Un casi-negro con un matiz, nunca `#000000` puro (el negro puro se ve "duro" en pantalla). |
| `--color-accent` | Botones, links activos, detalles | Es el color que más se repite después del neutro. Debe ser el que "vende" la acción (agendar, enviar). |
| `--color-teal` | Apoyo — RR.HH./crecimiento | Un segundo acento, usado con moderación (íconos, checks), nunca compitiendo con el acento principal. |
| `--color-line` | Líneas divisorias | Un tono intermedio entre el fondo y el texto — las líneas no deben "gritar". |

### La regla de armonía que usamos: cuasi-complementarios

En el círculo cromático, el dorado (`#B8863E`, ~40°) y el verde-azulado tinta
(`#1B2E35` / `#2F6E62`, ~185–200°) están casi enfrentados. Los colores
complementarios (u opuestos) generan el mayor contraste posible sin volverse
caóticos, porque son solo **dos** familias de color, no cinco. Por eso la
plantilla se ve "seria" pero no aburrida: hay tensión visual controlada.

### Reglas simples para cuando cambies la paleta

1. **Máximo 2 colores "con fuerza"** (uno cálido, uno frío) + neutros. Si
   agregas un tercero, que sea solo para estados (éxito/error), no para
   decoración.
2. **60-30-10**: ~60% del sitio en el color de fondo/neutro, ~30% en el color
   de texto/ink, ~10% en el acento. Si el acento aparece en más del 10% del
   sitio, deja de sentirse especial.
3. **Verifica el contraste** de texto sobre fondo (mínimo 4.5:1 para texto
   normal). Herramienta rápida: https://webaim.org/resources/contrastchecker/
4. Elige el acento **según el rubro**, no por gusto personal:
   - Confianza/finanzas → azules profundos, verdes tinta, dorados apagados.
   - Salud/bienestar → verdes suaves, celestes.
   - Creativo/retail → puedes permitirte colores más saturados.

### Ejemplo: cómo se vería para otro rubro (solo cambiando variables.css)

```css
/* Ejemplo: clínica dental → paleta fría, más "clínica" */
--color-paper:  #F3F7F6;
--color-ink:    #16302C;
--color-accent: #2E8B7A;   /* verde-menta como acento único */
--color-teal:   #1B4B6F;   /* azul como apoyo */
```

---

## 2. Tipografía

Tres roles, tres familias (nunca la misma fuente para todo — así cada rol se
distingue de un vistazo):

- **`--font-display` (Fraunces):** títulos. Es una serif con carácter
  editorial — comunica "documento serio" sin ser una serif genérica tipo
  Times.
- **`--font-body` (Inter):** texto de lectura. Neutra, muy legible en
  pantalla, con buen soporte de acentos y ñ.
- **`--font-data` (JetBrains Mono):** cifras, etiquetas, eyebrows. Al ser
  monoespaciada, las columnas de números "cuadran" visualmente — coherente
  con el rubro contable.

Para cambiar de tipografías, reemplaza el `<link>` de Google Fonts en
`index.html` y los tres `--font-*` en `variables.css`.

---

## 3. Qué cambiar por cliente (checklist)

- [ ] `variables.css`: paleta de color (6 valores) y tipografías
- [ ] `index.html`: nombre de marca ("Cuadratura" → nombre real), logo en
      `.marca` (reemplazar `.marca-icono` por `<img>` si hay logo)
- [ ] Textos de servicios, cifras, testimonios y datos de contacto
- [ ] `#formulario-contacto` en `script.js`: conectar `enviarFormulario()` a
      un backend real (Formspree, Google Forms, API propia, etc.) — hoy solo
      simula el envío
- [ ] Meta `<title>` y `<meta name="description">` en `<head>`

## 4. Notas técnicas

- Sin frameworks ni dependencias de build: abre `index.html` directo en el
  navegador, o súbelo a cualquier hosting estático.
- Responsive desde 320px de ancho; el menú se colapsa bajo los 860px.
- Accesibilidad: foco visible, `aria-live` en el formulario, respeta
  `prefers-reduced-motion`.
- El bloque `.tema-tinta` (usado en el footer) invierte papel/tinta para
  crear una franja oscura sin duplicar variables — reutilízalo si quieres
  otra sección con fondo oscuro.
