// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import AuthService from '../services/authService';

// // const VendorPortal = () => {
// //     const [user] = useState(AuthService.getCurrentUser());
// //     const [activeTab, setActiveTab] = useState('profile');
// //     const [vendorDetails, setVendorDetails] = useState({});
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [purchaseOrders, setPurchaseOrders] = useState([]);
// //     const [loading, setLoading] = useState(false);

// //     const config = { headers: { Authorization: `Bearer ${user?.token}` } };

// //     // --- METHOD: Parse Username from JWT ---
// //     const getUsernameFromToken = (token) => {
// //         try {
// //             const base64Url = token.split('.')[1];
// //             const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
// //             return JSON.parse(window.atob(base64)).sub;
// //         } catch (e) { return null; }
// //     };

// //     // --- METHOD: Fetch All Data ---
// //     const fetchEverything = async () => {
// //         if (!user?.token) return;
// //         setLoading(true);
// //         try {
// //             const userName = getUsernameFromToken(user.token);
// //             // 1. Fetch Profile
// //             const profileRes = await axios.get(`http://localhost:8081/api/users/${userName}`, config);
// //             setVendorDetails(profileRes.data);

// //             // 2. Fetch Orders using the ID from Profile
// //             if (profileRes.data.id) {
// //                 const poRes = await axios.get(`http://localhost:8081/api/po/vendor/${profileRes.data.id}`, config);
// //                 setPurchaseOrders(poRes.data || []);
// //             }
// //         } catch (err) {
// //             console.error("Data fetch error:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchEverything();
// //     }, [user]);

// //     // --- METHOD: Handle Edit Inputs ---
// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setVendorDetails({ ...vendorDetails, [name]: value });
// //     };

// //     // --- METHOD: Save Profile (Backend Sync) ---
// //     const handleSaveProfile = async () => {
// //         try {
// //             const userName = getUsernameFromToken(user.token);
// //             // Calling your existing PUT endpoint
// //             await axios.put(`http://localhost:8081/api/users/update/${userName}`, vendorDetails, config);
// //             alert("Profile Updated Successfully!");
// //             setIsEditing(false);
// //             fetchEverything(); // Refresh data
// //         } catch (err) {
// //             alert("Update failed! Please check backend DTO.");
// //         }
// //     };

// //     // --- METHOD: Calculate Pending Payments ---
// //     const calculatePayments = () => {
// //         // Sirf DELIVERED orders ka sum nikalo
// //         return purchaseOrders
// //             .filter(po => po.status === 'DELIVERED')
// //             .reduce((sum, po) => sum + (po.totalAmount || 0), 0);
// //     };

// //     // --- METHOD: Update Order Status ---
// //     const handleStatusUpdate = async (poId, newStatus) => {
// //         try {
// //             await axios.put(`http://localhost:8081/api/po/${poId}/status`, { status: newStatus }, config);
// //             const updated = purchaseOrders.map(p => p.id === poId ? {...p, status: newStatus} : p);
// //             setPurchaseOrders(updated);
// //         } catch (err) {
// //             alert("Status update failed!");
// //         }
// //     };

// //     return (
// //         <div style={containerStyle}>
// //             {/* Sidebar Section */}
// //             <div style={sidebarStyle}>
// //                 <h3 style={{color: 'white', textAlign: 'center', marginBottom: '35px', fontSize: '22px'}}>Vendor Panel</h3>
// //                 <button onClick={() => {setActiveTab('profile'); setIsEditing(false);}} style={activeTab === 'profile' ? activeTabStyle : tabStyle}>Profile</button>
// //                 <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? activeTabStyle : tabStyle}>Purchase Orders</button>
// //                 <button onClick={() => setActiveTab('invoices')} style={activeTab === 'invoices' ? activeTabStyle : tabStyle}>Invoices & Payments</button>
// //             </div>

// //             {/* Content Section */}
// //             <div style={contentStyle}>
// //                 <div style={whiteCard}>
// //                     {loading ? <p>Loading data...</p> : (
// //                         <>
// //                             {/* PROFILE SECTION */}
// //                             {activeTab === 'profile' && (
// //                                 <div>
// //                                     <h2 style={sectionTitle}>Your Profile Details</h2>
// //                                     <div style={infoGrid}>
// //                                         <div style={infoItem}>
// //                                             <strong>Company:</strong> <br/>
// //                                             {isEditing ? <input name="companyName" value={vendorDetails.companyName || ''} onChange={handleInputChange} style={inputBox} /> : (vendorDetails.companyName || 'N/A')}
// //                                         </div>
// //                                         <div style={infoItem}>
// //                                             <strong>Email:</strong> <br/>
// //                                             {isEditing ? <input name="email" value={vendorDetails.email || ''} onChange={handleInputChange} style={inputBox} /> : (vendorDetails.email || 'N/A')}
// //                                         </div>
// //                                         <div style={infoItem}>
// //                                             <strong>Phone:</strong> <br/>
// //                                             {isEditing ? <input name="mobileNo" value={vendorDetails.mobileNo || ''} onChange={handleInputChange} style={inputBox} /> : (vendorDetails.mobileNo || 'N/A')}
// //                                         </div>
// //                                         <div style={infoItem}>
// //                                             <strong>Address:</strong> <br/>
// //                                             {isEditing ? <input name="address" value={vendorDetails.address || ''} onChange={handleInputChange} style={inputBox} /> : (vendorDetails.address || 'N/A')}
// //                                         </div>
// //                                     </div>
                                    
// //                                     <div style={{marginTop: '20px'}}>
// //                                         {isEditing ? (
// //                                             <div style={{display: 'flex', gap: '10px'}}>
// //                                                 <button onClick={handleSaveProfile} style={saveBtn}>Save Changes</button>
// //                                                 <button onClick={() => setIsEditing(false)} style={cancelBtn}>Cancel</button>
// //                                             </div>
// //                                         ) : (
// //                                             <button onClick={() => setIsEditing(true)} style={editBtn}>Edit Profile</button>
// //                                         )}
// //                                     </div>

// //                                     <div style={{marginTop: '40px'}}>
// //                                         <h4 style={{fontWeight: 'bold', marginBottom: '15px'}}>Compliance Documents</h4>
// //                                         <input type="file" />
// //                                     </div>
// //                                 </div>
// //                             )}

// //                             {/* PURCHASE ORDERS SECTION */}
// //                             {activeTab === 'orders' && (
// //                                 <div>
// //                                     <h2 style={sectionTitle}>Assigned Purchase Orders</h2>
// //                                     <table style={tableStyle}>
// //                                         <thead>
// //                                             <tr style={tableHeader}>
// //                                                 <th>PO ID</th>
// //                                                 <th>Description</th>
// //                                                 <th>Total Amount</th>
// //                                                 <th>Status</th>
// //                                                 <th>Actions</th>
// //                                             </tr>
// //                                         </thead>
// //                                         <tbody>
// //                                             {purchaseOrders.length > 0 ? purchaseOrders.map(po => (
// //                                                 <tr key={po.id} style={trStyle}>
// //                                                     <td style={tdStyle}>#{po.id}</td>
// //                                                     <td style={tdStyle}>{po.purchaseRequest?.description || 'N/A'}</td>
// //                                                     <td style={tdStyle}>₹{po.totalAmount}</td>
// //                                                     <td style={tdStyle}>
// //                                                         <span style={statusBadge(po.status)}>{po.status}</span>
// //                                                     </td>
// //                                                     <td style={tdStyle}>
// //                                                         {(po.status === 'OFFICIAL_PO' || po.status === 'PENDING') && (
// //                                                             <button onClick={() => handleStatusUpdate(po.id, 'ACCEPTED')} style={acceptBtn}>Accept</button>
// //                                                         )}
// //                                                         {po.status === 'ACCEPTED' && (
// //                                                             <button onClick={() => handleStatusUpdate(po.id, 'DELIVERED')} style={deliverBtn}>Mark Delivered</button>
// //                                                         )}
// //                                                     </td>
// //                                                 </tr>
// //                                             )) : (
// //                                                 <tr><td colSpan="5" style={{textAlign:'center', padding:'30px'}}>No orders assigned yet.</td></tr>
// //                                             )}
// //                                         </tbody>
// //                                     </table>
// //                                 </div>
// //                             )}

