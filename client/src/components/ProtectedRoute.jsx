import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any route that needs a signed-in user:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 * or pass children directly, as in App.jsx below.
 */
export default function ProtectedRoute({ children }) {
  const { user, initialising } = useAuth();
  const location = useLocation();

  if (initialising) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-slate">Checking your session…</p>
      </div>
    );
  }

  // Remember where they were headed so login can send them back.
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}
