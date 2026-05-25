const API_VENTAS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/ventas";

const API_PRODUCTOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

const API_USUARIOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/usuarios";


let ventas=[];
let productos=[];
let usuarios=[];

let globalChart=null;
let filtroChart=null;
let canalChart=null;


document.addEventListener(
"DOMContentLoaded",
async()=>{

await cargarDatos();

cargarFiltros();

generarReporte();

}
);


async function cargarDatos(){

try{

const dataVentas=
await fetch(API_VENTAS)
.then(r=>r.json());

ventas=
dataVentas.ventas||[];


const dataProductos=
await fetch(API_PRODUCTOS)
.then(r=>r.json());

productos=
dataProductos.productos||[];


const dataUsuarios=
await fetch(API_USUARIOS)
.then(r=>r.json());

usuarios=
dataUsuarios.usuarios||[];

}
catch(error){

console.log(error);

}

}


function cargarFiltros(){

const emp=
document.getElementById(
"filtroEmprendedora"
);

const persona=
document.getElementById(
"filtroPersona"
);

const canal=
document.getElementById(
"filtroCanal"
);


emp.innerHTML=
`<option value="">
Todos
</option>`;

persona.innerHTML=
`<option value="">
Todas las personas
</option>`;

canal.innerHTML=
`
<option value="">
Todos canales
</option>
`;


const emprendimientos=

[
...new Set(

productos.map(
p=>p.emprendedora
)

)

];


emprendimientos.forEach(e=>{

if(e){

emp.innerHTML+=

`<option>

${e}

</option>`;

}

});


const personas=

[
...new Set(

usuarios.map(
u=>u.nombre
)

)

];


personas.forEach(p=>{

if(p){

persona.innerHTML+=

`<option>

${p}

</option>`;

}

});


const canales=

[
...new Set(

ventas.map(
v=>v.canalVenta
)

)

];


canales.forEach(c=>{

if(c){

canal.innerHTML+=

`<option>

${c}

</option>`;

}

});

}


function generarReporte(){

const inicio=
document.getElementById(
"fechaInicio"
).value;

const fin=
document.getElementById(
"fechaFin"
).value;

const emp=
document.getElementById(
"filtroEmprendedora"
).value;

const persona=
document.getElementById(
"filtroPersona"
).value;

const canal=
document.getElementById(
"filtroCanal"
).value;


const ventasCompletas=

ventas.map(v=>{

const producto=

productos.find(

p=>

String(p.id)

===

String(v.productoId)

)

||{};


return{

...v,

nombreProducto:

producto.nombreProducto

||

"Sin producto",

emprendimiento:

producto.emprendedora

||

"Sin emprendimiento"

};

});


const filtradas=

ventasCompletas.filter(v=>{

return(

(!inicio||

v.fechaVenta>=inicio)

&&

(!fin||

v.fechaVenta<=fin)

&&

(!emp||

v.emprendimiento===emp)

&&

(!persona||

v.vendedorNombre===persona)

&&

(!canal||

v.canalVenta===canal)

);

});


actualizarResumen(
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

graficaCanal(
filtradas
);

}


function actualizarResumen(data){

const total=

data.reduce(

(a,b)=>

a+

Number(
b.total||0
),

0

);


const vendidos=

data.reduce(

(a,b)=>

a+

Number(
b.cantidad||0
),

0

);


document.getElementById(
"totalVentas"
).textContent=

"$"+

total.toFixed(2);


document.getElementById(
"productosVendidos"
).textContent=

vendidos;


document.getElementById(
"ticketPromedio"
).textContent=

data.length

?

"$"+

(total/data.length)
.toFixed(2)

:

"$0";


document.getElementById(
"inventarioActual"
).textContent=

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

tabla.innerHTML="";


data.forEach(v=>{

tabla.innerHTML+=`

<tr>

<td>
${v.fechaVenta}
</td>

<td>
${v.nombreProducto}
</td>

<td>
${v.emprendimiento}
</td>

<td>
${v.vendedorNombre}
</td>

<td>
${v.canalVenta}
</td>

<td>
${v.cantidad}
</td>

<td>

$${v.total}

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

tabla.innerHTML="";


productos

.filter(p=>

!emp

||

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

const top={};


data.forEach(v=>{

top[v.nombreProducto]=

(top[v.nombreProducto]||0)

+

Number(v.cantidad);

});


const tabla=

document.getElementById(
"tablaTopProductos"
);

if(!tabla)return;


tabla.innerHTML="";


Object.entries(top)

.sort(
(a,b)=>b[1]-a[1]
)

.forEach(p=>{

tabla.innerHTML+=`

<tr>

<td>
${p[0]}
</td>

<td>
${p[1]}
</td>

</tr>

`;

});

}


function graficaGlobal(){

const resumen={};


ventas.forEach(v=>{

const producto=

productos.find(

p=>

String(p.id)

===

String(v.productoId)

)

||{};


const emp=

producto.emprendedora

||

"Sin nombre";


resumen[emp]=

(resumen[emp]||0)

+

Number(v.total);

});


if(globalChart){

globalChart.destroy();

}


globalChart=

new Chart(

document.getElementById(
"graficoGlobal"
),

{

type:"bar",

data:{

labels:
Object.keys(
resumen
),

datasets:[{

label:
"Ventas globales",

data:
Object.values(
resumen
)

}]

}

}

);

}


function graficaFiltro(data){

const resumen={};


data.forEach(v=>{

resumen[v.nombreProducto]=

(resumen[v.nombreProducto]||0)

+

Number(v.total);

});


if(filtroChart){

filtroChart.destroy();

}


filtroChart=

new Chart(

document.getElementById(
"graficoFiltro"
),

{

type:"bar",

data:{

labels:
Object.keys(
resumen
),

datasets:[{

label:
"Productos",

data:
Object.values(
resumen
)

}]

}

}

);

}


function graficaCanal(data){

const resumen={};


data.forEach(v=>{

resumen[v.canalVenta]=

(resumen[v.canalVenta]||0)

+

Number(v.total);

});


if(canalChart){

canalChart.destroy();

}


canalChart=

new Chart(

document.getElementById(
"graficoCanal"
),

{

type:"pie",

data:{

labels:
Object.keys(
resumen
),

datasets:[{

data:
Object.values(
resumen)

}]

}

}

);

}


function generarPDF(){

const pdf=

new jspdf.jsPDF();

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
