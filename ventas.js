//const API_USUARIOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/usuarios";
//const usuario = JSON.parse(sessionStorage.getItem("usuario"));

//const API_PRODUCTOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/productos";
//const API_VENTAS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/ventas";

let carrito = [];
let productos = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});


// CARGAR PRODUCTOS
function cargarProductos(){

fetch(API_PRODUCTOS)
.then(res => res.json())
.then(data => {

productos = data.productos;

cargarEmprendimientos();
cargarSelectProductos();

});

}


// CARGAR EMPRENDIMIENTOS
function cargarEmprendimientos(){

fetch(API_USUARIOS)
.then(res => res.json())
.then(data => {

const select = document.getElementById("emprendimientoVenta");

select.innerHTML = `<option value="">Seleccionar</option>`;

data.usuarios.forEach(u => {

if(u.rol === "emprendedora"){

select.innerHTML += `
<option value="${u.emprendimiento}">
${u.emprendimiento}
</option>
`;

}

});

});

}

// CAMBIO EMPRENDIMIENTO
document.getElementById("emprendimientoVenta")
.addEventListener("change", cargarSelectProductos);


// CARGAR PRODUCTOS SEGÚN EMPRENDIMIENTO
function cargarSelectProductos(){

const emprendimiento = 
document.getElementById("emprendimientoVenta").value;

const select = document.getElementById("productoVenta");
select.innerHTML = `<option value="">Seleccionar producto</option>`;

productos.forEach(p => {

if(!emprendimiento || p.emprendimiento === emprendimiento){

select.innerHTML += `
<option value="${p.id}">
${p.nombreProducto} - $${p.precioProducto}
</option>
`;

}

});

}


// AGREGAR PRODUCTO
function agregarProducto(){

const id = document.getElementById("productoVenta").value;
const cantidad = Number(document.getElementById("cantidadVenta").value);

if(!id || !cantidad) return;

const producto = productos.find(p => p.id == id);

const total = cantidad * Number(producto.precioProducto);

carrito.push({
id: producto.id,
codigo: producto.codigoProducto,
nombre: producto.nombreProducto,
emprendimiento: producto.emprendimiento,
cantidad,
precio: producto.precioProducto,
total
});

renderCarrito();

}


// RENDER CARRITO
function renderCarrito(){

const tabla = document.getElementById("detalleVenta");
tabla.innerHTML = "";

let totalVenta = 0;

carrito.forEach((item,index)=>{

totalVenta += item.total;

tabla.innerHTML += `
<tr>
<td>${item.emprendimiento}</td>
<td>${item.nombre}</td>
<td>${item.cantidad}</td>
<td>$${item.precio}</td>
<td>$${item.total}</td>
<td>
<button onclick="eliminarItem(${index})">X</button>
</td>
</tr>
`;

});

document.getElementById("totalVenta").textContent = totalVenta;

}


// ELIMINAR ITEM
function eliminarItem(index){
carrito.splice(index,1);
renderCarrito();
}


// REGISTRAR VENTA
document.getElementById("btnRegistrarVenta")
.addEventListener("click", async () => {

const canalVenta = document.getElementById("medioVenta").value;

for(const item of carrito){

// GUARDAR VENTA
await fetch(API_VENTAS,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
venta:{
productoId:item.id,
codigoProducto:item.codigo,
cantidad:item.cantidad,
canalVenta:canalVenta,
fechaVenta:new Date().toISOString().split("T")[0],
emprendedora:usuario.nombre,
total:item.total
}
})
});

// DESCONTAR STOCK
const producto = productos.find(p => p.id == item.id);
const nuevoStock = Number(producto.stock) - item.cantidad;

await fetch(`${API_PRODUCTOS}/${producto.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
producto:{
stock:nuevoStock
}
})
});

if(nuevoStock <= 5){
alert("Stock bajo de " + producto.nombreProducto);
}

}

alert("Venta registrada correctamente");

carrito = [];
renderCarrito();

});

function volverPagina(){
    window.history.back();
}

function logout(){
    sessionStorage.clear();
    window.location.href = "index.html";
}