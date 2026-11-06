import {
  Attempt,
  BankCapacityReport,
  CriterionScore,
  DisplayLanguage,
  ExamConfig,
  Grade,
  LectureId,
  LectureMetadata,
  NearDuplicatePair,
  ProjectorPayload,
  Question,
  QuestionAssignment,
  QuestionSnapshot,
  RubricCriterion,
  Student,
  WorkspaceMode,
} from '../types/exam';

export const LECTURE_CATALOG: LectureMetadata[] = [
  {
    id: '01',
    number_label: 'Bài 01',
    title_en: 'Data, Databases and AI-Powered Decisions',
    title_vi: 'Dữ liệu, Cơ sở dữ liệu và Quyết định hỗ trợ bởi AI',
    key_themes: ['Data vs Information', 'Operational vs Analytical DB', 'AI Grounding & Hallucinations', 'CampusMart POS vs Spreadsheets'],
    primary_scenario: 'CampusMart Retail & Inventory',
  },
  {
    id: '02',
    number_label: 'Bài 02',
    title_en: 'Data Quality and Trustworthy AI',
    title_vi: 'Chất lượng dữ liệu và AI đáng tin cậy',
    key_themes: ['Completeness, Accuracy, Consistency, Timeliness', 'Survivorship & Selection Bias', 'Garbage In Garbage Out', 'Data Cleaning Rules'],
    primary_scenario: 'CampusMart Loyalty & Coffee Shop Feedback',
  },
  {
    id: '03',
    number_label: 'Bài 03',
    title_en: 'From Business Requirements to Data Models',
    title_vi: 'Từ yêu cầu nghiệp vụ đến mô hình dữ liệu',
    key_themes: ['Entities, Attributes, Business Rules', 'Conceptual vs Logical vs Physical Models', 'Historical Price vs Current Price', 'Grain of Data'],
    primary_scenario: 'CampusMart Orders & Internship Placement',
  },
  {
    id: '04',
    number_label: 'Bài 04',
    title_en: 'Relational Model, ERDs and Relationships',
    title_vi: 'Mô hình quan hệ, sơ đồ ERD và các mối quan hệ',
    key_themes: ['1:1, 1:N, M:N Relationships', 'Associative / Junction Entities', 'Optional vs Mandatory Participation', 'Foreign Key Placement'],
    primary_scenario: 'CampusMart OrderLine & Student Internships',
  },
  {
    id: '05',
    number_label: 'Bài 05',
    title_en: 'Keys, Functional Dependencies and Normalization',
    title_vi: 'Khóa, Phụ thuộc hàm và Chuẩn hóa dữ liệu',
    key_themes: ['Candidate, Primary, Surrogate & Composite Keys', 'Partial vs Transitive Dependency', 'Armstrong Augmentation vs Partial Dependency', '1NF, 2NF, 3NF Anomalies'],
    primary_scenario: 'CampusMart Supplier Catalog & Course Enrollment',
  },
  {
    id: '06',
    number_label: 'Bài 06',
    title_en: 'SQL Fundamentals and AI-Assisted Queries',
    title_vi: 'Nền tảng SQL và Truy vấn có AI hỗ trợ',
    key_themes: ['INNER vs LEFT JOIN Fan-out', 'WHERE vs HAVING', 'NULL Three-Valued Logic & COUNT(*) vs COUNT(col)', 'Verifying AI-Generated SQL'],
    primary_scenario: 'CampusMart Sales Analysis & Coffee Shop POS',
  },
  {
    id: '07',
    number_label: 'Bài 07',
    title_en: 'Business Insights, Reporting and KPIs',
    title_vi: 'Phân tích kinh doanh, Báo cáo và chỉ số KPI',
    key_themes: ['Revenue vs Profit', 'Order Count vs Line Item Count', 'Average Order Value (AOV)', 'Vanity Metrics vs Actionable KPIs'],
    primary_scenario: 'CampusMart Executive Dashboard & Small Business KPIs',
  },
  {
    id: '08',
    number_label: 'Bài 08',
    title_en: 'Database Governance, Security and AI Agents',
    title_vi: 'Quản trị cơ sở dữ liệu, Bảo mật và Tác nhân AI',
    key_themes: ['Least Privilege & RBAC', 'SQL Injection & Prompt Injection via DB Agents', 'Read-Only Views for AI Agents', 'Audit Trails & PII Masking'],
    primary_scenario: 'CampusMart AI Assistant & Student Records Governance',
  },
  {
    id: 'INTEGRATED',
    number_label: 'Tích hợp',
    title_en: 'Integrated Multi-Lecture Business Scenarios',
    title_vi: 'Tình huống tích hợp liên bài (ERD + Chuẩn hóa + SQL + KPI + AI)',
    key_themes: ['End-to-End Schema Audit', 'AI Query Debugging + KPI Validation', 'Governance + Data Quality Trade-offs'],
    primary_scenario: 'CampusMart Omnichannel & University Internship Ecosystem',
  },
];

/**
 * Cryptographically unbiased random integer in [0, maxExclusive).
 * Uses rejection sampling over Uint32Array from crypto.getRandomValues.
 */
export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error(`maxExclusive must be a positive integer, got ${maxExclusive}`);
  }
  if (maxExclusive === 1) return 0;

  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - ((maxUint32 + 1) % maxExclusive);
  const buffer = new Uint32Array(1);

  while (true) {
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
      globalThis.crypto.getRandomValues(buffer);
    } else {
      // Node fallback if webcrypto not attached to globalThis
      buffer[0] = Math.floor(Math.random() * (maxUint32 + 1));
    }
    const candidate = buffer[0];
    if (candidate <= limit) {
      return candidate % maxExclusive;
    }
  }
}

/**
 * Deep freeze / snapshot a Question so later edits to the question bank
 * never mutate historical exam attempts or grades.
 */
export function createQuestionSnapshot(question: Question, nowIso?: string): QuestionSnapshot {
  const ts = nowIso || new Date().toISOString();
  return {
    question_id: question.id,
    version: question.version,
    family_id: question.family_id,
    lecture_ids: [...question.lecture_ids],
    topic: question.topic,
    learning_objective: question.learning_objective,
    question_group: question.question_group,
    difficulty_band: question.difficulty_band,
    prompt_en: question.prompt_en,
    prompt_vi: question.prompt_vi,
    context: question.context,
    optional_table_or_diagram: question.optional_table_or_diagram ?? null,
    optional_sql: question.optional_sql ?? null,
    expected_key_points: [...question.expected_key_points],
    acceptable_alternatives: [...question.acceptable_alternatives],
    common_misconceptions: [...question.common_misconceptions],
    optional_follow_up: question.optional_follow_up ?? null,
    rubric: question.rubric.map((c) => ({
      id: c.id,
      name_vi: c.name_vi,
      name_en: c.name_en,
      max_points: c.max_points,
      level_descriptions: { ...c.level_descriptions },
    })),
    max_score: question.max_score,
    time_limit_seconds: question.time_limit_seconds,
    source_refs: [...question.source_refs],
    snapshot_taken_at: ts,
  };
}

