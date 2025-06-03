import { IoMdArrowBack } from 'react-icons/io'
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import CustomDatePicker from "../../../components/input/CustomDatePicker.jsx";
import Toggle from "../../../components/input/Toggle.jsx";
import CategoryPicker from "../../../components/input/CategoryPicker.jsx";
import AmountInput from "../../../components/input/AmountInput.jsx";
import {createTransaction} from "../../../services/TransactionService.js";

export default function CreateTransaction({onClose, onSubmit}) {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        title: '',
        desc: '',
        amount: '0',
        categoryName: '',
        colour: '',
        type: 'EXPENSE',
    })
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const [openAmount, setOpenAmount] = useState(false);

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

    const [error, setError] = useState({
        title: '',
        categoryName: '',
    })

    const handleSubmit = async () => {
        console.log("submit")
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
            await createTransaction(payload);
            onSubmit();
        } catch (error) {
            setError(prev => ({ ...prev, api: error || 'Failed to create transaction' }));
        }
    }

    return (
        <div className="relative flex flex-col py-[2rem] px-[4rem] w-full h-full gap-[2rem]">
            <button onClick={onClose} className="text-[3rem]"><IoMdArrowBack/></button>
            <h1 className="text-[3rem]">Add Transaction</h1>
            <div className="grid grid-cols-2 gap-[3rem] justify-center items-center">
                <Toggle
                    type={input.type}
                    setType={(newType) => {
                        setInput((prev) =>
                            ({...prev, type: newType, categoryName: '', colour: ''}))
                    }}
                    colour={input.colour}
                />
                <CustomDatePicker
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                />
            </div>
            <div className="grid grid-cols-2 gap-[3rem]">
                <div className="flex flex-col gap-[2rem]">
                    <button
                        className="flex bg-foreground py-[1rem] text-background px-[2rem] rounded-[2rem] w-full gap-[1rem] text-[2rem] items-center"
                        style={{ background: input.colour }}
                        onClick={() => setOpenAmount(true)}
                    >
                        <h1>Amount:</h1>
                        <p>${input.amount}</p>
                    </button>
                    <CategoryPicker
                        input={input}
                        setInput={setInput}
                        setError={setError}
                    />
                    {error.categoryName && <p className="text-red-500">{error.categoryName}</p>}
                </div>
                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[0.5rem]">
                        <input
                            id='title'
                            name='title'
                            placeholder='Title'
                            value={input.title}
                            onChange={handleInput}
                            className="w-full input-default"
                        />
                        {error.title && <p className="text-red-500">{error.title}</p>}
                    </div>
                    <textarea
                        id='desc'
                        name='desc'
                        placeholder='Notes'
                        value={input.desc}
                        onChange={handleInput}
                    />
                </div>
            </div>
            <div>
                <p>Title: {input.title}</p>
                <p>Desc: {input.desc}</p>
                <p>Category: {input.categoryName}</p>
                <p>Amount: {input.amount}</p>
                <p>Type: {input.type}</p>
                <p>{date.toLocaleDateString()}</p>
                <p>{time.toLocaleTimeString()}</p>
            </div>
            {error.api && <p className="text-red-500">{error.api}</p>}
            <button
                className="button-coloured"
                onClick={handleSubmit}
            >
                Create Transaction
            </button>
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