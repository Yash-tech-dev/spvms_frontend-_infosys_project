// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';

// const Vendors = () => {
//     const [vendors, setVendors] = useState([]);
//     const [user] = useState(AuthService.getCurrentUser());
//     const [loading, setLoading] = useState(true);

//     // Configuration for API calls - Ensure token is valid
//     const config = { headers: { Authorization: `Bearer ${user?.token}` } };

//     useEffect(() => {
//         fetchVendors();
//     }, [user]);

//     /**
//      * METHOD: fetchVendors
//      * Working: Backend se vendors ki updated list mangwata hai.
//      */
//     const fetchVendors = async () => {
//         if (!user?.token) return;
//         try {
//             const res = await axios.get("http://localhost:8081/api/vendor/all", config);
//             setVendors(res.data);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching vendors:", err);
//             setLoading(false);
//         }
//     };

//     /**
//      * METHOD: handleToggleStatus
//      * Working: 
//      * 1. ID receive karke window confirmation maangta hai.
//      * 2. Backend ko PUT request bhejta hai (CORS compatibility ke liye).
//      * 3. Success par fetchVendors call karke UI table ko update karta hai.
//      */
//     const handleToggleStatus = async (id) => {
//         if (!window.confirm("Are you sure you want to change this vendor's status?")) return;
        
//         try {
//             // Using PUT as it's more stable for toggle operations across different CORS settings
//             const response = await axios.put(`http://localhost:8081/api/vendor/${id}/toggle-status`, {}, config);
            
//             if (response.status === 200) {
//                 console.log("Status updated for Vendor:", id);
//                 fetchVendors(); // Table refresh
//             }
//         } catch (err) {
//             console.error("Toggle Status Error:", err.response || err);
//             alert("Failed to update status. Please ensure Backend has @CrossOrigin enabled.");
//         }
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <h2 style={{ color: '#2c3e50' }}>Vendor Management – Overview</h2>
//                 <div>
//                     <button style={addBtnStyle} onClick={() => window.location.href="/add-vendor"}>
//                         + Add New Vendor
//                     </button>
//                     <button onClick={() => window.location.href="/dashboard1"} style={backBtnStyle}>
//                         Back to Dashboard
//                     </button>
//                 </div>
//             </div>
            
//             <hr style={{ margin: '20px 0', opacity: '0.3' }} />

//             {loading ? (
//                 <p>Loading vendors...</p>
//             ) : (
//                 <table border="0" width="100%" cellPadding="15" style={tableStyle}>
//                     <thead>
//                         <tr style={{ background: '#2980b9', color: 'white', textAlign: 'left' }}>
//                             <th>Vendor ID</th>
//                             <th>Vendor Name</th>
//                             <th>Company Name</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {vendors.length > 0 ? vendors.map((vendor) => (
//                             <tr key={vendor.id} style={rowStyle}>
//                                 <td><strong>VND-{vendor.id}</strong></td>
//                                 <td>{vendor.username}</td>
//                                 <td>{vendor.companyName || "N/A"}</td>
//                                 <td>{vendor.email || "N/A"}</td>
//                                 <td>{vendor.phone || "N/A"}</td>
//                                 <td>
//                                     <span style={{
//                                         ...statusBadgeBase,
//                                         backgroundColor: vendor.active ? '#e7f9ee' : '#fceaea',
//                                         color: vendor.active ? '#27ae60' : '#e74c3c'
//                                     }}>
//                                         {vendor.active ? '● ACTIVE' : '● INACTIVE'}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <button 
//                                         onClick={() => handleToggleStatus(vendor.id)}
//                                         style={{
//                                             ...actionBtnBase,
//                                             backgroundColor: vendor.active ? '#e74c3c' : '#27ae60'
//                                         }}>
//                                         {vendor.active ? 'Deactivate' : 'Activate'}
//                                     </button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No vendors found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// // --- Styles (Existing Styles Maintained) ---
// const tableStyle = { borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' };
// const rowStyle = { borderBottom: '1px solid #ecf0f1', backgroundColor: '#fff' };
// const statusBadgeBase = { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
// const backBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '10px' };
// const addBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px' };
// const actionBtnBase = { padding: '6px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };

// export default Vendors;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from '../services/authService';

