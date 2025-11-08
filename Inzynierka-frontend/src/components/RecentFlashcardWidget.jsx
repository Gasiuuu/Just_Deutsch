import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import QuizService from "../services/QuizService.js";
import FlashcardService from "../services/FlashcardService.js";

function RecentFlashcardWidget() {

    const [recentFlashcardSet, setRecentFlashcardSet] = useState({})
    const navigate = useNavigate()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        fetchRecentFlashcardSet()
    }, [])

    const fetchRecentFlashcardSet = async () => {
        try {
            const response = await FlashcardService.getRecentFlashcardSet()
            console.log('Otrzymano ostatni zestaw fiszek: ', response)
            setRecentFlashcardSet(response)

            const totalCards = response.flashcards_length
            if(totalCards > 0) {
                const currentCard = response.last_index + 1
                const calculatedProgress = Math.round((currentCard/totalCards) * 100)
                setProgress(calculatedProgress)
            }
        } catch(error) {
            console.error('Błąd wczytywania zestawu fiszek: ', error);
        }
    }

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
        return recentFlashcardSet.last_index === recentFlashcardSet.flashcards_length - 1;
    }

    if(!recentFlashcardSet) return null

    return (
        <div
            className="w-1/2 bg-white rounded-xl p-5 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
            onClick={() => navigate(`/fiszki/${recentFlashcardSet.category_id}`)}
        >
            {isFinished() ? (
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ostatnio ukończony zestaw</h3>
            ) : (
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kontynuuj naukę</h3>
            )}
            <div className="flex items-center gap-4  mt-6">
                {recentFlashcardSet.category_image && (
                    <img
                        src={recentFlashcardSet.category_image}
                        alt={recentFlashcardSet.category_name}
                        className="w-25 h-25 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-lg mb-1">
                        {recentFlashcardSet.category_name}
                    </h4>
                    <div className="flex justify-between">
                        {/*<p className="text-sm text-gray-800 mb-2">*/}
                        {/*    {formatTimeStamp(recentFlashcardSet.timestamp)}*/}
                        {/*</p>*/}
                        <p>
                            {recentFlashcardSet.last_index + 1} / {recentFlashcardSet.flashcards_length}
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