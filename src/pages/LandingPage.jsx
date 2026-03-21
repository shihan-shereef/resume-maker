import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, ScanSearch, Globe, Youtube, FileKey, NotebookPen, 
  Map, PieChart, MonitorPlay, Compass, Briefcase, PenTool, Bot, User 
} from 'lucide-react';
import creatorImg from '../assets/creator.jpg';
import '../styles/TakshilaLanding.css';
import { usePrivacy } from '../context/PrivacyContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { openPrivacyModal } = usePrivacy();

  useEffect(() => {
    // 1. Cursor movement
    const cur = document.getElementById('cur');
    const moveCursor = (e) => {
      if (cur) {
        cur.style.left = e.clientX + 'px';
        cur.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', moveCursor);

    // Cursor hover effect
    const interactiveEls = document.querySelectorAll('button, a, [data-hover], .eco-card, .mwin, .tilt-card');
    const onEnter = () => cur && cur.classList.add('on');
    const onLeave = () => cur && cur.classList.remove('on');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
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
      uby.innerHTML = ubyText.split("").map((ch, i) => {
        if (ch === " ") return '<span class="uby-char space">&nbsp;</span>';
        const rot = (Math.random() * 8 - 4).toFixed(1);
        // Using CSS variable for delay to be more performant than JS timeouts
        return `<span class="uby-char" style="--rot:${rot}deg; --delay:${i * 0.045}s">${ch}</span>`;
      }).join("");
      const ubyChars = uby.querySelectorAll(".uby-char:not(.space)");
      ubyObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          ubyChars.forEach(ch => ch.classList.add("landed"));
          if(ubyObs) ubyObs.disconnect();
        }
      }, { threshold: 0.1 });
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
      window.removeEventListener('mousemove', moveCursor);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
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
          <div className="n-logo" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900, color: 'var(--navy)', letterSpacing: '-1px', fontSize: '1.4rem'}}>Takshila<span style={{color: 'var(--orange)'}}>.</span></div>
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
          <h1 className="h-h1"><span style={{ display: 'block' }}>Your Professional Life,</span><span className="uby-wrap" id="uby" style={{ display: 'inline-block' }}>Unified by Intelligence.</span></h1>
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
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/148a1eb8-6295-44ad-8aa7-4d8a2d6cd547.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/236b10da-701d-4801-afc5-23dfb9f32f55.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><FileText size={22} color="#f05523" /></div>

            <div className="e-cat c-or">The Career OS</div><div className="e-title">Resume Intelligence</div><div className="e-desc">High-fidelity resume creation with real-time AI optimization and professional templates.</div>
          </div>
          <div className="eco-card d1">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/24041c68-cd7b-483c-85f7-99adc221506b.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/28b91a59-ec69-4163-b4e8-78b387fadd44.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><ScanSearch size={22} color="#f05523" /></div>

            <div className="e-cat c-or">The Career OS</div><div className="e-title">ATS Optimization</div><div className="e-desc">Scan your resume against job descriptions to ensure perfect keyword matching.</div>
          </div>
          <div className="eco-card d2">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/2dd1a835-d30e-49a1-8d06-8ac41fef8a5a.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/2e306f4d-289c-4a1a-9603-0bc59b0f0f08.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><Globe size={22} color="#f05523" /></div>

            <div className="e-cat c-or">The Career OS</div><div className="e-title">AI Portfolios</div><div className="e-desc">Generate stunning portfolio websites automatically from your resume data.</div>
          </div>
              
          <div className="eco-card">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/38bcd1ca-f316-42d9-b326-87e0345cf1f9.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/59355d26-78c8-4e20-a34d-8c94ed1676d2.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><Youtube size={22} color="#7c3aed" /></div>

            <div className="e-cat c-pu">Productivity Suite</div><div className="e-title">YouTube Intelligence</div><div className="e-desc">Extract core insights and structured summaries from long-form educational videos.</div>
          </div>
          <div className="eco-card d1">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/5a3d5c84-1cf4-40d9-8426-e0a03ccc4f91.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/5ea2dcf5-7943-4723-a557-0a500a61fb93.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><FileKey size={22} color="#7c3aed" /></div>

            <div className="e-cat c-pu">Productivity Suite</div><div className="e-title">PDF Brain</div><div className="e-desc">Interact with your PDF documents using AI to extract data, summaries, and facts.</div>
          </div>
          <div className="eco-card d2">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/69dcdba8-ad46-4b0a-9faa-23e1909484ce.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/71bbd958-a560-4391-8715-7c5b6df8d238.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><NotebookPen size={22} color="#7c3aed" /></div>

            <div className="e-cat c-pu">Productivity Suite</div><div className="e-title">Dynamic AI Notes</div><div className="e-desc">An intelligent note-taking companion that organizes your thoughts and research.</div>
          </div>

          <div className="eco-card">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/77fb6da8-62e1-431c-a829-7b8aaf51b92b.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/839c616c-43b5-4f64-8964-acd3020f4e92.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><Map size={22} color="#0ea5e9" /></div>

            <div className="e-cat c-bl">Growth & Intelligence</div><div className="e-title">Growth Roadmaps</div><div className="e-desc">Node-based career paths that visualize the skills needed for your next promotion.</div>
          </div>
          <div className="eco-card d1">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/8403a524-be7b-46dd-83d1-5f27cb403386.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/998521cd-2111-4209-8f7b-e8d51728f4f1.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><PieChart size={22} color="#0ea5e9" /></div>

            <div className="e-cat c-bl">Growth & Intelligence</div><div className="e-title">Skill Gap Analysis</div><div className="e-desc">Data-driven insights into what's missing in your current professional profile.</div>
          </div>
          <div className="eco-card d2">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/b549f920-ba0b-419f-aded-d233e681846d.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/ba356f2c-7ec3-4ddd-9fa4-86186c00a087.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><MonitorPlay size={22} color="#0ea5e9" /></div>

            <div className="e-cat c-bl">Growth & Intelligence</div><div className="e-title">Interview Simulator</div><div className="e-desc">Real-time AI video interviews with posture, confidence, and keyword feedback.</div>
          </div>

          <div className="eco-card">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/c996140e-c5a1-4bf6-ae01-45772c663b20.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/d0850b0a-2a46-4310-b6fb-6529286ef69a.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><Compass size={22} color="#10b981" /></div>

            <div className="e-cat c-gr">Job Discovery</div><div className="e-title">Discovery Matching</div><div className="e-desc">AI-powered job matching simulations tuned to your skills and ambitions.</div>
          </div>
          <div className="eco-card d1">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/e9d7181d-26c2-48d6-b98a-323f32711f4f.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/ef460e7b-6343-4d80-8768-6405c05b3600.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><Briefcase size={22} color="#10b981" /></div>

            <div className="e-cat c-gr">Job Discovery</div><div className="e-title">Unified Tracker</div><div className="e-desc">A centralized command center to track every application, interview, and offer.</div>
          </div>
          <div className="eco-card d2">
                <div className="popwrap">
                  <div className="popa"><img src="/images/patch/f61f78ea-fae8-41a6-9d16-ecc5795ebeac.jpg" alt="" /></div>
                  <div className="popb"><img src="/images/patch/ff3c1f09-65d5-42d7-8446-627d5c996d69.jpg" alt="" /></div>
                </div>
            <div className="e-icon"><PenTool size={22} color="#10b981" /></div>

            <div className="e-cat c-gr">Job Discovery</div><div className="e-title">Cover Letter Engine</div><div className="e-desc">Context-aware AI that writes tailored cover letters for every job in seconds.</div>
          </div>
        </div>
      </section>

      <section className="f-sec fd rev">
        <div className="slide-left">
          <div className="sim-bg tilt-card">
            <div className="sim-vid"><Bot size={48} color="rgba(255,255,255,0.8)" /><div className="s-bdg">LIVE</div></div>
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

      {/* About the Creator Section */}
      <section className="about-creator-preview" style={{ padding: '80px 24px', background: '#fafafa', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <img src={creatorImg} alt="Abdul Shihan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
              if (e.target.src !== "/creator.jpg") {
                e.target.src = "/creator.jpg";
              }
            }} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '16px' }}>The Human Behind Takshila<span style={{ color: 'var(--orange)' }}>.</span></h2>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', lineHeight: 1.6, marginBottom: '32px' }}>
            Hi, I'm Abdul Shihan. I built Takshila AI to help people navigate their careers with better tools and AI-powered insights. I'm a student developer from Sri Lanka with a passion for building helpful technology.
          </p>
          <button className="btn-pill" onClick={() => navigate('/about')} style={{ padding: '12px 32px', fontSize: '1rem' }}>Read My Full Story →</button>
        </div>
      </section>

      <footer className="foot">
        <div className="f-top">
          <div>
            <div className="ft-logo" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900, color: 'var(--navy)', letterSpacing: '-1px', fontSize: '1.5rem', marginBottom: '1rem'}}>Takshila<span style={{color: 'var(--orange)'}}>.</span></div>
            <div className="ft-desc">Your ultimate career workspace. Unified by intelligence, driven by your potential.</div>
          </div>
          <div>
            <div className="ft-h">Navigation</div>
            <div className="ft-lnks">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About Us</a>
              <a href="#">Support</a>
              <a href="#">Workspace</a>
              <a href="#">Blog</a>
            </div>
          </div>
          <div>
            <div className="ft-h">Legal</div>
            <div className="ft-lnks">
              <a href="#" onClick={(e) => { e.preventDefault(); openPrivacyModal(); }}>Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="f-bot">
          <div>© 2026 Takshila AI. All rights reserved.</div>
          <div>Powered by AI · Built with ♥</div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
