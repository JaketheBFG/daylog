import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Landing from './Landing.jsx'

function LegalPage({file, title}) {
  const [content, setContent] = React.useState("");
  React.useEffect(()=>{
    fetch(file).then(r=>r.text()).then(setContent);
  },[file]);
  return (
    <div style={{background:"#0e0c0a",minHeight:"100vh",color:"#e8e0d4",fontFamily:"DM Sans,sans-serif",padding:"60px 24px",maxWidth:720,margin:"0 auto"}}>
      <a href="/" style={{color:"#e8a84a",textDecoration:"none",fontSize:13,display:"block",marginBottom:32}}>← Back</a>
      <h1 style={{fontFamily:"Playfair Display,serif",fontSize:36,color:"#f0e8d8",marginBottom:32}}>{title}</h1>
      <pre style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.8,color:"#7a7068"}}>{content}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={window.Capacitor ? <App /> : <Landing />} />
        <Route path="/app" element={<App />} />
        <Route path="/privacy-policy" element={<LegalPage file="/privacy-policy.md" title="Privacy Policy"/>} />
        <Route path="/terms-of-service" element={<LegalPage file="/terms-of-service.md" title="Terms of Service"/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
