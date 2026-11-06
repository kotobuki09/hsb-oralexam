import React from 'react';
import { Attempt, Student, ExamConfig } from '../types/exam';
import { Printer, X, CheckCircle, Award } from 'lucide-react';

interface StudentAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: Attempt | null;
  student: Student | null;
  exam: ExamConfig | null;
}

export function StudentAssessmentModal({
  isOpen,
  onClose,
  attempt,
  student,
  exam,
}: StudentAssessmentModalProps) {
  if (!isOpen || !attempt || !student) return null;

  const totalScore = attempt.total_score ?? 0;

  // Grade mapping
  const getLetterGrade = (score: number) => {
    if (score >= 8.5) return { letter: 'A', gpa: '4.0', label: 'Xuất sắc / Giỏi' };
    if (score >= 8.0) return { letter: 'B+', gpa: '3.5', label: 'Khá giỏi' };
    if (score >= 7.0) return { letter: 'B', gpa: '3.0', label: 'Khá' };
    if (score >= 6.5) return { letter: 'C+', gpa: '2.5', label: 'Trung bình khá' };
    if (score >= 5.5) return { letter: 'C', gpa: '2.0', label: 'Trung bình' };
    if (score >= 5.0) return { letter: 'D+', gpa: '1.5', label: 'Trung bình yếu' };
    if (score >= 4.0) return { letter: 'D', gpa: '1.0', label: 'Yếu (Đạt)' };
    return { letter: 'F', gpa: '0.0', label: 'Kém (Không đạt)' };
  };

  const gradeInfo = getLetterGrade(totalScore);

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-neutral-300 overflow-hidden my-8 print:my-0 print:border-none print:shadow-none">
        {/* Action bar (sticky, hidden on print) */}
        <div className="bg-neutral-900 text-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold tracking-wide">
                Phiếu Đánh Giá Thi Vấn Đáp Cá Nhân (Official Scorecard)
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                {student.student_id} — {student.full_name} · {student.class_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-medium rounded shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In phiếu thi / Lưu PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Content */}
        <div className="p-8 text-neutral-900 font-sans space-y-6 print:p-6 print:space-y-4">
          {/* Official Academic Header */}
          <div className="border-b-2 border-neutral-900 pb-4">
            <div className="flex justify-between items-start text-xs text-neutral-700">
              <div className="text-left font-serif">
                <div className="font-bold uppercase tracking-wider text-neutral-900 text-[13px]">
                  Đại học Quốc gia Hà Nội
                </div>
                <div className="font-semibold uppercase tracking-wide text-neutral-800 text-[11px]">
                  Trường Quản trị và Kinh doanh (HSB)
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Bộ môn Hệ thống Thông tin Quản lý & Công nghệ Dữ liệu
                </div>
              </div>

              <div className="text-right font-serif">
                <div className="font-bold text-neutral-900 text-[12px] uppercase">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[11px] font-semibold text-neutral-800">
                  Độc lập — Tự do — Hạnh phúc
                </div>
                <div className="text-[10px] text-neutral-400 italic mt-0.5">
                  Số phiếu: {attempt.id.slice(0, 16).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="text-lg font-bold tracking-tight uppercase text-neutral-950 font-serif">
                PHIẾU ĐÁNH GIÁ THI VẤN ĐÁP GIỮA KỲ
              </h1>
              <p className="text-xs text-neutral-700 font-medium mt-1">
                Học phần: <span className="font-bold text-neutral-900">HSB3102E — Database Design & Development</span> (3 tín chỉ)
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Kỳ thi: {exam?.title || 'Thi vấn đáp giữa kỳ'} · Học kỳ 1 — Năm học 2026-2027
              </p>
            </div>
          </div>

          {/* Student Profile & Meta Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-neutral-50 border border-neutral-200 rounded text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-sans">Họ và tên thí sinh</span>
              <strong className="text-neutral-900 text-[13px]">{student.full_name}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-sans">Mã số sinh viên (MSSV)</span>
              <strong className="text-neutral-900 text-[13px]">{student.student_id}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-sans">Lớp học phần</span>
              <span className="text-neutral-800 font-semibold">{student.class_name}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-sans">Thời điểm hoàn tất</span>
              <span className="text-neutral-700">
                {attempt.completed_at
                  ? new Date(attempt.completed_at).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'Đang tiến hành'}
              </span>
            </div>
          </div>

          {/* Question 1 Evaluation Section */}
          <div className="border border-neutral-300 rounded p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-900 text-white text-[11px] font-bold rounded">
                  CÂU 1
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  Hiểu bản chất & Cơ chế cốt lõi (Tối đa 5,0 điểm)
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-neutral-900">
                {attempt.q1_grade?.total_score !== null && attempt.q1_grade?.total_score !== undefined
                  ? `${attempt.q1_grade.total_score.toFixed(2)} / 5.00 đ`
                  : '—'}
              </div>
            </div>

            {attempt.q1_assignment ? (
              <div className="space-y-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-[11px] font-mono text-neutral-500 mb-1">
                    {attempt.q1_assignment.snapshot.question_id} · Bài {attempt.q1_assignment.snapshot.lecture_ids.join(', ')} — {attempt.q1_assignment.snapshot.topic}
                  </div>
                  <div className="font-medium text-neutral-900">
                    {attempt.q1_assignment.snapshot.prompt_vi || attempt.q1_assignment.snapshot.prompt_en}
                  </div>
                </div>

                {/* Rubric Criteria Breakdown */}
                {attempt.q1_grade && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-neutral-200 text-[11px]">
                      <thead>
                        <tr className="bg-neutral-100 text-neutral-700">
                          <th className="p-1.5 border border-neutral-200">Tiêu chí đánh giá</th>
                          <th className="p-1.5 border border-neutral-200 w-24 text-right">Mức chuẩn</th>
                          <th className="p-1.5 border border-neutral-200 w-24 text-right">Điểm đạt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attempt.q1_assignment.snapshot.rubric.map((crit) => {
                          const score = attempt.q1_grade?.criterion_scores.find(
                            (cs) => cs.criterion_id === crit.id
                          )?.score;
                          return (
                            <tr key={crit.id} className="border-b border-neutral-200">
                              <td className="p-1.5 border border-neutral-200">
                                <span className="font-semibold text-neutral-800">{crit.name_vi}</span>
                                <span className="text-neutral-500 block text-[10px] leading-tight">
                                  {crit.level_descriptions.full}
                                </span>
                              </td>
                              <td className="p-1.5 border border-neutral-200 text-right font-mono">
                                {crit.max_points.toFixed(2)}đ
                              </td>
                              <td className="p-1.5 border border-neutral-200 text-right font-mono font-bold text-neutral-900">
                                {score !== null && score !== undefined ? `${score.toFixed(2)}đ` : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {attempt.q1_grade?.instructor_notes && (
                  <div className="text-[11px] text-neutral-600 bg-neutral-50 p-2 rounded border border-neutral-200">
                    <span className="font-semibold text-neutral-700">Nhận xét của giảng viên: </span>
                    {attempt.q1_grade.instructor_notes}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">Chưa rút đề Câu 1</p>
            )}
          </div>

          {/* Question 2 Evaluation Section */}
          <div className="border border-neutral-300 rounded p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-900 text-white text-[11px] font-bold rounded">
                  CÂU 2
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  Vận dụng, Phân tích & Tình huống thực tế (Tối đa 5,0 điểm)
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-neutral-900">
                {attempt.q2_grade?.total_score !== null && attempt.q2_grade?.total_score !== undefined
                  ? `${attempt.q2_grade.total_score.toFixed(2)} / 5.00 đ`
                  : '—'}
              </div>
            </div>

            {attempt.q2_assignment ? (
              <div className="space-y-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200">
                  <div className="text-[11px] font-mono text-neutral-500 mb-1">
                    {attempt.q2_assignment.snapshot.question_id} · Bài {attempt.q2_assignment.snapshot.lecture_ids.join(', ')} — {attempt.q2_assignment.snapshot.topic}
                  </div>
                  <div className="font-medium text-neutral-900">
                    {attempt.q2_assignment.snapshot.prompt_vi || attempt.q2_assignment.snapshot.prompt_en}
                  </div>
                </div>

                {/* Rubric Criteria Breakdown */}
                {attempt.q2_grade && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-neutral-200 text-[11px]">
                      <thead>
                        <tr className="bg-neutral-100 text-neutral-700">
                          <th className="p-1.5 border border-neutral-200">Tiêu chí đánh giá</th>
                          <th className="p-1.5 border border-neutral-200 w-24 text-right">Mức chuẩn</th>
                          <th className="p-1.5 border border-neutral-200 w-24 text-right">Điểm đạt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attempt.q2_assignment.snapshot.rubric.map((crit) => {
                          const score = attempt.q2_grade?.criterion_scores.find(
                            (cs) => cs.criterion_id === crit.id
                          )?.score;
                          return (
                            <tr key={crit.id} className="border-b border-neutral-200">
                              <td className="p-1.5 border border-neutral-200">
                                <span className="font-semibold text-neutral-800">{crit.name_vi}</span>
                                <span className="text-neutral-500 block text-[10px] leading-tight">
                                  {crit.level_descriptions.full}
                                </span>
                              </td>
                              <td className="p-1.5 border border-neutral-200 text-right font-mono">
                                {crit.max_points.toFixed(2)}đ
                              </td>
                              <td className="p-1.5 border border-neutral-200 text-right font-mono font-bold text-neutral-900">
                                {score !== null && score !== undefined ? `${score.toFixed(2)}đ` : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {attempt.q2_grade?.instructor_notes && (
                  <div className="text-[11px] text-neutral-600 bg-neutral-50 p-2 rounded border border-neutral-200">
                    <span className="font-semibold text-neutral-700">Nhận xét của giảng viên: </span>
                    {attempt.q2_grade.instructor_notes}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">Chưa rút đề Câu 2</p>
            )}
          </div>

          {/* Grand Summary & Classification Block */}
          <div className="p-4 bg-neutral-900 text-white rounded-lg flex flex-wrap items-center justify-between gap-4 print:bg-white print:text-neutral-900 print:border-2 print:border-neutral-900">
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider print:text-neutral-600">
                Tổng Kết Quả Đánh Giá
              </div>
              <div className="text-xs mt-1 text-neutral-300 print:text-neutral-800">
                Xếp loại học lực: <strong className="text-white print:text-neutral-950 text-sm">{gradeInfo.label}</strong> (Thang điểm 4: {gradeInfo.gpa})
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block print:text-neutral-600">Điểm chữ</span>
                <span className="text-2xl font-bold font-mono text-amber-400 print:text-neutral-950">
                  {gradeInfo.letter}
                </span>
              </div>
              <div className="text-right border-l border-neutral-700 pl-6 print:border-neutral-400">
                <span className="text-[11px] text-neutral-400 block print:text-neutral-600">Tổng điểm (Thang 10)</span>
                <span className="text-3xl font-extrabold font-mono text-white print:text-neutral-950">
                  {totalScore.toFixed(2)} <span className="text-sm font-normal text-neutral-400 print:text-neutral-600">/ 10,0</span>
                </span>
              </div>
            </div>
          </div>

          {/* Examiner Signatures Block */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs font-serif print:pt-12">
            <div className="space-y-16">
              <div>
                <div className="font-bold text-neutral-900 uppercase">Thí sinh xác nhận điểm</div>
                <div className="text-[11px] text-neutral-500 italic">(Ký và ghi rõ họ tên)</div>
              </div>
              <div className="border-t border-neutral-300 w-36 mx-auto pt-1 font-sans text-[11px] text-neutral-700">
                {student.full_name}
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <div className="font-bold text-neutral-900 uppercase">Cán bộ chấm thi 2</div>
                <div className="text-[11px] text-neutral-500 italic">(Ký và ghi rõ họ tên)</div>
              </div>
              <div className="border-t border-neutral-300 w-36 mx-auto pt-1 font-sans text-[11px] text-neutral-700">
                (Ký tên)
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <div className="font-bold text-neutral-900 uppercase">Cán bộ chấm thi 1</div>
                <div className="text-[11px] text-neutral-500 italic">(Ký và ghi rõ họ tên)</div>
              </div>
              <div className="border-t border-neutral-300 w-36 mx-auto pt-1 font-sans text-[11px] text-neutral-700">
                {exam?.grader_name || 'TS. Nguyễn'}
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-neutral-400 pt-6 border-t border-neutral-200 print:pt-4">
            HSB3102E Oral Exam Studio · Dữ liệu được mã hóa và lưu trữ bảo mật trên hệ thống máy chủ khảo thí
          </div>
        </div>
      </div>
    </div>
  );
}
