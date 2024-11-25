const btnMapa = document.querySelector("#btnMapa");
const textosCentro = document.querySelector("#textosCentro");
const divForm = document.querySelector("#divForm");
const btnConfirmar = document.querySelector("#btnConfirmar");

btnMapa.addEventListener("click", () => {
    textosCentro.style.display = 'none'
    divForm.style.display = 'block'
    btnMapa.style.display = 'none'
    btnConfirmar.style.display = 'block'
})