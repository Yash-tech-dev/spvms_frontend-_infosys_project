
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function ProcurementDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- REAL DATA STATE ---
//   const [stats, setStats] = useState({
//     totalPRs: 0,
//     pendingPRs: 0,
//     activePOs: 0,
//     vendors: 0,
//   });
//   const [prs, setPrs] = useState([]);
//   const [pos, setPos] = useState([]);
//   const [vendors, setVendors] = useState([]);

//   // --- FORM STATE ---
//   const [newPR, setNewPR] = useState({
//     itemName: "",
//     quantity: "",
//     estimatedCost: "",
//     description: ""
//   });

//   // --- API CONFIG HELPER ---
//   const getAuthConfig = () => {
//     const userStr = localStorage.getItem("user");
//     let token = null;
//     if (userStr) {
//       try {
//         token = JSON.parse(userStr).token;
//       } catch (e) { console.error("Token parse error"); }
//     }
    
//     if (!token) {
//       navigate("/"); // Redirect if no token
//       return null;
//     }

//     return {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     const config = getAuthConfig();
//     if (!config) return;

//     setLoading(true);
//     try {
//       // 1. Fetch PRs, POs, and Vendors in parallel
//       const [prRes, poRes, vendorRes] = await Promise.all([
//         axios.get("http://localhost:8081/api/pr/all", config),
//         axios.get("http://localhost:8081/api/po/all", config),
//         axios.get("http://localhost:8081/api/vendor/all", config)
//       ]);

//       const prData = prRes.data || [];
//       const poData = poRes.data || [];
//       const vendorData = vendorRes.data || [];

//       // 2. Update Lists
//       setPrs(prData);
//       setPos(poData);
//       setVendors(vendorData);

//       // 3. Calculate Live Stats
//       setStats({
//         totalPRs: prData.length,
//         pendingPRs: prData.filter(pr => pr.status === 'PENDING').length,
//         activePOs: poData.filter(po => po.status !== 'DELIVERED').length,
//         vendors: vendorData.length
//       });

//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//       if(err.response?.status === 403) {
//         setError("Access Denied. You do not have permission.");
//       } else {
//         setError("Failed to load data from backend.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- HANDLERS ---
//   const handleLogout = () => {
//     localStorage.removeItem("user"); // Clear user object
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const handleEditInitiate = (pr) => {
//   setEditingId(pr.id); // Track which ID we are editing
//   setNewPR({
//     description: pr.description,
//     itemName: pr.items?.[0]?.itemName || "",
//     quantity: pr.items?.[0]?.quantity || "",
//     estimatedCost: pr.estimatedTotalCost || ""
//   });
//   setShowCreateModal(true);
// };

//   const handleInputChange = (e) => {
//     setNewPR({...newPR, [e.target.name]: e.target.value});
//   };

//  /**
//  * Method: handleCreatePR (Aligned with Spring Boot PRService)
//  * Working: 
//  * 1. Payload Mapping: Frontend data ko 'items' array mein wrap karta hai.
//  * 2. Math Logic: Total price backend calculate karega, par hum safety ke liye bhej rahe hain.
//  * 3. Validation: UI par hi check kar leta hai ki values zero na hon.
//  */
// const handleCreatePR = async (e) => {
//   e.preventDefault();
//   const config = getAuthConfig();
//   if (!config) return;

//   // Form Validation
//   if (parseInt(newPR.quantity) <= 0 || parseFloat(newPR.estimatedCost) <= 0) {
//     alert("Quantity and Price must be greater than zero!");
//     return;
//   }

//   try {
//     const payload = {
//       description: newPR.description, // PR level description
//       status: "PENDING",
//       items: [
//         {
//           itemName: newPR.itemName, // Pehla item jo user ne form mein bhara
//           quantity: parseInt(newPR.quantity),
//           unitPrice: parseFloat(newPR.estimatedCost) / parseInt(newPR.quantity),
//           description: `Item: ${newPR.itemName}` 
//         }
//       ]
//       // estimatedTotalCost backend service pr.calculateTotal() se auto-update kar degi
//     };

//     const response = await axios.post("http://localhost:8081/api/pr/create", payload, config);

//     if (response.status === 200 || response.status === 201) {
//       alert("PR created and saved in Database!");
//       setShowCreateModal(false);
//       setNewPR({ itemName: "", quantity: "", estimatedCost: "", description: "" });
//       fetchDashboardData(); // Fresh data pull from DB
//     }
//   } catch (err) {
//     console.error("Backend Error:", err.response?.data || err.message);
//     alert("Database sync failed. Check if PRItem table exists.");
//   }
// };

//   const downloadPDF = (poId) => {
//     // Logic to call Backend PDF endpoint
//     alert(`Downloading PDF logic for PO #${poId} not yet connected.`);
//     // window.open(`http://localhost:8081/api/po/${poId}/pdf`, '_blank');
//   };

//   // --- SUB-COMPONENTS (RENDERERS) ---

//   const renderOverview = () => (
//     <div style={styles.gridContainer}>
//       {/* Quick Action Card */}
//       <div style={styles.actionCard}>
//         <h3 style={styles.cardTitle}>🚀 Quick Action</h3>
//         <p style={styles.cardText}>Need to procure new items?</p>
//         <button style={styles.createButton} onClick={() => setShowCreateModal(true)}>
//           + Create New PR
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div style={styles.statCard}>
//         <span style={styles.icon}>📝</span>
//         <h3>{stats.totalPRs}</h3>
//         <p>Total PRs Created</p>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>⏳</span>
//         <h3>{stats.pendingPRs}</h3>
//         <p>Pending Approval</p>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>📦</span>
//         <h3>{stats.activePOs}</h3>
//         <p>Active POs</p>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>🤝</span>
//         <h3>{stats.vendors}</h3>
//         <p>Vendors Assigned</p>
//       </div>
//     </div>
//   );



// /**
//  * Method: renderPRs
//  * Working: 
//  * 1. Fixed ReferenceError by defining 'isApproved'.
//  * 2. Removed extra whitespace to fix DOM nesting warning.
//  * 3. Aligned with your PO Service logic (APPROVED status).
//  */
// const renderPRs = () => (
//   <div style={styles.tableContainer}>
//     <div style={styles.headerRow}>
//       <h2>Purchase Requests (PR)</h2>
//       <button style={styles.smallButton} onClick={() => { setEditingId(null); setShowCreateModal(true); }}>+ New PR</button>
//     </div>
//     {prs.length === 0 ? <p>No PRs found.</p> : (
//       <table style={styles.table}>
//         <thead>
//           <tr style={styles.trHead}>
//             <th style={styles.th}>PR ID</th>
//             <th style={styles.th}>Description</th>
//             <th style={styles.th}>Items Name</th>
//             <th style={styles.th}>Quantity</th>
//             <th style={styles.th}>Estimated Cost</th>
//             <th style={styles.th}>Status</th>
//             <th style={styles.th}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {prs.map((pr) => {
//             // FIX: Defining the missing variable here
//             const isApproved = pr.status?.toUpperCase() === "APPROVED";
//             const isPending = !pr.status || pr.status.toUpperCase() === "PENDING";

//             return (
//               <tr key={pr.id} style={styles.tr}>
//                 <td style={styles.td}><b>PR-{pr.id}</b></td>
//                 <td style={styles.td}>
//                   <span style={{ fontWeight: '500', color: '#1e293b' }}>
//                     {pr.description || "No Description Provided"}
//                   </span>
//                 </td>
//                 <td style={styles.td}>
//                   {pr.items && pr.items.length > 0 ? (
//                     <span style={{ color: '#475569', fontSize: '13px' }}>
//                       {pr.items[0].itemName || "Unnamed Item"}
//                       {pr.items.length > 1 && <span style={{ color: '#3b82f6', fontWeight: 'bold' }}> (+{pr.items.length - 1})</span>}
//                     </span>
//                   ) : (
//                     <span style={{ color: '#94a3b8' }}>No Items</span>
//                   )}
//                 </td>
//                 <td style={styles.td}>{pr.items ? pr.items.length : 0} Items</td>
//                 <td style={styles.td}>
//                   <b style={{ color: '#0f172a' }}>₹ {pr.estimatedTotalCost ? pr.estimatedTotalCost.toLocaleString() : "0.00"}</b>
//                 </td>
//                 <td style={styles.td}>
//                   <span style={getStatusStyle(pr.status)}>
//                     {pr.status ? pr.status.toUpperCase() : "PENDING"}
//                   </span>
//                 </td>
//                 <td style={styles.td}>
//                   {isPending ? (
//                     <button style={styles.editBtn} onClick={() => handleEditInitiate(pr)}>Edit</button>
//                   ) : (
//                     <span style={styles.disabledText}>
//                       {isApproved ? "✅ PO Generated" : "🚫 Locked"}
//                     </span>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     )}
//   </div>
// );

//   const renderPOs = () => (
//     <div style={styles.tableContainer}>
//       <h2 style={{marginBottom: '20px'}}>Purchase Orders (PO) - Read Only</h2>
//       {pos.length === 0 ? <p>No Purchase Orders generated yet.</p> : (
//       <table style={styles.table}>
//         <thead>
//           <tr style={styles.trHead}>
//             <th style={styles.th}>PO ID</th>
//             <th style={styles.th}>Ref PR</th>
//             <th style={styles.th}>Vendor</th>
//             <th style={styles.th}>Total Amount</th>
//             <th style={styles.th}>Status</th>
//             <th style={styles.th}>Document</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pos.map((po) => (
//             <tr key={po.id} style={styles.tr}>
//               <td style={styles.td}><b>{po.id}</b></td>
//               <td style={styles.td}>{po.pr?.id || "N/A"}</td>
//               <td style={styles.td}>{po.vendor?.username || "N/A"}</td>
//               <td style={styles.td}>₹{po.totalAmount}</td>
//               <td style={styles.td}>
//                 <span style={getPOStatusStyle(po.status)}>{po.status}</span>
//               </td>
//               <td style={styles.td}>
//                 <button style={styles.downloadBtn} onClick={() => downloadPDF(po.id)}>
//                    ⬇ PDF
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       )}
//     </div>
//   );

