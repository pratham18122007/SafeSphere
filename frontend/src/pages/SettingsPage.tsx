import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Smartphone, Globe, Moon, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="nav-padded" style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} aria-label="Go Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Settings</h1>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '24px 16px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: Bell, label: 'Notifications', desc: 'Push & SMS safety alerts' },
            { icon: Shield, label: 'Privacy & Safety', desc: 'Guardian location sharing' },
            { icon: Smartphone, label: 'App Settings', desc: 'Permissions & sensors' },
            { icon: Globe, label: 'Language', desc: 'English (US)' },
            { icon: Moon, label: 'Appearance', desc: 'Light Mode' },
          ].map((s, i) => (
            <div key={s.label} className="card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={18} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{s.label}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
