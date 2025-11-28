const btnGetJson  = document.querySelector('#btnGetJson');
const btnPostPhp  = document.querySelector('#btnPostPhp');
const btnGetPhp   = document.querySelector('#btnGetPhp');
const btnPostSql  = document.querySelector('#btnPostSql');
const btnGetSql   = document.querySelector('#btnGetSql');
const infoMsg     = document.querySelector('.info-msg');


// Objeto de patrones de REGEX.
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

// Contraseñas (sin los ••••)
const contrasenas = {
    contrasena: "",
    repcontrasena: ""
};

//// Declaramos la constante 'inputs' que contendrá la colección de inputs. 
const form = document.querySelector('#formulario').addEventListener('submit', (e) => {
    e.preventDefault();
});
const inputs = document.querySelectorAll('input');

// Borra en la posición del cursor o selección
function borrarCaracteres(valor, start, end) {
    if (start === 0 && start === end) {
        return { nuevoValor: valor, nuevaPos: start };
    }

    // Si hay selección, borrar el rango [start, end]
    if (start !== end) {
        const nuevoValor = valor.slice(0, start) + valor.slice(end);
        return { nuevoValor, nuevaPos: start };
    }

    // Si no hay selección, borrar el carácter a la izquierda del cursor
    const nuevoValor = valor.slice(0, start - 1) + valor.slice(start);
    return { nuevoValor, nuevaPos: start - 1 };
}

// Validación en keyup (sin ser contraseñas)
inputs.forEach((input) => {
    input.addEventListener('keyup', (e) => {
        const name = e.target.name;
        if (!name || name.trim() === "") return;

        if (name === "contrasena" || name === "repcontrasena") {
            return;
        }

        validate(e.target, patterns[name]);
    });
});

// Manejar eventos (borrar y puntos en contraseñas)
inputs.forEach((input) => {
    input.addEventListener('keydown', (e) => {
        const name = input.name;

        if (name === "contrasena" || name === "repcontrasena") {
            if (e.key === "Backspace") {
                e.preventDefault();
                const start = input.selectionStart ?? contrasenas[name].length;
                const end = input.selectionEnd ?? contrasenas[name].length;
                const { nuevoValor, nuevaPos } = borrarCaracteres(contrasenas[name], start, end);
                contrasenas[name] = nuevoValor;
                input.value = "•".repeat(contrasenas[name].length);
                input.selectionStart = input.selectionEnd = Math.max(0, Math.min(nuevaPos, input.value.length));
                validatePasswordField(name, input);
                return;
            }

            if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }

            e.preventDefault();
            const start = input.selectionStart ?? contrasenas[name].length;
            const end = input.selectionEnd ?? contrasenas[name].length;
            const antes = contrasenas[name].slice(0, start);
            const despues = contrasenas[name].slice(end);
            contrasenas[name] = antes + e.key + despues;
            input.value = "•".repeat(contrasenas[name].length);
            const nuevaPos = start + 1;
            input.selectionStart = input.selectionEnd = Math.max(0, Math.min(nuevaPos, input.value.length));
            validatePasswordField(name, input);
            return;
        }

        // Resto de campos
        if (e.key === "Backspace") {
            e.preventDefault();
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? input.value.length;
            const { nuevoValor, nuevaPos } = borrarCaracteres(input.value, start, end);
            input.value = nuevoValor;
            let pos = nuevaPos;
            if (pos < 0) {
                pos = 0;
            } else if (pos > input.value.length) {
                pos = input.value.length;
            }
            input.selectionStart = pos;
            input.selectionEnd = pos;
            const name = input.name;
            if (name && name.trim() !== "") {
                validate(input, patterns[name]);
            }
        }
    });
});

// Validar campo de contraseña
function validatePasswordField(name, input) {
    const realValue = contrasenas[name] || "";
    input.value = realValue;
    validate(input, patterns[name]);
    input.value = "•".repeat(realValue.length);
}

