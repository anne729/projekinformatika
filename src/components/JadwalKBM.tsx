import { useState } from 'react';
import { WEEKLY_SCHEDULE } from '../data/schedule';
import { styles } from '../styles/appStyles';
import type { DayName } from '../types';

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalKBM() {
  const [selectedDay, setSelectedDay] = useState<DayName>('Senin');
  const dailySchedule = WEEKLY_SCHEDULE.filter((item) => item.dayName === selectedDay);

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>📚 Jadwal Pelajaran KBM Kelas 12 F2</h2>

      <div style={styles.dayTabRow}>
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              ...styles.dayTabBtn,
              backgroundColor: selectedDay === day ? '#2563eb' : '#ffffff',
              color: selectedDay === day ? '#ffffff' : '#475569',
              borderColor: selectedDay === day ? '#2563eb' : '#cbd5e1',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <div style={styles.scheduleList}>
        {dailySchedule.map((item) => (
          <div key={item.id} style={styles.scheduleCard}>
            <div style={styles.timeBox}>
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#2563eb' }}>
                {item.timeSlot}
              </span>
              <span style={styles.jpBadge}>{item.jp} JP</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{item.subject}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                👨‍🏫 Pengajar: <strong>{item.teacher}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}