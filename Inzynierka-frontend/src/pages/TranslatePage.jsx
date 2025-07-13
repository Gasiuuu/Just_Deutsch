import React from 'react'
import GPTService from "../services/GPTService.js";
import { BiSolidRightArrow } from "react-icons/bi";


function TranslatePage() {

    // let getSentence = GPTService.generateSentenceTranslate()

    return (
        <div className="flex flex-col mt-10 justify-center items-center">
            <div className="bg-gray-100 rounded-md p-5 text-3xl">
                Przykładowe zdanie
            </div>
            <div className="flex flex-row mt-60">
                <input
                    className="w-lg p-[10px] text-[16px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3"
                    placeholder="Wpisz brakujące słowo..."
                />
                <button
                    className="ml-3 px-5 py-2 items-center bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                >
                    <BiSolidRightArrow />
                </button>
            </div>
        </div>
    )
}

export default TranslatePage;