import { DifficultyBand, LectureId, QuestionGroup } from '../types/exam';
import { FamilySeed } from './lecture01Seeds';

interface CompactSpec {
  code: string;
  topic: string;
  objective: string;
  conceptEn: string;
  conceptVi: string;
  contraEn: string;
  contraVi: string;
  misconception: string;
  followUp: string;
  appliedTitle: string;
  appliedTable: string;
  appliedSql?: string;
  appliedQuestionEn: string;
  appliedQuestionVi: string;
  appliedPoints: string[];
  appliedMisconception: string;
}

const LECTURE_05_SPECS: CompactSpec[] = [
  {
    code: 'CANDIDATE_PRIMARY_SURROGATE',
    topic: 'Candidate Keys, Primary Keys, and Surrogate Keys',
    objective: 'Distinguish candidate keys, choose a primary key, and evaluate surrogate keys',
    conceptEn: 'At CampusMart, the `Students` table has `student_id` (e.g. "00231088"), `national_citizen_id`, `campus_email`, and an auto-incrementing `id`. Which of these are candidate keys, and what criteria determine the chosen Primary Key?',
    conceptVi: 'Tại CampusMart, bảng `Students` có các cột `student_id` (MSSV ví dụ "00231088"), `national_citizen_id` (CCCD), `campus_email`, và số tự tăng `id`. Những cột nào là khóa ứng viên (candidate keys), và tiêu chí nào quyết định chọn khóa nào làm Khóa chính (Primary Key)?',
    contraEn: 'Why is using `full_name` as a Primary Key guaranteed to fail in an undergraduate student database, even if all currently enrolled students have different names today?',
    contraVi: 'Tại sao dùng `full_name` làm Khóa chính chắc chắn sẽ gặp lỗi trong CSDL sinh viên, ngay cả khi toàn bộ sinh viên đang học hôm nay chưa có ai trùng tên?',
    misconception: 'Confusing uniqueness in the current sample dataset with permanent structural uniqueness across all time.',
    followUp: 'What three properties must a great primary key satisfy? (Unique, irreducible, immutable/stable).',
    appliedTitle: 'Identifying Candidate Keys in CampusMart Supplier Table',
    appliedTable: `supplier_id | tax_code    | company_name         | bank_account | phone
------------+-------------+----------------------+--------------+-----------
SUP_01      | 0108923411  | Thien Long Corp      | 1902888123   | 0283811122
SUP_02      | 0107754320  | Deli Stationers Ltd  | 9901112233   | 0243988776`,
    appliedQuestionEn: 'Assuming both `tax_code` and `supplier_id` are permanently unique and non-null for every registered business, state why both are candidate keys. Why is `supplier_id` preferred as PK over `tax_code` for foreign keys in `OrderLines`?',
    appliedQuestionVi: 'Giả định cả `tax_code` và `supplier_id` đều luôn duy nhất và không rỗng với mọi doanh nghiệp, giải thích vì sao cả hai đều là khóa ứng viên. Tại sao `supplier_id` thường được ưu tiên làm Khóa chính hơn `tax_code` khi làm khóa ngoại tham chiếu?',
    appliedPoints: [
      'Both `supplier_id` and `tax_code` satisfy candidate key properties: uniqueness and irreducibility.',
      '`supplier_id` is a compact, controlled internal identifier (shorter, immutable, and faster for indexes and joins).',
      '`tax_code` should be protected with a `UNIQUE NOT NULL` constraint to avoid duplicate business profiles.',
    ],
    appliedMisconception: 'Thinking a table can only have one candidate key.',
  },
  {
    code: 'COMPOSITE_PRIMARY_KEY',
    topic: 'Composite Primary Keys and Irreducibility',
    objective: 'Explain composite keys and verify that no sub-attribute can be removed without losing uniqueness',
    conceptEn: 'In `OrderLines(order_id, product_id, quantity, unit_price)`, explain why `order_id` alone cannot be the Primary Key and `product_id` alone cannot be the Primary Key. What makes `(order_id, product_id)` a composite key?',
    conceptVi: 'Trong bảng `OrderLines(order_id, product_id, quantity, unit_price)`, giải thích vì sao `order_id` đứng một mình không thể làm Khóa chính và `product_id` đứng một mình cũng không thể làm Khóa chính. Điều gì làm cho cặp `(order_id, product_id)` thành khóa chính tổ hợp (composite key)?',
    contraEn: 'If a customer can buy the exact same product twice in the same order (e.g. 1 hot latte at 8:00 AM and 1 iced latte at 8:30 AM added to the same tab), why does `(order_id, product_id)` fail, and how do you fix it?',
    contraVi: 'Nếu khách hàng có thể gọi cùng một món đồ uống hai lần trên cùng một hóa đơn (ví dụ 1 ly cà phê nóng lúc 8:00 và thêm 1 ly cà phê đá lúc 8:30), tại sao cặp `(order_id, product_id)` lại bị lỗi trùng khóa, và giải quyết ra sao?',
    misconception: 'Assuming composite primary keys can never contain more than two columns.',
    followUp: 'How does an auto-incrementing `line_id` surrogate key compare to composite `(order_id, line_no)`?',
    appliedTitle: 'Composite Key Violation in Course Enrollment',
    appliedTable: `student_id | course_code | semester | grade
-----------+-------------+----------+------
0023101    | HSB3102E    | 2025_FALL| 4.0
0023101    | HSB3102E    | 2026_SPRG| 8.5
0023102    | HSB3102E    | 2026_SPRG| 7.0`,
    appliedQuestionEn: 'If the table above has `PRIMARY KEY (student_id, course_code)`, which row will cause a primary key violation upon insertion and why? What is the correct composite primary key?',
    appliedQuestionVi: 'Nếu bảng trên đặt `PRIMARY KEY (student_id, course_code)`, dòng nào sẽ gây lỗi vi phạm khóa chính khi chèn dữ liệu và tại sao? Khóa chính tổ hợp đúng phải gồm những cột nào?',
    appliedPoints: [
      'Row 2 (`0023101, HSB3102E, 2026_SPRG`) fails because `(0023101, HSB3102E)` already exists in Row 1.',
      'The retake in `2026_SPRG` requires `semester` to differentiate the attempts.',
      'Correct minimal composite PK is `(student_id, course_code, semester)`.',
    ],
    appliedMisconception: 'Thinking Row 3 causes the error because it shares the course code.',
  },
  {
    code: 'FUNCTIONAL_DEPENDENCY_DEF',
    topic: 'Understanding Functional Dependencies (X -> Y)',
    objective: 'Define functional dependency and determine whether attribute Y is determined by X',
    conceptEn: 'In relational database theory, what does the notation `X -> Y` (X functionally determines Y) mean? Illustrate with `student_id -> student_name` at CampusMart.',
    conceptVi: 'Trong lý thuyết CSDL quan hệ, ký hiệu `X -> Y` (X xác định hàm Y) có nghĩa là gì? Hãy minh họa qua phụ thuộc hàm `student_id -> student_name` tại CampusMart.',
    contraEn: 'Does `major -> student_id` hold in a university database? Why or why not? Explain using a counterexample with two students in the same major.',
    contraVi: 'Phụ thuộc hàm `major -> student_id` có tồn tại trong CSDL trường đại học không? Tại sao? Hãy chứng minh bằng một phản ví dụ gồm hai sinh viên cùng học một ngành.',
    misconception: 'Thinking that if X -> Y, then Y -> X must also be true.',
    followUp: 'If two different students have the exact same name, does `student_id -> student_name` still hold? Why?',
    appliedTitle: 'Verifying Functional Dependencies on Sample Data',
    appliedTable: `emp_id | dept_name   | building
-------+-------------+---------
E01    | Marketing   | B1
E02    | Finance     | B2
E03    | Marketing   | B1
E04    | Logistics   | B3`,
    appliedQuestionEn: 'Based on the sample table above, does `dept_name -> building` hold? Does `building -> emp_id` hold? Provide proof from the rows.',
    appliedQuestionVi: 'Dựa trên bảng mẫu ở trên, phụ thuộc hàm `dept_name -> building` có thỏa mãn không? Phụ thuộc hàm `building -> emp_id` có thỏa mãn không? Hãy chứng minh từ các dòng dữ liệu.',
    appliedPoints: [
      '`dept_name -> building` holds on this data: whenever `dept_name` is "Marketing", `building` is consistently "B1".',
      '`building -> emp_id` does NOT hold: building "B1" is associated with both E01 and E03, so knowing the building does not uniquely identify the employee.',
    ],
    appliedMisconception: 'Confusing 1:N cardinality with functional dependency direction.',
  },
  {
    code: 'PARTIAL_DEPENDENCY_2NF',
    topic: 'Partial Functional Dependencies and Second Normal Form (2NF)',
    objective: 'Identify partial dependencies on composite keys and eliminate them to achieve 2NF',
    conceptEn: 'What is a "partial functional dependency"? Why can a partial dependency ONLY occur in a table that has a composite primary key?',
    conceptVi: 'Phụ thuộc hàm bộ phận (partial functional dependency) là gì? Tại sao phụ thuộc hàm bộ phận CHỈ CÓ THỂ xuất hiện trong một bảng có khóa chính tổ hợp (gồm 2 thuộc tính khóa trở lên)?',
    contraEn: 'If a table has a single-column primary key `order_id`, can it ever violate Second Normal Form (2NF)? Explain why or why not.',
    contraVi: 'Nếu một bảng có khóa chính là một cột đơn duy nhất `order_id`, bảng đó có bao giờ vi phạm Dạng chuẩn 2 (2NF) được không? Giải thích tại sao có hoặc không.',
    misconception: 'Looking for partial dependencies in a table with a single-column primary key.',
    followUp: 'What normal form violation occurs when a non-key column depends on another non-key column in a table with a single PK? (That is 3NF/transitive, not 2NF!).',
    appliedTitle: 'Decomposing 1NF Table with Partial Dependencies into 2NF',
    appliedTable: `Table: Order_Item_Details (PK: order_id, product_id)
order_id | product_id | product_name | product_category | qty | unit_price
---------+------------+--------------+------------------+-----+-----------
101      | P01        | Notebook     | Stationery       |  2  | 25000
101      | P02        | Gel Pen      | Stationery       |  5  | 10000
102      | P01        | Notebook     | Stationery       |  1  | 25000`,
    appliedQuestionEn: 'In `Order_Item_Details` with composite PK `(order_id, product_id)`, identify the partial dependency. Why does it violate 2NF, and what are the two resulting 2NF tables?',
    appliedQuestionVi: 'Trong bảng `Order_Item_Details` có khóa chính tổ hợp `(order_id, product_id)`, hãy chỉ ra phụ thuộc hàm bộ phận. Tại sao nó vi phạm 2NF, và tách thành hai bảng 2NF nào?',
    appliedPoints: [
      '`product_id -> product_name, product_category` is a partial dependency because `product_name` and `product_category` depend only on part of the composite key (`product_id`), not the full key.',
      'Causes redundancy and update anomalies: if "Notebook" changes name, multiple order rows must be updated.',
      'Decompose into: `Products(product_id PK, product_name, product_category)` and `OrderLines(order_id, product_id, qty, unit_price)` with PK `(order_id, product_id)`.',
    ],
    appliedMisconception: 'Claiming `qty` depends only on `order_id` (quantity depends on both the order and which product).',
  },
  {
    code: 'TRANSITIVE_DEPENDENCY_3NF',
    topic: 'Transitive Functional Dependencies and Third Normal Form (3NF)',
    objective: 'Identify transitive dependencies (X -> Y and Y -> Z) and decompose into 3NF',
    conceptEn: 'What is a "transitive functional dependency"? Explain using the classic chain `student_id -> major_code` and `major_code -> department_head`. Why does this violate Third Normal Form (3NF)?',
    conceptVi: 'Phụ thuộc hàm bắc cầu (transitive functional dependency) là gì? Hãy giải thích qua chuỗi `student_id -> major_code` và `major_code -> department_head`. Tại sao chuỗi này vi phạm Dạng chuẩn 3 (3NF)?',
    contraEn: 'A retail clerk says: "Putting `supplier_phone` directly inside `Products(product_id PK, name, supplier_id, supplier_phone)` saves a join!" Explain the update anomaly and deletion anomaly that occur.',
    contraVi: 'Một nhân viên kỹ thuật nói: "Lưu luôn `supplier_phone` vào bảng `Products(product_id PK, name, supplier_id, supplier_phone)` sẽ tiết kiệm được một phép nối bảng!" Hãy giải thích bất thường cập nhật (update anomaly) và bất thường xóa (deletion anomaly) sẽ xảy ra.',
    misconception: 'Confusing 2NF (partial dependency on part of a composite key) with 3NF (transitive dependency between non-key columns).',
    followUp: 'How does decomposing into `Products` and `Suppliers` eliminate the update anomaly?',
    appliedTitle: 'Eliminating Transitive Dependency in CampusMart Orders',
    appliedTable: `Orders_Draft (PK: order_id)
order_id | customer_id | customer_name | customer_phone | order_total
---------+-------------+---------------+----------------+------------
ORD_01   | C10         | Nguyen An     | 0912345678     | 150000
ORD_02   | C20         | Le Binh       | 0987654321     | 200000
ORD_03   | C10         | Nguyen An     | 0912345678     |  75000`,
    appliedQuestionEn: 'In `Orders_Draft` with PK `order_id`, trace the transitive dependency chain. Explain what happens if customer `C10` changes their phone number, and show the two resulting 3NF tables.',
    appliedQuestionVi: 'Trong bảng `Orders_Draft` có khóa chính `order_id`, hãy chỉ ra chuỗi phụ thuộc hàm bắc cầu. Điều gì xảy ra nếu khách hàng `C10` đổi số điện thoại, và nêu hai bảng 3NF sau khi chuẩn hóa.',
    appliedPoints: [
      'Transitive chain: `order_id -> customer_id` and `customer_id -> customer_name, customer_phone`.',
      'If `C10` changes phone, updating row ORD_01 but missing ORD_03 leaves contradictory phone numbers (update anomaly).',
      'Decompose into: `Customers(customer_id PK, customer_name, customer_phone)` and `Orders(order_id PK, customer_id FK, order_total)`.',
    ],
    appliedMisconception: 'Calling `customer_id -> customer_phone` a partial dependency (it is transitive because `order_id` is a single-column key).',
  },
  {
    code: 'FIRST_NORMAL_FORM_1NF',
    topic: 'First Normal Form (1NF): Atomic Values and No Repeating Groups',
    objective: 'Verify 1NF criteria: atomic attributes, no multi-valued lists, and unique row identification',
    conceptEn: 'What are the three strict rules of First Normal Form (1NF)? Give an example of a table cell that violates 1NF at a campus coffee shop.',
    conceptVi: 'Ba quy tắc nghiêm ngặt của Dạng chuẩn 1 (1NF) là gì? Hãy nêu một ví dụ về một ô dữ liệu vi phạm 1NF tại quán cà phê trường học.',
    contraEn: 'Can a table with JSON columns (e.g. `order_metadata = \'{"tags": ["urgent", "vip"]}\'`) be considered strictly 1NF in pure relational theory? Why do modern DBMS support JSON while classical relational models require scalar atomicity?',
    contraVi: 'Một bảng có cột chứa chuỗi JSON (ví dụ `order_metadata = \'{"tags": ["urgent", "vip"]}\'`) có được coi là chuẩn 1NF theo lý thuyết quan hệ thuần túy không? Tại sao các RDBMS hiện đại vẫn hỗ trợ kiểu JSON dù mô hình quan hệ cổ điển đòi hỏi tính nguyên tử vô hướng?',
    misconception: 'Thinking that storing values separated by semicolons or commas satisfies 1NF as long as the column is typed as `TEXT`.',
    followUp: 'How do you query for an urgent order when tags are stored as comma-separated text vs separate rows?',
    appliedTitle: 'Fixing 1NF Violations in Coffee Shop Orders',
    appliedTable: `Violating Table:
order_id | barista_name | items_ordered
---------+--------------+---------------------------------------
501      | Minh         | 2x Iced Latte, 1x Peach Tea, 1x Cookie
502      | Lan          | 1x Cold Brew`,
    appliedQuestionEn: 'Point out the 1NF violation in `items_ordered`. Show how this table breaks when computing "Total Peach Teas sold today", and normalize it into 1NF.',
    appliedQuestionVi: 'Chỉ ra lỗi vi phạm 1NF ở cột `items_ordered`. Giải thích bảng này gây khó khăn như thế nào khi tính "Tổng số Trà đào bán trong ngày", và chuẩn hóa bảng về 1NF.',
    appliedPoints: [
      '`items_ordered` contains non-atomic, composite, multi-valued strings packing product, quantity, and name.',
      'SQL cannot run `SUM(qty)` or `GROUP BY product` without fragile string splitting.',
      'Normalize to 1NF: `OrderLines(order_id, item_name, quantity)` with individual rows: (501, "Iced Latte", 2), (501, "Peach Tea", 1), (501, "Cookie", 1), (502, "Cold Brew", 1).',
    ],
    appliedMisconception: 'Leaving `2x Iced Latte` as an atomic string in 1NF without separating quantity from item name.',
  },
  {
    code: 'ARMSTRONG_AXIOMS_AUGMENTATION',
    topic: 'Armstrong’s Axioms: Reflexivity, Augmentation, and Transitivity',
    objective: 'Apply Armstrong’s inference rules and contrast Augmentation with Partial Dependency',
    conceptEn: 'State Armstrong’s three fundamental axioms (Reflexivity, Augmentation, Transitivity). Specifically explain the Augmentation rule: If `X -> Y`, then `XZ -> YZ`.',
    conceptVi: 'Hãy phát biểu ba tiên đề Armstrong cơ bản (Phản xạ, Tăng trưởng/Bổ sung, và Bắc cầu). Giải thích chi tiết luật Tăng trưởng (Augmentation): Nếu `X -> Y` thì `XZ -> YZ`.',
    contraEn: 'Why do students frequently confuse Armstrong’s Augmentation rule (`X -> Y` implies `XZ -> Y`) with a Partial Functional Dependency? Clarify the difference.',
    contraVi: 'Tại sao sinh viên rất hay nhầm lẫn luật Tăng trưởng Armstrong (`X -> Y` suy ra `XZ -> Y`) với Phụ thuộc hàm bộ phận (Partial Dependency)? Hãy làm rõ sự khác biệt bản chất giữa hai khái niệm này.',
    misconception: 'Equating the mathematical validity of Armstrong augmentation with a good database schema design (augmentation produces partial dependencies when applied to candidate keys!).',
    followUp: 'If `student_id -> student_name`, what does augmentation with `course_id` produce? Does `student_id, course_id -> student_name` hold mathematically?',
    appliedTitle: 'Inferring Functional Dependencies via Armstrong Axioms',
    appliedTable: `Given Functional Dependencies for CampusMart:
1. order_id -> customer_id
2. customer_id -> customer_email`,
    appliedQuestionEn: 'Using Armstrong’s axioms, prove that `order_id -> customer_email` holds. Then augment both sides with `product_id`. What dependency results, and is it a partial dependency if `(order_id, product_id)` is a primary key?',
    appliedQuestionVi: 'Dùng các tiên đề Armstrong, hãy chứng minh `order_id -> customer_email`. Sau đó áp dụng luật tăng trưởng với `product_id`. Phụ thuộc hàm nào được tạo ra, và nó có phải là phụ thuộc hàm bộ phận nếu `(order_id, product_id)` là khóa chính?',
    appliedPoints: [
      'By Transitivity: From `order_id -> customer_id` and `customer_id -> customer_email`, we infer `order_id -> customer_email`.',
      'By Augmentation with `product_id`: `order_id, product_id -> customer_email, product_id` (and by decomposition, `order_id, product_id -> customer_email`).',
      'Yes, on a table with PK `(order_id, product_id)`, this is a partial dependency because `customer_email` is determined solely by `order_id` (part of the composite key).',
    ],
    appliedMisconception: 'Thinking augmentation disproves functional dependencies.',
  },
  {
    code: 'DENORMALIZATION_TRADEOFFS',
    topic: 'Intentional Denormalization vs. Accidental Poor Design',
    objective: 'Evaluate deliberate denormalization for read performance against integrity risks',
    conceptEn: 'What is "intentional denormalization"? Under what specific read-heavy or reporting conditions might an engineering team deliberately denormalize a 3NF schema, and what price do they pay in write complexity?',
    conceptVi: '"Phi chuẩn hóa có chủ đích" (intentional denormalization) là gì? Trong điều kiện đọc dữ liệu hoặc báo cáo cụ thể nào thì đội ngũ kỹ thuật có thể chủ động phi chuẩn hóa một lược đồ 3NF, và họ phải trả giá gì về độ phức tạp khi ghi dữ liệu?',
    contraEn: 'Contrast a junior developer who creates a flat unnormalized table out of ignorance with a senior architect who caches `total_order_amount` in `Orders`. How does the architect maintain consistency?',
    contraVi: 'Hãy phân biệt một lập trình viên mới tạo bảng phẳng chưa chuẩn hóa do thiếu kiến thức với một kiến trúc sư chủ động lưu sẵn `total_order_amount` trong bảng `Orders`. Kiến trúc sư duy trì tính nhất quán bằng cách nào?',
    misconception: 'Believing denormalization should be done at the very beginning of design before reaching 3NF.',
    followUp: 'How can database triggers or application transactions guarantee that cached denormalized totals do not drift?',
    appliedTitle: 'Auditing Denormalized Stock Summary at CampusMart',
    appliedTable: `Products Table (with denormalized cached column):
product_id | name        | unit_price | cached_total_sold_units
-----------+-------------+------------+------------------------
P01        | Gel Pen     | 10000      | 150

Actual sum of OrderLines for P01: 175 units.`,
    appliedQuestionEn: 'Notice the drift between `cached_total_sold_units = 150` and the actual `OrderLines` sum of `175`. What caused this drift, and what design mechanisms prevent it in high-throughput retail?',
    appliedQuestionVi: 'Nhận xét sự sai lệch giữa `cached_total_sold_units = 150` và tổng thực tế trong `OrderLines` là `175`. Điều gì đã gây ra sự sai lệch này, và cơ chế thiết kế nào ngăn chặn nó trong bán lẻ?',
    appliedPoints: [
      'The cached denormalized counter was not updated when 25 additional units were inserted into `OrderLines` (e.g. bulk CSV import or transaction rollback bug).',
      'Integrity risks: read speed is fast, but reported numbers are wrong.',
      'Solutions: compute dynamically via SQL Views, update within the same atomic transaction, or use database triggers.',
    ],
    appliedMisconception: 'Assuming denormalized columns stay synchronized automatically without code or triggers.',
  },
  {
    code: 'LOSSLESS_JOIN_DECOMPOSITION',
    topic: 'Lossless-Join Decomposition',
    objective: 'Verify that decomposing a table preserves original data without generating spurious rows upon rejoin',
    conceptEn: 'What does it mean for a database decomposition to be "lossless-join"? Why does "lossless" refer to preserving information rather than just not losing rows?',
    conceptVi: 'Thế nào là phép tách "bảo toàn thông tin nối" (lossless-join decomposition)? Tại sao chữ "lossless" ở đây lại mang ý nghĩa không sinh thêm dòng rác/bảo toàn thông tin chứ không chỉ là không làm mất dòng?',
    contraEn: 'If we decompose `R(A, B, C)` into `R1(A, B)` and `R2(B, C)`, what mathematical condition must the shared attribute `B` satisfy for the decomposition to be guaranteed lossless? (`B -> A` or `B -> C`).',
    contraVi: 'Nếu tách bảng `R(A, B, C)` thành `R1(A, B)` và `R2(B, C)`, điều kiện toán học nào trên thuộc tính chung `B` phải được thỏa mãn để đảm bảo phép nối tự nhiên không sinh dòng giả? (`B -> A` hoặc `B -> C`).',
    misconception: 'Thinking "lossy" means rows were deleted; in database theory, a lossy join creates spurious hallucinated rows.',
    followUp: 'Show what happens when you join on a non-key attribute with duplicate values in both tables.',
    appliedTitle: 'Tracing a Lossy Decomposition with Spurious Rows',
    appliedTable: `Original Table R(Student, Major, Advisor):
Student | Major     | Advisor
--------+-----------+--------
An      | MIS       | Dr. Minh
Binh    | Marketing | Dr. Lan
Chi     | MIS       | Dr. Hoa

Decomposed into R1(Student, Major) and R2(Major, Advisor).
Notice: Major is NOT a key of R1 or R2!`,
    appliedQuestionEn: 'Perform a natural join between `R1` and `R2` on `Major`. How many rows result, which spurious rows were created that did not exist in the original table, and why did this decomposition fail?',
    appliedQuestionVi: 'Thực hiện phép nối tự nhiên giữa `R1` và `R2` qua cột `Major`. Kết quả có bao nhiêu dòng, những dòng giả (spurious rows) nào xuất hiện mà bảng gốc không hề có, và tại sao phép tách này thất bại?',
    appliedPoints: [
      'In R1, "MIS" has 2 rows (An, Chi). In R2, "MIS" has 2 rows (Dr. Minh, Dr. Hoa).',
      'The natural join on `Major` produces `2 * 2 = 4` rows for MIS + 1 row for Marketing = `5 rows` total (original table had only 3 rows!).',
      'Spurious rows created: `(An, MIS, Dr. Hoa)` and `(Chi, MIS, Dr. Minh)` — hallucinating false student-advisor assignments.',
      'Failed because `Major` is neither a superkey of R1 nor R2.',
    ],
    appliedMisconception: 'Assuming rejoining two decomposed tables always recovers the exact original table.',
  },
  {
    code: 'DEPENDENCY_PRESERVATION',
    topic: 'Dependency Preservation During Decomposition',
    objective: 'Determine whether all functional dependencies can be checked without performing joins',
    conceptEn: 'What does "dependency preservation" mean during normalization? Why is it desirable that every functional dependency `X -> Y` can be verified within a single table without having to compute a costly multi-table `JOIN`?',
    conceptVi: '"Bảo toàn phụ thuộc hàm" (dependency preservation) trong chuẩn hóa nghĩa là gì? Tại sao việc mỗi phụ thuộc hàm `X -> Y` có thể kiểm tra trọn vẹn trong một bảng duy nhất mà không cần thực hiện phép nối bảng tốn kém lại là điều mong muốn?',
    contraEn: 'Can every relational schema always be decomposed into Boyce-Codd Normal Form (BCNF) while preserving all functional dependencies? (No, BCNF can sometimes sacrifice dependency preservation, which is why 3NF is often chosen in industry).',
    contraVi: 'Có phải mọi lược đồ quan hệ đều luôn có thể đưa về Dạng chuẩn Boyce-Codd (BCNF) mà vẫn bảo toàn toàn bộ phụ thuộc hàm hay không? (Không, BCNF đôi khi phải hy sinh tính bảo toàn phụ thuộc hàm, đó là lý do 3NF được ưu tiên trong thực tế).',
    misconception: 'Believing higher normal forms like BCNF are always strictly superior to 3NF in every production scenario.',
    followUp: 'What is the operational cost of enforcing a non-preserved functional dependency on every `INSERT`?',
    appliedTitle: 'Evaluating Dependency Preservation in Shift Scheduling',
    appliedTable: `Given Schema: ShiftAssignment(barista_id, shift_date, station, supervisor)
Dependencies:
1. (barista_id, shift_date) -> station
2. (shift_date, station) -> supervisor
3. supervisor -> shift_date`,
    appliedQuestionEn: 'If this table is decomposed to eliminate redundancy into `R1(barista_id, supervisor, station)` and `R2(supervisor, shift_date)`, which functional dependency cannot be checked without joining R1 and R2?',
    appliedQuestionVi: 'Nếu bảng trên được tách để giảm dư thừa thành `R1(barista_id, supervisor, station)` và `R2(supervisor, shift_date)`, phụ thuộc hàm nào không thể kiểm tra được nếu không nối bảng R1 và R2 lại với nhau?',
    appliedPoints: [
      'Dependency `(barista_id, shift_date) -> station` spans across both tables (`shift_date` is in R2, while `barista_id` and `station` are in R1).',
      'Checking that a barista is assigned to only one station per shift now requires a multi-table cross-check on every insert.',
      'This illustrates a decomposition that achieves BCNF but loses dependency preservation.',
    ],
    appliedMisconception: 'Assuming all functional dependencies can still be declared as simple column constraints after any decomposition.',
  },
];

