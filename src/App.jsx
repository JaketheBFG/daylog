import { useState, useEffect, useRef } from "react";

// ─── STYLES ────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0e0c0a;
    --surface: #1a1714;
    --surface2: #221f1b;
    --border: #2e2a25;
    --text: #e8e0d4;
    --text-muted: #7a7068;
    --text-dim: #4a4540;
    --amber: #c8882a;
    --amber-soft: #e8a84a;
    --amber-dim: #3a2a10;
    --rose: #c4605a;
    --rose-dim: #3a1a18;
    --sage: #6a9e78;
    --sage-dim: #1a2e20;
    --sky: #6a9ec4;
    --sky-dim: #1a2a3a;
    --cream: #f0e8d8;
  }

body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; font-weight:300; min-height:100vh; overflow-x:hidden; display:flex; justify-content:center; }

  .grain { position:fixed; inset:0; pointer-events:none; z-index:100; opacity:0.03;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }

  .glow { position:fixed; width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle,rgba(200,136,42,0.06) 0%,transparent 70%);
    pointer-events:none; top:-200px; left:50%; transform:translateX(-50%); }

.app { max-width:720px; margin:0 auto; padding:0 24px 80px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes dotBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
  @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

  /* ── ONBOARDING ── */
  .ob-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
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

  /* ── DATE ── */
  .date-header { margin-bottom:28px; }
  .date-label { font-family:'Playfair Display',serif; font-size:13px; font-style:italic; color:var(--text-muted); letter-spacing:0.5px; }
  .date-main { font-family:'Playfair Display',serif; font-size:34px; color:var(--cream); line-height:1.1; margin-top:4px; }

  /* ── MOOD PICKER ── */
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

  /* ── MOOD CHART ── */
  .mood-chart-wrap { display:flex; flex-direction:column; gap:6px; }
  .mood-chart-row { display:flex; align-items:center; gap:10px; }
  .mood-chart-date { font-size:11px; color:var(--text-dim); width:52px; flex-shrink:0; }
  .mood-chart-bar { flex:1; height:30px; background:var(--surface2); border-radius:6px; overflow:hidden; display:flex; align-items:center; }
  .mood-chart-fill { height:100%; border-radius:6px; display:flex; align-items:center; padding-left:10px; gap:7px; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); min-width:60px; }
  .mood-chart-emoji { font-size:14px; }
  .mood-chart-val { font-size:11px; color:rgba(255,255,255,0.8); font-weight:500; }

  /* ── WEEKLY DIGEST ── */
  .digest-card { background:linear-gradient(135deg,var(--surface),var(--surface2)); border:1px solid rgba(106,158,196,0.2); border-radius:14px; padding:22px; margin-bottom:14px; animation:fadeUp 0.5s ease; }
  .digest-week { font-family:'Playfair Display',serif; font-style:italic; font-size:12px; color:var(--sky); margin-bottom:16px; letter-spacing:0.3px; }
  .digest-headline { font-family:'Playfair Display',serif; font-size:17px; font-style:italic; color:var(--cream); line-height:1.5; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border); }
  .digest-section { margin-bottom:14px; }
  .digest-section-label { font-size:10px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-dim); margin-bottom:5px; }
  .digest-body { font-size:14px; line-height:1.7; color:var(--text); }
  .digest-nudge { font-size:14px; line-height:1.7; color:var(--amber-soft); }
  .digest-gen-btn { display:flex; align-items:center; gap:8px; width:100%; background:var(--sky-dim); border:1px dashed rgba(106,158,196,0.3); border-radius:12px; padding:14px 18px; cursor:pointer; transition:all 0.2s; color:var(--sky); font-family:'DM Sans',sans-serif; font-size:13px; margin-bottom:14px; }
  .digest-gen-btn:hover { background:rgba(26,42,58,0.9); }
  .digest-gen-btn:disabled { opacity:0.5; cursor:not-allowed; }

  /* ── SUMMARY ── */
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

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MOODS = [
  { emoji:"😔", label:"rough",  score:1, color:"#a04040" },
  { emoji:"😕", label:"meh",    score:2, color:"#a06830" },
  { emoji:"😐", label:"okay",   score:3, color:"#8a8050" },
  { emoji:"🙂", label:"good",   score:4, color:"#508a60" },
  { emoji:"😄", label:"great",  score:5, color:"#3a8a6a" },
];
const HABIT_COLORS = ["#6a9e78","#7a9ec4","#c4a45a","#a47ac4","#c4705a","#5ab4c4"];
const GROUP_COLORS = ["#7a9ec4","#c4a45a","#a47ac4","#6a9e78","#c4705a","#5ab4c4","#c4905a","#9ec47a"];
const WEEK_DAYS = ["M","T","W","T","F","S","S"];
const OB_TIMES = [
  { emoji:"🌅", label:"Morning",  sub:"Start the day with intention",  value:"morning" },
  { emoji:"☀️", label:"Midday",   sub:"Check in at lunch",              value:"midday" },
  { emoji:"🌆", label:"Evening",  sub:"Wind down and reflect",          value:"evening" },
  { emoji:"🌙", label:"Night",    sub:"Before sleep ritual",            value:"night" },
];
const STRESS_PATTERNS = [
  {label:"Work meetings",pct:72},{label:"Commute",pct:58},{label:"Deadlines",pct:50},{label:"Social friction",pct:30}
];
const JOY_PATTERNS = [
  {label:"Exercise",pct:80},{label:"Deep work",pct:75},{label:"Social time",pct:68},{label:"Cooking/food",pct:55}
];

