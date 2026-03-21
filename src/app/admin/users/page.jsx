import React, { useState } from 'react';
import AdminLayout from '../layout';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    UserPlus, 
    Mail, 
    Shield, 
    UserMinus, 
    CheckCircle2,
    ArrowUpDown,
    Download
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const users = [
        { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'active', joined: 'Jan 12, 2024' },
        { id: 2, name: 'Maria Garcia', email: 'maria@test.com', role: 'User', status: 'active', joined: 'Feb 02, 2024' },
        { id: 3, name: 'James Wilson', email: 'james.w@web.com', role: 'Moderator', status: 'suspended', joined: 'Mar 15, 2024' },
        { id: 4, name: 'Emma Davis', email: 'emma@design.com', role: 'User', status: 'pending', joined: 'Mar 20, 2024' },
        { id: 5, name: 'Robert Chen', email: 'robert@dev.io', role: 'User', status: 'active', joined: 'Mar 21, 2024' },
    ];

    const getRoleVariant = (role) => {
        switch (role.toLowerCase()) {
            case 'admin': return 'primary';
            case 'moderator': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'success';
            case 'suspended': return 'danger';
            case 'pending': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Control access and user permissions</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="bg-white border-slate-200 font-bold" leftIcon={<Download size={16} />}>
                            Export CSV
                        </Button>
                        <Button className="font-bold shadow-lg shadow-orange-500/20" leftIcon={<UserPlus size={16} />} onClick={() => setIsAddUserOpen(true)}>
                            Add New User
                        </Button>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            className="bg-slate-50 border-none pl-12 h-12 text-sm font-bold placeholder:text-slate-400"
                            placeholder="Find user by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Button variant="secondary" size="sm" className="bg-slate-50 border-none text-slate-500 font-bold h-10 px-4 whitespace-nowrap" leftIcon={<Filter size={14} />}>
                            Filter By Role
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-slate-50 border-none text-slate-500 font-bold h-10 px-4 whitespace-nowrap" leftIcon={<Activity size={14} />}>
                            Status: All
                        </Button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User Info</th>
                                    <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1 cursor-pointer hover:text-slate-600">
                                        Role <ArrowUpDown size={12} />
                                    </th>
                                    <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                                    <th className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-bold">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center text-slate-500 text-xs">
                                                    {user.name.split(' ').map(n=>n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-900 leading-none mb-1">{user.name}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <Badge variant={getRoleVariant(user.role)} className="py-1 px-3 uppercase text-[10px] tracking-widest">{user.role}</Badge>
                                        </td>
                                        <td className="py-6 px-8">
                                            <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                                        </td>
                                        <td className="py-6 px-8 text-sm text-slate-500 tracking-tight">{user.joined}</td>
                                        <td className="py-6 px-8">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-100 bg-white shadow-sm">
                                                    <Mail size={14} className="text-slate-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-100 bg-white shadow-sm hover:text-orange-500">
                                                    <Shield size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-red-50 hover:bg-red-50 hover:text-red-500 transition-colors">
                                                    <UserMinus size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                            Page 1 of 12 <span className="mx-2 font-light text-slate-300">|</span> 60 total users
                        </p>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" className="h-10 px-4 font-black text-xs uppercase tracking-widest bg-white border-slate-200">Prev</Button>
                            <Button variant="primary" size="sm" className="h-10 px-4 font-black text-xs uppercase tracking-widest shadow-md shadow-orange-500/10">Next</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                title="Create New User"
                maxWidth="max-w-lg"
                footer={<Button className="w-full font-black h-12 rounded-2xl">Create Account</Button>}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="First Name" placeholder="e.g. John" />
                        <Input label="Last Name" placeholder="e.g. Doe" />
                    </div>
                    <Input label="Email Address" type="email" placeholder="john@example.com" />
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Role</label>
                        <select className="w-full h-12 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-orange-100">
                            <option>User (Standard)</option>
                            <option>Moderator</option>
                            <option>Administrator</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default UserManagement;
