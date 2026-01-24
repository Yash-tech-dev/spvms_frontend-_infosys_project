// import React, { useState } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';
// import { useNavigate } from 'react-router-dom';

// /**
//  * METHOD EXPLANATION:
//  * 1. handleChange: Form inputs se data state mein update karta hai aur errors clean karta hai.
//  * 2. validateForm: Submit se pehle check karta hai ki saara data sahi format mein hai ya nahi.
//  * 3. handleSubmit: Validation pass hone par API call karta hai.
//  */

// const AddVendor = () => {
//     const navigate = useNavigate();
//     const [vendorData, setVendorData] = useState({
//         username: '',
//         password: '',
//         email: '',
//         companyName: '',
//         phone: '',
//         address: ''
//     });

//     // Validation errors state
//     const [errors, setErrors] = useState({});

//     const config = { headers: { Authorization: `Bearer ${AuthService.getCurrentUser()?.token}` } };

//     const handleChange = (e) => {
//         setVendorData({ ...vendorData, [e.target.name]: e.target.value });
//         // Typing ke waqt error message hatane ke liye
//         if (errors[e.target.name]) {
//             setErrors({ ...errors, [e.target.name]: '' });
//         }
//     };

//     const validateForm = () => {
//         let tempErrors = {};
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^[0-9]{10}$/;

//         if (!vendorData.username.trim()) tempErrors.username = "Username is required";
//         if (vendorData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
//         if (!emailRegex.test(vendorData.email)) tempErrors.email = "Invalid email format";
//         if (!vendorData.companyName.trim()) tempErrors.companyName = "Company name is required";
//         if (!phoneRegex.test(vendorData.phone)) tempErrors.phone = "Phone must be exactly 10 digits";
//         if (!vendorData.address.trim()) tempErrors.address = "Address cannot be empty";

//         setErrors(tempErrors);
//         return Object.keys(tempErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validation check
//         if (!validateForm()) return;

//         try {
//             // Note: Password hashing Backend (Bcrypt) mein handle hogi.
//             await axios.post("http://localhost:8081/api/vendor/add", vendorData, config);
//             alert("Vendor Added Successfully!");
//             navigate('/admin-vendors'); 
//         } catch (err) {
//             alert(err.response?.data?.message || "Error adding vendor. Check if username is unique.");
//         }
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={cardStyle}>
//                 <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>Register New Vendor</h2>
//                 <form onSubmit={handleSubmit}>
                    
//                     <div style={formGroup}>
//                         <label>Username (Login ID)</label>
//                         <input type="text" name="username" style={errors.username ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.username && <span style={errorTextStyle}>{errors.username}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Password</label>
//                         <input type="password" name="password" style={errors.password ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Email Address</label>
//                         <input type="email" name="email" style={errors.email ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Company Name</label>
//                         <input type="text" name="companyName" style={errors.companyName ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.companyName && <span style={errorTextStyle}>{errors.companyName}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Phone / Mobile</label>
//                         <input type="text" name="phone" placeholder="10 digit number" style={errors.phone ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Full Address</label>
//                         <textarea name="address" style={errors.address ? {...errorInputStyle, height: '60px'} : {...inputStyle, height: '60px'}} onChange={handleChange}></textarea>
//                         {errors.address && <span style={errorTextStyle}>{errors.address}</span>}
//                     </div>
                    
//                     <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//                         <button type="submit" style={saveBtnStyle}>Save Vendor</button>
//                         <button type="button" onClick={() => navigate('/admin-vendors')} style={cancelBtnStyle}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Styles ---
// const containerStyle = { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' };
// const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '450px' };
// const formGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
// const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' };
// const errorInputStyle = { ...inputStyle, border: '1px solid #e74c3c' }; // Red border for errors
// const errorTextStyle = { color: '#e74c3c', fontSize: '12px', marginTop: '3px' };
// const saveBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// const cancelBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

// export default AddVendor;

// import React, { useState } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';
// import { useNavigate } from 'react-router-dom';