//   const renderVendors = () => (
//     <div style={styles.tableContainer}>
//       <h2 style={{marginBottom: '20px'}}>Available Vendors</h2>
//       <div style={styles.vendorGrid}>
//         {vendors.map((vendor) => (
//             <div key={vendor.id} style={styles.vendorCard}>
//                 <h3 style={{margin: '0 0 10px 0'}}>{vendor.companyName || vendor.username}</h3>
//                 <p>Email: {vendor.email}</p>
//                 <p>Status: <b style={{color: vendor.active ? 'green' : 'red'}}>{vendor.active ? 'Active' : 'Inactive'}</b></p>
//                 <button style={styles.assignBtn}>View Details</button>
//             </div>
//         ))}
//       </div>
//     </div>
//   );

//   if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Dashboard Data...</div>;

//   return (
//     <div style={styles.container}>
//       {/* SIDEBAR */}
//       <div style={styles.sidebar}>
//         <div style={styles.brand}>SPVMS <span style={styles.roleBadge}>Procurement</span></div>
//         <nav style={styles.nav}>
//           <button style={activeTab === 'overview' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('overview')}>📊 Dashboard</button>
//           <button style={activeTab === 'prs' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('prs')}>📝 My PRs</button>
//           <button style={activeTab === 'pos' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('pos')}>📦 Purchase Orders</button>
//           <button style={activeTab === 'vendors' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('vendors')}>🤝 Vendors</button>
//         </nav>
//         <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
//       </div>

//       {/* MAIN CONTENT */}
//       <div style={styles.main}>
//         <header style={styles.topBar}>
//           <h2 style={styles.pageTitle}>
//             {activeTab === 'overview' && 'Overview'}
//             {activeTab === 'prs' && 'Purchase Request Management'}
//             {activeTab === 'pos' && 'Purchase Order Tracking'}
//             {activeTab === 'vendors' && 'Vendor Directory'}
//           </h2>
//           <div style={styles.profile}>👤 Procurement Officer</div>
//         </header>

//         <div style={styles.content}>
//           {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
//           {activeTab === 'overview' && renderOverview()}
//           {activeTab === 'prs' && renderPRs()}
//           {activeTab === 'pos' && renderPOs()}
//           {activeTab === 'vendors' && renderVendors()}
//         </div>
//       </div>

//       {/* CREATE PR MODAL */}
//       {showCreateModal && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <h2>Create Purchase Request</h2>
//             <form onSubmit={handleCreatePR} style={styles.form}>
//                 <label style={styles.label}>Item Name</label>
//                 <input name="itemName" value={newPR.itemName} onChange={handleInputChange} type="text" style={styles.input} placeholder="e.g., Laptops" required />
                
//                 <label style={styles.label}>Quantity</label>
//                 <input name="quantity" value={newPR.quantity} onChange={handleInputChange} type="number" style={styles.input} placeholder="0" required />

//                 <label style={styles.label}>Estimated Cost (rupees sign)</label>
//                 <input name="estimatedCost" value={newPR.estimatedCost} onChange={handleInputChange} type="number" style={styles.input} placeholder="0.00" required />

//                 <label style={styles.label}>Description</label>
//                 <textarea name="description" value={newPR.description} onChange={handleInputChange} style={styles.textarea} placeholder="Reason for purchase..."></textarea>
                
//                 <div style={styles.modalActions}>
//                     <button type="button" onClick={() => setShowCreateModal(false)} style={styles.cancelBtn}>Cancel</button>
//                     <button type="submit" style={styles.submitBtn}>Submit Request</button>
//                 </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- HELPER FUNCTIONS ---
// const getStatusStyle = (status) => {
//     const safeStatus = status ? status.toUpperCase() : 'PENDING'; // Safety check
    
//     const base = { padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' };
    
//     if (safeStatus === 'APPROVED') return { ...base, background: '#dcfce7', color: '#166534' }; // Green
//     if (safeStatus === 'PENDING') return { ...base, background: '#fef9c3', color: '#854d0e' }; // Yellow
//     if (safeStatus === 'REJECTED') return { ...base, background: '#fee2e2', color: '#991b1b' }; // Red
    
//     return { ...base, background: '#f1f5f9', color: '#475569' }; // Default Grey
// };

// const getPOStatusStyle = (status) => {
//     const base = { padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '600' };
//     if (status === 'SENT') return { ...base, background: '#e0f2fe', color: '#075985' }; // Blue
//     if (status === 'DELIVERED') return { ...base, background: '#d1fae5', color: '#065f46' }; // Green
//     if (status === 'ACCEPTED') return { ...base, background: '#f3e8ff', color: '#6b21a8' }; // Purple
//     return base;
// };

