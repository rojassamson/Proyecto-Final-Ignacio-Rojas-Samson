$(document).ready(function() {
    // Variables
    const carritoCompras = new Map();
    const listaProductosElement = $('#listaProductos');
    const carritoListaElement = $('#carritoLista');
    const totalBrutoElement = $('#totalBruto');
    const ivaElement = $('#iva');
    const totalNetoElement = $('#totalNeto');
    const verProductosButton = $('#verProductos');
    const productosListaElement = $('#productosLista');
    const carritosSelect = $('#carritosSelect');
    const cargarCarritoButton = $('#cargarCarrito');
    const pedidoConfirmadoElement = $('#pedidoConfirmado');
    const totalBrutoConfirmadoElement = $('#totalBrutoConfirmado');
    const ivaConfirmadoElement = $('#ivaConfirmado');
    const totalNetoConfirmadoElement = $('#totalNetoConfirmado');
    const realizarOtraCompraButton = $('#realizarOtraCompra');
    const recargarPaginaButton = $('#recargarPagina');
    let productos; // Variable para almacenar los productos cargados

    // Cargar productos desde un archivo JSON local usando Fetch
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data; // Almacena los productos en la variable productos
            mostrarProductos(productos);
        });

    function mostrarProductos(productos) {
        productosListaElement.show();
        verProductosButton.hide();

        productos.forEach(producto => {
            const listItem = $(`
                <li>${producto.nombre}: $${producto.precio}
                    <input type="number" class="cantidad" data-producto="${producto.nombre}" placeholder="Cantidad" min="1">
                    <button class="agregar" data-producto="${producto.nombre}">Agregar al Carrito</button>
                </li>
            `);

            listaProductosElement.append(listItem);

            // Manejar el evento de agregar al carrito
            listItem.find('.agregar').click(function() {
                const producto = $(this).data('producto');
                const cantidadInput = listItem.find('.cantidad');
                const cantidad = parseInt(cantidadInput.val());

                if (!isNaN(cantidad) && cantidad > 0) {
                    carritoCompras.set(producto, cantidad);
                    cantidadInput.val(''); // Limpiar el campo de cantidad
                    actualizarCarrito();
                }
            });
        });
    }

    function actualizarCarrito() {
        carritoListaElement.empty();
    
        let totalBruto = 0;  // Inicializa el total bruto a 0
    
        carritoCompras.forEach((cantidad, producto) => {
            const listItem = $(`<li>${producto} x${cantidad}</li>`);
            carritoListaElement.append(listItem);
    
            // Calcula el subtotal para cada producto y súmalo al total bruto
            const productoEncontrado = productos.find(item => item.nombre === producto);
            if (productoEncontrado) {
                totalBruto += cantidad * productoEncontrado.precio;
            }
        });
    
        // Actualiza el total bruto en el elemento HTML
        $('#totalBruto').text(totalBruto);
    }

    function calcularTotalPedido(productos) {
        let totalBruto = 0;
    
        carritoCompras.forEach((cantidad, producto) => {
            const productoSeleccionado = productos.find(item => item.nombre === producto);
    
            if (productoSeleccionado) {
                const precioBruto = productoSeleccionado.precio;
                totalBruto += cantidad * precioBruto;
            }
        });
    
        const iva = totalBruto * 0.19;
        const totalNeto = totalBruto - iva;
    
        return {
            totalBruto: totalBruto,
            iva: iva,
            totalNeto: totalNeto
        };
    }

    // Manejar el evento de confirmar pedido
    $('#confirmarPedido').click(function() {
        const totalPedido = calcularTotalPedido(productos);

        totalBrutoConfirmadoElement.text(+ totalPedido.totalBruto);
        ivaConfirmadoElement.text(totalPedido.iva);
        totalNetoConfirmadoElement.text(totalPedido.totalNeto);

        pedidoConfirmadoElement.show();
        
        guardarCarritoEnLocalStorage();
        carritoCompras.clear();
        actualizarCarrito();

        mostrarBotonRecargar();
    });

    function mostrarBotonRecargar() {
        recargarPaginaButton.show();
        recargarPaginaButton.click(function() {
            location.reload();
        });
    }

    function ocultarCarrito() {
        carritoListaElement.hide();
        totalBrutoElement.hide();
        ivaElement.hide();
        totalNetoElement.hide();
    }

    // Manejar el evento de realizar otra compra
    realizarOtraCompraButton.click(function() {
        pedidoConfirmadoElement.hide();
        carritoCompras.clear();
        actualizarCarrito();
        ocultarCarrito();
    });

    cargarCarritosGuardados();

    // Manejar el evento de cargar carrito desde el almacenamiento local
    cargarCarritoButton.click(function() {
        const carritoSeleccionado = carritosSelect.val();
        if (carritoSeleccionado) {
            cargarCarritoDesdeLocalStorage(carritoSeleccionado);
        }
    });

    function cargarCarritosGuardados() {
        const carritosGuardadosElement = $('#carritosGuardados');
        
        const carritosGuardados = JSON.parse(localStorage.getItem('carritosGuardados')) || [];

        // Mostrar solo los últimos tres carritos guardados
        const carritosMostrados = carritosGuardados.slice(-3);

        if (carritosMostrados.length > 0) {
            carritosSelect.empty();
            carritosMostrados.forEach(carrito => {
                carritosSelect.append($('<option>').text(carrito.nombre));
            });

            // Mostrar el select de carritos guardados y el botón de carga
            carritosGuardadosElement.show();
        } else {
            // Si no hay carritos guardados, mostrar un mensaje
            carritosSelect.html('<option value="">No hay carritos guardados</option>');
        }
    }

    function guardarCarritoEnLocalStorage() {
    
        // Llena carritoCompras con los productos actuales
    
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

    function cargarCarritoDesdeLocalStorage(carritoSeleccionado) {
        const carritosGuardados = JSON.parse(localStorage.getItem('carritosGuardados')) || [];
        const carritoGuardado = carritosGuardados.find(carrito => carrito.nombre === carritoSeleccionado);
    
        if (carritoGuardado) {
            carritoCompras.clear();
    
            for (const [producto, cantidad] of Object.entries(carritoGuardado.contenido)) {
                carritoCompras.set(producto, cantidad);
            }
    
            actualizarCarrito();
        }
    }
    
});