// //                             {/* INVOICES SECTION */}
// //                             {activeTab === 'invoices' && (
// //                                 <div>
// //                                     <h2 style={sectionTitle}>Payment & Invoicing</h2>
// //                                     <p style={{color: '#666', marginBottom: '20px'}}>Track your payments and upload invoices for delivered goods.</p>
// //                                     <div style={paymentBox}>
// //                                         Pending Payments: <strong>₹{calculatePayments().toLocaleString()}</strong>
// //                                     </div>
// //                                     <button style={invoiceBtn}>Generate New Invoice</button>
// //                                 </div>
// //                             )}
// //                         </>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // // --- STYLES (Fixed Alignment) ---
// // const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' };
// // const sidebarStyle = { width: '260px', backgroundColor: '#2c3e50', padding: '25px', display: 'flex', flexDirection: 'column', gap: '8px' };
// // const contentStyle = { flex: 1, padding: '45px' };
// // const whiteCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' };
// // const sectionTitle = { marginBottom: '30px', fontWeight: 'bold', fontSize: '24px' };

// // const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '30px', columnGap: '60px' };
// // const infoItem = { fontSize: '16px', color: '#333' };
// // const inputBox = { padding: '8px', width: '100%', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' };

// // const tabStyle = { padding: '14px 18px', border: 'none', background: 'transparent', color: '#bdc3c7', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', fontSize: '15px' };
// // const activeTabStyle = { ...tabStyle, background: '#3e5062', color: 'white', fontWeight: 'bold' };

// // const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
// // const tableHeader = { borderBottom: '2px solid #eee', textAlign: 'left', fontSize: '15px' };
// // const trStyle = { borderBottom: '1px solid #f9f9f9' };
// // const tdStyle = { padding: '18px 10px', color: '#444' };

// // const paymentBox = { background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px', borderLeft: '5px solid #2ecc71', fontSize: '18px' };

// // // Buttons
// // const editBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
// // const saveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
// // const cancelBtn = { backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
// // const acceptBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// // const deliverBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// // const invoiceBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

// // const statusBadge = (s) => ({
// //     padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold',
// //     backgroundColor: s === 'ACCEPTED' ? '#e8f5e9' : s === 'DELIVERED' ? '#e3f2fd' : '#fff3e0',
// //     color: s === 'ACCEPTED' ? '#27ae60' : s === 'DELIVERED' ? '#2980b9' : '#e67e22'
// // });

// // export default VendorPortal;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';

// const VendorPortal = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [activeTab, setActiveTab] = useState('profile');
//     const [vendorDetails, setVendorDetails] = useState({});
//     const [isEditing, setIsEditing] = useState(false);
//     const [purchaseOrders, setPurchaseOrders] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const config = { headers: { Authorization: `Bearer ${user?.token}` } };

//     const getUsernameFromToken = (token) => {
//         try {
//             const base64Url = token.split('.')[1];
//             const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//             return JSON.parse(window.atob(base64)).sub;
//         } catch (e) { return null; }
//     };

//     const fetchEverything = async () => {
//         if (!user?.token) return;
//         setLoading(true);
//         try {
//             const userName = getUsernameFromToken(user.token);
//             const profileRes = await axios.get(`http://localhost:8081/api/users/${userName}`, config);
//             setVendorDetails(profileRes.data);
//             if (profileRes.data.id) {
//                 const poRes = await axios.get(`http://localhost:8081/api/po/vendor/${profileRes.data.id}`, config);
//                 setPurchaseOrders(poRes.data || []);
//             }
//         } catch (err) { console.error(err); } finally { setLoading(false); }
//     };

//     useEffect(() => { fetchEverything(); }, [user]);

//     // --- METHOD: Status Update (Connects to your poController) ---
//     // Explanation:
//     // 1. Map bhej rahe hain { "status": "ACCEPTED" } jaisa aapka backend expect kar raha hai.
//     // 2. toUpperCase() lagaya hai taaki Enum mismatch na ho.
//     const handleStatusUpdate = async (poId, newStatus) => {
//         try {
//             await axios.put(`http://localhost:8081/api/po/${poId}/status`, { status: newStatus.toUpperCase() }, config);
//             alert(`Order ${newStatus} successfully!`);
            
//             // Local state update taaki bina refresh kiye status badal jaye
//             const updatedOrders = purchaseOrders.map(po => 
//                 po.id === poId ? { ...po, status: newStatus } : po
//             );
//             setPurchaseOrders(updatedOrders);
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update status. Check Backend Enum values.");
//         }
//     };

//     const handleSaveProfile = async () => {
//         try {
//             const userName = getUsernameFromToken(user.token);
//             await axios.put(`http://localhost:8081/api/users/update/${userName}`, vendorDetails, config);
//             alert("Profile Updated!");
//             setIsEditing(false);
//             fetchEverything();
//         } catch (err) { alert("Update failed!"); }
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFile) return;
//         const formData = new FormData();
//         formData.append('file', selectedFile);
//         try {
//             await axios.post(`http://localhost:8081/api/vendor/upload`, formData, config);
//             alert("File saved in Database!");
//             setSelectedFile(null);
//         } catch (err) { alert("Upload failed!"); }
//     };

//     const calculatePayments = () => {
//         return purchaseOrders
//             .filter(po => po.status === 'DELIVERED')
//             .reduce((sum, po) => sum + (po.totalAmount || 0), 0);
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={sidebarStyle}>
//                 <h3 style={{color: 'white', textAlign: 'center', marginBottom: '35px'}}>Vendor Panel</h3>
//                 <button onClick={() => setActiveTab('profile')} style={activeTab === 'profile' ? activeTabStyle : tabStyle}>Profile</button>
//                 <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? activeTabStyle : tabStyle}>Purchase Orders</button>
//                 <button onClick={() => setActiveTab('invoices')} style={activeTab === 'invoices' ? activeTabStyle : tabStyle}>Invoices & Payments</button>
//             </div>

