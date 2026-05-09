const API_USUARIOS =
"https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/usuarios";

const API_PRODUCTOS =
"https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/productos";

const API_VENTAS =
"https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/ventas";


// USUARIO ACTIVO
const usuario =
JSON.parse(sessionStorage.getItem("usuario"));


// VALIDAR SESIÓN
if (!usuario) {

    window.location.href = "index.html";

}


// VALIDAR ROL
const rol = usuario.rol.toLowerCase();

if (

    rol !== "admin" &&

    rol !== "vendedora" &&

    rol !== "emprendedora"

) {

    alert("No tienes acceso");

    window.location.href = "index.html";

}


// VARIABLES
let carrito = [];

let productos = [];


// INICIO
document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});


// EVENTOS
document.getElementById("emprendimientoVenta")
.addEventListener("change", cargarSelectProductos);


document.getElementById("buscarProductoVenta")
.addEventListener("keyup", filtrarProductos);


document.getElementById("btnRegistrarVenta")
.addEventListener("click", registrarVenta);


// CARGAR PRODUCTOS
function cargarProductos() {

    fetch(API_PRODUCTOS)

    .then(res => res.json())

    .then(data => {

        productos = data.productos;

        cargarEmprendimientos();

        cargarSelectProductos();

    })

    .catch(error => {

        console.error(
        "Error cargando productos:",
        error
        );

    });

}


// CARGAR EMPRENDIMIENTOS
function cargarEmprendimientos() {

    const select =
    document.getElementById("emprendimientoVenta");


    // EMPRENDEDORA
    if (rol === "emprendedora") {

        select.innerHTML = `

            <option value="${usuario.emprendimiento}">

                ${usuario.emprendimiento}

            </option>

        `;

        select.value =
        usuario.emprendimiento;

        // BLOQUEAR
        select.style.pointerEvents = "none";

        select.style.background = "#f5f5f5";

        cargarSelectProductos();

        return;

    }


    // ADMIN Y VENDEDORA
    fetch(API_USUARIOS)

    .then(res => res.json())

    .then(data => {

        select.innerHTML =
        `<option value="">Seleccionar</option>`;

        data.usuarios.forEach(u => {

            if (

                u.rol &&

                u.rol.toLowerCase() === "emprendedora"

            ) {

                select.innerHTML += `

                    <option value="${u.emprendimiento}">

                        ${u.emprendimiento}

                    </option>

                `;

            }

        });

    })

    .catch(error => {

        console.error(
        "Error cargando emprendimientos:",
        error
        );

    });

}


// CARGAR PRODUCTOS SEGÚN EMPRENDIMIENTO
function cargarSelectProductos() {

    const emprendimiento =

    document.getElementById("emprendimientoVenta")
    .value;


    const select =
    document.getElementById("productoVenta");


    select.innerHTML =
    `<option value="">Seleccionar producto</option>`;


    productos.forEach(p => {

        // IMPORTANTE:
        // LA COLUMNA PRODUCTOS ES:
        // emprendedora

        if (

            !emprendimiento ||

            p.emprendedora === emprendimiento

        ) {

            select.innerHTML += `

                <option value="${p.id}">

                    ${p.nombreProducto}
                    -
                    $${p.precioProducto}

                </option>

            `;

        }

    });

}


// FILTRAR PRODUCTOS
function filtrarProductos() {

    const texto =

    document.getElementById("buscarProductoVenta")
    .value
    .toLowerCase();


    const emprendimiento =

    document.getElementById("emprendimientoVenta")
    .value;


    const select =
    document.getElementById("productoVenta");


    select.innerHTML =
    `<option value="">Seleccionar producto</option>`;


    productos.forEach(p => {

        if (

            (!emprendimiento ||

            p.emprendedora === emprendimiento)

            &&

            p.nombreProducto
            .toLowerCase()
            .includes(texto)

        ) {

            select.innerHTML += `

                <option value="${p.id}">

                    ${p.nombreProducto}
                    -
                    $${p.precioProducto}

                </option>

            `;

        }

    });

}


