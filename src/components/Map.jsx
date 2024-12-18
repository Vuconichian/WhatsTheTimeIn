import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ center, marker, onMapClick }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    
    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(center, 3);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        L.control.zoom({
            position: 'topleft'
        }).addTo(mapInstanceRef.current);
        
        if (onMapClick) {
            mapInstanceRef.current.on('click', (e) => {
                onMapClick(e.latlng);
            });
            }
        }
            return () => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.off();
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                }
                };
            }, []);
            useEffect(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom());
            
                    if (marker.name) {
                        if (markerRef.current) {
                            markerRef.current.setLatLng([marker.latitude, marker.longitude]);
                    } else {
                        markerRef.current = L.marker([marker.latitude, marker.longitude]).addTo(mapInstanceRef.current);
                    }
                    markerRef.current.bindPopup(marker.name).openPopup();
                    mapInstanceRef.current.setView([marker.latitude, marker.longitude], 10);
                    }
                }
            }, [center, marker]);
            
                return <div ref={mapRef} className="w-full h-full" />;
            }
            
            export default Map;