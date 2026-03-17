import React from 'react';
import TemplateGallery from '../components/resume/templates/TemplateGallery';

const ResumeMaker = () => {
    return (
        <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar">
            <TemplateGallery />
        </div>
    );
};

export default ResumeMaker;
