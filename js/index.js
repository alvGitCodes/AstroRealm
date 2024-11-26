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
    window.location.href = "meumapa.html";
});
