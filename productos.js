const API_PRODUCTOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/productos";
const API_USUARIOS = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/usuarios";

const usuario = JSON.parse(sessionStorage.getItem("usuario"));
   
	// VALIDAR SESIÓN
 if(!usuario){ 
	window.location.href = "index.html";
 }
  

const rol = usuario.rol.trim().toLowerCase();

  	// PERMITIR SOLO ADMIN Y EMPRENDEDORA
       
 if(rol !== "admin" && rol !== "emprendedora"){ 
alert("No tienes acceso a productos");
window.location.href = "index.html"; 
}      

document.addEventListener("DOMContentLoaded", () => {
configurarFormulario();
cargarProductos();
});

document.getElementById("formProducto")
.addEventListener("submit", guardarProducto);

  
document.getElementById("buscarProducto") 
.addEventListener("keyup", buscarProducto);   

// MOSTRAR FORMULARIO 
function mostrarFormulario(){ 
const form = document.getElementById("formProducto"); 
form.style.display = form.style.display === "block" ? "none" : "block"; 
}

// CONFIGURAR SEGUN ROL
function configurarFormulario(){
	const select = document.getElementById("emprendimiento");
		
		if(rol === "emprendedora"){
		 select.innerHTML = `<option value="${usuario.emprendimiento}">
		 ${usuario.emprendimiento}
		 </option>`;
		 
			select.disabled = true; 
		 }

		if(rol === "admin"){
		 cargarEmprendimientos();
		 } 
		}

	// CARGAR EMPRENDIMIENTOS 
function cargarEmprendimientos(){

fetch(API_USUARIOS)
.then(res => res.json())
.then(data => {
const select = document.getElementById("emprendimiento"); 
select.innerHTML = `<option value="">Seleccionar</option>`;

data.usuarios.forEach(u => {
	if(u.rol && u.rol.toLowerCase() === "emprendedora"){
	select.innerHTML +=
		`<option value="${u.emprendimiento}">
	${u.emprendimiento}
	</option>`;
}

});

});

}

	// GUARDAR PRODUCTO
function guardarProducto(e){
e.preventDefault();


const producto = {
producto:{
codigoProducto: document.getElementById("codigoProducto").value,
codigoProducto: document.getElementById("codigoProducto").value,
emprendimiento: document.getElementById("emprendimiento").value,
categoriaProducto:
document.getElementById("categoriaProducto").value,
precioProducto: document.getElementById("precioProducto").value,
stock: document.getElementById("stock").value,
estadoProducto: document.getElementById("estadoProducto").value
} 
};


fetch(API_PRODUCTOS,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(producto)
})
.then(()=>{
alert("Producto guardado");
document.getElementById("formProducto").reset();
cargarProductos();
});

}

	// CARGAR PRODUCTOS


function cargarProductos(){

fetch(API_PRODUCTOS)
.then(res=>res.json())
.then(data=>{


const tabla = document.getElementById("tablaProductos");
tabla.innerHTML = "";

data.productos.forEach(p=>{

if(rol === "emprendedora" &&
p.emprendimiento !== usuario.emprendimiento){
return;

}

tabla.innerHTML += <tr> 
<td>${p.codigoProducto}</td> 
<td>${p.nombreProducto}</td> 
<td>${p.categoriaProducto}</td> 
<td>${p.precioProducto}</td> 
<td>${p.stock}</td> 
<td>${p.emprendimiento}</td> 
<td>${p.estadoProducto}</td> 
</tr> 
;

}); 

});
 
}

	// BUSCAR


function buscarProducto(){
const filtro = document
.getElementById("buscarProducto")
.value.toLowerCase();


document.querySelectorAll("#tablaProductos tr")
.forEach(fila => {

fila.style.display =
fila.textContent.toLowerCase().includes(filtro)
? "" : "none";

});

}

function volverPagina(){
	window.history.back();
}

function logout(){ 
sessionStorage.clear();
 window.location.href = "index.html"; 
}
























	
		                                                                                                                                                   
