import React, { useState, useEffect } from 'react'
import { FaImage } from "react-icons/fa6";
import { FcImageFile } from "react-icons/fc";


function PhotoPicker() {

    const [imageUrl, setImageUrl] = useState(null);

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
        e.target.value = ""
    }

    const handleDelete = () => {
        setImageUrl(null);
    }

    return (
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
                // value={q}
                // onChange={e => setQ(e.target.value)}
            />

                <label
                    className="mt-3 px-5 py-2 bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                    htmlFor="photo">
                    Dodaj zdjęcie
                </label>


        </div>
    )

}

export default PhotoPicker