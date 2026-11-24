// ==========================================================================
// 1. ESTADO GLOBAL Y LOCALSTORAGE (CARRITO)
// ==========================================================================
const STORAGE_KEY = "mitienda_carrito";
let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let catalogoProductos = [];

// Diccionario de nombres traducidos al español por ID de producto (FakeStoreAPI)
const nombresEnEspanol = {
    1: "Mochila Fjallraven Foldsack No. 1 (15')",
    2: "Remera Casual Manga Corta Slim Fit",
    3: "Campera de Algodón Urbana Hombre",
    4: "Remera Casual Manga Larga Slim Fit",
    5: "Pulsera Dragón Oro y Plata John Hardy",
    6: "Anillo de Oro Sólido Petite Micropave",
    7: "Anillo Princesa Bañado en Oro Blanco",
    8: "Aros Dobles de Acero Quirúrgico Oro Rosa",
    9: "Disco Rígido Externo WD 2TB Elements USB 3.0",
    10: "Disco Sólido SSD SanDisk PLUS 1TB SATA III",
    11: "Disco SSD Silicon Power 256GB 3D NAND A55",
    12: "Disco Rígido WD 4TB Gaming para PlayStation 4",
    13: "Monitor Acer SB220Q 21.5\" Full HD IPS Ultra-Fino",
    14: "Monitor Curvo Gamer Samsung 49\" CHG90 144Hz",
    15: "Campera Térmica 3 en 1 Snowboard para Nieve",
    16: "Campera de Cuero Sintético con Capucha Desmontable",
    17: "Campera Rompevientos Impermeable con Rayas",
    18: "Remera Escote en V Manga Corta para Mujer",
    19: "Remera Deportiva Transpirable Opna",
    20: "Remera Casual de Algodón 'Be Kind' DANVOUY"
};

// Elementos del DOM
const productosContainer = document.getElementById("productos-container");
const loadingIndicator = document.getElementById("loading");
const cartCount = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartToggle = document.getElementById("cart-toggle");
const cartClose = document.getElementById("cart-close");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCheckout = document.getElementById("cart-checkout");

const formContacto = document.getElementById("contacto-form");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const textareaMensaje = document.getElementById("mensaje");
const errorNombre = document.getElementById("error-nombre");
const errorEmail = document.getElementById("error-email");
const errorMensaje = document.getElementById("error-mensaje");
const formStatus = document.getElementById("form-status");

// ==========================================================================
// 2. FETCH API: CONSUMO DE SERVICIO REST
// ==========================================================================
const cargarProductos = async () => {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products");
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const datos = await respuesta.json();

        // Mapeamos los productos aplicando el nombre traducido al español
        catalogoProductos = datos.map((prod) => ({
            ...prod,
            title: nombresEnEspanol[prod.id] || prod.title
        }));

        renderizarProductos(catalogoProductos);
    } catch (error) {
        console.error("Fallo al obtener productos de la API:", error);
        loadingIndicator.textContent = "Hubo un error al cargar los productos. Por favor reintente.";
    } finally {
        if (loadingIndicator && catalogoProductos.length > 0) {
            loadingIndicator.style.display = "none";
        }
    }
};

// Renderizado de tarjetas de producto en el DOM
const renderizarProductos = (productos) => {
    productosContainer.innerHTML = "";
    
    productos.forEach(({ id, title, price, image }) => {
        const article = document.createElement("article");
        article.className = "card-product";
        article.innerHTML = `
            <div class="card-product__img-box">
                <img src="${image}" alt="${title}" loading="lazy">
            </div>
            <h3 class="card-product__title" title="${title}">${title}</h3>
            <span class="card-product__price">$${price.toFixed(2)}</span>
            <button class="btn btn--primary btn-agregar" data-id="${id}">
                Agregar al carrito
            </button>
        `;
        productosContainer.appendChild(article);
    });
};

// ==========================================================================
// 3. LÓGICA DEL CARRITO (LOCALSTORAGE, SUMA, EDICIÓN, BORRADO)
// ==========================================================================
const guardarCarrito = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
};

const actualizarBadge = () => {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.textContent = totalItems;
};

