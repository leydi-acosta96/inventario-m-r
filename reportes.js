const API_VENTAS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/ventas";

const API_PRODUCTOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

const API_USUARIOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/usuarios";


let ventas = [];
let productos = [];
let grafico;


// INICIO
document.addEventListener(
"DOMContentLoaded",
async()=>{

await cargarDatos();

await cargarFiltros();

generarReporte();

}
);


// CARGAR DATOS
async function cargarDatos(){

try{

const resVentas =
await fetch(API_VENTAS);

const dataVentas =
await resVentas.json();

ventas =
dataVentas.ventas || [];


const resProductos =
await fetch(API_PRODUCTOS);

const dataProductos =
await resProductos.json();

productos =
dataProductos.productos || [];

}
catch(error){

console.error(
"Error cargando datos",
error
);

}

}


// CARGAR FILTROS
async function cargarFiltros(){

try{

const res =
await fetch(API_USUARIOS);

const data =
await res.json();

const filtroEmp =
document.getElementById(
"filtroEmprendedora"
);

const filtroVend =
document.getElementById(
"filtroVendedora"
);

filtroEmp.innerHTML =
`<option value="">Todas</option>`;

filtroVend.innerHTML =
`<option value="">Todas</option>`;


data.usuarios.forEach(u=>{

const rol =
u.rol?.toLowerCase();

if(

rol==="emprendedora"

&&

u.emprendimiento

){

filtroEmp.innerHTML += `

<option value="${u.emprendimiento}">

${u.emprendimiento}

</option>

`;

}


if(

rol==="vendedora"

&&

u.nombre

){

filtroVend.innerHTML += `

<option value="${u.nombre}">

${u.nombre}

</option>

`;

}

});

}
catch(error){

console.error(
"Error filtros",
error
);

}

}


// GENERAR REPORTE
function generarReporte(){

const inicio =
document
.getElementById(
"fechaInicio"
)
.value;

const fin =
document
.getElementById(
"fechaFin"
)
.value;

const emp =
document
.getElementById(
"filtroEmprendedora"
)
.value;

const vend =
document
.getElementById(
"filtroVendedora"
)
.value;


// FILTRAR VENTAS
let ventasFiltradas =
ventas.filter(v=>{

const fecha =
v.fechaVenta || "";

// COMPATIBILIDAD
const empVenta =

v.emprendimiento

||

v.emprendedora

||

"";

return(

(!inicio || fecha >= inicio)

&&

(!fin || fecha <= fin)

&&

(!emp || empVenta === emp)

&&

(

!vend

||

v.vendedorNombre===vend

)

);

});


// TOTAL VENTAS
const totalVentas =

ventasFiltradas.reduce(

(a,b)=>

a+

Number(
b.total || 0
),

0

);


// PRODUCTOS VENDIDOS
const vendidos =

ventasFiltradas.reduce(

(a,b)=>

a+

Number(
b.cantidad || 0
),

0

);


// INVENTARIO FILTRADO
const inventario =

productos.filter(p=>{

if(!emp){

return true;

}

return (

p.emprendedora===emp

||

p.emprendimiento===emp

);

});

const stockTotal =

inventario.reduce(

(a,b)=>

a+

Number(
b.stock || 0
),

0

);


// CARDS
document
.getElementById(
"totalVentas"
)
.textContent =

totalVentas.toFixed(2);


document
.getElementById(
"productosVendidos"
)
.textContent =

vendidos;


document
.getElementById(
"inventarioActual"
)
.textContent =

stockTotal;


// TABLAS
renderTablaVentas(
ventasFiltradas
);

renderInventario(
inventario
);


// GRÁFICO
crearGrafico(
ventasFiltradas
);

}


// TABLA VENTAS
function renderTablaVentas(datos){

const tabla =
document
.getElementById(
"tablaVentas"
);

tabla.innerHTML="";


datos.forEach(v=>{

const emp =

v.emprendimiento

||

v.emprendedora

||

"-";


tabla.innerHTML +=`

<tr>

<td>

${v.fechaVenta||""}

</td>

<td>

${v.nombreProducto||""}

</td>

<td>

${emp}

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


// INVENTARIO
function renderInventario(datos){

const tabla =
document
.getElementById(
"tablaInventario"
);

tabla.innerHTML="";


datos.forEach(p=>{

tabla.innerHTML +=`

<tr>

<td>

${p.nombreProducto}

</td>

<td>

${

p.emprendedora

||

p.emprendimiento

||

""

}

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


// GRAFICO
function crearGrafico(ventas){

const resumen={};

ventas.forEach(v=>{

const emp=

v.emprendimiento

||

v.emprendedora

||

"Sin nombre";


resumen[emp]=

(resumen[emp]||0)

+

Number(
v.total||0
);

});


if(grafico){

grafico.destroy();

}


grafico =

new Chart(

document.getElementById(
"graficoVentas"
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
"Ventas",

data:

Object.values(
resumen
)

}]

}

}

);

}


// PDF
function generarPDF(){

const {

jsPDF

}=window.jspdf;


const pdf =
new jsPDF();


pdf.setFontSize(16);

pdf.text(
"Reporte Sistema",
20,
20
);


pdf.setFontSize(12);

pdf.text(

"Total ventas: "

+

document
.getElementById(
"totalVentas"
)
.textContent,

20,

40

);


pdf.text(

"Productos vendidos: "

+

document
.getElementById(
"productosVendidos"
)
.textContent,

20,

55

);


pdf.text(

"Inventario actual: "

+

document
.getElementById(
"inventarioActual"
)
.textContent,

20,

70

);


pdf.save(
"Reporte.pdf"
);

}


// LOGOUT
function logout(){

sessionStorage.clear();

window.location.href=
"index.html";

}


// VOLVER
function volverPagina(){

window.history.back();

}
