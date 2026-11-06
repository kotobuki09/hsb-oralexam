import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Phím cách (Space)', desc: 'Bắt đầu / Tạm dừng đồng hồ đếm ngược', context: 'Phòng thi' },
    { key: 'R', desc: 'Đặt lại thời gian về 120 giây', context: 'Phòng thi' },
    { key: '1 / 2', desc: 'Chuyển tab Câu 1 (Hiểu bản chất) / Câu 2 (Vận dụng)', context: 'Phòng thi' },
    { key: 'D', desc: 'Mở hoạt ảnh rút đề ngẫu nhiên (Lottery Reel)', context: 'Phòng thi' },
    { key: 'P', desc: 'Bật / Tắt cửa sổ máy chiếu phòng thi (Projector Screen)', context: 'Toàn ứng dụng' },
    { key: 'M', desc: 'Bật / Tắt âm thanh hiệu ứng (Mute / Unmute Sound)', context: 'Toàn ứng dụng' },
    { key: 'F', desc: 'Ẩn / Hiện câu hỏi gợi mở mở rộng (Follow-up)', context: 'Phòng thi' },
    { key: '?', desc: 'Mở hướng dẫn phím tắt này', context: 'Toàn ứng dụng' },
    { key: 'Esc', desc: 'Đóng tất cả cửa sổ nổi / modal', context: 'Toàn ứng dụng' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-neutral-300 overflow-hidden">
        <div className="bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-neutral-300" />
            <h3 className="text-sm font-semibold tracking-wide">
              Phím Tắt Thao Tác Nhanh (Keyboard Shortcuts)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-neutral-500">
            Giúp giảng viên điều phối buổi thi vấn đáp trôi chảy mà không cần dùng chuột liên tục:
          </p>

          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
            {shortcuts.map((sc, idx) => (
              <div key={idx} className="flex items-center justify-between px-3.5 py-2.5 text-xs bg-white hover:bg-neutral-50">
                <span className="text-neutral-700 font-medium">{sc.desc}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">{sc.context}</span>
                  <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-300 rounded font-mono text-[11px] font-semibold text-neutral-800 shadow-2xs">
                    {sc.key}
                  </kbd>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400 italic pt-1">
            Mẹo: Nhấn <kbd className="px-1 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono text-[10px]">?</kbd> bất kỳ lúc nào để mở lại bảng phím tắt này.
          </div>
        </div>
      </div>
    </div>
  );
}
