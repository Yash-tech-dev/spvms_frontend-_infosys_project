// import { useEffect, useState } from 'react';
// import AuthService from '../services/authService';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; // Updated import for plugin

// /**
//  * WORKING METHODS:
//  * 1. generatePDF: Single PO ki detailed PDF table ke saath.
//  * 2. downloadWholeReport: Saare POs ki summary list PDF mein download karne ke liye.
//  */

// const PurchaseOrder = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [orders, setOrders] = useState([]);

//     useEffect(() => {
//         const fetchPOs = async () => {
//             if (!user?.token) return;
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const res = await axios.get("http://localhost:8081/api/po/all", config); 
//                 setOrders(res.data);
//             } catch (err) { 
//                 console.error("Error fetching POs", err); 
//             }
//         };
//         fetchPOs();
//     }, [user]);

//     // --- OPTION 1: Individual PO PDF ---
//     const generatePDF = (po) => {
//         const doc = new jsPDF();

//         // PDF Header
//         doc.setFontSize(18);
//         doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
        
//         doc.setFontSize(10);
//         doc.text(`PO Number: PO-CONF-${po.id}`, 14, 25);
//         doc.text(`Source: ${po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct Order'}`, 14, 30);
//         doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

//         // Individual Table using autoTable plugin
//         autoTable(doc, {
//             startY: 45,
//             head: [['Field Description', 'Details']],
//             body: [
//                 ["PO Reference", `PO-CONF-${po.id}`],
//                 ["Source PR", po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct PO'],
//                 ["Vendor Quote Ref", po.vendorQuoteRef || 'N/A'],
//                 ["Total Amount", `INR ${po.totalAmount || po.estimatedTotalCost}`],
//                 ["Status", po.status || "OFFICIAL PO"]
//             ],
//             theme: 'grid',
//             headStyles: { fillColor: [22, 160, 133] }
//         });

//         doc.save(`PO_CONF_${po.id}.pdf`);
//     };

//     // --- OPTION 2: Download Whole Report (Summary) ---
//     const downloadWholeReport = () => {
//         const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for summary
//         doc.text("WHOLE PURCHASE ORDER SUMMARY", 149, 15, { align: "center" });

//         const tableColumn = ["PO Number", "Source PR", "Vendor Quote Ref", "Total Amount", "Status"];
//         const tableRows = orders.map(po => [
//             `PO-CONF-${po.id}`,
//             po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct',
//             po.vendorQuoteRef || 'N/A',
//             `INR ${po.totalAmount || po.estimatedTotalCost}`,
//             po.status || "OFFICIAL"
//         ]);

//         autoTable(doc, {
//             startY: 25,
//             head: [tableColumn],
//             body: tableRows,
//             theme: 'striped',
//             headStyles: { fillColor: [44, 62, 80] }
//         });

//         doc.save("Whole_PO_Report.pdf");
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <h2 style={{ color: '#2c3e50' }}>Purchase Orders (Confirmed)</h2>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     {/* Whole Report Option */}
//                     <button onClick={downloadWholeReport} style={wholeReportBtnStyle}>
//                         📊 Download Whole Report
//                     </button>
//                     <button onClick={() => window.location.href="/dashboard"} style={backBtnStyle}>
//                         Back to Dashboard
//                     </button>
//                 </div>
//             </div>
//             <hr style={{ margin: '20px 0', opacity: '0.3' }} />
            
