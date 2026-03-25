import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, ChevronRight, Activity, Zap, 
    ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal, Terminal,
    Users, Files, MessageSquare, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFiles: 0,
        totalChats: 0,
        totalReviews: 0,
        activeToday: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for charts
    const chartData = [
        { name: 'Mon', usage: 400 },
        { name: 'Tue', usage: 300 },
        { name: 'Wed', usage: 600 },
        { name: 'Thu', usage: 800 },
        { name: 'Fri', usage: 500 },
        { name: 'Sat', usage: 900 },
        { name: 'Sun', usage: 700 },
    ];

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                // In a real app, these would be RPCs or specialized admin endpoints
                const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: fileCount } = await supabase.from('documents').select('*', { count: 'exact', head: true });
                const { count: chatCount } = await supabase.from('chat_history').select('*', { count: 'exact', head: true });
                const { count: reviewCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });

                setStats({
                    totalUsers: userCount || 0,
                    totalFiles: fileCount || 0,
                    totalChats: chatCount || 0,
                    totalReviews: reviewCount || 0,
                    activeToday: Math.floor(userCount * 0.4 || 0)
                });

                // Fetch recent users
                const { data: userData } = await supabase
                    .from('documents')
                    .select('owner_id, name, created_at')
                    .order('created_at', { ascending: false })
                    .limit(10);
                
                setUsers(userData || []);
            } catch (err) {
                console.error("Admin fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, trend, color }) => (
        <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trend > 0 ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{value}</div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                        <Shield size={14} /> System Authority
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Takshila <span className="gradient-text">Admin Hub</span></h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '10px 20px', borderRadius: '100px', background: '#f1f5f9', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} /> Live Status: <span style={{ color: '#10b981' }}>Operational</span>
                    </div>
                </div>
            </header>

            {/* Main Stats */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend={12} color="#6366f1" />
                <StatCard title="Documents" value={stats.totalFiles} icon={Files} trend={24} color="#f05523" />
                <StatCard title="AI Reviews" value={stats.totalReviews} icon={Terminal} trend={15} color="#ff5c00" />
                <StatCard title="AI Chats" value={stats.totalChats} icon={MessageSquare} trend={8} color="#00BCD4" />
            </div>

            {/* Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                {/* Usage Chart */}
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>System Usage Trends</h2>
                        <select style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {users.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <Files size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px' }}>UPLOAD</div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-secondary" style={{ width: '100%', marginTop: '32px' }}>View Full Audit Log</button>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>User Management</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={14} color="#94a3b8" />
                            <input type="text" placeholder="Search citizens..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }} />
                        </div>
                        <button className="btn-secondary" style={{ padding: '8px 16px' }}><Filter size={16} /> Filter</button>
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ textAlign: 'left', padding: '16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>User Identity</th>
                            <th style={{ textAlign: 'left', padding: '16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Knowledge Base</th>
                            <th style={{ textAlign: 'left', padding: '16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Last Active</th>
                            <th style={{ textAlign: 'right', padding: '16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>AS</div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>User #{i}042</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>user_{i}@example.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: '#f0fdf4', padding: '4px 10px', borderRadius: '100px' }}>ACTIVE</span>
                                </td>
                                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#64748b' }}>{Math.floor(Math.random()*20)} docs</td>
                                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#64748b' }}>2 hours ago</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button style={{ border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}><MoreHorizontal size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
