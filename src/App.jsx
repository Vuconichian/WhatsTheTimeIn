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
    weatherDescription: '',
    description: ''
  });

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-bold p-4 bg-gray-100">What's the Time In?</h1>
      <div className="flex-grow relative" style={{ height: '60vh' }}>
        <Map 
          center={[selectedLocation.latitude || 0, selectedLocation.longitude || 0]} 
          marker={selectedLocation}
        />
      </div>
      <div className="bg-white p-10 shadow-md" style={{ height: '30vh', overflowY: 'auto' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <CitySearch onLocationSelect={handleLocationSelect} />
          <TimeDisplay location={selectedLocation} />
          <div className="text-left">
            {selectedLocation.name ? (
              <>
                <h2 className="text-xl font-semibold mb-2">{selectedLocation.name}, {selectedLocation.country}</h2>
                {selectedLocation.description && (
                  <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
                )}
              </>
            ) : (
              <p className="text-lg text-gray-500">Select a city to see its time and information</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-100 text-center">Develop by <a href="https://github.com/Vuconichian" target="_blank" rel="noopener noreferrer">Ian Vuconich</a></div>
    </div>
  );
}

export default App;

