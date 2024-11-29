import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  console.log('ProtectedRoute rendering');
  const { user, loading } = useAuth();
  console.log('Auth state:', { user, loading });

  if (loading) {
    console.log('Auth is loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
}