//             <div style={contentStyle}>
//                 <div style={whiteCard}>
//                     {activeTab === 'profile' && (
//                         <div>
//                             <h2 style={{marginBottom: '30px', fontWeight: 'bold'}}>Your Profile Details</h2>
//                             <div style={infoGrid}>
//                                 <div style={infoItem}><strong>Company:</strong> <br/> {isEditing ? <input value={vendorDetails.companyName || ''} onChange={(e)=>setVendorDetails({...vendorDetails, companyName: e.target.value})} style={inputBox} /> : (vendorDetails.companyName || 'N/A')}</div>
//                                 <div style={infoItem}><strong>Email:</strong> <br/> {isEditing ? <input value={vendorDetails.email || ''} onChange={(e)=>setVendorDetails({...vendorDetails, email: e.target.value})} style={inputBox} /> : (vendorDetails.email || 'N/A')}</div>
//                                 <div style={infoItem}><strong>Phone:</strong> <br/> {isEditing ? <input value={vendorDetails.mobileNo || ''} onChange={(e)=>setVendorDetails({...vendorDetails, mobileNo: e.target.value})} style={inputBox} /> : (vendorDetails.mobileNo || 'N/A')}</div>
//                                 <div style={infoItem}><strong>Address:</strong> <br/> {isEditing ? <input value={vendorDetails.address || ''} onChange={(e)=>setVendorDetails({...vendorDetails, address: e.target.value})} style={inputBox} /> : (vendorDetails.address || 'N/A')}</div>
//                             </div>
//                             <div style={{marginTop: '25px'}}>
//                                 {isEditing ? <button onClick={handleSaveProfile} style={saveBtn}>Save Changes</button> : <button onClick={() => setIsEditing(true)} style={blueBtn}>Edit Profile</button>}
//                             </div>
//                             <div style={{marginTop: '45px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
//                                 <h4 style={{fontWeight: 'bold', marginBottom: '15px'}}>Compliance Documents</h4>
//                                 <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
//                                     <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={fileInput} />
//                                     {selectedFile && <button onClick={handleFileUpload} style={uploadBtn}>Upload Document</button>}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'orders' && (
//                         <div>
//                             <h2 style={{marginBottom: '25px', fontWeight: 'bold'}}>Assigned Purchase Orders</h2>
//                             <table style={tableStyle}>
//                                 <thead>
//                                     <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
//                                         <th style={thStyle}>PO ID</th>
//                                         <th style={thStyle}>Description</th>
//                                         <th style={thStyle}>Total Amount</th>
//                                         <th style={thStyle}>Status</th>
//                                         <th style={thStyle}>Action</th> {/* Action Column Re-added */}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {purchaseOrders.map(po => (
//                                         <tr key={po.id} style={{borderBottom: '1px solid #f9f9f9'}}>
//                                             <td style={tdStyle}>#{po.id}</td>
//                                             <td style={tdStyle}>{po.purchaseRequest?.description || 'N/A'}</td>
//                                             <td style={tdStyle}>₹{po.totalAmount}</td>
//                                             <td style={tdStyle}><span style={statusBadge(po.status)}>{po.status}</span></td>
//                                             <td style={tdStyle}>
//                                                 {/* Button Logic based on Status */}
//                                                 {(po.status === 'OFFICIAL_PO' || po.status === 'PENDING') && (
//                                                     <button onClick={() => handleStatusUpdate(po.id, 'ACCEPTED')} style={acceptBtn}>Accept</button>
//                                                 )}
//                                                 {po.status === 'ACCEPTED' && (
//                                                     <button onClick={() => handleStatusUpdate(po.id, 'DELIVERED')} style={deliverBtn}>Deliver</button>
//                                                 )}
//                                                 {po.status === 'FULLY_DELIVERED' && <span style={{color:'#27ae60', fontSize:'12px'}}>✔ Done</span>}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     {activeTab === 'invoices' && (
//                         <div>
//                             <h2 style={{marginBottom: '20px', fontWeight: 'bold'}}>Payment & Invoicing</h2>
//                             <div style={payBox}>Pending Payments: <strong>₹{calculatePayments().toLocaleString()}</strong></div>
//                             <button style={invoiceBtn}>Generate New Invoice</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' };
// const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', padding: '25px', display: 'flex', flexDirection: 'column', gap: '8px' };
// const contentStyle = { flex: 1, padding: '40px' };
// const whiteCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', minHeight: '80vh' };
// const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '25px', columnGap: '50px' };
// const infoItem = { fontSize: '16px', color: '#333' };
// const inputBox = { padding: '8px', width: '90%', borderRadius: '4px', border: '1px solid #ccc' };
// const tabStyle = { padding: '15px', border: 'none', background: 'transparent', color: '#bdc3c7', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' };
// const activeTabStyle = { ...tabStyle, background: '#3e5062', color: 'white', fontWeight: 'bold' };
// const blueBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// const saveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// const uploadBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
// const acceptBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
// const deliverBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
// const invoiceBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse' };
// const thStyle = { padding: '12px 5px' };
// const tdStyle = { padding: '15px 5px', color: '#555' };
// const fileInput = { padding: '5px', border: '1px solid #ddd', borderRadius: '4px' };
// const payBox = { background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #2ecc71' };
// const statusBadge = (s) => ({ padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', backgroundColor: s === 'ACCEPTED' ? '#e8f5e9' : '#fff3e0', color: s === 'ACCEPTED' ? '#27ae60' : '#e67e22' });

// export default VendorPortal;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';
// // --- JS PDF IMPORTS ---
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const VendorPortal = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [activeTab, setActiveTab] = useState('profile');
//     const [vendorDetails, setVendorDetails] = useState({});
//     const [purchaseOrders, setPurchaseOrders] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);

//     // Delivery Modal States
//     const [showDeliveryModal, setShowDeliveryModal] = useState(false);
//     const [currentPoId, setCurrentPoId] = useState(null);
//     const [deliveryData, setDeliveryData] = useState({ 
//         quantityReceived: 0, 
//         isDamaged: false, 
//         remarks: '' 
//     });

//     const config = { headers: { Authorization: `Bearer ${user?.token}` } };

//     const getUsernameFromToken = (token) => {
//         try {
//             const base64Url = token.split('.')[1];
//             const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//             return JSON.parse(window.atob(base64)).sub;
//         } catch (e) { return null; }
//     };

//     const fetchEverything = async () => {
//         if (!user?.token) return;
//         try {
//             const userName = getUsernameFromToken(user.token);
//             const profileRes = await axios.get(`http://localhost:8081/api/users/${userName}`, config);
//             setVendorDetails(profileRes.data);
            
//             if (profileRes.data.id) {
//                 const poRes = await axios.get(`http://localhost:8081/api/po/vendor/${profileRes.data.id}`, config);
//                 setPurchaseOrders(poRes.data || []);
//             }
//         } catch (err) { console.error("Fetch Error:", err); }
//     };

//     useEffect(() => { fetchEverything(); }, [user]);

//     // --- METHOD 1: GENERATE PDF (As per your PurchaseOrder.jsx) ---
//     // Working: Yeh browser side pe hi PDF create karta hai jsPDF use karke.
//     const handleDownloadPO = (po) => {
//         const doc = new jsPDF();
//         const vendor = po.purchaseRequest?.vendor || {};
//         const item = po.purchaseRequest?.items?.[0] || {};

//         const now = new Date();
//         const formattedDate = now.toLocaleDateString();
//         const formattedTime = now.toLocaleTimeString();

//         // Header
//         doc.setFontSize(18);
//         doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
        
//         doc.setFontSize(10);
//         doc.text(`PO Number: PO-CONF-${po.id}`, 14, 25);
//         doc.text(`Source: ${po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct Order'}`, 14, 30);
//         doc.text(`Generated On: ${formattedDate} ${formattedTime}`, 14, 35);

