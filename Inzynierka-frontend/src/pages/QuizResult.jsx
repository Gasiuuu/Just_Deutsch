import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {IoIosArrowBack, IoMdCheckmarkCircle, IoMdCloseCircle} from "react-icons/io";
import {FaLightbulb} from "react-icons/fa";

function QuizResult () {
    const location = useLocation()
    const navigate = useNavigate()
    const { quizId } = useParams()

    const { questions, answersMap, userAnswers, quizScore } = location.state || {}

    useEffect(() => {
        if (!questions || !answersMap || !userAnswers) {
            navigate(`/quiz/${quizId}`)
            return
        }
    }, [])

    const isAnswerCorrect = (questionId) => {
        const answerForQuestion = userAnswers[questionId]
        const answers = answersMap[questionId] || []
        const selectedAnswer = answers.find((answer) => answer.id === answerForQuestion)
        return selectedAnswer && selectedAnswer.is_correct
    }

    const handleTryAgain = () => {
        navigate(`/quiz/${quizId}`)
    }

    const handleBackToDashboard = () => {
        navigate('/strona-glowna')
    }

    const percentage = Math.round((quizScore.correct / quizScore.total) * 100)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="rounded-lg shadow-lg p-8 mb-6">
                <h1 className="text-4xl fonr-bold text-center mb-4">Wyniki Quizu</h1>
                <div className="text-center mb-8">
                    <p className="text-6xl font-bold bg-gradient-to-r from-[#000080] to-[#800080] bg-clip-text text-transparent">
                        {quizScore.correct} / {quizScore.total}
                    </p>
                    <p className="text-2xl text-gray-600">
                        Wynik: {percentage}%
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((question, index) => {
                    const answers = answersMap[question.id] || []
                    const answerForQuestion = userAnswers[question.id]
                    const isCorrect = isAnswerCorrect(question.id)

                    return (
                        <div key={question.id} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="flex items-start gap-3 mb-4">
                                {isCorrect ? (
                                    <IoMdCheckmarkCircle className="text-green-500 text-3xl flex-shrink-0 mt-1" />
                                ) : (
                                    <IoMdCloseCircle className="text-red-500 text-3xl flex-shrink-0 mt-1" />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">
                                        Pytanie {index + 1}. {question.question_text}
                                    </h3>
                                </div>
                            </div>

                            <div className="ml-10 space-y-2">
                                {answers.map((answer,) => {
                                    const isUserAnswer = answer.id === answerForQuestion
                                    const isCorrectAnswer = answer.is_correct

                                    let bgColor = 'bg-gray-50'
                                    if (isCorrectAnswer) {
                                        bgColor = 'bg-green-100 border-2 border-green-500'
                                    } else if (isUserAnswer && !isCorrectAnswer) {
                                        bgColor = 'bg-red-100 border-2 border-red-500'
                                    }

                                    return (
                                        <div key={answer.id} className={`p-3 rounded ${bgColor}`}>
                                            <span className="font-semibold">{answer.label}.</span> {answer.text}
                                            {isUserAnswer && (
                                                <span className="ml-2 text-sm font-medium">
                                                        (Twoja odpowiedź)
                                                    </span>
                                            )}
                                        </div>
                                    )
                                })}
                                <h3 className="flex mt-5 ml-3">
                                    <FaLightbulb
                                        className="flex flex-row text-yellow-500 text-2xl mr-3"/>
                                    {question.explanation}
                                </h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={handleBackToDashboard}
                    className="flex items-center justify-center gap-2 px-8 py-3 text-lg text-white rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                    <IoIosArrowBack /> Powrót do strony głównej
                </button>

                <button
                    onClick={handleTryAgain}
                    className="px-8 py-3 text-lg text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Rozwiąż quiz ponownie
                </button>
            </div>
        </div>
    )
}

export default QuizResult