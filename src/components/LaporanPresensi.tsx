import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { styles } from '../styles/appStyles';
import type { AttendanceRecord, AttendanceStatus } from '../index';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function LaporanPresensi() {
  const { student } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  async function loadRecords() {
    if (!student) return;
    setLoading(true);
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('nisn', student.nisn)
      .order('attendance_date', { ascending: false });
    setRecords((data as AttendanceRecord[]) || []);
    setLoading(false);
  }

  if (!student) return null;

  const todayRecord = records.find((r) => r.attendance_date === todayStr());
  const hadirCount = records.filter((r) => r.status === 'Hadir').length;
  const sakitCount = records.filter((r) => r.status === 'Sakit').length;
  const izinCount = records.filter((r) => r.status === 'Izin').length;

  async function handleSubmit() {
    if (!student || !selectedStatus) return;
    if (selectedStatus !== 'Hadir' && !note.trim()) {
      setErrorMsg(selectedStatus === 'Sakit' ? 'Tulis dulu keterangan sakitnya ya.' : 'Tulis dulu alasan izinnya ya.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    const { error } = await supabase.from('attendance').insert({
      nisn: student.nisn,
      attendance_date: todayStr(),
      status: selectedStatus,
      note: selectedStatus === 'Hadir' ? null : note.trim(),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg('Gagal nyimpen presensi, coba lagi.');
      return;
    }
    setSelectedStatus(null);
    setNote('');
    loadRecords();
  }

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>📊 Laporan Presensi Siswa</h2>

      <div style={styles.presensiCard}>
        <h3 style={{ marginTop: 0 }}>Presensi Hari Ini</h3>
        {todayRecord ? (
          <p style={{ color: '#16a34a', fontWeight: 'bold' }}>
            Kamu udah presensi hari ini: {todayRecord.status}
            {todayRecord.note ? ` — "${todayRecord.note}"` : ''}
          </p>
        ) : (
          <>
            <div style={styles.statusBtnRow}>
              {(['Hadir', 'Sakit', 'Izin'] as AttendanceStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => { setSelectedStatus(status); setErrorMsg(''); }}
                  style={{
                    ...styles.statusBtn,
                    backgroundColor: selectedStatus === status ? '#2563eb' : '#ffffff',
                    color: selectedStatus === status ? '#ffffff' : '#334155',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {selectedStatus && selectedStatus !== 'Hadir' && (
              <textarea
                placeholder={selectedStatus === 'Sakit' ? 'Tulis keterangan sakit...' : 'Tulis alasan izin...'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={styles.noteTextarea}
              />
            )}

            {errorMsg && <p style={{ color: '#dc2626', fontSize: '12px' }}>{errorMsg}</p>}

            {selectedStatus && (
              <button onClick={handleSubmit} disabled={submitting} style={styles.submitAttendanceBtn}>
                {submitting ? 'Menyimpan...' : 'Kirim Presensi'}
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ ...styles.presensiCard, marginTop: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Ringkasan Kehadiran {student.name}</h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat...</p>
        ) : (
          <div style={styles.statRow}>
            <div style={styles.statBox}>
              <span style={{ fontSize: '24px', color: '#16a34a' }}>{hadirCount}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Hadir</span>
            </div>
            <div style={styles.statBox}>
              <span style={{ fontSize: '24px', color: '#d97706' }}>{sakitCount}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Sakit</span>
            </div>
            <div style={styles.statBox}>
              <span style={{ fontSize: '24px', color: '#dc2626' }}>{izinCount}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Izin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}