//         // Table
//         autoTable(doc, {
//             startY: 45,
//             head: [['Field Description', 'Details']],
//             body: [
//                 ["PO Reference", `PO-CONF-${po.id}`],
//                 ["Source PR", po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct PO'],
//                 ["Status", po.status || "OFFICIAL_PO"],
//                 ["Total Amount", `INR ${po.totalAmount || '0'}`],
//                 ["---", "---"],
//                 ["Item Name", item.itemName || 'N/A'],
//                 ["Item Description", po.purchaseRequest?.description || 'N/A'],
//                 ["Quantity", item.quantity || '0'],
//                 ["Unit Price", `INR ${item.unitPrice || '0'}`],
//                 ["---", "---"],
//                 ["Vendor Company", vendor.companyName || 'N/A'],
//                 ["Vendor Name", vendor.username || 'N/A'],
//                 ["Vendor Contact", vendor.mobileNo || 'N/A'],
//                 ["Vendor Email", vendor.email || 'N/A'],
//                 ["Vendor Address", vendor.address || 'N/A']
//             ],
//             theme: 'grid',
//             headStyles: { fillColor: [22, 160, 133] },
//             columnStyles: { 0: { fontStyle: 'bold' } }
//         });

//         doc.save(`PO_CONF_${po.id}.pdf`);
//     };

//     // --- METHOD 2: Accept PO ---
//     const handleAcceptPo = async (poId) => {
//         try {
//             await axios.put(`http://localhost:8081/api/po/${poId}/status`, { status: "ACCEPTED" }, config);
//             alert("Order Accepted!");
//             fetchEverything();
//         } catch (err) { alert("Acceptance failed!"); }
//     };

//     // --- METHOD 3: Confirm Delivery ---
//     const handleConfirmDelivery = async () => {
//         try {
//             await axios.post(`http://localhost:8081/api/deliveries/confirm/${currentPoId}`, deliveryData, config);
//             alert("Delivery confirmed!");
//             setShowDeliveryModal(false);
//             fetchEverything();
//         } catch (err) { alert("Error confirming delivery."); }
//     };

//     // --- METHOD 4: Profile Update with File ---
//     const handleProfileUpdate = async () => {
//         try {
//             const userName = getUsernameFromToken(user.token);
//             const formData = new FormData();
//             formData.append('userData', JSON.stringify(vendorDetails));
//             if (selectedFile) formData.append('file', selectedFile);

//             await axios.put(`http://localhost:8081/api/users/update-with-file/${userName}`, formData, {
//                 headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
//             });
//             alert("Profile Updated!");
//             setIsEditing(false);
//             fetchEverything();
//         } catch (err) { alert("Update failed!"); }
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={sidebarStyle}>
//                 <h3 style={{color: 'white', textAlign: 'center', marginBottom: '35px'}}>Vendor Panel</h3>
//                 <button onClick={() => setActiveTab('profile')} style={activeTab === 'profile' ? activeTabStyle : tabStyle}>Profile</button>
//                 <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? activeTabStyle : tabStyle}>Purchase Orders</button>
//                 <button onClick={() => setActiveTab('invoices')} style={activeTab === 'invoices' ? activeTabStyle : tabStyle}>Invoices & Payments</button>
//             </div>

//             <div style={contentStyle}>
//                 <div style={whiteCard}>
//                     {/* PROFILE TAB */}
//                     {activeTab === 'profile' && (
//                         <div>
//                             <h2 style={{fontWeight: 'bold', marginBottom: '20px'}}>Profile Details</h2>
//                             <div style={infoGrid}>
//                                 <div style={infoItem}><strong>Company:</strong> <br/>
//                                     {isEditing ? <input value={vendorDetails.companyName || ''} onChange={(e)=>setVendorDetails({...vendorDetails, companyName: e.target.value})} style={inputBox} /> : (vendorDetails.companyName || 'N/A')}
//                                 </div>
//                                 <div style={infoItem}><strong>Email:</strong> <br/>
//                                     {isEditing ? <input value={vendorDetails.email || ''} onChange={(e)=>setVendorDetails({...vendorDetails, email: e.target.value})} style={inputBox} /> : (vendorDetails.email || 'N/A')}
//                                 </div>
//                                 <div style={infoItem}><strong>Phone:</strong> <br/>
//                                     {isEditing ? <input value={vendorDetails.mobileNo || ''} onChange={(e)=>setVendorDetails({...vendorDetails, mobileNo: e.target.value})} style={inputBox} /> : (vendorDetails.mobileNo || 'N/A')}
//                                 </div>
//                                 <div style={infoItem}><strong>Address:</strong> <br/>
//                                     {isEditing ? <input value={vendorDetails.address || ''} onChange={(e)=>setVendorDetails({...vendorDetails, address: e.target.value})} style={inputBox} /> : (vendorDetails.address || 'N/A')}
//                                 </div>
//                             </div>
//                             <div style={{marginTop: '20px'}}>
//                                 <h4 style={{marginBottom:'10px'}}>Compliance Document</h4>
//                                 {isEditing ? <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} /> : <p>{vendorDetails.complianceCertificate || 'No file'}</p>}
//                             </div>
//                             <div style={{marginTop: '20px'}}>
//                                 {isEditing ? <button onClick={handleProfileUpdate} style={saveBtn}>Save</button> : <button onClick={() => setIsEditing(true)} style={blueBtn}>Edit Profile</button>}
//                             </div>
//                         </div>
//                     )}

//                     {/* PURCHASE ORDERS TAB */}
//                     {activeTab === 'orders' && (
//                         <div>
//                             <h2 style={{marginBottom: '25px', fontWeight: 'bold'}}>Assigned Orders</h2>
//                             <table style={tableStyle}>
//                                 <thead>
//                                     <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
//                                         <th style={thStyle}>PO ID</th>
//                                         <th style={thStyle}>Description</th>
//                                         <th style={thStyle}>Amount</th>
//                                         <th style={thStyle}>Status</th>
//                                         <th style={thStyle}>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {purchaseOrders.map(po => (
//                                         <tr key={po.id} style={{borderBottom: '1px solid #f9f9f9'}}>
//                                             <td style={tdStyle}>#PO-CONF-{po.id}</td>
//                                             <td style={tdStyle}>{po.purchaseRequest?.description || 'N/A'}</td>
//                                             <td style={tdStyle}>₹{po.totalAmount}</td>
//                                             <td style={tdStyle}><span style={statusBadge(po.status)}>{po.status}</span></td>
//                                             <td style={tdStyle}>
//                                                 <div style={{display: 'flex', gap: '8px'}}>
//                                                     {/* FIXED: Passing 'po' object directly to generate pdf */}
//                                                     <button onClick={() => handleDownloadPO(po)} style={downloadBtn}>Download PDF</button>
                                                    
//                                                     {po.status === 'OFFICIAL_PO' && (
//                                                         <button onClick={() => handleAcceptPo(po.id)} style={acceptBtn}>Accept</button>
//                                                     )}
                                                    
