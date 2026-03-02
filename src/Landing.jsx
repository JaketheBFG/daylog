import React, { useEffect, useState } from "react";


const LANDING_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0e0c0a; --surface:#1a1714; --surface2:#221f1b; --border:#2e2a25;
    --text:#e8e0d4; --text-muted:#7a7068; --text-dim:#4a4540;
    --amber:#c8882a; --amber-soft:#e8a84a; --amber-dim:#3a2a10;
    --rose:#c4605a; --sage:#6a9e78; --cream:#f0e8d8;
  }
  html { scroll-behavior:smooth; }
  .l-body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; min-height:100vh; overflow-x:hidden; }
  .l-body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:100; opacity:0.035; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .l-glow { position:fixed; width:800px; height:800px; border-radius:50%; background:radial-gradient(circle,rgba(200,136,42,0.07) 0%,transparent 70%); pointer-events:none; top:-300px; left:50%; transform:translateX(-50%); z-index:0; }
  
  /* NAV */
  .l-nav { position:fixed; top:0; left:0; right:0; z-index:50; padding:20px 40px; display:flex; align-items:center; justify-content:space-between; background:rgba(14,12,10,0.8); backdrop-filter:blur(12px); border-bottom:1px solid rgba(46,42,37,0.5); }
  .l-nav-logo { font-family:'Playfair Display',serif; font-size:20px; color:var(--cream); letter-spacing:-0.5px; text-decoration:none; }
  .l-nav-logo span { color:var(--amber-soft); font-style:italic; }
  .l-nav-cta { padding:9px 20px; border-radius:10px; background:var(--amber); color:#0e0c0a; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; text-decoration:none; transition:all 0.2s; cursor:pointer; border:none; }
  .l-nav-cta:hover { background:var(--amber-soft); transform:translateY(-1px); }

  /* HERO */
.l-hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:80px 24px 80px; position:relative; z-index:1; margin-top:-60px; }  .l-eyebrow { font-size:11px; font-weight:500; letter-spacing:2px; text-transform:uppercase; color:var(--amber-soft); margin-bottom:24px; }
  .l-hero-title { font-family:'Playfair Display',serif; font-size:clamp(42px,8vw,80px); color:var(--cream); line-height:1.1; letter-spacing:-1.5px; margin-bottom:24px; max-width:700px; }
  .l-hero-title em { font-style:italic; color:var(--amber-soft); }
  .l-hero-sub { font-size:clamp(16px,2.5vw,19px); color:var(--text-muted); line-height:1.7; max-width:480px; margin-bottom:48px; }
  .l-hero-actions { display:flex; gap:12px; align-items:center; flex-wrap:wrap; justify-content:center; }
  .l-hero-note { margin-top:20px; font-size:12px; color:var(--text-dim); font-style:italic; }

  /* BUTTONS */
  .l-btn-primary { padding:14px 28px; border-radius:12px; background:var(--amber); color:#0e0c0a; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; text-decoration:none; transition:all 0.2s; border:none; cursor:pointer; display:inline-block; }
  .l-btn-primary:hover { background:var(--amber-soft); transform:translateY(-2px); }
  .l-btn-ghost { padding:14px 28px; border-radius:12px; background:transparent; color:var(--text-muted); font-family:'DM Sans',sans-serif; font-size:15px; font-weight:400; text-decoration:none; border:1px solid var(--border); transition:all 0.2s; display:inline-block; }
  .l-btn-ghost:hover { color:var(--text); border-color:var(--text-muted); }

  /* PROOF */
  .l-proof { display:flex; align-items:center; justify-content:center; gap:32px; padding:32px 24px; border-top:1px solid var(--border); border-bottom:1px solid var(--border); flex-wrap:wrap; position:relative; z-index:1; }
  .l-proof-num { font-family:'Playfair Display',serif; font-size:28px; color:var(--cream); font-style:italic; }
  .l-proof-label { font-size:11px; color:var(--text-muted); letter-spacing:0.5px; margin-top:3px; }
  .l-proof-divider { width:1px; height:40px; background:var(--border); }

  /* SECTIONS */
  .l-section { max-width:960px; margin:0 auto; padding:100px 24px; position:relative; z-index:1; }
  .l-section-eyebrow { font-size:11px; font-weight:500; letter-spacing:2px; text-transform:uppercase; color:var(--amber-soft); margin-bottom:16px; }
  .l-section-title { font-family:'Playfair Display',serif; font-size:clamp(28px,5vw,44px); color:var(--cream); line-height:1.2; letter-spacing:-0.5px; margin-bottom:16px; }
  .l-section-title em { font-style:italic; color:var(--amber-soft); }
  .l-section-sub { font-size:16px; color:var(--text-muted); line-height:1.7; max-width:520px; }

  /* FEATURES */
  .l-features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-top:56px; }
  .l-feature-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; transition:border-color 0.2s,transform 0.2s; }
  .l-feature-card:hover { border-color:rgba(200,136,42,0.3); transform:translateY(-3px); }
  .l-feature-icon { font-size:26px; margin-bottom:16px; display:block; }
  .l-feature-title { font-family:'Playfair Display',serif; font-size:18px; color:var(--cream); margin-bottom:8px; }
  .l-feature-desc { font-size:14px; color:var(--text-muted); line-height:1.65; }

  /* HOW IT WORKS */
  .l-how-wrap { margin-top:56px; display:flex; flex-direction:column; }
  .l-how-step { display:flex; gap:28px; align-items:flex-start; padding:32px 0; border-bottom:1px solid var(--border); }
  .l-how-step:last-child { border-bottom:none; }
  .l-how-num { font-family:'Playfair Display',serif; font-size:48px; color:var(--amber-dim); font-style:italic; line-height:1; flex-shrink:0; width:52px; }
  .l-how-title { font-family:'Playfair Display',serif; font-size:20px; color:var(--cream); margin-bottom:8px; }
  .l-how-desc { font-size:14px; color:var(--text-muted); line-height:1.65; max-width:480px; }

  /* TESTIMONIALS */
  .l-testimonials-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-top:56px; }
  .l-testimonial-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; }
  .l-testimonial-text { font-family:'Playfair Display',serif; font-size:16px; font-style:italic; color:var(--text); line-height:1.7; margin-bottom:20px; }
  .l-testimonial-author { font-size:12px; color:var(--text-dim); letter-spacing:0.5px; }
  .l-testimonial-author strong { color:var(--text-muted); display:block; font-weight:400; margin-bottom:2px; }

  /* CTA */
  .l-cta-section { text-align:center; padding:100px 24px; position:relative; z-index:1; border-top:1px solid var(--border); }
  .l-cta-inner { max-width:560px; margin:0 auto; }
  .l-waitlist-form { display:flex; gap:10px; max-width:420px; margin:36px auto 0; flex-wrap:wrap; justify-content:center; }
  .l-waitlist-input { flex:1; min-width:220px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px 16px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color 0.2s; }
  .l-waitlist-input:focus { border-color:var(--amber); }
  .l-waitlist-input::placeholder { color:var(--text-dim); }
  .l-waitlist-success { font-size:14px; color:var(--sage); font-style:italic; margin-top:16px; }
  .l-cta-note { font-size:12px; color:var(--text-dim); margin-top:16px; font-style:italic; }
  .l-cta-note a { color:var(--amber-soft); text-decoration:none; }

  /* FOOTER */
  .l-footer { border-top:1px solid var(--border); padding:32px 40px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; position:relative; z-index:1; }
  .l-footer-logo { font-family:'Playfair Display',serif; font-size:16px; color:var(--text-muted); text-decoration:none; }
  .l-footer-logo span { color:var(--amber-soft); font-style:italic; }
  .l-footer-links { display:flex; gap:24px; }
  .l-footer-links a { font-size:12px; color:var(--text-dim); text-decoration:none; transition:color 0.15s; }
  .l-footer-links a:hover { color:var(--text-muted); }
  .l-footer-copy { font-size:11px; color:var(--text-dim); }

  /* ANIMATIONS */
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  .fade-up { opacity:0; transform:translateY(20px); transition:opacity 0.7s ease,transform 0.7s ease; }
  .fade-up.visible { opacity:1; transform:none; }

  /* MOBILE */
  @media (max-width:600px) {
    .l-nav { padding:16px 20px; }
    .l-hero { padding:100px 20px 60px; }
    .l-proof { gap:20px; }
    .l-proof-divider { display:none; }
    .l-section { padding:70px 20px; }
    .l-how-step { flex-direction:column; gap:12px; }
    .l-how-num { font-size:32px; }
    .l-footer { padding:24px 20px; flex-direction:column; align-items:flex-start; }
  }
