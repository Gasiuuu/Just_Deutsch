import React, { useState, useEffect } from "react"
import CategoriesService from "../services/CategoryService.js";
import FlashcardService from "../services/FlashcardService.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FcImageFile} from "react-icons/fc";
import { FiEdit } from 'react-icons/fi'
import {MdDelete, MdOutlineSaveAlt} from 'react-icons/md'
import {IoIosArrowBack, IoMdAdd} from "react-icons/io";
import CategoryService from "../services/CategoryService.js";
import {Box, Button, Modal, Stack, Typography} from "@mui/material";


function EditFlashcardSet() {

    const [category, setCategory] = useState({})
    const [flashcards, setFlashcards] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { categoryId }= useParams()
    const navigate = useNavigate();

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);

    useEffect(() => {
        fetchCategory()
        fetchFlashcards()
        setLoading(false)
    }, [])

    const fetchCategory = async () => {
        try {
            const response = await CategoriesService.getCategoryById(categoryId)
            console.log('Otrzymano kategorie: ', response)
            setCategory(response)
        } catch(error) {
            console.error('Błąd wczytywania kategorii: ', error);
        }
    }

    const fetchFlashcards = async () => {
        try {
            const response = await FlashcardService.getFlashcardByCategoryId(categoryId)
            console.log('Otrzymano fiszki: ', response)
            setFlashcards(response)
        } catch(error) {
            console.error('Błąd wczytywania fiszek: ', error);
        }
    }

    const handleNameChange = (e) => {
        const value = e.target.value
        setCategory((prev) => ({...prev, name: value}))
    }

    const handleDeleteImage = () => {
        setCategory((prev) => ({...prev, image: null}))
        setImageFile(null)
    }

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file)
        const url = URL.createObjectURL(file);
        setCategory((prev) => ({...prev, image: url}))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const formData = new FormData()
            formData.append("name", category.name)
            if (imageFile) formData.append("image", imageFile)
            if (imageFile === null && category.image === null) formData.append("image", "")
            await CategoryService.editCategory(category.id, formData)
            navigate("/fiszki")
        } catch (e) {
            console.error("Wystąpił błąd przy nadpisywaniu kategorii: ", e)
        }
    }

    const handleDeleteFlashcard = async (flashcard) => {
        setSelectedFlashcard(flashcard)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedFlashcard) return

        try {
            setDeleting(true)
            await FlashcardService.deleteFlashcard(selectedFlashcard.id)
            setConfirmOpen(false)
            setSelectedFlashcard(null)
            await fetchFlashcards()
        } catch (e) {
            console.error("Błąd usuwania fiszki: ", e)
        } finally {
            setDeleting(false)
        }
    }

    const closeConfirm = () => {
        if (deleting) return
        setConfirmOpen(false)
        setSelectedFlashcard(null)
    }

    if (loading) {

        const rows = 10
        return (
            <div className="p-6 w-full">
                <h1 className="text-4xl font-semibold">Edytuj zestaw</h1>

                <div className=" my-15 flex items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center mr-10">
                        <div className="border-1 border-gray-300 rounded-2xl aspect-square text-7xl overflow-hidden">
                            <div className="w-50 h-50 animate-pulse bg-gray-200"></div>
                        </div>
                        <button className="w-30 h-10 rounded-md animate-pulse bg-gray-200 mt-10"></button>
                    </div>

                    <div className="relative w-1/2 mb-5">
                        <div className=" w-full h-1 p-[10px] border-b-[1px] border-b-[#ccc] animate-pulse bg-gray-200"></div>
                    </div>
                </div>

                <div className="w-3/4 shadow-md rounded-2xl mx-auto mt-20 mb-20 p-5">
                    {Array.from({length: rows}).map((_, i) => (
                        <div className="flex flex-row mt-5 justify-between mx-auto border-b-1 border-b-gray-200 items-center bg-gray-100 animate-pulse"
                             key={i}
                        >
                            <div className="aspect-square w-18 h-18 p-2 animate-pulse bg-gray-200"></div>

                            <div className="w-15 h-5 animate-pulse bg-gray-200"></div>
                            <div className="w-15 h-5 animate-pulse bg-gray-200"></div>

                            <div className="flex flex-row gap-3 p-2">
                                <div className="aspect-square w-8 h-8 animate-pulse bg-gray-200"></div>
                                <div className="aspect-square w-8 h-8 animate-pulse bg-gray-200"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex mt-15 mb-10 items-center justify-center w-full gap-20">
                    <div className="flex rounded-xl gap-2 w-32 h-16 bg-gray-200 animate-pulse"></div>
                    <div className="flex rounded-xl gap-2 w-32 h-16 bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 w-full">
            <h1 className="text-4xl font-semibold">Edytuj zestaw</h1>

            <div className=" my-15 flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center mr-10">
                    <div className="border-1 border-gray-300 rounded-2xl aspect-square text-7xl overflow-hidden">
                        {category.image ? (
                                <img src={category.image} alt="Podgląd zdjęcia"
                                     className="w-50 h-50 object-cover object-center"/>
                            ) :
                            <FcImageFile className="w-50 h-50 p-8"/>
                        }
                    </div>
                    <button
                        onClick={handleDeleteImage}
                        className={`w-full h-full px-4 py-2 transition-all duration-500 ease-in-out
                    ${category.image ? "opacity-100 translate-y-0 cursor-pointer" : "opacity-0 -translate-y-3 cursor-auto"}`}
                    >
                        Usuń zdjęcie
                    </button>


                    <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        alt="Dodaj zdjęcie"
                        className="p-3 hidden"
                        onChange={onFileChange}
                    />

                    <label
                        className="mt-3 px-5 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                        htmlFor="photo">
                        Dodaj zdjęcie
                    </label>


                </div>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="name"
                        type="text"
                        value={category.name}
                        onChange={handleNameChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="name"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Nazwa kategorii <span className="text-red-500"> *</span>
                    </label>
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
                        Czy na pewno chcesz usunąć fiszkę <strong>{selectedFlashcard?.front ? `"${selectedFlashcard.front}"` : 'tę kategorię'}</strong>?
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

            {flashcards.length !== 0 ? (
                <div className="w-3/4 shadow-md rounded-2xl mx-auto mt-20 mb-20 p-5">
                    {flashcards.map(flashcard => (
                        <div
                            className="flex flex-row mt-5 justify-between mx-auto border-b-1 border-b-gray-200 items-center"
                            key={flashcard.id}>
                            <img src={flashcard.image} alt="obrazek fiszki" className="w-18 h-18 p-2 object-cover object-center"/>
                            <p>{flashcard.front}</p>
                            <p>{flashcard.reverse}</p>
                            <div className="flex flex-row gap-3">
                                <Link to={`/edytuj-fiszke/${flashcard.id}`}>
                                    <button className="cursor-pointer">
                                        <FiEdit className="text-blue-500 w-6 h-6 mr-2"/>
                                    </button>
                                </Link>
                                <button className="cursor-pointer" onClick={() => handleDeleteFlashcard(flashcard)}>
                                    <MdDelete className="text-red-500 w-6 h-6 mr-2"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col w-3/4 shadow-md rounded-2xl justify-center mx-auto items-center mt-20 mb-20 p-5">
                    <div className="py-5 text-xl">
                        Zestaw jest pusty, dodaj fiszki
                    </div>
                    <Link to={`/dodaj-fiszki/${categoryId}`}>
                        <button
                            className="flex px-5 py-2 items-center bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]">
                            <IoMdAdd className="text-lg mr-2"/> Dodaj fiszki
                        </button>
                    </Link>
                </div>
            )}


            <div className="flex mt-15 mb-10 items-center justify-center w-full gap-20">
                <Link to="/fiszki">
                    <button
                        className="flex items-center justify-center text-center gap-2 px-8 py-4 hover:bg-gray-300 transition text-black text-xl font-medium border-1 border-gray-300 rounded-xl cursor-pointer bg-gray-200">
                        <IoIosArrowBack/> Powrót
                    </button>
                </Link>

                <button
                    onClick={handleSave}
                    className="flex items-center justify-center text-center gap-2 px-8 py-4 hover:bg-[#10A31B] transition text-white text-xl font-medium rounded-xl bg-[#11AB1E] cursor-pointer">
                    <MdOutlineSaveAlt/> {saving ? "Zapisywanie..." : "Zapisz"}
                </button>
            </div>
        </div>
    )
}

export default EditFlashcardSet