//                                                     {po.status === 'ACCEPTED' && (
//                                                         <button onClick={() => { setCurrentPoId(po.id); setShowDeliveryModal(true); }} style={deliverBtn}>Deliver</button>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* DELIVERY MODAL */}
//             {showDeliveryModal && (
//                 <div style={modalOverlay}>
//                     <div style={modalContent}>
//                         <h3>Confirm Delivery</h3>
//                         <label style={labelStyle}>Quantity Received:</label>
//                         <input type="number" style={inputBox} onChange={(e) => setDeliveryData({...deliveryData, quantityReceived: parseInt(e.target.value)})} />
//                         <label style={labelStyle}><input type="checkbox" onChange={(e) => setDeliveryData({...deliveryData, isDamaged: e.target.checked})} /> Is Damaged?</label>
//                         <label style={labelStyle}>Remarks:</label>
//                         <textarea style={inputBox} placeholder="Remarks..." onChange={(e) => setDeliveryData({...deliveryData, remarks: e.target.value})} />
//                         <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
//                             <button onClick={handleConfirmDelivery} style={saveBtn}>Confirm</button>
//                             <button onClick={() => setShowDeliveryModal(false)} style={grayBtn}>Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' };
// const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', padding: '25px', display: 'flex', flexDirection: 'column', gap: '8px' };
// const contentStyle = { flex: 1, padding: '40px' };
// const whiteCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', minHeight: '80vh' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse' };
// const thStyle = { padding: '12px 5px', textAlign: 'left' };
// const tdStyle = { padding: '15px 5px' };
// const inputBox = { padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ddd' };
// const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' };
// const infoItem = { fontSize: '16px' };
// const tabStyle = { padding: '15px', border: 'none', background: 'transparent', color: '#bdc3c7', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' };
// const activeTabStyle = { ...tabStyle, background: '#3e5062', color: 'white' };
// const blueBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
// const saveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
// const downloadBtn = { backgroundColor: '#34495e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };
// const acceptBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };
// const deliverBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };
// const grayBtn = { backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
// const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
// const modalContent = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px' };
// const statusBadge = (s) => ({ padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fff3e0', color: '#e67e22' });
// const labelStyle = { display: 'block', marginTop: '10px', fontWeight: 'bold' };

// export default VendorPortal;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AuthService from '../services/authService';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const VendorPortal = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [activeTab, setActiveTab] = useState('profile');
//     const [vendorDetails, setVendorDetails] = useState({});
//     const [purchaseOrders, setPurchaseOrders] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);

//     // Delivery Modal States
//     const [showDeliveryModal, setShowDeliveryModal] = useState(false);
//     const [currentPoId, setCurrentPoId] = useState(null);
//     const [deliveryData, setDeliveryData] = useState({ quantityReceived: 0, isDamaged: false, remarks: '' });

//     const config = { headers: { Authorization: `Bearer ${user?.token}` } };

//     const getUsernameFromToken = (token) => {
//         try {
//             const base64Url = token.split('.')[1];
//             const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//             return JSON.parse(window.atob(base64)).sub;
//         } catch (e) { return null; }
//     };

//     const fetchEverything = async () => {
//         if (!user?.token) return;
//         try {
//             const userName = getUsernameFromToken(user.token);
//             const profileRes = await axios.get(`http://localhost:8081/api/users/${userName}`, config);
//             setVendorDetails(profileRes.data);
//             if (profileRes.data.id) {
//                 const poRes = await axios.get(`http://localhost:8081/api/po/vendor/${profileRes.data.id}`, config);
//                 setPurchaseOrders(poRes.data || []);
//             }
//         } catch (err) { console.error(err); }
//     };

//     useEffect(() => { fetchEverything(); }, [user]);

//     // --- METHOD: Generate PDF (Same as your Admin logic) ---
//     const handleDownloadPO = (po) => {
//         const doc = new jsPDF();
//         const vendor = po.purchaseRequest?.vendor || {};
//         const item = po.purchaseRequest?.items?.[0] || {};
//         doc.setFontSize(18);
//         doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
//         autoTable(doc, {
//             startY: 25,
//             head: [['Field', 'Details']],
//             body: [
//                 ["PO Number", `PO-CONF-${po.id}`],
//                 ["Total Amount", `INR ${po.totalAmount}`],
//                 ["Vendor", vendor.companyName || 'N/A'],
//                 ["Item", item.itemName || 'N/A'],
//                 ["Status", po.status]
//             ],
//             theme: 'grid'
//         });
//         doc.save(`PO_CONF_${po.id}.pdf`);
//     };

//     // --- NEW METHOD: Generate Invoice ---
//     // Working: Yeh tabhi chalega jab delivery complete ho. Yeh ek Bill format generate karta hai.
//     const generateInvoice = (po) => {
//         const doc = new jsPDF();
//         doc.setFontSize(20);
//         doc.setTextColor(40);
//         doc.text("TAX INVOICE", 105, 20, { align: "center" });
        
//         doc.setFontSize(10);
//         doc.text(`Invoice No: INV-${po.id}-${Math.floor(Math.random()*1000)}`, 14, 35);
//         doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);
//         doc.text(`From: ${vendorDetails.companyName}`, 14, 50);
//         doc.text(`To: Tech Company Corp`, 14, 55);

//         autoTable(doc, {
//             startY: 65,
//             head: [['Description', 'Qty', 'Unit Price', 'Total']],
//             body: [[
//                 po.purchaseRequest?.description || 'Goods Delivery',
//                 po.purchaseRequest?.items?.[0]?.quantity || 0,
//                 `INR ${po.purchaseRequest?.items?.[0]?.unitPrice || 0}`,
//                 `INR ${po.totalAmount}`
//             ]],
//             foot: [['', '', 'Grand Total', `INR ${po.totalAmount}`]],
//             theme: 'striped'
//         });

//         doc.text("Note: Please process the payment within 30 days.", 14, doc.lastAutoTable.finalY + 20);
//         doc.save(`Invoice_PO_${po.id}.pdf`);
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={sidebarStyle}>
//                 <h3 style={{color: 'white', textAlign: 'center', marginBottom: '35px'}}>Vendor Panel</h3>
//                 <button onClick={() => setActiveTab('profile')} style={activeTab === 'profile' ? activeTabStyle : tabStyle}>Profile</button>
//                 <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? activeTabStyle : tabStyle}>Purchase Orders</button>
//                 <button onClick={() => setActiveTab('invoices')} style={activeTab === 'invoices' ? activeTabStyle : tabStyle}>Invoices & Payments</button>
//             </div>

//             <div style={contentStyle}>
//                 <div style={whiteCard}>
//                     {/* PROFILE TAB */}
//                     {activeTab === 'profile' && (
//                         <div>
//                             <h2 style={{fontWeight: 'bold', marginBottom: '20px'}}>Vendor Profile</h2>
//                             <div style={infoGrid}>
//                                 <div style={infoItem}><strong>Company:</strong> <br/> {vendorDetails.companyName || 'N/A'}</div>
//                                 <div style={infoItem}><strong>Email:</strong> <br/> {vendorDetails.email || 'N/A'}</div>
//                                 <div style={infoItem}><strong>Mobile:</strong> <br/> {vendorDetails.mobileNo || 'N/A'}</div>
//                                 <div style={infoItem}><strong>Certificate:</strong> <br/> {vendorDetails.complianceCertificate || 'Pending'}</div>
//                             </div>
//                         </div>
//                     )}

//                     {/* PURCHASE ORDERS TAB */}
//                     {activeTab === 'orders' && (
//                         <div>
//                             <h2 style={{marginBottom: '25px', fontWeight: 'bold'}}>Assigned Orders</h2>
//                             <table style={tableStyle}>
//                                 <thead>
//                                     <tr><th>PO ID</th><th>Description</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
//                                 </thead>
//                                 <tbody>
//                                     {purchaseOrders.map(po => (
//                                         <tr key={po.id} style={{borderBottom: '1px solid #eee'}}>
//                                             <td style={tdStyle}>#PO-{po.id}</td>
//                                             <td style={tdStyle}>{po.purchaseRequest?.description}</td>
//                                             <td style={tdStyle}>₹{po.totalAmount}</td>
//                                             <td style={tdStyle}><span style={statusBadge(po.status)}>{po.status}</span></td>
//                                             <td style={tdStyle}>
//                                                 <div style={{display:'flex', gap:'5px'}}>
//                                                     <button onClick={() => handleDownloadPO(po)} style={downloadBtn}>PDF</button>
//                                                     {po.status === 'OFFICIAL_PO' && <button onClick={() => {/* Accept Logic */}} style={acceptBtn}>Accept</button>}
//                                                     {po.status === 'ACCEPTED' && <button onClick={() => {setCurrentPoId(po.id); setShowDeliveryModal(true);}} style={deliverBtn}>Deliver</button>}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     {/* NEW: INVOICES & PAYMENTS TAB */}

