import React from 'react';
import AdminLayout from '../layout';
import { Settings, Shield, Mail, Zap, Server, Globe, Bell, Fingerprint } from 'lucide-react';
import Button from '../../../components/ui/Button';

const AdminSettings = () => {
    const sections = [
        {
            title: 'System Configuration',
            icon: <Server size={20} className="text-blue-500" />,
            items: [
                { label: 'Maintenance Mode', desc: 'Immediately pause all user activities', toggle: false },
                { label: 'Cloud Backup', desc: 'Sync all databases every 6 hours', toggle: true },
                { label: 'API Rate Limiting', desc: 'Strict mode for abnormal traffic', toggle: true },
            ]
        },
        {
            title: 'Email Templates',
            icon: <Mail size={20} className="text-orange-500" />,
            items: [
                { label: 'Welcome Email', desc: 'Sent after successful registration', action: 'Edit' },
                { label: 'Subscription Success', desc: 'Sent after upgrade to PRO', action: 'Edit' },
                { label: 'Password Reset', desc: 'System security email', action: 'Edit' },
            ]
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Global environment & configuration</p>
                </div>

                <div className="space-y-10">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-2 mb-2 px-2">
                                {section.icon}
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{section.title}</h3>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                                <div className="divide-y divide-slate-100">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{item.label}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-tight">{item.desc}</p>
                                            </div>
                                            {item.action ? (
                                                <Button variant="secondary" size="sm" className="font-black text-[10px] uppercase tracking-widest px-4 border-slate-200">{item.action}</Button>
                                            ) : (
                                                <div className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 ${item.toggle ? 'bg-emerald-500' : 'bg-slate-200'} cursor-pointer`}>
                                                    <div className={`w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm ${item.toggle ? 'ml-5.5' : 'ml-0'}`} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col items-center text-center">
                        <Fingerprint className="w-16 h-16 text-slate-700 mb-6" />
                        <h4 className="text-2xl font-black mb-2">Internal Audit Log</h4>
                        <p className="text-slate-500 font-bold text-sm mb-8">View every administrative action taken across the entire system.</p>
                        <Button className="bg-[var(--primary)] border-none text-white rounded-2xl px-10 h-14 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-orange-500/20">Download Logs (.zip)</Button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 pt-10">
                        <span>System Version: 2.4.0-Stable</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> All systems operational</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
