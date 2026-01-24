// import React, { useState } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';

// /**
//  * METHOD EXPLANATION:
//  * 1. handleInputChange: Har field ki value state mein update karta hai.
//  * 2. calculateTotal: Quantity aur Unit Price ko multiply karke live total dikhata hai.
//  * 3. handleSubmit: Data ko backend endpoint (/api/pr/create) par bhejta hai.
//  */

// const CreatePurchaseRequest = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [formData, setFormData] = useState({
//         itemName: '',
//         description: '',
//         quantity: 1,
//         unitPrice: 0
//     });

//     const [loading, setLoading] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const config = {
//             headers: { Authorization: `Bearer ${user?.token}` }
//         };

//         try {
//             // Backend endpoint to save PR
//             await axios.post("http://localhost:8081/api/pr/create", formData, config);
//             alert("Purchase Request created successfully!");
//             setFormData({ itemName: '', description: '', quantity: 1, unitPrice: 0 });
//         } catch (err) {
//             console.error("PR Error:", err);
//             alert("Failed to create PR. Please check backend.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={cardStyle}>
//                 <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Create Purchase Request</h2>
//                 <form onSubmit={handleSubmit}>
                    
//                     <div style={formGroup}>
//                         <label>Item Name</label>
//                         <input 
//                             type="text" name="itemName" value={formData.itemName} 
//                             onChange={handleInputChange} style={inputStyle} required 
//                             placeholder="e.g. Office Laptops"
//                         />
//                     </div>

//                     <div style={formGroup}>
//                         <label>Description</label>
//                         <textarea 
//                             name="description" value={formData.description} 
//                             onChange={handleInputChange} style={{...inputStyle, height: '80px'}} 
//                             placeholder="Enter item details..."
//                         />
//                     </div>

//                     <div style={{ display: 'flex', gap: '20px' }}>
//                         <div style={formGroup}>
//                             <label>Quantity</label>
//                             <input 
//                                 type="number" name="quantity" value={formData.quantity} 
//                                 onChange={handleInputChange} style={inputStyle} min="1" required 
//                             />
//                         </div>
//                         <div style={formGroup}>
//                             <label>Unit Price (₹)</label>
//                             <input 
//                                 type="number" name="unitPrice" value={formData.unitPrice} 
//                                 onChange={handleInputChange} style={inputStyle} min="0" step="0.01" required 
//                             />
//                         </div>
//                     </div>

//                     <div style={totalBox}>
//                         <strong>Estimated Total: ₹{formData.quantity * formData.unitPrice}</strong>
//                     </div>

//                     <button type="submit" disabled={loading} style={submitBtnStyle}>
//                         {loading ? 'Submitting...' : 'Submit Request'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- Styles ---
// const containerStyle = { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '80vh' };
// const cardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' };
// const formGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column', flex: 1 };
// const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '5px', fontSize: '14px' };
// const totalBox = { padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '6px', marginBottom: '20px', color: '#2980b9' };
// const submitBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

// export default CreatePurchaseRequest;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate import kiya

const CreatePurchaseRequest = () => {
    const navigate = useNavigate(); // 2. navigate initialize kiya
    const [user] = useState(AuthService.getCurrentUser());
    const [vendors, setVendors] = useState([]); 
    const [formData, setFormData] = useState({
        itemName: '', 
        description: '', 
        quantity: 1,
        unitPrice: 0,
        vendorId: '' 
    });

    const [loading, setLoading] = useState(false);
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await axios.get("http://localhost:8081/api/users/role/vendor", config);
                setVendors(res.data);
            } catch (err) {
                console.error("Vendors load error:", err);
            }
        };
        fetchVendors();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * METHOD: handleSubmit 
     * Logic unchanged, bas alert ke baad redirect add kiya hai.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.vendorId) { alert("Please select a vendor!"); return; }
        setLoading(true);

        try {
            const prResponse = await axios.post("http://localhost:8081/api/pr/create", {
                description: formData.description,
                vendor: { id: parseInt(formData.vendorId) }
            }, config);

            const prId = prResponse.data.id; 

            if (prId) {
                await axios.post(`http://localhost:8081/api/pr/${prId}/items`, {
                    itemName: formData.itemName,
                    quantity: formData.quantity,
                    unitPrice: formData.unitPrice
                }, config);

                alert("🚀 PR and Line Items created successfully!");
                // 3. SUCCESS REDIRECT
                navigate('/dashboard'); 
            }
        } catch (err) {
            console.error("Submission Error:", err);
            alert("❌ Error: Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <i className="fas fa-file-invoice-dollar" style={{fontSize: '24px', marginRight: '10px'}}></i>
                    <h2 style={{ margin: 0 }}>Create Purchase Request</h2>
                </div>
                
                <form onSubmit={handleSubmit} style={{padding: '20px'}}>
                    <div style={formGroup}>
                        <label style={labelStyle}><i className="fas fa-store"></i> Select Vendor</label>
                        <select 
                            name="vendorId" 
                            value={formData.vendorId} 
                            onChange={handleInputChange} 
                            style={inputStyle} 
                            required
                        >
                            <option value="">-- Choose a Vendor --</option>
                            {vendors && vendors.length > 0 ? (
                                vendors.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.companyName ? `${v.companyName} (${v.username})` : v.username}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No Vendors Found in Database</option>
                            )}
                        </select>
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}><i className="fas fa-tag"></i> Item Name</label>
                        <input type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Dell Latitude Laptop" required />
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}><i className="fas fa-align-left"></i> Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} style={{...inputStyle, height: '80px', resize: 'none'}} placeholder="Purpose of this purchase..." required />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{...formGroup, flex: 1}}>
                            <label style={labelStyle}><i className="fas fa-list-ol"></i> Qty</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} style={inputStyle} min="1" />
                        </div>
                        <div style={{...formGroup, flex: 2}}>
                            <label style={labelStyle}><i className="fas fa-indian-rupee-sign"></i> Unit Price</label>
                            <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} style={inputStyle} placeholder="0.00" />
                        </div>
                    </div>

                    <div style={totalBox}>
                        <span style={{color: '#546e7a', fontSize: '14px'}}>Estimated Investment</span>
                        <div style={{fontSize: '22px', fontWeight: '800', color: '#1e88e5'}}>
                            ₹{(formData.quantity * formData.unitPrice).toLocaleString()}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={loading ? disabledBtnStyle : submitBtnStyle}>
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                        ) : (
                            <><i className="fas fa-paper-plane"></i> Submit PR Request</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
const cardStyle = { background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '480px', overflow: 'hidden' };
const headerStyle = { background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const formGroup = { marginBottom: '18px', display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#455a64', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' };
const inputStyle = { padding: '12px', border: '1.5px solid #eceff1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.3s ease', outline: 'none', backgroundColor: '#fafafa' };
const totalBox = { padding: '15px', background: '#e3f2fd', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', border: '1px dashed #2196f3' };
const submitBtnStyle = { width: '100%', padding: '14px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.3s' };
const disabledBtnStyle = { ...submitBtnStyle, background: '#95a5a6', cursor: 'not-allowed' };

export default CreatePurchaseRequest;