// {activeTab === 'invoices' && (
//     <div>
//         <h2 style={{ marginBottom: '25px', fontWeight: 'bold' }}>Invoices & Payment Status</h2>
//         <div style={summaryRow}>
//             <div style={statCard}>
//                 Total Receivable: <br />
//                 <strong>₹{purchaseOrders.reduce((acc, curr) => acc + curr.totalAmount, 0)}</strong>
//             </div>
//             <div style={statCard}>
//                 Delivered (Billed): <br />
//                 {/* Fixed Check: fully_delivered check kiya hai */}
//                 <strong>{purchaseOrders.filter(p => p.status === 'FULLY_DELIVERED' || p.status === 'DELIVERED').length} Orders</strong>
//             </div>
//         </div>

//         <table style={tableStyle}>
//             <thead>
//                 <tr style={{ background: '#f8f9fa' }}>
//                     <th style={thStyle}>Related PO</th>
//                     <th style={thStyle}>Amount</th>
//                     <th style={thStyle}>Delivery Status</th>
//                     <th style={thStyle}>Payment</th>
//                     <th style={thStyle}>Action</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {purchaseOrders.map(po => {
//                     // Logic: status check for both variations
//                     const isDelivered = po.status === 'FULLY_DELIVERED' || po.status === 'DELIVERED';
                    
//                     return (
//                         <tr key={po.id} style={{ borderBottom: '1px solid #eee' }}>
//                             <td style={tdStyle}>#PO-{po.id}</td>
//                             <td style={tdStyle}>₹{po.totalAmount}</td>
//                             <td style={tdStyle}>
//                                 <span style={statusBadge(po.status)}>{po.status}</span>
//                             </td>
//                             <td style={tdStyle}>
//                                 <span style={{ color: isDelivered ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
//                                     {isDelivered ? 'Processing Payment' : 'Pending Delivery'}
//                                 </span>
//                             </td>
//                             <td style={tdStyle}>
//                                 {isDelivered ? (
//                                     <button 
//                                         onClick={() => generateInvoice(po)} 
//                                         style={invoiceBtn}
//                                     >
//                                         📄 Download Invoice
//                                     </button>
//                                 ) : (
//                                     <span style={{ color: '#95a5a6', fontSize: '12px' }}>Delivery Required</span>
//                                 )}
//                             </td>
//                         </tr>
//                     );
//                 })}
//             </tbody>
//         </table>
//     </div>
// )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- ADDITIONAL STYLES ---
// const summaryRow = { display: 'flex', gap: '20px', marginBottom: '30px' };
// const statCard = { padding: '20px', background: '#ecf0f1', borderRadius: '10px', flex: 1, fontSize: '14px' };
// const invoiceBtn = { backgroundColor: '#8e44ad', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
// const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' };
// const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', padding: '25px', display: 'flex', flexDirection: 'column', gap: '8px' };
// const contentStyle = { flex: 1, padding: '40px' };
// const whiteCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', minHeight: '80vh' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse' };
// const thStyle = { padding: '12px 5px', textAlign: 'left' };
// const tdStyle = { padding: '15px 5px' };
// const tabStyle = { padding: '15px', border: 'none', background: 'transparent', color: '#bdc3c7', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' };
// const activeTabStyle = { ...tabStyle, background: '#3e5062', color: 'white' };
// const downloadBtn = { backgroundColor: '#34495e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
// const acceptBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
// const deliverBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
// const statusBadge = (s) => ({ padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fdf2e9', color: '#e67e22' });
// const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
// const infoItem = { fontSize: '16px' };

// export default VendorPortal;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/authService';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import autoTable from 'jspdf-autotable';


const VendorPortal = () => {
    const [user] = useState(AuthService.getCurrentUser());
    const [activeTab, setActiveTab] = useState('profile');
    const [vendorDetails, setVendorDetails] = useState({});
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Delivery Modal States
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [currentPoId, setCurrentPoId] = useState(null);
    const [deliveryData, setDeliveryData] = useState({ quantityReceived: 0, isDamaged: false, remarks: '' });

    const navigate = useNavigate(); // <-- Fix: define navigate using useNavigate
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };

    const getUsernameFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64)).sub;
        } catch (e) { return null; }
    };

    const fetchEverything = async () => {
        if (!user?.token) return;
        try {
            const userName = getUsernameFromToken(user.token);
            const profileRes = await axios.get(`http://localhost:8081/api/users/${userName}`, config);
            setVendorDetails(profileRes.data);
            if (profileRes.data.id) {
                const poRes = await axios.get(`http://localhost:8081/api/po/vendor/${profileRes.data.id}`, config);
                setPurchaseOrders(poRes.data || []);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchEverything(); }, [user]);

    // --- METHOD 1: Download PO ---
   // --- METHOD: Generate PO (As per your Image) ---
const handleDownloadPO = (po) => {
    const doc = new jsPDF();
    const vendor = po.purchaseRequest?.vendor || {};
    const item = po.purchaseRequest?.items?.[0] || {};
    const date = new Date().toLocaleString();

    // 1. Header Title
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("PURCHASE ORDER", 105, 20, { align: "center" });

    // 2. Top Info Section (Left Aligned)
    doc.setFontSize(11);
    doc.text(`PO Number: PO-CONF-${po.id}`, 14, 35);
    doc.text(`Source: PR-${po.purchaseRequest?.id || 'N/A'}`, 14, 42);
    doc.text(`Generated On: ${date}`, 14, 49);

    // 3. The Details Table (Matching image colors/layout)
    autoTable(doc, {
        startY: 58,
        head: [['Field Description', 'Details']],
        body: [
            ["PO Reference", `PO-CONF-${po.id}`],
            ["Source PR", `PR-${po.purchaseRequest?.id || 'N/A'}`],
            ["Status", po.status || 'N/A'],
            ["Total Amount", `INR ${po.totalAmount}`],
            ["---", "---"], // Separator line
            ["Item Name", item.itemName || 'N/A'],
            ["Item Description", po.purchaseRequest?.description || 'N/A'],
            ["Quantity", item.quantity || '0'],
            ["Unit Price", `INR ${item.unitPrice || '0'}`],
            ["---", "---"], // Separator line
            ["Vendor Company", vendor.companyName || 'N/A'],
            ["Vendor Name", vendor.username || 'N/A'],
            ["Vendor Contact", vendor.mobileNo || 'N/A'],
            ["Vendor Email", vendor.email || 'N/A'],
            ["Vendor Address", vendor.address || 'N/A'],
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [22, 160, 133], // Teal/Green color matching your screenshot
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 10,
            textColor: [50, 50, 50]
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 }
        },
        margin: { left: 14, right: 14 }
    });

    // Save the PDF
    doc.save(`PO_CONF_${po.id}.pdf`);
};

    // --- METHOD 2: Generate Invoice (Original Format) ---
    const generateInvoice = (po) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("TAX INVOICE", 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.text(`Invoice No: INV-${po.id}-${Math.floor(Date.now() / 1000)}`, 14, 35);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);
        doc.text(`From: ${vendorDetails.companyName}`, 14, 50);
        doc.text(`To: Tech Company Corp`, 14, 55);

        autoTable(doc, {
            startY: 65,
            head: [['Description', 'Qty', 'Unit Price', 'Total']],
            body: [[
                po.purchaseRequest?.description || 'Goods Delivery',
                po.purchaseRequest?.items?.[0]?.quantity || 0,
                `INR ${po.purchaseRequest?.items?.[0]?.unitPrice || 0}`,
                `INR ${po.totalAmount}`
            ]],
            theme: 'striped'
        });
        
        doc.text("Note: Please process the payment within 30 days.", 14, doc.lastAutoTable.finalY + 20);
        doc.save(`Invoice_PO_${po.id}.pdf`);
    };

    const handleAcceptPo = async (poId) => {
        try {
            await axios.put(`http://localhost:8081/api/po/${poId}/status`, { status: "ACCEPTED" }, config);
            alert("Order Accepted!");
            fetchEverything();
        } catch (err) { alert("Acceptance failed!"); }
    };

    // const handleConfirmDelivery = async () => {
    //     try {
    //         await axios.post(`http://localhost:8081/api/deliveries/confirm/${currentPoId}`, deliveryData, config);
    //         alert("Delivery confirmed!");
    //         setShowDeliveryModal(false);
    //         fetchEverything();
    //     } catch (err) { alert("Error confirming delivery."); }
    // };


    // --- UPDATED METHOD ---
