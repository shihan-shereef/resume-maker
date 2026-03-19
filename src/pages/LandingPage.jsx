import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TakshilaLanding.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Cursor
    const cur = document.getElementById("cur");
    const moveCursor = (e) => {
      if(cur) {
        cur.style.left = e.clientX + "px";
        cur.style.top  = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll("button, a, .eco-card, .mwin, .tilt-card");
    const addOn = () => cur?.classList.add("on");
    const removeOn = () => cur?.classList.remove("on");
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", addOn);
      el.addEventListener("mouseleave", removeOn);
    });

    // 2. Nav Scroll
    const nav = document.getElementById("nav");
    const handleScroll = () => {
      if(nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // 3. "Unified by Intelligence" letter-drop
    const uby = document.getElementById("uby");
    let ubyObs;
    if(uby) {
      const ubyText = "Unified by Intelligence.";
      uby.innerHTML = ubyText.split("").map(ch => {
        if (ch === " ") return '<span class="uby-char space">&nbsp;</span>';
        const rot = (Math.random() * 24 - 12).toFixed(1);
        return `<span class="uby-char" style="--rot:${rot}deg">${ch}</span>`;
      }).join("");
      const ubyChars = uby.querySelectorAll(".uby-char:not(.space)");
      ubyObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          ubyChars.forEach((ch, i) => setTimeout(() => ch.classList.add("landed"), i * 38));
          if(ubyObs) ubyObs.disconnect();
        }
      }, { threshold: 0.5 });
      ubyObs.observe(uby);
    }

    // 4. Scramble text
    const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$&*";
    const activeScrambles = [];
    function scramble(el) {
      const orig = el.dataset.text || el.textContent;
      let raf, i = 0;
      const onEnter = () => {
        cancelAnimationFrame(raf); i = 0;
        const MAX = orig.length * 3;
        function tick() {
          const rev = Math.floor(i / 3);
          el.textContent = orig.split("").map((c, idx) => {
            if (' .,?!'.includes(c)) return c;
            if (idx < rev) return orig[idx];
            return CH[Math.floor(Math.random() * CH.length)];
          }).join("");
          i++;
          if (i < MAX) raf = requestAnimationFrame(tick);
          else el.textContent = orig;
        }
        tick();
      };
      const onLeave = () => { cancelAnimationFrame(raf); el.textContent = orig; };
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return { el, onEnter, onLeave, cancel: () => cancelAnimationFrame(raf) };
    }
    const scambleEls = document.querySelectorAll(".scramble");
    scambleEls.forEach(el => activeScrambles.push(scramble(el)));

    // 5. 3D Tilt
    const tilts = document.querySelectorAll(".tilt-card");
    const tiltMove = function(e) {
      const card = this;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.02)`;
      card.style.boxShadow = `${-x * 20}px ${-y * 16}px 40px rgba(0,0,0,.15)`;
    };
    const tiltLeave = function() {
      const card = this;
      card.style.transform = ""; card.style.boxShadow = "";
    };
    tilts.forEach(card => {
      card.addEventListener("mousemove", tiltMove);
      card.addEventListener("mouseleave", tiltLeave);
    });

    // 6. Scroll reveals
    const ro = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    const reveals = document.querySelectorAll(".reveal, .slide-left, .slide-right, .eco-card");
    reveals.forEach(el => ro.observe(el));

    // 7. Stat counters
    const countRafs = [];
    function count(el, tgt, dur = 1800) {
      const s = performance.now();
      let raf;
      function tick(now) {
        const p = Math.min((now - s) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.floor(eased * tgt);
        el.textContent = tgt >= 1000 ? Math.floor(v / 1000) + ",000" : v;
        if (p < 1) {
          raf = requestAnimationFrame(tick);
          countRafs.push(raf);
        } else {
          el.textContent = tgt >= 1000 ? (tgt / 1000).toFixed(0) + ",000" : tgt;
        }
      }
      raf = requestAnimationFrame(tick);
      countRafs.push(raf);
    }
    const so = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          count(e.target, +e.target.dataset.target);
          so.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    const stats = document.querySelectorAll(".stnum[data-target]");
    stats.forEach(el => so.observe(el));

    // 8. Aurora parallax
    const aur = document.querySelector(".aurora-layer");
    const auroraScroll = () => {
      if(aur) aur.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener("scroll", auroraScroll, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", addOn);
        el.removeEventListener("mouseleave", removeOn);
      });
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", auroraScroll);
      activeScrambles.forEach(s => {
        s.el.removeEventListener("mouseenter", s.onEnter);
        s.el.removeEventListener("mouseleave", s.onLeave);
        s.cancel();
      });
      tilts.forEach(card => {
        card.removeEventListener("mousemove", tiltMove);
        card.removeEventListener("mouseleave", tiltLeave);
      });
      if(ubyObs) ubyObs.disconnect();
      ro.disconnect();
      so.disconnect();
      countRafs.forEach(cancelAnimationFrame);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cur"></div>
      
      <nav id="nav">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="n-left">
          <svg viewBox="0 0 34 34"><rect width="34" height="34" rx="7" fill="#f05523"/><rect x="7" y="9" width="20" height="3.5" rx="1.5" fill="#fff"/><rect x="15" y="9" width="4" height="17" rx="1.5" fill="#fff"/><circle cx="26.5" cy="24.5" r="2.2" fill="#fff" opacity="0.65"/></svg>
          <div className="n-logo">Takshila<em>.</em></div>
        </a>
        <div className="n-links">
          <a href="#features" className="n-link">Features</a>
          <a href="#ecosystem" className="n-link">Ecosystem</a>
          <a href="#roadmap" className="n-link">Roadmap</a>
          <a href="#pricing" className="n-link">Pricing</a>
        </div>
        <div className="n-right">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-pill" onClick={() => navigate('/signup')}>Join Now</button>
        </div>
      </nav>

      <section className="hero">
        <div className="aurora-layer"></div>
        <div className="h-content">
          <div className="h-badge">✦ The Complete Career Ecosystem</div>
          <h1 className="h-h1">Your Professional Life,<br/><span className="uby-wrap" id="uby">Unified by Intelligence.</span></h1>
          <p className="h-sub">Stop juggling a dozen career tools. Discover the only workspace where Resume Building, Interview Simulation, and Career Roadmapping live in perfect harmony.</p>
          <div className="h-cta">
            <button className="btn-pri" onClick={() => navigate('/signup')}>Start Your Journey →</button>
            <button className="btn-sec" onClick={() => navigate('/login')}>Explore Workspace</button>
          </div>
          <div className="mwin tilt-card reveal">
            <div className="mbar"><div className="m-dots"><div className="m-dot r"></div><div className="m-dot y"></div><div className="m-dot g"></div></div><div className="m-lbl">AI Resume Maker Interface</div><div className="m-spc"></div></div>
            <div className="mbody">
              <div className="mcard">
                <div className="mc-h">Work Experience</div>
                <div className="sk-l" style={{ width: '80%' }}></div>
                <div className="sk-l" style={{ width: '60%' }}></div>
                <div className="sk-l" style={{ width: '90%' }}></div>
                <div className="sk-l" style={{ width: '70%' }}></div>
                <div className="sk-l t" style={{ width: '85%' }}></div>
                <div className="chip-o">✦ AI Enhanced</div>
              </div>
              <div>
                <div className="mcard" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="ring-w"><div className="ring-i">92%</div></div>
                  <div><div className="mc-h" style={{ margin: 0, color: 'var(--text)' }}>ATS Score</div><div className="chip-g" style={{ marginTop: '4px' }}>✓ Optimal</div></div>
                </div>
                <div className="mcard">
                  <div className="mc-h" style={{ color: 'var(--text)' }}>Keywords</div>
                  <div className="sk-l" style={{ width: '100%' }}></div>
                  <div className="sk-l" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="f-sec" id="features">
        <div className="slide-left">
          <span className="f-label">01. Resume Intelligence</span>
          <h2 className="f-h2 scramble" data-text="Build the best resume of your life.">Build the best resume of your life.</h2>
          <p className="f-desc">High-fidelity resume creation with real-time AI optimization and professional templates. Stop guessing what recruiters want.</p>
          <ul className="f-list"><li>AI Content Suggestions</li><li>ATS Keyphrase Matching</li><li>Premium PDF Export</li><li>One-Click Portfolios</li></ul>
        </div>
        <div className="slide-right">
          <div className="f-mock tilt-card">
            <div className="f-inner">
              <div style={{ fontFamily: 'var(--label)', color: 'var(--g400)', marginBottom: '1rem' }}>WORK HISTORY</div>
              <div className="sk-l t" style={{ width: '85%' }}></div>
              <div className="sk-l" style={{ width: '70%' }}></div>
              <div className="sk-l" style={{ width: '90%' }}></div>
              <div className="sk-l" style={{ width: '60%', marginBottom: '1.5rem' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--g200)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}><span className="chip-o" style={{ marginTop: 0 }}>✦ AI Enhanced</span><span className="chip-g" style={{ marginTop: 0 }}>✓ ATS Ready</span></div>
                <div className="ring-w" style={{ margin: 0, width: '36px', height: '36px' }}><div className="ring-i" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>92</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eco" id="ecosystem">
        <h2 className="eco-h reveal">The <em>Career Ecosystem</em></h2>
        <div className="eco-s reveal">12 specialized tools unified in one ultimate platform.</div>
        <div className="egrid">
          <div className="eco-card">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#f05523" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div>
            <div className="e-cat c-or">The Career OS</div><div className="e-title">Resume Intelligence</div><div className="e-desc">High-fidelity resume creation with real-time AI optimization and professional templates.</div>
          </div>
          <div className="eco-card d1">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#f05523" fill="none" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></div>
            <div className="e-cat c-or">The Career OS</div><div className="e-title">ATS Optimization</div><div className="e-desc">Scan your resume against job descriptions to ensure perfect keyword matching.</div>
          </div>
          <div className="eco-card d2">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#f05523" fill="none" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></svg></div>
            <div className="e-cat c-or">The Career OS</div><div className="e-title">AI Portfolios</div><div className="e-desc">Generate stunning portfolio websites automatically from your resume data.</div>
          </div>
              
          <div className="eco-card">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#7c3aed" fill="none" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg></div>
            <div className="e-cat c-pu">Productivity Suite</div><div className="e-title">YouTube Intelligence</div><div className="e-desc">Extract core insights and structured summaries from long-form educational videos.</div>
          </div>
          <div className="eco-card d1">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#7c3aed" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div>
            <div className="e-cat c-pu">Productivity Suite</div><div className="e-title">PDF Brain</div><div className="e-desc">Interact with your PDF documents using AI to extract data, summaries, and facts.</div>
          </div>
          <div className="eco-card d2">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#7c3aed" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></div>
            <div className="e-cat c-pu">Productivity Suite</div><div className="e-title">Dynamic AI Notes</div><div className="e-desc">An intelligent note-taking companion that organizes your thoughts and research.</div>
          </div>

          <div className="eco-card">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#0ea5e9" fill="none" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
            <div className="e-cat c-bl">Growth & Intelligence</div><div className="e-title">Growth Roadmaps</div><div className="e-desc">Node-based career paths that visualize the skills needed for your next promotion.</div>
          </div>
          <div className="eco-card d1">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#0ea5e9" fill="none" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
            <div className="e-cat c-bl">Growth & Intelligence</div><div className="e-title">Skill Gap Analysis</div><div className="e-desc">Data-driven insights into what's missing in your current professional profile.</div>
          </div>
          <div className="eco-card d2">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#0ea5e9" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg></div>
            <div className="e-cat c-bl">Growth & Intelligence</div><div className="e-title">Interview Simulator</div><div className="e-desc">Real-time AI video interviews with posture, confidence, and keyword feedback.</div>
          </div>

          <div className="eco-card">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#10b981" fill="none" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
            <div className="e-cat c-gr">Job Discovery</div><div className="e-title">Discovery Matching</div><div className="e-desc">AI-powered job matching simulations tuned to your skills and ambitions.</div>
          </div>
          <div className="eco-card d1">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#10b981" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="12" r="2"/></svg></div>
            <div className="e-cat c-gr">Job Discovery</div><div className="e-title">Unified Tracker</div><div className="e-desc">A centralized command center to track every application, interview, and offer.</div>
          </div>
          <div className="eco-card d2">
            <div className="popwrap"><div className="popa"><img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=220&q=65" alt=""/></div><div className="popb"><img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=220&q=65" alt=""/></div></div>
            <div className="e-icon"><svg stroke="#10b981" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
            <div className="e-cat c-gr">Job Discovery</div><div className="e-title">Cover Letter Engine</div><div className="e-desc">Context-aware AI that writes tailored cover letters for every job in seconds.</div>
          </div>
        </div>
      </section>

      <section className="f-sec fd rev">
        <div className="slide-left">
          <div className="sim-bg tilt-card">
            <div className="sim-vid">🤖<div className="s-bdg">LIVE</div></div>
            <div className="sim-bar"><div className="s-bar-l"><span>Confidence</span><span>78%</span></div><div className="s-bar-t"><div className="s-bar-f" style={{ width: '78%' }}></div></div></div>
            <div className="sim-bar"><div className="s-bar-l"><span>Relevance</span><span>91%</span></div><div className="s-bar-t"><div className="s-bar-f" style={{ width: '91%' }}></div></div></div>
            <div className="sim-bar"><div className="s-bar-l"><span>Posture</span><span>65%</span></div><div className="s-bar-t"><div className="s-bar-f" style={{ width: '65%' }}></div></div></div>
          </div>
        </div>
        <div className="slide-right">
          <span className="f-label">02. Interview Intelligence</span>
          <h2 className="f-h2 scramble" data-text="Simulate success, before you apply.">Simulate success, before you apply.</h2>
          <p className="f-desc">Practice with our empathetic AI interviewer that analyzes not just what you say, but how you say it.</p>
          <ul className="f-list"><li>Live Video Feedback Loop</li><li>Technical Response Analysis</li><li>Confidence & Posture Coaching</li><li>Real-time Scoring</li></ul>
        </div>
      </section>

      <section className="road-sec" id="roadmap">
        <h2 className="r-h2 reveal">Visualize Your <em>Future.</em></h2>
        <div className="r-sub reveal">Map your professional trajectory with nodal intelligence.</div>
        <div className="rwin reveal">
          <div className="rbar"><div className="rbar-b"></div><div className="rbar-b"></div><div className="rbar-b"></div></div>
          <div className="rbody tilt-card">
            <svg viewBox="0 0 820 280" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f05523" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#f05523" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
              <path d="M 60 140 C 140 140 180 80 260 80 C 340 80 380 140 460 140 C 540 140 580 200 660 200 C 720 200 750 140 800 140" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.6"/>
              <path d="M 260 80 C 300 40 340 30 400 40 C 460 50 490 70 520 80" stroke="rgba(240,85,35,0.3)" strokeWidth="1.5" strokeDasharray="4 4" fill="none"/>
            </svg>
            <div className="rnode" style={{ left:'56px', top:'136px' }}><div className="rnode-glow"></div><div className="rnode-label">Junior Dev</div></div>
            <div className="rnode" style={{ left:'256px', top:'76px' }}><div className="rnode-glow"></div><div className="rnode-label">Mid-Level</div></div>
            <div className="rnode" style={{ left:'456px', top:'136px' }}><div className="rnode-glow"></div><div className="rnode-label">Senior Dev</div></div>
            <div className="rnode" style={{ left:'656px', top:'196px' }}><div className="rnode-glow"></div><div className="rnode-label">Tech Lead</div></div>
            <div className="rnode inactive" style={{ left:'396px', top:'36px' }}><div className="rnode-glow"></div><div className="rnode-label">Staff Eng.</div></div>
            <div className="rtags">
              <div className="rtag rt-or">TypeScript</div><div className="rtag rt-wh">System Design</div><div className="rtag rt-wh">Leadership</div>
            </div>
          </div>
        </div>
      </section>

      <section className="marq">
        <div className="m-tr">
          <span className="marquee-item">Resume Intelligence</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Interview Simulation</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Career Roadmap</span><span class="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Skill Gap Analysis</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>ATS Optimization</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Job Discovery</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>AI Portfolios</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Resume Intelligence</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Interview Simulation</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Career Roadmap</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Skill Gap Analysis</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>ATS Optimization</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>Job Discovery</span><span className="marquee-star">✦</span>
          <span className="marquee-item" style={{ marginLeft: '2rem' }}>AI Portfolios</span><span className="marquee-star">✦</span>
        </div>
      </section>

      <section className="stat-sec">
        <div className="st-g">
          <div className="reveal"><div className="stnum" data-target="50000">0</div><div className="stval">Resumes Optimized</div></div>
          <div className="reveal d1"><div className="stnum" data-target="12000">0</div><div className="stval">Interviews Simulated</div></div>
          <div className="reveal d2"><div className="stnum" data-target="98">0</div><div className="stval">Matching Accuracy %</div></div>
        </div>
      </section>

      <section className="cta">
        <h2 className="c-h2 reveal">Ready to join the <em className="scramble" data-text="Career Ecosystem?">Career Ecosystem?</em></h2>
        <div className="c-sub reveal">Unlock the tools you need to build your resume, land the interview, and visualize your future potential.</div>
        <button className="btn-c reveal" onClick={() => navigate('/signup')}>Create My Free Account</button>
        <div className="c-hint reveal">No credit card required. Instant access to core workspace.</div>
      </section>

      <section className="foot">
        <div className="f-top">
          <div>
            <div className="ft-logo">Takshila<em>.</em></div>
            <div className="ft-desc">Your ultimate career workspace. Unified by intelligence, driven by your potential.</div>
          </div>
          <div>
            <div className="ft-h">Navigation</div>
            <div className="ft-lnks"><a href="#">About Us</a><a href="#">Support</a><a href="#">Workspace</a><a href="#">Blog</a></div>
          </div>
          <div>
            <div className="ft-h">Legal</div>
            <div className="ft-lnks"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a></div>
          </div>
        </div>
        <div className="f-bot">
          <div>© 2026 Takshila AI. All rights reserved.</div>
          <div>Powered by AI · Built with ♥</div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
