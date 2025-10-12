import axios from 'axios'

class QuizService {

    static BACKEND = import.meta.env.VITE_ENV_BACKEND_URL;
    static BASE_URL = `${this.BACKEND}/api`;

    static async getQuizTopics() {
        const response = await axios.get(`${this.BASE_URL}/quiz-topics`, { withCredentials: true })
        return response.data
    }

    static async getAnswers() {
        const response = await axios.get(`${this.BASE_URL}/answers`, { withCredentials: true })
        return response.data
    }

    static async getQuestions() {
        const response = await axios.get(`${this.BASE_URL}/questions`, { withCredentials: true })
        return response.data
    }
}

export default QuizService