import React, { useState, useEffect } from "react";
import AuthService from "../services/authService";
import axios from "axios";

const UserProfile = () => {
    // Local storage se user data uthana
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state for updating details
    const [formData, setFormData] = useState({
        email: user?.email || "",
        mobileNo: user?.mobileNo || ""
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // API call to update user details in backend
            // Note: Backend endpoint /api/users/update/[id] hona chahiye
            const response = await axios.put(`http://localhost:8081/api/users/update/${user.username}`, formData, config);
            
            // LocalStorage update karna taki refresh ke baad bhi naya data dikhe
            const updatedUser = { ...user, ...formData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update profile. Make sure backend endpoint is ready.");
        }
    };

    if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login to view profile.</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Arial' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', color: '#2c3e50' }}>My Account Profile</h2>
            
            <div style={{ marginTop: '25px' }}>
                <p><strong>Username:</strong> <span style={{ color: '#7f8c8d' }}>{user.username}</span></p>
                <p><strong>Role:</strong> 
                    <span style={{ marginLeft: '10px', padding: '4px 12px', backgroundColor: '#2ecc71', color: '#fff', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                        {user.role}
                    </span>
                </p>

                {!isEditing ? (
                    <>
                        <p><strong>Email:</strong> {user.email || "N/A"}</p>
                        <p><strong>Mobile Number:</strong> {user.mobileNo || "Not Provided"}</p>
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{ marginTop: '20px', padding: '10px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Edit Profile Details
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email Address:</label>
                            <input 
                                type="email" 
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Mobile Number:</label>
                            <input 
                                type="text" 
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                value={formData.mobileNo}
                                onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                                maxLength="10"
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;