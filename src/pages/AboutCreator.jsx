import React from "react";

export default function AboutCreator() {
  return (
    <div style={{
      maxWidth: 780,
      margin: "0 auto",
      padding: "56px 24px 80px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#1a1a1a"
    }}>

      {/* Hero section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginBottom: 64
      }}>
        {/* Avatar */}
        <div style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 24,
          letterSpacing: -1
        }}>
          AS
        </div>

        <div style={{
          display: "inline-block",
          background: "#EEEDFE",
          color: "#534AB7",
          fontSize: 12,
          fontWeight: 600,
          padding: "4px 14px",
          borderRadius: 20,
          marginBottom: 16,
          letterSpacing: 0.5,
          textTransform: "uppercase"
        }}>
          Creator &amp; Developer
        </div>

        <h1 style={{
          fontSize: 40,
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.15,
          background: "linear-gradient(135deg, #534AB7, #1D9E75)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Abdul Shihan
        </h1>

        <p style={{
          fontSize: 18,
          color: "#666",
          margin: "0 0 8px",
          fontWeight: 400
        }}>
          ABCS Student · Intern · Curious Builder
        </p>

        <p style={{
          fontSize: 14,
          color: "#999",
          margin: 0
        }}>
          Sri Lanka
        </p>
      </div>

      {/* Story section */}
      <div style={{
        background: "#fafafa",
        border: "1px solid #eee",
        borderRadius: 16,
        padding: "36px 40px",
        marginBottom: 32,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          background: "linear-gradient(180deg, #534AB7, #1D9E75)"
        }} />

        <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 20px" }}>
          The story behind Takshila AI
        </h2>

        <p style={{ fontSize: 15, lineHeight: 1.85, color: "#444", margin: "0 0 16px" }}>
          Hi — I'm Abdul Shihan, a student studying ABCS who has always been drawn to
          innovative ideas and the kind of curiosity that makes you pull something apart
          just to understand how it works. That curiosity is what got me into building
          digital things in the first place.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.85, color: "#444", margin: "0 0 16px" }}>
          Takshila AI started as an internship project — something I needed to submit as
          part of my program. But somewhere along the way, I realised it could be more
          than just an assignment. I saw how many people around me struggled with writing
          a decent resume — not because they lacked experience, but because they didn't
          know how to present it well. So I kept building.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.85, color: "#444", margin: "0 0 16px" }}>
          I added AI-powered suggestions, a job search feature, and a cleaner interface —
          not to over-engineer it, but because I genuinely wanted it to be useful for the
          people who need it most. If someone can walk away with a stronger resume and a
          better shot at a job, then it was worth the late nights.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.85, color: "#444", margin: 0 }}>
          I'm also an artist at heart. Creativity isn't something I switch on for design —
          it's how I think. That's how I ended up here: part student, part builder, part
          artist, trying to make something that actually helps people.
        </p>
      </div>

      {/* What I believe cards */}
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 20px" }}>
        What this app stands for
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 40
      }}>
        {[
          {
            color: "#EEEDFE",
            accent: "#534AB7",
            title: "Built for real people",
            text: "Not for big companies or recruiters. For the person sitting at home trying to write their first resume."
          },
          {
            color: "#E1F5EE",
            accent: "#0F6E56",
            title: "Honest about data",
            text: "Your resume is yours. I never sell it, share it, or read it. Delete everything in one click — no questions asked."
          },
          {
            color: "#FAEEDA",
            accent: "#854F0B",
            title: "Always learning",
            text: "This app will keep improving. I'm still a student and still learning — and that's exactly why I'll keep updating it."
          },
          {
            color: "#E6F1FB",
            accent: "#185FA5",
            title: "Open to feedback",
            text: "I genuinely read every message. If something is broken, confusing, or could be better — tell me directly."
          }
        ].map((card, i) => (
          <div key={i} style={{
            background: card.color,
            borderRadius: 12,
            padding: "20px",
          }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 600,
              color: card.accent,
              margin: "0 0 8px"
            }}>
              {card.title}
            </h3>
            <p style={{
              fontSize: 13,
              color: card.accent,
              margin: 0,
              lineHeight: 1.7,
              opacity: 0.85
            }}>
              {card.text}
            </p>
          </div>
        ))}
      </div>

      {/* Tech stack section */}
      <div style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 16,
        padding: "28px 32px",
        marginBottom: 32
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>
          How it's built
        </h2>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 20px" }}>
          No black boxes. Here's exactly what technology this app runs on so you know
          your data is on serious, reliable infrastructure:
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12
        }}>
          {[
            { label: "Frontend", value: "Next.js / React" },
            { label: "Hosting", value: "Vercel" },
            { label: "Database", value: "Supabase / Postgres" },
            { label: "AI features", value: "Google Gemini API" },
            { label: "Auth", value: "Secure session-based" },
            { label: "Transport", value: "HTTPS everywhere" }
          ].map((item, i) => (
            <div key={i} style={{
              background: "#f7f7f7",
              borderRadius: 8,
              padding: "12px 14px"
            }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#aaa", margin: "16px 0 0", fontStyle: "italic" }}>
          * Update these values to match your actual tech stack before publishing.
        </p>
      </div>

      {/* Contact section */}
      <div style={{
        background: "linear-gradient(135deg, #EEEDFE 0%, #E1F5EE 100%)",
        borderRadius: 16,
        padding: "32px 40px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 10px", color: "#26215C" }}>
          Get in touch
        </h2>
        <p style={{ fontSize: 14, color: "#534AB7", lineHeight: 1.7, margin: "0 0 24px" }}>
          Have a question, found a bug, or just want to say hi? I read every message personally.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <a
            href="mailto:your-email@domain.com"
            style={{
              display: "inline-block",
              background: "#534AB7",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none"
            }}
          >
            Email me directly
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#534AB7",
              border: "1.5px solid #534AB7",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none"
            }}
          >
            LinkedIn
          </a>
        </div>
        <p style={{ fontSize: 12, color: "#7F77DD", margin: "20px 0 0" }}>
          I usually reply within 5 business days.
        </p>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48,
        textAlign: "center",
        fontSize: 13,
        color: "#bbb"
      }}>
        Takshila AI · Made with curiosity by Abdul Shihan ·{" "}
        <a href="/privacy" style={{ color: "#999", textDecoration: "none" }}>
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
