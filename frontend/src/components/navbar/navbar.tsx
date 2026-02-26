import { LogoutButton } from "../auth/logoutButton"

export const Navbar = () => {
    return (
        <nav className="h-12 border-b-2 shadow-sm bg-slate-100 w-full flex justify-between items-center px-3">
            <p>
                Navbar
            </p>
            <LogoutButton/>
        </nav>
    )
}