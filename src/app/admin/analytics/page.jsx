import React from 'react';
import AdminLayout from '../layout';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Download, Calendar, Filter } from 'lucide-react';
import Button from '../../../components/ui/Button';

const data = [
    { name: 'Mon', active: 1400, new: 240 },
    { name: 'Tue', active: 2210, new: 139 },
    { name: 'Wed', active: 2290, new: 980 },
    { name: 'Thu', active: 2000, new: 390 },
    { name: 'Fri', active: 2181, new: 480 },
    { name: 'Sat', active: 2500, new: 380 },
    { name: 'Sun', active: 2100, new: 430 },
];

const roleData = [
    { name: 'Free Users', value: 400, color: '#94a3b8' },
    { name: 'Pro Users', value: 300, color: '#f97316' },
    { name: 'Enterprise', value: 100, color: '#0ea5e9' },
];

const AnalyticsPage = () => {
    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center sm:text-left">Deep Analytics</h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1 text-center sm:text-left">Usage patterns and distribution</p>
                    </div>
                    <Button variant="secondary" className="font-black bg-white" leftIcon={<Download size={16} />}>
                        Export Detailed PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Bar Chart */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 px-2 tracking-tight">Daily Active vs New</h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: '800' }} />
                                    <Bar dataKey="active" fill="#f97316" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="new" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Role Distribution Pie Chart */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 px-2 tracking-tight">User Distribution</h3>
                        <div className="h-[350px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-black text-slate-900">800K</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase">Total Items</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Breakdown */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Usage Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="pb-4">Category</th>
                                    <th className="pb-4">Hits</th>
                                    <th className="pb-4">Growth</th>
                                    <th className="pb-4 text-right">Avg Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold">
                                {[
                                    { cat: 'Resume Builder', hits: '1.2M', growth: '+15%', time: '8.4m' },
                                    { cat: 'Interview Simulator', hits: '450K', growth: '+42%', time: '12.1m' },
                                    { cat: 'ATS Checker', hits: '890K', growth: '+8%', time: '1.5m' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 text-slate-900">{row.cat}</td>
                                        <td className="py-4 text-slate-500">{row.hits}</td>
                                        <td className="py-4 text-emerald-600">{row.growth}</td>
                                        <td className="py-4 text-right text-slate-500">{row.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AnalyticsPage;
