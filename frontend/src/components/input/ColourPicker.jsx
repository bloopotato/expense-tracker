const colours = [
    "#83bc6b",
    "#61a599",
    "#73c3d9",
    "#6d9ff3",
    "#4848b4",
    "#ffafcc",
    "#7750c1",
    "#9941bb",
    "#d35c54",
    "#e3784a",
    "#eaad34",
    "#7f8f9c",
]

export default function ColourPicker({ input, setInput }) {
    return (
        <div className="flex gap-[1rem] overflow-auto p-[1rem] w-full scrollbar-custom">
            {colours.map((colour) => (
                <button
                    key={colour}
                    className={`w-[5rem] h-[5rem] rounded-full flex-shrink-0 ${input === colour ? "ring-3 ring-foreground" : ""}`}
                    style={{ backgroundColor: colour }}
                    onClick={() => setInput(colour)}
                />
            ))}
        </div>
    )
}
