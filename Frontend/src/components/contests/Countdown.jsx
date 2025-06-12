import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const CountdownSegment = ({ value, label }) => (
        <div className="flex flex-col items-center bg-white/10 p-4 rounded-lg min-w-[80px]">
            <span className="text-4xl font-mono font-bold text-primary">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-sm text-white/70 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="flex justify-center items-center gap-4 my-8">
            <CountdownSegment value={timeLeft.days || 0} label="Days" />
            <CountdownSegment value={timeLeft.hours || 0} label="Hours" />
            <CountdownSegment value={timeLeft.minutes || 0} label="Minutes" />
            <CountdownSegment value={timeLeft.seconds || 0} label="Seconds" />
        </div>
    );
};

export default Countdown;