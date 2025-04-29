// =====================
// Selecionar o elemento onde será exibido o mapa
// =====================
const mapaWrapper = document.getElementById("mapaWrapper");
const chart = document.getElementById("chart");
const nomeUsuario = document.getElementById("nomeUsuario");
const localNasc = document.getElementById("localNasc");
const dataNasc = document.getElementById("dataNasc");
const sol = document.getElementById("sol");
const lua = document.getElementById("lua");
const mercurio = document.getElementById("mercurio");
const venus = document.getElementById("venus");
const marte = document.getElementById("marte");
const jupiter = document.getElementById("jupiter");
const saturno = document.getElementById("saturno");
const urano = document.getElementById("urano");
const netuno = document.getElementById("netuno");
const plutao = document.getElementById("plutao");
const northNode = document.getElementById("northNode");
const chiron = document.getElementById("chiron");
const ascendente = document.getElementById("ascendente");
const mc = document.getElementById("mc");

// =====================
// Recuperar os dados do sessionStorage
// =====================
const nome = sessionStorage.getItem("nome");
const pais = sessionStorage.getItem("pais");
const cidade = sessionStorage.getItem("cidade");
const data = sessionStorage.getItem("data");
const hora = sessionStorage.getItem("hora");

// =====================
//EXTRAS
// =====================
const meses = ['extra', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const signos = {
    "Ari": "Áries",
    "Tau": "Touro",
    "Gem": "Gêmeos",
    "Can": "Câncer",
    "Leo": "Leão",
    "Vir": "Virgem",
    "Lib": "Libra",
    "Sco": "Escorpião",
    "Sag": "Sagitário",
    "Cap": "Capricórnio",
    "Aqu": "Aquário",
    "Pis": "Peixes"
};

const icones = {
    "Ari": "♈︎",
    "Tau": "♉︎",
    "Gem": "♊︎",
    "Can": "♋︎",
    "Leo": "♌︎",
    "Vir": "♍︎",
    "Lib": "♎︎",
    "Sco": "♏︎",
    "Sag": "♐︎",
    "Cap": "♑︎",
    "Aqu": "♒︎",
    "Pis": "♓︎"
};

const coresSignos = {
    "Ari": "#FF5733",
    "Tau": "#9ACD32",
    "Gem": "#ADD8E6",
    "Can": "#87CEFA",
    "Leo": "#FFC300",
    "Vir": "#A3C1AD",
    "Lib": "#FFB6C1",
    "Sco": "#6A0DAD",
    "Sag": "#FF8C42",
    "Cap": "#8B8680",
    "Aqu": "#00CED1",
    "Pis": "#B0E0E6"
};

const traducoes = {
    aspect: {
        "conjunction": "Conjunção",
        "opposition": "Oposição",
        "trine": "Trígono",
        "square": "Quadratura",
        "sextile": "Sextil",
        "quincunx": "Quincúncio",
        "semisquare": "Semiquadratura",
        "sesquiquadrate": "Sesquiquadratura",
        "parallel": "Paralelo",
        "contraparallel": "Contraparalelo",
        "decile": "Décil",
        "novile": "Novil",
        "undecile": "Undécil",
        "duodecile": "Duodécil",
        "biquintile": "Biquintil",
        "quintile": "Quíntil",
        "sesquiquintile": "Sesquiquintil",
        "tridecile": "Tridecíl"
    },
    planets: {
        "Sun": "Sol",
        "Moon": "Lua",
        "Mercury": "Mercúrio",
        "Venus": "Vênus",
        "Mars": "Marte",
        "Jupiter": "Júpiter",
        "Saturn": "Saturno",
        "Uranus": "Urano",
        "Neptune": "Netuno",
        "Pluto": "Plutão",
        "Mean_North_Node": "Nodo Norte",
        "Mean_Node": "Nodo Norte",
        "Mean_South_Node": "Nodo Sul",
        "Chiron": "Quíron",
        "Ascendant": "Ascendente",
        "MC": "Meio do Céu",
        "Part of Fortune": "Parte da Fortuna",
        "Lilith": "Lilith",
        "Mean_Lilith": "Lilith Média",
        "Vertex": "Vértice",
        "Ceres": "Ceres",
        "Pallas": "Palas",
        "Juno": "Juno",
        "Vesta": "Vesta",
        "Eris": "Éris",
        "Sedna": "Sedna"
    }
};

// Logs
console.log("Dados recuperados do sessionStorage:", { nome, pais, cidade, data, hora });

// =====================
// FUNÇÕES AUXILIARES
// =====================
const funcHoraData = (date, time) => {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    // Log
    console.log("Componentes de data e hora:", { year, month, day, hour, minute });

    return { year, month, day, hour, minute };
}

async function coordenadas(city, country) {
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&format=json`;

    console.log("Buscando coordenadas para:", { city, country });

    try {
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (data.length === 0) throw new Error("Local não encontrado");

        const { lat, lon } = data[0];

        // Log
        console.log("Coordenadas encontradas:", { latitude: lat, longitude: lon });

        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
        return null;
    }
}

function traduzir(nome, tipo) {
    if (tipo === "aspect" && traducoes.aspect[nome]) {
        return traducoes.aspect[nome];
    } else if (tipo === "planet" && traducoes.planets[nome]) {
        return traducoes.planets[nome];
    }
    return nome;
}

// =====================
// BUSCA DADOS DA API
// =====================
async function buscarDadosApi() {
    // Comvertendo a data e hora para componentes individuais
    const { year, month, day, hour, minute } = funcHoraData(data, hora);

    const localDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    localDate.setHours(localDate.getHours());

    // Log
    console.log("Hora ajustada para BRT (UTC -3):", localDate.toISOString());

    // Pegar as coordenadas
    const coordinates = await coordenadas(cidade, pais);

    if (!coordinates) {
        mapaWrapper.innerHTML = "<p>Erro ao determinar as coordenadas da cidade. Verifique os dados e tente novamente.</p>";
        return;
    }

    // Console log para verificar os dados enviados para a API
    console.log("Dados enviados para a API:", {
        name: nome,
        year: localDate.getUTCFullYear(),
        month: localDate.getUTCMonth() + 1, // meses começam de 0
        day: localDate.getUTCDate(),
        hour: localDate.getUTCHours(),
        minute: localDate.getUTCMinutes(),
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        city: cidade,
        nation: pais,
        timezone: "UTC",
        zodiac_type: "Tropic",
    });

    // API começo
    const url = "https://astrologer.p.rapidapi.com/api/v4/birth-chart";

    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": "286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057", 
            "x-rapidapi-host": "astrologer.p.rapidapi.com",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subject: {
                name: nome,
                year: localDate.getUTCFullYear(),
                month: localDate.getUTCMonth() + 1, // meses são indexados em 0
                day: localDate.getUTCDate(),
                hour: localDate.getUTCHours(),
                minute: localDate.getUTCMinutes(),
                longitude: coordinates.longitude,
                latitude: coordinates.latitude,
                city: cidade,
                nation: pais,
                timezone: "UTC",
                zodiac_type: "Tropic",
            },
            theme: 'dark',
            "language": "PT"

        }),
    };

    try {
        const response = await fetch(url, options);

        // Log
        console.log("Status da resposta da API:", response.status);

        if (!response.ok) {
            const errorResult = await response.text();
            console.error("Erro na API:", errorResult);
            throw new Error("Erro na API");
        }

        const result = await response.json();
        console.log("Resposta da API:", result);


        // Rederizar o mapa astral
        renderizarMapaAstral(result);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        mapaWrapper.innerHTML = "<p>Ocorreu um erro ao gerar o mapa astral. Tente novamente mais tarde.</p>";
    }
}

// =====================
// RENDERIZA O MAPA ASTRAL
// =====================
// Função para renderizar o mapa astral
function renderizarMapaAstral(dados) { //antigo data
    // Log
    console.log("Dados recebidos para renderizar o mapa astral:", dados);

    if (!dados) {
        mapaWrapper.innerHTML = "<p>Não foi possível gerar o mapa astral.</p>";
        return;
    }

    localNasc.innerHTML = dados.data.city + ', ' + dados.data.nation + '.';
    dataNasc.innerHTML = dados.data.day + ' de ' + meses[(dados.data.month)] + ' de ' + dados.data.year + ', ' + (dados.data.hour) + ':' + dados.data.minute;
    nomeUsuario.innerHTML = dados.data.name;
    chart.innerHTML = dados.chart;

    function decimalToDMS(decimal) {
        // Parte inteira do número é o grau
        const degrees = Math.floor(decimal);

        // A parte decimal é a parte a ser convertida para minutos e segundos
        const decimalPart = decimal - degrees;

        // Multiplica a parte decimal por 60 para obter os minutos
        const minutesFloat = decimalPart * 60;
        const minutes = Math.floor(minutesFloat);

        // A parte decimal dos minutos é convertida para segundos
        const secondsFloat = (minutesFloat - minutes) * 60;
        const seconds = Math.round(secondsFloat);

        // Retorna o valor formatado em graus, minutos e segundos
        return `${degrees}° ${minutes}′ ${seconds}″`;
    }

    const getNomeCompletoSigno = (abreviacao) => signos[abreviacao];
    const getSignoCertoAntigo = (icone) => icones[icone] || icone;
    const getSignoCerto = (sigla) => {
        const icone = icones[sigla];
        const cor = coresSignos[sigla];
        return `<span style="color:${cor};">${icone}</span>`;
    };
    // <span style="color:#;"></span>
    // `<span style="color:#FF5733 ;">${getSignoCerto(dados.data.sun.sign)}</span>`

    sol.innerHTML = '☉ Sol ' + decimalToDMS(dados.data.sun.position) + ' em ' + getSignoCerto(dados.data.sun.sign) + ' ' + getNomeCompletoSigno(dados.data.sun.sign);
    lua.innerHTML = '☽ Lua ' + decimalToDMS(dados.data.moon.position) + ' em ' + getSignoCerto(dados.data.moon.sign) + ' ' + getNomeCompletoSigno(dados.data.moon.sign);
    mercurio.innerHTML = '☿ Mercúrio ' + decimalToDMS(dados.data.mercury.position) + ' em ' + getSignoCerto(dados.data.mercury.sign) + ' ' + getNomeCompletoSigno(dados.data.mercury.sign);
    venus.innerHTML = '♀︎ Vênus ' + decimalToDMS(dados.data.venus.position) + ' em ' + getSignoCerto(dados.data.venus.sign) + ' ' + getNomeCompletoSigno(dados.data.venus.sign);
    marte.innerHTML = '♂︎ Marte ' + decimalToDMS(dados.data.mars.position) + ' em ' + getSignoCerto(dados.data.mars.sign) + ' ' + getNomeCompletoSigno(dados.data.mars.sign);
    jupiter.innerHTML = '♃ Júpiter ' + decimalToDMS(dados.data.jupiter.position) + ' em ' + getSignoCerto(dados.data.jupiter.sign) + ' ' + getNomeCompletoSigno(dados.data.jupiter.sign);
    saturno.innerHTML = '♄ Saturno ' + decimalToDMS(dados.data.saturn.position) + ' em ' + getSignoCerto(dados.data.saturn.sign) + ' ' + getNomeCompletoSigno(dados.data.saturn.sign);
    urano.innerHTML = '♅ Urano ' + decimalToDMS(dados.data.uranus.position) + ' em ' + getSignoCerto(dados.data.uranus.sign) + ' ' + getNomeCompletoSigno(dados.data.uranus.sign);
    netuno.innerHTML = '♆ Netuno ' + decimalToDMS(dados.data.neptune.position) + ' em ' + getSignoCerto(dados.data.neptune.sign) + ' ' + getNomeCompletoSigno(dados.data.neptune.sign);
    plutao.innerHTML = '♇ Plutão ' + decimalToDMS(dados.data.pluto.position) + ' em ' + getSignoCerto(dados.data.pluto.sign) + ' ' + getNomeCompletoSigno(dados.data.pluto.sign);
    northNode.innerHTML = '☊ Nodo Norte ' + decimalToDMS(dados.data.true_node.position) + ' em ' + getSignoCerto(dados.data.true_node.sign) + ' ' + getNomeCompletoSigno(dados.data.true_node.sign);
    chiron.innerHTML = '⚷ Chiron ' + decimalToDMS(dados.data.chiron.position) + ' em ' + getSignoCerto(dados.data.chiron.sign) + ' ' + getNomeCompletoSigno(dados.data.chiron.sign);
    ascendente.innerHTML = '♁ Ascendente ' + decimalToDMS(dados.data.first_house.position) + ' em ' + getSignoCerto(dados.data.first_house.sign) + ' ' + getNomeCompletoSigno(dados.data.first_house.sign);
    mc.innerHTML = '♁ MC ' + decimalToDMS(dados.data.tenth_house.position) + ' em ' + getSignoCerto(dados.data.tenth_house.sign) + ' ' + getNomeCompletoSigno(dados.data.tenth_house.sign);

    if (dados.aspects) {
        const aspectosContainer = document.getElementById("aspectos");
        aspectosContainer.innerHTML = "";  // Limpar a div antes de adicionar os novos aspectos

        dados.aspects.map(aspecto => {
            // Criar um novo div para cada aspecto
            const aspectoDiv = document.createElement("div");
            aspectoDiv.classList.add("aspecto");

            // Traduzir os nomes dos planetas e os aspectos
            const p1Name = traduzir(aspecto.p1_name, "planet");
            const p2Name = traduzir(aspecto.p2_name, "planet");
            const aspectName = traduzir(aspecto.aspect, "aspect");

            // Exemplo de como criar o conteúdo de cada aspecto
            const descricao = `${p1Name} ${aspectName} ${p2Name} <span style="color:#00A2FF;">orb ${aspecto.orbit.toFixed(0) + " °"}</span>`;
            aspectoDiv.innerHTML = `${descricao}`;
            // aspectoDiv.innerHTML = `<strong>${descricao}</strong>`;

            // Adicionar a div do aspecto ao container
            aspectosContainer.appendChild(aspectoDiv);
        });
    } else {
        // Caso não tenha aspectos, exiba uma mensagem
        document.getElementById("aspectos").innerHTML = "<p>Não há aspectos disponíveis para este mapa astral.</p>";
    }

    // Log para verificar a renderização
    console.log("Mapa Astral Renderizado");
}

// Chamar a função principal
// buscarDadosApi();