//             <table border="1" width="100%" cellPadding="12" style={tableStyle}>
//                 <thead>
//                     <tr style={{ background: '#16a085', color: 'white' }}>
//                         <th>PO Number</th>
//                         <th>Source PR</th>
//                         <th>Vendor Quote Ref</th>
//                         <th>Total Amount</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {orders.length > 0 ? orders.map((po) => (
//                         <tr key={po.id} style={{ borderBottom: '1px solid #ddd' }}>
//                             <td><strong>PO-CONF-{po.id}</strong></td>
//                             <td>{po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct PO'}</td>
//                             <td>{po.vendorQuoteRef || 'N/A'}</td>
//                             <td style={{ fontWeight: 'bold' }}>₹{po.totalAmount || po.estimatedTotalCost}</td>
//                             <td>
//                                 <span style={statusBadgeStyle}>{po.status || "OFFICIAL PO"}</span>
//                             </td>
//                             <td>
//                                 <button onClick={() => generatePDF(po)} style={downloadBtnStyle}>
//                                     Download Individual
//                                 </button>
//                             </td>
//                         </tr>
//                     )) : (
//                         <tr><td colSpan="6" style={{ textAlign: 'center' }}>No Data Found</td></tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// // --- Styles ---
// const tableStyle = { borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden' };
// const backBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '4px' };
// const wholeReportBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px' };
// const statusBadgeStyle = { color: 'green', fontWeight: 'bold', textTransform: 'uppercase' };
// const downloadBtnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };

// export default PurchaseOrder;


// import { useEffect, useState } from 'react';
// import AuthService from '../services/authService';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const PurchaseOrder = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [orders, setOrders] = useState([]);

//     useEffect(() => {
//         const fetchPOs = async () => {
//             if (!user?.token) return;
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const res = await axios.get("http://localhost:8081/api/po/all", config); 
//                 setOrders(res.data);
//             } catch (err) { 
//                 console.error("Error fetching POs", err); 
//             }
//         };
//         fetchPOs();
//     }, [user]);

//     // --- OPTION 1: Individual PO PDF (Included Item & Vendor Details) ---
//     const generatePDF = (po) => {
//         const doc = new jsPDF();
//         const vendor = po.purchaseRequest?.vendor || {};
        
//         // Item details extraction (Assuming they are in the first item of the PR list)
//         const item = po.purchaseRequest?.items?.[0] || {};

//         doc.setFontSize(18);
//         doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
        
//         doc.setFontSize(10);
//         doc.text(`PO Number: PO-CONF-${po.id}`, 14, 25);
//         doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

//         autoTable(doc, {
//             startY: 40,
//             head: [['Section', 'Details']],
//             body: [
//                 ["Vendor Company", vendor.companyName || 'N/A'],
//                 ["Vendor Contact", vendor.mobileNo || 'N/A'],
//                 ["---", "---"],
//                 ["Item Name", item.itemName || 'N/A'],
//                 ["Item Description", po.purchaseRequest?.description || 'N/A'],
//                 ["Quantity", item.quantity || '0'],
//                 ["Unit Price", `INR ${item.unitPrice || '0'}`],
//                 ["Total Amount", `INR ${po.totalAmount || '0'}`],
//                 ["Status", po.status || "OFFICIAL PO"]
//             ],
//             theme: 'grid',
//             headStyles: { fillColor: [22, 160, 133] }
//         });

//         doc.save(`PO_CONF_${po.id}.pdf`);
//     };

//     // --- OPTION 2: Whole Report (Included Item details) ---
//     const downloadWholeReport = () => {
//         const doc = new jsPDF('l', 'mm', 'a4'); 
//         doc.text("WHOLE PURCHASE ORDER SUMMARY", 149, 15, { align: "center" });

//         const tableColumn = ["PO No", "Vendor", "Item Name", "Qty", "Unit Price", "Total", "Status"];
//         const tableRows = orders.map(po => {
//             const item = po.purchaseRequest?.items?.[0] || {};
//             return [
//                 `PO-CONF-${po.id}`,
//                 po.purchaseRequest?.vendor?.companyName || 'N/A',
//                 item.itemName || 'N/A',
//                 item.quantity || '0',
//                 item.unitPrice || '0',
//                 po.totalAmount || '0',
//                 po.status || "OFFICIAL"
//             ];
//         });

//         autoTable(doc, {
//             startY: 25,
//             head: [tableColumn],
//             body: tableRows,
//             theme: 'striped',
//             headStyles: { fillColor: [44, 62, 80] }
//         });

//         doc.save("Whole_PO_Report.pdf");
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <h2 style={{ color: '#2c3e50' }}>Purchase Orders (Confirmed)</h2>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={downloadWholeReport} style={wholeReportBtnStyle}>
//                         📊 Download Whole Report
//                     </button>
//                     <button onClick={() => window.location.href="/dashboard"} style={backBtnStyle}>
//                         Back to Dashboard
//                     </button>
//                 </div>
//             </div>
//             <hr style={{ margin: '20px 0', opacity: '0.3' }} />
            
