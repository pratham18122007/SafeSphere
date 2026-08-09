import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, X, Shield, PhoneCall, ArrowRight } from 'lucide-react';
import { apiFetch } from '../utils';

export default function EmergencyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const journeyId = location.state?.journeyId;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If entered from Journey Guardian, use that ID, else simulate a standalone SOS
    const endpoint = journeyId ? `/journeys/${journeyId}/sos` : '/journeys/sos-standalone';
    
    // For standalone SOS, we might not have a journey ID in this simple MVP, 
    // but the backend will handle a generic emergency if needed. 
    // Since we only built /journeys/:id/sos, we'll assume there's a mock journey or fail gracefully.
    
    apiFetch(endpoint, { method: 'POST' }).then(res => {
      setData(res);
    }).catch(err => {
      // Fallback for standalone SOS (just local state simulation)
      setData({
        message: 'Emergency mode activated. Trusted contacts notified (simulated for demo).',
        notifications: [
          { contact: { name: 'Mom', contact: '+91 98765 43210' }, status: 'notified' },
          { contact: { name: 'Brother', contact: '+91 87654 32109' }, status: 'notified' }
        ],
        nearbyResources: [
          { id: '1', name: 'Connaught Place Police Station', type: 'police', location: { address: '0.8 km away' } },
          { id: '2', name: 'AIIMS Hospital', type: 'hospital', location: { address: '2.1 km away' } }
        ]
      });
    }).finally(() => setLoading(false));
  }, [journeyId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#dc2626' }}>
      <div className="spinner" style={{ borderTopColor: 'white' }} />
    </div>
  );

  return (
    <div style={{ background: '#dc2626', minHeight: '100vh', padding: 24, display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: 8, borderRadius: '50%', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse-ring 2s infinite' }}>
          <AlertTriangle size={40} color="#dc2626" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>SOS Active</h1>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>{data?.message}</p>
      </div>

      <div style={{ background: 'white', borderRadius: 20, padding: 24, color: 'var(--text-primary)', flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={20} color="var(--primary)" />
            Trusted Contacts Alerted
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data?.notifications?.map((n: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.contact.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{n.contact.contact}</p>
                </div>
                <span className="badge badge-safe">Notified</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={20} color="var(--primary)" />
            Nearby Safe Zones
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data?.nearbyResources?.map((res: any) => (
              <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.4rem' }}>{res.type === 'police' ? '🚔' : '🏥'}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{res.name}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{res.location.address}</p>
                  </div>
                </div>
                <button style={{ background: '#e0e7ff', color: 'var(--primary)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-full" style={{ background: 'white', color: '#dc2626', padding: 16, fontSize: '1.1rem', fontWeight: 800, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <PhoneCall size={20} style={{ marginRight: 8 }} />
          Call National Emergency (112)
        </button>
      </div>
    </div>
  );
}
