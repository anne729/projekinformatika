// Semua interface/type dikumpulkan di sini biar bisa dipakai bareng
// oleh data files dan components, tanpa duplikasi.

export interface Student {
  nisn: string;
  name: string;
}

export interface TeacherSubject {
  name: string;
  subject: string;
}

export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

export interface ScheduleItem {
  id: string;
  dayName: DayName;
  subject: string;
  teacher: string;
  jp: number;
  timeSlot: string;
}

export type ExamSemester = 'Semester 1' | 'Semester 2';
export type ExamCategory = 'UH' | 'UTS' | 'UAS' | 'US';
export type ExamStatus = 'Akan Datang' | 'Selesai';

export interface ExamItem {
  id: string;
  semester: ExamSemester;
  category: ExamCategory;
  title: string;
  subject: string;
  dateStr: string;
  duration: string;
  status: ExamStatus;
  score?: number;
}

export interface BroadcastMessage {
  id: string;
  sender: string;
  role: string;
  time: string;
  content: string;
  badgeTag?: string;
}
export interface MaterialItem {
  id: string;
  subject: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_name: string | null;
  deadline: string | null;
  uploaded_at: string;
}
export interface CalendarEvent {
  id: string;
  nisn: string;
  event_date: string;
  title: string;
  note: string | null;
  created_at: string;
}