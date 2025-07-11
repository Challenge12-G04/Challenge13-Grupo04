document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de inicio de sesión cargado.");

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');

    const errorMessageContainer = document.getElementById('errorMessageContainer');
    const errorMessage = document.getElementById('errorMessage');
    const retryAttempts = document.getElementById('retryAttempts');
    const attemptsCount = document.getElementById('attemptsCount');

    const verificationSection = document.getElementById('verificationSection');
    const sendCodeEmailBtn = document.getElementById('sendCodeEmailBtn');
    const sendCodePhoneBtn = document.getElementById('sendCodePhoneBtn');
    const verificationCodeInput = document.getElementById('verificationCode');
    const verifyCodeButton = document.getElementById('verifyCodeButton');

    let failedAttempts = 0;
    const MAX_ATTEMPTS = 2; // Número de intentos fallidos antes de pedir verificación
    let correctVerificationCode = ''; // Simulación del código correcto

    // --- Funciones para mostrar/ocultar mensajes y secciones ---

    function showErrorMessage(message, isPersistent = false) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        if (!isPersistent) {
            setTimeout(() => {
                errorMessage.style.display = 'none';
                errorMessage.textContent = '';
            }, 5000); // Oculta el mensaje después de 5 segundos
        }
    }

    function hideErrorMessage() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

    function updateAttemptsDisplay() {
        if (failedAttempts > 0) {
            // MAX_ATTEMPTS es 2, entonces 0 intentos fallidos = 3 oportunidades, 1 fallo = 2, 2 fallos = 1.
            // Para mostrar los intentos restantes como "3", "2", "1"
            attemptsCount.textContent = (MAX_ATTEMPTS + 1) - failedAttempts;
            retryAttempts.style.display = 'block';
        } else {
            retryAttempts.style.display = 'none';
        }
    }

    function showVerificationSection() {
        // Oculta los campos de login
        loginForm.querySelector('label[for="username"]').style.display = 'none';
        usernameInput.style.display = 'none';
        loginForm.querySelector('label[for="password"]').style.display = 'none';
        passwordInput.style.display = 'none';
        loginButton.style.display = 'none';
        errorMessageContainer.style.display = 'none'; // Oculta los mensajes de error y contador

        verificationSection.style.display = 'block'; // Muestra la sección de verificación
    }

    function hideVerificationSection() {
        // Muestra los campos de login
        loginForm.querySelector('label[for="username"]').style.display = 'block';
        usernameInput.style.display = 'block';
        loginForm.querySelector('label[for="password"]').style.display = 'block';
        passwordInput.style.display = 'block';
        loginButton.style.display = 'block';
        errorMessageContainer.style.display = 'block'; // Vuelve a mostrar el contenedor por si hay mensajes generales

        verificationSection.style.display = 'none';
        verificationCodeInput.value = ''; // Limpia el input del código
        correctVerificationCode = ''; // Reinicia el código de verificación
    }

    // --- Función de validación de Email (si el username fuera un email) ---
    // (Esta función es útil si tu "username" debe ser un formato de correo electrónico)
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex más robusto para email
        return re.test(String(email).toLowerCase());
    }

    // --- Lógica de Simulación de Login ---

    // Usuario y contraseña simulados (¡NO USAR EN PRODUCCIÓN!)
    const VALID_USERNAME = 'usuario123';
    const VALID_PASSWORD = 'password123';
    // Si el username debe ser un email, podrías poner: const VALID_USERNAME = 'test@example.com';

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        hideErrorMessage(); // Limpia cualquier mensaje de error anterior

        // --- VALIDACIÓN INICIAL DEL FORMULARIO (BASADA EN TU SINTAXIS) ---
        if (!username || !password) {
            showErrorMessage("Por favor, complete todos los campos del formulario.");
            return; // Detiene la ejecución si hay campos vacíos
        }

        // Si tu username DEBE ser un email, descomenta y usa esta validación:
        /*
        if (!validateEmail(username)) {
            showErrorMessage("Por favor, ingrese un usuario con formato de correo válido.");
            return; // Detiene la ejecución si el email no es válido
        }
        */
        // --- FIN VALIDACIÓN INICIAL ---


        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            // Credenciales correctas
            failedAttempts = 0; // Reinicia los intentos
            updateAttemptsDisplay();
            alert('Inicio de sesión exitoso. Redirigiendo...');
            window.location.href = 'paginaprincipal.html'; // Redirige a la página principal
        } else {
            // Credenciales incorrectas
            failedAttempts++;
            updateAttemptsDisplay();

            if (failedAttempts <= MAX_ATTEMPTS) {
                showErrorMessage('Usuario o contraseña incorrectos. Intenta de nuevo.');
            } else {
                showErrorMessage('Demasiados intentos fallidos. Por favor, verifica tu identidad.', true); // Mensaje persistente
                showVerificationSection();
            }
        }
    });

    // --- Lógica de Verificación de Código ---

    function generateCode() {
        // Genera un código numérico simple de 6 dígitos
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    sendCodeEmailBtn.addEventListener('click', function() {
        correctVerificationCode = generateCode();
        // En una aplicación real, aquí se llamaría a un servicio backend
        // para enviar el código por email al usuario asociado al username.
        alert(`Se ha enviado un código de verificación a tu correo electrónico simulado: ${correctVerificationCode}`);
        console.log(`Código enviado a email: ${correctVerificationCode}`); // Para pruebas
    });

    sendCodePhoneBtn.addEventListener('click', function() {
        correctVerificationCode = generateCode();
        // En una aplicación real, aquí se llamaría a un servicio backend
        // para enviar el código por SMS al número de teléfono asociado al username.
        alert(`Se ha enviado un código de verificación a tu celular simulado: ${correctVerificationCode}`);
        console.log(`Código enviado a celular: ${correctVerificationCode}`); // Para pruebas
    });

    verifyCodeButton.addEventListener('click', function() {
        const enteredCode = verificationCodeInput.value.trim();

        if (enteredCode === correctVerificationCode && correctVerificationCode !== '') {
            alert('Código de verificación correcto. Inicio de sesión completado.');
            // Puedes reiniciar los intentos o redirigir directamente
            failedAttempts = 0; // Reinicia los intentos al verificar correctamente
            updateAttemptsDisplay();
            hideVerificationSection(); // Oculta la sección de verificación
            window.location.href = 'paginaprincipal.html'; // Redirige a la página principal
        } else {
            showErrorMessage('Código de verificación incorrecto o expirado. Intenta de nuevo.', true);
            verificationCodeInput.value = ''; // Limpia el campo
        }
    });

    // --- Inicialización ---
    updateAttemptsDisplay(); // Asegura que el contador no se muestre al inicio si no hay fallos
});