/**
 * Determine whether a question falls within the selected exam scope.
 */
export function isQuestionInExamScope(question: Question, examConfig: ExamConfig): boolean {
  if (question.review_status !== 'APPROVED') return false;
  if (!examConfig.allowed_difficulties.includes(question.difficulty_band)) return false;

  const isIntegrated =
    question.lecture_ids.includes('INTEGRATED') || question.lecture_ids.length > 1;

  if (isIntegrated && !examConfig.include_integrated) {
    return false;
  }

  // Every lecture referenced by the question (excluding 'INTEGRATED' tag itself) must be in selected_lectures,
  // or if it's purely tagged 'INTEGRATED', include_integrated must be true and at least 1 selected lecture exists.
  const concreteLectures = question.lecture_ids.filter((id) => id !== 'INTEGRATED');
  if (concreteLectures.length === 0) {
    return examConfig.include_integrated && examConfig.selected_lectures.length > 0;
  }

  return concreteLectures.every((lec) => examConfig.selected_lectures.includes(lec));
}

/**
 * Check if two questions satisfy the lecture separation rule.
 * Default: Q1 and Q2 must come from different lectures.
 * If only 1 lecture is selected in the exam, allow_same_lecture_confirmed must be true.
 */
export function areLecturesCompatible(
  q1: Question | QuestionSnapshot,
  q2: Question | QuestionSnapshot,
  examConfig: ExamConfig
): boolean {
  const l1 = q1.lecture_ids.filter((id) => id !== 'INTEGRATED');
  const l2 = q2.lecture_ids.filter((id) => id !== 'INTEGRATED');

  // Check if there is a pair of distinct lectures between q1 and q2
  const canSeparateLectures =
    l1.length === 0 ||
    l2.length === 0 ||
    l1.some((lec1) => l2.some((lec2) => lec1 !== lec2));

  if (canSeparateLectures) return true;

  // Otherwise both belong exclusively to the exact same single lecture
  if (examConfig.selected_lectures.length === 1 && examConfig.allow_same_lecture_confirmed) {
    return true;
  }

  return false;
}

/**
 * Collect all used question IDs, used family IDs, and lecture usage counts across an exam's attempts.
 * Includes replaced questions so exposed questions are NEVER silently returned to the unused pool.
 */
export function collectExamUsage(attempts: Attempt[], examId: string): {
  usedQuestionIds: Set<string>;
  usedFamilyIds: Set<string>;
  lectureUsageCount: Record<string, number>;
} {
  const usedQuestionIds = new Set<string>();
  const usedFamilyIds = new Set<string>();
  const lectureUsageCount: Record<string, number> = {};

  for (const att of attempts) {
    if (att.exam_id !== examId) continue;
    const assignments = [att.q1_assignment, att.q2_assignment];
    for (const asn of assignments) {
      if (!asn) continue;
      usedQuestionIds.add(asn.question_id);
      usedFamilyIds.add(asn.family_id);
      for (const lec of asn.lecture_ids) {
        lectureUsageCount[lec] = (lectureUsageCount[lec] || 0) + 1;
      }
      // Also mark all historically replaced questions in this slot as used/exposed!
      for (const rep of asn.replacement_history || []) {
        usedQuestionIds.add(rep.old_question_snapshot.question_id);
        usedFamilyIds.add(rep.old_question_snapshot.family_id);
      }
    }
  }

  return { usedQuestionIds, usedFamilyIds, lectureUsageCount };
}

/**
 * Analyze bank capacity for an ExamConfig prior to or during an exam.
 */
export function analyzeBankCapacity(
  questions: Question[],
  examConfig: ExamConfig,
  attempts: Attempt[]
): BankCapacityReport {
  const { usedQuestionIds, usedFamilyIds, lectureUsageCount } = collectExamUsage(
    attempts,
    examConfig.id
  );

  const warnings: string[] = [];
  if (examConfig.selected_lectures.length === 0) {
    return {
      total_questions_in_bank: questions.length,
      approved_in_scope: 0,
      group_a_available: 0,
      group_b_available: 0,
      distinct_families_available: 0,
      estimated_valid_pairs: 0,
      by_lecture: {},
      can_draw_pair: false,
      blocking_reason: 'Chưa chọn bài học nào trong phạm vi đợt thi.',
      warnings: [],
    };
  }

  if (examConfig.selected_lectures.length === 1 && !examConfig.allow_same_lecture_confirmed) {
    return {
      total_questions_in_bank: questions.length,
      approved_in_scope: 0,
      group_a_available: 0,
      group_b_available: 0,
      distinct_families_available: 0,
      estimated_valid_pairs: 0,
      by_lecture: {},
      can_draw_pair: false,
      blocking_reason:
        'Đợt thi chỉ chọn 1 bài học. Giảng viên cần chủ động xác nhận cấu hình cho phép 2 câu cùng bài (vẫn khác family_id).',
      warnings: ['Chỉ có 1 bài học được chọn trong phạm vi thi.'],
    };
  }

  const inScopeApproved = questions.filter((q) => isQuestionInExamScope(q, examConfig));

  const availablePool = examConfig.allow_controlled_repeat
    ? inScopeApproved
    : inScopeApproved.filter(
        (q) => !usedQuestionIds.has(q.id) && !usedFamilyIds.has(q.family_id)
      );

  const poolA = availablePool.filter((q) => q.question_group === 'A_CONCEPT');
  const poolB = availablePool.filter((q) => q.question_group === 'B_APPLIED');

  const distinctFamilies = new Set(availablePool.map((q) => q.family_id));

  const byLecture: BankCapacityReport['by_lecture'] = {};
  for (const lec of examConfig.selected_lectures) {
    const lecApproved = inScopeApproved.filter((q) => q.lecture_ids.includes(lec));
    const lecAvail = availablePool.filter((q) => q.lecture_ids.includes(lec));
    byLecture[lec] = {
      total_approved: lecApproved.length,
      unused_a: lecAvail.filter((q) => q.question_group === 'A_CONCEPT').length,
      unused_b: lecAvail.filter((q) => q.question_group === 'B_APPLIED').length,
      used_count: lectureUsageCount[lec] || 0,
    };
  }

  // Check valid pairs count and estimate maximum non-overlapping pairs
  let validPairCombinations = 0;
  for (const qa of poolA) {
    for (const qb of poolB) {
      if (qa.id === qb.id) continue;
      if (qa.family_id === qb.family_id) continue;
      if (!areLecturesCompatible(qa, qb, examConfig)) continue;
      validPairCombinations++;
    }
  }

  const estimatedDisjointPairs = Math.min(
    new Set(poolA.map((q) => q.family_id)).size,
    new Set(poolB.map((q) => q.family_id)).size,
    Math.floor(distinctFamilies.size / 2)
  );

  let blockingReason: string | null = null;
  if (validPairCombinations === 0) {
    if (poolA.length === 0) {
      blockingReason =
        'Không còn câu hỏi Nhóm A (Hiểu bản chất) đã APPROVED và chưa sử dụng trong phạm vi bài học đã chọn.';
    } else if (poolB.length === 0) {
      blockingReason =
        'Không còn câu hỏi Nhóm B (Vận dụng/Phân tích) đã APPROVED và chưa sử dụng trong phạm vi bài học đã chọn.';
    } else {
      blockingReason =
        'Không còn cặp câu (Nhóm A + Nhóm B) nào thỏa mãn đồng thời điều kiện khác bài học và khác family_id.';
    }
  }

  if (estimatedDisjointPairs <= 5 && validPairCombinations > 0) {
    warnings.push(
      `Sức chứa ngân hàng chưa dùng còn thấp (ước tính tối đa ~${estimatedDisjointPairs} lượt rút độc lập).`
    );
  }

  return {
    total_questions_in_bank: questions.length,
    approved_in_scope: inScopeApproved.length,
    group_a_available: poolA.length,
    group_b_available: poolB.length,
    distinct_families_available: distinctFamilies.size,
    estimated_valid_pairs: validPairCombinations > 0 ? Math.max(1, estimatedDisjointPairs) : 0,
    by_lecture: byLecture,
    can_draw_pair: validPairCombinations > 0,
    blocking_reason: blockingReason,
    warnings,
  };
}

