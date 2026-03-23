import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import MatrixRain from "./MatrixRain";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email to verify your account!");
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="App">
        <MatrixRain />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', gap: '20px', zIndex: 10 }}>
          <h2 style={{ color: 'var(--accent-green)', textShadow: 'var(--glow-green)' }}>LOGIN TO DOCREADER_</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', backgroundColor: 'var(--bg-surface)', padding: '30px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--glow-green)' }}>
            <input type="email" placeholder="ENTER EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit' }}/>
            <input type="password" placeholder="ENTER PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit' }}/>
            <button disabled={loading} onClick={handleLogin} style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--accent-green)', border: '1px solid var(--accent-green)', fontFamily: 'inherit', fontWeight: 'bold', textTransform: 'uppercase', transition: 'var(--transition-fast)' }} onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--accent-green)'; e.target.style.color = '#000'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--accent-green)'; }}>[ INITIATE LOGIN ]</button>
            <button disabled={loading} onClick={handleSignUp} style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--accent-green)', border: '1px solid var(--border-color)', fontFamily: 'inherit', fontWeight: 'bold', textTransform: 'uppercase', transition: 'var(--transition-fast)' }} onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--accent-green-dim)'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}>[ REGISTER ACCESS ]</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <MatrixRain />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage session={session} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