//             <table border="1" width="100%" cellPadding="12" style={tableStyle}>
//                 <thead>
//                     <tr style={{ background: '#16a085', color: 'white' }}>
//                         <th>PO Number</th>
//                         <th>Vendor</th>
//                         <th>Item Details</th>
//                         <th>Qty / Price</th>
//                         <th>Total</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {orders.length > 0 ? orders.map((po) => {
//                         const item = po.purchaseRequest?.items?.[0] || {};
//                         return (
//                             <tr key={po.id} style={{ borderBottom: '1px solid #ddd' }}>
//                                 <td><strong>PO-CONF-{po.id}</strong></td>
//                                 <td>{po.purchaseRequest?.vendor?.companyName || 'N/A'}</td>
//                                 <td>
//                                     <strong>{item.itemName || 'N/A'}</strong><br/>
//                                     <small>{po.purchaseRequest?.description || 'No Description'}</small>
//                                 </td>
//                                 <td>{item.quantity} x ₹{item.unitPrice}</td>
//                                 <td style={{ fontWeight: 'bold' }}>₹{po.totalAmount}</td>
//                                 <td>
//                                     <button onClick={() => generatePDF(po)} style={downloadBtnStyle}>
//                                         Download PDF
//                                     </button>
//                                 </td>
//                             </tr>
//                         );
//                     }) : (
//                         <tr><td colSpan="6" style={{ textAlign: 'center' }}>No Data Found</td></tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// // --- Styles (Same as before) ---
// const tableStyle = { borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden' };
// const backBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '4px' };
// const wholeReportBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px' };
// const downloadBtnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };

// export default PurchaseOrder;




// import { useEffect, useState } from 'react';
// import AuthService from '../services/authService';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const PurchaseOrder = () => {
//     const [user] = useState(AuthService.getCurrentUser());
//     const [orders, setOrders] = useState([]);

//     useEffect(() => {
//         const fetchPOs = async () => {
//             if (!user?.token) return;
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const res = await axios.get("http://localhost:8081/api/po/all", config); 
//                 setOrders(res.data);
//             } catch (err) { 
//                 console.error("Error fetching POs", err); 
//             }
//         };
//         fetchPOs();
//     }, [user]);

//     // --- OPTION 1: Individual PO PDF (Detailed Breakdown) ---
//     const generatePDF = (po) => {
//         const doc = new jsPDF();
//         const vendor = po.purchaseRequest?.vendor || {};
//         const item = po.purchaseRequest?.items?.[0] || {};

//         doc.setFontSize(18);
//         doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
        
//         doc.setFontSize(10);
//         doc.text(`PO Number: PO-CONF-${po.id}`, 14, 25);
//         doc.text(`Vendor: ${vendor.companyName || 'N/A'}`, 14, 30);
//         doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

//         autoTable(doc, {
//             startY: 45,
//             head: [['Item Name', 'Description', 'Qty', 'Unit Price', 'Total']],
//             body: [[
//                 item.itemName || 'N/A',
//                 po.purchaseRequest?.description || 'N/A',
//                 item.quantity || '0',
//                 `INR ${item.unitPrice || '0'}`,
//                 `INR ${po.totalAmount || '0'}`
//             ]],
//             theme: 'grid',
//             headStyles: { fillColor: [22, 160, 133] }
//         });

//         // Vendor Details Section in PDF
//         doc.text("Vendor Contact Info:", 14, doc.lastAutoTable.finalY + 10);
//         doc.setFontSize(9);
//         doc.text(`Email: ${vendor.email || 'N/A'} | Phone: ${vendor.mobileNo || 'N/A'}`, 14, doc.lastAutoTable.finalY + 15);

//         doc.save(`PO_CONF_${po.id}.pdf`);
//     };

//     // --- OPTION 2: Whole Report (Separate Columns for Qty & Price) ---
//     const downloadWholeReport = () => {
//         const doc = new jsPDF('l', 'mm', 'a4'); 
//         doc.text("WHOLE PURCHASE ORDER SUMMARY", 149, 15, { align: "center" });

