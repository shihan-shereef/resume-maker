# Project Overview

This is a React-based resume builder called "ResumeFlow" that uses Vite for building, Supabase for the backend, and OpenRouter for AI features.

The application allows users to create, manage, and export professional resumes using a variety of templates. It includes a live preview, AI-powered summary generation, and a secure user authentication system.

## Building and Running

### Development

To run the application in a development environment, use the following command:

```bash
npm run dev
```

This will start a development server on `http://localhost:5173`.

### Production Build

To build the application for production, use the following command:

```bash
npm run build
```

This will create a `dist` directory with the optimized and minified application files.

## Development Conventions

### Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS, vanilla-extract
- **Backend & Auth:** Supabase
- **AI Engine:** OpenRouter API
- **Icons:** Lucide React
- **Drag & Drop:** @hello-pangea/dnd
- **PDF Export:** react-to-print

### Project Structure

The project is organized as follows:

- `src/components`: Reusable React components.
- `src/components/templates`: Resume templates.
- `src/context`: React context for state management.
- `src/lib`: Third-party integrations (Supabase, OpenRouter).
- `src/pages`: Main application pages.
- `src/styles`: Global and component-specific styles.
- `api`: Serverless functions.

### API

The application uses serverless functions located in the `api` directory. The `api/ai.js` file handles requests to the OpenRouter API for AI-powered features. It includes rate limiting and input validation.

### Authentication

Authentication is handled by Supabase. The main `App.jsx` component manages the user session and redirects unauthenticated users to the login page.
