// const horoscopeDisplay = document.getElementById("horoscopeDisplay")

// async function horoscopoDia() {
//     const url = 'https://horoscope19.p.rapidapi.com/get-horoscope/daily?sign=aries&day=today';
//     const options = {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057',
//             'x-rapidapi-host': 'horoscope19.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         console.log(result);
//         horoscopeDisplay.textContent = result

//     } catch (error) {
//         console.error(error);
//     }
// }

// // Call the function
// horoscopoDia();

// Elementos do DOM
const horoscopeDisplay = document.getElementById("horoscopeDisplay");
const hoje = document.querySelector(".hoje");
const amanha = document.querySelector(".amanha");
const ontem = document.querySelector(".ontem");
const semana = document.querySelector(".semana");
const mes = document.querySelector(".mes");
const tituloDisplay = document.querySelector("#tituloDisplay");

// Variáveis de controle
let tempo = 'today'; // Valor inicial para o horóscopo diário
let tempoSemanaMes = ''; // Valor para o horóscopo semanal ou mensal

// Eventos para os botões de tempo (hoje, amanhã, ontem)
hoje.addEventListener("click", () => {
    tempo = 'today';
    horoscopoDia(tempo);
});

amanha.addEventListener("click", () => {
    tempo = 'tomorrow';
    horoscopoDia(tempo);
});

ontem.addEventListener("click", () => {
    tempo = 'yesterday';
    horoscopoDia(tempo);
});

// Função para buscar o horóscopo diário
const horoscopoDia = async (tempo) => {
    const url = `https://horoscope19.p.rapidapi.com/get-horoscope/daily?sign=aries&day=${tempo}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057',
            'x-rapidapi-host': 'horoscope19.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Decodifica o JSON
        console.log(result); // Inspeciona a estrutura do JSON no console

        // Extraindo o horóscopo e a data
        const horoscope = result.data?.horoscope_data;
        const dia = result.data?.date;

        // Atualiza o display com o horóscopo
        if (horoscope) {
            tituloDisplay.innerHTML = dia;
            horoscopeDisplay.textContent = ` ${horoscope}`;
        } else {
            horoscopeDisplay.textContent = "Horóscopo não disponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar horóscopo:", error);
        horoscopeDisplay.textContent = "Erro ao carregar o horóscopo.";
    }
};

// Eventos para os botões de semana e mês
semana.addEventListener("click", () => {
    tempoSemanaMes = 'weekly';
    horoscopoSemanaMes(tempoSemanaMes);
});

mes.addEventListener("click", () => {
    tempoSemanaMes = 'monthly';
    horoscopoSemanaMes(tempoSemanaMes);
});

// Função para buscar o horóscopo semanal ou mensal
const horoscopoSemanaMes = async (tempoSemanaMes) => {
    const url = `https://horoscope19.p.rapidapi.com/get-horoscope/${tempoSemanaMes}?sign=aries`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057',
            'x-rapidapi-host': 'horoscope19.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Decodifica o JSON
        console.log(result); // Inspeciona a estrutura do JSON no console

        // Extraindo o horóscopo e a data
        const horoscope = result.data?.horoscope_data;
        const mensal = result.data?.month;
        const semanal = result.data?.week;
        // Atualiza o display com o horóscopo
        if (horoscope && mensal) {
            tituloDisplay.textContent = mensal
            horoscopeDisplay.textContent = horoscope;
        } else if(horoscope){
            tituloDisplay.textContent = semanal
            horoscopeDisplay.textContent = horoscope;
        } else {
            horoscopeDisplay.textContent = "Horóscopo não disponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar horóscopo:", error);
        horoscopeDisplay.textContent = "Erro ao carregar o horóscopo.";
    }
};

// Chamada inicial para carregar o horóscopo do dia
horoscopoDia(tempo);




const buttons = document.querySelectorAll(".labelTempo");

// Adiciona evento de clique a cada botão
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        // Remove a classe 'selected' de todos os botões
        buttons.forEach((btn) => btn.classList.remove("selecionado"));

        // Adiciona a classe 'selecionado' ao botão clicado
        button.classList.add("selecionado");
    });
});