import { styles } from '../styles/appStyles';

export default function TopHeader() {
  return (
    <header style={styles.topHeader}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Kelas 12 F2 (Saintek 2)</h1>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
          Wali Kelas: <strong>Achmad Sulaeman, S.H.I.</strong>
        </p>
      </div>
      <div style={styles.badgeSemester}>Tahun Ajaran 2026/2027</div>
    </header>
  );
}