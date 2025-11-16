import React, {useEffect, useState} from 'react'
import GPTService from "../services/GPTService.js"
import calendar from '../assets/calendar.png'
import check from '../assets/check.png'
import streak from '../assets/streak.png'
import {useNavigate} from "react-router-dom";


function DailyChallengeWidget() {

    const [dailyChallenge, setDailyChallenge] = useState({})
    const [userStreak, setUserStreak] = useState({})
    const [timeLeft, setTimeLeft] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const expiresAt = new Date(dailyChallenge.expires_at)
            const diff = expiresAt - now

            if(diff <= 0) return '00:00:00'

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60))
            const seconds = Math.floor(diff % (1000 * 60) / 1000)

            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        }

        setTimeLeft(calculateTimeLeft)
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(interval)
    }, [dailyChallenge.expires_at])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response1 = await GPTService.getDailyChallenge()
            setDailyChallenge(response1)
            const response2 = await GPTService.getUserStreak()
            setUserStreak(response2)
            console.log("Pomyślnie pobrano codzienne wyzwanie: ", response1)
            console.log("Pomyślnie pobrano dane o serii użytkownika: ", response2)
        } catch (e) {
            console.error("Wystąpił błąd podczas pobierania dziennego wyzwania: ", e)
        }
    }

    const isFinished = () => {
        return dailyChallenge.completed
    }

    return (
        <div
            className="w-full bg-white rounded-xl p-5 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
            <div className="flex items-center justify-center gap-5 mb-6">
                <img src={calendar} alt="calendar icon" className="w-10 h-10"/>
                <h3 className="text-xl font-semibold text-gray-800">Codzienne wyzwanie</h3>
                <div className="flex items-center justify-center gap-1">
                    <img src={streak} alt="streak icon" className="w-8 h-8"/>
                    <p>{userStreak.streak_days}</p>
                </div>
            </div>

            {isFinished() ? (
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Ukończyłeś dzisiejsze wyzwanie</h3>
                    <p className="text-md text-gray-700 mb-1">Następne wyzwanie za {timeLeft}</p>
                    <img src={check} alt="check icon" className="w-20 h-20"/>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Rozpocznij dzisiejsze wyzwanie</h3>
                    <p className="text-md text-gray-700 mb-5">Wyzwanie ważne jeszcze {timeLeft}</p>
                    <button
                        className="px-8 py-4 mx-auto bg-gradient-to-r from-[#000080] to-[#800080] text-white text-2xl font-medium rounded-xl cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/codzienne-wyzwania/`)
                            }
                        }
                    >
                        Rozpocznij
                    </button>
                </div>
            )}
        </div>
    )
}

export default DailyChallengeWidget