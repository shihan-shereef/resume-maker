import React, { useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import TraditionalTemplate from './templates/TraditionalTemplate';
import TechTemplate from './templates/TechTemplate';
import { useReactToPrint } from 'react-to-print';
import { Download, FileText, Printer } from 'lucide-react';

const Preview = () => {
    const { resumeData } = useResume();
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume`,
    });

    const renderTemplate = () => {
        switch (resumeData.settings.template) {
            case 'modern':
                return <ModernTemplate data={resumeData} />;
            case 'minimal':
                return <MinimalTemplate data={resumeData} />;
            case 'corporate':
                return <CorporateTemplate data={resumeData} />;
            case 'professional':
                return <ProfessionalTemplate data={resumeData} />;
            case 'creative':
                return <CreativeTemplate data={resumeData} />;
            case 'traditional':
                return <TraditionalTemplate data={resumeData} />;
            case 'tech':
                return <TechTemplate data={resumeData} />;
            default:
                return <ModernTemplate data={resumeData} />;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Template Controls Bar */}
            <div style={{
                padding: '12px 24px',
                background: 'rgba(0,0,0,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: 500
                    }}>
                        <FileText size={16} />
                        <span style={{ textTransform: 'capitalize' }}>{resumeData.settings.template} Template</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handlePrint}
                        className="btn-primary"
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: 'none'
                        }}
                    >
                        <Printer size={16} /> PDF / Print
                    </button>
                </div>
            </div>

            {/* Paper Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '40px',
                display: 'flex',
                justifyContent: 'center',
                background: '#334155' // Dark slate for background contrast
            }}>
                <div
                    ref={componentRef}
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        backgroundColor: 'white',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        padding: '20mm', // Standard resume padding
                        color: '#1e293b', // Deep charcoal for readability
                        fontFamily: resumeData.settings.font
                    }}
                >
                    {renderTemplate()}
                </div>
            </div>
        </div>
    );
};

export default Preview;