`;

export default function Landing() {
  const [waitlistDone, setWaitlistDone] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
   <div className="l-body">
      <style>{LANDING_STYLES}</style>
      <div className="l-glow"/>

      {/* NAV */}
      <nav className="l-nav">
        <a href="/" className="l-nav-logo">through<span>line</span></a>
        <a href="/app" className="l-nav-cta">Start journaling →</a>
      </nav>

      {/* HERO */}
      <div className="l-hero">
        <div className="l-eyebrow">Private · Personal · Thoughtful</div>
        <h1 className="l-hero-title">See yourself <em>more clearly</em></h1>
        <p className="l-hero-sub">Throughline is a private journal that listens, finds patterns in your days, and gently helps you understand yourself over time.</p>
        <div className="l-hero-actions">
          <a href="/app" className="l-btn-primary">Start for free →</a>
          <a href="#how" className="l-btn-ghost">See how it works</a>
        </div>
        <p className="l-hero-note">No credit card. Your entries are private and encrypted.</p>
      </div>

      {/* PROOF */}
      <div className="l-proof">
        <div style={{textAlign:"center"}}><div className="l-proof-num">Free</div><div className="l-proof-label">To get started</div></div>
        <div className="l-proof-divider"/>
        <div style={{textAlign:"center"}}><div className="l-proof-num">Private</div><div className="l-proof-label">Encrypted & yours only</div></div>
        <div className="l-proof-divider"/>
        <div style={{textAlign:"center"}}><div className="l-proof-num">AI-powered</div><div className="l-proof-label">Insights from your entries</div></div>
      </div>

      {/* FEATURES */}
      <section className="l-section" id="features">
        <div className="fade-up">
          <div className="l-section-eyebrow">What Throughline does</div>
          <h2 className="l-section-title">Everything you need to <em>reflect and grow</em></h2>
          <p className="l-section-sub">Write or speak freely. Throughline handles the rest — finding the patterns you can't always see yourself.</p>
        </div>
        <div className="l-features-grid">
          {[
            {icon:"🎙", title:"Voice or text", desc:"Just talk. No structure needed. Throughline transcribes your voice and turns it into a written entry automatically."},
            {icon:"✦",  title:"AI reflections", desc:"After each entry, get a gentle observation about your day — what you're carrying, what lit you up, what to carry forward."},
            {icon:"📈", title:"Mood patterns", desc:"See your emotional rhythms over time. Understand what consistently drains you and what consistently makes you feel alive."},
            {icon:"🌿", title:"Habits & goals", desc:"Track what you're building. Set directions — not just tasks. Let the app suggest goals based on what you actually write about."},
            {icon:"✅", title:"Tasks from entries", desc:"Throughline pulls action items out of your entries automatically and adds them to your task list so nothing slips through."},
            {icon:"🔒", title:"Completely private", desc:"Your journal is encrypted and only accessible to you. We don't sell your data or use your entries for advertising. Ever."},
          ].map(f => (
            <div key={f.title} className="l-feature-card fade-up">
              <span className="l-feature-icon">{f.icon}</span>
              <div className="l-feature-title">{f.title}</div>
              <p className="l-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="l-section" id="how" style={{borderTop:"1px solid var(--border)"}}>
        <div className="fade-up">
          <div className="l-section-eyebrow">How it works</div>
          <h2 className="l-section-title">Three minutes a day. <em>A lifetime of clarity.</em></h2>
        </div>
        <div className="l-how-wrap">
          {[
            {n:"1", title:"Write or speak about your day", desc:"No prompts, no structure, no pressure. Just open the app and start. Talk about the meeting that went sideways, the moment that made you smile, or what's been sitting heavy all week."},
            {n:"2", title:"Get a personal reflection", desc:"Throughline reads your entry and surfaces what matters — action items, emotional signals, and a warm observation written just for you."},
            {n:"3", title:"Watch patterns emerge over time", desc:"Week by week, your journal builds a picture of who you are — what drains you, what fuels you, and where you're quietly growing."},
          ].map(s => (
            <div key={s.n} className="l-how-step fade-up">
              <div className="l-how-num">{s.n}</div>
              <div>
                <div className="l-how-title">{s.title}</div>
                <p className="l-how-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="l-section" id="testimonials" style={{borderTop:"1px solid var(--border)"}}>
        <div className="fade-up">
          <div className="l-section-eyebrow">Early users</div>
          <h2 className="l-section-title">What people are <em>saying</em></h2>
        </div>
        <div className="l-testimonials-grid">
          {[
            {text:"I've tried every journaling app. This is the first one that actually made me feel understood.", name:"Early beta user", role:"Designer, New York"},
            {text:"The voice entry feature changed everything. I just talk on my walk home and it handles the rest.", name:"Early beta user", role:"Engineer, San Francisco"},
            {text:"Three weeks in and I can already see patterns I had no idea were there. It's kind of remarkable.", name:"Early beta user", role:"Teacher, Chicago"},
          ].map((t,i) => (
            <div key={i} className="l-testimonial-card fade-up">
              <p className="l-testimonial-text">"{t.text}"</p>
              <div className="l-testimonial-author"><strong>{t.name}</strong>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="l-cta-section">
        <div className="l-cta-inner fade-up">
          <div className="l-section-eyebrow">Get early access</div>
          <h2 className="l-section-title">Ready to see yourself <em>more clearly?</em></h2>
          <p className="l-section-sub" style={{margin:"0 auto"}}>Join the waitlist and be first to know when the mobile app launches.</p>
          {!waitlistDone ? (
            <form className="l-waitlist-form" onSubmit={e=>{e.preventDefault();setWaitlistDone(true);}}>
              <input className="l-waitlist-input" type="email" placeholder="your@email.com" required/>
              <button type="submit" className="l-btn-primary">Join waitlist →</button>
            </form>
          ) : (
            <p className="l-waitlist-success">You're on the list — we'll be in touch ✦</p>
          )}
          <p className="l-cta-note">Or <a href="/app">start using the web app now</a> — it's free.</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="l-footer">
        <a href="/" className="l-footer-logo">through<span>line</span></a>
        <div className="l-footer-links">
          <a href="/privacy-policy">Privacy policy</a>
          <a href="/terms-of-service">Terms of service</a>
          <a href="mailto:privacy@gethroughline.com">Contact</a>
        </div>
        <div className="l-footer-copy">© 2026 Throughline</div>
      </footer>
    </div>
  );
}
