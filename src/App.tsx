import React, { useEffect, useState } from 'react';
import {
  Attempt,
  DisplayLanguage,
  ExamConfig,
  ProjectorPayload,
  Question,
  Student,
  WorkspaceMode,
} from './types/exam';
import { dbRepository, initializeLocalDatabase } from './utils/dbStorage';
import { createProjectorPayload } from './utils/examLogic';
import { ExamRoom } from './components/ExamRoom';
import { QuestionBankManager } from './components/QuestionBankManager';
import { GradebookView } from './components/GradebookView';
import { StudentRoster } from './components/StudentRoster';
import { SettingsBackup } from './components/SettingsBackup';
import { ProjectorModal } from './components/ProjectorModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { Keyboard } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'exam' | 'bank' | 'gradebook' | 'students' | 'settings'>('exam');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceMode>('official');
  const [language, setLanguage] = useState<DisplayLanguage>('VI');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Projector window state
  const [projectorPayload, setProjectorPayload] = useState<ProjectorPayload | null>(null);
  const [isProjectorOpen, setIsProjectorOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsProjectorOpen((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsProjectorOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Load database on start
  const refreshData = async () => {
    try {
      await initializeLocalDatabase();
      const [qs, stus, exams, atts] = await Promise.all([
        dbRepository.getAllQuestions(),
        dbRepository.getAllStudents(),
        dbRepository.getAllExams(),
        dbRepository.getAllAttempts(),
      ]);

      setQuestions(qs);
      setStudents(stus);
      if (stus.length > 0 && !selectedStudentId) {
        setSelectedStudentId(stus[0].student_id);
      }
      setExam(exams[0] || null);
      setAttempts(atts);
      setIsInitialized(true);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ IndexedDB:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleSaveAttempt = async (attempt: Attempt) => {
    await dbRepository.saveAttempt(attempt);
    const updated = await dbRepository.getAllAttempts();
    setAttempts(updated);
  };

  const handleApproveQuestion = async (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const updated: Question = {
      ...q,
      review_status: 'APPROVED',
      updated_at: new Date().toISOString(),
    };
    await dbRepository.saveQuestion(updated);
    const refreshed = await dbRepository.getAllQuestions();
    setQuestions(refreshed);
  };

  const handleBatchApprove = async (lectureId: string) => {
    const toUpdate = questions.filter(
      (q) => q.lecture_ids.includes(lectureId as any) && q.review_status !== 'APPROVED'
    );
    const updatedList = toUpdate.map((q) => ({
      ...q,
      review_status: 'APPROVED' as const,
      updated_at: new Date().toISOString(),
    }));
    await dbRepository.saveQuestionsBatch(updatedList);
    const refreshed = await dbRepository.getAllQuestions();
    setQuestions(refreshed);
  };

  const handleAddStudent = async (student: Student) => {
    await dbRepository.saveStudent(student);
    const updated = await dbRepository.getAllStudents();
    setStudents(updated);
  };

  const handleBatchAddStudents = async (newStudents: Student[]) => {
    await dbRepository.saveStudentsBatch(newStudents);
    const updated = await dbRepository.getAllStudents();
    setStudents(updated);
  };

  const handleUpdateExamConfig = async (updatedExam: ExamConfig) => {
    await dbRepository.saveExam(updatedExam);
    setExam(updatedExam);
  };

  const handleUpdateGrade = async (
    attemptId: string,
    slot: 1 | 2,
    newScore: number,
    reason: string
  ) => {
    const att = attempts.find((a) => a.id === attemptId);
    if (!att) return;

    const targetGrade = slot === 1 ? att.q1_grade : att.q2_grade;
    if (!targetGrade) return;

    const updatedGrade = {
      ...targetGrade,
      total_score: newScore,
      graded_at: new Date().toISOString(),
    };

    const q1Score = slot === 1 ? newScore : att.q1_grade?.total_score ?? 0;
    const q2Score = slot === 2 ? newScore : att.q2_grade?.total_score ?? 0;

    const updatedAttempt: Attempt = {
      ...att,
      ...(slot === 1 ? { q1_grade: updatedGrade } : { q2_grade: updatedGrade }),
      total_score: Math.round((q1Score + q2Score) * 100) / 100,
      grade_edit_history: [
        ...(att.grade_edit_history || []),
        {
          edited_at: new Date().toISOString(),
          edited_by: exam?.grader_name || 'Instructor',
          reason,
          previous_q1_score: att.q1_grade?.total_score ?? null,
          previous_q2_score: att.q2_grade?.total_score ?? null,
          previous_total_score: att.total_score,
          new_q1_score: slot === 1 ? newScore : att.q1_grade?.total_score ?? null,
          new_q2_score: slot === 2 ? newScore : att.q2_grade?.total_score ?? null,
          new_total_score: Math.round((q1Score + q2Score) * 100) / 100,
        },
      ],
      updated_at: new Date().toISOString(),
    };

    await dbRepository.saveAttempt(updatedAttempt);
    const refreshed = await dbRepository.getAllAttempts();
    setAttempts(refreshed);
  };

  const handleSyncProjector = (attempt: Attempt, slot: 1 | 2, timerRemaining: number) => {
    const payload = createProjectorPayload({
      workspace,
      examTitle: exam?.title || 'Thi vấn đáp giữa kỳ',
      attempt,
      timerRemainingSeconds: timerRemaining,
      timerTotalSeconds: exam?.default_time_limit_seconds || 120,
      timerRunning: timerRemaining > 0,
      language,
    });
    setProjectorPayload(payload);
  };

  if (!isInitialized || !exam) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-neutral-300">
        <div className="text-center space-y-2">
          <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-neutral-400 tracking-wide">
            Đang tải dữ liệu HSB3102E Oral Exam Studio...
          </p>
        </div>
      </div>
    );
  }

  const approvedCount = questions.filter((q) => q.review_status === 'APPROVED').length;
  const completedCount = attempts.filter((a) => a.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Precision Engineering Top Bar Contract (3 Zones, Zero-Slop) */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single element, no floating tags or chips) */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-semibold text-sm tracking-tight text-neutral-950 whitespace-nowrap">
              HSB3102E Oral Exam Studio
            </span>
            <span className="text-neutral-300" aria-hidden="true">/</span>
            <span className="text-xs text-neutral-500 whitespace-nowrap hidden sm:inline">
              Database Design & Development
            </span>
          </div>

          {/* Zone 2: Navigation Links (Clean text with subtle underlines, single line, no candy pills) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('exam')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'exam'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                  : 'hover:text-neutral-900'
              }`}
            >
              Phòng thi
            </button>

            <button
              onClick={() => setActiveTab('bank')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'bank'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                  : 'hover:text-neutral-900'
              }`}
            >
              Ngân hàng câu hỏi
              <span className="text-neutral-400 font-mono text-[11px] ml-1">({questions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gradebook')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'gradebook'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                  : 'hover:text-neutral-900'
              }`}
            >
              Bảng điểm
              <span className="text-neutral-400 font-mono text-[11px] ml-1">({completedCount}/{students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'students'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                  : 'hover:text-neutral-900'
              }`}
            >
              Danh sách lớp
              <span className="text-neutral-400 font-mono text-[11px] ml-1">({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'settings'
                  ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                  : 'hover:text-neutral-900'
              }`}
            >
              Cấu hình & Sao lưu
            </button>
          </nav>

          {/* Zone 3: Primary Action (Single clear high-intent CTA) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Phím tắt thao tác nhanh (Nhấn ?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsProjectorOpen(true)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              Mở màn hình chiếu
            </button>
          </div>
        </div>
      </header>

      {/* Contextual Sub-Header (Clean editorial metadata, NO gradients or cartoon graphics) */}
      <div className="bg-white border-b border-neutral-200/60 px-6 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900">{exam.title}</span>
            <span aria-hidden="true">·</span>
            <span>{exam.semester}</span>
            <span aria-hidden="true">·</span>
            <span>Giảng viên: {exam.grader_name}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>
              Ngân hàng: <strong className="text-neutral-800 font-semibold">{questions.length}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Sẵn sàng thi: <strong className="text-emerald-700 font-semibold">{approvedCount}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Đã hoàn tất: <strong className="text-neutral-800 font-semibold">{completedCount}</strong>/{students.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-6 py-6 w-full">
        {activeTab === 'exam' && (
          <ExamRoom
            exam={exam}
            students={students}
            attempts={attempts}
            questions={questions}
            onSaveAttempt={handleSaveAttempt}
            onOpenProjector={handleSyncProjector}
            language={language}
            selectedStudentId={selectedStudentId}
            onSelectStudentId={setSelectedStudentId}
          />
        )}

        {activeTab === 'bank' && (
          <QuestionBankManager
            questions={questions}
            onApproveQuestion={handleApproveQuestion}
            onBatchApprove={handleBatchApprove}
          />
        )}

        {activeTab === 'gradebook' && (
          <GradebookView
            exam={exam}
            students={students}
            attempts={attempts}
            onUpdateGrade={handleUpdateGrade}
          />
        )}

        {activeTab === 'students' && (
          <StudentRoster
            students={students}
            attempts={attempts}
            onAddStudent={handleAddStudent}
            onBatchAddStudents={handleBatchAddStudents}
            onSelectStudentForExam={(id) => {
              setSelectedStudentId(id);
              setActiveTab('exam');
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsBackup
            exam={exam}
            onUpdateExamConfig={handleUpdateExamConfig}
            workspace={workspace}
            onRestoreCompleted={refreshData}
          />
        )}
      </main>

      {/* Student Projector Overlay Modal */}
      {isProjectorOpen && (
        <ProjectorModal
          payload={projectorPayload}
          onClose={() => setIsProjectorOpen(false)}
        />
      )}

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
