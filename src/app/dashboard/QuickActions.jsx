import React from 'react';
import { Plus, BarChart3, Download, LifeBuoy, FilePlus, Search } from 'lucide-react';
import Button from '../../components/ui/Button';

const QuickActions = () => {
    const actions = [
        { label: 'Start New', icon: <FilePlus size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'View Reports', icon: <BarChart3 size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Download Data', icon: <Download size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Support', icon: <LifeBuoy size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {actions.map((action, i) => (
                <button
                    key={i}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-[var(--primary)] hover:shadow-xl hover:shadow-orange-100 transition-all duration-300"
                >
                    <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                        {action.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{action.label}</span>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
