export async function fetchLocationInfo(lat, lon) {
    try {
        const [nominatimResponse, timezoneResponse, weatherResponse] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`),
            fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONEDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`)
    ]);

    const [nominatimData, timezoneData, weatherData] = await Promise.all([
        nominatimResponse.json(),
        timezoneResponse.json(),
        weatherResponse.json()
    ]);

    const city = nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || nominatimData.address.hamlet || 'Ubicación Desconocida';
    const country = nominatimData.address.country || '';

    let description = '';
    try {
        const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`);
        if (wikiResponse.ok) {
            const wikiData = await wikiResponse.json();
            description = wikiData.extract || `${city || 'This location'} is in ${country}.`;
        }
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        description = `${city || 'This location'} is in ${country}.`;
    }
    return {
        name: city,
        country: country,
        latitude: lat,
        longitude: lon,
        timezone: timezoneData.zoneName,
        temperature: Math.round(weatherData.main.temp),
        weatherDescription: weatherData.weather[0].description,
        description: description
    };
    } catch (error) {
        console.error('Error fetching location info:', error);
        throw error;
    }
}
