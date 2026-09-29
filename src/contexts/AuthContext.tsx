import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Student } from '../types';

interface AuthContextType {
  student: Student | null;
  loading: boolean;
  login: (nisn: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key buat nyimpen sesi di localStorage browser siswa.
const SESSION_KEY = 'pn03_session';

interface StoredSession {
  nisn: string;
  sessionId: string;
}

interface StudentRow {
  nisn: string;
  name: string;
  is_logged_in: boolean;
  active_session_id: string | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Pas app pertama kali dibuka, cek apakah ada sesi tersimpan di browser
  // dan masih valid (belum di-override login dari device lain).
  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function restoreSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      setLoading(false);
      return;
    }

    try {
      const stored: StoredSession = JSON.parse(raw);
      const { data, error } = await supabase
        .from('students')
        .select('nisn, name, is_logged_in, active_session_id')
        .eq('nisn', stored.nisn)
        .single<StudentRow>();

      if (error || !data || data.active_session_id !== stored.sessionId) {
        // Sesi lokal gak cocok lagi sama yang di database
        // (misal: udah logout, atau di-override login dari device lain).
        localStorage.removeItem(SESSION_KEY);
        setStudent(null);
      } else {
        setStudent({ nisn: data.nisn, name: data.name });
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(nisn: string): Promise<{ success: boolean; message: string }> {
    const trimmed = nisn.trim();
    if (!trimmed) {
      return { success: false, message: 'NISN gak boleh kosong.' };
    }

    const { data, error } = await supabase
      .from('students')
      .select('nisn, name, is_logged_in, active_session_id')
      .eq('nisn', trimmed)
      .single<StudentRow>();

    if (error || !data) {
      return { success: false, message: 'NISN gak ditemukan. Coba cek lagi ya.' };
    }

    if (data.is_logged_in) {
      // TODO (Fase 1 lanjutan): ganti pesan ini jadi alur verifikasi email beneran.
      return {
        success: false,
        message:
          'NISN ini lagi aktif login di device lain. Fitur verifikasi email masih dalam pengembangan — sementara hubungi wali kelas buat reset sesi.',
      };
    }

    const sessionId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);

    const { error: updateError } = await supabase
      .from('students')
      .update({ is_logged_in: true, active_session_id: sessionId })
      .eq('nisn', trimmed);

    if (updateError) {
      return { success: false, message: 'Gagal login, coba lagi sebentar.' };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ nisn: trimmed, sessionId } satisfies StoredSession));
    setStudent({ nisn: data.nisn, name: data.name });
    return { success: true, message: 'Login berhasil!' };
  }

  async function logout() {
    if (student) {
      await supabase
        .from('students')
        .update({ is_logged_in: false, active_session_id: null })
        .eq('nisn', student.nisn);
    }
    localStorage.removeItem(SESSION_KEY);
    setStudent(null);
  }

  return (
    <AuthContext.Provider value={{ student, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  }
  return ctx;
}
