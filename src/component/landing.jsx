


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthService from "../services/authService";

// export default function App() {
//   const [credentials, setCredentials] = useState({ username: "", password: "" }); // Fixed: Use username to match backend
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // FIX: Page load par session clear karna (As per your working Login.js)
//   useEffect(() => {
//     AuthService.logout();
//   }, []);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   /**
//    * Method: handleLogin
//    * Logic: Credentials verify karke role-based redirect karta hai.
//    */
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // FIX: credentials.username pass kiya taaki backend ko null na mile
//       const user = await AuthService.login(credentials.username, credentials.password);
//       console.log("User data from backend:", user);

//       // Role check based on your working backend response
//       const userRole = user.role;

//       if (userRole === "ROLE_ADMIN") {
//         navigate("/admin-dashboard");
//       } else if (userRole === "ROLE_VENDOR") {
//         navigate("/vendor-portal");
//       } else if (userRole === "ROLE_FINANCE") {
//         navigate("/finance-reporting");
//       } else {
//         // Fallback redirection
//         console.warn("Unknown role:", userRole);
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Invalid Username or Password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* LEFT SECTION – BRANDING & VISION */}
//       <div style={styles.left}>
//         <div style={styles.brandingContent}>
//           <h1 style={styles.title}>SPVMS</h1>
//           <p style={styles.subtitle}>
//             Smart Procurement & Vendor Management System
//           </p>
//           <div style={styles.divider}></div>
//           <ul style={styles.features}>
//             <li style={styles.featureItem}>🚀 <b>Automated Workflows:</b> Streamline PR to PO process.</li>
//             <li style={styles.featureItem}>🤝 <b>Vendor Portal:</b> Real-time collaboration with suppliers.</li>
//             <li style={styles.featureItem}>📊 <b>Smart Analytics:</b> Track spending and delivery efficiency.</li>
//             <li style={styles.featureItem}>🛡️ <b>Secure & Audited:</b> Enterprise-grade role-based security.</li>
//           </ul>
//         </div>
//         <p style={styles.footerText}>© 2026 SPVMS Enterprise Solutions</p>
//       </div>

//       {/* RIGHT SECTION – SECURE ACCESS */}
//       <div style={styles.right}>
//         <div style={styles.card}>
//           <h2 style={styles.loginTitle}>Welcome Back</h2>
//           <p style={styles.loginSubtitle}>Please enter your credentials</p>

//           {error && <div style={styles.errorBox}>{error}</div>}

//           <form onSubmit={handleLogin}>
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>Username</label>
//               <input
//                 type="text"
//                 name="username" // Fixed: Match with state key
//                 placeholder="Enter your username"
//                 value={credentials.username}
//                 onChange={handleChange}
//                 required
//                 style={styles.input}
//               />
//             </div>

//             <div style={styles.inputGroup}>
//               <label style={styles.label}>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="••••••••"
//                 value={credentials.password}
//                 onChange={handleChange}
//                 required
//                 style={styles.input}
//               />
//             </div>

//             <button 
//               type="submit" 
//               disabled={loading} 
//               style={{...styles.button, backgroundColor: loading ? "#86efac" : "#22c55e"}}
//             >
//               {loading ? "Authenticating..." : "Sign In"}
//             </button>
//           </form>

//           <div style={styles.extraLinks}>
//             <span style={styles.forgot}>Forgot Password?</span>
        
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- STYLES (NO CHANGES MADE TO YOUR UI) ---
// const styles = {
//   page: { display: "flex", height: "100vh", width: "100vw", fontFamily: "'Segoe UI', Roboto, sans-serif", overflow: "hidden" },
//   left: { flex: 1.2, background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
//   brandingContent: { marginTop: "40px" },
//   title: { fontSize: "64px", fontWeight: "800", letterSpacing: "-2px", margin: 0, color: "#4ade80" },
//   subtitle: { fontSize: "20px", marginTop: "10px", color: "#94a3b8" },
//   divider: { width: "60px", height: "4px", background: "#4ade80", margin: "30px 0" },
//   features: { listStyle: "none", padding: 0, marginTop: "40px" },
//   featureItem: { fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", color: "#cbd5e1" },
//   right: { flex: 1, background: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center" },
//   card: { width: "100%", maxWidth: "400px", padding: "50px", background: "#ffffff", borderRadius: "20px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
//   loginTitle: { fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "5px", textAlign: "center" },
//   loginSubtitle: { fontSize: "14px", color: "#64748b", textAlign: "center", marginBottom: "30px" },
//   inputGroup: { marginBottom: "20px" },
//   label: { display: "block", fontSize: "14px", fontWeight: "600", color: "#475569", marginBottom: "8px" },
//   input: { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "15px", boxSizing: "border-box", outline: "none", transition: "border 0.2s" },
//   button: { width: "100%", padding: "14px", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "transform 0.1s, background 0.2s", marginTop: "10px" },
//   errorBox: { background: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px", textAlign: "center", border: "1px solid #fee2e2" },
//   extraLinks: { display: "flex", justifyContent: "space-between", marginTop: "25px", fontSize: "13px", color: "#64748b", fontWeight: "500" },
//   forgot: { cursor: "pointer" },
//   help: { cursor: "pointer" },
//   footerText: { fontSize: "12px", color: "#64748b" }
// };


