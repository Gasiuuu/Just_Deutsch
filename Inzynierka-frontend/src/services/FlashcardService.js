import axios from 'axios';

class FlashcardService {

    static BACKEND = import.meta.env.VITE_ENV_BACKEND_URL;
    static BASE_URL = `${this.BACKEND}/api`;

    static async getFlashcards() {
        const response = await axios.get(`${this.BASE_URL}/flashcards`,
            { withCredentials: true });
        return response.data;
    }

    static async getFlashcardByCategoryId(id) {
        const response = await axios.get(`${this.BASE_URL}/flashcards/${id}`,
            {withCredentials: true });
        return response.data;
    }

    static async getFlashcardById(id) {
        const response = await axios.get(`${this.BASE_URL}/flashcard/${id}/`,
            {withCredentials: true });
        return response.data;
    }

    static async addFlashcard(data) {
        const response = await axios.post(`${this.BASE_URL}/flashcards/`,
            data,
            { withCredentials: true });
        return response.data;
    }

    static async editFlashcard(id, data) {
        await axios.patch(`${this.BASE_URL}/flashcard/${id}/`, data, { withCredentials: true })
    }

    static async deleteFlashcard(id) {
        await axios.delete(`${this.BASE_URL}/flashcard/${id}/`, { withCredentials: true });
    }
}

export default FlashcardService;