import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Smartphone, Globe, Moon } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="var(--text-primary)" />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Settings</h1>
      </div>

      <div style={{ padding: '24px 16px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: Bell, label: 'Notifications', desc: 'Push & SMS alerts' },
            { icon: Shield, label: 'Privacy & Safety', desc: 'Location sharing' },
            { icon: Smartphone, label: 'App Settings', desc: 'Permissions' },
            { icon: Globe, label: 'Language', desc: 'English (US)' },
            { icon: Moon, label: 'Appearance', desc: 'Light Mode' },
          ].map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <s.icon size={20} color="var(--text-secondary)" />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
