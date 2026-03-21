import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Shield, ClipboardList, Target, Bot, UserX, Calendar, Scale, 
  Lock, Cookie, Mail, X, Plus, Minus, MoveDown, Info
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
    // Robust scroll-to-bottom calculation
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 3;
    const progress = scrollTop / (scrollHeight - clientHeight || 1);
    
    setScrollProgress(Math.min(progress, 1));
    if (isAtBottom || scrollHeight <= clientHeight) {
      setHasScrolledToBottom(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
      setHasScrolledToBottom(false);
      setOpenSection(null);
      // Ensure the check runs after DOM is painted
      const timer = setTimeout(handleScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleScroll]);

  if (!isOpen) return null;

  const canAccept = !isFirstTime || hasScrolledToBottom;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isFirstTime) onClose?.(); }}
    >
      <style>{`
        .privacy-modal-card {
           animation: privacyModalPop 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        @keyframes privacyModalPop {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .privacy-scroll-btn {
          animation: privacyBounce 2s infinite;
        }
        @keyframes privacyBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
        }
        .privacy-modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .privacy-modal-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .privacy-modal-scroll::-webkit-scrollbar-thumb {
          background: #00BCD4;
          border-radius: 10px;
        }
        .privacy-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: #0097A7;
        }
      `}</style>

      <div
        className="privacy-modal-card"
        style={{
          width: "100%",
          maxWidth: 620,
          height: "85vh", // Fixed height to ensure overflow works
          background: "#ffffff",
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #E0F7FA",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Top Accent Bar */}
        <div style={{
          height: 6,
          background: `linear-gradient(90deg, #00BCD4 0%, #00BCD4 ${scrollProgress * 100}%, #f05523 ${scrollProgress * 100}%, #f05523 100%)`,
          flexShrink: 0,
        }} />

        {/* Header */}
        <header style={{
          padding: "24px 32px 20px",
          background: "#E0F7FA", // Aqua Background
          borderBottom: "1px solid #B2EBF2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Creator Logo "AS" */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF5F6D 0%, #BD00FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 20,
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(255, 95, 109, 0.3)",
              flexShrink: 0,
            }}>
              AS
            </div>
            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 900,
                color: "#006064",
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}>
                Takshila<span style={{ color: "#f05523" }}>.</span>
              </div>
              <h2 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#1a1a1a",
                marginTop: 2
              }}>
                Takshila Privacy and Policy
              </h2>
            </div>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              style={{
                background: "white",
                border: "1px solid #B2EBF2",
                borderRadius: 12,
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#006064",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              <X size={20} />
            </button>
          )}
        </header>

        {/* Branding Banner */}
        <div style={{
          padding: "14px 32px",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #f0f0f0",
          flexShrink: 0,
        }}>
          <Info size={16} color="#00BCD4" />
          <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>
            Your privacy is our mission. We build tools, not track records.
          </span>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="privacy-modal-scroll"
          style={{
            flex: 1, // Takes up remaining space
            overflowY: "auto", // Forces internal scroll
            padding: "32px",
            minHeight: 0, // CRITICAL for flex scrolling
          }}
        >
          <div style={{ maxWidth: "100%", margin: "0 auto" }}>
            <p style={{
              fontSize: 15,
              color: "#444",
              lineHeight: 1.6,
              marginBottom: 32,
              paddingLeft: 4,
              borderLeft: "4px solid #f05523"
            }}>
              This policy explains what data Takshila AI collects, how it is used,
              and the rights you have. Written by humans, for humans.
            </p>

            {SECTIONS.map((section, idx) => {
              const Icon = section.icon;
              const isOpen = openSection === section.id;
              return (
                <div key={section.id} style={{ marginBottom: 12 }}>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 20px",
                      background: isOpen ? "#E0F7FA" : "#fafafa",
                      border: `1px solid ${isOpen ? "#B2EBF2" : "#eeeeee"}`,
                      borderRadius: isOpen ? "16px 16px 0 0" : 16,
                      cursor: "pointer",
                      textAlign: "left",
                      gap: 16,
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 8, 
                        background: isOpen ? "#ffffff" : "#eeeeee",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isOpen ? "#00BCD4" : "#888"
                      }}>
                        <Icon size={18} />
                      </div>
                      <span style={{ 
                        fontSize: 15, 
                        fontWeight: 600, 
                        color: isOpen ? "#006064" : "#1a1a1a"
                      }}>
                        {section.title}
                      </span>
                    </div>
                    <div style={{ color: isOpen ? "#00BCD4" : "#bbb" }}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: "20px 24px 28px 66px",
                      background: "#ffffff",
                      border: "1px solid #B2EBF2",
                      borderTop: "none",
                      borderRadius: "0 0 16px 16px",
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: "#444",
                      whiteSpace: "pre-line",
                    }}>
                      {section.body}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          padding: "24px 32px 32px",
          background: "#E0F7FA",
          borderTop: "1px solid #B2EBF2",
          flexShrink: 0,
        }}>
          {isFirstTime && !hasScrolledToBottom && (
            <div className="privacy-scroll-btn" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 16,
              color: "#006064",
              fontSize: 13,
              fontWeight: 700,
            }}>
              <MoveDown size={16} />
              <span>Scroll to the bottom to accept</span>
            </div>
          )}
          
          <button
            onClick={canAccept ? onAccept : undefined}
            style={{
              width: "100%",
              padding: "16px",
              background: canAccept ? "#f05523" : "rgba(0, 0, 0, 0.05)",
              color: canAccept ? "white" : "#999",
              border: "none",
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 800,
              cursor: canAccept ? "pointer" : "default",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: canAccept ? "0 10px 20px -5px rgba(240, 85, 35, 0.4)" : "none"
            }}
          >
            {isFirstTime ? (
              canAccept ? (
                <>Accept & Continue <Shield size={20} /></>
              ) : (
                "Please read the policy"
              )
            ) : "Close Policy"}
          </button>
          
          <div style={{ 
            marginTop: 16, 
            textAlign: "center", 
            fontSize: 12, 
            color: "#006064", 
            opacity: 0.7,
            fontWeight: 500
          }}>
            © 2025 Takshila AI · All Data Strictly Private
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
