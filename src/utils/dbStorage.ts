import {
  Attempt,
  AuditEvent,
  BackupBundle,
  ClassRoom,
  ExamConfig,
  Question,
  Student,
  WorkspaceMode,
} from '../types/exam';
import { ALL_SEED_QUESTIONS } from '../data/seedQuestionBank';

const DB_NAME = 'HSB3102E_OralExamStudio_DB';
const DB_VERSION = 1;

interface DBSchema {
  questions: Question;
  classes: ClassRoom;
  students: Student;
  exams: ExamConfig;
  attempts: Attempt;
  audit_events: AuditEvent;
}

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('questions')) {
        const qStore = db.createObjectStore('questions', { keyPath: 'id' });
        qStore.createIndex('family_id', 'family_id', { unique: false });
        qStore.createIndex('review_status', 'review_status', { unique: false });
        qStore.createIndex('question_group', 'question_group', { unique: false });
      }

      if (!db.objectStoreNames.contains('classes')) {
        db.createObjectStore('classes', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('students')) {
        const sStore = db.createObjectStore('students', { keyPath: 'id' });
        sStore.createIndex('student_id', 'student_id', { unique: false });
        sStore.createIndex('class_id', 'class_id', { unique: false });
      }

      if (!db.objectStoreNames.contains('exams')) {
        db.createObjectStore('exams', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('attempts')) {
        const aStore = db.createObjectStore('attempts', { keyPath: 'id' });
        aStore.createIndex('exam_id', 'exam_id', { unique: false });
        aStore.createIndex('student_id', 'student_id', { unique: false });
      }

      if (!db.objectStoreNames.contains('audit_events')) {
        const auditStore = db.createObjectStore('audit_events', { keyPath: 'id' });
        auditStore.createIndex('exam_id', 'exam_id', { unique: false });
        auditStore.createIndex('action', 'action', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic transaction helpers
async function getAllFromStore<T>(storeName: keyof DBSchema): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

async function putToStore<T>(storeName: keyof DBSchema, item: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function bulkPutToStore<T>(storeName: keyof DBSchema, items: T[]): Promise<void> {
  if (items.length === 0) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of items) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteFromStore(storeName: keyof DBSchema, key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Default Seed Data
const DEFAULT_CLASS: ClassRoom = {
  id: 'CLASS_HSB3102E_01',
  code: 'HSB3102E-01',
  name: 'HSB3102E — Database Design (Nhóm 01)',
  semester: 'Học kỳ 1 - 2026/2027',
  instructor_name: 'Giảng viên HSB',
  created_at: new Date().toISOString(),
};

const DEFAULT_STUDENTS: Student[] = [
  { id: 'STU_00231001', student_id: '00231001', full_name: 'Nguyễn Văn An', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'an.nv@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231002', student_id: '00231002', full_name: 'Trần Thị Bình', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'binh.tt@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231003', student_id: '00231003', full_name: 'Lê Hoàng Chi', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'chi.lh@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231004', student_id: '00231004', full_name: 'Phạm Minh Đức', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'duc.pm@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231005', student_id: '00231005', full_name: 'Hoàng Thu Hà', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'ha.ht@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231006', student_id: '00231006', full_name: 'Vũ Quốc Khánh', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'khanh.vq@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231007', student_id: '00231007', full_name: 'Đặng Mai Lan', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'lan.dm@campus.edu.vn', created_at: new Date().toISOString() },
  { id: 'STU_00231008', student_id: '00231008', full_name: 'Bùi Hải Nam', class_id: DEFAULT_CLASS.id, class_name: DEFAULT_CLASS.code, email: 'nam.bh@campus.edu.vn', created_at: new Date().toISOString() },
];

const DEFAULT_EXAM: ExamConfig = {
  id: 'EXAM_MIDTERM_2026',
  title: 'Thi vấn đáp giữa kỳ HSB3102E — Database Design & Development',
  semester: 'Học kỳ 1 - 2026/2027',
  class_id: DEFAULT_CLASS.id,
  selected_lectures: ['01', '02', '03', '04', '05'],
  include_integrated: false,
  allowed_difficulties: ['CORE', 'PROFICIENT', 'ADVANCED'],
  allow_same_lecture_confirmed: false,
  allow_controlled_repeat: false,
  default_time_limit_seconds: 120,
  grader_name: 'TS. Nguyễn (Giảng viên phụ trách)',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Initialize Database on Startup
export async function initializeLocalDatabase(): Promise<{
  questionsCount: number;
  classesCount: number;
  studentsCount: number;
  examsCount: number;
}> {
  try {
    let questions = await getAllFromStore<Question>('questions');
    if (questions.length === 0) {
      await bulkPutToStore('questions', ALL_SEED_QUESTIONS);
      questions = ALL_SEED_QUESTIONS;
    }

    let classes = await getAllFromStore<ClassRoom>('classes');
    if (classes.length === 0) {
      await putToStore('classes', DEFAULT_CLASS);
      classes = [DEFAULT_CLASS];
    }

    let students = await getAllFromStore<Student>('students');
    if (students.length === 0) {
      await bulkPutToStore('students', DEFAULT_STUDENTS);
      students = DEFAULT_STUDENTS;
    }

    let exams = await getAllFromStore<ExamConfig>('exams');
    if (exams.length === 0) {
      await putToStore('exams', DEFAULT_EXAM);
      exams = [DEFAULT_EXAM];
    }

    return {
      questionsCount: questions.length,
      classesCount: classes.length,
      studentsCount: students.length,
      examsCount: exams.length,
    };
  } catch (err) {
    console.error('Failed to initialize local IndexedDB:', err);
    throw err;
  }
}

// Repository Methods
export const dbRepository = {
  // Questions
  async getAllQuestions(): Promise<Question[]> {
    return getAllFromStore<Question>('questions');
  },
  async saveQuestion(question: Question): Promise<void> {
    await putToStore('questions', question);
  },
  async saveQuestionsBatch(questions: Question[]): Promise<void> {
    await bulkPutToStore('questions', questions);
  },

  // Classes
  async getAllClasses(): Promise<ClassRoom[]> {
    return getAllFromStore<ClassRoom>('classes');
  },
  async saveClass(cls: ClassRoom): Promise<void> {
    await putToStore('classes', cls);
  },

  // Students
  async getAllStudents(): Promise<Student[]> {
    return getAllFromStore<Student>('students');
  },
  async saveStudent(student: Student): Promise<void> {
    await putToStore('students', student);
  },
  async saveStudentsBatch(students: Student[]): Promise<void> {
    await bulkPutToStore('students', students);
  },

  // Exams
  async getAllExams(): Promise<ExamConfig[]> {
    return getAllFromStore<ExamConfig>('exams');
  },
  async saveExam(exam: ExamConfig): Promise<void> {
    await putToStore('exams', exam);
  },

  // Attempts
  async getAllAttempts(): Promise<Attempt[]> {
    return getAllFromStore<Attempt>('attempts');
  },
  async getAttemptById(id: string): Promise<Attempt | undefined> {
    const all = await getAllFromStore<Attempt>('attempts');
    return all.find((a) => a.id === id);
  },
  async saveAttempt(attempt: Attempt): Promise<void> {
    await putToStore('attempts', attempt);
  },

  // Audit Events
  async getAllAuditEvents(): Promise<AuditEvent[]> {
    return getAllFromStore<AuditEvent>('audit_events');
  },
  async logAuditEvent(event: AuditEvent): Promise<void> {
    await putToStore('audit_events', event);
  },

  // Backup & Restore
  async exportBackupBundle(workspace: WorkspaceMode): Promise<BackupBundle> {
    const [questions, classes, students, exams, attempts, audit_events] = await Promise.all([
      getAllFromStore<Question>('questions'),
      getAllFromStore<ClassRoom>('classes'),
      getAllFromStore<Student>('students'),
      getAllFromStore<ExamConfig>('exams'),
      getAllFromStore<Attempt>('attempts'),
      getAllFromStore<AuditEvent>('audit_events'),
    ]);

    return {
      schema_version: '1.0.0-HSB3102E',
      app_name: 'HSB3102E Oral Exam Studio',
      workspace,
      exported_at: new Date().toISOString(),
      counts: {
        questions: questions.length,
        classes: classes.length,
        students: students.length,
        exams: exams.length,
        attempts: attempts.length,
        audit_events: audit_events.length,
      },
      data: {
        questions,
        classes,
        students,
        exams,
        attempts,
        audit_events,
      },
    };
  },

  async restoreBackupBundle(bundle: BackupBundle): Promise<void> {
    if (!bundle.data || !bundle.schema_version.includes('HSB3102E')) {
      throw new Error('File backup không đúng định dạng HSB3102E Oral Exam Studio.');
    }

    await Promise.all([
      bulkPutToStore('questions', bundle.data.questions || []),
      bulkPutToStore('classes', bundle.data.classes || []),
      bulkPutToStore('students', bundle.data.students || []),
      bulkPutToStore('exams', bundle.data.exams || []),
      bulkPutToStore('attempts', bundle.data.attempts || []),
      bulkPutToStore('audit_events', bundle.data.audit_events || []),
    ]);
  },
};
