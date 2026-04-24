document.addEventListener("DOMContentLoaded", () => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    if (usuario.rol !== "vendedora") {
        window.location.href = "login.html";
    }

});

function cerrarSesion(){
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function volver(){
    window.history.back();
}