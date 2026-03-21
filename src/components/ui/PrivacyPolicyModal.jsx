import React, { useState, useRef, useEffect, useCallback } from "react";

const SECTIONS = [
  {
    id: "collect",
    emoji: "📋",
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
    emoji: "🎯",
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
    emoji: "🤖",
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
    emoji: "🚫",
    title: "Who we share your data with",
    body: `We do not sell your data. Period.

We share data only with:
• AI service providers (Google / OpenAI) — only content you actively submit to AI features
• Our hosting and database provider (Vercel / Supabase) — to store and serve your account data securely

We do not share your data with recruiters, employers, advertisers, data brokers, or any other third party.`,
  },
  {
    id: "retention",
    emoji: "🗓️",
    title: "How long we keep your data",
    body: `Your data is kept as long as your account is active. If you delete your account:

• Your personal information (name, email) is permanently deleted within 30 days
• Your resume content is deleted immediately
• Basic anonymised usage logs may be retained for up to 90 days for security purposes

You can delete your account at any time from the Account Settings page.`,
  },
  {
    id: "rights",
    emoji: "⚖️",
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
    emoji: "🔒",
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
    emoji: "🍪",
    title: "Cookies",
    body: `We use only the minimum cookies required for the app to work:

• Session cookie — keeps you logged in while you use the app
• Security cookie — protects against cross-site request forgery (CSRF)

We do not use advertising cookies, tracking pixels, or analytics services that share data with third parties. We do not use Google Analytics.`,
  },
  {
    id: "contact",
    emoji: "✉️",
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
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));
    if (progress > 0.97) setHasScrolledToBottom(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
      setHasScrolledToBottom(false);
      setOpenSection(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canAccept = !isFirstTime || hasScrolledToBottom;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
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
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "88vh",
          background: "#0f1117",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
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
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #6c63ff22, #3ecfb222)",
                border: "1px solid rgba(108,99,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>🛡️</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, color: "#6c63ff", textTransform: "uppercase", marginBottom: 2 }}>
                  Takshila AI
                </div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  Privacy Policy
                </h2>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
              Last updated March 2025 · Please read before continuing
            </p>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "none", borderRadius: 8,
                width: 32, height: 32,
                cursor: "pointer", color: "rgba(255,255,255,0.5)",
                fontSize: 18, lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Intro banner */}
        <div style={{
          margin: "0 20px",
          marginTop: 20,
          padding: "14px 18px",
          background: "rgba(108,99,255,0.08)",
          border: "1px solid rgba(108,99,255,0.2)",
          borderRadius: 12,
          flexShrink: 0,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            This app was built by <span style={{ color: "#a8a4ff", fontWeight: 600 }}>Abdul Shihan</span>, a student developer. Your resume data is yours — we never sell it, share it, or use it for advertising. You can delete everything in one click.
          </p>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px 8px",
            scrollbarWidth: "thin",
          }}
        >
          {SECTIONS.map((section) => (
            <div key={section.id} style={{ marginBottom: 6 }}>
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: openSection === section.id ? "rgba(108,99,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${openSection === section.id ? "rgba(108,99,255,0.25)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: openSection === section.id ? "10px 10px 0 0" : 10,
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 15 }}>{section.emoji}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: openSection === section.id ? "#a8a4ff" : "rgba(255,255,255,0.8)" }}>
                    {section.title}
                  </span>
                </div>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", transform: openSection === section.id ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
              </button>
              {openSection === section.id && (
                <div style={{
                  padding: "14px 18px 16px",
                  background: "rgba(108,99,255,0.06)",
                  borderSize: "0 1px 1px 1px",
                  borderColor: "rgba(108,99,255,0.2)",
                  borderStyle: "solid",
                  borderRadius: "0 0 10px 10px",
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.6)",
                  whiteSpace: "pre-line",
                }}>
                  {section.body}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer / Accept area */}
        <div style={{
          padding: "16px 20px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          background: "#0f1117",
        }}>
          {isFirstTime && !hasScrolledToBottom && (
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
              ↓ Scroll to the bottom to accept
            </p>
          )}
          <button
            onClick={canAccept ? onAccept : undefined}
            style={{
              width: "100%",
              padding: "14px",
              background: canAccept ? "linear-gradient(135deg, #6c63ff, #3ecfb2)" : "rgba(255,255,255,0.07)",
              border: "none",
              borderRadius: 12,
              color: canAccept ? "#fff" : "rgba(255,255,255,0.25)",
              fontSize: 14,
              fontWeight: 600,
              cursor: canAccept ? "pointer" : "not-allowed",
            }}
          >
            {isFirstTime ? (canAccept ? "Accept & Continue →" : "Read the policy to continue") : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
