import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ResumeData } from '../types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  updatePersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  addItem: (section: keyof ResumeData, item: any) => void;
  updateItem: (section: keyof ResumeData, id: string, data: any) => void;
  removeItem: (section: keyof ResumeData, id: string) => void;
  reorderItems: (section: keyof ResumeData, startIndex: number, endIndex: number) => void;
  updateSettings: (settings: Partial<ResumeData['settings']>) => void;
  updateSectionOrder: (newOrder: string[]) => void;
  resetResume: () => void;
}

const initialResumeData: ResumeData = {
  id: uuidv4(),
  title: 'My Resume',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  languages: [],
  volunteer: [],
  references: [],
  settings: {
    template: 'Modern',
    themeColor: '#2563eb',
    fontFamily: 'Inter',
    fontSize: 'medium',
    lineHeight: 'normal',
    spacing: 'normal',
  },
  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'languages',
    'volunteer',
    'references',
  ],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      updatePersonalInfo: (data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),
      updateSummary: (summary) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            summary,
            updatedAt: new Date().toISOString(),
          },
        })),
      addItem: (section, item) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            [section]: [...(state.resumeData[section] as any[]), { id: uuidv4(), ...item }],
            updatedAt: new Date().toISOString(),
          },
        })),
      updateItem: (section, id, data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            [section]: (state.resumeData[section] as any[]).map((item) =>
              item.id === id ? { ...item, ...data } : item
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      removeItem: (section, id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            [section]: (state.resumeData[section] as any[]).filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      reorderItems: (section, startIndex, endIndex) =>
        set((state) => {
          const list = Array.from(state.resumeData[section] as any[]);
          const [removed] = list.splice(startIndex, 1);
          list.splice(endIndex, 0, removed);
          return {
            resumeData: {
              ...state.resumeData,
              [section]: list,
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      updateSettings: (settings) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            settings: { ...state.resumeData.settings, ...settings },
            updatedAt: new Date().toISOString(),
          },
        })),
      updateSectionOrder: (newOrder) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            sectionOrder: newOrder,
            updatedAt: new Date().toISOString(),
          },
        })),
      resetResume: () => set({ resumeData: { ...initialResumeData, id: uuidv4() } }),
    }),
    {
      name: 'takshila-resume-storage',
    }
  )
);
