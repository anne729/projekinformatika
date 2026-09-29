import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { styles } from '../styles/appStyles';
import type { CalendarEvent } from '../types';

export default function KalenderBelajar() {
  const { student } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [eventDate, setEventDate] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  async function loadEvents() {
    if (!student) return;
    setLoading(true);
    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('nisn', student.nisn)
      .order('event_date', { ascending: true });
    setEvents((data as CalendarEvent[]) || []);
    setLoading(false);
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!student || !eventDate || !title.trim()) {
      setErrorMsg('Tanggal dan judul wajib diisi.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.from('calendar_events').insert({
      nisn: student.nisn,
      event_date: eventDate,
      title: title.trim(),
      note: note.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg('Gagal menyimpan, coba lagi.');
      return;
    }

    setEventDate('');
    setTitle('');
    setNote('');
    loadEvents();
  }

  async function handleDelete(id: string) {
    await supabase.from('calendar_events').delete().eq('id', id);
    loadEvents();
  }

  if (!student) return null;

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>🗓️ Kalender Jadwal Belajar</h2>

      <div style={{ ...styles.presensiCard, marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Tambah Jadwal Belajar Sendiri</h3>
        <form onSubmit={handleAdd}>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }}
          />
          <input
            placeholder="Judul (misal: Belajar Fisika Bab 3)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }}
          />
          <textarea
            placeholder="Catatan (opsional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={styles.noteTextarea}
          />
          {errorMsg && <p style={{ color: '#dc2626', fontSize: '12px' }}>{errorMsg}</p>}
          <button type="submit" disabled={submitting} style={styles.submitAttendanceBtn}>
            {submitting ? 'Menyimpan...' : 'Tambah'}
          </button>
        </form>
      </div>

      <div style={styles.presensiCard}>
        <h3 style={{ marginTop: 0 }}>Jadwal Belajar Kamu</h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat...</p>
        ) : events.length === 0 ? (
          <p style={{ color: '#64748b' }}>Belum ada jadwal belajar custom.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{ev.title}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {new Date(ev.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {ev.note ? ` — ${ev.note}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}