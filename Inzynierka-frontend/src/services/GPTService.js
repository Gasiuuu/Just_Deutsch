import axios from 'axios'

class GPTService {
    static BACKEND = import.meta.env.VITE_ENV_BACKEND_URL;
    static BASE_URL = `${this.BACKEND}/gpt`;

    static async generateSentenceGapFill(category) {
        const response = await axios.post(`${this.BASE_URL}/generate-sentence1/`,
            {"category": category},
            {withCredentials: true}
        );
        return response.data;
    }

    static async generateSentenceTranslate(category) {
        const response = await axios.post(`${this.BASE_URL}/generate-sentence2/`,
            {"category": category},
            {withCredentials: true}
        );
        return response.data;
    }

    static async generateDialogue(word) {
        if (!word.trim())
            throw new Error("Brak słowa do dialogu")
        const response = await axios.post(
            `${this.BASE_URL}/generate_dialogue/`,
            {word},
            {withCredentials: true}
        )
        return response.data;
    }

    static async getDailyChallenge() {
        const response = await axios.get(`${this.BASE_URL}/daily-challenge/`,
            {withCredentials: true}
        );
        return response.data;
    }

    static async getUserStreak() {
        const response = await axios.get(`${this.BASE_URL}/user/streak/`,
            {withCredentials: true}
        );
        return response.data;
    }
}

export default GPTService;