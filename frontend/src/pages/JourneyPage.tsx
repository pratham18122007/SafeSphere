import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Navigation, MapPin, CheckCircle, X } from 'lucide-react';
import { apiFetch, getRiskCategory, formatEta, formatDistance } from '../utils';
import MapView from '../components/MapView';
import SafeScoreRing from '../components/SafeScoreRing';
import DemoControls from '../components/DemoControls';

export default function JourneyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rerouteOffer, setRerouteOffer] = useState<any>(null);
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    apiFetch(`/journeys/${id}`).then(res => {
      setData(res);
    }).catch(console.error).finally(() => setLoading(false));

    apiFetch('/user/contacts').then(c => setContactsCount(c.filter((x:any) => x.enabled).length)).catch(() => {});
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
      <div className="spinner" style={{ borderTopColor: 'var(--primary)' }} />
    </div>
  );

  if (!data || !data.journey) return <div style={{ padding: 24 }}>Journey not found.</div>;

  const { journey, route } = data;
  const riskCat = getRiskCategory(journey.currentSafeScore);
  const hasActiveEvent = journey.events.some((e: any) => e.active);
  const latestEvent = journey.events[journey.events.length - 1];

  const triggerEvent = async (type: string) => {
    if (type === 'emergency') {
      navigate('/emergency', { state: { journeyId: journey.id } });
      return;
    }

    try {
      const res = await apiFetch(`/journeys/${journey.id}/events`, {
        method: 'POST',
        body: JSON.stringify({ type })
      });
      setData((prev: any) => ({ ...prev, journey: res.journey }));

      // Automatically fetch reroute options if it's an incident/risk increase
      if (['incident', 'risk_increase', 'deviation'].includes(type)) {
        setTimeout(async () => {
          const rr = await apiFetch(`/journeys/${journey.id}/reroute`, { method: 'POST' });
          setRerouteOffer(rr);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const acceptReroute = () => {
    if (!rerouteOffer) return;
    setData((prev: any) => ({
      ...prev,
      route: rerouteOffer.newRoute,
      journey: { ...prev.journey, routeId: rerouteOffer.newRoute.id, currentSafeScore: rerouteOffer.newRoute.safeScore }
    }));
    setRerouteOffer(null);
  };

  const endJourney = async () => {
    try {
      await apiFetch(`/journeys/${journey.id}/complete`, { method: 'POST' });
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Guardian Bar */}
      <div style={{ background: hasActiveEvent ? 'var(--danger)' : 'var(--primary)', color: 'white', padding: '16px 20px', transition: 'background 0.5s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {hasActiveEvent ? (
              <div style={{ background: 'white', borderRadius: '50%', padding: 6, display: 'flex', animation: 'pulse-ring 2s infinite' }}>
                <AlertTriangle size={20} color="var(--danger)" />
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: 6 }}>
                <Shield size={20} color="white" />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Journey Guardian™</h1>
              <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{hasActiveEvent ? 'Safety Alert Active' : 'Monitoring your route'}</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{Math.round(journey.currentSafeScore)}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>SafeScore</div>
          </div>
        </div>

        {/* Contacts info */}
        {!hasActiveEvent && contactsCount > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 500 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            {contactsCount} trusted contact{contactsCount > 1 ? 's' : ''} can see your journey
          </div>
        )}
      </div>

      {/* Reroute Offer Modal */}
      {rerouteOffer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
          <div className="card animate-slide-in-bottom" style={{ width: '100%', padding: 24, paddingBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: '#dcfce7', padding: 8, borderRadius: '50%' }}>
                  <Shield size={24} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Safer Route Found</h3>
              </div>
              <button onClick={() => setRerouteOffer(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              {rerouteOffer.reason}
            </p>

            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Added time</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>+{rerouteOffer.improvement.etaIncrease} mins</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>SafeScore gain</span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>+{rerouteOffer.improvement.safeScoreGain} pts</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setRerouteOffer(null)} className="btn btn-ghost" style={{ flex: 1 }}>Ignore</button>
              <button onClick={acceptReroute} className="btn btn-primary" style={{ flex: 2, background: '#16a34a' }}>Reroute Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView 
          origin={{ lat: route.origin.latitude, lng: route.origin.longitude, address: route.origin.address }}
          destination={{ lat: route.destination.latitude, lng: route.destination.longitude, address: route.destination.address }}
          height="100%" 
          routeType={route.routeType}
          currentPosition={{ lat: route.origin.latitude + 0.005, lng: route.origin.longitude + 0.005 }} // Simulated progress
        />

        {/* Live Alerts Overlay */}
        {latestEvent && latestEvent.active && (
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 }} className="animate-slide-in-top">
            <div className="card" style={{ borderLeft: '4px solid var(--danger)', padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>Safety Alert</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{latestEvent.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav / Controls */}
      <div style={{ background: 'white', padding: '16px 20px', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', position: 'relative', zIndex: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{formatEta(route.eta)}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>{formatDistance(route.distance)} • {route.destination.address.split(',')[0]}</p>
          </div>
          
          <button onClick={() => navigate('/emergency', { state: { journeyId: journey.id } })} className="btn btn-danger" style={{ padding: '12px 24px', borderRadius: 999, fontSize: '1.1rem', boxShadow: '0 4px 16px rgba(220,38,38,0.4)' }}>
            SOS
          </button>
        </div>

        <button onClick={endJourney} className="btn btn-ghost btn-full" style={{ color: 'var(--text-secondary)' }}>
          End Journey
        </button>
      </div>

      <DemoControls onTriggerEvent={triggerEvent} />
    </div>
  );
}
