



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, AreaChart, Area 
} from 'recharts';
import axios from 'axios';

/**
 * METHODS EXPLANATION:
 * 1. fetchDashboardData: Analytics API se stats aur reports fetch karta hai.
 * 2. Navigation Logic: useNavigate hook ka use karke cards ko specific routes (/vendors, /purchase-orders) se link kiya hai.
 * 3. Key Mapping Fix: Backend se aane wale data ki keys (snake_case vs camelCase) ko handle kiya gaya hai.
 */

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalVendors: 0,
        activePOs: 0,
        pendingPRs: 0,
        spendingReport: [],
        vendorReport: [],
        fulfillmentRate: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem("user")); 
            const token = storedUser?.token;

            if (!token) {
                navigate("/login");
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch main dashboard summary
            const response = await axios.get("http://localhost:8081/api/reports/dashboard-summary", config);
            
            // Fetch all PRs to get accurate pending count
            const prResponse = await axios.get("http://localhost:8081/api/pr/all", config);
            const pendingCount = prResponse.data.filter(pr => pr.status === "PENDING").length;
            
            // Debugging ke liye console zaroor check karein ki data kis format mein aa raha hai
            console.log("Vendor Data Received:", response.data.vendorReport);
            console.log("Pending PRs Count:", pendingCount);

            setStats({
                totalVendors: response.data.totalVendors || 0,
                activePOs: response.data.activePOs || 0,
                pendingPRs: pendingCount,
                spendingReport: response.data.spendingReport || [],
                vendorReport: response.data.vendorReport || [],
                fulfillmentRate: response.data.fulfillmentRate || []
            });
            
            setLoading(false);
        } catch (error) {
            console.error("Dashboard Data Error:", error);
            setLoading(false);
        }
    };

    const formatCurrency = (num) => "₹" + new Intl.NumberFormat('en-IN').format(num);

    if (loading) return <div style={loaderStyle}>Loading Dashboard...</div>;

    return (
        <div style={containerStyle}>
            {/* --- Top Header --- */}
            <header style={headerStyle}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c' }}>Strategic Procurement & Vendor Analytics Dashboard</h1>
                    <p style={{ margin: 0, color: '#718096' }}>Welcome back, Admin</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    
                </div>
            </header>

            {/* --- 1. Widgets Section (Stats) --- */}
            <div style={grid4Style}>
                <StatCard 
                    title="Total Vendors" 
                    value={stats.totalVendors} 
                    icon="🏢" 
                    color="#4C51BF" 
                    onClick={() => navigate('/admin-vendors')} 
                />
                <StatCard 
                    title="Active POs" 
                    value={stats.activePOs} 
                    icon="📦" 
                    color="#38A169" 
                    onClick={() => navigate('/purchase-orders')} 
                />
                <StatCard 
                    title="Pending PRs" 
                    value={stats.pendingPRs} 
                    icon="⏳" 
                    color="#E53E3E" 
                    onClick={() => navigate('/dashboard')} 
                />
                
                <div style={{ ...cardStyle, borderTop: `4px solid #D69E2E` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <p style={{ color: '#718096', fontSize: '14px', fontWeight: '600', margin: 0 }}>Fulfillment Rate</p>
                        <span style={{ fontSize: '20px' }}>✅</span>
                    </div>
                    <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                        {stats.fulfillmentRate.length > 0 ? (
                            stats.fulfillmentRate.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '2px 0' }}>
                                    <span style={{ color: '#4A5568' }}>{item.itemName}</span>
                                    <span style={{ fontWeight: 'bold' }}>{item.fulfillmentRate}</span>
                                </div>
                            ))
                        ) : <p style={{ fontSize: '12px', color: '#A0AEC0' }}>No Data</p>}
                    </div>
                </div>
            </div>

            {/* --- 2. Charts & Tables Section --- */}
            <div style={mainGridStyle}>
                <div style={{ ...cardStyle, height: '350px' }}>
                    <h3 style={cardTitle}>Monthly Spending Analysis</h3>
                    <div style={{ height: '280px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.spendingReport}>
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4C51BF" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4C51BF" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="amount" stroke="#4C51BF" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- Top Vendor Performance (FIXED MAPPING) --- */}
                <div style={cardStyle}>
                    <h3 style={cardTitle}>Top Vendor Performance</h3>
                    <div style={listContainer}>
                        {stats.vendorReport && stats.vendorReport.length > 0 ? (
                            stats.vendorReport.slice(0, 5).map((vendor, index) => (
                                <div key={index} style={listItemStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={rankBadge}>{index + 1}</div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{vendor.vendorName}</div>
                                            <div style={{ fontSize: '11px', color: '#718096' }}>Avg. Delivery: {vendor.avgDeliveryDays} days</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#4C51BF', fontWeight: 'bold' }}>{vendor.totalOrders} Orders</div>
                                        {vendor.damagedIncidents > 0 && (
                                            <div style={{ fontSize: '10px', color: '#E53E3E' }}>⚠️ {vendor.damagedIncidents} Damaged</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#A0AEC0' }}>No Performance Data</div>
                        )}
                    </div>
                    <button style={viewAllBtn} onClick={() => navigate('/admin-vendors')}>View Detailed Analytics</button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
        onClick={onClick}
        style={{ 
            ...cardStyle, 
            borderTop: `4px solid ${color}`, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'transform 0.2s ease', 
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div>
            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>{title}</p>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#2D3748' }}>{value}</h2>
        </div>
        <div style={{ fontSize: '30px', opacity: 0.8 }}>{icon}</div>
    </div>
);

// --- CSS-in-JS Styles ---
const containerStyle = { padding: '30px', backgroundColor: '#F7FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const grid4Style = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' };
const mainGridStyle = { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' };
const cardStyle = { backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' };
const cardTitle = { fontSize: '18px', color: '#2D3748', marginBottom: '20px', borderBottom: '1px solid #EDF2F7', paddingBottom: '10px' };
const listContainer = { marginBottom: '10px' };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F7FAFC' };
const rankBadge = { backgroundColor: '#EDF2F7', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', color: '#4A5568' };
const primaryBtn = { backgroundColor: '#4C51BF', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' };
const secondaryBtn = { backgroundColor: 'white', color: '#4C51BF', padding: '10px 20px', borderRadius: '8px', border: '1px solid #4C51BF', cursor: 'pointer', fontWeight: '600' };
const viewAllBtn = { width: '100%', marginTop: '20px', padding: '10px', background: 'none', border: '1px dashed #CBD5E0', borderRadius: '8px', cursor: 'pointer', color: '#4A5568' };
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#4C51BF' };
const tooltipStyle = { borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'white' };

export default Dashboard;