import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Shield, ClipboardList, Target, Bot, UserX, Calendar, Scale, 
  Lock, Cookie, Mail, X, Plus, Minus, MoveDown, Info, UserCircle
} from "lucide-react";
import creatorImg from "../../assets/creator.jpg";

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
    
    // Check if we are at the bottom with a small buffer
    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
    const progress = scrollTop / (scrollHeight - clientHeight || 1);
    
    setScrollProgress(Math.min(progress, 1));
    if (atBottom || scrollHeight <= clientHeight) {
      setHasScrolledToBottom(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
      setHasScrolledToBottom(false);
      setOpenSection(null);
      // Trigger a scroll check after the modal content has potentially rendered
      const timer = setTimeout(handleScroll, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleScroll, openSection]); // Include openSection to re-verify scroll when an accordion opens

  if (!isOpen) return null;

  const canAccept = !isFirstTime || hasScrolledToBottom;

  return (
    <div
      className="privacy-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "env(safe-area-inset-top, 20px) 20px env(safe-area-inset-bottom, 20px)",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isFirstTime) onClose?.(); }}
    >
      <style>{`
        .privacy-modal-scroll-container {
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-gutter: stable;
          overscroll-behavior: contain;
        }
        .privacy-modal-scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .privacy-modal-scroll-container::-webkit-scrollbar-track {
          background: #f0f7f8;
          border-radius: 4px;
        }
        .privacy-modal-scroll-container::-webkit-scrollbar-thumb {
          background: #00BCD4;
          border-radius: 4px;
          border: 2px solid #f0f7f8;
        }
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .bounce-arrow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 600,
          height: "90vh", // FIXED OVERALL HEIGHT
          maxHeight: 800,
          background: "#ffffff",
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 30px 60px -12px rgba(0,0,0,0.3)",
          border: "1px solid #E0F7FA",
        }}
      >
        {/* Progress header bar */}
        <div style={{
          height: 6,
          background: "#f0f0f0",
          flexShrink: 0,
        }}>
          <div style={{
            height: "100%",
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #00BCD4, #f05523)",
            transition: "width 0.2s ease-out",
          }} />
        </div>

        {/* Header Section */}
        <header style={{
          padding: "24px 32px",
          background: "#E0F7FA",
          borderBottom: "1px solid #B2EBF2",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Creator Photo integration */}
            <div style={{
               width: 56,
               height: 56,
               borderRadius: "50%",
               overflow: "hidden",
               border: "3px solid #fff",
               boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
               flexShrink: 0,
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
                  e.target.parentNode.innerHTML = '<div style="background: linear-gradient(135deg, #FF5F6D 0%, #BD00FF 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800;">AS</div>';
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#006064", letterSpacing: "-0.5px" }}>
                Takshila<span style={{ color: "#f05523" }}>.</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                Takshila Privacy and Policy
              </h2>
            </div>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              style={{
                background: "white", border: "1px solid #B2EBF2", borderRadius: "50%",
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#006064"
              }}
            >
              <X size={18} />
            </button>
          )}
        </header>

        {/* SCROLLABLE AREA - THE BULLERPROOF PART */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="privacy-modal-scroll-container"
          style={{
            flex: "1 1 auto", // Takes all available space between header and footer
            minHeight: 0,     // CRITICAL for nested flexbox scrolling
            padding: "32px",
            background: "#ffffff",
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", background: "#f8fdfd", borderRadius: 12,
              border: "1px dashed #00BCD4", color: "#006064", fontSize: 13,
              fontWeight: 500
            }}>
              <Info size={16} />
              <span>We collect only what is necessary for your career growth.</span>
            </div>
          </div>

          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, marginBottom: 32 }}>
            This policy outlines how your information is handled within the Takshila AI ecosystem. 
            <strong> Please scroll through all sections to enable the "Accept" button.</strong>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isOpen = openSection === section.id;
              return (
                <div key={section.id} style={{
                  border: `1px solid ${isOpen ? "#00BCD4" : "#f0f0f0"}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "all 0.2s ease"
                }}>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between", padding: "18px 20px",
                      background: isOpen ? "#E0F7FA" : "#fff",
                      cursor: "pointer", border: "none", textAlign: "left", gap: 14
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ color: isOpen ? "#00BCD4" : "#999" }}>
                        <Icon size={18} />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{section.title}</span>
                    </div>
                    <div style={{ color: isOpen ? "#00BCD4" : "#ccc" }}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: "20px 24px 24px 52px", background: "#fff",
                      fontSize: 14, lineHeight: 1.8, color: "#555",
                      whiteSpace: "pre-line", borderTop: "1px solid #E0F7FA"
                    }}>
                      {section.body}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Spacer at the bottom to ensure the user can scroll past the last item */}
          <div style={{ height: 100 }} />
        </div>

        {/* Footer Section */}
        <footer style={{
          padding: "24px 32px 32px",
          background: "#E0F7FA",
          borderTop: "1px solid #B2EBF2",
          flexShrink: 0,
        }}>
          {isFirstTime && !hasScrolledToBottom && (
            <div className="bounce-arrow" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginBottom: 16, color: "#006064", fontSize: 13, fontWeight: 800
            }}>
              <MoveDown size={14} />
              <span>Continue scrolling to accept</span>
            </div>
          )}
          
          <button
            onClick={canAccept ? onAccept : undefined}
            style={{
              width: "100%", padding: "16px",
              background: canAccept ? "#f05523" : "rgba(0,0,0,0.05)",
              color: canAccept ? "white" : "#aaa",
              border: "none", borderRadius: 16, fontSize: 16, fontWeight: 800,
              cursor: canAccept ? "pointer" : "default",
              transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              boxShadow: canAccept ? "0 10px 25px -5px rgba(240, 85, 35, 0.4)" : "none"
            }}
          >
            {isFirstTime ? (
              canAccept ? (
                <>I Accept & Understand <Shield size={18} /></>
              ) : (
                "Please scroll to the bottom"
              )
            ) : "Close Policy"}
          </button>
          
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "#006064", opacity: 0.6, fontWeight: 600 }}>
            SECURE ACCESS · TAKSHILA AI 2025
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
