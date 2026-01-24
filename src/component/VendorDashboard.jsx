import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from '../services/authService';

const VendorDashboard = () => {
    const [stats, setStats] = useState(null);
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get("http://localhost:8081/api/vendor/dashboard/stats", config);
                setStats(res.data);
            } catch (err) {
                console.error("Dashboard error", err);
            }
        };
        fetchStats();
    }, [user.token]);

    if (!stats) return <p>Loading Dashboard...</p>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50' }}>Welcome, {stats.companyName || stats.vendorName}</h2>
            <p>Vendor Portal - Performance Overview</p>

            {/* KPI Cards Section */}
            <div style={cardContainer}>
                <div style={{ ...cardStyle, borderLeft: '5px solid #3498db' }}>
                    <small>TOTAL ORDERS</small>
                    <h3>{stats.totalOrders}</h3>
                </div>
                <div style={{ ...cardStyle, borderLeft: '5px solid #f1c40f' }}>
                    <small>PENDING DELIVERY</small>
                    <h3>{stats.pendingDeliveries}</h3>
                </div>
                <div style={{ ...cardStyle, borderLeft: '5px solid #2ecc71' }}>
                    <small>COMPLETED</small>
                    <h3>{stats.completedOrders}</h3>
                </div>
                <div style={{ ...cardStyle, borderLeft: '5px solid #e67e22' }}>
                    <small>TOTAL EARNINGS</small>
                    <h3>₹{stats.totalEarnings.toLocaleString()}</h3>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4>Recent Purchase Orders</h4>
                <table width="100%" style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '10px' }}>PO Number</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Example Row - Real data will come from a list */}
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>PO-2026-001</td>
                            <td>15 Jan 2026</td>
                            <td>₹45,000</td>
                            <td><span style={statusBadge}>Shipped</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Styles ---
const cardContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const statusBadge = { backgroundColor: '#d1ecf1', color: '#0c5460', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };

export default VendorDashboard;