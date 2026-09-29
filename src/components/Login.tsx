import { useState, type FormEvent } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoSekolah from '../assets/logoSekolah.png';
export default function Login() {
  const [nisn, setNisn] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(nisn);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.message);
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
      <h1 style={styles.title}>SMAN 1 Ciomas</h1>
      <img src={logoSekolah} alt="Logo SMA Negeri 1 Ciomas" style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '12px' }} />
      <p style={styles.subtitle}>Masuk pakai NISN kamu</p>

        <input
          type="text"
          inputMode="numeric"
          placeholder="Masukkan NISN"
          value={nisn}
          onChange={(e) => setNisn(e.target.value)}
          style={styles.input}
          disabled={isSubmitting}
          autoFocus
        />

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    width: '340px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  logo: {
    width: '48px',
    height: '48px',
    backgroundColor: '#2563eb',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '12px',
  },
  title: { margin: 0, fontSize: '18px', color: '#0f172a', letterSpacing: '0.5px' },
  subtitle: { margin: '4px 0 24px 0', fontSize: '13px', color: '#64748b' },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  error: {
    color: '#dc2626',
    fontSize: '12px',
    margin: '0 0 12px 0',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  },
};
