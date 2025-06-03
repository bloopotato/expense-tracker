import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

export default function TransactionCard({ title, category, colour, amount, type, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex w-full justify-between items-center hover:bg-tertiary px-[2rem] py-[1rem] rounded-[1rem] cursor-pointer border-[0.3rem]"
        >
            {/* Title */}
            <div className="flex flex-col items-start">
                <span className="text-[1.8rem]">{title}</span>
                <span
                    className="text-[1.2rem] border-[0.3rem] rounded-[0.5rem] px-[1rem]"
                    style={{ color: colour }}
                >
                    {category}
                </span>
            </div>
            {/* Amount */}
            <div
                className={`
                    flex items-center
                    ${type === "EXPENSE" ? "text-[#D7263D]" : "text-[#38B000]"}
                `}
            >
                {type === "EXPENSE" ? <GoTriangleDown/> : <GoTriangleUp/>}
                <span>${amount}</span>
            </div>
        </div>
    )
}