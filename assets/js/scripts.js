//Login con "base de datos" y localstorage 
let baseDeDatosUsuarios = JSON.parse(localStorage.getItem("usuariosWallet")) || {
    "prueba@correo.com": {
        contrasena: "1234",
        pin: "9876",
        saldo: 60000,
        contactos: [
            { nombre: "Juan Segura", cuenta: "11223344" },
            { nombre: "María Lara", cuenta: "55667788" }
        ],
        historial: [
            { fecha: "2026-06-20", operacion: "Saldo Inicial", monto: 60000 }
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
            contactos: [],
            historial: []
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

//Login y registro
    $("#login-email").val("");
    $("#login-password").val("");
    
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

//Cerrar sesión
    $('.btn-cerrar-sesion').on("click", function(event) {
        event.preventDefault();
        AuthModule.cerrarSesion();
    });

//Menú principal
    if ($("#saldo").length > 0) {
        const usuarioConectado = localStorage.getItem("usuarioActual");

        if (usuarioConectado && baseDeDatosUsuarios[usuarioConectado]) {
            const nombreUsuario = usuarioConectado.split("@")[0];
            $("#user").text("Bienvenido, " + nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1));
            
            let saldoActual = baseDeDatosUsuarios[usuarioConectado].saldo;
            
            $("#saldo").text("$" + parseInt(saldoActual).toLocaleString("es-CL"));
        } else {
            window.location.href = "index.html";
            return;
        }

        $("#btn-movimientos").on("click", function() {
            const contenedorTabla = $("#contenedor-tabla");

            if (contenedorTabla.hasClass("d-none")) {
                contenedorTabla.hide().removeClass("d-none");
                contenedorTabla.slideDown(500);
                $(this).text("Ocultar movimientos");
            } else {
                contenedorTabla.slideUp(500, function() {
                    contenedorTabla.addClass("d-none");
                });
                $(this).text("Ver últimos movimientos");
            }
        });
    }

//Depósito
    if ($("#form-deposito").length > 0) {
        const usuarioConectado = localStorage.getItem("usuarioActual");
        let montoGlobal = 0;

        if (!usuarioConectado || !baseDeDatosUsuarios[usuarioConectado]) {
            window.location.href = "index.html";
            return;
        }

        $("#form-deposito").on("submit", function(event) {
            event.preventDefault();

            montoGlobal = parseInt($("#monto-deposito").val());

            if (isNaN(montoGlobal) || montoGlobal <= 0) {
                return;
            }

            $("#confirmar-correo").text(usuarioConectado);
            $("#confirmar-monto").text("$" + montoGlobal.toLocaleString("es-CL"));
            
            $("#pin-deposito").val("");
            $("#error-pin-modal").addClass("d-none");

            $("#modalConfirmarDeposito").modal("show");
        });

        $("#btn-autorizar-deposito").on("click", function() {
            const pinIngresado = $("#pin-deposito").val().trim();
            const pinCorrecto = baseDeDatosUsuarios[usuarioConectado].pin;

            if (pinIngresado === pinCorrecto) {
            baseDeDatosUsuarios[usuarioConectado].saldo += montoGlobal;

            const fechaActual = new Date().toISOString().split('T')[0];

            baseDeDatosUsuarios[usuarioConectado].historial.push({
                fecha: fechaActual,
                operacion: "Depósito de fondos",
                monto: montoGlobal
            });

            localStorage.setItem("usuariosWallet", JSON.stringify(baseDeDatosUsuarios));

            $("#modalConfirmarDeposito").modal("hide");
            alert(`¡Depósito exitoso! Se han abonado $${montoGlobal.toLocaleString("es-CL")} a tu cuenta.`);
            window.location.href = "menu.html";
        
            } else {
                $("#error-pin-modal").removeClass("d-none");
                $("#pin-deposito").val("").focus();
            }
        });
    }
//Transferencias
if ($("#form-transferencia").length > 0) {
        const usuarioConectado = localStorage.getItem("usuarioActual");
        let contactoSeleccionado = null;

        if (!usuarioConectado || !baseDeDatosUsuarios[usuarioConectado]) {
            window.location.href = "index.html";
            return;
        }

        function cargarContactos() {
            const listaContainer = $("#lista-contactos-agenda");
            listaContainer.empty();

            const contactos = baseDeDatosUsuarios[usuarioConectado].contactos || [];

            if (contactos.length === 0) {
                listaContainer.append('<p class="text-center text-muted small py-2 mb-0">Tu agenda está vacía.</p>');
                return;
            }

            contactos.forEach(function(contacto, indice) {
                listaContainer.append(`
                    <button type="button" class="list-group-item list-group-item-action item-contacto-agenda" data-indice="${indice}">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 font-weight-bold text-dark">${contacto.nombre}</h6>
                        </div>
                        <small class="text-muted">N° Cuenta: ${contacto.cuenta}</small>
                    </button>
                `);
            });
        }

        cargarContactos();

        $(document).on("click", ".item-contacto-agenda", function() {
            $(".item-contacto-agenda").removeClass("active bg-success text-white");
            $(this).addClass("active bg-success text-white");

            const indice = $(this).data("indice");
            contactoSeleccionado = baseDeDatosUsuarios[usuarioConectado].contactos[indice];

            $("#cuenta-seleccionada").val(contactoSeleccionado.cuenta);
            
            $("#buscar-contacto").val(contactoSeleccionado.nombre);
        });

        $("#buscar-contacto").on("keyup", function() {
            const valorBusqueda = $(this).val().toLowerCase().trim();
            
            $(".item-contacto-agenda").each(function() {
                const nombreContacto = $(this).find("h6").text().toLowerCase();
                if (nombreContacto.includes(valorBusqueda)) {
                    $(this).removeClass("d-none");
                } else {
                    $(this).addClass("d-none");
                }
            });
        });

        $("#form-nuevo-contacto").on("submit", function(event) {
            event.preventDefault();

            const nuevoNombre = $("#nombre-contacto").val().trim();
            const nuevaCuenta = $("#numero-cuenta-contacto").val().trim();

            baseDeDatosUsuarios[usuarioConectado].contactos.push({
                nombre: nuevoNombre,
                cuenta: nuevaCuenta
            });

            localStorage.setItem("usuariosWallet", JSON.stringify(baseDeDatosUsuarios));
            cargarContactos();

            $("#form-nuevo-contacto")[0].reset();
            $("#modalNuevoContacto").modal("hide");
            alert(`¡${nuevoNombre} agregado con éxito a tu agenda!`);
        });

        $("#form-transferencia").on("submit", function(event) {
            event.preventDefault();

            const monto = parseInt($("#monto-transferir").val());
            const saldoDisponible = baseDeDatosUsuarios[usuarioConectado].saldo;

            if (!contactoSeleccionado) {
                alert("Por favor, selecciona un destinatario de tu agenda.");
                return;
            }
            if (isNaN(monto) || monto <= 0) {
                alert("Por favor, ingresa un monto válido superior a $0.");
                return;
            }
            if (monto > saldoDisponible) {
                alert(`Saldo insuficiente. Tu saldo disponible actual es de $${saldoDisponible.toLocaleString("es-CL")}.`);
                return;
            }

            $("#pin-seguridad").val("");
            $("#error-pin-transferencia").addClass("d-none");
            $("#modalConfirmarPin").modal("show");
        });

        $("#form-confirmar-pin").on("submit", function(event) {
            event.preventDefault();

            const pinIngresado = $("#pin-seguridad").val().trim();
            const pinCorrecto = baseDeDatosUsuarios[usuarioConectado].pin;

            if (pinIngresado === pinCorrecto) {
                const monto = parseInt($("#monto-transferir").val());

                baseDeDatosUsuarios[usuarioConectado].saldo -= monto;

                const fechaActual = new Date().toISOString().split('T')[0];
                
                if (!baseDeDatosUsuarios[usuarioConectado].historial) {
                    baseDeDatosUsuarios[usuarioConectado].historial = [];
                }

                baseDeDatosUsuarios[usuarioConectado].historial.push({
                    fecha: fechaActual,
                    operacion: `Transferencia a ${contactoSeleccionado.nombre}`,
                    monto: monto
                });

                localStorage.setItem("usuariosWallet", JSON.stringify(baseDeDatosUsuarios));

                $("#modalConfirmarPin").modal("hide");
                
                alert(`¡Transferencia exitosa! Has enviado $${monto.toLocaleString("es-CL")} a ${contactoSeleccionado.nombre}.`);
                
                window.location.href = "menu.html";
            } else {
                $("#error-pin-transferencia").removeClass("d-none");
                $("#pin-seguridad").val("").focus();
            }
        });
    }
//Transacciones
    if ($("#movimientos-completo").length > 0) {
        const usuarioConectado = localStorage.getItem("usuarioActual");

        if (!usuarioConectado || !baseDeDatosUsuarios[usuarioConectado]) {
            window.location.href = "index.html";
            return;
        }

        const saldoActual = baseDeDatosUsuarios[usuarioConectado].saldo;
        $("#saldo").text("$" + parseInt(saldoActual).toLocaleString("es-CL"));

        const historial = baseDeDatosUsuarios[usuarioConectado].historial || [];
        const tbody = $("#movimientos-completo");

        tbody.empty();

        if (historial.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="3" class="text-center text-muted py-4">No registras movimientos en tu cuenta aún.</td>
                </tr>
            `);
        } else {
            [...historial].reverse().forEach(function(movimiento) {
                const esEntrada = movimiento.operacion.includes("Depósito") || movimiento.operacion.includes("Inicial");
                const claseMonto = esEntrada ? "text-success font-weight-bold" : "text-danger font-weight-bold";
                const signo = esEntrada ? "+" : "-";

                tbody.append(`
                    <tr>
                        <td class="pl-4 text-muted">${movimiento.fecha}</td>
                        <td class="font-weight-bold text-dark">${movimiento.operacion}</td>
                        <td class="text-right pr-4 ${claseMonto}">${signo} $${movimiento.monto.toLocaleString("es-CL")}</td>
                    </tr>
                `);
            });
        }
    }
});
