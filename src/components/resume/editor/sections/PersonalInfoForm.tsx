import React from 'react';
import { useResumeStore } from '../../../../store/useResumeStore';

const PersonalInfoForm = () => {
    const { resumeData, updatePersonalInfo } = useResumeStore();
    const info = resumeData.personalInfo;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updatePersonalInfo({ [name]: value });
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300";
    const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

    return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
                <label className={labelClasses}>First Name</label>
                <input 
                    name="firstName"
                    value={info.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={inputClasses}
                />
            </div>
            <div>
                <label className={labelClasses}>Last Name</label>
                <input 
                    name="lastName"
                    value={info.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={inputClasses}
                />
            </div>
            <div className="col-span-2">
                <label className={labelClasses}>Professional Title</label>
                <input 
                    name="jobTitle"
                    value={info.jobTitle}
                    onChange={handleChange}
                    placeholder="Senior Software Engineer"
                    className={inputClasses}
                />
            </div>
            <div>
                <label className={labelClasses}>Email Address</label>
                <input 
                    name="email"
                    value={info.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClasses}
                />
            </div>
            <div>
                <label className={labelClasses}>Phone Number</label>
                <input 
                    name="phone"
                    value={info.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className={inputClasses}
                />
            </div>
            <div>
                <label className={labelClasses}>Location</label>
                <input 
                    name="location"
                    value={info.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                    className={inputClasses}
                />
            </div>
            <div>
                <label className={labelClasses}>LinkedIn URL</label>
                <input 
                    name="linkedin"
                    value={info.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/johndoe"
                    className={inputClasses}
                />
            </div>
        </div>
    );
};

export default PersonalInfoForm;
