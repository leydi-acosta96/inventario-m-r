const API_PRODUCTOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/productos";
const API_USUARIOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/usuarios";

const usuario = JSON.parse(sessionStorage.getItem("usuario"));


// VALIDAR SESIÓN
if (!usuario) {
    window.location.href = "index.html";
}

const rol = usuario.rol.trim().toLowerCase();


// PERMITIR SOLO ADMIN Y EMPRENDEDORA
if (rol !== "admin" && rol !== "emprendedora") {
    alert("No tienes acceso a productos");
    window.location.href = "index.html";
}


// ELEMENTOS
const formProducto = document.getElementById("formProducto");
const selectCategoria = document.getElementById("categoriaProducto");
const inputCodigo = document.getElementById("codigoProducto");
const selectEmprendimiento = document.getElementById("emprendimiento");


// PREFIJOS CATEGORÍA
const categoriasCodigo = {
    "Accesorios": "ACC",
    "Ropa": "ROP",
    "Cosmetica": "COS",
    "Vestidos de baño": "VDB"
};


// EVENTOS
document.addEventListener("DOMContentLoaded", () => {

    configurarFormulario();
    cargarProductos();

});

formProducto.addEventListener("submit", guardarProducto);

document.getElementById("buscarProducto")
.addEventListener("keyup", buscarProducto);

selectCategoria.addEventListener("change", generarCodigoProducto);


// MOSTRAR FORMULARIO
function mostrarFormulario() {

    const form = document.getElementById("formProducto");

    form.style.display =
        form.style.display === "block"
        ? "none"
        : "block";

}


// CONFIGURAR FORMULARIO SEGÚN ROL
function configurarFormulario() {

    // EMPRENDEDORA
    if (rol === "emprendedora") {

        selectEmprendimiento.innerHTML = `
            <option value="${usuario.emprendimiento}">
                ${usuario.emprendimiento}
            </option>
        `;

        selectEmprendimiento.disabled = true;

    }

    // ADMIN
    if (rol === "admin") {
        cargarEmprendimientos();
    }

}


// CARGAR EMPRENDIMIENTOS
function cargarEmprendimientos() {

    fetch(API_USUARIOS)
    .then(res => res.json())
    .then(data => {

        selectEmprendimiento.innerHTML =
        `<option value="">Seleccionar</option>`;

        data.usuarios.forEach(u => {

            if (
                u.rol &&
                u.rol.toLowerCase() === "emprendedora"
            ) {

                selectEmprendimiento.innerHTML += `
                    <option value="${u.emprendimiento}">
                        ${u.emprendimiento}
                    </option>
                `;

            }

        });

    })
    .catch(error => {
        console.error("Error cargando emprendimientos:", error);
    });

}


// GENERAR CÓDIGO PRODUCTO
function generarCodigoProducto() {

    const categoria = selectCategoria.value;

    if (!categoria) {
        inputCodigo.value = "";
        return;
    }

    const prefijo = categoriasCodigo[categoria];

    fetch(API_PRODUCTOS)
    .then(res => res.json())
    .then(data => {

        // FILTRAR PRODUCTOS DE ESA CATEGORÍA
        const productosCategoria = data.productos.filter(p =>
            p.categoriaProducto === categoria
        );

        // GENERAR CONSECUTIVO
        const consecutivo = productosCategoria.length + 1;

        // FORMATO 001
        const numero = String(consecutivo).padStart(3, "0");

        // CÓDIGO FINAL
        inputCodigo.value = `${prefijo}-${numero}`;

    })
    .catch(error => {
        console.error("Error generando código:", error);
    });

}


// GUARDAR PRODUCTO
function guardarProducto(e) {

    e.preventDefault();

    // VALIDAR EMPRENDIMIENTO
    let emprendimientoFinal = "";

    // SI ES EMPRENDEDORA
    if (rol === "emprendedora") {

        emprendimientoFinal = usuario.emprendimiento;

    } else {

        // SI ES ADMIN
        emprendimientoFinal = selectEmprendimiento.value;

    }

    // VALIDAR
    if (!emprendimientoFinal) {

        alert("Seleccione un emprendimiento");

        return;

    }

    const producto = {

        producto: {

            codigoProducto: inputCodigo.value,

            nombreProducto:
            document.getElementById("nombreProducto").value,

            emprendimiento: emprendimientoFinal,

            categoriaProducto: selectCategoria.value,

            precioProducto:
            document.getElementById("precioProducto").value,

            stock:
            document.getElementById("stock").value,

            estadoProducto:
            document.getElementById("estadoProducto").value

        }

    };


    fetch(API_PRODUCTOS, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(producto)

    })
    .then(res => res.json())
    .then(() => {

        alert("Producto guardado correctamente");

        formProducto.reset();

        inputCodigo.value = "";

        // RESTAURAR EMPRENDIMIENTO EMPRENDEDORA
        if (rol === "emprendedora") {

            selectEmprendimiento.innerHTML = `
                <option value="${usuario.emprendimiento}">
                    ${usuario.emprendimiento}
                </option>
            `;

        }

        cargarProductos();

    })
    .catch(error => {

        console.error("Error guardando producto:", error);

        alert("Error al guardar producto");

    });

}


// CARGAR PRODUCTOS
function cargarProductos() {

    fetch(API_PRODUCTOS)
    .then(res => res.json())
    .then(data => {

        const tabla =
        document.getElementById("tablaProductos");

        tabla.innerHTML = "";

        data.productos.forEach(p => {

            // FILTRAR EMPRENDEDORA
            if (
                rol === "emprendedora" &&
                p.emprendimiento !== usuario.emprendimiento
            ) {
                return;
            }

            tabla.innerHTML += `
                <tr>
                    <td>${p.codigoProducto}</td>
                    <td>${p.nombreProducto}</td>
                    <td>${p.categoriaProducto}</td>
                    <td>${p.stock}</td>
                    <td>${p.precioProducto}</td>
                    <td>${p.emprendimiento}</td>
                    <td>${p.estadoProducto}</td>
                </tr>
            `;

        });

    })
    .catch(error => {

        console.error("Error cargando productos:", error);

    });

}


// BUSCAR PRODUCTOS
function buscarProducto() {

    const filtro = document
    .getElementById("buscarProducto")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#tablaProductos tr")
    .forEach(fila => {

        fila.style.display =
        fila.textContent.toLowerCase().includes(filtro)
        ? ""
        : "none";

    });

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
