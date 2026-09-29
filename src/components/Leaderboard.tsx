import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { styles } from '../styles/appStyles';
import type { StudentScore } from '../index';

export default function Leaderboard() {
  const [list, setList] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNisn, setSelectedNisn] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [starsInput, setStarsInput] = useState(1);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase
      .from('students')
      .select('nisn, name, average_score, star_points, last_feedback')
      .order('average_score', { ascending: false });
    setList((data as StudentScore[]) || []);
    setLoading(false);
  }

  async function handleGiveFeedback() {
    if (!selectedNisn) {
      setFeedback('Pilih siswa dulu.');
      return;
    }
    setSubmitting(true);
    setFeedback('');

    const current = list.find((s) => s.nisn === selectedNisn);
    const newStarPoints = (current?.star_points || 0) + starsInput;

    const updates: Record<string, unknown> = {
      star_points: newStarPoints,
      last_feedback: message.trim() || null,
    };

    if (scoreInput.trim() !== '') {
      const parsed = parseFloat(scoreInput);
      if (!isNaN(parsed)) updates.average_score = parsed;
    }

    const { error } = await supabase.from('students').update(updates).eq('nisn', selectedNisn);
    setSubmitting(false);

    if (error) {
      setFeedback('Gagal menyimpan, coba lagi.');
      return;
    }

    setSelectedNisn('');
    setScoreInput('');
    setStarsInput(1);
    setMessage('');
    loadData();
  }

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>🏆 Leaderboard Kelas</h2>

      <div style={{ ...styles.presensiCard, marginBottom: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Simulasi Guru: Beri Nilai & Poin</h3>
        <select
          value={selectedNisn}
          onChange={(e) => setSelectedNisn(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', fontSize: '13px' }}
        >
          <option value="">-- Pilih Siswa --</option>
          {list.map((s) => (
            <option key={s.nisn} value={s.nisn}>{s.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Nilai rata-rata (kosongkan kalau gak diubah)"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', fontSize: '13px', boxSizing: 'border-box' }}
        />

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>Poin Bintang: </label>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setStarsInput(n)}
              style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: n <= starsInput ? '#f59e0b' : '#cbd5e1' }}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Pesan singkat (maks 300 karakter)..."
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 300))}
          style={styles.noteTextarea}
        />
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '-8px 0 8px 0' }}>{message.length}/300</p>

        {feedback && <p style={{ color: '#dc2626', fontSize: '12px' }}>{feedback}</p>}

        <button onClick={handleGiveFeedback} disabled={submitting} style={styles.submitAttendanceBtn}>
          {submitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      <div style={styles.presensiCard}>
        <h3 style={{ marginTop: 0 }}>Peringkat</h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list.map((s, idx) => (
              <div
                key={s.nisn}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a' }}>{idx + 1}. {s.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Nilai rata-rata: {s.average_score}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 'bold' }}>
                  ⭐ {s.star_points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}