import Navbar from "../../components/navbar/Navbar.jsx";
import {Outlet} from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen min-w-screen">
            <Navbar/>
            <main className="flex-1 relative min-w-0">
                <Outlet/>
            </main>
        </div>
    )
}