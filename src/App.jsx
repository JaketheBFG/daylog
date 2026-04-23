import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rorxefncjeabfvcjdscg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcnhlZm5jamVhYmZ2Y2pkc2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDg5MDMsImV4cCI6MjA4NzYyNDkwM30.8SuVUDwgJi2X3-qSKDK0MOFWXImBt3-hF74It37hXgg'
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#0e0c0a; --surface:#1a1714; --surface2:#221f1b; --border:#2e2a25;
    --text:#e8e0d4; --text-muted:#7a7068; --text-dim:#4a4540;
    --amber:#c8882a; --amber-soft:#e8a84a; --amber-dim:#3a2a10;
    --rose:#c4605a; --rose-dim:#3a1a18; --sage:#6a9e78; --sage-dim:#1a2e20;
    --sky:#6a9ec4; --sky-dim:#1a2a3a; --cream:#f0e8d8;
  }
  body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; min-height:100vh; min-height:100dvh; overflow-x:hidden; display:flex; justify-content:center; padding-top:env(safe-area-inset-top); padding-bottom:env(safe-area-inset-bottom); padding-left:env(safe-area-inset-left); padding-right:env(safe-area-inset-right); }
  .grain { position:fixed; inset:0; pointer-events:none; z-index:100; opacity:0.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .glow { position:fixed; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(200,136,42,0.06) 0%,transparent 70%); pointer-events:none; top:-200px; left:50%; transform:translateX(-50%); }
  .app { max-width:720px; width:100%; padding:0 24px 80px; }  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes dotBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
  @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

  /* ── AUTH ── */
  .auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; width:100%; }
  .auth-card { max-width:420px; width:100%; animation:slideIn 0.5s ease; }
  .auth-logo { font-family:'Playfair Display',serif; font-size:36px; color:var(--cream); letter-spacing:-1px; margin-bottom:6px; text-align:center; }
  .auth-logo span { color:var(--amber-soft); font-style:italic; }
  .auth-tagline { font-size:14px; color:var(--text-muted); text-align:center; font-style:italic; margin-bottom:40px; }
  .auth-box { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; }
  .auth-tabs { display:flex; gap:4px; background:var(--surface2); border-radius:10px; padding:4px; margin-bottom:24px; }
  .auth-tab { flex:1; padding:8px; border-radius:7px; font-size:13px; font-weight:400; cursor:pointer; border:none; background:transparent; color:var(--text-muted); transition:all 0.2s; font-family:'DM Sans',sans-serif; text-align:center; }
  .auth-tab.active { background:var(--surface); color:var(--text); }
  .auth-field { margin-bottom:14px; }
  .auth-label { font-size:11px; color:var(--text-muted); letter-spacing:0.5px; text-transform:uppercase; margin-bottom:6px; display:block; }
  .auth-input { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color 0.2s; }
  .auth-input:focus { border-color:var(--amber); }
  .auth-input::placeholder { color:var(--text-dim); }
  .auth-btn { width:100%; padding:13px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; background:var(--amber); color:#0e0c0a; font-family:'DM Sans',sans-serif; transition:all 0.2s; margin-top:6px; }
  .auth-btn:hover { background:var(--amber-soft); transform:translateY(-1px); }
  .auth-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .auth-error { font-size:13px; color:var(--rose); margin-top:10px; text-align:center; }
  .auth-success { font-size:13px; color:var(--sage); margin-top:10px; text-align:center; }
  .auth-footer { font-size:12px; color:var(--text-dim); text-align:center; margin-top:20px; line-height:1.6; }

  /* ── ONBOARDING ── */
  .ob-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; width:100%; }
  .ob-card { max-width:460px; width:100%; text-align:center; animation:slideIn 0.5s ease; }
  .ob-logo { font-family:'Playfair Display',serif; font-size:32px; color:var(--cream); letter-spacing:-1px; margin-bottom:8px; }
  .ob-logo span { color:var(--amber-soft); font-style:italic; }
  .ob-dots { display:flex; justify-content:center; gap:6px; margin-bottom:32px; }
  .ob-dot { width:6px; height:6px; border-radius:50%; background:var(--border); transition:all 0.3s; }
  .ob-dot.active { background:var(--amber); width:20px; border-radius:3px; }
  .ob-heading { font-family:'Playfair Display',serif; font-size:26px; color:var(--cream); line-height:1.3; margin-bottom:12px; }
  .ob-sub { font-size:15px; color:var(--text-muted); line-height:1.7; margin-bottom:36px; }
  .ob-features { display:flex; flex-direction:column; gap:10px; margin-bottom:36px; text-align:left; }
  .ob-feature { display:flex; align-items:flex-start; gap:14px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px 16px; }
  .ob-feature-icon { font-size:20px; flex-shrink:0; line-height:1.4; }
  .ob-feature-text { font-size:13px; color:var(--text-muted); line-height:1.5; }
  .ob-feature-text strong { color:var(--text); font-weight:500; display:block; margin-bottom:2px; }
  .ob-input { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px 16px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:16px; font-weight:300; outline:none; transition:border-color 0.2s; margin-bottom:12px; text-align:center; }
  .ob-input:focus { border-color:var(--amber); }
  .ob-input::placeholder { color:var(--text-dim); }
  .ob-btn { width:100%; padding:14px; border-radius:12px; font-size:15px; font-weight:500; cursor:pointer; border:none; background:var(--amber); color:#0e0c0a; font-family:'DM Sans',sans-serif; transition:all 0.2s; margin-bottom:10px; }
  .ob-btn:hover { background:var(--amber-soft); transform:translateY(-1px); }
  .ob-skip { font-size:12px; color:var(--text-dim); cursor:pointer; transition:color 0.15s; }
  .ob-skip:hover { color:var(--text-muted); }
  .ob-time-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
  .ob-time-opt { padding:16px; border-radius:12px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; transition:all 0.2s; text-align:left; }
  .ob-time-opt:hover { border-color:var(--text-muted); }
  .ob-time-opt.selected { border-color:var(--amber); background:var(--amber-dim); }
  .ot-emoji { font-size:22px; display:block; margin-bottom:8px; }
  .ot-label { font-size:14px; color:var(--text); font-weight:400; }
  .ot-sub { font-size:11px; color:var(--text-muted); margin-top:3px; }

  /* ── NAV ── */
  .nav { display:flex; align-items:center; justify-content:space-between; padding:28px 0 40px; border-bottom:1px solid var(--border); margin-bottom:40px; flex-wrap:wrap; gap:12px; }
  .nav-logo { font-family:'Playfair Display',serif; font-size:22px; color:var(--cream); letter-spacing:-0.5px; }
  .nav-logo span { color:var(--amber-soft); font-style:italic; }
  .nav-right { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .nav-greeting { font-size:12px; color:var(--text-muted); font-style:italic; }
  .nav-tabs { display:flex; gap:4px; background:var(--surface); border-radius:10px; padding:4px; }
  .nav-tab { padding:7px 13px; border-radius:7px; font-size:12px; font-weight:400; cursor:pointer; border:none; background:transparent; color:var(--text-muted); transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .nav-tab.active { background:var(--surface2); color:var(--text); }
  .nav-tab:hover:not(.active) { color:var(--text); }
  .signout-btn { font-size:11px; color:var(--text-dim); cursor:pointer; transition:color 0.15s; background:none; border:none; font-family:'DM Sans',sans-serif; }
  .signout-btn:hover { color:var(--rose); }

  /* ── DATE ── */
  .date-header { margin-bottom:28px; }
  .date-label { font-family:'Playfair Display',serif; font-size:13px; font-style:italic; color:var(--text-muted); letter-spacing:0.5px; }
  .date-main { font-family:'Playfair Display',serif; font-size:34px; color:var(--cream); line-height:1.1; margin-top:4px; }

  /* ── MOOD ── */
  .mood-row { display:flex; align-items:center; gap:6px; margin-bottom:20px; flex-wrap:nowrap; }
  .mood-label { font-size:12px; color:var(--text-muted); margin-right:2px; white-space:nowrap; flex-shrink:0; }
  .mood-btn { width:34px; height:34px; border-radius:10px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
  .mood-btn:hover { transform:scale(1.15); border-color:var(--text-muted); }
  .mood-btn.selected { transform:scale(1.18); border-color:var(--amber); background:var(--amber-dim); }
  .mood-score-display { font-size:11px; color:var(--amber-soft); font-style:italic; margin-left:2px; white-space:nowrap; }

  /* ── ENTRY ── */
  .entry-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; margin-bottom:20px; }
  .entry-prompt { font-size:13px; color:var(--text-muted); margin-bottom:16px; font-style:italic; }
  .entry-textarea { width:100%; background:transparent; border:none; outline:none; color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; font-size:16px; line-height:1.7; resize:none; min-height:140px; }
  .entry-textarea::placeholder { color:var(--text-dim); }
  .entry-footer { display:flex; align-items:center; justify-content:space-between; margin-top:16px; padding-top:16px; border-top:1px solid var(--border); }
  .char-count { font-size:12px; color:var(--text-dim); }
  .entry-actions { display:flex; gap:8px; align-items:center; }
  .btn { padding:10px 20px; border-radius:10px; font-size:13px; font-weight:500; cursor:pointer; border:none; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .btn-primary { background:var(--amber); color:#0e0c0a; }
  .btn-primary:hover { background:var(--amber-soft); transform:translateY(-1px); }
  .btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .btn-ghost { background:transparent; color:var(--text-muted); border:1px solid var(--border); }
  .btn-ghost:hover { color:var(--text); border-color:var(--text-muted); }
  .btn-ghost.recording { color:var(--rose); border-color:var(--rose); }
  .rec-dot { display:inline-block; width:7px; height:7px; background:var(--rose); border-radius:50%; margin-right:6px; animation:pulse 1s infinite; }
  .analysis-section { margin-bottom:20px; animation:fadeUp 0.4s ease; }
  .section-label { font-size:11px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-muted); margin-bottom:12px; }
  .todo-list { display:flex; flex-direction:column; gap:8px; }
  .todo-item { display:flex; align-items:flex-start; gap:10px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 14px; }
  .todo-check { width:18px; height:18px; border:1.5px solid var(--border); border-radius:5px; flex-shrink:0; margin-top:1px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; }
  .todo-check.done { background:var(--amber); border-color:var(--amber); }
  .todo-check.done::after { content:'✓'; font-size:11px; color:#0e0c0a; font-weight:600; }
  .todo-text { font-size:14px; line-height:1.5; }
  .todo-text.done { text-decoration:line-through; color:var(--text-muted); }
  .tags-row { display:flex; flex-wrap:wrap; gap:8px; }
  .tag { padding:6px 12px; border-radius:20px; font-size:12px; font-weight:400; }
  .tag-stress { background:var(--rose-dim); color:var(--rose); border:1px solid rgba(196,96,90,0.2); }
  .tag-joy { background:var(--sage-dim); color:var(--sage); border:1px solid rgba(106,158,120,0.2); }
  .insight-box { background:var(--amber-dim); border:1px solid rgba(200,136,42,0.2); border-radius:12px; padding:16px; font-size:14px; line-height:1.6; color:var(--cream); }
  .loading-dots { display:flex; gap:5px; align-items:center; padding:8px 0; }
  .loading-dots span { width:6px; height:6px; border-radius:50%; background:var(--amber); animation:dotBounce 1.2s infinite ease-in-out; }
  .loading-dots span:nth-child(2){animation-delay:0.2s} .loading-dots span:nth-child(3){animation-delay:0.4s}
  .empty-state { text-align:center; padding:40px 24px; color:var(--text-dim); font-style:italic; font-size:14px; }

  /* ── PATTERNS ── */
  .week-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; margin-bottom:28px; width:100%; box-sizing:border-box; }  .day-cell { border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6px 2px; gap:2px; cursor:pointer; transition:transform 0.15s; border:1px solid transparent; background:var(--surface); min-width:0; overflow:hidden; }  .day-cell:hover { transform:scale(1.05); }
  .day-cell.active { border-color:var(--amber); }
  .dc-name { font-size:8px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase; color:var(--text-muted); }
  .dc-dot { width:7px; height:7px; border-radius:50%; background:var(--border); }
  .day-cell.has-entry .dc-dot { background:var(--amber-soft); }
  .dc-mood { font-size:11px; margin-top:1px; }
  .pattern-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:14px; }
  .pattern-card h3 { font-family:'Playfair Display',serif; font-size:18px; color:var(--cream); margin-bottom:6px; }
  .pattern-card p { font-size:13px; color:var(--text-muted); line-height:1.6; }
  .bar-chart { display:flex; flex-direction:column; gap:10px; }
  .bar-row { display:flex; align-items:center; gap:10px; }
  .bar-label { font-size:12px; color:var(--text-muted); width:100px; flex-shrink:0; text-align:right; }
  .bar-track { flex:1; height:8px; background:var(--surface2); border-radius:4px; overflow:hidden; }
  .bar-fill { height:100%; border-radius:4px; transition:width 1s cubic-bezier(0.4,0,0.2,1); }
  .bar-fill.stress { background:linear-gradient(90deg,var(--rose-dim),var(--rose)); }
  .bar-fill.joy { background:linear-gradient(90deg,var(--sage-dim),var(--sage)); }
  .bar-pct { font-size:11px; color:var(--text-dim); width:32px; }
  .mood-chart-wrap { display:flex; flex-direction:column; gap:6px; }
  .mood-chart-row { display:flex; align-items:center; gap:10px; }
  .mood-chart-date { font-size:11px; color:var(--text-dim); width:52px; flex-shrink:0; }
  .mood-chart-bar { flex:1; height:30px; background:var(--surface2); border-radius:6px; overflow:hidden; display:flex; align-items:center; }
  .mood-chart-fill { height:100%; border-radius:6px; display:flex; align-items:center; padding-left:10px; gap:7px; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); min-width:60px; }
  .mood-chart-emoji { font-size:14px; }
  .mood-chart-val { font-size:11px; color:rgba(255,255,255,0.8); font-weight:500; }
  .digest-card { background:linear-gradient(135deg,var(--surface),var(--surface2)); border:1px solid rgba(106,158,196,0.2); border-radius:14px; padding:22px; margin-bottom:14px; animation:fadeUp 0.5s ease; }
  .digest-week { font-family:'Playfair Display',serif; font-style:italic; font-size:12px; color:var(--sky); margin-bottom:16px; }
  .digest-headline { font-family:'Playfair Display',serif; font-size:17px; font-style:italic; color:var(--cream); line-height:1.5; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border); }
  .digest-section { margin-bottom:14px; }
  .digest-section-label { font-size:10px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-dim); margin-bottom:5px; }
  .digest-body { font-size:14px; line-height:1.7; color:var(--text); }
  .digest-nudge { font-size:14px; line-height:1.7; color:var(--amber-soft); }
  .digest-gen-btn { display:flex; align-items:center; gap:8px; width:100%; background:var(--sky-dim); border:1px dashed rgba(106,158,196,0.3); border-radius:12px; padding:14px 18px; cursor:pointer; transition:all 0.2s; color:var(--sky); font-family:'DM Sans',sans-serif; font-size:13px; margin-bottom:14px; }
  .digest-gen-btn:hover { background:rgba(26,42,58,0.9); }
  .digest-gen-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .summary-card { background:linear-gradient(135deg,var(--surface),var(--surface2)); border:1px solid var(--border); border-radius:14px; padding:24px; margin-bottom:14px; }
  .summary-month { font-family:'Playfair Display',serif; font-style:italic; font-size:13px; color:var(--amber-soft); margin-bottom:8px; }
  .summary-text { font-size:14px; line-height:1.75; color:var(--text); }

  /* ── PLAN ── */
  .plan-input-area { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px 16px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:15px; font-weight:300; outline:none; transition:border-color 0.2s; resize:none; line-height:1.6; }
  .plan-input-area:focus { border-color:var(--amber); }
  .plan-input-area::placeholder { color:var(--text-dim); }
  .plan-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px 24px; margin-bottom:16px; animation:fadeUp 0.3s ease; }
  .plan-intention { font-family:'Playfair Display',serif; font-size:21px; color:var(--cream); line-height:1.4; margin-bottom:22px; font-style:italic; }
  .plan-section-label { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-dim); font-weight:500; margin-bottom:10px; }
  .plan-priority { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); }
  .plan-priority:last-child { border-bottom:none; }
  .plan-priority-num { font-size:11px; color:var(--amber); font-weight:500; flex-shrink:0; padding-top:3px; min-width:14px; }
  .plan-priority-text { font-size:14px; color:var(--text); line-height:1.5; }
  .plan-todo-item { display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid var(--border); }
  .plan-todo-item:last-child { border-bottom:none; }
  .plan-todo-text { font-size:14px; color:var(--text); line-height:1.5; flex:1; }
  .plan-todo-text.done { text-decoration:line-through; color:var(--text-muted); }
  .plan-note { font-size:14px; color:var(--text-muted); line-height:1.7; font-style:italic; padding:14px 16px; background:var(--surface2); border-radius:10px; margin-top:4px; }
  .plan-divider { height:1px; background:var(--border); margin:18px 0; }
  /* ── SUBSECTIONS ── */
  .subsection-toggle { display:flex; align-items:center; gap:10px; padding:12px 0; cursor:pointer; border-top:1px solid var(--border); user-select:none; }
  .subsection-toggle:first-of-type { margin-top:8px; }
  .subsection-emoji { font-size:15px; }
  .subsection-label { font-size:13px; color:var(--text-muted); flex:1; }
  .subsection-chevron { font-size:10px; color:var(--text-dim); transition:transform 0.2s; }
  .subsection-chevron.open { transform:rotate(90deg); }
  .subsection-body { padding:8px 0 14px; animation:fadeUp 0.2s ease; }
  .subsection-textarea { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; font-size:14px; line-height:1.6; resize:none; outline:none; transition:border-color 0.2s; }
  .subsection-textarea:focus { border-color:var(--amber); }
  .subsection-textarea::placeholder { color:var(--text-dim); }
  .group-tasks { display:flex; flex-direction:column; gap:8px; }

  /* ── HABITS ── */
  .habit-grid-wrap { overflow-x:auto; padding-bottom:4px; }
