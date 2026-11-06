import React from 'react';
import { QuestionSnapshot } from '../types/exam';
import {
  Database,
  Table as TableIcon,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Key,
  GitFork,
  BarChart2,
  Cpu,
  CheckCircle2,
  Link,
  Workflow,
} from 'lucide-react';

interface QuestionVisualDiagramProps {
  snapshot: Partial<QuestionSnapshot>;
  isProjector?: boolean;
}

/**
 * Parses ASCII pipe tables into structured row arrays if present
 */
function parseAsciiTable(text: string): { headers: string[]; rows: string[][] } | null {
  if (!text || !text.includes('|')) return null;
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.includes('|'));

  if (lines.length < 2) return null;

  // Filter out separator lines like +----+----+ or |---|---|
  const dataLines = lines.filter((l) => !/^[|+-\s=]+$/.test(l));
  if (dataLines.length < 1) return null;

  const parseLine = (line: string) => {
    return line
      .split('|')
      .map((c) => c.trim())
      .filter((c, i, arr) => {
        // filter out empty leading/trailing tokens caused by outer pipes
        if (i === 0 && line.startsWith('|') && c === '') return false;
        if (i === arr.length - 1 && line.endsWith('|') && c === '') return false;
        return true;
      });
  };

  const headers = parseLine(dataLines[0]);
  const rows = dataLines.slice(1).map(parseLine).filter((r) => r.length > 0);

  if (headers.length > 0 && rows.length > 0) {
    return { headers, rows };
  }
  return null;
}

