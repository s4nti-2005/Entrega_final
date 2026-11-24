# 🛍️ MiTienda

¡Hola! Este es mi proyecto final para el curso de **Front-End JS de Talento Tech / Talento Lab**.

La idea fue construir una tienda online real desde cero usando únicamente HTML, CSS y JavaScript puro (Vanilla JS). El proyecto conecta con una API externa para traer los productos dinámicamente, permite armar un carrito de compras que no se borra al recargar la página y cuenta con un formulario de contacto listo para recibir mensajes.

---

## ✨ ¿Qué se puede hacer en la tienda?

- **Explorar el catálogo:** Los productos se cargan en tiempo real desde la API de _FakeStoreAPI_. Si la conexión tarda o falla, la interfaz avisa al usuario con estados de carga y mensajes de error claros.
- **Gestionar el carrito:** Podés sumar productos desde las tarjetas, modificar cantidades (`+` / `-`), eliminar ítems puntuales y ver el total actualizado al instante junto con un contador en el menú.
- **No perder tu compra:** Todo lo que agregues se guarda automáticamente en `localStorage`, así que podés cerrar la pestaña y volver más tarde sin perder el carrito. Además, incluye una simulación de compra que vacía el carrito y confirma el pedido.
- **Contactar:** El formulario valida en tiempo real que los campos estén completos y que el email sea válido antes de enviarse a través de _Formspree_.

---

## 🛠️ Cómo está construido por dentro

Para darle forma al proyecto me enfoqué en mantener el código ordenado y aplicar buenas prácticas de desarrollo web:

- **Estructura y Accesibilidad:** Todo el sitio está maquetado con HTML5 semántico (`header`, `main`, `section`, `article`, etc.). También sumé etiquetas `aria-*`, textos alternativos (`alt`), metaetiquetas para SEO y un _skip-link_ para facilitar la navegación con teclado[cite: 1].
- **Estilos y Diseño Responsivo:** Trabajé con variables CSS, tipografía _Inter_ de Google Fonts y degradados en la sección principal (_Hero_). Para que se vea bien en cualquier pantalla (con puntos de corte en `768px` y `480px`), combiné **Flexbox** en la grilla de productos y **CSS Grid** en la sección de reseñas.
- **Contenido Multimedia:** Integré un reproductor de video nativo y un mapa interactivo mediante `<iframe>`
