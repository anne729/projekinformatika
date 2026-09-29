import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { styles } from '../styles/appStyles';

interface BroadcastRow {
  id: string;
  sender: string;
  role: string;
  content: string;
  badge_tag: string | null;
  created_at: string;
}

export default function BroadcastGuru() {
  const [broadcastList, setBroadcastList] = useState<BroadcastRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherMsgInput, setTeacherMsgInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBroadcasts();
  }, []);

  async function loadBroadcasts() {
    setLoading(true);
    const { data } = await supabase
      .from('broadcasts')
      .select('*')
      .order('created_at', { ascending: false });
    setBroadcastList((data as BroadcastRow[]) || []);
    setLoading(false);
  }

  const handleSendBroadcast = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherMsgInput.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from('broadcasts').insert({
      sender: 'Achmad Sulaeman, S.H.I.',
      role: 'Wali Kelas 12 F2',
      content: teacherMsgInput.trim(),
      badge_tag: 'BROADCAST GURU',
    });

    setSubmitting(false);

    if (!error) {
      setTeacherMsgInput('');
      loadBroadcasts();
    }
  };

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  }

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '6px' }}>📢 Channel Broadcast Guru & Wali Kelas</h2>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
        Setiap instruksi dari Guru/Wali Kelas otomatis masuk ke device seluruh siswa 12 F2.
      </p>

      <form onSubmit={handleSendBroadcast} style={styles.teacherForm}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
          ✍️ Simulasi Mode Guru / Wali Kelas (Kirim Pesan ke Semua Device):
        </label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <input
            type="text"
            placeholder="Ketik pengumuman kelas di sini..."
            value={teacherMsgInput}
            onChange={(e) => setTeacherMsgInput(e.target.value)}
            style={styles.chatInput}
            disabled={submitting}
          />
          <button type="submit" style={styles.sendBtn} disabled={submitting}>
            {submitting ? 'Mengirim...' : 'Broadcast 🚀'}
          </button>
        </div>
      </form>

      <div style={styles.chatList}>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat...</p>
        ) : broadcastList.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>Belum ada pengumuman.</p>
        ) : (
          broadcastList.map((msg) => (
            <div key={msg.id} style={styles.chatCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👨‍🏫</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>{msg.sender}</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{msg.role}</span>
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{formatTime(msg.created_at)}</span>
              </div>

              {msg.badge_tag && <span style={styles.broadcastTag}>{msg.badge_tag}</span>}

              <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                {msg.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}