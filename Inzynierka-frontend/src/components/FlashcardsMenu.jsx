import React from 'react'
import { BiSolidCategory } from "react-icons/bi";
import { TbCardsFilled } from "react-icons/tb";
import {Link} from "react-router-dom";


function FlashcardsMenu() {
    return (
        <div className="w-40 bg-white border border-gray-200 rounded-md shadow-lg">
            <Link to="/dodaj-kategorie">
                <button
                    className="flex gap-2 w-full text-center px-4 py-3 hover:bg-gray-100 text-black font-medium">

                    <BiSolidCategory className="text-orange-500 w-6 h-6 mr-2"/> Kategorię
                </button>
            </Link>

            <Link to="/wybierz-zestaw">
                <button className="flex gap-2 w-full text-center px-4 py-3 hover:bg-gray-100 text-black font-medium">
                    <TbCardsFilled className="text-blue-500 w-6 h-6 mr-2"/> Fiszki
                </button>
            </Link>


        </div>
    )
}

export default FlashcardsMenu;