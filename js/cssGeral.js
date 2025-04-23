// Referência ao botão
const btn = document.getElementById('scrollToTopBtn');

// Mostrar o botão quando a rolagem for maior que 300px
window.onscroll = function () {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

// Ao clicar, rolar suavemente para o topo
btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