//         const tableColumn = ["PO No", "Vendor", "Item Name", "Quantity", "Unit Price", "Total Amount", "Status"];
//         const tableRows = orders.map(po => {
//             const item = po.purchaseRequest?.items?.[0] || {};
//             return [
//                 `PO-CONF-${po.id}`,
//                 po.purchaseRequest?.vendor?.companyName || 'N/A',
//                 item.itemName || 'N/A',
//                 item.quantity || '0',
//                 `INR ${item.unitPrice || '0'}`,
//                 `INR ${po.totalAmount || '0'}`,
//                 po.status || "OFFICIAL"
//             ];
//         });

//         autoTable(doc, {
//             startY: 25,
//             head: [tableColumn],
//             body: tableRows,
//             theme: 'striped',
//             headStyles: { fillColor: [44, 62, 80] }
//         });

//         doc.save("Whole_PO_Report.pdf");
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <h2 style={{ color: '#2c3e50' }}>Purchase Orders (Confirmed)</h2>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={downloadWholeReport} style={wholeReportBtnStyle}>
//                         📊 Download Whole Report
//                     </button>
//                     <button onClick={() => window.location.href="/dashboard"} style={backBtnStyle}>
//                         Back to Dashboard
//                     </button>
//                 </div>
//             </div>
//             <hr style={{ margin: '20px 0', opacity: '0.3' }} />
            
//             <table border="1" width="100%" cellPadding="12" style={tableStyle}>
//                 <thead>
//                     <tr style={{ background: '#16a085', color: 'white' }}>
//                         <th>PO Number</th>
//                         <th>Vendor</th>
//                         <th>Item Details</th>
//                         <th>Quantity</th>
//                         <th>Unit Price</th>
//                         <th>Total</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {orders.length > 0 ? orders.map((po) => {
//                         const item = po.purchaseRequest?.items?.[0] || {};
//                         return (
//                             <tr key={po.id} style={{ borderBottom: '1px solid #ddd' }}>
//                                 <td><strong>PO-CONF-{po.id}</strong></td>
//                                 <td>{po.purchaseRequest?.vendor?.companyName || 'N/A'}</td>
//                                 <td>
//                                     <strong>{item.itemName || 'N/A'}</strong><br/>
//                                     <small style={{color: '#666'}}>{po.purchaseRequest?.description || ''}</small>
//                                 </td>
//                                 <td>{item.quantity}</td>
//                                 <td>₹{item.unitPrice}</td>
//                                 <td style={{ fontWeight: 'bold' }}>₹{po.totalAmount}</td>
//                                 <td>
//                                     <button onClick={() => generatePDF(po)} style={downloadBtnStyle}>
//                                         Download PDF
//                                     </button>
//                                 </td>
//                             </tr>
//                         );
//                     }) : (
//                         <tr><td colSpan="7" style={{ textAlign: 'center' }}>No Data Found</td></tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// // --- Styles (Unaltered) ---
// const tableStyle = { borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden' };
// const backBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '4px' };
// const wholeReportBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px' };
// const downloadBtnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };

// export default PurchaseOrder;


