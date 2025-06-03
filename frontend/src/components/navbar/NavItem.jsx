import {Link} from "react-router-dom";

export default function NavItem({ icon, name, active, collapsed, path }) {
    return (
        <Link
            to={path}
            className={`flex h-[6rem] text-foreground gap-[4rem] items-center rounded-full
                ${active ? " bg-primary text-tertiary" : ""}
                ${collapsed ? "w-[6rem] justify-center " : "w-[25rem] px-[3rem]"}
                transition-all duration-300 ease-in-out cursor-pointer hover:bg-secondary hover:text-background
            `}
        >
            <span className="text-[2rem] pointer-events-auto">{icon}</span>
            {!collapsed && <span className="text-[1.8rem] whitespace-nowrap">{name}</span>}
        </Link>
    )
}