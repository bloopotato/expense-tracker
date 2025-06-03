import Toggle from "../../../components/input/Toggle.jsx";
import {useState} from "react";
import {IoMdArrowBack} from "react-icons/io";
import {createCategory} from "../../../services/CategoryService.js";
import ColourPicker from "../../../components/input/ColourPicker.jsx";



const colours = [
    "#83bc6b",
    "#61a599",
    "#73c3d9",
    "#6d9ff3",
    "#4848b4",
    "#7750c1",
    "#9941bb",
    "#d35c54",
    "#eaad34",
]

export default function CreateCategory({ onClose, refresh }) {
    const [input, setInput] = useState({
        name: '',
        colour: '',
        type: 'EXPENSE',
    })
    const [error, setError] = useState('');

    const handleInput = (e) => {
        const {name, value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory(input.name, input.colour, input.type);
            onClose();
            refresh();
        } catch (error) {
            setError(error);
        }
    }

    return (
        <div className="flex flex-col gap-[2rem] justify-center items-center w-[50rem]">
            <button onClick={() => {onClose(); refresh()}} className="text-[3rem]"><IoMdArrowBack/></button>
            <h1>Add Category</h1>
            <Toggle
                type={input.type}
                setType={(newType) => setInput((prev) => ({ ...prev, type: newType }))}
            />
            <input
                id='name'
                name='name'
                placeholder='Name'
                value={input.name}
                onChange={handleInput}
                className="input-default w-full"
            />
            <ColourPicker
                input={input.colour}
                setInput={(newColour) => setInput((prev) => ({ ...prev, colour: newColour }))}
            />
            <p>{input.colour}</p>
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleSubmit} className="button-coloured">Add Category</button>
        </div>
    )
}