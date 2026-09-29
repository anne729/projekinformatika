import type { ExamItem } from '../types';

// DATA ULANGAN / UJIAN (2 SEMESTER & 4 KATEGORI)
export const EXAM_DATA: ExamItem[] = [
  // Semester 1
  { id: 'e1', semester: 'Semester 1', category: 'UH', title: 'UH 1 Listrik Statis', subject: 'Fisika', dateStr: '15 Sep 2026', duration: '60 Menit', status: 'Selesai', score: 92 },
  { id: 'e2', semester: 'Semester 1', category: 'UH', title: 'UH 1 Turunan Trigonometri', subject: 'Mat Lanjut', dateStr: '22 Sep 2026', duration: '90 Menit', status: 'Selesai', score: 88 },
  { id: 'e3', semester: 'Semester 1', category: 'UTS', title: 'Penilaian Tengah Semester 1', subject: 'Semua Mapel', dateStr: '12-16 Okt 2026', duration: '5 Hari', status: 'Akan Datang' },
  { id: 'e4', semester: 'Semester 1', category: 'UAS', title: 'Penilaian Akhir Semester 1', subject: 'Semua Mapel', dateStr: '07-11 Des 2026', duration: '5 Hari', status: 'Akan Datang' },

  // Semester 2
  { id: 'e5', semester: 'Semester 2', category: 'UH', title: 'UH 1 Gelombang Elektromagnetik', subject: 'Fisika', dateStr: '02 Feb 2027', duration: '60 Menit', status: 'Akan Datang' },
  { id: 'e6', semester: 'Semester 2', category: 'UTS', title: 'PTS Genap 12 F2', subject: 'Semua Mapel', dateStr: '15-19 Mar 2027', duration: '5 Hari', status: 'Akan Datang' },
  { id: 'e7', semester: 'Semester 2', category: 'US', title: 'Ujian Sekolah Utama (US)', subject: 'Seluruh Mapel Saintek', dateStr: '12-19 Apr 2027', duration: '7 Hari', status: 'Akan Datang' },
];
