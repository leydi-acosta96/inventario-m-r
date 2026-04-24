const usuario = JSON.parse(sessionStorage.getItem("usuario"));

// VALIDAR SESIÓN
if(!usuario){
    window.location.href = "index.html";
}

//const API_PRODUCTOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/productos";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("nombreEmprendimiento").textContent =
    usuario.emprendimiento;

    cargarAlertas();

});

function irProductos(){
    window.location.href = "productos.html";
}

function irVentas(){
    window.location.href = "ventas.html";
}

function irInventario(){
    window.location.href = "productos.html";
}

function logout(){
    sessionStorage.clear();
    window.location.href = "index.html";
}


// ALERTAS STOCK
function cargarAlertas(){

fetch(API_PRODUCTOS)
.then(res => res.json())
.then(data => {

const tabla = document.getElementById("alertasStock");
tabla.innerHTML = "";

data.productos.forEach(p => {

if(
p.emprendimiento === usuario.emprendimiento &&
Number(p.stock) <= 5
){

tabla.innerHTML += `
<tr>
<td>${p.nombreProducto}</td>
<td>${p.stock}</td>
<td style="color:red">Stock Bajo</td>
</tr>
`;

}

});

});

}