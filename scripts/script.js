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
var cantidadProductos = 0;
var totalNeto = 0
var totalBruto = 0;
var iva = 0;
var listaProductos = 
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
            var producto1 = prompt(listaProductos + "\n¿Que desea llevar? (Escriba el nombre del producto tal cómo aparece en el listado.)");
            if (producto1 !== null) {
                valida = true;
            }
        }

        valida = false;
        while(valida == false){
            var cantidad1 = parseInt(prompt("¿Cuántas unidades desea llevar?"));
            if (cantidad1 !== null){
                valida = true;
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
            var producto = prompt(listaProductos + "\n¿Que desea llevar? (Ingrese el número que corresponda)");
            if (producto !== null) {
                valida = true;
            }
        }

        valida = false;
        while(valida == false){
            var cantidad = parseInt(prompt("¿Cuántas unidades desea llevar?"));
            console.log(cantidad);
            if (cantidad !== null){
                valida = true;
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

