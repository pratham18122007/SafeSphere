import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, Clock } from 'lucide-react';
import { apiFetch } from '../utils';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/routes/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (dest: any) => {
    navigate(`/routes?destinationId=${dest.id}&destAddress=${encodeURIComponent(dest.address)}`);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '20px 16px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Where to?</h1>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            autoFocus
            type="text"
            className="input"
            placeholder="Search destination..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 48, borderRadius: 999, border: '1.5px solid var(--border)', background: 'var(--bg-primary)' }}
          />
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)' }} />
          </div>
        ) : results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, paddingLeft: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search Results</p>
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="card card-hover"
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left', border: 'none', background: 'white', width: '100%' }}
              >
                <div style={{ background: 'var(--primary-light)', padding: 10, borderRadius: '50%' }}>
                  <MapPin size={20} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{r.address}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{r.zone}</p>
                </div>
              </button>
            ))}
          </div>
        ) : query ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <MapPin size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>No results found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Try a different area in Delhi NCR.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, paddingLeft: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Searches</p>
            {[
              { id: 'loc-1', address: 'Connaught Place, New Delhi', zone: 'Central Delhi' },
              { id: 'loc-3', address: 'Rajouri Garden, New Delhi', zone: 'West Delhi' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="card card-hover"
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left', border: 'none', background: 'white', width: '100%' }}
              >
                <div style={{ background: '#f3f4f6', padding: 10, borderRadius: '50%' }}>
                  <Clock size={20} color="var(--text-secondary)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{r.address}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{r.zone}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