// // --- STYLES (Unchanged) ---
// const styles = {
//   container: { display: "flex", height: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#f8fafc" },
//   sidebar: { width: "260px", background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "20px" },
//   brand: { fontSize: "24px", fontWeight: "bold", marginBottom: "40px", color: "#4ade80", display: 'flex', alignItems: 'center', gap: '10px' },
//   roleBadge: { fontSize: "12px", background: "#334155", padding: "2px 8px", borderRadius: "4px", color: "#94a3b8", fontWeight: "normal" },
//   nav: { flex: 1, display: "flex", flexDirection: "column", gap: "10px" },
//   navItem: { background: "transparent", border: "none", color: "#cbd5e1", padding: "12px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", transition: "0.2s" },
//   navItemActive: { background: "#334155", border: "none", color: "#fff", padding: "12px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", fontWeight: "bold" },
//   logoutBtn: { padding: "12px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "auto" },
  
//   main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
//   topBar: { height: "70px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px" },
//   pageTitle: { margin: 0, fontSize: "20px", color: "#1e293b" },
//   profile: { color: "#64748b", fontWeight: "500" },
  
//   content: { padding: "30px", overflowY: "auto", flex: 1 },
  
//   // Dashboard Grid
//   gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
//   statCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" },
//   actionCard: { background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" },
//   cardTitle: { margin: "0 0 10px 0" },
//   cardText: { fontSize: "14px", marginBottom: "15px", opacity: 0.9 },
//   icon: { fontSize: "30px", display: "block", marginBottom: "10px" },
  
//   // Tables
//   tableContainer: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
//   headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
//   trHead: { borderBottom: "2px solid #e2e8f0", textAlign: "left" },
//   th: { padding: "15px", color: "#64748b", fontSize: "14px", fontWeight: "600" },
//   tr: { borderBottom: "1px solid #f1f5f9" },
//   td: { padding: "15px", color: "#334155", fontSize: "14px" },
  
//   // Buttons
//   createButton: { background: "#fff", color: "#2563eb", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" },
//   smallButton: { background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
//   editBtn: { background: "#f59e0b", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
//   disabledText: { color: "#94a3b8", fontStyle: "italic", fontSize: "12px" },
//   downloadBtn: { background: "#0f172a", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
//   assignBtn: { width: "100%", marginTop: "10px", padding: "8px", background: "#e2e8f0", border: "none", borderRadius: "6px", color: "#475569", cursor: "pointer", fontWeight: "600" },

//   // Vendor Grid
//   vendorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
//   vendorCard: { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px" },
  
//   // Modal
//   modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
//   modal: { background: "#fff", padding: "30px", borderRadius: "12px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
//   form: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
//   label: { fontSize: "14px", fontWeight: "600", color: "#334155" },
//   input: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" },
//   textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px" },
//   modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
//   cancelBtn: { padding: "10px 20px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer" },
//   submitBtn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }
// };








// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function ProcurementDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // --- NEW STATE FOR EDITING ---
//   const [editingId, setEditingId] = useState(null);

//   // --- REAL DATA STATE ---
//   const [stats, setStats] = useState({
//     totalPRs: 0,
//     pendingPRs: 0,
//     activePOs: 0,
//     vendors: 0,
//   });
//   const [prs, setPrs] = useState([]);
//   const [pos, setPos] = useState([]);
//   const [vendors, setVendors] = useState([]);

//   // --- FORM STATE ---
//   const [newPR, setNewPR] = useState({
//     itemName: "",
//     quantity: "",
//     estimatedCost: "",
//     description: ""
//   });

//   // --- API CONFIG HELPER ---
//   const getAuthConfig = () => {
//     const userStr = localStorage.getItem("user");
//     let token = null;
//     if (userStr) {
//       try {
//         token = JSON.parse(userStr).token;
//       } catch (e) { console.error("Token parse error"); }
//     }
    
//     if (!token) {
//       navigate("/"); 
//       return null;
//     }

//     return {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     const config = getAuthConfig();
//     if (!config) return;

//     setLoading(true);
//     try {
//       const [prRes, poRes, vendorRes] = await Promise.all([
//         axios.get("http://localhost:8081/api/pr/all", config),
//         axios.get("http://localhost:8081/api/po/all", config),
//         axios.get("http://localhost:8081/api/vendor/all", config)
//       ]);

//       const prData = prRes.data || [];
//       const poData = poRes.data || [];
//       const vendorData = vendorRes.data || [];

//       setPrs(prData);
//       setPos(poData);
//       setVendors(vendorData);

//       setStats({
//         totalPRs: prData.length,
//         pendingPRs: prData.filter(pr => pr.status === 'PENDING').length,
//         activePOs: poData.filter(po => po.status !== 'DELIVERED').length,
//         vendors: vendorData.length
//       });

