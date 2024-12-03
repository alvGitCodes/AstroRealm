// Função para traduzir o texto usando a API Deep Translate
const traduzirTexto = async (texto, idiomaDestino = 'pt') => {
    const url = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057', // Sua chave da API
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: texto,           // O texto que você deseja traduzir
            source: 'en',       // Idioma de origem, no caso, inglês
            target: idiomaDestino // Idioma de destino, por padrão 'pt' (português)
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();  // Esperamos uma resposta em formato JSON
        console.log('Resultado da tradução:', result);  // Verifique a resposta da API

        // Verifica se a tradução foi bem-sucedida
        if (result) {
            return result.data.translations.translatedText;  // Retorna o texto traduzido
        } else {
            console.error("Erro na tradução: A resposta não contém as traduções esperadas.");
            return texto; // Retorna o texto original caso algo dê errado
        }
    } catch (error) {
        console.error("Erro ao traduzir:", error);
        return texto; // Retorna o texto original em caso de erro
    }
};

// Função para buscar o horóscopo diário
const horoscopoDia = async (signo, tempo) => {
    const url = `https://horoscope19.p.rapidapi.com/get-horoscope/daily?sign=${signo}&day=${tempo}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057', // Sua chave da API
            'x-rapidapi-host': 'horoscope19.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();  // Decodifica o JSON
        console.log('Resultado da API do horóscopo:', result); // Verifique a resposta no console

        // Extraindo o horóscopo e a data
        const horoscope = result.data?.horoscope_data;
        const dia = result.data?.date;

        // Traduzindo o horóscopo se ele existir
        if (horoscope) {
            const horoscopoTraduzido = await traduzirTexto(horoscope, 'pt'); // Traduz para português

            // Atualiza o display com o horóscopo traduzido
            tituloDisplay.innerHTML = dia;
            horoscopeDisplay.textContent = horoscopoTraduzido;
        } else {
            horoscopeDisplay.textContent = "Horóscopo não disponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar horóscopo:", error);
        horoscopeDisplay.textContent = "Erro ao carregar o horóscopo.";
    }
};

// Função para buscar o horóscopo semanal ou mensal
const horoscopoSemanaMes = async (tempoSemanaMes, signo) => {
    const url = `https://horoscope19.p.rapidapi.com/get-horoscope/${tempoSemanaMes}?sign=${signo}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057', // Sua chave da API
            'x-rapidapi-host': 'horoscope19.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();  // Decodifica o JSON
        console.log('Resultado da API do horóscopo:', result); // Verifique a resposta no console

        // Extraindo o horóscopo e a data
        const horoscope = result.data?.horoscope_data;
        const mensal = result.data?.month;
        const semanal = result.data?.week;

        // Traduzindo o horóscopo se ele existir
        if (horoscope && mensal) {
            const horoscopoTraduzido = await traduzirTexto(horoscope, 'pt'); // Traduz para português
            tituloDisplay.textContent = mensal;
            horoscopeDisplay.textContent = horoscopoTraduzido;
        } else if (horoscope) {
            const horoscopoTraduzido = await traduzirTexto(horoscope, 'pt'); // Traduz para português
            tituloDisplay.textContent = semanal;
            horoscopeDisplay.textContent = horoscopoTraduzido;
        } else {
            horoscopeDisplay.textContent = "Horóscopo não disponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar horóscopo:", error);
        horoscopeDisplay.textContent = "Erro ao carregar o horóscopo.";
    }
};

// Elementos do DOM
const horoscopeDisplay = document.getElementById("horoscopeDisplay");
const hoje = document.querySelector(".hoje");
const amanha = document.querySelector(".amanha");
const ontem = document.querySelector(".ontem");
const semana = document.querySelector(".semana");
const mes = document.querySelector(".mes");
const tituloDisplay = document.querySelector("#tituloDisplay");
const nomeDoSigno = document.querySelector("#nomeDoSigno");

// Variáveis de controle
let tempo = 'today'; // Valor inicial para o horóscopo diário
let tempoSemanaMes = ''; // Valor para o horóscopo semanal ou mensal

// Eventos para os botões de tempo (hoje, amanhã, ontem)
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

// Eventos para os botões de semana e mês
semana.addEventListener("click", () => {
    tempoSemanaMes = 'weekly';
    horoscopoSemanaMes(tempoSemanaMes, signo);
});

mes.addEventListener("click", () => {
    tempoSemanaMes = 'monthly';
    horoscopoSemanaMes(tempoSemanaMes, signo);
});

// Função para pegar o signo da URL
const urlParams = new URLSearchParams(window.location.search);
const signo = urlParams.get('signo'); // Exemplo: ?signo=aries
console.log("Signo:", signo);

if (signo == 'aries') {
    nomeDoSigno.innerHTML = 'Áries'
} else if (signo == 'taurus') {
    nomeDoSigno.innerHTML = 'Touro'
}else if(signo == 'gemini'){
    nomeDoSigno.innerHTML = 'Gêmeos'
}else if(signo == 'cancer'){
    nomeDoSigno.innerHTML = 'Câncer'
}else if(signo == 'leo'){
    nomeDoSigno.innerHTML = 'Leão'
}else if(signo == 'virgo'){
    nomeDoSigno.innerHTML = 'Virgem'
}else if(signo == 'libra'){
    nomeDoSigno.innerHTML = 'Libra'
}else if(signo == 'scorpio'){
    nomeDoSigno.innerHTML = 'Escorpião'
}else if(signo == 'sagittarius'){
    nomeDoSigno.innerHTML = 'Sagitário'
}else if(signo == 'capricorn'){
    nomeDoSigno.innerHTML = 'Capricórnio'
}else if(signo == 'aquarius'){
    nomeDoSigno.innerHTML = 'Aquário'
}else if(signo == 'pisces'){
    nomeDoSigno.innerHTML = 'Peixes'
}


// Chamada inicial para carregar o horóscopo do dia
horoscopoDia(signo, tempo);

// Adiciona evento de clique a cada botão de tempo
const buttons = document.querySelectorAll(".labelTempo");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        // Remove a classe 'selected' de todos os botões
        buttons.forEach((btn) => btn.classList.remove("selecionado"));

        // Adiciona a classe 'selecionado' ao botão clicado
        button.classList.add("selecionado");
    });
});
