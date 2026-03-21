import React, { useState } from "react";
import { 
  Shield, ClipboardList, Target, Bot, UserX, Calendar, Scale, 
  Lock, Cookie, Mail, Plus, Minus, Info, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import creatorImg from "../assets/creator.jpg";

const sections = [
  {
    id: "who",
    icon: Shield,
    title: "Who we are",
    content: `Takshila AI is an AI-powered resume builder and career workspace created and operated by Abdul Shihan, a student developer based in Sri Lanka. This project was originally built as part of an internship submission and has since been expanded with additional features to genuinely help job seekers create professional resumes with ease.

You can contact the creator directly at: shihan@takshila.ai`
  },
  {
    id: "collect",
    icon: ClipboardList,
    title: "What data we collect",
    content: `We collect only the information you choose to give us while using the app:

• Account information — your name, email address, and password (stored as an encrypted hash, never as plain text)
• Resume content — work history, education, skills, personal summary, and any other content you enter while building your resume
• Usage data — basic information like pages visited and features used, to help us improve the app
• Device information — browser type and general location region (country level only), collected automatically for security purposes

We do not collect payment information, government ID, or any sensitive personal categories like health data.`
  },
  {
    id: "why",
    icon: Target,
    title: "Why we collect it",
    content: `We use your data only to:

• Provide the resume-building and job search features of this platform
• Save your progress so you can return and edit your resume at any time
• Send important account notifications (password resets, account updates)
• Improve and fix the app based on how people use it

We do not use your data for advertising. We do not build profiles to sell. We do not send marketing emails unless you explicitly opt in.`
  },
  {
    id: "ai",
    icon: Bot,
    title: "How AI features work",
    content: `Takshila AI uses third-party AI services (such as Google Gemini or OpenAI) to power resume suggestions and improvements. When you use an AI feature, the specific content you submit for that feature is sent to the AI provider's API to generate a response.

Important things to know:
• Only the content you actively submit to an AI feature is sent — not your entire profile
• This transmission is encrypted over HTTPS
• We do not store AI provider responses beyond your current session
• AI providers may have their own data retention policies — we recommend reviewing them at openai.com or ai.google.dev

If you are uncomfortable with content being processed by a third-party AI, you can use the manual resume editing features without using any AI suggestions.`
  },
  {
    id: "sharing",
    icon: UserX,
    title: "Who we share your data with",
    content: `We do not sell your data. Period.

We share data only with:
• AI service providers (Google / OpenAI) — only content you actively submit to AI features, as described above
• Our hosting and database provider (Vercel / Supabase) — to store and serve your account data securely

We do not share your data with recruiters, employers, advertisers, data brokers, or any other third party.`
  },
  {
    id: "retention",
    icon: Calendar,
    title: "How long we keep your data",
    content: `Your data is kept as long as your account is active. If you delete your account:

• Your personal information (name, email) is permanently deleted within 30 days
• Your resume content is deleted immediately
• Basic anonymised usage logs may be retained for up to 90 days for security purposes

You can delete your account at any time from the Account Settings page.`
  },
  {
    id: "rights",
    icon: Scale,
    title: "Your rights",
    content: `You have the right to:

• Access — request a copy of all data we hold about you
• Correct — update any incorrect information at any time from your profile settings
• Delete — permanently delete your account and all associated data
• Export — download your resume data in a portable format
• Withdraw consent — stop using AI features at any time without losing your account

To exercise any of these rights, either use the controls in your Account Settings or email us directly. We respond within 5 business days.`
  },
  {
    id: "security",
    icon: Lock,
    title: "How we protect your data",
    content: `We take the following measures to keep your data safe:

• All data is transmitted over HTTPS — your connection to this site is always encrypted
• Passwords are hashed using bcrypt before storage — we never store or see your plain-text password
• Database access is restricted — only the application server can read your data
• API keys and secrets are stored in environment variables, never in code
• We use Vercel's platform security, which includes DDoS protection and automatic security patches

While no system is 100% secure, we apply serious engineering practices appropriate for a personal-data application.`
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies",
    content: `We use only the minimum cookies required for the app to work:

• Session cookie — keeps you logged in while you use the app
• Security cookie — protects against cross-site request forgery (CSRF)

We do not use advertising cookies, tracking pixels, or analytics services that share data with third parties. We do not use Google Analytics.`
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact us",
    content: `If you have any questions, concerns, or requests about your privacy, please reach out:

Creator: Abdul Shihan
Email: shihan@takshila.ai
Response time: within 5 business days

We take every message seriously and will always respond honestly.`
  }
];

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      color: "#1a1a1a"
    }}>
      {/* Navbar/Header */}
      <nav style={{
        background: "#E0F7FA",
        borderBottom: "1px solid #B2EBF2",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: "white",
              border: "1px solid #B2EBF2",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#006064"
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#006064",
            letterSpacing: "-0.5px"
          }}>
            Takshila<span style={{ color: "#f05523" }}>.</span>
          </div>
        </div>

        {/* Creator Photo Integration */}
        <div style={{
           width: 44,
           height: 44,
           borderRadius: "50%",
           overflow: "hidden",
           border: "2px solid #fff",
           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
           background: "#f0f0f0"
        }}>
          <img 
            src={creatorImg} 
            alt="Abdul Shihan"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.style.display = 'flex';
              e.target.parentNode.style.alignItems = 'center';
              e.target.parentNode.style.justifyContent = 'center';
              e.target.parentNode.innerHTML = '<div style="background: linear-gradient(135deg, #FF5F6D 0%, #BD00FF 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px;">AS</div>';
            }}
          />
        </div>
      </nav>

      <main style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "56px 24px 120px",
      }}>
        {/* Page Hero */}
        <header style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#E0F7FA",
            color: "#006064",
            fontSize: 12,
            fontWeight: 700,
            padding: "6px 16px",
            borderRadius: 20,
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            <Shield size={14} /> Last updated March 2025
          </div>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)", 
            fontWeight: 900, 
            margin: "0 0 16px", 
            color: "#006064",
            letterSpacing: "-0.03em" 
          }}>
            Takshila Privacy and Policy
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: "#555", 
            lineHeight: 1.6, 
            margin: "0 auto", 
            maxWidth: 600,
            fontWeight: 500
          }}>
            Transparent, human-friendly policies for the Takshila AI workspace.
            We treat your data the way we'd want ours treated.
          </p>
        </header>

        {/* Highlights Section */}
        <div style={{
          background: "linear-gradient(135deg, #E0F7FA 0%, #ffffff 100%)",
          border: "1px solid #B2EBF2",
          borderRadius: 24,
          padding: "32px",
          marginBottom: 56,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24,
          boxShadow: "0 10px 30px -10px rgba(0, 96, 100, 0.1)"
        }}>
          {[
            { icon: Shield, text: "Zero Data Selling", sub: "Your info is never a product." },
            { icon: Lock, text: "Encrypted Storage", sub: "Enterprise-grade passwords." },
            { icon: UserX, text: "Instant Deletion", sub: "Delete your traces in one click." }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ 
                width: 44, height: 44, borderRadius: 12, 
                background: "white", display: "flex", 
                alignItems: "center", justifyContent: "center",
                color: "#00BCD4", boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}>
                <item.icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#006064" }}>{item.text}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Explanatory Note */}
        <div style={{
          padding: "24px",
          background: "#fdf8f6",
          border: "1px solid #f9e2d9",
          borderRadius: 20,
          marginBottom: 40,
          display: "flex",
          gap: 16,
          alignItems: "flex-start"
        }}>
          <Info size={24} color="#f05523" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: "0 0 8px", color: "#f05523", fontWeight: 700 }}>About our Privacy Standards</h4>
            <p style={{ margin: 0, fontSize: 14, color: "#774a3b", lineHeight: 1.6 }}>
              This policy is written in plain English to ensure full transparency. 
              We prioritize your trust above all else. If you have any questions, 
              please expand the sections below or contact us directly.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map((section, i) => {
             const SectionIcon = section.icon;
             const isOpen = openSection === section.id;
             return (
              <div key={section.id} style={{
                border: "1px solid #eeeeee",
                borderRadius: 20,
                overflow: "hidden",
                background: isOpen ? "#E0F7FA" : "#ffffff",
                transition: "all 0.3s ease"
              }}>
                <button
                  onClick={() => toggle(section.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                       width: 36, height: 36, borderRadius: 10,
                       background: isOpen ? "white" : "#f5f5f5",
                       display: "flex", alignItems: "center", justifyContent: "center",
                       color: isOpen ? "#00BCD4" : "#999",
                       transition: "all 0.3s ease"
                    }}>
                      <SectionIcon size={20} />
                    </div>
                    <span style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: isOpen ? "#006064" : "#1a1a1a"
                    }}>
                      {section.title}
                    </span>
                  </div>
                  <div style={{
                    color: isOpen ? "#00BCD4" : "#bbb",
                    transition: "transform 0.3s ease",
                    transform: isOpen ? "rotate(180deg)" : "none"
                  }}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                {isOpen && (
                  <div style={{
                    padding: "0 32px 32px 76px",
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: "#444",
                    whiteSpace: "pre-line",
                  }}>
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
