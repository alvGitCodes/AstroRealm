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
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',]



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
    dataNasc.innerHTML = dados.data.day + ' de ' + meses[dados.data.month] + ' de ' + dados.data.year + ', ' + (dados.data.hour - 3) + ':' + dados.data.minute;
    nomeUsuario.innerHTML = dados.data.name;
    chart.innerHTML = dados.chart;
    sol.innerHTML = dados.data.sun.emoji + 'Sol ' + dados.data.sun.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.sun.sign;
    lua.innerHTML = dados.data.moon.emoji + 'Lua ' + dados.data.moon.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.moon.sign;
    mercurio.innerHTML = dados.data.mercury.emoji + 'Mercúrio ' + dados.data.mercury.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.mercury.sign;
    venus.innerHTML = dados.data.venus.emoji + 'Vênus ' + dados.data.venus.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.venus.sign;
    marte.innerHTML = dados.data.mars.emoji + 'Marte ' + dados.data.mars.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.mars.sign;
    jupiter.innerHTML = dados.data.jupiter.emoji + 'Júpiter ' + dados.data.jupiter.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.jupiter.sign;
    saturno.innerHTML = dados.data.saturn.emoji + 'Saturno ' + dados.data.saturn.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.saturn.sign;
    urano.innerHTML = dados.data.uranus.emoji + 'Urano ' + dados.data.uranus.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.uranus.sign;
    netuno.innerHTML = dados.data.neptune.emoji + 'Netuno ' + dados.data.neptune.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.neptune.sign;
    plutao.innerHTML = dados.data.pluto.emoji + 'Plutão ' + dados.data.pluto.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.pluto.sign;
    northNode.innerHTML = dados.data.true_node.emoji + 'Nodo Norte ' + dados.data.true_node.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.true_node.sign;
    chiron.innerHTML = dados.data.chiron.emoji + 'Chiron ' + dados.data.chiron.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.chiron.sign;
    ascendente.innerHTML = dados.data.first_house.emoji + 'Ascendente ' + dados.data.first_house.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.first_house.sign;
    mc.innerHTML = dados.data.tenth_house.emoji + 'MC ' + dados.data.tenth_house.position.toFixed(2).replace('.', '° ') + '\' em ' + dados.data.tenth_house.sign;


    // Log para verificar a renderização
    console.log("Mapa Astral Renderizado");
}

// Chamar a função principal
fetchAstrologicalData();
