document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de registro cargado."); // ESTE MENSAJE DEBE APARECER EN LA CONSOLA

    const registrationForm = document.getElementById('registrationForm'); // Verifica este ID
    const telInput = document.getElementById('tel');
    const dniInput = document.getElementById('dni');
    const emailInput = document.getElementById('email');
    const contraInput = document.getElementById('contra');
    const repitInput = document.getElementById('repit');

    const formMessageContainer = document.getElementById('formMessageContainer'); // Verifica este ID
    const formMessage = document.getElementById('formMessage'); // Verifica este ID

    // Función para mostrar mensajes (éxito o error)
    function showFormMessage(message, type = 'error', isPersistent = false) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`; // Añade clase 'error' o 'success'
        formMessage.style.display = 'block';
        if (!isPersistent) {
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.textContent = '';
            }, 5000); // Oculta el mensaje después de 5 segundos
        }
    }

    // Función para validar Email (reutilizada de tu sintaxis)
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        const tel = telInput.value.trim();
        const dni = dniInput.value.trim();
        const email = emailInput.value.trim();
        const contra = contraInput.value.trim();
        const repit = repitInput.value.trim();

        // Ocultar cualquier mensaje anterior
        formMessage.style.display = 'none';

        // --- VALIDACIONES DEL FORMULARIO DE REGISTRO (usando tu sintaxis) ---

        // 1. Validar campos vacíos
        if (!tel || !dni || !email || !contra || !repit) {
            showFormMessage("Por favor, complete todos los campos del formulario.", 'error');
            return;
        }

        // 2. Validar formato de correo electrónico
        if (!validateEmail(email)) {
            showFormMessage("Por favor, ingrese un correo electrónico válido.", 'error');
            return;
        }

        // 3. Validar longitud de DNI (ejemplo: 8 dígitos para Perú)
        if (dni.length !== 8 || isNaN(dni)) {
            showFormMessage("El DNI debe contener exactamente 8 dígitos numéricos.", 'error');
            return;
        }

        // 4. Validar longitud de Teléfono (ejemplo: 9 dígitos para Perú)
        if (tel.length !== 9 || isNaN(tel)) {
            showFormMessage("El número de celular debe contener exactamente 9 dígitos numéricos.", 'error');
            return;
        }

        // 5. Validar que las contraseñas coincidan
        if (contra !== repit) {
            showFormMessage("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.", 'error');
            return;
        }

        // 6. Validar complejidad de la contraseña (ejemplo: mínimo 6 caracteres)
        if (contra.length < 6) {
            showFormMessage("La contraseña debe tener al menos 6 caracteres.", 'error');
            return;
        }

        // --- Si todas las validaciones pasan, proceder con el registro (simulado) ---
        const confirmation = confirm("Está a punto de crear su cuenta, ¿Desea Continuar?");

        if (confirmation) {
            console.log("Datos de registro:", {
                tel: tel,
                dni: dni,
                email: email,
                password: contra
            });

            // Mostrar mensaje de éxito
            showFormMessage("¡Registro exitoso! Redirigiendo a la página de inicio de sesión...", 'success', true);

            // Redirigir al usuario después de un breve retraso
            setTimeout(() => {
                window.location.href = 'iniciarsesion.html'; // Asegúrate que esta ruta sea correcta
            }, 2000); // Redirige después de 2 segundos
        } else {
            showFormMessage("Registro cancelado.", 'error');
        }
    });
});