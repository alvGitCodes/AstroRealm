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