import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-line bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="text-[15px] font-semibold tracking-tight text-ink">
          CodeAlpha Starter
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate sm:inline">{user.name}</span>
            <button
              onClick={signOut}
              className="text-sm font-medium text-slate hover:text-ink"
            >
              Sign out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
