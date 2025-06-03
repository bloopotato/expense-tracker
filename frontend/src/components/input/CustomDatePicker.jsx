import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import {format, isThisYear, isToday, isYesterday} from "date-fns";

export default function DateTimePicker({ date, setDate, time, setTime }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const dateRef = useRef(null);
    const timeRef = useRef(null);

    const formatDate = (d) => {
        if (isToday(d)) return "Today";
        if (isYesterday(d)) return "Yesterday";
        return isThisYear(d)
            ? format(d,"d MMM")
            : format(d,"d MMM yyyy");
    }

    const hour = format(time, "HH");
    const minute = format(time, "mm");
    const ampm = format(time, "a");

    const handleClickOutside = (e) => {
        if (dateRef.current && !dateRef.current.contains(e.target)) {
            setShowDatePicker(false);
        }
        if (timeRef.current && !timeRef.current.contains(e.target)) {
            setShowTimePicker(false);
        }
    }

    return (
        <div className="flex w-full p-[1rem] rounded-[1rem] items-center hover:bg-secondary justify-between font-bold">
            <button onClick={() => setShowDatePicker(true)} className="relative flex items-center gap-[1rem]">
                <div className="bg-foreground text-background text-[2rem] p-[1rem] rounded-[1rem] items-center justify-center"><FaRegCalendarAlt/></div>
                <p>{formatDate(date)}</p>
            </button>

            <button onClick={() => setShowTimePicker(true)} className="flex items-center justify-center gap-[1rem]">
                <p className="p-time">{hour}</p>
                <p>:</p>
                <p className="p-time">{minute}</p>
                <p className="p-time">{ampm}</p>
            </button>

            {showDatePicker && (
                <div
                    className="absolute inset-0  h-screen z-50 flex items-center justify-center"
                    onClick={handleClickOutside}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div
                        className="z-60 w-[400px] bg-background text-foreground p-[2rem] rounded-[2rem] flex flex-col gap-[2rem]"
                        ref={dateRef}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <DatePicker
                            selected={date}
                            onChange={(d) => setDate(d)}
                            showDateSelect={true}
                            inline={true}
                        />
                        <button
                            onClick={() => setShowDatePicker(false)}
                            className="button-coloured"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {showTimePicker && (
                <div
                    className="absolute inset-0  h-screen z-50 flex items-center justify-center"
                    onClick={handleClickOutside}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div
                        className="z-60 w-[400px] bg-background text-foreground p-[2rem] rounded-[2rem] flex flex-col gap-[2rem]"
                        ref={timeRef}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <DatePicker
                            selected={time}
                            onChange={(t) => setTime(t)}
                            showTimeSelect={true}
                            showTimeSelectOnly={true}
                            inline={true}
                        />
                        <button
                            onClick={() => setShowTimePicker(false)}
                            className="button-coloured"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
