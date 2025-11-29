const btnGetJson  = document.querySelector('#btnGetJson');
const btnPostPhp  = document.querySelector('#btnPostPhp');
const btnGetPhp   = document.querySelector('#btnGetPhp');
const btnPostSql  = document.querySelector('#btnPostSql');
const btnGetSql   = document.querySelector('#btnGetSql');
const infoMsg     = document.querySelector('.info-msg');
btnPostPhp.disabled = true;
btnPostSql.disabled = true;

// Objeto de patrones de REGEX
const patterns = {
    nombre: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/u,
    apellidos: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/u,
    dninie: /^(?:\d{8}[A-HJ-NP-TV-Z]|[XYZ]\d{7}[A-HJ-NP-TV-Z])$/i,
    nacimiento: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
    postal: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    fijo: /^(8|9)\d{8}$/,
    movil: /^(6|7)\d{8}$/,
    iban: /^ES\d{22}$/,
    credito: /^\d{13,19}$/,
    contrasena: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/,
    repcontrasena: /.*/
};

// Prevenir envío real del formulario
document.querySelector('#formulario').addEventListener('submit', (e) => {
    e.preventDefault();
});

// Inputs
const inputs = document.querySelectorAll('input');

// Mostrar mensaje en el DOM
function mostrarMensaje(texto) {
    infoMsg.textContent = texto;
    infoMsg.classList.remove('oculto');
    setTimeout(() => infoMsg.classList.add('oculto'), 5000);
}

// Validación en keyup
inputs.forEach((input) => {
    input.addEventListener('keyup', (e) => {
        const name = e.target.name;
        if (!name || name.trim() === "") return;

        // Comprobar campos de contraseña
        if (name === "contrasena" || name === "repcontrasena") {
            validateRepeatPassword();
            return;
        }

        const regex = patterns[name];
        if (regex) {
            validate(e.target, regex);
        }
    });
});

// Función de validación de un campo
function validate(campo, regex) {
    const contenedor = campo.parentElement;
    // Mensaje específico para cada campo
    const mensajes = {
        nombre: "El nombre debe empezar con mayúscula y solo letras.",
        apellidos: "Máximo dos apellidos y deben empezar con mayúscula.",
        dninie: "DNI/NIE inválido.",
        nacimiento: "El formato debe ser dd/mm/aaaa",
        postal: "Código postal inválido.",
        email: "Formato de email inválido.",
        fijo: "Debe empezar por 8 o 9, y deben ser 9 dígitos.",
        movil: "Debe empezar por 6 o 7, y deben ser 9 dígitos.",
        iban: "IBAN incorrecto. Debe ser 'ES', seguido de 22 dígitos.",
        credito: "Tarjeta no válida. Debe tener entre 13 y 19 dígitos",
        contrasena: "Debe tener 12 caracteres incluyendo letra, número y símbolo.",
        repcontrasena: "Las contraseñas no coinciden o no cumplen el formato."
    };

    let mensaje = contenedor.querySelector('.mensaje-error');

    if (!mensaje) {
        mensaje = document.createElement('div');
        mensaje.classList.add('mensaje-error');
        contenedor.appendChild(mensaje);
    }

    if (campo.value.trim() === "") {
        campo.classList.remove('valido', 'invalido');
        mensaje.textContent = "";
        mensaje.style.display = "none";
        comprobarCamposValidos();
        return;
    }

    if (regex && regex.test(campo.value)) {
        campo.classList.remove('invalido');
        campo.classList.add('valido');
        mensaje.textContent = "";
        mensaje.style.display = "none";
    } else {
        campo.classList.remove('valido');
        campo.classList.add('invalido');
        mensaje.textContent = mensajes[campo.name] || "El valor introducido no es válido";
        mensaje.style.display = "block";
    }

    comprobarCamposValidos();
}

// Comparar campos de contraseña y repetir contraseña
function validateRepeatPassword() {
    const passInput = document.querySelector('input[name="contrasena"]');
    const repInput  = document.querySelector('input[name="repcontrasena"]');
    validate(passInput, patterns.contrasena);

    const contenedorRep = repInput.parentElement;
    let mensaje = contenedorRep.querySelector('.mensaje-error');

    if (!mensaje) {
        mensaje = document.createElement('div');
        mensaje.classList.add('mensaje-error');
        contenedorRep.appendChild(mensaje);
    }

    if ((repInput.value).trim() === "") {
        repInput.classList.remove('valido', 'invalido');
        mensaje.textContent = "";
        mensaje.style.display = "none";
        comprobarCamposValidos();
        return;
    }

    // Comprobar formato y coincidencia
    const formatoOk = patterns.contrasena.test(repInput.value);
    const coincide  = repInput.value === passInput.value;

    if (formatoOk && coincide) {
        repInput.classList.remove('invalido');
        repInput.classList.add('valido');
        mensaje.textContent = "";
        mensaje.style.display = "none";
    } else {
        repInput.classList.remove('valido');
        repInput.classList.add('invalido');

        if (!formatoOk) {
            mensaje.textContent = "Debe tener 12 caracteres incluyendo letra, número y símbolo.";
        } else {
            mensaje.textContent = "Las contraseñas no coinciden.";
        }
        mensaje.style.display = "block";
    }

    comprobarCamposValidos();
}


// Comprueba si todos los campos son válidos
function comprobarCamposValidos() {
    let todosValidos = true;
    inputs.forEach((input) => {
        const name = input.name;
        if (!name || name.trim() === "") return;

        if (!patterns[name] && name !== "repcontrasena") return;

        if (input.value.trim() === "" || !input.classList.contains('valido')) {
            todosValidos = false;
        }
    });
    btnPostPhp.disabled = !todosValidos;
    btnPostSql.disabled = !todosValidos;

    return todosValidos;
}


