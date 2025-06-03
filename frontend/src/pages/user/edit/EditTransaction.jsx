import {useState} from "react";
import Toggle from "../../../components/input/Toggle.jsx";
import CustomDatePicker from "../../../components/input/CustomDatePicker.jsx";
import CategoryPicker from "../../../components/input/CategoryPicker.jsx";
import AmountInput from "../../../components/input/AmountInput.jsx";
import {editTransaction} from "../../../services/TransactionService.js";
import { FaTrash } from "react-icons/fa";
export default function EditTransaction({ transaction, onClose, onSave, onDelete }) {
    const [input, setInput] = useState({...transaction});
    const [error, setError] = useState({
        title: '',
        categoryName: '',
    })

    const [openAmount, setOpenAmount] = useState(false);

    // Split input date to date and time
    const rawDate = input.date.replace(" ", "T");
    const initialDate = new Date(rawDate);
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialDate);

    const handleInput = (e) => {
        const {name, value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(prev => ({
            ...prev,
            [name]: '',
        }));
    }

    {/* Save edit */}
    const handleSave = async (e) => {
        const newErrors = {
            title: input.title === '' ? 'Title cannot be empty' : '',
            categoryName: input.categoryName === '' ? 'Category cannot be empty' : '',
        };
        setError(newErrors);
        if (newErrors.title || newErrors.categoryName) return;

        const combinedDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds(),
        ).toISOString();

        const payload = {
            title: input.title,
            description: input.desc,
            amount: parseFloat(input.amount),
            type: input.type,
            categoryName: input.categoryName,
            date: combinedDateTime,
        }

        try {
            await editTransaction(transaction.id, payload);
            onSave();
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }

    return (
        <div className="flex flex-col border-[0.3rem] rounded-[1rem] px-[2rem] py-[1rem] gap-[1rem]">
            <div className="flex justify-between items-center gap-[2rem]">
                {/* Edit Transaction Date */}
                <CustomDatePicker
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                />
                <div className="flex w-[5rem] items-center justify-center">
                    <FaTrash
                        className="text-[2.4rem] text-primary cursor-pointer hover:text-red hover:text-[3rem] transition-all duration-200 ease-in-out"
                        onClick={onDelete}
                    />
                </div>
            </div>
            {/* Edit Transaction Type */}
            <Toggle
                type={input.type}
                setType={(newType) => setInput((prev) =>
                    ({ ...prev, type: newType, categoryName: '', colour: '' })
                )}
                colour={input.colour}
            />
            {/* Edit Transaction Title */}
            <input
                id='title'
                name='title'
                placeholder='Title'
                value={input.title}
                onChange={handleInput}
                className="input-default"
            />
            {error.title && <p className="text-red-500">{error.title}</p>}
            {/* Edit Transaction Description */}
            <textarea
                id='desc'
                name='desc'
                placeholder='Notes'
                value={input.desc}
                onChange={handleInput}
            />
            {/* Edit Transaction Amount */}
            <button
                className="flex bg-foreground py-[1rem] text-background px-[2rem] rounded-[2rem] w-full gap-[1rem] items-center"
                style={{ background: input.colour }}
                onClick={() => setOpenAmount(true)}
            >
                <h1>Amount:</h1>
                <p>${input.amount}</p>
            </button>
            {/* Edit Transaction Category */}
            <CategoryPicker
                input={input}
                setInput={setInput}
                setError={setError}
                textSize="text-[1.6rem]"
            />
            {error.categoryName && <p className="text-red-500">{error.categoryName}</p>}
            <div className="flex gap-[4rem] justify-center">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-red-100 w-[20rem] py-[0.5rem] rounded-[1rem] justify-center"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="text-background w-[20rem] py-[0.5rem] rounded-[1rem] justify-center bg-foreground"
                    style={{ background: input.colour }}
                >
                    Save
                </button>
            </div>
            {openAmount && (
                <AmountInput
                    initialAmount={input.amount}
                    onClose={() => setOpenAmount(false)}
                    onSetAmount={(amount) => setInput((prev) => ({...prev, amount}))}
                />
            )}
        </div>
    )
}