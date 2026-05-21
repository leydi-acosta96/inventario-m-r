function obtenerUsuario(){

  return JSON.parse(
    sessionStorage.getItem("usuario")
  );

}


function validarSesion(){

  const usuario = obtenerUsuario();

  if(!usuario){

    window.location.href = "./index.html";

  }

}


function cerrarSesion(){

  sessionStorage.removeItem("usuario");

  window.location.href = "./index.html";

}


// PERMITE UNO O VARIOS ROLES
function validarRol(rolesPermitidos){

  const usuario = obtenerUsuario();

  // VALIDAR SESIÓN
  if(!usuario){

    window.location.href = "./index.html";

    return;

  }

  // SI ENVÍAN SOLO UN ROL
  if(typeof rolesPermitidos === "string"){

    rolesPermitidos =
    [rolesPermitidos];

  }

  // VALIDAR ACCESO
  if(

    !rolesPermitidos.includes(

      usuario.rol.toLowerCase()

    )

  ){

    alert(
      "No tienes acceso a esta sección"
    );

    window.location.href =
    "./index.html";

  }

}
