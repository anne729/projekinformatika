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
  date_str: string;
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

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin';

export interface AttendanceRecord {
  id: string;
  nisn: string;
  attendance_date: string;
  status: AttendanceStatus;
  note: string | null;
  created_at: string;
}
export interface StudentScore {
  nisn: string;
  name: string;
  average_score: number;
  star_points: number;
  last_feedback: string | null;
}