import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link import kiya navigation ke liye
import AuthService from "../services/authService";

export default function App() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Working Logic: Initial cleanup
  useEffect(() => {
    AuthService.logout();
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  /**
   * Method: handleLogin
   * Working: Backend data mapping fix aur role-based redirection.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await AuthService.login(credentials.username, credentials.password);
      const userRole = user.role;

      if (userRole === "ROLE_ADMIN") {
        navigate("/admin-dashboard");
      } else if (userRole === "ROLE_VENDOR") {
        navigate("/vendor-portal");
      } else if (userRole === "ROLE_FINANCE") {
        navigate("/finance-reporting");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid Username or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* LEFT SECTION – BRANDING & VISION (Unchanged) */}
      <div style={styles.left}>
        <div style={styles.brandingContent}>
          <h1 style={styles.title}>SPVMS</h1>
          <p style={styles.subtitle}>
            Smart Procurement & Vendor Management System
          </p>
          <div style={styles.divider}></div>
          <ul style={styles.features}>
            <li style={styles.featureItem}>🚀 <b>Automated Workflows:</b> Streamline PR to PO process.</li>
            <li style={styles.featureItem}>🤝 <b>Vendor Portal:</b> Real-time collaboration with suppliers.</li>
            <li style={styles.featureItem}>📊 <b>Smart Analytics:</b> Track spending and delivery efficiency.</li>
            <li style={styles.featureItem}>🛡️ <b>Secure & Audited:</b> Enterprise-grade role-based security.</li>
          </ul>
        </div>
        <p style={styles.footerText}>© 2026 SPVMS Enterprise Solutions</p>
      </div>

      {/* RIGHT SECTION – SECURE ACCESS */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.loginTitle}>Welcome Back</h2>
          <p style={styles.loginSubtitle}>Please enter your credentials</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{...styles.button, backgroundColor: loading ? "#86efac" : "#22c55e"}}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* ADDED: Register option inside your existing extraLinks div */}
          <div style={styles.extraLinks}>
            <span style={styles.forgot}>Forgot Password?</span>
            <Link to="/register" style={styles.registerLink}>New User? Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- STYLES (Aapke exact styles + 1 new line for register link) ---
const styles = {
  page: { display: "flex", height: "100vh", width: "100vw", fontFamily: "'Segoe UI', Roboto, sans-serif", overflow: "hidden" },
  left: { flex: 1.2, background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  brandingContent: { marginTop: "40px" },
  title: { fontSize: "64px", fontWeight: "800", letterSpacing: "-2px", margin: 0, color: "#4ade80" },
  subtitle: { fontSize: "20px", marginTop: "10px", color: "#94a3b8" },
  divider: { width: "60px", height: "4px", background: "#4ade80", margin: "30px 0" },
  features: { listStyle: "none", padding: 0, marginTop: "40px" },
  featureItem: { fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", color: "#cbd5e1" },
  right: { flex: 1, background: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { width: "100%", maxWidth: "400px", padding: "50px", background: "#ffffff", borderRadius: "20px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
  loginTitle: { fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "5px", textAlign: "center" },
  loginSubtitle: { fontSize: "14px", color: "#64748b", textAlign: "center", marginBottom: "30px" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "14px", fontWeight: "600", color: "#475569", marginBottom: "8px" },
  input: { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "15px", boxSizing: "border-box", outline: "none", transition: "border 0.2s" },
  button: { width: "100%", padding: "14px", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "transform 0.1s, background 0.2s", marginTop: "10px" },
  errorBox: { background: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px", textAlign: "center", border: "1px solid #fee2e2" },
  extraLinks: { display: "flex", justifyContent: "space-between", marginTop: "25px", fontSize: "13px", color: "#64748b", fontWeight: "500" },
  forgot: { cursor: "pointer" },
  // Adding only this style for the link
  registerLink: { color: "#22c55e", textDecoration: "none", fontWeight: "700", cursor: "pointer" },
  footerText: { fontSize: "12px", color: "#64748b" }
};