import React, { useState } from 'react'
import DictionaryService from '../services/DictionaryService.js'
import GermanyFlag from "../icons/GermanyFlag.jsx";
import PolandFlag from "../icons/PolandFlag.jsx";
import { TbRefresh } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";


export default function DictionaryInput({ onSearchResult, onWord }) {
    const [q, setQ] = useState('')
    const [error, setError] = useState(null)
    const [plToDe, setPlToDe] = useState(true)
    const [angle, setAngle] = useState(0)

    const handleDirectionChange = () => {
        setAngle(prevAngle => prevAngle - 180)
        setPlToDe(prev => !prev)
    }

    const handleSearch = async () => {
        if (!q.trim()) return
        setError(null)
        try {
            let data
            if (plToDe) {
                data = await DictionaryService.translate(q)
            } else {
                data = await DictionaryService.translate(q)
            }
            console.log(data)
            onSearchResult(data)
            onWord(q)
        } catch (err) {
            console.error(err)
            setError('Wystąpił błąd podczas wyszukiwania')
        }
    }

    return (
        <div className="p-4 w-full max-w-2xl mx-auto shadow-xl bg-[#f3f3f3] rounded-2xl">
            <div className="mb-2">
                <div
                    className={
                        `flex w-fit mx-auto rounded-xl items-center justify-center` +
                        `${plToDe ? '' : ' flex-row-reverse'}`
                    }
                >
                    <PolandFlag className="w-12 h-12 mx-4"/>
                    <button onClick={handleDirectionChange}>
                        <TbRefresh
                            className="transition-transform duration-500 text-3xl text-[#000080]"
                            style={{ transform: `rotate(${angle}deg)` }}
                        />
                    </button>
                    <GermanyFlag className="w-12 h-12 mx-4"/>
                </div>
                <input
                    id="query"
                    type="text"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="w-full p-[10px] text-[16px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3"

                placeholder="Wpisz słowo..."
                />
            </div>


            <button
                onClick={handleSearch}
                className=" flex ml-auto px-5 py-2 items-center bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
            >
                <FaSearch className="mr-2" /> Szukaj
            </button>

            {error && <p className="mt-2 text-red-600">{error}</p>}

        </div>
    )
}
