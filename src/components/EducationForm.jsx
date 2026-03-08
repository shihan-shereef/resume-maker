import React from 'react';
import { useResume } from '../context/ResumeContext';
import DynamicList from './DynamicList';

const EducationForm = () => {
    const { updateItem } = useResume();

    const renderItem = (item, index) => {
        const handleChange = (e) => {
            updateItem('education', item.id, { [e.target.name]: e.target.value });
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input className="form-input" style={{ width: '100%' }} type="text" name="school" value={item.school} onChange={handleChange} placeholder="School / University Name" />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="form-input" style={{ flex: 1 }} type="text" name="degree" value={item.degree} onChange={handleChange} placeholder="Degree (e.g. Master's in Computer Science)" />
                    <input className="form-input" style={{ width: '130px' }} type="text" name="startDate" value={item.startDate} onChange={handleChange} placeholder="Start Year" />
                    <input className="form-input" style={{ width: '130px' }} type="text" name="endDate" value={item.endDate} onChange={handleChange} placeholder="End Year / Expected" />
                </div>
                <textarea className="form-input" style={{ minHeight: '60px', resize: 'vertical' }} name="description" value={item.description} onChange={handleChange} placeholder="Relevant coursework, GPA, honors..." />
            </div>
        );
    };

    return <DynamicList sectionName="education" renderItem={renderItem} emptyItem={{ school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }} />;
};

export default EducationForm;
