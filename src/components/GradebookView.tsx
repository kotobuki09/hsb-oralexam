import React, { useState } from 'react';
import { Attempt, ExamConfig, Student } from '../types/exam';
import { exportGradebookCsv } from '../utils/examLogic';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Printer } from 'lucide-react';
import { StudentAssessmentModal } from './StudentAssessmentModal';

interface GradebookViewProps {
  exam: ExamConfig;
  students: Student[];
  attempts: Attempt[];
  onUpdateGrade: (
    attemptId: string,
    slot: 1 | 2,
    newScore: number,
    reason: string
  ) => Promise<void>;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  exam,
  students,
  attempts,
  onUpdateGrade,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingAttempt, setEditingAttempt] = useState<Attempt | null>(null);
  const [editSlot, setEditSlot] = useState<1 | 2>(1);
  const [newScoreVal, setNewScoreVal] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [scorecardTarget, setScorecardTarget] = useState<{ attempt: Attempt; student: Student } | null>(null);

  const completedAttempts = attempts.filter((a) => a.exam_id === exam.id && a.status === 'COMPLETED');

  // Statistical calculations
  const validScores = completedAttempts
    .map((a) => a.total_score)
    .filter((s): s is number => s !== null && s !== undefined);

  const completedCount = validScores.length;

  const averageScore =
    completedCount > 0
      ? validScores.reduce((sum, val) => sum + val, 0) / completedCount
      : null;

  const stdDev =
    completedCount > 1 && averageScore !== null
      ? Math.sqrt(
          validScores.reduce((sum, val) => sum + Math.pow(val - averageScore, 2), 0) /
            (completedCount - 1)
        )
      : completedCount === 1
      ? 0
      : null;

  const minScore = completedCount > 0 ? Math.min(...validScores) : null;
  const maxScore = completedCount > 0 ? Math.max(...validScores) : null;
  const passCount = validScores.filter((s) => s >= 5.0).length;
  const passRate = completedCount > 0 ? (passCount / completedCount) * 100 : null;

  // Distribution Bins (5 academic brackets)
  const scoreDistributionData = [
    {
      bin: '0.0–3.9',
      label: 'Kém (F)',
      count: validScores.filter((s) => s < 4.0).length,
    },
    {
      bin: '4.0–5.4',
      label: 'Yếu (D)',
      count: validScores.filter((s) => s >= 4.0 && s < 5.5).length,
    },
    {
      bin: '5.5–6.9',
      label: 'Trung bình (C)',
      count: validScores.filter((s) => s >= 5.5 && s < 7.0).length,
    },
    {
      bin: '7.0–8.4',
      label: 'Khá (B)',
      count: validScores.filter((s) => s >= 7.0 && s < 8.5).length,
    },
    {
      bin: '8.5–10.0',
      label: 'Giỏi / Xuất sắc (A)',
      count: validScores.filter((s) => s >= 8.5).length,
    },
  ];

  const filtered = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return s.full_name.toLowerCase().includes(term) || s.student_id.includes(term);
  });

  const handleDownloadCsv = () => {
    const csvContent = exportGradebookCsv(exam, attempts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BangDiem_HSB3102E_${exam.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEdit = (att: Attempt, slot: 1 | 2) => {
    setEditingAttempt(att);
    setEditSlot(slot);
    const currentScore = slot === 1 ? att.q1_grade?.total_score : att.q2_grade?.total_score;
    setNewScoreVal(currentScore !== null && currentScore !== undefined ? String(currentScore) : '');
    setEditReason('');
  };

  const handleSaveEdit = async () => {
    if (!editingAttempt || !editReason.trim()) {
      alert('Vui lòng nhập lý do sửa điểm.');
      return;
    }
    const parsed = parseFloat(newScoreVal);
    if (isNaN(parsed) || parsed < 0 || parsed > 5) {
      alert('Điểm phải nằm trong khoảng 0 đến 5,0.');
      return;
    }

    await onUpdateGrade(editingAttempt.id, editSlot, parsed, editReason.trim());
    setEditingAttempt(null);
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="bg-white px-5 py-3 rounded-lg border border-neutral-200/90 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-neutral-900">{exam.title}</span>
          <span className="text-neutral-400 ml-2">
            · Hoàn thành {completedAttempts.length} / {students.length} sinh viên
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, MSSV..."
            className="px-2.5 py-1 rounded border border-neutral-200 text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-none focus:border-neutral-900 w-52"
          />

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded transition-colors cursor-pointer"
          >
            Xuất bảng điểm CSV (UTF-8)
          </button>
        </div>
      </div>

      {/* Class Statistics & Score Distribution Section */}
      <div className="bg-white rounded-lg border border-neutral-200/90 p-5 space-y-4">
        <div className="border-b border-neutral-100 pb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Phân phối điểm số & Thống kê lớp học (Score Distribution & Metrics)
            </h2>
            <p className="text-xs text-neutral-500">
              Biểu đồ trực quan hóa phổ điểm thi vấn đáp và các chỉ số thống kê mô tả của lớp thi.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Mẫu thống kê: {completedCount} / {students.length} sinh viên
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Statistical Metric Tiles (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
                Điểm trung bình (Mean)
              </span>
              <div className="mt-1">
                <span className="font-mono text-xl font-bold text-neutral-950">
                  {averageScore !== null ? averageScore.toFixed(2) : '—'}
                </span>
                {averageScore !== null && (
                  <span className="text-xs text-neutral-400 font-mono ml-1">/10</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
                Độ lệch chuẩn (σ)
              </span>
              <div className="mt-1">
                <span className="font-mono text-xl font-bold text-neutral-950">
                  {stdDev !== null ? stdDev.toFixed(2) : '—'}
                </span>
                {stdDev !== null && (
                  <span className="text-[10px] text-neutral-400 ml-1">
                    {stdDev <= 1.0 ? '(Phổ tập trung)' : '(Phổ phân tán)'}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
                Thấp nhất – Cao nhất
              </span>
              <div className="mt-1 font-mono text-sm font-semibold text-neutral-800">
                {minScore !== null && maxScore !== null ? (
                  <span>
                    {minScore.toFixed(2)}đ — {maxScore.toFixed(2)}đ
                  </span>
                ) : (
                  '—'
                )}
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
                Tỷ lệ Đạt (≥ 5,0đ)
              </span>
              <div className="mt-1">
                <span className="font-mono text-base font-bold text-emerald-700">
                  {passRate !== null ? `${passRate.toFixed(1)}%` : '—'}
                </span>
                {passRate !== null && (
                  <span className="text-[11px] font-mono text-neutral-400 ml-1">
                    ({passCount}/{completedCount})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization (8 cols) */}
          <div className="lg:col-span-8 p-3 rounded border border-neutral-200/70 bg-neutral-50/40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1 px-1">
              <span className="font-medium text-neutral-700">Biểu đồ tần số phân bố điểm (Thang 10)</span>
              <span>Đơn vị: Số sinh viên</span>
            </div>

            {completedCount === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-200 rounded">
                <span>Chưa có sinh viên nào hoàn tất thi để tạo phổ điểm.</span>
                <span className="text-[11px] text-neutral-400 mt-1">
                  Điểm số sau khi chấm sẽ tự động cập nhật biểu đồ tại đây.
                </span>
              </div>
            ) : (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis
                      dataKey="bin"
                      stroke="#737373"
                      fontSize={11}
                      tickLine={false}
                      fontFamily="monospace"
                    />
                    <YAxis
                      stroke="#737373"
                      fontSize={11}
                      allowDecimals={false}
                      tickLine={false}
                      fontFamily="monospace"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const pct = completedCount > 0 ? ((data.count / completedCount) * 100).toFixed(1) : '0';
                          return (
                            <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded shadow border border-neutral-800 font-mono">
                              <div className="font-semibold text-neutral-200">
                                {data.bin} ({data.label})
                              </div>
                              <div className="text-neutral-300 text-[11px] mt-1">
                                Số lượng: <strong className="text-white">{data.count}</strong> sinh viên ({pct}%)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" fill="#18181b" radius={[3, 3, 0, 0]}>
                      {scoreDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.count > 0 ? '#18181b' : '#d4d4d8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="bg-white rounded-lg border border-neutral-200/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50/80 text-neutral-600 font-semibold border-b border-neutral-200/80 uppercase tracking-wide text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-medium">MSSV</th>
                <th className="py-2.5 px-4 font-medium">Họ và tên</th>
                <th className="py-2.5 px-4 font-medium">Lớp</th>
                <th className="py-2.5 px-4 font-medium">Câu 1 (Bản chất)</th>
                <th className="py-2.5 px-4 font-medium">Câu 2 (Vận dụng)</th>
                <th className="py-2.5 px-4 font-medium">Tổng điểm (/10)</th>
                <th className="py-2.5 px-4 font-medium">Trạng thái</th>
                <th className="py-2.5 px-4 font-medium text-right">Điều chỉnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((s) => {
                const att = attempts.find(
                  (a) => a.student_id === s.student_id && a.exam_id === exam.id && !a.is_retake
                );

                const q1Score = att?.q1_grade?.total_score;
                const q2Score = att?.q2_grade?.total_score;
                const total = att?.total_score;

                return (
                  <tr key={s.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-neutral-800">
                      {s.student_id}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-neutral-950">
                      {s.full_name}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-500">{s.class_name}</td>
                    <td className="py-2.5 px-4 font-mono">
                      {q1Score !== null && q1Score !== undefined ? (
                        <span>{q1Score.toFixed(2)}đ</span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono">
                      {q2Score !== null && q2Score !== undefined ? (
                        <span>{q2Score.toFixed(2)}đ</span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono">
                      {total !== null && total !== undefined ? (
                        <strong className="font-semibold text-neutral-950">{total.toFixed(2)}đ</strong>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {att ? (
                        <span
                          className={
                            att.status === 'COMPLETED' ? 'text-emerald-700 font-medium' : 'text-neutral-500'
                          }
                        >
                          {att.status === 'COMPLETED' ? 'Hoàn tất' : 'Đang thi'}
                        </span>
                      ) : (
                        <span className="text-neutral-400">Chưa thi</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {att && att.status === 'COMPLETED' && (
                        <div className="flex items-center justify-end gap-2 text-xs">
                          <button
                            onClick={() => setScorecardTarget({ attempt: att, student: s })}
                            className="text-neutral-700 hover:text-neutral-950 font-medium underline flex items-center gap-1 cursor-pointer"
                            title="Xem và in phiếu đánh giá chính thức"
                          >
                            <Printer className="w-3 h-3 text-neutral-500" />
                            <span>In phiếu</span>
                          </button>
                          <span className="text-neutral-300">·</span>
                          <button
                            onClick={() => handleOpenEdit(att, 1)}
                            className="text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                          >
                            Sửa C1
                          </button>
                          <span className="text-neutral-300">·</span>
                          <button
                            onClick={() => handleOpenEdit(att, 2)}
                            className="text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                          >
                            Sửa C2
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Score Modal */}
      {editingAttempt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 space-y-3 border border-neutral-200 shadow-lg text-xs">
            <h3 className="text-sm font-semibold text-neutral-900">
              Sửa điểm Câu {editSlot} — {editingAttempt.student_name}
            </h3>
            <p className="text-neutral-500">
              Mọi chỉnh sửa sau khi hoàn tất bài thi đều được ghi lại vào lịch sử kiểm toán.
            </p>

            <div className="space-y-1">
              <label htmlFor="modal-new-score" className="text-neutral-700 font-medium block">
                Điểm mới (/5,0đ):
              </label>
              <input
                id="modal-new-score"
                type="number"
                step="0.25"
                min="0"
                max="5"
                value={newScoreVal}
                onChange={(e) => setNewScoreVal(e.target.value)}
                className="w-full p-1.5 rounded border border-neutral-300 font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="modal-edit-reason" className="text-neutral-700 font-medium block">
                Lý do điều chỉnh:
              </label>
              <textarea
                id="modal-edit-reason"
                rows={2}
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="Nhập lý do điều chỉnh..."
                className="w-full p-1.5 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingAttempt(null)}
                className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editReason.trim()}
                className="px-3.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded disabled:opacity-40"
              >
                Lưu sửa điểm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Student Assessment Report Card Modal */}
      <StudentAssessmentModal
        isOpen={!!scorecardTarget}
        onClose={() => setScorecardTarget(null)}
        attempt={scorecardTarget?.attempt || null}
        student={scorecardTarget?.student || null}
        exam={exam}
      />
    </div>
  );
};
