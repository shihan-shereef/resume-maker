import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, FileText, Download, Trash2, Search, Filter } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const HistoryTable = () => {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('all');

    const activities = [
        { id: 1, date: 'Mar 21, 2024', action: 'Resume Updated', status: 'completed', type: 'resume' },
        { id: 2, date: 'Mar 20, 2024', action: 'ATS Analysis', status: 'completed', type: 'ats' },
        { id: 3, date: 'Mar 19, 2024', action: 'Interview Session', status: 'pending', type: 'interview' },
        { id: 4, date: 'Mar 18, 2024', action: 'Job Applied: Google', status: 'completed', type: 'job' },
        { id: 5, date: 'Mar 17, 2024', action: 'Cover Letter Generated', status: 'completed', type: 'resume' },
        { id: 6, date: 'Mar 16, 2024', action: 'Profile View', status: 'completed', type: 'system' },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        className="w-full bg-slate-50 border-none rounded-xl h-10 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                        placeholder="Search actions..."
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['all', 'resume', 'ats', 'job'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                                filter === f ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center w-16">Icon</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {activities.map((item) => (
                            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[var(--primary)] group-hover:bg-orange-50 transition-all">
                                        <FileText size={18} />
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-sm font-semibold text-slate-600">{item.date}</td>
                                <td className="py-4 px-4">
                                    <div className="text-sm font-bold text-slate-900">{item.action}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">{item.type}</div>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                            <Download size={14} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400">
                    Showing <span className="text-slate-900">1-6</span> of <span className="text-slate-900">24</span> activities
                </p>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="h-9 w-9 p-0" leftIcon={<ChevronLeft size={16} />} />
                    <Button variant="secondary" size="sm" className="h-9 w-9 p-0 font-bold">1</Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 font-bold text-slate-400">2</Button>
                    <Button variant="secondary" size="sm" className="h-9 w-9 p-0" leftIcon={<ChevronRight size={16} />} />
                </div>
            </div>
        </div>
    );
};

export default HistoryTable;
