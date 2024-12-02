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
            <h2 className="text-5xl font-bold">{time || '--:-- --'}</h2>
        </div>
    );
}

export default TimeDisplay;

