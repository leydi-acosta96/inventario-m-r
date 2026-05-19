const API_VENTAS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/ventas";

const API_PRODUCTOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

const API_USUARIOS =
"https://https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/usuarios";


let ventas=[];
let productos=[];

let grafico;


document.addEventListener(
"DOMContentLoaded",
async()=>{

await cargarDatos();

cargarFiltros();

generarReporte();

}
);


async function cargarDatos(){

const resVentas=
await fetch(API_VENTAS);

const dataVentas=
await resVentas.json();

ventas=
dataVentas.ventas||[];


const resProductos=
await fetch(API_PRODUCTOS);

const dataProductos=
await resProductos.json();

productos=
dataProductos.productos||[];

}


async function cargarFiltros(){

const res=
await fetch(API_USUARIOS);

const data=
await res.json();


const filtroEmp=
document.getElementById(
"filtroEmprendedora"
);

const filtroVend=
document.getElementById(
"filtroVendedora"
);


data.usuarios.forEach(u=>{

if(
u.rol?.toLowerCase()
==="emprendedora"
){

filtroEmp.innerHTML+=`

<option>

${u.emprendimiento}

</option>

`;

}


if(
u.rol?.toLowerCase()
==="vendedora"
){

filtroVend.innerHTML+=`

<option>

${u.nombre}

</option>

`;

}

});

}


function generarReporte(){

const inicio=
document
.getElementById("fechaInicio")
.value;

const fin=
document
.getElementById("fechaFin")
.value;

const emp=
document
.getElementById(
"filtroEmprendedora"
)
.value;

const vend=
document
.getElementById(
"filtroVendedora"
)
.value;


let ventasFiltradas=
ventas.filter(v=>{

const fecha=
v.fechaVenta||"";

return(

(!inicio||fecha>=inicio)

&&

(!fin||fecha<=fin)

&&

(!emp||

v.emprendimiento===emp)

&&

(!vend||

v.vendedorNombre===vend)

);

});


document
.getElementById(
"totalVentas"
)
.textContent=

ventasFiltradas
.reduce(
(a,b)=>

a+
Number(b.total),

0
)
.toFixed(2);


document
.getElementById(
"productosVendidos"
)
.textContent=

ventasFiltradas
.reduce(
(a,b)=>

a+
Number(b.cantidad),

0
);


document
.getElementById(
"inventarioActual"
)
.textContent=

productos
.reduce(
(a,b)=>

a+
Number(b.stock),

0
);


renderTablaVentas(
ventasFiltradas
);

renderInventario();

crearGrafico(
ventasFiltradas
);

}


function renderTablaVentas(datos){

const tabla=
document
.getElementById(
"tablaVentas"
);

tabla.innerHTML="";


datos.forEach(v=>{

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

${v.cantidad}

</td>

<td>

$${v.total}

</td>

</tr>

`;

});

}


function renderInventario(){

const tabla=
document
.getElementById(
"tablaInventario"
);

tabla.innerHTML="";


productos.forEach(p=>{

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


function crearGrafico(ventas){

const resumen={};


ventas.forEach(v=>{

const emp=
v.emprendimiento;

resumen[emp]=

(resumen[emp]||0)

+

Number(v.total);

});


if(grafico){

grafico.destroy();

}


grafico=
new Chart(

document
.getElementById(
"graficoVentas"
),

{

type:"bar",

data:{

labels:
Object.keys(resumen),

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


function generarPDF(){

const{
jsPDF
}=window.jspdf;

const pdf=
new jsPDF();

pdf.setFontSize(16);

pdf.text(
"Reporte Sistema",
20,
20
);

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

pdf.save(

"Reporte.pdf"

);

}


function logout(){

sessionStorage.clear();

window.location.href=

"index.html";

}


function volverPagina(){

window.history.back();

}
