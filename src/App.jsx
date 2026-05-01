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
  body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; min-height:100vh; min-height:100dvh; overflow-x:hidden; display:flex; justify-content:center; padding-bottom:env(safe-area-inset-bottom); padding-left:env(safe-area-inset-left); padding-right:env(safe-area-inset-right); }
  .grain { position:fixed; inset:0; pointer-events:none; z-index:100; opacity:0.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .glow { position:fixed; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(200,136,42,0.06) 0%,transparent 70%); pointer-events:none; top:-200px; left:50%; transform:translateX(-50%); }
  .app { max-width:720px; width:100%; padding:0 24px 80px; }  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes dotBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
  @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

  /* ── AUTH ── */
  .auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom)) 24px; width:100%; }
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
  .auth-input { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:16px; font-weight:300; outline:none; transition:border-color 0.2s; }
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
  .nav { display:flex; align-items:center; justify-content:space-between; padding:calc(env(safe-area-inset-top) + 8px) 0 40px; border-bottom:1px solid var(--border); margin-bottom:40px; flex-wrap:wrap; gap:12px; }
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
  .streak-badge { display:inline-flex; align-items:center; gap:5px; background:var(--amber-dim); border:1px solid rgba(200,136,42,0.25); border-radius:20px; padding:5px 12px; font-size:12px; color:var(--amber-soft); font-weight:500; white-space:nowrap; }
  .streak-badge-wrap { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  /* ── RATING ── */
  .rating-modal { position:fixed; bottom:0; left:0; right:0; z-index:201; background:var(--surface); border-top:1px solid var(--border); border-radius:20px 20px 0 0; padding:32px 24px 40px; text-align:center; animation:slideIn 0.35s ease; }
  .rating-star { font-size:28px; margin-bottom:14px; }
  .rating-title { font-family:'Playfair Display',serif; font-size:20px; color:var(--cream); margin-bottom:8px; }
  .rating-sub { font-size:14px; color:var(--text-muted); line-height:1.6; margin-bottom:24px; }
  .rating-btn-primary { width:100%; padding:14px; border-radius:12px; background:var(--amber); border:none; color:#0e0c0a; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; margin-bottom:10px; transition:all 0.2s; }
  .rating-btn-primary:hover { background:var(--amber-soft); }
  .rating-btn-ghost { background:none; border:none; color:var(--text-dim); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }

  /* ── MOOD ── */
  .mood-row { display:flex; align-items:center; gap:6px; margin-bottom:20px; flex-wrap:nowrap; }
  .mood-slider-wrap { margin-bottom:20px; }
  .mood-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; outline:none; cursor:pointer; background:linear-gradient(to right,#c4605a 0%,#a07850 25%,#8a8060 50%,#c8882a 75%,#e8a84a 100%); margin:10px 0 6px; }
  .mood-slider::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:var(--surface); border:2.5px solid var(--border); cursor:pointer; box-shadow:0 1px 6px rgba(0,0,0,0.5); transition:border-color 0.15s; }
  .mood-slider::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:var(--surface); border:2.5px solid var(--border); cursor:pointer; box-shadow:0 1px 6px rgba(0,0,0,0.5); }
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
  .plan-todo-block-btns { display:flex; gap:4px; flex-shrink:0; }
  .plan-todo-block-btn { background:none; border:1px solid var(--border); border-radius:6px; padding:2px 7px; font-size:10px; color:var(--text-dim); cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .plan-todo-block-btn:hover { border-color:var(--amber); color:var(--amber); }
  .plan-todo-block-btn.assigned { background:rgba(212,175,55,0.12); border-color:rgba(212,175,55,0.4); color:var(--amber); }
  /* ── DAY BLOCKS ── */
  .day-blocks-wrap { margin-top:20px; display:flex; flex-direction:column; gap:12px; }
  .day-block { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .day-block-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px 10px; }
  .day-block-title { font-size:13px; font-weight:500; color:var(--cream); letter-spacing:0.3px; }
  .day-block-icon { font-size:15px; opacity:0.7; }
  .day-block-add-btn { background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:18px; line-height:1; padding:0 2px; transition:color 0.15s; }
  .day-block-add-btn:hover { color:var(--amber); }
  .day-block-items { padding:0 16px; }
  .day-block-item { display:flex; align-items:center; gap:8px; padding:8px 0; border-top:1px solid var(--border); }
  .day-block-item-text { font-size:13px; color:var(--text-muted); flex:1; line-height:1.4; }
  .day-block-item-del { background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:14px; padding:0; transition:color 0.15s; }
  .day-block-item-del:hover { color:var(--rose); }
  .day-block-item.from-todo .day-block-item-text { color:var(--text); }
  .day-block-add-row { display:flex; gap:6px; padding:8px 16px 12px; border-top:1px solid var(--border); }
  .day-block-input { flex:1; background:var(--surface2); border:1px solid var(--amber); border-radius:8px; padding:8px 10px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; outline:none; }
  .day-block-input-submit { background:var(--amber); border:none; border-radius:8px; padding:8px 12px; color:#0e0c0a; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; cursor:pointer; }
  .day-block-input-cancel { background:none; border:none; color:var(--text-dim); font-size:16px; cursor:pointer; padding:0 4px; }
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
  {emoji:"😔",label:"Rough", score:1,color:"#c4605a"},
  {emoji:"😕",label:"Hard",  score:2,color:"#a07850"},
  {emoji:"😐",label:"Okay",  score:3,color:"#8a8060"},
  {emoji:"🙂",label:"Good",  score:4,color:"#c8882a"},
  {emoji:"😄",label:"Great", score:5,color:"#e8a84a"},
];
const MOOD_COLORS={1:"#c4605a",2:"#a07850",3:"#8a8060",4:"#c8882a",5:"#e8a84a"};
const MOOD_LABELS={1:"Rough",2:"Hard",3:"Okay",4:"Good",5:"Great"};
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

const API_BASE = (typeof window!=="undefined" && window.Capacitor) ? "https://www.gethroughline.com" : "";

async function callClaudeRaw(prompt,maxTokens=500,userId=null,isPro=false){
  if(userId){
    const result=await checkAndIncrementUsage(userId,isPro);
    if(!result.allowed) throw new Error("RATE_LIMIT");
  }
  const res=await fetch(`${API_BASE}/api/reflect`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  return data.content?.find(b=>b.type==="text")?.text||"";
}

async function callClaude(prompt,maxTokens=1000,userId=null,isPro=false){
  if(userId){
    const result = await checkAndIncrementUsage(userId, isPro);
    if(!result.allowed) throw new Error("RATE_LIMIT");
  }
  const res=await fetch(`${API_BASE}/api/reflect`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
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
Entry:\n${fullText}`,500,userId,isPro));
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
  const [tab,setTab]=useState("home");
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
  const [timelineEvents,setTimelineEvents]=useState([]);
  const [addingEventAtBlock,setAddingEventAtBlock]=useState(null);
  const [newEventText,setNewEventText]=useState("");

  // Habits
  const [habits,setHabits]=useState([]);
  const [addingHabit,setAddingHabit]=useState(false);
  const [newHabitName,setNewHabitName]=useState("");
  const [newHabitGoal,setNewHabitGoal]=useState("");
  const [newHabitColor,setNewHabitColor]=useState(HABIT_COLORS[0]);
  const [expandedGoal,setExpandedGoal]=useState(null);
  const [habitMonthView,setHabitMonthView]=useState(null);
  const [editingGoalCard,setEditingGoalCard]=useState(null);
  const [editGoalTitle,setEditGoalTitle]=useState("");
  const [editGoalWhy,setEditGoalWhy]=useState("");
  const [editHabitName,setEditHabitName]=useState("");
  const [editHabitColor,setEditHabitColor]=useState(HABIT_COLORS[0]);
  const [addingHabitToGoal,setAddingHabitToGoal]=useState(null);
  const [newLinkedHabitName,setNewLinkedHabitName]=useState("");
  const [newLinkedHabitColor,setNewLinkedHabitColor]=useState(HABIT_COLORS[0]);

  // Goals
  const [goals,setGoals]=useState([]);
  const [suggestedGoals,setSuggestedGoals]=useState([]);
  const [suggestingGoals,setSuggestingGoals]=useState(false);
  const [newGoalText,setNewGoalText]=useState("");
  const [addingGoal,setAddingGoal]=useState(false);

  // Notifications
  const [notifTime,setNotifTime]=useState("21:00");
  const [morningTime,setMorningTime]=useState("08:00");
  const [onelinerMode,setOnelinerMode]=useState("intention");
  const [dailyOneliner,setDailyOneliner]=useState(null);
  const [onelinerLoading,setOnelinerLoading]=useState(false);

  // Rating
  const [showRating,setShowRating]=useState(false);

  // IAP
  const [iapPackages,setIapPackages]=useState([]);
  const [iapLoading,setIapLoading]=useState(false);
  const [purchasing,setPurchasing]=useState(null); // packageId being purchased
  const [restoring,setRestoring]=useState(false);

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
  const [referralCode,setReferralCode]=useState("");
  const [referralCount,setReferralCount]=useState(0);

  // Advice
  const [adviceQuestion,setAdviceQuestion]=useState("");
  const [adviceAnswer,setAdviceAnswer]=useState(null);
  const [adviceLoading,setAdviceLoading]=useState(false);
  const [adviceHistory,setAdviceHistory]=useState([]);
  const [adviceRecording,setAdviceRecording]=useState(false);
  const adviceRecognitionRef=useRef(null);
  const [expandedAdvice,setExpandedAdvice]=useState(null);

  // ── Load plan from localStorage ──
  useEffect(()=>{
    const saved=localStorage.getItem(`dayplan_${todayStr}`);
    if(saved){ try{ const p=JSON.parse(saved); setDayPlan(p.plan); setPlanTodos(p.todos||[]); setTimelineEvents(p.timelineEvents||[]); }catch(e){} }
  },[]);

  // ── Notifications ──
  const scheduleNotification=async(time)=>{
    if(!window.Capacitor) return;
    try{
      const {LocalNotifications}=await import("@capacitor/local-notifications");
      const {display}=await LocalNotifications.requestPermissions();
      if(display==="granted"){
        const [hour,minute]=(time||"21:00").split(":").map(Number);
        await LocalNotifications.cancel({notifications:[{id:1}]});
        await LocalNotifications.schedule({notifications:[{
          id:1,
          title:"Time to reflect ✦",
          body:"A few minutes of journaling can change your whole perspective.",
          schedule:{on:{hour,minute}},
          sound:null,actionTypeId:"",extra:null
        }]});
      }
    }catch(e){ console.log("Notifications not available",e); }
  };
  useEffect(()=>{ scheduleNotification(notifTime); },[notifTime]);

  const updateNotifTime=async(time)=>{
    setNotifTime(time);
    await supabase.auth.updateUser({data:{notif_time:time}});
    scheduleNotification(time);
  };

  const scheduleMorningNotification=async(text,time)=>{
    if(!window.Capacitor) return;
    try{
      const {LocalNotifications}=await import("@capacitor/local-notifications");
      const {display}=await LocalNotifications.requestPermissions();
      if(display==="granted"){
        const [hour,minute]=(time||"08:00").split(":").map(Number);
        await LocalNotifications.cancel({notifications:[{id:2}]});
        await LocalNotifications.schedule({notifications:[{
          id:2,
          title:"Your intention for today ✦",
          body:text,
          schedule:{on:{hour,minute}},
          sound:null,actionTypeId:"",extra:null
        }]});
      }
    }catch(e){ console.log("Morning notification error",e); }
  };

  const updateMorningTime=async(time)=>{
    setMorningTime(time);
    await supabase.auth.updateUser({data:{morning_time:time}});
  };

  const generateTomorrowOneliner=async(entryText,mode)=>{
    const tomorrow=new Date(); tomorrow.setDate(tomorrow.getDate()+1);
    const tomorrowStr=tomorrow.toISOString().split("T")[0];
    try{
      const prompts={
        intention:`Based on this journal entry, write a single warm intention to carry into tomorrow (under 20 words). Start with "Today," or a similar forward-looking opener. No quotes.\n\nEntry: ${entryText}`,
        observation:`Based on this journal entry, write a single warm observation about what this person is carrying (under 20 words). Start with "You've been" or "Lately" or similar. No quotes.\n\nEntry: ${entryText}`,
        question:`Based on this journal entry, write a single open question to sit with tomorrow (under 20 words). Start with "What would it look like" or "What if" or similar. No quotes.\n\nEntry: ${entryText}`,
      };
      const text=await callClaudeRaw(prompts[mode]||prompts.intention,60);
      const trimmed=text.trim();
      localStorage.setItem(`tl_oneliner_${tomorrowStr}`,JSON.stringify({text:trimmed,mode}));
      await scheduleMorningNotification(trimmed,morningTime);
    }catch(e){}
  };

  // ── RevenueCat / IAP ──
  useEffect(()=>{
    if(!session||!window.Capacitor) return;
    const key=import.meta.env.VITE_REVENUECAT_IOS_KEY;
    if(!key) return;
    (async()=>{
      try{
        const {Purchases,LOG_LEVEL}=await import("@revenuecat/purchases-capacitor");
        await Purchases.setLogLevel({level:LOG_LEVEL.ERROR});
        await Purchases.configure({apiKey:key,appUserID:session.user.id});
        const {customerInfo}=await Purchases.getCustomerInfo();
        if(customerInfo.entitlements.active["pro"]){
          setIsPro(true);
          await supabase.from("profiles").upsert({id:session.user.id,is_pro:true},{onConflict:"id"});
        }
      }catch(e){ console.log("RC init",e); }
    })();
  },[session?.user?.id]);

  const loadIAPPackages=async()=>{
    if(!window.Capacitor||iapPackages.length) return;
    setIapLoading(true);
    try{
      const {Purchases}=await import("@revenuecat/purchases-capacitor");
      const {offerings}=await Purchases.getOfferings();
      setIapPackages(offerings.current?.availablePackages||[]);
    }catch(e){}
    setIapLoading(false);
  };

  const handlePurchase=async(pkg)=>{
    if(!window.Capacitor) return;
    haptic("medium"); setPurchasing(pkg.identifier);
    try{
      const {Purchases}=await import("@revenuecat/purchases-capacitor");
      const {customerInfo}=await Purchases.purchasePackage({aPackage:pkg});
      if(customerInfo.entitlements.active["pro"]){
        await supabase.from("profiles").upsert({id:session.user.id,is_pro:true},{onConflict:"id"});
        setIsPro(true); setShowUpgrade(false); haptic("heavy");
      }
    }catch(e){ if(!e.message?.includes("CANCELLED")) alert("Purchase failed — please try again."); }
    setPurchasing(null);
  };

  const handleRestorePurchases=async()=>{
    if(!window.Capacitor) return;
    haptic("light"); setRestoring(true);
    try{
      const {Purchases}=await import("@revenuecat/purchases-capacitor");
      const {customerInfo}=await Purchases.restorePurchases();
      if(customerInfo.entitlements.active["pro"]){
        await supabase.from("profiles").upsert({id:session.user.id,is_pro:true},{onConflict:"id"});
        setIsPro(true); setShowUpgrade(false);
      } else { alert("No active subscription found."); }
    }catch(e){}
    setRestoring(false);
  };

  // ── Haptics ──
  const haptic=async(style="light")=>{
    if(!window.Capacitor) return;
    try{
      const {Haptics,ImpactStyle}=await import("@capacitor/haptics");
      await Haptics.impact({style:style==="medium"?ImpactStyle.Medium:style==="heavy"?ImpactStyle.Heavy:ImpactStyle.Light});
    }catch(e){}
  };

  // ── Rating prompt ──
  const maybeShowRating=(entryCount)=>{
    if(localStorage.getItem("tl_rated")||localStorage.getItem("tl_rate_dismissed")) return;
    if(entryCount>=5) setShowRating(true);
  };
  const handleRate=async()=>{
    localStorage.setItem("tl_rated","1");
    setShowRating(false);
    haptic("medium");
    if(window.Capacitor){
      try{
        const {RateApp}=await import("capacitor-rate-app");
        await RateApp.requestReview();
      }catch(e){}
    }
  };
  const dismissRating=()=>{
    localStorage.setItem("tl_rate_dismissed","1");
    setShowRating(false);
  };

  // ── Auth listener ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      const hash = window.location.hash;
      const query = window.location.search;
      const isRecovery = hash.includes("type=recovery") || query.includes("type=recovery");
      if(isRecovery){ setAuthMode("reset"); setAuthLoading(false); return; }
      setSession(session);
      setAuthLoading(false);
      if(session){
        const meta = session.user.user_metadata;
        if(meta?.name) setUserName(meta.name);
        if(meta?.preferred_time) setPreferredTime(meta.preferred_time);
        if(meta?.ob_done) setObDone(true);
        if(meta?.notif_time) setNotifTime(meta.notif_time);
        if(meta?.morning_time) setMorningTime(meta.morning_time);
        if(meta?.oneliner_mode) setOnelinerMode(meta.oneliner_mode);
      }
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="PASSWORD_RECOVERY"){ setSession(null); setAuthMode("reset"); return; }
      setSession(session);
      if(session){
        const meta = session.user.user_metadata;
        if(meta?.name) setUserName(meta.name);
        if(meta?.preferred_time) setPreferredTime(meta.preferred_time);
        if(meta?.ob_done) setObDone(true);
        if(meta?.notif_time) setNotifTime(meta.notif_time);
        if(meta?.morning_time) setMorningTime(meta.morning_time);
        if(meta?.oneliner_mode) setOnelinerMode(meta.oneliner_mode);
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
      const [entriesRes,habitsRes,goalsRes,profileRes,adviceRes]=await Promise.all([
        supabase.from("entries").select("*").eq("user_id",uid).order("date",{ascending:false}),
        supabase.from("habits").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
        supabase.from("goals").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
        supabase.from("profiles").select("*").eq("id",uid).single(),
        supabase.from("advice").select("*").eq("user_id",uid).order("created_at",{ascending:false}),
      ]);
      if(adviceRes.data?.length) setAdviceHistory(adviceRes.data);
      if(entriesRes.data?.length) setEntries(entriesRes.data.map(e=>({...e,todos:e.todos||[],stressTags:e.stress_tags||[],joyTags:e.joy_tags||[],stressCategories:e.stress_categories||[],joyCategories:e.joy_categories||[]})));
      if(habitsRes.data?.length) setHabits(habitsRes.data.map(h=>({...h,checked:h.checked||{}})));
     if(goalsRes.data?.length) setGoals(goalsRes.data);
      if(profileRes.data) setIsPro(profileRes.data.is_pro && (!profileRes.data.pro_expires_at || new Date(profileRes.data.pro_expires_at) > new Date()));
      // Referral code
      let code=profileRes.data?.referral_code;
      if(!code){ code=Math.random().toString(36).substring(2,8).toUpperCase(); await supabase.from("profiles").update({referral_code:code}).eq("id",uid); }
      setReferralCode(code);
      const {count:refCount}=await supabase.from("referrals").select("*",{count:"exact",head:true}).eq("referrer_id",uid).not("rewarded_at","is",null);
      setReferralCount(refCount||0);
      // Process pending referral from sign-up
      const pendingRef=localStorage.getItem("tl_ref");
      if(pendingRef){
        localStorage.removeItem("tl_ref");
        const {data:referrerProfile}=await supabase.from("profiles").select("id").eq("referral_code",pendingRef).single();
        if(referrerProfile && referrerProfile.id!==uid){
          await supabase.from("referrals").insert({referrer_id:referrerProfile.id,referred_id:uid}).onConflict("referred_id").ignore();
        }
      }
      setDbLoading(false);
    }
    loadAll();
  },[session]);

  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const streak=(()=>{
    if(!entries.length) return 0;
    const dates=new Set(entries.map(e=>e.date));
    let count=0; const d=new Date();
    if(!dates.has(d.toISOString().split("T")[0])) d.setDate(d.getDate()-1);
    while(dates.has(d.toISOString().split("T")[0])){ count++; d.setDate(d.getDate()-1); }
    return count;
  })();
  const monthYear=new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const moodForDay=(date)=>{ const e=entries.find(en=>en.date===date); return e?.mood||null; };

  // ── Auth actions ──
  const handleSignUp = async()=>{
    setAuthSubmitting(true); setAuthError(""); setAuthSuccess("");
    const refCode=new URLSearchParams(window.location.search).get("ref");
    if(refCode) localStorage.setItem("tl_ref",refCode);
    const {error}=await supabase.auth.signUp({email:authEmail,password:authPassword,options:{data:{name:authName}}});
    if(error){ localStorage.removeItem("tl_ref"); setAuthError(error.message); }
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
  const resetPlan=()=>{ setDayPlan(null); setPlanInput(""); setPlanTodos([]); setTimelineEvents([]); setAddingEventAtBlock(null); localStorage.removeItem(`dayplan_${todayStr}`); };
  const savePlanToStorage=(plan,todos,tevents)=>{
    localStorage.setItem(`dayplan_${todayStr}`,JSON.stringify({plan,todos,timelineEvents:tevents}));
  };
  const addTimelineEvent=(block,text,todoIdx=null)=>{
    const event={id:Date.now(),block,text,fromTodo:todoIdx!==null};
    const nextEvents=[...timelineEvents,event];
    setTimelineEvents(nextEvents);
    let nextTodos=planTodos;
    if(todoIdx!==null){
      nextTodos=planTodos.map((t,i)=>i===todoIdx?{...t,scheduledBlock:block}:t);
      setPlanTodos(nextTodos);
    }
    savePlanToStorage(dayPlan,nextTodos,nextEvents);
  };
  const removeTimelineEvent=(id)=>{
    const removed=timelineEvents.find(e=>e.id===id);
    const nextEvents=timelineEvents.filter(e=>e.id!==id);
    setTimelineEvents(nextEvents);
    let nextTodos=planTodos;
    if(removed?.fromTodo){
      nextTodos=planTodos.map(t=>t.text===removed.text?{...t,scheduledBlock:undefined}:t);
      setPlanTodos(nextTodos);
    }
    savePlanToStorage(dayPlan,nextTodos,nextEvents);
  };
  const DAY_BLOCKS=[{key:"morning",label:"Morning",icon:"🌅"},{key:"afternoon",label:"Afternoon",icon:"☀️"},{key:"evening",label:"Evening",icon:"🌙"}];

  // ── Data export ──
  const exportData=async(format)=>{
    haptic("medium");
    let content,filename,type;
    if(format==="journal"){
      const sorted=[...entries].sort((a,b)=>a.date.localeCompare(b.date));
      content=`# My Throughline Journal\nExported ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}\n${sorted.map(e=>{
        const mobj=e.mood?MOODS[e.mood-1]:null;
        const lines=[`\n## ${formatDate(e.date)}`];
        if(mobj) lines.push(`*Mood: ${mobj.label} ${mobj.emoji}*`);
        lines.push(`\n${e.text}`);
        if(e.insight) lines.push(`\n> ${e.insight}`);
        if(e.stressTags?.length) lines.push(`\nStressors: ${e.stressTags.join(", ")}`);
        if(e.joyTags?.length) lines.push(`Joy: ${e.joyTags.join(", ")}`);
        if(e.todos?.length) lines.push(`\nTo-dos:\n${e.todos.map(t=>`- ${t}`).join("\n")}`);
        return lines.join("\n");
      }).join("\n\n---")}\n`;
      filename=`throughline-journal-${todayStr}.md`; type="text/markdown";
    } else {
      content=JSON.stringify({exported:new Date().toISOString(),entries,habits,goals},null,2);
      filename=`throughline-backup-${todayStr}.json`; type="application/json";
    }
    const file=new File([content],filename,{type});
    if(navigator.share&&navigator.canShare?.({files:[file]})){
      try{ await navigator.share({title:"Throughline export",files:[file]}); return; }catch(e){}
    }
    const url=URL.createObjectURL(file);
    const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
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
    ((e.stressCategories?.length?e.stressCategories:e.stressTags)||[]).forEach(t=>{stressTagCounts[t]=(stressTagCounts[t]||0)+1;});
    ((e.joyCategories?.length?e.joyCategories:e.joyTags)||[]).forEach(t=>{joyTagCounts[t]=(joyTagCounts[t]||0)+1;});
  });
  const maxStress=Math.max(1,...Object.values(stressTagCounts));const maxJoy=Math.max(1,...Object.values(joyTagCounts));
  const STRESS_PATTERNS=Object.entries(stressTagCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({label,count,pct:Math.round(count/maxStress*100)}));
  const JOY_PATTERNS=Object.entries(joyTagCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({label,count,pct:Math.round(count/maxJoy*100)}));

  // ── Habit helpers ──
  const toggleHabit=async(hid,date)=>{ const habit=habits.find(h=>h.id===hid); const newChecked={...habit.checked,[date]:!habit.checked[date]}; setHabits(p=>p.map(h=>h.id===hid?{...h,checked:newChecked}:h)); await supabase.from("habits").update({checked:newChecked}).eq("id",hid); };
  const addHabit=async()=>{ if(!newHabitName.trim()||!session)return; const h={id:"h"+Date.now(),name:newHabitName.trim(),goal:newHabitGoal.trim()||null,color:newHabitColor,checked:Object.fromEntries(last28Days().map(d=>[d,false])),user_id:session.user.id}; setHabits(p=>[...p,h]); await supabase.from("habits").insert(h); setNewHabitName(""); setNewHabitGoal(""); setAddingHabit(false); };
  const updateHabit=async(hid,fields)=>{ setHabits(p=>p.map(h=>h.id===hid?{...h,...fields}:h)); await supabase.from("habits").update(fields).eq("id",hid); };
  const addHabitToGoal=async(goalId)=>{
    if(!newLinkedHabitName.trim()||!session) return;
    const h={id:"h"+Date.now(),name:newLinkedHabitName.trim(),goal_id:goalId,color:newLinkedHabitColor,checked:Object.fromEntries(last28Days().map(d=>[d,false])),user_id:session.user.id};
    setHabits(p=>[...p,h]);
    await supabase.from("habits").insert(h);
    setNewLinkedHabitName(""); setAddingHabitToGoal(null);
  };
  const deleteHabit=async(hid)=>{ setHabits(p=>p.filter(h=>h.id!==hid)); await supabase.from("habits").delete().eq("id",hid); };
  const habitStreak=(h)=>{ let s=0; for(const d of last28Days().reverse()){ if(h.checked[d])s++; else break; } return s; };

  // ── Goal helpers ──
  const acceptSuggested=async(sg)=>{ if(!session)return; const g={id:"g"+Date.now(),title:sg.title,why:sg.why||"",icon:sg.icon||"✦",source:"mine",user_id:session.user.id}; setGoals(p=>[...p,g]); setSuggestedGoals(p=>p.filter(x=>x!==sg)); await supabase.from("goals").insert(g); };
  const dismissSuggested=(sg)=>setSuggestedGoals(p=>p.filter(x=>x!==sg));
  const deleteGoal=async(gid)=>{ setGoals(p=>p.filter(g=>g.id!==gid)); await supabase.from("goals").delete().eq("id",gid); };
  const addManualGoal=async()=>{ if(!newGoalText.trim()||!session)return; const g={id:"g"+Date.now(),title:newGoalText.trim(),why:"",icon:"✦",source:"mine",user_id:session.user.id}; setGoals(p=>[...p,g]); await supabase.from("goals").insert(g); setNewGoalText(""); setAddingGoal(false); };
const handleSuggestGoals=async()=>{ setSuggestingGoals(true); try{ const s=await suggestGoals(entries,session.user.id,isPro); setSuggestedGoals(s.map(g=>({...g,id:"sg"+Date.now()+Math.random()}))); }catch(e){console.error("suggestGoals failed:",e);} setSuggestingGoals(false); };  const handleGenerateMonthlySummary=async()=>{ setGeneratingMonthlySummary(true); try{ const d=await generateMonthlySummary(entries,userName,session.user.id,isPro); setMonthlySummary(d.summary); }catch(e){console.error("monthlySummary failed:",e);} setGeneratingMonthlySummary(false); };
const handleGenerateDigest=async()=>{ setGeneratingDigest(true); try{ const d=await generateWeeklyDigest(entries,userName,session.user.id,isPro); setDigest(d); }catch(e){} setGeneratingDigest(false); };
  // ── Entry analysis ──
  const handleAnalyze=async()=>{
    if(!text.trim()||!session){ console.log("blocked - text:", text.trim(), "session:", session); return; }
    setLoading(true); setResult(null);
    try{
const parsed=await analyzeEntry(text,subTodos,subLearned,subGratitude,session.user.id,isPro);      setResult(parsed); setTodos(parsed.todos||[]);
const entry={date:selectedDate,mood:todayMood,text,todos:parsed.todos||[],stress_tags:parsed.stressTags||[],joy_tags:parsed.joyTags||[],stress_categories:parsed.stressCategories||[],joy_categories:parsed.joyCategories||[],insight:parsed.insight||"",user_id:session.user.id};      const {data}=await supabase.from("entries").insert(entry).select().single();
      if(data){
        const newEntries=[{...data,stressTags:data.stress_tags||[],joyTags:data.joy_tags||[],stressCategories:data.stress_categories||[],joyCategories:data.joy_categories||[]},...entries];
        setEntries(newEntries);
        maybeShowRating(newEntries.length);
        generateTomorrowOneliner(text,onelinerMode);
        // Referral reward: trigger on 3rd entry
        if(newEntries.length===3){
          try{
            const {data:referral}=await supabase.from("referrals").select("*").eq("referred_id",session.user.id).is("rewarded_at",null).single();
            if(referral){
              await fetch(`${API_BASE}/api/grant-referral`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({referralId:referral.id,referrerId:referral.referrer_id})});
            }
          }catch(e){}
        }
      }
    }catch(e){ setResult({error:true}); }
    setLoading(false);
  };

  // ── Advice ──
  const handleAskAdvice=async()=>{
    if(!adviceQuestion.trim()||!session) return;
    setAdviceLoading(true); setAdviceAnswer(null);
    try{
      const context=entries.slice(0,10).map(e=>`${e.date}: ${e.text}`).join("\n\n");
      const prompt=`You are a warm, thoughtful companion for ${userName||"this person"}. Based on their recent journal entries, give a personal, insightful response to their question. Be warm and specific to what you know about them. Respond in 2-3 sentences, no lists or headers.\n\nRecent entries:\n${context||"No entries yet."}\n\nQuestion: ${adviceQuestion}`;
      const answer=await callClaudeRaw(prompt,400,session.user.id,isPro);
      setAdviceAnswer(answer);
      const date=new Date().toISOString().split("T")[0];
      const {data}=await supabase.from("advice").insert({user_id:session.user.id,date,question:adviceQuestion,answer}).select().single();
      if(data) setAdviceHistory(p=>[data,...p]);
      setAdviceQuestion("");
    }catch(e){ setAdviceAnswer("Couldn't get a response — please try again."); }
    setAdviceLoading(false);
  };

  const generateDailyOneliner=async(entriesList,mode)=>{
    const cached=localStorage.getItem(`tl_oneliner_${todayStr}`);
    if(cached){ try{ const p=JSON.parse(cached); setDailyOneliner(p.text); return; }catch(e){} }
    const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yesterdayStr=yesterday.toISOString().split("T")[0];
    const yesterdayEntry=entriesList.find(e=>e.date===yesterdayStr);
    if(!yesterdayEntry){ setDailyOneliner(null); return; }
    setOnelinerLoading(true);
    try{
      const prompts={
        intention:`Based on this journal entry, write a single warm intention to carry into today (under 20 words). Start with "Today," or a similar forward-looking opener. No quotes.\n\nEntry: ${yesterdayEntry.text}`,
        observation:`Based on this journal entry, write a single warm observation about what this person is carrying (under 20 words). Start with "You've been" or "Lately" or similar. No quotes.\n\nEntry: ${yesterdayEntry.text}`,
        question:`Based on this journal entry, write a single open question to sit with today (under 20 words). Start with "What would it look like" or "What if" or similar. No quotes.\n\nEntry: ${yesterdayEntry.text}`,
      };
      const text=await callClaudeRaw(prompts[mode]||prompts.intention,60);
      setDailyOneliner(text.trim());
      localStorage.setItem(`tl_oneliner_${todayStr}`,JSON.stringify({text:text.trim(),mode}));
    }catch(e){}
    setOnelinerLoading(false);
  };

  useEffect(()=>{
    if(entries.length&&session&&!dailyOneliner&&!onelinerLoading){
      generateDailyOneliner(entries,onelinerMode);
    }
  },[entries,session]);

  const toggleAdviceVoice=()=>{
    if(adviceRecording){ adviceRecognitionRef.current?.stop(); setAdviceRecording(false); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ alert("Voice input not supported on this device."); return; }
    const r=new SR();
    r.continuous=true; r.interimResults=false; r.lang="en-US";
    r.onresult=(e)=>{ let f=""; for(let i=e.resultIndex;i<e.results.length;i++){ if(e.results[i].isFinal) f+=e.results[i][0].transcript+" "; } if(f) setAdviceQuestion(p=>p+f); };
    r.onend=()=>setAdviceRecording(false);
    r.start(); adviceRecognitionRef.current=r; setAdviceRecording(true);
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

  // ── Reusable Habits section (legacy, unused) ──
  const HabitsSection = () => {
    const weekDays=lastNDays(7);
    const getMonthDays=(habitId)=>{
      const now=new Date(); const year=now.getFullYear(); const month=now.getMonth();
      const firstDay=new Date(year,month,1).getDay();
      const daysInMonth=new Date(year,month+1,0).getDate();
      return {firstDay,daysInMonth,year,month};
    };
    return(
    <div className="hg-section">
      <div className="hg-section-header">
        <div>
          <div className="hg-section-title">Habits & Goals</div>
          <div className="hg-section-sub">Tap to expand and track</div>
        </div>
        <button className="btn btn-ghost" style={{padding:"6px 14px",fontSize:12}} onClick={()=>{setAddingHabit(v=>!v);setExpandedHabit(null);}}>{addingHabit?"Cancel":"+ Add habit"}</button>
      </div>

      {habits.length===0&&!addingHabit&&<div className="empty-state" style={{padding:"20px 0"}}>No habits yet — add one above.</div>}

      {habits.map(h=>{
        const isExpanded=expandedHabit===h.id;
        const isEditing=editingHabitId===h.id;
        const showMonth=habitMonthView===h.id;
        const streak=habitStreak(h);
        const {firstDay,daysInMonth,year,month}=getMonthDays(h.id);
        return(
          <div key={h.id} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:"14px 16px",marginBottom:10,animation:"fadeUp 0.2s ease"}}>
            {/* ── Collapsed header ── */}
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>{if(!isEditing){setExpandedHabit(isExpanded?null:h.id);setHabitMonthView(null);}}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:h.color,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,color:"var(--cream)",fontWeight:400}}>{h.name}</div>
                {h.goal&&<div style={{fontSize:12,color:"var(--text-muted)",fontStyle:"italic",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.goal}</div>}
                {!h.goal&&isExpanded&&<div style={{fontSize:12,color:"var(--text-dim)",fontStyle:"italic",marginTop:1}}>No goal yet</div>}
              </div>
              <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}}>
                {weekDays.map(d=><div key={d} style={{width:8,height:8,borderRadius:2,background:h.checked?.[d]?h.color:"var(--surface2)",border:"1px solid var(--border)",transition:"background 0.12s"}}/>)}
                <span style={{fontSize:11,color:"var(--text-dim)",marginLeft:4}}>{isExpanded?"▲":"▼"}</span>
              </div>
            </div>

            {isExpanded&&!isEditing&&<>
              {streak>1&&<div style={{marginTop:8}}><span className="habit-streak-label">🔥 {streak}-day streak</span></div>}

              {/* 7-day tracker */}
              <div style={{marginTop:14}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:8}}>THIS WEEK</div>
                <div style={{display:"flex",gap:6}}>
                  {weekDays.map(d=>{
                    const checked=!!h.checked?.[d];
                    const label=new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short"});
                    return <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}} onClick={()=>toggleHabit(h.id,d)}>
                      <div style={{fontSize:9,color:"var(--text-dim)"}}>{label}</div>
                      <div style={{width:"100%",aspectRatio:"1",borderRadius:6,background:checked?h.color:"var(--surface2)",border:`1px solid ${checked?h.color:"var(--border)"}`,transition:"all 0.12s"}}/>
                    </div>;
                  })}
                </div>
                <button onClick={()=>setHabitMonthView(showMonth?null:h.id)} style={{marginTop:10,background:"none",border:"none",color:"var(--text-dim)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer",padding:0}}>
                  {showMonth?"Hide month ▲":"See full month ▼"}
                </button>
              </div>

              {/* Month calendar */}
              {showMonth&&<div style={{marginTop:12}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:8}}>{new Date(year,month).toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
                  {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{fontSize:9,color:"var(--text-dim)",textAlign:"center"}}>{d}</div>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                  {Array.from({length:firstDay}).map((_,i)=><div key={"e"+i}/>)}
                  {Array.from({length:daysInMonth}).map((_,i)=>{
                    const day=i+1;
                    const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const checked=!!h.checked?.[dateStr];
                    const isToday=dateStr===todayStr;
                    return <div key={day} onClick={()=>toggleHabit(h.id,dateStr)} style={{aspectRatio:"1",borderRadius:6,background:checked?h.color:"var(--surface2)",border:`1px solid ${isToday?"var(--amber)":checked?h.color:"var(--border)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>
                      <span style={{fontSize:9,color:checked?"rgba(255,255,255,0.8)":"var(--text-dim)"}}>{day}</span>
                    </div>;
                  })}
                </div>
              </div>}

              {/* Goal section */}
              <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid var(--border)"}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:6}}>GOAL</div>
                {h.goal
                  ? <div style={{fontSize:13,color:"var(--text-muted)",fontStyle:"italic",lineHeight:1.5}}>{h.goal}</div>
                  : <div style={{fontSize:13,color:"var(--text-dim)",fontStyle:"italic"}}>No goal set — add one when editing.</div>
                }
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button onClick={()=>{setEditingHabitId(h.id);setEditingHabitName(h.name);setEditingHabitGoal(h.goal||"");}} style={{padding:"6px 14px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer"}}>Edit</button>
                <button onClick={()=>deleteHabit(h.id)} style={{padding:"6px 14px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--rose)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer"}}>Delete</button>
              </div>
            </>}

            {/* ── Edit mode ── */}
            {isEditing&&<div style={{marginTop:12}} onClick={e=>e.stopPropagation()}>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>HABIT NAME</div>
                <input value={editingHabitName} onChange={e=>setEditingHabitName(e.target.value)} style={{width:"100%",background:"var(--surface2)",border:"1px solid var(--amber)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none"}}/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>GOAL</div>
                <input value={editingHabitGoal} onChange={e=>setEditingHabitGoal(e.target.value)} placeholder="What is this habit working towards?" style={{width:"100%",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={async()=>{ await updateHabit(h.id,{name:editingHabitName.trim()||h.name,goal:editingHabitGoal.trim()||null}); setEditingHabitId(null); }} style={{padding:"7px 16px",borderRadius:8,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",fontWeight:500}}>Save</button>
                <button onClick={()=>setEditingHabitId(null)} style={{padding:"7px 16px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>}
          </div>
        );
      })}

      {addingHabit&&<div style={{background:"var(--surface)",border:"1px solid var(--amber)",borderRadius:14,padding:"16px",marginBottom:10,animation:"fadeUp 0.2s ease"}}>
        <div style={{marginBottom:8}}>
          <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>HABIT NAME</div>
          <input autoFocus className="add-habit-input" placeholder="e.g. Morning walk, Read 20 min" value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")setAddingHabit(false);}} style={{width:"100%"}}/>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>GOAL</div>
          <input className="add-habit-input" placeholder="What is this habit working towards?" value={newHabitGoal} onChange={e=>setNewHabitGoal(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")setAddingHabit(false);}} style={{width:"100%"}}/>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:6}}>COLOUR</div>
          <div className="habit-color-pick" style={{marginTop:0}}>{HABIT_COLORS.map(c=><div key={c} className={`habit-color-swatch ${newHabitColor===c?"selected":""}`} style={{background:c}} onClick={()=>setNewHabitColor(c)}/>)}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-primary" onClick={addHabit} disabled={!newHabitName.trim()}>Add habit</button>
          <button className="btn btn-ghost" onClick={()=>setAddingHabit(false)}>Cancel</button>
        </div>
      </div>}
    </div>
  );
  };

  // ── Goals section (with inline habits) ──
  const GoalsSection = () => {
    const getMonthDays=()=>{ const now=new Date(); const year=now.getFullYear(); const month=now.getMonth(); const firstDay=new Date(year,month,1).getDay(); const daysInMonth=new Date(year,month+1,0).getDate(); return {firstDay,daysInMonth,year,month}; };
    const weekDays=lastNDays(7);
    const allGoals=[...goals,...suggestedGoals.map(sg=>({...sg,_suggested:true}))];
    return(
    <div className="hg-section">
      <div className="hg-section-header">
        <div>
          <div className="hg-section-title">Habits & Goals</div>
          <div className="hg-section-sub">Goals with daily habits attached</div>
        </div>
        <button className="btn btn-ghost" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setAddingGoal(v=>!v)}>{addingGoal?"Cancel":"+ Add goal"}</button>
      </div>

      {addingGoal&&<div style={{background:"var(--surface)",border:"1px solid var(--amber)",borderRadius:14,padding:"16px",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
        <div style={{marginBottom:8}}>
          <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>GOAL</div>
          <input autoFocus className="add-goal-input" placeholder="What do you want to work towards?" value={newGoalText} onChange={e=>setNewGoalText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addManualGoal();if(e.key==="Escape")setAddingGoal(false);}}/>
        </div>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button className="btn btn-primary" onClick={addManualGoal} disabled={!newGoalText.trim()}>Add goal</button>
          <button className="btn btn-ghost" onClick={()=>setAddingGoal(false)}>Cancel</button>
        </div>
      </div>}

      {allGoals.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No goals yet — add one or let the app suggest some.</div>}

      {allGoals.map(g=>{
        if(g._suggested) return(
          <div key={g.id} className="goal-card suggested" style={{marginBottom:10}}>
            <div className="goal-header"><span className="goal-icon">{g.icon}</span><div className="goal-body"><div className="goal-title">{g.title}</div>{g.why&&<div className="goal-why">{g.why}</div>}</div></div>
            <div className="goal-footer"><span className="goal-badge suggested-badge">✦ Suggested for you</span><div className="goal-actions"><button className="goal-btn" onClick={()=>dismissSuggested(g)}>Dismiss</button><button className="goal-btn accept" onClick={()=>acceptSuggested(g)}>Add this →</button></div></div>
          </div>
        );

        const habit=habits.find(h=>h.goal_id===g.id);
        const isExpanded=expandedGoal===g.id;
        const isEditing=editingGoalCard===g.id;
        const showMonth=habitMonthView===g.id;
        const {firstDay,daysInMonth,year,month}=getMonthDays();
        const streak=habit?habitStreak(habit):0;

        return(
          <div key={g.id} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:"14px 16px",marginBottom:10,animation:"fadeUp 0.2s ease"}}>
            {/* Collapsed header */}
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>{if(!isEditing){setExpandedGoal(isExpanded?null:g.id);setHabitMonthView(null);}}}>
              <span style={{fontSize:18,flexShrink:0}}>{g.icon||"✦"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,color:"var(--cream)",fontWeight:400}}>{g.title}</div>
                {habit
                  ? <div style={{fontSize:12,color:"var(--text-muted)",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📌 {habit.name}</div>
                  : <div style={{fontSize:12,color:"var(--text-dim)",fontStyle:"italic",marginTop:1}}>No habit yet</div>
                }
              </div>
              <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}}>
                {habit&&weekDays.map(d=><div key={d} style={{width:8,height:8,borderRadius:2,background:habit.checked?.[d]?habit.color:"var(--surface2)",border:"1px solid var(--border)"}}/>)}
                <span style={{fontSize:11,color:"var(--text-dim)",marginLeft:4}}>{isExpanded?"▲":"▼"}</span>
              </div>
            </div>

            {isExpanded&&!isEditing&&<>
              {g.why&&<div style={{fontSize:13,color:"var(--text-muted)",fontStyle:"italic",marginTop:10,lineHeight:1.5}}>{g.why}</div>}

              {/* Habit tracker */}
              {habit&&<>
                {streak>1&&<div style={{marginTop:8}}><span className="habit-streak-label">🔥 {streak}-day streak</span></div>}
                <div style={{marginTop:14}}>
                  <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:8}}>THIS WEEK · {habit.name}</div>
                  <div style={{display:"flex",gap:6}}>
                    {weekDays.map(d=>{
                      const checked=!!habit.checked?.[d];
                      const label=new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short"});
                      return <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}} onClick={()=>toggleHabit(habit.id,d)}>
                        <div style={{fontSize:9,color:"var(--text-dim)"}}>{label}</div>
                        <div style={{width:"100%",aspectRatio:"1",borderRadius:6,background:checked?habit.color:"var(--surface2)",border:`1px solid ${checked?habit.color:"var(--border)"}`,transition:"all 0.12s"}}/>
                      </div>;
                    })}
                  </div>
                  <button onClick={()=>setHabitMonthView(showMonth?null:g.id)} style={{marginTop:10,background:"none",border:"none",color:"var(--text-dim)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer",padding:0}}>
                    {showMonth?"Hide month ▲":"See full month ▼"}
                  </button>
                </div>
                {showMonth&&<div style={{marginTop:12}}>
                  <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:8}}>{new Date(year,month).toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
                    {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{fontSize:9,color:"var(--text-dim)",textAlign:"center"}}>{d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                    {Array.from({length:firstDay}).map((_,i)=><div key={"e"+i}/>)}
                    {Array.from({length:daysInMonth}).map((_,i)=>{
                      const day=i+1;
                      const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                      const checked=!!habit.checked?.[dateStr];
                      const isToday=dateStr===todayStr;
                      return <div key={day} onClick={()=>toggleHabit(habit.id,dateStr)} style={{aspectRatio:"1",borderRadius:6,background:checked?habit.color:"var(--surface2)",border:`1px solid ${isToday?"var(--amber)":checked?habit.color:"var(--border)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>
                        <span style={{fontSize:9,color:checked?"rgba(255,255,255,0.8)":"var(--text-dim)"}}>{day}</span>
                      </div>;
                    })}
                  </div>
                </div>}
              </>}

              {/* No habit yet */}
              {!habit&&addingHabitToGoal!==g.id&&<button onClick={()=>{setAddingHabitToGoal(g.id);setNewLinkedHabitName("");setNewLinkedHabitColor(HABIT_COLORS[0]);}} style={{marginTop:12,background:"var(--surface2)",border:"1px dashed rgba(200,136,42,0.4)",borderRadius:10,padding:"10px 16px",color:"var(--amber-soft)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",width:"100%",textAlign:"left"}}>+ Add a daily habit to this goal</button>}

              {/* Add habit form */}
              {addingHabitToGoal===g.id&&<div style={{marginTop:12,padding:"12px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)"}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:6}}>DAILY HABIT</div>
                <input autoFocus className="add-habit-input" placeholder="e.g. Morning walk, Read 20 min" value={newLinkedHabitName} onChange={e=>setNewLinkedHabitName(e.target.value)} style={{width:"100%",marginBottom:8}}/>
                <div className="habit-color-pick" style={{marginBottom:10}}>{HABIT_COLORS.map(c=><div key={c} className={`habit-color-swatch ${newLinkedHabitColor===c?"selected":""}`} style={{background:c}} onClick={()=>setNewLinkedHabitColor(c)}/>)}</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-primary" onClick={()=>addHabitToGoal(g.id)} disabled={!newLinkedHabitName.trim()}>Add habit</button>
                  <button className="btn btn-ghost" onClick={()=>setAddingHabitToGoal(null)}>Cancel</button>
                </div>
              </div>}

              {/* Actions */}
              <div style={{display:"flex",gap:8,marginTop:14,paddingTop:12,borderTop:"1px solid var(--border)"}}>
                <button onClick={()=>{setEditingGoalCard(g.id);setEditGoalTitle(g.title);setEditGoalWhy(g.why||"");setEditHabitName(habit?.name||"");setEditHabitColor(habit?.color||HABIT_COLORS[0]);}} style={{padding:"6px 14px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer"}}>Edit</button>
                <button onClick={()=>deleteGoal(g.id)} style={{padding:"6px 14px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--rose)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer"}}>Delete goal</button>
                {habit&&<button onClick={()=>deleteHabit(habit.id)} style={{padding:"6px 14px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--text-dim)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer"}}>Remove habit</button>}
              </div>
            </>}

            {/* Edit mode */}
            {isEditing&&<div style={{marginTop:12}} onClick={e=>e.stopPropagation()}>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>GOAL</div>
                <input value={editGoalTitle} onChange={e=>setEditGoalTitle(e.target.value)} style={{width:"100%",background:"var(--surface2)",border:"1px solid var(--amber)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none"}}/>
              </div>
              <div style={{marginBottom:habit?12:0}}>
                <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>WHY</div>
                <input value={editGoalWhy} onChange={e=>setEditGoalWhy(e.target.value)} placeholder="Optional — what's the deeper reason?" style={{width:"100%",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none"}}/>
              </div>
              {habit&&<>
                <div style={{marginTop:12,marginBottom:8}}>
                  <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>HABIT NAME</div>
                  <input value={editHabitName} onChange={e=>setEditHabitName(e.target.value)} style={{width:"100%",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none"}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:6}}>HABIT COLOUR</div>
                  <div className="habit-color-pick" style={{marginTop:0}}>{HABIT_COLORS.map(c=><div key={c} className={`habit-color-swatch ${editHabitColor===c?"selected":""}`} style={{background:c}} onClick={()=>setEditHabitColor(c)}/>)}</div>
                </div>
              </>}
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button onClick={async()=>{
                  await supabase.from("goals").update({title:editGoalTitle.trim()||g.title,why:editGoalWhy.trim()||null}).eq("id",g.id);
                  setGoals(p=>p.map(x=>x.id===g.id?{...x,title:editGoalTitle.trim()||g.title,why:editGoalWhy.trim()||null}:x));
                  if(habit&&editHabitName.trim()) await updateHabit(habit.id,{name:editHabitName.trim(),color:editHabitColor});
                  setEditingGoalCard(null);
                }} style={{padding:"7px 16px",borderRadius:8,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",fontWeight:500}}>Save</button>
                <button onClick={()=>setEditingGoalCard(null)} style={{padding:"7px 16px",borderRadius:8,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>}
          </div>
        );
      })}

      <button className="goals-suggest-btn" onClick={handleSuggestGoals} disabled={suggestingGoals||entries.length===0}>{suggestingGoals?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Reading your entries...</>:<><span>✦</span> Suggest goals based on my entries</>}</button>
    </div>
  );
  };

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
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <input value={userName} onChange={e=>setUserName(e.target.value)} onBlur={async()=>{ await supabase.auth.updateUser({data:{name:userName}}); haptic("light"); }} placeholder="Your name" style={{flex:1,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:14,outline:"none"}}/>
            </div>
            <div style={{fontSize:14,color:"var(--text-muted)"}}>{session?.user?.email}</div>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <a href="https://www.gethroughline.com/privacy-policy" target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>Privacy policy</a>
            <a href="https://www.gethroughline.com/terms-of-service" target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>Terms of service</a>
            <a href="mailto:privacy@gethroughline.com?subject=Throughline Feedback" style={{fontSize:13,color:"var(--text-muted)",textDecoration:"none"}}>Send feedback</a>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <div style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:8}}>EXPORT DATA</div>
            <button onClick={()=>exportData("journal")} style={{background:"none",border:"none",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",padding:0}}>Export journal as Markdown</button>
            <button onClick={()=>exportData("json")} style={{background:"none",border:"none",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",padding:0}}>Export full backup as JSON</button>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <div style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>NOTIFICATIONS</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:8}}>
              <span style={{fontSize:13,color:"var(--text-muted)"}}>Morning intention</span>
              <input type="time" value={morningTime} onChange={e=>updateMorningTime(e.target.value)} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"5px 8px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none",cursor:"pointer",colorScheme:"dark"}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <span style={{fontSize:13,color:"var(--text-muted)"}}>Evening reminder</span>
              <input type="time" value={notifTime} onChange={e=>updateNotifTime(e.target.value)} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"5px 8px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:13,outline:"none",cursor:"pointer",colorScheme:"dark"}}/>
            </div>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <div style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:8}}>DAILY HOME CARD</div>
            <div style={{display:"flex",gap:6}}>
              {["intention","observation","question"].map(m=>(
                <button key={m} onClick={async()=>{ setOnelinerMode(m); await supabase.auth.updateUser({data:{oneliner_mode:m}}); localStorage.removeItem(`tl_oneliner_${todayStr}`); setDailyOneliner(null); generateDailyOneliner(entries,m); }} style={{flex:1,padding:"6px 4px",borderRadius:8,border:"1px solid var(--border)",background:onelinerMode===m?"var(--amber)":"transparent",color:onelinerMode===m?"#0e0c0a":"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:11,cursor:"pointer",transition:"all 0.15s",textTransform:"capitalize"}}>{m}</button>
              ))}
            </div>
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            <div style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.5px",marginBottom:4}}>REFER A FRIEND</div>
            <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.5,marginBottom:6}}>Share your link — you get 30 days free Pro when a friend logs their first 3 entries.{referralCount>0&&<span style={{color:"var(--amber-soft)"}}> {referralCount} successful {referralCount===1?"referral":"referrals"} so far.</span>}</div>
            {referralCode&&<button onClick={async()=>{ const url=`https://www.gethroughline.com/app?ref=${referralCode}`; try{ await navigator.share({title:"Throughline",text:"I've been using Throughline to reflect and grow — give it a try!",url}); }catch(e){ await navigator.clipboard.writeText(url); } haptic("light"); }} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--amber-soft)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",width:"100%"}}>Share your referral link →</button>}
            <div style={{height:"1px",background:"var(--border)",margin:"4px 0"}}/>
            {!isPro&&<button onClick={()=>{setShowSettings(false);setShowUpgrade(true);loadIAPPackages();}} style={{background:"none",border:"none",color:"var(--amber-soft)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",padding:0}}>Upgrade to Pro ✦</button>}
            {isPro&&<button onClick={()=>window.open("https://apps.apple.com/account/subscriptions","_blank")} style={{background:"none",border:"none",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer",textAlign:"left",padding:0}}>Manage subscription</button>}
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
            {id:"home",    label:"Home"},
            {id:"journal", label:"Journal"},
            {id:"plan",    label:"Plan"},
            {id:"habits",  label:"Habits & Goals"},
            {id:"patterns",label:"Patterns"},
          ].map(t=>(
            <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>{haptic("light");setTab(t.id);}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </nav>

    {/* ── HOME ── */}
    {tab==="home"&&<>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <div className="date-label">{today}</div>
          <div className="date-main">{userName?`Hey, ${userName.split(" ")[0]}`:"Welcome back"}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
          {streak>0&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"6px 10px"}}>
            <span style={{fontSize:13}}>🔥</span>
            <span style={{fontFamily:"Playfair Display,serif",fontSize:14,color:"var(--cream)",lineHeight:1.2}}>{streak}</span>
            <span style={{fontSize:9,color:"var(--text-dim)",letterSpacing:"0.3px"}}>streak</span>
          </div>}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"6px 10px"}}>
            <span style={{fontSize:13}}>📓</span>
            <span style={{fontFamily:"Playfair Display,serif",fontSize:14,color:"var(--cream)",lineHeight:1.2}}>{entries.length}</span>
            <span style={{fontSize:9,color:"var(--text-dim)",letterSpacing:"0.3px"}}>entries</span>
          </div>
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,var(--surface),var(--amber-dim))",border:"1px solid rgba(200,136,42,0.25)",borderRadius:14,padding:"20px 20px 16px",marginBottom:16}}>
        <div style={{fontSize:10,color:"var(--amber-soft)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>{onelinerMode} for today</div>
        {onelinerLoading&&<div className="loading-dots" style={{padding:0}}><span/><span/><span/></div>}
        {!onelinerLoading&&dailyOneliner&&<div style={{fontFamily:"Playfair Display,serif",fontSize:17,fontStyle:"italic",color:"var(--cream)",lineHeight:1.6}}>{dailyOneliner}</div>}
        {!onelinerLoading&&!dailyOneliner&&<div style={{fontSize:13,color:"var(--amber-soft)",fontStyle:"italic",opacity:0.7}}>Journal today for an intention tomorrow...</div>}
      </div>
      <div className="entry-card">
        <div className="entry-prompt">Ask anything — your journal entries give the answer context.</div>
        <textarea className="entry-textarea" placeholder="What should I focus on this week? How have I been doing with stress lately?" value={adviceQuestion} onChange={e=>setAdviceQuestion(e.target.value)} rows={3}/>
        <div className="entry-footer">
          <span className="char-count">{adviceQuestion.length} characters</span>
          <div className="entry-actions">
            <button className={`btn btn-ghost ${adviceRecording?"recording":""}`} onClick={toggleAdviceVoice}>{adviceRecording&&<span className="rec-dot"/>}{adviceRecording?"Stop":"🎙 Speak"}</button>
            <button className="btn btn-primary" onClick={handleAskAdvice} disabled={!adviceQuestion.trim()||adviceLoading}>{adviceLoading?"Thinking...":"Ask →"}</button>
          </div>
        </div>
      </div>
      {adviceLoading&&<div className="entry-card"><div className="entry-prompt">Thinking through your entries...</div><div className="loading-dots"><span/><span/><span/></div></div>}
      {adviceAnswer&&<div className="analysis-section"><div className="section-label">Response</div><div className="insight-box">{adviceAnswer}</div></div>}
      {adviceHistory.length>0&&<>
        <div className="section-label" style={{marginBottom:12,marginTop:24}}>Past questions</div>
        {adviceHistory.slice(0,5).map(a=>{
          const isOpen=expandedAdvice===a.id;
          return <div key={a.id} className="pattern-card" style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setExpandedAdvice(isOpen?null:a.id)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div style={{fontSize:13,color:"var(--text)",fontWeight:500,flex:1}}>{a.question}</div>
              <span style={{fontSize:12,color:"var(--text-dim)",flexShrink:0}}>{isOpen?"▲":"▼"}</span>
            </div>
            {isOpen&&<>
              <div style={{height:1,background:"var(--border)",margin:"10px 0"}}/>
              <div style={{fontSize:12,color:"var(--amber-soft)",fontStyle:"italic",marginBottom:6}}>{formatDate(a.date)}</div>
              <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.65}}>{a.answer}</div>
            </>}
          </div>;
        })}
      </>}
    </>}

    {/* ── JOURNAL ── */}
    {tab==="journal"&&<>
      <div className="date-header">
        <div className="streak-badge-wrap">
          <div className="date-label">{preferredTime?`${preferredTime} reflection`:"end of day reflection"}</div>
          {streak>0&&<div className="streak-badge">🔥 {streak} day{streak!==1?"s":""}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div className="date-main">{formatDate(selectedDate)}</div>
          <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} max={todayStr} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}/>
        </div>
      </div>
      <div className="mood-slider-wrap">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--text-dim)",letterSpacing:"0.3px"}}>How was your day?</span>
          {todayMood
            ? <span style={{fontSize:13,fontWeight:500,color:MOOD_COLORS[todayMood]}}>{MOOD_LABELS[todayMood]}</span>
            : <span style={{fontSize:12,color:"var(--text-dim)",fontStyle:"italic"}}>slide to rate</span>}
        </div>
        <input type="range" min={1} max={5} step={1} value={todayMood||3}
          onChange={e=>{haptic("light");setTodayMood(Number(e.target.value));}}
          className="mood-slider"
          style={todayMood?{accentColor:MOOD_COLORS[todayMood]}:{opacity:0.45}}
        />
        <div style={{display:"flex",justifyContent:"space-between"}}>
          {[1,2,3,4,5].map(n=><span key={n} style={{fontSize:10,color:todayMood===n?MOOD_COLORS[n]:"var(--text-dim)",fontWeight:todayMood===n?500:400,transition:"color 0.15s"}}>{MOOD_LABELS[n]}</span>)}
        </div>
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
        <textarea className="entry-textarea" placeholder="Today I... the meeting went... I felt... I need to remember..." value={text} onChange={e=>setText(e.target.value)} rows={6}/>
        <div className="entry-footer">
          <span className="char-count">{text.length} characters</span>
          <div className="entry-actions">
            <button className={`btn btn-ghost ${recording?"recording":""}`} onClick={toggleVoice}>{recording&&<span className="rec-dot"/>}{recording?"Stop":"🎙 Speak"}</button>
            <button className="btn btn-primary" onClick={()=>{haptic("medium");handleAnalyze();}} disabled={!text.trim()||loading}>{loading?"Reflecting...":"Reflect →"}</button>
          </div>
        </div>
      </div>
      {loading&&<div className="entry-card"><div className="entry-prompt">Reading your day...</div><div className="loading-dots"><span/><span/><span/></div></div>}
      {result&&!result.error&&<>
        {todos.length>0&&<div className="analysis-section"><div className="section-label">Tomorrow's to-dos</div><div className="todo-list">{todos.map((t,i)=><div key={i} className="todo-item" style={{display:"flex",alignItems:"center",gap:8}}><div className={`todo-check ${checkedTodos[i]?"done":""}`} onClick={()=>setCheckedTodos(p=>({...p,[i]:!p[i]}))}/><span className={`todo-text ${checkedTodos[i]?"done":""}`} style={{flex:1}}>{t}</span></div>)}</div></div>}
        {(result.stressTags?.length>0||result.joyTags?.length>0)&&<div className="analysis-section"><div className="section-label">Today's signals</div><div className="tags-row">{result.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}{result.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}</div></div>}
        {result.insight&&<div className="analysis-section"><div className="section-label">Observation</div><div className="insight-box">"{result.insight}"</div></div>}
      </>}
{result?.error&&<div className="entry-card"><div className="entry-prompt">{result.rateLimit?"You've used all 5 reflections this month":"Couldn't parse that — try again or check your connection."}</div></div>}
      <div style={{height:1,background:"var(--border)",margin:"32px 0 24px"}}/>
      <div className="date-header" style={{marginBottom:16}}><div className="date-label">past entries</div><div className="date-main">Your journal</div></div>
      <div style={{marginBottom:16,position:"relative"}}>
        <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search entries..." style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 16px 12px 40px",color:"var(--text)",fontFamily:"DM Sans,sans-serif",fontSize:14,fontWeight:300,outline:"none"}}/>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-dim)",fontSize:14}}>🔍</span>
        {searchQuery&&<button onClick={()=>setSearchQuery("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",fontSize:16}}>✕</button>}
      </div>
      {dbLoading&&<div className="empty-state">Loading your entries...</div>}
      {!dbLoading&&entries.length===0&&<div className="empty-state">No entries yet — write your first reflection above.</div>}
      {(()=>{
        const allItems=[
          ...entries.map(e=>({...e,_type:"entry"})),
          ...adviceHistory.map(a=>({...a,_type:"advice"})),
        ].sort((a,b)=>b.date!==a.date?b.date.localeCompare(a.date):new Date(b.created_at)-new Date(a.created_at));
        const filtered=allItems.filter(item=>{
          if(!searchQuery) return true;
          const q=searchQuery.toLowerCase();
          if(item._type==="advice") return item.question.toLowerCase().includes(q)||item.answer.toLowerCase().includes(q);
          return item.text.toLowerCase().includes(q)||item.insight?.toLowerCase().includes(q)||item.stressTags?.some(t=>t.toLowerCase().includes(q))||item.joyTags?.some(t=>t.toLowerCase().includes(q));
        });
        return filtered.map(item=>{
          if(item._type==="advice") return(
            <div key={"adv-"+item.id} className="pattern-card" style={{marginBottom:14,borderLeft:"2px solid var(--amber-soft)"}}>
              <div style={{fontSize:12,color:"var(--amber-soft)",fontFamily:"Playfair Display,serif",fontStyle:"italic",marginBottom:6}}>{formatDate(item.date)} · question</div>
              <div style={{fontSize:13,color:"var(--text)",fontWeight:500,marginBottom:8}}>{item.question}</div>
              <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.65}}>{item.answer}</div>
            </div>
          );
          const entry=item; const mobj=entry.mood?MOODS[entry.mood-1]:null; const isExpanded=expandedEntry===entry.id; const isEditing=editingEntry===entry.id;
          return(
            <div key={entry.id} className="pattern-card" style={{marginBottom:14,cursor:"pointer"}} onClick={()=>!isEditing&&setExpandedEntry(isExpanded?null:entry.id)}>
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
            </div>
          );
        });
      })()}
    </>}

    {/* ── PLAN ── */}
    {tab==="plan"&&entries.length<3&&<>
      <div className="date-header">
        <div className="date-label">unlocking soon</div>
        <div className="date-main">Plan Your Day</div>
      </div>
      <div style={{textAlign:"center",padding:"48px 24px",background:"var(--surface)",borderRadius:14,border:"1px solid var(--border)"}}>
        <div style={{fontSize:36,marginBottom:14,opacity:0.4}}>✦</div>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:22,color:"var(--cream)",marginBottom:10}}>{3-entries.length} more {3-entries.length===1?"entry":"entries"}</div>
        <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.7,maxWidth:300,margin:"0 auto"}}>Plan Your Day works best once we understand your rhythm. Log a few reflections first and this will unlock.</p>
        <button onClick={()=>{haptic("light");setTab("journal");}} style={{marginTop:20,padding:"10px 20px",borderRadius:10,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer"}}>Log today's entry →</button>
      </div>
    </>}
    {tab==="plan"&&entries.length>=3&&<>
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
              <button className="btn btn-primary" onClick={()=>{haptic("medium");handleGeneratePlan();}} disabled={!planInput.trim()||planLoading}>{planLoading?"Planning...":"Plan my day →"}</button>
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
                <div className={`todo-check ${t.done?"done":""}`} onClick={()=>{haptic("light");togglePlanTodo(i);}}/>
                <span className={`plan-todo-text ${t.done?"done":""}`}>{t.text}</span>
                {t.scheduledBlock
                  ?<span style={{fontSize:10,color:"var(--amber)",flexShrink:0,border:"1px solid rgba(212,175,55,0.4)",borderRadius:6,padding:"2px 7px",textTransform:"capitalize"}}>{t.scheduledBlock}</span>
                  :<div className="plan-todo-block-btns">{DAY_BLOCKS.map(b=><button key={b.key} className="plan-todo-block-btn" onClick={(e)=>{e.stopPropagation();haptic("light");addTimelineEvent(b.key,t.text,i);}}>{b.label[0]}</button>)}</div>
                }
              </div>)}
            </div>
          </>}
          {dayPlan.note&&<div className="plan-note">{dayPlan.note}</div>}
        </div>
        <button className="btn btn-ghost" style={{marginTop:4}} onClick={resetPlan}>Re-plan →</button>
        <div className="day-blocks-wrap">
          {DAY_BLOCKS.map(b=>{
            const items=timelineEvents.filter(e=>e.block===b.key);
            const isAdding=addingEventAtBlock===b.key;
            return <div key={b.key} className="day-block">
              <div className="day-block-header">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="day-block-icon">{b.icon}</span>
                  <span className="day-block-title">{b.label}</span>
                </div>
                <button className="day-block-add-btn" onClick={()=>{haptic("light");setAddingEventAtBlock(isAdding?null:b.key);setNewEventText("");}}>+</button>
              </div>
              {(items.length>0||isAdding)&&<div className="day-block-items">
                {items.map(ev=><div key={ev.id} className={`day-block-item ${ev.fromTodo?"from-todo":""}`}>
                  <span className="day-block-item-text">{ev.text}</span>
                  <button className="day-block-item-del" onClick={()=>{haptic("light");removeTimelineEvent(ev.id);}}>×</button>
                </div>)}
              </div>}
              {isAdding&&<div className="day-block-add-row">
                <input autoFocus className="day-block-input" value={newEventText} onChange={e=>setNewEventText(e.target.value)} placeholder={`Add to ${b.label.toLowerCase()}...`} onKeyDown={e=>{if(e.key==="Enter"&&newEventText.trim()){haptic("medium");addTimelineEvent(b.key,newEventText.trim());setAddingEventAtBlock(null);setNewEventText("");}if(e.key==="Escape")setAddingEventAtBlock(null);}}/>
                <button className="day-block-input-submit" onClick={()=>{if(newEventText.trim()){haptic("medium");addTimelineEvent(b.key,newEventText.trim());setAddingEventAtBlock(null);setNewEventText("");}}} disabled={!newEventText.trim()}>Add</button>
                <button className="day-block-input-cancel" onClick={()=>setAddingEventAtBlock(null)}>✕</button>
              </div>}
            </div>;
          })}
        </div>
      </>}
    </>}

    {/* ── HABITS & GOALS ── */}
    {tab==="habits"&&<>
      <div className="date-header">
        <div className="date-label">build your life</div>
        <div className="date-main">Habits & Goals</div>
      </div>
      <GoalsSection />
    </>}

    {/* ── PATTERNS ── */}
    {tab==="patterns"&&entries.length<7&&<>
      <div className="date-header">
        <div className="date-label">unlocking soon</div>
        <div className="date-main">Patterns</div>
      </div>
      <div style={{textAlign:"center",padding:"48px 24px",background:"var(--surface)",borderRadius:14,border:"1px solid var(--border)"}}>
        <div style={{fontSize:36,marginBottom:14,opacity:0.4}}>✦</div>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:22,color:"var(--cream)",marginBottom:10}}>{7-entries.length} more {7-entries.length===1?"entry":"entries"}</div>
        <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.7,maxWidth:300,margin:"0 auto"}}>Patterns need a week of data to be meaningful. Keep journaling and this will unlock with your stress and joy categories, weekly digests, and trends.</p>
        <button onClick={()=>{haptic("light");setTab("journal");}} style={{marginTop:20,padding:"10px 20px",borderRadius:10,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer"}}>Log today's entry →</button>
      </div>
    </>}
    {tab==="patterns"&&entries.length>=7&&<>
      {!isPro&&<div style={{background:"var(--amber-dim)",border:"1px solid rgba(200,136,42,0.3)",borderRadius:14,padding:"20px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:16,color:"var(--cream)",marginBottom:6}}>Patterns & Insights</div>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:12}}>Upgrade to Pro to unlock full pattern analysis, stressor tracking, and weekly digests.</p>
        <button onClick={()=>{setShowUpgrade(true);loadIAPPackages();}} style={{padding:"10px 20px",borderRadius:10,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer"}}>Unlock with Pro ✦</button>
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
          {["week","month","year"].map(p=>{ const locked=(p==="month"||p==="year")&&entries.length<20; return <button key={p} onClick={()=>{ if(locked) return; setPatternPeriod(p);setPatternOffset(0);}} disabled={locked} title={locked?`Unlocks at 20 entries (${20-entries.length} more)`:""} style={{padding:"6px 14px",borderRadius:20,border:"1px solid var(--border)",background:patternPeriod===p?"var(--amber)":"transparent",color:patternPeriod===p?"#0e0c0a":locked?"var(--text-dim)":"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:locked?"not-allowed":"pointer",opacity:locked?0.5:1,transition:"all 0.15s"}}>{p.charAt(0).toUpperCase()+p.slice(1)}{locked&&" 🔒"}</button>; })}
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


  {showUpgrade&&(()=>{
    // find monthly and annual packages from RC, fall back to static labels
    const monthly=iapPackages.find(p=>p.packageType==="MONTHLY");
    const annual=iapPackages.find(p=>p.packageType==="ANNUAL");
    const monthlyPrice=monthly?.product?.priceString||"$4.99/month";
    const annualPrice=annual?.product?.priceString||"$34.99/year";
    return <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,backdropFilter:"blur(4px)"}} onClick={()=>setShowUpgrade(false)}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,padding:"32px 24px",width:"calc(100vw - 48px)",maxWidth:380,textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>✦</div>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:24,color:"var(--cream)",marginBottom:8}}>Throughline Pro</div>
        <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.65,marginBottom:24}}>Unlock 30 AI reflections per month, full pattern insights, weekly digests, and more.</p>
        <div style={{background:"var(--surface2)",borderRadius:14,padding:"16px",marginBottom:20}}>
          {[["✦","30 AI reflections/month"],["📈","Full patterns & insights"],["📓","Unlimited entries"],["🗓","Weekly & monthly digests"]].map(([icon,label])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontSize:13,color:"var(--text-muted)",textAlign:"left"}}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
        {iapLoading
          ? <div className="loading-dots" style={{justifyContent:"center",marginBottom:20}}><span/><span/><span/></div>
          : <>
            <button onClick={()=>annual?handlePurchase(annual):null} disabled={!!purchasing} style={{width:"100%",padding:"14px",borderRadius:12,background:"var(--amber)",border:"none",color:"#0e0c0a",fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:500,cursor:"pointer",marginBottom:10,opacity:purchasing?"0.6":"1"}}>
              {purchasing===annual?.identifier?"Purchasing...":`${annualPrice}/year — Best value`}
            </button>
            <button onClick={()=>monthly?handlePurchase(monthly):null} disabled={!!purchasing} style={{width:"100%",padding:"14px",borderRadius:12,background:"transparent",border:"1px solid var(--border)",color:"var(--text-muted)",fontFamily:"DM Sans,sans-serif",fontSize:14,cursor:"pointer",marginBottom:16,opacity:purchasing?"0.6":"1"}}>
              {purchasing===monthly?.identifier?"Purchasing...":`${monthlyPrice}/month`}
            </button>
          </>
        }
        <button onClick={handleRestorePurchases} disabled={restoring} style={{background:"none",border:"none",color:"var(--text-dim)",fontFamily:"DM Sans,sans-serif",fontSize:12,cursor:"pointer",display:"block",width:"100%",marginBottom:8}}>
          {restoring?"Restoring...":"Restore purchases"}
        </button>
        <button onClick={()=>setShowUpgrade(false)} style={{background:"none",border:"none",color:"var(--text-dim)",fontFamily:"DM Sans,sans-serif",fontSize:13,cursor:"pointer"}}>Maybe later</button>
      </div>
    </>;
  })()}
  {showRating&&<>
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,backdropFilter:"blur(4px)"}} onClick={dismissRating}/>
    <div className="rating-modal">
      <div className="rating-star">✦</div>
      <div className="rating-title">Loving Throughline?</div>
      <div className="rating-sub">A quick review helps others find a place to reflect. It means a lot.</div>
      <button className="rating-btn-primary" onClick={handleRate}>Leave a review ✦</button>
      <button className="rating-btn-ghost" onClick={dismissRating}>Maybe later</button>
    </div>
  </>}
  </div></>);
}