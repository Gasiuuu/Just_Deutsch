import axios from 'axios'

class UserService {

    // static BASE_URL = `${import.meta.env.VITE_ENV_BACKEND_URL}/api`
    static BACKEND = import.meta.env.VITE_ENV_BACKEND_URL;
    static BASE_URL = `${this.BACKEND}/api`;

    static async login(username, password) {
        const response = await axios.post(
            `${this.BASE_URL}/login/`,
            { username, password },
            { withCredentials: true }
        );
        return response.data;
    }

    static async register(userData) {
        const response = await axios.post(
            `${this.BASE_URL}/register/`,
            userData,
            { withCredentials: true }
        );
        return response.data;
    }

    static async logout() {
        const response = await axios.post(
            `${this.BASE_URL}/logout/`,
            {},
            { withCredentials: true }
        )
        return response.data;
    }

    static async getCurrentUser() {
        const response = await axios.get(
            `${this.BASE_URL}/me/`,
            { withCredentials: true }
        )
        return response.data;
    }

    static async editUser(userId, data) {
        await axios.patch(`${this.BASE_URL}/edit-user/${userId}`, data, { withCredentials: true })
    }

    static isAuthenticated(){
        const token = sessionStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = sessionStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser(){
        const role = sessionStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

}

export default UserService