.habit-row { display:grid; grid-template-columns:110px repeat(28,1fr); align-items:center; gap:3px; margin-bottom:5px; }
@media (max-width:600px) { .habit-row { grid-template-columns:80px repeat(7,1fr); } .habit-day-labels { grid-template-columns:80px repeat(7,1fr); } }  .habit-name-cell { font-size:12px; color:var(--text-muted); padding-right:8px; text-align:right; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .habit-dot { width:100%; aspect-ratio:1; border-radius:3px; background:var(--surface2); border:1px solid var(--border); cursor:pointer; transition:all 0.12s; }
  .habit-dot:hover { border-color:var(--text-dim); }
  .habit-dot.checked { border-color:transparent; }
  .habit-day-labels { display:grid; grid-template-columns:110px repeat(28,1fr); gap:3px; margin-bottom:8px; }
  .habit-day-label { font-size:8px; color:var(--text-dim); text-align:center; }
  .add-habit-row { display:flex; gap:8px; margin-top:12px; animation:fadeUp 0.2s ease; }
  .add-habit-input { flex:1; background:var(--surface2); border:1px solid var(--amber); border-radius:8px; padding:8px 12px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; outline:none; }
  .add-habit-input::placeholder { color:var(--text-dim); }
  .habit-color-pick { display:flex; gap:5px; align-items:center; margin-top:8px; flex-wrap:wrap; }
  .habit-color-swatch { width:18px; height:18px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:transform 0.15s; flex-shrink:0; }
  .habit-color-swatch:hover { transform:scale(1.2); }
  .habit-color-swatch.selected { border-color:var(--cream); }
  .habit-row-wrap { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
  .habit-del { background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:14px; transition:color 0.15s; padding:0; flex-shrink:0; }
  .habit-del:hover { color:var(--rose); }
  .habit-streak-label { font-size:10px; color:var(--amber-soft); font-style:italic; }

  /* ── GOALS ── */
  .goal-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px 20px; margin-bottom:10px; animation:fadeUp 0.3s ease; }
  .goal-card.suggested { border-color:rgba(200,136,42,0.25); background:linear-gradient(135deg,var(--surface),var(--amber-dim)); }
  .goal-header { display:flex; align-items:flex-start; gap:12px; }
  .goal-icon { font-size:18px; flex-shrink:0; line-height:1.4; }
  .goal-body { flex:1; }
  .goal-title { font-size:15px; color:var(--cream); line-height:1.4; margin-bottom:5px; }
  .goal-why { font-size:12px; color:var(--text-muted); line-height:1.5; font-style:italic; }
  .goal-footer { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
  .goal-badge { font-size:10px; padding:3px 9px; border-radius:10px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase; }
  .goal-badge.suggested-badge { background:var(--amber-dim); color:var(--amber-soft); }
  .goal-badge.mine-badge { background:var(--surface2); color:var(--text-dim); }
  .goal-actions { display:flex; gap:6px; }
  .goal-btn { padding:5px 12px; border-radius:8px; font-size:11px; font-family:'DM Sans',sans-serif; cursor:pointer; border:1px solid var(--border); background:transparent; color:var(--text-muted); transition:all 0.15s; }
  .goal-btn.accept { border-color:var(--sage); color:var(--sage); }
  .goal-btn.accept:hover { background:var(--sage-dim); }
  .goal-btn.delete:hover { color:var(--rose); border-color:var(--rose); }
  .add-goal-row { display:flex; gap:8px; margin-bottom:12px; }
  .add-goal-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:10px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color 0.2s; }
  .add-goal-input:focus { border-color:var(--amber); }
  .add-goal-input::placeholder { color:var(--text-dim); }
  .goals-suggest-btn { display:flex; align-items:center; gap:8px; width:100%; background:var(--amber-dim); border:1px dashed rgba(200,136,42,0.4); border-radius:12px; padding:14px 18px; cursor:pointer; transition:all 0.2s; color:var(--amber-soft); font-family:'DM Sans',sans-serif; font-size:13px; margin-bottom:14px; }
  .goals-suggest-btn:hover { background:rgba(58,42,16,0.8); }
  .goals-suggest-btn:disabled { opacity:0.5; cursor:not-allowed; }

  /* ── HABITS & GOALS TAB SECTIONS ── */
  .hg-section { margin-bottom:36px; }
  .hg-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid var(--border); }
  .hg-section-title { font-family:'Playfair Display',serif; font-size:22px; color:var(--cream); }
  .hg-section-sub { font-size:12px; color:var(--text-muted); font-style:italic; margin-top:3px; }

  @media (max-width:600px) {
    .app { padding:0 16px 80px; overflow-x:hidden; }
    .task-group-select { display:none; }
    .add-task-row .task-group-select { display:block; width:100%; }
    .group-bar { display:none; }
    .task-item { max-width:100%; }
  }