// Construir objeto JSON
function construirObjetoServidor() {
    return {
        nombre:    document.querySelector('#nombre').value,
        apellido:  document.querySelector('#apellidos').value,
        dni:       document.querySelector('#dninie').value,
        fecha:     document.querySelector('#nacimiento').value,
        cp:        document.querySelector('#postal').value,
        correo:    document.querySelector('#email').value,
        telefono: document.querySelector('#fijo').value,
        movil:    document.querySelector('#movil').value,
        tarjeta:   document.querySelector('#credito').value,
        iban:      document.querySelector('#iban').value,
        contrasena: document.querySelector('#contrasena').value
    };
}

// Rellenar el formulario a partir del objeto devuelto
function rellenarFormularioDesdeServidor(datos) {
    if (!datos) return;

    document.querySelector('#nombre').value    = datos.nombre || "";
    document.querySelector('#apellidos').value = datos.apellido || "";
    document.querySelector('#dninie').value    = datos.dni || "";
    document.querySelector('#nacimiento').value= datos.fecha || "";
    document.querySelector('#postal').value    = datos.cp || "";
    document.querySelector('#email').value     = datos.correo || "";
    document.querySelector('#fijo').value      = datos.telefono || "";
    document.querySelector('#movil').value     = datos.movil || "";
    document.querySelector('#credito').value   = datos.tarjeta || "";
    document.querySelector('#iban').value      = datos.iban || "";
    document.querySelector('#contrasena').value    = datos.contrasena || "";
    document.querySelector('#repcontrasena').value = datos.contrasena || "";

    // Revalidar todos los campos
    document.querySelectorAll('input').forEach(input => {
        const name = input.name;
        if (name === "repcontrasena") {
            validateRepeatPassword();
        } else if (patterns[name]) {
            validate(input, patterns[name]);
        }
    });
}

// Limpiar formulario tras publicar
function limpiarFormulario() {
    document.querySelectorAll('input').forEach(input => {
        input.value = "";
        input.classList.remove('valido', 'invalido');
    });

    document.querySelectorAll('.mensaje-error').forEach(msg => {
        msg.textContent = "";
        msg.style.display = "none";
    });
}

// GET .json (datos.json)
btnGetJson.addEventListener('click', async () => {
    try {
        const response = await fetch('datos.json');
        if (!response.ok) {
            throw new Error('Respuesta HTTP no válida');
        }

        const datos = await response.json();
        rellenarFormularioDesdeServidor(datos);
        mostrarMensaje('Datos cargados desde datos.json');
    } catch (error) {
        mostrarMensaje('Error al leer datos desde datos.json: ' + error.message);
    }
});

// POST -> process.php (envíar objeto. El servidor lo rebota)
btnPostPhp.addEventListener('click', async () => {
    const datos = construirObjetoServidor();
    const dbParam = encodeURIComponent(JSON.stringify(datos));

    try {
        const response = await fetch('process.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'x=' + dbParam
        });

        if (!response.ok) {
            throw new Error('Respuesta HTTP no válida: ' + response.status);
        }

        const myObj = await response.json();
        console.log('Respuesta de process.php (POST):', myObj);

        limpiarFormulario();
        mostrarMensaje(myObj.nombre + ' se ha enviado y recibido correctamente desde process.php');
    } catch (error) {
        mostrarMensaje('Error al enviar datos a process.php: ' + error.message);
    }
});

// GET -> process.php
btnGetPhp.addEventListener('click', async () => {
    try {
        const response = await fetch('process.php');

        if (!response.ok) {
            throw new Error('Respuesta HTTP no válida: ' + response.status);
        }

        const datos = await response.json();
        console.log('Respuesta de process.php (GET):', datos);

        rellenarFormularioDesdeServidor(datos);
        mostrarMensaje(datos.nombre + ' se ha recibido correctamente desde process.php');
    } catch (error) {
        mostrarMensaje('Error al obtener datos desde process.php: ' + error.message);
    }
});


// POST + SQL (guardar en BD)
btnPostSql.addEventListener('click', async () => {
    const datos = construirObjetoServidor();

    try {
        const response = await fetch('postSql.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Respuesta HTTP no válida');
        }

        const resultado = await response.json();

        if (resultado.ok) {
            limpiarFormulario();
            mostrarMensaje('Datos guardados en la base de datos');
        } else {
            mostrarMensaje('Error al guardar en la base de datos: ' + (resultado.error || 'desconocido'));
        }
    } catch (error) {
        mostrarMensaje('Error de conexión con postSql.php: ' + error.message);
    }
});

// GET + SQL (según el DNI)
btnGetSql.addEventListener('click', async () => {
    const dniInput = document.querySelector('#dninie');
    const dni = dniInput.value.trim();

    if (dni === '') {
        mostrarMensaje('Escribe un DNI en el formulario para buscar en la base de datos');
        return;
    }

    try {
        const response = await fetch('getSql.php?dni=' + encodeURIComponent(dni));

        if (!response.ok) {
            throw new Error('Respuesta HTTP no válida');
        }

        const datos = await response.json();

        if (datos && datos.dni) {
            rellenarFormularioDesdeServidor(datos);
            mostrarMensaje('Datos obtenidos desde la base de datos');
        } else {
            mostrarMensaje('No se ha encontrado ningún usuario con ese DNI en la base de datos');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión con getSql.php: ' + error.message);
    }
});