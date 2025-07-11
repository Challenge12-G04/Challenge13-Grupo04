document.addEventListener('DOMContentLoaded', function () {
    console.log("JuntAI chat script loaded.");


    const chatInput = document.getElementById('chatInput');
    const consultaForm = document.getElementById('consultaForm');
    const chatMessages = document.getElementById('chatMessages');
    const cameraBtn = document.getElementById('cameraBtn');
    const microphoneBtn = document.getElementById('microphoneBtn');

    // Modals
    const feedbackModal = document.getElementById('feedbackModal');
    const privacyModal = document.getElementById('privacyModal');

    // Privacy toggles
    const voiceAnalysisToggle = document.getElementById('voiceAnalysisToggle');
    const facialAnalysisToggle = document.getElementById('facialAnalysisToggle');

    // Load privacy settings from localStorage or set defaults
    let voiceAnalysisEnabled = localStorage.getItem('voiceAnalysisEnabled') === 'true';
    let facialAnalysisEnabled = localStorage.getItem('facialAnalysisEnabled') === 'true';

    // Set initial toggle states
    if (voiceAnalysisToggle) voiceAnalysisToggle.checked = voiceAnalysisEnabled;
    if (facialAnalysisToggle) facialAnalysisToggle.checked = facialAnalysisEnabled;



    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);

        const avatarElement = document.createElement('img');
        avatarElement.classList.add('message-avatar');
        avatarElement.alt = `${sender === 'user' ? 'User' : 'JuntAI'} Avatar`;

        // Corrected paths for avatars
        avatarElement.src = sender === 'user' ? 'public/assets/images/USERLOGO.png' : 'public/assets/images/JuntAI.jpg';

        const messageTextElement = document.createElement('div');
        messageTextElement.classList.add('message-text');
        messageTextElement.innerHTML = `<p>${message}</p>`;

        messageElement.appendChild(avatarElement);
        messageElement.appendChild(messageTextElement);
        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getJuntAIResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        const sensitiveKeywords = [
            'ansiedad', 'depresión', 'triste', 'angustia', 'preocupado',
            'solo', 'sola', 'miedo', 'estrés', 'desesperado', 'desesperada',
            'mal', 'desganado', 'bajo de ánimo', 'llorar'
        ];

        let response = "";
        let showFeedbackModal = false;

        for (const keyword of sensitiveKeywords) {
            if (lowerCaseMessage.includes(keyword)) {
                showFeedbackModal = true;
                break;
            }
        }

        if (showFeedbackModal) {
            setTimeout(() => feedbackModal.style.display = 'block', 700);
            return "Entiendo que puedas estar sintiendo algo difícil. Recuerda que no estás solo/a. ¿Hay algo más en lo que pueda ayudarte?";
        }

        // Consolidated responses
        if (lowerCaseMessage.includes("hola") || lowerCaseMessage.includes("saludos")) {
            response = "¡Hola! Te saluda JuntAI. Estoy aquí para poder resolver cada una de tus consultas.";
        } else if (lowerCaseMessage.includes("gracias")) {
            response = "De nada. No dudes en consultarme cualquier otra duda que tengas.";
        } else if (lowerCaseMessage.includes("ansiedad") || lowerCaseMessage.includes("ataque de panico") || lowerCaseMessage.includes("nervioso")) {
            response = `**¡Detectamos señales de ansiedad!** Entiendo que te sientes así. Respiración profunda, meditación o buscar un lugar tranquilo pueden ayudarte. Más en <a href="https://www.paho.org/es/temas/ansiedad" target="_blank" style="color: #307FD9; text-decoration: underline;">OPS/OMS</a>.`;
        } else if (lowerCaseMessage.includes("depresion") || lowerCaseMessage.includes("triste") || lowerCaseMessage.includes("desanimado")) {
            response = `**¡Detectamos señales de depresión!** Lamento que te sientas así. Busca apoyo profesional. Más en <a href="https://www.who.int/es/news-room/fact-sheets/detail/depression" target="_blank" style="color: #307FD9; text-decoration: underline;">OMS</a>.`;
        } else if (lowerCaseMessage.includes("salud mental") || lowerCaseMessage.includes("bienestar emocional")) {
            response = `Cuidar tu salud mental es clave. Meditación, aire libre, conexiones sociales y buen sueño ayudan. Recursos en <a href="https://www.minsa.gob.pe/recursos/salud_mental.html" target="_blank" style="color: #307FD9; text-decoration: underline;">MINSA</a>.`;
        } else if (lowerCaseMessage.includes("ayuda profesional") || lowerCaseMessage.includes("terapia") || lowerCaseMessage.includes("psicologo")) {
            response = `Buscar ayuda profesional es un paso valiente. Un terapeuta puede darte herramientas. Te animo a dar ese paso.`;
        } else if (lowerCaseMessage.includes("comer sano") || lowerCaseMessage.includes("alimentacion")) {
            response = "Una alimentación balanceada es clave. Prioriza frutas, verduras, proteínas magras y granos integrales. Evita azúcares y grasas saturadas.";
        } else if (lowerCaseMessage.includes("ejercicio") || lowerCaseMessage.includes("actividad fisica")) {
            response = "El ejercicio mejora tu ánimo. Intenta al menos 30 minutos de actividad moderada la mayoría de los días.";
        } else if (lowerCaseMessage.includes("sueño") || lowerCaseMessage.includes("dormir") || lowerCaseMessage.includes("insomnio")) {
            response = "Para mejorar tu sueño, establece un horario regular, ambiente oscuro y evita cafeína/pantallas antes de dormir.";
        } else if (lowerCaseMessage.includes("estres") || lowerCaseMessage.includes("relajacion")) {
            response = "Manejar el estrés es vital. Prueba respiración profunda, meditación o yoga. Organiza tareas y establece límites.";
        } else if (lowerCaseMessage.includes("noticias")) {
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
        } else if (lowerCaseMessage.includes("salud") || lowerCaseMessage.includes("bienestar")) {
            response = "La salud integral abarca mente y cuerpo. Estoy aquí para ofrecerte información general y recordarte la importancia de un estilo de vida saludable.";
        } else {
            response = "Lo siento, no entiendo tu consulta. Intenta preguntar sobre temas de bienestar, autocuidado o salud mental.";
        }
        return response;
    }

    // --- Event Handlers ---

    function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto'; // Reset textarea height

        setTimeout(() => {
            const juntAIResponse = getJuntAIResponse(userMessage);
            appendMessage(juntAIResponse, 'junt-ai');
        }, 700);
    }

    if (consultaForm) {
        consultaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleSendMessage();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            }
        });
        chatInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        // Initial height adjustment for chatInput
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight) + 'px';
    }

    let mediaStream = null;

    async function toggleCamera() {
        if (!facialAnalysisEnabled) {
            alert('Análisis facial está desactivado. Habilítalo en Privacidad.');
            return;
        }
        if (mediaStream && mediaStream.getVideoTracks().length > 0) {
            stopMediaStream();
            alert('Cámara deshabilitada.');
        } else {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                alert('Cámara y micrófono habilitados (simulado).');
            } catch (err) {
                console.error('Error accessing camera/mic:', err);
                alert('No se pudo acceder a la cámara o el micrófono. Permisos denegados o no disponibles.');
            }
        }
    }

    async function toggleMicrophone() {
        if (!voiceAnalysisEnabled) {
            alert('Análisis de voz está desactivado. Habilítalo en Privacidad.');
            return;
        }
        if (mediaStream && mediaStream.getAudioTracks().length > 0) {
            stopMediaStream();
            alert('Micrófono deshabilitado.');
        } else {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                alert('Micrófono habilitado (simulado).');
            } catch (err) {
                console.error('Error accessing microphone:', err);
                alert('No se pudo acceder al micrófono. Permisos denegados o no disponibles.');
            }
        }
    }

    function stopMediaStream() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
            console.log("Media streams stopped.");
        }
    }

    if (cameraBtn) cameraBtn.addEventListener('click', toggleCamera);
    if (microphoneBtn) microphoneBtn.addEventListener('click', toggleMicrophone);

    // --- Modal Management ---

    function openModal(modalElement) {
        modalElement.style.display = 'flex'; // Use flex to center
    }

    function closeModal(modalElement) {
        modalElement.style.display = 'none';
        // Stop media streams if privacy toggles were disabled on closing privacy modal
        if (modalElement.id === 'privacyModal' && (!voiceAnalysisEnabled || !facialAnalysisEnabled)) {
            stopMediaStream();
        }
    }

    // Feedback Modal Events
    const closeFeedbackModalBtn = document.getElementById('closeFeedbackModal');
    const feedbackGotItBtn = document.getElementById('feedbackGotItBtn');
    const feedbackMoreInfoBtn = document.getElementById('feedbackMoreInfoBtn');

    if (closeFeedbackModalBtn) closeFeedbackModalBtn.addEventListener('click', () => closeModal(feedbackModal));
    if (feedbackGotItBtn) feedbackGotItBtn.addEventListener('click', () => closeModal(feedbackModal));
    if (feedbackMoreInfoBtn) {
        feedbackMoreInfoBtn.addEventListener('click', () => {
            window.open('https://www.gob.pe/saludmental', '_blank');
            closeModal(feedbackModal);
        });
    }

    // Privacy Modal Events
    const openPrivacyBtn = document.getElementById('openPrivacyBtn');
    const closePrivacyModalBtn = document.getElementById('closePrivacyModal');
    const savePrivacyBtn = document.getElementById('savePrivacyBtn');

    if (openPrivacyBtn) {
        openPrivacyBtn.addEventListener('click', () => {
            // Update toggles state when opening
            if (voiceAnalysisToggle) voiceAnalysisToggle.checked = voiceAnalysisEnabled;
            if (facialAnalysisToggle) facialAnalysisToggle.checked = facialAnalysisEnabled;
            openModal(privacyModal);
        });
    }
    if (closePrivacyModalBtn) closePrivacyModalBtn.addEventListener('click', () => closeModal(privacyModal));
    if (savePrivacyBtn) {
        savePrivacyBtn.addEventListener('click', () => {
            voiceAnalysisEnabled = voiceAnalysisToggle ? voiceAnalysisToggle.checked : voiceAnalysisEnabled;
            facialAnalysisEnabled = facialAnalysisToggle ? facialAnalysisToggle.checked : facialAnalysisEnabled;

            localStorage.setItem('voiceAnalysisEnabled', voiceAnalysisEnabled);
            localStorage.setItem('facialAnalysisEnabled', facialAnalysisEnabled);

            console.log('Privacy Preferences Saved:', { voiceAnalysisEnabled, facialAnalysisEnabled });
            alert('Preferencias de privacidad guardadas.');
            closeModal(privacyModal);
        });
    }

    // Close modals on outside click
    window.addEventListener('click', (event) => {
        if (event.target == feedbackModal) closeModal(feedbackModal);
        if (event.target == privacyModal) closeModal(privacyModal);
    });
});