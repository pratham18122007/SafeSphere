import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Shield, User, Settings, AlertTriangle } from 'lucide-react';
import { clearAuth } from '../utils';

interface BottomNavProps {
  onSOS?: () => void;
}

export default function BottomNav({ onSOS }: BottomNavProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/search" className={`nav-item ${isActive('/search') ? 'active' : ''}`}>
        <Search size={20} />
        <span>Navigate</span>
      </NavLink>

      {/* SOS center button */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          className="sos-btn"
          onClick={onSOS}
          aria-label="Emergency SOS"
        >
          SOS
        </button>
      </div>

      <NavLink to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>
      <NavLink to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
