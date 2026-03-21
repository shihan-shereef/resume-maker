import React from "react";
import { 
  Shield, ClipboardList, Target, Bot, Zap, Scroll, Scale, 
  Lock, AlertTriangle, UserCheck, HelpCircle, ArrowLeft, Mail, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import creatorImg from "../assets/creator.jpg";

const sections = [
  {
    id: "agreement",
    title: "1. Acceptance of Terms",
    icon: <Scroll size={18} />,
    content: "By accessing Takshila AI ('Takshila', 'we', 'us'), you agree to be bound by these Terms of Service. This is a legally binding agreement between you and Takshila. If you do not agree to these terms, please do not use our services."
  },
  {
    id: "capabilities",
    title: "2. Product Capabilities",
    icon: <Zap size={18} />,
    content: "Takshila AI is a comprehensive career productivity ecosystem capable of the following:",
    list: [
      "AI Resume Building: Create professional, ATS-optimized resumes using advanced LLM technology.",
      "Interview Simulation: Conduct AI-powered mock interviews with real-time feedback and analysis.",
      "Career Roadmaps: Generate personalized step-by-step career progression paths.",
      "Job Discovery & Tracking: Search over 60 live jobs via Firecrawl and track applications.",
      "ATS Checker: Analyze your resume against job descriptions for keyword optimization.",
      "Document AI: Summarize PDFs and extract key career insights automatically.",
      "YouTube Summarizer: Analyze career-related educational videos for optimized learning.",
      "Portfolio Builder: Dynamic profile generation for professional showcase."
    ]
  },
  {
    id: "ai-disclaimer",
    title: "3. AI Simulation & Accuracy",
    icon: <Bot size={18} />,
    content: "Takshila leverages Large Language Models (LLMs) to provide Career Assistance. Users acknowledge that:",
    list: [
      "AI outputs are simulations and should not be considered professional legal or financial advice.",
      "Resume scoring and ATS analysis do not guarantee hiring outcomes.",
      "Interview simulations are intended for training purposes only."
    ]
  },
  {
    id: "usage",
    title: "4. Permitted Use & Conduct",
    icon: <UserCheck size={18} />,
    content: "You agree to use Takshila only for lawful career development. Prohibited actions include:",
    list: [
      "Attempting to 'jailbreak' or reverse-engineer our AI prompts or algorithms.",
      "Automated extraction of job data beyond the intended search interface.",
      "Providing false or misleading educational or professional experience data."
    ]
  },
  {
    id: "liability",
    title: "5. Limitation of Liability",
    icon: <Scale size={18} />,
    content: "Takshila is provided 'as is'. We do not warrant that the service will be error-free. We shall not be liable for any indirect damages resulting from your use of the platform or reliance on AI-generated career advice."
  }
];

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#1a1a1a"
    }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #f0f0f0",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              background: "#FDEEE9", 
              border: "none", 
              borderRadius: "50%", 
              width: "36px", 
              height: "36px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
          >
            <ArrowLeft size={18} color="#E85D3F" />
          </button>
          <div style={{ fontSize: "18px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "-0.5px" }}>
            Takshila<span style={{ color: "#E85D3F" }}>.</span>
          </div>
        </div>

        <div style={{ 
             width: "36px", 
             height: "36px", 
             borderRadius: "50%", 
             overflow: "hidden", 
             border: "2px solid #E85D3F",
             background: "#f0f0f0"
          }}>
            <img 
              src={creatorImg} 
              alt="Abdul Shihan"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                if (e.target.src !== "/creator.jpg") {
                  e.target.src = "/creator.jpg";
                } else {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.style.display = 'flex';
                  e.target.parentNode.style.alignItems = 'center';
                  e.target.parentNode.style.justifyContent = 'center';
                  e.target.parentNode.innerHTML = '<div style="background: linear-gradient(135deg, #FF5F6D 0%, #BD00FF 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px;">AS</div>';
                }
              }}
            />
          </div>
      </nav>

      {/* Hero Header */}
      <header style={{
        background: "linear-gradient(180deg, #FFF9F7 0%, #FFFFFF 100%)",
        padding: "40px 24px 30px",
        textAlign: "center"
      }}>
        <div style={{
          background: "#FFF5F2",
          color: "#E85D3F",
          padding: "6px 12px",
          borderRadius: "100px",
          fontSize: "12px",
          fontWeight: "700",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "16px"
        }}>
          <ClipboardList size={14} /> Legal Documentation
        </div>
        <h1 style={{ 
          fontSize: "36px", 
          fontWeight: "900", 
          marginBottom: "12px", 
          letterSpacing: "-1px",
          color: "#1a1a1a"
        }}>
          Terms of <span style={{ color: "#E85D3F" }}>Service</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#666", maxWidth: "500px", margin: "0 auto", lineHeight: "1.5" }}>
          Explore the rules and capabilities of the Takshila AI career ecosystem.
        </p>
      </header>

      {/* Content */}
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 60px" }}>
        {sections.map((section) => (
          <div 
            key={section.id}
            id={section.id}
            style={{
              padding: "24px 0",
              borderBottom: "1px solid #f9f9f9"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FFF5F2",
                color: "#E85D3F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {section.icon}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a1a" }}>{section.title}</h2>
            </div>
            
            <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6", marginBottom: "14px" }}>
              {section.content}
            </p>

            {section.list && (section.list.length > 0) && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.list.map((item, i) => (
                  <li key={i} style={{ 
                    display: "flex", 
                    gap: "10px", 
                    marginBottom: "8px",
                    fontSize: "15px",
                    color: "#555",
                    lineHeight: "1.4"
                  }}>
                    <div style={{ color: "#E85D3F", fontWeight: "bold" }}>•</div>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Contact Footer */}
        <div style={{
          marginTop: "40px",
          background: "#FFFBF9",
          border: "1px solid #FDEEE9",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center"
        }}>
          <HelpCircle size={32} color="#E85D3F" style={{ marginBottom: "12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "6px" }}>Questions about our terms?</h3>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>We're here to clarify how Takshila works for your career.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <button style={{
              background: "#E85D3F",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}>
              <Mail size={16} /> Contact Support
            </button>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer style={{
        padding: "30px 24px",
        textAlign: "center",
        borderTop: "1px solid #f0f0f0",
        background: "#fff"
      }}>
         <div style={{ fontSize: "14px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" }}>
            Takshila<span style={{ color: "#E85D3F" }}>.</span>
          </div>
          <p style={{ fontSize: "12px", color: "#999" }}>SECURE ACCESS • TAKSHILA AI 2025</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
