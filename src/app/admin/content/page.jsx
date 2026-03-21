import React from 'react';
import AdminLayout from '../layout';
import { Database, Search, Plus, Filter, Edit3, Trash2, Eye, Globe, Lock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';

const ContentManagement = () => {
    const items = [
        { id: 1, title: 'Professional Tech Template', type: 'Template', status: 'Published', author: 'Admin', date: 'Mar 10' },
        { id: 2, title: 'Interview Question Bank v2', type: 'Resource', status: 'Draft', author: 'Moderator', date: 'Mar 15' },
        { id: 3, title: 'Default Cover Letter', type: 'Template', status: 'Hidden', author: 'Admin', date: 'Jan 22' },
        { id: 4, title: 'Premium Layout A', type: 'Template', status: 'Published', author: 'Admin', date: 'Mar 20' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Control</h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Manage templates and system resources</p>
                    </div>
                    <Button className="font-black shadow-lg shadow-orange-500/20" leftIcon={<Plus size={18} />}>
                        Upload New Asset
                    </Button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input className="w-full bg-white border-slate-200 rounded-xl h-10 pl-10 pr-4 text-xs font-black focus:ring-2 focus:ring-orange-100" placeholder="Search content..." />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" className="bg-white font-black text-xs uppercase" leftIcon={<Filter size={14} />}>Filter</Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="py-6 px-8">Content Item</th>
                                    <th className="py-6 px-8">Type</th>
                                    <th className="py-6 px-8">Status</th>
                                    <th className="py-6 px-8">Last Edit</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-6 px-8 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[var(--primary)]">
                                                <Database size={16} />
                                            </div>
                                            <span className="text-sm text-slate-900">{item.title}</span>
                                        </td>
                                        <td className="py-6 px-8 text-xs text-slate-500 uppercase tracking-tighter">{item.type}</td>
                                        <td className="py-6 px-8">
                                            <Badge variant={item.status === 'Published' ? 'success' : item.status === 'Draft' ? 'warning' : 'secondary'}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="py-6 px-8 text-xs text-slate-400">By {item.author} • {item.date}</td>
                                        <td className="py-6 px-8">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900"><Eye size={14} /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500"><Edit3 size={14} /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500"><Trash2 size={14} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <Globe className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                        <h4 className="text-xl font-black mb-2 tracking-tight">Public Presence</h4>
                        <p className="text-slate-400 text-sm font-bold mb-6">Manage how your content looks to visitors and search engines.</p>
                        <Button className="bg-[var(--primary)] border-none text-white rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest">Update Landing Settings</Button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <Lock className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 group-hover:-rotate-12 transition-transform duration-700" />
                        <h4 className="text-xl font-black mb-2 tracking-tight text-slate-900">Protected Assets</h4>
                        <p className="text-slate-500 text-sm font-bold mb-6">Set permissions for premium templates and AI resources.</p>
                        <Button variant="secondary" className="border-slate-200 rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest text-slate-900">Access Control</Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentManagement;
