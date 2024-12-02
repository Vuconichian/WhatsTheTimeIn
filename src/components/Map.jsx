import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ center, marker }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
            center: center,
            zoom: 3,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        L.control.zoom({
            position: 'topleft'
        }).addTo(mapInstanceRef.current);

        setMapReady(true);
    }

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
    }, []);

    useEffect(() => {
        if (mapReady && mapInstanceRef.current) {
        mapInstanceRef.current.setView(center, 3);

        if (marker.name) {
            if (markerRef.current) {
                markerRef.current.setLatLng([marker.latitude, marker.longitude]);
            } else {
                markerRef.current = L.marker([marker.latitude, marker.longitude]).addTo(mapInstanceRef.current);
            }
            markerRef.current.bindPopup(marker.name).openPopup();
            mapInstanceRef.current.setView([marker.latitude, marker.longitude], 5);
        }
    }
    }, [mapReady, center, marker]);

    return <div ref={mapRef} className="absolute inset-0"></div>;
}

export default Map;

