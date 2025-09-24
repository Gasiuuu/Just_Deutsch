import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'

function FlashcardMenu({ id, onDelete }) {
    return (
        <div className="w-40 bg-white border border-gray-200 rounded-md shadow-lg">

            <Link to={`/edytuj-zestaw/${id}`}>
                <button
                    className="flex gap-2 w-full text-center px-4 py-3 hover:bg-gray-100 text-black font-medium transition duration-300"
                >
                    <FiEdit className="text-blue-500 w-6 h-6 mr-2" /> Edytuj
                </button>
            </Link>

                <button
                    className="flex gap-2 w-full text-center px-4 py-3 hover:bg-gray-100 text-black font-medium transition duration-300"
                    onClick={onDelete}
                >
                    <MdDelete className="text-red-500 w-6 h-6 mr-2" /> Usuń
                </button>

        </div>
    )
}

export default FlashcardMenu