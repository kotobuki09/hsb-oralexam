import React, { useState } from 'react';
import {
  Attempt,
  DisplayLanguage,
  ExamConfig,
  Grade,
  Question,
  QuestionAssignment,
  QuestionSnapshot,
  Student,
} from '../types/exam';
import {
  canFinalizeAttempt,
  computeQuestionTotalScore,
  drawAndLockQuestionPair,
  revealLockedQuestion2,
  replaceAssignedQuestion,
} from '../utils/examLogic';
import { QuestionVisualDiagram } from './QuestionVisualDiagram';
import { QuestionDrawModal } from './QuestionDrawModal';
import { StudentAssessmentModal } from './StudentAssessmentModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { soundEffects } from '../utils/soundEffects';
import { Volume2, VolumeX, Keyboard, Printer, Zap, RotateCcw } from 'lucide-react';

interface ExamRoomProps {
  exam: ExamConfig;
  students: Student[];
  attempts: Attempt[];
  questions: Question[];
  onSaveAttempt: (attempt: Attempt) => Promise<void>;
  onOpenProjector: (attempt: Attempt, slot: 1 | 2, timerRemaining: number) => void;
  language: DisplayLanguage;
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  exam,
  students,
  attempts,
  questions,
  onSaveAttempt,
  onOpenProjector,
  language,
  selectedStudentId: controlledStudentId,
  onSelectStudentId,
}) => {
  const [internalStudentId, setInternalStudentId] = useState<string>(
    controlledStudentId || students[0]?.student_id || ''
  );

  const selectedStudentId = controlledStudentId || internalStudentId;

  const handleStudentChange = (newId: string) => {
    setInternalStudentId(newId);
    if (onSelectStudentId) {
      onSelectStudentId(newId);
    }
  };

  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [timerRemaining, setTimerRemaining] = useState<number>(exam.default_time_limit_seconds || 120);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [showFollowUp, setShowFollowUp] = useState<boolean>(false);
  const [replaceReasonModalOpen, setReplaceReasonModalOpen] = useState<boolean>(false);
  const [replaceReasonText, setReplaceReasonText] = useState<string>('');
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Selected student
  const currentStudent = students.find((s) => s.student_id === selectedStudentId);

  // Existing attempt for selected student in current exam
  const existingAttempt = attempts.find(
    (a) => a.exam_id === exam.id && a.student_id === selectedStudentId && !a.is_retake
  );

  // Active attempt state
  const [attemptState, setAttemptState] = useState<Attempt | null>(existingAttempt || null);

  // Sync attemptState when student selection changes
  const prevStudentIdRef = React.useRef(selectedStudentId);
  React.useEffect(() => {
    const att = attempts.find(
      (a) => a.exam_id === exam.id && a.student_id === selectedStudentId && !a.is_retake
    );
    setAttemptState(att || null);

    // Only reset view and timer if the student actually changed
    if (prevStudentIdRef.current !== selectedStudentId) {
      prevStudentIdRef.current = selectedStudentId;
      setTimerRemaining(exam.default_time_limit_seconds || 120);
      setTimerRunning(false);
      setActiveSlot(1);
      setShowFollowUp(false);
      setSaveStatusMsg(null);
    }
  }, [selectedStudentId, exam.id, attempts]);

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => soundEffects.getMuted());
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);

  // Timer interval
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev === 11) {
            soundEffects.playCountdownWarning();
          }
          if (prev <= 1) {
            setTimerRunning(false);
            soundEffects.playTimeUpAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  // Update projector when state changes
  React.useEffect(() => {
    if (attemptState) {
      onOpenProjector(attemptState, activeSlot, timerRemaining);
    }
  }, [attemptState, activeSlot, timerRemaining]);

  // Question Draw Animation Modal state
  const [drawModal, setDrawModal] = useState<{
    isOpen: boolean;
    slot: 1 | 2;
    targetQuestion: QuestionSnapshot | null;
    pendingAttempt: Attempt | null;
  }>({
    isOpen: false,
    slot: 1,
    targetQuestion: null,
    pendingAttempt: null,
  });

  const handleStartDrawQ1 = async () => {
    if (!currentStudent) return;

    // Create or use attempt
    const baseAttempt: Attempt = attemptState || {
      id: `ATT_${exam.id}_${currentStudent.student_id}_1`,
      exam_id: exam.id,
      student_record_id: currentStudent.id,
      student_id: currentStudent.student_id,
      student_name: currentStudent.full_name,
      class_name: currentStudent.class_name,
      is_retake: false,
      attempt_number: 1,
      status: 'IN_PROGRESS',
      active_slot: 1,
      q1_assignment: null,
      q2_assignment: null,
      q1_grade: null,
      q2_grade: null,
      total_score: null,
      general_comment: '',
      timer_remaining_seconds: exam.default_time_limit_seconds || 120,
      grade_edit_history: [],
      started_at: new Date().toISOString(),
      completed_at: null,
      updated_at: new Date().toISOString(),
    };

    const drawRes = drawAndLockQuestionPair(baseAttempt, questions, exam, attempts);
    if (!drawRes.ok || !drawRes.q1_assignment) {
      alert(drawRes.error_reason || 'Không thể rút câu hỏi. Vui lòng kiểm tra sức chứa ngân hàng.');
      return;
    }

    const q1Grade: Grade = {
      question_slot: 1,
      question_id: drawRes.q1_assignment.question_id,
      criterion_scores: drawRes.q1_assignment.snapshot.rubric.map((c) => ({
        criterion_id: c.id,
        score: null,
      })),
      total_score: null,
      instructor_notes: '',
      answer_evidence: '',
      follow_up_used: false,
      graded_by: exam.grader_name,
      graded_at: null,
    };

    const updated: Attempt = {
      ...baseAttempt,
      status: 'IN_PROGRESS',
      active_slot: 1,
      q1_assignment: drawRes.q1_assignment,
      q2_assignment: drawRes.q2_assignment,
      q1_grade: q1Grade,
      updated_at: new Date().toISOString(),
    };

    // Open high-tech lottery draw animation before locking desk
    setDrawModal({
      isOpen: true,
      slot: 1,
      targetQuestion: drawRes.q1_assignment.snapshot,
      pendingAttempt: updated,
    });
  };

  const handleRevealQ2 = async () => {
    if (!attemptState || !attemptState.q2_assignment) return;

    const revealRes = revealLockedQuestion2(attemptState);
    if (!revealRes.ok || !revealRes.q2_assignment) {
      alert(revealRes.error_reason || 'Không thể mở Câu 2.');
      return;
    }

    const q2Grade: Grade = attemptState.q2_grade || {
      question_slot: 2,
      question_id: revealRes.q2_assignment.question_id,
      criterion_scores: revealRes.q2_assignment.snapshot.rubric.map((c) => ({
        criterion_id: c.id,
        score: null,
      })),
      total_score: null,
      instructor_notes: '',
      answer_evidence: '',
      follow_up_used: false,
      graded_by: exam.grader_name,
      graded_at: null,
    };

    const updated: Attempt = {
      ...attemptState,
      active_slot: 2,
      q2_assignment: revealRes.q2_assignment,
      q2_grade: q2Grade,
      updated_at: new Date().toISOString(),
    };

    // Open high-tech lottery draw animation for Q2
    setDrawModal({
      isOpen: true,
      slot: 2,
      targetQuestion: revealRes.q2_assignment.snapshot,
      pendingAttempt: updated,
    });
  };

  const handleConfirmDraw = async () => {
    if (!drawModal.pendingAttempt || !drawModal.targetQuestion) {
      setDrawModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }
    const att = drawModal.pendingAttempt;
    const timeLimit = drawModal.targetQuestion.time_limit_seconds || 120;
    setAttemptState(att);
    setActiveSlot(drawModal.slot);
    setTimerRemaining(timeLimit);
    setTimerRunning(true);
    setDrawModal((prev) => ({ ...prev, isOpen: false }));
    await onSaveAttempt(att);
  };

  // Grade criterion change
  const handleScoreChange = (slot: 1 | 2, criterionId: string, scoreVal: number) => {
    if (!attemptState) return;

    const targetGrade = slot === 1 ? attemptState.q1_grade : attemptState.q2_grade;
    const targetAssignment = slot === 1 ? attemptState.q1_assignment : attemptState.q2_assignment;
    if (!targetGrade || !targetAssignment) return;

    const updatedCriterionScores = targetGrade.criterion_scores.map((cs) =>
      cs.criterion_id === criterionId ? { ...cs, score: scoreVal } : cs
    );

    const check = computeQuestionTotalScore(
      updatedCriterionScores,
      targetAssignment.snapshot.rubric
    );

    const updatedGrade: Grade = {
      ...targetGrade,
      criterion_scores: updatedCriterionScores,
      total_score: check.total,
      graded_at: new Date().toISOString(),
    };

    const updatedAttempt: Attempt = {
      ...attemptState,
      ...(slot === 1 ? { q1_grade: updatedGrade } : { q2_grade: updatedGrade }),
      updated_at: new Date().toISOString(),
    };

    setAttemptState(updatedAttempt);
  };

  // Fast Rubric Preset (100%, 80%, 60%, 0%)
  const handleApplyPreset = (slot: 1 | 2, pct: number) => {
    if (!attemptState) return;
    const targetGrade = slot === 1 ? attemptState.q1_grade : attemptState.q2_grade;
    const targetAssignment = slot === 1 ? attemptState.q1_assignment : attemptState.q2_assignment;
    if (!targetGrade || !targetAssignment) return;

    const rubric = targetAssignment.snapshot.rubric;
    const updatedCriterionScores = rubric.map((crit) => {
      const raw = crit.max_points * pct;
      const score = Math.round(raw / 0.25) * 0.25;
      return {
        criterion_id: crit.id,
        score: Math.min(crit.max_points, Math.max(0, score)),
      };
    });

    const check = computeQuestionTotalScore(
      updatedCriterionScores,
      targetAssignment.snapshot.rubric
    );

    const updatedGrade: Grade = {
      ...targetGrade,
      criterion_scores: updatedCriterionScores,
      total_score: check.total,
      graded_at: new Date().toISOString(),
    };

    const updatedAttempt: Attempt = {
      ...attemptState,
      ...(slot === 1 ? { q1_grade: updatedGrade } : { q2_grade: updatedGrade }),
      updated_at: new Date().toISOString(),
    };

    setAttemptState(updatedAttempt);
  };

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setTimerRunning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setTimerRunning(false);
        setTimerRemaining(exam.default_time_limit_seconds || 120);
      } else if (e.key === '1') {
        setActiveSlot(1);
      } else if (e.key === '2') {
        if (attemptState?.q2_assignment?.revealed) {
          setActiveSlot(2);
        }
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        const currentAssign =
          activeSlot === 1 ? attemptState?.q1_assignment : attemptState?.q2_assignment;
        if (currentAssign) {
          setDrawModal({
            isOpen: true,
            slot: activeSlot,
            targetQuestion: currentAssign.snapshot,
            pendingAttempt: null,
          });
        }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const next = soundEffects.toggleMute();
        setIsSoundMuted(next);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setShowFollowUp((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exam.default_time_limit_seconds, attemptState, activeSlot]);

  // Notes and evidence change
  const handleNotesChange = (slot: 1 | 2, notes: string) => {
    if (!attemptState) return;
    const targetGrade = slot === 1 ? attemptState.q1_grade : attemptState.q2_grade;
    if (!targetGrade) return;

    const updatedGrade: Grade = {
      ...targetGrade,
      instructor_notes: notes,
      graded_at: new Date().toISOString(),
    };

    setAttemptState({
      ...attemptState,
      ...(slot === 1 ? { q1_grade: updatedGrade } : { q2_grade: updatedGrade }),
    });
  };

  // Replace Question
  const handleConfirmReplace = async () => {
    if (!attemptState || !replaceReasonText.trim()) return;

    const repRes = replaceAssignedQuestion(
      attemptState,
      activeSlot,
      replaceReasonText,
      exam.grader_name,
      questions,
      exam,
      attempts
    );

    if (!repRes.ok || !repRes.updated_assignment) {
      alert(repRes.error_reason || 'Không thể đổi câu hỏi.');
      return;
    }

    const resetGrade: Grade = {
      question_slot: activeSlot,
      question_id: repRes.updated_assignment.question_id,
      criterion_scores: repRes.updated_assignment.snapshot.rubric.map((c) => ({
        criterion_id: c.id,
        score: null,
      })),
      total_score: null,
      instructor_notes: '',
      answer_evidence: `[Đã đổi câu hỏi]: Lý do: ${replaceReasonText.trim()}`,
      follow_up_used: false,
      graded_by: exam.grader_name,
      graded_at: null,
    };

    const updatedAttempt: Attempt = {
      ...attemptState,
      ...(activeSlot === 1
        ? { q1_assignment: repRes.updated_assignment, q1_grade: resetGrade }
        : { q2_assignment: repRes.updated_assignment, q2_grade: resetGrade }),
      updated_at: new Date().toISOString(),
    };

    setAttemptState(updatedAttempt);
    setReplaceReasonModalOpen(false);
    setReplaceReasonText('');
    setTimerRemaining(repRes.updated_assignment.snapshot.time_limit_seconds || 120);
    setTimerRunning(true);
    await onSaveAttempt(updatedAttempt);
  };

  // Save draft
  const handleSaveDraft = async () => {
    if (!attemptState) return;
    setIsSaving(true);
    try {
      await onSaveAttempt(attemptState);
      setSaveStatusMsg('Đã lưu nháp');
      setTimeout(() => setSaveStatusMsg(null), 2500);
    } catch {
      setSaveStatusMsg('Lỗi lưu dữ liệu');
    } finally {
      setIsSaving(false);
    }
  };

  // Finalize attempt
  const handleFinalize = async () => {
    if (!attemptState) return;

    const check = canFinalizeAttempt(attemptState);
    if (!check.allowed || check.totalScore === null) {
      alert(`Chưa thể hoàn tất: ${check.reason}`);
      return;
    }

    const finalized: Attempt = {
      ...attemptState,
      status: 'COMPLETED',
      total_score: check.totalScore,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      await onSaveAttempt(finalized);
      setAttemptState(finalized);
      setSaveStatusMsg('Đã hoàn tất bài thi');
      setTimeout(() => setSaveStatusMsg(null), 3000);
    } catch {
      alert('Không thể lưu kết quả bài thi!');
    } finally {
      setIsSaving(false);
    }
  };

  const currentAssignment =
    activeSlot === 1 ? attemptState?.q1_assignment : attemptState?.q2_assignment;
  const currentGrade = activeSlot === 1 ? attemptState?.q1_grade : attemptState?.q2_grade;

  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentStudentIndex = students.findIndex((s) => s.student_id === selectedStudentId);
  const hasPrevStudent = currentStudentIndex > 0;
  const hasNextStudent = currentStudentIndex >= 0 && currentStudentIndex < students.length - 1;

  return (
    <div className="space-y-4">
      {/* Precision Candidate Toolbar (Single-line, high density) */}
      <div className="bg-white rounded-lg border border-neutral-200/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="student-selector" className="text-xs text-neutral-500 font-medium">
            Thí sinh:
          </label>
          <select
            id="student-selector"
            value={selectedStudentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="px-2.5 py-1 rounded border border-neutral-300 text-xs font-medium text-neutral-900 bg-white focus:outline-none focus:border-neutral-900"
          >
            {students.map((s) => {
              const att = attempts.find((a) => a.student_id === s.student_id && a.exam_id === exam.id);
              const tag = att?.status === 'COMPLETED' ? ' ✓ Đã thi' : att ? ' · Đang thi' : '';
              return (
                <option key={s.id} value={s.student_id}>
                  {s.student_id} — {s.full_name} ({s.class_name}){tag}
                </option>
              );
            })}
          </select>

          {/* Quick Prev / Next Candidate Controls */}
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-2 ml-1">
            <button
              onClick={() => hasPrevStudent && handleStudentChange(students[currentStudentIndex - 1].student_id)}
              disabled={!hasPrevStudent}
              title="Thí sinh trước"
              className="px-2 py-1 text-xs rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ← Trước
            </button>
            <button
              onClick={() => hasNextStudent && handleStudentChange(students[currentStudentIndex + 1].student_id)}
              disabled={!hasNextStudent}
              title="Thí sinh kế tiếp"
              className="px-2 py-1 text-xs rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Sau →
            </button>
          </div>
        </div>

        {/* Status text and action tools */}
        <div className="flex items-center gap-3 text-xs">
          {attemptState ? (
            <span className="text-neutral-600">
              Trạng thái:{' '}
              <strong className="text-neutral-900 font-semibold">
                {attemptState.status === 'COMPLETED'
                  ? `Đã hoàn tất (${attemptState.total_score}/10đ)`
                  : 'Đang thi vấn đáp'}
              </strong>
            </span>
          ) : (
            <span className="text-neutral-500">Chưa bắt đầu lượt thi</span>
          )}

          {saveStatusMsg && (
            <>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">{saveStatusMsg}</span>
            </>
          )}

          {/* Quick Tools: Print Scorecard, Sound Toggle, Shortcuts */}
          <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-2">
            {attemptState && (
              <button
                type="button"
                onClick={() => setIsAssessmentModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-2xs transition-colors cursor-pointer"
                title="In phiếu thi / Xem bảng điểm cá nhân chi tiết"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-600" />
                <span>In phiếu điểm</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const next = soundEffects.toggleMute();
                setIsSoundMuted(next);
              }}
              className="p-1 text-neutral-600 hover:text-neutral-900 rounded border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
              title={isSoundMuted ? 'Bật âm thanh (Phím M)' : 'Tắt âm thanh (Phím M)'}
            >
              {isSoundMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="p-1 text-neutral-600 hover:text-neutral-900 rounded border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
              title="Phím tắt thao tác (Phím ?)"
            >
              <Keyboard className="w-3.5 h-3.5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Examination Desk */}
      {!attemptState?.q1_assignment ? (
        // Start State (Clean unboxed academic stage)
        <div className="bg-white rounded-lg border border-neutral-200/90 p-12 text-center max-w-lg mx-auto my-8">
          <h2 className="text-base font-semibold text-neutral-950 mb-1">
            Bắt đầu lượt thi: {currentStudent?.full_name}
          </h2>
          <div className="text-xs text-neutral-500 mb-6 flex items-center justify-center gap-2">
            <span>MSSV: {currentStudent?.student_id}</span>
            <span aria-hidden="true">·</span>
            <span>Lớp: {currentStudent?.class_name}</span>
          </div>

          <button
            onClick={handleStartDrawQ1}
            className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
          >
            Rút Câu 1 (Hiểu bản chất — 5,0đ)
          </button>
        </div>
      ) : (
        // Active Draw State: High-density 2-Column Split
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (7 cols): Question Details */}
          <div className="lg:col-span-7 space-y-4">
            {/* Slot Tab Switcher (Segmented Control style) */}
            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-md max-w-fit">
              <button
                onClick={() => setActiveSlot(1)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeSlot === 1
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Câu 1: Hiểu bản chất
                {attemptState.q1_grade?.total_score !== null && (
                  <span className="ml-1.5 font-mono text-neutral-500">
                    [{attemptState.q1_grade?.total_score}đ]
                  </span>
                )}
              </button>

              {attemptState.q2_assignment?.revealed ? (
                <button
                  onClick={() => setActiveSlot(2)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeSlot === 2
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Câu 2: Vận dụng
                  {attemptState.q2_grade?.total_score !== null && (
                    <span className="ml-1.5 font-mono text-neutral-500">
                      [{attemptState.q2_grade?.total_score}đ]
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleRevealQ2}
                  className="px-3 py-1 text-xs font-medium rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                >
                  Rút Câu 2 (Vận dụng)
                </button>
              )}
            </div>

            {/* Question Details Card (Flat, hairline border) */}
            {currentAssignment ? (
              <div className="bg-white rounded-lg border border-neutral-200/90 p-5 space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-900 font-medium">
                      {currentAssignment.snapshot.question_id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Bài {currentAssignment.snapshot.lecture_ids.join(', ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentAssignment.snapshot.topic}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        setDrawModal({
                          isOpen: true,
                          slot: activeSlot,
                          targetQuestion: currentAssignment.snapshot,
                          pendingAttempt: attemptState,
                        });
                      }}
                      className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Xem lại hoạt ảnh bốc thăm đề thi"
                    >
                      <span>Hoạt ảnh rút đề 🎲</span>
                    </button>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <button
                      onClick={() => setReplaceReasonModalOpen(true)}
                      className="text-xs text-neutral-500 hover:text-neutral-900 underline transition-colors cursor-pointer"
                    >
                      Đổi câu hỏi này
                    </button>
                  </div>
                </div>

                {/* Question Prompts */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-neutral-950 leading-relaxed">
                    {currentAssignment.snapshot.prompt_en}
                  </h3>
                  {currentAssignment.snapshot.prompt_vi && (
                    <p className="text-xs text-neutral-600 leading-normal border-t border-neutral-100 pt-2">
                      <strong className="text-neutral-700 font-medium">Bản dịch: </strong>
                      {currentAssignment.snapshot.prompt_vi}
                    </p>
                  )}
                </div>

                {/* Context if any */}
                {currentAssignment.snapshot.context && (
                  <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200/60">
                    <span className="font-medium text-neutral-800">Ngữ cảnh: </span>
                    {currentAssignment.snapshot.context}
                  </div>
                )}

                {/* Visual Diagrams, Schemas and Structured Data */}
                <QuestionVisualDiagram snapshot={currentAssignment.snapshot} />

                {/* Expected Key Points */}
                <div className="p-3 rounded bg-neutral-50 border border-neutral-200/70 space-y-1.5 text-xs">
                  <div className="font-semibold text-neutral-800">
                    Các ý cốt lõi cần có (Key Points):
                  </div>
                  <ul className="text-neutral-600 space-y-1 list-disc pl-4">
                    {currentAssignment.snapshot.expected_key_points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Common Misconceptions */}
                {currentAssignment.snapshot.common_misconceptions.length > 0 && (
                  <div className="p-3 rounded bg-amber-50/60 border border-amber-200/70 text-xs space-y-1 text-amber-900">
                    <div className="font-semibold text-amber-800">
                      Lỗi hiểu nhầm thường gặp:
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-amber-900/90">
                      {currentAssignment.snapshot.common_misconceptions.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up question trigger */}
                {currentAssignment.snapshot.optional_follow_up && (
                  <div className="border-t border-neutral-100 pt-2 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setShowFollowUp(!showFollowUp)}
                      className="text-neutral-600 hover:text-neutral-900 underline"
                    >
                      {showFollowUp ? 'Ẩn câu hỏi gợi mở' : 'Hiện câu hỏi gợi mở chuẩn hóa (Follow-up)'}
                    </button>
                    {showFollowUp && (
                      <span className="text-[11px] text-neutral-400 italic">Đang hiển thị trên màn hình chiếu</span>
                    )}
                  </div>
                )}

                {showFollowUp && currentAssignment.snapshot.optional_follow_up && (
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-800">
                    <strong>Gợi mở: </strong>
                    {currentAssignment.snapshot.optional_follow_up}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Right Column (5 cols): Instrumentation & Rubric Scoring Matrix */}
          <div className="lg:col-span-5 space-y-4">
            {/* High-Precision Timer Deck */}
            <div className="bg-white rounded-lg border border-neutral-200/90 p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-neutral-400 uppercase tracking-wide font-medium">
                  Thời gian trả lời
                </div>
                <div
                  className={`font-mono text-2xl font-bold tabular-nums mt-0.5 ${
                    timerRemaining <= 0
                      ? 'text-red-600'
                      : timerRemaining <= 30
                      ? 'text-amber-600'
                      : 'text-neutral-900'
                  }`}
                >
                  {timeFormatted}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timerRunning
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {timerRunning ? 'Tạm dừng' : 'Bắt đầu'}
                </button>

                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerRemaining(exam.default_time_limit_seconds || 120);
                  }}
                  className="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors"
                >
                  Đặt lại
                </button>
              </div>
            </div>

            {/* Rubric Matrix Card */}
            {currentAssignment && currentGrade && (
              <div className="bg-white rounded-lg border border-neutral-200/90 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2 text-xs">
                  <span className="font-semibold text-neutral-900">
                    Barem chấm điểm Câu {activeSlot} (Tối đa 5,0đ)
                  </span>
                  <span className="font-mono text-neutral-700 font-medium">
                    Tổng: {currentGrade.total_score !== null ? `${currentGrade.total_score.toFixed(2)}đ` : 'Chưa xong'}
                  </span>
                </div>

                {/* Fast Presets Deck */}
                <div className="flex items-center justify-between bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200/80 text-[11px]">
                  <span className="text-neutral-500 font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Chấm nhanh:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(activeSlot, 1.0)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      100% (5,0đ)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(activeSlot, 0.8)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      80% (4,0đ)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(activeSlot, 0.6)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      60% (3,0đ)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(activeSlot, 0.0)}
                      className="p-1 rounded bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer shadow-2xs"
                      title="Đặt về 0"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Criteria Scoring Rows */}
                <div className="space-y-3.5">
                  {currentAssignment.snapshot.rubric.map((crit) => {
                    const currentScore =
                      currentGrade.criterion_scores.find((cs) => cs.criterion_id === crit.id)?.score ?? null;

                    const stepCount = Math.round(crit.max_points / 0.25);
                    const steps = Array.from({ length: stepCount + 1 }, (_, i) => i * 0.25);

                    return (
                      <div key={crit.id} className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-neutral-700">
                          <span className="font-medium">{crit.name_vi}</span>
                          <span className="font-mono text-neutral-400 text-[11px]">
                            {crit.max_points}đ
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 leading-tight">
                          {crit.level_descriptions.full}
                        </p>

                        {/* Numeric Step Buttons (Clean high-density grid) */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {steps.map((val) => (
                            <button
                              key={val}
                              onClick={() => handleScoreChange(activeSlot, crit.id, val)}
                              className={`px-2 py-0.5 rounded font-mono text-xs tabular-nums transition-all duration-100 ease-out active:scale-95 cursor-pointer ${
                                currentScore === val
                                  ? 'bg-neutral-900 text-white font-semibold ring-1 ring-neutral-900 shadow-xs'
                                  : 'bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-700 border border-neutral-200'
                              }`}
                            >
                              {val.toFixed(2)}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Notes Input */}
                <div className="space-y-1 pt-2 border-t border-neutral-100">
                  <label htmlFor="instructor-notes" className="text-xs text-neutral-600 block">
                    Ghi chú câu trả lời:
                  </label>
                  <textarea
                    id="instructor-notes"
                    rows={2}
                    value={currentGrade.instructor_notes}
                    onChange={(e) => handleNotesChange(activeSlot, e.target.value)}
                    placeholder="Ghi vắn tắt bằng chứng trả lời của thí sinh..."
                    className="w-full text-xs p-2 rounded border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 font-sans"
                  />
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded transition-colors"
                  >
                    Lưu nháp
                  </button>

                  <button
                    onClick={handleFinalize}
                    disabled={isSaving || attemptState.status === 'COMPLETED'}
                    className={`px-4 py-1.5 font-medium rounded transition-colors ${
                      attemptState.status === 'COMPLETED'
                        ? 'bg-neutral-100 text-neutral-400 cursor-default'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {attemptState.status === 'COMPLETED' ? 'Đã hoàn tất bài thi' : 'Hoàn tất & Chấm điểm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Replace Question Modal */}
      {replaceReasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 space-y-3 border border-neutral-200 shadow-lg text-xs">
            <h3 className="text-sm font-semibold text-neutral-900">
              Đổi câu hỏi (Câu {activeSlot})
            </h3>
            <p className="text-neutral-500 leading-normal">
              Chỉ đổi khi có lý do hợp lệ (câu lỗi dữ liệu hoặc sai phạm vi). Câu cũ sẽ được ghi nhật ký và không trả lại ngân hàng.
            </p>

            <textarea
              rows={3}
              value={replaceReasonText}
              onChange={(e) => setReplaceReasonText(e.target.value)}
              placeholder="Nhập lý do đổi câu hỏi..."
              className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setReplaceReasonModalOpen(false)}
                className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReplace}
                disabled={!replaceReasonText.trim()}
                className="px-3.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded disabled:opacity-40"
              >
                Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Draw Lottery Animation Modal */}
      <QuestionDrawModal
        isOpen={drawModal.isOpen}
        slot={drawModal.slot}
        studentName={currentStudent?.full_name || ''}
        studentId={currentStudent?.student_id || ''}
        targetQuestion={drawModal.targetQuestion}
        onConfirm={handleConfirmDraw}
      />

      {/* Official Academic Student Assessment Modal */}
      <StudentAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        attempt={attemptState}
        student={currentStudent || null}
        exam={exam}
      />

      {/* Keyboard Shortcuts Helper Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
