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

String(
p.codigoProducto
).trim()

===

String(
v.codigoProducto
).trim()

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

const { jsPDF } =
window.jspdf;

const pdf =
new jsPDF(
"p",
"mm",
"a4"
);

const fecha=
new Date()
.toLocaleString();


// TITULO

pdf.setFontSize(18);

pdf.text(
"Reporte del Sistema",
15,
15
);

pdf.setFontSize(9);

pdf.text(
"Generado: "+fecha,
15,
22
);


// FILTROS

pdf.setFontSize(12);

pdf.text(
"Filtros aplicados",
15,
32
);


pdf.setFontSize(10);

pdf.text(

"Fecha inicio: "+

(
document
.getElementById(
"fechaInicio"
)
.value

||

"Todas"

),

15,

40

);


pdf.text(

"Fecha fin: "+

(
document
.getElementById(
"fechaFin"
)
.value

||

"Todas"

),

15,

46

);


pdf.text(

"Emprendimiento: "+

(
document
.getElementById(
"filtroEmprendedora"
)
.value

||

"Todos"

),

15,

52

);


pdf.text(

"Persona: "+

(
document
.getElementById(
"filtroPersona"
)
.value

||

"Todas"

),

15,

58

);


pdf.text(

"Canal: "+

(
document
.getElementById(
"filtroCanal"
)
.value

||

"Todos"

),

15,

64

);


// RESUMEN

pdf.setFontSize(12);

pdf.text(
"Resumen",
15,
75
);


pdf.autoTable({

startY:80,

head:[[
"Total Ventas",
"Productos",
"Inventario",
"Ticket"
]],

body:[[
document
.getElementById(
"totalVentas"
)
.textContent,

document
.getElementById(
"productosVendidos"
)
.textContent,

document
.getElementById(
"inventarioActual"
)
.textContent,

document
.getElementById(
"ticketPromedio"
)
.textContent

]]

});


let y=
pdf.lastAutoTable
.finalY+10;


// TABLA VENTAS

const ventas=[];

document
.querySelectorAll(
"#tablaVentas tr"
)
.forEach(f=>{

const fila=[];

f.querySelectorAll(
"td"
)
.forEach(td=>{

fila.push(
td.innerText
);

});

if(
fila.length
){

ventas.push(
fila
);

}

});


pdf.text(
"Detalle Ventas",
15,
y
);


pdf.autoTable({

startY:
y+5,

head:[[

"Fecha",
"Producto",
"Emprendimiento",
"Persona",
"Canal",
"Cantidad",
"Total"

]],

body:
ventas,

styles:{
fontSize:8
}

});


y=
pdf.lastAutoTable
.finalY+10;


// PRODUCTOS MAS VENDIDOS

const top=[];

document
.querySelectorAll(
"#tablaTopProductos tr"
)
.forEach(f=>{

const fila=[];

f.querySelectorAll(
"td"
)
.forEach(td=>{

fila.push(
td.innerText
);

});

if(
fila.length
){

top.push(
fila
);

}

});


pdf.text(
"Productos Mas Vendidos",
15,
y
);


pdf.autoTable({

startY:
y+5,

head:[[

"Producto",
"Cantidad"

]],

body:
top

});


y=
pdf.lastAutoTable
.finalY+10;


// INVENTARIO

const inventario=[];

document
.querySelectorAll(
"#tablaInventario tr"
)
.forEach(f=>{

const fila=[];

f.querySelectorAll(
"td"
)
.forEach(td=>{

fila.push(
td.innerText
);

});

if(
fila.length
){

inventario.push(
fila
);

}

});


pdf.text(
"Inventario",
15,
y
);


pdf.autoTable({

startY:
y+5,

head:[[

"Producto",
"Emprendimiento",
"Stock"

]],

body:
inventario,

styles:{
fontSize:8
}

});


y=
pdf.lastAutoTable
.finalY+15;


// GRAFICAS

const global=

document
.getElementById(
"graficoGlobal"
);

const filtro=

document
.getElementById(
"graficoFiltro"
);

const canal=

document
.getElementById(
"graficoCanal"
);


if(
global
){

pdf.addPage();

pdf.text(
"Ventas Globales",
15,
15
);

pdf.addImage(

global.toDataURL(),

"PNG",

15,

25,

180,

80

);

}


if(
filtro
){

pdf.text(

"Productos Filtrados",

15,

120

);

pdf.addImage(

filtro.toDataURL(),

"PNG",

15,

130,

180,

70

);

}


if(
canal
){

pdf.addPage();

pdf.text(
"Canal de Venta",
15,
20
);

pdf.addImage(

canal.toDataURL(),

"PNG",

20,

30,

160,

100

);

}


// PIE

const paginas=

pdf.internal
.getNumberOfPages();


for(
let i=1;
i<=paginas;
i++
){

pdf.setPage(i);

pdf.setFontSize(8);

pdf.text(

"Pagina "

+i+

" de "

+paginas,

170,

290

);

}

pdf.save(
"ReporteSistema.pdf"
);

}

}
function logout(){

sessionStorage.clear();

location.href=
"index.html";

}


function volverPagina(){

history.back();

}
