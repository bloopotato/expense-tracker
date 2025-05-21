import {useNavigate} from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome</h1>
            <button onClick={() => navigate('/auth/login')}>Login</button>
            <button onClick={() => navigate('/auth/register')}>Register</button>
        </div>
    )
}

export default Welcome;