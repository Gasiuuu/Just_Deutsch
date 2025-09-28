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

    static async addFlashcard(data) {
        const response = await axios.post(`${this.BASE_URL}/flashcards/`,
            data,
            { withCredentials: true });
        return response.data;
    }

    static async deleteFlashcard(id) {
        const response = await axios.delete(`${this.BASE_URL}/flashcard/${id}`,
            { withCredentials: true });
        return response.data;
    }

}

export default FlashcardService;