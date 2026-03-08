import React from 'react';
import { useResume } from '../context/ResumeContext';
import DynamicList from './DynamicList';

const CertificationsForm = () => {
    const { updateItem } = useResume();

    const renderItem = (item, index) => {
        const handleChange = (e) => {
            updateItem('certifications', item.id, { [e.target.name]: e.target.value });
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input className="form-input" style={{ width: '100%' }} type="text" name="name" value={item.name} onChange={handleChange} placeholder="Certification Name" />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="form-input" style={{ flex: 1 }} type="text" name="issuer" value={item.issuer} onChange={handleChange} placeholder="Issuing Organization" />
                    <input className="form-input" style={{ width: '130px' }} type="text" name="date" value={item.date} onChange={handleChange} placeholder="Date Issued" />
                </div>
            </div>
        );
    };

    return <DynamicList sectionName="certifications" renderItem={renderItem} emptyItem={{ name: '', issuer: '', date: '' }} />;
};

export default CertificationsForm;
