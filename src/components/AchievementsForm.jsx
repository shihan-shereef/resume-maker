import React from 'react';
import { useResume } from '../context/ResumeContext';
import DynamicList from './DynamicList';

const AchievementsForm = () => {
    const { updateItem } = useResume();

    const renderItem = (item, index) => {
        return (
            <div style={{ display: 'flex', gap: '12px' }}>
                <input
                    className="form-input"
                    style={{ flex: 1 }}
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem('achievements', item.id, { description: e.target.value })}
                    placeholder="Describe your achievement..."
                />
            </div>
        );
    };

    return <DynamicList sectionName="achievements" renderItem={renderItem} emptyItem={{ description: '' }} />;
};

export default AchievementsForm;
