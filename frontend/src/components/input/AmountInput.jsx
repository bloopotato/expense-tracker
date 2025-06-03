import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaBackspace } from "react-icons/fa";

export default function AmountInput({ onClose, onSetAmount }) {
    const [rawInput, setRawInput] = useState("");
    const [decimalMode, setDecimalMode] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        const [dollars, cents] = rawInput.split(".");
        const amount = parseFloat(
            `${dollars || 0}.${(cents || "").padEnd(2, "0")}`
        );
        onSetAmount(amount.toFixed(2));
        onClose();
    };

    const getDecimalDigits = (input) => {
        const parts = input.split(".");
        return parts[1]?.length || 0;
    };

    const processInput = (key) => {
        const isDigit = /^\d$/.test(key);
        const currentDecimalDigits = getDecimalDigits(rawInput);

        if (key === "backspace" || key === "Backspace") {
            if (decimalMode && currentDecimalDigits > 0) {
                setRawInput((prev) => prev.slice(0, -1));
            } else if (decimalMode && currentDecimalDigits === 0) {
                setRawInput((prev) => {
                    setDecimalMode(false);
                    return prev.slice(0, -1); // Remove "."
                });
            } else {
                setRawInput((prev) => prev.slice(0, -1));
            }
        } else if (isDigit) {
            if (decimalMode && currentDecimalDigits < 2) {
                setRawInput((prev) => prev + key);
            } else if (!decimalMode) {
                setRawInput((prev) => {
                    const stripped = prev.replace(/^0+/, "");
                    return (stripped + key) || "0";
                });
            }
        } else if (key === "." && !decimalMode) {
            setRawInput((prev) => prev + ".");
            setDecimalMode(true);
        }
    };

    const handleKeyDown = (e) => {
        e.preventDefault();

        if (e.key === "Escape") {
            onClose();
            return;
        }

        if (e.key === "Enter") {
            handleSubmit();
            return;
        }

        processInput(e.key);
    };

    const handleKeypadInput = (key) => {
        // Map "backspace" string from keypad to "Backspace"
        processInput(key === "backspace" ? "Backspace" : key);
    };

    const formatDisplay = () => {
        let [dollars, cents = ""] = rawInput.split(".");
        if (dollars === "") dollars = "0";
        cents = cents.padEnd(2, "0").slice(0, 2);
        return `$${decimalMode ? `${dollars}.${cents}` : dollars}`;
    };

    return (
        <div className="absolute flex inset-0 z-50 justify-center items-center">
            <div className="bg-black opacity-50 w-full h-full"></div>
            <div
                ref={containerRef}
                className="absolute flex flex-col bg-white rounded-[3rem] p-[3rem] w-[50rem] gap-[1rem] items-center outline-none"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* Header */}
                <div className="flex justify-between items-center text-[2.4rem] w-full">
                    <h1>Enter Amount</h1>
                    <IoClose onClick={onClose} className="cursor-pointer" />
                </div>
                {/* Amount Display */}
                <span className="self-end text-[3.6rem]">{formatDisplay()}</span>
                {/* Keypad */}
                <div className="grid grid-cols-3 gap-[0.5rem] mt-8 text-[2rem] font-bold">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
                        <button
                            key={key}
                            onClick={() => handleKeypadInput(key)}
                            className="bg-tertiary p-6 rounded-[1rem] hover:bg-secondary flex justify-center items-center"
                        >
                            {key === "backspace" ? <FaBackspace size={32} /> : key}
                        </button>
                    ))}
                </div>
                {/* Submit Button */}
                <button className="button-coloured" onClick={handleSubmit}>
                    Set Amount
                </button>
            </div>
        </div>
    );
}
