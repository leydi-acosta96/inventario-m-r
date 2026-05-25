const API_VENTAS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/ventas";

const API_PRODUCTOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/productos";

const API_USUARIOS =
"https://api.sheety.co/301327363ae1c8d017800bb4566af87c/bdFinal/usuarios";

let ventas = [];
let productos = [];

let graficoGlobal;
let graficoFiltro;
let graficoCanal;

document.addEventListener(
"DOMContentLoaded",
async ()=>{

    await cargarDatos();

    await cargarFiltros();

    generarReporte();

}
);

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

    }

    catch(error){

        console.log(error);

        alert(
        "Error cargando datos"
        );

    }

}

async function cargarFiltros(){

    try{

        const usuariosData =
        await fetch(API_USUARIOS)
        .then(r=>r.json());

        const usuarios =
        usuariosData.usuarios || [];

        const filtroEmp =
        document.getElementById(
        "filtroEmprendedora"
        );

        const filtroPersona =
        document.getElementById(
        "filtroPersona"
        );

        const filtroCanal =
        document.getElementById(
        "filtroCanal"
        );

        filtroEmp.innerHTML=
        `<option value="">
        Todas
        </option>`;

        filtroPersona.innerHTML=
        `<option value="">
        Todas las personas
        </option>`;

        filtroCanal.innerHTML=
        `<option value="">
        Todos canales
        </option>`;

        const emprendimientos =
        [...new Set(

        usuarios

        .filter(
        u=>u.emprendimiento
        )

        .map(
        u=>u.emprendimiento
        )

        )];

        emprendimientos.forEach(e=>{

            filtroEmp.innerHTML +=
            `

            <option value="${e}">

            ${e}

            </option>

            `;

        });


        const personas=
        [...new Set(

        usuarios

        .filter(

        u=>

        u.rol?.toLowerCase()
        ==="vendedora"

        ||

        u.rol?.toLowerCase()
        ==="emprendedora"

        )

        .map(
        u=>u.nombre
        )

        )];

        personas.forEach(p=>{

            filtroPersona.innerHTML+=

            `

            <option value="${p}">

            ${p}

            </option>

            `;

        });


        const canales=
        [...new Set(

        ventas

        .filter(
        v=>v.canalVenta
        )

        .map(
        v=>v.canalVenta
        )

        )];

        canales.forEach(c=>{

            filtroCanal.innerHTML+=

            `

            <option value="${c}">

            ${c}

            </option>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

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

    const emprendimiento=
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


    let filtradas=
    ventas.filter(v=>{

        const fecha=
        v.fechaVenta || "";

        return(

        (!inicio ||

        fecha>=inicio)

        &&

        (!fin ||

        fecha<=fin)

        &&

        (!emprendimiento ||

        v.emprendimiento===
        emprendimiento)

        &&

        (!persona ||

        v.vendedorNombre===
        persona)

        &&

        (!canal ||

        v.canalVenta===
        canal)

        );

    });

    actualizarCards(
    filtradas
    );

    renderVentas(
    filtradas
    );

    renderInventario(
    emprendimiento
    );

    renderTopProductos(
    filtradas
    );

    crearGraficoGlobal();

    crearGraficoFiltro(
    filtradas
    );

    crearGraficoCanal(
    filtradas
    );

}

function actualizarCards(data){

    const total=

    data.reduce(

    (a,b)=>

    a+

    Number(
    b.total||0
    ),

    0

    );

    const productos=

    data.reduce(

    (a,b)=>

    a+

    Number(
    b.cantidad||0
    ),

    0

    );

    const ticket=

    data.length

    ?

    total/data.length

    :

    0;

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

    productos;

    document
    .getElementById(
    "ticketPromedio"
    )
    .textContent=

    "$"+

    ticket.toFixed(2);

    document
    .getElementById(
    "inventarioActual"
    )
    .textContent=

    productosGlobal();

}

function productosGlobal(){

    return productos.reduce(

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

        <td>${v.fechaVenta}</td>

        <td>${v.nombreProducto}</td>

        <td>${v.emprendimiento}</td>

        <td>${v.vendedorNombre}</td>

        <td>${v.canalVenta}</td>

        <td>${v.cantidad}</td>

        <td>$${v.total}</td>

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

.filter(

p=>

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

tabla.innerHTML="";

Object.entries(top)

.sort((a,b)=>b[1]-a[1])

.forEach(p=>{

tabla.innerHTML+=`

<tr>

<td>${p[0]}</td>

<td>${p[1]}</td>

</tr>

`;

});

}

function crearGraficoGlobal(){

if(graficoGlobal){

graficoGlobal.destroy();

}

const resumen={};

ventas.forEach(v=>{

const emp=
v.emprendimiento;

resumen[emp]=

(resumen[emp]||0)

+

Number(v.total);

});

graficoGlobal=

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
"Ventas Globales",

data:
Object.values(
resumen
)

}]

}

}

);

}

function crearGraficoFiltro(data){

if(graficoFiltro){

graficoFiltro.destroy();

}

const resumen={};

data.forEach(v=>{

resumen[v.nombreProducto]=

(resumen[v.nombreProducto]||0)

+

Number(v.total);

});

graficoFiltro=

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
"Ventas Filtradas",

data:
Object.values(
resumen
)

}]

}

}

);

}

function crearGraficoCanal(data){

if(graficoCanal){

graficoCanal.destroy();

}

const resumen={};

data.forEach(v=>{

const canal=
v.canalVenta||
"Sin canal";

resumen[canal]=

(resumen[canal]||0)

+

Number(v.total);

});

graficoCanal=

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
resumen
)

}]

}

}

);

}
