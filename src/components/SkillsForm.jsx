import React from 'react';
import { useResume } from '../context/ResumeContext';
import DynamicList from './DynamicList';

const SkillsForm = () => {
    const { updateItem } = useResume();

    const renderItem = (item, index) => {
        return (
            <div style={{ display: 'flex', gap: '12px' }}>
                <input
                    className="form-input"
                    style={{ flex: 1 }}
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem('skills', item.id, { name: e.target.value })}
                    placeholder="e.g. JavaScript, React, System Design"
                />
            </div>
        );
    };

    return <DynamicList sectionName="skills" renderItem={renderItem} emptyItem={{ name: '' }} />;
};

export default SkillsForm;
