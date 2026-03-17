export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  date: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  contact: string;
}

export interface ResumeSettings {
  template: string;
  themeColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  spacing: 'compact' | 'normal' | 'loose';
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
  volunteer: Volunteer[];
  references: Reference[];
  settings: ResumeSettings;
  sectionOrder: string[];
}
