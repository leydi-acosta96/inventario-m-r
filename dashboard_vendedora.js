document.addEventListener("DOMContentLoaded", () => {

    // OBTENER USUARIO
    const usuario = JSON.parse(
        sessionStorage.getItem("usuario")
    );

    // VALIDAR SESIÓN
    if (!usuario) {

        window.location.href = "index.html";

        return;

    }

    // VALIDAR ROL
    if (
        usuario.rol.toLowerCase()
        !== "vendedora"
    ) {

        window.location.href = "index.html";

    }

});


// CERRAR SESIÓN
function cerrarSesion(){

    sessionStorage.clear();

    window.location.href = "index.html";

}


// VOLVER
function volver(){

    window.history.back();

}
