import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { ResumeData } from '../../types/resume';

// Register standard fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf', fontWeight: 900 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    color: '#0f172a',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 3,
    paddingBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginTop: 5,
    color: '#64748b',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: 700,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    color: '#3b82f6',
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#475569',
  },
  experienceItem: {
    marginBottom: 15,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1e293b',
  },
  date: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: 700,
  },
  position: {
    fontSize: 10,
    fontWeight: 700,
    color: '#64748b',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#475569',
  }
});

const MyDocument = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: data.settings.themeColor }]}>
        <Text style={styles.name}>{data.personalInfo.firstName} {data.personalInfo.lastName}</Text>
        <Text style={styles.title}>{data.personalInfo.jobTitle}</Text>
        <View style={styles.contactRow}>
          <Text>{data.personalInfo.email}</Text>
          <Text>•</Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text>•</Text>
          <Text>{data.personalInfo.location}</Text>
        </View>
      </View>

      {/* Summary */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: data.settings.themeColor }]}>About Me</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}

      {/* Experience */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: data.settings.themeColor }]}>Experience</Text>
        {data.experience.map((exp, i) => (
          <View key={i} style={styles.experienceItem}>
            <View style={styles.expHeader}>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.date}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
            </View>
            <Text style={styles.position}>{exp.position}</Text>
            <Text style={styles.description}>{exp.description}</Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: data.settings.themeColor }]}>Education</Text>
        {data.education.map((edu, i) => (
          <View key={i} style={styles.experienceItem}>
            <View style={styles.expHeader}>
              <Text style={styles.company}>{edu.school}</Text>
              <Text style={styles.date}>{edu.startDate} - {edu.endDate || 'Present'}</Text>
            </View>
            <Text style={styles.position}>{edu.degree} in {edu.field}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const PdfExporter = ({ data }: { data: ResumeData }) => (
  <PDFDownloadLink 
    document={<MyDocument data={data} />} 
    fileName={`${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.pdf`}
    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10"
  >
    {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
  </PDFDownloadLink>
);

export default PdfExporter;