`;

const MOODS = [
  {emoji:"😔",label:"rough", score:1,color:"#a04040"},
  {emoji:"😕",label:"meh",   score:2,color:"#a06830"},
  {emoji:"😐",label:"okay",  score:3,color:"#8a8050"},
  {emoji:"🙂",label:"good",  score:4,color:"#508a60"},
  {emoji:"😄",label:"great", score:5,color:"#3a8a6a"},
];
const HABIT_COLORS = ["#6a9e78","#7a9ec4","#c4a45a","#a47ac4","#c4705a","#5ab4c4"];
const WEEK_DAYS = ["M","T","W","T","F","S","S"];
const OB_TIMES = [
  {emoji:"🌅",label:"Morning", sub:"Start the day with intention", value:"morning"},
  {emoji:"☀️",label:"Midday",  sub:"Check in at lunch",            value:"midday"},
  {emoji:"🌆",label:"Evening", sub:"Wind down and reflect",        value:"evening"},
  {emoji:"🌙",label:"Night",   sub:"Before sleep ritual",          value:"night"},
];


function last28Days(){ return Array.from({length:28},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(27-i)); return d.toISOString().split("T")[0]; }); }
function lastNDays(n){ return Array.from({length:n},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(n-1-i)); return d.toISOString().split("T")[0]; }); }
function formatDate(d){ return new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}); }
function shortDate(d){ return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}); }

async function checkAndIncrementUsage(userId, isPro=false){
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = today.slice(0,7);
  const {data} = await supabase.from("ai_usage").select("count,monthly_count,month").eq("user_id",userId).eq("date",today).single();
  
  const monthlyCount = data?.month===thisMonth ? (data?.monthly_count||0) : 0;
  const monthlyLimit = isPro ? 40 : 5;
  
  if(monthlyCount >= monthlyLimit) return {allowed:false, reason: isPro ? "monthly_pro" : "monthly_free"};
  
  await supabase.from("ai_usage").upsert({
    user_id:userId, date:today, 
    count:(data?.count||0)+1,
    monthly_count:monthlyCount+1,
    month:thisMonth
  },{onConflict:"user_id,date"});
  return {allowed:true};
}

async function callClaude(prompt,maxTokens=1000,userId=null,isPro=false){
  if(userId){
    const result = await checkAndIncrementUsage(userId, isPro);
    if(!result.allowed) throw new Error("RATE_LIMIT");
  }
  const res=await fetch("/api/reflect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  return (data.content?.find(b=>b.type==="text")?.text||"{}").replace(/```json|```/g,"").trim();
}

async function analyzeEntry(text,subTodos,subLearned,subGratitude,userId=null,isPro=false){ 
  const extra = [subTodos&&`TO-DOS SECTION: ${subTodos}`,subLearned&&`THINGS I LEARNED: ${subLearned}`,subGratitude&&`GRATITUDE: ${subGratitude}`].filter(Boolean).join("\n");
  const fullText = extra ? `${text}\n\n${extra}` : text;
  const STRESS_CATS = ["Work","Relationships","Health","Finance","Sleep","Family","Social","Commute","Technology","Time pressure"];
  const JOY_CATS = ["Exercise","Creativity","Learning","Nature","Food","Music","Rest","Deep work","Connection","Accomplishment"];
  return JSON.parse(await callClaude(`Analyze this journal entry and respond ONLY with valid JSON. Extract todos PRIMARILY from the TO-DOS SECTION if present.
