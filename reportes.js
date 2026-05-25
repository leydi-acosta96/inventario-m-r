const API_VENTAS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/ventas";

const API_PRODUCTOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

const API_USUARIOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/usuarios";

let ventas = [];
let productos = [];

let globalChart;
let filtroChart;
let canalChart;

document.addEventListener(
"DOMContentLoaded",
async()=>{

await cargarDatos();

await cargarFiltros();

generarReporte();

});

async function cargarDatos(){

try{

const ventasData =
await fetch(API_VENTAS)
.then(r=>r.json());

ventas =
ventasData.ventas || [];

const productosData =
await fetch(API_PRODUCTOS)
.then(r=>r.json());

productos =
productosData.productos || [];

}catch(error){

console.log(error);

}

}

async function cargarFiltros(){

try{

const usuarios =
(await fetch(API_USUARIOS)
.then(r=>r.json()))
.usuarios || [];

const emp =
document.getElementById(
"filtroEmprendedora"
);

const persona =
document.getElementById(
"filtroVendedora"
);

if(emp){

emp.innerHTML=`

<option value="">
Todas
</option>

`;

}

if(persona){

persona.innerHTML=`

<option value="">
Todas
</option>

`;

}

usuarios.forEach(u=>{

if(

u.emprendimiento

&&

emp

){

emp.innerHTML += `

<option
value="${u.emprendimiento}"
>

${u.emprendimiento}

</option>

`;

}

if(

u.nombre

&&

persona

){

persona.innerHTML += `

<option
value="${u.nombre}"
>

${u.nombre}

</option>

`;

}

});

}catch(error){

console.log(
"Error filtros",
error
);

}

}

function generarReporte(){

const inicio =
document
.getElementById(
"fechaInicio"
)?.value || "";

const fin =
document
.getElementById(
"fechaFin"
)?.value || "";

const emp =
document
.getElementById(
"filtroEmprendedora"
)?.value || "";

const persona =
document
.getElementById(
"filtroVendedora"
)?.value || "";

let filtradas =

ventas.filter(v=>{

const emprendimiento =

v.emprendimiento ||

v.emprendedora ||

"";

const vendedor =

v.vendedorNombre ||

"";

return(

(!inicio ||

v.fechaVenta >= inicio)

&&

(!fin ||

v.fechaVenta <= fin)

&&

(!emp ||

emprendimiento === emp)

&&

(!persona ||

vendedor === persona)

);

});

actualizarCards(
filtradas
);

renderVentas(
filtradas
);

renderInventario(
emp
);

renderTopProductos(
filtradas
);

graficaGlobal();

graficaFiltro(
filtradas
);

}

function actualizarCards(data){

const total =

data.reduce(

(a,b)=>

a+
Number(
b.total||0
),

0

);

const vendidos =

data.reduce(

(a,b)=>

a+
Number(
b.cantidad||0
),

0

);

document
.getElementById(
"totalVentas"
)
.textContent=

"$"+

total.toFixed(2);

document
.getElementById(
"productosVendidos"
)
.textContent=

vendidos;

document
.getElementById(
"inventarioActual"
)
.textContent=

productos.reduce(

(a,b)=>

a+
Number(
b.stock||0
),

0

);

}

function renderVentas(data){

const tabla=
document.getElementById(
"tablaVentas"
);

if(!tabla)return;

tabla.innerHTML="";

data.forEach(v=>{

tabla.innerHTML += `

<tr>

<td>
${v.fechaVenta||""}
</td>

<td>
${v.nombreProducto||""}
</td>

<td>
${v.emprendimiento||""}
</td>

<td>
${v.vendedorNombre||""}
</td>

<td>
${v.cantidad||0}
</td>

<td>
$${v.total||0}
</td>

</tr>

`;

});

}

function renderInventario(emp){

const tabla=
document.getElementById(
"tablaInventario"
);

if(!tabla)return;

tabla.innerHTML="";

productos

.filter(p=>

!emp ||

p.emprendedora===emp

)

.forEach(p=>{

tabla.innerHTML+=`

<tr>

<td>
${p.nombreProducto}
</td>

<td>
${p.emprendedora}
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

function renderTopProductos(data){

const tabla=
document.getElementById(
"tablaTopProductos"
);

if(!tabla)return;

tabla.innerHTML="";

const resumen={};

data.forEach(v=>{

const nombre=

v.nombreProducto||

"Sin nombre";

resumen[nombre]=

(resumen[nombre]||0)

+

Number(v.cantidad||0);

});

Object.entries(resumen)

.sort(

(a,b)=>

b[1]-a[1]

)

.forEach(item=>{

tabla.innerHTML +=`

<tr>

<td>
${item[0]}
</td>

<td>
${item[1]}
</td>

</tr>

`;

});

}

function graficaGlobal(){

const canvas=

document.getElementById(
"graficoGlobal"
);

if(!canvas)return;

const resumen={};

ventas.forEach(v=>{

const emp=

v.emprendimiento||

"Sin nombre";

resumen[emp]=

(resumen[emp]||0)

+

Number(v.total||0);

});

if(globalChart){

globalChart.destroy();

}

globalChart=

new Chart(canvas,{

type:"bar",

data:{

labels:

Object.keys(
resumen
),

datasets:[{

label:
"Ventas",

data:

Object.values(
resumen
)

}]

}

});

}

function graficaFiltro(data){

const canvas=

document.getElementById(
"graficoFiltro"
);

if(!canvas)return;

const resumen={};

data.forEach(v=>{

const nombre=

v.nombreProducto||

"Sin nombre";

resumen[nombre]=

(resumen[nombre]||0)

+

Number(v.total||0);

});

if(filtroChart){

filtroChart.destroy();

}

filtroChart=

new Chart(canvas,{

type:"pie",

data:{

labels:

Object.keys(
resumen
),

datasets:[{

data:

Object.values(
resumen
)

}]

}

});

}

function generarPDF(){

const {

jsPDF

}=window.jspdf;

const pdf=

new jsPDF();

pdf.text(
"Reporte",
20,
20
);

pdf.save(
"Reporte.pdf"
);

}

function logout(){

sessionStorage.clear();

location.href=
"index.html";

}

function volverPagina(){

history.back();

}
