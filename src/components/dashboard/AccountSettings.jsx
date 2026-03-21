import React from 'react';
import { Settings, Shield, Bell, Trash2, Mail, ExternalLink, Key } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useState } from 'react';

const AccountSettings = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const settingsGroups = [
        {
            title: 'Security',
            icon: <Shield size={18} className="text-blue-500" />,
            items: [
                { label: 'Change Password', description: 'Last changed 3 months ago', action: 'Change' },
                { label: 'Two-Factor Authentication', description: 'Secure your account with 2FA', action: 'Enable', badge: 'Recommended' },
            ]
        },
        {
            title: 'Notifications',
            icon: <Bell size={18} className="text-orange-500" />,
            items: [
                { label: 'Email Notifications', description: 'Be the first to know about updates', toggle: true },
                { label: 'Marketing Emails', description: 'Weekly tips and career advice', toggle: false },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
                <p className="text-slate-500 font-medium">Manage your security preferences and notifications.</p>
            </div>

            <div className="space-y-6">
                {settingsGroups.map((group, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                            {group.icon}
                            <h3 className="font-bold text-slate-900">{group.title}</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {group.items.map((item, j) => (
                                <div key={j} className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900">{item.label}</p>
                                            {item.badge && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">{item.badge}</span>}
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium mt-0.5">{item.description}</p>
                                    </div>
                                    {item.action ? (
                                        <Button variant="secondary" size="sm" className="font-bold border-slate-200">{item.action}</Button>
                                    ) : (
                                        <div className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ${item.toggle ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${item.toggle ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="bg-red-50 rounded-3xl border border-red-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-red-900 flex items-center gap-2">
                            <Trash2 size={18} /> Danger Zone
                        </p>
                        <p className="text-sm text-red-700/70 font-medium mt-1">Permanently delete your account and all associated data.</p>
                    </div>
                    <Button variant="danger" className="font-bold rounded-2xl px-6" onClick={() => setIsDeleteModalOpen(true)}>
                        Delete Plan
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button 
                            variant="danger" 
                            className="flex-1" 
                            disabled={deleteConfirmText !== 'DELETE'}
                        >
                            Confirm Delete
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-slate-600 font-medium leading-relaxed">
                        This action <span className="font-bold text-slate-900">cannot be undone</span>. This will permanently delete your account and remove all data from our servers.
                    </p>
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                        <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">Verification Required</p>
                        <Input 
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type 'DELETE' to confirm"
                            className="bg-white border-orange-200 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountSettings;
