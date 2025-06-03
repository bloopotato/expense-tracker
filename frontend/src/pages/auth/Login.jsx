import {useState} from "react";
import {login} from "../../services/AuthService.js";
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            console.log("email: ", input.email, " password: ", input.password);
            const token = await login(input.email, input.password);

            console.log("Token: ", token);
            navigate('/user/dashboard');
        } catch (error) {
            console.log("Login error: ", error);
            setError(error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen gap-[2rem]">
            <h1 className="text-[4rem]">Login</h1>
            <form className='flex flex-col w-[30rem] gap-[2rem]' onSubmit={handleSubmit}>
                <div className="flex flex-col items-start gap-[0.5rem]">
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
                </div>
                <button className="button-coloured">Login</button>
                {error && <div className="text-red-500">{error}</div>}
            </form>
            <Link to="/">Go back</Link>
        </div>
    )
}

export default Login;