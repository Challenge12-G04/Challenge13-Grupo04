const form = document.querySelector('form[name="Campos"]');
form.addEventListener("submit", (event) => {
    const fname = form.elements["nombres"].value;
    const flastname = form.elements["apellidos"].value;
    const femail = form.elements["email"].value;
    const fphone = form.elements["telefono"].value;

    if (!fname || !flastname || !femail || !fphone) {
        event.preventDefault();
        alert("Por favor, complete todos los campos del formulario");
    } else if (!validateEmail(femail)) {
        event.preventDefault();
        alert("Por favor, ingrese un correo valido");
    } else {
        const confirmation = confirm(
            "Esta a punto de enviar el formulario, ¿Desea Continuar?"
        );
        if (!confirmation) {
            event.preventDefault();
        }
    }
});

//CREAR FUNCION validateEmail(femail)
function validateEmail(femail) {
    const re = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]/;
    return re.test(String(femail).toLowerCase());
}