function validate(campo, regex) {
    const contenedor = campo.parentElement;

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

    if (campo.name === "contrasena" || campo.name === "repcontrasena") {
        campo.value = contrasenas[campo.name] || "";
    }

    // Validar repetir contraseña
    if (campo.name === "repcontrasena") {
        const valorRep = contrasenas.repcontrasena || "";
        const valorContrasena = contrasenas.contrasena || "";
        if (valorRep.trim() === "") {
            campo.classList.remove('valido', 'invalido');
            mensaje.textContent = "";
            mensaje.style.display = "none";
            comprobarCamposValidos();
            return;
        }

        const regexContrasena = patterns.contrasena;
        const cumpleFormato = regexContrasena.test(valorRep);
        const coincide = valorRep === valorContrasena;
        if (cumpleFormato && coincide) {
            campo.classList.remove('invalido');
            campo.classList.add('valido');
            mensaje.textContent = "";
            mensaje.style.display = "none";
        } else {
            campo.classList.remove('valido');
            campo.classList.add('invalido');
            if (!cumpleFormato) {
                mensaje.textContent = mensajes.contrasena;
            } else if (!coincide) {
                mensaje.textContent = "Las contraseñas no coinciden.";
            } else {
                mensaje.textContent = mensajes.repcontrasena;
            }
            mensaje.style.display = "block";
        }

        comprobarCamposValidos();
        return;
    }

    // Resto de campos
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

    // Revalidar campo de 'repetir' si cambia la contraseña
    if (campo.name === "contrasena") {
        const rep = document.querySelector('input[name="repcontrasena"]');
        if (rep) {
            validatePasswordField("repcontrasena", rep);
        }
    }

    comprobarCamposValidos();
}

// Comprueba si todos los campos son válidos para habilitar el botón de guardar
function comprobarCamposValidos() {
    let todosValidos = true;
    inputs.forEach((input) => {
        if (input.value.trim() === "" || !input.classList.contains('valido')) {
            todosValidos = false;
        }
    });
}

// Construir objeto JSON con los nombres del enunciado
function construirObjetoServidor() {
    return {
        nombre:    document.querySelector('#nombre').value,
        apellido:  document.querySelector('#apellidos').value,
        dni:       document.querySelector('#dninie').value,
        fecha:     document.querySelector('#nacimiento').value,
        cp:        document.querySelector('#postal').value,
        correo:    document.querySelector('#email').value,
        "teléfono": document.querySelector('#fijo').value,
        "móvil":    document.querySelector('#movil').value,
        tarjeta:   document.querySelector('#credito').value,
        iban:      document.querySelector('#iban').value,
        "contraseña": contrasenas.contrasena || ""
    };
}

// Rellenar el formulario a partir del objeto devuelto por servidor
function rellenarFormularioDesdeServidor(datos) {
    if (!datos) return;

    document.querySelector('#nombre').value    = datos.nombre || "";
    document.querySelector('#apellidos').value = datos.apellido || "";
    document.querySelector('#dninie').value    = datos.dni || "";
    document.querySelector('#nacimiento').value= datos.fecha || "";
    document.querySelector('#postal').value    = datos.cp || "";
    document.querySelector('#email').value     = datos.correo || "";
    document.querySelector('#fijo').value      = datos["teléfono"] || "";
    document.querySelector('#movil').value     = datos["móvil"] || "";
    document.querySelector('#credito').value   = datos.tarjeta || "";
    document.querySelector('#iban').value      = datos.iban || "";

    // Contraseñas
    const valorPass = datos["contraseña"] || "";
    contrasenas.contrasena   = valorPass;
    contrasenas.repcontrasena= valorPass;

    const inputCon = document.querySelector('#contrasena');
    const inputRep = document.querySelector('#repcontrasena');

    if (inputCon) {
        inputCon.value = "•".repeat(valorPass.length);
        validatePasswordField("contrasena", inputCon);
    }
    if (inputRep) {
        inputRep.value = "•".repeat(valorPass.length);
        validatePasswordField("repcontrasena", inputRep);
    }

    // Vuelve a validar todos los campos
    document.querySelectorAll('input').forEach(input => {
        const name = input.name;
        if (patterns[name]) {
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
    contrasenas.contrasena = "";
    contrasenas.repcontrasena = "";
}

// Mostrar mensaje
function mostrarMensaje(texto) {
    infoMsg.textContent = texto;
    infoMsg.classList.remove('oculto');
    setTimeout(() => infoMsg.classList.add('oculto'), 4000);
}