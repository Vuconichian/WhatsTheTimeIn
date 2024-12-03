import React, { useState } from 'react';

function CitySearch({ onLocationSelect }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
    setError('');
    setSuggestions([]);
    setIsLoading(true);

    if (query.length > 2) {
        try {
        const cityResponse = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5`, {
            method: 'GET',
            headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        
        if (!cityResponse.ok) {
            throw new Error(`API responded with status ${cityResponse.status}`);
        }
        
        const cityData = await cityResponse.json();
        
        if (!cityData.data || !Array.isArray(cityData.data)) {
            throw new Error('Unexpected API response format');
        }
        
        setSuggestions(cityData.data);
        if (cityData.data.length === 0) {
            setError('No cities found. Try a different search term.');
        }
        } catch (error) {
        console.error('Error searching:', error);
        setError(`Failed to search: ${error.message}`);
        } finally {
        setIsLoading(false);
        }
    } else {
        setError('Please enter at least 3 characters to search.');
        setIsLoading(false);
    }
    };

    const handleSelect = async (city) => {
    setIsLoading(true);
    setError('');
    try {
        const [timezoneResponse, wikiResponse, weatherResponse] = await Promise.all([
        fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONEDB_API_KEY}&format=json&by=position&lat=${city.latitude}&lng=${city.longitude}`),
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.name)}`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`)
        ]);

        if (!timezoneResponse.ok || !weatherResponse.ok) {
        throw new Error('Failed to fetch timezone or weather data');
        }

        const [timezoneData, weatherData] = await Promise.all([
        timezoneResponse.json(),
        weatherResponse.json()
        ]);

        let description = '';

        if (wikiResponse.ok) {
        const wikiData = await wikiResponse.json();
        description = wikiData.extract;
        }

        onLocationSelect({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: timezoneData.zoneName,
        temperature: Math.round(weatherData.main.temp),
        weatherDescription: weatherData.weather[0].description,
        description: description
        });

        setQuery('');
        setSuggestions([]);
    } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to get location information. Please try again.');
    } finally {
        setIsLoading(false);
    }
    };

    return (
    <div className="relative w-full md:w-80">
        <div className="flex">
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search country or City..."
            className="w-full p-3 text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
            {isLoading ? 'Searching...' : 'Search'}
        </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((city) => (
            <li 
                key={city.id} 
                onClick={() => handleSelect(city)}
                className="p-3 hover:bg-gray-100 cursor-pointer text-lg"
            >
                {city.name}, {city.country}
            </li>
            ))}
        </ul>
        )}
    </div>
    );
}

export default CitySearch;

