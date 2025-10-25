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

    static async getQuizTopicById(quizId) {
        const response = await axios.get(`${this.BASE_URL}/quiz-topic/${quizId}`, { withCredentials: true })
        return response.data
    }

    static async getQuestionsByQuizTopic(QuizTopicId) {
        const response = await axios.get(`${this.BASE_URL}/questions/${QuizTopicId}`, { withCredentials: true })
        return response.data
    }

    static async getAnswersByQuestion(questionId) {
        const response = await axios.get(`${this.BASE_URL}/answers/${questionId}`, { withCredentials: true })
        return response.data
    }

    static async createQuizAttempt(quizId, score) {
        await axios.post(`${this.BASE_URL}/quiz/${quizId}/attempt`, {score}, { withCredentials: true })
    }

    static async createRecentQuizAttempt(data) {
        await axios.post(`${this.BASE_URL}/recent-quiz/set/`, data, { withCredentials: true })
    }

    static async getRecentQuizAttempt() {
        const response = await axios.get(`${this.BASE_URL}/recent-quiz/`, {withCredentials: true })
        return response.data
    }
}

export default QuizService