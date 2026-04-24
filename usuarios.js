//const API_URL = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/usuarios";

document.addEventListener("DOMContentLoaded", cargarUsuarios);

document.getElementById("formUsuario").addEventListener("submit", guardarUsuario);


// MOSTRAR FORMULARIO
function mostrarFormulario(){
  document.getElementById("formUsuario").style.display = "block";
}


// MOSTRAR CAMPOS SEGUN ROL
function mostrarCamposRol(){

  const rol = document.getElementById("rol").value;

  if(rol === "emprendedora"){
    document.getElementById("camposEmprendimiento").style.display = "block";
  }else{
    document.getElementById("camposEmprendimiento").style.display = "none";
  }

}


// GENERAR CODIGO ACCESO
function generarCodigo(){
  return Math.floor(1000 + Math.random() * 9000);
}


let enviando = false;

// GUARDAR USUARIO
function guardarUsuario(e){
  e.preventDefault();

  if(enviando) return;
  enviando = true;

  const codigo = generarCodigo();

  const usuario = {
    usuario:{
      nombre: document.getElementById("nombre").value,
      cedula: document.getElementById("cedula").value,
      rol: document.getElementById("rol").value,
      emprendimiento: document.getElementById("emprendimiento").value,
      contacto: document.getElementById("contacto").value,
      instagram: document.getElementById("instagram").value,
      correo: document.getElementById("correo").value,
      estado: document.getElementById("estado").value,
      codigoAcceso: codigo
    }
  };

  fetch(API_URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(usuario)
  })
  .then(()=>{

    const telefono = document.getElementById("contacto").value;

    alert("Usuario guardado correctamente");

    mostrarCodigoAcceso(codigo, telefono);

    document.getElementById("formUsuario").reset();
    cargarUsuarios();

    enviando = false;

  })
  .catch(()=>{
    enviando = false;
  });

}

// CARGAR USUARIOS
function cargarUsuarios(){

  fetch(API_URL)
  .then(res => res.json())
  .then(data => {

    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = "";

    data.usuarios.forEach(u => {

      tabla.innerHTML += `
        <tr>
          <td>${u.nombre}</td>
          <td>${u.rol}</td>
          <td>${u.emprendimiento || ""}</td>
          <td>${u.estado}</td>
          <td>
            <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
          </td>
        </tr>
      `;

    });

  });

}


// ELIMINAR USUARIO
function eliminarUsuario(id){

  if(!confirm("¿Eliminar usuario?")) return;

  fetch(`${API_URL}/${id}`,{
    method:"DELETE"
  })
  .then(()=>{
    cargarUsuarios();
  });

}


// BUSCAR USUARIO
document.getElementById("buscarUsuario").addEventListener("keyup", buscarUsuario);

function buscarUsuario(){

  const filtro = document.getElementById("buscarUsuario").value.toLowerCase();
  const filas = document.querySelectorAll("#tablaUsuarios tr");

  filas.forEach(fila => {

    const texto = fila.textContent.toLowerCase();

    fila.style.display = texto.includes(filtro) ? "" : "none";

  });

}

function mostrarCodigoAcceso(codigo, telefono){

  const contenedor = document.createElement("div");

  contenedor.style.position = "fixed";
  contenedor.style.top = "50%";
  contenedor.style.left = "50%";
  contenedor.style.transform = "translate(-50%, -50%)";
  contenedor.style.background = "#fff";
  contenedor.style.padding = "20px";
  contenedor.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  contenedor.style.zIndex = "999";

  contenedor.innerHTML = `
    <h3>Código de acceso generado</h3>
    <h2>${codigo}</h2>

    <button onclick="copiarCodigo('${codigo}')">
      Copiar
    </button>

    <button onclick="enviarWhatsApp('${codigo}','${telefono}')">
      Enviar WhatsApp
    </button>

    <br><br>
    <button onclick="this.parentElement.remove()">
      Cerrar
    </button>
  `;

  document.body.appendChild(contenedor);

}


function copiarCodigo(codigo){
  navigator.clipboard.writeText(codigo);
  alert("Código copiado");
}


function enviarWhatsApp(codigo, telefono){

  if(!telefono){
    alert("No hay número de contacto");
    return;
  }

  const mensaje = `Tu código de acceso al Sistema de Inventario es: ${codigo}`;
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url,"_blank");

}

function volverPagina(){
    window.history.back();
}

function logout(){
    sessionStorage.clear();
    window.location.href = "index.html";
}