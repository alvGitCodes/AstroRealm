// Selecionar o elemento onde será exibido o mapa
const mapaWrapper = document.getElementById("mapaWrapper");

// Recuperar os dados do sessionStorage
const nome = sessionStorage.getItem("nome");
const pais = sessionStorage.getItem("pais");
const cidade = sessionStorage.getItem("cidade");
const data = sessionStorage.getItem("data");
const hora = sessionStorage.getItem("hora");

// Logs para verificar os dados capturados
console.log("Dados recuperados do sessionStorage:", { nome, pais, cidade, data, hora });

// Função para converter a data e hora em componentes individuais
function parseDateAndTime(date, time) {
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

// Função para chamar a API Astrologer
async function fetchAstrologicalData() {
    const { year, month, day, hour, minute } = parseDateAndTime(data, hora);

    // Buscar latitude e longitude
    const coordinates = await getCoordinates(cidade, pais);

    if (!coordinates) {
        mapaWrapper.innerHTML = "<p>Erro ao determinar as coordenadas da cidade. Verifique os dados e tente novamente.</p>";
        return;
    }

    // Log para verificar os dados antes de enviar para a API
    console.log("Dados enviados para a API:", {
        name: nome,
        year,
        month,
        day,
        hour,
        minute,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        city: cidade,
        nation: pais,
        timezone: "UTC",
        zodiac_type: "Tropic",
    });

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
                year: year,
                month: month,
                day: day,
                hour: hour,
                minute: minute,
                longitude: coordinates.longitude,
                latitude: coordinates.latitude,
                city: cidade,
                nation: pais,
                timezone: "UTC", // Atualize com o fuso horário correto, se necessário
                zodiac_type: "Tropic",
            },
            "language": "PT"
        }),
    };

    try {
        mapaWrapper.innerHTML = "<p>Gerando seu mapa astral...</p>";

        const response = await fetch(url, options);

        // Log para verificar o status da resposta
        console.log("Status da resposta da API:", response.status);

        if (!response.ok) {
            const errorResult = await response.text();
            console.error("Erro na API:", errorResult);
            throw new Error("Erro na API");
        }

        const result = await response.json();

        // Log para verificar a resposta da API
        console.log("Resposta da API:", result);

        renderBirthChart(result);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        mapaWrapper.innerHTML = "<p>Ocorreu um erro ao gerar o mapa astral. Tente novamente mais tarde.</p>";
    }
}

// Função para renderizar o mapa astral
function renderBirthChart(data) {
    // Log para verificar os dados antes de renderizar
    console.log("Dados recebidos para renderizar o mapa astral:", data);

    if (!data) {
        mapaWrapper.innerHTML = "<p>Não foi possível gerar o mapa astral.</p>";
        return;
    }

    mapaWrapper.innerHTML = `
    <h3>Mapa Astral de ${data.subject.name}</h3>
    <p><strong>Sol:</strong> ${data.sun.emoji} ${data.sun.sign} - Casa: ${data.sun.house}</p>
    <p><strong>Lua:</strong> ${data.moon.emoji} ${data.moon.sign} - Casa: ${data.moon.house}</p>
    <p><strong>Mercúrio:</strong> ${data.mercury.emoji} ${data.mercury.sign} - Casa: ${data.mercury.house}</p>
    <p><strong>Vênus:</strong> ${data.venus.emoji} ${data.venus.sign} - Casa: ${data.venus.house}</p>
    <p><strong>Fase da Lua:</strong> ${data.lunar_phase.moon_phase_name} 🌗 (${data.lunar_phase.moon_phase})</p>
`;

// Log para verificar a renderização
console.log("Mapa Astral Renderizado");
}

// Chamar a função principal
fetchAstrologicalData();
