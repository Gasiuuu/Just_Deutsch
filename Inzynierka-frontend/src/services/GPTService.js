import axios from 'axios'

class GPTService {
    static BACKEND = import.meta.env.VITE_ENV_BACKEND_URL;
    static BASE_URL = `${this.BACKEND}/gpt`;

    static async generateSentenceGapFill() {
        const response = await axios.post(`${this.BASE_URL}/generate-sentence1/`,
            {},
            { withCredentials: true }
        );
        return response.data;
    }

    static async generateSentenceTranslate() {
        const response = await axios.post(`${this.BASE_URL}/generate-sentence2/`,
            {},
            { withCredentials: true }
        );
        return response.data;
    }
}

export default GPTService;