function buildFamilySeedsForLecture(
  lectureId: LectureId,
  specs: CompactSpec[]
): FamilySeed[] {
  const seeds: FamilySeed[] = [];

  specs.forEach((spec, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const isCoreApproved = idx < 10;

    seeds.push({
      family_suffix: `L${lectureId}_A${num}_${spec.code}`,
      lecture_ids: [lectureId],
      question_group: 'A_CONCEPT',
      topic: spec.topic,
      learning_objective: spec.objective,
      variants: [
        {
          difficulty_band: idx < 6 ? 'CORE' : 'PROFICIENT',
          approved_by_default: isCoreApproved,
          prompt_en: spec.conceptEn,
          prompt_vi: spec.conceptVi,
          context: `HSB3102E Lecture ${lectureId} — ${spec.topic}.`,
          optional_table_or_diagram: null,
          optional_sql: null,
          expected_key_points: [
            `Core concept of ${spec.topic}: ${spec.objective}.`,
            'Explains underlying mechanism clearly with verified rationale.',
          ],
          acceptable_alternatives: ['Equivalent valid explanation with practical examples.'],
          common_misconceptions: [spec.misconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: `Accurately explains the core principles of ${spec.topic}.`,
            reasoning_full: 'Logically justifies why the dependency or key rule holds.',
            application_full: 'Provides a clear practical example illustrating the concept.',
          },
        },
        {
          difficulty_band: idx < 4 ? 'PROFICIENT' : 'ADVANCED',
          approved_by_default: false,
          prompt_en: spec.contraEn,
          prompt_vi: spec.contraVi,
          context: `HSB3102E Lecture ${lectureId} — Counterexample & Edge Case (${spec.topic}).`,
          optional_table_or_diagram: null,
          optional_sql: null,
          expected_key_points: [
            `Identifies the boundary flaw in ${spec.topic}.`,
            'Contrasts valid vs invalid modeling and normalization.',
          ],
          acceptable_alternatives: ['Valid counterexample and proof.'],
          common_misconceptions: [spec.misconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: `Pinpoints the exact edge case in ${spec.topic}.`,
            reasoning_full: 'Explains the causal chain from design decision to anomaly.',
            application_full: 'Specifies the correct schema remedy.',
          },
        },
      ],
    });

    seeds.push({
      family_suffix: `L${lectureId}_B${num}_${spec.code}_APPLIED`,
      lecture_ids: [lectureId],
      question_group: 'B_APPLIED',
      topic: `${spec.topic} — Applied Analysis`,
      learning_objective: `Apply ${spec.topic.toLowerCase()} to audit schemas and tables`,
      variants: [
        {
          difficulty_band: idx < 6 ? 'PROFICIENT' : 'ADVANCED',
          approved_by_default: isCoreApproved,
          prompt_en: spec.appliedQuestionEn,
          prompt_vi: spec.appliedQuestionVi,
          context: spec.appliedTitle,
          optional_table_or_diagram: spec.appliedTable,
          optional_sql: spec.appliedSql || null,
          expected_key_points: spec.appliedPoints,
          acceptable_alternatives: ['Equivalent verified relational or algebraic trace.'],
          common_misconceptions: [spec.appliedMisconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: 'Identifies the exact rows, keys, or anomalies.',
            reasoning_full: 'Traces why the dependency or normalization violation occurs.',
            application_full: 'States the exact corrected schema or query.',
          },
        },
        {
          difficulty_band: 'ADVANCED',
          approved_by_default: false,
          prompt_en: `Inspect the scenario "${spec.appliedTitle}". An AI claims this design is in 3NF and has zero anomalies. Prove the AI wrong and state the required normalization.`,
          prompt_vi: `Quan sát tình huống "${spec.appliedTitle}". Một AI khẳng định thiết kế này đã ở 3NF và không có bất thường. Hãy chứng minh AI sai và nêu cách chuẩn hóa.`,
          context: `${spec.appliedTitle} — Verification Audit`,
          optional_table_or_diagram: spec.appliedTable,
          optional_sql: spec.appliedSql || null,
          expected_key_points: spec.appliedPoints,
          acceptable_alternatives: ['Valid relational decomposition.'],
          common_misconceptions: [spec.appliedMisconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: 'Cites specific evidence refuting the AI.',
            reasoning_full: 'Traces the error propagation.',
            application_full: 'Specifies the corrected relational design.',
          },
        },
      ],
    });
  });

  return seeds;
}

export const LECTURES_05_TO_08_BUILT_SEEDS: FamilySeed[] = [
  ...buildFamilySeedsForLecture('05', LECTURE_05_SPECS),
];