export interface DrawPairResult {
  ok: boolean;
  already_locked: boolean;
  q1_assignment: QuestionAssignment | null;
  q2_assignment: QuestionAssignment | null;
  error_reason: string | null;
}

/**
 * Draw and lock a valid pair (Q1: Group A, Q2: Group B) in a single atomic step.
 * - If the attempt already has a locked pair, returns it idempotently (prevents double-click / multi-tab / refresh bugs).
 * - Balances lecture coverage by prioritizing pairs with minimum combined lecture usage in the exam,
 *   then selects uniformly at random via `secureRandomInt`.
 * - Marks Q1 as revealed=true and Q2 as revealed=false.
 */
export function drawAndLockQuestionPair(
  attempt: Attempt,
  questions: Question[],
  examConfig: ExamConfig,
  allAttemptsInExam: Attempt[],
  nowIso?: string
): DrawPairResult {
  const ts = nowIso || new Date().toISOString();

  // Idempotency guard: if pair is already drawn & locked on this attempt, return existing assignments
  if (attempt.q1_assignment && attempt.q2_assignment) {
    const revealedQ1: QuestionAssignment = {
      ...attempt.q1_assignment,
      revealed: true,
      revealed_at: attempt.q1_assignment.revealed_at || ts,
    };
    return {
      ok: true,
      already_locked: true,
      q1_assignment: revealedQ1,
      q2_assignment: attempt.q2_assignment,
      error_reason: null,
    };
  }

  if (examConfig.selected_lectures.length === 0) {
    return {
      ok: false,
      already_locked: false,
      q1_assignment: null,
      q2_assignment: null,
      error_reason: 'Chưa chọn bài học nào trong phạm vi đợt thi.',
    };
  }

  if (examConfig.selected_lectures.length === 1 && !examConfig.allow_same_lecture_confirmed) {
    return {
      ok: false,
      already_locked: false,
      q1_assignment: null,
      q2_assignment: null,
      error_reason:
        'Đợt thi chỉ chọn 1 bài học. Vui lòng xác nhận cấu hình cho phép 2 câu cùng bài học trước khi rút đề.',
    };
  }

  const { usedQuestionIds, usedFamilyIds, lectureUsageCount } = collectExamUsage(
    allAttemptsInExam,
    examConfig.id
  );

  const inScopeApproved = questions.filter((q) => isQuestionInExamScope(q, examConfig));

  const candidatePool = examConfig.allow_controlled_repeat
    ? inScopeApproved
    : inScopeApproved.filter(
        (q) => !usedQuestionIds.has(q.id) && !usedFamilyIds.has(q.family_id)
      );

  const poolA = candidatePool.filter((q) => q.question_group === 'A_CONCEPT');
  const poolB = candidatePool.filter((q) => q.question_group === 'B_APPLIED');

  interface CandidatePair {
    q1: Question;
    q2: Question;
    usageScore: number;
  }

  const validPairs: CandidatePair[] = [];

  for (const qa of poolA) {
    for (const qb of poolB) {
      if (qa.id === qb.id) continue;
      if (qa.family_id === qb.family_id) continue;
      if (!areLecturesCompatible(qa, qb, examConfig)) continue;

      const lecA = qa.lecture_ids[0] || '01';
      const lecB = qb.lecture_ids[0] || '01';
      const usageScore = (lectureUsageCount[lecA] || 0) + (lectureUsageCount[lecB] || 0);
      validPairs.push({ q1: qa, q2: qb, usageScore });
    }
  }

  if (validPairs.length === 0) {
    return {
      ok: false,
      already_locked: false,
      q1_assignment: null,
      q2_assignment: null,
      error_reason:
        'Không còn cặp câu hỏi hợp lệ (Nhóm A + Nhóm B, khác bài học, khác family_id) trong ngân hàng câu đã APPROVED. Hệ thống dừng rút đề và không tự ý bỏ ràng buộc. Giảng viên có thể duyệt thêm câu hỏi hoặc bật chế độ lặp có kiểm soát.',
    };
  }

  // Balance lecture coverage: find minimum usageScore Tier
  let minScore = Infinity;
  for (const p of validPairs) {
    if (p.usageScore < minScore) {
      minScore = p.usageScore;
    }
  }

  const leastUsedPairs = validPairs.filter((p) => p.usageScore === minScore);
  const chosenIndex = secureRandomInt(leastUsedPairs.length);
  const chosen = leastUsedPairs[chosenIndex];

  const q1Snapshot = createQuestionSnapshot(chosen.q1, ts);
  const q2Snapshot = createQuestionSnapshot(chosen.q2, ts);

  const q1Assignment: QuestionAssignment = {
    slot: 1,
    question_id: chosen.q1.id,
    family_id: chosen.q1.family_id,
    lecture_ids: [...chosen.q1.lecture_ids],
    question_group: 'A_CONCEPT',
    revealed: true,
    revealed_at: ts,
    locked_at: ts,
    snapshot: q1Snapshot,
    replacement_history: [],
  };

  const q2Assignment: QuestionAssignment = {
    slot: 2,
    question_id: chosen.q2.id,
    family_id: chosen.q2.family_id,
    lecture_ids: [...chosen.q2.lecture_ids],
    question_group: 'B_APPLIED',
    revealed: false, // Strictly hidden until "Rút câu 2" is clicked!
    revealed_at: null,
    locked_at: ts,
    snapshot: q2Snapshot,
    replacement_history: [],
  };

  return {
    ok: true,
    already_locked: false,
    q1_assignment: q1Assignment,
    q2_assignment: q2Assignment,
    error_reason: null,
  };
}

