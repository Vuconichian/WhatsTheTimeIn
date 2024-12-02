import React, { useState } from 'react';

function CitySearch({ onLocationSelect }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        setError('');

        if (searchQuery.length > 2) {
        try {
            const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searchQuery}&limit=5`, {
            method: 'GET',
            headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setSuggestions(data.data || []);
        } catch (error) {
        console.error('Error searching for cities:', error);
        setError('Failed to search cities. Please try again.');
        setSuggestions([]);
        }
    } else {
        setSuggestions([]);
    }
    };

    const handleSelect = async (city) => {
        try {
        const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONEDB_API_KEY}&format=json&by=position&lat=${city.latitude}&lng=${city.longitude}`);
        if (!response.ok) {
            throw new Error('Failed to fetch timezone');
        }
        const data = await response.json();

        onLocationSelect({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: data.zoneName,
        temperature: null // We'll add temperature fetching later
        });
    
        setQuery('');
        setSuggestions([]);
    } catch (error) {
        console.error('Error fetching timezone:', error);
        setError('Failed to get timezone information. Please try again.');
    }
    };

    return (
        <div className="relative w-full md:w-80">
        <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search country or City..."
        className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

