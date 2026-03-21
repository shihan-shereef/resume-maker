import React, { useState } from 'react';
import { Camera, Edit2, Save, X, Mail, Shield } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Toast from '../../components/ui/Toast';

const ProfileSection = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user.name,
        email: 'shihan@example.com',
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="relative group mx-auto w-32 h-32">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-orange-200">
                    {formData.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-2xl shadow-lg border border-slate-100 text-slate-600 hover:text-[var(--primary)] transition-colors group-hover:scale-110 duration-200">
                    <Camera size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {isEditing ? (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <Input 
                            label="Full Name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <Input 
                            label="Email Address" 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1" onClick={handleSave} isLoading={isSaving} leftIcon={<Save size={18} />}>
                                Save
                            </Button>
                            <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="text-center">
                            <h4 className="text-xl font-bold text-slate-900">{formData.name}</h4>
                            <div className="mt-2 flex items-center justify-center gap-2">
                                <Badge variant="primary" className="py-1">Pro Member</Badge>
                                <Badge variant="success" className="py-1">Verified</Badge>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} /></div>
                                <span className="text-sm font-semibold">{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="p-2 bg-slate-50 rounded-lg"><Shield size={16} /></div>
                                <span className="text-sm font-semibold">Two-factor auth: On</span>
                            </div>
                        </div>

                        <Button 
                            variant="secondary" 
                            className="w-full rounded-2xl h-11 border-slate-200 text-slate-600 font-bold" 
                            onClick={() => setIsEditing(true)}
                            leftIcon={<Edit2 size={16} />}
                        >
                            Edit Profile
                        </Button>
                    </div>
                )}
            </div>

            <Toast 
                message="Profile updated successfully!" 
                isVisible={showToast} 
                onClose={() => setShowToast(false)} 
            />
        </div>
    );
};

export default ProfileSection;
