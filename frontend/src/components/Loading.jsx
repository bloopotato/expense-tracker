import { useEffect, useState } from 'react';

export default function Loading() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
            <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
            <p className="text-foreground">Loading{dots}</p>
        </div>
    );
}
