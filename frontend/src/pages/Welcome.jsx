import {useNavigate} from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen gap-[4rem] px-[30rem]">
            <div className="flex flex-col items-center gap-[1rem]">
                <h1 className="text-[6.4rem] font-bold">Expense Tracker</h1>
                <h2>Welcome to Expense Tracker, an application designed to help you manage your finances</h2>
            </div>
            <div className="flex flex-col gap-[1rem]">
                <button className="button-welcome" onClick={() => navigate('/auth/login')}>Login</button>
                <button className="button-welcome" onClick={() => navigate('/auth/register')}>Create Account</button>
            </div>
        </div>
    )
}