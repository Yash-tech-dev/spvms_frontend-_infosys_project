import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import AuthService from "./services/authService";
import PurchaseOrder from "./component/PurchaseOrder";
import Register from "./component/Register";
import UserProfile from "./component/UserProfile";
import VendorPortal from "./component/VendorPortal";
import Dashboard1 from "./component/Dashboard1";
import Vendors from "./component/Vendors";
import AddVendor from "./component/AddVendor";
import VendorDashboard from "./component/VendorDashboard";
import CreatePurchaseRequest from "./component/PurchaseRequest";
import ProcurementDashboard from "./component/ProcurementDashboard";
import LandingPage from "./component/landing.jsx";

function App() {
  const user = AuthService.getCurrentUser();
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private/Role-Based Routes */}
        <Route 
          path="/user-profile" 
          element={user ? <UserProfile /> : <Navigate to="/login" />} 
        />
        {/* Mapping the missing route */}
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/vendor-portal" element={<VendorPortal />} />{" "}
        {/* new Component */}
        <Route path="/finance-reporting" element={<Dashboard />} />
        {/* General dashboard route as backup */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirecting root to login */}
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchase-orders" element={<PurchaseOrder />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/dashboard1" element={<Dashboard1/>}/>
        <Route path="/admin-vendors" element={<Vendors/>}/>
        <Route path="/add-vendor" element={<AddVendor/>}/>
        <Route path="/vendor-dashboard" element={<VendorDashboard/>}/>
        <Route path="/create-pr" element={<CreatePurchaseRequest/>}/>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/procurement-dashboard" element={<ProcurementDashboard />} />
      
      </Routes>
    </Router>
  );
}

export default App;