// Working: Yeh ab sahi itemId bhejega jo aapke DeliveryService.recordDelivery(itemId, record) se match karega.
/**
 * Method: handleConfirmDelivery
 * Working: 
 * 1. Yeh function browser console mein Item ID print karta hai debugging ke liye.
 * 2. Backend ko POST request bhejta hai jahan 'currentPoId' actually PO_ITEM ki ID hai.
 * 3. Success hone par modal band karke data refresh karta hai.
 */
const handleConfirmDelivery = async () => {
    try {
        // Validation: Check karein ki ID null toh nahi hai
        if (!currentPoId) {
            alert("Error: Item ID is missing. Please close and re-open the modal.");
            return;
        }

        console.log("HITTING API - Item ID:", currentPoId);
        console.log("PAYLOAD:", deliveryData);

        // FIX: URL ko backend controller ke mapping se match karein
        // Agar aapka controller @RequestMapping("/api/deliveries") hai
        const url = `http://localhost:8081/api/deliveries/confirm/${currentPoId}`;

        const response = await axios.post(url, deliveryData, config);

        alert("Delivery confirmed successfully!");
        setShowDeliveryModal(false);
        
        // Refresh data to show updated 'deliveredQuantity' and 'finalPayableAmount'
        if (typeof fetchEverything === 'function') {
            fetchEverything();
        } else {
            window.location.reload(); 
        }

    } catch (err) {
        console.error("FULL ERROR OBJECT:", err);
        const errorMessage = err.response?.data?.message || "Server connection failed";
        alert("Delivery Error: " + errorMessage);
    }
};

    // --- METHOD: Upload Document to DB ---