For stressTags and joyTags: include specific descriptive tags (2-4 words) that capture what actually happened.
Also include stressCategories and joyCategories using ONLY these exact categories:
Stress categories: ${STRESS_CATS.join(", ")}
Joy categories: ${JOY_CATS.join(", ")}
{"todos":["action item"],"stressTags":["specific tag"],"joyTags":["specific tag"],"stressCategories":["category"],"joyCategories":["category"],"insight":"One warm sentence."}
Entry:\n${fullText}`,1000,userId,isPro)); 
}
async function suggestGoals(entries,userId=null,isPro=false){ return JSON.parse(await callClaude(`Suggest 3 personal growth goals based on these journal entries. Focus on happiness and wellbeing, NOT productivity.\n${entries.slice(0,5).map(e=>`${e.date}: ${e.text}`).join("\n")}\nRespond ONLY with valid JSON array:\n[{"title":"goal","why":"reason","icon":"emoji"}]`,1000,userId,isPro)); }async function generateMonthlySummary(entries,userName,userId=null,isPro=false){ return JSON.parse(await callClaude(`Write a warm monthly summary for ${userName||"this person"} based on their journal entries this month.\nEntries:\n${entries.slice(0,20).map(e=>`${e.date}: ${e.text}`).join("\n\n")}\nRespond ONLY with valid JSON:\n{"summary":"2-3 sentence warm paragraph summarizing their month, patterns, and growth"}`,600,userId,isPro)); }
async function generateWeeklyDigest(entries,userName,userId=null,isPro=false){ return JSON.parse(await callClaude(`Write a personal weekly reflection for ${userName||"this person"}.\nEntries:\n${entries.slice(0,7).map(e=>`${e.date} (mood ${e.mood||"?"}/5): ${e.text}`).join("\n\n")}\nRespond ONLY with valid JSON:\n{"headline":"evocative sentence","highlight":"best moment","pattern":"recurring observation","nudge":"one kind suggestion for next week"}`,800,userId,isPro)); }
async function generateDayPlan(input,userName,userId=null,isPro=false){ return JSON.parse(await callClaude(`Help ${userName||"this person"} plan their day. Based on what they shared, create a focused, grounded day plan.\nRespond ONLY with valid JSON:\n{"intention":"one evocative sentence to hold through the day","priorities":["most important thing","second priority","third priority"],"todos":["specific action","specific action"],"note":"one warm closing nudge or encouragement"}\nWhat they shared:\n${input}`,800,userId,isPro)); }
export default function App() {
  // Auth
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [newPassword, setNewPassword] = useState("");

  // Onboarding
  const [obDone, setObDone] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // Core
  const [tab,setTab]=useState("today");
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [todos,setTodos]=useState([]);
  const [checkedTodos,setCheckedTodos]=useState({});
  const [subTodos,setSubTodos]=useState("");
  const [subLearned,setSubLearned]=useState("");
  const [subGratitude,setSubGratitude]=useState("");
  const [expandedSections,setExpandedSections]=useState({todos:false,learned:false,gratitude:false});
  const [entries,setEntries]=useState([]);
  const [recording,setRecording]=useState(false);
  const [todayMood,setTodayMood]=useState(null);
  const [dbLoading,setDbLoading]=useState(true);
  const recognitionRef=useRef(null);
  const todayStr=new Date().toISOString().split("T")[0];
const [selectedDate,setSelectedDate]=useState(todayStr);

  // Plan
  const [planInput,setPlanInput]=useState("");
  const [planLoading,setPlanLoading]=useState(false);
  const [dayPlan,setDayPlan]=useState(null);
  const [planTodos,setPlanTodos]=useState([]);
  const [planRecording,setPlanRecording]=useState(false);
  const planRecognitionRef=useRef(null);

  // Habits
  const [habits,setHabits]=useState([]);
  const [addingHabit,setAddingHabit]=useState(false);
  const [newHabitName,setNewHabitName]=useState("");
  const [newHabitColor,setNewHabitColor]=useState(HABIT_COLORS[0]);

  // Goals
  const [goals,setGoals]=useState([]);
  const [suggestedGoals,setSuggestedGoals]=useState([]);
  const [suggestingGoals,setSuggestingGoals]=useState(false);
  const [newGoalText,setNewGoalText]=useState("");
  const [addingGoal,setAddingGoal]=useState(false);

  // Digest / Summary
  const [digest,setDigest]=useState(null);
  const [patternPeriod,setPatternPeriod]=useState("month");
  const [patternOffset,setPatternOffset]=useState(0);
  const [isPro,setIsPro]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const [expandedEntry,setExpandedEntry]=useState(null);
  const [searchQuery,setSearchQuery]=useState("");
const [editingEntry,setEditingEntry]=useState(null);
const [editingText,setEditingText]=useState("");
  const [generatingDigest,setGeneratingDigest]=useState(false);
  const [monthlySummary,setMonthlySummary]=useState(null);
  const [generatingMonthlySummary,setGeneratingMonthlySummary]=useState(false);

  // ── Load plan from localStorage ──
  useEffect(()=>{
    const saved=localStorage.getItem(`dayplan_${todayStr}`);
    if(saved){ try{ const p=JSON.parse(saved); setDayPlan(p.plan); setPlanTodos(p.todos||[]); }catch(e){} }
  },[]);

  // ── Notifications ──
  useEffect(()=>{
    if(!window.Capacitor) return;
    const setupNotifications=async()=>{
      try {
        const {LocalNotifications}=await import("@capacitor/local-notifications");
        const {display}=await LocalNotifications.requestPermissions();
        if(display==="granted"){
          await LocalNotifications.cancel({notifications:[{id:1}]});
          await LocalNotifications.schedule({notifications:[{
            id:1,
            title:"Time to reflect ✦",
            body:"A few minutes of journaling can change your whole perspective.",
            schedule:{on:{hour:21,minute:0}},
            sound:null,
            actionTypeId:"",
            extra:null
          }]});
        }
      } catch(e){ console.log("Notifications not available",e); }
    };
    setupNotifications();
  },[]);


  // ── Auth listener ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      setAuthLoading(false);
      if(session){
        const meta = session.user.user_metadata;
        if(meta?.name) setUserName(meta.name);
        if(meta?.preferred_time) setPreferredTime(meta.preferred_time);
        if(meta?.ob_done) setObDone(true);
      }
    });
    const hash = window.location.hash;
const query = window.location.search;
if(hash.includes("type=recovery") || query.includes("type=recovery")) setAuthMode("reset");
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="PASSWORD_RECOVERY"){ setSession(null); setAuthMode("reset"); return; }
      setSession(session);
      if(session){
        const meta = session.user.user_metadata;
        if(meta?.name) setUserName(meta.name);
        if(meta?.preferred_time) setPreferredTime(meta.preferred_time);
        if(meta?.ob_done) setObDone(true);
      }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  // ── Load data ──
  useEffect(()=>{
    if(!session) return;
    async function loadAll(){
      setDbLoading(true);
      const uid = session.user.id;
      const [entriesRes,habitsRes,goalsRes,profileRes]=await Promise.all([
        supabase.from("entries").select("*").eq("user_id",uid).order("date",{ascending:false}),
        supabase.from("habits").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
        supabase.from("goals").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
        supabase.from("profiles").select("*").eq("id",uid).single(),
      ]);
      if(entriesRes.data?.length) setEntries(entriesRes.data.map(e=>({...e,todos:e.todos||[],stressTags:e.stress_tags||[],joyTags:e.joy_tags||[],stressCategories:e.stress_categories||[],joyCategories:e.joy_categories||[]})));
      if(habitsRes.data?.length) setHabits(habitsRes.data.map(h=>({...h,checked:h.checked||{}})));
     if(goalsRes.data?.length) setGoals(goalsRes.data);
      if(profileRes.data) setIsPro(profileRes.data.is_pro && (!profileRes.data.pro_expires_at || new Date(profileRes.data.pro_expires_at) > new Date()));
      setDbLoading(false);
    }
    loadAll();
  },[session]);

  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const monthYear=new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const moodForDay=(date)=>{ const e=entries.find(en=>en.date===date); return e?.mood||null; };

  // ── Auth actions ──
  const handleSignUp = async()=>{
    setAuthSubmitting(true); setAuthError(""); setAuthSuccess("");
    const {error}=await supabase.auth.signUp({email:authEmail,password:authPassword,options:{data:{name:authName}}});
    if(error) setAuthError(error.message);
    else setAuthSuccess("Check your email to confirm your account!");
    setAuthSubmitting(false);
  };
  const handleSignIn = async()=>{
    setAuthSubmitting(true); setAuthError(""); setAuthSuccess("");
    const {error}=await supabase.auth.signInWithPassword({email:authEmail,password:authPassword});
    if(error) setAuthError(error.message);
    setAuthSubmitting(false);
  };
  const handleForgotPassword = async()=>{
    setAuthSubmitting(true); setAuthError(""); setAuthSuccess("");
const {error}=await supabase.auth.resetPasswordForEmail(authEmail,{redirectTo:"https://www.gethroughline.com/app?type=recovery"});    if(error) setAuthError(error.message);
    else setAuthSuccess("Check your email for a reset link!");
    setAuthSubmitting(false);
  };
  const handleUpdatePassword = async()=>{
    setAuthSubmitting(true); setAuthError("");
    const {error}=await supabase.auth.updateUser({password:newPassword});
    if(error) setAuthError(error.message);
    else { setAuthSuccess("Password updated! Signing you in..."); setAuthMode("login"); }
    setAuthSubmitting(false);
  };
  const handleSignOut = async()=>{
    await supabase.auth.signOut();
    setSession(null); setEntries([]); setHabits([]); setGoals([]);
    setObDone(false); setUserName(""); setPreferredTime("");
  };

  // ── Finish onboarding ──
  const finishOnboarding = async()=>{
    await supabase.auth.updateUser({data:{name:userName,preferred_time:preferredTime,ob_done:true}});
    setObDone(true);
  };

  // ── Plan helpers ──
  const handleGeneratePlan=async()=>{
    if(!planInput.trim()||!session)return;
    setPlanLoading(true);
    try{
      const plan=await generateDayPlan(planInput,userName,session.user.id,isPro);
      const todos=(plan.todos||[]).map(t=>({text:t,done:false}));
      setDayPlan(plan); setPlanTodos(todos);
      localStorage.setItem(`dayplan_${todayStr}`,JSON.stringify({plan,todos}));
    }catch(e){}
    setPlanLoading(false);
  };
  const togglePlanTodo=(i)=>setPlanTodos(p=>{
    const next=p.map((t,idx)=>idx===i?{...t,done:!t.done}:t);
    const saved=localStorage.getItem(`dayplan_${todayStr}`);
    const parsed=saved?JSON.parse(saved):{};
    localStorage.setItem(`dayplan_${todayStr}`,JSON.stringify({...parsed,todos:next}));
    return next;
  });
  const resetPlan=()=>{ setDayPlan(null); setPlanInput(""); setPlanTodos([]); localStorage.removeItem(`dayplan_${todayStr}`); };
  const now=new Date();
  let periodStartDate,periodEndDate,periodLabel;
  if(patternPeriod==="week"){
    periodEndDate=new Date(now); periodEndDate.setDate(periodEndDate.getDate()-patternOffset*7);
    periodStartDate=new Date(periodEndDate); periodStartDate.setDate(periodStartDate.getDate()-6);
    periodLabel=patternOffset===0?"This week":`${shortDate(periodStartDate.toISOString().split("T")[0])} – ${shortDate(periodEndDate.toISOString().split("T")[0])}`;
  } else if(patternPeriod==="month"){
    const t=new Date(now.getFullYear(),now.getMonth()-patternOffset,1);
    periodStartDate=t;
    periodEndDate=new Date(t.getFullYear(),t.getMonth()+1,0);
    periodLabel=patternOffset===0?"This month":t.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  } else {
    const yr=now.getFullYear()-patternOffset;
    periodStartDate=new Date(yr,0,1); periodEndDate=new Date(yr,11,31);
    periodLabel=patternOffset===0?"This year":String(yr);
  }
  const periodStartStr=periodStartDate.toISOString().split("T")[0];
  const periodEndStr=periodEndDate.toISOString().split("T")[0];
  const filteredEntries=entries.filter(e=>e.date>=periodStartStr&&e.date<=periodEndStr);
  const stressTagCounts={};const joyTagCounts={};
  filteredEntries.forEach(e=>{
    (e.stressCategories||e.stressTags||[]).forEach(t=>{stressTagCounts[t]=(stressTagCounts[t]||0)+1;});
    (e.joyCategories||e.joyTags||[]).forEach(t=>{joyTagCounts[t]=(joyTagCounts[t]||0)+1;});
  });
  const maxStress=Math.max(1,...Object.values(stressTagCounts));const maxJoy=Math.max(1,...Object.values(joyTagCounts));
  const STRESS_PATTERNS=Object.entries(stressTagCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({label,count,pct:Math.round(count/maxStress*100)}));
  const JOY_PATTERNS=Object.entries(joyTagCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({label,count,pct:Math.round(count/maxJoy*100)}));

  // ── Habit helpers ──
  const toggleHabit=async(hid,date)=>{ const habit=habits.find(h=>h.id===hid); const newChecked={...habit.checked,[date]:!habit.checked[date]}; setHabits(p=>p.map(h=>h.id===hid?{...h,checked:newChecked}:h)); await supabase.from("habits").update({checked:newChecked}).eq("id",hid); };
  const addHabit=async()=>{ if(!newHabitName.trim()||!session)return; const h={id:"h"+Date.now(),name:newHabitName.trim(),color:newHabitColor,checked:Object.fromEntries(last28Days().map(d=>[d,false])),user_id:session.user.id}; setHabits(p=>[...p,h]); await supabase.from("habits").insert(h); setNewHabitName(""); setAddingHabit(false); };
  const deleteHabit=async(hid)=>{ setHabits(p=>p.filter(h=>h.id!==hid)); await supabase.from("habits").delete().eq("id",hid); };
  const habitStreak=(h)=>{ let s=0; for(const d of last28Days().reverse()){ if(h.checked[d])s++; else break; } return s; };

  // ── Goal helpers ──
  const acceptSuggested=async(sg)=>{ if(!session)return; const g={id:"g"+Date.now(),title:sg.title,why:sg.why||"",icon:sg.icon||"✦",source:"mine",user_id:session.user.id}; setGoals(p=>[...p,g]); setSuggestedGoals(p=>p.filter(x=>x!==sg)); await supabase.from("goals").insert(g); };
  const dismissSuggested=(sg)=>setSuggestedGoals(p=>p.filter(x=>x!==sg));
  const deleteGoal=async(gid)=>{ setGoals(p=>p.filter(g=>g.id!==gid)); await supabase.from("goals").delete().eq("id",gid); };
  const addManualGoal=async()=>{ if(!newGoalText.trim()||!session)return; const g={id:"g"+Date.now(),title:newGoalText.trim(),why:"",icon:"✦",source:"mine",user_id:session.user.id}; setGoals(p=>[...p,g]); await supabase.from("goals").insert(g); setNewGoalText(""); setAddingGoal(false); };
const handleSuggestGoals=async()=>{ setSuggestingGoals(true); try{ const s=await suggestGoals(entries,session.user.id,isPro); setSuggestedGoals(s.map(g=>({...g,id:"sg"+Date.now()+Math.random()}))); }catch(e){} setSuggestingGoals(false); };  const handleGenerateMonthlySummary=async()=>{ setGeneratingMonthlySummary(true); try{ const d=await generateMonthlySummary(entries,userName,session.user.id,isPro); setMonthlySummary(d.summary); }catch(e){} setGeneratingMonthlySummary(false); };
const handleGenerateDigest=async()=>{ setGeneratingDigest(true); try{ const d=await generateWeeklyDigest(entries,userName,session.user.id,isPro); setDigest(d); }catch(e){} setGeneratingDigest(false); };
  // ── Entry analysis ──
  const handleAnalyze=async()=>{
    if(!text.trim()||!session){ console.log("blocked - text:", text.trim(), "session:", session); return; }
    setLoading(true); setResult(null);
    try{
const parsed=await analyzeEntry(text,subTodos,subLearned,subGratitude,session.user.id,isPro);      setResult(parsed); setTodos(parsed.todos||[]);
const entry={date:selectedDate,mood:todayMood,text,todos:parsed.todos||[],stress_tags:parsed.stressTags||[],joy_tags:parsed.joyTags||[],stress_categories:parsed.stressCategories||[],joy_categories:parsed.joyCategories||[],insight:parsed.insight||"",user_id:session.user.id};      const {data}=await supabase.from("entries").insert(entry).select().single();
      if(data) setEntries(p=>[{...data,stressTags:data.stress_tags||[],joyTags:data.joy_tags||[],stressCategories:data.stress_categories||[],joyCategories:data.joy_categories||[]},...p]);
    }catch(e){ setResult({error:true}); }
    setLoading(false);
  };

  // ── Voice ──
 const toggleVoice=()=>{
    if(recording){ recognitionRef.current?.stop(); setRecording(false); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ alert("Voice input not supported on this device."); return; }
    const r=new SR();
    r.continuous=true;
    r.interimResults=false;
    r.lang="en-US";
    r.onresult=(e)=>{
      let f="";
      for(let i=e.resultIndex;i<e.results.length;i++){
        if(e.results[i].isFinal) f+=e.results[i][0].transcript+" ";
      }
      if(f) setText(p=>p+f);
    };
    r.onend=()=>setRecording(false);
    r.start();
    recognitionRef.current=r;
    setRecording(true);
  };

  const togglePlanVoice=()=>{
    if(planRecording){ planRecognitionRef.current?.stop(); setPlanRecording(false); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ alert("Voice input not supported on this device."); return; }
    const r=new SR();
    r.continuous=true; r.interimResults=false; r.lang="en-US";
    r.onresult=(e)=>{ let f=""; for(let i=e.resultIndex;i<e.results.length;i++){ if(e.results[i].isFinal) f+=e.results[i][0].transcript+" "; } if(f) setPlanInput(p=>p+f); };
    r.onend=()=>setPlanRecording(false);
    r.start(); planRecognitionRef.current=r; setPlanRecording(true);
  };

 const weekDates=lastNDays(7);
const isMobile=window.innerWidth<=600;
const habitDays=isMobile?lastNDays(7):last28Days();

  // ── Loading screen ──
  if(authLoading) return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/><div className="auth-wrap"><div style={{color:"var(--text-muted)",fontStyle:"italic",fontSize:14}}>Loading...</div></div></>);

  // ════════════════════════════════════════════════════════════════════════════
  // AUTH SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if(!session){
    return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">through<span>line</span></div>
          <div className="auth-tagline">your private space to reflect and grow</div>
          <div className="auth-box">
            {authMode==="reset"?<>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:17,color:"var(--cream)",marginBottom:6}}>Set a new password</div>
              <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>Choose something you'll remember.</div>
              <div className="auth-field"><label className="auth-label">New password</label><input className="auth-input" type="password" placeholder="••••••••" value={newPassword} onChange={e=>setNewPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleUpdatePassword()}/></div>
              <button className="auth-btn" onClick={handleUpdatePassword} disabled={authSubmitting||!newPassword||newPassword.length<6}>{authSubmitting?"...":"Update password →"}</button>
            </>:authMode==="forgot"?<>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:17,color:"var(--cream)",marginBottom:6}}>Reset your password</div>
              <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>We'll send a reset link to your email.</div>
              <div className="auth-field"><label className="auth-label">Email</label><input className="auth-input" type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleForgotPassword()}/></div>
              <button className="auth-btn" onClick={handleForgotPassword} disabled={authSubmitting||!authEmail}>{authSubmitting?"...":"Send reset link →"}</button>
              <div style={{textAlign:"center",marginTop:12}}><span style={{fontSize:12,color:"var(--text-dim)",cursor:"pointer"}} onClick={()=>{setAuthMode("login");setAuthError("");setAuthSuccess("");}}>← Back to sign in</span></div>
            </>:<>
              <div className="auth-tabs">
                <button className={`auth-tab ${authMode==="login"?"active":""}`} onClick={()=>{setAuthMode("login");setAuthError("");setAuthSuccess("");}}>Sign in</button>
                <button className={`auth-tab ${authMode==="signup"?"active":""}`} onClick={()=>{setAuthMode("signup");setAuthError("");setAuthSuccess("");}}>Create account</button>
              </div>
              {authMode==="signup"&&<div className="auth-field"><label className="auth-label">Your name</label><input className="auth-input" placeholder="First name" value={authName} onChange={e=>setAuthName(e.target.value)}/></div>}
              <div className="auth-field"><label className="auth-label">Email</label><input className="auth-input" type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(authMode==="login"?handleSignIn():handleSignUp())}/></div>
              <div className="auth-field"><label className="auth-label">Password</label><input className="auth-input" type="password" placeholder="••••••••" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(authMode==="login"?handleSignIn():handleSignUp())}/></div>
              <button className="auth-btn" onClick={authMode==="login"?handleSignIn:handleSignUp} disabled={authSubmitting||!authEmail||!authPassword}>
                {authSubmitting?"...":(authMode==="login"?"Sign in →":"Create account →")}
              </button>
              {authMode==="login"&&<div style={{textAlign:"center",marginTop:10}}><span style={{fontSize:12,color:"var(--text-dim)",cursor:"pointer"}} onClick={()=>{setAuthMode("forgot");setAuthError("");setAuthSuccess("");}}>Forgot password?</span></div>}
            </>}
            {authError&&<div className="auth-error">{authError}</div>}
            {authSuccess&&<div className="auth-success">{authSuccess}</div>}
          </div>
          <div className="auth-footer">Your journal is private and encrypted.<br/>Only you can see your entries.</div>
        </div>
      </div>
    </>);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ONBOARDING
  // ════════════════════════════════════════════════════════════════════════════
  if(!obDone){
    return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/>
      <div className="ob-wrap"><div className="ob-card">
        <div className="ob-logo">through<span>line</span></div>
        <div className="ob-dots">{[0,1,2,3].map(i=><div key={i} className={`ob-dot ${i===obStep?"active":""}`}/>)}</div>
        {obStep===0&&<>
          <div className="ob-heading">Your private space to unwind and understand yourself</div>
          <div className="ob-sub">Talk or write about your day. throughline listens, finds patterns, and gently helps you grow.</div>
          <div className="ob-features">
            <div className="ob-feature"><div className="ob-feature-icon">🎙</div><div className="ob-feature-text"><strong>Voice or text</strong>Just talk freely. No structure needed.</div></div>
            <div className="ob-feature"><div className="ob-feature-icon">✦</div><div className="ob-feature-text"><strong>Patterns over time</strong>See what drains you and what lights you up.</div></div>
            <div className="ob-feature"><div className="ob-feature-icon">🌿</div><div className="ob-feature-text"><strong>Goals that actually matter</strong>Not productivity — becoming more yourself.</div></div>
          </div>
          <button className="ob-btn" onClick={()=>setObStep(1)}>Get started →</button>
          <div className="ob-skip" onClick={finishOnboarding}>Skip and explore</div>
        </>}
        {obStep===1&&<>
          <div className="ob-heading">What should we call you?</div>
          <div className="ob-sub">Just your first name. It makes things feel a little more personal.</div>
          <input className="ob-input" placeholder="Your name" value={userName} onChange={e=>setUserName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setObStep(2)} autoFocus/>
          <button className="ob-btn" onClick={()=>setObStep(2)}>{userName.trim()?`Nice to meet you, ${userName.split(" ")[0]} →`:"Skip for now →"}</button>
        </>}
        {obStep===2&&<>
          <div className="ob-heading">When do you usually want to reflect?</div>
          <div className="ob-sub">We'll use this to set the right tone.</div>
          <div className="ob-time-grid">{OB_TIMES.map(t=><div key={t.value} className={`ob-time-opt ${preferredTime===t.value?"selected":""}`} onClick={()=>setPreferredTime(t.value)}><span className="ot-emoji">{t.emoji}</span><div className="ot-label">{t.label}</div><div className="ot-sub">{t.sub}</div></div>)}</div>
          <button className="ob-btn" onClick={()=>setObStep(3)}>Continue →</button>
        </>}
        {obStep===3&&<>
          <div style={{fontSize:52,marginBottom:16}}>🌿</div>
          <div className="ob-heading">{userName?`You're all set, ${userName.split(" ")[0]}`:"You're all set"}</div>
          <div className="ob-sub">Your journal is ready. Everything you write is private and saved.</div>
          <button className="ob-btn" onClick={finishOnboarding}>Open my journal →</button>
        </>}
      </div></div>
    </>);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN APP
  // ════════════════════════════════════════════════════════════════════════════

  // ── Reusable Habits section ──
  const HabitsSection = () => (
    <div className="hg-section">
      <div className="hg-section-header">
        <div>
          <div className="hg-section-title">Habits</div>
          <div className="hg-section-sub">28-day view — tap any square to log it</div>
        </div>
        <button className="btn btn-ghost" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setAddingHabit(v=>!v)}>{addingHabit?"Cancel":"+ Add habit"}</button>
      </div>
      <div className="habit-grid-wrap">
        <div className="habit-day-labels"><div/>{habitDays.map((d,i)=><div key={d} className="habit-day-label">{i===0||new Date(d+"T12:00:00").getDate()===1?new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}).replace(" ",""):new Date(d+"T12:00:00").getDate()%7===1?new Date(d+"T12:00:00").getDate():""}</div>)}</div>
        {habits.map(h=>{ const streak=habitStreak(h); return <div key={h.id} className="habit-row-wrap"><div style={{flex:1}}><div className="habit-row"><div className="habit-name-cell" title={h.name}>{h.name}</div>{habitDays.map(d=><div key={d} className={`habit-dot ${h.checked[d]?"checked":""}`} style={h.checked[d]?{background:h.color}:{}} onClick={()=>toggleHabit(h.id,d)} title={d}/>)}</div>{streak>1&&<div style={{paddingLeft:118,marginTop:-2,marginBottom:4}}><span className="habit-streak-label">🔥 {streak}-day streak</span></div>}</div><button className="habit-del" onClick={()=>deleteHabit(h.id)}>×</button></div>; })}
        {habits.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No habits yet — add one below.</div>}
      </div>
      {addingHabit&&<><div className="add-habit-row"><input autoFocus className="add-habit-input" placeholder="Habit name (e.g. Morning walk, Read 20 min)" value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addHabit();if(e.key==="Escape")setAddingHabit(false);}}/><button className="btn btn-primary" onClick={addHabit} disabled={!newHabitName.trim()}>Add</button></div><div className="habit-color-pick"><span style={{fontSize:11,color:"var(--text-dim)"}}>Colour:</span>{HABIT_COLORS.map(c=><div key={c} className={`habit-color-swatch ${newHabitColor===c?"selected":""}`} style={{background:c}} onClick={()=>setNewHabitColor(c)}/>)}</div></>}
    </div>
  );

  // ── Reusable Goals section ──
  const GoalsSection = () => (
    <div className="hg-section">
      <div className="hg-section-header">
        <div>
          <div className="hg-section-title">Goals</div>
          <div className="hg-section-sub">Directions, not tasks</div>
        </div>
        <button className="btn btn-ghost" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setAddingGoal(v=>!v)}>{addingGoal?"Cancel":"+ Add goal"}</button>
      </div>
      {addingGoal&&<div className="add-goal-row"><input autoFocus className="add-goal-input" placeholder="What do you want to work towards?" value={newGoalText} onChange={e=>setNewGoalText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addManualGoal();if(e.key==="Escape")setAddingGoal(false);}}/><button className="btn btn-primary" onClick={addManualGoal} disabled={!newGoalText.trim()}>Add</button></div>}
      {goals.map(g=><div key={g.id} className="goal-card"><div className="goal-header"><span className="goal-icon">{g.icon}</span><div className="goal-body"><div className="goal-title">{g.title}</div>{g.why&&<div className="goal-why">{g.why}</div>}</div></div><div className="goal-footer"><span className="goal-badge mine-badge">Your goal</span><div className="goal-actions"><button className="goal-btn delete" onClick={()=>deleteGoal(g.id)}>Remove</button></div></div></div>)}
      {goals.length===0&&suggestedGoals.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No goals yet. Add one or let the app suggest some.</div>}
      {suggestedGoals.map(sg=><div key={sg.id} className="goal-card suggested"><div className="goal-header"><span className="goal-icon">{sg.icon}</span><div className="goal-body"><div className="goal-title">{sg.title}</div>{sg.why&&<div className="goal-why">{sg.why}</div>}</div></div><div className="goal-footer"><span className="goal-badge suggested-badge">✦ Suggested for you</span><div className="goal-actions"><button className="goal-btn" onClick={()=>dismissSuggested(sg)}>Dismiss</button><button className="goal-btn accept" onClick={()=>acceptSuggested(sg)}>Add this →</button></div></div></div>)}
      <button className="goals-suggest-btn" onClick={handleSuggestGoals} disabled={suggestingGoals||entries.length===0}>{suggestingGoals?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Reading your entries...</>:<><span>✦</span> Suggest goals based on my entries</>}</button>
    </div>
  );

  return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/>
  <div className="app">
    <nav className="nav">
      <div className="nav-logo">through<span>line</span></div>
      <div className="nav-right">
        <div style={{position:"relative"}}>
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",width:"100%",marginBottom:6}}>
          {userName&&<div className="nav-greeting" style={{flex:1}}>Hey, {userName.split(" ")[0]}</div>}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}>
          <button className="signout-btn" onClick={()=>setShowSettings(p=>!p)}>⚙️ Settings {showSettings?"▲":"▼"}</button>
        </div>
        {showSettings&&<>
          <div style={{position:"fixed",inset:0,zIndex:99}} onClick={()=>setShowSettings(false)}/>
          <div style={{position:"fixed",top:80,left:16,right:16,zIndex:100,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:14,padding:"16px",display:"flex",flexDirection:"column",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
            <div style={{fontSize:12,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>ACCOUNT</div>
            {userName&&<div style={{fontSize:14,color:"var(--text-muted)"}}>{userName}</div>}
            <div style={{fontSize:14,color:"var(--text-muted)"}}>{session?.user?.email}</div>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <a href="https://www.gethroughline.com/privacy-policy" target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>Privacy policy</a>
            <a href="https://www.gethroughline.com/terms-of-service" target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>Terms of service</a>
            <a href="mailto:privacy@gethroughline.com?subject=Throughline Feedback" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>Send feedback</a>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <button onClick={handleSignOut} style={{background:"none",border:"none",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",padding:0}}>Sign out</button>
            <button onClick={async()=>{
              if(!window.confirm("Delete your account? This will permanently delete all your entries, habits and goals. This cannot be undone.")) return;
              const uid=session.user.id;
              await Promise.all([
                supabase.from("entries").delete().eq("user_id",uid),
                supabase.from("habits").delete().eq("user_id",uid),
                supabase.from("goals").delete().eq("user_id",uid),
                supabase.from("profiles").delete().eq("id",uid),
              ]);
              await supabase.auth.signOut();
              setSession(null); setEntries([]); setHabits([]); setGoals([]);
            }} style={{background:"none",border:"none",color:"var(--rose)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",padding:0}}>Delete account</button>
          </div>
        </>}
        </div>
        <div className="nav-tabs">
          {[
            {id:"today",  label:"Today"},
            {id:"plan",   label:"Plan"},
            {id:"habits", label:"Habits & Goals"},
            {id:"patterns",label:"Patterns"},
            {id:"history",label:"History"},
          ].map(t=>(
            <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </nav>

    {/* ── TODAY ── */}
    {tab==="today"&&<>
      <div className="date-header">
        <div className="date-label">{preferredTime?`${preferredTime} reflection`:"end of day reflection"}</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
   <div className="date-main">{formatDate(selectedDate)}</div>
<input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} max={todayStr} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}/>        </div>
      </div>
      <div className="mood-row">
        <span className="mood-label">How are you feeling?</span>
        {MOODS.map(m=><button key={m.score} className={`mood-btn ${todayMood===m.score?"selected":""}`} onClick={()=>setTodayMood(s=>s===m.score?null:m.score)} title={m.label}>{m.emoji}</button>)}
        {todayMood&&<span className="mood-score-display">"{MOODS[todayMood-1].label}"</span>}
      </div>
      <div className="entry-card">
        <div className="entry-prompt">{preferredTime==="morning"?"What are you carrying into today?":"How was your day? Speak or write freely — no structure needed."}</div>
{entries.length===0&&!text&&<div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"24px",marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:12}}>✦</div>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:18,color:"var(--cream)",marginBottom:8}}>Welcome to Throughline</div>
          <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.65,marginBottom:16}}>This is your private space to think out loud. Write about your day, what's on your mind, what you're grateful for — anything at all. The AI will find patterns and reflect back what it notices.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {["Today I had a conversation that made me think...", "I've been feeling...", "Something I want to remember from today..."].map((prompt,i)=><button key={i} onClick={()=>setText(prompt)} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>{prompt}</button>)}
          </div>
        </div>}
        <textarea className="entry-textarea" placeholder="Today I... the meeting went... I felt... I need to remember..." value={text} onChange={e=>setText(e.target.value)} rows={6}/>        {[{key:"todos",emoji:"📝",label:"To-dos",placeholder:"Things I need to do...",val:subTodos,set:setSubTodos},{key:"learned",emoji:"💡",label:"Things I learned",placeholder:"Something I picked up today...",val:subLearned,set:setSubLearned},{key:"gratitude",emoji:"🙏",label:"Gratitude",placeholder:"What I'm grateful for...",val:subGratitude,set:setSubGratitude}].map(s=>(
          <div key={s.key}>
            <div className="subsection-toggle" onClick={()=>setExpandedSections(p=>({...p,[s.key]:!p[s.key]}))}>
              <span className="subsection-emoji">{s.emoji}</span>
              <span className="subsection-label">{s.label}{s.val&&<span style={{color:"var(--amber-soft)",marginLeft:6}}>✦</span>}</span>
              <span className={`subsection-chevron ${expandedSections[s.key]?"open":""}`}>▶</span>
            </div>
            {expandedSections[s.key]&&<div className="subsection-body"><textarea className="subsection-textarea" placeholder={s.placeholder} value={s.val} onChange={e=>s.set(e.target.value)} rows={3}/></div>}
          </div>
        ))}
        {habits.length>0&&<div>
          <div className="subsection-toggle" onClick={()=>setExpandedSections(p=>({...p,habits:!p.habits}))}>
            <span className="subsection-emoji">🌿</span>
            <span className="subsection-label">Habits{Object.keys(expandedSections).includes("habits")&&habits.some(h=>h.checked?.[selectedDate])&&<span style={{color:"var(--amber-soft)",marginLeft:6}}>✦</span>}</span>
            <span className={`subsection-chevron ${expandedSections.habits?"open":""}`}>▶</span>
          </div>
          {expandedSections.habits&&<div className="subsection-body" style={{display:"flex",flexDirection:"column",gap:10}}>
            {habits.map(h=>{
              const isChecked=!!(h.checked?.[selectedDate]);
              return <div key={h.id} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={async()=>{
                const newChecked={...h.checked,[selectedDate]:!isChecked};
                setHabits(p=>p.map(x=>x.id===h.id?{...x,checked:newChecked}:x));
                await supabase.from("habits").update({checked:newChecked}).eq("id",h.id);
              }}>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${isChecked?h.color||"var(--amber)":"var(--border)"}`,background:isChecked?h.color||"var(--amber)":"transparent",flexShrink:0,transition:"all 0.15s"}}/>
                <span style={{fontSize:13,color:isChecked?"var(--text)":"var(--text-muted)"}}>{h.name}</span>
              </div>;
            })}
          </div>}
        </div>}
        <div className="entry-footer">
          <span className="char-count">{text.length} characters</span>
          <div className="entry-actions">
            <button className={`btn btn-ghost ${recording?"recording":""}`} onClick={toggleVoice}>{recording&&<span className="rec-dot"/>}{recording?"Stop":"🎙 Speak"}</button>
            <button className="btn btn-primary" onClick={handleAnalyze} disabled={!text.trim()||loading}>{loading?"Reflecting...":"Reflect →"}</button>
          </div>
        </div>
      </div>
      {loading&&<div className="entry-card"><div className="entry-prompt">Reading your day...</div><div className="loading-dots"><span/><span/><span/></div></div>}
      {result&&!result.error&&<>
        {todos.length>0&&<div className="analysis-section"><div className="section-label">Tomorrow's to-dos</div><div className="todo-list">{todos.map((t,i)=><div key={i} className="todo-item" style={{display:"flex",alignItems:"center",gap:8}}><div className={`todo-check ${checkedTodos[i]?"done":""}`} onClick={()=>setCheckedTodos(p=>({...p,[i]:!p[i]}))}/><span className={`todo-text ${checkedTodos[i]?"done":""}`} style={{flex:1}}>{t}</span></div>)}</div></div>}
        {(result.stressTags?.length>0||result.joyTags?.length>0)&&<div className="analysis-section"><div className="section-label">Today's signals</div><div className="tags-row">{result.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}{result.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}</div></div>}
        {result.insight&&<div className="analysis-section"><div className="section-label">Observation</div><div className="insight-box">"{result.insight}"</div></div>}
      </>}
{result?.error&&<div className="entry-card"><div className="entry-prompt">{result.rateLimit?"You've used all 5 reflections this month":"Couldn't parse that — try again or check your connection."}</div></div>}    </>}

    {/* ── PLAN ── */}
    {tab==="plan"&&<>
      <div className="date-header">
        <div className="date-label">set your intention</div>
        <div className="date-main">Plan Your Day</div>
      </div>
      {!dayPlan&&<>
        <div className="entry-card">
          <div className="entry-prompt">What's on your plate today? Speak or write freely — meetings, goals, anything weighing on you.</div>
          <textarea className="plan-input-area" placeholder="Today I need to... I have a meeting about... I want to make sure I..." value={planInput} onChange={e=>setPlanInput(e.target.value)} rows={5}/>
          <div className="entry-footer">
            <span className="char-count">{planInput.length} characters</span>
            <div className="entry-actions">
              <button className={`btn btn-ghost ${planRecording?"recording":""}`} onClick={togglePlanVoice}>{planRecording&&<span className="rec-dot"/>}{planRecording?"Stop":"🎙 Speak"}</button>
              <button className="btn btn-primary" onClick={handleGeneratePlan} disabled={!planInput.trim()||planLoading}>{planLoading?"Planning...":"Plan my day →"}</button>
            </div>
          </div>
        </div>
        {planLoading&&<div className="entry-card"><div className="entry-prompt">Building your plan...</div><div className="loading-dots"><span/><span/><span/></div></div>}
      </>}
      {dayPlan&&<>
        <div className="plan-card">
          <div className="plan-intention">"{dayPlan.intention}"</div>
          {dayPlan.priorities?.length>0&&<>
            <div className="plan-section-label">Priorities</div>
            <div style={{marginBottom:20}}>
              {dayPlan.priorities.map((p,i)=><div key={i} className="plan-priority">
                <span className="plan-priority-num">{i+1}</span>
                <span className="plan-priority-text">{p}</span>
              </div>)}
            </div>
          </>}
          {planTodos.length>0&&<>
            <div className="plan-divider"/>
            <div className="plan-section-label">To-dos</div>
            <div style={{marginBottom:16}}>
              {planTodos.map((t,i)=><div key={i} className="plan-todo-item">
                <div className={`todo-check ${t.done?"done":""}`} onClick={()=>togglePlanTodo(i)}/>
                <span className={`plan-todo-text ${t.done?"done":""}`}>{t.text}</span>
              </div>)}
            </div>
          </>}
          {dayPlan.note&&<div className="plan-note">{dayPlan.note}</div>}
        </div>
        <button className="btn btn-ghost" style={{marginTop:4}} onClick={resetPlan}>Re-plan →</button>
      </>}
    </>}

    {/* ── HABITS & GOALS ── */}
    {tab==="habits"&&<>
      <div className="date-header">
        <div className="date-label">build your life</div>
        <div className="date-main">Habits & Goals</div>
      </div>
      <HabitsSection />
      <div style={{height:1,background:"var(--border)",margin:"8px 0 32px"}}/>
      <GoalsSection />
    </>}

    {/* ── PATTERNS ── */}
    {tab==="patterns"&&<>
      {!isPro&&<div style={{background:"var(--amber-dim)",border:"1px solid rgba(200,136,42,0.3)",borderRadius:14,padding:"20px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:16,color:"var(--cream)",marginBottom:6}}>Patterns & Insights</div>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:12}}>Upgrade to Pro to unlock full pattern analysis, stressor tracking, and weekly digests.</p>
        <button onClick={()=>setShowUpgrade(true)} style={{padding:"10px 20px",borderRadius:10,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer"}}>Unlock with Pro ✦</button>
      </div>}
      <div className="date-header"><div className="date-label">your patterns</div><div className="date-main">{monthYear}</div></div>
      <div style={{filter:isPro?"none":"blur(3px)",pointerEvents:isPro?"auto":"none",userSelect:isPro?"auto":"none"}}>
      <div className="section-label" style={{marginBottom:14}}>This week</div>
      <div style={{overflowX:"auto",marginBottom:28,marginLeft:"-24px",marginRight:"-24px",paddingLeft:"24px",paddingRight:"24px"}}>
<div className="week-grid" style={{minWidth:280}}>
        {weekDates.map((d,i)=>{ const hasEntry=entries.some(e=>e.date===d); const mobj=moodForDay(d)?MOODS[moodForDay(d)-1]:null; return <div key={d} className={`day-cell ${hasEntry?"has-entry":""} ${d===todayStr?"active":""}`}><div className="dc-name">{WEEK_DAYS[i]}</div><div className="dc-dot" style={mobj?{background:mobj.color}:{}}/>{mobj&&<div className="dc-mood">{mobj.emoji}</div>}</div>; })}
      </div>
      </div>
      <div className="pattern-card">
        <h3>Mood this week</h3><p style={{marginBottom:16}}>How you've been feeling day to day.</p>
        <div className="mood-chart-wrap">{weekDates.map(d=>{ const mood=moodForDay(d); const mobj=mood?MOODS[mood-1]:null; return <div key={d} className="mood-chart-row"><div className="mood-chart-date">{shortDate(d)}</div><div className="mood-chart-bar">{mobj?<div className="mood-chart-fill" style={{width:`${mobj.score*20}%`,background:mobj.color}}><span className="mood-chart-emoji">{mobj.emoji}</span><span className="mood-chart-val">{mobj.label}</span></div>:<span style={{fontSize:11,color:"var(--text-dim)",paddingLeft:10,fontStyle:"italic"}}>no entry</span>}</div></div>; })}</div>
      </div>
      <div className="pattern-card">
        <h3>Weekly digest</h3><p style={{marginBottom:16}}>A personal reflection on your week, written from your entries.</p>
        <button className="digest-gen-btn" onClick={handleGenerateDigest} disabled={generatingDigest||entries.length===0}>{generatingDigest?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Writing your digest...</>:<><span>✦</span> Generate this week's digest</>}</button>
        {digest&&<div className="digest-card"><div className="digest-week">Week of {shortDate(weekDates[0])} — {shortDate(weekDates[6])}</div>{digest.headline&&<div className="digest-headline">"{digest.headline}"</div>}{digest.highlight&&<div className="digest-section"><div className="digest-section-label">Highlight</div><div className="digest-body">{digest.highlight}</div></div>}{digest.pattern&&<div className="digest-section"><div className="digest-section-label">Pattern noticed</div><div className="digest-body">{digest.pattern}</div></div>}{digest.nudge&&<div className="digest-section"><div className="digest-section-label">For next week</div><div className="digest-nudge">{digest.nudge}</div></div>}</div>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:4}}>
          {["week","month","year"].map(p=><button key={p} onClick={()=>{setPatternPeriod(p);setPatternOffset(0);}} style={{padding:"6px 14px",borderRadius:20,border:"1px solid var(--border)",background:patternPeriod===p?"var(--amber)":"transparent",color:patternPeriod===p?"#0e0c0a":"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer",transition:"all 0.15s"}}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
          <button onClick={()=>setPatternOffset(p=>p+1)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 10px",color:"var(--text-muted)",cursor:"pointer",fontSize:13,fontFamily:"DM Sans,sans-serif",lineHeight:1}}>←</button>
          <span style={{fontSize:12,color:"var(--text-muted)",minWidth:100,textAlign:"center",fontStyle:"italic"}}>{periodLabel}</span>
          <button onClick={()=>setPatternOffset(p=>Math.max(0,p-1))} disabled={patternOffset===0} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 10px",color:patternOffset===0?"var(--text-dim)":"var(--text-muted)",cursor:patternOffset===0?"default":"pointer",fontSize:13,fontFamily:"DM Sans,sans-serif",lineHeight:1,opacity:patternOffset===0?0.4:1}}>→</button>
        </div>
      </div>
<div className="pattern-card"><h3>Consistent stressors</h3><p style={{marginBottom:16}}>What comes up most when you're feeling friction.</p>{STRESS_PATTERNS.length===0?<div style={{fontSize:13,color:"var(--text-dim)",fontStyle:"italic"}}>No patterns yet — keep journaling and they'll appear here.</div>:<div className="bar-chart">{STRESS_PATTERNS.map(p=><div key={p.label} className="bar-row"><div className="bar-label">{p.label}</div><div className="bar-track"><div className="bar-fill stress" style={{width:`${p.pct}%`}}/></div><div className="bar-pct">{p.count}x</div></div>)}</div>}</div>
      <div className="pattern-card"><h3>What lights you up</h3><p style={{marginBottom:16}}>Things consistently tied to your better days.</p>{JOY_PATTERNS.length===0?<div style={{fontSize:13,color:"var(--text-dim)",fontStyle:"italic"}}>No patterns yet — keep journaling and they'll appear here.</div>:<div className="bar-chart">{JOY_PATTERNS.map(p=><div key={p.label} className="bar-row"><div className="bar-label">{p.label}</div><div className="bar-track"><div className="bar-fill joy" style={{width:`${p.pct}%`}}/></div><div className="bar-pct">{p.count}x</div></div>)}</div>}</div>
      <div className="summary-card"><div className="summary-month">Monthly summary · {monthYear}</div>{monthlySummary?<div className="summary-text">{monthlySummary}</div>:<><div className="summary-text" style={{marginBottom:12}}>Generate a personal summary of your month based on your real entries.</div><button className="digest-gen-btn" onClick={handleGenerateMonthlySummary} disabled={generatingMonthlySummary||entries.length===0}>{generatingMonthlySummary?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Writing your summary...</>:<><span>✦</span> Generate monthly summary</>}</button></>}</div>
     </div>
    </>}

    {/* ── HISTORY ── */}
    {tab==="history"&&<>
<div className="date-header"><div className="date-label">past entries</div><div className="date-main">Your journal</div></div>
      <div style={{marginBottom:16,position:"relative"}}>
        <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search entries..." style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 16px 12px 40px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:14,fontWeight:300,outline:"none"}}/>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-dim)",fontSize:14}}>🔍</span>
        {searchQuery&&<button onClick={()=>setSearchQuery("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",fontSize:16}}>✕</button>}
      </div>
            {dbLoading&&<div className="empty-state">Loading your entries...</div>}
      {!dbLoading&&entries.length===0&&<div className="empty-state">No entries yet — write your first one in Today.</div>}
      {entries.filter(e=>!searchQuery||e.text.toLowerCase().includes(searchQuery.toLowerCase())||e.insight?.toLowerCase().includes(searchQuery.toLowerCase())||e.stressTags?.some(t=>t.toLowerCase().includes(searchQuery.toLowerCase()))||e.joyTags?.some(t=>t.toLowerCase().includes(searchQuery.toLowerCase()))).map(entry=>{ const mobj=entry.mood?MOODS[entry.mood-1]:null; const isExpanded=expandedEntry===entry.id; const isEditing=editingEntry===entry.id; return <div key={entry.id} className="pattern-card" style={{marginBottom:14,cursor:"pointer"}} onClick={()=>!isEditing&&setExpandedEntry(isExpanded?null:entry.id)}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:12,color:"var(--amber-soft)",fontFamily:"Playfair Display,serif",fontStyle:"italic"}}>{formatDate(entry.date)}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {mobj&&<div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--text-muted)"}}><span>{mobj.emoji}</span><span style={{fontStyle:"italic"}}>{mobj.label}</span></div>}
            <span style={{fontSize:12,color:"var(--text-dim)"}}>{isExpanded?"▲":"▼"}</span>
            <button onClick={async(e)=>{ e.stopPropagation(); if(!window.confirm("Delete this entry?")) return; await supabase.from("entries").delete().eq("id",entry.id); setEntries(p=>p.filter(e=>e.id!==entry.id)); }} style={{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",fontSize:14,padding:"0 4px",transition:"color 0.15s"}} onMouseOver={e=>e.target.style.color="var(--rose)"} onMouseOut={e=>e.target.style.color="var(--text-dim)"}>✕</button>
          </div>
        </div>
        {!isExpanded&&<>
          <p style={{marginBottom:8,fontSize:14,lineHeight:1.65,color:"var(--text-muted)",fontStyle:"italic"}}>{entry.insight||entry.text.slice(0,120)+(entry.text.length>120?"...":"")}</p>
          {(entry.stressTags?.length>0||entry.joyTags?.length>0)&&<div className="tags-row">{entry.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}{entry.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}</div>}
        </>}
        {isExpanded&&!isEditing&&<>
          <p style={{marginBottom:12,fontSize:14,lineHeight:1.75}}>{entry.text}</p>
          {(entry.stressTags?.length>0||entry.joyTags?.length>0)&&<div className="tags-row" style={{marginBottom:12}}>{entry.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}{entry.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}</div>}
          {entry.todos?.length>0&&<div style={{fontSize:12,color:"var(--text-muted)",marginBottom:12}}>{entry.todos.length} action item{entry.todos.length!==1?"s":""}</div>}
          <button onClick={e=>{e.stopPropagation();setEditingEntry(entry.id);setEditingText(entry.text);}} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"6px 14px",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer"}}>Edit entry</button>
        </>}
        {isEditing&&<div onClick={e=>e.stopPropagation()}>
          <textarea value={editingText} onChange={e=>setEditingText(e.target.value)} style={{width:"100%",background:"var(--surface2)",border:"1px solid var(--amber)",borderRadius:10,padding:"12px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:14,lineHeight:1.7,outline:"none",resize:"vertical",minHeight:160}}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={async()=>{ await supabase.from("entries").update({text:editingText}).eq("id",entry.id); setEntries(p=>p.map(e=>e.id===entry.id?{...e,text:editingText}:e)); setEditingEntry(null); }} style={{padding:"8px 16px",borderRadius:8,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer"}}>Save</button>
            <button onClick={()=>setEditingEntry(null)} style={{padding:"8px 16px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>}
      </div>; })}
    </>}

  {showUpgrade&&<>
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,backdropFilter:"blur(4px)"}} onClick={()=>setShowUpgrade(false)}/>
    <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,padding:"32px 24px",width:"calc(100vw - 48px)",maxWidth:380,textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:12}}>✦</div>
      <div style={{fontFamily:"Playfair Display,serif",fontSize:24,color:"var(--cream)",marginBottom:8}}>Throughline Pro</div>
      <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.65,marginBottom:24}}>Unlock unlimited entries, 30 AI reflections per month, full pattern insights, and weekly digests.</p>
      <div style={{background:"var(--surface2)",borderRadius:14,padding:"16px",marginBottom:20}}>
        {[["✦","30 AI reflections/month"],["📈","Full patterns & insights"],["📓","Unlimited entries"],["🗓","Weekly & monthly digests"]].map(([icon,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontSize:13,color:"var(--text-muted)",textAlign:"left"}}>
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>
      <button style={{width:"100%",padding:"14px",borderRadius:12,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:500,cursor:"pointer",marginBottom:10}}>$4.99/month — Coming soon</button>
      <button style={{width:"100%",padding:"14px",borderRadius:12,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:14,cursor:"pointer",marginBottom:16}}>$34.99/year — Coming soon</button>
      <button onClick={()=>setShowUpgrade(false)} style={{background:"none",border:"none",color:"var(--text-dim)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer"}}>Maybe later</button>
    </div>
  </>}
  </div></>);
}