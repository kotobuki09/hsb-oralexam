import React, { useEffect, useState } from 'react';
import { AuditEvent, BackupBundle, ExamConfig, WorkspaceMode } from '../types/exam';
import { dbRepository } from '../utils/dbStorage';

interface SettingsBackupProps {
  exam: ExamConfig;
  onUpdateExamConfig: (updated: ExamConfig) => Promise<void>;
  workspace: WorkspaceMode;
  onRestoreCompleted: () => Promise<void>;
}

export const SettingsBackup: React.FC<SettingsBackupProps> = ({
  exam,
  onUpdateExamConfig,
  workspace,
  onRestoreCompleted,
}) => {
  const [examTitle, setExamTitle] = useState(exam.title);
  const [graderName, setGraderName] = useState(exam.grader_name);
  const [timeLimit, setTimeLimit] = useState(exam.default_time_limit_seconds || 120);
  const [allowControlledRepeat, setAllowControlledRepeat] = useState(exam.allow_controlled_repeat);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Storage metrics & audit logs
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [stats, setStats] = useState({
    questions: 0,
    students: 0,
    attempts: 0,
    audits: 0,
  });

  const loadAuditAndStats = async () => {
    try {
      const [qs, stus, atts, audits] = await Promise.all([
        dbRepository.getAllQuestions(),
        dbRepository.getAllStudents(),
        dbRepository.getAllAttempts(),
        dbRepository.getAllAuditEvents(),
      ]);
      setStats({
        questions: qs.length,
        students: stus.length,
        attempts: atts.length,
        audits: audits.length,
      });
      // Sort newest first
      setAuditLogs([...audits].reverse().slice(0, 15));
    } catch (err) {
      console.error('Error loading audit events:', err);
    }
  };

  useEffect(() => {
    loadAuditAndStats();
  }, []);

  const handleSaveConfig = async () => {
    const updated: ExamConfig = {
      ...exam,
      title: examTitle.trim() || exam.title,
      grader_name: graderName.trim() || exam.grader_name,
      default_time_limit_seconds: Math.max(30, Number(timeLimit) || 120),
      allow_controlled_repeat: allowControlledRepeat,
      updated_at: new Date().toISOString(),
    };
    await onUpdateExamConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = async () => {
    const bundle = await dbRepository.exportBackupBundle(workspace);
    const jsonStr = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HSB3102E_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await loadAuditAndStats();
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text) as BackupBundle;
        await dbRepository.restoreBackupBundle(parsed);
        setRestoreStatus(
          `Khôi phục thành công: ${parsed.counts.questions} câu hỏi, ${parsed.counts.students} sinh viên, ${parsed.counts.attempts} lượt thi.`
        );
        await onRestoreCompleted();
        await loadAuditAndStats();
      } catch (err: any) {
        setRestoreStatus(`Lỗi khi khôi phục: ${err.message || 'File không hợp lệ'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Section 1: Exam Configuration Form */}
      <div className="bg-white rounded-lg border border-neutral-200/90 p-5 space-y-4">
        <div className="border-b border-neutral-100 pb-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Cấu hình Đợt thi vấn đáp</h2>
            <p className="text-xs text-neutral-500">
              Thiết lập tên đợt thi, giảng viên chấm thi, thời gian trả lời mặc định cho mỗi câu hỏi.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">ID: {exam.id}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-neutral-700">Tên đợt thi:</label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Giảng viên chấm thi:</label>
            <input
              type="text"
              value={graderName}
              onChange={(e) => setGraderName(e.target.value)}
              className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Thời gian trả lời mỗi câu (giây):</label>
            <input
              type="number"
              min={30}
              max={600}
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full text-xs p-2 rounded border border-neutral-300 font-mono focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="sm:col-span-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowControlledRepeat}
                onChange={(e) => setAllowControlledRepeat(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-xs text-neutral-700">
                Cho phép chế độ lặp câu có kiểm soát khi cạn ngân hàng câu hỏi (Controlled Repeat Mode)
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          {saveSuccess ? (
            <span className="text-xs font-medium text-emerald-700">
              ✓ Đã cập nhật cấu hình thành công!
            </span>
          ) : (
            <span className="text-xs text-neutral-400">Thay đổi áp dụng ngay cho các lượt thi tiếp theo.</span>
          )}
          <button
            onClick={handleSaveConfig}
            className="px-4 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white rounded transition-colors"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>

      {/* Section 2: Storage & Backup */}
      <div className="bg-white rounded-lg border border-neutral-200/90 p-5 space-y-4">
        <div className="border-b border-neutral-100 pb-2.5">
          <h2 className="text-sm font-semibold text-neutral-900">
            Lưu trữ Local-first & Sao lưu JSON (IndexedDB)
          </h2>
          <p className="text-xs text-neutral-500">
            Dữ liệu hoạt động 100% offline trên trình duyệt của giảng viên. Xuất file sao lưu định kỳ để bảo đảm an toàn dữ liệu.
          </p>
        </div>

        {/* High-density metrics ledger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70">
            <div className="text-neutral-500 text-[11px]">Ngân hàng câu hỏi</div>
            <div className="font-mono text-base font-bold text-neutral-900 mt-0.5">{stats.questions}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70">
            <div className="text-neutral-500 text-[11px]">Sinh viên trong lớp</div>
            <div className="font-mono text-base font-bold text-neutral-900 mt-0.5">{stats.students}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70">
            <div className="text-neutral-500 text-[11px]">Lượt thi đã thực hiện</div>
            <div className="font-mono text-base font-bold text-neutral-900 mt-0.5">{stats.attempts}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200/70">
            <div className="text-neutral-500 text-[11px]">Nhật ký thao tác (Audit)</div>
            <div className="font-mono text-base font-bold text-neutral-900 mt-0.5">{stats.audits}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded border border-neutral-200 bg-neutral-50/50 space-y-2">
            <div className="font-semibold text-xs text-neutral-900">Xuất bản sao lưu JSON đầy đủ</div>
            <p className="text-xs text-neutral-500 leading-normal">
              Đóng gói toàn bộ câu hỏi, barem điểm, sinh viên, điểm thi và nhật ký thao tác vào một file JSON có định danh schema.
            </p>
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded transition-colors"
            >
              Tải file Backup JSON
            </button>
          </div>

          <div className="p-4 rounded border border-neutral-200 bg-neutral-50/50 space-y-2">
            <div className="font-semibold text-xs text-neutral-900">Khôi phục từ file Backup JSON</div>
            <p className="text-xs text-neutral-500 leading-normal">
              Nạp lại toàn bộ dữ liệu kỳ thi từ file JSON đã xuất trước đó khi chuyển máy hoặc khôi phục dữ liệu.
            </p>
            <label className="inline-block px-3.5 py-1.5 border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-800 font-medium text-xs rounded transition-colors cursor-pointer">
              <span>Chọn file JSON để khôi phục</span>
              <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" />
            </label>
          </div>
        </div>

        {restoreStatus && (
          <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs font-medium text-neutral-900">
            {restoreStatus}
          </div>
        )}
      </div>

      {/* Section 3: Audit Trail Log */}
      <div className="bg-white rounded-lg border border-neutral-200/90 p-5 space-y-3">
        <div className="border-b border-neutral-100 pb-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Nhật ký Kiểm toán Hệ thống (Tamper-evident Audit Trail)
            </h2>
            <p className="text-xs text-neutral-500">
              Ghi nhận các thao tác rút đề, mở câu hỏi, lưu điểm nháp và chỉnh sửa điểm sau khi kết thúc.
            </p>
          </div>
          <button
            onClick={loadAuditAndStats}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline"
          >
            Làm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 text-[11px] uppercase tracking-wide">
              <tr>
                <th className="py-2 px-3 w-40 font-medium">Thời gian</th>
                <th className="py-2 px-3 w-44 font-medium">Thao tác</th>
                <th className="py-2 px-3 w-36 font-medium">Người thực hiện</th>
                <th className="py-2 px-3 font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-neutral-400 font-sans">
                    Chưa có sự kiện kiểm toán nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="py-2 px-3 text-neutral-500">
                      {new Date(log.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2 px-3 font-semibold text-neutral-800">
                      {log.action}
                    </td>
                    <td className="py-2 px-3 text-neutral-600">
                      {log.actor}
                    </td>
                    <td className="py-2 px-3 text-neutral-700 font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
