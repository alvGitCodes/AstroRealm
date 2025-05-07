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

btnConfirmar.addEventListener("click", () => {
    // Capturar os dados do formulário
    const nome = document.querySelector("#nome").value;
    const pais = document.querySelector("#pais").value;
    const cidade = document.querySelector("#cidade").value;
    const data = document.querySelector("#data").value;
    const hora = document.querySelector("#hora").value;

    // Log para verificar os valores capturados
    console.log("Dados capturados do formulário:", { nome, pais, cidade, data, hora });

    // Validar se os campos estão preenchidos
    if (!nome || !pais || !cidade || !data || !hora) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Salvar os dados no sessionStorage
    sessionStorage.setItem("nome", nome);
    sessionStorage.setItem("pais", pais);
    sessionStorage.setItem("cidade", cidade);
    sessionStorage.setItem("data", data);
    sessionStorage.setItem("hora", hora);

    // Log para confirmar o salvamento
    console.log("Dados salvos no sessionStorage.");

    // Redirecionar para a página de exibição
    window.location.href = "meumapa.php";
});

document.addEventListener("DOMContentLoaded", () => {
    const paisDropdown = document.getElementById("paisDropdown");
    console.log(paisDropdown);
    const selectedOption = paisDropdown.querySelector(".selected-option");
    const options = paisDropdown.querySelector(".options");
    const inputPais = document.getElementById("pais");

    paisDropdown.addEventListener("click", () => {
        paisDropdown.classList.toggle("open");
    });

    options.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            const value = option.getAttribute("data-value");
            const label = option.textContent;

            selectedOption.textContent = label;
            inputPais.value = value;
            paisDropdown.classList.remove("open");
        });
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
        if (!paisDropdown.contains(e.target)) {
            paisDropdown.classList.remove("open");
        }
    });
});
