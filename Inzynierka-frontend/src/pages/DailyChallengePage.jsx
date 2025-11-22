import React, { useEffect, useState } from 'react'
import GPTService from '../services/GPTService.js'
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {useNavigate} from "react-router-dom";


function DailyChallengePage() {

    const [dailyChallenge, setDailyChallenge] = useState({})
    const [step, setStep] = useState(1);
    const [animating, setAnimating] = useState(true);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const currentTask = dailyChallenge.tasks?.[step - 1]
    const [answers, setAnswers] = useState({
        0: '',
        1: '',
        2: {}
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response1 = await GPTService.getDailyChallenge()
            setDailyChallenge(response1)
            console.log("Pomyślnie pobrano codzienne wyzwanie: ", response1)
        } catch (e) {
            console.error("Wystąpił błąd podczas pobierania dziennego wyzwania: ", e)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerChange = (value, gapIndex = null) => {
        const taskIndex = step - 1

        if (gapIndex !== null) {
            setAnswers(prev => ({
                ...prev,
                [taskIndex]: {
                    ...prev[taskIndex],
                    [gapIndex]: value
                }
            }))
        } else {
            setAnswers(prev => ({
                ...prev,
                [taskIndex]: value
            }))
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const formattedAnswers = dailyChallenge.tasks.map((task, index) => {
            const userAnswer = answers[index];

            if (task.type === 'quiz' || task.type === 'translation') {
                return {
                    taskId: task.id,
                    type: task.type,
                    answer: userAnswer
                }
            } else if (task.type === 'gap-fill') {
                const answerArray = Object.values(userAnswer);
                return {
                    taskId: task.id,
                    type: task.type,
                    answer: answerArray
                }
            }
        });

        const payload = {
            answers: formattedAnswers
        };

        console.log(payload);

        try {
            await GPTService.submitDailyChallenge(payload, dailyChallenge.id)
            navigate(`/strona-glowna`)
        } catch (error) {
            console.error('Wystąpił błąd podczas wysyłania odpowiedzi: ', error);
        }
    }


    const changeStep = (newStep) => {
        setAnimating(false);
        setTimeout(() => {
            setStep(newStep);
            setAnimating(true);
        }, 500)
    }
    const nextStep = () => changeStep(Math.min(step + 1, 3))
    const prevStep = () => changeStep(Math.max(step - 1, 1))

    const headers = {
        1: "Wskaż poprawną odpowiedź",
        2: "Przetłumacz podane zdanie",
        3: "Uzupełnij luki w zdaniu"
    }
    const header = headers[step]

    if(loading) return
    if (!currentTask) return null

    return (
        <div className="p-6 min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                <div className="mb-4">
                    <div className={`
                                transition-opacity duration-500 ease-in-out
                                ${animating ? 'opacity-100' : 'opacity-0'}
                              `}
                    >
                        <h1 className="text-gray-800 text-2xl font-semibold text-center">
                            {header}
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-h-[500px]">
                    <div className={`flex-1 flex items-center justify-center
                        transition-opacity duration-500 ease-in-out
                        ${animating ? 'opacity-100' : 'opacity-0'}
                      `}
                    >
                        {step === 1 && currentTask.type === 'quiz' && (
                            <FormControl sx={{m: 1}} variant="standard">
                                <FormLabel id="demo-error-radios" sx={{fontSize: 36}}>{currentTask.content.question}</FormLabel>
                                <FormHelperText sx={{marginTop: 2}}>Zaznacz jedną odpowiedź</FormHelperText>

                                <RadioGroup
                                    aria-labelledby="quiz-question"
                                    name="quiz"
                                    value={answers[0]}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                >
                                    {currentTask.content.options.map((option, index) => {
                                        const letter = String.fromCharCode(65 + index)
                                        return (
                                            <FormControlLabel
                                                key={option.id}
                                                value={option.id}
                                                control={<Radio/>}
                                                label={`${letter}. ${option.text}`}
                                            />
                                        )
                                    })}
                                </RadioGroup>
                            </FormControl>
                        )}

                        {step === 2 && currentTask.type === 'translation' && (
                            <div className="w-full max-w-3xl px-4">
                                <div className="bg-gray-100 rounded-md p-5 text-3xl mb-20">
                                    {currentTask.content.sentence}
                                </div>

                                <input
                                    type="text"
                                    value={answers[1]}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    className="w-full p-[10px] text-3xl border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none"
                                    placeholder="Napisz tłumaczenie..."
                                />
                            </div>
                        )}

                        {step === 3 && currentTask.type === 'gap-fill' && (
                            <div className="w-full max-w-4xl px-4">
                                <div className="bg-gray-100 rounded-md p-4 text-3xl mb-5">
                                    {currentTask.content.sentence}
                                </div>

                                <div className="text-sm text-gray-600 mb-3">
                                    Tłumaczenie: {currentTask.content.translation}
                                </div>

                                <div className="flex gap-8 items-center justify-center mt-10">
                                    {currentTask.content.gaps.map((gap, index) => (
                                        <div key={index} className="border rounded-lg p-3 bg-white shadow-sm">
                                            <h3 className="text-lg font-semibold mb-2">
                                                Luka {gap.position}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-3">
                                                {gap.options.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => handleAnswerChange(option, index)}
                                                        className={`
                                                            p-3 rounded-lg border-2 transition-all duration-200
                                                            ${answers[2]?.[index] === option
                                                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                                                            : 'border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50'
                                                        }
                                                        `}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-center w-1/2 mx-auto gap-10 mt-4">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-3 bg-gray-300 text-xl text-gray-700 rounded-lg cursor-pointer hover:bg-gray-400 transition-bg duration-300"
                            >
                                Wstecz
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto px-6 py-3 text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-bg duration-300 cursor-pointer"
                            >
                                Dalej
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="ml-auto px-6 py-3 text-xl bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white border-none rounded-lg cursor-pointer transition-[background-position] duration-[600ms] ease-in-out hover:bg-[position:right_center]"
                            >
                                Zakończ podejście
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DailyChallengePage