// Working: Yeh aapke @PostMapping("/upload") controller ko call karta hai.
// Token se backend khud username (Principal) nikaal lega.
const handleFileUpload = async () => {
    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // Key 'file' honi chahiye jo @RequestParam mein hai

    try {
        await axios.post('http://localhost:8081/api/vendor/upload', formData, {
            headers: {
                'Authorization': `Bearer ${user?.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        alert("File uploaded successfully and saved to DB!");
        setSelectedFile(null); // Clear selection
        fetchEverything();     // Refresh profile data to show new filename
    } catch (err) {
        console.error(err);
        alert("Could not upload file. Check console for details.");
    }
};

// --- UI Part (Place this inside your Profile Tab) ---
<div style={{marginTop: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc'}}>
    <h4 style={{marginBottom: '10px', color: '#2d3748'}}>Compliance Document Center</h4>
    <p style={{fontSize: '13px', color: '#64748b'}}>
        Current in DB: <strong>{vendorDetails.complianceCertificate || 'No file found'}</strong>
    </p>
    
    <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
            style={{fontSize: '13px'}}
        />
        
        {selectedFile && (
            <button 
                onClick={handleFileUpload} 
                style={{
                    backgroundColor: '#4a90e2', 
                    color: 'white', 
                    padding: '6px 15px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Confirm Upload
            </button>
        )}
    </div>
</div>

  // --- FIXED METHOD: Update Profile ---
// Working: Yeh method multipart data ke saath Auth Token ko sahi tarah bhejta hai.
// --- METHOD: Update Profile (Matching Your Controller) ---
// Working: Yeh method aapke controller ke @RequestBody logic ke saath 100% sync hai.
const handleUpdateProfile = async () => {
    try {
        const userName = getUsernameFromToken(user.token);

        // Aapka controller 'UserUpdateDTO' expect kar raha hai jisme ye charo fields hain
        const updatePayload = {
            email: vendorDetails.email,
            mobileNo: vendorDetails.mobileNo,
            companyName: vendorDetails.companyName,
            address: vendorDetails.address
        };

        // Simple PUT request bina FormData ke, kyunki controller @RequestBody use kar raha hai
        await axios.put(
            `http://localhost:8081/api/users/update/${userName}`, 
            updatePayload, 
            { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        alert("Profile updated successfully!");
        setIsEditing(false); // Edit mode off
        fetchEverything();   // Data refresh karein
    } catch (err) {
        console.error("Update Error:", err.response?.data || err.message);
        alert("Update failed: " + (err.response?.data || "Server Error"));
    }
};

    return (
        <div style={containerStyle}>
            <div style={sidebarStyle}>
                <h3 style={{color: 'white', textAlign: 'center', marginBottom: '35px'}}>Vendor Panel</h3>

                <button onClick={() => setActiveTab('profile')} style={activeTab === 'profile' ? activeTabStyle : tabStyle}>Profile</button>
                <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? activeTabStyle : tabStyle}>Purchase Orders</button>
                <button onClick={() => setActiveTab('invoices')} style={activeTab === 'invoices' ? activeTabStyle : tabStyle}>Invoices & Payments</button>
            </div>

            <div style={contentStyle}>
                <div style={whiteCard}>
                                            <button onClick={() => { AuthService.logout(); navigate("/landing-page"); }} 
                                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px', float: 'right', marginBottom: '10px' }}>
                                                Logout
                                            </button>
                    {/* PROFILE TAB */}
                  {/* PROFILE TAB */}
{activeTab === 'profile' && (
    <div>
        <h2 style={{fontWeight: 'bold', marginBottom: '20px'}}>Vendor Profile</h2>
        <div style={infoGrid}>
            
            <div style={infoItem}><strong>Company:</strong> <br/> 
                {isEditing ? <input value={vendorDetails.companyName || ''} onChange={(e)=>setVendorDetails({...vendorDetails, companyName: e.target.value})} style={inputBox} /> : (vendorDetails.companyName || 'N/A')}
            </div>
            <div style={infoItem}><strong>Email:</strong> <br/> 
                {isEditing ? <input value={vendorDetails.email || ''} onChange={(e)=>setVendorDetails({...vendorDetails, email: e.target.value})} style={inputBox} /> : (vendorDetails.email || 'N/A')}
            </div>
            <div style={infoItem}><strong>Mobile:</strong> <br/> 
                {isEditing ? <input value={vendorDetails.mobileNo || ''} onChange={(e)=>setVendorDetails({...vendorDetails, mobileNo: e.target.value})} style={inputBox} /> : (vendorDetails.mobileNo || 'N/A')}
            </div>
            <div style={infoItem}><strong>Address:</strong> <br/> 
                {isEditing ? <input value={vendorDetails.address || ''} onChange={(e)=>setVendorDetails({...vendorDetails, address: e.target.value})} style={inputBox} /> : (vendorDetails.address || 'N/A')}
            </div>
        </div>
        
        {/* --- FIXED SECTION: DOCUMENT UPLOAD --- */}
        <div style={{marginTop: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc'}}>
            <h4 style={{marginBottom:'10px'}}>Compliance Document Center</h4>
            <p style={{fontSize: '12px', color: '#7f8c8d'}}>Current in DB: <strong>{vendorDetails.complianceCertificate || 'No document found'}</strong></p>
            
            <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                
                {/* Agar file select hai toh alag se upload button dikhao */}
                {selectedFile && (
                    <button onClick={handleFileUpload} style={{...saveBtn, backgroundColor: '#4a90e2'}}>
                        ⬆ Confirm Document Upload
                    </button>
                )}
            </div>
        </div>

        <div style={{marginTop: '20px'}}>
            {isEditing ? (
                <button onClick={handleUpdateProfile} style={saveBtn}>Save Profile Details</button>
            ) : (
                <button onClick={() => setIsEditing(true)} style={blueBtn}>Edit Details</button>
            )}
        </div>
    </div>
)}

                    {/* PURCHASE ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{marginBottom: '25px', fontWeight: 'bold'}}>Assigned Orders</h2>
                            <table style={tableStyle}>
                                <thead>
                                    <tr><th style={thStyle}>PO ID</th><th style={thStyle}>Description</th><th style={thStyle}>Amount</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.map(po => (
                                        <tr key={po.id} style={{borderBottom: '1px solid #eee'}}>
                                            <td style={tdStyle}>#PO-{po.id}</td>
                                            <td style={tdStyle}>{po.purchaseRequest?.description}</td>
                                            <td style={tdStyle}>₹{po.totalAmount}</td>
                                            <td style={tdStyle}><span style={statusBadge(po.status)}>{po.status}</span></td>
                                            <td style={tdStyle}>
                                                <div style={{display:'flex', gap:'5px'}}>
                                                    <button onClick={() => handleDownloadPO(po)} style={downloadBtn}>PDF</button>
                                                    {po.status === 'OFFICIAL_PO' && <button onClick={() => handleAcceptPo(po.id)} style={acceptBtn}>Accept</button>}
                                                    {/* {po.status === 'ACCEPTED' && <button onClick={() => {setCurrentPoId(po.id); setShowDeliveryModal(true);}} style={deliverBtn}>Deliver</button>} */}
                                                   {po.status === 'ACCEPTED' && (
    <button 
        onClick={() => {
            // FIX: PurchaseRequest ke andar jane ki zaroori nahi hai.
            // Hum direct PO ke andar ki items list se ID nikalenge.
            const firstItem = po.items && po.items.length > 0 ? po.items[0] : null;
            
            if (firstItem && firstItem.id) {
                // Ab currentPoId mein '12' ya '13' jaisi Item ID jayegi (35 nahi)
                setCurrentPoId(firstItem.id); 
                setShowDeliveryModal(true);
                
                // Debugging ke liye console log (Browser F12 mein dikhega)
                console.log("Setting POItem ID for delivery:", firstItem.id);
            } else {
                alert("Error: No items found in this Purchase Order to deliver!");
            }
        }} 
        style={deliverBtn}
    >
        Deliver
    </button>
)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* INVOICES & PAYMENTS TAB */}
                    {activeTab === 'invoices' && (
                        <div>
                            <h2 style={{ marginBottom: '25px', fontWeight: 'bold' }}>Invoices & Payment Status</h2>
                            <div style={summaryRow}>
                                <div style={statCard}>Total Receivable: <br /><strong>₹{purchaseOrders.reduce((acc, curr) => acc + curr.totalAmount, 0)}</strong></div>
                                <div style={statCard}>Delivered (Billed): <br /><strong>{purchaseOrders.filter(p => p.status === 'FULLY_DELIVERED' || p.status === 'DELIVERED').length} Orders</strong></div>
                            </div>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={thStyle}>Related PO</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Delivery Status</th>
                                        <th style={thStyle}>Payment</th>
                                        <th style={thStyle}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.map(po => {
                                        const isDelivered = po.status === 'FULLY_DELIVERED' || po.status === 'DELIVERED';
                                        return (
                                            <tr key={po.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={tdStyle}>#PO-{po.id}</td>
                                                <td style={tdStyle}>₹{po.totalAmount}</td>
                                                <td style={tdStyle}><span style={statusBadge(po.status)}>{po.status}</span></td>
                                                <td style={tdStyle}>
                                                    <span style={{ color: isDelivered ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                                                        {isDelivered ? 'Processing Payment' : 'Pending Delivery'}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    {isDelivered ? (
                                                        <button onClick={() => generateInvoice(po)} style={invoiceBtn}>📄 Download Invoice</button>
                                                    ) : (
                                                        <span style={{ color: '#95a5a6', fontSize: '12px' }}>Delivery Required</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* DELIVERY MODAL */}
            {showDeliveryModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3>Confirm Delivery</h3>
                        <label style={labelStyle}>Quantity Received:</label>
                        <input type="number" style={inputBox} onChange={(e) => setDeliveryData({...deliveryData, quantityReceived: parseInt(e.target.value)})} />
                        <label style={labelStyle}><input type="checkbox" onChange={(e) => setDeliveryData({...deliveryData, isDamaged: e.target.checked})} /> Is Damaged?</label>
                        <label style={labelStyle}>Remarks:</label>
                        <textarea style={inputBox} placeholder="Remarks..." onChange={(e) => setDeliveryData({...deliveryData, remarks: e.target.value})} />
                        <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                            <button onClick={handleConfirmDelivery} style={saveBtn}>Confirm</button>
                            <button onClick={() => setShowDeliveryModal(false)} style={grayBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' };
const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', padding: '25px', display: 'flex', flexDirection: 'column', gap: '8px' };
const contentStyle = { flex: 1, padding: '40px' };
const whiteCard = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', minHeight: '80vh' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '12px 5px', textAlign: 'left' };
const tdStyle = { padding: '15px 5px' };
const inputBox = { padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' };
const tabStyle = { padding: '15px', border: 'none', background: 'transparent', color: '#bdc3c7', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' };
const activeTabStyle = { ...tabStyle, background: '#3e5062', color: 'white' };
const blueBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
const saveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
const downloadBtn = { backgroundColor: '#34495e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const acceptBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const deliverBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const invoiceBtn = { backgroundColor: '#8e44ad', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const grayBtn = { backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
const statusBadge = (s) => ({ padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fdf2e9', color: '#e67e22' });
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const infoItem = { fontSize: '16px' };
const summaryRow = { display: 'flex', gap: '20px', marginBottom: '30px' };
const statCard = { padding: '20px', background: '#ecf0f1', borderRadius: '10px', flex: 1, fontSize: '14px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContent = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px' };
const labelStyle = { display: 'block', marginTop: '10px', fontWeight: 'bold' };

export default VendorPortal;