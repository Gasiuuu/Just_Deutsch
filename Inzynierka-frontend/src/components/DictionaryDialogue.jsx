import React, { useState, useEffect } from 'react'
import GPTService from "../services/GPTService.js"
import { IoChatboxEllipses } from "react-icons/io5";


function DictionaryDialogue({ data }) {

    const word = data.trim()
    console.log(word)

    const [dialogue, setDialogue] = useState(null)
    const [status, setStatus] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {

        async function FetchDialogue() {
            if (!word) return <div>Brak słowa wejściowego</div>
            setStatus("loading")
            setError("")
            try {
                const response = await GPTService.generateDialogue(word)
                setDialogue(response)
                setStatus("success")
            } catch (e) {
                setError(`Wystąpił błąd podczas pobierania dialogu: ${e}`)
                setStatus("error")
            }
        }

        void FetchDialogue()
    }, [word])

    if (status === "loading")
        return (
            <div className="flex flex-row justify-center items-center gap-3 text-center text-3xl py-10 animate-pulse">
                <IoChatboxEllipses />
                Ładowanie dialogu dla "{word}"
            </div>
        )


    if (status === "error")
        return <div>Wystąpił błąd: {error}</div>

    if (!dialogue) return null
    console.log("dialogue", dialogue)

    const lines = Array.isArray(dialogue.lines) ? dialogue.lines : []
    const translatedLines = Array.isArray(dialogue.translatedLines) ? dialogue.translatedLines : []

    return (
        <div className="max-w-2xl mx-auto p-5 mt-12 border-1 border-gray-200 rounded-2xl shadow-lg">
            <h2 className="m-0 text-xl fotn-semibold">
                Dialog dla {dialogue.word}
            </h2>

            <div className="pl-5 mt-3 space-y-1">
                {lines.map((_, i) => (
                    <div key={i}>
                        <div className="space-y-1">{lines[i]}</div>
                        <div className="space-y-1 text-gray-400"> {translatedLines[i]}</div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default DictionaryDialogue