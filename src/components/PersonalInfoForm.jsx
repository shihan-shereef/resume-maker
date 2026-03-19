import React from 'react';
import { useResume } from '../context/ResumeContext';

const PersonalInfoForm = () => {
    const { resumeData, updatePersonalInfo } = useResume();
    const data = resumeData.personalInfo;

    const handleChange = (e) => {
        updatePersonalInfo({ [e.target.name]: e.target.value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vh, 16px)' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', gap: 'clamp(12px, 3vw, 16px)' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ display: 'block' }}>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleChange}
                        className="form-input"
                        style={{ paddingLeft: '14px' }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ display: 'block' }}>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleChange}
                        className="form-input"
                        style={{ paddingLeft: '14px' }}
                    />
                </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'block' }}>Job Title</label>
                <input
                    type="text"
                    name="jobTitle"
                    value={data.jobTitle}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Senior Software Engineer"
                    style={{ paddingLeft: '14px' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', gap: 'clamp(12px, 3vw, 16px)' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ display: 'block' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="form-input"
                        style={{ paddingLeft: '14px' }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ display: 'block' }}>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        className="form-input"
                        style={{ paddingLeft: '14px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', gap: 'clamp(12px, 3vw, 16px)' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ display: 'block' }}>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={data.location}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="City, Country"
                        style={{ paddingLeft: '14px' }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ display: 'block' }}>LinkedIn / Website</label>
                    <input
                        type="text"
                        name="linkedin"
                        value={data.linkedin}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="linkedin.com/in/username"
                        style={{ paddingLeft: '14px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
