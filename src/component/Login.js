import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

/**
 * METHOD EXPLANATION:
 * 1. useEffect: Page load hote hi purana token clear karta hai taaki naya unique token generate ho sake.
 * 2. handleLogin: Credentials verify karke role-based redirection handle karta hai.
 * 3. input styling: Focus aur hover effects ke saath design ko improve kiya gaya hai.
 */

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Page load hote hi purana session clear karein
    useEffect(() => {
        AuthService.logout();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await AuthService.login(username, password);
            localStorage.setItem("token", user.token);
            console.log("User data from backend:", user); 

            // Backend provides unique token for each session
            const userRole = user.role; 

            if (userRole === "ROLE_ADMIN") {
                navigate("/admin-dashboard");
            } else if (userRole === "ROLE_FINANCE") {
                navigate("/finance-reporting");
            } else if (userRole === "ROLE_VENDOR") {
                navigate("/vendor-portal");
            } else {
                console.warn("Unknown role, redirecting to general dashboard:", userRole);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Failed! Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={loginCardStyle}>
                <div style={headerSection}>
                    <h2 style={titleStyle}>Welcome Back</h2>
                    <p style={subtitleStyle}>Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleLogin} style={formStyle}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Username</label>
                        <input 
                            style={inputStyle} 
                            type="text" 
                            placeholder="Enter your username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <input 
                            style={inputStyle} 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={loading ? {...buttonStyle, opacity: 0.7} : buttonStyle}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div style={footerStyle}>
                    <p>Don't have an account? <Link to="/register" style={linkStyle}>Register</Link></p>
                </div>
            </div>
        </div>
    );
};

// --- MODERN STYLES ---
const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const loginCardStyle = {
    padding: '40px',
    backgroundColor: 'white',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
};

const headerSection = {
    textAlign: 'center',
    marginBottom: '30px'
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 10px 0'
};

const subtitleStyle = {
    color: '#666',
    fontSize: '14px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const inputGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#444'
};

const inputStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#fafafa'
};

const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    marginTop: '10px',
    transition: 'background-color 0.3s shadow 0.3s',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
};

const footerStyle = {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666'
};

const linkStyle = {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600'
};

export default Login;