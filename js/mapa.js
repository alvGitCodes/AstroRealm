// Selecionar o elemento onde será exibido o mapa
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



// Recuperar os dados do sessionStorage
const nome = sessionStorage.getItem("nome");
const pais = sessionStorage.getItem("pais");
const cidade = sessionStorage.getItem("cidade");
const data = sessionStorage.getItem("data");
const hora = sessionStorage.getItem("hora");

//EXTRAS
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


// Logs para verificar os dados capturados
console.log("Dados recuperados do sessionStorage:", { nome, pais, cidade, data, hora });

// Função para converter a data e hora em componentes individuais
const parseDateAndTime = (date, time) => {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    // Log para verificar os componentes de data e hora
    console.log("Componentes de data e hora:", { year, month, day, hour, minute });

    return { year, month, day, hour, minute };
}

// Função para buscar latitude e longitude (usando um serviço público ou fixo para cidades principais)
async function getCoordinates(city, country) {
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},${encodeURIComponent(
        country
    )}&format=json`;

    console.log("Buscando coordenadas para:", { city, country });

    try {
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (data.length === 0) throw new Error("Local não encontrado");

        const { lat, lon } = data[0];

        // Log para verificar as coordenadas recebidas
        console.log("Coordenadas encontradas:", { latitude: lat, longitude: lon });

        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
        return null;
    }
}

async function fetchAstrologicalData() {
    // Parse the date and time
    const { year, month, day, hour, minute } = parseDateAndTime(data, hora);

    // Adjust for Maceió's time zone (UTC-3)
    const localDate = new Date(Date.UTC(year, month - 1, day, hour, minute)); // Create UTC date
    localDate.setHours(localDate.getHours() + 3); // Add 3 hours to adjust to BRT (UTC -3)

    // Log to verify adjusted time
    console.log("Hora ajustada para BRT (UTC -3):", localDate.toISOString());

    // Get coordinates
    const coordinates = await getCoordinates(cidade, pais);

    if (!coordinates) {
        mapaWrapper.innerHTML = "<p>Erro ao determinar as coordenadas da cidade. Verifique os dados e tente novamente.</p>";
        return;
    }

    // Log to verify data before sending to API
    console.log("Dados enviados para a API:", {
        name: nome,        
        year: localDate.getUTCFullYear(),
        month: localDate.getUTCMonth() + 1, // months are 0-indexed
        day: localDate.getUTCDate(),
        hour: localDate.getUTCHours(),
        minute: localDate.getUTCMinutes(),
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        city: cidade,
        nation: pais,
        timezone: "UTC", // The API will process everything in UTC
        zodiac_type: "Tropic",
    });

    // API request
    const url = "https://astrologer.p.rapidapi.com/api/v4/birth-chart";
       
    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": "286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057", // Substitua por sua chave real
            "x-rapidapi-host": "astrologer.p.rapidapi.com",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subject: {
                name: nome,
                year: localDate.getUTCFullYear(),
                month: localDate.getUTCMonth() + 1, // months are 0-indexed
                day: localDate.getUTCDate(),
                hour: localDate.getUTCHours(),
                minute: localDate.getUTCMinutes(),
                longitude: coordinates.longitude,
                latitude: coordinates.latitude,
                city: cidade,
                nation: pais,
                timezone: "UTC", // Ensure the API gets the data in UTC
                zodiac_type: "Tropic",
            },
            "language": "PT"
           
        }),
    };

    try {
        // Start the request
        const response = await fetch(url, options);

        // Check if the response is successful
        console.log("Status da resposta da API:", response.status);

        if (!response.ok) {
            const errorResult = await response.text();
            console.error("Erro na API:", errorResult);
            throw new Error("Erro na API");
        }

        const result = await response.json();
        console.log("Resposta da API:", result);
        
        
        // Render the birth chart
        renderBirthChart(result);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        mapaWrapper.innerHTML = "<p>Ocorreu um erro ao gerar o mapa astral. Tente novamente mais tarde.</p>";
    }
}

// Função para renderizar o mapa astral
function renderBirthChart(dados) { //antigo data
    // Log para verificar os dados antes de renderizar
    console.log("Dados recebidos para renderizar o mapa astral:", dados);

    if (!dados) {
        mapaWrapper.innerHTML = "<p>Não foi possível gerar o mapa astral.</p>";
        return;
    }

    
    localNasc.innerHTML = dados.data.city + ', ' + dados.data.nation + '.';
    dataNasc.innerHTML = dados.data.day + ' de ' + meses[(dados.data.month)-1] + ' de ' + dados.data.year + ', ' + (dados.data.hour - 3) + ':' + dados.data.minute;
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

    const getNomeCompletoSigno = (abreviacao) => signos[abreviacao] || abreviacao;
    const getSignoCerto = (icone) => icones[icone] || icone;

    sol.innerHTML = '☉' + ' Sol ' + decimalToDMS(dados.data.sun.position) + ' em ' + getSignoCerto(dados.data.sun.sign) + ' ' + getNomeCompletoSigno(dados.data.sun.sign);
    lua.innerHTML = '☽' + ' Lua ' + decimalToDMS(dados.data.moon.position) + ' em ' + getSignoCerto(dados.data.moon.sign) + ' ' + getNomeCompletoSigno(dados.data.moon.sign);
    mercurio.innerHTML = '☿' + ' Mercúrio ' + decimalToDMS(dados.data.mercury.position) + ' em ' + getSignoCerto(dados.data.mercury.sign) + ' ' + getNomeCompletoSigno(dados.data.mercury.sign);
    venus.innerHTML = '♀︎' + ' Vênus ' + decimalToDMS(dados.data.venus.position) + ' em ' + getSignoCerto(dados.data.venus.sign) + ' ' + getNomeCompletoSigno(dados.data.venus.sign);
    marte.innerHTML = '♂︎' + ' Marte ' + decimalToDMS(dados.data.mars.position) + ' em ' + getSignoCerto(dados.data.mars.sign) + ' ' + getNomeCompletoSigno(dados.data.mars.sign);
    jupiter.innerHTML = '♃' + ' Júpiter ' + decimalToDMS(dados.data.jupiter.position) + ' em ' + getSignoCerto(dados.data.jupiter.sign) + ' ' + getNomeCompletoSigno(dados.data.jupiter.sign);
    saturno.innerHTML = '♄' + ' Saturno ' + decimalToDMS(dados.data.saturn.position) + ' em ' + getSignoCerto(dados.data.saturn.sign) + ' ' + getNomeCompletoSigno(dados.data.saturn.sign);
    urano.innerHTML = '♅' + ' Urano ' + decimalToDMS(dados.data.uranus.position) + ' em ' + getSignoCerto(dados.data.uranus.sign) + ' ' + getNomeCompletoSigno(dados.data.uranus.sign);
    netuno.innerHTML = '♆' + ' Netuno ' + decimalToDMS(dados.data.neptune.position) + ' em ' + getSignoCerto(dados.data.neptune.sign) + ' ' + getNomeCompletoSigno(dados.data.neptune.sign);
    plutao.innerHTML = '♇' + ' Plutão ' + decimalToDMS(dados.data.pluto.position) + ' em ' + getSignoCerto(dados.data.pluto.sign) + ' ' + getNomeCompletoSigno(dados.data.pluto.sign);
    northNode.innerHTML = '☊' + ' Nodo Norte ' + decimalToDMS(dados.data.true_node.position) + ' em ' + getSignoCerto(dados.data.true_node.sign) + ' ' + getNomeCompletoSigno(dados.data.true_node.sign);
    chiron.innerHTML = '⚷' + ' Chiron ' + decimalToDMS(dados.data.chiron.position) + ' em ' + getSignoCerto(dados.data.chiron.sign) + ' ' + getNomeCompletoSigno(dados.data.chiron.sign);
    ascendente.innerHTML = '♁' + ' Ascendente ' + decimalToDMS(dados.data.first_house.position) + ' em ' + getSignoCerto(dados.data.first_house.sign) + ' ' + getNomeCompletoSigno(dados.data.first_house.sign);
    mc.innerHTML = '♁' + ' MC ' + decimalToDMS(dados.data.tenth_house.position) + ' em ' + getSignoCerto(dados.data.tenth_house.sign) + ' ' + getNomeCompletoSigno(dados.data.tenth_house.sign);


    // Log para verificar a renderização
    console.log("Mapa Astral Renderizado");
}

// Chamar a função principal
//fetchAstrologicalData();

const resultado = {
    "status": "OK",
    "chart": "<?xml version='1.0' encoding='UTF-8'?><!--- This file is part of Kerykeion and is based onOpenAstro.org --><svg style='background-color:var(--kerykeion-chart-color-paper-1)' preserveAspectRatio='xMidYMid' viewBox='0 0 820 550' xmlns='http://www.w3.org/2000/svg' xmlns:kr='https://www.kerykeion.net/' xmlns:xlink='http://www.w3.org/1999/xlink'> <title>Alvaro Leonardo Gomes | Kerykeion</title> <!-- Colors --> <style kr:node='Theme_Colors_Tag'>:root {/* Main Colors */--kerykeion-chart-color-paper-0: #000000;--kerykeion-chart-color-paper-1: #ffffff;--kerykeion-chart-color-zodiac-bg-0: #ff7200;--kerykeion-chart-color-zodiac-bg-1: #6b3d00;--kerykeion-chart-color-zodiac-bg-2: #69acf1;--kerykeion-chart-color-zodiac-bg-3: #2b4972;--kerykeion-chart-color-zodiac-bg-4: #ff7200;--kerykeion-chart-color-zodiac-bg-5: #6b3d00;--kerykeion-chart-color-zodiac-bg-6: #69acf1;--kerykeion-chart-color-zodiac-bg-7: #2b4972;--kerykeion-chart-color-zodiac-bg-8: #ff7200;--kerykeion-chart-color-zodiac-bg-9: #6b3d00;--kerykeion-chart-color-zodiac-bg-10: #69acf1;--kerykeion-chart-color-zodiac-bg-11: #2b4972;--kerykeion-chart-color-zodiac-icon-0: #ff7200;--kerykeion-chart-color-zodiac-icon-1: #6b3d00;--kerykeion-chart-color-zodiac-icon-2: #69acf1;--kerykeion-chart-color-zodiac-icon-3: #2b4972;--kerykeion-chart-color-zodiac-icon-4: #ff7200;--kerykeion-chart-color-zodiac-icon-5: #6b3d00;--kerykeion-chart-color-zodiac-icon-6: #69acf1;--kerykeion-chart-color-zodiac-icon-7: #2b4972;--kerykeion-chart-color-zodiac-icon-8: #ff7200;--kerykeion-chart-color-zodiac-icon-9: #6b3d00;--kerykeion-chart-color-zodiac-icon-10: #69acf1;--kerykeion-chart-color-zodiac-icon-11: #2b4972;--kerykeion-chart-color-zodiac-radix-ring-0: #ff0000;--kerykeion-chart-color-zodiac-radix-ring-1: #ff0000;--kerykeion-chart-color-zodiac-radix-ring-2: #ff0000;--kerykeion-chart-color-zodiac-transit-ring-0: #ff0000;--kerykeion-chart-color-zodiac-transit-ring-1: #ff0000;--kerykeion-chart-color-zodiac-transit-ring-2: #0000ff;--kerykeion-chart-color-zodiac-transit-ring-3: #0000ff;--kerykeion-chart-color-houses-radix-line: #ff0000;--kerykeion-chart-color-houses-transit-line: #0000ff;--kerykeion-chart-color-lunar-phase-0: #000000;--kerykeion-chart-color-lunar-phase-1: #ffffff;/* Aspects */--kerykeion-chart-color-conjunction: #5757e2;--kerykeion-chart-color-semi-sextile: #810757;--kerykeion-chart-color-semi-square: #b14e58;--kerykeion-chart-color-sextile: #d59e28;--kerykeion-chart-color-quintile: #1f99b3;--kerykeion-chart-color-square: #dc0000;--kerykeion-chart-color-trine: #36d100;--kerykeion-chart-color-sesquiquadrate: #985a10;--kerykeion-chart-color-biquintile: #7a9810;--kerykeion-chart-color-quincunx: #26bbcf;--kerykeion-chart-color-opposition: #510060;/* Planets */--kerykeion-chart-color-sun: #984b00;--kerykeion-chart-color-moon: #150052;--kerykeion-chart-color-mercury: #520800;--kerykeion-chart-color-venus: #400052;--kerykeion-chart-color-mars: #540000;--kerykeion-chart-color-jupiter: #47133d;--kerykeion-chart-color-saturn: #124500;--kerykeion-chart-color-uranus: #6f0766;--kerykeion-chart-color-neptune: #06537f;--kerykeion-chart-color-pluto: #713f04;--kerykeion-chart-color-mean-node: #4c1541;--kerykeion-chart-color-true-node: #4c1541;--kerykeion-chart-color-chiron: #666f06;--kerykeion-chart-color-first-house: #ff7e00;--kerykeion-chart-color-tenth-house: #ff0000;--kerykeion-chart-color-seventh-house: #0000ff;--kerykeion-chart-color-fourth-house: #000000;--kerykeion-chart-color-mean-lilith: #000000;/* Elements Percentage */--kerykeion-chart-color-air-percentage: #6f76d1;--kerykeion-chart-color-earth-percentage: #6a2d04;--kerykeion-chart-color-fire-percentage: #ff6600;--kerykeion-chart-color-water-percentage: #630e73;/* Other */--kerykeion-chart-color-house-number: #f00;}</style> <!---Main Chart --> <g kr:node='Main_Chart'><g kr:node='Main_Text'> <rect class='background-rectangle' width='820' height='550' fill='var(--kerykeion-chart-color-paper-1)'/> <text x='20' y='22' fill='var(--kerykeion-chart-color-paper-0)' font-size='24px'>Alvaro Leonardo Gomes</text> <text x='20' y='50' fill='var(--kerykeion-chart-color-paper-0)' font-size='11px'>Informações:</text> <text x='20' y='62' fill='var(--kerykeion-chart-color-paper-0)' font-size='11px'>maceio</text> <text x='20' y='74' fill='var(--kerykeion-chart-color-paper-0)' font-size='11px'>2004-04-01 18:39 [+00:00]</text> <text x='20' y='86' fill='var(--kerykeion-chart-color-paper-0)' font-size='11px'>Latitude: 9°38'52' Sul</text> <text x='20' y='98' fill='var(--kerykeion-chart-color-paper-0)' font-size='11px'>Longitude: 35°44'2' Oeste</text> <text x='20' y='110' fill='var(--kerykeion-chart-color-paper-0)' font-size='11px'>Tipo: Natal</text> <text x='20' y='452' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>Tropic</text> <text x='20' y='466' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>Placidus</text> <text x='20' y='480' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>Fase lunar: Dia 22</text> <text x='20' y='494' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>Fase lunar: Last Quarter</text> <text x='20' y='508' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>Apparent Geocentric</text></g><!-- Lunar Phase --><g transform='translate(20,518)' kr:node='Lunar_Phase'> <g transform='rotate(-80.352 20 10)'><defs> <clipPath id='moonPhaseCutOffCircle'><circle cx='20' cy='10' r='10'/> </clipPath></defs><circle cx='20' cy='10' r='10' fill='var(--kerykeion-chart-color-lunar-phase-0)'/><circle cx='-55.498' cy='10' r='76.877' clip-path='url(#moonPhaseCutOffCircle)' fill='var(--kerykeion-chart-color-lunar-phase-1)'/><circle cx='20' cy='10' r='10' fill='none' stroke='var(--kerykeion-chart-color-lunar-phase-0)' stroke-opacity='.5' stroke-width='.5px'/> </g></g><g transform='translate(50,50)' kr:node='Main_Content'> <!-- Full Wheel --> <g transform='translate(10)' kr:node='Full_Wheel'><!-- Zodiac --><g kr:node='Zodiac'> <path d='m240 240 227.6-76.15a240 240 0 0 0-68.567-103.6z' fill='var(--kerykeion-chart-color-zodiac-bg-0)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='425.124432047702' y='117.47267790808547' xlink:href='#Ari'/> </g> <path d='m240 240 159.03-179.75a240 240 0 0 0-111.18-55.434z' fill='var(--kerykeion-chart-color-zodiac-bg-1)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='339.0587999685187' y='41.32601038687275' xlink:href='#Tau'/> </g> <path d='m240 240 47.852-235.18a240 240 0 0 0-124 7.5825z' fill='var(--kerykeion-chart-color-zodiac-bg-2)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='226.4504424345748' y='18.413877939566728' xlink:href='#Gem'/> </g> <path d='m240 240-76.15-227.6a240 240 0 0 0-103.6 68.567z' fill='var(--kerykeion-chart-color-zodiac-bg-3)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='117.47267790808547' y='54.87556795229801' xlink:href='#Can'/> </g> <path d='m240 240-179.75-159.03a240 240 0 0 0-55.434 111.18z' fill='var(--kerykeion-chart-color-zodiac-bg-4)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='41.32601038687278' y='140.94120003148123' xlink:href='#Leo'/> </g> <path d='m240 240-235.18-47.852a240 240 0 0 0 7.5825 124z' fill='var(--kerykeion-chart-color-zodiac-bg-5)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='18.413877939566728' y='253.54955756542515' xlink:href='#Vir'/> </g> <path d='m240 240-227.6 76.15a240 240 0 0 0 68.567 103.6z' fill='var(--kerykeion-chart-color-zodiac-bg-6)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='54.87556795229801' y='362.5273220919145' xlink:href='#Lib'/> </g> <path d='m240 240-159.03 179.75a240 240 0 0 0 111.18 55.434z' fill='var(--kerykeion-chart-color-zodiac-bg-7)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='140.94120003148112' y='438.67398961312716' xlink:href='#Sco'/> </g> <path d='m240 240-47.852 235.18a240 240 0 0 0 124-7.5825z' fill='var(--kerykeion-chart-color-zodiac-bg-8)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='253.54955756542515' y='461.5861220604333' xlink:href='#Sag'/> </g> <path d='m240 240 76.15 227.6a240 240 0 0 0 103.6-68.567z' fill='var(--kerykeion-chart-color-zodiac-bg-9)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='362.52732209191447' y='425.12443204770204' xlink:href='#Cap'/> </g> <path d='m240 240 179.75 159.03a240 240 0 0 0 55.434-111.18z' fill='var(--kerykeion-chart-color-zodiac-bg-10)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='438.67398961312716' y='339.0587999685189' xlink:href='#Aqu'/> </g> <path d='m240 240 235.18 47.852a240 240 0 0 0-7.5825-124z' fill='var(--kerykeion-chart-color-zodiac-bg-11)' fill-opacity='.5'/> <g transform='translate(-16,-16)'><use x='461.5861220604333' y='226.45044243457485' xlink:href='#Pis'/> </g></g><!-- First Circle --><g kr:node='First_Circle'> <circle cx='240' cy='240' r='240' fill='none' stroke='var(--kerykeion-chart-color-zodiac-radix-ring-2)' stroke-width='1px'/></g><!-- Second Circle --><g kr:node='Second_Circle'> <circle cx='240' cy='240' r='204' fill='var(--kerykeion-chart-color-paper-1)' fill-opacity='.2' stroke='var(--kerykeion-chart-color-zodiac-radix-ring-1)' stroke-opacity='.4' stroke-width='1px'/></g><!-- Third Circle --><g kr:node='Third_Circle'> <circle cx='240' cy='240' r='120' fill='var(--kerykeion-chart-color-paper-1)' fill-opacity='.8' stroke='var(--kerykeion-chart-color-zodiac-radix-ring-0)' stroke-width='1px'/></g><!-- Transit_Ring --><!-- Degree Ring --><g kr:node='Degree_Ring'> <g id='degreeRing' stroke='var(--kerykeion-chart-color-paper-0)' stroke-opacity='.9' stroke-width='1px'><line x1='467.6' x2='469.5' y1='163.85' y2='163.22'/><line x1='460.1' x2='461.93' y1='144.3' y2='143.51'/><line x1='450.92' x2='452.68' y1='125.48' y2='124.53'/><line x1='440.13' x2='441.8' y1='107.54' y2='106.43'/><line x1='427.83' x2='429.39' y1='90.599' y2='89.354'/><line x1='414.09' x2='415.54' y1='74.797' y2='73.421'/><line x1='399.03' x2='400.36' y1='60.253' y2='58.755'/><line x1='382.76' x2='383.95' y1='47.076' y2='45.469'/><line x1='365.4' x2='366.45' y1='35.368' y2='33.663'/><line x1='347.09' x2='347.98' y1='25.217' y2='23.427'/><line x1='327.96' x2='328.7' y1='16.701' y2='14.84'/><line x1='308.17' x2='308.74' y1='9.8843' y2='7.9666'/><line x1='287.85' x2='288.25' y1='4.8188' y2='2.8589'/><line x1='267.17' x2='267.4' y1='1.5431' y2='-.44399'/><line x1='246.29' x2='246.34' y1='.082333' y2='-1.917'/><line x1='225.35' x2='225.23' y1='.44744' y2='-1.5488'/><line x1='204.53' x2='204.23' y1='2.6357' y2='.65764'/><line x1='183.98' x2='183.51' y1='6.6304' y2='4.6857'/><line x1='163.85' x2='163.22' y1='12.401' y2='10.505'/><line x1='144.3' x2='143.51' y1='19.904' y2='18.07'/><line x1='125.48' x2='124.53' y1='29.082' y2='27.325'/><line x1='107.54' x2='106.43' y1='39.865' y2='38.198'/><line x1='90.599' x2='89.354' y1='52.172' y2='50.607'/><line x1='74.797' x2='73.421' y1='65.908' y2='64.457'/><line x1='60.253' x2='58.755' y1='80.969' y2='79.643'/><line x1='47.076' x2='45.469' y1='97.24' y2='96.05'/><line x1='35.368' x2='33.663' y1='114.6' y2='113.55'/><line x1='25.217' x2='23.427' y1='132.91' y2='132.02'/><line x1='16.701' x2='14.84' y1='152.04' y2='151.3'/><line x1='9.8843' x2='7.9666' y1='171.83' y2='171.26'/><line x1='4.8188' x2='2.8589' y1='192.15' y2='191.75'/><line x1='1.5431' x2='-.44399' y1='212.83' y2='212.6'/><line x1='.082333' x2='-1.917' y1='233.71' y2='233.66'/><line x1='.44744' x2='-1.5488' y1='254.65' y2='254.77'/><line x1='2.6357' x2='.65764' y1='275.47' y2='275.77'/><line x1='6.6304' x2='4.6857' y1='296.02' y2='296.49'/><line x1='12.401' x2='10.505' y1='316.15' y2='316.78'/><line x1='19.904' x2='18.07' y1='335.7' y2='336.49'/><line x1='29.082' x2='27.325' y1='354.52' y2='355.47'/><line x1='39.865' x2='38.198' y1='372.46' y2='373.57'/><line x1='52.172' x2='50.607' y1='389.4' y2='390.65'/><line x1='65.908' x2='64.457' y1='405.2' y2='406.58'/><line x1='80.969' x2='79.643' y1='419.75' y2='421.24'/><line x1='97.24' x2='96.05' y1='432.92' y2='434.53'/><line x1='114.6' x2='113.55' y1='444.63' y2='446.34'/><line x1='132.91' x2='132.02' y1='454.78' y2='456.57'/><line x1='152.04' x2='151.3' y1='463.3' y2='465.16'/><line x1='171.83' x2='171.26' y1='470.12' y2='472.03'/><line x1='192.15' x2='191.75' y1='475.18' y2='477.14'/><line x1='212.83' x2='212.6' y1='478.46' y2='480.44'/><line x1='233.71' x2='233.66' y1='479.92' y2='481.92'/><line x1='254.65' x2='254.77' y1='479.55' y2='481.55'/><line x1='275.47' x2='275.77' y1='477.36' y2='479.34'/><line x1='296.02' x2='296.49' y1='473.37' y2='475.31'/><line x1='316.15' x2='316.78' y1='467.6' y2='469.5'/><line x1='335.7' x2='336.49' y1='460.1' y2='461.93'/><line x1='354.52' x2='355.47' y1='450.92' y2='452.68'/><line x1='372.46' x2='373.57' y1='440.13' y2='441.8'/><line x1='389.4' x2='390.65' y1='427.83' y2='429.39'/><line x1='405.2' x2='406.58' y1='414.09' y2='415.54'/><line x1='419.75' x2='421.24' y1='399.03' y2='400.36'/><line x1='432.92' x2='434.53' y1='382.76' y2='383.95'/><line x1='444.63' x2='446.34' y1='365.4' y2='366.45'/><line x1='454.78' x2='456.57' y1='347.09' y2='347.98'/><line x1='463.3' x2='465.16' y1='327.96' y2='328.7'/><line x1='470.12' x2='472.03' y1='308.17' y2='308.74'/><line x1='475.18' x2='477.14' y1='287.85' y2='288.25'/><line x1='478.46' x2='480.44' y1='267.17' y2='267.4'/><line x1='479.92' x2='481.92' y1='246.29' y2='246.34'/><line x1='479.55' x2='481.55' y1='225.35' y2='225.23'/><line x1='477.36' x2='479.34' y1='204.53' y2='204.23'/><line x1='473.37' x2='475.31' y1='183.98' y2='183.51'/> </g></g><!-- Houses --><g kr:node='Houses_Wheel'> <g kr:node='Cusp'><line x1='120' y1='240' y2='240' stroke='var(--kerykeion-chart-color-chiron)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='53.389486855097196' y='299.1353673067655'>1</tspan></text> </g> <g kr:node='Cusp'><line x1='141.7' x2='43.404' y1='308.83' y2='377.66' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='113.58477894018444' y='390.08053307884376'>2</tspan></text> </g> <g kr:node='Cusp'><line x1='191.19' x2='142.38' y1='349.63' y2='459.25' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='200.3646728877034' y='431.4724192219515'>3</tspan></text> </g> <g kr:node='Cusp'><line x1='248.37' x2='256.74' y1='359.71' y2='479.42' stroke='var(--kerykeion-chart-color-seventh-house)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='293.1353673067655' y='426.6105131449028'>4</tspan></text> </g> <g kr:node='Cusp'><line x1='300' x2='360' y1='343.92' y2='447.85' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='367.9436851319997' y='383.41991071088074'>5</tspan></text> </g> <g kr:node='Cusp'><line x1='341.77' x2='443.53' y1='303.59' y2='367.18' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='420.6105131449028' y='299.1353673067655'>6</tspan></text> </g> <g kr:node='Cusp'><line x1='360' x2='480' y1='240' y2='240' stroke='var(--kerykeion-chart-color-tenth-house)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='420.6105131449028' y='186.86463269323454'>7</tspan></text> </g> <g kr:node='Cusp'><line x1='338.3' x2='436.6' y1='171.17' y2='102.34' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='360.4152210598155' y='95.9194669211562'>8</tspan></text> </g> <g kr:node='Cusp'><line x1='288.81' x2='337.62' y1='130.37' y2='20.749' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='273.63532711229647' y='54.527580778048495'>9</tspan></text> </g> <g kr:node='Cusp'><line x1='231.63' x2='223.26' y1='120.29' y2='.58463' stroke='var(--kerykeion-chart-color-first-house)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='180.86463269323448' y='59.38948685509722'>10</tspan></text> </g> <g kr:node='Cusp'><line x1='180' x2='120' y1='136.08' y2='32.154' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='106.05631486800021' y='102.58008928911934'>11</tspan></text> </g> <g kr:node='Cusp'><line x1='138.23' x2='36.468' y1='176.41' y2='112.82' stroke='var(--kerykeion-chart-color-houses-radix-line)' stroke-dasharray='3,2' stroke-opacity='.4' stroke-width='1px'/> </g> <g kr:node='HouseNumber'><text fill='var(--kerykeion-chart-color-house-number)' fill-opacity='.6' font-size='14px'><tspan x='53.389486855097175' y='186.86463269323463'>12</tspan></text> </g></g><!-- Planets --><g kr:node='Planets_Wheel'> <g transform='translate(-12,-12) scale(1)' kr:house='Seventh_House' kr:node='ChartPoint' kr:sign='Ari' kr:slug='Saturn'><use x='372.32093690735087' y='178.29773378585782' xlink:href='#Saturn'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Seventh_House' kr:node='ChartPoint' kr:sign='Ari' kr:slug='Venus'><use x='385.18687138513974' y='159.52160303910807' xlink:href='#Venus'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Seventh_House' kr:node='ChartPoint' kr:sign='Ari' kr:slug='Sun'><use x='362.4459029200319' y='160.48270088780606' xlink:href='#Sun'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Eighth_House' kr:node='ChartPoint' kr:sign='Tau' kr:slug='Mercury'><use x='348.90579881242417' y='114.71820968301981' xlink:href='#Mercury'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='None' kr:node='ChartPoint' kr:sign='Gem' kr:slug='Tenth_House'><use x='229.81555483335765' y='94.35564866206566' xlink:href='#Tenth_House'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Twelfth_House' kr:node='ChartPoint' kr:sign='Vir' kr:slug='Mean_Lilith'><use x='76.52191299997347' y='211.17440250728953' xlink:href='#Mean_Lilith'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='None' kr:node='ChartPoint' kr:sign='Vir' kr:slug='First_House'><use x='94.0' y='240.00000000000003' xlink:href='#First_House'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='First_House' kr:node='ChartPoint' kr:sign='Vir' kr:slug='Mars'><use x='76.52191299997347' y='268.8255974927105' xlink:href='#Mars'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='First_House' kr:node='ChartPoint' kr:sign='Vir' kr:slug='Mean_Node'><use x='100.37950562939683' y='282.6862688895196' xlink:href='#Mean_Node'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Second_House' kr:node='ChartPoint' kr:sign='Sco' kr:slug='Chiron'><use x='131.09420118757575' y='365.2817903169801' xlink:href='#Chiron'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Third_House' kr:node='ChartPoint' kr:sign='Sag' kr:slug='Pluto'><use x='224.7388443629226' y='385.20019672376793' xlink:href='#Pluto'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Fifth_House' kr:node='ChartPoint' kr:sign='Cap' kr:slug='Moon'><use x='353.21172777037475' y='361.4047144687823' xlink:href='#Moon'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Fifth_House' kr:node='ChartPoint' kr:sign='Cap' kr:slug='Neptune'><use x='348.4991445196996' y='337.69306852839327' xlink:href='#Neptune'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Fifth_House' kr:node='ChartPoint' kr:sign='Aqu' kr:slug='Uranus'><use x='377.6202370441369' y='332.826021976144' xlink:href='#Uranus'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Sixth_House' kr:node='ChartPoint' kr:sign='Aqu' kr:slug='Jupiter'><use x='371.2239307596784' y='304.0021874312053' xlink:href='#Jupiter'/> </g> <g transform='translate(-12,-12) scale(1)' kr:house='Seventh_House' kr:node='ChartPoint' kr:sign='Pis' kr:slug='Mean_South_Node'><use x='398.7465894898639' y='191.4662970160257' xlink:href='#Mean_South_Node'/> </g></g><!-- Aspects --><g kr:node='Aspects_Wheel'> <g kr:aspectname='conjunction' kr:from='Venus' kr:fromoriginaldegrees='11.867816007722602' kr:node='Aspect' kr:to='Sun' kr:tooriginaldegrees='12.071002983081414'><line class='aspect' x1='342.86' x2='343.92' y1='178.2' y2='180' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Jupiter' kr:fromoriginaldegrees='315.1492227409577' kr:node='Aspect' kr:to='Sun' kr:tooriginaldegrees='12.071002983081414'><line class='aspect' x1='342.86' x2='347.86' y1='178.2' y2='292.6' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='conjunction' kr:from='Saturn' kr:fromoriginaldegrees='10.48047090131017' kr:node='Aspect' kr:to='Sun' kr:tooriginaldegrees='12.071002983081414'><line class='aspect' x1='342.86' x2='344.95' y1='178.2' y2='181.82' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Uranus' kr:fromoriginaldegrees='307.97469158140666' kr:node='Aspect' kr:to='Sun' kr:tooriginaldegrees='12.071002983081414'><line class='aspect' x1='342.86' x2='339.48' y1='178.2' y2='307.1' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='quintile' kr:from='Neptune' kr:fromoriginaldegrees='299.70836344640287' kr:node='Aspect' kr:to='Sun' kr:tooriginaldegrees='12.071002983081414'><line class='aspect' x1='342.86' x2='329.18' y1='178.2' y2='320.3' stroke='var(--kerykeion-chart-color-quintile)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Pluto' kr:fromoriginaldegrees='245.43902339642585' kr:node='Aspect' kr:to='Sun' kr:tooriginaldegrees='12.071002983081414'><line class='aspect' x1='342.86' x2='227.46' y1='178.2' y2='359.34' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='square' kr:from='Mercury' kr:fromoriginaldegrees='30.28296517978682' kr:node='Aspect' kr:to='Moon' kr:tooriginaldegrees='294.4890466987013'><line class='aspect' x1='321.84' x2='318.73' y1='327.76' y2='149.43' stroke='var(--kerykeion-chart-color-square)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Mars' kr:fromoriginaldegrees='171.06222466793605' kr:node='Aspect' kr:to='Moon' kr:tooriginaldegrees='294.4890466987013'><line class='aspect' x1='321.84' x2='121.82' y1='327.76' y2='260.84' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='conjunction' kr:from='Neptune' kr:fromoriginaldegrees='299.70836344640287' kr:node='Aspect' kr:to='Moon' kr:tooriginaldegrees='294.4890466987013'><line class='aspect' x1='321.84' x2='329.18' y1='327.76' y2='320.3' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Mean_Node' kr:fromoriginaldegrees='178.24819155640148' kr:node='Aspect' kr:to='Moon' kr:tooriginaldegrees='294.4890466987013'><line class='aspect' x1='321.84' x2='125.24' y1='327.76' y2='275.08' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Mean_South_Node' kr:fromoriginaldegrees='358.2481915564015' kr:node='Aspect' kr:to='Moon' kr:tooriginaldegrees='294.4890466987013'><line class='aspect' x1='321.84' x2='354.76' y1='327.76' y2='204.92' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='square' kr:from='Neptune' kr:fromoriginaldegrees='299.70836344640287' kr:node='Aspect' kr:to='Mercury' kr:tooriginaldegrees='30.28296517978682'><line class='aspect' x1='318.73' x2='329.18' y1='149.43' y2='320.3' stroke='var(--kerykeion-chart-color-square)' stroke-opacity='.9'/> </g> <g kr:aspectname='opposition' kr:from='Chiron' kr:fromoriginaldegrees='210.21150034983734' kr:node='Aspect' kr:to='Mercury' kr:tooriginaldegrees='30.28296517978682'><line class='aspect' x1='318.73' x2='161.27' y1='149.43' y2='330.57' stroke='var(--kerykeion-chart-color-opposition)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Mean_Lilith' kr:fromoriginaldegrees='151.51639179162316' kr:node='Aspect' kr:to='Mercury' kr:tooriginaldegrees='30.28296517978682'><line class='aspect' x1='318.73' x2='121.82' y1='149.43' y2='219.16' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Jupiter' kr:fromoriginaldegrees='315.1492227409577' kr:node='Aspect' kr:to='Venus' kr:tooriginaldegrees='11.867816007722602'><line class='aspect' x1='343.92' x2='347.86' y1='180' y2='292.6' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='conjunction' kr:from='Saturn' kr:fromoriginaldegrees='10.48047090131017' kr:node='Aspect' kr:to='Venus' kr:tooriginaldegrees='11.867816007722602'><line class='aspect' x1='343.92' x2='344.95' y1='180' y2='181.82' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Uranus' kr:fromoriginaldegrees='307.97469158140666' kr:node='Aspect' kr:to='Venus' kr:tooriginaldegrees='11.867816007722602'><line class='aspect' x1='343.92' x2='339.48' y1='180' y2='307.1' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='quintile' kr:from='Neptune' kr:fromoriginaldegrees='299.70836344640287' kr:node='Aspect' kr:to='Venus' kr:tooriginaldegrees='11.867816007722602'><line class='aspect' x1='343.92' x2='329.18' y1='180' y2='320.3' stroke='var(--kerykeion-chart-color-quintile)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Pluto' kr:fromoriginaldegrees='245.43902339642585' kr:node='Aspect' kr:to='Venus' kr:tooriginaldegrees='11.867816007722602'><line class='aspect' x1='343.92' x2='227.46' y1='180' y2='359.34' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Neptune' kr:fromoriginaldegrees='299.70836344640287' kr:node='Aspect' kr:to='Mars' kr:tooriginaldegrees='171.06222466793605'><line class='aspect' x1='121.82' x2='329.18' y1='260.84' y2='320.3' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='conjunction' kr:from='Mean_Node' kr:fromoriginaldegrees='178.24819155640148' kr:node='Aspect' kr:to='Mars' kr:tooriginaldegrees='171.06222466793605'><line class='aspect' x1='121.82' x2='125.24' y1='260.84' y2='275.08' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='opposition' kr:from='Mean_South_Node' kr:fromoriginaldegrees='358.2481915564015' kr:node='Aspect' kr:to='Mars' kr:tooriginaldegrees='171.06222466793605'><line class='aspect' x1='121.82' x2='354.76' y1='260.84' y2='204.92' stroke='var(--kerykeion-chart-color-opposition)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Saturn' kr:fromoriginaldegrees='10.48047090131017' kr:node='Aspect' kr:to='Jupiter' kr:tooriginaldegrees='315.1492227409577'><line class='aspect' x1='347.86' x2='344.95' y1='292.6' y2='181.82' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='conjunction' kr:from='Uranus' kr:fromoriginaldegrees='307.97469158140666' kr:node='Aspect' kr:to='Jupiter' kr:tooriginaldegrees='315.1492227409577'><line class='aspect' x1='347.86' x2='339.48' y1='292.6' y2='307.1' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Tenth_House' kr:fromoriginaldegrees='75.42174552939085' kr:node='Aspect' kr:to='Jupiter' kr:tooriginaldegrees='315.1492227409577'><line class='aspect' x1='347.86' x2='231.63' y1='292.6' y2='120.29' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Uranus' kr:fromoriginaldegrees='307.97469158140666' kr:node='Aspect' kr:to='Saturn' kr:tooriginaldegrees='10.48047090131017'><line class='aspect' x1='344.95' x2='339.48' y1='181.82' y2='307.1' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Pluto' kr:fromoriginaldegrees='245.43902339642585' kr:node='Aspect' kr:to='Saturn' kr:tooriginaldegrees='10.48047090131017'><line class='aspect' x1='344.95' x2='227.46' y1='181.82' y2='359.34' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='conjunction' kr:from='Neptune' kr:fromoriginaldegrees='299.70836344640287' kr:node='Aspect' kr:to='Uranus' kr:tooriginaldegrees='307.97469158140666'><line class='aspect' x1='339.48' x2='329.18' y1='307.1' y2='320.3' stroke='var(--kerykeion-chart-color-conjunction)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Pluto' kr:fromoriginaldegrees='245.43902339642585' kr:node='Aspect' kr:to='Uranus' kr:tooriginaldegrees='307.97469158140666'><line class='aspect' x1='339.48' x2='227.46' y1='307.1' y2='359.34' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Pluto' kr:fromoriginaldegrees='245.43902339642585' kr:node='Aspect' kr:to='Neptune' kr:tooriginaldegrees='299.70836344640287'><line class='aspect' x1='329.18' x2='227.46' y1='320.3' y2='359.34' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Mean_Node' kr:fromoriginaldegrees='178.24819155640148' kr:node='Aspect' kr:to='Neptune' kr:tooriginaldegrees='299.70836344640287'><line class='aspect' x1='329.18' x2='125.24' y1='320.3' y2='275.08' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='square' kr:from='Chiron' kr:fromoriginaldegrees='210.21150034983734' kr:node='Aspect' kr:to='Neptune' kr:tooriginaldegrees='299.70836344640287'><line class='aspect' x1='329.18' x2='161.27' y1='320.3' y2='330.57' stroke='var(--kerykeion-chart-color-square)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Mean_South_Node' kr:fromoriginaldegrees='358.2481915564015' kr:node='Aspect' kr:to='Neptune' kr:tooriginaldegrees='299.70836344640287'><line class='aspect' x1='329.18' x2='354.76' y1='320.3' y2='204.92' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g> <g kr:aspectname='square' kr:from='Mean_Lilith' kr:fromoriginaldegrees='151.51639179162316' kr:node='Aspect' kr:to='Pluto' kr:tooriginaldegrees='245.43902339642585'><line class='aspect' x1='227.46' x2='121.82' y1='359.34' y2='219.16' stroke='var(--kerykeion-chart-color-square)' stroke-opacity='.9'/> </g> <g kr:aspectname='trine' kr:from='Mean_South_Node' kr:fromoriginaldegrees='358.2481915564015' kr:node='Aspect' kr:to='Pluto' kr:tooriginaldegrees='245.43902339642585'><line class='aspect' x1='227.46' x2='354.76' y1='359.34' y2='204.92' stroke='var(--kerykeion-chart-color-trine)' stroke-opacity='.9'/> </g> <g kr:aspectname='sextile' kr:from='Mean_Lilith' kr:fromoriginaldegrees='151.51639179162316' kr:node='Aspect' kr:to='Chiron' kr:tooriginaldegrees='210.21150034983734'><line class='aspect' x1='161.27' x2='121.82' y1='330.57' y2='219.16' stroke='var(--kerykeion-chart-color-sextile)' stroke-opacity='.9'/> </g></g> </g> <!-- AspectGrid --> <g transform='translate(10)' kr:node='Aspect_Grid'><rect x='380' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='955.0' y='1172.5' xlink:href='#Mean_South_Node'/><rect x='394' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='408' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='422' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='436' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='450' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='464' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='465' y='469' xlink:href='#orb120'/><rect x='478' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='479' y='469' xlink:href='#orb60'/><rect x='492' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='506' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='535' y='469' xlink:href='#orb180'/><rect x='548' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='577' y='469' xlink:href='#orb60'/><rect x='590' y='468' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='394' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='990.0' y='1137.5' xlink:href='#Mean_Lilith'/><rect x='408' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='422' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='436' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='437' y='455' xlink:href='#orb60'/><rect x='450' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='464' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='465' y='455' xlink:href='#orb90'/><rect x='478' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='492' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='506' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='563' y='455' xlink:href='#orb120'/><rect x='576' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='454' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='408' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1025.0' y='1102.5' xlink:href='#Tenth_House'/><rect x='422' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='436' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='450' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='464' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='478' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='492' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='506' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='521' y='441' xlink:href='#orb120'/><rect x='534' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='440' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='422' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1060.0' y='1067.5' xlink:href='#First_House'/><rect x='436' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='450' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='464' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='478' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='492' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='506' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='426' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='436' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1095.0' y='1032.5' xlink:href='#Chiron'/><rect x='450' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='464' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='478' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='479' y='413' xlink:href='#orb90'/><rect x='492' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='506' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='563' y='413' xlink:href='#orb180'/><rect x='576' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='412' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='450' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1130.0' y='997.5' xlink:href='#Mean_Node'/><rect x='464' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='478' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='479' y='399' xlink:href='#orb120'/><rect x='492' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='506' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='535' y='399' xlink:href='#orb0'/><rect x='548' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='577' y='399' xlink:href='#orb120'/><rect x='590' y='398' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='464' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1165.0' y='962.5' xlink:href='#Pluto'/><rect x='478' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='479' y='385' xlink:href='#orb60'/><rect x='492' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='493' y='385' xlink:href='#orb60'/><rect x='506' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='507' y='385' xlink:href='#orb120'/><rect x='520' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='549' y='385' xlink:href='#orb120'/><rect x='562' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='384' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='591' y='385' xlink:href='#orb120'/><rect x='478' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1200.0' y='927.5' xlink:href='#Neptune'/><rect x='492' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='493' y='371' xlink:href='#orb0'/><rect x='506' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='520' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='534' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='535' y='371' xlink:href='#orb120'/><rect x='548' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='549' y='371' xlink:href='#orb72'/><rect x='562' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='563' y='371' xlink:href='#orb90'/><rect x='576' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='577' y='371' xlink:href='#orb0'/><rect x='590' y='370' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='591' y='371' xlink:href='#orb72'/><rect x='492' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1235.0' y='892.5' xlink:href='#Uranus'/><rect x='506' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='507' y='357' xlink:href='#orb60'/><rect x='520' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='521' y='357' xlink:href='#orb0'/><rect x='534' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='549' y='357' xlink:href='#orb60'/><rect x='562' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='356' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='591' y='357' xlink:href='#orb60'/><rect x='506' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1270.0' y='857.5' xlink:href='#Saturn'/><rect x='520' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='521' y='343' xlink:href='#orb60'/><rect x='534' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='549' y='343' xlink:href='#orb0'/><rect x='562' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='342' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='591' y='343' xlink:href='#orb0'/><rect x='520' y='328' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1305.0' y='822.5' xlink:href='#Jupiter'/><rect x='534' y='328' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='328' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='549' y='329' xlink:href='#orb60'/><rect x='562' y='328' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='328' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='328' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='591' y='329' xlink:href='#orb60'/><rect x='534' y='314' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1340.0' y='787.5' xlink:href='#Mars'/><rect x='548' y='314' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='562' y='314' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='314' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='577' y='315' xlink:href='#orb120'/><rect x='590' y='314' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='548' y='300' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1375.0' y='752.5' xlink:href='#Venus'/><rect x='562' y='300' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='300' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='300' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='591' y='301' xlink:href='#orb0'/><rect x='562' y='286' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1410.0' y='717.5' xlink:href='#Mercury'/><rect x='576' y='286' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use x='577' y='287' xlink:href='#orb90'/><rect x='590' y='286' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='576' y='272' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1445.0' y='682.5' xlink:href='#Moon'/><rect x='590' y='272' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><rect x='590' y='258' width='14' height='14' fill='none' stroke='var(--kerykeion-chart-color-paper-0)' stroke-width='.5px' kr:node='AspectsGridRect'/><use transform='scale(.4)' x='1480.0' y='647.5' xlink:href='#Sun'/> </g> <!-- Elements --> <g kr:node='Elements_Percentages'><g transform='translate(-30,79)' font-size='10px'> <text fill='var(--kerykeion-chart-color-fire-percentage)'>Fogo 31%</text> <text y='12' fill='var(--kerykeion-chart-color-earth-percentage)'>Terra 49%</text> <text y='24' fill='var(--kerykeion-chart-color-air-percentage)'>Ar 20%</text> <text y='36' fill='var(--kerykeion-chart-color-water-percentage)'>Água 0%</text></g> </g> <!-- Houses_And_Planets_Grid --> <g kr:node='Houses_And_Planets_Grid'><!-- Planet Grid --><g transform='translate(560,-20)' kr:node='Planet_Grid'> <g transform='translate(175 -15)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='14px' text-anchor='end'>Pontos para Alvaro Leonardo Gomes:</text> </g> <g transform='translate(0,10)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Sol</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Sun'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>12°04'16'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Ari'/></g> </g> <g transform='translate(0,24)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Lua</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Moon'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>24°29'21'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Cap'/></g> </g> <g transform='translate(0,38)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Mercúrio</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Mercury'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>0°16'59'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Tau'/></g> </g> <g transform='translate(0,52)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Vênus</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Venus'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>11°52'04'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Ari'/></g> </g> <g transform='translate(0,66)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Marte</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Mars'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>21°03'44'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Vir'/></g><g transform='translate(74,-6)'> <use transform='scale(.5)' xlink:href='#retrograde'/></g> </g> <g transform='translate(0,80)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Júpiter</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Jupiter'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>15°08'57'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Aqu'/></g> </g> <g transform='translate(0,94)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Saturno</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Saturn'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>10°28'50'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Ari'/></g> </g> <g transform='translate(0,108)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Urano</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Uranus'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>7°58'29'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Aqu'/></g> </g> <g transform='translate(0,122)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Netuno</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Neptune'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>29°42'30'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Cap'/></g> </g> <g transform='translate(0,136)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Plutão</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Pluto'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>5°26'20'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Sag'/></g><g transform='translate(74,-6)'> <use transform='scale(.5)' xlink:href='#retrograde'/></g> </g> <g transform='translate(0,150)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Nodo N. (M)</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Mean_Node'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>28°14'53'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Vir'/></g><g transform='translate(74,-6)'> <use transform='scale(.5)' xlink:href='#retrograde'/></g> </g> <g transform='translate(0,164)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Quíron</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Chiron'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>0°12'41'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Sco'/></g><g transform='translate(74,-6)'> <use transform='scale(.5)' xlink:href='#retrograde'/></g> </g> <g transform='translate(0,178)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Asc</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#First_House'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>11°30'03'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Vir'/></g> </g> <g transform='translate(0,192)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Mc</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Tenth_House'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>15°25'18'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Gem'/></g> </g> <g transform='translate(0,206)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Lilith</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Mean_Lilith'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>1°30'59'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Vir'/></g> </g> <g transform='translate(0,220)'><text fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Nodo S. (M)</text><g transform='translate(5,-8)'> <use transform='scale(.4)' xlink:href='#Mean_South_Node'/></g><text x='19' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>28°14'53'</text><g transform='translate(60,-8)'> <use transform='scale(.3)' xlink:href='#Pis'/></g><g transform='translate(74,-6)'> <use transform='scale(.5)' xlink:href='#retrograde'/></g> </g></g><!-- Houses Grid --><g kr:node='Houses_Grid'> <g transform='translate(650,-20)'><g transform='translate(0,10)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   1:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Vir'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>11°30'03'</text></g><g transform='translate(0,24)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   2:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Lib'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>16°10'12'</text></g><g transform='translate(0,38)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   3:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Sco'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>17°38'09'</text></g><g transform='translate(0,52)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   4:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Sag'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>15°25'18'</text></g><g transform='translate(0,66)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   5:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Cap'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>11°46'30'</text></g><g transform='translate(0,80)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   6:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Aqu'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>9°38'37'</text></g><g transform='translate(0,94)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   7:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Pis'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>11°30'03'</text></g><g transform='translate(0,108)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   8:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Ari'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>16°10'12'</text></g><g transform='translate(0,122)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa   9:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Tau'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>17°38'09'</text></g><g transform='translate(0,136)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa 10:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Gem'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>15°25'18'</text></g><g transform='translate(0,150)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa 11:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Can'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>11°46'30'</text></g><g transform='translate(0,164)'> <text x='40' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px' text-anchor='end'>Casa 12:</text> <g transform='translate(40,-8)'><use transform='scale(.3)' xlink:href='#Leo'/> </g> <text x='53' fill='var(--kerykeion-chart-color-paper-0)' font-size='10px'>9°38'37'</text></g> </g></g> </g></g> </g> <!-- Symbols Definitions --> <defs><!-- Planets (24x24) --><symbol id='Sun'> <g transform='translate(1,4)'><circle cx='10' cy='10' r='9' fill='none' stroke='var(--kerykeion-chart-color-sun)' stroke-width='2px'/><circle cx='10' cy='10' r='2' fill='var(--kerykeion-chart-color-sun)'/> </g></symbol><symbol id='Moon'> <g transform='translate(4,3)'><g transform='scale(.8)'> <path d='m3.6639 1.0309c-0.91407 0.03478-1.7918 0.18307-2.6354 0.42853 4.5445 1.3406 7.8635 5.5648 7.8635 10.542 0 4.977-3.319 9.2012-7.8635 10.542 0.97346 0.28322 1.9995 0.42853 3.064 0.42853 6.0556 0 10.97-4.9147 10.97-10.97 0-6.0556-4.9147-10.97-10.97-10.97-0.14193 0-0.2879-0.00536-0.42853 0z' fill='none' stroke='var(--kerykeion-chart-color-moon)' stroke-width='2px'/></g> </g></symbol><symbol id='Mercury'> <g transform='translate(3,1)'><path d='m12.418 11.098c0.04291 2.5074-1.7497 4.8991-4.1612 5.5791-2.1386 0.64588-4.6158-0.06477-6.0576-1.7796-1.4966-1.7111-1.852-4.3229-0.82031-6.3564 0.95212-1.9628 3.0661-3.3016 5.2557-3.2605 2.1092 6.372e-4 4.1628 1.2383 5.1212 3.1212 0.43307 0.82793 0.66628 1.7611 0.66227 2.6961zm-0.88036-10.303c-0.16954 2.1584-1.9447 4.0546-4.0847 4.3763-1.9594 0.33472-4.0894-0.62166-5.057-2.3765-0.351-0.61278-0.56824-1.3016-0.63313-2.0047m4.8413 16.101v6.3195m-2.6331-2.6331h5.2663' fill='none' stroke='var(--kerykeion-chart-color-mercury)' stroke-width='2px'/> </g></symbol><symbol id='Venus'> <g transform='translate(0,2)'><g transform='scale(.9)'> <path d='m18.401 7.3667c0.023257 2.2988-1.2306 4.5478-3.1817 5.747-2.0565 1.3135-4.8291 1.363-6.9318 0.12598-2.0136-1.1392-3.3535-3.3757-3.3892-5.6982-0.08063-2.2736 1.0875-4.5325 2.9749-5.7884 2.0075-1.388 4.776-1.5365 6.922-0.37776 2.0749 1.0762 3.5014 3.2979 3.5971 5.6431 0.005863 0.11602 0.008785 0.2322 0.008785 0.34838zm-6.7524 6.7699v8.6162m-3.6832-3.6927h7.3663' fill='none' stroke='var(--kerykeion-chart-color-venus)' stroke-width='2px'/></g> </g></symbol><symbol id='Mars'> <g transform='translate(1,3)'><g transform='scale(.9)'> <path d='m19.837 1.2269c-2.4124 2.399-4.8248 4.798-7.2372 7.1971m0.98654-7.1206h6.1665c0 2.0441 8e-6 4.0882 8e-6 6.1323' fill='none' stroke='var(--kerykeion-chart-color-mars)' stroke-width='2px'/> <path d='m15.209 13.138c0.036952 2.7506-1.7113 5.4057-4.2398 6.48-2.5106 1.1313-5.6535 0.59868-7.6454-1.3049-1.9942-1.8102-2.769-4.8082-1.9103-7.3595 0.83521-2.67 3.3871-4.6873 6.1819-4.8649 2.6918-0.24163 5.4271 1.2347 6.7186 3.6054 0.5873 1.0462 0.89722 2.2444 0.89498 3.4439z' fill='none' stroke='var(--kerykeion-chart-color-mars)' stroke-width='2px'/></g> </g></symbol><symbol id='Jupiter'> <g transform='translate(1,3)'><g transform='scale(.9)'> <path d='m16.903 0.99849v22.003m3.6273-5.6418h-17.532m1.8136-8.4627c-0.60454 0-1.8136-0.56418-1.8136-2.8209 0-2.2567 2.4182-4.5134 4.8364-4.5134 2.4182 0 4.8363 1.6925 4.8363 5.6418s-3.0227 10.155-9.0682 10.155' fill='none' stroke='var(--kerykeion-chart-color-jupiter)' stroke-width='2px'/></g> </g></symbol><symbol id='Saturn'> <g transform='translate(1,2)'><path d='m8.3844 0.90203v17.397m-2.9495-14.547h7.2338m4.1551 18.147c-0.60282 0.59989-1.2056 1.1998-1.8085 1.1998-0.60281 0-1.8084-0.59989-1.8084-1.7997s0.60281-2.3996 1.8084-3.5993c1.2056-1.1998 2.4113-3.5993 2.4113-5.9989 0-2.3996-1.2056-4.7991-3.6169-4.7991-2.2806 0-4.2197 1.1998-5.4254 3.5993' fill='none' stroke='var(--kerykeion-chart-color-saturn)' stroke-width='2px'/> </g></symbol><symbol id='Uranus'> <g transform='translate(2,4)'><g transform='scale(.8)'> <path d='m4.6772 16.097h-4.4189c0.063544-0.20254-0.13835-0.61233 0.12146-0.66164 0.80121-0.2003 1.6024-0.4006 2.4036-0.60091v-12.625c-0.84169-0.21042-1.6834-0.42085-2.5251-0.63127 0.065501-0.18665-0.1426-0.64691 0.12519-0.63127h4.2937v15.151z' fill='var(--kerykeion-chart-color-jupiter)' stroke='var(--kerykeion-chart-color-uranus)' stroke-width='1px'/> <path d='m18.565 16.097h4.4189c-0.063538-0.20254 0.13835-0.61233-0.12145-0.66164-0.80121-0.2003-1.6024-0.4006-2.4036-0.60091v-12.625c0.8417-0.21042 1.6834-0.42085 2.5251-0.63127-0.065494-0.18665 0.14261-0.64691-0.12519-0.63127h-4.2937v15.151z' fill='var(--kerykeion-chart-color-jupiter)' stroke='var(--kerykeion-chart-color-uranus)' stroke-width='1px'/> <path d='m4.0459 8.5222h15.151m-7.5753-7.5753v16.413m2.525 3.1564c0.081712 1.6848-1.8706 3.034-3.4206 2.3667-1.5861-0.53433-2.1736-2.7933-1.0222-4.0222 1.0206-1.2527 3.256-1.1144 4.0572 0.31394 0.25061 0.39929 0.38745 0.86984 0.38551 1.3415z' fill='none' stroke='var(--kerykeion-chart-color-uranus)' stroke-width='2px'/></g> </g></symbol><symbol id='Neptune'> <g transform='translate(2,4)'><g transform='scale(.9)'> <path d='m3.8863 2.2098c-1.6135 10.963 1.0757 12.607 6.454 12.607 5.3783 0 8.0675-1.6444 6.454-12.607m-6.454 1.0963v20.281m-4.3026-4.385h8.6053m-13.731-15.479 3.0518-2.3127 2.2693 3.1102m1.367 1.8216 2.6592-2.7708 2.7188 2.7101m1.4301-1.5694 2.3081-3.0804 3.0226 2.3523' fill='none' stroke='var(--kerykeion-chart-color-neptune)' stroke-width='2px'/></g> </g></symbol><symbol id='Pluto'> <g transform='translate(0,3)'><g transform='scale(.9)'> <path d='m7.2988 18.17h9.8715m-4.9357 4.9357v-10.488m4.3187-7.4036c0 2.384-1.9348 4.3188-4.3188 4.3188-2.384 0-4.3188-1.9348-4.3188-4.3188 0-2.384 1.9348-4.3188 4.3188-4.3188 2.384 0 4.3188 1.9348 4.3188 4.3188zm3.0848 0c0 4.0868-3.3168 7.4036-7.4036 7.4036-4.0868 0-7.4036-3.3168-7.4036-7.4036' fill='none' stroke='var(--kerykeion-chart-color-pluto)' stroke-width='2px'/></g> </g></symbol><symbol id='Mean_Node'> <g transform='translate(0,3)'><path d='m8.8096 0.075667c-2.3939 0.58557-4.4328 2.455-5.1461 4.8251-0.60986 1.7802 0.023403 3.7231 0.92443 5.2857 0.5445 0.93818 1.3737 1.7225 1.6028 2.8215 0.40099 1.4766 0.29799 3.3796-1.0184 4.3747-0.83938 0.67084-2.0948 0.072458-2.3524-0.90138-0.42836-1.3804 0.50318-3.0847 1.9593-3.3174 0.73645 0.28468 0.9569-0.15548 0.20872-0.4247-1.5113-0.75834-3.7449 0.10059-3.9529 1.8963-0.26069 1.6632 0.91774 3.3564 2.5544 3.7221 1.8381 0.63671 4.0766-0.38892 4.7083-2.2473 0.5592-1.3936 0.24864-2.924-0.26892-4.2775-0.5587-1.6258-1.7736-2.9617-2.0991-4.6801-0.43845-1.6596-0.042356-3.579 1.3031-4.7199 1.5059-1.4193 4.086-1.677 5.6869-0.26995 1.9714 1.5142 2.3752 4.4064 1.4104 6.6044-0.41975 1.1522-1.1759 2.1355-1.7144 3.2241-0.57783 1.557-0.53528 3.3735 0.16158 4.8839 1.2995 2.2358 5.1259 2.0699 6.2646-0.24646 0.71516-1.3675 0.26474-3.3838-1.2762-3.9568-1.0076-0.46094-2.3038-0.22895-3.0365 0.61811 0.95048-0.013861 2.2509-0.02726 2.6141 1.0742 0.55976 1.1285 0.42618 2.9418-0.92855 3.4177-1.1965 0.34894-2.2646-0.87895-2.3228-2.0002-0.31007-1.6803 0.048162-3.5114 1.183-4.8236 1.2447-1.4632 1.9813-3.434 1.5923-5.3586-0.50344-3.0338-3.2625-5.5337-6.3602-5.6042-0.56624-0.011076-1.135 0.014103-1.6977 0.080422z' fill='var(--kerykeion-chart-color-mean-node)'/> </g></symbol><symbol id='Mean_South_Node'> <g transform='translate(2,5)'><g transform='scale(.75)'> <path d='m13.891 23.899c2.9396-0.73748 5.5373-2.9412 6.5018-5.8473 0.6272-1.3965 0.59762-3.0102 0.14016-4.4512-0.41914-1.7656-1.4255-3.3158-2.5287-4.7275-0.99428-1.7079-1.3091-3.8763-0.62636-5.7539 0.38036-0.98435 1.2342-1.9902 2.3694-1.997 1.1091 0.030064 1.9405 1.0718 2.0154 2.1281 0.14928 1.5179-0.79299 3.1759-2.2912 3.6211-0.40386 0.29034-1.2201-0.26535-1.3866 0.10749 1.2057 1.1645 3.2096 1.1115 4.554 0.2145 1.1766-0.77911 1.6056-2.3579 1.2269-3.6796-0.28645-1.5618-1.5669-2.8256-3.0816-3.2337-1.4462-0.49329-3.1483-0.3543-4.3947 0.57205-1.5742 0.91981-2.2422 2.8398-2.2266 4.5848-0.005005 1.0476 0.35818 2.0486 0.666 3.0366 0.3783 1.1115 0.91396 2.1618 1.5445 3.1498 1.0177 1.8215 1.7244 3.9548 1.364 6.0577-0.47297 2.623-2.9656 4.6864-5.623 4.7105-1.893 0.17871-3.6522-0.98262-4.7505-2.4445-1.384-1.9223-1.6008-4.5238-0.82334-6.7295 0.50401-1.5342 1.3632-2.9143 2.2144-4.2732 0.61218-1.2272 0.79023-2.6392 0.69686-3.9944-0.12465-1.3671-0.39637-2.8942-1.5255-3.8089-2.0094-1.5968-5.3385-1.3572-6.9144 0.73799-1.1191 1.485-1.0892 3.8533 0.33186 5.1354 0.91893 0.75805 2.2084 1.103 3.3643 0.73902 0.58199-0.17096 1.1223-0.49854 1.5208-0.95849-1.0215-0.034352-2.2479 0.092476-3.0098-0.73462-0.76061-1.0959-1.0293-2.6071-0.49152-3.8567 0.38268-0.90311 1.4331-1.563 2.412-1.22 1.107 0.35358 1.8155 1.4621 1.914 2.5862 0.32704 1.9229 0.0777 4.0243-1.0918 5.6345-0.75945 1.0928-1.6748 2.1112-2.1058 3.3946-1.0644 2.6414-0.42628 5.7688 1.3141 7.973 1.6583 2.277 4.5079 3.5831 7.3127 3.4253 0.47079-0.007557 0.94098-0.042008 1.4084-0.097897z' fill='var(--kerykeion-chart-color-mean-node)'/></g> </g></symbol><symbol id='Chiron'> <path d='m10.02 13.069 0.16567-12.259m0.010049 5.9348 5.3014-4.473m-5.2822 4.3609 5.3014 4.473m1.6767 6.8936c0 2.8658-2.3259 5.1917-5.1917 5.1917-2.8658 0-5.1917-2.3259-5.1917-5.1917 0-2.8658 2.3259-5.1917 5.1917-5.1917 2.8658 0 5.1917 2.3259 5.1917 5.1917z' fill='none' stroke='var(--kerykeion-chart-color-fourth-house)' stroke-width='2px'/></symbol><symbol id='Mean_Lilith'> <g transform='translate(1,2)'><path d='m5.2255 0.50018c-0.69363 0.026392-1.3517 0.14573-1.9919 0.33199 3.4485 1.0173 5.9758 4.2148 5.9758 7.9915 2e-7 3.7767-2.5273 6.9742-5.9758 7.9915 0.7387 0.21492 1.5162 0.33199 2.3239 0.33199 0.85351 0 1.6671-0.14045 2.4425-0.37942v3.0353h-3.5096v1.8259h3.5096v2.1105h1.7785v-2.1105h3.6519v-1.8259h-3.6519v-3.8179c2.448-1.45 4.1025-4.112 4.1025-7.1615 0-4.5952-3.7283-8.3235-8.3235-8.3235-0.1077 0-0.22528-0.0040674-0.33199 0z' fill='var(--kerykeion-chart-color-fourth-house)'/> </g></symbol><symbol id='First_House'> <text y='20' fill='var(--kerykeion-chart-color-chiron)' font-size='22px'>As</text></symbol><symbol id='Tenth_House'> <text y='20' fill='var(--kerykeion-chart-color-first-house)' font-size='20px'>Mc</text></symbol><!-- Zodiac --><symbol id='Ari'> <path d='m14.834 31c-0.00135-1.2718 0.0124-2.5442-0.05319-3.8148-0.13942-2.9548-0.50842-5.8954-1.0187-8.8076-0.43967-2.4585-0.97387-4.9078-1.7711-7.2768-0.46025-1.3383-0.99763-2.6516-1.6334-3.9158-0.58068-1.1309-1.2427-2.2419-2.1411-3.15-0.58776-0.58844-1.3153-1.0896-2.151-1.2187-0.74125-0.11482-1.5345 0.05947-2.1293 0.5276-0.72204 0.56135-1.1703 1.4124-1.3919 2.289-0.23846 0.96706-0.24786 1.9807-0.11462 2.9644 0.21723 1.5586 0.83975 3.0353 1.6523 4.3718h-2.3673c-0.817-1.4843-1.4562-3.0961-1.654-4.7901-0.13146-1.172-0.05654-2.38 0.31124-3.5048 0.39293-1.1992 1.1481-2.281 2.1518-3.0438 0.75771-0.57562 1.6827-0.91772 2.6287-0.99259 1.0419-0.09285 2.1091 0.10838 3.039 0.59195 1.2089 0.62045 2.1728 1.6297 2.9544 2.7279 1.0451 1.4838 1.8198 3.1434 2.439 4.8462 1.0465 2.9138 1.6283 5.9748 1.9909 9.0441 0.08969 0.76853 0.16441 1.5388 0.2263 2.3101h0.39649c0.23358-3.3747 0.72113-6.7504 1.7223-9.9877 0.61651-1.9714 1.423-3.897 2.5399-5.6382 0.77286-1.1896 1.7183-2.3052 2.9331-3.0574 0.91071-0.56873 1.9822-0.88158 3.0566-0.85729 0.95624 0.00906 1.9165 0.2667 2.7236 0.78827 0.74489 0.47846 1.3633 1.1425 1.8339 1.8912 0.63307 1.0129 0.93548 2.2067 0.98322 3.3946 0.07384 1.5575-0.29022 3.1069-0.87239 4.5426-0.24008 0.59365-0.51739 1.1718-0.82134 1.735h-2.379c0.77781-1.4008 1.4131-2.9086 1.6479-4.5042 0.13968-0.97432 0.12422-1.9775-0.09602-2.9387-0.20315-0.8532-0.59878-1.6926-1.2685-2.2754-0.48289-0.42816-1.1228-0.66058-1.7651-0.66633-0.75591-0.02387-1.4861 0.28857-2.0779 0.74433-0.86378 0.66428-1.5134 1.5632-2.0754 2.488-0.8312 1.3939-1.4715 2.8934-2.0326 4.4144-0.81281 2.2668-1.3571 4.6204-1.8101 6.9831-0.60127 3.1889-1.0271 6.4148-1.1942 9.6572-0.06234 1.1471-0.07217 2.296-0.06862 3.4444v0.68405h-2.344z' fill='var(--kerykeion-chart-color-zodiac-icon-0)'/></symbol><symbol id='Tau'> <path d='m11.211 11.96c-1.2255-0.47796-2.3838-1.2028-3.2117-2.2374-1.0454-1.2737-1.7875-2.7531-2.5926-4.1804-0.49149-0.89866-1.048-1.7818-1.8066-2.4821-0.51253-0.47706-1.1303-0.86239-1.8211-1.0139-0.32765-0.079873-0.66636-0.082811-1.0016-0.076898-0.10007 0.01316-0.17923 0.0054392-0.14388-0.11649v-1.7474c0.54324 0.0063884 1.0873-0.015241 1.6299 0.016299 1.0858 0.090386 2.1029 0.59417 2.9282 1.2881 1.073 0.89158 1.8971 2.0397 2.5994 3.2339 0.50014 0.86104 0.98101 1.7331 1.4832 2.593 0.4845 0.80975 1.0333 1.5882 1.6972 2.2624 0.58718 0.5957 1.29 1.088 2.0814 1.3721 1.098 0.40522 2.2861 0.48842 3.4473 0.4435 1.043-0.051965 2.1018-0.24502 3.0295-0.74289 0.87154-0.45708 1.574-1.1747 2.1702-1.945 0.68505-0.88557 1.2069-1.879 1.7727-2.8409 0.5006-0.85376 0.97282-1.7273 1.5596-2.527 0.67958-0.93412 1.4843-1.8031 2.4755-2.4129 0.7587-0.46275 1.6386-0.74944 2.5331-0.73933 0.40959-0.0045996 0.81924 0.0012777 1.2288-0.0012594v1.8639c-0.43313-0.0032125-0.87431-0.010952-1.2936 0.11473-0.85613 0.23462-1.5756 0.80851-2.1491 1.4677-0.59091 0.67182-1.0387 1.4511-1.4653 2.2326-0.73856 1.3167-1.4355 2.67-2.3867 3.8514-0.38139 0.47956-0.82283 0.91209-1.3224 1.2686-0.6027 0.43693-1.2691 0.78098-1.9603 1.0557 1.6568 0.90521 3.1361 2.1626 4.2041 3.724 0.90016 1.3021 1.498 2.8151 1.6966 4.3861 0.19369 1.4821 0.086505 3.0077-0.34655 4.4401-0.45227 1.4808-1.27 2.8393-2.3204 3.9748-1.2603 1.3811-2.84 2.4997-4.6247 3.0919-1.749 0.58048-3.6484 0.66968-5.4552 0.32582-1.6259-0.31827-3.1603-1.0569-4.4452-2.0971-1.1007-0.88232-2.0654-1.9438-2.7941-3.1527-0.76527-1.2777-1.2361-2.7295-1.3589-4.2132-0.16549-1.8431 0.14614-3.7383 0.96842-5.4025 0.90037-1.8458 2.3481-3.4022 4.0673-4.5196 0.30175-0.19782 0.61146-0.3835 0.92758-0.55752zm4.7468 17.645c1.5118 0.008633 3.0378-0.37724 4.3201-1.1872 1.0045-0.62867 1.8757-1.4656 2.56-2.4304 0.75847-1.0862 1.2186-2.375 1.3222-3.6945 0.13961-1.5999-0.15092-3.2564-0.94694-4.6624-0.57792-1.0329-1.3895-1.9288-2.3308-2.6446-0.92448-0.70051-2.008-1.1897-3.1475-1.4133-1.1742-0.23361-2.3952-0.22737-3.5694 0.003158-1.2834 0.26041-2.4946 0.85193-3.4942 1.6951-1.2338 1.0237-2.2021 2.3928-2.6419 3.9406-0.3762 1.3119-0.41602 2.715-0.14512 4.0508 0.26671 1.2697 0.87705 2.4612 1.7366 3.4333 0.88144 1.0101 1.9766 1.8545 3.2332 2.3439 0.984 0.39338 2.0463 0.56679 3.1038 0.5655z' fill='var(--kerykeion-chart-color-zodiac-icon-1)'/></symbol><symbol id='Gem'> <path d='m0.56549 32v-2.3573c2.402-0.63159 4.8369-1.1565 7.3043-1.4539v-24.42c-2.4722-0.2299-4.9197-0.70722-7.3043-1.3974v-2.3714c3.5646 0.98094 7.2529 1.4363 10.937 1.6429 3.1966 0.16869 6.4029 0.16418 9.5988-0.018794 3.5756-0.21588 7.1531-0.67151 10.613-1.6241v2.3714c-2.3899 0.68794-4.8416 1.1673-7.3184 1.3974v24.42c2.472 0.29791 4.9111 0.82437 7.3184 1.4539v2.3573c-5.6427-1.4871-11.508-2.0061-17.331-1.8707-4.6551 0.11092-9.3111 0.6795-13.818 1.8707zm10.139-3.9806c2.2804-0.25404 4.5792-0.29663 6.8715-0.2526 1.3313 0.030104 2.6626 0.10326 3.9862 0.2526v-24.053c-2.3725 0.1546-4.7517 0.17283-7.1282 0.14289-1.244-0.019281-2.488-0.059159-3.7295-0.14289v24.053z' fill='var(--kerykeion-chart-color-zodiac-icon-2)'/></symbol><symbol id='Can'> <path d='m0 25.629v-2.7214c5.248 2.3968 10.333 3.5827 15.232 3.5827 3.2112 0 5.8227-0.41195 7.8344-1.2483-1.2745-0.64914-2.2366-1.473-2.8739-2.4592-0.63725-0.98619-0.96212-2.1471-0.96212-3.4829 0-1.7477 0.63725-3.2457 1.8993-4.5065 1.2495-1.2483 2.7739-1.8725 4.5232-1.8725 1.7493 0 3.2362 0.62417 4.4857 1.86 1.237 1.2483 1.8618 2.7339 1.8618 4.494 0 2.7838-1.6993 5.1057-5.1105 6.9533-3.4112 1.8475-7.6845 2.7713-12.82 2.7713-4.4483 0-9.1339-1.111-14.07-3.3705zm20.917-6.3166c0 1.2733 0.46232 2.3718 1.3995 3.2956 0.92464 0.92377 2.0492 1.3857 3.3362 1.3857 1.2995 0 2.3991-0.46189 3.3112-1.3482 0.89965-0.8988 1.3495-1.9973 1.3495-3.2956 0-1.3232-0.44982-2.4467-1.362-3.3705-0.91214-0.92377-2.0117-1.3857-3.3112-1.3857-1.312 0-2.4241 0.46189-3.3487 1.3857-0.91214 0.91129-1.3745 2.0223-1.3745 3.3331zm11.083-11.997v2.7214c-5.2604-2.3968-10.333-3.5952-15.244-3.5952-3.1988 0-5.8227 0.41195-7.8469 1.2608 1.2995 0.64914 2.2616 1.473 2.8864 2.4592 0.64975 0.98619 0.96212 2.1471 0.96212 3.4829 0 1.7477-0.62476 3.2457-1.8868 4.5065-1.262 1.2483-2.7739 1.8725-4.5357 1.8725-1.7493 0-3.2362-0.61169-4.4733-1.86-1.237-1.2359-1.8618-2.7339-1.8618-4.4815 0-2.7963 1.6993-5.1307 5.1105-6.9782 3.3987-1.8475 7.6845-2.7713 12.82-2.7713 4.4483 0 9.1339 1.1235 14.07 3.383zm-20.917 6.3166c0-1.2858-0.46232-2.3843-1.3995-3.3081-0.93713-0.91129-2.0617-1.3732-3.3612-1.3732-1.2995 0-2.3991 0.4494-3.2987 1.3482-0.89965 0.8988-1.3495 1.9973-1.3495 3.2956 0 1.3232 0.46232 2.4467 1.3745 3.3705 0.89965 0.92377 2.0117 1.3857 3.3112 1.3857 1.2995 0 2.4241-0.46189 3.3362-1.3857 0.92464-0.92377 1.387-2.0348 1.387-3.3331z' fill='var(--kerykeion-chart-color-zodiac-icon-3)'/></symbol><symbol id='Leo'> <path d='m28.021 29.481c-0.64303 0.58913-1.3334 1.1316-2.0878 1.5715-0.62921 0.36634-1.3062 0.65973-2.0186 0.81811-0.42722 0.095528-0.86604 0.13979-1.3037 0.12753-0.61519-0.013841-1.2309-0.12054-1.8064-0.34157-0.53145-0.20264-1.0245-0.50252-1.4545-0.8744-0.33452-0.28826-0.63245-0.61927-0.88269-0.98318-0.30898-0.44921-0.53798-0.95311-0.67304-1.4814-0.15878-0.61661-0.19337-1.2612-0.13583-1.8941 0.057589-0.63953 0.18912-1.2701 0.34955-1.891 0.24846-0.95174 0.56942-1.883 0.92004-2.8015 0.51647-1.3472 1.1017-2.6669 1.7165-3.9717 0.49223-1.049 0.98447-2.0981 1.4767-3.1471 0.44156-0.94681 0.84407-1.9136 1.1644-2.9086 0.22805-0.71272 0.4152-1.4409 0.51513-2.1834 0.051015-0.37945 0.076406-0.76264 0.06813-1.1456-0.012412-0.78755-0.11876-1.5779-0.36401-2.3281-0.20424-0.62776-0.50874-1.2239-0.9079-1.7502-0.22629-0.29895-0.48152-0.57579-0.75827-0.82861-0.45975-0.41878-0.99052-0.75929-1.5633-1.0015-0.65262-0.27759-1.3545-0.42862-2.0602-0.48252-0.50663-0.037909-1.0169-0.033039-1.5222 0.020808-0.67494 0.072255-1.3426 0.24047-1.9592 0.527-0.55707 0.25755-1.0691 0.61109-1.5099 1.038-0.42878 0.42579-0.78886 0.92189-1.0516 1.4665-0.28262 0.58227-0.45308 1.2154-0.52877 1.8572-0.08193 0.69133-0.061127 1.3926 0.036586 2.0812 0.12555 0.88746 0.36844 1.7548 0.6735 2.5964 0.24476 0.67415 0.53147 1.3324 0.84436 1.9776 0.21157 0.43941 0.42351 0.87865 0.63477 1.3182 0.34732 0.72952 0.67469 1.4696 0.94857 2.2302 0.1729 0.48424 0.326 0.97723 0.42292 1.4828 0.055951 0.29494 0.091241 0.59502 0.083837 0.89563-0.00897 0.64497-0.12444 1.2895-0.35218 1.8935-0.23376 0.62438-0.58492 1.2018-1.0137 1.7112-0.32645 0.38704-0.69317 0.74058-1.0946 1.0493-0.52752 0.40565-1.121 0.72727-1.7537 0.93504-0.6463 0.21387-1.3294 0.30815-2.0093 0.29973-0.68908-0.006898-1.3795-0.11618-2.0295-0.34821-0.61334-0.21742-1.1866-0.54385-1.6927-0.95242-0.29894-0.2408-0.57516-0.50924-0.83055-0.79563-0.4368-0.49185-0.79818-1.0526-1.0507-1.6607-0.25787-0.61689-0.40221-1.2786-0.44586-1.945-0.046491-0.70637 0.007391-1.4224 0.19192-2.1071 0.16501-0.61751 0.43703-1.2055 0.79643-1.7338 0.2986-0.441 0.65658-0.83982 1.0485-1.1996 0.48953-0.44781 1.0488-0.82254 1.6596-1.0836 0.58989-0.25376 1.2246-0.39891 1.865-0.43992 0.32-0.021032 0.64182-0.018276 0.96093 0.014627 0.48023 0.048488 0.95332 0.15514 1.4138 0.29848-0.4752-0.91759-0.89493-1.8668-1.2061-2.8532-0.25417-0.80883-0.43485-1.6448-0.48358-2.4927-0.025937-0.46184-0.011625-0.92584 0.039024-1.3856 0.084985-0.76614 0.28561-1.5212 0.61149-2.2206 0.32079-0.69236 0.76242-1.3263 1.287-1.8795 0.65175-0.68661 1.4199-1.2648 2.2682-1.6863 0.76957-0.38393 1.6016-0.63687 2.4504-0.76995 0.82607-0.13032 1.6671-0.15007 2.5006-0.0937 0.95032 0.065981 1.8965 0.2502 2.7874 0.59199 0.76492 0.2922 1.4853 0.70243 2.1221 1.2177 0.29263 0.23628 0.56886 0.49313 0.82208 0.77137 0.53484 0.58291 0.97697 1.2508 1.3027 1.9719 0.36464 0.80344 0.58515 1.668 0.68752 2.5431 0.060739 0.51179 0.08013 1.0278 0.071731 1.5429-0.010725 0.73863-0.065427 1.4785-0.2014 2.2053-0.053162 0.28449-0.12051 0.56632-0.2025 0.84389-0.12037 0.42038-0.27159 0.83116-0.42934 1.2387-0.30125 0.77159-0.63345 1.5306-0.9733 2.2859-0.1573 0.34974-0.3183 0.6978-0.47895 1.046-0.35303 0.77074-0.70606 1.5415-1.0591 2.3122-0.58906 1.2797-1.1616 2.5675-1.6858 3.8754-0.30638 0.76852-0.59827 1.5437-0.84242 2.3345-0.13429 0.44042-0.25626 0.88593-0.33178 1.3406-0.037679 0.22962-0.06134 0.4624-0.053634 0.69532 0.009646 0.42888 0.083586 0.85962 0.24829 1.2571 0.13306 0.32354 0.32669 0.62167 0.56664 0.8761 0.23796 0.26498 0.52732 0.48521 0.85141 0.63402 0.34604 0.16043 0.72666 0.23835 1.1069 0.25035 0.3636 0.013917 0.72763-0.041235 1.0761-0.1434 0.50696-0.14857 0.98273-0.38861 1.4293-0.6683 0.5018-0.31551 0.96902-0.68326 1.4127-1.0756 0.45861 0.50146 0.91721 1.0029 1.3758 1.5044zm-23.272-10.274c-6.133e-4 0.54828 0.084627 1.0991 0.27548 1.6141 0.17767 0.48342 0.44806 0.93123 0.78554 1.3197 0.24463 0.28283 0.5247 0.53514 0.83178 0.74854 0.3982 0.27675 0.84688 0.48062 1.3177 0.59689 0.46352 0.11507 0.94547 0.14941 1.4214 0.11748 0.48619-0.033256 0.96785-0.149 1.4114-0.35221 0.46699-0.21233 0.88803-0.51845 1.2511-0.87962 0.37237-0.36837 0.68619-0.79856 0.90578-1.275 0.21698-0.46729 0.34099-0.97553 0.3789-1.4888 0.031045-0.42759 0.011379-0.85961-0.066982-1.2813-0.09155-0.4942-0.27044-0.97254-0.53067-1.4028-0.18371-0.30464-0.40558-0.58589-0.65561-0.83874-0.3673-0.36436-0.79418-0.67162-1.2667-0.88438-0.45424-0.20612-0.9471-0.32242-1.4442-0.35579-0.54488-0.036883-1.0987 0.013585-1.6209 0.17768-0.46283 0.14405-0.89627 0.37738-1.2779 0.67558-0.40639 0.31712-0.76126 0.70096-1.0416 1.1338-0.27037 0.41721-0.46422 0.88361-0.56956 1.3695-0.072168 0.32984-0.10501 0.66778-0.10494 1.0053z' fill='var(--kerykeion-chart-color-zodiac-icon-4)'/></symbol><symbol id='Vir'> <path d='m7.1633 9.7488v15.603h-2.4967v-18.071c7.5e-4 -1.1748-0.15281-2.3517-0.48086-3.4807-0.31386-1.0859-0.78884-2.1241-1.3963-3.0774-0.054614-0.08803-0.11879-0.17984-0.17029-0.26358h2.6313c0.5478 0.75105 0.96358 1.592 1.2772 2.4651 0.28658 0.79808 0.49012 1.6242 0.63569 2.4589 0.44386-1.087 0.96008-2.1474 1.5879-3.1411 0.39826-0.62938 0.84214-1.2314 1.3436-1.7829 0.81567-0.15297 1.6313-0.30594 2.447-0.45891 0.57369 0.73762 1.0151 1.5721 1.3444 2.4447 0.38547 1.0214 0.62303 2.0936 0.76538 3.1743 0.004871 0.03708 0.009629 0.074174 0.014274 0.11128 0.37311-1.1754 0.92478-2.2898 1.5923-3.3255 0.43851-0.68064 0.92688-1.3287 1.4509-1.9459 0.80325-0.15297 1.6065-0.30594 2.4097-0.45891 0.6078 0.83946 1.1041 1.7618 1.4465 2.7404 0.33292 0.94679 0.51981 1.9432 0.56591 2.9452 0.012451 0.24143 0.012539 0.48318 0.012287 0.72484v4.5415c0.3379-0.95391 0.71555-1.8953 1.1662-2.8021 0.28668-0.57452 0.60267-1.1359 0.97026-1.663 0.68732-0.2522 1.3746-0.50439 2.0619-0.75659 0.80458 1.2404 1.4649 2.5779 1.9206 3.9852 0.41657 1.2817 0.66056 2.6192 0.72143 3.9654 0.066117 1.4711-0.070109 2.9532-0.42762 4.3826-0.39661 1.5914-1.065 3.1123-1.9475 4.4942-0.81215 1.274-1.7968 2.4329-2.8797 3.485-0.35284 0.34282-0.71638 0.67461-1.0888 0.99614 0.090608 0.66447 0.30651 1.3065 0.58548 1.9146 0.34731 0.75421 0.79091 1.4606 1.2778 2.1321 0.2266 0.31192 0.46344 0.61636 0.7079 0.91451h-2.9314c-0.46436-0.58678-0.84771-1.2337-1.1797-1.9029-0.2666-0.53862-0.49959-1.0934-0.70831-1.6568-0.99561 0.56433-2.0686 0.98352-3.1672 1.2998-0.83982 0.24148-1.6962 0.42326-2.559 0.56065v-2.1333c1.1467-0.23356 2.2808-0.54201 3.3708-0.97021 0.64491-0.25387 1.2739-0.55045 1.871-0.90266-0.17686-1.095-0.26437-2.2043-0.26085-3.3134-1.1e-5 -5.0323 2.1e-5 -10.065-1.6e-5 -15.097-0.001784-0.93408-0.049709-1.8702-0.19106-2.7943-0.10716-0.69174-0.26672-1.3787-0.52475-2.0309-0.10085-0.254-0.21713-0.50212-0.35241-0.73972-0.83954 0.90308-1.5306 1.9365-2.0988 3.0282-0.65528 1.2599-1.1521 2.5972-1.5423 3.9608-0.096864 0.34006-0.18831 0.68188-0.27158 1.0254v15.018h-2.5091c-1.1e-5 -5.5438 2.2e-5 -11.088-1.7e-5 -16.631-0.001789-1.0245-0.04059-2.0503-0.15913-3.0685-0.081362-0.68545-0.19756-1.3689-0.39091-2.0325-0.13297-0.45102-0.30157-0.89504-0.54302-1.3001-0.96219 1.1187-1.7714 2.3649-2.4319 3.6828-0.6025 1.2008-1.0841 2.4602-1.4684 3.7466zm14.98 14.958c0.93277-0.9465 1.7664-1.9944 2.4442-3.1381 0.32715-0.55218 0.61923-1.1254 0.86857-1.7168 0.4733-1.1345 0.78863-2.334 0.93896-3.5536 0.096339-0.7815 0.12845-1.571 0.095749-2.3577-0.049906-1.1846-0.25968-2.362-0.61811-3.4922-0.18671-0.59018-0.41299-1.1677-0.6737-1.7292-0.69487 0.85402-1.266 1.8027-1.7501 2.7895-0.5227 1.0673-0.94571 2.181-1.3055 3.3128v9.8853z' fill='var(--kerykeion-chart-color-zodiac-icon-5)'/></symbol><symbol id='Lib'> <path d='m-5.5962e-6 29.191v-2.961h32v2.961h-32zm12.649-11.681v2.7685h-12.649v-2.9758h8.8675c-1.0345-1.044-1.8553-2.3319-2.2049-3.7687-0.29741-1.1978-0.26313-2.4601-0.023133-3.6646 0.30573-1.5133 1.053-2.9206 2.0786-4.0701 1.1545-1.3066 2.6275-2.3595 4.2987-2.8915 1.5033-0.48223 3.1234-0.56961 4.6786-0.31793 1.5712 0.25581 3.0608 0.94729 4.2909 1.953 1.3009 1.0598 2.3996 2.409 3.0001 3.9864 0.47686 1.2438 0.65393 2.5975 0.54736 3.9233-0.11688 1.3682-0.65463 2.6837-1.4721 3.7827-0.27785 0.37765-0.58533 0.7332-0.9141 1.0675 2.9509-1.3e-5 5.9018-1.3e-5 8.8526-2.7e-5v2.9758h-12.649v-2.7685c1.1252-0.72241 2.1186-1.7062 2.6769-2.9343 0.55645-1.2124 0.67874-2.6011 0.44112-3.9064-0.22952-1.2514-0.89466-2.3976-1.7978-3.2857-0.91989-0.93087-2.1098-1.6114-3.4055-1.8423-1.5377-0.27656-3.1906-0.054547-4.5406 0.75439-0.90184 0.54024-1.6755 1.2895-2.2668 2.1562-0.70515 1.0358-1.0508 2.2952-1.0271 3.5438 0.0052783 1.2035 0.33773 2.4144 1.0156 3.4156 0.56719 0.85148 1.3457 1.5456 2.2017 2.0986z' fill='var(--kerykeion-chart-color-zodiac-icon-6)'/></symbol><symbol id='Sco'> <path d='m2.0718 25.109c-2.08e-5 -5.866 4.16e-5 -11.732-3.18e-5 -17.598-0.0024957-1.1682-0.11334-2.3407-0.39458-3.4761-0.23984-0.96901-0.60857-1.9101-1.1318-2.7616-0.16581-0.27019-0.34672-0.5311-0.54214-0.78063h2.6438c0.587 0.89643 1.0513 1.8721 1.3886 2.8893 0.21233 0.63869 0.37585 1.2933 0.49636 1.9555 0.51653-1.2776 1.1527-2.511 1.9447-3.6399 0.29322-0.41786 0.60765-0.8209 0.94388-1.2049 0.79151-0.15945 1.583-0.3189 2.3745-0.47834 0.52668 0.61434 0.93285 1.3253 1.2426 2.0714 0.36364 0.87677 0.60032 1.8018 0.76041 2.7362 0.043847 0.25678 0.081762 0.51457 0.11449 0.77301 0.4282-1.2352 1.0379-2.4024 1.7619-3.4885 0.372-0.55816 0.77437-1.0958 1.2001-1.6138 0.80783-0.15945 1.6157-0.3189 2.4235-0.47834 0.58295 0.78814 1.0483 1.6636 1.3728 2.5893 0.35661 1.0123 0.54531 2.0801 0.59544 3.1513 0.013671 0.26686 0.015075 0.53409 0.014643 0.80124 1.7e-5 5.0706-3.3e-5 10.141 2.6e-5 15.212 0.001339 0.71755 0.011661 1.4354 0.052995 2.1519 0.020264 0.32951 0.044798 0.6593 0.094793 0.98582 0.015665 0.10611 0.043452 0.20997 0.072121 0.31318 0.098937 0.34781 0.25667 0.6793 0.46957 0.97164 0.082861 0.11324 0.17155 0.22263 0.26991 0.32277 0.2973 0.30021 0.66636 0.52167 1.0571 0.67712 0.48619 0.19335 1.0046 0.29303 1.5237 0.34361 0.32478 0.031747 0.65123 0.041746 0.97743 0.040442h1.4187v-2.4653l3.8923 3.5201c-1.2974 1.1284-2.5948 2.2568-3.8923 3.3852v-2.3917c-0.7675-6.7e-5 -1.535 1.36e-4 -2.3025-1.03e-4 -0.73958-0.003613-1.4829-0.071545-2.2003-0.25817-0.58976-0.15364-1.1621-0.39264-1.6626-0.74405-0.36436-0.25442-0.68636-0.56894-0.95092-0.92629-0.37567-0.50492-0.64084-1.0849-0.82828-1.684-0.22889-0.73408-0.34729-1.4985-0.40653-2.264-0.034974-0.45095-0.046706-0.90336-0.045384-1.3556-1.1e-5 -4.9173 2.2e-5 -9.8346-1.6e-5 -14.752-0.001789-0.87672-0.043192-1.7553-0.16981-2.6235-0.091507-0.61712-0.22553-1.231-0.44703-1.8153-0.12195-0.31988-0.27131-0.63048-0.46025-0.91631-0.92838 1.0717-1.7051 2.2725-2.3228 3.5489-0.67966 1.4022-1.1707 2.892-1.5083 4.4123v14.864h-2.4602c-1.1e-5 -5.5351 2.2e-5 -11.07-1.6e-5 -16.605-0.001778-0.99977-0.039378-2.001-0.15672-2.9943-0.080917-0.6716-0.19706-1.3413-0.39188-1.9898-0.13036-0.42947-0.29575-0.85134-0.52849-1.2362-0.94176 1.0606-1.7313 2.2531-2.3688 3.5199-0.62493 1.2404-1.1078 2.5502-1.4745 3.8894v15.416h-2.4602z' fill='var(--kerykeion-chart-color-zodiac-icon-7)'/></symbol><symbol id='Sag'> <path d='m29.893 2.0959 2.1071 15.02-3.0014 0.47081-1.5462-10.95-13.719 13.775 6.4576 6.4547-2.1525 2.1566-6.4576-6.4699-9.4893 9.4466-2.0919-2.0959 9.4742-9.4618-6.4424-6.4699 2.1222-2.1566 6.4576 6.4699 13.749-13.745-10.929-1.5339 0.46992-3.0071 14.992 2.0959z' fill='var(--kerykeion-chart-color-zodiac-icon-8)'/></symbol><symbol id='Cap'> <path d='m6.1094 18.905c-1.167e-4 -0.31522 2.483e-4 -0.63045-2.086e-4 -0.94567-0.0055084-0.81287-0.072689-1.624-0.16275-2.4315-0.14438-1.273-0.3503-2.5381-0.57987-3.7983-0.14067-0.77241-0.29609-1.5421-0.46297-2.3093-0.18175-0.82695-0.37732-1.6516-0.61822-2.4635-0.13213-0.43957-0.27542-0.87699-0.4602-1.2976-0.16621-0.37527-0.37792-0.73193-0.64078-1.0478-0.28343-0.341-0.6329-0.62909-1.0297-0.82872-0.4274-0.21714-0.9027-0.32979-1.3797-0.36032-0.18797-0.013078-0.37639-0.0090758-0.56464-0.0097536h-0.21042v-2.0483c0.62771 2.11e-5 1.2554-4.1e-5 1.8831 3.1e-5 0.56639 0.0018099 1.138 0.075074 1.672 0.27029 0.42866 0.15578 0.82828 0.39483 1.1598 0.70885 0.35447 0.3333 0.6288 0.74531 0.82945 1.187 0.30293 0.65438 0.54211 1.3363 0.75534 2.0245 0.33204 1.0804 0.59643 2.1804 0.83226 3.2855 0.19591 0.9221 0.3697 1.8488 0.52972 2.7778 0.42024-1.8778 0.99062-3.7268 1.775-5.4859 0.68616-1.5392 1.5402-3.0082 2.5869-4.3311 0.11907-0.14669 0.23532-0.30038 0.36224-0.4379 1.0951-0.21069 2.1902-0.42138 3.2853-0.63207 0.33963 0.77066 0.60402 1.5723 0.83387 2.3817 0.3424 1.2148 0.60429 2.4508 0.82858 3.6923 0.13238 0.73431 0.24926 1.4713 0.35724 2.2096 0.15047 0.99606 0.30094 1.9921 0.45141 2.9882 0.094275 0.67931 0.18852 1.3587 0.2711 2.0395 0.035618 0.29843 0.066018 0.59746 0.10429 0.89558 0.10159 0.80793 0.22463 1.614 0.39965 2.4096 0.079247 0.35714 0.16915 0.71223 0.28046 1.0608 0.45712-0.87421 1.0056-1.7069 1.6833-2.4269 0.56467-0.60058 1.2236-1.1178 1.9616-1.4888 0.67612-0.34201 1.4147-0.55656 2.1671-0.64228 0.55754-0.062944 1.1228-0.065435 1.68 0.002696 0.68121 0.083076 1.3495 0.2801 1.9617 0.59117 0.58313 0.29454 1.1127 0.68962 1.5764 1.1487 0.48963 0.47867 0.9063 1.0354 1.2044 1.6528 0.29165 0.60002 0.46814 1.2536 0.53453 1.9167 0.049143 0.48946 0.042856 0.98396-0.008865 1.4729-0.078184 0.73085-0.27576 1.4505-0.5986 2.1117-0.32356 0.66661-0.77184 1.2697-1.3014 1.787-0.50127 0.4919-1.0807 0.90752-1.7197 1.2016-0.61755 0.28611-1.2867 0.45577-1.964 0.51572-0.47043 0.042078-0.94447 0.032988-1.4146-0.008038-0.85689-0.076405-1.7022-0.28801-2.4909-0.63224-0.85782-0.37237-1.645-0.89744-2.3424-1.5184-0.20502-0.18223-0.40273-0.37265-0.59335-0.56988-0.42087 1.103-0.86748 2.1971-1.3756 3.2631-0.31673 0.66064-0.65567 1.3122-1.0503 1.9301-0.24152 0.37489-0.50283 0.73986-0.81264 1.0619-0.34552 0.35967-0.76807 0.63942-1.22 0.84719-0.57403 0.26404-1.1921 0.42031-1.815 0.51599-0.64078 0.097787-1.2898 0.13042-1.9375 0.12792h-2.1699v-2.0731c0.37677-1.05e-4 0.75353 2.19e-4 1.1303-1.79e-4 0.69812-0.004162 1.3988-0.051556 2.0839-0.19084 0.51332-0.10565 1.0205-0.26428 1.4803-0.51944 0.33421-0.1853 0.6403-0.42594 0.8825-0.7227 0.23985-0.29253 0.43818-0.61631 0.62353-0.94525 0.33248-0.59672 0.61715-1.2187 0.8857-1.8463 0.46172-1.0864 0.8696-2.1949 1.2571-3.3097 0.063145-0.18213 0.12564-0.36449 0.18754-0.54704-0.3003-0.52844-0.58207-1.0687-0.81505-1.6305-0.14-0.33902-0.26113-0.68695-0.34031-1.0455-0.094176-0.41978-0.16453-0.84445-0.23218-1.2692-0.14979-0.95814-0.27264-1.9202-0.39149-2.8826-0.20999-1.5806-0.41998-3.1613-0.62997-4.7419-0.15282-1.1647-0.32879-2.3272-0.56395-3.4784-0.14396-0.69676-0.3077-1.3906-0.52673-2.068-0.10359-0.31743-0.21948-0.63147-0.36217-0.9336-0.78732 0.933-1.45 1.9657-2.0252 3.0408-0.66456 1.2441-1.2126 2.5476-1.6869 3.8751-0.52082 1.4473-0.95014 2.9308-1.2213 4.446-0.18923 1.06-0.29919 2.1359-0.29442 3.2133v1.2649h-2.4835zm13.982 2.5076c0.61248 0.67893 1.2847 1.3096 2.0394 1.8288 0.62941 0.43247 1.3203 0.7851 2.059 0.98697 0.66194 0.18223 1.3606 0.23646 2.0415 0.14441 0.5121-0.069023 1.0129-0.23014 1.4633-0.4845 0.37926-0.21271 0.72092-0.48914 1.0188-0.80523 0.36997-0.38662 0.66819-0.84228 0.86899-1.3385 0.22425-0.54985 0.32939-1.1436 0.34217-1.7359 0.012877-0.49332-0.04563-0.99056-0.19522-1.4617-0.15275-0.4862-0.40261-0.94036-0.72412-1.3353-0.3539-0.4349-0.78585-0.81087-1.2826-1.074-0.43755-0.23342-0.92216-0.37496-1.4151-0.42484-0.66907-0.067639-1.355 0.012618-1.9847 0.25137-0.59111 0.22188-1.126 0.57752-1.5875 1.0056-0.56518 0.52383-1.0282 1.1487-1.4228 1.8082-0.49658 0.83314-0.88819 1.725-1.2211 2.6347z' fill='var(--kerykeion-chart-color-zodiac-icon-9)'/></symbol><symbol id='Aqu'> <path d='m2e-6 24.702 9.6771-6.379 2.1205 4.9415 7.4924-4.9415 2.0948 4.9415 7.5052-4.9415 3.0972 7.2774-2.0048 0.88561-2.0691-4.9415-7.5309 4.9415-2.0948-4.9415-7.4667 4.9415-2.1076-4.9415-7.5309 4.9415-1.1823-1.7841zm0.012851-13.31 9.6771-6.3918 2.1205 4.9415 7.5052-4.9415 2.0948 4.9415 7.4924-4.9415 3.0972 7.2774-2.0048 0.88561-2.0691-4.9415-7.5438 4.9415-2.0948-4.9415-7.4667 4.9415-2.0819-4.9415-7.5309 4.9415-1.1952-1.7712z' fill='var(--kerykeion-chart-color-zodiac-icon-10)'/></symbol><symbol id='Pis'> <path d='m13.288 16.494c2.19e-4 1.5701-0.23344 3.1348-0.6282 4.6526-0.30222 1.1611-0.69671 2.2973-1.1596 3.4038-0.81418 1.9285-1.8342 3.7721-3.0597 5.4701-0.49362 0.68457-1.0199 1.3456-1.5766 1.9799h-3.3259c1.514-1.5959 2.8716-3.3491 3.96-5.2637 0.93435-1.6411 1.6648-3.4014 2.1304-5.2328 0.41766-1.6349 0.6231-3.3229 0.62218-5.01h-6.4848v-2.2781h6.4848c-0.094794-1.7175-0.43827-3.419-0.99611-5.0454-0.6441-1.8836-1.5684-3.6644-2.6716-5.3188-0.90876-1.3633-1.9379-2.6442-3.0449-3.8513h3.1437c1.4781 1.5758 2.7807 3.3216 3.8225 5.2162 0.95571 1.734 1.6887 3.5907 2.1724 5.5108 0.28944 1.1457 0.49164 2.313 0.61139 3.4885h6.2873c0.21141-2.0277 0.67041-4.0313 1.3878-5.9404 0.70718-1.8883 1.6654-3.6802 2.8233-5.3301 0.72688-1.0371 1.5311-2.0193 2.3952-2.9449h3.1437c-1.4708 1.6041-2.8066 3.34-3.9005 5.224-0.95446 1.643-1.7199 3.4015-2.2097 5.2393-0.32763 1.2259-0.53189 2.485-0.60234 3.7521h6.4848v2.2781h-6.4848c-0.001246 1.8164 0.23771 3.6338 0.72162 5.3849 0.50287 1.8288 1.2699 3.581 2.2362 5.2116 1.052 1.7777 2.3344 3.4126 3.7547 4.9099h-3.3107c-1.3203-1.4916-2.4655-3.1367-3.4174-4.8862-0.49303-0.90602-0.93678-1.8389-1.329-2.7929-0.64463-1.5832-1.1527-3.2272-1.4393-4.9142-0.16334-0.96195-0.25352-1.9371-0.25345-2.9131h-6.2873z' fill='var(--kerykeion-chart-color-zodiac-icon-11)'/></symbol><!-- Aspects 12x12 --><symbol id='orb0'> <path d='m6.0698 7.3235c0 1.412-1.1524 2.5567-2.5739 2.5567-1.4215 0-2.5739-1.1447-2.5739-2.5567s1.1524-2.5567 2.5739-2.5567c1.4215 0 2.5739 1.1447 2.5739 2.5567zm-0.44449-2.1122c4.4449-4.4449 4.4449-4.4449 4.4449-4.4449' fill='none' stroke='var(--kerykeion-chart-color-conjunction)' stroke-width='1.4763'/></symbol><symbol id='orb60'> <path d='m0.88182 0.71815c2.4989 2.4995 4.9977 4.9989 7.4966 7.4984m0.23352-3.8128h-7.9437m0.181 3.7908c2.5272-2.4721 5.0545-4.9441 7.5817-7.4162' fill='none' stroke='var(--kerykeion-chart-color-sextile)' stroke-width='1.4763'/></symbol><symbol id='orb72'> <path d='m8.9165 5.6417c0 2.327-1.6422 4.2134-3.668 4.2134s-3.668-1.8864-3.668-4.2134c0-2.327 1.6422-4.2134 3.668-4.2134s3.668 1.8864 3.668 4.2134zm-3.4462 1.1046 3.5809 3.3729' fill='none' stroke='var(--kerykeion-chart-color-quintile)' stroke-width='1.4763'/></symbol><symbol id='orb90'> <rect x='1.1832' y='1.1893' width='8.7158' height='8.0862' fill='none' stroke='var(--kerykeion-chart-color-square)' stroke-width='1.2504'/></symbol><symbol id='orb120'> <path d='m1.1755 9.498h7.9203l-3.9601-8.0341-3.9601 8.0341z' fill='none' stroke='var(--kerykeion-chart-color-trine)' stroke-width='1.1965'/></symbol><symbol id='orb180'> <path d='m5.2464 9.1024c0.014353 0.92072-0.60401 1.8093-1.4696 2.1213-0.77247 0.29079-1.7011 0.12198-2.309-0.44085-0.59719-0.53543-0.87707-1.4011-0.69074-2.1833 0.18165-0.80748 0.83548-1.4921 1.6423-1.6896 0.77065-0.19924 1.6427 0.035576 2.1907 0.61819 0.40287 0.41725 0.64171 0.99291 0.63633 1.5743zm6-6c0.014351 0.92072-0.60401 1.8093-1.4696 2.1213-0.77247 0.29079-1.7011 0.12198-2.309-0.44085-0.59719-0.53543-0.87706-1.4011-0.69074-2.1833 0.18165-0.80748 0.83548-1.4921 1.6423-1.6896 0.77065-0.19924 1.6427 0.035577 2.1907 0.61819 0.40287 0.41725 0.64171 0.99291 0.63633 1.5743zm-6.7382 4.4763 3.0798-2.9527' fill='none' stroke='var(--kerykeion-chart-color-opposition)' stroke-width='1.4763'/></symbol><!-- retrograde symbol (12x12) --><symbol id='retrograde'> <path d='m5.1695 0.065143c-1.4097 0.15083-2.8378 0.26635-4.2559 0.16999 0.63545 0.58389 0.4889 1.4749 0.50926 2.2349-0.005422 2.7474 0.010933 5.4952-0.008336 8.2424 0.10044 0.45844-0.4465 1.1221-0.51165 1.2519h3.2845c-0.58553-0.38633-0.53628-1.1443-0.54563-1.7445v-3.9671c0.86089 1.1446 1.7218 2.2892 2.5827 3.4338-0.62133 0.32659-1.1523 0.81089-1.8551 0.98593 0.20613 0.28331 0.41226 0.56663 0.61838 0.84994 0.50629-0.5043 1.155-0.85012 1.746-1.2579 0.65605 0.95249 1.7361 1.784 3.0083 1.7472 0.40166-0.00938 1.3258-0.12576 1.3218-0.3355-1.1633-0.54802-2.0619-1.497-2.6569-2.5676 0.56012-0.43284 1.0987-0.9215 1.7705-1.1998 0.2425-0.042523-0.14571-0.33232-0.19588-0.48958-0.1919-0.5128-0.36007 0.050371-0.68642 0.20485-0.44968 0.26882-0.9872 0.74066-1.4336 0.82149-0.60631-0.85557-1.2126-1.7111-1.8189-2.5667 1.2027-0.2613 2.5403-0.79334 3.0279-1.9418 0.33587-0.82488 0.19329-1.7701-0.15965-2.5634-0.7423-0.96256-2.0416-1.4459-3.2908-1.3484-0.15064 0.007766-0.30092 0.021404-0.45046 0.040037zm-1.164 0.91793c0.92193-0.10792 2.0698-0.026484 2.6065 0.7939 0.5876 0.96664 0.36523 2.2507-0.37306 3.0924-0.63356 0.6855-1.6868 0.80868-2.5971 0.70335v-4.5217c0.12125-0.022665 0.2425-0.04533 0.36376-0.067995z' fill='var(--kerykeion-chart-color-paper-0)'/></symbol> </defs></svg>",
    "data": {
        "name": "Alvaro Leonardo Gomes",
        "year": 2004,
        "month": 4,
        "day": 1,
        "hour": 18,
        "minute": 39,
        "city": "maceio",
        "nation": "brasil",
        "lng": -35.7339264,
        "lat": -9.6476843,
        "tz_str": "UTC",
        "zodiac_type": "Tropic",
        "sidereal_mode": null,
        "houses_system_identifier": "P",
        "houses_system_name": "Placidus",
        "perspective_type": "Apparent Geocentric",
        "iso_formatted_local_datetime": "2004-04-01T18:39:00+00:00",
        "iso_formatted_utc_datetime": "2004-04-01T18:39:00+00:00",
        "julian_day": 2450540.277083333,
        "utc_time": 18.65,
        "local_time": 18.65,
        "sun": {
            "name": "Sun",
            "quality": "Cardinal",
            "element": "Fire",
            "sign": "Ari",
            "sign_num": 0,
            "position": 12.071002983081414,
            "abs_pos": 12.071002983081414,
            "emoji": "♈️",
            "point_type": "Planet",
            "house": "Seventh_House",
            "retrograde": false
        },
        "moon": {
            "name": "Moon",
            "quality": "Cardinal",
            "element": "Earth",
            "sign": "Cap",
            "sign_num": 9,
            "position": 24.489046698701316,
            "abs_pos": 294.4890466987013,
            "emoji": "♑️",
            "point_type": "Planet",
            "house": "Fifth_House",
            "retrograde": false
        },
        "mercury": {
            "name": "Mercury",
            "quality": "Fixed",
            "element": "Earth",
            "sign": "Tau",
            "sign_num": 1,
            "position": 0.2829651797868209,
            "abs_pos": 30.28296517978682,
            "emoji": "♉️",
            "point_type": "Planet",
            "house": "Eighth_House",
            "retrograde": false
        },
        "venus": {
            "name": "Venus",
            "quality": "Cardinal",
            "element": "Fire",
            "sign": "Ari",
            "sign_num": 0,
            "position": 11.867816007722602,
            "abs_pos": 11.867816007722602,
            "emoji": "♈️",
            "point_type": "Planet",
            "house": "Seventh_House",
            "retrograde": false
        },
        "mars": {
            "name": "Mars",
            "quality": "Mutable",
            "element": "Earth",
            "sign": "Vir",
            "sign_num": 5,
            "position": 21.06222466793605,
            "abs_pos": 171.06222466793605,
            "emoji": "♍️",
            "point_type": "Planet",
            "house": "First_House",
            "retrograde": true
        },
        "jupiter": {
            "name": "Jupiter",
            "quality": "Fixed",
            "element": "Air",
            "sign": "Aqu",
            "sign_num": 10,
            "position": 15.149222740957725,
            "abs_pos": 315.1492227409577,
            "emoji": "♒️",
            "point_type": "Planet",
            "house": "Sixth_House",
            "retrograde": false
        },
        "saturn": {
            "name": "Saturn",
            "quality": "Cardinal",
            "element": "Fire",
            "sign": "Ari",
            "sign_num": 0,
            "position": 10.48047090131017,
            "abs_pos": 10.48047090131017,
            "emoji": "♈️",
            "point_type": "Planet",
            "house": "Seventh_House",
            "retrograde": false
        },
        "uranus": {
            "name": "Uranus",
            "quality": "Fixed",
            "element": "Air",
            "sign": "Aqu",
            "sign_num": 10,
            "position": 7.97469158140666,
            "abs_pos": 307.97469158140666,
            "emoji": "♒️",
            "point_type": "Planet",
            "house": "Fifth_House",
            "retrograde": false
        },
        "neptune": {
            "name": "Neptune",
            "quality": "Cardinal",
            "element": "Earth",
            "sign": "Cap",
            "sign_num": 9,
            "position": 29.70836344640287,
            "abs_pos": 299.70836344640287,
            "emoji": "♑️",
            "point_type": "Planet",
            "house": "Fifth_House",
            "retrograde": false
        },
        "pluto": {
            "name": "Pluto",
            "quality": "Mutable",
            "element": "Fire",
            "sign": "Sag",
            "sign_num": 8,
            "position": 5.439023396425853,
            "abs_pos": 245.43902339642585,
            "emoji": "♐️",
            "point_type": "Planet",
            "house": "Third_House",
            "retrograde": true
        },
        "chiron": {
            "name": "Chiron",
            "quality": "Fixed",
            "element": "Water",
            "sign": "Sco",
            "sign_num": 7,
            "position": 0.2115003498373369,
            "abs_pos": 210.21150034983734,
            "emoji": "♏️",
            "point_type": "Planet",
            "house": "Second_House",
            "retrograde": true
        },
        "mean_lilith": {
            "name": "Mean_Lilith",
            "quality": "Mutable",
            "element": "Earth",
            "sign": "Vir",
            "sign_num": 5,
            "position": 1.516391791623164,
            "abs_pos": 151.51639179162316,
            "emoji": "♍️",
            "point_type": "Planet",
            "house": "Twelfth_House",
            "retrograde": false
        },
        "first_house": {
            "name": "First_House",
            "quality": "Mutable",
            "element": "Earth",
            "sign": "Vir",
            "sign_num": 5,
            "position": 11.500832136985792,
            "abs_pos": 161.5008321369858,
            "emoji": "♍️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "second_house": {
            "name": "Second_House",
            "quality": "Cardinal",
            "element": "Air",
            "sign": "Lib",
            "sign_num": 6,
            "position": 16.170026823085635,
            "abs_pos": 196.17002682308564,
            "emoji": "♎️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "third_house": {
            "name": "Third_House",
            "quality": "Fixed",
            "element": "Water",
            "sign": "Sco",
            "sign_num": 7,
            "position": 17.63569863765258,
            "abs_pos": 227.63569863765258,
            "emoji": "♏️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "fourth_house": {
            "name": "Fourth_House",
            "quality": "Mutable",
            "element": "Fire",
            "sign": "Sag",
            "sign_num": 8,
            "position": 15.421745529390847,
            "abs_pos": 255.42174552939085,
            "emoji": "♐️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "fifth_house": {
            "name": "Fifth_House",
            "quality": "Cardinal",
            "element": "Earth",
            "sign": "Cap",
            "sign_num": 9,
            "position": 11.775015162256977,
            "abs_pos": 281.775015162257,
            "emoji": "♑️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "sixth_house": {
            "name": "Sixth_House",
            "quality": "Fixed",
            "element": "Air",
            "sign": "Aqu",
            "sign_num": 10,
            "position": 9.643504468102037,
            "abs_pos": 309.64350446810204,
            "emoji": "♒️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "seventh_house": {
            "name": "Seventh_House",
            "quality": "Mutable",
            "element": "Water",
            "sign": "Pis",
            "sign_num": 11,
            "position": 11.500832136985764,
            "abs_pos": 341.50083213698576,
            "emoji": "♓️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "eighth_house": {
            "name": "Eighth_House",
            "quality": "Cardinal",
            "element": "Fire",
            "sign": "Ari",
            "sign_num": 0,
            "position": 16.170026823085664,
            "abs_pos": 16.170026823085664,
            "emoji": "♈️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "ninth_house": {
            "name": "Ninth_House",
            "quality": "Fixed",
            "element": "Earth",
            "sign": "Tau",
            "sign_num": 1,
            "position": 17.63569863765258,
            "abs_pos": 47.63569863765258,
            "emoji": "♉️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "tenth_house": {
            "name": "Tenth_House",
            "quality": "Mutable",
            "element": "Air",
            "sign": "Gem",
            "sign_num": 2,
            "position": 15.421745529390847,
            "abs_pos": 75.42174552939085,
            "emoji": "♊️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "eleventh_house": {
            "name": "Eleventh_House",
            "quality": "Cardinal",
            "element": "Water",
            "sign": "Can",
            "sign_num": 3,
            "position": 11.775015162256963,
            "abs_pos": 101.77501516225696,
            "emoji": "♋️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "twelfth_house": {
            "name": "Twelfth_House",
            "quality": "Fixed",
            "element": "Fire",
            "sign": "Leo",
            "sign_num": 4,
            "position": 9.643504468102066,
            "abs_pos": 129.64350446810207,
            "emoji": "♌️",
            "point_type": "House",
            "house": null,
            "retrograde": null
        },
        "mean_node": {
            "name": "Mean_Node",
            "quality": "Mutable",
            "element": "Earth",
            "sign": "Vir",
            "sign_num": 5,
            "position": 28.24819155640148,
            "abs_pos": 178.24819155640148,
            "emoji": "♍️",
            "point_type": "Planet",
            "house": "First_House",
            "retrograde": true
        },
        "true_node": {
            "name": "True_Node",
            "quality": "Mutable",
            "element": "Earth",
            "sign": "Vir",
            "sign_num": 5,
            "position": 28.666361713472213,
            "abs_pos": 178.6663617134722,
            "emoji": "♍️",
            "point_type": "Planet",
            "house": "First_House",
            "retrograde": false
        },
        "mean_south_node": {
            "name": "Mean_South_Node",
            "quality": "Mutable",
            "element": "Water",
            "sign": "Pis",
            "sign_num": 11,
            "position": 28.24819155640148,
            "abs_pos": 358.2481915564015,
            "emoji": "♓️",
            "point_type": "Planet",
            "house": "Seventh_House",
            "retrograde": true
        },
        "true_south_node": {
            "name": "True_South_Node",
            "quality": "Mutable",
            "element": "Water",
            "sign": "Pis",
            "sign_num": 11,
            "position": 28.666361713472213,
            "abs_pos": 358.6663617134722,
            "emoji": "♓️",
            "point_type": "Planet",
            "house": "Seventh_House",
            "retrograde": false
        },
        "lunar_phase": {
            "degrees_between_s_m": 282.4180437156199,
            "moon_phase": 22,
            "sun_phase": 22,
            "moon_emoji": "🌗",
            "moon_phase_name": "Last Quarter"
        },
        "planets_names_list": [
            "Sun",
            "Moon",
            "Mercury",
            "Venus",
            "Mars",
            "Jupiter",
            "Saturn",
            "Uranus",
            "Neptune",
            "Pluto",
            "Mean_Node",
            "True_Node",
            "Mean_South_Node",
            "True_South_Node",
            "Chiron",
            "Mean_Lilith"
        ],
        "houses_names_list": [
            "First_House",
            "Second_House",
            "Third_House",
            "Fourth_House",
            "Fifth_House",
            "Sixth_House",
            "Seventh_House",
            "Eighth_House",
            "Ninth_House",
            "Tenth_House",
            "Eleventh_House",
            "Twelfth_House"
        ]
    },
    "aspects": [
        {
            "p1_name": "Sun",
            "p1_abs_pos": 12.071002983081414,
            "p2_name": "Venus",
            "p2_abs_pos": 11.867816007722602,
            "aspect": "conjunction",
            "orbit": 0.20318697535881114,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 0.20318697535881114,
            "p1": 0,
            "p2": 3,
            "is_major": true
        },
        {
            "p1_name": "Sun",
            "p1_abs_pos": 12.071002983081414,
            "p2_name": "Jupiter",
            "p2_abs_pos": 315.1492227409577,
            "aspect": "sextile",
            "orbit": -3.0782197578762975,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 303.0782197578763,
            "p1": 0,
            "p2": 5,
            "is_major": true
        },
        {
            "p1_name": "Sun",
            "p1_abs_pos": 12.071002983081414,
            "p2_name": "Saturn",
            "p2_abs_pos": 10.48047090131017,
            "aspect": "conjunction",
            "orbit": 1.5905320817712436,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 1.5905320817712436,
            "p1": 0,
            "p2": 6,
            "is_major": true
        },
        {
            "p1_name": "Sun",
            "p1_abs_pos": 12.071002983081414,
            "p2_name": "Uranus",
            "p2_abs_pos": 307.97469158140666,
            "aspect": "sextile",
            "orbit": 4.096311401674768,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 295.90368859832523,
            "p1": 0,
            "p2": 7,
            "is_major": true
        },
        {
            "p1_name": "Sun",
            "p1_abs_pos": 12.071002983081414,
            "p2_name": "Neptune",
            "p2_abs_pos": 299.70836344640287,
            "aspect": "quintile",
            "orbit": 0.3626395366785573,
            "aspect_degrees": 72,
            "aid": 4,
            "diff": 287.63736046332144,
            "p1": 0,
            "p2": 8,
            "is_major": false
        },
        {
            "p1_name": "Sun",
            "p1_abs_pos": 12.071002983081414,
            "p2_name": "Pluto",
            "p2_abs_pos": 245.43902339642585,
            "aspect": "trine",
            "orbit": 6.631979586655575,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 233.36802041334442,
            "p1": 0,
            "p2": 9,
            "is_major": true
        },
        {
            "p1_name": "Moon",
            "p1_abs_pos": 294.4890466987013,
            "p2_name": "Mercury",
            "p2_abs_pos": 30.28296517978682,
            "aspect": "square",
            "orbit": 5.793918481085484,
            "aspect_degrees": 90,
            "aid": 5,
            "diff": 264.2060815189145,
            "p1": 1,
            "p2": 2,
            "is_major": true
        },
        {
            "p1_name": "Moon",
            "p1_abs_pos": 294.4890466987013,
            "p2_name": "Mars",
            "p2_abs_pos": 171.06222466793605,
            "aspect": "trine",
            "orbit": 3.4268220307652655,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 123.42682203076527,
            "p1": 1,
            "p2": 4,
            "is_major": true
        },
        {
            "p1_name": "Moon",
            "p1_abs_pos": 294.4890466987013,
            "p2_name": "Neptune",
            "p2_abs_pos": 299.70836344640287,
            "aspect": "conjunction",
            "orbit": 5.219316747701555,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 5.219316747701555,
            "p1": 1,
            "p2": 8,
            "is_major": true
        },
        {
            "p1_name": "Moon",
            "p1_abs_pos": 294.4890466987013,
            "p2_name": "Mean_Node",
            "p2_abs_pos": 178.24819155640148,
            "aspect": "trine",
            "orbit": -3.7591448577001643,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 116.24085514229984,
            "p1": 1,
            "p2": 10,
            "is_major": true
        },
        {
            "p1_name": "Moon",
            "p1_abs_pos": 294.4890466987013,
            "p2_name": "Mean_South_Node",
            "p2_abs_pos": 358.2481915564015,
            "aspect": "sextile",
            "orbit": 3.7591448577001643,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 63.759144857700164,
            "p1": 1,
            "p2": 18,
            "is_major": true
        },
        {
            "p1_name": "Mercury",
            "p1_abs_pos": 30.28296517978682,
            "p2_name": "Neptune",
            "p2_abs_pos": 299.70836344640287,
            "aspect": "square",
            "orbit": 0.5746017333839291,
            "aspect_degrees": 90,
            "aid": 5,
            "diff": 269.42539826661607,
            "p1": 2,
            "p2": 8,
            "is_major": true
        },
        {
            "p1_name": "Mercury",
            "p1_abs_pos": 30.28296517978682,
            "p2_name": "Chiron",
            "p2_abs_pos": 210.21150034983734,
            "aspect": "opposition",
            "orbit": -0.0714648299494911,
            "aspect_degrees": 180,
            "aid": 10,
            "diff": 179.9285351700505,
            "p1": 2,
            "p2": 12,
            "is_major": true
        },
        {
            "p1_name": "Mercury",
            "p1_abs_pos": 30.28296517978682,
            "p2_name": "Mean_Lilith",
            "p2_abs_pos": 151.51639179162316,
            "aspect": "trine",
            "orbit": 1.233426611836336,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 121.23342661183634,
            "p1": 2,
            "p2": 17,
            "is_major": true
        },
        {
            "p1_name": "Venus",
            "p1_abs_pos": 11.867816007722602,
            "p2_name": "Jupiter",
            "p2_abs_pos": 315.1492227409577,
            "aspect": "sextile",
            "orbit": -3.281406733235144,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 303.28140673323514,
            "p1": 3,
            "p2": 5,
            "is_major": true
        },
        {
            "p1_name": "Venus",
            "p1_abs_pos": 11.867816007722602,
            "p2_name": "Saturn",
            "p2_abs_pos": 10.48047090131017,
            "aspect": "conjunction",
            "orbit": 1.3873451064124325,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 1.3873451064124325,
            "p1": 3,
            "p2": 6,
            "is_major": true
        },
        {
            "p1_name": "Venus",
            "p1_abs_pos": 11.867816007722602,
            "p2_name": "Uranus",
            "p2_abs_pos": 307.97469158140666,
            "aspect": "sextile",
            "orbit": 3.8931244263159215,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 296.1068755736841,
            "p1": 3,
            "p2": 7,
            "is_major": true
        },
        {
            "p1_name": "Venus",
            "p1_abs_pos": 11.867816007722602,
            "p2_name": "Neptune",
            "p2_abs_pos": 299.70836344640287,
            "aspect": "quintile",
            "orbit": 0.15945256131971064,
            "aspect_degrees": 72,
            "aid": 4,
            "diff": 287.8405474386803,
            "p1": 3,
            "p2": 8,
            "is_major": false
        },
        {
            "p1_name": "Venus",
            "p1_abs_pos": 11.867816007722602,
            "p2_name": "Pluto",
            "p2_abs_pos": 245.43902339642585,
            "aspect": "trine",
            "orbit": 6.428792611296757,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 233.57120738870324,
            "p1": 3,
            "p2": 9,
            "is_major": true
        },
        {
            "p1_name": "Mars",
            "p1_abs_pos": 171.06222466793605,
            "p2_name": "Neptune",
            "p2_abs_pos": 299.70836344640287,
            "aspect": "trine",
            "orbit": 8.64613877846682,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 128.64613877846682,
            "p1": 4,
            "p2": 8,
            "is_major": true
        },
        {
            "p1_name": "Mars",
            "p1_abs_pos": 171.06222466793605,
            "p2_name": "Mean_Node",
            "p2_abs_pos": 178.24819155640148,
            "aspect": "conjunction",
            "orbit": 7.18596688846543,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 7.18596688846543,
            "p1": 4,
            "p2": 10,
            "is_major": true
        },
        {
            "p1_name": "Mars",
            "p1_abs_pos": 171.06222466793605,
            "p2_name": "Mean_South_Node",
            "p2_abs_pos": 358.2481915564015,
            "aspect": "opposition",
            "orbit": -7.18596688846543,
            "aspect_degrees": 180,
            "aid": 10,
            "diff": 187.18596688846543,
            "p1": 4,
            "p2": 18,
            "is_major": true
        },
        {
            "p1_name": "Jupiter",
            "p1_abs_pos": 315.1492227409577,
            "p2_name": "Saturn",
            "p2_abs_pos": 10.48047090131017,
            "aspect": "sextile",
            "orbit": -4.668751839647541,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 304.66875183964754,
            "p1": 5,
            "p2": 6,
            "is_major": true
        },
        {
            "p1_name": "Jupiter",
            "p1_abs_pos": 315.1492227409577,
            "p2_name": "Uranus",
            "p2_abs_pos": 307.97469158140666,
            "aspect": "conjunction",
            "orbit": 7.174531159551066,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 7.174531159551066,
            "p1": 5,
            "p2": 7,
            "is_major": true
        },
        {
            "p1_name": "Jupiter",
            "p1_abs_pos": 315.1492227409577,
            "p2_name": "Tenth_House",
            "p2_abs_pos": 75.42174552939085,
            "aspect": "trine",
            "orbit": 0.27252278843312183,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 239.72747721156688,
            "p1": 5,
            "p2": 14,
            "is_major": true
        },
        {
            "p1_name": "Saturn",
            "p1_abs_pos": 10.48047090131017,
            "p2_name": "Uranus",
            "p2_abs_pos": 307.97469158140666,
            "aspect": "sextile",
            "orbit": 2.5057793199035245,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 297.4942206800965,
            "p1": 6,
            "p2": 7,
            "is_major": true
        },
        {
            "p1_name": "Saturn",
            "p1_abs_pos": 10.48047090131017,
            "p2_name": "Pluto",
            "p2_abs_pos": 245.43902339642585,
            "aspect": "trine",
            "orbit": 5.0414475048843315,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 234.95855249511567,
            "p1": 6,
            "p2": 9,
            "is_major": true
        },
        {
            "p1_name": "Uranus",
            "p1_abs_pos": 307.97469158140666,
            "p2_name": "Neptune",
            "p2_abs_pos": 299.70836344640287,
            "aspect": "conjunction",
            "orbit": 8.26632813500379,
            "aspect_degrees": 0,
            "aid": 0,
            "diff": 8.26632813500379,
            "p1": 7,
            "p2": 8,
            "is_major": true
        },
        {
            "p1_name": "Uranus",
            "p1_abs_pos": 307.97469158140666,
            "p2_name": "Pluto",
            "p2_abs_pos": 245.43902339642585,
            "aspect": "sextile",
            "orbit": 2.535668184980807,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 62.53566818498081,
            "p1": 7,
            "p2": 9,
            "is_major": true
        },
        {
            "p1_name": "Neptune",
            "p1_abs_pos": 299.70836344640287,
            "p2_name": "Pluto",
            "p2_abs_pos": 245.43902339642585,
            "aspect": "sextile",
            "orbit": -5.730659950022982,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 54.26934004997702,
            "p1": 8,
            "p2": 9,
            "is_major": true
        },
        {
            "p1_name": "Neptune",
            "p1_abs_pos": 299.70836344640287,
            "p2_name": "Mean_Node",
            "p2_abs_pos": 178.24819155640148,
            "aspect": "trine",
            "orbit": 1.4601718900013907,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 121.46017189000139,
            "p1": 8,
            "p2": 10,
            "is_major": true
        },
        {
            "p1_name": "Neptune",
            "p1_abs_pos": 299.70836344640287,
            "p2_name": "Chiron",
            "p2_abs_pos": 210.21150034983734,
            "aspect": "square",
            "orbit": -0.5031369034344664,
            "aspect_degrees": 90,
            "aid": 5,
            "diff": 89.49686309656553,
            "p1": 8,
            "p2": 12,
            "is_major": true
        },
        {
            "p1_name": "Neptune",
            "p1_abs_pos": 299.70836344640287,
            "p2_name": "Mean_South_Node",
            "p2_abs_pos": 358.2481915564015,
            "aspect": "sextile",
            "orbit": -1.4601718900013907,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 58.53982810999861,
            "p1": 8,
            "p2": 18,
            "is_major": true
        },
        {
            "p1_name": "Pluto",
            "p1_abs_pos": 245.43902339642585,
            "p2_name": "Mean_Lilith",
            "p2_abs_pos": 151.51639179162316,
            "aspect": "square",
            "orbit": 3.922631604802689,
            "aspect_degrees": 90,
            "aid": 5,
            "diff": 93.92263160480269,
            "p1": 9,
            "p2": 17,
            "is_major": true
        },
        {
            "p1_name": "Pluto",
            "p1_abs_pos": 245.43902339642585,
            "p2_name": "Mean_South_Node",
            "p2_abs_pos": 358.2481915564015,
            "aspect": "trine",
            "orbit": -7.190831840024373,
            "aspect_degrees": 120,
            "aid": 6,
            "diff": 112.80916815997563,
            "p1": 9,
            "p2": 18,
            "is_major": true
        },
        {
            "p1_name": "Chiron",
            "p1_abs_pos": 210.21150034983734,
            "p2_name": "Mean_Lilith",
            "p2_abs_pos": 151.51639179162316,
            "aspect": "sextile",
            "orbit": -1.304891441785827,
            "aspect_degrees": 60,
            "aid": 3,
            "diff": 58.69510855821417,
            "p1": 12,
            "p2": 17,
            "is_major": true
        }
    ]
}
renderBirthChart(resultado);