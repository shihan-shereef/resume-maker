import React, { lazy, Suspense } from 'react';
import AdminLayout from './layout';
import { 
    Users, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    Activity, 
    Clock, 
    DollarSign,
    MoreHorizontal
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

// Lazy load chart for performance
const SignupChart = lazy(() => import('./SignupChart'));

const AdminOverview = () => {
    const kpis = [
        { label: 'Total Users', value: '45,231', trend: '+12.5%', isUp: true, icon: <Users size={20} className="text-blue-600" />, bg: 'bg-blue-50' },
        { label: 'Active Today', value: '3,842', trend: '+3.2%', isUp: true, icon: <Activity size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
        { label: 'System Revenue', value: '$12,840', trend: '-1.4%', isUp: false, icon: <DollarSign size={20} className="text-orange-600" />, bg: 'bg-orange-50' },
        { label: 'New Signups', value: '+428', trend: '+18.1%', isUp: true, icon: <TrendingUp size={20} className="text-purple-600" />, bg: 'bg-purple-50' },
    ];

    const recentActions = [
        { id: 1, user: 'John Doe', action: 'Created Resume', time: '2m ago', status: 'success' },
        { id: 2, user: 'Sarah Smith', action: 'Upgraded to Pro', time: '15m ago', status: 'success' },
        { id: 3, user: 'Mike Ross', action: 'Failed Payment', time: '1h ago', status: 'danger' },
        { id: 4, user: 'Jane Doe', action: 'New ATS Scan', time: '3h ago', status: 'success' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Live data from the last 24 hours</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="bg-white border-slate-200 font-bold" leftIcon={<Clock size={16} />}>
                            History
                        </Button>
                        <Button className="font-bold shadow-lg shadow-orange-500/20" leftIcon={<TrendingUp size={16} />}>
                            Download Report
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {kpis.map((kpi, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${kpi.bg}`}>{kpi.icon}</div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${kpi.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                    {kpi.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {kpi.trend}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400 mb-1">{kpi.label}</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Main Chart Section */}
                    <div className="xl:col-span-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">User Growth</h3>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button className="px-3 py-1 text-[10px] font-black bg-white rounded-lg shadow-sm">30 DAYS</button>
                                    <button className="px-3 py-1 text-[10px] font-black text-slate-400">90 DAYS</button>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <Suspense fallback={<Skeleton className="h-full w-full rounded-2xl" />}>
                                    <SignupChart />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="xl:col-span-4">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full font-bold">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                                <button className="text-[10px] text-orange-500 uppercase tracking-widest hover:underline">View All</button>
                            </div>
                            <div className="space-y-6">
                                {recentActions.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm text-slate-400">
                                            <Activity size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate">{item.user}</p>
                                            <p className="text-xs text-slate-500 mt-1 font-bold">{item.action}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.time}</p>
                                            <div className={`w-2 h-2 rounded-full ml-auto mt-2 bg-${item.status === 'success' ? 'emerald' : 'red'}-500`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOverview;
