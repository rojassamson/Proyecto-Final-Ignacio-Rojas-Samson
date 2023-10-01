const productoPrecioBruto = new Map([
    ["Leche", 1000],
    ["Mantequilla", 1400],
    ["Jamón", 2100],
    ["Galletas", 900],
    ["Bebida", 1200],
    ["Jugo", 1000],
    ["Mermelada", 800],
    ["Paté", 700]
]);

const carritoCompras = new Map();
const listaProductosElement = document.getElementById('listaProductos');
const carritoListaElement = document.getElementById('carritoLista');
const totalElement = document.getElementById('total');
const verProductosButton = document.getElementById('verProductos');
const productosListaElement = document.getElementById('productosLista');

verProductosButton.addEventListener('click', mostrarProductos);

function mostrarProductos() {
    productosListaElement.style.display = 'block';
    verProductosButton.style.display = 'none';

    productoPrecioBruto.forEach((precio, producto) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${producto}: $${precio}
            <input type="number" id="cantidad-${producto}" placeholder="Cantidad" min="1">
            <button data-producto="${producto}">Agregar al Carrito</button>
        `;
        
        const addButton = listItem.querySelector('button');
        addButton.addEventListener('click', agregarAlCarrito);

        listaProductosElement.appendChild(listItem);
    });
}

function agregarAlCarrito(event) {
    const producto = event.target.getAttribute('data-producto');
    const cantidadInput = document.getElementById(`cantidad-${producto}`);
    const cantidad = parseInt(cantidadInput.value);

    if (!isNaN(cantidad) && cantidad > 0) {
        carritoCompras.set(producto, cantidad);
        cantidadInput.value = ''; // Limpiar el campo de cantidad
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    carritoListaElement.innerHTML = '';

    carritoCompras.forEach((cantidad, producto) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${producto} x${cantidad}`;
        carritoListaElement.appendChild(listItem);
    });

    calcularTotal();
}

function calcularTotalPedido() {
    let totalBruto = 0;

    carritoCompras.forEach((cantidad, producto) => {
        totalBruto += cantidad * productoPrecioBruto.get(producto);
    });

    const iva = totalBruto * 0.19;
    const totalNeto = totalBruto - iva;

    return {
        totalBruto,
        iva,
        totalNeto
    };
}
const carrito = document.getElementById('carrito');
const confirmarPedidoButton = document.getElementById('confirmarPedido');

verProductosButton.addEventListener('click', mostrarProductos);

const pedidoConfirmadoElement = document.getElementById('pedidoConfirmado');
const totalBrutoConfirmadoElement = document.getElementById('totalBrutoConfirmado');
const ivaConfirmadoElement = document.getElementById('ivaConfirmado');
const totalNetoConfirmadoElement = document.getElementById('totalNetoConfirmado');


confirmarPedidoButton.addEventListener('click', () => {
    const totalPedido = calcularTotalPedido();

    totalBrutoConfirmadoElement.textContent = `$${totalPedido.totalBruto}`;
    ivaConfirmadoElement.textContent = `$${totalPedido.iva}`;
    totalNetoConfirmadoElement.textContent = `$${totalPedido.totalNeto}`;

    guardarCarritoEnLocalStorage();
    mostrarPedidoConfirmado();
});

function mostrarPedidoConfirmado() {
    pedidoConfirmadoElement.style.display = 'block';
    carritoCompras.clear();
    actualizarCarrito();
}

const realizarOtraCompraButton = document.getElementById('realizarOtraCompra');

realizarOtraCompraButton.addEventListener('click', reiniciarCompra);

function reiniciarCompra() {
    pedidoConfirmadoElement.style.display = 'none';
    carritoCompras.clear();
    actualizarCarrito();
    ocultarCarrito();
    window.location.reload();
}

const carritosSelect = document.getElementById('carritosSelect');
const cargarCarritoButton = document.getElementById('cargarCarrito');
const carritosGuardadosElement = document.getElementById('carritosGuardados');

cargarCarritoButton.addEventListener('click', () => {
    const carritoSeleccionado = carritosSelect.value;
    cargarCarritoDesdeLocalStorage(carritoSeleccionado);
});


function cargarCarritoDesdeLocalStorage(carritoSeleccionado) {
    const carritosGuardados = JSON.parse(localStorage.getItem('carritosGuardados')) || [];
    const carritoGuardado = carritosGuardados.find(carrito => carrito.nombre === carritoSeleccionado);
    
    if (carritoGuardado) {
        carritoCompras.clear();
        
        for (const [producto, cantidad] of Object.entries(carritoGuardado.contenido)) {
            carritoCompras.set(producto, cantidad);
        }
        
        actualizarCarrito();
        ocultarCarrito();
    }
}

function guardarCarritoEnLocalStorage() {
    const carritosGuardados = JSON.parse(localStorage.getItem('carritosGuardados')) || [];
    
    const carritoParaGuardar = {
        nombre: `Carrito ${carritosGuardados.length + 1}`,
        contenido: {}
    };
    
    carritoCompras.forEach((cantidad, producto) => {
        carritoParaGuardar.contenido[producto] = cantidad;
    });
    
    carritosGuardados.push(carritoParaGuardar);
    localStorage.setItem('carritosGuardados', JSON.stringify(carritosGuardados));
}

function cargarCarritosGuardados() {
    const carritosGuardados = JSON.parse(localStorage.getItem('carritosGuardados')) || [];

    // Mostrar solo los últimos tres carritos guardados
    const carritosMostrados = carritosGuardados.slice(-3);

    if (carritosMostrados.length > 0) {
        carritosSelect.innerHTML = '';
        carritosMostrados.forEach(carrito => {
            const option = document.createElement('option');
            option.textContent = carrito.nombre;
            carritosSelect.appendChild(option);
        });

        // Mostrar el select de carritos guardados y el botón de carga
        carritosGuardadosElement.style.display = 'block';
    } else {
        // Si no hay carritos guardados, mostrar un mensaje
        carritosSelect.innerHTML = '<option value="">No hay carritos guardados</option>';
    }
}

cargarCarritosGuardados();

cargarCarritoButton.addEventListener('click', () => {
    const carritoSeleccionado = carritosSelect.value;
    if (carritoSeleccionado) {
        cargarCarritoDesdeLocalStorage(carritoSeleccionado);
    }
});