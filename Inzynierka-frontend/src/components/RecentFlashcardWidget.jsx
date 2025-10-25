import React from 'react'
import useFlashcardStore from "../stores/useFlashcardStore.js";
import {useNavigate} from "react-router-dom";

function RecentFlashcardWidget() {

    const { recentSet } = useFlashcardStore()
    const navigate = useNavigate()
    const progress = Math.round(((recentSet.lastIndex + 1) / recentSet.flashcards.length) * 100)

    const formatTimeStamp = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Przed chwilą"
        if (diffInHours < 24) return `${diffInHours} godz. temu`
        if (diffInHours < 48) return 'Wczoraj'
        return date.toLocaleDateString('pl-PL')
    }

    const isFinished = () => {
        return recentSet.lastIndex === recentSet.flashcards.length - 1;
    }

    if(!recentSet) return null

    return (
        <div
            className="w-1/2 bg-white rounded-xl p-5 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
            onClick={() => navigate(`/fiszki/${recentSet.categoryId}`)}
        >
            {isFinished() ? (
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ostatnio ukończony zestaw</h3>
            ) : (
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kontynuuj naukę</h3>
            )}
            <div className="flex items-center gap-4  mt-6">
                {recentSet.categoryImage && (
                    <img
                        src={recentSet.categoryImage}
                        alt={recentSet.categoryName}
                        className="w-25 h-25 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-lg mb-1">
                        {recentSet.categoryName}
                    </h4>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-800 mb-2">
                            {formatTimeStamp(recentSet.timestamp)}
                        </p>
                        <p>
                            {recentSet.lastIndex + 1} / {recentSet.flashcards.length}
                        </p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#4BC227] to-[#249403] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

            </div>
            {isFinished() && (
                <button
                    className="flex flex-end px-4 py-2 mt-2 ml-auto bg-gradient-to-r from-[#366FD6] to-[#0942AB] text-white font-medium rounded-xl cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/fiszki/`)
                        }
                    }
                >
                    Przeglądaj zestawy
                </button>
            )}
        </div>
    )
}

export default RecentFlashcardWidget