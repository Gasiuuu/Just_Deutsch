import React, {useEffect, useState} from 'react'
import {FcImageFile} from "react-icons/fc";
import {Link, useNavigate} from "react-router-dom";
import {MdOutlineSaveAlt} from "react-icons/md";
import FlashcardService from "../services/FlashcardService.js";
import { useParams } from "react-router-dom";
import {IoIosArrowBack} from "react-icons/io";

function EditFlashcardPage() {

    const [flashcard, setFlashcard] = useState({
        front: "",
        reverse: "",
        synonym: "",
        plural: "",
        article: "",
        color: "",
        example_sentence: "",
        example_sentence_translation: "",
        image: null,
        category: "",
    });

    const [imageFile, setImageFile] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)

    const navigate = useNavigate();
    const { flashcardId } = useParams();


    useEffect(() => {
        fetchFlashcard()
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [])

    const fetchFlashcard = async () => {
        try {
            const response = await FlashcardService.getFlashcardById(flashcardId)
            console.log('Otrzymano fiszkę: ', response)
            setFlashcard(response)
        } catch(error) {
            console.error('Błąd wczytywania fiszki: ', error);
        }
    }

    const handleDeleteImage = () => {
        setFlashcard((prev) => ({...prev, image: null}))
        setImageFile(null)
    }

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file)
        const url = URL.createObjectURL(file);
        setImageUrl(url)
        setFlashcard((prev) => ({...prev, image: url}))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFlashcard((prev) => ({...prev, [name]: value}))
    }

    const handleSave = async () => {

        try {
            const formData = new FormData()
            formData.append("front", flashcard.front)
            formData.append("reverse", flashcard.reverse)
            formData.append("synonym", flashcard.synonym)
            formData.append("plural", flashcard.plural)
            formData.append("article", flashcard.article)
            formData.append("color", flashcard.color)
            formData.append("example_sentence", flashcard.example_sentence)
            formData.append("example_sentence_translation", flashcard.example_sentence_translation)
            if (imageFile) formData.append("image", imageFile)
            if (imageFile === null && flashcard.image === null) formData.append("image", "")

            await FlashcardService.editFlashcard(flashcardId, formData)
            navigate(`/edytuj-zestaw/${flashcard.category}`)

        } catch(e) {
            alert("Nie udało się edytować fiszki, spróbuj ponownie.", e)
        }
    }


    return (
        <div className="p-6">
            <h1 className="text-4xl font-semibold">
                Dodaj fiszkę
            </h1>

            <div className="flex flex-col items-center justify-center">
                <div className="border-1 border-gray-300 rounded-2xl aspect-square text-7xl overflow-hidden">
                    {flashcard.image ? (
                            <img src={flashcard.image} alt="Podgląd zdjęcia" className="w-50 h-50 object-cover object-center"/>
                        ) :
                        <FcImageFile className="w-50 h-50 p-8"/>
                    }
                </div>
                <button onClick={handleDeleteImage}
                        className={`w-full h-full px-4 py-2 transition-all duration-500 ease-in-out
                    ${flashcard.image ? "opacity-100 translate-y-0 cursor-pointer" : "opacity-0 -translate-y-3 cursor-auto"}`}
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
                    className="mt-3 mb-10 px-5 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                    htmlFor="photo">
                    Dodaj zdjęcie
                </label>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="front"
                        name="front"
                        type="text"
                        value={flashcard.front}
                        onChange={handleChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="front"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Przód <span className="text-red-500"> *</span> </label>
                </div>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="reverse"
                        name="reverse"
                        type="text"
                        value={flashcard.reverse}
                        onChange={handleChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="reverse"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Tył <span className="text-red-500"> *</span>
                    </label>
                </div>

                <div className="relative w-1/2 mb-5">
                    <label htmlFor="article" className="block text-gray-400 text-[20px]">
                        Rodzajnik
                    </label>
                    <select
                        id="article"
                        name="article"
                        value={flashcard.article}
                        onChange={handleChange}
                        className="w-full p-[10px] text-[20px] border-b-1 border-b-[#ccc] focus:outline-none"
                    >
                        <option value="">———</option>
                        <option value="der">der</option>
                        <option value="die">die</option>
                        <option value="das">das</option>
                    </select>
                </div>

                <div className="relative w-1/2 mb-5">
                    <label htmlFor="article" className="block text-gray-400 text-[20px]">
                        Typ
                    </label>
                    <select
                        id="color"
                        name="color"
                        value={flashcard.color}
                        onChange={handleChange}
                        className="w-full p-[10px] text-[20px] border-b-1 border-b-[#ccc] focus:outline-none"
                    >
                        <option value="" disabled>———</option>
                        <option value="niebieski">rzeczownik</option>
                        <option value="czerwony">czasownik</option>
                        <option value="zielony">przymiotnik</option>
                        <option value="żółty">związek frazeologiczny</option>
                    </select>
                </div>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="synonym"
                        name="synonym"
                        type="text"
                        value={flashcard.synonym}
                        onChange={handleChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="synonym"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Synonim
                    </label>
                </div>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="plural"
                        name="plural"
                        type="text"
                        value={flashcard.plural}
                        onChange={handleChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="plural"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Liczba mnoga
                    </label>
                </div>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="example_sentence"
                        name="example_sentence"
                        type="text"
                        value={flashcard.example_sentence}
                        onChange={handleChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="example_sentence"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Przykładowe zdanie
                    </label>
                </div>

                <div className="relative w-1/2 mb-5">
                    <input
                        id="example_sentence_translation"
                        name="example_sentence_translation"
                        type="text"
                        value={flashcard.example_sentence_translation}
                        onChange={handleChange}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="example_sentence_translation"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Tłumaczenie przykładowego zdania
                    </label>
                </div>
            </div>


            <div className="flex mt-15 items-center justify-center w-full gap-20">
                <Link to="/fiszki">
                    <button
                        className="flex items-center justify-center text-center gap-2 px-8 py-4 hover:bg-gray-300 transition text-black text-xl font-medium border-1 border-gray-300 rounded-xl cursor-pointer bg-gray-200">
                        <IoIosArrowBack /> Powrót
                    </button>
                </Link>
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center text-center gap-2 px-8 py-4 hover:bg-[#10A31B] transition text-white text-xl font-medium rounded-xl bg-[#11AB1E] cursor-pointer">
                    <MdOutlineSaveAlt/> Zapisz
                </button>

            </div>
        </div>
    )
}

export default EditFlashcardPage