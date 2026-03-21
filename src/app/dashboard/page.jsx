import React, { useState, useEffect } from 'react';
import DashboardLayout from './layout';
import ProfileSection from './ProfileSection';
import HistoryTable from './HistoryTable';
import QuickActions from './QuickActions';
import { TrendingUp, Activity, Clock, Award } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: 'Shihan Shereef',
        role: 'Pro Member',
        stats: {
            totalActions: 124,
            daysActive: 45,
            lastLogin: '2 hours ago'
        }
    });

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: 'Total Actions', value: userData.stats.totalActions, icon: <TrendingUp className="text-emerald-500" />, bg: 'bg-emerald-50' },
        { label: 'Days Active', value: userData.stats.daysActive, icon: <Activity className="text-blue-500" />, bg: 'bg-blue-50' },
        { label: 'Member Type', value: userData.role, icon: <Award className="text-orange-500" />, bg: 'bg-orange-50 shadow-sm border border-orange-100' },
        { label: 'Last Active', value: userData.stats.lastLogin, icon: <Clock className="text-purple-500" />, bg: 'bg-purple-50' },
    ];

    return (
        <DashboardLayout user={userData}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Good morning, {userData.name.split(' ')[0]} 👋
                    </h1>
                    <p className="mt-2 text-slate-500 font-medium">
                        Here's what's happening with your professional profile today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className={`p-6 rounded-2xl ${stat.bg} border border-white/50 backdrop-blur-sm transition-transform hover:scale-[1.02] duration-200`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Quick Actions & History */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full mr-2" />
                                Quick Actions
                            </h3>
                            <QuickActions />
                        </div>
                        
                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-2" />
                                Recent Activity
                            </h3>
                            <HistoryTable />
                        </div>
                    </div>

                    {/* Right Column: Profile & Settings */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-2" />
                                Personal Profile
                            </h3>
                            <ProfileSection user={userData} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
