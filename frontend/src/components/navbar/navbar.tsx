import { useAuth } from "../auth/authContext"
import { LogoutButton } from "../auth/logoutButton"

export const Navbar = () => {
    const auth = useAuth()
    return (
        <nav className="h-12 border-b-2 shadow-sm bg-slate-100 w-full flex justify-between items-center px-3">
            <p>
                Navbar
            </p>
            <p className="text-green-500 truncate w-36">
                User: {auth.accessToken}
            </p>
            <LogoutButton/>
        </nav>
    )
}