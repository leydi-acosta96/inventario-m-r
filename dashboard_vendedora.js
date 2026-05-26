const API_VENTAS=
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/ventas";

const API_PRODUCTOS=
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

let panelVisible=false;

document.addEventListener(
"DOMContentLoaded",
()=>{

const usuario=
JSON.parse(
sessionStorage
.getItem("usuario")
);

if(!usuario){

location.href=
"index.html";

return;

}

if(

usuario.rol
.toLowerCase()

!=="vendedora"

){

location.href=
"index.html";

}

});



async function mostrarMisVentas(){

const panel=

document.getElementById(
"panelVentas"
);


panelVisible=

!panelVisible;


panel.style.display=

panelVisible

?

"block"

:

"none";


if(

!panelVisible

)

return;


const usuario=

JSON.parse(

sessionStorage
.getItem(
"usuario"
)

);


const ventas=

await fetch(
API_VENTAS
)

.then(r=>r.json());


const productos=

await fetch(
API_PRODUCTOS
)

.then(r=>r.json());


const historial=

ventas.ventas
.filter(v=>

v.vendedorNombre

===

usuario.nombre

);


renderTabla(

historial,

productos.productos

);

}


function renderTabla(

ventas,

productos

){

const tabla=

document.getElementById(
"tablaMisVentas"
);


tabla.innerHTML="";


ventas.forEach(v=>{

const producto=

productos.find(p=>

p.codigoProducto

===

v.codigoProducto

);


tabla.innerHTML+=`

<tr>

<td>

${v.fechaVenta}

</td>

<td>

${producto?.nombreProducto||"-"}

</td>

<td>

${v.emprendimiento||"-"}

</td>

<td>

${v.cantidad}

</td>

<td>

${v.canalVenta}

</td>

<td>

$${v.total}

</td>

</tr>

`;

});

}


function cerrarSesion(){

sessionStorage.clear();

location.href=
"index.html";

}


function volver(){

history.back();

}
