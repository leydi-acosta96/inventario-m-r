const usuario = JSON.parse(sessionStorage.getItem("usuario"));

// VALIDAR SESIÓN
if(!usuario){
    window.location.href = "index.html";
}

const API_PRODUCTOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/productos";


// CARGA INICIAL
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("usuarioActivo").textContent =
    usuario.nombre || "Administrador";

    mostrarSeccion("inicio");

    cargarAlertas();

});


// CAMBIAR SECCIONES SIDEBAR
function mostrarSeccion(id){

document.querySelectorAll(".seccion")
.forEach(seccion => {
    seccion.style.display = "none";
});

document.getElementById(id).style.display = "block";

}


// NAVEGACIÓN
function irUsuarios(){
    window.location.href = "usuarios.html";
}

function irProductos(){
    window.location.href = "productos.html";
}

function irVentas(){
    window.location.href = "ventas.html";
}

function irInventario(){
    window.location.href = "productos.html";
}


// LOGOUT
function logout(){
    sessionStorage.clear();
    window.location.href = "index.html";
}


// ALERTAS STOCK ADMIN (TODOS)
function cargarAlertas(){

fetch(API_PRODUCTOS)
.then(res => res.json())
.then(data => {

const tabla = document.getElementById("alertasStock");

if(!tabla) return;

tabla.innerHTML = "";

data.productos.forEach(p => {

if(Number(p.stock) <= 5){

tabla.innerHTML += `
<tr>
<td>${p.nombreProducto}</td>
<td>${p.emprendimiento}</td>
<td>${p.stock}</td>
<td style="color:red">Stock Bajo</td>
</tr>
`;

}

});

});

}
