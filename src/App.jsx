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
  body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; min-height:100vh; overflow-x:hidden; display:flex; justify-content:center; }
  .grain { position:fixed; inset:0; pointer-events:none; z-index:100; opacity:0.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .glow { position:fixed; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(200,136,42,0.06) 0%,transparent 70%); pointer-events:none; top:-200px; left:50%; transform:translateX(-50%); }
  .app { max-width:720px; width:100%; padding:0 24px 80px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
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
  .mood-row { display:flex; align-items:center; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
  .mood-label { font-size:12px; color:var(--text-muted); margin-right:4px; }
  .mood-btn { width:42px; height:42px; border-radius:10px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; font-size:19px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
  .mood-btn:hover { transform:scale(1.15); border-color:var(--text-muted); }
  .mood-btn.selected { transform:scale(1.18); border-color:var(--amber); background:var(--amber-dim); }
  .mood-score-display { font-size:11px; color:var(--amber-soft); font-style:italic; margin-left:4px; }

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
  .week-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; margin-bottom:28px; }
  .day-cell { aspect-ratio:1; border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; cursor:pointer; transition:transform 0.15s; border:1px solid transparent; background:var(--surface); }
  .day-cell:hover { transform:scale(1.05); }
  .day-cell.active { border-color:var(--amber); }
  .dc-name { font-size:9px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase; color:var(--text-muted); }
  .dc-dot { width:9px; height:9px; border-radius:50%; background:var(--border); }
  .day-cell.has-entry .dc-dot { background:var(--amber-soft); }
  .dc-mood { font-size:13px; margin-top:1px; }
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

  /* ── TASKS ── */
  .tasks-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .tasks-filters { display:flex; gap:4px; }
  .filter-pill { padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer; border:1px solid var(--border); background:transparent; color:var(--text-muted); font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .filter-pill.active { background:var(--surface2); color:var(--text); border-color:var(--text-dim); }
  .add-task-row { display:flex; gap:8px; margin-bottom:20px; }
  .add-task-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:11px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color 0.2s; }
  .add-task-input::placeholder { color:var(--text-dim); }
  .add-task-input:focus { border-color:var(--amber); }
  .task-item { display:flex; align-items:flex-start; gap:10px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:13px 14px; margin-bottom:8px; transition:opacity 0.2s; animation:fadeUp 0.25s ease; }
  .task-item.done-item { opacity:0.45; }
  .task-content { flex:1; min-width:0; }
  .task-text { font-size:14px; line-height:1.5; }
  .task-text.done { text-decoration:line-through; color:var(--text-muted); }
  .task-meta { display:flex; align-items:center; gap:8px; margin-top:5px; }
  .task-source { font-size:11px; color:var(--text-dim); font-style:italic; }
  .task-delete { background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:16px; line-height:1; padding:0 2px; transition:color 0.15s; flex-shrink:0; }
  .task-delete:hover { color:var(--rose); }
  .tasks-count { font-size:12px; color:var(--text-dim); }
  .group-bar { display:flex; align-items:center; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
  .group-chip { display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; font-size:12px; border:1.5px solid var(--border); background:var(--surface); color:var(--text-muted); font-family:'DM Sans',sans-serif; }
  .chip-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .chip-count { font-size:10px; background:var(--surface2); border-radius:10px; padding:1px 6px; color:var(--text-dim); }
  .group-chip-del { background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:14px; line-height:1; padding:0; margin-left:2px; transition:color 0.15s; }
  .group-chip-del:hover { color:var(--rose); }
  .add-group-btn { padding:6px 12px; border-radius:20px; font-size:12px; cursor:pointer; border:1.5px dashed var(--border); background:transparent; color:var(--text-dim); font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .add-group-btn:hover { color:var(--text); border-color:var(--text-muted); }
  .new-group-row { display:flex; gap:8px; margin-bottom:16px; animation:fadeUp 0.2s ease; }
  .new-group-input { flex:1; background:var(--surface); border:1px solid var(--amber); border-radius:10px; padding:9px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; outline:none; }
  .new-group-input::placeholder { color:var(--text-dim); }
  .task-group-select { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:5px 8px; color:var(--text-muted); font-family:'DM Sans',sans-serif; font-size:11px; outline:none; cursor:pointer; }
  .group-section { margin-bottom:24px; }
  .group-header { display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer; user-select:none; }
  .group-header-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .group-header-name { font-size:11px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-muted); }
  .group-header-count { font-size:11px; color:var(--text-dim); }
  .group-header-chevron { font-size:10px; color:var(--text-dim); transition:transform 0.2s; }
  .group-header-chevron.open { transform:rotate(90deg); }
  .group-header-line { flex:1; height:1px; background:var(--border); }
  .group-tasks { display:flex; flex-direction:column; gap:8px; }

  /* ── HABITS ── */
  .habit-grid-wrap { overflow-x:auto; padding-bottom:4px; }
  .habit-row { display:grid; grid-template-columns:110px repeat(28,1fr); align-items:center; gap:3px; margin-bottom:5px; }
  .habit-name-cell { font-size:12px; color:var(--text-muted); padding-right:8px; text-align:right; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
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
`;

const MOODS = [
  {emoji:"😔",label:"rough", score:1,color:"#a04040"},
  {emoji:"😕",label:"meh",   score:2,color:"#a06830"},
  {emoji:"😐",label:"okay",  score:3,color:"#8a8050"},
  {emoji:"🙂",label:"good",  score:4,color:"#508a60"},
  {emoji:"😄",label:"great", score:5,color:"#3a8a6a"},
];
const HABIT_COLORS = ["#6a9e78","#7a9ec4","#c4a45a","#a47ac4","#c4705a","#5ab4c4"];
const GROUP_COLORS = ["#7a9ec4","#c4a45a","#a47ac4","#6a9e78","#c4705a","#5ab4c4","#c4905a","#9ec47a"];
const WEEK_DAYS = ["M","T","W","T","F","S","S"];
const OB_TIMES = [
  {emoji:"🌅",label:"Morning", sub:"Start the day with intention", value:"morning"},
  {emoji:"☀️",label:"Midday",  sub:"Check in at lunch",            value:"midday"},
  {emoji:"🌆",label:"Evening", sub:"Wind down and reflect",        value:"evening"},
  {emoji:"🌙",label:"Night",   sub:"Before sleep ritual",          value:"night"},
];

const DEFAULT_GROUPS  = [{id:"work",name:"Work",color:"#7a9ec4"},{id:"errands",name:"Errands",color:"#c4a45a"},{id:"social",name:"Friends & Social",color:"#a47ac4"},{id:"health",name:"Health",color:"#6a9e78"}];

function last28Days(){ return Array.from({length:28},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(27-i)); return d.toISOString().split("T")[0]; }); }
function lastNDays(n){ return Array.from({length:n},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(n-1-i)); return d.toISOString().split("T")[0]; }); }
function formatDate(d){ return new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}); }
function shortDate(d){ return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}); }

async function callClaude(prompt,maxTokens=1000){
  const res=await fetch("/api/reflect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  return (data.content?.find(b=>b.type==="text")?.text||"{}").replace(/```json|```/g,"").trim();
}
async function analyzeEntry(text){ return JSON.parse(await callClaude(`Analyze this journal entry and respond ONLY with valid JSON:\n{"todos":["action item"],"stressTags":["2-4 word label"],"joyTags":["2-4 word label"],"insight":"One warm sentence."}\nEntry: "${text}"`)); }
async function suggestGoals(entries){ return JSON.parse(await callClaude(`Suggest 3 personal growth goals based on these journal entries. Focus on happiness and wellbeing, NOT productivity.\n${entries.slice(0,5).map(e=>`${e.date}: ${e.text}`).join("\n")}\nRespond ONLY with valid JSON array:\n[{"title":"goal","why":"reason","icon":"emoji"}]`)); }
async function generateMonthlySummary(entries, userName){ return JSON.parse(await callClaude(`Write a warm monthly summary for ${userName||"this person"} based on their journal entries this month.\nEntries:\n${entries.slice(0,20).map(e=>`${e.date}: ${e.text}`).join("\n\n")}\nRespond ONLY with valid JSON:\n{"summary":"2-3 sentence warm paragraph summarizing their month, patterns, and growth"}`,600)); }
async function generateWeeklyDigest(entries,userName){ return JSON.parse(await callClaude(`Write a personal weekly reflection for ${userName||"this person"}.\nEntries:\n${entries.slice(0,7).map(e=>`${e.date} (mood ${e.mood||"?"}/5): ${e.text}`).join("\n\n")}\nRespond ONLY with valid JSON:\n{"headline":"evocative sentence","highlight":"best moment","pattern":"recurring observation","nudge":"one kind suggestion for next week"}`,800)); }

export default function App() {
  // Auth
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authTab, setAuthTab] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

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
  const [entries,setEntries]=useState([]);
  const [recording,setRecording]=useState(false);
  const [todayMood,setTodayMood]=useState(null);
  const [dbLoading,setDbLoading]=useState(true);
  const recognitionRef=useRef(null);
  const todayStr=new Date().toISOString().split("T")[0];

  // Tasks
  const [allTasks,setAllTasks]=useState([]);
  const [taskFilter,setTaskFilter]=useState("open");
  const [newTaskText,setNewTaskText]=useState("");
  const [newTaskGroup,setNewTaskGroup]=useState("");
  const [groups,setGroups]=useState(DEFAULT_GROUPS);
  const [addingGroup,setAddingGroup]=useState(false);
  const [newGroupName,setNewGroupName]=useState("");
  const [collapsedGroups,setCollapsedGroups]=useState({});
  const newGroupInputRef=useRef(null);

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

  // Digest
  const [digest,setDigest]=useState(null);
  const [generatingDigest,setGeneratingDigest]=useState(false);
  const [monthlySummary,setMonthlySummary]=useState(null);
  const [generatingMonthlySummary,setGeneratingMonthlySummary]=useState(false);

  useEffect(()=>{ if(addingGroup&&newGroupInputRef.current) newGroupInputRef.current.focus(); },[addingGroup]);

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
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
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

  // ── Load data when session exists ──
  useEffect(()=>{
    if(!session) return;
    async function loadAll(){
      setDbLoading(true);
      const uid = session.user.id;
      const [entriesRes,tasksRes,habitsRes,goalsRes]=await Promise.all([
        supabase.from("entries").select("*").eq("user_id",uid).order("date",{ascending:false}),
        supabase.from("tasks").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
        supabase.from("habits").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
        supabase.from("goals").select("*").eq("user_id",uid).order("created_at",{ascending:true}),
      ]);
      if(entriesRes.data?.length) setEntries(entriesRes.data.map(e=>({...e,todos:e.todos||[],stressTags:e.stress_tags||[],joyTags:e.joy_tags||[]})));
      if(tasksRes.data?.length) setAllTasks(tasksRes.data.map(t=>({...t,groupId:t.group_id,sourceDate:t.source_date,addedDate:t.added_date})));
      if(habitsRes.data?.length) setHabits(habitsRes.data.map(h=>({...h,checked:h.checked||{}})));
      if(goalsRes.data?.length) setGoals(goalsRes.data);
      setDbLoading(false);
    }
    loadAll();
  },[session]);

  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const monthYear=new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const moodForDay=(date)=>{ const e=entries.find(en=>en.date===date); return e?.mood||null; };
  const STRESS_PATTERNS = (() => { const counts = {}; entries.forEach(e => e.stressTags?.forEach(t => { counts[t] = (counts[t]||0)+1; })); const total = entries.length || 1; return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({ label, pct: Math.round((count/total)*100) })); })();
const JOY_PATTERNS = (() => { const counts = {}; entries.forEach(e => e.joyTags?.forEach(t => { counts[t] = (counts[t]||0)+1; })); const total = entries.length || 1; return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({ label, pct: Math.round((count/total)*100) })); })();

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
  const handleSignOut = async()=>{
    await supabase.auth.signOut();
    setSession(null); setEntries([]); setAllTasks([]); setHabits([]); setGoals([]);
    setObDone(false); setUserName(""); setPreferredTime("");
  };

  // ── Finish onboarding ──
  const finishOnboarding = async()=>{
    await supabase.auth.updateUser({data:{name:userName,preferred_time:preferredTime,ob_done:true}});
    setObDone(true);
  };

  // ── Task helpers ──
  const addManualTask=async()=>{
    if(!newTaskText.trim()||!session)return;
    const t={text:newTaskText.trim(),done:false,source:"manual",added_date:todayStr,group_id:newTaskGroup||null,user_id:session.user.id};
    const {data}=await supabase.from("tasks").insert(t).select().single();
    if(data) setAllTasks(p=>[...p,{...data,groupId:data.group_id,addedDate:data.added_date}]);
    setNewTaskText("");
  };
  const addGroup=()=>{ if(!newGroupName.trim())return; const id=newGroupName.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now(); setGroups(p=>[...p,{id,name:newGroupName.trim(),color:GROUP_COLORS[groups.length%GROUP_COLORS.length]}]); setNewGroupName(""); setAddingGroup(false); };
  const deleteGroup=(gid)=>{ setGroups(p=>p.filter(g=>g.id!==gid)); setAllTasks(p=>p.map(t=>t.groupId===gid?{...t,groupId:null}:t)); supabase.from("tasks").update({group_id:null}).eq("group_id",gid).eq("user_id",session.user.id); };
  const toggleTask=async(id)=>{ setAllTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t)); const task=allTasks.find(t=>t.id===id); await supabase.from("tasks").update({done:!task.done}).eq("id",id); };
  const deleteTask=async(id)=>{ setAllTasks(p=>p.filter(t=>t.id!==id)); await supabase.from("tasks").delete().eq("id",id); };
  const setTaskGroup=async(id,gid)=>{ setAllTasks(p=>p.map(t=>t.id===id?{...t,groupId:gid||null}:t)); await supabase.from("tasks").update({group_id:gid||null}).eq("id",id); };
  const toggleGroupCollapse=(gid)=>setCollapsedGroups(p=>({...p,[gid]:!p[gid]}));
  const filteredTasks=allTasks.filter(t=>taskFilter==="open"?!t.done:taskFilter==="done"?t.done:true);

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
  const handleSuggestGoals=async()=>{ setSuggestingGoals(true); try{ const s=await suggestGoals(entries); setSuggestedGoals(s.map(g=>({...g,id:"sg"+Date.now()+Math.random()}))); }catch(e){} setSuggestingGoals(false); };
  const handleGenerateMonthlySummary=async()=>{ setGeneratingMonthlySummary(true); try{ const d=await generateMonthlySummary(entries,userName); setMonthlySummary(d.summary); }catch(e){} setGeneratingMonthlySummary(false); };
  const handleGenerateDigest=async()=>{ setGeneratingDigest(true); try{ const d=await generateWeeklyDigest(entries,userName); setDigest(d); }catch(e){} setGeneratingDigest(false); };

  // ── Entry analysis ──
  const handleAnalyze=async()=>{
    if(!text.trim()||!session)return;
    setLoading(true); setResult(null);
    try{
      const parsed=await analyzeEntry(text);
      setResult(parsed); setTodos(parsed.todos||[]);
      const entry={date:todayStr,mood:todayMood,text,todos:parsed.todos||[],stress_tags:parsed.stressTags||[],joy_tags:parsed.joyTags||[],insight:parsed.insight||"",user_id:session.user.id};
      const {data}=await supabase.from("entries").insert(entry).select().single();
      if(data) setEntries(p=>[{...data,stressTags:data.stress_tags||[],joyTags:data.joy_tags||[]},...p]);
      if(parsed.todos?.length){
        const newTasks=parsed.todos.map(t=>({text:t,done:false,source:"entry",source_date:todayStr,added_date:todayStr,group_id:null,user_id:session.user.id}));
        const {data:td}=await supabase.from("tasks").insert(newTasks).select();
        if(td) setAllTasks(p=>[...p,...td.map(t=>({...t,groupId:t.group_id,sourceDate:t.source_date,addedDate:t.added_date}))]);
      }
    }catch(e){ setResult({error:true}); }
    setLoading(false);
  };

  // ── Voice ──
  const toggleVoice=()=>{
    if(!("webkitSpeechRecognition" in window)&&!("SpeechRecognition" in window)){ alert("Voice input not supported. Try Chrome."); return; }
    if(recording){ recognitionRef.current?.stop(); setRecording(false); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const r=new SR(); r.continuous=true; r.interimResults=true; r.lang="en-US";
r.onresult=(e)=>{ let f=""; for(let i=e.resultIndex;i<e.results.length;i++) if(e.results[i].isFinal) f+=e.results[i][0].transcript+" "; if(f) setText(p=>p+f); };    r.onend=()=>setRecording(false); r.start(); recognitionRef.current=r; setRecording(true);
  };

  const weekDates=lastNDays(7);

  // ── Loading screen ──
  if(authLoading) return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/><div className="auth-wrap"><div style={{color:"var(--text-muted)",fontStyle:"italic",fontSize:14}}>Loading...</div></div></>);

  // ════════════════════════════════════════════════════════════════════════════
  // AUTH SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if(!session){
    return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">day<span>log</span></div>
          <div className="auth-tagline">your private space to reflect and grow</div>
          <div className="auth-box">
            <div className="auth-tabs">
              <button className={`auth-tab ${authTab==="login"?"active":""}`} onClick={()=>{setAuthTab("login");setAuthError("");setAuthSuccess("");}}>Sign in</button>
              <button className={`auth-tab ${authTab==="signup"?"active":""}`} onClick={()=>{setAuthTab("signup");setAuthError("");setAuthSuccess("");}}>Create account</button>
            </div>
            {authTab==="signup"&&<div className="auth-field"><label className="auth-label">Your name</label><input className="auth-input" placeholder="First name" value={authName} onChange={e=>setAuthName(e.target.value)}/></div>}
            <div className="auth-field"><label className="auth-label">Email</label><input className="auth-input" type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(authTab==="login"?handleSignIn():handleSignUp())}/></div>
            <div className="auth-field"><label className="auth-label">Password</label><input className="auth-input" type="password" placeholder="••••••••" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(authTab==="login"?handleSignIn():handleSignUp())}/></div>
            <button className="auth-btn" onClick={authTab==="login"?handleSignIn:handleSignUp} disabled={authSubmitting||!authEmail||!authPassword}>
              {authSubmitting?"...":(authTab==="login"?"Sign in →":"Create account →")}
            </button>
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
        <div className="ob-logo">day<span>log</span></div>
        <div className="ob-dots">{[0,1,2,3].map(i=><div key={i} className={`ob-dot ${i===obStep?"active":""}`}/>)}</div>
        {obStep===0&&<>
          <div className="ob-heading">Your private space to unwind and understand yourself</div>
          <div className="ob-sub">Talk or write about your day. daylog listens, finds patterns, and gently helps you grow.</div>
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
  return(<><style>{STYLES}</style><div className="grain"/><div className="glow"/>
  <div className="app">
    <nav className="nav">
      <div className="nav-logo">day<span>log</span></div>
      <div className="nav-right">
        {userName&&<div className="nav-greeting">Hey, {userName.split(" ")[0]}</div>}
        <div className="nav-tabs">
          {["today","tasks","patterns","history"].map(t=>(
            <button key={t} className={`nav-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
              {t==="tasks"?`Tasks${allTasks.filter(x=>!x.done).length?` (${allTasks.filter(x=>!x.done).length})`:""}`
                :t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>

    {tab==="today"&&<>
      <div className="date-header">
        <div className="date-label">{preferredTime?`${preferredTime} reflection`:"end of day reflection"}</div>
        <div className="date-main">{today}</div>
      </div>
      <div className="mood-row">
        <span className="mood-label">How are you feeling?</span>
        {MOODS.map(m=><button key={m.score} className={`mood-btn ${todayMood===m.score?"selected":""}`} onClick={()=>setTodayMood(s=>s===m.score?null:m.score)} title={m.label}>{m.emoji}</button>)}
        {todayMood&&<span className="mood-score-display">"{MOODS[todayMood-1].label}"</span>}
      </div>
      <div className="entry-card">
        <div className="entry-prompt">{preferredTime==="morning"?"What are you carrying into today?":"How was your day? Speak or write freely — no structure needed."}</div>
        <textarea className="entry-textarea" placeholder="Today I... the meeting went... I felt... I need to remember..." value={text} onChange={e=>setText(e.target.value)} rows={6}/>
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
        {todos.length>0&&<div className="analysis-section"><div className="section-label">Tomorrow's to-dos</div><div className="todo-list">{todos.map((t,i)=><div key={i} className="todo-item"><div className={`todo-check ${checkedTodos[i]?"done":""}`} onClick={()=>setCheckedTodos(p=>({...p,[i]:!p[i]}))}/><span className={`todo-text ${checkedTodos[i]?"done":""}`}>{t}</span></div>)}</div></div>}
        {(result.stressTags?.length>0||result.joyTags?.length>0)&&<div className="analysis-section"><div className="section-label">Today's signals</div><div className="tags-row">{result.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}{result.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}</div></div>}
        {result.insight&&<div className="analysis-section"><div className="section-label">Observation</div><div className="insight-box">"{result.insight}"</div></div>}
      </>}
      {result?.error&&<div className="entry-card"><div className="entry-prompt">Couldn't parse that — try again or check your connection.</div></div>}
    </>}

    {tab==="tasks"&&<>
      <div className="date-header"><div className="date-label">running list</div><div className="date-main">Tasks</div></div>
      <div className="add-task-row">
        <input className="add-task-input" placeholder="Add a task..." value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addManualTask()}/>
        <select className="task-group-select" value={newTaskGroup} onChange={e=>setNewTaskGroup(e.target.value)} style={{padding:"10px"}}><option value="">No group</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select>
        <button className="btn btn-primary" onClick={addManualTask} disabled={!newTaskText.trim()}>Add</button>
      </div>
      <div className="group-bar">
        <span style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.5px",marginRight:4}}>GROUPS</span>
        {groups.map(g=>{ const cnt=allTasks.filter(t=>t.groupId===g.id&&!t.done).length; return <div key={g.id} className="group-chip" style={{borderColor:g.color+"55"}}><span className="chip-dot" style={{background:g.color}}/><span style={{color:"var(--text)"}}>{g.name}</span>{cnt>0&&<span className="chip-count">{cnt}</span>}<button className="group-chip-del" onClick={()=>deleteGroup(g.id)}>×</button></div>; })}
        {!addingGroup&&<button className="add-group-btn" onClick={()=>setAddingGroup(true)}>+ New group</button>}
      </div>
      {addingGroup&&<div className="new-group-row"><input ref={newGroupInputRef} className="new-group-input" placeholder="Group name" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addGroup();if(e.key==="Escape"){setAddingGroup(false);setNewGroupName("");}}}/><button className="btn btn-primary" onClick={addGroup} disabled={!newGroupName.trim()}>Create</button><button className="btn btn-ghost" onClick={()=>{setAddingGroup(false);setNewGroupName("");}}>Cancel</button></div>}
      <div className="tasks-header">
        <div className="tasks-filters">{["open","all","done"].map(f=><button key={f} className={`filter-pill ${taskFilter===f?"active":""}`} onClick={()=>setTaskFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}{f==="open"&&allTasks.filter(t=>!t.done).length>0&&` · ${allTasks.filter(t=>!t.done).length}`}{f==="done"&&allTasks.filter(t=>t.done).length>0&&` · ${allTasks.filter(t=>t.done).length}`}</button>)}</div>
        <span className="tasks-count">{filteredTasks.length} item{filteredTasks.length!==1?"s":""}</span>
      </div>
      {filteredTasks.length===0&&<div className="empty-state">{taskFilter==="open"?"All clear — nothing left to do.":"Nothing here yet."}</div>}
      {(()=>{
        const TI=({task})=><div className={`task-item ${task.done?"done-item":""}`}><div className={`todo-check ${task.done?"done":""}`} onClick={()=>toggleTask(task.id)}/><div className="task-content"><div className={`task-text ${task.done?"done":""}`}>{task.text}</div><div className="task-meta"><span className="task-source">{task.source==="entry"?`From ${task.sourceDate} entry`:"Added manually"}</span></div></div><select className="task-group-select" value={task.groupId||""} onChange={e=>setTaskGroup(task.id,e.target.value)} style={{marginRight:4}}><option value="">Ungrouped</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><button className="task-delete" onClick={()=>deleteTask(task.id)}>×</button></div>;
        const sections=[...groups.map(g=>({id:g.id,name:g.name,color:g.color,tasks:filteredTasks.filter(t=>t.groupId===g.id)})),{id:"__ug__",name:"Ungrouped",color:"var(--text-dim)",tasks:filteredTasks.filter(t=>!t.groupId)}].filter(s=>s.tasks.length>0);
        return sections.map(s=>{ const col=collapsedGroups[s.id]; return <div key={s.id} className="group-section"><div className="group-header" onClick={()=>toggleGroupCollapse(s.id)}><span className="group-header-dot" style={{background:s.color}}/><span className="group-header-name">{s.name}</span><span className="group-header-count">{s.tasks.length}</span><span className={`group-header-chevron ${col?"":"open"}`}>▶</span><span className="group-header-line"/></div>{!col&&<div className="group-tasks">{s.tasks.map(t=><TI key={t.id} task={t}/>)}</div>}</div>; });
      })()}
    </>}

    {tab==="patterns"&&<>
      <div className="date-header"><div className="date-label">your patterns</div><div className="date-main">{monthYear}</div></div>
      <div className="section-label" style={{marginBottom:14}}>This week</div>
      <div className="week-grid" style={{marginBottom:28}}>
        {weekDates.map((d,i)=>{ const hasEntry=entries.some(e=>e.date===d); const mobj=moodForDay(d)?MOODS[moodForDay(d)-1]:null; return <div key={d} className={`day-cell ${hasEntry?"has-entry":""} ${d===todayStr?"active":""}`}><div className="dc-name">{WEEK_DAYS[i]}</div><div className="dc-dot" style={mobj?{background:mobj.color}:{}}/>{mobj&&<div className="dc-mood">{mobj.emoji}</div>}</div>; })}
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
      <div className="pattern-card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><h3>Habit tracker</h3><button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}} onClick={()=>setAddingHabit(v=>!v)}>{addingHabit?"Cancel":"+ Add habit"}</button></div>
        <p style={{marginBottom:16}}>28-day view — tap any square to log it.</p>
        <div className="habit-grid-wrap">
          <div className="habit-day-labels"><div/>{last28Days().map((d,i)=><div key={d} className="habit-day-label">{i===0||new Date(d+"T12:00:00").getDate()===1?new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}).replace(" ",""):new Date(d+"T12:00:00").getDate()%7===1?new Date(d+"T12:00:00").getDate():""}</div>)}</div>
          {habits.map(h=>{ const streak=habitStreak(h); return <div key={h.id} className="habit-row-wrap"><div style={{flex:1}}><div className="habit-row"><div className="habit-name-cell" title={h.name}>{h.name}</div>{last28Days().map(d=><div key={d} className={`habit-dot ${h.checked[d]?"checked":""}`} style={h.checked[d]?{background:h.color}:{}} onClick={()=>toggleHabit(h.id,d)} title={d}/>)}</div>{streak>1&&<div style={{paddingLeft:118,marginTop:-2,marginBottom:4}}><span className="habit-streak-label">🔥 {streak}-day streak</span></div>}</div><button className="habit-del" onClick={()=>deleteHabit(h.id)}>×</button></div>; })}
          {habits.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No habits yet — add one below.</div>}
        </div>
        {addingHabit&&<><div className="add-habit-row"><input autoFocus className="add-habit-input" placeholder="Habit name (e.g. Morning walk, Read 20 min)" value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addHabit();if(e.key==="Escape")setAddingHabit(false);}}/><button className="btn btn-primary" onClick={addHabit} disabled={!newHabitName.trim()}>Add</button></div><div className="habit-color-pick"><span style={{fontSize:11,color:"var(--text-dim)"}}>Colour:</span>{HABIT_COLORS.map(c=><div key={c} className={`habit-color-swatch ${newHabitColor===c?"selected":""}`} style={{background:c}} onClick={()=>setNewHabitColor(c)}/>)}</div></>}
      </div>
      <div className="pattern-card"><h3>Consistent stressors</h3><p style={{marginBottom:16}}>What comes up most when you're feeling friction.</p><div className="bar-chart">{STRESS_PATTERNS.map(p=><div key={p.label} className="bar-row"><div className="bar-label">{p.label}</div><div className="bar-track"><div className="bar-fill stress" style={{width:`${p.pct}%`}}/></div><div className="bar-pct">{p.pct}%</div></div>)}</div></div>
      <div className="pattern-card"><h3>What lights you up</h3><p style={{marginBottom:16}}>Things consistently tied to your better days.</p><div className="bar-chart">{JOY_PATTERNS.map(p=><div key={p.label} className="bar-row"><div className="bar-label">{p.label}</div><div className="bar-track"><div className="bar-fill joy" style={{width:`${p.pct}%`}}/></div><div className="bar-pct">{p.pct}%</div></div>)}</div></div>
      <div className="pattern-card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><h3>Goals</h3><button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}} onClick={()=>setAddingGoal(v=>!v)}>{addingGoal?"Cancel":"+ Add goal"}</button></div>
        <p style={{marginBottom:16}}>Directions, not tasks.</p>
        {addingGoal&&<div className="add-goal-row"><input autoFocus className="add-goal-input" placeholder="What do you want to work towards?" value={newGoalText} onChange={e=>setNewGoalText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addManualGoal();if(e.key==="Escape")setAddingGoal(false);}}/><button className="btn btn-primary" onClick={addManualGoal} disabled={!newGoalText.trim()}>Add</button></div>}
        {goals.map(g=><div key={g.id} className="goal-card"><div className="goal-header"><span className="goal-icon">{g.icon}</span><div className="goal-body"><div className="goal-title">{g.title}</div>{g.why&&<div className="goal-why">{g.why}</div>}</div></div><div className="goal-footer"><span className="goal-badge mine-badge">Your goal</span><div className="goal-actions"><button className="goal-btn delete" onClick={()=>deleteGoal(g.id)}>Remove</button></div></div></div>)}
        {goals.length===0&&suggestedGoals.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No goals yet. Add one or let the app suggest some.</div>}
        {suggestedGoals.map(sg=><div key={sg.id} className="goal-card suggested"><div className="goal-header"><span className="goal-icon">{sg.icon}</span><div className="goal-body"><div className="goal-title">{sg.title}</div>{sg.why&&<div className="goal-why">{sg.why}</div>}</div></div><div className="goal-footer"><span className="goal-badge suggested-badge">✦ Suggested for you</span><div className="goal-actions"><button className="goal-btn" onClick={()=>dismissSuggested(sg)}>Dismiss</button><button className="goal-btn accept" onClick={()=>acceptSuggested(sg)}>Add this →</button></div></div></div>)}
        <button className="goals-suggest-btn" onClick={handleSuggestGoals} disabled={suggestingGoals||entries.length===0}>{suggestingGoals?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Reading your entries...</>:<><span>✦</span> Suggest goals based on my entries</>}</button>
      </div>
      <div className="summary-card"><div className="summary-month">Monthly summary · {monthYear}</div>{monthlySummary?<div className="summary-text">{monthlySummary}</div>:<><div className="summary-text" style={{marginBottom:12}}>Generate a personal summary of your month based on your real entries.</div><button className="digest-gen-btn" onClick={handleGenerateMonthlySummary} disabled={generatingMonthlySummary||entries.length===0}>{generatingMonthlySummary?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Writing your summary...</>:<><span>✦</span> Generate monthly summary</>}</button></>}</div>
    </>}

    {tab==="history"&&<>
      <div className="date-header"><div className="date-label">past entries</div><div className="date-main">Your journal</div></div>
      {dbLoading&&<div className="empty-state">Loading your entries...</div>}
      {!dbLoading&&entries.length===0&&<div className="empty-state">No entries yet — write your first one in Today.</div>}
      {entries.map(entry=>{ const mobj=entry.mood?MOODS[entry.mood-1]:null; return <div key={entry.id} className="pattern-card" style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:12,color:"var(--amber-soft)",fontFamily:"Playfair Display,serif",fontStyle:"italic"}}>{formatDate(entry.date)}</div>
          {mobj&&<div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--text-muted)"}}><span>{mobj.emoji}</span><span style={{fontStyle:"italic"}}>{mobj.label}</span></div>}
        </div>
        <p style={{marginBottom:12,fontSize:14,lineHeight:1.65}}>{entry.text.slice(0,180)}{entry.text.length>180?"...":""}</p>
        {(entry.stressTags?.length>0||entry.joyTags?.length>0)&&<div className="tags-row" style={{marginBottom:8}}>{entry.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}{entry.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}</div>}
        {entry.todos?.length>0&&<div style={{fontSize:12,color:"var(--text-muted)"}}>{entry.todos.length} action item{entry.todos.length>1?"s":""}</div>}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}><button onClick={async()=>{ if(window.confirm("Delete this entry?")){ await supabase.from("entries").delete().eq("id",entry.id); setEntries(p=>p.filter(e=>e.id!==entry.id)); }}} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 10px",fontSize:11,color:"var(--text-dim)",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Delete</button></div>
      </div>; })}
    </>}

  </div></>);
}
