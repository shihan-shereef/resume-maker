import React from 'react';

const CreativeTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '16px', marginTop: '24px' }}>
            <h2 style={{
                color: themeColor,
                fontSize: '1.4rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'inline-block',
                position: 'relative',
                paddingRight: '12px'
            }}>
                {title}
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: 0,
                    width: '100vw',
                    height: '8px',
                    backgroundColor: `${themeColor}1a`,
                    zIndex: -1
                }}></div>
            </h2>
        </div>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#4b5563', fontWeight: 500 }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div style={{ borderLeft: `2px solid ${themeColor}33`, paddingLeft: '20px' }}>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '24px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        left: '-25px',
                        top: '6px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: themeColor
                    }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>{exp.title}</h3>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: themeColor }}>{exp.company}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, margin: 0, color: '#4b5563' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{
                    backgroundColor: `${themeColor}0a`,
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${themeColor}1a`
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{edu.degree}</h3>
                    <div style={{ fontSize: '0.9rem', color: themeColor, fontWeight: 700, marginTop: '4px' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginTop: '4px' }}>{edu.startDate} — {edu.endDate}</div>
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((skill, idx) => (
                <span key={skill.id || idx} style={{
                    backgroundColor: themeColor,
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    boxShadow: `0 4px 10px ${themeColor}33`
                }}>
                    {skill.name}
                </span>
            ))}
        </div>
    );

    const renderProjects = () => projects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, white, #f8fafc)',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#111827' }}>{proj.name}</h3>
                        {proj.link && <span style={{ fontSize: '0.8rem', color: themeColor, fontWeight: 700 }}>{proj.link}</span>}
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, color: '#4b5563' }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100%', padding: '20px' }}>
            {/* Creative Header */}
            <header style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '40px'
            }}>
                <div style={{
                    width: '60px',
                    height: '8px',
                    backgroundColor: themeColor,
                    borderRadius: '4px',
                    marginBottom: '8px'
                }}></div>
                <h1 style={{
                    margin: 0,
                    fontSize: '3rem',
                    fontWeight: 900,
                    color: '#1e293b',
                    letterSpacing: '-2px',
                    lineHeight: 1
                }}>
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <p style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    color: themeColor,
                    fontWeight: 800,
                    letterSpacing: '-1px'
                }}>
                    {personalInfo.jobTitle}
                </p>
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: '12px',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '20px'
                }}>
                    <span>{personalInfo.email}</span>
                    <span>{personalInfo.phone}</span>
                    <span>{personalInfo.location}</span>
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
            </header>

            {/* Dynamic Sections */}
            {sectionOrder.map((sectionId) => {
                const config = {
                    summary: { render: renderSummary },
                    experience: { title: 'Experience', render: renderExperience },
                    education: { title: 'Education', render: renderEducation },
                    skills: { title: 'Skills', render: renderSkills },
                    projects: { title: 'Projects', render: renderProjects },
                }[sectionId];
                if (!config) return null;
                const content = config.render();
                if (!content) return null;

                return (
                    <div key={sectionId}>
                        {config.title && <SectionHeader title={config.title} />}
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default CreativeTemplate;