function last28Days(){
  return Array.from({length:28},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(27-i)); return d.toISOString().split("T")[0]; });
}
function lastNDays(n){
  return Array.from({length:n},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(n-1-i)); return d.toISOString().split("T")[0]; });
}
function formatDate(d){ return new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}); }
function shortDate(d){ return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}); }

// ─── DEMO DATA ─────────────────────────────────────────────────────────────────
const DEMO_ENTRIES = [
  {id:1,date:"2026-02-18",mood:2,text:"Really rough meeting with the product team today. They kept talking over me and I left feeling invisible. Had a great lunch with Maya though, we haven't caught up in weeks and it was really restorative. Gym afterwards which helped.",todos:["Follow up with product team","Schedule 1:1 with manager"],stressTags:["work meeting","feeling unheard"],joyTags:["lunch with Maya","gym"],insight:"Social recharging seems to offset workplace tension for you."},
  {id:2,date:"2026-02-19",mood:3,text:"Commute was a nightmare, 40 minutes late because of signal failures. Project deadline stress is building. Had a really good focused work session in the afternoon which felt satisfying. Cooked dinner instead of ordering out.",todos:["Finish project draft by Thursday","Check train schedule alternatives"],stressTags:["commute","deadline pressure"],joyTags:["focused work session","cooking"],insight:"Flow states at work are a consistent bright spot — protect that time."},
  {id:3,date:"2026-02-20",mood:4,text:"Good day overall. Got the project draft done early. Had a walk at lunch which cleared my head. Bit tired in the evening but nothing major. Feeling optimistic about the weekend.",todos:["Review project draft before sending"],stressTags:[],joyTags:["early finish","lunchtime walk","optimism"],insight:"Days with outdoor movement during work hours seem to go better for you."},
  {id:4,date:"2026-02-21",mood:5,text:"Really lovely Saturday. Slept in properly for the first time in weeks. Long run in the morning, bumped into an old friend. Spent the afternoon reading. Felt genuinely rested for once.",todos:[],stressTags:[],joyTags:["sleeping in","running","reading","spontaneous connection"],insight:"Rest days that include movement seem to be where you feel most yourself."},
  {id:5,date:"2026-02-22",mood:3,text:"Sunday blues crept in a bit. Did some life admin which felt productive but draining. Called mum in the evening which was nice. A bit anxious about the week ahead.",todos:["Prep for Monday standup"],stressTags:["sunday anxiety","life admin"],joyTags:["call with mum"],insight:"The dread before the week sometimes overshadows an otherwise okay day for you."},
];
const DEMO_TASKS = [
  {id:101,text:"Follow up with product team on decisions made",done:false,source:"entry",sourceDate:"2026-02-18",addedDate:"2026-02-18",groupId:"work"},
  {id:102,text:"Schedule 1:1 with manager about communication issues",done:false,source:"entry",sourceDate:"2026-02-18",addedDate:"2026-02-18",groupId:"work"},
  {id:103,text:"Check train schedule alternatives",done:true,source:"entry",sourceDate:"2026-02-19",addedDate:"2026-02-19",groupId:"errands"},
  {id:104,text:"Finish project draft by Thursday",done:true,source:"entry",sourceDate:"2026-02-19",addedDate:"2026-02-19",groupId:"work"},
  {id:105,text:"Review project draft before sending",done:false,source:"entry",sourceDate:"2026-02-20",addedDate:"2026-02-20",groupId:"work"},
  {id:106,text:"Book dentist appointment",done:false,source:"manual",addedDate:"2026-02-21",groupId:"health"},
  {id:107,text:"Reply to Maya about dinner plans",done:false,source:"manual",addedDate:"2026-02-21",groupId:"social"},
];
const DEFAULT_GROUPS = [
  {id:"work",name:"Work",color:"#7a9ec4"},
  {id:"errands",name:"Errands",color:"#c4a45a"},
  {id:"social",name:"Friends & Social",color:"#a47ac4"},
  {id:"health",name:"Health",color:"#6a9e78"},
];
const DEMO_HABITS = [
  {id:"h1",name:"Exercise",color:"#6a9e78",checked:Object.fromEntries(last28Days().map((d,i)=>[d,[0,1,2,5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,26,27].includes(i)]))},
  {id:"h2",name:"8h sleep",color:"#7a9ec4",checked:Object.fromEntries(last28Days().map((d,i)=>[d,[1,2,3,5,6,9,10,11,13,16,17,18,20,23,24,25,27].includes(i)]))},
  {id:"h3",name:"No phone before bed",color:"#a47ac4",checked:Object.fromEntries(last28Days().map((d,i)=>[d,[2,5,6,9,13,16,20,23,27].includes(i)]))},
  {id:"h4",name:"Time outside",color:"#c4a45a",checked:Object.fromEntries(last28Days().map((d,i)=>[d,[0,2,5,6,7,9,12,14,16,19,21,23,26].includes(i)]))},
];
const DEMO_GOALS = [
  {id:"g1",title:"Protect one hour a week that's entirely yours — no obligations, no screens",why:"You've mentioned feeling overscheduled and like you're always responding to others. This is about building in space to just exist.",icon:"🌿",source:"mine"},
  {id:"g2",title:"Reach out to one friend per week, even just a short message",why:"Social connection comes up constantly as a source of energy for you. This keeps that thread alive without it feeling like a chore.",icon:"💬",source:"mine"},
];

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(prompt, maxTokens=1000){
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})
  });
  const data = await res.json();
  const raw = data.content?.find(b=>b.type==="text")?.text||"{}";
  return raw.replace(/```json|```/g,"").trim();
}

