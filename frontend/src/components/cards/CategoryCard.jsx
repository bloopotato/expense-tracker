import { FaTrash } from "react-icons/fa";

export default function CategoryCard({ name, type, count, colour, onClick, onDelete }) {
    return (
        <div
            onClick={onClick}
            className="flex border-[0.3rem] rounded-[2rem] py-[1rem] px-[3rem] w-[50rem] justify-between items-center cursor-pointer"
            style={{ borderColor: colour, color: colour }}
        >
            <div className="flex flex-col items-start">
                <h1 className="text-[2rem]" >{name}</h1>
                <div className="flex flex-col items-start text-[1.2rem]">
                    <h2>{type}</h2>
                    <h3>{count} Transactions</h3>
                </div>
            </div>
            <button
                onClick={onDelete}
                className="text-[2rem]"
            >
                <FaTrash/>
            </button>
        </div>
    )
}