/**
 * Reveal Question 2 that was already locked when Question 1 was drawn.
 */
export function revealLockedQuestion2(
  attempt: Attempt,
  nowIso?: string
): { ok: boolean; q2_assignment: QuestionAssignment | null; error_reason: string | null } {
  if (!attempt.q1_assignment || !attempt.q2_assignment) {
    return {
      ok: false,
      q2_assignment: null,
      error_reason: 'Chưa rút Câu 1 nên chưa có Câu 2 được khóa.',
    };
  }
  const ts = nowIso || new Date().toISOString();
  const updatedQ2: QuestionAssignment = {
    ...attempt.q2_assignment,
    revealed: true,
    revealed_at: attempt.q2_assignment.revealed_at || ts,
  };
  return {
    ok: true,
    q2_assignment: updatedQ2,
    error_reason: null,
  };
}

/**
 * Replace an assigned question in slot 1 or 2 when instructor provides a valid reason.
 * Old exposed question stays recorded in replacement_history so it is never silently returned to unused pool.
 */
export function replaceAssignedQuestion(
  attempt: Attempt,
  slot: 1 | 2,
  reason: string,
  replacedBy: string,
  questions: Question[],
  examConfig: ExamConfig,
  allAttemptsInExam: Attempt[],
  nowIso?: string
): {
  ok: boolean;
  updated_assignment: QuestionAssignment | null;
  error_reason: string | null;
} {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return {
      ok: false,
      updated_assignment: null,
      error_reason: 'Vui lòng nhập lý do đổi câu hỏi (ví dụ: câu lỗi dữ liệu hoặc lệch phạm vi).',
    };
  }

  const targetAssignment = slot === 1 ? attempt.q1_assignment : attempt.q2_assignment;
  const otherAssignment = slot === 1 ? attempt.q2_assignment : attempt.q1_assignment;

  if (!targetAssignment || !otherAssignment) {
    return {
      ok: false,
      updated_assignment: null,
      error_reason: 'Lượt thi chưa có cặp câu hỏi được khóa để thay thế.',
    };
  }

  const { usedQuestionIds, usedFamilyIds, lectureUsageCount } = collectExamUsage(
    allAttemptsInExam,
    examConfig.id
  );
  // Ensure current attempt's questions are also excluded
  usedQuestionIds.add(targetAssignment.question_id);
  usedFamilyIds.add(targetAssignment.family_id);
  usedQuestionIds.add(otherAssignment.question_id);
  usedFamilyIds.add(otherAssignment.family_id);

  const requiredGroup = slot === 1 ? 'A_CONCEPT' : 'B_APPLIED';
  const inScopeApproved = questions.filter(
    (q) => isQuestionInExamScope(q, examConfig) && q.question_group === requiredGroup
  );

  const eligibleReplacements = inScopeApproved.filter((q) => {
    if (q.id === targetAssignment.question_id || q.id === otherAssignment.question_id) {
      return false;
    }
    if (q.family_id === targetAssignment.family_id || q.family_id === otherAssignment.family_id) {
      return false;
    }
    if (!examConfig.allow_controlled_repeat) {
      if (usedQuestionIds.has(q.id) || usedFamilyIds.has(q.family_id)) {
        return false;
      }
    }
    return areLecturesCompatible(q, otherAssignment.snapshot, examConfig);
  });

  if (eligibleReplacements.length === 0) {
    return {
      ok: false,
      updated_assignment: null,
      error_reason:
        'Không tìm thấy câu hỏi thay thế hợp lệ thỏa mãn điều kiện nhóm câu, khác bài học và khác family_id.',
    };
  }

  let minUsage = Infinity;
  for (const q of eligibleReplacements) {
    const lec = q.lecture_ids[0] || '01';
    const u = lectureUsageCount[lec] || 0;
    if (u < minUsage) minUsage = u;
  }

  const bestPool = eligibleReplacements.filter(
    (q) => (lectureUsageCount[q.lecture_ids[0] || '01'] || 0) === minUsage
  );
  const chosen = bestPool[secureRandomInt(bestPool.length)];
  const ts = nowIso || new Date().toISOString();
  const newSnapshot = createQuestionSnapshot(chosen, ts);

  const updatedAssignment: QuestionAssignment = {
    slot,
    question_id: chosen.id,
    family_id: chosen.family_id,
    lecture_ids: [...chosen.lecture_ids],
    question_group: requiredGroup,
    revealed: true,
    revealed_at: ts,
    locked_at: ts,
    snapshot: newSnapshot,
    replacement_history: [
      ...(targetAssignment.replacement_history || []),
      {
        slot,
        old_question_snapshot: targetAssignment.snapshot,
        new_question_snapshot: newSnapshot,
        reason: trimmedReason,
        replaced_by: replacedBy,
        replaced_at: ts,
      },
    ],
  };

  return {
    ok: true,
    updated_assignment: updatedAssignment,
    error_reason: null,
  };
}

/**
 * Validate a single criterion score:
 * - null is valid (represents ungraded state, NOT 0)
 * - number must be in [0, maxPoints] and a multiple of 0.25
 */