export const QuestionVisualDiagram: React.FC<QuestionVisualDiagramProps> = ({
  snapshot,
  isProjector = false,
}) => {
  const lectureId = snapshot.lecture_ids?.[0] || '01';
  const topicLower = ((snapshot.topic || '') + ' ' + (snapshot.prompt_en || '') + ' ' + (snapshot.context || '')).toLowerCase();
  const qId = snapshot.question_id || '';
  const rawTableOrDiagram = snapshot.optional_table_or_diagram || '';
  const parsedTable = parseAsciiTable(rawTableOrDiagram);

  // Determine specific architectural visual based on the question's domain
  const isHeaderDetail =
    topicLower.includes('header') ||
    topicLower.includes('orderlines') ||
    topicLower.includes('order line') ||
    topicLower.includes('orders') ||
    qId.includes('ORDER_HEADER');

  const isOneToOne =
    topicLower.includes('1:1') ||
    topicLower.includes('one-to-one') ||
    topicLower.includes('certificate') ||
    qId.includes('ONE_TO_ONE');

  const isBiasOrQuality =
    lectureId === '02' ||
    topicLower.includes('bias') ||
    topicLower.includes('sampling') ||
    topicLower.includes('quality') ||
    topicLower.includes('survivor');

  const isNormalization =
    lectureId === '05' ||
    topicLower.includes('normalization') ||
    topicLower.includes('functional dependency') ||
    topicLower.includes('2nf') ||
    topicLower.includes('3nf') ||
    topicLower.includes('bcnf');

  const isERD =
    lectureId === '04' ||
    topicLower.includes('erd') ||
    topicLower.includes('cardinality') ||
    topicLower.includes('relationship') ||
    topicLower.includes('foreign key');

  const isSqlOrAi =
    lectureId === '06' ||
    Boolean(snapshot.optional_sql) ||
    topicLower.includes('sql') ||
    topicLower.includes('query');

  const isBIorKPI =
    lectureId === '07' ||
    topicLower.includes('kpi') ||
    topicLower.includes('metric') ||
    topicLower.includes('dashboard') ||
    topicLower.includes('revenue');

  const isGovernanceOrSecurity =
    lectureId === '08' ||
    topicLower.includes('security') ||
    topicLower.includes('rbac') ||
    topicLower.includes('governance') ||
    topicLower.includes('agent');

  return (
    <div className={`space-y-4 ${isProjector ? 'text-neutral-100' : 'text-neutral-900'}`}>
      {/* 1. DOMAIN CONCEPTUAL VISUAL DIAGRAM */}
      <div
        className={`rounded-lg border p-4 transition-all duration-150 ${
          isProjector
            ? 'bg-neutral-900/90 border-neutral-700/80 shadow-md'
            : 'bg-white border-neutral-200/90 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-2 mb-3 border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span
              className={`p-1 rounded text-xs ${
                isProjector ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-800'
              }`}
            >
              {isHeaderDetail ? (
                <GitFork className="w-3.5 h-3.5" />
              ) : isOneToOne ? (
                <Link className="w-3.5 h-3.5" />
              ) : isBiasOrQuality ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              ) : isNormalization ? (
                <Layers className="w-3.5 h-3.5 text-blue-500" />
              ) : isERD ? (
                <Database className="w-3.5 h-3.5 text-emerald-500" />
              ) : isSqlOrAi ? (
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              ) : isBIorKPI ? (
                <BarChart2 className="w-3.5 h-3.5 text-violet-500" />
              ) : (
                <Workflow className="w-3.5 h-3.5 text-neutral-600" />
              )}
            </span>
            <span className="font-semibold text-xs tracking-tight uppercase">
              {isHeaderDetail
                ? 'Sơ đồ Thực thể Header — Detail (Order Header vs Lines)'
                : isOneToOne
                ? 'Sơ đồ Ràng buộc Quan hệ 1 : 1 (Unique Foreign Key)'
                : isBiasOrQuality
                ? 'Mô hình Kiểm toán Chất lượng Mẫu & AI Bias'
                : isNormalization
                ? 'Quy trình Chuẩn hóa CSDL (Functional Dependencies & Normal Forms)'
                : isERD
                ? 'Sơ đồ Thực thể Quan hệ & Bậc quan hệ (ERD Schema Model)'
                : isSqlOrAi
                ? 'Luồng Thực thi Truy vấn SQL & AI Agent Inspection'
                : isBIorKPI
                ? 'Cây Chỉ số KPI & Phân tích Đa chiều (Business Intelligence Grain)'
                : isGovernanceOrSecurity
                ? 'Mô hình Phân quyền CSDL & AI Agent Governance (RBAC)'
                : 'Mô hình CSDL & Luồng Quyết định Dữ liệu'}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isProjector ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            CampusMart Visual Model · Bài {lectureId}
          </span>
        </div>

        {/* Dynamic Diagram Illustrations */}
        {isHeaderDetail ? (
          // Header - Detail Visual Schema
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center text-xs font-mono py-1">
            {/* Orders Header Box */}
            <div
              className={`sm:col-span-4 rounded border p-3 ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold border-b pb-1 mb-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                <span className="flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5" /> Orders (Header)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">1 receipt</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Key className="w-3 h-3" /> order_id
                  </span>
                  <span className="text-neutral-400 text-[10px]">PK</span>
                </li>
                <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                  <span>customer_id</span>
                  <span className="text-neutral-400 text-[10px]">FK</span>
                </li>
                <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                  <span>order_date</span>
                  <span className="text-neutral-400 text-[10px]">TIMESTAMP</span>
                </li>
                <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                  <span>total_amount</span>
                  <span className="text-neutral-400 text-[10px]">DECIMAL</span>
                </li>
              </ul>
            </div>

            {/* Relationship Arrow */}
            <div className="sm:col-span-3 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] text-neutral-400 uppercase font-sans mb-1">Quan hệ 1 : N</span>
              <div className="flex items-center gap-1 text-neutral-500 font-bold text-sm">
                <span>1</span>
                <span className="w-12 h-0.5 bg-neutral-400 dark:bg-neutral-600 relative">
                  <span className="absolute -top-1.5 right-0 text-xs">►</span>
                </span>
                <span>N</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-sans mt-1">1 đơn mua nhiều món</span>
            </div>

            {/* OrderLines Detail Box */}
            <div
              className={`sm:col-span-4 rounded border p-3 ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold border-b pb-1 mb-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                <span className="flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5" /> OrderLines (Detail)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">N items</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Key className="w-3 h-3" /> line_id
                  </span>
                  <span className="text-neutral-400 text-[10px]">PK</span>
                </li>
                <li className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Link className="w-3 h-3" /> order_id
                  </span>
                  <span className="text-neutral-400 text-[10px]">FK ➔ Orders</span>
                </li>
                <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                  <span>product_id</span>
                  <span className="text-neutral-400 text-[10px]">FK ➔ Products</span>
                </li>
                <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                  <span>quantity, unit_price</span>
                  <span className="text-neutral-400 text-[10px]">NUMERIC</span>
                </li>
              </ul>
            </div>
          </div>
        ) : isOneToOne ? (
          // 1:1 Relationship Visual with Unique Constraint
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center text-xs font-mono py-1">
            <div
              className={`sm:col-span-5 rounded border p-3 ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="font-bold border-b pb-1 mb-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                Students (Sinh viên)
              </div>
              <ul className="space-y-1 text-[11px]">
                <li className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold">
                  <span>student_id</span>
                  <span className="text-[10px]">PRIMARY KEY</span>
                </li>
                <li className="text-neutral-600 dark:text-neutral-400">full_name, class_name</li>
              </ul>
            </div>

            <div className="sm:col-span-1 flex items-center justify-center">
              <span className="text-xs font-bold text-neutral-400">1 : 1</span>
            </div>

            <div
              className={`sm:col-span-5 rounded border p-3 border-amber-300/80 bg-amber-50/20 dark:border-amber-700/60`}
            >
              <div className="flex items-center justify-between font-bold border-b pb-1 mb-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                <span>Official_Certificate</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400">Tối đa 1 bằng</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                  <span>cert_id</span>
                  <span className="text-[10px]">PK</span>
                </li>
                <li className="flex items-center justify-between text-amber-700 dark:text-amber-300 font-bold bg-amber-100/50 dark:bg-amber-950/60 px-1 rounded">
                  <span>student_id</span>
                  <span className="text-[10px]">FK + UNIQUE (Khóa 1:1)</span>
                </li>
              </ul>
            </div>
          </div>
        ) : isBiasOrQuality ? (
          // Selection Bias / Data Quality Pipeline Visual
          <div className="space-y-2.5 text-xs py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded border ${
                  isProjector
                    ? 'bg-neutral-950 border-red-800/80 text-red-200'
                    : 'bg-red-50/50 border-red-200 text-red-950'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Mẫu lệch (Selection / Survivorship Bias)
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Dữ liệu chỉ thu thập từ một nhóm hẹp (ví dụ: 100% người dùng app buổi tối), hoàn toàn bỏ quên khách hàng mua trực tiếp buổi sáng. AI học trên dữ liệu này sẽ đưa ra khuyến nghị sai lầm.
                </p>
              </div>

              <div
                className={`p-3 rounded border ${
                  isProjector
                    ? 'bg-neutral-950 border-emerald-800/80 text-emerald-200'
                    : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Nguyên tắc Kiểm toán Dữ liệu Đúng
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Phân tầng tập dữ liệu theo nhóm khách hàng và kênh thanh toán (<code>GROUP BY shift, payment_channel</code>), kiểm tra độ bao phủ (coverage) trước khi tổng quát hóa.
                </p>
              </div>
            </div>
          </div>
        ) : isNormalization ? (
          // Normalization Pipeline Diagram
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono py-1">
            <div
              className={`p-2.5 rounded border text-center ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px]">1NF (Atomic)</div>
              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                Các giá trị thuộc tính phải nguyên tố, không lặp mảng
              </p>
            </div>
            <div
              className={`p-2.5 rounded border text-center border-blue-400/70 ${
                isProjector ? 'bg-blue-950/20' : 'bg-blue-50/40'
              }`}
            >
              <div className="font-bold text-blue-700 dark:text-blue-300 text-[11px]">2NF (No Partial FD)</div>
              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                Không phụ thuộc hàm từng phần vào một phần của khóa chính
              </p>
            </div>
            <div
              className={`p-2.5 rounded border text-center ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px]">3NF (No Transitive FD)</div>
              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                Không có phụ thuộc bắc cầu (A ➔ B ➔ C) giữa các cột không khóa
              </p>
            </div>
          </div>
        ) : (
          // General Relational & AI Decision Model
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono py-1">
            <div
              className={`flex-1 min-w-[140px] p-2.5 rounded border text-center ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="font-bold text-[11px] text-neutral-900 dark:text-neutral-100">Bảng CSDL (OLTP)</div>
              <span className="text-[10px] text-neutral-400 font-sans">Entity & Integrity</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
            <div
              className={`flex-1 min-w-[140px] p-2.5 rounded border text-center ${
                isProjector ? 'bg-neutral-950 border-neutral-700' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="font-bold text-[11px] text-neutral-900 dark:text-neutral-100">Truy vấn & KPI (SQL)</div>
              <span className="text-[10px] text-neutral-400 font-sans">Aggregation & Filter</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
            <div
              className={`flex-1 min-w-[140px] p-2.5 rounded border text-center border-emerald-400/70 ${
                isProjector ? 'bg-emerald-950/20' : 'bg-emerald-50/40'
              }`}
            >
              <div className="font-bold text-[11px] text-emerald-700 dark:text-emerald-300">Quyết định / AI Agent</div>
              <span className="text-[10px] text-neutral-400 font-sans">Grounding & Verification</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. STRUCTURED DATA GRID (Parsed from ASCII table if present, else formatted code) */}
      {parsedTable ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <span>Bảng dữ liệu thực tế (Sample Dataset Grid):</span>
            <span className="font-mono text-[10px] text-neutral-400 font-normal">
              {parsedTable.rows.length} bản ghi
            </span>
          </div>

          <div
            className={`rounded border overflow-x-auto ${
              isProjector ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'
            }`}
          >
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead
                className={`border-b text-[11px] ${
                  isProjector
                    ? 'bg-neutral-900 text-neutral-300 border-neutral-800'
                    : 'bg-neutral-100/80 text-neutral-700 border-neutral-200'
                }`}
              >
                <tr>
                  {parsedTable.headers.map((h, i) => (
                    <th key={i} className="py-2 px-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isProjector ? 'divide-neutral-800/80 text-neutral-300' : 'divide-neutral-100 text-neutral-800'
                }`}
              >
                {parsedTable.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`hover:bg-neutral-500/5 transition-colors ${
                      row.some((cell) => cell.includes('NULL') || cell.includes('0') || cell.includes('Warning'))
                        ? isProjector
                          ? 'bg-amber-950/20'
                          : 'bg-amber-50/40'
                        : ''
                    }`}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                        {cell === 'NULL' ? (
                          <span className="text-red-500 font-bold bg-red-100/50 dark:bg-red-950/50 px-1 py-0.5 rounded text-[10px]">
                            NULL
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : rawTableOrDiagram ? (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
            Sơ đồ cấu trúc / Lệnh DDL:
          </div>
          <pre
            className={`p-3.5 font-mono text-xs rounded border overflow-x-auto leading-relaxed ${
              isProjector
                ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-100'
            }`}
          >
            {rawTableOrDiagram}
          </pre>
        </div>
      ) : null}

      {/* 3. SQL CODE BLOCK WITH SYNTAX ACCENTS */}
      {snapshot.optional_sql && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
            <span>Đoạn mã SQL cần phân tích / kiểm chứng:</span>
            <span className="font-mono text-[10px] text-emerald-500">SQL Engine Grounding</span>
          </div>
          <pre
            className={`p-3.5 font-mono text-xs rounded border overflow-x-auto ${
              isProjector
                ? 'bg-neutral-950 border-neutral-800 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-emerald-400'
            }`}
          >
            {snapshot.optional_sql}
          </pre>
        </div>
      )}
    </div>
  );
};
