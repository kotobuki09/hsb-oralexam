export type LectureId = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | 'INTEGRATED';

export type QuestionGroup = 'A_CONCEPT' | 'B_APPLIED';

export type DifficultyBand = 'CORE' | 'PROFICIENT' | 'ADVANCED';

export type ReviewStatus = 'DRAFT' | 'APPROVED' | 'ARCHIVED';

export type AttemptStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PENDING_FINALIZE'
  | 'COMPLETED'
  | 'ABSENT'
  | 'DEFERRED';

export type DisplayLanguage = 'EN' | 'VI' | 'BILINGUAL';

export type WorkspaceMode = 'official' | 'demo';

export interface RubricCriterion {
  id: string;
  name_vi: string;
  name_en: string;
  max_points: number; // Default: 2, 2, 1 (sum = 5)
  level_descriptions: {
    full: string;
    partial: string;
    minimal: string;
  };
}

export interface Question {
  id: string;
  version: number;
  family_id: string;
  lecture_ids: LectureId[];
  topic: string;
  learning_objective: string;
  question_group: QuestionGroup;
  difficulty_band: DifficultyBand;
  prompt_en: string;
  prompt_vi: string;
  context: string;
  optional_table_or_diagram?: string | null;
  optional_sql?: string | null;
  expected_key_points: string[];
  acceptable_alternatives: string[];
  common_misconceptions: string[];
  optional_follow_up?: string | null;
  rubric: RubricCriterion[];
  max_score: number; // default 5
  time_limit_seconds: number; // default 120
  source_refs: string[];
  review_status: ReviewStatus;
  needs_oral_conversion?: boolean;
  original_mcq_reference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionSnapshot {
  question_id: string;
  version: number;
  family_id: string;
  lecture_ids: LectureId[];
  topic: string;
  learning_objective: string;
  question_group: QuestionGroup;
  difficulty_band: DifficultyBand;
  prompt_en: string;
  prompt_vi: string;
  context: string;
  optional_table_or_diagram?: string | null;
  optional_sql?: string | null;
  expected_key_points: string[];
  acceptable_alternatives: string[];
  common_misconceptions: string[];
  optional_follow_up?: string | null;
  rubric: RubricCriterion[];
  max_score: number;
  time_limit_seconds: number;
  source_refs: string[];
  snapshot_taken_at: string;
}

export interface ClassRoom {
  id: string;
  code: string;
  name: string;
  semester: string;
  instructor_name: string;
  created_at: string;
}

export interface Student {
  id: string;
  student_id: string; // Preserves leading zeros e.g. "00231045"
  full_name: string;
  class_id: string;
  class_name: string;
  email?: string;
  notes?: string;
  created_at: string;
}

export interface ExamConfig {
  id: string;
  title: string;
  semester: string;
  class_id: string; // 'ALL' or specific class_id
  selected_lectures: LectureId[]; // e.g. ['01', '02', '03', '04', '05']
  include_integrated: boolean; // default false
  allowed_difficulties: DifficultyBand[]; // default ['CORE', 'PROFICIENT', 'ADVANCED']
  allow_same_lecture_confirmed: boolean; // required if selected_lectures.length === 1
  allow_controlled_repeat: boolean; // default false, requires instructor confirmation + audit log
  default_time_limit_seconds: number; // default 120
  grader_name: string;
  created_at: string;
  updated_at: string;
}

export interface CriterionScore {
  criterion_id: string;
  score: number | null; // null = not graded yet; 0 = graded 0; steps of 0.25
}

export interface Grade {
  question_slot: 1 | 2;
  question_id: string;
  criterion_scores: CriterionScore[];
  total_score: number | null; // null if any criterion_score is null
  instructor_notes: string;
  answer_evidence: string;
  follow_up_used: boolean;
  graded_by: string;
  graded_at: string | null;
}

export interface QuestionReplacementRecord {
  slot: 1 | 2;
  old_question_snapshot: QuestionSnapshot;
  new_question_snapshot: QuestionSnapshot;
  reason: string;
  replaced_by: string;
  replaced_at: string;
}

export interface QuestionAssignment {
  slot: 1 | 2;
  question_id: string;
  family_id: string;
  lecture_ids: LectureId[];
  question_group: QuestionGroup;
  revealed: boolean;
  revealed_at: string | null;
  locked_at: string;
  snapshot: QuestionSnapshot;
  replacement_history: QuestionReplacementRecord[];
}

export interface GradeEditRecord {
  edited_at: string;
  edited_by: string;
  reason: string;
  previous_q1_score: number | null;
  previous_q2_score: number | null;
  previous_total_score: number | null;
  new_q1_score: number | null;
  new_q2_score: number | null;
  new_total_score: number | null;
}

export interface Attempt {
  id: string;
  exam_id: string;
  student_record_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  is_retake: boolean;
  retake_reason?: string | null;
  attempt_number: number; // 1 for official first attempt, 2+ for retake
  status: AttemptStatus;
  status_reason?: string | null; // e.g., reason for Absent / Deferred
  active_slot: 1 | 2 | null;
  q1_assignment: QuestionAssignment | null;
  q2_assignment: QuestionAssignment | null;
  q1_grade: Grade | null;
  q2_grade: Grade | null;
  total_score: number | null; // out of 10, null until both Q1 and Q2 are fully graded
  general_comment: string;
  timer_remaining_seconds: number;
  grade_edit_history: GradeEditRecord[];
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export type AuditActionType =
  | 'EXAM_CREATED'
  | 'EXAM_CONFIG_CHANGED'
  | 'PAIR_DRAWN_AND_LOCKED'
  | 'QUESTION_REVEALED'
  | 'QUESTION_REPLACED'
  | 'DRAFT_GRADE_SAVED'
  | 'ATTEMPT_COMPLETED'
  | 'COMPLETED_GRADE_EDITED'
  | 'ATTEMPT_STATUS_CHANGED'
  | 'RETAKE_CREATED'
  | 'CONTROLLED_REPEAT_ENABLED'
  | 'QUESTION_APPROVED'
  | 'BANK_IMPORTED'
  | 'BACKUP_EXPORTED'
  | 'BACKUP_RESTORED';

export interface AuditEvent {
  id: string;
  workspace: WorkspaceMode;
  action: AuditActionType;
  actor: string;
  exam_id?: string | null;
  attempt_id?: string | null;
  student_id?: string | null;
  question_id?: string | null;
  reason?: string | null;
  details: string;
  metadata_json?: string;
  created_at: string;
}

export interface LectureMetadata {
  id: LectureId;
  number_label: string;
  title_en: string;
  title_vi: string;
  key_themes: string[];
  primary_scenario: string;
}

export interface BankCapacityReport {
  total_questions_in_bank: number;
  approved_in_scope: number;
  group_a_available: number;
  group_b_available: number;
  distinct_families_available: number;
  estimated_valid_pairs: number;
  by_lecture: Record<
    string,
    {
      total_approved: number;
      unused_a: number;
      unused_b: number;
      used_count: number;
    }
  >;
  can_draw_pair: boolean;
  blocking_reason: string | null;
  warnings: string[];
}

export interface NearDuplicatePair {
  question_a_id: string;
  question_b_id: string;
  family_a: string;
  family_b: string;
  lecture_a: string;
  lecture_b: string;
  similarity: number;
  prompt_a_preview: string;
  prompt_b_preview: string;
  same_family: boolean;
}

export interface ProjectorPayload {
  workspace: WorkspaceMode;
  exam_title: string;
  student_id: string | null;
  student_name: string | null;
  class_name: string | null;
  active_slot: 1 | 2 | null;
  question_group_label: string | null;
  lecture_label: string | null;
  prompt_en: string | null;
  prompt_vi: string | null;
  context: string | null;
  optional_table_or_diagram: string | null;
  optional_sql: string | null;
  follow_up_visible: boolean;
  optional_follow_up: string | null;
  timer_remaining_seconds: number;
  timer_total_seconds: number;
  timer_running: boolean;
  timer_expired: boolean;
  language: DisplayLanguage;
  updated_at: string;
}

export interface BackupBundle {
  schema_version: string; // e.g., "1.0.0-HSB3102E"
  app_name: string;
  workspace: WorkspaceMode;
  exported_at: string;
  counts: {
    questions: number;
    classes: number;
    students: number;
    exams: number;
    attempts: number;
    audit_events: number;
  };
  data: {
    questions: Question[];
    classes: ClassRoom[];
    students: Student[];
    exams: ExamConfig[];
    attempts: Attempt[];
    audit_events: AuditEvent[];
  };
}
