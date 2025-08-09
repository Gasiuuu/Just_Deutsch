import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { IoNotifications } from 'react-icons/io5'
import { MdDarkMode } from 'react-icons/md'
import UserService from "../services/UserService.js";
import UserStore from "../stores/UserStore.js";
import { IoIosArrowDown } from "react-icons/io";
import UserMenu from "./UserMenu.jsx";


function Navbar() {
    const BACKEND_URL = import.meta.env.VITE_ENV_BACKEND_URL;

    const user = UserStore((state) => state.user)
    const clearUser = UserStore((state) => state.clearUser)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkAuth = "/strona-glowna"
    const linkUnauth = "/"



    const handleLogout = async () => {
        await UserService.logout()
        clearUser()
    }

    return (
        <nav
            className="
                relative
                flex items-center
                justify-between
                h-[var(--header-height)]
                px-5
                bg-white
                text-black
                shadow-[0_4px_8px_rgba(0,0,0,0.2),0_6px_20px_rgba(0,0,0,0.19)]
                z-10
            "
        >
            <Link to={user ? linkAuth : linkUnauth} className="flex items-center gap-2 no-underline text-black">
                <img
                    src={logo}
                    alt="logo"
                    className="w-8 h-8 object-contain"
                />
                <h1
                    className="
                      inline-block
                      origin-left
                      transform
                      scale-x-100
                      opacity-100
                      transition-all
                      duration-300
                      ease-in-out
                      text-[1.5rem]
                      text-black
                      font-semibold
                      italic

                      [@media(max-width:700px)]:scale-x-0
                      [@media(max-width:700px)]:opacity-0
                      [@media(max-width:620px)]:hidden
                    "
                >
                    Just_deutsch
                </h1>
            </Link>



            <div className="flex items-center gap-4">
                <Link
                    to="/kup"
                    className="px-3 py-1.5 rounded text-[1.2rem] font-medium text-white no-underline bg-[linear-gradient(45deg,#000080,#800080)]"
                >
                    Kup Premium
                </Link>

                <button className="bg-transparent border-0 cursor-pointer text-2xl p-2">
                    <MdDarkMode />
                </button>

                <button className="bg-transparent border-0 cursor-pointer text-2xl p-2">
                    <IoNotifications />
                </button>

                {user && (
                    <div className="flex items-center gap-2">
                            <img
                                src={`${BACKEND_URL}${user.avatar}`}
                                alt="avatar"
                                className="rounded-full w-10 h-10 object-cover"
                            />
                        <button
                            onClick={() => setIsMenuOpen(open => !open)}
                            className="flex items-center gap-1 focus:outline-none"
                        >
                            <IoIosArrowDown
                                className={`text-2xl transform transition-transform duration-300 
                                            ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>

                        <div
                            className={`origin-top absolute right-5 top-full transform transition-all duration-300 ease-in-out z-0 ${
                                isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                            }`}
                        >
                            <UserMenu onLogout={handleLogout} />
                        </div>
                    </div>
                )}

                {!user && (
                    <Link to="/logowanie" className="no-underline text-black font-medium text-[1.2rem] pointer">
                    Zaloguj się
                    </Link>
                )}


            </div>
        </nav>
    )
}

export default Navbar;
