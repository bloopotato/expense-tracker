import { useState, useEffect, useRef } from "react";

export default function MonthSlider({ minDate, maxDate, onChange }) {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const containerRef = useRef(null);
    const monthRefs = useRef({});

    useEffect(() => {
        if (!minDate || !maxDate || selectedMonth) return;

        const now = new Date();
        now.setDate(1);
        const inRange = now >= minDate && now <= maxDate;
        const defaultMonth = inRange ? now : minDate;

        setSelectedMonth(defaultMonth);
        onChange(defaultMonth);
    }, [minDate, maxDate, selectedMonth]);


    const getMonthsArray = (start, end) => {
        const months = [];
        const date = new Date(start);
        date.setDate(1);

        while (date <= end) {
            months.push(new Date(date));
            date.setMonth(date.getMonth() + 1);
        }
        return months;
    };

    const months = (minDate && maxDate) ? getMonthsArray(minDate, maxDate) : [];

    const formatMonth = (date) =>
        date.toLocaleDateString("en-US", { year: "numeric", month: "short" });

    const handleSelect = (month) => {
        setSelectedMonth(month);
        onChange(month);
    };

    // Scroll selected month to center
    useEffect(() => {
        if (!selectedMonth) return;

        const key = selectedMonth.toISOString().slice(0, 7);
        const selectedEl = monthRefs.current[key];

        if (selectedEl) {
            selectedEl.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    }, [selectedMonth]);

    return (
        <div
            ref={containerRef}
            className="overflow-x-auto w-full py-2 scrollbar-custom"
        >
            <div
                className="flex"
                style={{ minWidth: "max-content" }}
            >
                {months.map((month) => {
                    const isSelected =
                        selectedMonth &&
                        month.getFullYear() === selectedMonth.getFullYear() &&
                        month.getMonth() === selectedMonth.getMonth();
                    const key = month.toISOString().slice(0, 7);
                    return (
                        <button
                            key={month.toISOString().slice(0, 7)}
                            ref={(el) => (monthRefs.current[key] = el)}
                            onClick={() => handleSelect(month)}
                            className={`relative whitespace-nowrap w-[11rem] py-[1rem] rounded-[1rem] flex justify-center cursor-pointer hover:bg-tertiary outline-foreground
                                ${isSelected
                                ? "text-foreground  font-bold"
                                : "text-secondary font-normal"}
                            `}
                        >
                            {formatMonth(month)}
                            {isSelected && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[0.3rem] bg-foreground rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
