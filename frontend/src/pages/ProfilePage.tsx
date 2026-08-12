import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { getUser, clearAuth, apiFetch } from '../utils';
import BottomNav from '../components/BottomNav';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/user/contacts').then(setContacts).catch(() => {});
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="nav-padded" style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '32px 20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px var(--primary-glow)' }}>
            <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 700 }}>{user?.name?.[0] || 'U'}</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{user?.name || 'User'}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingLeft: 4 }}>Trusted Contacts</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {contacts.length > 0 ? contacts.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: i < contacts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>{c.contact}</p>
                  </div>
                </div>
                <div className={`badge ${c.enabled ? 'badge-safe' : 'badge-high'}`}>
                  {c.enabled ? 'Active' : 'Disabled'}
                </div>
              </div>
            )) : (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No contacts added yet.</div>
            )}
            <button style={{ width: '100%', padding: '16px', background: 'var(--bg-primary)', border: 'none', color: 'var(--primary)', fontWeight: 600, borderTop: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>
              + Add Trusted Contact
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingLeft: 4 }}>Recent Places</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="var(--text-secondary)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>GTBIT Campus</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>Saved Place</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="var(--text-secondary)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Hostel Area</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>Saved Place</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-ghost btn-full" style={{ color: 'var(--danger)', borderColor: '#fecaca', padding: '14px', marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