export function validateCriterionScore(
  score: number | null,
  maxPoints: number
): { valid: boolean; error: string | null } {
  if (score === null) {
    return { valid: true, error: null };
  }
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return { valid: false, error: 'Điểm phải là số hợp lệ hoặc để trống (chưa chấm).' };
  }
  if (score < 0 || score > maxPoints) {
    return {
      valid: false,
      error: `Điểm tiêu chí phải nằm trong khoảng từ 0 đến ${maxPoints}.`,
    };
  }
  // Check step of 0.25 using integer multiplication
  const scaled = Math.round(score * 100);
  if (scaled % 25 !== 0) {
    return {
      valid: false,
      error: 'Điểm tiêu chí phải theo bước 0,25 (ví dụ: 0, 0.25, 0.5, 0.75, 1.0...).',
    };
  }
  return { valid: true, error: null };
}

/**
 * Compute total score for a single question (max 5).
 * If any rubric criterion has score === null, returns null (not 0!).
 */
export function computeQuestionTotalScore(
  criterionScores: CriterionScore[],
  rubric: RubricCriterion[]
): { valid: boolean; total: number | null; error: string | null } {
  if (rubric.length === 0) {
    return { valid: false, total: null, error: 'Rubric không có tiêu chí.' };
  }

  let sum = 0;
  for (const crit of rubric) {
    const entry = criterionScores.find((c) => c.criterion_id === crit.id);
    const val = entry ? entry.score : null;
    const check = validateCriterionScore(val, crit.max_points);
    if (!check.valid) {
      return { valid: false, total: null, error: check.error };
    }
    if (val === null) {
      return { valid: true, total: null, error: null };
    }
    sum += val;
  }

  const rounded = Math.round(sum * 100) / 100;
  if (rounded < 0 || rounded > 5) {
    return { valid: false, total: null, error: 'Tổng điểm một câu không được vượt quá 5,0.' };
  }
  return { valid: true, total: rounded, error: null };
}

/**
 * Check whether an attempt can be finalized & saved as COMPLETED.
 * Requires both Q1 and Q2 revealed and every criterion in Q1 & Q2 scored (non-null).
 */
export function canFinalizeAttempt(attempt: Attempt): {
  allowed: boolean;
  totalScore: number | null;
  reason: string | null;
} {
  if (!attempt.q1_assignment || !attempt.q1_assignment.revealed) {
    return { allowed: false, totalScore: null, reason: 'Chưa rút Câu 1.' };
  }
  if (!attempt.q2_assignment || !attempt.q2_assignment.revealed) {
    return { allowed: false, totalScore: null, reason: 'Chưa mở và chấm Câu 2.' };
  }
  if (!attempt.q1_grade || attempt.q1_grade.total_score === null) {
    return {
      allowed: false,
      totalScore: null,
      reason: 'Câu 1 chưa được chấm đủ các tiêu chí trong rubric.',
    };
  }
  if (!attempt.q2_grade || attempt.q2_grade.total_score === null) {
    return {
      allowed: false,
      totalScore: null,
      reason: 'Câu 2 chưa được chấm đủ các tiêu chí trong rubric.',
    };
  }

  const q1Check = computeQuestionTotalScore(
    attempt.q1_grade.criterion_scores,
    attempt.q1_assignment.snapshot.rubric
  );
  if (!q1Check.valid || q1Check.total === null) {
    return {
      allowed: false,
      totalScore: null,
      reason: q1Check.error || 'Điểm Câu 1 chưa hoàn tất.',
    };
  }

  const q2Check = computeQuestionTotalScore(
    attempt.q2_grade.criterion_scores,
    attempt.q2_assignment.snapshot.rubric
  );
  if (!q2Check.valid || q2Check.total === null) {
    return {
      allowed: false,
      totalScore: null,
      reason: q2Check.error || 'Điểm Câu 2 chưa hoàn tất.',
    };
  }

  const finalTotal = Math.round((q1Check.total + q2Check.total) * 100) / 100;
  if (finalTotal < 0 || finalTotal > 10) {
    return {
      allowed: false,
      totalScore: null,
      reason: 'Tổng điểm hai câu vượt giới hạn 10,0.',
    };
  }

  return {
    allowed: true,
    totalScore: finalTotal,
    reason: null,
  };
}

/**
 * Build an empty Grade object for a newly drawn or replaced question slot.
 * All criterion scores start as `null` (never 0!).
 */
export function createEmptyGrade(
  slot: 1 | 2,
  snapshot: QuestionSnapshot,
  graderName: string
): Grade {
  return {
    question_slot: slot,
    question_id: snapshot.question_id,
    criterion_scores: snapshot.rubric.map((c) => ({
      criterion_id: c.id,
      score: null,
    })),
    total_score: null,
    instructor_notes: '',
    answer_evidence: '',
    follow_up_used: false,
    graded_by: graderName,
    graded_at: null,
  };
}

/**
 * Create a sanitized student-facing ProjectorPayload.
 * Explicitly omits expected_key_points, acceptable_alternatives, common_misconceptions,
 * rubric, grades, and instructor notes so private grading data never reaches the projector window.
 */
export function createProjectorPayload(params: {
  workspace: WorkspaceMode;
  examTitle: string;
  attempt: Attempt | null;
  timerRemainingSeconds: number;
  timerTotalSeconds: number;
  timerRunning: boolean;
  language: DisplayLanguage;
  showFollowUp?: boolean;
}): ProjectorPayload {
  const {
    workspace,
    examTitle,
    attempt,
    timerRemainingSeconds,
    timerTotalSeconds,
    timerRunning,
    language,
    showFollowUp = false,
  } = params;

  if (!attempt || !attempt.active_slot) {
    return {
      workspace,
      exam_title: examTitle,
      student_id: attempt?.student_id || null,
      student_name: attempt?.student_name || null,
      class_name: attempt?.class_name || null,
      active_slot: null,
      question_group_label: null,
      lecture_label: null,
      prompt_en: null,
      prompt_vi: null,
      context: null,
      optional_table_or_diagram: null,
      optional_sql: null,
      follow_up_visible: false,
      optional_follow_up: null,
      timer_remaining_seconds: timerRemainingSeconds,
      timer_total_seconds: timerTotalSeconds,
      timer_running: false,
      timer_expired: false,
      language,
      updated_at: new Date().toISOString(),
    };
  }

  const activeAssignment =
    attempt.active_slot === 1 ? attempt.q1_assignment : attempt.q2_assignment;

  if (!activeAssignment || !activeAssignment.revealed) {
    return {
      workspace,
      exam_title: examTitle,
      student_id: attempt.student_id,
      student_name: attempt.student_name,
      class_name: attempt.class_name,
      active_slot: attempt.active_slot,
      question_group_label: null,
      lecture_label: null,
      prompt_en: null,
      prompt_vi: null,
      context: null,
      optional_table_or_diagram: null,
      optional_sql: null,
      follow_up_visible: false,
      optional_follow_up: null,
      timer_remaining_seconds: timerRemainingSeconds,
      timer_total_seconds: timerTotalSeconds,
      timer_running: false,
      timer_expired: false,
      language,
      updated_at: new Date().toISOString(),
    };
  }

  const snap = activeAssignment.snapshot;
  const groupLabel =
    snap.question_group === 'A_CONCEPT'
      ? 'Câu 1 / 2 — Nhóm A: Hiểu bản chất (5,0 điểm)'
      : 'Câu 2 / 2 — Nhóm B: Vận dụng & Phân tích (5,0 điểm)';
  const lectureLabel = snap.lecture_ids.map((id) => `Bài ${id}`).join(', ');

  return {
    workspace,
    exam_title: examTitle,
    student_id: attempt.student_id,
    student_name: attempt.student_name,
    class_name: attempt.class_name,
    active_slot: attempt.active_slot,
    question_group_label: groupLabel,
    lecture_label: lectureLabel,
    prompt_en: snap.prompt_en,
    prompt_vi: snap.prompt_vi,
    context: snap.context,
    optional_table_or_diagram: snap.optional_table_or_diagram ?? null,
    optional_sql: snap.optional_sql ?? null,
    follow_up_visible: Boolean(showFollowUp && snap.optional_follow_up),
    optional_follow_up: showFollowUp ? snap.optional_follow_up ?? null : null,
    timer_remaining_seconds: timerRemainingSeconds,
    timer_total_seconds: timerTotalSeconds,
    timer_running: timerRunning,
    timer_expired: timerRemainingSeconds <= 0,
    language,
    updated_at: new Date().toISOString(),
  };
}

