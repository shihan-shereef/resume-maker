import React from 'react';

const TechTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '12px', marginTop: '24px' }}>
            <h2 style={{
                color: themeColor,
                fontSize: '1.2rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span style={{ color: '#cbd5e1' }}>$</span> {title.toLowerCase().replace(/\s+/g, '_')}()
                <div style={{ flex: 1, height: '1.5px', background: `${themeColor}22` }}></div>
            </h2>
        </div>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${themeColor}` }}>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#4b5563', margin: 0 }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111827' }}>{exp.title}</h3>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, fontStyle: 'monospace', color: '#64748b' }}>[{exp.startDate} ... {exp.endDate}]</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: themeColor }}>@ {exp.company}</span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'monospace' }}>{exp.location.toLowerCase()}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0, color: '#4b5563', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#111827' }}>{edu.degree}</h3>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{edu.school}</div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, fontStyle: 'monospace', color: '#94a3b8' }}>&gt; {edu.endDate}</span>
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((skill, idx) => (
                <span key={skill.id || idx} style={{
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    fontFamily: 'monospace'
                }}>
                    {skill.name.toLowerCase()}
                </span>
            ))}
        </div>
    );

    const renderProjects = () => projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.2s'
                }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 8px', color: '#111827' }}>{proj.name}</h3>
                    {proj.link && <div style={{ fontSize: '0.75rem', color: themeColor, fontWeight: 700, marginBottom: '8px' }}>{proj.link}</div>}
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#4b5563', margin: 0 }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Tech Header */}
            <header style={{
                borderBottom: `2px solid ${themeColor}`,
                paddingBottom: '24px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'monospace'
            }}>
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '3rem',
                        fontWeight: 900,
                        color: '#1e293b',
                        letterSpacing: '-2px',
                        lineHeight: 1
                    }}>
                        {personalInfo.firstName.toLowerCase()}<span style={{ color: themeColor }}>.</span>{personalInfo.lastName.toLowerCase()}()
                    </h1>
                    <p style={{
                        margin: '12px 0 0',
                        fontSize: '1.1rem',
                        color: '#64748b',
                        fontWeight: 700
                    }}>
                        const title = "{personalInfo.jobTitle.toLowerCase()}";
                    </p>
                </div>

                <div style={{ textAlign: 'right', color: '#475569', fontSize: '0.8rem', paddingTop: '10px' }}>
                    <div>contact.email = "{personalInfo.email}";</div>
                    <div>contact.phone = "{personalInfo.phone}";</div>
                    <div>contact.location = "{personalInfo.location.toLowerCase()}";</div>
                </div>
            </header>

            {/* Dynamic Sections */}
            {sectionOrder.map((sectionId) => {
                const config = {
                    summary: { title: 'User Profile', render: renderSummary },
                    experience: { title: 'Experience History', render: renderExperience },
                    education: { title: 'Education Logs', render: renderEducation },
                    skills: { title: 'Dependency List', render: renderSkills },
                    projects: { title: 'Project Repos', render: renderProjects },
                }[sectionId];
                if (!config) return null;
                const content = config.render();
                if (!content) return null;

                return (
                    <div key={sectionId}>
                        <SectionHeader title={config.title} />
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default TechTemplate;
