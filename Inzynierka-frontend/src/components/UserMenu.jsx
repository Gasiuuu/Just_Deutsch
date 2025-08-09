import React from 'react'
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import {Link} from "react-router-dom";


function UserMenu({ onLogout }) {
    return (
        <div className="w-50 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <Link to="/ustawienia">
                <button
                    className="flex items-center justify-center w-full text-center px-4 py-3 hover:bg-gray-100 text-black font-medium">

                    <IoSettingsSharp className="text-gray-500 w-6 h-6 mr-2"/> Ustawienia
                </button>
            </Link>

            <Link to="/start">
                <button onClick={onLogout}
                        className="flex items-center justify-center w-full text-center px-4 py-3 hover:bg-gray-100 text-black font-medium">
                    <IoMdLogOut className="text-red-500 w-6 h-6 mr-2"/> Wyloguj się
                </button>
            </Link>


        </div>
    )
}

export default UserMenu;