// const AddVendor = () => {
//     const navigate = useNavigate();
//     const [vendorData, setVendorData] = useState({
//         username: '',
//         password: '',
//         email: '',
//         companyName: '',
//         phone: '',
//         address: ''
//     });

//     const [errors, setErrors] = useState({});
//     const config = { headers: { Authorization: `Bearer ${AuthService.getCurrentUser()?.token}` } };

//     const handleChange = (e) => {
//         setVendorData({ ...vendorData, [e.target.name]: e.target.value });
//         if (errors[e.target.name]) {
//             setErrors({ ...errors, [e.target.name]: '' });
//         }
//     };

//     const validateForm = () => {
//         let tempErrors = {};
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^[0-9]{10}$/;

//         if (!vendorData.username.trim()) tempErrors.username = "Username is required";
//         if (vendorData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
//         if (!emailRegex.test(vendorData.email)) tempErrors.email = "Invalid email format";
//         if (!vendorData.companyName.trim()) tempErrors.companyName = "Company name is required";
//         if (!phoneRegex.test(vendorData.phone)) tempErrors.phone = "Phone must be exactly 10 digits";
//         if (!vendorData.address.trim()) tempErrors.address = "Address cannot be empty";

//         setErrors(tempErrors);
//         return Object.keys(tempErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         try {
//             /**
//              * FIX EXPLANATION: 
//              * Humne endpoint badal kar "/api/auth/signup" (ya jo aapka register endpoint hai) kar diya hai.
//              * Kyunki aapka 'Register' page hash kar raha hai, toh wahi endpoint use karne se 
//              * Admin jab vendor add karega toh password auto-hash (BCrypt) ho jayega.
//              */
//             const payload = {
//                 ...vendorData,
//                 role: "VENDOR", // Forcefully role vendor set kar rahe hain
//                 mobileNo: vendorData.phone // Field mapping fix (phone to mobileNo)
//             };

//             await axios.post("http://localhost:8081/api/auth/signup", payload, config);
            
//             alert("Vendor Registered with Hashed Password!");
//             navigate('/admin-vendors'); 
//         } catch (err) {
//             alert(err.response?.data?.message || "Error adding vendor. Check connection or unique username.");
//         }
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={cardStyle}>
//                 <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>Register New Vendor</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div style={formGroup}>
//                         <label>Username (Login ID)</label>
//                         <input type="text" name="username" style={errors.username ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.username && <span style={errorTextStyle}>{errors.username}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Password</label>
//                         <input type="password" name="password" style={errors.password ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Email Address</label>
//                         <input type="email" name="email" style={errors.email ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Company Name</label>
//                         <input type="text" name="companyName" style={errors.companyName ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.companyName && <span style={errorTextStyle}>{errors.companyName}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Phone / Mobile</label>
//                         <input type="text" name="phone" placeholder="10 digit number" style={errors.phone ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label>Full Address</label>
//                         <textarea name="address" style={errors.address ? {...errorInputStyle, height: '60px'} : {...inputStyle, height: '60px'}} onChange={handleChange}></textarea>
//                         {errors.address && <span style={errorTextStyle}>{errors.address}</span>}
//                     </div>
                    
//                     <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//                         <button type="submit" style={saveBtnStyle}>Save Vendor</button>
//                         <button type="button" onClick={() => navigate('/admin-vendors')} style={cancelBtnStyle}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // Styles (Aapka original layout)
// const containerStyle = { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' };
// const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '450px' };
// const formGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
// const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' };
// const errorInputStyle = { ...inputStyle, border: '1px solid #e74c3c' };
// const errorTextStyle = { color: '#e74c3c', fontSize: '12px', marginTop: '3px' };
// const saveBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// const cancelBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

// export default AddVendor;




// import React, { useState } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService'; // AuthService ka direct use karenge
// import { useNavigate } from 'react-router-dom';

