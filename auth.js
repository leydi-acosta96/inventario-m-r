function obtenerUsuario(){
  return JSON.parse(sessionStorage.getItem("usuario"));
}

function validarSesion(){
  const usuario = obtenerUsuario();

  if(!usuario){
    window.location.href = "../index.html";
  }
}

function cerrarSesion(){
  sessionStorage.removeItem("usuario");
  window.location.href = "../index.html";
}

function validarRol(rolPermitido){
  const usuario = obtenerUsuario();

  if(usuario.rol !== rolPermitido){
    alert("No tienes acceso a esta sección");
    window.location.href = "../index.html";
  }
}