/**
 * METHODS EXPLANATION:
 * 1. fetchVendors: Backend API (GET) se vendors ki array fetch karke state set karta hai.
 * 2. handleToggleStatus: 405 Error fix karne ke liye humne wapas PATCH method use kiya hai 
 * kyunki backend sirf wahi method allow kar raha hai.
 * 3. Configuration Management: Centralized config object use kiya gaya hai for Auth headers.
 */

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [user] = useState(AuthService.getCurrentUser());
    const [loading, setLoading] = useState(true);

    // Header setup with Bearer Token
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };

    useEffect(() => {
        fetchVendors();
    }, [user]);

    const fetchVendors = async () => {
        if (!user?.token) return;
        try {
            const res = await axios.get("http://localhost:8081/api/vendor/all", config);
            setVendors(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching vendors:", err);
            setLoading(false);
        }
    };

    // const handleToggleStatus = async (id) => {
    //     if (!window.confirm("Are you sure you want to change this vendor's status?")) return;
        
    //     try {
    //         // FIX: Changed from .put back to .patch to match Backend's allowed methods (fixes 405 Error)
    //         const response = await axios.patch(`http://localhost:8081/api/vendor/${id}/toggle-status`, {}, config);
            
    //         if (response.status === 200) {
    //             console.log("Status toggled successfully!");
    //             fetchVendors(); // UI Refresh
    //         }
    //     } catch (err) {
    //         // Detailed logging to identify if it's still Method Not Allowed or CORS
    //         console.error("Toggle Status Error Details:", err.response);
    //         if (err.response?.status === 405) {
    //             alert("Backend Error: 405 Method Not Allowed. Please check if your Controller uses @PatchMapping or @PostMapping.");
    //         } else {
    //             alert("Failed to update status. Please try again.");
    //         }
    //     }
    // };



/**
 * Method: handleToggleStatus (Updated with Auth)
 * Working: 
 * 1. LocalStorage se token nikaalta hai.
 * 2. Axios PATCH request mein 'Bearer' prefix ke saath token bhejta hai.
 */
/**
 * Method: handleToggleStatus
 * Working: 
 * 1. 'user' key se data nikaalta hai (jaisa screenshot mein dikh raha hai).
 * 2. JSON.parse karke uske andar se 'token' property access karta hai.
 * 3. Token milne par PATCH request bhejta hai.
 */
const handleToggleStatus = async (id) => {
    // Screenshot ke mutabiq aapka data 'user' key mein save hai
    const userData = localStorage.getItem("user");
    let token = null;

    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            token = parsedData.token; // Object ke andar se token nikaala
        } catch (e) {
            console.error("Error parsing user data from storage", e);
        }
    }

    console.log("Extracted Token:", token);

    if (!token) {
        alert("Session expired or Token missing. Please login again.");
        return;
    }

    try {
        const response = await axios.patch(
            `http://localhost:8081/api/vendor/${id}/toggle-status`, 
            {}, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            // UI state update logic
            setVendors(prevVendors => 
                prevVendors.map(v => v.id === id ? { ...v, active: !v.active } : v)
            );
            console.log("Status successfully updated for ID:", id);
        }
    } catch (error) {
        console.error("Error updating status:", error.response?.data || error.message);
        alert("Failed to update status. Check backend logs.");
    }
};



    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#2c3e50' }}>Vendor Management – Overview</h2>
                <div>
                    <button style={addBtnStyle} onClick={() => window.location.href="/add-vendor"}>
                        + Add New Vendor
                    </button>
                    <button onClick={() => window.location.href="/dashboard1"} style={backBtnStyle}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
            
            <hr style={{ margin: '20px 0', opacity: '0.3' }} />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading vendors...</div>
            ) : (
                <table border="0" width="100%" cellPadding="15" style={tableStyle}>
                    <thead>
                        <tr style={{ background: '#2980b9', color: 'white', textAlign: 'left' }}>
                            <th>Vendor ID</th>
                            <th>Vendor Name</th>
                            <th>Company Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length > 0 ? vendors.map((vendor) => (
                            <tr key={vendor.id} style={rowStyle}>
                                <td><strong>VND-{vendor.id}</strong></td>
                                <td>{vendor.username}</td>
                                <td>{vendor.companyName || "N/A"}</td>
                                <td>{vendor.email || "N/A"}</td>
                                <td>{vendor.phone || "N/A"}</td>
                                <td>
                                    <span style={{
                                        ...statusBadgeBase,
                                        backgroundColor: vendor.active ? '#e7f9ee' : '#fceaea',
                                        color: vendor.active ? '#27ae60' : '#e74c3c'
                                    }}>
                                        {vendor.active ? '● ACTIVE' : '● INACTIVE'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleToggleStatus(vendor.id)}
                                        style={{
                                            ...actionBtnBase,
                                            backgroundColor: vendor.active ? '#e74c3c' : '#27ae60'
                                        }}>
                                        {vendor.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No vendors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Styles (unchanged as per your request)
const tableStyle = { borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' };
const rowStyle = { borderBottom: '1px solid #ecf0f1', backgroundColor: '#fff' };
const statusBadgeBase = { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
const backBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '10px' };
const addBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px' };
const actionBtnBase = { padding: '6px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };

export default Vendors;