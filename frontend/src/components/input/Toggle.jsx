export default function Toggle({ type, setType, colour }) {
    const lightenColor = (colour, percent) =>  {
        // Remove '#' if present
        colour = colour.replace('#', '');
        // If 3-digit shorthand (#abc), convert to 6-digit
        if (colour.length === 3) {
            colour = colour.split('').map(c => c + c).join('');
        }
        // Parse R, G, B
        const r = parseInt(colour.substr(0, 2), 16);
        const g = parseInt(colour.substr(2, 2), 16);
        const b = parseInt(colour.substr(4, 2), 16);
        // Calculate lighter RGB values
        const lighten = (channel) =>
            Math.min(255, Math.floor(channel + (255 - channel) * (percent / 100)));
        const newR = lighten(r);
        const newG = lighten(g);
        const newB = lighten(b);
        // Convert back to hex and return
        const toHex = (c) => c.toString(16).padStart(2, '0');
        return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
    }

    const textColour = colour ? lightenColor(colour, 50) : null;

    return (
        <div
            className="relative flex bg-primary rounded-[2rem] h-fit w-full py-[1rem] items-center transition-all duration-300"
            style={colour ? { background: textColour, color: colour } : null}
        >
            {/* Sliding background */}
            <div
                className={`absolute bg-foreground h-full w-[calc(50%)] rounded-[2rem] transition-all duration-300 ${
                    type === "EXPENSE" ? "translate-x-0" : "translate-x-full"
                }`}
                style={colour ? { background: colour } : null}
            ></div>

            {/* Buttons */}
            <button
                onClick={() => setType("EXPENSE")}
                className={`z-10 w-1/2 text-center font-bold transition-colors duration-300 justify-center ${
                    type === "EXPENSE" ? "text-background" : ""
                }`}
            >
                Expense
            </button>
            <button
                onClick={() => setType("INCOME")}
                className={`z-10 w-1/2 text-center font-bold transition-colors duration-300 justify-center ${
                    type === "INCOME" ? "text-background" : ""
                }`}
            >
                Income
            </button>
        </div>
    )
}