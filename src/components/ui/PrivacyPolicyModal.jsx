import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Shield, ClipboardList, Target, Bot, UserX, Calendar, Scale, 
  Lock, Cookie, Mail, X, Plus, Minus, MoveDown
} from "lucide-react";

const SECTIONS = [
  {
    id: "collect",
    icon: ClipboardList,
    title: "What data we collect",
    body: `We collect only the information you choose to provide while using the app:

• Account info — your name, email address, and password (stored as an encrypted hash, never plain text)
• Resume content — work history, education, skills, and any content you enter while building your resume
• Usage data — pages visited and features used, to help us improve the app
• Device info — browser type and general region (country level only), collected automatically for security

We do not collect payment info, government ID, or sensitive categories like health data.`,
  },
  {
    id: "why",
    icon: Target,
    title: "Why we collect it",
    body: `We use your data only to:

• Provide the resume-building and job search features of this platform
• Save your progress so you can return and edit your resume any time
• Send important account notifications (password resets, account updates)
• Improve and fix the app based on how people use it

We do not use your data for advertising. We do not build profiles to sell. We do not send marketing emails unless you explicitly opt in.`,
  },
  {
    id: "ai",
    icon: Bot,
    title: "How AI features work",
    body: `Takshila AI uses third-party AI services (Google Gemini / OpenAI) to power resume suggestions. When you use an AI feature, the specific content you submit is sent to the AI provider's API to generate a response.

Important things to know:
• Only the content you actively submit to an AI feature is sent — not your entire profile
• This transmission is encrypted over HTTPS
• We do not store AI provider responses beyond your current session
• AI providers may have their own data retention policies

If you are uncomfortable with content being processed by a third party, you can use the manual editing features without using any AI suggestions.`,
  },
  {
    id: "sharing",
    icon: UserX,
    title: "Who we share your data with",
    body: `We do not sell your data. Period.

We share data only with:
• AI service providers (Google / OpenAI) — only content you actively submit to AI features
• Our hosting and database provider (Vercel / Supabase) — to store and serve your account data securely

We do not share your data with recruiters, employers, advertisers, data brokers, or any other third party.`,
  },
  {
    id: "retention",
    icon: Calendar,
    title: "How long we keep your data",
    body: `Your data is kept as long as your account is active. If you delete your account:

• Your personal information (name, email) is permanently deleted within 30 days
• Your resume content is deleted immediately
• Basic anonymised usage logs may be retained for up to 90 days for security purposes

You can delete your account at any time from the Account Settings page.`,
  },
  {
    id: "rights",
    icon: Scale,
    title: "Your rights",
    body: `You have the right to:

• Access — request a copy of all data we hold about you
• Correct — update any incorrect information at any time from your profile settings
• Delete — permanently delete your account and all associated data
• Export — download your resume data in a portable format
• Withdraw consent — stop using AI features at any time without losing your account

To exercise any of these rights, use the controls in Account Settings or email us directly.`,
  },
  {
    id: "security",
    icon: Lock,
    title: "How we protect your data",
    body: `We apply the following security measures:

• All data is transmitted over HTTPS — your connection to this site is always encrypted
• Passwords are hashed using bcrypt before storage — we never store or see your plain-text password
• Database access is restricted — only the application server can read your data
• API keys and secrets are stored in environment variables, never in code
• We use Vercel's platform security, which includes DDoS protection and automatic security patches`,
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies",
    body: `We use only the minimum cookies required for the app to work:

• Session cookie — keeps you logged in while you use the app
• Security cookie — protects against cross-site request forgery (CSRF)

We do not use advertising cookies, tracking pixels, or analytics services that share data with third parties. We do not use Google Analytics.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact us",
    body: `If you have any questions, concerns, or requests about your privacy, please reach out:

Creator: Abdul Shihan
Project: Takshila AI
Response time: within 5 business days

We take every message seriously and will always respond honestly.`,
  },
];

export const PrivacyPolicyModal = ({ isOpen, onAccept, onClose, isFirstTime = false }) => {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // Account for small differences in rounding
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));
    if (progress > 0.95 || scrollHeight <= clientHeight) setHasScrolledToBottom(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
      setHasScrolledToBottom(false);
      setOpenSection(null);
      // Check if it's already at bottom or if content is too short to scroll
      setTimeout(handleScroll, 100);
    }
  }, [isOpen, handleScroll]);

  if (!isOpen) return null;

  const canAccept = !isFirstTime || hasScrolledToBottom;

  return (
    <div
      className="privacy-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(10,10,20,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isFirstTime) onClose?.(); }}
    >
      <style>{`
        .privacy-modal-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .privacy-modal-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .privacy-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 10px;
        }
        .privacy-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.18);
        }
      `}</style>

      <div
        className="privacy-modal-card"
        style={{
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          background: "#0f1117",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          animation: "modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", flexShrink: 0, position: "relative" }}>
          <div style={{
            height: "100%",
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #6c63ff, #3ecfb2)",
            transition: "width 0.1s linear",
            borderRadius: 2,
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: "24px 32px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #6c63ff22, #3ecfb222)",
              border: "1px solid rgba(108,99,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#a8a4ff"
            }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, color: "rgba(108,99,255,0.8)", textTransform: "uppercase", marginBottom: 3 }}>
                Legal & Security
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>
                Privacy Policy
              </h2>
            </div>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "none", borderRadius: 10,
                width: 36, height: 36,
                cursor: "pointer", color: "rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Intro banner */}
        <div style={{
          margin: "20px 24px 0",
          padding: "16px 20px",
          background: "rgba(108,99,255,0.07)",
          border: "1px solid rgba(108,99,255,0.15)",
          borderRadius: 16,
          flexShrink: 0,
        }}>
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            Built by <span style={{ color: "#a8a4ff", fontWeight: 700 }}>Abdul Shihan</span>. We prioritize your privacy above all. Your data belongs to you, and you have complete control over it.
          </p>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="privacy-modal-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch", // for nice mobile scrolling
            padding: "24px",
            paddingBottom: "40px",
          }}
        >
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    background: isOpen ? "rgba(108,99,255,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isOpen ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: isOpen ? "14px 14px 0 0" : 14,
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16,
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ 
                      color: isOpen ? "#a8a4ff" : "rgba(255,255,255,0.5)",
                      transition: "color 0.2s"
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: isOpen ? "#fff" : "rgba(255,255,255,0.85)",
                      transition: "color 0.2s"
                    }}>
                      {section.title}
                    </span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)" }}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                {isOpen && (
                  <div style={{
                    padding: "18px 24px 22px",
                    background: "rgba(108,99,255,0.05)",
                    borderWidth: "0 1px 1px 1px",
                    borderColor: "rgba(108,99,255,0.25)",
                    borderStyle: "solid",
                    borderRadius: "0 0 14px 14px",
                    fontSize: 13.5,
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.65)",
                    whiteSpace: "pre-line",
                    animation: "slideIn 0.2s ease-out",
                  }}>
                    {section.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Accept area */}
        <div style={{
          padding: "20px 24px 28px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          background: "linear-gradient(to top, #0f1117 80%, rgba(15,17,23,0))",
          position: "relative",
          zIndex: 10,
        }}>
          {isFirstTime && !hasScrolledToBottom && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 8,
              marginBottom: 16,
              color: "#a8a4ff",
              fontSize: 12,
              fontWeight: 600,
              animation: "bounce 2s infinite",
            }}>
              <MoveDown size={14} />
              <span>Please scroll down to accept</span>
            </div>
          )}
          <button
            onClick={canAccept ? onAccept : undefined}
            style={{
              width: "100%",
              padding: "16px",
              background: canAccept ? "linear-gradient(135deg, #6c63ff, #3ecfb2)" : "rgba(255,255,255,0.05)",
              border: "none",
              borderRadius: 16,
              color: canAccept ? "#fff" : "rgba(255,255,255,0.2)",
              fontSize: 15,
              fontWeight: 700,
              cursor: canAccept ? "pointer" : "not-allowed",
              boxShadow: canAccept ? "0 12px 24px rgba(108,99,255,0.25)" : "none",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {isFirstTime ? (
              canAccept ? (
                <>Accept & Continue <Shield size={18} /></>
              ) : (
                "Read the policy to continue"
              )
            ) : "Close"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          60% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyModal;