// const AddVendor = () => {
//     const navigate = useNavigate();
//     const [vendorData, setVendorData] = useState({
//         username: '',
//         password: '',
//         email: '',
//         companyName: '',
//         phone: '',
//         address: ''
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         setVendorData({ ...vendorData, [e.target.name]: e.target.value });
//         if (errors[e.target.name]) {
//             setErrors({ ...errors, [e.target.name]: '' });
//         }
//     };

//     const validateForm = () => {
//         let tempErrors = {};
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^[0-9]{10}$/;

//         if (!vendorData.username.trim()) tempErrors.username = "Username is required";
//         if (vendorData.password.length < 6) tempErrors.password = "Password must be 6+ chars";
//         if (!emailRegex.test(vendorData.email)) tempErrors.email = "Invalid email";
//         if (!vendorData.companyName.trim()) tempErrors.companyName = "Company name required";
//         if (!phoneRegex.test(vendorData.phone)) tempErrors.phone = "10 digit phone required";
//         if (!vendorData.address.trim()) tempErrors.address = "Address required";

//         setErrors(tempErrors);
//         return Object.keys(tempErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         try {
//             /**
//              * WORKING METHOD: AuthService.register
//              * Hum wahi method use karenge jo aapka 'Register.js' use karta hai.
//              * Isse Hashing (Bcrypt) aur Role dono sahi se save honge.
//              */
//             await AuthService.register(
//                 vendorData.username,
//                 vendorData.email,
//                 vendorData.password,
//                 "VENDOR",         // Role automatic set kiya
//                 vendorData.phone,   // mobileNo ki jagah backend phone/mobileNo accept karega
//                 vendorData.companyName, // Additional fields
//                 vendorData.address
//             );

//             alert("Vendor Registered Successfully with Hashed Password!");
//             navigate('/admin-vendors'); 
//         } catch (err) {
//             // Logs ke hisaab se agar duplicate username hai toh ye trigger hoga
//             const errorMsg = err.response?.data || "Check if username/email already exists.";
//             alert("Error: " + (typeof errorMsg === 'string' ? errorMsg : "Registration Failed"));
//         }
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={cardStyle}>
//                 <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '20px' }}>Register New Vendor</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div style={formGroup}>
//                         <label style={labelStyle}>Username (Login ID)</label>
//                         <input type="text" name="username" style={errors.username ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.username && <span style={errorTextStyle}>{errors.username}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label style={labelStyle}>Password</label>
//                         <input type="password" name="password" style={errors.password ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label style={labelStyle}>Email Address</label>
//                         <input type="email" name="email" style={errors.email ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label style={labelStyle}>Company Name</label>
//                         <input type="text" name="companyName" style={errors.companyName ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.companyName && <span style={errorTextStyle}>{errors.companyName}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label style={labelStyle}>Phone / Mobile</label>
//                         <input type="text" name="phone" maxLength="10" style={errors.phone ? errorInputStyle : inputStyle} onChange={handleChange} />
//                         {errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
//                     </div>

//                     <div style={formGroup}>
//                         <label style={labelStyle}>Full Address</label>
//                         <textarea name="address" style={errors.address ? {...errorInputStyle, height: '60px'} : {...inputStyle, height: '60px'}} onChange={handleChange}></textarea>
//                         {errors.address && <span style={errorTextStyle}>{errors.address}</span>}
//                     </div>
                    
//                     <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//                         <button type="submit" style={saveBtnStyle}>Save Vendor</button>
//                         <button type="button" onClick={() => navigate('/admin-vendors')} style={cancelBtnStyle}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // Styles (UI bilkul waisa hi rakha hai)
// const containerStyle = { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' };
// const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '450px' };
// const formGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
// const labelStyle = { fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' };
// const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px', fontSize: '14px' };
// const errorInputStyle = { ...inputStyle, border: '1px solid #e74c3c' };
// const errorTextStyle = { color: '#e74c3c', fontSize: '12px', marginTop: '3px' };
// const saveBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#057a3a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// const cancelBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

// export default AddVendor;


