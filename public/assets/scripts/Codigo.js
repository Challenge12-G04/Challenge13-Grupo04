const btnAbrilModal=
document.querySelector("#botonsignin");
const btnCerrarModal=
document.querySelector("#botonclose");
const modal=
document.querySelector("#modal"); 
const btnAbrilogin=
document.querySelector("#botonlogin");
const login=
document.querySelector("#login"); 


btnAbrilModal.addEventListener("click", ()=>{
    modal.showModal();
})

btnAbrilogin.addEventListener("click", ()=>{
    login.showModal();
})  