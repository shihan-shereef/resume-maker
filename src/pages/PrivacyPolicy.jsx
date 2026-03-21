import React, { useState } from "react";

const sections = [
  {
    id: "who",
    title: "Who we are",
    content: `Takshila AI is an AI-powered resume builder and career workspace created and operated by Abdul Shihan, a student developer based in Sri Lanka. This project was originally built as part of an internship submission and has since been expanded with additional features to genuinely help job seekers create professional resumes with ease.

You can contact the creator directly at: shihan@takshila.ai (replace with your real email)`
  },
  {
    id: "collect",
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
    title: "Who we share your data with",
    content: `We do not sell your data. Period.

We share data only with:
• AI service providers (Google / OpenAI) — only content you actively submit to AI features, as described above
• Our hosting and database provider (Vercel / Supabase or equivalent) — to store and serve your account data securely

We do not share your data with recruiters, employers, advertisers, data brokers, or any other third party.`
  },
  {
    id: "retention",
    title: "How long we keep your data",
    content: `Your data is kept as long as your account is active. If you delete your account:

• Your personal information (name, email) is permanently deleted within 30 days
• Your resume content is deleted immediately
• Basic anonymised usage logs may be retained for up to 90 days for security purposes

You can delete your account at any time from the Account Settings page.`
  },
  {
    id: "rights",
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
    id: "cookies",
    title: "Cookies",
    content: `We use only the minimum cookies required for the app to work:

• Session cookie — keeps you logged in while you use the app
• Security cookie — protects against cross-site request forgery (CSRF)

We do not use advertising cookies, tracking pixels, or analytics services that share data with third parties. We do not use Google Analytics.`
  },
  {
    id: "security",
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
    id: "children",
    title: "Children's privacy",
    content: `Takshila AI is intended for users who are 16 years of age or older. We do not knowingly collect personal data from children under 16. If you believe a child has created an account, please contact us and we will delete the account promptly.`
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: `If we make significant changes to this privacy policy, we will notify you by email or by showing a notice when you next log in. The "last updated" date at the top of this page will always reflect the most recent version.

Continuing to use the app after changes are announced means you accept the updated policy.`
  },
  {
    id: "contact",
    title: "Contact us",
    content: `If you have any questions, concerns, or requests about your privacy, please reach out:

Creator: Abdul Shihan
Email: your-email@domain.com (replace with your real email)
Response time: within 5 business days

We take every message seriously and will always respond honestly.`
  }
];

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div style={{
      maxWidth: 760,
      margin: "0 auto",
      padding: "48px 24px 80px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#1a1a1a"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-block",
          background: "#EAF3DE",
          color: "#3B6D11",
          fontSize: 12,
          fontWeight: 500,
          padding: "4px 12px",
          borderRadius: 20,
          marginBottom: 16
        }}>
          Effective from January 2025 · Last updated March 2025
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.2 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, margin: 0, maxWidth: 580 }}>
          This policy explains what data Takshila AI collects, how it is used,
          and the rights you have over your information. Written in plain English —
          no legal jargon.
        </p>
      </div>

      {/* Quick summary banner */}
      <div style={{
        background: "#E6F1FB",
        border: "1px solid #B5D4F4",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 36,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16
      }}>
        {[
          { icon: "🚫", text: "We never sell your data" },
          { icon: "🔒", text: "Passwords are always encrypted" },
          { icon: "🗑️", text: "Delete your account anytime" },
          { icon: "📧", text: "We reply within 5 days" }
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: "#185FA5", fontWeight: 500 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Accordion sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sections.map((section, i) => (
          <div key={section.id} style={{
            border: "0.5px solid #e0e0e0",
            borderRadius: 10,
            overflow: "hidden",
            background: openSection === section.id ? "#fff" : "#fafafa"
          }}>
            <button
              onClick={() => toggle(section.id)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#888",
                  minWidth: 24
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#1a1a1a"
                }}>
                  {section.title}
                </span>
              </div>
              <span style={{
                fontSize: 18,
                color: "#888",
                transform: openSection === section.id ? "rotate(45deg)" : "none",
                transition: "transform 0.2s",
                flexShrink: 0
              }}>+</span>
            </button>
            {openSection === section.id && (
              <div style={{
                padding: "0 20px 20px 56px",
                fontSize: 14,
                lineHeight: 1.8,
                color: "#444",
                whiteSpace: "pre-line"
              }}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 48,
        paddingTop: 24,
        borderTop: "1px solid #eee",
        fontSize: 13,
        color: "#888",
        textAlign: "center"
      }}>
        Built with care by Abdul Shihan · Takshila AI ·{" "}
        <a href="/about" style={{ color: "#378ADD", textDecoration: "none" }}>
          About this project
        </a>
      </div>
    </div>
  );
}
