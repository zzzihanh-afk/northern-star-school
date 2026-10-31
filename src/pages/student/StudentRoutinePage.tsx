import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Clock, BookOpen, User, MapPin } from 'lucide-react';

export const StudentRoutinePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const student = (user?.metadata?.studentId ? dataService.getStudentById(user.metadata.studentId) : null) ||
                  dataService.getStudents().find(s => s.fullName.toLowerCase() === user?.displayName?.toLowerCase());
  const routine = dataService.getRoutine(student?.classId || 'c-9');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          Class Routine & Weekly Timetable
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
          {student?.className || 'Class 9 (Science)'} • Room 101–104 • Academic Year 2025
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-950">Weekly Class Routine</h3>
          <span className="text-xs text-royal font-semibold">Sunday to Thursday (08:30 AM – 02:00 PM)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Period / Time</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Instructor</th>
                <th className="py-3 px-4 font-semibold">Classroom</th>
                <th className="py-3 px-4 font-semibold text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routine.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-royal">
                    {r.startTime} - {r.endTime}
                  </td>
                  <td className="py-3 px-4 font-bold text-navy-950">
                    {r.subjectName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {r.teacherName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {r.roomNumber}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      i < 2 ? 'bg-emerald-100 text-status-green' : 'bg-blue-100 text-royal'
                    }`}>
                      {i < 2 ? 'Attended' : 'Upcoming'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
