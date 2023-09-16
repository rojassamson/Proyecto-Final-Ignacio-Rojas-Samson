const productoPrecioBruto = new Map ([
    ["Leche",1000],
    ["Mantequilla", 1400],
    ["Jamón",2100],
    ["Galletas", 900],
    ["Bebida", 1200],
    ["Jugo", 1000],
    ["Mermelada", 800],
    ["Paté", 700]
]);
const carritoCompras = new Map();
cantidadProductos = 0;
totalNeto = 0
totalBruto = 0;
iva = 0;
listaProductos = 
`
Leche:      $1000
Mantequilla:$1400
Jamón:      $2100
Galletas:   $900
Bebida:     $1200
Jugo:       $1000
Mermelada:  $800
Paté:       $700
`



function llenarCarrito(producto, cantidad) {
    carritoCompras.set(producto, cantidad);
    let seguirComprando = confirm("¿Desea llevar otro producto?");

    if (seguirComprando) {
        let valida = false;

        while(valida == false) {
            producto1 = prompt(listaProductos + "\n¿Que desea llevar? (Escriba el nombre del producto tal cómo aparece en el listado.)");
            validaProducto = parseFloat(producto1);
            if(isNaN(validaProducto) && productoPrecioBruto.has(producto1)) {
                valida = true;
            } else {
                alert("Ingrese el nombre del producto que desea llevar, tal como aparece en el listado. Presione 'Aceptar' para mostrar el listado.");
            }
        }

        valida = false;
        while(valida == false){
            cantidad1 = parseInt(prompt("¿Cuántas unidades desea llevar?"));
            validaCantidad = parseFloat(cantidad1);
            if(!isNaN(validaCantidad)) {
                valida = true;
            } else {
                alert("Ingrese un número válido. Presione 'Aceptar para ingresarlo nuevamente.");
            }
        }
        
        llenarCarrito(producto1, cantidad1);
    } else {
        return;
    }
}

function calculaCantidadProductos() {
    carritoCompras.forEach((valor, clave)=>{
        cantidadProductos += carritoCompras.get(clave);
    });
    return;
}

function calculaPrecioTotal() {
    carritoCompras.forEach((valor, clave)=>{
        totalBruto += carritoCompras.get(clave)*productoPrecioBruto.get(clave);
    });
    totalNeto = Math.round(totalBruto/1.19);
    iva = totalBruto - totalNeto;
    return;
}

function loop() {
    alert("Bienvenido al Minimarket de Conejo, presione 'Aceptar' para ver los productos");
    while(true){
        let valida = false;

        while(valida == false) {
            producto = prompt(listaProductos + "\n¿Que desea llevar? (Escriba el nombre del producto tal cómo aparece en el listado.)");
            validaProducto = parseFloat(producto);
            if(isNaN(validaProducto) && productoPrecioBruto.has(producto)) {
                valida = true;
            } else {
                alert("Ingrese el nombre del producto que desea llevar, tal como aparece en el listado. Presione 'Aceptar' para mostrar el listado.");
            }
        }

        valida = false;
        while(valida == false){
            cantidad = parseInt(prompt("¿Cuántas unidades desea llevar?"));
            validaCantidad = parseFloat(cantidad);
            if(!isNaN(validaCantidad)) {
                valida = true;
            } else {
                alert("Ingrese un número válido. Presione 'Aceptar para ingresarlo nuevamente.");
            }
        }

        llenarCarrito(producto, cantidad);
        alert("Presione 'Aceptar' para calcular la boleta.");
        calculaCantidadProductos();
        calculaPrecioTotal();
        
        alert(
            `
            Cantidad de productos:  ${cantidadProductos}

            Neto:       ${totalNeto}
            IVA(19%):   ${iva}
            Total:      ${totalBruto}
            `);
        break;
    }
}

loop();

