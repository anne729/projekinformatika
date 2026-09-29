import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { styles } from '../styles/appStyles';
import type { ExamCategory, ExamItem, ExamSemester } from '../types';

const CATEGORY_LABELS: Record<ExamCategory, string> = {
  UH: 'Ulangan Harian (UH)',
  UTS: 'Ulangan Tengah Sem (PTS)',
  UAS: 'Ulangan Akhir Sem (PAS)',
  US: 'Ujian Sekolah (US)',
};

export default function UjianSekolah() {
  const [examSemester, setExamSemester] = useState<ExamSemester>('Semester 1');
  const [examCategory, setExamCategory] = useState<ExamCategory>('UH');
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [formSemester, setFormSemester] = useState<ExamSemester>('Semester 1');
  const [formCategory, setFormCategory] = useState<ExamCategory>('UH');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [duration, setDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    setLoading(true);
    const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: true });
    setExams((data as ExamItem[]) || []);
    setLoading(false);
  }

  const filteredExams = exams.filter((e) => e.semester === examSemester && e.category === examCategory);

  async function handleAddExam(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !dateStr.trim() || !duration.trim()) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.from('exams').insert({
      semester: formSemester,
      category: formCategory,
      title: title.trim(),
      subject: subject.trim(),
      date_str: dateStr.trim(),
      duration: duration.trim(),
      status: 'Akan Datang',
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg('Gagal menyimpan, coba lagi.');
      return;
    }

    setTitle('');
    setSubject('');
    setDateStr('');
    setDuration('');
    loadExams();
  }

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>📝 Menu Ulangan & Ujian Sekolah</h2>

      <div style={{ ...styles.presensiCard, marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>✍️ Simulasi Guru/Sekolah: Input Jadwal Ujian</h3>
        <form onSubmit={handleAddExam}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <select value={formSemester} onChange={(e) => setFormSemester(e.target.value as ExamSemester)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as ExamCategory)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              {(Object.keys(CATEGORY_LABELS) as ExamCategory[]).map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <input placeholder="Judul (misal: UH 1 Listrik Statis)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }} />
          <input placeholder="Mata Pelajaran" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }} />
          <input placeholder="Tanggal (misal: 15 Sep 2026)" value={dateStr} onChange={(e) => setDateStr(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }} />
          <input placeholder="Durasi (misal: 60 Menit)" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }} />
          {errorMsg && <p style={{ color: '#dc2626', fontSize: '12px' }}>{errorMsg}</p>}
          <button type="submit" disabled={submitting} style={styles.submitAttendanceBtn}>
            {submitting ? 'Menyimpan...' : 'Tambah Jadwal'}
          </button>
        </form>
      </div>

      <div style={styles.examFilterContainer}>
        <div style={styles.semesterToggle}>
          {(['Semester 1', 'Semester 2'] as const).map((sem) => (
            <button key={sem} onClick={() => setExamSemester(sem)} style={{ ...styles.semBtn, backgroundColor: examSemester === sem ? '#0f172a' : 'transparent', color: examSemester === sem ? '#ffffff' : '#475569' }}>
              {sem}
            </button>
          ))}
        </div>
        <div style={styles.categoryPills}>
          {(Object.keys(CATEGORY_LABELS) as ExamCategory[]).map((cat) => (
            <button key={cat} onClick={() => setExamCategory(cat)} style={{ ...styles.pillBtn, backgroundColor: examCategory === cat ? '#2563eb' : '#ffffff', color: examCategory === cat ? '#ffffff' : '#334155' }}>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.examGrid}>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat...</p>
        ) : filteredExams.length === 0 ? (
          <div style={styles.emptyExamBox}>
            <p>Belum ada jadwal untuk kategori ini di {examSemester}.</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} style={styles.examCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={styles.examBadge}>{exam.category}</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', backgroundColor: exam.status === 'Selesai' ? '#dcfce7' : '#fef3c7', color: exam.status === 'Selesai' ? '#15803d' : '#b45309' }}>
                  {exam.status}
                </span>
              </div>
              <h3 style={{ margin: '10px 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{exam.title}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Mata Pelajaran: {exam.subject}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>📅 {exam.dateStr} • ⏳ {exam.duration}</p>
              {exam.score !== undefined && exam.score !== null && (
                <div style={styles.scoreBox}>
                  <span>Nilai Siswa:</span>
                  <strong style={{ fontSize: '18px', color: '#15803d' }}>{exam.score}</strong>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}