import {useState} from "react";
import {login} from "../../services/authService.js";
import {useNavigate} from "react-router-dom";

function Login() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleInput = (e) => {
        const {name, value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log("email: ", input.email, " password: ", input.password);
            const token = await login(input.email, input.password);

            console.log("Token: ", token);
            navigate('/user/dashboard');
        } catch (error) {
            console.log("Login error: ", error);
        }
    }
    return (
        <form className='flex flex-col' onSubmit={handleLogin}>
            <label>Email</label>
            <input
                type='email'
                id='email'
                name='email'
                placeholder='example@email.com'
                value={input.email}
                onChange={handleInput}
            />
            <label>Password</label>
            <input
                type='password'
                id='password'
                name='password'
                value={input.password}
                onChange={handleInput}
            />
            <button>Submit</button>
        </form>
    )
}

export default Login;