/**
 * RFC-4180 compliant state-machine CSV parser.
 * Handles commas inside quotes, escaped quotes (""), multiline fields, and UTF-8 BOM.
 */
export function parseCsvMatrix(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];
    const nextCh = cleanText[i + 1];

    if (inQuotes) {
      if (ch === '"' && nextCh === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (ch === '\r' && nextCh === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += ch;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

export interface StudentCsvParseResult {
  validStudents: Student[];
  errors: { line: number; message: string }[];
  duplicateIdsInFile: string[];
  existingDuplicateIds: string[];
}

/**
 * Parse Student list CSV.
 * Preserves leading zeros on student_id, supports Vietnamese headers or standard English headers,
 * and checks for duplicate student_id both inside the CSV and against existing students.
 */
export function parseStudentCsv(
  csvText: string,
  existingStudents: Student[],
  defaultClassId = 'CLASS_HSB3102E_01',
  nowIso?: string
): StudentCsvParseResult {
  const rows = parseCsvMatrix(csvText);
  if (rows.length === 0) {
    return {
      validStudents: [],
      errors: [{ line: 1, message: 'File CSV trống.' }],
      duplicateIdsInFile: [],
      existingDuplicateIds: [],
    };
  }

  // Locate header row (within first 5 rows)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const normalized = rows[i].map((c) => c.toLowerCase());
    if (
      normalized.some(
        (c) =>
          c.includes('student_id') ||
          c.includes('mã sinh viên') ||
          c.includes('mssv') ||
          c.includes('ma_sv')
      )
    ) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = rows[headerRowIndex].map((h) => h.toLowerCase().trim());
  const idIdx = headers.findIndex(
    (h) =>
      h === 'student_id' ||
      h === 'mssv' ||
      h === 'ma_sv' ||
      h.includes('mã sinh viên') ||
      h.includes('ma sinh vien')
  );
  const nameIdx = headers.findIndex(
    (h) =>
      h === 'full_name' ||
      h === 'name' ||
      h === 'ho_ten' ||
      h.includes('họ tên') ||
      h.includes('họ và tên')
  );
  const classIdx = headers.findIndex(
    (h) =>
      h === 'class_name' ||
      h === 'class' ||
      h === 'lop' ||
      h.includes('lớp')
  );
  const emailIdx = headers.findIndex((h) => h.includes('email'));

  if (idIdx === -1 || nameIdx === -1) {
    return {
      validStudents: [],
      errors: [
        {
          line: headerRowIndex + 1,
          message:
            'Không tìm thấy cột bắt buộc: student_id (hoặc MSSV / Mã sinh viên) và full_name (hoặc Họ tên).',
        },
      ],
      duplicateIdsInFile: [],
      existingDuplicateIds: [],
    };
  }

  const existingIds = new Set(existingStudents.map((s) => s.student_id));
  const seenInFile = new Set<string>();
  const duplicateIdsInFile: string[] = [];
  const existingDuplicateIds: string[] = [];
  const validStudents: Student[] = [];
  const errors: { line: number; message: string }[] = [];
  const ts = nowIso || new Date().toISOString();

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    const lineNum = r + 1;
    // Strip leading single quote if Excel exported `'00123` to preserve leading zeros
    const rawStudentId = (row[idIdx] || '').replace(/^'/, '').trim();
    const fullName = (row[nameIdx] || '').trim();
    const className =
      classIdx !== -1 && row[classIdx] ? row[classIdx].trim() : 'HSB3102E-01';
    const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : '';

    if (!rawStudentId && !fullName) continue;

    if (!rawStudentId) {
      errors.push({ line: lineNum, message: 'Thiếu mã sinh viên (student_id).' });
      continue;
    }
    if (!fullName) {
      errors.push({
        line: lineNum,
        message: `Sinh viên mã "${rawStudentId}" thiếu họ tên (full_name).`,
      });
      continue;
    }

    if (seenInFile.has(rawStudentId)) {
      duplicateIdsInFile.push(rawStudentId);
      errors.push({
        line: lineNum,
        message: `Mã sinh viên "${rawStudentId}" bị trùng lặp ngay trong file CSV.`,
      });
      continue;
    }
    seenInFile.add(rawStudentId);

    if (existingIds.has(rawStudentId)) {
      existingDuplicateIds.push(rawStudentId);
      errors.push({
        line: lineNum,
        message: `Mã sinh viên "${rawStudentId}" đã tồn tại trong danh sách lớp hiện tại.`,
      });
      continue;
    }

    validStudents.push({
      id: `STU_${rawStudentId}_${ r }`,
      student_id: rawStudentId, // Keeps leading zeros intact as string!
      full_name: fullName,
      class_id: defaultClassId,
      class_name: className,
      email,
      created_at: ts,
    });
  }

  return {
    validStudents,
    errors,
    duplicateIdsInFile,
    existingDuplicateIds,
  };
}

/**
 * Parse a Blooket CSV export.
 * - Detects the actual header row even when preceded by banner rows (e.g., "Blooket Import Template").
 * - Reads Question Text, Answer 1..4, Correct Answer(s), Time Limit.
 * - Preserves the original MCQ question and options in `original_mcq_reference`.
 * - Marks `review_status: 'DRAFT'` and `needs_oral_conversion: true` so MCQs are NEVER placed directly into an oral exam without conversion and approval.
 */
export function parseBlooketCsvToDraftQuestions(
  csvText: string,
  targetLecture: LectureId = '01',
  nowIso?: string
): {
  importedDrafts: Question[];
  errors: { line: number; message: string }[];
  detectedHeaderLine: number;
} {
  const rows = parseCsvMatrix(csvText);
  if (rows.length === 0) {
    return {
      importedDrafts: [],
      errors: [{ line: 1, message: 'File CSV Blooket trống.' }],
      detectedHeaderLine: 0,
    };
  }

  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const lowerCells = rows[i].map((c) => c.toLowerCase());
    if (
      lowerCells.some((c) => c.includes('question text')) &&
      lowerCells.some((c) => c.includes('answer 1'))
    ) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    return {
      importedDrafts: [],
      errors: [
        {
          line: 1,
          message:
            'Không tìm thấy hàng tiêu đề Blooket chuẩn (cần có cột "Question Text" và "Answer 1").',
        },
      ],
      detectedHeaderLine: 0,
    };
  }

  const header = rows[headerRowIdx].map((h) => h.toLowerCase().trim());
  const qTextIdx = header.findIndex((h) => h.includes('question text'));
  const ans1Idx = header.findIndex((h) => h.includes('answer 1'));
  const ans2Idx = header.findIndex((h) => h.includes('answer 2'));
  const ans3Idx = header.findIndex((h) => h.includes('answer 3'));
  const ans4Idx = header.findIndex((h) => h.includes('answer 4'));
  const correctIdx = header.findIndex((h) => h.includes('correct answer'));

  const importedDrafts: Question[] = [];
  const errors: { line: number; message: string }[] = [];
  const ts = nowIso || new Date().toISOString();

  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    const lineNum = r + 1;
    const rawQuestion = (row[qTextIdx] || '').trim();
    if (!rawQuestion) continue;

    const a1 = ans1Idx !== -1 ? (row[ans1Idx] || '').trim() : '';
    const a2 = ans2Idx !== -1 ? (row[ans2Idx] || '').trim() : '';
    const a3 = ans3Idx !== -1 ? (row[ans3Idx] || '').trim() : '';
    const a4 = ans4Idx !== -1 ? (row[ans4Idx] || '').trim() : '';
    const correctRaw = correctIdx !== -1 ? (row[correctIdx] || '').trim() : '1';

    const optionsMap: Record<string, string> = { '1': a1, '2': a2, '3': a3, '4': a4 };
    const correctChoiceText =
      optionsMap[correctRaw] || a1 || 'Chưa xác định đáp án gốc';

    // Remove "Which of the following..." stem phrasing for the draft prompt template
    const cleanedOralStem = rawQuestion.replace(
      /^which of the following\s+/i,
      '[CẦN CHUYỂN THÀNH CÂU HỎI TỰ LUẬN VẤN ĐÁP] Explain and justify: '
    );

    const mcqRef = `Câu gốc Blooket: "${rawQuestion}" | Các lựa chọn: (1) ${a1} | (2) ${a2} | (3) ${a3} | (4) ${a4} | Đáp án đúng gốc: [${correctRaw}] ${correctChoiceText}`;

    importedDrafts.push({
      id: `BLK_${targetLecture}_${r}_${Date.now().toString().slice(-4)}`,
      version: 1,
      family_id: `FAM_BLK_${targetLecture}_${r}`,
      lecture_ids: [targetLecture],
      topic: `Chuyển đổi từ Blooket (Bài ${targetLecture})`,
      learning_objective: 'Cần giảng viên biên tập câu hỏi vấn đáp và rubric trước khi duyệt',
      question_group: 'A_CONCEPT',
      difficulty_band: 'CORE',
      prompt_en: cleanedOralStem,
      prompt_vi: `[Cần biên tập bản dịch tiếng Việt từ câu trắc nghiệm gốc]: ${rawQuestion}`,
      context: 'Imported from Blooket CSV — Requires manual oral question conversion before approval.',
      optional_table_or_diagram: null,
      optional_sql: null,
      expected_key_points: [
        `Ý cốt lõi từ đáp án gốc: ${correctChoiceText}`,
        'Cần bổ sung giải thích bản chất và ví dụ thực tế trước khi chuyển sang APPROVED.',
      ],
      acceptable_alternatives: [
        'Sinh viên diễn đạt bằng lời văn riêng nhưng nêu đúng bản chất và giải thích được lý do.',
      ],
      common_misconceptions: [
        a2 && a2 !== correctChoiceText ? `Nhầm lẫn với phương án nhiễu: ${a2}` : 'Trả lời học vẹt không giải thích được tại sao.',
        a3 && a3 !== correctChoiceText ? `Nhầm lẫn với phương án nhiễu: ${a3}` : 'Không đưa được ví dụ minh họa.',
      ],
      optional_follow_up: 'Can you give a concrete example from CampusMart to illustrate your answer?',
      rubric: [
        {
          id: 'CRIT_ACCURACY',
          name_vi: 'Độ chính xác của kiến thức / kết quả',
          name_en: 'Conceptual / Result Accuracy',
          max_points: 2,
          level_descriptions: {
            full: `Nêu chính xác bản chất (${correctChoiceText}).`,
            partial: 'Nêu đúng hướng nhưng còn thiếu một phần điều kiện.',
            minimal: 'Trả lời sai bản chất hoặc không trả lời được.',
          },
        },
        {
          id: 'CRIT_REASONING',
          name_vi: 'Giải thích và lập luận',
          name_en: 'Explanation & Reasoning',
          max_points: 2,
          level_descriptions: {
            full: 'Giải thích rõ cơ chế vì sao đúng và vì sao các cách hiểu khác sai.',
            partial: 'Giải thích còn sơ sài.',
            minimal: 'Chỉ đoán mò, không giải thích được.',
          },
        },
        {
          id: 'CRIT_APPLICATION',
          name_vi: 'Ví dụ, kiểm chứng hoặc vận dụng phù hợp',
          name_en: 'Example, Verification or Application',
          max_points: 1,
          level_descriptions: {
            full: 'Đưa được ví dụ thực tế hợp lý (CampusMart / quán cà phê / thực tập).',
            partial: 'Ví dụ chưa thật sát.',
            minimal: 'Không nêu được ví dụ.',
          },
        },
      ],
      max_score: 5,
      time_limit_seconds: 120,
      source_refs: ['Imported from Blooket CSV (Chưa đối chiếu số trang/slide)'],
      review_status: 'DRAFT', // Strictly DRAFT!
      needs_oral_conversion: true,
      original_mcq_reference: mcqRef,
      created_at: ts,
      updated_at: ts,
    });
  }

  return {
    importedDrafts,
    errors,
    detectedHeaderLine: headerRowIdx + 1,
  };
}

/**
 * Prevent CSV / Excel Formula Injection when exporting untrusted strings.
 * Prefixes cells starting with `=`, `+`, `-`, `@`, `\t`, `\r` with a single quote `'`,
 * except plain negative numbers like `-5` or `-2.5`.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.length === 0) return '';

  const firstChar = str[0];
  const isDangerousLeader =
    firstChar === '=' ||
    firstChar === '+' ||
    firstChar === '@' ||
    firstChar === '\t' ||
    firstChar === '\r' ||
    (firstChar === '-' && !/^-\d+(\.\d+)?$/.test(str));

  const safeStr = isDangerousLeader ? `'${str}` : str;
  if (safeStr.includes(',') || safeStr.includes('"') || safeStr.includes('\n') || safeStr.includes('\r')) {
    return `"${safeStr.replace(/"/g, '""')}"`;
  }
  return safeStr;
}

/**
 * Generate UTF-8 CSV string (with BOM for Excel Vietnamese compatibility) for the Gradebook.
 * Does NOT include confidential full answer keys in the standard gradebook export.
 */
export function exportGradebookCsv(exam: ExamConfig, attempts: Attempt[]): string {
  const headers = [
    'Đợt thi',
    'Lớp',
    'Mã sinh viên',
    'Họ tên',
    'Lượt thi',
    'Mã câu 1',
    'Bài 1',
    'Điểm câu 1 (/5)',
    'Mã câu 2',
    'Bài 2',
    'Điểm câu 2 (/5)',
    'Tổng điểm (/10)',
    'Trạng thái',
    'Nhận xét',
    'Thời điểm hoàn tất',
  ];

  const statusLabels: Record<string, string> = {
    NOT_STARTED: 'Chưa thi',
    IN_PROGRESS: 'Đang thi',
    PENDING_FINALIZE: 'Chờ hoàn tất',
    COMPLETED: 'Hoàn tất',
    ABSENT: 'Vắng',
    DEFERRED: 'Hoãn',
  };

  const lines: string[] = [headers.map(sanitizeCsvCell).join(',')];

  for (const att of attempts) {
    if (att.exam_id !== exam.id) continue;
    const q1Code = att.q1_assignment?.question_id || '';
    const q1Lec = att.q1_assignment?.lecture_ids.join('+') || '';
    const q1Score =
      att.q1_grade && att.q1_grade.total_score !== null
        ? att.q1_grade.total_score.toFixed(2)
        : '';

    const q2Code = att.q2_assignment?.question_id || '';
    const q2Lec = att.q2_assignment?.lecture_ids.join('+') || '';
    const q2Score =
      att.q2_grade && att.q2_grade.total_score !== null
        ? att.q2_grade.total_score.toFixed(2)
        : '';

    const totalScore =
      att.total_score !== null && att.total_score !== undefined
        ? att.total_score.toFixed(2)
        : '';

    const combinedNotes = [
      att.q1_grade?.instructor_notes ? `[Câu 1]: ${att.q1_grade.instructor_notes}` : '',
      att.q2_grade?.instructor_notes ? `[Câu 2]: ${att.q2_grade.instructor_notes}` : '',
      att.general_comment || '',
      att.status_reason ? `[Lý do TT]: ${att.status_reason}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    // Preserve leading zeros on student_id in Excel by prefixing `'` if starts with `0`
    const exportedStudentId = att.student_id.startsWith('0')
      ? `'${att.student_id}`
      : att.student_id;

    const row = [
      exam.title,
      att.class_name,
      exportedStudentId,
      att.student_name,
      att.is_retake ? `Thi lại (Lần ${att.attempt_number})` : 'Chính thức (Lần 1)',
      q1Code,
      q1Lec,
      q1Score,
      q2Code,
      q2Lec,
      q2Score,
      totalScore,
      statusLabels[att.status] || att.status,
      combinedNotes,
      att.completed_at || '',
    ];

    lines.push(row.map(sanitizeCsvCell).join(','));
  }

  return '\uFEFF' + lines.join('\r\n');
}

/**
 * Normalize text for near-duplicate question detection.
 */
export function normalizeQuestionText(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are',
    'why', 'how', 'what', 'explain', 'campusmart', 'database', 'table', 'data', 'student',
    'with', 'by', 'from', 'that', 'this', 'does', 'do', 'can', 'when', 'between'
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

/**
 * Detect near-duplicate questions using token Jaccard similarity.
 * Reports pairs whose similarity >= threshold (default 0.68) so instructor can verify family_id grouping.
 */
export function detectNearDuplicates(
  questions: Question[],
  similarityThreshold = 0.68
): NearDuplicatePair[] {
  const tokenSets = questions.map((q) => ({
    q,
    tokens: new Set(normalizeQuestionText(`${q.prompt_en} ${q.topic}`)),
  }));

  const pairs: NearDuplicatePair[] = [];

  for (let i = 0; i < tokenSets.length; i++) {
    const a = tokenSets[i];
    if (a.tokens.size === 0) continue;
    for (let j = i + 1; j < tokenSets.length; j++) {
      const b = tokenSets[j];
      if (b.tokens.size === 0) continue;

      let intersection = 0;
      for (const t of a.tokens) {
        if (b.tokens.has(t)) intersection++;
      }
      const union = a.tokens.size + b.tokens.size - intersection;
      const sim = union > 0 ? intersection / union : 0;

      if (sim >= similarityThreshold && a.q.family_id !== b.q.family_id) {
        pairs.push({
          question_a_id: a.q.id,
          question_b_id: b.q.id,
          family_a: a.q.family_id,
          family_b: b.q.family_id,
          lecture_a: a.q.lecture_ids.join(','),
          lecture_b: b.q.lecture_ids.join(','),
          similarity: Math.round(sim * 100) / 100,
          prompt_a_preview: a.q.prompt_en.slice(0, 110),
          prompt_b_preview: b.q.prompt_en.slice(0, 110),
          same_family: a.q.family_id === b.q.family_id,
        });
      }
    }
  }

  return pairs.sort((x, y) => y.similarity - x.similarity);
}
