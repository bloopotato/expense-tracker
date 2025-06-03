import {useEffect, useState} from "react";

export default function DateTime() {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        setDate(new Date());
        const timer = setInterval(() => setDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const time = date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
    const day = date.toLocaleDateString('en-US', {weekday: 'long'})
    const fullDate = date.toLocaleDateString('en-US',
        {month: 'long', day: 'numeric', year: 'numeric'})

    return (
        <div>
            <h1 className="text-[4rem]">{time}</h1>
            <div className="text-primary">
                <p>{day}</p>
                <p>{fullDate}</p>
            </div>
        </div>
    )
}