// AGREGAR PRODUCTO
function agregarProducto() {

    const id =
    document.getElementById("productoVenta").value;


    const cantidad =

    Number(
        document.getElementById("cantidadVenta")
        .value
    );


    // VALIDAR
    if (!id || !cantidad) {

        alert("Seleccione producto y cantidad");

        return;

    }


    const producto =
    productos.find(p => p.id == id);


    // VALIDAR STOCK
    if (cantidad > Number(producto.stock)) {

        alert("Stock insuficiente");

        return;

    }


    // CALCULAR TOTAL
    const total =
    cantidad * Number(producto.precioProducto);


    // AGREGAR AL CARRITO
    carrito.push({

        id: producto.id,

        codigo:
        producto.codigoProducto,

        nombre:
        producto.nombreProducto,

        emprendimiento:
        producto.emprendedora,

        cantidad,

        precio:
        Number(producto.precioProducto),

        total

    });


    // RENDER
    renderCarrito();

}


// RENDER CARRITO
function renderCarrito() {

    const tabla =
    document.getElementById("detalleVenta");


    tabla.innerHTML = "";


    let totalVenta = 0;


    carrito.forEach((item,index) => {

        totalVenta += item.total;

        tabla.innerHTML += `

            <tr>

                <td>${item.emprendimiento}</td>

                <td>${item.nombre}</td>

                <td>${item.cantidad}</td>

                <td>$${item.precio}</td>

                <td>$${item.total}</td>

                <td>

                    <button
                    onclick="eliminarItem(${index})">

                    X

                    </button>

                </td>

            </tr>

        `;

    });


    document.getElementById("totalVenta")
    .textContent = totalVenta;

}


// ELIMINAR ITEM
function eliminarItem(index) {

    carrito.splice(index,1);

    renderCarrito();

}


// REGISTRAR VENTA
async function registrarVenta() {

    // VALIDAR CARRITO
    if (carrito.length === 0) {

        alert("Agregue productos");

        return;

    }


    const canalVenta =
    document.getElementById("medioVenta").value;


    try {

        for (const item of carrito) {

            // GUARDAR VENTA
            await fetch(API_VENTAS, {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    venta: {

                        productoId:
                        item.id,

                        codigoProducto:
                        item.codigo,

                        nombreProducto:
                        item.nombre,

                        emprendimiento:
                        item.emprendimiento,

                        cantidad:
                        item.cantidad,

                        canalVenta:
                        canalVenta,

                        fechaVenta:
                        new Date()
                        .toISOString()
                        .split("T")[0],

                        horaVenta:
                        new Date()
                        .toLocaleTimeString(),

                        vendedorNombre:
                        usuario.nombre,

                        vendedorRol:
                        usuario.rol,

                        vendedorCodigo:
                        usuario.codigoAcceso || "",

                        total:
                        item.total

                    }

                })

            });


            // BUSCAR PRODUCTO
            const producto =
            productos.find(p => p.id == item.id);


            // NUEVO STOCK
            const nuevoStock =

            Number(producto.stock)

            -

            item.cantidad;


            // ACTUALIZAR STOCK
            await fetch(`${API_PRODUCTOS}/${producto.id}`, {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    producto: {

                        stock: nuevoStock

                    }

                })

            });


            // ALERTA STOCK
            if (nuevoStock <= 5) {

                alert(
                "Stock bajo de "
                +
                producto.nombreProducto
                );

            }

        }


        // MENSAJE
        alert("Venta registrada correctamente");


        // LIMPIAR
        carrito = [];


        renderCarrito();


        document.getElementById("cantidadVenta")
        .value = "";


        cargarProductos();

    }

    catch(error) {

        console.error(
        "Error registrando venta:",
        error
        );

        alert("Error al registrar venta");

    }

}


// VOLVER
function volverPagina() {

    window.history.back();

}


// LOGOUT
function logout() {

    sessionStorage.clear();

    window.location.href = "index.html";

}
