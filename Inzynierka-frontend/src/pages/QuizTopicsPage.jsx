import React, {useState, useEffect } from 'react'
import QuizService from "../services/QuizService.js";
import { Modal, Box, Typography, Button, Stack } from '@mui/material';
import { FaCheck } from "react-icons/fa";


function QuizTopicsPage () {

    const [quizTopics, setQuizTopics] = useState([])
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuizTopics()
    }, [])

    const fetchQuizTopics = async () => {
        try {
            const response = await QuizService.getQuizTopics()
            setLoading(false)
            console.log(response)
            setQuizTopics(response)

        } catch (e) {
            console.error("Wystąpił błąd w pobieraniu tematów quizów: ", e)
        }
    }

    const askStart = (quizTopic) => {
        setSelectedTopic(quizTopic)
        setConfirmOpen(true)
    }

    const closeModal = () => {
        setConfirmOpen(false)
        setSelectedTopic(null)
    }

    if (loading) {
        const rows = 5

        return (
            <div className="flex flex-col p-6">
                <h1 className="text-4xl font-semibold mb-20">Tematy quizów</h1>

                {Array.from({length: rows}).map((_, i) => (
                    <div
                        className="w-full h-25 px-15 flex text-2xl flex-row justify-between items-center mx-auto mb-10 rounded-xl border border-gray-100 shadow-md bg-gray-50 animate-pulse"
                        key={i}
                    >
                        <div className="w-20 h-20 p-2 rounded-full bg-gray-200"></div>
                        <div className="flex-1 pl-8">
                            <div className="flex-1 w-40 h-5 bg-gray-200"></div>
                        </div>
                        <div className="justify-center items-center mr-8">
                            <div className="w-30 h-5 bg-gray-200"></div>
                        </div>
                        <div className="justify-center items-center">
                            <div className="w-15 h-5 bg-gray-200"></div>
                        </div>
                    </div>
                ))}

            </div>
        )
    }

    return (
        <div className="flex flex-col p-6">
            <h1 className="text-4xl font-semibold mb-20">Tematy quizów</h1>

            <Modal
                open={confirmOpen}
                onClose={closeModal}
                aria-labelledby="start-quiz-title"
                aria-describedby="start-quiz-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Typography
                            id="start-quiz-title"
                            variant="h6"
                            sx={{ fontWeight: 'bold' }}
                        >
                            {selectedTopic?.title}
                        </Typography>
                        <Typography
                            id="start-quiz-title"
                            variant="h7"
                            sx={{ display: 'flex', fontWeight: 'semibold', marginTop: 0.5 }}>
                            <FaCheck className="items-center justify-center mr-2 mt-0.5 text-green-600" /> Próg zaliczenia - {selectedTopic?.passing_score}%
                        </Typography>
                    </Box>


                    <Typography
                        id="start-quiz-description"
                        sx={{ mt: 3 }}
                    >
                        {selectedTopic?.description}
                    </Typography>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ mt: 3 }}
                    >
                        <Button
                            onClick={closeModal}
                            sx={{ color: 'black' }}
                        >
                            Wróć
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                        >
                            Rozpocznij quiz
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {quizTopics.map((quizTopic) => (
                <button
                    className="w-full px-15 flex text-2xl flex-row justify-between items-center mx-auto mb-10 rounded-xl border-1 border-gray-200 shadow-md hover:shadow-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-500 hover:-translate-y-1"
                    key={quizTopic.id}
                    onClick={() => askStart(quizTopic)}>
                    <img className="w-25 h-25 p-2 object-cover object-center rounded-full overflow-hidden flex-shrink-0"
                         src={quizTopic.image} alt={quizTopic.title}/>
                    <div className="flex-1 text-left pl-8">
                        <h5>{quizTopic.title}</h5>
                    </div>
                    <div className="w-30 text-center">
                        <h5>{quizTopic.type}</h5>
                    </div>
                    <div className="w-30 text-center">
                        <h5>{quizTopic.level}</h5>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default QuizTopicsPage