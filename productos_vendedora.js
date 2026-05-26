const API_PRODUCTOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

document.addEventListener(
"DOMContentLoaded",
async()=>{

const usuario=
JSON.parse(
sessionStorage.getItem("usuario")
);

if(!usuario){

location.href="index.html";
return;

}

await cargarProductos();

});

async function cargarProductos(){

try{

const res=
await fetch(API_PRODUCTOS);

const data=
await res.json();

const productos=
data.productos||[];

renderTabla(productos);

}
catch(error){

console.log(error);

}

}

function renderTabla(productos){

const tabla=
document.getElementById(
"tablaProductos"
);

tabla.innerHTML="";

productos.forEach(p=>{

tabla.innerHTML+=`

<tr>

<td>
${p.codigoProducto}
</td>

<td>
${p.nombreProducto}
</td>

<td>
${p.emprendedora}
</td>

<td>
${p.categoriaProducto}
</td>

<td>
${p.precioProducto}
</td>

<td>
${p.stock}
</td>

<td>
${p.estadoProducto}
</td>

</tr>

`;

});

}

function volver(){

history.back();

}

function cerrarSesion(){

sessionStorage.clear();

location.href="index.html";

}
