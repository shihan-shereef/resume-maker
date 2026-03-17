export interface TemplateMeta {
  id: string;
  name: string;
  category: 'Sidebar' | 'Two-Column' | 'Minimal' | 'Infographic' | 'Executive' | 'Tech';
  thumbnail: string;
  description: string;
}

export const templates: TemplateMeta[] = [
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    category: 'Sidebar',
    thumbnail: '/templates/modern-sidebar.png',
    description: 'A clean, professional layout with a focus-grabbing sidebar for contact and skills.'
  },
  {
    id: 'executive-pro',
    name: 'Executive Pro',
    category: 'Executive',
    thumbnail: '/templates/executive-pro.png',
    description: 'Traditional yet polished layout designed for senior leadership and management roles.'
  },
  {
    id: 'minimalist-stack',
    name: 'Minimalist Stack',
    category: 'Minimal',
    thumbnail: '/templates/minimalist-stack.png',
    description: 'Simple, elegant, and space-efficient. Perfect for those who want their experience to speak for itself.'
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    category: 'Tech',
    thumbnail: '/templates/tech-innovator.png',
    description: 'Optimized for developers with clear project sections and technical skill visualizations.'
  },
  {
    id: 'creative-canvas',
    name: 'Creative Canvas',
    category: 'Infographic',
    thumbnail: '/templates/creative-canvas.png',
    description: 'Bold colors and dynamic layouts for designers and creative professionals.'
  }
];
