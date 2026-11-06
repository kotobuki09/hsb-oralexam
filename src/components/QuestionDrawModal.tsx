import React, { useEffect, useState } from 'react';
import { QuestionSnapshot } from '../types/exam';
import {
  Sparkles,
  Dice5,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Layers,
  Cpu,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface QuestionDrawModalProps {
  isOpen: boolean;
  slot: 1 | 2;
  studentName: string;
  studentId: string;
  targetQuestion: QuestionSnapshot | null;
  onConfirm: () => void;
}

const LECTURE_CYCLER = [
  { id: '01', title: 'Data, Databases & AI Decisions' },
  { id: '02', title: 'Data Quality & Trustworthy AI' },
  { id: '03', title: 'From Business Requirements to Data Models' },
  { id: '04', title: 'Relational Model, ERDs & Relationships' },
  { id: '05', title: 'Keys, Functional Dependencies & Normalization' },
  { id: '06', title: 'SQL Fundamentals & AI-Assisted Queries' },
  { id: '07', title: 'Business Insights, Reporting & KPIs' },
  { id: '08', title: 'Database Governance, Security & AI Agents' },
];

export const QuestionDrawModal: React.FC<QuestionDrawModalProps> = ({
  isOpen,
  slot,
  studentName,
  studentId,
  targetQuestion,
  onConfirm,
}) => {
  const [phase, setPhase] = useState<'shuffling' | 'locked'>('shuffling');
  const [randomHex, setRandomHex] = useState('0x8F4E2B19');
  const [currentLecIndex, setCurrentLecIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase('shuffling');
      setProgress(0);
      return;
    }

    setPhase('shuffling');
    setProgress(0);

    // Fast cycling interval
    const shuffleInterval = setInterval(() => {
      // Generate cryptographic pseudorandom hex for display
      const arr = new Uint32Array(2);
      if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(arr);
        setRandomHex(`0x${arr[0].toString(16).toUpperCase()}${arr[1].toString(16).toUpperCase()}`);
      }
      setCurrentLecIndex((prev) => (prev + 1) % LECTURE_CYCLER.length);
      soundEffects.playTick();
    }, 60);

    // Progress timer
    const startTime = Date.now();
    const duration = 1600; // 1.6 seconds

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(shuffleInterval);
        clearInterval(progressInterval);
        setPhase('locked');
        soundEffects.playChime();
      }
    }, 30);

    return () => {
      clearInterval(shuffleInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, targetQuestion]);

  if (!isOpen || !targetQuestion) return null;

  const currentLecture = LECTURE_CYCLER[currentLecIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-neutral-800">
      <div className="bg-[#111215] border border-neutral-700/80 rounded-xl max-w-lg w-full p-6 text-neutral-100 shadow-2xl space-y-6 relative overflow-hidden animate-fade-in">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 relative">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-emerald-400">
              <Dice5 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {phase === 'shuffling'
                  ? `Đang rút ngẫu nhiên Câu ${slot}...`
                  : `Đã khóa đề thi Câu ${slot} thành công!`}
              </h2>
              <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                <span>Thí sinh: {studentName}</span>
                <span>·</span>
                <span className="font-mono">{studentId}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Thuật toán
            </span>
            <span className="text-xs font-mono text-emerald-400">crypto.unbiased</span>
          </div>
        </div>

        {/* Center Animation Stage */}
        <div className="space-y-4 relative">
          {phase === 'shuffling' ? (
            // Shuffling Reel Animation
            <div className="py-6 px-4 rounded-lg bg-neutral-900/90 border border-neutral-800 text-center space-y-4">
              <div className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Đang quét ngân hàng câu hỏi chuẩn hóa...</span>
              </div>

              {/* Shuffling Card Display */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-700/70 shadow-inner space-y-1 transform transition-all duration-75">
                <div className="text-xs font-mono font-bold text-emerald-400">
                  Bài {currentLecture.id}
                </div>
                <div className="text-sm font-medium text-white truncate px-2">
                  {currentLecture.title}
                </div>
              </div>

              {/* Cryptographic Seed Hash Live Stream */}
              <div className="text-[11px] font-mono text-neutral-400 bg-neutral-950/60 py-1.5 px-3 rounded border border-neutral-800/80 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Entropy Seed: {randomHex}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            // Card Locked & Revealed
            <div className="p-5 rounded-lg bg-neutral-900 border border-emerald-500/60 shadow-lg space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950 border border-emerald-600 text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> KHÓA ĐỀ HỢP LỆ
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {slot === 1 ? 'Nhóm A (Hiểu bản chất — 5,0đ)' : 'Nhóm B (Vận dụng — 5,0đ)'}
                </span>
              </div>

              {/* Revealed Question Card */}
              <div className="space-y-2 border-t border-neutral-800 pt-3">
                <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <span>Bài {targetQuestion.lecture_ids.join(', ')}</span>
                  <span>·</span>
                  <span className="text-neutral-200 font-semibold">{targetQuestion.topic}</span>
                </div>

                <h3 className="text-sm font-semibold text-white leading-relaxed">
                  {targetQuestion.prompt_en}
                </h3>

                {targetQuestion.prompt_vi && (
                  <p className="text-xs text-neutral-300 leading-normal border-t border-neutral-800/80 pt-2">
                    <strong className="text-neutral-400">Dịch: </strong>
                    {targetQuestion.prompt_vi}
                  </p>
                )}
              </div>

              {/* Verified Constraints Badge */}
              <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Xác minh: Khác family_id, bảo đảm bài học độc lập</span>
                </div>
                <span className="font-mono text-neutral-400">120s trả lời</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
          <button
            onClick={onConfirm}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              phase === 'locked'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <span>{phase === 'locked' ? 'Bắt đầu tính giờ & Trả lời' : 'Bỏ qua hoạt ảnh'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
