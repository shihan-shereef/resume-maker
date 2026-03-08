import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialResumeData = {
    personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe'
    },
    summary: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Strong expertise in React, Node.js, and cloud technologies.',
    experience: [
        {
            id: uuidv4(),
            title: 'Senior Frontend Engineer',
            company: 'TechCorp Solutions',
            location: 'San Francisco, CA',
            startDate: '2020-01',
            endDate: 'Present',
            description: 'Led a team of 4 front-end developers to build out a new React-based architecture. Improved page load times by 40%. Implemented responsive design across the main product.'
        }
    ],
    education: [
        {
            id: uuidv4(),
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2015-08',
            endDate: '2019-05',
            description: 'Graduated with Honors. Member of the Computer Science Society.'
        }
    ],
    skills: [
        { id: uuidv4(), name: 'React.js' },
        { id: uuidv4(), name: 'JavaScript' },
        { id: uuidv4(), name: 'Node.js' },
        { id: uuidv4(), name: 'Tailwind CSS' }
    ],
    projects: [],
    certifications: [],
    achievements: [],
    settings: {
        template: 'modern', // 'modern', 'minimal', 'corporate'
        themeColor: '#6366f1',
        font: 'Outfit' // 'Outfit', 'Roboto', 'Inter', 'Merriweather'
    },
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements']
};

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeFlowData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return initialResumeData;
            }
        }
        return initialResumeData;
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('resumeFlowData', JSON.stringify(resumeData));
    }, [resumeData]);

    const updatePersonalInfo = (data) => {
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }));
    };

    const updateSummary = (summary) => {
        setResumeData(prev => ({ ...prev, summary }));
    };

    const updateSettings = (settings) => {
        setResumeData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
    };

    const updateSectionOrder = (newOrder) => {
        setResumeData(prev => ({ ...prev, sectionOrder: newOrder }));
    };

    // Generic List Operations
    const addItem = (section, item) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], { id: uuidv4(), ...item }] }));
    };

    const updateItem = (section, id, data) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item => (item.id === id ? { ...item, ...data } : item))
        }));
    };

    const removeItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const reorderList = (section, startIndex, endIndex) => {
        setResumeData(prev => {
            const result = Array.from(prev[section]);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { ...prev, [section]: result };
        });
    };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            setResumeData,
            updatePersonalInfo,
            updateSummary,
            updateSettings,
            updateSectionOrder,
            addItem,
            updateItem,
            removeItem,
            reorderList,
            resetResume: () => setResumeData(initialResumeData)
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};