import React, { useState } from 'react';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AddVendor = () => {
    const navigate = useNavigate();
    const [vendorData, setVendorData] = useState({
        username: '',
        password: '',
        email: '',
        companyName: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setVendorData({ ...vendorData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Trim username because spaces cause issues in backend validation
        if (!vendorData.username.trim()) tempErrors.username = "Username is required";
        if (vendorData.password.length < 6) tempErrors.password = "Password must be 6+ chars";
        if (!emailRegex.test(vendorData.email)) tempErrors.email = "Invalid email";
        if (!vendorData.companyName.trim()) tempErrors.companyName = "Company name required";
        if (!vendorData.phone || vendorData.phone.length !== 10) tempErrors.phone = "10 digit phone required";
        if (!vendorData.address.trim()) tempErrors.address = "Address required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            console.log("Sending Payload:", vendorData); // Debugging ke liye

            /**
             * METHOD EXPLANATION:
             * Hum parameters ko backend ke SignupRequest DTO ke order mein bhej rahe hain.
             * ROLE 'ROLE_VENDOR' hona chahiye (Spring Security convention).
             */
            await AuthService.register(
                vendorData.username.trim(), 
                vendorData.email,
                vendorData.password,
                "ROLE_VENDOR",      // Prefix added for Security
                vendorData.phone,    // mobileNo mapping
                vendorData.companyName, 
                vendorData.address
            );

            alert("Vendor Registered Successfully!");
            navigate('/admin-vendors'); 
        } catch (err) {
            /**
             * IMPROVED ERROR HANDLING:
             * Ab aapko sirf 'Already Exists' nahi dikhega. 
             * Agar backend koi specific message dega (e.g. "Address too long"), toh wo dikhega.
             */
            console.error("Full Error Object:", err);
            const serverMessage = err.response?.data?.message || err.response?.data || "Server Error";
            alert("Error: " + serverMessage);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '20px' }}>Register New Vendor</h2>
                <form onSubmit={handleSubmit}>
                    <div style={formGroup}>
                        <label style={labelStyle}>Username (Login ID)</label>
                        <input 
                            type="text" 
                            name="username" 
                            autoComplete="off"
                            style={errors.username ? errorInputStyle : inputStyle} 
                            onChange={handleChange} 
                        />
                        {errors.username && <span style={errorTextStyle}>{errors.username}</span>}
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            style={errors.password ? errorInputStyle : inputStyle} 
                            onChange={handleChange} 
                        />
                        {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            style={errors.email ? errorInputStyle : inputStyle} 
                            onChange={handleChange} 
                        />
                        {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Company Name</label>
                        <input 
                            type="text" 
                            name="companyName" 
                            style={errors.companyName ? errorInputStyle : inputStyle} 
                            onChange={handleChange} 
                        />
                        {errors.companyName && <span style={errorTextStyle}>{errors.companyName}</span>}
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Phone / Mobile</label>
                        <input 
                            type="text" 
                            name="phone" 
                            maxLength="10" 
                            style={errors.phone ? errorInputStyle : inputStyle} 
                            onChange={handleChange} 
                        />
                        {errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Full Address</label>
                        <textarea 
                            name="address" 
                            style={errors.address ? {...errorInputStyle, height: '60px'} : {...inputStyle, height: '60px'}} 
                            onChange={handleChange}
                        ></textarea>
                        {errors.address && <span style={errorTextStyle}>{errors.address}</span>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" style={saveBtnStyle}>Save Vendor</button>
                        <button type="button" onClick={() => navigate('/admin-vendors')} style={cancelBtnStyle}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Styles (unchanged)
const containerStyle = { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' };
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '450px' };
const formGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const labelStyle = { fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px', fontSize: '14px' };
const errorInputStyle = { ...inputStyle, border: '1px solid #e74c3c' };
const errorTextStyle = { color: '#e74c3c', fontSize: '12px', marginTop: '3px' };
const saveBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#057a3a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default AddVendor;