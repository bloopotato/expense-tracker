import { FaHome, FaMoneyBill, FaCog, FaEdit } from 'react-icons/fa'
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import {Link, useLocation, useNavigate} from "react-router-dom";
import DateTime from "../DateTime.jsx";
import {useState} from "react";
import NavItem from "./NavItem.jsx";

const navItems = [
    { name: "Home", path: "/user/dashboard", icon: <FaHome/> },
    { name: "Transactions", path: "/user/transactions", icon: <FaMoneyBill/> },
    { name: "Settings", path: "/user/settings", icon: <FaCog/> },
    { name: "Categories", path: "/user/categories", icon: <FaEdit/> },
]

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapse, setCollapse] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className={`flex flex-col h-screen bg-tertiary text-foreground py-[4rem] gap-[4rem]
            ${collapse ? "p-[1rem] items-center" : "p-[2rem]"} transition-all duration-300 ease-in-out
        `}>
            <div className="gap-[2rem] flex flex-col">
                <button
                    className="text-[2rem] w-fit"
                    onClick={() => setCollapse(prev => !prev)}
                >
                    <IoIosArrowBack className={`transition-transform duration-300 ${collapse ? "rotate-180" : ""}`} />
                </button>
                <div className={`transition-all duration-300 ${collapse ? "h-0 w-0 opacity-0" : "flex h-[12rem] items-center justify-center opacity-100"}`}>
                    <DateTime/>
                </div>
            </div>
            <nav className="flex flex-col gap-[2rem]">
                {navItems.map(item => (
                    <NavItem
                        key={item.name}
                        icon={item.icon}
                        name={item.name}
                        active={location.pathname.includes(item.path)}
                        collapsed={collapse}
                        path={item.path}
                    />
                ))}
                <button
                    onClick={handleLogout}
                    className={`flex h-[6rem] text-background} px-[3rem] gap-[4rem] items-center rounded-full
                    ${collapse ? "w-[6rem] justify-center" : "w-[25rem]"}
                    transition-all duration-300 ease-in-out hover:bg-secondary hover:text-background`}
                >
                    <span className="text-[2rem]"><FiLogOut/></span>
                    {!collapse && <span className="text-[1.8rem]">Logout</span>}
                </button>
            </nav>
        </div>
    )
}