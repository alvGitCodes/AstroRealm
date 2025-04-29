// ========== Configurações ==========
const chave = '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057';
const urlTrad = 'deep-translate1.p.rapidapi.com';
const urlHoros = 'horoscope19.p.rapidapi.com';

// ========== Elementos ==========
const horoscopeDisplay = document.getElementById("horoscopeDisplay");
const tituloDisplay = document.getElementById("tituloDisplay");
const nomeDoSigno = document.getElementById("nomeDoSigno");

const hoje = document.querySelector(".hoje");
const amanha = document.querySelector(".amanha");
const ontem = document.querySelector(".ontem");
const semana = document.querySelector(".semana");
const mes = document.querySelector(".mes");
const buttons = document.querySelectorAll(".labelTempo");

// ========== Variáveis ==========
let tempo = 'today';
let tempoSemanaMes = '';
const signo = new URLSearchParams(window.location.search).get('signo');

// ========== Funções ==========
const traduzirTexto = async (texto, idiomaDestino = 'pt') => {
    try {
        const res = await fetch(`https://${urlTrad}/language/translate/v2`, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': chave,
                'x-rapidapi-host': urlTrad,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: texto, source: 'en', target: idiomaDestino })
        });
        const dados = await res.json();
        return dados.data?.translations?.translatedText || texto;
    } catch {
        return texto;
    }
};

const buscarHoroscopo = async (endpoint) => {
    try {
        const res = await fetch(`https://${urlHoros}/${endpoint}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': chave,
                'x-rapidapi-host': urlHoros
            }
        });
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
};

const exibirHoroscopo = async (tipo) => {
    const data = await buscarHoroscopo(
        tipo === 'daily'
            ? `get-horoscope/daily?sign=${signo}&day=${tempo}`
            : `get-horoscope/${tempoSemanaMes}?sign=${signo}`
    );

    if (data?.horoscope_data) {
        const textoTraduzido = await traduzirTexto(data.horoscope_data);
        tituloDisplay.textContent = data.date || data.month || data.week || '';
        horoscopeDisplay.textContent = textoTraduzido;
    } else {
        horoscopeDisplay.textContent = "Horóscopo não disponível.";
    }
};

const definirNomeDoSigno = (signo) => {
    switch (signo) {
        case 'aries':
            nomeDoSigno.textContent = 'Áries';
            break;
        case 'taurus':
            nomeDoSigno.textContent = 'Touro';
            break;
        case 'gemini':
            nomeDoSigno.textContent = 'Gêmeos';
            break;
        case 'cancer':
            nomeDoSigno.textContent = 'Câncer';
            break;
        case 'leo':
            nomeDoSigno.textContent = 'Leão';
            break;
        case 'virgo':
            nomeDoSigno.textContent = 'Virgem';
            break;
        case 'libra':
            nomeDoSigno.textContent = 'Libra';
            break;
        case 'scorpio':
            nomeDoSigno.textContent = 'Escorpião';
            break;
        case 'sagittarius':
            nomeDoSigno.textContent = 'Sagitário';
            break;
        case 'capricorn':
            nomeDoSigno.textContent = 'Capricórnio';
            break;
        case 'aquarius':
            nomeDoSigno.textContent = 'Aquário';
            break;
        case 'pisces':
            nomeDoSigno.textContent = 'Peixes';
            break;
        default: nomeDoSigno.textContent = '';
    }
};

// ========== Eventos ==========
hoje.addEventListener("click", () => {
    tempo = 'today'; exibirHoroscopo('daily');
});
amanha.addEventListener("click", () => {
    tempo = 'tomorrow'; exibirHoroscopo('daily');
});
ontem.addEventListener("click", () => {
    tempo = 'yesterday'; exibirHoroscopo('daily');
});
semana.addEventListener("click", () => {
    tempoSemanaMes = 'weekly'; exibirHoroscopo('period');
});
mes.addEventListener("click", () => {
    tempoSemanaMes = 'monthly'; exibirHoroscopo('period');
});

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("selecionado"));
        button.classList.add("selecionado");
    });
});

// ========== Inicialização ==========
definirNomeDoSigno(signo);
exibirHoroscopo('daily');
