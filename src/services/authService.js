// src/services/authService.js
import axios from 'axios';

const API_URL = "http://localhost:8081/api/auth/";

class AuthService {
async register(username, email, password, role, mobileNo,companyName,address) {
    // FIX: URL ko /signup se badal kar /register karein
    return axios.post(API_URL + "register", {
        username,
        email,
        password,
        mobileNo,
        role: role,
       companyName: companyName, // Check backend DTO field name
        address: address
    });
}
    async login(username, password) {
        const response = await axios.post(API_URL + "login", { username, password });
        if (response.data.token) {
            // Token aur User details local storage mein save karna
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    }


    handleLogout = () => {
    AuthService.logout();
    navigate("/landing-page"); // Ya navigate("/")
};

    logout = () => {
    localStorage.removeItem("user"); // Ye us token ko browser se delete kar dega
};

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();