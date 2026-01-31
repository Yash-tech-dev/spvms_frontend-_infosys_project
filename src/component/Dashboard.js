// import { useEffect, useState } from 'react';
// import AuthService from '../services/authService';
// import axios from 'axios';

// const Dashboard = () => {
//     const [user, setUser] = useState(AuthService.getCurrentUser());
//     const [purchaseRequests, setPurchaseRequests] = useState([]);

//     useEffect(() => {
//         const fetchPRData = async () => {
//             if (!user?.token) return;
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const res = await axios.get("http://localhost:8081/api/pr/all", config);
//                 // Logging for verification in Browser Console (F12)
//                 console.log("Postman Data Received:", res.data); 
//                 setPurchaseRequests(res.data);
//             } catch (err) {
//                 console.error("API Error:", err);
//             }
//         };
//         fetchPRData();
//     }, [user]);

//     // Method: Rendering nested items from 'pritem' table without redundancy
//     const renderItemsTable = (items) => {
//         if (!items || items.length === 0) return <span style={{ color: '#e74c3c' }}>No items linked</span>;
        
//         return (
//             <table width="100%" style={{ fontSize: '12px', borderCollapse: 'collapse', backgroundColor: '#fcfcfc' }}>
//                 <thead>
//                     <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', color: '#7f8c8d' }}>
//                         <th style={{ padding: '4px' }}>Item</th>
//                         <th style={{ padding: '4px' }}>Qty</th>
//                         <th style={{ padding: '4px' }}>Price</th>
//                         <th style={{ padding: '4px' }}>Total</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {items.map((item, index) => (
//                         <tr key={index} style={{ borderBottom: '1px solid #f1f1f1' }}>
//                             <td style={{ padding: '4px' }}>{item.itemName}</td>
//                             <td style={{ padding: '4px' }}>{item.quantity}</td>
//                             <td style={{ padding: '4px' }}>₹{item.unitPrice}</td>
//                             <td style={{ padding: '4px' }}>₹{item.totalPrice}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         );
//     };

//     if (!user) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading session...</h2>;

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
//             {/* Header Section */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                 <h2 style={{ color: '#2c3e50', margin: 0 }}>Admin Dashboard - Purchase Requests</h2>
//                 <button 
//                     onClick={() => { AuthService.logout(); window.location.href="/login"; }} 
//                     style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
//                 >
//                     Logout
//                 </button>
//             </div>
            
//             <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px', borderLeft: '5px solid #3498db' }}>
//                 Welcome, <strong>{user.username}</strong> | Role: <span style={{ color: '#3498db' }}>{user.role}</span>
//             </div>

//             {/* Main Data Table */}
//             <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
//                 <table width="100%" cellPadding="15" style={{ borderCollapse: 'collapse' }}>
//                     <thead>
//                         <tr style={{ background: '#2c3e50', color: 'white', textAlign: 'left' }}>
//                             <th>PR ID</th>
//                             <th>Description</th>
//                             <th>Line Items (pritem)</th>
//                             <th>Estimated Total Cost</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {purchaseRequests.map((pr) => {
//                             // Logic: Checking status from root OR nested quote object
//                             const displayStatus = pr.status || pr.quote?.complianceStatus || "PENDING";
                            
//                             return (
//                                 <tr key={pr.id} style={{ borderBottom: '1px solid #eee' }}>
//                                     <td><strong>PR-{pr.id}</strong></td>
//                                     <td style={{ color: '#34495e' }}>{pr.description}</td>
//                                     <td style={{ width: '35%' }}>
//                                         {renderItemsTable(pr.items)}
//                                     </td>
//                                     <td style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '16px' }}>
//                                         {/* Matches camelCase from Postman response */}
//                                         ₹{pr.estimatedTotalCost || 0}
//                                     </td>
//                                     <td>
//                                         <span style={{ 
//                                             backgroundColor: displayStatus === 'APPROVED' ? '#2ecc71' : '#f1c40f', 
//                                             color: 'white', 
//                                             padding: '5px 12px', 
//                                             borderRadius: '20px', 
//                                             fontSize: '11px',
//                                             fontWeight: 'bold'
//                                         }}>
//                                             {displayStatus}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;




// updated code 



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import AuthService from '../services/authService';
import axios from 'axios';

<button onClick={() => navigate("/user-profile")} style={{ backgroundColor: '#34495e', color: 'white', padding: '10px' }}>
    My Profile
</button>
const Dashboard = () => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const navigate = useNavigate(); // Hook initialized here

    // Combined Logic: Security check and Data fetching
    useEffect(() => {
        if (!user || user.role !== "ROLE_ADMIN") {
            console.log("Unauthorized access! Redirecting...");
            if (user?.role === "ROLE_VENDOR") {
                navigate("/vendor-portal");
            } else {
                navigate("/login");
            }
        } else {
            fetchPRData();
        }
    }, [user, navigate]);

    const fetchPRData = async () => {
        if (!user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get("http://localhost:8081/api/pr/all", config);
            setPurchaseRequests(res.data);
        } catch (err) { 
            console.error("API Error:", err); 
        }
    };

    /**
     * Method: Admin Review to PO Conversion Logic
     */
