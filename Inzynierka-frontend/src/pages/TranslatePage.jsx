import React, {useEffect, useState} from 'react'
import GPTService from "../services/GPTService.js";
import { BiSolidRightArrow } from "react-icons/bi";
import {FaRegCircleCheck} from "react-icons/fa6";
import {ImCancelCircle} from "react-icons/im";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";


function TranslatePage() {

    const [sentenceData, setSentenceData] = useState({})
    const [userSolution, setUserSolution] = useState('')
    const [isCorrect, setIsCorrect] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [loading, setLoading] = useState(true)

    async function getData() {
        try {
            const data = await GPTService.generateSentenceTranslate()
            console.log("odp z serwisu: ", data)
            setLoading(false)
            setSentenceData(data)
            setUserSolution('')
            setIsClicked(false)
            setIsCorrect(false)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getData()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        if(userSolution.trim() === sentenceData.solution) {
            setIsCorrect(true)
            console.log("Poprawna odpowiedź")
        } else {
            setIsCorrect(false)
            console.log("Niepoprawna odpowiedź")
        }
        setTimeout(getData, 3000)
    }

    const handleClick = () => {
        setIsClicked(true)
    }

    const slideIn = `
        @keyframes slideInUp {
            from {
                transform: translateX(20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `


    return (
        <div className="flex flex-col justify-center items-center px-20">
            <style>{slideIn}</style>

            {loading ? (
                <div className="w-3/4 bg-gray-100 rounded-md p-5 mt-10 text-3xl">
                    <Box sx={{ width: '100%', padding: '10px' }}>
                        <LinearProgress color="inherit" />
                    </Box>
                </div>
            ) : (
                <div className="bg-gray-100 rounded-md p-5 mt-10 text-3xl">
                    {isClicked ? (
                        <>
                            {sentenceData.solution}
                        </>
                    ) : (
                        <>
                            {sentenceData.sentence}
                        </>
                    )}
                </div>
            )}

            <form className="flex flex-row mt-40 items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    className="w-full p-[10px] text-3xl border-b-[1px] border-b-[#ccc] bg-[image:linear-gradient(to_right,#000080,#800080)] bg-no-repeat bg-[size:0%_2px] bg-[position:0_100%] transition-[background-size] duration-[800ms] ease-in-out focus:bg-[size:100%_2px] focus:outline-none mt-3 mb-3"
                    placeholder="Napisz tłumaczenie..."
                />
                <button
                    className="ml-3 px-4 py-4 items-center bg-[image:linear-gradient(45deg,#000080,#800080)] bg-[length:150%_auto] bg-[position:left_center] bg-no-repeat text-white  rounded-xl cursor-pointer transition-[background-position] duration-600 ease-in-out hover:bg-[position:right_center]"
                    type="submit"
                    onClick={handleClick}
                >
                    <BiSolidRightArrow/>
                </button>
            </form>

            {isClicked && (
                <>
                    {isCorrect === true &&
                        <div className={`flex flex-row shadow-md align-center justify-center mt-20 text-green-500 bg-gray-100 rounded-lg p-4 w-1/2 text-3xl transition-transform duration-300 ease-in-out`}
                             style={{animation: 'slideIn 0.5s ease-out forwards'}}>
                            <FaRegCircleCheck className="text-4xl mr-3 text-green-500" />
                            Poprawna odpowiedź!
                        </div>
                    }

                    {isCorrect === false &&
                        <div className="flex flex-row shadow-md align-center justify-center mt-20 text-red-500 bg-gray-100 rounded-lg p-4 w-1/2 text-3xl"
                             style={{animation: 'slideIn 0.5s ease-out forwards'}}>
                            <ImCancelCircle className="text-4xl mr-3 text-red-500" />
                            Źle! Poprawne rozwiązanie to <span className=" ml-2 text-red-700"> {sentenceData.missing_world}</span>
                        </div>
                    }
                </>
            )}

        </div>
    )
}

export default TranslatePage;