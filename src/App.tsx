import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import JadwalKBM from './components/JadwalKBM';
import UjianSekolah from './components/UjianSekolah';
import LaporanPresensi from './components/LaporanPresensi.tsx';
import BroadcastGuru from './components/BroadCastGuru';
import Leaderboard from './components/Leaderboard';
import TugasMateri from './components/TugasMateri';
import KalenderBelajar from './components/KalenderBelajar';
import Login from './components/Login';
import { styles } from './styles/appStyles';
function AppLayout() {
  return (
    <div style={styles.appWrapper}>
      <Sidebar />
      <main style={styles.mainContainer}>
        <TopHeader />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jadwal" element={<JadwalKBM />} />
          <Route path="/ujian" element={<UjianSekolah />} />
          <Route path="/laporan" element={<LaporanPresensi />} />
          <Route path="/social" element={<BroadcastGuru />} />
          <Route path="/tugas" element={<TugasMateri />} />
          <Route path="/kalender" element={<KalenderBelajar />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}