import React, { useState, useEffect } from 'react'
import CategoriesService from '../services/CategoryService.js';
import { FaPlusCircle } from "react-icons/fa";
import {Link, useLocation} from "react-router-dom";
import FlashcardsMenu from "../components/FlashcardsMenu.jsx";
import UserStore from "../stores/UserStore.js";
import { IoReturnUpBack } from "react-icons/io5";


function FlashcardsPage() {

    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = UserStore()
    const userId = user.id;
    const location = useLocation()
    const addingMode = location.pathname === "/wybierz-zestaw"


    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await CategoriesService.getCategories()
            console.log('Otrzymano kategorie: ', response)
            setCategories(response)
        } catch(error) {
            console.error('Błąd wczytywania kategorii: ', error);
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-10">
                {addingMode ? (
                    <h1 className="text-4xl font-semibold">Wybierz zestaw, do którego chcesz dodać fiszki</h1>

                ): (
                    <h1 className="text-4xl font-semibold">Kategorie fiszek</h1>
                )}
                {addingMode && (
                    <Link to="/fiszki">
                        <button
                            className="flex flex-row cursor-pointer bg-red-700 text-white text-[1.2rem] font-semibold rounded-4xl px-4 py-2">
                            <IoReturnUpBack className="mr-2 mt-0.5"/> Wróć
                        </button>
                    </Link>
                )}
                <button
                    onClick={() => setIsMenuOpen(open => !open)}
                    className="flex flex-row px-4 py-2 rounded-4xl text-[1.2rem] font-semibold text-white no-underline bg-[linear-gradient(45deg,#000080,#800080)] cursor-pointer">
                    <FaPlusCircle className="text-2xl mr-2 mt-0.5"/>
                    Utwórz
                </button>

                <div
                    className={`origin-top absolute right-10 top-42 z-100 transform transition-all duration-300 ease-in-out ${
                        isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                    }`}
                >
                    <FlashcardsMenu/>

                </div>
                </div>

            {categories.length === 0
                ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
                    <div className="h-64 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>

                </div>
                : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {categories.map(cat =>{
                            const isOwned = !!userId && Number(cat.owner) === Number(userId)
                            const notAllowed = addingMode && !isOwned

                            const card = (
                            <div
                            key={cat.id}
                            className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="h-2/3 w-full relative overflow-hidden">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="h-1/3 w-full relative overflow-visible bg-[#f7f7f7]">
                                        <div
                                            className="absolute inset-0 bg-[#f7f7f7]"
                                            style={{
                                                transformOrigin: 'top left',
                                                transform: 'skewY(-8deg)'
                                            }}
                                        />
                                        <span
                                            className="absolute bottom-8 right-6 text-3xl font-semibold text-gray-800">
                                            {cat.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            )

                            if (notAllowed) {
                                return (
                                    <div key={cat.id}
                                         className="relative select-none cursor-not-allowed">
                                        <div className="opacity-50">
                                            {card}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center p-3">
                                        <span className="bg-yellow-500 text-white px-[4px] py-[2px] rounded-md shadow-md">
                                            Nie możesz edytować tej kategorii
                                        </span>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <Link key={cat.id} to={addingMode ? `/dodaj-fiszki/${cat.id}` : `/fiszki/${cat.id}`}>
                                    <div
                                        className="hover:shadow-xl hover:scale-102 duration-400 ease-in-out transition">
                                    {card}
                                    </div>
                                </Link>
                            )
                        }



                )}
        </div>
    )
}
</div>
)
}

export default FlashcardsPage