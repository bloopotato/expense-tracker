import {useState} from "react";
import Toggle from "../../../components/input/Toggle.jsx";
import ColourPicker from "../../../components/input/ColourPicker.jsx";
import {editCategory} from "../../../services/CategoryService.js";

export default function EditCategory({ category, onClose, onSave }) {
    const [input, setInput] = useState({ ...category });
    const [error, setError] = useState('');

    const handleInput = (e) => {
        const {name, value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    {/* Save edit */}
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await editCategory(category.id, input.name, input.colour, input.type);
            onSave();
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }

    return (
        <div
            className="flex flex-col border-[0.3rem] rounded-[2rem] w-[60rem] p-[2rem] gap-[1rem]"
            style={{ borderColor: input.colour, color: input.colour }}
        >
            <Toggle
                type={input.type}
                setType={(newType) => setInput((prev) => ({ ...prev, type: newType }))}
                colour={input.colour}
            />
            <input
                className="outline-offset-4 text-[2rem] input-default"
                style={{ borderColor: input.colour, outlineColor: input.colour }}
                id='name'
                name='name'
                value={input.name}
                onChange={handleInput}
            />
            <ColourPicker
                input={input.colour}
                setInput={(newColour) => setInput((prev) => ({ ...prev, colour: newColour }))}
            />
            {!error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-[4rem] justify-center">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-red-100 w-[20rem] py-[0.5rem] rounded-[1rem] justify-center"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="text-background w-[20rem] py-[0.5rem] rounded-[1rem] justify-center"
                    style={{ background: input.colour }}
                >
                    Save
                </button>
            </div>
        </div>
    )
}