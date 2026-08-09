import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, AlertTriangle, Shield, Navigation, Clock, Star } from 'lucide-react';
import { getUser, apiFetch, clearAuth, getRiskCategory } from '../utils';
import BottomNav from '../components/BottomNav';
import SafeScoreRing from '../components/SafeScoreRing';

const QUICK_DESTINATIONS = [
  { id: 'loc-1', address: 'Connaught Place, New Delhi', icon: '🏛️' },
  { id: 'loc-2', address: 'India Gate, New Delhi', icon: '🏛️' },
  { id: 'loc-9', address: 'Saket Select CityWalk', icon: '🛍️' },
  { id: 'loc-4', address: 'Gurugram Cyber City', icon: '💼' },
];

const CURRENT_SAFESCORE = 74;

export default function HomePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [safeZones, setSafeZones] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [showSos, setShowSos] = useState(false);

  useEffect(() => {
    setScore(0);
    const timer = setTimeout(() => setScore(CURRENT_SAFESCORE), 300);

    apiFetch('/safe-zones').then(setSafeZones).catch(() => {});
    apiFetch('/user/contacts').then(setContacts).catch(() => {});

    return () => clearTimeout(timer);
  }, []);

  const handleSOS = () => {
    setShowSos(true);
  };

  const riskCat = getRiskCategory(score);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 80, fontFamily: 'Inter, sans-serif' }}>
      {/* Header / Hero */}
      <div className="hero-gradient" style={{ padding: '48px 20px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
          <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <circle cx="350" cy="50" r="120" fill="white" />
            <circle cx="50" cy="200" r="80" fill="white" />
          </svg>
        </div>

        <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 4 }}>{greeting},</p>
              <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{firstName} 👋</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', padding: '6px 12px' }}>
              <MapPin size={12} color="white" />
              <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 600 }}>GTBIT, Rohini</span>
            </div>
          </div>

          {/* SafeScore prominent display */}
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '20px 24px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 4 }}>Current Area Safety</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ color: 'white', fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{score}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', alignSelf: 'flex-end', marginBottom: 6 }}>/100</span>
                </div>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginTop: 4 }}>
                  {riskCat.label}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginBottom: 8 }}>Area details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>🔆 Moderate lighting</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>👥 Active area</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>🚇 Near metro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>
        {/* Search bar */}
        <div style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '6px 6px 6px 18px', display: 'flex', alignItems: 'center', gap: 10, marginTop: -28, position: 'relative', zIndex: 10, border: '1px solid var(--border)', cursor: 'pointer' }}
          onClick={() => navigate('/search')}
        >
          <Search size={18} color="var(--text-muted)" />
          <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Where to? Search destination...</span>
          <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate('/search'); }}>
            <Navigation size={14} />
            Go
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
          <button onClick={() => navigate('/search')} className="card card-hover" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', border: '1px solid #c4b5fd', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Navigation size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)' }}>Start Journey</p>
              <p style={{ color: '#7c3aed', fontSize: '0.72rem', marginTop: 2 }}>SafeScore routing</p>
            </div>
          </button>

          <button onClick={handleSOS} className="card card-hover" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 12, background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, background: '#dc2626', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#dc2626' }}>SOS</p>
              <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: 2 }}>Emergency alert</p>
            </div>
          </button>
        </div>

        {/* Trusted contacts status */}
        {contacts.length > 0 && (
          <div className="card" style={{ marginTop: 20, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Shield size={16} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Trusted Contacts</span>
              <span className="badge badge-safe" style={{ marginLeft: 'auto' }}>Active</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {contacts.filter(c => c.enabled).slice(0, 3).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 700 }}>{c.name[0]}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent destinations */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Quick Destinations</h2>
            <button onClick={() => navigate('/search')} style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>See all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_DESTINATIONS.map(dest => (
              <button
                key={dest.id}
                onClick={() => navigate(`/routes?destinationId=${dest.id}&destAddress=${encodeURIComponent(dest.address)}`)}
                className="card card-hover"
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left', background: 'white' }}
              >
                <span style={{ fontSize: '1.3rem' }}>{dest.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{dest.address}</p>
                </div>
                <Navigation size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>

        {/* Nearby safe zones */}
        {safeZones.length > 0 && (
          <div style={{ marginTop: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Nearby Safe Zones</h2>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {safeZones.slice(0, 5).map(zone => {
                const icons: Record<string, string> = { police: '🚔', hospital: '🏥', metro: '🚇', mall: '🏬', campus: '🎓', public: '🏛️' };
                return (
                  <div key={zone.id} className="card" style={{ flexShrink: 0, padding: '12px 14px', minWidth: 130, textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 6 }}>{icons[zone.type] || '📍'}</span>
                    <p style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{zone.name}</p>
                    <span className="badge badge-info" style={{ marginTop: 6, fontSize: '0.65rem' }}>{zone.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SOS Confirmation Modal */}
      {showSos && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card animate-slide-in-bottom" style={{ width: '100%', maxWidth: 360, padding: 28, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={28} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8 }}>Emergency SOS</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
              This will alert your trusted contacts and show nearby emergency resources. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowSos(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => { setShowSos(false); navigate('/emergency'); }} className="btn btn-danger" style={{ flex: 1 }}>
                Confirm SOS
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav onSOS={handleSOS} />
    </div>
  );
}
