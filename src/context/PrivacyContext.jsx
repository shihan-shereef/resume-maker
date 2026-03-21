import React, { createContext, useContext, useState, useEffect } from 'react';

const PrivacyContext = createContext();

export const PrivacyProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [hasAccepted, setHasAccepted] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('privacyAccepted') === 'true';
        setHasAccepted(accepted);
    }, []);

    const openPrivacyModal = (firstTime = false) => {
        setIsFirstTime(firstTime);
        setIsModalOpen(true);
    };

    const closePrivacyModal = () => {
        setIsModalOpen(false);
    };

    const acceptPrivacy = () => {
        localStorage.setItem('privacyAccepted', 'true');
        setHasAccepted(true);
        setIsModalOpen(false);
    };

    return (
        <PrivacyContext.Provider value={{
            isModalOpen,
            isFirstTime,
            hasAccepted,
            openPrivacyModal,
            closePrivacyModal,
            acceptPrivacy
        }}>
            {children}
        </PrivacyContext.Provider>
    );
};

export const usePrivacy = () => {
    const context = useContext(PrivacyContext);
    if (!context) {
        throw new Error('usePrivacy must be used within a PrivacyProvider');
    }
    return context;
};
