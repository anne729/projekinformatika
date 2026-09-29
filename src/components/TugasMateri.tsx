import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { WEEKLY_SCHEDULE } from '../data/schedule';
import { styles } from '../styles/appStyles';
import type { MaterialItem } from '../types';

const SUBJECTS = Array.from(new Set(WEEKLY_SCHEDULE.map((s) => s.subject))).filter(
  (s) => s !== 'Upacara' && s !== 'Kegiatan Pagi' && s !== 'Kegiatan Duha'
);

export default function TugasMateri() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('Semua');

  const [subject, setSubject] = useState(SUBJECTS[0] || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    setLoading(true);
    const { data } = await supabase.from('materials').select('*').order('uploaded_at', { ascending: false });
    setMaterials((data as MaterialItem[]) || []);
    setLoading(false);
  }

  const filtered = filterSubject === 'Semua' ? materials : materials.filter((m) => m.subject === filterSubject);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !subject) {
      setErrorMsg('Judul dan mapel wajib diisi.');
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 10MB.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file) {
      const path = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('materials').upload(path, file);
      if (uploadError) {
        setSubmitting(false);
        setErrorMsg('Gagal upload file: ' + uploadError.message);
        return;
      }
      fileUrl = supabase.storage.from('materials').getPublicUrl(path).data.publicUrl;
      fileName = file.name;
    }

    const { error } = await supabase.from('materials').insert({
      subject,
      title: title.trim(),
      description: description.trim() || null,
      file_url: fileUrl,
      file_name: fileName,
      deadline: deadline.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg('Gagal menyimpan, coba lagi.');
      return;
    }

    setTitle('');
    setDescription('');
    setDeadline('');
    setFile(null);
    loadMaterials();
  }

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>📎 Tugas & Materi</h2>

      <div style={{ ...styles.presensiCard, marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>✍️ Simulasi Guru: Upload Tugas/Materi</h3>
        <form onSubmit={handleUpload}>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px' }}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input placeholder="Judul tugas/materi" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }} />
          <textarea placeholder="Catatan/deskripsi..." value={description} onChange={(e) => setDescription(e.target.value)} style={styles.noteTextarea} />
          <input type="date" placeholder="Tenggat waktu" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', boxSizing: 'border-box' }} />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginBottom: '8px', display: 'block' }} />
          {errorMsg && <p style={{ color: '#dc2626', fontSize: '12px' }}>{errorMsg}</p>}
          <button type="submit" disabled={submitting} style={styles.submitAttendanceBtn}>
            {submitting ? 'Mengupload...' : 'Upload'}
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <option value="Semua">Semua Mapel</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b' }}>Belum ada tugas/materi.</p>
        ) : (
          filtered.map((m) => (
            <div key={m.id} style={styles.scheduleCard}>
              <div style={{ flex: 1 }}>
                <span style={styles.examBadge}>{m.subject}</span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{m.title}</h3>
                {m.description && <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>{m.description}</p>}
                {m.deadline && <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#d97706' }}>⏰ Tenggat: {m.deadline}</p>}
                {m.file_url && (
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#2563eb' }}>
                    📄 {m.file_name}
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}