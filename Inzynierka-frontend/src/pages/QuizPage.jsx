import React, { useState, useEffect } from "react"
import {useNavigate, useParams} from "react-router-dom";
import QuizService from "../services/QuizService.js";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

function QuizPage() {

    const [questions, setQuestions] = useState([])
    const [answersMap, setAnswersMap] = useState({})
    const [userAnswers, setUserAnswers] = useState({})
    const {quizId} = useParams()
    const [helperText, setHelperText] = React.useState('Choose wisely');
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [quizInfo, setQuizInfo] = useState(null)

    const question = questions[currentIndex]
    const currentAnswers = question ? answersMap[question.id] : []
    const navigate = useNavigate()



    useEffect(() => {
        getQuestions()
        getQuizTopic()
    }, [])


    const getQuestions = async () => {
        try {
            const response = await QuizService.getQuestionsByQuizTopic(quizId)
            console.log(response)
            setQuestions(response)
            await getAnswers(response)
            setCurrentIndex(0)
        } catch (e) {
            console.log("Nie udało się załadować pytań: ", e)
        } finally {
            setLoading(false)
        }
    }

    const getQuizTopic = async () => {
        try {
            const response = await QuizService.getQuizTopicById(quizId)
            console.log("info o quizTopic: ", response)
            setQuizInfo(response)
        } catch (e) {
            console.log("Nie udało się załadować tematu quizu: ", e)
        }
    }

    const getAnswers = async (questions) => {
        try {
            const answersData = {}

            for (const question of questions) {
                const response = await QuizService.getAnswersByQuestion(question.id)
                answersData[question.id] = response
            }
            setAnswersMap(answersData)
        } catch (e) {
            console.log("Nie udało się załadować odpowiedzi: ", e)
        }
    }

    const handleRadioChange = (event) => {
        const selectedAnswerId = parseInt(event.target.value)

        setUserAnswers(prev => ({
            ...prev,
            [question.id]: selectedAnswerId
        }))

    }

    const prevQuestion = () => {
        setCurrentIndex(i => Math.max(i - 1, 0))
    }

    const nextQuestion = () => {
        setCurrentIndex(i => Math.min(i + 1, questions.length - 1))
    }

    const handleFinishAttempt = async () => {
        const score = calculateScore()
        const quizScore = Math.round((score.correct / score.total) * 100)

        await QuizService.createQuizAttempt(quizId, quizScore)

        if(quizInfo) {
            const payload = {
                quiz_topic_id: quizInfo.id,
                quiz_topic_title: quizInfo.title,
                quiz_topic_image: quizInfo.image,
                quiz_score: quizScore || 0
            }
            console.log("gotowy payload: ", payload)
            QuizService.createRecentQuizAttempt(payload)
        }

        navigate(`/quiz/${quizId}/wyniki`, {
            state: {
                questions,
                answersMap,
                userAnswers,
                quizScore: score
            }
        })
    }

    const isQuestionAnswered = (questionId) => {
        return userAnswers.hasOwnProperty(questionId)
    }

    const allQuestionsAnswered = questions.length > 0 &&
        questions.every(question => isQuestionAnswered(question.id))

    const currentValue = question ? (userAnswers[question.id] || '') : ''

    const calculateScore = () => {
        let correct = 0

        questions.forEach((question) => {
            const answerForQuestion = userAnswers[question.id]
            const answers = answersMap[question.id] || []
            const selectedAnswer = answers.find((answer) => answer.id === answerForQuestion)

            if (selectedAnswer && selectedAnswer.is_correct) {
                correct++
            }
        })
        return { correct: correct, total: questions.length }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex flex-row w-1/2 h-20 mx-auto p-5 mb-15 rounded-lg bg-gray-200 animate-pulse"></div>
                <div className="w-1/2 h-8 animate-pulse p-5 mb-10 ml-5 bg-gray-200"></div>

                <div className="w-1/4 h-3 animate-pulse p-3 mb-5 ml-5 bg-gray-200"></div>
                <div className="w-1/4 h-3 animate-pulse p-3 mb-5 ml-5 bg-gray-200"></div>
                <div className="w-1/4 h-3 animate-pulse p-3 mb-5 ml-5 bg-gray-200"></div>
                <div className="w-1/4 h-3 animate-pulse p-3 mb-5 ml-5 bg-gray-200"></div>

                <div className="flex flex-row items-center justify-center gap-10 mt-15">
                    <div className="flex gap-2 justify-center items-center w-30 h-12 text-lg text-white rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="w-15 h-8 bg-gray-200 animate-pulse"></div>
                    <div
                        className="flex gap-2 justify-center items-center w-30 h-12 text-lg text-white rounded-lg bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div
                className="flex flex-row items-center justify-center w-min mx-auto p-5 mb-5 rounded-lg bg-gray-200 gap-4">
                {questions.map((question, index) => (
                    <React.Fragment key={question.id}>
                        <button
                            onClick={() => setCurrentIndex(index)}
                            className={`relative text-2xl font-semibold transition-colors ${
                                currentIndex === index
                                    ? 'text-yellow-500'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {index + 1}
                            {isQuestionAnswered(question.id) && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                        </button>
                        {index < questions.length - 1 && (
                            <div className="h-12 w-px bg-gray-400"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {question && (
                <FormControl sx={{m: 3}} variant="standard">
                    <FormLabel id="demo-error-radios" sx={{fontSize: 36}}>{question.question_text}</FormLabel>
                    <FormHelperText sx={{marginTop: 5}}>Zaznacz jedną odpowiedź</FormHelperText>

                    <RadioGroup
                        aria-labelledby="quiz-question"
                        name="quiz"
                            value={currentValue.toString()}
                            onChange={handleRadioChange}
                        >
                            {currentAnswers.map((answer) => (
                                <div key={answer.id}>
                                    <FormControlLabel
                                        key={answer.id}
                                        value={answer.id.toString()}
                                        control={<Radio/>}
                                        label={`${answer.label}. ${answer.text}`}
                                    />
                                </div>
                            ))}
                        </RadioGroup>
                </FormControl>
            )}

            <div className="flex flex-row items-center justify-center gap-10 mt-5">
                <button
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    className="flex gap-2 justify-center items-center px-4 py-2 text-lg text-white rounded-lg bg-[#9b0707] hover:bg-[#920707] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
                    <IoIosArrowBack/> Wróć
                </button>

                <p className="my-auto">
                    {currentIndex + 1} / {questions.length}
                </p>

                {currentIndex < questions.length - 1 ? (
                    <button
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                        className="flex gap-2 justify-center items-center px-4 py-2 text-lg text-white rounded-lg bg-[#16660c] hover:bg-[#155f0b] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
                        Dalej <IoIosArrowForward/>
                    </button>
                ) : (
                    <button
                    onClick={handleFinishAttempt}
                    disabled={!allQuestionsAnswered}
                    className="flex px-4 py-2 text-lg bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-lg cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Zakończ Quiz
                    </button>
                )}
            </div>

            {!allQuestionsAnswered && currentIndex === questions.length - 1 && (
                <p className="text-center mt-4 text-red-600">
                    Odpowiedz na wszystkie pytania, aby zakończyć Quiz
                </p>
            )}
        </div>
    )
}

export default QuizPage