//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//       if(err.response?.status === 403) {
//         setError("Access Denied. You do not have permission.");
//       } else {
//         setError("Failed to load data from backend.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- HANDLERS ---
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const handleEditInitiate = (pr) => {
//     setEditingId(pr.id); 
//     setNewPR({
//       description: pr.description || "",
//       itemName: pr.items?.[0]?.itemName || "",
//       quantity: pr.items?.[0]?.quantity || "",
//       estimatedCost: pr.estimatedTotalCost || ""
//     });
//     setShowCreateModal(true);
//   };

//   const handleInputChange = (e) => {
//     setNewPR({...newPR, [e.target.name]: e.target.value});
//   };
//   const closeModal = () => {
//   setShowCreateModal(false);
//   setEditingId(null);
//   setNewPR({ itemName: "", quantity: "", estimatedCost: "", description: "" });
// };

//   /**
//    * Method: handleCreatePR
//    * Working: Sends a POST request to create a new PR with nested items.
//    */
//   const handleCreatePR = async (e) => {
//   if (e) e.preventDefault();
//   const config = getAuthConfig();
//   if (!config) return;

//   const qty = parseInt(newPR.quantity);
//   const pricePerItem = parseFloat(newPR.estimatedCost); // User ne 200 dala
//   const totalCalculated = qty * pricePerItem; // 50 * 200 = 10,000

//   if (qty <= 0 || pricePerItem <= 0) {
//     alert("Quantity and Price must be greater than zero!");
//     return;
//   }

//   try {
//     const payload = {
//       description: newPR.description,
//       status: "PENDING",
//       // Backend expects this field often for total summary
//       estimatedTotalCost: totalCalculated, 
//       items: [
//         {
//           itemName: newPR.itemName,
//           quantity: qty,
//           unitPrice: pricePerItem, // 200
//           description: `Item: ${newPR.itemName}` 
//         }
//       ]
//     };

//     const response = await axios.post("http://localhost:8081/api/pr/create", payload, config);

//     if (response.status === 200 || response.status === 201) {
//       alert(`PR Created! Total Amount: ₹${totalCalculated}`);
//       closeModal();
//       fetchDashboardData();
//     }
//   } catch (err) {
//     console.error("Error:", err);
//     alert("Check if backend is calculating total cost correctly.");
//   }
// };
//   /**
//    * Method: handleUpdatePR
//    * Working: Sends a PUT request to update existing PR and its items.
//    */
//  const handleUpdatePR = async (e) => {
//   if (e) e.preventDefault();
//   const config = getAuthConfig();
  
//   const qty = parseInt(newPR.quantity);
//   const pricePerItem = parseFloat(newPR.estimatedCost);
//   const totalCalculated = qty * pricePerItem;

//   try {
//     const payload = {
//       description: newPR.description,
//       estimatedTotalCost: totalCalculated, // Update total here
//       items: [
//         {
//           itemName: newPR.itemName,
//           quantity: qty,
//           unitPrice: pricePerItem,
//           description: `Updated: ${newPR.itemName}`
//         }
//       ]
//     };

//     await axios.put(`http://localhost:8081/api/pr/update/${editingId}`, payload, config);
//     alert("PR Updated Successfully!");
//     closeModal();
//     fetchDashboardData();
//   } catch (err) {
//     alert("Update failed.");
//   }
// };

//   // --- RENDERERS ---

//   const renderOverview = () => (
//     <div style={styles.gridContainer}>
//       <div style={styles.actionCard}>
//         <h3 style={styles.cardTitle}>🚀 Quick Action</h3>
//         <p style={styles.cardText}>Need to procure new items?</p>
//         <button style={styles.createButton} onClick={() => { setEditingId(null); setShowCreateModal(true); }}>
//           + Create New PR
//         </button>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>📝</span>
//         <h3>{stats.totalPRs}</h3>
//         <p>Total PRs Created</p>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>⏳</span>
//         <h3>{stats.pendingPRs}</h3>
//         <p>Pending Approval</p>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>📦</span>
//         <h3>{stats.activePOs}</h3>
//         <p>Active POs</p>
//       </div>
//       <div style={styles.statCard}>
//         <span style={styles.icon}>🤝</span>
//         <h3>{stats.vendors}</h3>
//         <p>Vendors Assigned</p>
//       </div>
//     </div>
//   );

//   const renderPRs = () => (
//     <div style={styles.tableContainer}>
//       <div style={styles.headerRow}>
//         <h2>Purchase Requests (PR)</h2>
//         <button style={styles.smallButton} onClick={() => { setEditingId(null); setShowCreateModal(true); }}>+ New PR</button>
//       </div>
//       {prs.length === 0 ? <p>No PRs found.</p> : (
//         <table style={styles.table}>
//           <thead>
//             <tr style={styles.trHead}>
//               <th style={styles.th}>PR ID</th>
//               <th style={styles.th}>Description</th>
//               <th style={styles.th}>Items Name</th>
//               <th style={styles.th}>Quantity</th>
//               <th style={styles.th}>Estimated Cost</th>
//               <th style={styles.th}>Status</th>
//               <th style={styles.th}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {prs.map((pr) => {
//               const isApproved = pr.status?.toUpperCase() === "APPROVED";
//               const isPending = !pr.status || pr.status.toUpperCase() === "PENDING";
//               return (
//                 <tr key={pr.id} style={styles.tr}>
//                   <td style={styles.td}><b>PR-{pr.id}</b></td>
//                   <td style={styles.td}>
//                     <span style={{ fontWeight: '500', color: '#1e293b' }}>{pr.description || "No Description Provided"}</span>
//                   </td>
//                   <td style={styles.td}>
//                     {pr.items && pr.items.length > 0 ? (
//                       <span style={{ color: '#475569', fontSize: '13px' }}>
//                         {pr.items[0].itemName || "Unnamed Item"}
//                         {pr.items.length > 1 && <span style={{ color: '#3b82f6', fontWeight: 'bold' }}> (+{pr.items.length - 1})</span>}
//                       </span>
//                     ) : ( <span style={{ color: '#94a3b8' }}>No Items</span> )}
//                   </td>
//                   <td style={styles.td}>{pr.items ? pr.items.length : 0} Items</td>
//                   <td style={styles.td}>
//                     <b style={{ color: '#0f172a' }}>₹ {pr.estimatedTotalCost ? pr.estimatedTotalCost.toLocaleString() : "0.00"}</b>
//                   </td>
//                   <td style={styles.td}>
//                     <span style={getStatusStyle(pr.status)}>{pr.status ? pr.status.toUpperCase() : "PENDING"}</span>
//                   </td>
//                   <td style={styles.td}>
//                     {isPending ? (
//                       <button style={styles.editBtn} onClick={() => handleEditInitiate(pr)}>Edit</button>
//                     ) : (
//                       <span style={styles.disabledText}>{isApproved ? "✅ PO Generated" : "🚫 Locked"}</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );

//   const renderPOs = () => (
//     <div style={styles.tableContainer}>
//       <h2 style={{marginBottom: '20px'}}>Purchase Orders (PO) - Read Only</h2>
//       {pos.length === 0 ? <p>No Purchase Orders generated yet.</p> : (
//       <table style={styles.table}>
//         <thead>
//           <tr style={styles.trHead}>
//             <th style={styles.th}>PO ID</th>
//             <th style={styles.th}>Ref PR</th>
//             <th style={styles.th}>Vendor</th>
//             <th style={styles.th}>Total Amount</th>
//             <th style={styles.th}>Status</th>
//             <th style={styles.th}>Document</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pos.map((po) => (
//             <tr key={po.id} style={styles.tr}>
//               <td style={styles.td}><b>{po.id}</b></td>
//               <td style={styles.td}>{po.pr?.id || "N/A"}</td>
//               <td style={styles.td}>{po.vendor?.username || "N/A"}</td>
//               <td style={styles.td}>₹{po.totalAmount}</td>
//               <td style={styles.td}>
//                 <span style={getPOStatusStyle(po.status)}>{po.status}</span>
//               </td>
//               <td style={styles.td}>
//                 <button style={styles.downloadBtn} onClick={() => downloadPDF(po.id)}>⬇ PDF</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       )}
//     </div>
//   );

//   const renderVendors = () => (
//     <div style={styles.tableContainer}>
//       <h2 style={{marginBottom: '20px'}}>Available Vendors</h2>
//       <div style={styles.vendorGrid}>
//         {vendors.map((vendor) => (
//             <div key={vendor.id} style={styles.vendorCard}>
//                 <h3 style={{margin: '0 0 10px 0'}}>{vendor.companyName || vendor.username}</h3>
//                 <p>Email: {vendor.email}</p>
//                 <p>Status: <b style={{color: vendor.active ? 'green' : 'red'}}>{vendor.active ? 'Active' : 'Inactive'}</b></p>
//                 <button style={styles.assignBtn}>View Details</button>
//             </div>
//         ))}
//       </div>
//     </div>
//   );

//   if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Dashboard Data...</div>;

//   return (
//     <div style={styles.container}>
//       <div style={styles.sidebar}>
//         <div style={styles.brand}>SPVMS <span style={styles.roleBadge}>Procurement</span></div>
//         <nav style={styles.nav}>
//           <button style={activeTab === 'overview' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('overview')}>📊 Dashboard</button>
//           <button style={activeTab === 'prs' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('prs')}>📝 My PRs</button>
//           <button style={activeTab === 'pos' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('pos')}>📦 Purchase Orders</button>
//           <button style={activeTab === 'vendors' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('vendors')}>🤝 Vendors</button>
//         </nav>
//         <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
//       </div>

//       <div style={styles.main}>
//         <header style={styles.topBar}>
//           <h2 style={styles.pageTitle}>
//             {activeTab === 'overview' && 'Overview'}
//             {activeTab === 'prs' && 'Purchase Request Management'}
//             {activeTab === 'pos' && 'Purchase Order Tracking'}
//             {activeTab === 'vendors' && 'Vendor Directory'}
//           </h2>
//           <div style={styles.profile}>👤 Procurement Officer</div>
//         </header>

//         <div style={styles.content}>
//           {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
//           {activeTab === 'overview' && renderOverview()}
//           {activeTab === 'prs' && renderPRs()}
//           {activeTab === 'pos' && renderPOs()}
//           {activeTab === 'vendors' && renderVendors()}
//         </div>
//       </div>

//       {showCreateModal && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <h2>{editingId ? "Update Purchase Request" : "Create Purchase Request"}</h2>
//             {/* Logic check: If editingId exists, call handleUpdatePR, else handleCreatePR */}
//             <form onSubmit={editingId ? handleUpdatePR : handleCreatePR} style={styles.form}>
//                 <label style={styles.label}>Item Name</label>
//                 <input name="itemName" value={newPR.itemName} onChange={handleInputChange} type="text" style={styles.input} placeholder="e.g., Laptops" required />
//                 <label style={styles.label}>Quantity</label>
//                 <input name="quantity" value={newPR.quantity} onChange={handleInputChange} type="number" style={styles.input} placeholder="0" required />
//                 <label style={styles.label}>Estimated Cost</label>
//                 <input name="estimatedCost" value={newPR.estimatedCost} onChange={handleInputChange} type="number" style={styles.input} placeholder="0.00" required />
//                 <label style={styles.label}>Description</label>
//                 <textarea name="description" value={newPR.description} onChange={handleInputChange} style={styles.textarea} placeholder="Reason for purchase..."></textarea>
//                 <div style={styles.modalActions}>
//                     <button type="button" onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
//                     <button type="submit" style={styles.submitBtn}>{editingId ? "Update Request" : "Submit Request"}</button>
//                 </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const getStatusStyle = (status) => {
//     const safeStatus = status ? status.toUpperCase() : 'PENDING';
//     const base = { padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' };
//     if (safeStatus === 'APPROVED') return { ...base, background: '#dcfce7', color: '#166534' };
//     if (safeStatus === 'PENDING') return { ...base, background: '#fef9c3', color: '#854d0e' };
//     if (safeStatus === 'REJECTED') return { ...base, background: '#fee2e2', color: '#991b1b' };
//     return { ...base, background: '#f1f5f9', color: '#475569' };
// };

// const getPOStatusStyle = (status) => {
//     const base = { padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '600' };
//     if (status === 'SENT') return { ...base, background: '#e0f2fe', color: '#075985' };
//     if (status === 'DELIVERED') return { ...base, background: '#d1fae5', color: '#065f46' };
//     if (status === 'ACCEPTED') return { ...base, background: '#f3e8ff', color: '#6b21a8' };
//     return base;
// };

// // Styles remain identical to your version
// const styles = {
//   container: { display: "flex", height: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#f8fafc" },
//   sidebar: { width: "260px", background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "20px" },
//   brand: { fontSize: "24px", fontWeight: "bold", marginBottom: "40px", color: "#4ade80", display: 'flex', alignItems: 'center', gap: '10px' },
//   roleBadge: { fontSize: "12px", background: "#334155", padding: "2px 8px", borderRadius: "4px", color: "#94a3b8", fontWeight: "normal" },
//   nav: { flex: 1, display: "flex", flexDirection: "column", gap: "10px" },
//   navItem: { background: "transparent", border: "none", color: "#cbd5e1", padding: "12px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", transition: "0.2s" },
//   navItemActive: { background: "#334155", border: "none", color: "#fff", padding: "12px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", fontWeight: "bold" },
//   logoutBtn: { padding: "12px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "auto" },
//   main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
//   topBar: { height: "70px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px" },
//   pageTitle: { margin: 0, fontSize: "20px", color: "#1e293b" },
//   profile: { color: "#64748b", fontWeight: "500" },
//   content: { padding: "30px", overflowY: "auto", flex: 1 },
//   gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
//   statCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" },
//   actionCard: { background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" },
//   cardTitle: { margin: "0 0 10px 0" },
//   cardText: { fontSize: "14px", marginBottom: "15px", opacity: 0.9 },
//   icon: { fontSize: "30px", display: "block", marginBottom: "10px" },
//   tableContainer: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
//   headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
//   trHead: { borderBottom: "2px solid #e2e8f0", textAlign: "left" },
//   th: { padding: "15px", color: "#64748b", fontSize: "14px", fontWeight: "600" },
//   tr: { borderBottom: "1px solid #f1f5f9" },
//   td: { padding: "15px", color: "#334155", fontSize: "14px" },
//   createButton: { background: "#fff", color: "#2563eb", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" },
//   smallButton: { background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
//   editBtn: { background: "#f59e0b", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
//   disabledText: { color: "#94a3b8", fontStyle: "italic", fontSize: "12px" },
//   downloadBtn: { background: "#0f172a", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
//   assignBtn: { width: "100%", marginTop: "10px", padding: "8px", background: "#e2e8f0", border: "none", borderRadius: "6px", color: "#475569", cursor: "pointer", fontWeight: "600" },
//   vendorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
//   vendorCard: { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px" },
//   modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
//   modal: { background: "#fff", padding: "30px", borderRadius: "12px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
//   form: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
//   label: { fontSize: "14px", fontWeight: "600", color: "#334155" },
//   input: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" },
//   textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px" },
//   modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
//   cancelBtn: { padding: "10px 20px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer" },
//   submitBtn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }
// };






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ProcurementDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // --- NEW STATE FOR EDITING & VENDOR SELECTION ---
  const [editingId, setEditingId] = useState(null);
  // const [selectedVendorId, setSelectedVendorId] = useState(""); // New state for vendor selection
  const [selectedVendor, setSelectedVendor] = useState(null); // Vendor details popup ke liye

  // --- REAL DATA STATE ---
  const [stats, setStats] = useState({
    totalPRs: 0,
    pendingPRs: 0,
    activePOs: 0,
    vendors: 0,
  });
  const [prs, setPrs] = useState([]);
  const [pos, setPos] = useState([]);
  const [vendors, setVendors] = useState([]); // Vendors list

  // --- FORM STATE ---
  const [newPR, setNewPR] = useState({
    itemName: "",
    quantity: "",
    unitPrice: "", // Changed from estimatedCost for clarity in UI
    description: ""
  });

  // --- API CONFIG HELPER ---
  const getAuthConfig = () => {
    const userStr = localStorage.getItem("user");
    let token = null;
    if (userStr) {
      try {
        token = JSON.parse(userStr).token;
      } catch (e) { console.error("Token parse error"); }
    }
    
    if (!token) {
      navigate("/"); 
      return null;
    }

    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const config = getAuthConfig();
    if (!config) return;

    setLoading(true);
    try {
      const [prRes, poRes, vendorRes] = await Promise.all([
        axios.get("http://localhost:8081/api/pr/all", config),
        axios.get("http://localhost:8081/api/po/all", config),
        axios.get("http://localhost:8081/api/vendor/all", config) // Fetch vendors
      ]);

      const prData = prRes.data || [];
      const poData = poRes.data || [];
      const vendorData = vendorRes.data || [];

      setPrs(prData);
      setPos(poData);
      setVendors(vendorData); // Set vendors state

      setStats({
        totalPRs: prData.length,
        pendingPRs: prData.filter(pr => pr.status === 'PENDING').length,
        activePOs: poData.filter(po => po.status !== 'DELIVERED').length,
        vendors: vendorData.length
      });

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if(err.response?.status === 403) {
        setError("Access Denied. You do not have permission.");
      } else {
        setError("Failed to load data from backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEditInitiate = (pr) => {
    setEditingId(pr.id); 
    setSelectedVendorId(pr.vendor?.id || ""); // Set selected vendor if available
    setNewPR({
      description: pr.description || "",
      itemName: pr.items?.[0]?.itemName || "",
      quantity: pr.items?.[0]?.quantity || "",
      unitPrice: pr.items?.[0]?.unitPrice || "" // Use unitPrice from PR item
    });
    setShowCreateModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPR(prev => ({...prev, [name]: value}));
  };

  const handleVendorChange = (e) => {
      setSelectedVendorId(e.target.value);
  };

  const calculateEstimatedInvestment = () => {
    const qty = parseFloat(newPR.quantity);
    const unitPrice = parseFloat(newPR.unitPrice);
    if (!isNaN(qty) && !isNaN(unitPrice) && qty > 0 && unitPrice > 0) {
      return (qty * unitPrice).toLocaleString();
    }
    return "0";
  };

  /**
   * Method: handleCreatePR
   * Working: Sends a POST request to create a new PR with nested items.
   */
  const handleCreatePR = async (e) => {
    if (e) e.preventDefault();
    const config = getAuthConfig();
    if (!config) return;

    const qty = parseInt(newPR.quantity);
    const unitPrice = parseFloat(newPR.unitPrice); 
    const totalCalculated = qty * unitPrice; 

    if (qty <= 0 || unitPrice <= 0) {
      alert("Quantity and Unit Price must be greater than zero!");
      return;
    }
    if (!selectedVendorId) {
        alert("Please select a vendor.");
        return;
    }

    try {
      const payload = {
        description: newPR.description,
        status: "PENDING",
        estimatedTotalCost: totalCalculated, 
        vendor: { id: selectedVendorId }, // Associate selected vendor
        items: [
          {
            itemName: newPR.itemName,
            quantity: qty,
            unitPrice: unitPrice,
            description: newPR.description // Use main description for item
          }
        ]
      };

      const response = await axios.post("http://localhost:8081/api/pr/create", payload, config);

      if (response.status === 200 || response.status === 201) {
        alert(`PR created successfully! Total: ₹${totalCalculated}`);
        closeModal();
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Backend Error:", err.response?.data || err.message);
      alert("Failed to create PR. Check console for details.");
    }
  };

  /**
   * Method: handleUpdatePR
   * Working: Sends a PUT request to update existing PR and its items.
   */
  const handleUpdatePR = async (e) => {
    if (e) e.preventDefault();
    const config = getAuthConfig();
    
    const qty = parseInt(newPR.quantity);
    const unitPrice = parseFloat(newPR.unitPrice);
    const totalCalculated = qty * unitPrice;

    if (qty <= 0 || unitPrice <= 0) {
        alert("Quantity and Unit Price must be greater than zero!");
        return;
    }
    if (!selectedVendorId) {
        alert("Please select a vendor.");
        return;
    }

    try {
      const payload = {
        description: newPR.description,
        estimatedTotalCost: totalCalculated, 
        vendor: { id: selectedVendorId }, // Update associated vendor
        items: [
          {
            // For simplicity, we are assuming only one item is updated from modal
            // In a multi-item PR, you'd need to iterate or manage IDs
            itemName: newPR.itemName,
            quantity: qty,
            unitPrice: unitPrice,
            description: newPR.description
          }
        ]
      };

      const response = await axios.put(`http://localhost:8081/api/pr/update/${editingId}`, payload, config);
      
      if (response.status === 200) {
        alert(`PR Updated Successfully! Total: ₹${totalCalculated}`);
        closeModal();
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Full Update Error:", err.response?.data || err.message);
      alert("Update Failed! Check console and Backend Controller.");
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingId(null);
    setSelectedVendorId(""); // Reset vendor selection
    setNewPR({ itemName: "", quantity: "", unitPrice: "", description: "" });
  };

 /**
 * Method: generatePDF
 * Working: 
 * 1. Yeh check karta hai ki data 'po' ke andar kahan chhupa hai.
 * 2. Agar purchaseRequest nested hai toh wahan se, warna direct PO se data leta hai. [cite: 2026-01-06]
 */
const generatePDF = (po) => {
    const doc = new jsPDF();
    
    // --- SAFE DATA EXTRACTION ---
    // Agar po.purchaseRequest hai toh wahan se lo, warna direct po se
    const pr = po.purchaseRequest || {};
    const vendor = po.vendor || pr.vendor || {}; 
    const item = (pr.items && pr.items[0]) || (po.items && po.items[0]) || {};
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString();

    doc.setFontSize(18);
    doc.text("PURCHASE ORDER", 105, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`PO Number: PO-CONF-${po.id || 'N/A'}`, 14, 25);
    doc.text(`Date: ${formattedDate}`, 14, 30);

    autoTable(doc, {
        startY: 40,
        head: [['Field', 'Details']],
        body: [
            ["PO ID", po.id || 'N/A'],
            ["PR Reference", pr.id ? `PR-${pr.id}` : 'N/A'],
            ["Total Amount", `INR ${po.totalAmount || '0'}`],
            ["Status", po.status || 'N/A'],
            ["---", "---"],
            ["Item", item.itemName || 'N/A'],
            ["Qty", item.quantity || '0'],
            ["Unit Price", `INR ${item.unitPrice || '0'}`],
            ["---", "---"],
            ["Vendor", vendor.companyName || 'N/A'],
            ["Contact Person", vendor.username || 'N/A'],
            ["Email", vendor.email || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] }
    });

    doc.save(`PO_${po.id}.pdf`);
};

  // --- RENDERERS ---

  const renderOverview = () => (
    <div style={styles.gridContainer}>
      <div style={styles.actionCard}>
        <h3 style={styles.cardTitle}>🚀 Quick Action</h3>
        <p style={styles.cardText}>Need to procure new items?</p>
        <button style={styles.createButton} onClick={() => { setEditingId(null); setSelectedVendorId(""); setShowCreateModal(true); }}>
          + Create New PR
        </button>
      </div>
      <div style={styles.statCard}>
        <span style={styles.icon}>📝</span>
        <h3>{stats.totalPRs}</h3>
        <p>Total PRs Created</p>
      </div>
      <div style={styles.statCard}>
        <span style={styles.icon}>⏳</span>
        <h3>{stats.pendingPRs}</h3>
        <p>Pending Approval</p>
      </div>
      <div style={styles.statCard}>
        <span style={styles.icon}>📦</span>
        <h3>{stats.activePOs}</h3>
        <p>Active POs</p>
      </div>
      <div style={styles.statCard}>
        <span style={styles.icon}>🤝</span>
        <h3>{stats.vendors}</h3>
        <p>Vendors Assigned</p>
      </div>
    </div>
  );

  const renderPRs = () => (
    <div style={styles.tableContainer}>
      <div style={styles.headerRow}>
        <h2>Purchase Requests (PR)</h2>
        <button style={styles.smallButton} onClick={() => { setEditingId(null); setSelectedVendorId(""); setShowCreateModal(true); }}>+ New PR</button>
      </div>
      {prs.length === 0 ? <p>No PRs found.</p> : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHead}>
              <th style={styles.th}>PR ID</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Items Name</th>
              <th style={styles.th}>Vendor</th> {/* Display Vendor */}
              <th style={styles.th}>Total Cost</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prs.map((pr) => {
              const isApproved = pr.status?.toUpperCase() === "APPROVED";
              const isPending = !pr.status || pr.status.toUpperCase() === "PENDING";
              return (
                <tr key={pr.id} style={styles.tr}>
                  <td style={styles.td}><b>PR-{pr.id}</b></td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '500', color: '#1e293b' }}>{pr.description || "No Description Provided"}</span>
                  </td>
                  <td style={styles.td}>
                    {pr.items && pr.items.length > 0 ? (
                      <span style={{ color: '#475569', fontSize: '13px' }}>
                        {pr.items[0].itemName || "Unnamed Item"}
                        {pr.items.length > 1 && <span style={{ color: '#3b82f6', fontWeight: 'bold' }}> (+{pr.items.length - 1})</span>}
                      </span>
                    ) : ( <span style={{ color: '#94a3b8' }}>No Items</span> )}
                  </td>
                  <td style={styles.td}>{pr.vendor?.companyName || pr.vendor?.username || "N/A"}</td> {/* Display Vendor */}
                  <td style={styles.td}>
                    <b style={{ color: '#0f172a' }}>₹ {pr.estimatedTotalCost ? pr.estimatedTotalCost.toLocaleString() : "0.00"}</b>
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(pr.status)}>{pr.status ? pr.status.toUpperCase() : "PENDING"}</span>
                  </td>
                  <td style={styles.td}>
                    {isPending ? (
                      <button style={styles.editBtn} onClick={() => handleEditInitiate(pr)}>Edit</button>
                    ) : (
                      <span style={styles.disabledText}>{isApproved ? "✅ PO Generated" : "🚫 Locked"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderPOs = () => (
    <div style={styles.tableContainer}>
      <h2 style={{marginBottom: '20px'}}>Purchase Orders (PO) - Read Only</h2>
      {pos.length === 0 ? <p>No Purchase Orders generated yet.</p> : (
      <table style={styles.table}>
        <thead>
          <tr style={styles.trHead}>
            <th style={styles.th}>PO ID</th>
            <th style={styles.th}>Ref PR</th>
            <th style={styles.th}>Vendor</th>
            <th style={styles.th}>Total Amount</th>
            <th style={styles.th}>Status</th>
            
          </tr>
        </thead>
        <tbody>
          {pos.map((po) => (
            <tr key={po.id} style={styles.tr}>
              <td style={styles.td}><b>{po.id}</b></td>
              <td style={styles.td}>{po.purchaseRequest?.id || "N/A"}</td> {/* Use purchaseRequest for PR ID */}
              <td style={styles.td}>{po.vendor?.companyName || po.vendor?.username || "N/A"}</td>
              <td style={styles.td}>₹{po.totalAmount ? po.totalAmount.toLocaleString() : "0.00"}</td>
              <td style={styles.td}>
                <span style={getPOStatusStyle(po.status)}>{po.status}</span>
              </td>
              <td style={styles.td}>
<button 
  style={styles.downloadBtn} 
  onClick={() => generatePDF(po)} // Yahan 'po' pura object hona chahiye
>
  ⬇ PDF
</button>                
              </td>
            </tr>
          ))}
        </tbody>  
      </table>
      )}
    </div>  
  );

/**
 * Method: renderVendors
 * Working: 
 * 1. Vendors list ko map karta hai cards format mein.
 * 2. Status Logic: Backend se agar 'status' true hai toh Active dikhayega, warna Inactive.
 * 3. View Details: Click karne par selectedVendor state update karega popup ke liye.
 */
/**
 * Method: renderVendors
 * Working: 
 * 1. Vendors ki grid display karta hai.
 * 2. View Details click karne par ek clean, modern modal open karta hai.
 * 3. Status color code aur typography ko clean rakha gaya hai. [cite: 2026-01-06]
 */
const renderVendors = () => (
    <div style={styles.vendorGrid}>
        {vendors.map(vendor => (
            <div key={vendor.id} style={styles.vendorCard}>
                <h3 style={{color: '#1e293b', marginBottom: '10px'}}>{vendor.companyName || "No Company Name"}</h3>
                <p style={{fontSize: '14px', color: '#64748b'}}><strong>Email:</strong> {vendor.email}</p>
                
                <button 
                    style={{...styles.viewDetailsBtn, marginTop: '15px'}} 
                    onClick={() => setSelectedVendor(vendor)}
                >
                    View Details
                </button>
            </div>
        ))}

        {/* MODERN ATTRACTIVE MODAL */}
        {selectedVendor && (
            <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                    <div style={styles.modalHeader}>
                        <h2 style={{margin: 0, fontSize: '20px'}}>Vendor Profile</h2>
                        <button 
                            onClick={() => setSelectedVendor(null)} 
                            style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8'}}
                        >
                            &times;
                        </button>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <div style={styles.detailRow}>
                            <label style={styles.label}>COMPANY NAME</label>
                            <span style={{fontSize: '16px', fontWeight: '500'}}>{selectedVendor.companyName || 'N/A'}</span>
                        </div>

                        <div style={styles.detailRow}>
                            <label style={styles.label}>OWNER / USERNAME</label>
                            <span style={{fontSize: '16px'}}>{selectedVendor.username}</span>
                        </div>

                        <div style={styles.detailRow}>
                            <label style={styles.label}>EMAIL ADDRESS</label>
                            <span style={{fontSize: '16px'}}>{selectedVendor.email}</span>
                        </div>

                        <div style={styles.detailRow}>
                            <label style={styles.label}>CONTACT NUMBER</label>
                            <span style={{fontSize: '16px'}}>{selectedVendor.mobileNo}</span>
                        </div>

                        <div style={styles.detailRow}>
                            <label style={styles.label}>OFFICE ADDRESS</label>
                            <span style={{fontSize: '16px'}}>{selectedVendor.address || 'Bhopal M.P. India'}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedVendor(null)} 
                        style={{
                            ...styles.submitBtn, 
                            background: '#1e293b', 
                            marginTop: '10px',
                            width: '100%'
                        }}
                    >
                        Close Details
                    </button>
                </div>
            </div>
        )}
    </div>
);
  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Dashboard Data...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.brand}>SPVMS <span style={styles.roleBadge}>Procurement</span></div>
        <nav style={styles.nav}>
          <button style={activeTab === 'overview' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('overview')}>📊 Dashboard</button>
          <button style={activeTab === 'prs' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('prs')}>📝 My PRs</button>
          <button style={activeTab === 'pos' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('pos')}>📦 Purchase Orders</button>
          <button style={activeTab === 'vendors' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('vendors')}>🤝 Vendors</button>
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.main}>
        <header style={styles.topBar}>
          <h2 style={styles.pageTitle}>
            {activeTab === 'overview' && 'Overview'}
            {activeTab === 'prs' && 'Purchase Request Management'}
            {activeTab === 'pos' && 'Purchase Order Tracking'}
            {activeTab === 'vendors' && 'Vendor Directory'}
          </h2>
          <div style={styles.profile}>👤 Procurement Officer</div>
        </header>

        <div style={styles.content}>
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'prs' && renderPRs()}
          {activeTab === 'pos' && renderPOs()}
          {activeTab === 'vendors' && renderVendors()}
        </div>
      </div>

      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{color: '#1e293b'}}>
              {editingId ? "Update Purchase Request" : "Create Purchase Request"}
            </h2>
            <form onSubmit={editingId ? handleUpdatePR : handleCreatePR} style={styles.form}>
                {/* --- NEW VENDOR SELECTION --- */}
                <label style={styles.label}>Select Vendor</label>
                <select 
                    name="vendorId" 
                    value={selectedVendorId} 
                    onChange={handleVendorChange} 
                    style={styles.input} 
                    required
                >
                    <option value="">-- Choose a Vendor --</option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
        {vendor.companyName && vendor.username 
            ? `${vendor.companyName} (${vendor.username})` 
            : (vendor.companyName || vendor.username)}
    </option>
                    ))}
                </select>

                <label style={styles.label}>Item Name</label>
                <input 
                    name="itemName" 
                    value={newPR.itemName} 
                    onChange={handleInputChange} 
                    type="text" 
                    style={styles.input} 
                    placeholder="e.g., Dell Latitude Laptop" 
                    required 
                />
                
                <label style={styles.label}>Description</label>
                <textarea 
                    name="description" 
                    value={newPR.description} 
                    onChange={handleInputChange} 
                    style={styles.textarea} 
                    placeholder="Purpose of this purchase..."
                ></textarea>

                {/* --- QUANTITY & UNIT PRICE INLINE --- */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Qty</label>
                        <input 
                            name="quantity" 
                            value={newPR.quantity} 
                            onChange={handleInputChange} 
                            type="number" 
                            style={styles.input} 
                            placeholder="1" 
                            required 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Unit Price (₹)</label>
                        <input 
                            name="unitPrice" // Changed name to unitPrice
                            value={newPR.unitPrice} 
                            onChange={handleInputChange} 
                            type="number" 
                            style={styles.input} 
                            placeholder="0" 
                            required 
                        />
                    </div>
                </div>

                {/* --- ESTIMATED INVESTMENT DISPLAY --- */}
                <div style={styles.estimatedInvestmentCard}>
                    <span style={{fontSize: '14px', color: '#475569'}}>Estimated Investment</span>
                    <b style={{fontSize: '24px', color: '#1e293b'}}>₹ {calculateEstimatedInvestment()}</b>
                </div>

                <div style={styles.modalActions}>
                    <button type="button" onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
                    <button type="submit" style={styles.submitBtn}>
                        {editingId ? "Update Request" : "Submit PR Request"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HELPER FUNCTIONS ---
const getStatusStyle = (status) => {
    const safeStatus = status ? status.toUpperCase() : 'PENDING';
    const base = { padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' };
    if (safeStatus === 'APPROVED') return { ...base, background: '#dcfce7', color: '#166534' };
    if (safeStatus === 'PENDING') return { ...base, background: '#fef9c3', color: '#854d0e' };
    if (safeStatus === 'REJECTED') return { ...base, background: '#fee2e2', color: '#991b1b' };
    return { ...base, background: '#f1f5f9', color: '#475569' };
};

const getPOStatusStyle = (status) => {
    const base = { padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '600' };
    if (status === 'SENT') return { ...base, background: '#e0f2fe', color: '#075985' };
    if (status === 'DELIVERED') return { ...base, background: '#d1fae5', color: '#065f46' };
    if (status === 'ACCEPTED') return { ...base, background: '#f3e8ff', color: '#6b21a8' };
    return base;
};

// --- STYLES (Additional for the new elements) ---
const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#f8fafc" },
  sidebar: { width: "260px", background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "20px" },
  brand: { fontSize: "24px", fontWeight: "bold", marginBottom: "40px", color: "#4ade80", display: 'flex', alignItems: 'center', gap: '10px' },
  roleBadge: { fontSize: "12px", background: "#334155", padding: "2px 8px", borderRadius: "4px", color: "#94a3b8", fontWeight: "normal" },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: "10px" },
  navItem: { background: "transparent", border: "none", color: "#cbd5e1", padding: "12px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", transition: "0.2s" },
  navItemActive: { background: "#334155", border: "none", color: "#fff", padding: "12px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", fontWeight: "bold" },
  logoutBtn: { padding: "12px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "auto" },
  
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topBar: { height: "70px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px" },
  pageTitle: { margin: 0, fontSize: "20px", color: "#1e293b" },
  profile: { color: "#64748b", fontWeight: "500" },
  
  content: { padding: "30px", overflowY: "auto", flex: 1 },
  
  // Dashboard Grid
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
  statCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" },
  actionCard: { background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" },
  cardTitle: { margin: "0 0 10px 0" },
  cardText: { fontSize: "14px", marginBottom: "15px", opacity: 0.9 },
  icon: { fontSize: "30px", display: "block", marginBottom: "10px" },
  
  // Tables
  tableContainer: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  trHead: { borderBottom: "2px solid #e2e8f0", textAlign: "left" },
  th: { padding: "15px", color: "#64748b", fontSize: "14px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "15px", color: "#334155", fontSize: "14px" },
  
  // Buttons
  createButton: { background: "#fff", color: "#2563eb", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" },
  smallButton: { background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  editBtn: { background: "#f59e0b", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  disabledText: { color: "#94a3b8", fontStyle: "italic", fontSize: "12px" },
  downloadBtn: { background: "#0f172a", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  assignBtn: { width: "100%", marginTop: "10px", padding: "8px", background: "#e2e8f0", border: "none", borderRadius: "6px", color: "#475569", cursor: "pointer", fontWeight: "600" },

  // Vendor Grid Upgrade
  vendorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" },
  vendorCard: { 
    background: "#fff", 
    border: "1px solid #e2e8f0", 
    borderRadius: "12px", 
    padding: "20px", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  viewDetailsBtn: { 
    marginTop: 'auto', 
    padding: '10px', 
    background: '#f1f5f9', 
    border: 'none', 
    borderRadius: '6px', 
    color: '#475569', 
    fontWeight: '600', 
    cursor: 'pointer',
    transition: '0.2s'
  },
  
  // Modal (Fixed for Detail Overlap)
 modalOverlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100vw", 
    height: "100vh", 
    background: "rgba(15, 23, 42, 0.8)", // Dark solid semi-transparent
    backdropFilter: 'blur(8px)', 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 9999, // Super high z-index to stay on top
    margin: 0,
    padding: 0
  },
 modal: { 
    background: "#ffffff", // Pure solid white
    padding: "30px", 
    borderRadius: "16px", 
    width: "480px", 
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", 
    zIndex: 10000,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    color: '#1e293b' // Dark text for readability
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '15px',
    marginBottom: '10px'
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'left'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px'
  },
  form: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: '5px' },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", width: '100%', boxSizing: 'border-box' },
  textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px", width: '100%', boxSizing: 'border-box' },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
  cancelBtn: { padding: "10px 20px", background: "transparent", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: '16px' },
  submitBtn: { padding: "10px 20px", background: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: '16px', fontWeight: 'bold' },

  estimatedInvestmentCard: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '15px 20px',
    textAlign: 'center',
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  }
};