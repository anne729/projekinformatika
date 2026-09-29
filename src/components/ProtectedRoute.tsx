import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Bungkus komponen halaman dengan ini biar otomatis dilempar ke /login
// kalau belum ada siswa yang login.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { student, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
        Memuat...
      </div>
    );
  }

  if (!student) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
