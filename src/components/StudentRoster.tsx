import React, { useState } from 'react';
import { Attempt, Student } from '../types/exam';
import { parseStudentCsv } from '../utils/examLogic';

interface StudentRosterProps {
  students: Student[];
  attempts?: Attempt[];
  onAddStudent: (student: Student) => Promise<void>;
  onBatchAddStudents: (students: Student[]) => Promise<void>;
  onSelectStudentForExam?: (studentId: string) => void;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
  students,
  attempts = [],
  onAddStudent,
  onBatchAddStudents,
  onSelectStudentForExam,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [showCsvHelp, setShowCsvHelp] = useState(false);

  // Form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('HSB3102E-01');
  const [newEmail, setNewEmail] = useState('');
  const [csvResultMsg, setCsvResultMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredStudents = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return s.student_id.toLowerCase().includes(term) || s.full_name.toLowerCase().includes(term) || s.class_name.toLowerCase().includes(term);
  });

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newId.trim();
    const cleanName = newName.trim();
    if (!cleanId || !cleanName) return;

    // Duplicate check
    if (students.some((s) => s.student_id === cleanId)) {
      setCsvResultMsg({
        type: 'error',
        message: `Mã sinh viên ${cleanId} đã tồn tại trong danh sách!`,
      });
      return;
    }

    const stu: Student = {
      id: `STU_${cleanId}`,
      student_id: cleanId, // preserves leading zero explicitly
      full_name: cleanName,
      class_id: 'CLASS_HSB3102E_01',
      class_name: newClass.trim() || 'HSB3102E-01',
      email: newEmail.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    await onAddStudent(stu);
    setNewId('');
    setNewName('');
    setNewEmail('');
    setIsAddFormOpen(false);
    setCsvResultMsg({
      type: 'success',
      message: `Đã thêm sinh viên ${cleanName} (${cleanId}).`,
    });
    setTimeout(() => setCsvResultMsg(null), 3000);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const res = parseStudentCsv(text, students);
      if (res.validStudents.length > 0) {
        await onBatchAddStudents(res.validStudents);
        setCsvResultMsg({
          type: 'success',
          message: `Đã nhập thành công ${res.validStudents.length} sinh viên mới! ${
            res.errors.length > 0 ? `(${res.errors.length} dòng lỗi/trùng bị bỏ qua)` : ''
          }`,
        });
      } else {
        setCsvResultMsg({
          type: 'error',
          message: `Không thể nhập sinh viên: ${res.errors[0]?.message || 'File trống hoặc sai cấu trúc'}`,
        });
      }
      setTimeout(() => setCsvResultMsg(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const completedCount = attempts.filter((a) => a.status === 'COMPLETED').length;

  return (
    <div className="space-y-4">
      {/* Precision Tabular Header & Action Bar */}
      <div className="bg-white px-5 py-3 rounded-lg border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-neutral-900">Danh sách sinh viên</span>
          <span className="text-neutral-400 font-mono text-xs">
            · Tổng: <strong className="text-neutral-800 font-semibold">{students.length}</strong> sinh viên
            (Đã thi: <strong className="text-emerald-700 font-semibold">{completedCount}</strong>)
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo MSSV, Họ tên..."
            className="px-2.5 py-1 rounded border border-neutral-200 text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-none focus:border-neutral-900 w-52 text-xs"
          />

          <button
            onClick={() => setShowCsvHelp(!showCsvHelp)}
            className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded transition-colors text-xs"
            title="Định dạng file CSV mẫu"
          >
            Mẫu CSV
          </button>

          <label className="px-3 py-1 border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-800 font-medium rounded transition-colors cursor-pointer text-xs">
            <span>Nhập CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>

          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="px-3.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded transition-colors text-xs"
          >
            {isAddFormOpen ? 'Đóng form' : '+ Thêm sinh viên'}
          </button>
        </div>
      </div>

      {/* CSV Format Helper Box */}
      {showCsvHelp && (
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 text-xs space-y-2">
          <div className="font-semibold text-neutral-900">Cấu trúc file CSV chuẩn:</div>
          <p className="text-neutral-600">
            Hệ thống hỗ trợ phân cách bằng dấu phẩy (<code>,</code>) hoặc chấm phẩy (<code>;</code>). Số 0 ở đầu mã sinh viên được bảo toàn nguyên vẹn (ví dụ <code>00231088</code>).
          </p>
          <pre className="bg-neutral-900 text-neutral-100 font-mono text-[11px] p-2.5 rounded overflow-x-auto">
{`student_id,full_name,class_name,email
00231001,Nguyễn Văn An,HSB3102E-01,an.nv@campus.edu.vn
00231002,Trần Thị Bình,HSB3102E-01,binh.tt@campus.edu.vn`}
          </pre>
        </div>
      )}

      {/* Inline Feedback Banner */}
      {csvResultMsg && (
        <div
          className={`px-4 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-between ${
            csvResultMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <span>{csvResultMsg.message}</span>
          <button
            onClick={() => setCsvResultMsg(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Add Form Drawer */}
      {isAddFormOpen && (
        <form
          onSubmit={handleManualAdd}
          className="bg-white p-4 rounded-lg border border-neutral-200/90 shadow-xs space-y-3"
        >
          <div className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
            Thêm sinh viên mới vào lớp
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="MSSV (ví dụ: 00231099)"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="text-xs p-2 rounded border border-neutral-300 font-mono focus:outline-none focus:border-neutral-900"
              required
            />
            <input
              type="text"
              placeholder="Họ và tên sinh viên"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
              required
            />
            <input
              type="text"
              placeholder="Lớp (ví dụ: HSB3102E-01)"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
            <input
              type="email"
              placeholder="Email sinh viên (tùy chọn)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1 text-xs bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded transition-colors"
            >
              Lưu sinh viên
            </button>
          </div>
        </form>
      )}

      {/* High-Density Roster Table */}
      <div className="bg-white rounded-lg border border-neutral-200/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50/80 text-neutral-600 font-semibold border-b border-neutral-200/80 uppercase tracking-wide text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-medium w-32">MSSV</th>
                <th className="py-2.5 px-4 font-medium">Họ và tên</th>
                <th className="py-2.5 px-4 font-medium">Lớp</th>
                <th className="py-2.5 px-4 font-medium">Email</th>
                <th className="py-2.5 px-4 font-medium">Tình trạng thi</th>
                <th className="py-2.5 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Không tìm thấy sinh viên phù hợp với từ khóa "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const studentAttempt = attempts.find(
                    (a) => a.student_id === s.student_id && !a.is_retake
                  );
                  const isCompleted = studentAttempt?.status === 'COMPLETED';
                  const isInProgress = studentAttempt && !isCompleted;

                  return (
                    <tr key={s.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-neutral-900">
                        {s.student_id}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-neutral-950">
                        {s.full_name}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-500 font-mono text-[11px]">
                        {s.class_name}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-500 font-mono text-[11px]">
                        {s.email || '—'}
                      </td>
                      <td className="py-2.5 px-4">
                        {isCompleted ? (
                          <span className="text-emerald-700 font-medium">
                            Đã thi · <strong className="font-mono">{studentAttempt.total_score}đ</strong>
                          </span>
                        ) : isInProgress ? (
                          <span className="text-amber-700 font-medium">Đang thi</span>
                        ) : (
                          <span className="text-neutral-400">Chưa thi</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {onSelectStudentForExam && (
                          <button
                            onClick={() => onSelectStudentForExam(s.student_id)}
                            className="text-xs text-neutral-600 hover:text-neutral-950 underline transition-colors"
                          >
                            {isCompleted ? 'Xem lượt thi' : 'Vào thi ngay'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