import { useEffect, useState } from 'react';
import AuthService from '../services/authService';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PurchaseOrder = () => {
    const [user] = useState(AuthService.getCurrentUser());
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchPOs = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get("http://localhost:8081/api/po/all", config); 
                setOrders(res.data);
            } catch (err) { 
                console.error("Error fetching POs", err); 
            }
        };
        fetchPOs();
    }, [user]);

    // --- WORKING METHOD 1: Individual PDF (Fixed with Time) ---
    const generatePDF = (po) => {
        const doc = new jsPDF();
        const vendor = po.purchaseRequest?.vendor || {};
        const item = po.purchaseRequest?.items?.[0] || {};

        // TIME LOGIC:
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString(); // HH:MM:SS format

        // Header Section
        doc.setFontSize(18);
        doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
        
        doc.setFontSize(10);
        doc.text(`PO Number: PO-CONF-${po.id}`, 14, 25);
        doc.text(`Source: ${po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct Order'}`, 14, 30);
        // Date aur Time dono yahan print honge
        doc.text(`Generated On: ${formattedDate} ${formattedTime}`, 14, 35);

        // Body Table (Aapka existing layout)
        autoTable(doc, {
            startY: 45,
            head: [['Field Description', 'Details']],
            body: [
                ["PO Reference", `PO-CONF-${po.id}`],
                ["Source PR", po.purchaseRequest ? `PR-${po.purchaseRequest.id}` : 'Direct PO'],
                ["Status", po.status || "OFFICIAL_PO"],
                ["Total Amount", `INR ${po.totalAmount || '0'}`],
                ["---", "---"],
                ["Item Name", item.itemName || 'N/A'],
                ["Item Description", po.purchaseRequest?.description || 'N/A'],
                ["Quantity", item.quantity || '0'],
                ["Unit Price", `INR ${item.unitPrice || '0'}`],
                ["---", "---"],
                ["Vendor Company", vendor.companyName || 'N/A'],
                ["Vendor Name", vendor.username || 'N/A'],
                ["Vendor Contact", vendor.mobileNo || 'N/A'],
                ["Vendor Email", vendor.email || 'N/A'],
                ["Vendor Address", vendor.address || 'N/A']
            ],
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            columnStyles: { 0: { fontStyle: 'bold' } }
        });

        doc.save(`PO_CONF_${po.id}.pdf`);
    };

    // --- WORKING METHOD 2: Whole Report (Fixed with Time) ---
    const downloadWholeReport = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); 
        
        // TIME LOGIC:
        const now = new Date();
        const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

        doc.text("WHOLE PURCHASE ORDER SUMMARY", 149, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Report Generated: ${timestamp}`, 14, 20); // Time add kiya summary ke header mein

        const tableColumn = ["PO No", "Vendor", "Item Name", "Qty", "Unit Price", "Total", "Status"];
        const tableRows = orders.map(po => {
            const item = po.purchaseRequest?.items?.[0] || {};
            return [
                `PO-CONF-${po.id}`,
                po.purchaseRequest?.vendor?.companyName || 'N/A',
                item.itemName || 'N/A',
                item.quantity || '0',
                `INR ${item.unitPrice || '0'}`,
                `INR ${po.totalAmount || '0'}`,
                po.status || "OFFICIAL"
            ];
        });

        autoTable(doc, {
            startY: 25,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80] }
        });

        doc.save("Whole_PO_Report.pdf");
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#2c3e50' }}>Purchase Orders (Confirmed)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={downloadWholeReport} style={wholeReportBtnStyle}>
                        📊 Download Whole Report
                    </button>
                    <button onClick={() => window.location.href="/dashboard"} style={backBtnStyle}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
            <hr style={{ margin: '20px 0', opacity: '0.3' }} />
            
            <table border="1" width="100%" cellPadding="12" style={tableStyle}>
                <thead>
                    <tr style={{ background: '#16a085', color: 'white' }}>
                        <th>PO Number</th>
                        <th>Vendor Ref</th>
                        <th>Item Details</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map((po) => {
                        const item = po.purchaseRequest?.items?.[0] || {};
                        return (
                            <tr key={po.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td><strong>PO-CONF-{po.id}</strong></td>
                                <td>{po.purchaseRequest?.vendor?.companyName || 'N/A'}</td>
                                <td>
                                    <strong>{item.itemName || 'N/A'}</strong><br/>
                                    <small>{po.purchaseRequest?.description || ''}</small>
                                </td>
                                <td>{item.quantity || 0}</td>
                                <td>₹{item.unitPrice || 0}</td>
                                <td style={{ fontWeight: 'bold' }}>₹{po.totalAmount}</td>
                                <td>
                                    <button onClick={() => generatePDF(po)} style={downloadBtnStyle}>
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr><td colSpan="7" style={{ textAlign: 'center' }}>No Data Found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Styles remain unchanged
const tableStyle = { borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden' };
const backBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '4px' };
const wholeReportBtnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px' };
const downloadBtnStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };

export default PurchaseOrder;