import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles/appStyles';
import logoSekolah from '../assets/logoSekolah.png';
const NAV_ITEMS = [
  { to: '/', label: '🏠 Dashboard Utama', end: true },
  { to: '/jadwal', label: '📅 Jadwal Pelajaran (KBM)' },
  { to: '/tugas', label: '📎 Tugas & Materi' },
  { to: '/ujian', label: '📝 Ulangan & Ujian' },
  { to: '/laporan', label: '📊 Laporan Presensi' },
  { to: '/leaderboard', label: '🏆 Leaderboard' },
  { to: '/social', label: '📢 Broadcast & Diskusi Guru' },
  { to: '/kalender', label: '🗓️ Kalender Belajar' },
];

export default function Sidebar() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brandBox}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '4px', display: 'inline-flex' }}>
  <img src={logoSekolah} alt="Logo SMA Negeri 1 Ciomas" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
</div>
        <div>
        <h2 style={styles.brandTitle}>SMAN 1 Ciomas</h2>
          <p style={styles.brandSub}>Saintek 2 • SMA Negeri 1 Ciomas</p>
        </div>
      </div>

      <div style={styles.studentCard}>
        <label style={styles.studentLabel}>AKUN AKTIF</label>
        <div style={styles.activeBio}>
          <p style={{ margin: '4px 0 2px 0', fontWeight: 'bold', color: '#0f172a' }}>
            {student?.name}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>NISN: {student?.nisn}</p>
        </div>
      </div>

      <nav style={{ ...styles.navStack, flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              ...styles.navBtn,
              backgroundColor: isActive ? '#2563eb' : 'transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        🚪 Keluar
      </button>
    </aside>
  );
}