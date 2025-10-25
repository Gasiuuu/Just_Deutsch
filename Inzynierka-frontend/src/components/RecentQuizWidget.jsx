import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import QuizService from "../services/QuizService.js";

function RecentQuizWidget() {

    const [recentQuiz, setRecentQuiz] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetchRecentQuiz()
    }, [])

    const fetchRecentQuiz = async () => {
        try {
            const response = await QuizService.getRecentQuizAttempt()
            console.log('Otrzymano ostatni quiz: ', response)
            setRecentQuiz(response)
        } catch(error) {
            console.error('Błąd wczytywania kategorii: ', error);
        }
    }

    // const formatTimeStamp = (timestamp) => {
    //     const date = new Date(timestamp)
    //     const now = new Date()
    //     const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    //
    //     if (diffInHours < 1) return "Przed chwilą"
    //     if (diffInHours < 24) return `${diffInHours} godz. temu`
    //     if (diffInHours < 48) return 'Wczoraj'
    //     return date.toLocaleDateString('pl-PL')
    // }

    const isFinished = () => {
        return recentQuiz.quiz_score === 100
    }
    console.log(isFinished())

    if(!recentQuiz) return null

    return (
        <div
            className="w-1/2 bg-white rounded-xl p-5 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
            onClick={() => navigate(`/quiz/${recentQuiz.quiz_topic_id}`)}
        >
            {isFinished() ? (
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Rozwiąż Quiz ponownie</h3>
            ) : (
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Rozwiąż następny Quiz</h3>
            )}
            <div className="flex items-center gap-4 ">
                {recentQuiz.quiz_topic_image && (
                    <img
                        src={recentQuiz.quiz_topic_image}
                        alt={recentQuiz.quiz_topic_title}
                        className="w-25 h-25 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-lg mb-2">
                        {recentQuiz.quiz_topic_title}
                    </h4>
                    <div className="flex justify-between">
                        {/*<p className="text-sm text-gray-800 mb-2">*/}
                        {/*    {formatTimeStamp(recentQuiz.timestamp)}*/}
                        {/*</p>*/}
                    </div>
                </div>

                <div>
                    <Gauge
                        value={recentQuiz.quiz_score}
                        startAngle={-120}
                        endAngle={120}
                        text={({value}) => `${value}%`}
                        sx={{
                            width: 120,
                            height: 120,
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 24,
                                fontWeight: 500,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: 'url(#redGradient)',
                            },
                        }}
                    >
                        <defs>
                            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF3B3B" />
                                <stop offset="100%" stopColor="#B30C0C" />
                            </linearGradient>
                        </defs>
                    </Gauge>
                </div>
            </div>


            {isFinished() && (
                <button
                    className="flex flex-end px-4 py-2 ml-auto bg-gradient-to-r from-[#366FD6] to-[#0942AB] text-white font-medium rounded-xl cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/quizy/`)
                    }}
                >
                    Przeglądaj quizy
                </button>
            )}
        </div>
    )
}

export default RecentQuizWidget