const renderizarCarrito = () => {
    cartItemsContainer.innerHTML = "";

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
        cartTotalElement.textContent = "$0.00";
        actualizarBadge();
        return;
    }

    let total = 0;

    carrito.forEach(({ id, title, price, cantidad }) => {
        const subtotal = price * cantidad;
        total += subtotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <div class="cart-item__info">
                <h4>${title}</h4>
                <p>$${price.toFixed(2)} x ${cantidad} = $${subtotal.toFixed(2)}</p>
            </div>
            <div class="cart-item__controls">
                <button class="cart-item__btn btn-restar" data-id="${id}">-</button>
                <span>${cantidad}</span>
                <button class="cart-item__btn btn-sumar" data-id="${id}">+</button>
                <button class="cart-item__btn btn-eliminar" data-id="${id}">🗑</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    actualizarBadge();
};

const agregarAlCarrito = (productoId) => {
    const producto = catalogoProductos.find(p => p.id === productoId);
    if (!producto) return;

    const index = carrito.findIndex(item => item.id === productoId);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderizarCarrito();
};

const modificarCantidad = (id, delta) => {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        guardarCarrito();
        renderizarCarrito();
    }
};

const eliminarDelCarrito = (id) => {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    renderizarCarrito();
};

// ==========================================================================
// 4. EVENTOS Y DELEGACIÓN
// ==========================================================================
productosContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-agregar")) {
        const id = parseInt(e.target.dataset.id, 10);
        agregarAlCarrito(id);
    }
});

cartItemsContainer.addEventListener("click", (e) => {
    const target = e.target;
    const id = parseInt(target.dataset.id, 10);

    if (target.classList.contains("btn-sumar")) {
        modificarCantidad(id, 1);
    } else if (target.classList.contains("btn-restar")) {
        modificarCantidad(id, -1);
    } else if (target.classList.contains("btn-eliminar")) {
        eliminarDelCarrito(id);
    }
});

const abrirCarrito = () => {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    cartDrawer.setAttribute("aria-hidden", "false");
};

const cerrarCarrito = () => {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    cartDrawer.setAttribute("aria-hidden", "true");
};

cartToggle.addEventListener("click", abrirCarrito);
cartClose.addEventListener("click", cerrarCarrito);
cartOverlay.addEventListener("click", cerrarCarrito);

cartCheckout.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregá productos antes de simular la compra.");
        return;
    }
    alert("¡Compra simulada con éxito! Gracias por tu pedido.");
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    cerrarCarrito();
});

// ==========================================================================
// 5. VALIDACIÓN DE FORMULARIO DE CONTACTO
// ==========================================================================
const esEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();
    let esValido = true;

    if (inputNombre.value.trim() === "") {
        errorNombre.textContent = "El nombre es obligatorio.";
        esValido = false;
    } else {
        errorNombre.textContent = "";
    }

    if (inputEmail.value.trim() === "") {
        errorEmail.textContent = "El correo electrónico es obligatorio.";
        esValido = false;
    } else if (!esEmailValido(inputEmail.value.trim())) {
        errorEmail.textContent = "Ingresá un correo válido.";
        esValido = false;
    } else {
        errorEmail.textContent = "";
    }

    if (textareaMensaje.value.trim() === "") {
        errorMensaje.textContent = "El mensaje no puede estar vacío.";
        esValido = false;
    } else {
        errorMensaje.textContent = "";
    }

    if (!esValido) return;

    formStatus.textContent = "Enviando mensaje...";
    formStatus.style.color = "var(--primary)";

    const formData = new FormData(formContacto);
    try {
        const respuesta = await fetch(formContacto.action, {
            method: formContacto.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (respuesta.ok) {
            formStatus.textContent = "¡Mensaje enviado con éxito!";
            formStatus.style.color = "green";
            formContacto.reset();
        } else {
            formStatus.textContent = "Error al enviar el formulario a Formspree.";
            formStatus.style.color = "red";
        }
    } catch (error) {
        formStatus.textContent = "Error de red al intentar enviar el formulario.";
        formStatus.style.color = "red";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    renderizarCarrito();
});
