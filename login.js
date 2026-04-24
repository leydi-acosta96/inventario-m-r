const URL = "https://api.sheety.co/439db015c12617013288a2fb34648f06/bdFinal/usuarios";

document.getElementById("loginForm").addEventListener("submit", login);

async function login(e){
    e.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();

    try{
        const response = await fetch(URL);
        const data = await response.json();

        const usuarios = data.usuarios;

        const usuario = usuarios.find(u => 
            String(u.codigoAcceso).trim() === codigo &&
            u.estado &&
            u.estado.toLowerCase() === "activo"
        );

        if(!usuario){
            alert("Código inválido o usuario inactivo");
            return;
        }

        sessionStorage.setItem("usuario", JSON.stringify(usuario));

        switch(usuario.rol.toLowerCase()){

            case "admin":
                window.location.href = "dashboard_admin.html";
                break;

            case "emprendedora":
                window.location.href = "dashboard_emprendedora.html";
                break;

            case "vendedora":
                window.location.href = "dashboard_vendedora.html";
                break;

            default:
                alert("Rol no reconocido");
        }

    }catch(error){
        console.error(error);
        alert("Error al conectar con la base de datos");
    }
}