import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {register} from "../../services/AuthService.js";

function Register() {
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        passwordRetype: ''
    });
    const [error, setError] = useState('');
    const[pwError, setPwError] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        setError('');
        setPwError('');
        const {name, value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (input.password !== input.passwordRetype) {
                setPwError("Passwords do not match");
                return;
            }
            console.log("email: ", input.email, " password: ", input.password);
            const token = await register(input.username, input.email, input.password);

            console.log("Token: ", token);
            navigate('/user/dashboard');
        } catch (error) {
            console.log("Login error: ", error);
            setError(error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen gap-[2rem]">
            <h1 className="text-[4rem]">Create Account</h1>
            <form className='flex flex-col w-[40rem] gap-[2rem]' onSubmit={handleSubmit}>
                <div className="flex flex-col items-start gap-[0.5rem]">
                    <label>Username</label>
                    <input
                        className="w-full input-default"
                        id='username'
                        name='username'
                        value={input.username}
                        onChange={handleInput}
                    />
                    <label>Email</label>
                    <input
                        className="w-full input-default"
                        type='email'
                        id='email'
                        name='email'
                        placeholder='example@email.com'
                        value={input.email}
                        onChange={handleInput}
                    />
                    <label>Password</label>
                    <input
                        className="w-full input-default"
                        type='password'
                        id='password'
                        name='password'
                        value={input.password}
                        onChange={handleInput}
                    />
                    <label>Retype Password</label>
                    <input
                        className="w-full input-default"
                        type='password'
                        id='passwordRetype'
                        name='passwordRetype'
                        value={input.passwordRetype}
                        onChange={handleInput}
                    />
                    {pwError && <div className="text-red-500">{pwError}</div>}
                </div>
                <button className="button-coloured">Create Account</button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            <Link to="/">Go back</Link>
        </div>
    )
}

export default Register;