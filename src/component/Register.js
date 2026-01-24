import React, { useState } from "react";
import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNo, setMobileNo] = useState(""); // State for mobile
    const [role, setRole] = useState("VENDOR");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        // Basic validation for mobile number
        if (mobileNo.length < 10) {
            setMessage("Please enter a valid 10-digit mobile number.");
            return;
        }

        try {
            await AuthService.register(username, email, password, role, mobileNo);
            alert("Registration successful! Redirecting to login...");
            navigate("/login");
        } catch (error) {
            const resMessage = error.response?.data || "Registration failed";
            setMessage(typeof resMessage === 'string' ? resMessage : "Error occurred");
        }
    };

    // Common styling for inputs
    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        boxSizing: "border-box", // Taki padding width se bahar na jaye
        fontSize: "14px"
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            <div style={{ maxWidth: "450px", width: '100%', padding: "30px", border: "none", borderRadius: "12px", backgroundColor: "#fff", boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: "center", color: '#2c3e50', marginBottom: '25px', fontFamily: 'Arial' }}>User Registration</h2>
                <form onSubmit={handleRegister}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username:</label>
                    <input type="text" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                    <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mobile Number:</label>
                    <input 
                        type="tel" 
                        style={inputStyle} 
                        value={mobileNo} 
                        onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ''))} // Sirf numbers allow karega
                        placeholder="10-digit mobile number" 
                        maxLength="10"
                        required 
                    />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
                    <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                        <option value="ADMIN">Admin</option>
                        <option value="VENDOR">Vendor</option>
                        <option value="FINANCE">Finance</option>
                    </select>

                    <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#2c3e50", color: "white", border: "none", cursor: "pointer", borderRadius: "6px", fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                        Create Account
                    </button>
                </form>

                {message && <p style={{ color: "red", marginTop: "15px", textAlign: "center", fontWeight: '500' }}>{message}</p>}

                <p style={{ textAlign: "center", marginTop: "20px", color: '#7f8c8d' }}>
                    Already have an account? <a href="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;