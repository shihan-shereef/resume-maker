import React from 'react';

const CorporateTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '16px', marginTop: '24px' }}>
            <h2 style={{
                color: '#1e293b',
                fontSize: '1.2rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: `1.5px solid #cbd5e1`,
                paddingBottom: '4px',
                marginBottom: '12px'
            }}>
                {title}
            </h2>
        </div>
    );

    const SidebarHeader = ({ title }) => (
        <h3 style={{
            color: '#1e293b',
            fontSize: '0.9rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
            marginTop: '20px'
        }}>
            {title}
        </h3>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#4b5563' }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#111827' }}>{exp.title}</h3>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: themeColor }}>{exp.company}</span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{exp.location}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0, color: '#374151' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>{edu.degree}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>{edu.school}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{edu.startDate} — {edu.endDate}</div>
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {skills.map((skill, idx) => (
                <div key={skill.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: themeColor, borderRadius: '50%' }}></div>
                    <span style={{ color: '#4b5563', fontSize: '0.85rem', fontWeight: 600 }}>{skill.name}</span>
                </div>
            ))}
        </div>
    );

    const renderProjects = () => projects.length > 0 && (
        <div>
            {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#111827' }}>{proj.name}</h3>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: '4px 0 0', color: '#374151' }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    const renderCertifications = () => certifications.length > 0 && (
        <div>
            {certifications.map((cert, idx) => (
                <div key={cert.id || idx} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{cert.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>{cert.issuer}</div>
                </div>
            ))}
        </div>
    );

    const renderAchievements = () => achievements.length > 0 && (
        <div>
            {achievements.map((ach, idx) => (
                <div key={ach.id || idx} style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#374151', marginBottom: '8px' }}>
                    • {ach.description}
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>

            {/* Sidebar (Left) */}
            <div style={{
                width: '30%',
                backgroundColor: '#f8fafc',
                borderRight: '1px solid #e2e8f0',
                padding: '0 20px',
                margin: '-20mm 0 -20mm -20mm' // Adjust to cover full height
            }}>
                <div style={{ height: '20mm' }}></div> {/* Spacer for margin */}

                <SidebarHeader title="Contact" />
                <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong>E:</strong> {personalInfo.email}</div>
                    <div><strong>P:</strong> {personalInfo.phone}</div>
                    <div><strong>L:</strong> {personalInfo.location}</div>
                    {personalInfo.linkedin && <div><strong>W:</strong> {personalInfo.linkedin}</div>}
                </div>

                <SidebarHeader title="Experties" />
                {renderSkills()}

                <SidebarHeader title="Education" />
                {renderEducation()}

                <SidebarHeader title="Certifications" />
                {renderCertifications()}
            </div>

            {/* Main Content (Right) */}
            <div style={{ width: '70%', paddingLeft: '32px' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: themeColor,
                        textTransform: 'uppercase',
                        letterSpacing: '-1px'
                    }}>
                        {personalInfo.firstName} {personalInfo.lastName}
                    </h1>
                    <p style={{
                        margin: '4px 0 0',
                        fontSize: '1.1rem',
                        color: '#475569',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {personalInfo.jobTitle}
                    </p>
                </header>

                <SectionHeader title="Profile Summary" />
                {renderSummary()}

                <SectionHeader title="Work History" />
                {renderExperience()}

                {projects.length > 0 && <SectionHeader title="Key Projects" />}
                {renderProjects()}

                {achievements.length > 0 && <SectionHeader title="Core Achievements" />}
                {renderAchievements()}
            </div>

        </div>
    );
};

export default CorporateTemplate;
