import axios from 'axios';

class CategoryService {

    static BACKEND = import.meta.env.VITE_ENV_BACKEND_URL;
    static BASE_URL = `${this.BACKEND}/api`;

    static async getCategories() {
        const response = await axios.get(`${this.BASE_URL}/categories/`, { withCredentials: true });
        return response.data;
    }

    static async addCategory(data) {
        await axios.post(`${this.BASE_URL}/categories/`, data, { withCredentials: true });
    }

    static async deleteCategory(id) {
        await axios.delete(`${this.BASE_URL}/category/${id}`, { withCredentials: true });
    }

    static async editCategory(id, data) {
        await axios.patch(`${this.BASE_URL}/category/${id}`, data, { withCredentials: true });
    }

}

export default CategoryService;