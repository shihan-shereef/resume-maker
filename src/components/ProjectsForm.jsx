import React from 'react';
import { useResume } from '../context/ResumeContext';
import DynamicList from './DynamicList';

const ProjectsForm = () => {
    const { updateItem } = useResume();

    const renderItem = (item, index) => {
        const handleChange = (e) => {
            updateItem('projects', item.id, { [e.target.name]: e.target.value });
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', gap: '12px' }}>
                    <input className="form-input" style={{ flex: 1 }} type="text" name="name" value={item.name} onChange={handleChange} placeholder="Project Name" />
                    <input className="form-input" style={{ flex: 1 }} type="text" name="link" value={item.link} onChange={handleChange} placeholder="Live Link / GitHub (Optional)" />
                </div>
                <textarea className="form-input" style={{ minHeight: '60px', resize: 'vertical' }} name="description" value={item.description} onChange={handleChange} placeholder="What was the project about? Technologies used..." />
            </div>
        );
    };

    return <DynamicList sectionName="projects" renderItem={renderItem} emptyItem={{ name: '', link: '', description: '' }} />;
};

export default ProjectsForm;