async function analyzeEntry(text){
  const raw = await callClaude(`You are a compassionate personal journal assistant. Analyze this entry and extract insights.
Entry: "${text}"
Respond ONLY with valid JSON:
{"todos":["action item"],"stressTags":["2-4 word label"],"joyTags":["2-4 word label"],"insight":"One warm sentence referencing something specific."}`);
  return JSON.parse(raw);
}

async function suggestGoals(entries){
  const summary = entries.slice(0,5).map(e=>`${e.date}: ${e.text} | Joy:${e.joyTags?.join(",")} | Stress:${e.stressTags?.join(",")}`).join("\n");
  const raw = await callClaude(`You are a warm life coach. Based on these journal entries, suggest 3 personal growth goals that will help this person be happier and more at peace — NOT more productive.
${summary}
Respond ONLY with valid JSON array:
[{"title":"goal in plain language","why":"1-2 sentences grounded in their entries","icon":"one emoji"}]`);
  return JSON.parse(raw);
}

async function generateWeeklyDigest(entries, userName){
  const week = entries.slice(0,7);
  if(!week.length) return null;
  const summary = week.map(e=>`${e.date} (mood ${e.mood||"?"}/5): ${e.text}`).join("\n\n");
  const raw = await callClaude(`Write a gentle, personal weekly reflection for ${userName||"this person"}.
Entries: ${summary}
Respond ONLY with valid JSON:
{"headline":"One evocative sentence capturing the emotional arc (not generic)","highlight":"The best specific moment from their week","pattern":"One honest observation about a recurring pattern","nudge":"One small human suggestion for next week — not productivity, something that nourishes them"}`, 800);
  return JSON.parse(raw);
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function App() {
  // Onboarding
  const [obDone, setObDone] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // Core
  const [tab, setTab] = useState("today");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [todos, setTodos] = useState([]);
  const [checkedTodos, setCheckedTodos] = useState({});
  const [entries, setEntries] = useState(DEMO_ENTRIES);
  const [recording, setRecording] = useState(false);
  const [todayMood, setTodayMood] = useState(null);
  const recognitionRef = useRef(null);
  const todayStr = new Date().toISOString().split("T")[0];

  // Tasks & groups
  const [allTasks, setAllTasks] = useState(DEMO_TASKS);
  const [taskFilter, setTaskFilter] = useState("open");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskGroup, setNewTaskGroup] = useState("");
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const newGroupInputRef = useRef(null);

  // Habits
  const [habits, setHabits] = useState(DEMO_HABITS);
  const [addingHabit, setAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitColor, setNewHabitColor] = useState(HABIT_COLORS[0]);

  // Goals
  const [goals, setGoals] = useState(DEMO_GOALS);
  const [suggestedGoals, setSuggestedGoals] = useState([]);
  const [suggestingGoals, setSuggestingGoals] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);

  // Digest
  const [digest, setDigest] = useState(null);
  const [generatingDigest, setGeneratingDigest] = useState(false);

  useEffect(()=>{ if(addingGroup&&newGroupInputRef.current) newGroupInputRef.current.focus(); },[addingGroup]);

  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const monthYear = new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const moodForDay = (date) => { const e=entries.find(en=>en.date===date); return e?.mood||null; };

  // ── Task helpers ──
  const addManualTask = ()=>{ if(!newTaskText.trim())return; setAllTasks(p=>[...p,{id:Date.now(),text:newTaskText.trim(),done:false,source:"manual",addedDate:todayStr,groupId:newTaskGroup||null}]); setNewTaskText(""); };
  const addGroup = ()=>{ if(!newGroupName.trim())return; const id=newGroupName.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now(); setGroups(p=>[...p,{id,name:newGroupName.trim(),color:GROUP_COLORS[groups.length%GROUP_COLORS.length]}]); setNewGroupName(""); setAddingGroup(false); };
  const deleteGroup = (gid)=>{ setGroups(p=>p.filter(g=>g.id!==gid)); setAllTasks(p=>p.map(t=>t.groupId===gid?{...t,groupId:null}:t)); };
  const toggleTask = (id)=>setAllTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const deleteTask = (id)=>setAllTasks(p=>p.filter(t=>t.id!==id));
  const setTaskGroup = (id,gid)=>setAllTasks(p=>p.map(t=>t.id===id?{...t,groupId:gid||null}:t));
  const toggleGroupCollapse = (gid)=>setCollapsedGroups(p=>({...p,[gid]:!p[gid]}));
  const filteredTasks = allTasks.filter(t=>taskFilter==="open"?!t.done:taskFilter==="done"?t.done:true);

  // ── Habit helpers ──
  const toggleHabit = (hid,date)=>setHabits(p=>p.map(h=>h.id===hid?{...h,checked:{...h.checked,[date]:!h.checked[date]}}:h));
  const addHabit = ()=>{ if(!newHabitName.trim())return; setHabits(p=>[...p,{id:"h"+Date.now(),name:newHabitName.trim(),color:newHabitColor,checked:Object.fromEntries(last28Days().map(d=>[d,false]))}]); setNewHabitName(""); setAddingHabit(false); };
  const deleteHabit = (hid)=>setHabits(p=>p.filter(h=>h.id!==hid));
  const habitStreak = (h)=>{ let s=0; for(const d of last28Days().reverse()){ if(h.checked[d])s++; else break; } return s; };

  // ── Goal helpers ──
  const acceptSuggested = (sg)=>{ setGoals(p=>[...p,{...sg,id:"g"+Date.now(),source:"mine"}]); setSuggestedGoals(p=>p.filter(g=>g!==sg)); };
  const dismissSuggested = (sg)=>setSuggestedGoals(p=>p.filter(g=>g!==sg));
  const deleteGoal = (gid)=>setGoals(p=>p.filter(g=>g.id!==gid));
  const addManualGoal = ()=>{ if(!newGoalText.trim())return; setGoals(p=>[...p,{id:"g"+Date.now(),title:newGoalText.trim(),why:"",icon:"✦",source:"mine"}]); setNewGoalText(""); setAddingGoal(false); };
  const handleSuggestGoals = async()=>{ setSuggestingGoals(true); try{ const s=await suggestGoals(entries); setSuggestedGoals(s.map(g=>({...g,id:"sg"+Date.now()+Math.random()}))); }catch(e){} setSuggestingGoals(false); };

  // ── Digest ──
  const handleGenerateDigest = async()=>{ setGeneratingDigest(true); try{ const d=await generateWeeklyDigest(entries,userName); setDigest(d); }catch(e){} setGeneratingDigest(false); };

  // ── Entry analysis ──
  const handleAnalyze = async()=>{
    if(!text.trim())return;
    setLoading(true); setResult(null);
    try{
      const parsed = await analyzeEntry(text);
      setResult(parsed); setTodos(parsed.todos||[]);
      if(parsed.todos?.length) setAllTasks(p=>[...p,...parsed.todos.map(t=>({id:Date.now()+Math.random(),text:t,done:false,source:"entry",sourceDate:todayStr,addedDate:todayStr}))]);
      setEntries(p=>[{id:Date.now(),date:todayStr,mood:todayMood,text,todos:parsed.todos||[],stressTags:parsed.stressTags||[],joyTags:parsed.joyTags||[],insight:parsed.insight||""},...p]);
    }catch(e){ setResult({error:true}); }
    setLoading(false);
  };

  // ── Voice ──
  const toggleVoice = ()=>{
    if(!("webkitSpeechRecognition" in window)&&!("SpeechRecognition" in window)){ alert("Voice input not supported. Try Chrome."); return; }
    if(recording){ recognitionRef.current?.stop(); setRecording(false); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const r=new SR(); r.continuous=true; r.interimResults=true; r.lang="en-US";
    r.onresult=(e)=>{ let f=""; for(let i=0;i<e.results.length;i++) if(e.results[i].isFinal) f+=e.results[i][0].transcript+" "; if(f) setText(p=>p+f); };
    r.onend=()=>setRecording(false); r.start(); recognitionRef.current=r; setRecording(true);
  };

  const weekDates = lastNDays(7);

  // ════════════════════════════════════════════════════════════════════════════
  // ONBOARDING
  // ════════════════════════════════════════════════════════════════════════════
  if(!obDone){
    return (
      <><style>{STYLES}</style><div className="grain"/><div className="glow"/>
      <div className="ob-wrap">
        <div className="ob-card">
          <div className="ob-logo">day<span>log</span></div>
          <div className="ob-dots">
            {[0,1,2,3].map(i=><div key={i} className={`ob-dot ${i===obStep?"active":""}`}/>)}
          </div>

          {obStep===0&&<>
            <div className="ob-heading">Your private space to unwind and understand yourself</div>
            <div className="ob-sub">Talk or write about your day. daylog listens, finds patterns, and gently helps you grow — without the pressure of optimization.</div>
            <div className="ob-features">
              <div className="ob-feature"><div className="ob-feature-icon">🎙</div><div className="ob-feature-text"><strong>Voice or text</strong>Just talk freely. No structure needed.</div></div>
              <div className="ob-feature"><div className="ob-feature-icon">✦</div><div className="ob-feature-text"><strong>Patterns over time</strong>See what drains you and what lights you up.</div></div>
              <div className="ob-feature"><div className="ob-feature-icon">🌿</div><div className="ob-feature-text"><strong>Goals that actually matter</strong>Not productivity — becoming more yourself.</div></div>
            </div>
            <button className="ob-btn" onClick={()=>setObStep(1)}>Get started →</button>
            <div className="ob-skip" onClick={()=>setObDone(true)}>Skip and explore the demo</div>
          </>}

          {obStep===1&&<>
            <div className="ob-heading">What should we call you?</div>
            <div className="ob-sub">Just your first name. It makes things feel a little more personal.</div>
            <input className="ob-input" placeholder="Your name" value={userName} onChange={e=>setUserName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setObStep(2)} autoFocus/>
            <button className="ob-btn" onClick={()=>setObStep(2)}>{userName.trim()?`Nice to meet you, ${userName.split(" ")[0]} →`:"Skip for now →"}</button>
          </>}

          {obStep===2&&<>
            <div className="ob-heading">When do you usually want to reflect?</div>
            <div className="ob-sub">We'll use this to set the right tone. You can change it anytime.</div>
            <div className="ob-time-grid">
              {OB_TIMES.map(t=>(
                <div key={t.value} className={`ob-time-opt ${preferredTime===t.value?"selected":""}`} onClick={()=>setPreferredTime(t.value)}>
                  <span className="ot-emoji">{t.emoji}</span>
                  <div className="ot-label">{t.label}</div>
                  <div className="ot-sub">{t.sub}</div>
                </div>
              ))}
            </div>
            <button className="ob-btn" onClick={()=>setObStep(3)}>Continue →</button>
          </>}

          {obStep===3&&<>
            <div style={{fontSize:52,marginBottom:16}}>🌿</div>
            <div className="ob-heading">{userName?`You're all set, ${userName.split(" ")[0]}`:"You're all set"}</div>
            <div className="ob-sub">Your journal is ready. Start by writing about today — or explore the demo to see what daylog can do.</div>
            <button className="ob-btn" onClick={()=>setObDone(true)}>Open my journal →</button>
          </>}
        </div>
      </div></>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN APP
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <><style>{STYLES}</style><div className="grain"/><div className="glow"/>
    <div className="app">

      {/* NAV */}
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
        </div>
      </nav>

      {/* ══ TODAY ══════════════════════════════════════════════════════════════ */}
      {tab==="today"&&<>
        <div className="date-header">
          <div className="date-label">{preferredTime?`${preferredTime} reflection`:"end of day reflection"}</div>
          <div className="date-main">{today}</div>
        </div>

        {/* Mood row */}
        <div className="mood-row">
          <span className="mood-label">How are you feeling?</span>
          {MOODS.map(m=>(
            <button key={m.score} className={`mood-btn ${todayMood===m.score?"selected":""}`} onClick={()=>setTodayMood(s=>s===m.score?null:m.score)} title={m.label}>{m.emoji}</button>
          ))}
          {todayMood&&<span className="mood-score-display">"{MOODS[todayMood-1].label}"</span>}
        </div>

        <div className="entry-card">
          <div className="entry-prompt">
            {preferredTime==="morning"?"What are you carrying into today?":"How was your day? Speak or write freely — no structure needed."}
          </div>
          <textarea className="entry-textarea" placeholder="Today I... the meeting went... I felt... I need to remember..." value={text} onChange={e=>setText(e.target.value)} rows={6}/>
          <div className="entry-footer">
            <span className="char-count">{text.length} characters</span>
            <div className="entry-actions">
              <button className={`btn btn-ghost ${recording?"recording":""}`} onClick={toggleVoice}>
                {recording&&<span className="rec-dot"/>}{recording?"Stop":"🎙 Speak"}
              </button>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={!text.trim()||loading}>
                {loading?"Reflecting...":"Reflect →"}
              </button>
            </div>
          </div>
        </div>

        {loading&&<div className="entry-card"><div className="entry-prompt">Reading your day...</div><div className="loading-dots"><span/><span/><span/></div></div>}

        {result&&!result.error&&<>
          {todos.length>0&&<div className="analysis-section">
            <div className="section-label">Tomorrow's to-dos</div>
            <div className="todo-list">
              {todos.map((t,i)=>(
                <div key={i} className="todo-item">
                  <div className={`todo-check ${checkedTodos[i]?"done":""}`} onClick={()=>setCheckedTodos(p=>({...p,[i]:!p[i]}))}/>
                  <span className={`todo-text ${checkedTodos[i]?"done":""}`}>{t}</span>
                </div>
              ))}
            </div>
          </div>}
          {(result.stressTags?.length>0||result.joyTags?.length>0)&&<div className="analysis-section">
            <div className="section-label">Today's signals</div>
            <div className="tags-row">
              {result.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}
              {result.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}
            </div>
          </div>}
          {result.insight&&<div className="analysis-section">
            <div className="section-label">Observation</div>
            <div className="insight-box">"{result.insight}"</div>
          </div>}
        </>}
        {result?.error&&<div className="entry-card"><div className="entry-prompt">Couldn't parse that — try again or check your connection.</div></div>}
      </>}

      {/* ══ TASKS ══════════════════════════════════════════════════════════════ */}
      {tab==="tasks"&&<>
        <div className="date-header"><div className="date-label">running list</div><div className="date-main">Tasks</div></div>
        <div className="add-task-row">
          <input className="add-task-input" placeholder="Add a task..." value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addManualTask()}/>
          <select className="task-group-select" value={newTaskGroup} onChange={e=>setNewTaskGroup(e.target.value)} style={{padding:"10px"}}>
            <option value="">No group</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={addManualTask} disabled={!newTaskText.trim()}>Add</button>
        </div>
        <div className="group-bar">
          <span style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.5px",marginRight:4}}>GROUPS</span>
          {groups.map(g=>{ const cnt=allTasks.filter(t=>t.groupId===g.id&&!t.done).length;
            return <div key={g.id} className="group-chip" style={{borderColor:g.color+"55"}}>
              <span className="chip-dot" style={{background:g.color}}/><span style={{color:"var(--text)"}}>{g.name}</span>
              {cnt>0&&<span className="chip-count">{cnt}</span>}
              <button className="group-chip-del" onClick={()=>deleteGroup(g.id)}>×</button>
            </div>;
          })}
          {!addingGroup&&<button className="add-group-btn" onClick={()=>setAddingGroup(true)}>+ New group</button>}
        </div>
        {addingGroup&&<div className="new-group-row">
          <input ref={newGroupInputRef} className="new-group-input" placeholder="Group name" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addGroup();if(e.key==="Escape"){setAddingGroup(false);setNewGroupName("");}}}/>
          <button className="btn btn-primary" onClick={addGroup} disabled={!newGroupName.trim()}>Create</button>
          <button className="btn btn-ghost" onClick={()=>{setAddingGroup(false);setNewGroupName("");}}>Cancel</button>
        </div>}
        <div className="tasks-header">
          <div className="tasks-filters">
            {["open","all","done"].map(f=>(
              <button key={f} className={`filter-pill ${taskFilter===f?"active":""}`} onClick={()=>setTaskFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
                {f==="open"&&allTasks.filter(t=>!t.done).length>0&&` · ${allTasks.filter(t=>!t.done).length}`}
                {f==="done"&&allTasks.filter(t=>t.done).length>0&&` · ${allTasks.filter(t=>t.done).length}`}
              </button>
            ))}
          </div>
          <span className="tasks-count">{filteredTasks.length} item{filteredTasks.length!==1?"s":""}</span>
        </div>
        {filteredTasks.length===0&&<div className="empty-state">{taskFilter==="open"?"All clear — nothing left to do.":"Nothing here yet."}</div>}
        {(()=>{
          const TI=({task})=>(
            <div className={`task-item ${task.done?"done-item":""}`}>
              <div className={`todo-check ${task.done?"done":""}`} onClick={()=>toggleTask(task.id)}/>
              <div className="task-content">
                <div className={`task-text ${task.done?"done":""}`}>{task.text}</div>
                <div className="task-meta"><span className="task-source">{task.source==="entry"?`From ${task.sourceDate} entry`:"Added manually"}</span></div>
              </div>
              <select className="task-group-select" value={task.groupId||""} onChange={e=>setTaskGroup(task.id,e.target.value)} style={{marginRight:4}}>
                <option value="">Ungrouped</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <button className="task-delete" onClick={()=>deleteTask(task.id)}>×</button>
            </div>
          );
          const sections=[
            ...groups.map(g=>({id:g.id,name:g.name,color:g.color,tasks:filteredTasks.filter(t=>t.groupId===g.id)})),
            {id:"__ug__",name:"Ungrouped",color:"var(--text-dim)",tasks:filteredTasks.filter(t=>!t.groupId)}
          ].filter(s=>s.tasks.length>0);
          return sections.map(s=>{ const col=collapsedGroups[s.id];
            return <div key={s.id} className="group-section">
              <div className="group-header" onClick={()=>toggleGroupCollapse(s.id)}>
                <span className="group-header-dot" style={{background:s.color}}/>
                <span className="group-header-name">{s.name}</span><span className="group-header-count">{s.tasks.length}</span>
                <span className={`group-header-chevron ${col?"":"open"}`}>▶</span><span className="group-header-line"/>
              </div>
              {!col&&<div className="group-tasks">{s.tasks.map(t=><TI key={t.id} task={t}/>)}</div>}
            </div>;
          });
        })()}
      </>}

      {/* ══ PATTERNS ═══════════════════════════════════════════════════════════ */}
      {tab==="patterns"&&<>
        <div className="date-header"><div className="date-label">your patterns</div><div className="date-main">{monthYear}</div></div>

        {/* Week overview */}
        <div className="section-label" style={{marginBottom:14}}>This week</div>
        <div className="week-grid" style={{marginBottom:28}}>
          {weekDates.map((d,i)=>{
            const hasEntry=entries.some(e=>e.date===d);
            const mobj=moodForDay(d)?MOODS[moodForDay(d)-1]:null;
            return <div key={d} className={`day-cell ${hasEntry?"has-entry":""} ${d===todayStr?"active":""}`}>
              <div className="dc-name">{WEEK_DAYS[i]}</div>
              <div className="dc-dot" style={mobj?{background:mobj.color}:{}}/>
              {mobj&&<div className="dc-mood">{mobj.emoji}</div>}
            </div>;
          })}
        </div>

        {/* Mood chart */}
        <div className="pattern-card">
          <h3>Mood this week</h3>
          <p style={{marginBottom:16}}>How you've been feeling day to day.</p>
          <div className="mood-chart-wrap">
            {weekDates.map(d=>{
              const mood=moodForDay(d); const mobj=mood?MOODS[mood-1]:null;
              return <div key={d} className="mood-chart-row">
                <div className="mood-chart-date">{shortDate(d)}</div>
                <div className="mood-chart-bar">
                  {mobj
                    ?<div className="mood-chart-fill" style={{width:`${mobj.score*20}%`,background:mobj.color}}>
                        <span className="mood-chart-emoji">{mobj.emoji}</span>
                        <span className="mood-chart-val">{mobj.label}</span>
                      </div>
                    :<span style={{fontSize:11,color:"var(--text-dim)",paddingLeft:10,fontStyle:"italic"}}>no entry</span>}
                </div>
              </div>;
            })}
          </div>
        </div>

        {/* Weekly digest */}
        <div className="pattern-card">
          <h3>Weekly digest</h3>
          <p style={{marginBottom:16}}>A personal reflection on your week, written from your entries.</p>
          <button className="digest-gen-btn" onClick={handleGenerateDigest} disabled={generatingDigest||entries.length===0}>
            {generatingDigest?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Writing your digest...</>:<><span>✦</span> Generate this week's digest</>}
          </button>
          {digest&&<div className="digest-card">
            <div className="digest-week">Week of {shortDate(weekDates[0])} — {shortDate(weekDates[6])}</div>
            {digest.headline&&<div className="digest-headline">"{digest.headline}"</div>}
            {digest.highlight&&<div className="digest-section"><div className="digest-section-label">Highlight</div><div className="digest-body">{digest.highlight}</div></div>}
            {digest.pattern&&<div className="digest-section"><div className="digest-section-label">Pattern noticed</div><div className="digest-body">{digest.pattern}</div></div>}
            {digest.nudge&&<div className="digest-section"><div className="digest-section-label">For next week</div><div className="digest-nudge">{digest.nudge}</div></div>}
          </div>}
        </div>

        {/* Habit tracker */}
        <div className="pattern-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <h3>Habit tracker</h3>
            <button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}} onClick={()=>setAddingHabit(v=>!v)}>{addingHabit?"Cancel":"+ Add habit"}</button>
          </div>
          <p style={{marginBottom:16}}>28-day view — tap any square to log it.</p>
          <div className="habit-grid-wrap">
            <div className="habit-day-labels">
              <div/>
              {last28Days().map((d,i)=>(
                <div key={d} className="habit-day-label">
                  {i===0||new Date(d+"T12:00:00").getDate()===1?new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}).replace(" ",""):new Date(d+"T12:00:00").getDate()%7===1?new Date(d+"T12:00:00").getDate():""}
                </div>
              ))}
            </div>
            {habits.map(h=>{ const streak=habitStreak(h); return <div key={h.id} className="habit-row-wrap">
              <div style={{flex:1}}>
                <div className="habit-row">
                  <div className="habit-name-cell" title={h.name}>{h.name}</div>
                  {last28Days().map(d=><div key={d} className={`habit-dot ${h.checked[d]?"checked":""}`} style={h.checked[d]?{background:h.color}:{}} onClick={()=>toggleHabit(h.id,d)} title={d}/>)}
                </div>
                {streak>1&&<div style={{paddingLeft:118,marginTop:-2,marginBottom:4}}><span className="habit-streak-label">🔥 {streak}-day streak</span></div>}
              </div>
              <button className="habit-del" onClick={()=>deleteHabit(h.id)}>×</button>
            </div>; })}
            {habits.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No habits yet.</div>}
          </div>
          {addingHabit&&<>
            <div className="add-habit-row">
              <input autoFocus className="add-habit-input" placeholder="Habit name (e.g. Morning walk, Read 20 min)" value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addHabit();if(e.key==="Escape")setAddingHabit(false);}}/>
              <button className="btn btn-primary" onClick={addHabit} disabled={!newHabitName.trim()}>Add</button>
            </div>
            <div className="habit-color-pick">
              <span style={{fontSize:11,color:"var(--text-dim)"}}>Colour:</span>
              {HABIT_COLORS.map(c=><div key={c} className={`habit-color-swatch ${newHabitColor===c?"selected":""}`} style={{background:c}} onClick={()=>setNewHabitColor(c)}/>)}
            </div>
          </>}
        </div>

        {/* Stress / Joy */}
        <div className="pattern-card">
          <h3>Consistent stressors</h3><p style={{marginBottom:16}}>What comes up most when you're feeling friction.</p>
          <div className="bar-chart">{STRESS_PATTERNS.map(p=><div key={p.label} className="bar-row"><div className="bar-label">{p.label}</div><div className="bar-track"><div className="bar-fill stress" style={{width:`${p.pct}%`}}/></div><div className="bar-pct">{p.pct}%</div></div>)}</div>
        </div>
        <div className="pattern-card">
          <h3>What lights you up</h3><p style={{marginBottom:16}}>Things consistently tied to your better days.</p>
          <div className="bar-chart">{JOY_PATTERNS.map(p=><div key={p.label} className="bar-row"><div className="bar-label">{p.label}</div><div className="bar-track"><div className="bar-fill joy" style={{width:`${p.pct}%`}}/></div><div className="bar-pct">{p.pct}%</div></div>)}</div>
        </div>

        {/* Goals */}
        <div className="pattern-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <h3>Goals</h3>
            <button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}} onClick={()=>setAddingGoal(v=>!v)}>{addingGoal?"Cancel":"+ Add goal"}</button>
          </div>
          <p style={{marginBottom:16}}>Directions, not tasks.</p>
          {addingGoal&&<div className="add-goal-row">
            <input autoFocus className="add-goal-input" placeholder="What do you want to work towards?" value={newGoalText} onChange={e=>setNewGoalText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addManualGoal();if(e.key==="Escape")setAddingGoal(false);}}/>
            <button className="btn btn-primary" onClick={addManualGoal} disabled={!newGoalText.trim()}>Add</button>
          </div>}
          {goals.map(g=><div key={g.id} className="goal-card">
            <div className="goal-header"><span className="goal-icon">{g.icon}</span><div className="goal-body"><div className="goal-title">{g.title}</div>{g.why&&<div className="goal-why">{g.why}</div>}</div></div>
            <div className="goal-footer"><span className="goal-badge mine-badge">Your goal</span><div className="goal-actions"><button className="goal-btn delete" onClick={()=>deleteGoal(g.id)}>Remove</button></div></div>
          </div>)}
          {goals.length===0&&suggestedGoals.length===0&&<div className="empty-state" style={{padding:"20px 0"}}>No goals yet. Add one or let the app suggest some.</div>}
          {suggestedGoals.map(sg=><div key={sg.id} className="goal-card suggested">
            <div className="goal-header"><span className="goal-icon">{sg.icon}</span><div className="goal-body"><div className="goal-title">{sg.title}</div>{sg.why&&<div className="goal-why">{sg.why}</div>}</div></div>
            <div className="goal-footer"><span className="goal-badge suggested-badge">✦ Suggested for you</span><div className="goal-actions">
              <button className="goal-btn" onClick={()=>dismissSuggested(sg)}>Dismiss</button>
              <button className="goal-btn accept" onClick={()=>acceptSuggested(sg)}>Add this →</button>
            </div></div>
          </div>)}
          <button className="goals-suggest-btn" onClick={handleSuggestGoals} disabled={suggestingGoals||entries.length===0}>
            {suggestingGoals?<><div className="loading-dots" style={{padding:0}}><span/><span/><span/></div> Reading your entries...</>:<><span>✦</span> Suggest goals based on my entries</>}
          </button>
        </div>

        {/* Monthly summary */}
        <div className="summary-card">
          <div className="summary-month">Monthly summary · February 2026</div>
          <div className="summary-text">Your commute is your most consistent stressor — it's come up in 8 of 18 entries this month. On the flip side, any day that includes exercise or a meaningful social interaction tends to score significantly better overall. You've been logging more consistently in the evenings, which suggests the habit is forming naturally.</div>
        </div>
      </>}

      {/* ══ HISTORY ════════════════════════════════════════════════════════════ */}
      {tab==="history"&&<>
        <div className="date-header"><div className="date-label">past entries</div><div className="date-main">Your journal</div></div>
        {entries.length===0&&<div className="empty-state">No entries yet — write your first one in Today.</div>}
        {entries.map(entry=>{
          const mobj=entry.mood?MOODS[entry.mood-1]:null;
          return <div key={entry.id} className="pattern-card" style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:12,color:"var(--amber-soft)",fontFamily:"Playfair Display,serif",fontStyle:"italic"}}>{formatDate(entry.date)}</div>
              {mobj&&<div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--text-muted)"}}><span>{mobj.emoji}</span><span style={{fontStyle:"italic"}}>{mobj.label}</span></div>}
            </div>
            <p style={{marginBottom:12,fontSize:14,lineHeight:1.65}}>{entry.text.slice(0,180)}{entry.text.length>180?"...":""}</p>
            {(entry.stressTags?.length>0||entry.joyTags?.length>0)&&<div className="tags-row" style={{marginBottom:8}}>
              {entry.stressTags?.map((t,i)=><span key={i} className="tag tag-stress">↑ {t}</span>)}
              {entry.joyTags?.map((t,i)=><span key={i} className="tag tag-joy">✦ {t}</span>)}
            </div>}
            {entry.todos?.length>0&&<div style={{fontSize:12,color:"var(--text-muted)"}}>{entry.todos.length} action item{entry.todos.length>1?"s":""}</div>}
          </div>;
        })}
      </>}

    </div></>
  );
}
