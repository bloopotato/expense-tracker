import {useAuth} from "../../services/AuthProvider.jsx";

export default function Dashboard() {
    const { user } = useAuth()
    const token = localStorage.getItem('token');
    return (
        <div className="h-screen p-[3rem]">
            <h1 className="flex self-start text-[3.6rem]">Hello {user?.username}!</h1>
        </div>
    )
}