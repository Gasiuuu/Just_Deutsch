import React, {useEffect, useState} from 'react'
import { MdOutlineSaveAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FcImageFile } from "react-icons/fc";
import CategoryService from "../services/CategoryService.js";
import {IoIosArrowBack} from "react-icons/io";


function AddCategoryPage() {

    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [imageUrl])

    const onFileChange = (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setImageFile(file);
        e.target.value = ""
    }

    const handleDelete = () => {
        setImageUrl(null);
        setImageFile(null);
    }

    const handleSave = async () => {
        if (!name) {
            alert("Proszę podać nazwę kategorii")
            return
        }

        try{
            setSaving(true)
            const formData = new FormData()
            formData.append("name", name.trim())
            if (imageFile) formData.append("image", imageFile)

            await CategoryService.addCategory(formData)
            navigate("/fiszki")
        } catch(e) {
            alert("Nie udało się zapisać kategorii, spróbuj ponownie.", e)
        }
    }


    return (
        <div className="p-6 w-full">
            <h1 className="text-4xl font-semibold">Utwórz kategorię</h1>

            <div className=" my-15 flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center mr-10">
                    <div className="border-1 border-gray-300 rounded-2xl aspect-square text-7xl overflow-hidden">
                        {imageUrl ? (
                                <img src={imageUrl} alt="Podgląd zdjęcia" className="w-50 h-50 object-cover object-center"/>
                            ) :
                            <FcImageFile className="w-50 h-50 p-8"/>
                        }
                    </div>
                    {/*<button className={`mt-2 transition-opacity duration-500 ${imageUrl? 'visible opacity-100 cursor-pointer' : 'invisible opacity-0 cursor-none'}`} onClick={handleDelete}>Usuń zdjęcie</button>*/}
                    <button onClick={handleDelete}
                            className={`w-full h-full px-4 py-2 transition-all duration-500 ease-in-out
                    ${imageUrl ? "opacity-100 translate-y-0 cursor-pointer" : "opacity-0 -translate-y-3 cursor-auto"}`}
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
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="peer w-full p-[10px] text-[20px] border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3 placeholder-transparent"
                        placeholder=" "
                    />
                    <label htmlFor="name"
                           className="absolute left-0 -top-1 text-gray-600 text-sm peer-placeholder-shown:text-[20px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-5.5 peer-placeholder-shown:left-2.5 transition-all peer-focus:-top-1 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm">
                        Nazwa kategorii <span className="text-red-500"> *</span>
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
                    <MdOutlineSaveAlt/> {saving? "Zapisywanie..." : "Zapisz"}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryPage