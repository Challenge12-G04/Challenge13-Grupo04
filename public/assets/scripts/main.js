
// Evento al enviar el formulario de contacto
document.getElementById("formularioContacto").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita el envío real del formulario
// Muestra el mensaje de confirmación
    const mensaje = document.getElementById("mensajeEnviado");
    mensaje.style.display = "block";
// Opcional: limpiar el formulario
    this.reset();
// Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensaje.style.display = "none";
    }, 5000);
});
