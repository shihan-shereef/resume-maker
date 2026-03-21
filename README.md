# 🚀 ResumeFlow – AI-Powered Professional Resume Builder

**ResumeFlow** is a modern, high-performance web application designed to help you create stunning, professional resumes in minutes. Featuring multiple templates, real-time live preview, and AI-powered content assistance, ResumeFlow simplifies the process of landing your dream job.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=ResumeFlow+Dashboard+Preview)

## ✨ Key Features

- **7+ Professional Templates**: Choose from Modern, Minimal, Corporate, Tech, Creative, Traditional, and Professional layouts.
- **Live Preview**: See your changes in real-time as you type, with perfect A4 paper formatting.
- **AI-Powered Summary Assistant**: Automatically generate or enhance your professional summary using OpenRouter's advanced AI.
- **Dynamic Content Sections**: Add as many work experiences, education entries, and projects as you need.
- **Drag & Drop Reordering**: Easily reorder list items within sections for the perfect flow.
- **Download to PDF**: Single-click PDF export using standardized print styles.
- **Secure Authentication**: Built-in login and registration system powered by **Supabase**.
- **Responsive Design**: Works seamlessly across desktops and tablets.
- **Theming & Typography**: Customize your theme color and choose from a curated list of professional fonts (Outfit, Inter, Playfair Display, etc.).

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with Modern Glassmorphism UI
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **AI Engine**: [OpenRouter API](https://openrouter.ai/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **PDF Export**: [react-to-print](https://github.com/gregnb/react-to-print)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/shihan-shereef/resume-maker.git
cd resume-maker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory and add the following:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run the development server
For frontend-only UI work:
```bash
npm run dev
```
For full-stack local development with AI routes (like `/api/ai` or the PDF Summarizer):
```bash
npm run dev:full
```

**CRITICAL NOTE:** Use `npm run dev:full` (or `vercel dev`) when testing the PDF Summarizer, ATS analysis, or any AI-powered feature. Running just `npm run dev` is frontend-only and will cause API endpoints to fail (e.g., throwing "Unexpected token < in JSON" or pattern match errors).

Open the local URL shown in your terminal to see the results.

## 📁 Project Structure

```text
src/
├── components/          # React components (Editor, Preview, Forms, etc.)
│   └── templates/       # Professional resume CSS/JS templates
├── context/             # Resume state management via React Context
├── lib/                 # Third-party integrations (Supabase, OpenRouter)
├── pages/               # Main application pages (Login, Dashboard)
└── index.css            # Global design system & glassmorphism styles
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to help improve ResumeFlow.

## 📄 License

This project is licensed under the MIT License.

---

Crafted with ❤️ by **[Shihan Shereef](https://github.com/shihan-shereef)**
