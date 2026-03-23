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
      <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
        <h2>Login to DocReader</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px' }}/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '8px' }}/>
          <button disabled={loading} onClick={handleLogin} style={{ padding: '10px', cursor: 'pointer' }}>Log In</button>
          <button disabled={loading} onClick={handleSignUp} style={{ padding: '10px', cursor: 'pointer' }}>Sign Up</button>
        </form>
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
