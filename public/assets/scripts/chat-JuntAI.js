document.addEventListener('DOMContentLoaded', function () {
    // Referencias a elementos del DOM
    const chatInput = document.getElementById('chatInput');
    const consultaForm = document.getElementById('consultaForm');
    const chatMessages = document.getElementById('chatMessages');

    // Referencias al modal de feedback
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    const feedbackGotItBtn = document.getElementById('feedbackGotItBtn');
    const feedbackMoreInfoBtn = document.getElementById('feedbackMoreInfoBtn');

    // Referencias a los botones de cámara y micrófono
    const cameraBtn = document.getElementById('cameraBtn');
    const microphoneBtn = document.getElementById('microphoneBtn');

    // Referencias al nuevo modal de privacidad
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    const openPrivacyBtn = document.getElementById('openPrivacyBtn');
    const voiceAnalysisToggle = document.getElementById('voiceAnalysisToggle');
    const facialAnalysisToggle = document.getElementById('facialAnalysisToggle');
    const savePrivacyBtn = document.getElementById('savePrivacyBtn');

    // --- Variables de estado de privacidad (simuladas) ---
    // Usaremos localStorage para simular persistencia
    let isVoiceAnalysisEnabled = localStorage.getItem('voiceAnalysisEnabled') === 'true';
    let isFacialAnalysisEnabled = localStorage.getItem('facialAnalysisEnabled') === 'true';

    // Inicializar toggles con los valores guardados
    voiceAnalysisToggle.checked = isVoiceAnalysisEnabled;
    facialAnalysisToggle.checked = isFacialAnalysisEnabled;


    // --- Funciones de Modales ---
    function showModal(modalElement) {
        modalElement.style.display = 'block';
    }

    function hideModal(modalElement) {
        modalElement.style.display = 'none';
    }

    // --- Lógica del Modal de Feedback ---
    window.triggerFeedback = function(type = 'general') {
        showModal(feedbackModal);
        // Aquí podrías personalizar el contenido del modal si tuvieras más tipos
    };

    closeFeedbackModal.addEventListener('click', () => hideModal(feedbackModal));
    feedbackGotItBtn.addEventListener('click', () => hideModal(feedbackModal));
    feedbackMoreInfoBtn.addEventListener('click', () => {
        // Enlace a recurso externo sobre depresión/ansiedad/salud mental
        window.open('https://www.who.int/es/news-room/fact-sheets/detail/depression', '_blank');
        hideModal(feedbackModal);
    });

    // --- Lógica del Modal de Privacidad ---
    // Mostrar modal de privacidad al cargar la página si no se ha configurado antes
    if (!localStorage.getItem('privacyConfigured')) {
        showModal(privacyModal);
    }

    openPrivacyBtn.addEventListener('click', () => showModal(privacyModal));
    closePrivacyModal.addEventListener('click', () => hideModal(privacyModal));

    savePrivacyBtn.addEventListener('click', () => {
        isVoiceAnalysisEnabled = voiceAnalysisToggle.checked;
        isFacialAnalysisEnabled = facialAnalysisToggle.checked;

        // Guardar preferencias en localStorage
        localStorage.setItem('voiceAnalysisEnabled', isVoiceAnalysisEnabled);
        localStorage.setItem('facialAnalysisEnabled', isFacialAnalysisEnabled);
        localStorage.setItem('privacyConfigured', 'true'); // Marca que la privacidad ya fue configurada

        alert('Preferencias de privacidad guardadas.'); // Feedback simple
        hideModal(privacyModal);
        updateButtonStates(); // Actualizar el estado de los botones de cámara/micrófono
    });

    // --- Actualizar estado de los botones de cámara/micrófono ---
    function updateButtonStates() {
        if (cameraBtn) {
            if (!isFacialAnalysisEnabled) {
                cameraBtn.classList.add('disabled-button');
                cameraBtn.title = 'Análisis facial desactivado en privacidad';
                cameraBtn.disabled = true; // Deshabilitar el botón
            } else {
                cameraBtn.classList.remove('disabled-button');
                cameraBtn.title = 'Activar cámara para análisis facial';
                cameraBtn.disabled = false;
            }
        }
        if (microphoneBtn) {
            if (!isVoiceAnalysisEnabled) {
                microphoneBtn.classList.add('disabled-button');
                microphoneBtn.title = 'Análisis de voz desactivado en privacidad';
                microphoneBtn.disabled = true; // Deshabilitar el botón
            } else {
                microphoneBtn.classList.remove('disabled-button');
                microphoneBtn.title = 'Activar micrófono para análisis de voz';
                microphoneBtn.disabled = false;
            }
        }
    }
    updateButtonStates(); // Llamar al cargar para establecer el estado inicial

    // --- Listeners para los botones de cámara y micrófono ---
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            if (!isFacialAnalysisEnabled) {
                alert('No puedes activar la cámara. El análisis facial está desactivado en tu configuración de privacidad.');
            } else {
                alert('Funcionalidad de cámara (con análisis facial) no implementada en esta versión.');
                // Aquí iría la lógica real para activar la cámara
            }
        });
    }

    if (microphoneBtn) {
        microphoneBtn.addEventListener('click', () => {
            if (!isVoiceAnalysisEnabled) {
                alert('No puedes activar el micrófono. El análisis de voz está desactivado en tu configuración de privacidad.');
            } else {
                alert('Funcionalidad de micrófono (con análisis de voz) no implementada en esta versión.');
                // Aquí iría la lógica real para activar el micrófono
            }
        });
    }


    // --- Funciones para añadir mensajes al chat ---
    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'junt-ai-message');

        const avatarElement = document.createElement('img');
        avatarElement.classList.add('message-avatar');
        avatarElement.src = sender === 'user' ? 'assets/images/user-avatar.png' : 'assets/images/JUNTOLOGO.png';
        avatarElement.alt = sender === 'user' ? 'User Avatar' : 'JuntAI Avatar';

        const textContentElement = document.createElement('div');
        textContentElement.classList.add('message-text');
        textContentElement.innerHTML = text; // Permite HTML en la respuesta (ej. enlaces, botones)

        if (sender === 'user') {
            messageElement.appendChild(textContentElement);
            messageElement.appendChild(avatarElement);
        } else {
            messageElement.appendChild(avatarElement);
            messageElement.appendChild(textContentElement);
        }
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- Lógica de Respuestas de JuntAI ---
    function getJuntAIResponse(userMessage) {
        let response = "JuntAI dice: No estoy seguro de cómo responder a eso. ¿Podrías intentar hacer otra consulta?";
        const lowerCaseMessage = userMessage.toLowerCase();

        // Respuestas generales
        if (lowerCaseMessage.includes("hola")) {
            response = "Hola, te saluda JuntAI. Estoy aquí para poder resolver cada una de tus consultas.";
        } else if (lowerCaseMessage.includes("gracias")) {
            response = "De nada. No dudes en consultarme cualquier otra duda que tengas.";
        }
        // Respuestas de salud mental, ansiedad, depresión con feedback mejorado
        else if (lowerCaseMessage.includes("ansiedad") || lowerCaseMessage.includes("sintiendo ansioso") || lowerCaseMessage.includes("ataque de panico") || lowerCaseMessage.includes("nervioso")) {
            // Feedback visual claro: mensaje directo y opciones.
            response = `**¡Detectamos señales de ansiedad en tu mensaje!** Entiendo que te sientes así. Es importante reconocer estos sentimientos. Algunas estrategias que pueden ayudarte son la respiración profunda, la meditación o buscar un lugar tranquilo. Si necesitas más apoyo, estamos aquí.
            <div class="feedback-options">
                <button class="feedback-button" onclick="window.open('https://www.paho.org/es/temas/ansiedad', '_blank')">Más sobre ansiedad (OPS/OMS)</button>
                <button class="feedback-button" onclick="triggerFeedback('ansiedad')">Necesito más ayuda</button>
            </div>`;
        } else if (lowerCaseMessage.includes("depresion") || lowerCaseMessage.includes("triste") || lowerCaseMessage.includes("desanimado") || lowerCaseMessage.includes("sin energia") || lowerCaseMessage.includes("no quiero hacer nada")) {
            // Feedback visual claro: mensaje directo y opciones.
            response = `**¡Detectamos señales de depresión en tu mensaje!** Lamento mucho que te sientas así. La depresión es una condición seria que requiere atención. Es fundamental buscar el apoyo de un profesional de la salud mental. Recuerda que no estás solo/a.
            <div class="feedback-options">
                <button class="feedback-button" onclick="window.open('https://www.who.int/es/news-room/fact-sheets/detail/depression', '_blank')">Más sobre depresión (OMS)</button>
                <button class="feedback-button" onclick="triggerFeedback('depresion')">Necesito más ayuda</button>
            </div>`;
        } else if (lowerCaseMessage.includes("salud mental") || lowerCaseMessage.includes("bienestar emocional") || lowerCaseMessage.includes("cuidar mi mente")) {
            response = `Cuidar tu salud mental es tan importante como la física. Actividades como la meditación, pasar tiempo al aire libre, mantener conexiones sociales y una buena higiene del sueño contribuyen a tu bienestar emocional. Si sientes que lo necesitas, no dudes en buscar apoyo profesional.
            <div class="feedback-options">
                <button class="feedback-button" onclick="window.open('https://www.minsa.gob.pe/recursos/salud_mental.html', '_blank')">Recursos de Salud Mental (MINSA)</button>
                <button class="feedback-button" onclick="triggerFeedback('general')">¿Cómo puedo mejorar?</button>
            </div>`;
        } else if (lowerCaseMessage.includes("ayuda profesional") || lowerCaseMessage.includes("terapia") || lowerCaseMessage.includes("psicologo")) {
            response = `Buscar ayuda profesional es un paso valiente y muy efectivo. Un psicólogo o terapeuta puede ofrecerte herramientas y un espacio seguro para explorar tus pensamientos y emociones. Te animo a dar ese paso.
            <div class="feedback-options">
                <button class="feedback-button" onclick="triggerFeedback('profesional')">Encontrar un profesional</button>
            </div>`;
        }
        // Respuestas de temas de salud específicos
        else if (lowerCaseMessage.includes("comer sano") || lowerCaseMessage.includes("dieta") || lowerCaseMessage.includes("alimentacion")) {
            response = "Una alimentación balanceada es clave para tu bienestar. Prioriza frutas, verduras, proteínas magras y granos integrales. Evita el exceso de azúcares y grasas saturadas.";
        } else if (lowerCaseMessage.includes("ejercicio") || lowerCaseMessage.includes("actividad fisica") || lowerCaseMessage.includes("deporte")) {
            response = "El ejercicio regular mejora tu estado de ánimo y salud física. Intenta al menos 30 minutos de actividad moderada la mayoría de los días de la semana.";
        } else if (lowerCaseMessage.includes("sueño") || lowerCaseMessage.includes("dormir") || lowerCaseMessage.includes("insomnio")) {
            response = "Para mejorar tu sueño, establece un horario regular, crea un ambiente oscuro y tranquilo, y evita cafeína y pantallas antes de acostarte.";
        } else if (lowerCaseMessage.includes("estres") || lowerCaseMessage.includes("relajacion")) {
            response = "Manejar el estrés es vital. Prueba técnicas de relajación como la respiración profunda, la meditación o el yoga. También ayuda organizar tus tareas y establecer límites.";
        }
        // Noticias
        else if (lowerCaseMessage.includes("noticias sobre depresión") || lowerCaseMessage.includes("noticias salud emocional")) {
            response = `
                <div>
                    <p>Te comparto una noticia relevante sobre salud mental:</p>
                    <a href="https://www.gob.pe/institucion/minsa/noticias/1056686-minsa-participo-en-la-inauguracion-de-la-feria-apec-ciudadano-2024"
                       target="_blank"
                       style="color: #307FD9; text-decoration: underline;">
                       Se inaugura la Feria APEC Ciudadano 2024
                    </a>
                    <p>En esta noticia, el MINSA participó en la inauguración destacando la importancia de la salud pública y el compromiso con el bienestar ciudadano.</p>
                </div>
            `;
        }
        // Consulta general de salud
        else if (lowerCaseMessage.includes("salud") || lowerCaseMessage.includes("bienestar")) {
            response = "La salud integral abarca mente y cuerpo. Estoy aquí para ofrecerte información general y recordarte la importancia de un estilo de vida saludable.";
        }

        return response;
    }

    // --- Funcionalidad principal de envío de mensajes de texto ---
    consultaForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que la página se recargue

        const userMessage = chatInput.value.trim();
        if (userMessage === '') return; // No enviar mensajes vacíos

        appendMessage(userMessage, 'user');
        chatInput.value = ''; // Limpiar el input
        chatInput.style.height = 'auto'; // Restablecer altura del textarea

        // Simular la respuesta de JuntAI después de un breve retraso
        setTimeout(() => {
            const juntAIResponse = getJuntAIResponse(userMessage);
            appendMessage(juntAIResponse, 'junt-ai');
        }, 500); // Retraso de 0.5 segundos
    });

    // Ajustar altura del textarea automáticamente
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight) + 'px';
    });

    // Asegurarse de que el chat se desplace al cargar
    chatMessages.scrollTop = chatMessages.scrollHeight;

});