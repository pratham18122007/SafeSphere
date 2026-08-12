import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Navigation, AlertTriangle, ShieldCheck, Route as RouteIcon } from 'lucide-react';
import { apiFetch, getRiskCategory, formatEta, formatDistance } from '../utils';
import MapView from '../components/MapView';

export default function RoutesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destId = searchParams.get('destinationId');
  const destAddress = searchParams.get('destAddress');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destId && !destAddress) {
      navigate('/search');
      return;
    }

    apiFetch('/routes/calculate', {
      method: 'POST',
      body: JSON.stringify({ destinationId: destId, originAddress: destAddress }),
    }).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [destId, destAddress, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)', width: 40, height: 40, borderWidth: 3, marginBottom: 20 }} />
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Calculating safe routes...</p>
      </div>
    );
  }

  if (!data || !data.routes) {
    return (
      <div className="nav-padded" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
        <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={26} color="var(--danger)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Unable to Calculate Routes</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
            We could not calculate safety scores for this route. Please check your destination and try again.
          </p>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/search')}>
            <ArrowLeft size={16} /> Try Another Search
          </button>
        </div>
      </div>
    );
  }

  const { origin, destination, routes } = data;

  const routeCards = [
    { type: 'safest', icon: ShieldCheck, title: 'Safest Route', r: routes.find((r: any) => r.routeType === 'safest') },
    { type: 'balanced', icon: RouteIcon, title: 'Balanced Route', r: routes.find((r: any) => r.routeType === 'balanced'), default: true },
    { type: 'fastest', icon: Clock, title: 'Fastest Route', r: routes.find((r: any) => r.routeType === 'fastest') },
  ].filter(x => x.r);

  return (
    <div className="nav-padded" style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '16px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} aria-label="Go Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{origin.address}</p>
            </div>
            <div style={{ borderLeft: '2px dotted var(--border)', height: 10, margin: '2px 0 2px 3px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{destination.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '16px' }}>
        <MapView origin={{ lat: origin.latitude, lng: origin.longitude, address: origin.address }}
                 destination={{ lat: destination.latitude, lng: destination.longitude, address: destination.address }}
                 height="220px"
                 showAlternate={true} />
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 16px 24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Recommended Routes</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {routeCards.map(({ type, icon: Icon, title, r }) => {
            const riskCat = getRiskCategory(r.safeScore);
            return (
              <div
                key={type}
                onClick={() => navigate(`/route/${r.id}`)}
                className="card card-hover"
                style={{
                  padding: 16, border: type === 'balanced' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  position: 'relative', overflow: 'hidden', background: 'white'
                }}
              >
                {type === 'balanced' && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 12px', borderBottomLeftRadius: 10 }}>
                    RECOMMENDED
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ background: type === 'safest' ? '#dcfce7' : type === 'fastest' ? '#fef3c7' : 'var(--primary-light)', padding: 10, borderRadius: 12 }}>
                      <Icon size={20} color={type === 'safest' ? '#16a34a' : type === 'fastest' ? '#d97706' : 'var(--primary)'} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{title}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{formatEta(r.eta)} • {formatDistance(r.distance)}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 2 }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: riskCat.color, lineHeight: 1 }}>{Math.round(r.safeScore)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
                    </div>
                    <span className={`badge ${riskCat.badgeClass}`} style={{ marginTop: 4 }}>{riskCat.label}</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {r.explanation}
                </div>

                {r.warnings.length > 0 && type !== 'safest' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}>
                    <AlertTriangle size={14} />
                    <span>{r.warnings[0]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
