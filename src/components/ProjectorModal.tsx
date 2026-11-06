import React from 'react';
import { ProjectorPayload } from '../types/exam';
import { QuestionVisualDiagram } from './QuestionVisualDiagram';

interface ProjectorViewProps {
  payload: ProjectorPayload | null;
  onClose: () => void;
}

export const ProjectorModal: React.FC<ProjectorViewProps> = ({ payload, onClose }) => {
  if (!payload) return null;

  const minutes = Math.floor(payload.timer_remaining_seconds / 60);
  const seconds = payload.timer_remaining_seconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = payload.timer_remaining_seconds <= 30 && payload.timer_remaining_seconds > 0;
  const isExpired = payload.timer_remaining_seconds <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E] flex flex-col p-8 text-neutral-100 overflow-y-auto selection:bg-neutral-800">
      {/* Precision Top Bar */}
      <header className="flex items-center justify-between border-b border-neutral-800/90 pb-4 mb-8">
        <div>
          <div className="font-semibold text-sm tracking-tight text-white flex items-center gap-2">
            <span>HSB3102E Oral Examination</span>
            <span className="text-neutral-500 font-normal">/</span>
            <span className="text-xs text-neutral-400 font-normal">Màn hình phòng thi</span>
          </div>
          <div className="text-xs text-neutral-500 mt-0.5">
            {payload.exam_title || 'Đợt thi vấn đáp giữa kỳ'}
          </div>
        </div>

        {/* Student & Timer Deck */}
        <div className="flex items-center gap-8">
          {payload.student_name ? (
            <div className="text-right">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wide">Thí sinh</div>
              <div className="text-sm font-semibold text-white">
                {payload.student_name}{' '}
                <span className="font-mono text-neutral-400 font-normal">({payload.student_id})</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-neutral-500 italic">Đang chờ thí sinh tiếp theo...</div>
          )}

          {/* Minimalist Laboratory Stopwatch Display */}
          <div
            className={`font-mono text-2xl font-bold tabular-nums px-3.5 py-1 rounded border ${
              isExpired
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : isLowTime
                ? 'border-amber-500 text-amber-300 bg-amber-950/20'
                : 'border-neutral-800 text-neutral-100 bg-neutral-900'
            }`}
          >
            {timeFormatted}
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded border border-neutral-800 transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </header>

      {/* Main Examination Presentation Canvas */}
      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col justify-center my-auto">
        {!payload.active_slot ? (
          <div className="text-center py-20 px-6 border border-neutral-800/80 rounded-lg bg-neutral-900/30">
            <h2 className="text-lg font-semibold text-white mb-1">Phòng thi vấn đáp trực tiếp</h2>
            <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
              Giảng viên sẽ rút câu hỏi ngẫu nhiên khi bạn sẵn sàng. Màn hình chỉ hiển thị đề bài và dữ liệu minh họa.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Slot & Lecture Meta (Clean text without pill badges) */}
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/60 pb-2">
              <span className="font-medium text-neutral-200">
                {payload.question_group_label || `Câu ${payload.active_slot} / 2`}
              </span>
              <span className="font-mono">{payload.lecture_label}</span>
            </div>

            {/* Question Details Presentation */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white leading-relaxed tracking-tight">
                  {payload.prompt_en}
                </h3>
                {payload.prompt_vi && (
                  <p className="text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {payload.prompt_vi}
                  </p>
                )}
              </div>

              {/* Context if any */}
              {payload.context && (
                <div className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded border border-neutral-800/80">
                  <span className="text-neutral-300 font-medium">Ngữ cảnh: </span>
                  {payload.context}
                </div>
              )}

              {/* Visual Diagrams, Schemas and Structured Data */}
              <QuestionVisualDiagram
                snapshot={{
                  lecture_ids: [payload.lecture_label?.replace(/[^0-9]/g, '') || '01'] as any,
                  topic: payload.lecture_label || '',
                  prompt_en: payload.prompt_en || '',
                  prompt_vi: payload.prompt_vi || '',
                  context: payload.context || '',
                  optional_table_or_diagram: payload.optional_table_or_diagram || null,
                  optional_sql: payload.optional_sql || null,
                  question_id: `SLOT_${payload.active_slot}`,
                }}
                isProjector={true}
              />

              {/* Optional Follow-up */}
              {payload.follow_up_visible && payload.optional_follow_up && (
                <div className="p-4 rounded bg-neutral-950 border border-neutral-700 text-neutral-200 space-y-1">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                    Câu hỏi gợi mở mở rộng (Follow-up):
                  </div>
                  <p className="text-sm">{payload.optional_follow_up}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-auto pt-4 border-t border-neutral-900 text-center text-[11px] text-neutral-600">
        Chế độ trình chiếu độc lập: Điểm số, barem đáp án rubric và nhận xét được lưu trữ bảo mật trên màn hình giảng viên.
      </footer>
    </div>
  );
};