/**
 * Method: PR Status Update and Automatic PO Conversion
 * This method first updates the PR status to APPROVED and then
 * triggers the conversion API to create entries in purchase_orders table.
 */
const handleStatusUpdate = async (prId, newStatus) => {
    const confirmMsg = newStatus === "APPROVED" 
        ? `Confirming this will approve PR-${prId} and convert it to a Purchase Order (PO). Proceed?`
        : `Are you sure you want to reject PR-${prId}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        // Method 1: Update PR status in database
        await axios.put(`http://localhost:8081/api/pr/${prId}/status?status=${newStatus}`, {}, config);
        
        // Method 2: If approved, call the conversion endpoint
        if (newStatus === "APPROVED") {
            try {
                // Triggering the PO conversion logic
                await axios.post(`http://localhost:8081/api/po/convert/${prId}`, {}, config);
                
                alert(`PR ${prId} approved and converted to PO successfully!`);
                // Navigating to PO list to see the newly created order
                navigate("/purchase-orders"); 
            } catch (poErr) {
                console.error("PO Conversion Error:", poErr);
                alert("PR was approved, but PO generation failed. Check if column length for 'status' is sufficient in DB.");
            }
        } else {
            alert(`PR ${prId} has been Rejected.`);
            fetchPRData(); // Refresh current table for rejection
        }
    } catch (err) { 
        console.error("Status Update Error:", err);
        alert("Error updating status. Please check your network or token."); 
    }
};
    /**
     * Method: View Quote Logic (Base64 PDF Preview)
     */
    const handleViewQuote = (quote) => {
        if (!quote || !quote.data) {
            alert("No PDF document attached to this PR.");
            return;
        }
        try {
            const byteCharacters = atob(quote.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const file = new Blob([byteArray], { type: quote.fileType || 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (e) {
            console.error("PDF Preview Error:", e);
            alert("Could not open PDF file.");
        }
    };

    // UI Render for Items Table
    const renderItemsTable = (pr) => {
        const items = pr.items;
        if (!items || items.length === 0) return <span style={{ color: 'red' }}>No items linked</span>;
        return (
            <div>
                <table width="100%" style={{ fontSize: '13px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.unitPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {pr.quote && (
                    <div style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '5px' }}>
                        <span style={{ fontSize: '11px', color: '#7f8c8d' }}>File: {pr.quote.fileName}</span>
                        <button 
                            onClick={() => handleViewQuote(pr.quote)}
                            style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                            View Quote PDF
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (!user || user.role !== "ROLE_ADMIN") return <h2>Loading...</h2>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Admin Dashboard - Purchase Requests</h2>
                <div style={{ display: 'flex', gap: '10px' }}>

                     <button onClick={() => navigate("/dashboard1")} 
                            style={{ backgroundColor: '#16a085', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
                        Analytics Dashboard
                    </button>

                    <button onClick={() => navigate("/create-pr")} 
                            style={{ backgroundColor: '#16a085', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
                        Create New PR
                    </button>
                    <button onClick={() => navigate("/purchase-orders")} 
                            style={{ backgroundColor: '#16a085', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
                        View Purchase Orders
                    </button>
                    <button onClick={() => { AuthService.logout(); navigate("/landing-page"); }} 
                            style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
                        Logout
                    </button>
                </div>
            </div>
            <hr />

            <table border="1" width="100%" cellPadding="12" style={{ borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ background: '#2c3e50', color: 'white' }}>
                        <th>PR ID</th>
                        <th>Description</th>
                        <th>Items & Unit Prices</th>
                        <th>Estimated Total Cost</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseRequests.map((pr) => {
                        const currentStatus = pr.status || pr.quote?.complianceStatus || "PENDING";
                        return (
                            <tr key={pr.id}>
                                <td><strong>PR-{pr.id}</strong></td>
                                <td>{pr.description}</td>
                                <td style={{ width: '40%' }}>{renderItemsTable(pr)}</td>
                                <td style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '18px' }}>
                                    ₹{pr.estimatedTotalCost || 0}
                                </td>
                                <td>
                                    <span style={{ color: currentStatus === 'APPROVED' ? 'green' : 'orange', fontWeight: 'bold' }}>
                                        {currentStatus}
                                    </span>
                                </td>
                                <td>
                                    {currentStatus === "PENDING" ? (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => handleStatusUpdate(pr.id, "APPROVED")}
                                                style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}>Approve</button>
                                            <button onClick={() => handleStatusUpdate(pr.id, "REJECTED")}
                                                style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}>Reject</button>
                                        </div>
                                    ) : (
                                        <span style={{ color: '#95a5a6', fontSize: '12px' }}>Processed (PO Generated)</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;