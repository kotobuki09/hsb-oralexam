import React, { useState } from 'react';
import { LectureId, Question } from '../types/exam';
import { LECTURE_CATALOG } from '../utils/examLogic';

interface QuestionBankManagerProps {
  questions: Question[];
  onApproveQuestion: (qId: string) => Promise<void>;
  onBatchApprove: (lectureId: LectureId) => Promise<void>;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  questions,
  onApproveQuestion,
  onBatchApprove,
}) => {
  const [selectedLecture, setSelectedLecture] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredQuestions = questions.filter((q) => {
    if (selectedLecture !== 'ALL' && !q.lecture_ids.includes(selectedLecture as LectureId)) {
      return false;
    }
    if (selectedStatus !== 'ALL' && q.review_status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const match =
        q.prompt_en.toLowerCase().includes(qLower) ||
        q.prompt_vi.toLowerCase().includes(qLower) ||
        q.topic.toLowerCase().includes(qLower) ||
        q.id.toLowerCase().includes(qLower);
      if (!match) return false;
    }
    return true;
  });

  const totalCount = questions.length;
  const approvedCount = questions.filter((q) => q.review_status === 'APPROVED').length;
  const draftCount = questions.filter((q) => q.review_status === 'DRAFT').length;

  return (
    <div className="space-y-4">
      {/* High-Density Statistical Ribbon (Clean metadata, zero gradient cards) */}
      <div className="bg-white rounded-lg border border-neutral-200/90 px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-neutral-500">Tổng số câu hỏi: </span>
            <strong className="text-neutral-900 font-mono font-semibold">{totalCount}</strong>
          </div>
          <span className="text-neutral-300" aria-hidden="true">·</span>
          <div>
            <span className="text-neutral-500">Đã duyệt (APPROVED): </span>
            <strong className="text-emerald-700 font-mono font-semibold">{approvedCount}</strong>
          </div>
          <span className="text-neutral-300" aria-hidden="true">·</span>
          <div>
            <span className="text-neutral-500">Bản nháp (DRAFT): </span>
            <strong className="text-amber-700 font-mono font-semibold">{draftCount}</strong>
          </div>
        </div>

        {selectedLecture !== 'ALL' && (
          <button
            onClick={() => onBatchApprove(selectedLecture as LectureId)}
            className="px-3 py-1 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
          >
            Duyệt toàn bộ Bài {selectedLecture}
          </button>
        )}
      </div>

      {/* Filter and Search Bar (Data table toolbar pattern) */}
      <div className="bg-white px-4 py-2.5 rounded-lg border border-neutral-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo từ khóa, chủ đề, mã câu..."
            className="px-3 py-1 rounded border border-neutral-200 text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-none focus:border-neutral-900 w-64"
          />

          <select
            value={selectedLecture}
            onChange={(e) => setSelectedLecture(e.target.value)}
            className="px-2.5 py-1 rounded border border-neutral-200 font-medium text-neutral-700 bg-neutral-50 focus:outline-none"
          >
            <option value="ALL">Tất cả bài học (01 — 08 & Tích hợp)</option>
            {LECTURE_CATALOG.map((lec) => (
              <option key={lec.id} value={lec.id}>
                {lec.number_label}: {lec.title_en.slice(0, 36)}...
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded border border-neutral-200 font-medium text-neutral-700 bg-neutral-50 focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="APPROVED">Đã duyệt (APPROVED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
          </select>
        </div>

        <div className="text-neutral-400 font-mono text-[11px]">
          Hiển thị {Math.min(filteredQuestions.length, 50)} / {filteredQuestions.length} câu
        </div>
      </div>

      {/* Questions Data Grid (High density, readable typography) */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral-200/90 p-8 text-center text-neutral-500 text-xs">
            Không tìm thấy câu hỏi nào phù hợp với bộ lọc.
          </div>
        ) : (
          filteredQuestions.slice(0, 50).map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-lg border border-neutral-200/80 p-4 space-y-2 text-xs hover:border-neutral-400 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2 text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-900 font-medium">{q.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>Bài {q.lecture_ids.join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-700">
                    {q.question_group === 'A_CONCEPT' ? 'Nhóm A (Bản chất)' : 'Nhóm B (Vận dụng)'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-medium ${
                      q.review_status === 'APPROVED' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {q.review_status}
                  </span>

                  {q.review_status !== 'APPROVED' && (
                    <button
                      onClick={() => onApproveQuestion(q.id)}
                      className="px-2 py-0.5 text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-500 rounded transition-colors"
                    >
                      Duyệt câu
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <p className="font-semibold text-neutral-950 text-sm leading-snug">{q.prompt_en}</p>
                {q.prompt_vi && <p className="text-neutral-600 text-xs">{q.prompt_vi}</p>}
              </div>

              {/* Table or SQL snippet */}
              {q.optional_table_or_diagram && (
                <pre className="p-2.5 bg-neutral-900 text-neutral-200 font-mono text-[11px] rounded overflow-x-auto leading-relaxed">
                  {q.optional_table_or_diagram}
                </pre>
              )}

              {/* Key points */}
              <div className="text-[11px] text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200/60 space-y-0.5">
                <span className="font-medium text-neutral-800">Ý cốt lõi: </span>
                <span>{q.expected_key_points.join(' · ')}</span>
              </div>
            </div>
          ))
        )}

        {filteredQuestions.length > 50 && (
          <div className="text-center text-xs text-neutral-400 italic py-2">
            Đang hiển thị 50 câu đầu tiên. Sử dụng thanh tìm kiếm để lọc câu cụ thể.
          </div>
        )}
      </div>
    </div>
  );
};
