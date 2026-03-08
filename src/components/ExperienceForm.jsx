import React from 'react';
import { useResume } from '../context/ResumeContext';
import DynamicList from './DynamicList';

const ExperienceForm = () => {
    const { updateItem } = useResume();

    const renderItem = (item, index) => {
        const handleChange = (e) => {
            updateItem('experience', item.id, { [e.target.name]: e.target.value });
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="form-input" style={{ flex: 1 }} type="text" name="title" value={item.title} onChange={handleChange} placeholder="Job Title (e.g. Software Engineer)" />
                    <input className="form-input" style={{ flex: 1 }} type="text" name="company" value={item.company} onChange={handleChange} placeholder="Company Name" />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="form-input" style={{ flex: 1 }} type="text" name="location" value={item.location} onChange={handleChange} placeholder="Location" />
                    <input className="form-input" style={{ width: '130px' }} type="text" name="startDate" value={item.startDate} onChange={handleChange} placeholder="Start Date" />
                    <input className="form-input" style={{ width: '130px' }} type="text" name="endDate" value={item.endDate} onChange={handleChange} placeholder="End / Present" />
                </div>
                <textarea className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} name="description" value={item.description} onChange={handleChange} placeholder="Describe your responsibilities and achievements..." />
            </div>
        );
    };

    return <DynamicList sectionName="experience" renderItem={renderItem} emptyItem={{ title: '', company: '', location: '', startDate: '', endDate: '', description: '' }} />;
};

export default ExperienceForm;
