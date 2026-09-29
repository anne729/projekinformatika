import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles/appStyles';

const QUICK_ACCESS = [
  { icon: '📚', title: 'Jadwal KBM', desc: 'Lihat jadwal Senin-Jumat', to: '/jadwal' },
  { icon: '✍️', title: 'Ulangan & Ujian', desc: 'UH, PTS, PAS, & US', to: '/ujian' },
  { icon: '📈', title: 'Presensi Siswa', desc: 'Statistik Kehadiran', to: '/laporan' },
  { icon: '💬', title: 'Pesan Guru', desc: 'Broadcast Kelas', to: '/social' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { student } = useAuth();

  if (!student) return null;

  return (
    <div>
      <div style={styles.heroBanner}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff' }}>Halo, {student.name}! 👋</h2>
          <p style={{ margin: '6px 0 0 0', color: '#93c5fd', fontSize: '14px' }}>
            Siap untuk mengikuti pembelajaran hari ini? Cek jadwal dan pesan terbaru dari gurumu!
          </p>
        </div>
      </div>

      <h3 style={styles.sectionHeader}>Akses Cepat Fitur</h3>
      <div style={styles.quickGrid}>
        {QUICK_ACCESS.map((item) => (
          <div key={item.to} onClick={() => navigate(item.to)} style={styles.quickCard}>
            <span style={{ fontSize: '28px' }}>{item.icon}</span>
            <h4 style={{ margin: '8px 0 0 0', color: '#1e293b' }}>{item.title}</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}