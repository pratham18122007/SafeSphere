import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Zap } from 'lucide-react';
import { apiFetch, setAuth } from '../utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.token, data.user);
      navigate(data.user.role === 'institution' ? '/institution/overview' : '/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true); setError('');
    try {
      const data = await apiFetch('/auth/demo', { method: 'POST' });
      setAuth(data.token, data.user);
      navigate('/home');
    } catch (err: any) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f9fc' }}>
      {/* Left hero (desktop) */}
      <div className="hero-gradient" style={{ display: 'none', flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 }} id="login-hero">
        <div style={{ maxWidth: 400, color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>🛡️</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            Navigate with<br />Confidence
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.6 }}>
            SafeSphere turns every journey into a guarded route — with live SafeScore™, AI rerouting, and your personal Journey Guardian.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Real-time SafeScore™ on every route segment', 'Journey Guardian monitors your trip live', 'One-tap SOS with trusted contact alerts', 'Institutional safety intelligence dashboard'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.65rem' }}>✓</span>
                </div>
                <span style={{ opacity: 0.9, fontSize: '0.9rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' }}>
              <Shield size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>SafeSphere</h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Safety-Aware Navigation</p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>Sign in to continue your safe journey</p>

          {/* Demo button */}
          <button onClick={handleDemo} disabled={loading} className="btn btn-full" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', marginBottom: 20, gap: 8 }}>
            <Zap size={16} />
            {loading ? 'Loading...' : 'Try Demo Account (Judge-Friendly)'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or sign in</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert-banner alert-danger" style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-ghost btn-full" style={{ marginTop: 4 }}>
              {loading ? <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)' }} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: 8, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Institution admin?{' '}
            <Link to="/institution/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dashboard login →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { #login-hero { display: flex !important; } }
      `}</style>
    </div>
  );
}
