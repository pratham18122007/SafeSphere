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
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p>Failed to load routes.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>Go back</button>
      </div>
    );
  }

  const { origin, destination, routes } = data;

  const routeCards = [
    { type: 'safest', icon: ShieldCheck, title: 'Safest', r: routes.find((r: any) => r.routeType === 'safest') },
    { type: 'balanced', icon: RouteIcon, title: 'Balanced', r: routes.find((r: any) => r.routeType === 'balanced'), default: true },
    { type: 'fastest', icon: Clock, title: 'Fastest', r: routes.find((r: any) => r.routeType === 'fastest') },
  ].filter(x => x.r);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 80, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '16px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{origin.address}</p>
            </div>
            <div style={{ borderLeft: '2px dotted var(--border)', height: 10, margin: '2px 0 2px 3px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{destination.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <MapView origin={{ lat: origin.latitude, lng: origin.longitude, address: origin.address }}
                 destination={{ lat: destination.latitude, lng: destination.longitude, address: destination.address }}
                 height="220px"
                 showAlternate={true} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Route Options</h2>

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
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderBottomLeftRadius: 8 }}>
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

                <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {r.explanation}
                </div>

                {r.warnings.length > 0 && type !== 'safest' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 500 }}>
                    <AlertTriangle size={12} />
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
