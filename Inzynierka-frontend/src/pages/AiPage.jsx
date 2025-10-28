import React, {useState, useEffect } from 'react'
import CategoryService from "../services/CategoryService.js";
import GapFill from "../icons/GapFill.jsx";
import {Link} from "react-router-dom";
import Dialog from "../icons/Dialog.jsx";


function AiPage () {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await CategoryService.getCategories()
            console.log('Otrzymano kategorie: ', response)
            setCategories(response)
        } catch(error) {
            console.error('Błąd wczytywania kategorii: ', error);
        } finally {
            setLoading(false)

        }    }

    if (loading) {
        const rows = 5

        return (
            <div className="flex flex-col p-6">
                <h1 className="text-4xl font-semibold mb-20">Wybór kategorii</h1>

                {Array.from({length: rows}).map((_, i) => (
                    <div
                        className="w-full h-25 px-15 flex text-2xl flex-row justify-between items-center mx-auto mb-10 rounded-xl border border-gray-100 shadow-md bg-gray-50 animate-pulse"
                        key={i}
                    >
                        <div className="w-20 h-20 p-2 rounded-full bg-gray-200"></div>
                        <div className="flex-1 pl-8">
                            <div className="flex-1 w-40 h-5 bg-gray-200"></div>
                        </div>
                        <div className="justify-center items-center mr-8">
                            <div className="w-30 h-5 bg-gray-200"></div>
                        </div>
                        <div className="justify-center items-center">
                            <div className="w-15 h-5 bg-gray-200"></div>
                        </div>
                    </div>
                ))}

            </div>
        )
    }

    return (
        <div className="flex flex-col p-6">
            <h1 className="text-4xl font-semibold mb-20">Wybór kategorii</h1>

            {categories.map((category) => (
                <button
                    className="w-full px-15 flex text-2xl flex-row justify-between items-center mx-auto mb-10 rounded-xl border-1 border-gray-200 shadow-md hover:shadow-lg bg-gray-50 hover:bg-gray-100 transition-all duration-500 hover:-translate-y-1"
                    key={category.id}
                    >
                    <img
                        className="w-25 h-25 p-2 object-cover object-center rounded-full overflow-hidden flex-shrink-0"
                        src={category.image} alt={category.name}/>
                    <div className="flex-1 text-left pl-8">
                        <h5>{category.name}</h5>
                    </div>

                    <div className="flex gap-5">
                        <Link to={`gap-fill/${category.id}`}>
                            <button
                                className=" flex ml-auto px-5 py-2 items-center bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                            >
                                <GapFill className="w-6 h-6 mr-2"/>
                                Gap Fill
                            </button>
                        </Link>

                        <Link to={`tlumaczenia/${category.id}`}>
                            <button
                                className=" flex ml-auto px-5 py-2 items-center bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                            >
                                <Dialog className="w-6 h-6 mr-2" />
                                Tłumaczenia
                            </button>
                        </Link>

                    </div>

                </button>
            ))}
        </div>
    )
}

export default AiPage