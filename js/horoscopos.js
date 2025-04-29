// ========== Configurações ==========
const chave = '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057';
const urlTraducao = 'deep-translate1.p.rapidapi.com';
const urlHoroscopo = 'horoscope19.p.rapidapi.com';

// ========== Elementos do DOM ==========
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

const urlParams = new URLSearchParams(window.location.search);
const signo = urlParams.get('signo'); // Exemplo: ?signo=aries
console.log("Signo:", signo);

// ========== Funções Utilitárias ==========
const traduzirTexto = async (texto, idiomaDestino = 'pt') => {
    const url = `https://${urlTraducao}/language/translate/v2`;

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': chave,
            'x-rapidapi-host': urlTraducao,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: texto,
            source: 'en',
            target: idiomaDestino // Idioma de destino, por padrão 'pt' (português)
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log('Resultado da tradução:', result);

        return result.data?.translations?.translatedText || texto;
    } catch (error) {
        console.error("Erro ao traduzir:", error);
        return texto;
    }
};

const atualizarNomeDoSigno = (signo) => {
    const nomes = {
        aries: 'Áries',
        taurus: 'Touro',
        gemini: 'Gêmeos',
        cancer: 'Câncer',
        leo: 'Leão',
        virgo: 'Virgem',
        libra: 'Libra',
        scorpio: 'Escorpião',
        sagittarius: 'Sagitário',
        capricorn: 'Capricórnio',
        aquarius: 'Aquário',
        pisces: 'Peixes'
    };

    nomeDoSigno.innerHTML = nomes[signo] || '';
};

// ========== Funções Principais ==========
const horoscopoDia = async (signo, tempo) => {
    const url = `https://${urlHoroscopo}/get-horoscope/daily?sign=${signo}&day=${tempo}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': chave,
            'x-rapidapi-host': urlHoroscopo
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log('Resultado da API do horóscopo:', result);

        const horoscope = result.data?.horoscope_data;
        const dia = result.data?.date;

        if (horoscope) {
            const horoscopoTraduzido = await traduzirTexto(horoscope);
            tituloDisplay.textContent = dia;
            horoscopeDisplay.textContent = horoscopoTraduzido;
        } else {
            horoscopeDisplay.textContent = "Horóscopo não disponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar horóscopo:", error);
        horoscopeDisplay.textContent = "Erro ao carregar o horóscopo.";
    }
};

const horoscopoSemanaMes = async (tempoSemanaMes, signo) => {
    const url = `https://${urlHoroscopo}/get-horoscope/${tempoSemanaMes}?sign=${signo}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': chave,
            'x-rapidapi-host': urlHoroscopo
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log('Resultado da API do horóscopo:', result);

        const horoscope = result.data?.horoscope_data;
        const mensal = result.data?.month;
        const semanal = result.data?.week;

        if (horoscope) {
            const horoscopoTraduzido = await traduzirTexto(horoscope);

            tituloDisplay.textContent = mensal || semanal || '';
            horoscopeDisplay.textContent = horoscopoTraduzido;
        } else {
            horoscopeDisplay.textContent = "Horóscopo não disponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar horóscopo:", error);
        horoscopeDisplay.textContent = "Erro ao carregar o horóscopo.";
    }
};

// ========== Event Listeners ==========
hoje.addEventListener("click", () => {
    tempo = 'today';
    horoscopoDia(signo, tempo);
});

amanha.addEventListener("click", () => {
    tempo = 'tomorrow';
    horoscopoDia(signo, tempo);
});

ontem.addEventListener("click", () => {
    tempo = 'yesterday';
    horoscopoDia(signo, tempo);
});

semana.addEventListener("click", () => {
    tempoSemanaMes = 'weekly';
    horoscopoSemanaMes(tempoSemanaMes, signo);
});

mes.addEventListener("click", () => {
    tempoSemanaMes = 'monthly';
    horoscopoSemanaMes(tempoSemanaMes, signo);
});

// Botões de seleção de tempo
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        buttons.forEach((btn) => {
            btn.classList.remove("selecionado");
        });
        button.classList.add("selecionado");
    });
});

// ========== Inicialização ==========
atualizarNomeDoSigno(signo);
horoscopoDia(signo, tempo);
