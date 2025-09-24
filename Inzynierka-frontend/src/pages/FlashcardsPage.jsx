import React, { useState, useEffect } from 'react'
import CategoriesService from '../services/CategoryService.js';
import { FaPlusCircle } from "react-icons/fa";
import {Link, useLocation} from "react-router-dom";
import FlashcardsCreatingMenu from "../components/FlashcardsCreatingMenu.jsx";
import UserStore from "../stores/UserStore.js";
import { IoReturnUpBack } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import FlashcardMenu from "../components/FlashcardMenu.jsx";
import { Modal, Box, Typography, Button, Stack } from '@mui/material';


function FlashcardsPage() {

    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuOpen2, setIsMenuOpen2] = useState(null);
    const toggleMenu = (id) => {setIsMenuOpen2(curr => (curr === id ? null : id))}
    const { user } = UserStore()
    const userId = user.id;
    const location = useLocation()
    const addingMode = location.pathname === "/wybierz-zestaw"

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    const askDelete = (cat) => {
        setSelectedCategory(cat)
        setConfirmOpen(true)
        setIsMenuOpen2(null)
    }

    const confirmDelete = async () => {
        if (!selectedCategory) return

        try {
            setDeleting(true)
            await CategoriesService.deleteCategory(selectedCategory.id)
            setConfirmOpen(false)
            setSelectedCategory(null)
            await fetchCategories()
        } catch (e) {
            console.error("Błąd usuwania kategorii: ", e)
        } finally {
            setDeleting(false)
        }
    }

    const closeConfirm = () => {
        if (deleting) return
        setConfirmOpen(false)
        setSelectedCategory(null)
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
                    <FlashcardsCreatingMenu/>

                </div>
            </div>

            <Modal
                open={confirmOpen}
                onClose={closeConfirm}
                aria-labelledby="delete-category-title"
                aria-describedby="delete-category-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3
                    }}
                >
                    <Typography
                        id="delete-category-title"
                        variant="h6"
                        sx={{ fontWeight: 'bold' }}
                    >
                        Usuwanie kategorii
                    </Typography>

                    <Typography
                        id="delete-category-description"
                        sx={{ mt: 3 }}
                    >
                        Czy na pewno chcesz usunąć tę kategorię?<br></br>
                        Tej operacji nie można już cofnąć.
                    </Typography>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ mt: 3 }}
                    >
                        <Button
                            onClick={closeConfirm}
                            disabled={deleting}
                            sx={{ color: 'black' }}
                        >
                            Anuluj
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            variant="contained"
                            color="error"
                            disabled={deleting}
                        >
                            {deleting ? "Usuwanie..." : "Usuń"}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

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
                            const notAllowed = addingMode && !isOwned && user.role !== "admin"

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
                                <div className="relative hover:shadow-xl hover:scale-102 duration-400 ease-in-out transition">
                                    <Link key={cat.id} to={addingMode ? `/dodaj-fiszki/${cat.id}` : `/fiszki/${cat.id}`}>
                                        {card}
                                    </Link>

                                    {(userId === cat.owner || user.role === "admin")  && (
                                        <div>
                                            <button
                                                onClick={() => toggleMenu(cat.id)}
                                                className="absolute top-2 right-2 z-50 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow hover:shadow-md transition duration-300">
                                                <HiDotsVertical/>
                                            </button>
                                            <div
                                                className={`origin-top absolute right-0 top-12 z-100 transform transition-all duration-300 ease-in-out ${
                                                    isMenuOpen2 === cat.id ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                                                }`}
                                            >
                                                <FlashcardMenu id={cat.id} onDelete={() => askDelete(cat)} />
                                            </div>
                                        </div>
                                    )}
                                </div>
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