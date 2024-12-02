import React, { useState } from 'react';
import Map from './components/Map';
import CitySearch from './components/CitySearch';
import TimeDisplay from './components/TimeDisplay';
import 'leaflet/dist/leaflet.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState({
    name: '',
    country: '',
    latitude: 0,
    longitude: 0,
    timezone: '',
    temperature: null,
  });

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-bold p-4 bg-gray-100">What's the Time In?</h1>
      <div className="flex-grow relative" style={{ height: '60vh' }}>
        <Map
          center={[selectedLocation.latitude || 0, selectedLocation.longitude || 0]}
          marker={selectedLocation}
        />
      </div>
      <div className="bg-white p-6 shadow-md" style={{ height: '30vh' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-6 h-full">
          {/* Contenedor para el buscador y la ciudad */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <CitySearch onLocationSelect={setSelectedLocation} />
            <div className="text-center">
              {selectedLocation.name ? (
                <>
                  <p className="text-xl font-semibold">
                    {selectedLocation.name}, {selectedLocation.country}
                  </p>
                  {selectedLocation.temperature !== null && (
                    <p className="text-lg">{selectedLocation.temperature}°C</p>
                  )}
                </>
              ) : (
                <p className="text-lg text-gray-500">
                  Select a city to see its time and information
                </p>
              )}
            </div>
          </div>
          <TimeDisplay location={selectedLocation} />
        </div>
      </div>
    </div>
  );
}

export default App;
