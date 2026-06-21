//Login con "base de datos" y localstorage 
let baseDeDatosUsuarios = JSON.parse(localStorage.getItem("usuariosWallet")) || {
    "prueba@correo.com": {
        contrasena: "1234",
        pin: "9988",
        saldo: 50000,
        contactos: [
            { nombre: "Juan Segura", cuenta: "11223344" },
            { nombre: "María Lara", cuenta: "55667788" }
        ]
    }
};

let usuarioLogueado = localStorage.getItem("usuarioActual") || null;

const AuthModule = {
    
    registrarUsuario: function(email, password, pin) {
        if (baseDeDatosUsuarios[email]) {
            alert("La dirección de correo electrónico ya existe.");
            return false;
        }

        baseDeDatosUsuarios[email] = {
            contrasena: password,
            pin: pin,
            saldo: 0,
            contactos: []
        };

        localStorage.setItem("usuariosWallet", JSON.stringify(baseDeDatosUsuarios));
        alert("¡Cuenta registrada con éxito! Ya puedes iniciar sesión.");
        return true;
    },

    validarLogin: function(email, password) {
        if (baseDeDatosUsuarios[email] && baseDeDatosUsuarios[email].contrasena === password) {
            localStorage.setItem("usuarioActual", email);
            usuarioLogueado = email;
            return true;
        }
        return false;
    },

    cerrarSesion: function() {
        localStorage.removeItem("usuarioActual");
        usuarioLogueado = null;
        window.location.href = "index.html";
    }
};

$(document).ready(function() {
    
    // --- TU TRUCO DIRECTO Y EFECTIVO ---
    // Obligamos a que los campos de login nazcan vacíos siempre
    $("#login-email").val("");
    $("#login-password").val("");
    
    // De aquí hacia abajo tu código se queda exactamente igual
    if ($("#form-login").length > 0) {
        
        $("#form-registro").on("submit", function(event) {
            event.preventDefault();
            
            const email = $("#registro-email").val().trim();
            const password = $("#registro-password").val();
            const pin = $("#registro-pin").val();

            const registroExitoso = AuthModule.registrarUsuario(email, password, pin);

            if (registroExitoso) {
                $("#form-registro")[0].reset();
                $("#modalRegistro").modal("hide");
            }
        });

        $("#form-login").on("submit", function(event) {
            event.preventDefault();

            const email = $("#login-email").val().trim();
            const password = $("#login-password").val();

            if (AuthModule.validarLogin(email, password)) {
                window.location.href = "menu.html";
            } else {
                alert("Correo electrónico o contraseña incorrectos. Por favor, vuelve a intentarlo.");
                $("#login-password").val("");
            }
        });
    }

    $('.nav-link:contains("Cerrar sesión")').on("click", function(event) {
        event.preventDefault();
        AuthModule.cerrarSesion();
    });
});