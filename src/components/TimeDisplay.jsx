import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

function TimeDisplay({ location }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        if (location.timezone) {
        const updateTime = () => {
        setTime(moment().tz(location.timezone).format('h:mm A'));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }
    }, [location.timezone]);

    return (
        <div className="text-center">
            <h2 className="text-5xl font-bold mb-2">{time || '--:-- --'}</h2>
            {location.temperature !== null && (
            <p className="text-2xl">
                {location.temperature}°C
                {location.weatherDescription && (
                <span className="ml-2 text-lg">{location.weatherDescription}</span>
                )}
            </p>
            )}
        </div>
    );
}

export default TimeDisplay;

