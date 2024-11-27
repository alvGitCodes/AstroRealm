// Selecionar os elementos onde será exibido o mapa astral
const mapaWrapper = document.getElementById("mapaWrapper");
const nomeUsuario = document.getElementById("nomeUsuario");
const localNasc = document.getElementById("localNasc");
const dataNasc = document.getElementById("dataNasc");
const sol = document.getElementById("sol");
const lua = document.getElementById("lua");
const mercurio = document.getElementById("mercurio");
const venus = document.getElementById("venus");

// Recuperar os dados do sessionStorage
const nome = sessionStorage.getItem("nome");
const pais = sessionStorage.getItem("pais");
const cidade = sessionStorage.getItem("cidade");
const data = sessionStorage.getItem("data");
const hora = sessionStorage.getItem("hora");

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

async function fetchBirthChart() {
    // Buscar coordenadas da cidade e país fornecidos
    const coordinates = await getCoordinates(cidade, pais);

    if (!coordinates) {
        alert("Não foi possível encontrar as coordenadas para o local.");
        return;
    }

    const { latitude, longitude } = coordinates;

    // Formatar dados para enviar à API
    const birthDate = data;
    const birthTime = hora;
    const timezone = 'UTC';  // O fuso horário pode ser ajustado conforme necessário

    const url = 'https://calculate-birth-chart-character-analysis-daily-horoscope.p.rapidapi.com/calculateBirthChart?noqueue=1';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '286fdd9722mshbc7e6eb99a38615p165fe4jsn9c4ddaf1b057',
            'x-rapidapi-host': 'calculate-birth-chart-character-analysis-daily-horoscope.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            birthDate,   // A data de nascimento capturada
            birthTime,   // A hora de nascimento capturada
            lat: latitude, // Latitude obtida da função getCoordinates
            lon: longitude, // Longitude obtida da função getCoordinates
            timezone     // Fuso horário fixo ou ajustado conforme necessário
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();  // Processar o retorno da API como JSON
        console.log(result);  // Log para verificar os dados retornados

        // Exibir os dados do mapa astral na página
        displayBirthChart(result);
    } catch (error) {
        console.error("Erro ao obter dados do mapa astral:", error);
        alert("Erro ao obter os dados. Tente novamente.");
    }
}

// Função para exibir o Mapa Astral na página
function displayBirthChart(data) {
    // Exibir os dados básicos
    nomeUsuario.textContent = nome;
    localNasc.textContent = `${cidade}, ${pais}`;
    dataNasc.textContent = data.result.time;  // Exemplo de como exibir a data de nascimento, você pode formatar conforme necessário

    // Exibir os dados dos planetas
    sol.textContent = `Sol: ${data.result.planets.Sun.sign} - ${data.result.planets.Sun.degree}`;
    lua.textContent = `Lua: ${data.result.planets.Moon.sign} - ${data.result.planets.Moon.degree}`;
    mercurio.textContent = `Mercúrio: ${data.result.planets.Mercury.sign} - ${data.result.planets.Mercury.degree}`;
    venus.textContent = `Vênus: ${data.result.planets.Venus.sign} - ${data.result.planets.Venus.degree}`;
}

// Ao carregar a página, buscar o Mapa Astral
fetchBirthChart();
