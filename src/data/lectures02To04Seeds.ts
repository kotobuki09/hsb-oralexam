import { DifficultyBand, LectureId, QuestionGroup } from '../types/exam';
import { FamilySeed } from './lecture01Seeds';

interface CompactTopicSpec {
  code: string;
  topic: string;
  objective: string;
  conceptFocusEn: string;
  conceptFocusVi: string;
  contradictionEn: string;
  contradictionVi: string;
  misconception: string;
  followUp: string;
  appliedTitle: string;
  appliedTable: string;
  appliedSql?: string;
  appliedQuestionEn: string;
  appliedQuestionVi: string;
  appliedAnswerPoints: string[];
  appliedMisconception: string;
}

const LECTURE_02_SPECS: CompactTopicSpec[] = [
  {
    code: 'COMPLETENESS',
    topic: 'Data Completeness vs. Optional Attributes',
    objective: 'Distinguish mandatory operational completeness from legitimately optional attributes',
    conceptFocusEn: 'Why is a missing `supplier_id` in CampusMart `Products` a critical completeness failure, whereas a missing `loyalty_card_id` on a walk-in POS receipt is valid business reality?',
    conceptFocusVi: 'Tại sao việc thiếu `supplier_id` trong bảng `Products` của CampusMart là lỗi thiếu hụt dữ liệu nghiêm trọng, trong khi thiếu `loyalty_card_id` trên hóa đơn khách vãng lai lại hoàn toàn hợp lệ?',
    contradictionEn: 'In the Internship Hub, why does requiring `company_tax_code` at initial student draft signup hurt data quality (causing students to type `"123456"`), whereas requiring it at contract approval ensures true completeness?',
    contradictionVi: 'Trong cổng Thực tập, tại sao bắt buộc nhập `company_tax_code` ngay lúc sinh viên mới tạo bản nháp lại làm hỏng chất lượng dữ liệu (sinh viên gõ đại `"123456"`), trong khi bắt buộc ở bước duyệt hợp đồng mới đảm bảo tính đầy đủ thực sự?',
    misconception: 'Assuming 100% non-null across every column in a database always means higher data quality (forced dummy values like "N/A" or "0000" are worse than honest NULLs).',
    followUp: 'How can you detect fake placeholder values like "999999" that bypass NOT NULL constraints?',
    appliedTitle: 'CampusMart Customer Completeness Audit',
    appliedTable: `cust_id | full_name   | phone        | email             | tier
--------+-------------+--------------+-------------------+-------
C101    | Tran Minh   | 0901234567   | minh@campus.edu   | GOLD
C102    | Le Hoa      | NULL         | N/A               | SILVER
C103    | Nguyen Nam  | 0000000000   | nam@campus.edu    | GOLD`,
    appliedQuestionEn: 'An AI data-quality check runs `WHERE phone IS NOT NULL AND email IS NOT NULL` and reports that C101 and C103 have 100% complete contact info, while C102 has a valid email. Identify the two hidden data quality defects in C102 and C103.',
    appliedQuestionVi: 'Một kiểm tra chất lượng dữ liệu bằng AI chạy lệnh `WHERE phone IS NOT NULL AND email IS NOT NULL` và báo rằng C101, C103 có thông tin liên hệ đầy đủ 100%, còn C102 có email hợp lệ. Hãy chỉ ra 2 lỗi chất lượng dữ liệu ẩn ở C102 và C103.',
    appliedAnswerPoints: [
      'C102 has the literal string `"N/A"` in `email`, which passes `IS NOT NULL` but is a disguised missing value.',
      'C103 has `"0000000000"` in `phone`, a dummy placeholder string that passes `IS NOT NULL` but cannot receive SMS notifications.',
      'True completeness checks must combine `IS NOT NULL` with format/domain validation (regex for valid email and phone patterns).',
    ],
    appliedMisconception: 'Relying solely on `IS NOT NULL` to measure data completeness.',
  },
  {
    code: 'ACCURACY_VS_PRECISION',
    topic: 'Data Accuracy vs. Precision and Validity',
    objective: 'Differentiate valid format/precision from real-world factual accuracy',
    conceptFocusEn: 'A student’s birth date in the database is stored as `1925-04-15` with valid ISO date format. Explain why this value passes syntactic validity checks yet fails real-world accuracy for a current 2nd-year undergraduate.',
    conceptFocusVi: 'Ngày sinh của một sinh viên năm 2 đại học được lưu là `1925-04-15` đúng chuẩn định dạng ISO. Hãy giải thích vì sao giá trị này vượt qua kiểm tra cú pháp (validity) nhưng lại sai về độ chính xác thực tế (accuracy).',
    contradictionEn: 'CampusMart records a coffee bean bag weight as `500.0000 grams` when the actual bag weighs `250 grams`. Explain how a measurement can have high numeric precision but zero factual accuracy.',
    contradictionVi: 'CampusMart ghi nhận trọng lượng túi hạt cà phê là `500.0000 gram` trong khi túi thực tế nặng `250 gram`. Hãy giải thích vì sao một số liệu có thể có độ chi tiết thập phân (precision) cao nhưng độ chính xác thực tế (accuracy) lại bằng không.',
    misconception: 'Equating valid data type formatting or many decimal places with factual accuracy.',
    followUp: 'What range `CHECK` constraint would catch the `1925-04-15` birth year typo at insert time?',
    appliedTitle: 'Inventory Count Accuracy vs System Log',
    appliedTable: `sku   | item_name       | db_stock_qty | physical_shelf_qty | unit_price_vnd
------+-----------------+--------------+--------------------+---------------
P201  | Matcha Powder   |      45      |         12         |     120000
P202  | Paper Cup 16oz  |     500      |        500         |        -2000`,
    appliedQuestionEn: 'Inspect the coffee shop inventory audit table above. Identify which row violates domain validity (and can be caught automatically by the DBMS) versus which row violates real-world accuracy (requiring physical stocktake reconciliation).',
    appliedQuestionVi: 'Quan sát bảng kiểm kê kho quán cà phê ở trên. Hãy chỉ ra dòng nào vi phạm tính hợp lệ miền giá trị (validity — CSDL tự bắt lỗi được) và dòng nào vi phạm độ chính xác thực tế (accuracy — phải đối chiếu kiểm kê vật lý mới biết).',
    appliedAnswerPoints: [
      '`P202` violates domain validity because `unit_price_vnd = -2000` is negative; a database `CHECK (unit_price_vnd >= 0)` catches this immediately.',
      '`P201` (`db_stock_qty = 45` is a valid positive integer, so the DBMS sees no syntax error) violates real-world accuracy because physical shelf count is only `12` (e.g., unrecorded spoilage or theft).',
    ],
    appliedMisconception: 'Expecting a SQL `CHECK` constraint to automatically know that 33 bags of Matcha Powder spoiled on the shelf.',
  },
  {
    code: 'CONSISTENCY_CROSS_TABLE',
    topic: 'Cross-System and Cross-Column Data Consistency',
    objective: 'Identify logical contradictions across related attributes or systems',
    conceptFocusEn: 'In CampusMart’s `Orders` table, an order has `status = "DELIVERED"`, `ordered_at = "2026-10-10 14:00"`, and `delivered_at = "2026-10-09 09:00"`. Explain why this violates temporal consistency even though both timestamps are valid dates.',
    conceptFocusVi: 'Trong bảng `Orders` của CampusMart, một đơn hàng có `status = "DELIVERED"`, `ordered_at = "2026-10-10 14:00"` và `delivered_at = "2026-10-09 09:00"`. Giải thích vì sao bản ghi này vi phạm tính nhất quán thời gian dù cả hai mốc ngày đều hợp lệ.',
    contradictionEn: 'In an internship table, a student row has `internship_status = "UNPLACED"` while `assigned_company_id = "COMP_08"` and `start_date = "2026-09-01"`. Why does this cross-column contradiction confuse both human staff and AI reporting agents?',
    contradictionVi: 'Trong bảng thực tập, bản ghi của một sinh viên có `internship_status = "UNPLACED"` (chưa có nơi thực tập) nhưng `assigned_company_id = "COMP_08"` và `start_date = "2026-09-01"`. Tại sao mâu thuẫn chéo giữa các cột này làm rối loạn cả nhân viên lẫn tác nhân báo cáo AI?',
    misconception: 'Checking each column in isolation without validating cross-column invariants (`delivered_at >= ordered_at`).',
    followUp: 'Write a SQL table-level `CHECK` expression to enforce that `delivered_at` is never earlier than `ordered_at`.',
    appliedTitle: 'Cross-Column Consistency Audit in Orders',
    appliedTable: `order_id | payment_status | paid_amount_vnd | order_total_vnd | shipped_date
---------+----------------+-----------------+-----------------+-------------
ORD_51   | UNPAID         |     150000      |     150000      | 2026-10-12
ORD_52   | PAID           |          0      |     240000      | NULL
ORD_53   | PAID           |     180000      |     180000      | 2026-10-12`,
    appliedQuestionEn: 'Analyze `ORD_51`, `ORD_52`, and `ORD_53` above. Explain the specific cross-column inconsistency in `ORD_51` and `ORD_52`, and state how two different analysts querying "Paid Revenue" might get conflicting totals.',
    appliedQuestionVi: 'Phân tích 3 đơn hàng `ORD_51`, `ORD_52`, `ORD_53` ở trên. Chỉ ra mâu thuẫn chéo giữa các cột ở `ORD_51` và `ORD_52`, đồng thời giải thích vì sao hai chuyên viên cùng tính "Doanh thu đã thanh toán" lại ra hai con số khác nhau.',
    appliedAnswerPoints: [
      '`ORD_51` has `payment_status = "UNPAID"` yet `paid_amount_vnd = 150000` (full amount) and is already shipped.',
      '`ORD_52` has `payment_status = "PAID"` yet `paid_amount_vnd = 0` on a 240,000 VND order.',
      'Analyst 1 filtering `WHERE payment_status = "PAID"` sums `order_total_vnd` (`240,000 + 180,000 = 420,000`), while Analyst 2 summing `paid_amount_vnd` gets `150,000 + 0 + 180,000 = 330,000`.',
    ],
    appliedMisconception: 'Assuming status flags and numeric payment columns always stay synchronized without transactional constraints.',
  },
  {
    code: 'TIMELINESS_FRESHNESS',
    topic: 'Data Timeliness, Currency, and Staleness',
    objective: 'Evaluate whether data is fresh enough for the specific business decision at hand',
    conceptFocusEn: 'Explain why a 24-hour-old data warehouse sync is timely enough for CampusMart’s monthly supplier negotiation, but dangerously stale for checking whether a student’s Campus Wallet has sufficient balance at the checkout counter.',
    conceptFocusVi: 'Hãy giải thích vì sao dữ liệu đồng bộ trễ 24 giờ là đủ kịp thời (timely) cho buổi đàm phán nhà cung cấp hằng tháng của CampusMart, nhưng lại quá cũ và nguy hiểm nếu dùng để kiểm tra số dư Ví sinh viên ngay tại quầy thu ngân.',
    contradictionEn: 'A campus coffee shop AI assistant recommends staffing fewer baristas this afternoon based on weather and foot-traffic data synced from last month. Which data quality dimension failed here, even if last month’s numbers were 100% accurate?',
    contradictionVi: 'Trợ lý AI của quán cà phê khuyến nghị giảm nhân viên pha chế chiều nay dựa trên dữ liệu thời tiết và lưu lượng khách đồng bộ từ tháng trước. Chiều kích chất lượng dữ liệu nào đã bị vi phạm ở đây dù số liệu tháng trước hoàn toàn chính xác 100%?',
    misconception: 'Thinking accurate historical data is automatically suitable for real-time operational decisions.',
    followUp: 'What metadata column helps an AI agent verify whether a cached inventory table is too old to trust?',
    appliedTitle: 'Evaluating Data Freshness for Flash Sale',
    appliedTable: `sku    | item_name       | cached_stock | last_synced_at      | current_time
-------+-----------------+--------------+---------------------+-------------------
SKU_09 | Graphic Tablet  |      8       | 2026-10-15 08:00:00 | 2026-10-15 13:30:00
Live OrderLines between 08:00 and 13:30 for SKU_09: 8 units sold.`,
    appliedQuestionEn: 'At 13:30, a student asks the CampusMart chatbot if `SKU_09` is available. The chatbot reads `cached_stock = 8` (synced at 08:00) and promises the student it is in stock. Trace what actually happened between 08:00 and 13:30 and how to fix the architecture.',
    appliedQuestionVi: 'Lúc 13:30, sinh viên hỏi chatbot CampusMart xem mã `SKU_09` còn hàng không. Chatbot đọc `cached_stock = 8` (đồng bộ lúc 08:00) và khẳng định còn hàng. Hãy phân tích chuyện gì đã xảy ra từ 08:00 đến 13:30 và cách khắc phục.',
    appliedAnswerPoints: [
      'Between 08:00 and 13:30, all 8 units were sold in `OrderLines`, so real-time stock is `8 - 8 = 0`.',
      'The 5.5-hour sync lag caused a timeliness failure ("overselling" out-of-stock merchandise).',
      'Fix: Query live OLTP stock (or display `last_synced_at` warning / trigger event-driven cache invalidation on checkout).',
    ],
    appliedMisconception: 'Blaming the AI’s arithmetic when the root cause is stale cache latency.',
  },
  {
    code: 'SURVIVORSHIP_SELECTION_BIAS',
    topic: 'Selection Bias and Survivorship Bias in AI Training Data',
    objective: 'Identify how biased database subsets distort AI models and business insights',
    conceptFocusEn: 'CampusMart sends a satisfaction survey only to VIP Gold members who bought at least 10 times this semester, and uses the responses to train an AI store-improvement recommender. Explain why this dataset suffers from selection/survivorship bias.',
    conceptFocusVi: 'CampusMart chỉ gửi khảo sát mức độ hài lòng cho các thành viên VIP Gold đã mua hàng ít nhất 10 lần trong học kỳ, rồi dùng dữ liệu đó để AI đề xuất cải thiện cửa hàng. Hãy giải thích vì sao tập dữ liệu này mắc lỗi thiên lệch chọn mẫu / thiên lệch sống sót (survivorship bias).',
    contradictionEn: 'An internship office calculates average starting salary by surveying only graduates who voluntarily posted their job offers on the alumni wall. Why will this database table systematically overestimate graduate earnings?',
    contradictionVi: 'Văn phòng thực tập tính mức lương khởi điểm trung bình bằng cách chỉ thống kê những sinh viên tự nguyện đăng thư mời nhận việc lên bảng vinh danh cựu sinh viên. Tại sao bảng dữ liệu này sẽ ước lượng quá cao mức thu nhập thực tế?',
    misconception: 'Thinking that collecting more rows from the same biased subgroup eliminates selection bias.',
    followUp: 'Which customer segment at CampusMart actually holds the most critical clues about why students stop shopping there?',
    appliedTitle: 'Auditing Biased Survey Table for Coffee Shop Menu Change',
    appliedTable: `survey_channel        | respondents | pct_want_sweet_syrup | avg_age
----------------------+-------------+----------------------+--------
App Promo Push (19:00)|     120     |         85%          |   19
Morning Faculty Walkin|       0     |        NULL          |  NULL
(Note: Morning faculty buyers pay cash and do not use the mobile app)`,
    appliedQuestionEn: 'Based on the table above, an AI assistant advises the campus coffee shop: "85% of all customers want sweeter drinks; remove unsweetened Americano from the morning menu." Critique this conclusion using database sampling principles.',
    appliedQuestionVi: 'Dựa vào bảng trên, trợ lý AI khuyên quán cà phê: "85% toàn bộ khách hàng thích đồ uống ngọt hơn; hãy bỏ món Americano không đường khỏi thực đơn buổi sáng." Hãy phản biện kết luận này dựa trên nguyên lý mẫu dữ liệu.',
    appliedAnswerPoints: [
      '100% of the survey data came from evening mobile app users (`App Promo Push`), while Morning Faculty walk-in cash buyers had `0` representation.',
      'Applying evening student preferences to the morning menu commits severe selection bias and alienates morning faculty Americano buyers.',
      'Database analysis must segment by customer cohort and channel (`GROUP BY shift, payment_channel`) before generalizing.',
    ],
    appliedMisconception: 'Treating `120 respondents` in a table as a representative sample of all store traffic without checking channel coverage.',
  },
  {
    code: 'GIGO_AI_PIPELINE',
    topic: 'Garbage In, Garbage Out (GIGO) in AI-Powered Decisions',
    objective: 'Trace how dirty database records corrupt downstream AI predictions',
    conceptFocusEn: 'Explain the principle "Garbage In, Garbage Out" (GIGO) in the context of connecting an AI agent to a business database. Why can even the most advanced AI model not compensate for systematically corrupted transaction records?',
    conceptFocusVi: 'Giải thích nguyên lý "Garbage In, Garbage Out" (Rác đầu vào, Rác đầu ra) khi kết nối tác nhân AI vào CSDL doanh nghiệp. Tại sao ngay cả mô hình AI tiên tiến nhất cũng không thể bù đắp được cho các bản ghi giao dịch bị nhập sai có hệ thống?',
    contradictionEn: 'At a small retail shop, cashiers record all returned items as regular positive sales with a text note `"RETURN"` in the comment field. If an AI forecasting tool only reads `quantity` and `unit_price`, how does GIGO manifest?',
    contradictionVi: 'Tại một cửa hàng nhỏ, thu ngân nhập mọi món hàng khách trả lại thành đơn bán dương bình thường và chỉ ghi chữ `"RETURN"` vào ô ghi chú. Nếu công cụ dự báo AI chỉ đọc cột `quantity` và `unit_price`, hiệu ứng GIGO sẽ xảy ra như thế nào?',
    misconception: 'Believing that upgrading to a larger AI model fixes underlying database capture errors.',
    followUp: 'How should returned items be modeled in the schema so quantitative queries never mistake returns for sales?',
    appliedTitle: 'GIGO Impact on AI Restock Recommendation',
    appliedTable: `sku   | item_name     | recorded_qty_sold | comment_note
------+---------------+-------------------+----------------------------------
P301  | Blue Hoodie   |         2         | Normal sale
P301  | Blue Hoodie   |        50         | Cashier typo: meant 5 units!
P301  | Blue Hoodie   |         3         | Normal sale`,
    appliedQuestionEn: 'Look at the 3 transaction rows for `P301` (Blue Hoodie) this week. Calculate the true units sold vs the recorded sum in the database, and explain what happens if an AI auto-replenishment rule orders `2 * weekly_recorded_sales` from the factory.',
    appliedQuestionVi: 'Quan sát 3 dòng giao dịch của mã `P301` (Áo Hoodie xanh) trong tuần này. Hãy tính số lượng bán thực tế so với tổng ghi nhận trong CSDL, và giải thích hậu quả nếu quy tắc đặt hàng tự động của AI đặt mua `2 * tổng_bán_trong_tuần` từ xưởng.',
    appliedAnswerPoints: [
      'True units sold = `2 + 5 + 3 = 10` units; recorded sum with the unfixed typo = `2 + 50 + 3 = 55` units.',
      'The AI rule orders `2 * 55 = 110` hoodies instead of `2 * 10 = 20` hoodies (an excess over-order of 90 hoodies!).',
      'Fix: Correct the corrupted transaction row (or add an outlier threshold warning when a single retail basket exceeds e.g. 20 units).',
    ],
    appliedMisconception: 'Leaving known data entry typos unfixed in the transaction table and only writing a text note in `comment_note`.',
  },
  {
    code: 'ENTITY_RESOLUTION_DEDUP',
    topic: 'Entity Resolution and Duplicate Records',
    objective: 'Identify duplicate real-world entities stored under multiple database keys',
    conceptFocusEn: 'Why can a database table have a valid `PRIMARY KEY (customer_id)` with zero duplicate IDs, yet still suffer from duplicate customer records for the exact same real-world student?',
    conceptFocusVi: 'Tại sao một bảng CSDL đã có khóa chính `PRIMARY KEY (customer_id)` không hề trùng mã ID nhưng vẫn bị trùng lặp bản ghi khách hàng của cùng một sinh viên ngoài đời thực?',
    contradictionEn: 'In the Internship Hub, the same partner company is entered three times as `"FPT Software"`, `"FPT Software Co., Ltd"`, and `"FPT-Soft"`. What happens when the university leadership asks for the top 5 employers by total interns hosted?',
    contradictionVi: 'Trong hệ thống Thực tập, cùng một công ty đối tác bị nhập 3 lần thành `"FPT Software"`, `"FPT Software Co., Ltd"` và `"FPT-Soft"`. Chuyện gì xảy ra khi Ban giám hiệu yêu cầu báo cáo Top 5 doanh nghiệp nhận nhiều sinh viên thực tập nhất?',
    misconception: 'Thinking `PRIMARY KEY` on an auto-generated surrogate ID (`C01`, `C02`, `C03`) automatically prevents real-world duplicate people or companies.',
    followUp: 'What natural business identifier (such as `tax_code` or `student_id`) should have a `UNIQUE` constraint to prevent duplicate entities?',
    appliedTitle: 'Customer Entity Duplication Impact on VIP Qualification',
    appliedTable: `cust_id | full_name      | student_card | phone        | spend_vnd
--------+----------------+--------------+--------------+----------
C_01    | Nguyen Thi Mai | 00231055     | 0912000111   |  350,000
C_02    | Mai Nguyen     | 00231055     | 0912000111   |  250,000
(VIP Rule: Total spend >= 500,000 VND qualifies for VIP discount)`,
    appliedQuestionEn: 'Inspect `C_01` and `C_02` above. Does student `00231055` actually qualify for the 500,000 VND VIP tier? Why does a query grouping by `cust_id` fail to grant her VIP status, and how do you prevent this in the schema?',
    appliedQuestionVi: 'Quan sát hai dòng `C_01` và `C_02` ở trên. Sinh viên có mã thẻ `00231055` thực chất có đủ điều kiện lên hạng VIP (tổng chi tiêu >= 500.000đ) không? Tại sao truy vấn gom nhóm theo `cust_id` lại không cấp VIP cho bạn ấy, và cần ràng buộc gì trong lược đồ để ngăn chặn?',
    appliedAnswerPoints: [
      'Yes, her combined spend is `350,000 + 250,000 = 600,000 VND >= 500,000 VND`.',
      'Because she was registered twice under two surrogate IDs (`C_01` and `C_02`), `GROUP BY cust_id` sees two separate people spending 350k and 250k (neither reaching 500k).',
      'Prevention: Enforce a `UNIQUE` constraint on natural identifier `student_card` (or `phone`) and merge `C_01`/`C_02`.',
    ],
    appliedMisconception: 'Assuming surrogate primary keys (`C_01`, `C_02`) prevent duplicate human profiles without a `UNIQUE` constraint on natural keys.',
  },
  {
    code: 'UNIT_CURRENCY_STANDARDIZATION',
    topic: 'Unit of Measure and Scale Consistency',
    objective: 'Prevent catastrophic calculation errors caused by mixing units or currencies in one column',
    conceptFocusEn: 'Why must a numerical column in a relational table always represent a single standardized unit of measure (e.g., always VND, or always grams), or else be explicitly paired with a converted base-unit column?',
    conceptFocusVi: 'Tại sao một cột số trong bảng quan hệ luôn phải tuân theo một đơn vị đo lường thống nhất (ví dụ: luôn là VNĐ, hoặc luôn là gram) trước khi thực hiện phép cộng và so sánh?',
    contradictionEn: 'In an internship stipend table, domestic companies enter monthly stipends in VND (`5000000`) while two foreign NGOs enter stipends in USD (`250`) into the exact same `stipend_amount` column. What happens to `AVG(stipend_amount)`?',
    contradictionVi: 'Trong bảng phụ cấp thực tập, các công ty trong nước nhập mức hỗ trợ theo VNĐ (`5000000`) còn hai tổ chức nước ngoài lại nhập theo USD (`250`) vào cùng một cột `stipend_amount`. Điều gì sẽ xảy ra với phép tính `AVG(stipend_amount)`?',
    misconception: 'Thinking SQL `SUM()` or `AVG()` knows how to convert currencies or units automatically.',
    followUp: 'How should the schema store multi-currency stipends so both original currency and VND comparisons work cleanly?',
    appliedTitle: 'Coffee Shop Recipe Ingredient Unit Mismatch',
    appliedTable: `ing_id | ingredient_name | stock_qty | unit_label | reorder_threshold
-------+-----------------+-----------+------------+------------------
ING_1  | Espresso Beans  |     4     | kg         |       1500
ING_2  | Whole Milk      |  2500     | ml         |       3000`,
    appliedQuestionEn: 'A stock alert query runs `WHERE stock_qty < reorder_threshold`, where `reorder_threshold` was configured in grams/milliliters (`1500` grams for beans, `3000` ml for milk). Why does `ING_1` trigger a false out-of-stock alarm even though the shop has 4 kg (4,000 grams) of beans?',
    appliedQuestionVi: 'Truy vấn cảnh báo hết nguyên liệu chạy điều kiện `WHERE stock_qty < reorder_threshold`, trong đó ngưỡng đặt lại được cấu hình theo gram/ml (`1500` gram hạt cà phê, `3000` ml sữa). Tại sao `ING_1` lại báo động giả hết hàng dù quán đang còn tới 4 kg (4.000 gram) hạt cà phê?',
    appliedAnswerPoints: [
      '`stock_qty` for `ING_1` is stored in `kg` (`4`), while `reorder_threshold` is in grams (`1500`).',
      'Comparing `4 < 1500` numerically evaluates to `TRUE` even though `4 kg = 4,000 g > 1,500 g`.',
      'Fix: Store both `stock_base_qty` and `reorder_threshold` in the same base unit (grams / ml) and only convert to `kg` for UI display.',
    ],
    appliedMisconception: 'Storing mixed units (`kg` and `g`) in the same numeric column without normalizing to a base unit.',
  },
  {
    code: 'OUTLIER_VS_ERROR',
    topic: 'Distinguishing Genuine Business Outliers from Data Entry Errors',
    objective: 'Audit extreme database values before deleting or feeding them to AI',
    conceptFocusEn: 'When cleaning CampusMart sales data, an analyst sees a single order for 200 Campus T-shirts (whereas the normal basket is 1–2 shirts). Why is automatically deleting all rows where `qty > 10` as "errors" a mistake?',
    conceptFocusVi: 'Khi làm sạch dữ liệu bán hàng CampusMart, chuyên viên thấy một đơn hàng mua tới 200 áo thun đồng phục trường (trong khi giỏ hàng bình thường chỉ 1–2 chiếc). Tại sao việc tự động xóa mọi dòng có `qty > 10` vì cho là "lỗi nhập liệu" lại là sai lầm?',
    contradictionEn: 'Compare two extreme values in a student database: (1) `gpa = 4.00` (on a 4.0 scale) vs (2) `gpa = 38.5` (where the clerk forgot the decimal point in `3.85`). Explain how you treat a valid outlier versus a data entry error.',
    contradictionVi: 'Hãy so sánh hai giá trị khác biệt trong CSDL sinh viên: (1) `gpa = 4.00` (trên thang 4.0) và (2) `gpa = 38.5` (do nhân viên quên gõ dấu chấm thập phân của `3.85`). Bạn xử lý một điểm ngoại lai hợp lệ (valid outlier) khác với một lỗi nhập liệu như thế nào?',
    misconception: 'Blindly deleting all statistical outliers from an operational database, which erases legitimate bulk institutional orders.',
    followUp: 'How can a `channel_type` column (`RETAIL` vs `CLUB_BULK_ORDER`) help analysts and AI models handle the 200-shirt order properly?',
    appliedTitle: 'Auditing Extreme Order Quantities at CampusMart',
    appliedTable: `order_id | customer_type   | item_name      | qty  | unit_price | payment_receipt
---------+-----------------+----------------+------+------------+----------------
ORD_801  | STUDENT_CLUB    | Event Lanyard  | 300  |   15,000   | BANK_TX_99812
ORD_802  | WALK_IN_CASH    | Bottled Water  | 9999 |   10,000   | CASH_10000_VND`,
    appliedQuestionEn: 'Compare `ORD_801` (`qty = 300`) and `ORD_802` (`qty = 9999`). Using the contextual columns in the table, determine which row is a legitimate business outlier and which row is a data entry error (and what the true quantity in `ORD_802` was).',
    appliedQuestionVi: 'Hãy đối chiếu `ORD_801` (`qty = 300`) và `ORD_802` (`qty = 9999`). Dựa vào các cột ngữ cảnh trong bảng, hãy xác định dòng nào là ngoại lai kinh doanh hợp lệ (valid outlier) và dòng nào là lỗi nhập liệu (cùng số lượng thực của `ORD_802`).',
    appliedAnswerPoints: [
      '`ORD_801` is a legitimate bulk order: placed by `STUDENT_CLUB` for event lanyards with verified bank transfer `BANK_TX_99812`.',
      '`ORD_802` is a data entry error (cashier leaned on the `9` key): `payment_receipt` shows `CASH_10000_VND` for a `10,000 VND` water bottle, proving the true quantity sold was `1` bottle, not `9,999`!',
    ],
    appliedMisconception: 'Treating `ORD_801` and `ORD_802` identically based only on a `qty > 100` threshold without checking payment evidence.',
  },
  {
    code: 'DOMAIN_INTEGRITY_CODES',
    topic: 'Domain Integrity and Controlled Vocabularies',
    objective: 'Enforce standardized status and category values instead of free-text variations',
    conceptFocusEn: 'Why does allowing free-text entry in a `major_name` column (resulting in `"Business Admin"`, `"BBA"`, `"Quan tri kinh doanh"`, `"QTKD"`) ruin aggregation queries and AI cohort analysis?',
    conceptFocusVi: 'Tại sao việc cho phép gõ văn bản tự do vào cột `major_name` (dẫn đến xuất hiện cả `"Business Admin"`, `"BBA"`, `"Quan tri kinh doanh"`, `"QTKD"`) lại làm hỏng các truy vấn thống kê gom nhóm và phân tích của AI?',
    contradictionEn: 'Explain how a foreign key reference to a lookup table (or a `CHECK (status IN (...))` constraint) enforces domain integrity for order statuses at CampusMart.',
    contradictionVi: 'Hãy giải thích cách dùng khóa ngoại tham chiếu tới bảng danh mục (hoặc ràng buộc `CHECK (status IN (...))`) giúp đảm bảo toàn vẹn miền giá trị (domain integrity) cho trạng thái đơn hàng tại CampusMart.',
    misconception: 'Relying on staff to remember exact capitalization and spelling when typing categories manually.',
    followUp: 'When is a separate lookup table (`Majors`) better than a hardcoded `CHECK (major IN (...))` constraint?',
    appliedTitle: 'Payment Method Free-Text Fragmentation',
    appliedTable: `SELECT payment_method, COUNT(*) AS tx_count, SUM(amount_vnd) AS total_vnd
FROM Coffee_Orders GROUP BY payment_method;

payment_method | tx_count | total_vnd
---------------+----------+----------
"QR"           |    40    | 1,400,000
"qr code"      |    15    |   525,000
"VietQR"       |    25    |   875,000
"Cash"         |    30    |   900,000`,
    appliedQuestionEn: 'The coffee shop owner wants to know what percentage of revenue comes from QR bank transfers versus Cash. Calculate the true QR revenue and percentage from the query output above, and explain why a naive dashboard reading only row `"QR"` under-reports QR usage.',
    appliedQuestionVi: 'Chủ quán cà phê muốn biết tỷ trọng doanh thu thanh toán qua mã QR so với Tiền mặt. Hãy tính tổng doanh thu QR thực tế và tỷ lệ phần trăm từ kết quả trên, đồng thời giải thích vì sao bảng điều khiển chỉ lấy dòng `"QR"` lại báo cáo thiếu.',
    appliedAnswerPoints: [
      'True QR revenue combines `"QR"` + `"qr code"` + `"VietQR"` = `1,400,000 + 525,000 + 875,000 = 2,800,000 VND`.',
      'Total store revenue = `2,800,000 + 900,000 (Cash) = 3,700,000 VND`, so QR is `2,800,000 / 3,700,000 ≈ 75.68%` (80 out of 110 orders).',
      'A naive chart reading only `"QR"` reports `1,400,000 VND` (`37.8%`), missing half of QR sales due to unstandardized free-text labels.',
    ],
    appliedMisconception: 'Reporting 1,400,000 VND as total QR revenue without consolidating synonyms `"qr code"` and `"VietQR"`.',
  },
  {
    code: 'PROVENANCE_LINEAGE',
    topic: 'Data Lineage, Provenance, and Source Verification',
    objective: 'Track where data originated and who modified it for trustworthy AI and auditing',
    conceptFocusEn: 'What is "data provenance / lineage"? In our HSB3102E Oral Exam Studio, why must every question record `source_refs` honestly (marking `"Chưa đối chiếu học liệu gốc"` when drafted without original slide numbers) rather than inventing fake slide citations?',
    conceptFocusVi: 'Nguồn gốc dữ liệu (data provenance / lineage) là gì? Trong hệ thống HSB3102E Oral Exam Studio, tại sao mỗi câu hỏi phải ghi nhận `source_refs` trung thực (ghi rõ `"Chưa đối chiếu học liệu gốc"` nếu chưa có slide gốc) thay vì tự bịa số trang hay số slide?',
    contradictionEn: 'When CampusMart imports supplier prices from three different files, why is storing `source_file_name`, `imported_by`, and `imported_at` critical when an incorrect price appears at checkout?',
    contradictionVi: 'Khi CampusMart nhập bảng giá nhà cung cấp từ 3 file khác nhau, tại sao việc lưu kèm `source_file_name`, `imported_by` và `imported_at` lại quyết định khả năng truy vết khi phát hiện một mức giá bị sai tại quầy thu ngân?',
    misconception: 'Treating all rows in a database as equally authoritative without recording their origin or verification status.',
    followUp: 'If a single bad CSV import corrupted 80 prices at 10:05 AM, how does `import_batch_id` help roll back only those 80 changes?',
    appliedTitle: 'Tracing Corrupted Price via Lineage Metadata',
    appliedTable: `sku   | unit_price | updated_by        | source_channel      | updated_at
------+------------+-------------------+---------------------+--------------------
P_10  |   120,000  | staff_lan         | MANUAL_ADMIN_FORM   | 2026-10-01 09:00:00
P_11  |     1,500  | bot_csv_importer  | PROMO_DRAFT_V1.csv  | 2026-10-14 22:15:00
P_12  |     2,000  | bot_csv_importer  | PROMO_DRAFT_V1.csv  | 2026-10-14 22:15:00`,
    appliedQuestionEn: 'On October 15, CampusMart discovers that backpacks `P_11` and `P_12` (normally 350,000 VND) are ringing up at 1,500 VND and 2,000 VND. Using the lineage table above, identify the exact source of the corruption and how to isolate all affected products.',
    appliedQuestionVi: 'Sáng 15/10, CampusMart phát hiện hai mẫu ba lô `P_11` và `P_12` (giá gốc 350.000đ) bị tính giá chỉ 1.500đ và 2.000đ. Dựa vào bảng truy vết (lineage) ở trên, hãy xác định chính xác nguồn gây lỗi và cách khoanh vùng toàn bộ sản phẩm bị ảnh hưởng.',
    appliedAnswerPoints: [
      'Lineage columns show both `P_11` and `P_12` were overwritten at `2026-10-14 22:15:00` by `bot_csv_importer` from file `PROMO_DRAFT_V1.csv`.',
      'The administrator can immediately query `WHERE source_channel = "PROMO_DRAFT_V1.csv"` to isolate every product touched by that draft file and restore their prior prices.',
    ],
    appliedMisconception: 'Manually hunting through thousands of products one by one because batch lineage metadata was not recorded.',
  },
  {
    code: 'HISTORICAL_SNAPSHOT_INTEGRITY',
    topic: 'Immutability of Historical Snapshots vs. Master Updates',
    objective: 'Explain why editing master reference records must not rewrite historical event snapshots',
    conceptFocusEn: 'In our Oral Exam Studio, when a student draws Question `Q_05_01`, the system saves a full `QuestionSnapshot` (prompt, answer points, rubric) inside the attempt. Why must editing `Q_05_01` in the Question Bank next week NOT alter the snapshot of the student who already took the exam today?',
    conceptFocusVi: 'Trong ứng dụng Oral Exam Studio, khi sinh viên rút câu `Q_05_01`, hệ thống lưu bản chụp `QuestionSnapshot` (đề bài, ý trả lời, rubric) vào lượt thi. Tại sao việc giảng viên sửa nội dung câu `Q_05_01` trong ngân hàng vào tuần sau KHÔNG ĐƯỢC làm thay đổi lịch sử đề thi của sinh viên đã thi hôm nay?',
    contradictionEn: 'Similarly, at CampusMart, if a customer’s shipping address changes in November, why must their completed September delivery orders still show the September delivery address where the package was actually dropped off?',
    contradictionVi: 'Tương tự tại CampusMart, nếu khách hàng đổi địa chỉ nhận hàng vào tháng 11, tại sao các đơn hàng đã giao thành công hồi tháng 9 vẫn phải giữ nguyên địa chỉ giao hàng tháng 9?',
    misconception: 'Linking historical event details exclusively by dynamic pointer without snapshotting mutable terms (price, rubric, delivery address) at the moment of the event.',
    followUp: 'What happens during an academic grade appeal if modifying a question in the bank retroactively changes the question text shown on past attempts?',
    appliedTitle: 'Auditing Retroactive Rubric Mutation Bug',
    appliedTable: `Attempt ATT_01 (Graded Oct 10):
Student: 00231005 | Scored: 4.5 / 5.0 on Question Q_12 (Version 1: Explain 2NF)

Oct 12 Bank Edit:
Instructor rewrites Q_12 in place to ask about "BCNF and 4NF" without snapshotting.`,
    appliedQuestionEn: 'If the database only stored `question_id = "Q_12"` in `ATT_01` without a snapshot, what false discrepancy appears when the department head audits `ATT_01` on October 15? How does snapshotting + versioning prevent this?',
    appliedQuestionVi: 'Nếu CSDL chỉ lưu khóa ngoại `question_id = "Q_12"` trong lượt thi `ATT_01` mà không lưu snapshot, sự sai lệch nào sẽ xuất hiện khi Trưởng bộ môn kiểm tra lại bài thi `ATT_01` vào ngày 15/10? Cơ chế snapshot + version khắc phục điều này ra sao?',
    appliedAnswerPoints: [
      'On Oct 15, joining `ATT_01` to the mutated `Q_12` makes it look like the student was asked about "BCNF and 4NF", contradicting the student’s recorded answer evidence about "2NF"!',
      'Saving an immutable `QuestionSnapshot` inside `ATT_01` at draw time (and incrementing `Q_12` to `version = 2` on edit) preserves exact historical truth for grade appeals.',
    ],
    appliedMisconception: 'Assuming foreign key joins to mutable master rows are sufficient for historical legal/exam audit trails.',
  },
  {
    code: 'TEXT_WHITESPACE_CASE_CLEANING',
    topic: 'String Normalization (Leading/Trailing Spaces & Case Sensitivity)',
    objective: 'Diagnose why invisible whitespace and case mismatches break SQL equality and joins',
    conceptFocusEn: 'Why does `"HSB3102E"` not equal `"HSB3102E "` (with a trailing space) or `"hsb3102e"` in standard SQLite `=` comparisons, and how does trimming/normalizing text at ingestion improve data quality?',
    conceptFocusVi: 'Tại sao chuỗi `"HSB3102E"` lại không bằng `"HSB3102E "` (có dấu cách thừa ở cuối) hoặc `"hsb3102e"` trong phép so sánh `=` mặc định của SQLite, và việc cắt khoảng trắng (`TRIM`) ngay khi nhập dữ liệu giúp ích gì?',
    contradictionEn: 'When students type their email on a mobile phone, auto-capitalization often produces `"An.Nguyen@Campus.edu "` with a trailing space. What happens when they later try to look up their record with `"an.nguyen@campus.edu"`?',
    contradictionVi: 'Khi sinh viên nhập email trên điện thoại, bàn phím thường tự viết hoa chữ đầu và thêm dấu cách cuối thành `"An.Nguyen@Campus.edu "`. Chuyện gì xảy ra khi sau đó họ tra cứu hồ sơ bằng `"an.nguyen@campus.edu"`?',
    misconception: 'Assuming SQL `=` automatically ignores trailing spaces and uppercase/lowercase differences.',
    followUp: 'Which SQL functions clean leading/trailing spaces and standardize case in a query?',
    appliedTitle: 'Debugging Zero-Match Coupon Lookup',
    appliedTable: `Promotions Table:               Customer Checkout Input:
promo_code   | discount_vnd     entered_code
-------------+-------------     --------------
"CAMPUS20 "  |    20000         "CAMPUS20"
(Note: promo_code in table has an invisible trailing space at the end)`,
    appliedQuestionEn: 'Fifty students type `CAMPUS20` at checkout, and the query `WHERE promo_code = :entered_code` tells all 50 students "Invalid Promo Code". Looking at the table above, explain why the match failed and how to fix both the database constraint and the query.',
    appliedQuestionVi: '50 sinh viên nhập mã giảm giá `CAMPUS20` lúc thanh toán nhưng truy vấn `WHERE promo_code = :entered_code` đều báo "Mã không hợp lệ". Nhìn vào bảng trên, hãy giải thích nguyên nhân và cách sửa ở cả CSDL lẫn câu truy vấn.',
    appliedAnswerPoints: [
      'The stored `promo_code` `"CAMPUS20 "` is 9 characters long (including a trailing space), whereas `"CAMPUS20"` is 8 characters long, so `=` returns `FALSE`.',
      'Fix at ingestion/DB: Trim strings before saving (`TRIM(UPPER(code))`) and add `CHECK (promo_code = TRIM(promo_code))`.',
      'Fix in query: Use `WHERE TRIM(UPPER(promo_code)) = TRIM(UPPER(:entered_code))`.',
    ],
    appliedMisconception: 'Blaming the customer when an invisible trailing space in the reference table broke equality matching.',
  },
  {
    code: 'SURVIVORSHIP_CHURN_RETAIL',
    topic: 'Silent Missing Rows (Zero-Activity Blind Spot)',
    objective: 'Recognize that events that never happened leave no rows in transaction tables',
    conceptFocusEn: 'If CampusMart only analyzes rows inside the `Orders` table, why will the store manager remain completely blind to products that received 0 sales or students who walked into the store, found a shelf empty, and walked out?',
    conceptFocusVi: 'Nếu CampusMart chỉ phân tích các dòng có trong bảng `Orders`, tại sao cửa hàng trưởng sẽ hoàn toàn "mù thông tin" trước những sản phẩm bán được 0 chiếc hoặc những sinh viên bước vào cửa hàng, thấy kệ trống rồi bỏ về?',
    contradictionEn: 'An AI assistant queries `SELECT product_id, SUM(qty) FROM OrderLines GROUP BY product_id ORDER BY SUM(qty) ASC LIMIT 5` to find the "5 worst-selling products". Why does this query completely miss the products that sold ZERO units?',
    contradictionVi: 'Trợ lý AI chạy câu lệnh `SELECT product_id, SUM(qty) FROM OrderLines GROUP BY product_id ORDER BY SUM(qty) ASC LIMIT 5` để tìm "5 mặt hàng bán chậm nhất". Tại sao câu truy vấn này lại bỏ sót hoàn toàn những mặt hàng bán được 0 chiếc?',
    misconception: 'Thinking `OrderLines` contains rows with `qty = 0` for unsold products.',
    followUp: 'Which table must be the starting point (`FROM Products LEFT JOIN OrderLines`) to include 0-sale products?',
    appliedTitle: 'Audit of "Worst-Selling Items" AI Report',
    appliedTable: `Products Catalog (4 items): P01, P02, P03, P04

OrderLines (October):
product_id | qty_sold
-----------+---------
P01        |   120
P02        |     2
P03        |    45
(Note: P04 had 0 sales in October and does not appear in OrderLines)`,
    appliedQuestionEn: 'An AI runs `SELECT product_id, SUM(qty_sold) FROM OrderLines GROUP BY product_id` and declares `P02` (2 units) is the worst-performing item at CampusMart. Explain why `P04` is the actual worst seller and how the query must be written.',
    appliedQuestionVi: 'AI chạy truy vấn gom nhóm trên bảng `OrderLines` và kết luận `P02` (bán 2 chiếc) là mặt hàng bán kém nhất tại CampusMart. Hãy giải thích vì sao `P04` mới là mặt hàng bán kém nhất (0 chiếc) và cần sửa truy vấn như thế nào.',
    appliedAnswerPoints: [
      '`P04` had 0 sales, so it has no rows in `OrderLines` at all.',
      'Querying `OrderLines` alone suffers from activity bias—it only sees items sold at least once (`P02 = 2`).',
      'Must query from the master catalog: `SELECT p.product_id, COALESCE(SUM(ol.qty_sold), 0) FROM Products p LEFT JOIN OrderLines ol ON p.product_id = ol.product_id GROUP BY p.product_id`.',
    ],
    appliedMisconception: 'Assuming `GROUP BY` on a transaction table will magically output rows for master items with zero transactions.',
  },
  {
    code: 'AI_CONFIDENCE_VS_DATA_QUALITY',
    topic: 'Polished AI Prose vs. Underlying Data Quality',
    objective: 'Separate fluent AI natural-language explanations from the reliability of underlying data',
    conceptFocusEn: 'Why do humans often trust a fluent, confident paragraph written by an AI assistant even when the database rows feeding that AI contained only 2 corrupted sample rows? How should data-literate students evaluate AI reports?',
    conceptFocusVi: 'Tại sao con người thường dễ tin vào một đoạn nhận xét trôi chảy, tự tin do AI viết ra ngay cả khi dữ liệu CSDL đầu vào chỉ có 2 dòng bị lỗi? Sinh viên có tư duy dữ liệu (data literacy) cần kiểm chứng báo cáo của AI như thế nào?',
    contradictionEn: 'In an oral exam or business review, why do we evaluate the correctness of the data logic and evidence rather than how smoothly or fluently the speaker (or AI) talks?',
    contradictionVi: 'Trong kỳ thi vấn đáp hoặc buổi họp kinh doanh, tại sao chúng ta phải đánh giá độ chính xác của logic dữ liệu và bằng chứng thay vì đánh giá sự trôi chảy bề nổi của người nói (hoặc của AI)?',
    misconception: 'Equating linguistic fluency and confident tone with factual and statistical validity.',
    followUp: 'What three numbers should always accompany a percentage claim like "Sales jumped by 100%"?',
    appliedTitle: 'Deconstructing a "100% Growth" AI Executive Summary',
    appliedTable: `CampusMart Smartpen Sales:
Month   | Units_Sold | Defective_Returns
--------+------------+------------------
Sept    |     1      |        0
Oct     |     2      |        2`,
    appliedQuestionEn: 'An AI newsletter generator reads `Units_Sold` (Sept=1, Oct=2) and writes: "Smartpen demand skyrocketed by 100% in October! Double your supplier order immediately!" Using the full table above, point out two reasons why this fluent recommendation is disastrous.',
    appliedQuestionVi: 'Trình tạo bản tin AI đọc cột `Units_Sold` (Tháng 9 = 1, Tháng 10 = 2) và viết: "Nhu cầu bút thông minh tăng vọt 100% trong tháng 10! Hãy tăng gấp đôi đơn nhập hàng ngay!" Dựa vào bảng trên, hãy chỉ ra 2 lý do vì sao khuyến nghị kêu gọi này là sai lầm.',
    appliedAnswerPoints: [
      'Small sample size illusion (base-rate fallacy): growing from `1` unit to `2` units is technically `+100%`, but represents just 1 extra pen sold.',
      'Ignored `Defective_Returns`: all `2` units sold in October were returned as defective (`Net Sales = 2 - 2 = 0`!).',
      'Always verify absolute sample counts (`N`) and net quality metrics behind percentage headlines.',
    ],
    appliedMisconception: 'Acting on percentage growth rates (`+100%`) without inspecting absolute base numbers (`1 -> 2`) and return columns.',
  },
];

// ============================================================================
// LECTURE 03: From Business Requirements to Data Models (15 specs = 30 questions)
// ============================================================================
const LECTURE_03_SPECS: CompactTopicSpec[] = [
  {
    code: 'NOUN_VERB_EXTRACTION',
    topic: 'Extracting Entities, Attributes, and Relationships from Requirements',
    objective: 'Translate natural-language business interviews into candidate entities and attributes',
    conceptFocusEn: 'When interviewing the CampusMart store manager ("Students place orders containing multiple products supplied by vendors"), how do you decide which nouns become Entities/Tables versus which become Attributes/Columns?',
    conceptFocusVi: 'Khi phỏng vấn cửa hàng trưởng CampusMart ("Sinh viên đặt các đơn hàng gồm nhiều sản phẩm do các nhà cung cấp phân phối"), làm thế nào để phân biệt danh từ nào trở thành Thực thể (Entity/Bảng) và danh từ nào chỉ là Thuộc tính (Attribute/Cột)?',
    contradictionEn: 'In a coffee shop interview, the owner mentions "Customer Phone Number" and "Drink Category". Under what business requirement does "Drink Category" stay a simple attribute of `Drinks`, and when must it become its own `Categories` entity?',
    contradictionVi: 'Khi khảo sát quán cà phê, chủ quán nhắc đến "Số điện thoại khách hàng" và "Nhóm đồ uống". Trong điều kiện nghiệp vụ nào thì "Nhóm đồ uống" chỉ cần là một thuộc tính của bảng `Drinks`, và khi nào nó phải tách thành thực thể `Categories` riêng?',
    misconception: 'Turning every single noun (like "Phone Number" or "Order Date") into a separate table, or cramming independent multi-property objects into a single text column.',
    followUp: 'If each Drink Category has its own `vat_rate`, `display_order`, and `manager_in_charge`, should `Category` be an attribute or an entity?',
    appliedTitle: 'Requirement-to-Model Classification for Internship Hub',
    appliedTable: `Interview Excerpt:
"Each Student (identified by student_id, full_name, gpa) submits one or more Applications
(application_date, cover_letter_status) to Partner Companies (company_id, company_name, tax_code)."`,
    appliedQuestionEn: 'From the interview excerpt above, list the 3 core Entities and classify `gpa`, `application_date`, and `tax_code` under their rightful entity. Why should `company_name` NOT be an attribute inside the `Students` table?',
    appliedQuestionVi: 'Từ đoạn phỏng vấn trên, hãy liệt kê 3 Thực thể chính và xếp các thuộc tính `gpa`, `application_date`, `tax_code` vào đúng thực thể. Tại sao `company_name` KHÔNG NÊN đặt làm thuộc tính bên trong bảng `Students`?',
    appliedAnswerPoints: [
      '3 Entities: `Students(student_id, full_name, gpa)`, `Applications(application_id, application_date, cover_letter_status, ...)`, `PartnerCompanies(company_id, company_name, tax_code)`.',
      'Putting `company_name` inside `Students` fails because one student can submit multiple applications to different companies (and companies exist even before any student applies).',
    ],
    appliedMisconception: 'Placing `application_date` or `company_name` directly inside the `Students` table.',
  },
  {
    code: 'CONCEPTUAL_LOGICAL_PHYSICAL',
    topic: 'Conceptual vs. Logical vs. Physical Data Models',
    objective: 'Distinguish the three levels of data modeling abstraction and their audiences',
    conceptFocusEn: 'Compare a Conceptual Data Model, a Logical Data Model, and a Physical Data Model. Which one should you show to a non-technical store owner to verify business rules, and which one includes SQLite-specific types and indexes?',
    conceptFocusVi: 'Hãy phân biệt Mô hình dữ liệu Khái niệm (Conceptual), Logic (Logical) và Vật lý (Physical). Mô hình nào phù hợp để thảo luận xác nhận quy tắc nghiệp vụ với chủ cửa hàng không chuyên IT, và mô hình nào chứa kiểu dữ liệu cùng chỉ mục (index) cụ thể của SQLite?',
    contradictionEn: 'Why is debating whether a column should be `VARCHAR(50)` vs `TEXT` or `INT` vs `BIGINT` during the very first 10 minutes of a business requirements interview with a stakeholder counterproductive?',
    contradictionVi: 'Tại sao việc tranh luận xem cột nên dùng `VARCHAR(50)` hay `TEXT` ngay trong 10 phút đầu tiên khi đang lấy yêu cầu nghiệp vụ với khách hàng lại phản tác dụng?',
    misconception: 'Writing physical `CREATE TABLE` SQL before understanding what entities and business rules actually exist.',
    followUp: 'At which modeling stage do we resolve a many-to-many relationship into an associative table with foreign keys?',
    appliedTitle: 'Classifying Modeling Artifacts Across Stages',
    appliedTable: `Artifact A: [Student] --- applies to ---> [Company]
Artifact B: Applications(app_id PK, student_id FK, company_id FK, submitted_date)
Artifact C: CREATE TABLE applications (app_id TEXT PRIMARY KEY, ...) WITHOUT ROWID; CREATE INDEX idx_app_stu...`,
    appliedQuestionEn: 'Classify Artifacts A, B, and C above as Conceptual, Logical, or Physical models, and state what additional details are added as you move from A -> B -> C.',
    appliedQuestionVi: 'Hãy phân loại 3 Hiện vật (Artifact A, B, C) ở trên tương ứng với mô hình Khái niệm, Logic hay Vật lý, và nêu những chi tiết nào được bổ sung dần khi chuyển từ A -> B -> C.',
    appliedAnswerPoints: [
      'Artifact A is Conceptual: high-level entities and business relationships.',
      'Artifact B is Logical: attributes, primary keys (`PK`), foreign keys (`FK`), and resolved relational structure independent of specific DBMS engine syntax.',
      'Artifact C is Physical: DBMS-specific SQL DDL, storage options (`WITHOUT ROWID`), and performance indexes (`CREATE INDEX`).',
    ],
    appliedMisconception: 'Confusing logical foreign key definitions with physical storage indexes.',
  },
  {
    code: 'HISTORICAL_PRICE_VS_CURRENT_PRICE',
    topic: 'Current Catalog Price vs. Historical Price at Purchase Time',
    objective: 'Model time-sensitive transactional prices separately from mutable catalog prices',
    conceptFocusEn: 'At CampusMart, `Products.current_price` changes whenever there is inflation or a weekend sale. Explain why `OrderLines` MUST have its own `unit_price_at_purchase` column instead of always reading `Products.current_price` via a join.',
    conceptFocusVi: 'Tại CampusMart, cột `Products.current_price` thay đổi mỗi khi điều chỉnh giá hoặc khuyến mãi cuối tuần. Hãy giải thích vì sao bảng chi tiết đơn hàng `OrderLines` BẮT BUỘC phải có cột `unit_price_at_purchase` riêng thay vì chỉ nối bảng lấy `Products.current_price`.',
    contradictionEn: 'A student argues: "Having `current_price` in `Products` AND `unit_price_at_purchase` in `OrderLines` is redundant data duplication!" Explain why this is NOT harmful redundancy, because the two columns represent two different business facts.',
    contradictionVi: 'Một sinh viên tranh luận: "Lưu `current_price` ở bảng `Products` rồi lại lưu `unit_price_at_purchase` ở bảng `OrderLines` là dư thừa dữ liệu!" Hãy giải thích vì sao đây KHÔNG phải là dư thừa có hại, mà là hai sự kiện nghiệp vụ hoàn toàn khác nhau.',
    misconception: 'Deleting `unit_price_at_purchase` from `OrderLines` in the name of "normalization" and thereby rewriting all historical accounting numbers whenever a product’s price changes!',
    followUp: 'If a calculator cost 400,000 VND in September and rises to 450,000 VND in October, what happens to September’s tax report if `OrderLines` didn’t save `unit_price_at_purchase`?',
    appliedTitle: 'Auditing Retroactive Price Change on Past Receipts',
    appliedTable: `Products Table (Today, Nov 1):
product_id | product_name | current_price
-----------+--------------+--------------
P01        | Hoodie       |    300,000   (Was 250,000 in Sept)

OrderLines Table (Missing unit_price_at_purchase!):
order_id | order_date | product_id | qty
---------+------------+------------+----
ORD_01   | 2026-09-15 | P01        |  2`,
    appliedQuestionEn: 'In September, the customer in `ORD_01` bought 2 Hoodies at 250,000 VND each and paid 500,000 VND cash. On Nov 1, `Products.current_price` is updated to 300,000 VND. What happens when the accountant runs `SUM(ol.qty * p.current_price)` for September, and how do you fix the schema?',
    appliedQuestionVi: 'Hồi tháng 9, khách hàng của đơn `ORD_01` mua 2 chiếc Hoodie với giá lúc đó là 250.000đ/chiếc và đã trả 500.000đ tiền mặt. Ngày 01/11, cửa hàng tăng `Products.current_price` lên 300.000đ. Chuyện gì xảy ra khi kế toán chạy `SUM(ol.qty * p.current_price)` cho tháng 9, và cần sửa lược đồ ra sao?',
    appliedAnswerPoints: [
      'Joining to `Products.current_price` calculates `2 * 300,000 = 600,000 VND` for `ORD_01`, creating a `100,000 VND` phantom discrepancy against the `500,000 VND` cash actually collected in September!',
      'Fix: Add `unit_price_at_purchase` to `OrderLines` and copy `250,000` into `OrderLines` at the moment the order is placed.',
    ],
    appliedMisconception: 'Computing historical revenue from `Products.current_price`.',
  },
  {
    code: 'BUSINESS_RULES_CARDINALITY',
    topic: 'Translating Business Policies into Cardinality Constraints',
    objective: 'Map organizational policies directly to minimum and maximum cardinalities',
    conceptFocusEn: 'Show how changing a single university policy changes the database model: Policy A says "A student may take at most one internship during their degree" vs Policy B says "A student may take multiple internships across different semesters."',
    conceptFocusVi: 'Hãy chỉ ra việc thay đổi một quy chế của trường làm thay đổi mô hình dữ liệu như thế nào: Quy chế A quy định "Mỗi sinh viên chỉ thực tập tối đa 1 lần trong toàn khóa" so với Quy chế B "Sinh viên được phép thực tập nhiều đợt ở các học kỳ khác nhau".',
    contradictionEn: 'In our Oral Exam Studio, the rule states: "Each student has at most one official attempt in an exam, while retakes must be recorded as separate attempts with a reason rather than overwriting the first attempt." How does that rule forbid making `(exam_id, student_id)` the sole primary key of `Attempts`?',
    contradictionVi: 'Trong ứng dụng Oral Exam Studio, quy tắc đặt ra là: "Mỗi sinh viên có tối đa một lượt thi chính thức trong một đợt thi, nhưng nếu thi lại phải tạo lượt riêng có lý do chứ không ghi đè lượt cũ." Quy tắc này giải thích vì sao KHÔNG ĐƯỢC đặt `(exam_id, student_id)` làm khóa chính duy nhất của bảng `Attempts`?',
    misconception: 'Hardcoding a 1:1 constraint (`UNIQUE(exam_id, student_id)`) when the business requires preserving historical retakes as separate rows.',
    followUp: 'How can you enforce "at most one non-retake attempt per student per exam" while still allowing retake rows?',
    appliedTitle: 'Evaluating Schema Against Retake Business Rule',
    appliedTable: `Proposed Table Design:
CREATE TABLE Attempts (
  exam_id TEXT,
  student_id TEXT,
  score REAL,
  PRIMARY KEY (exam_id, student_id)
);`,
    appliedQuestionEn: 'Student `00231009` took Exam `EX_MID` and scored `4.0`. Due to a verified microphone failure, the department approves a retake (`attempt_number = 2`) while requiring the `4.0` attempt to remain in history. Why does the `CREATE TABLE` above block this requirement, and how do you redesign the key?',
    appliedQuestionVi: 'Sinh viên `00231009` đã thi đợt `EX_MID` được `4.0` điểm. Do sự cố kỹ thuật có xác nhận, bộ môn cho phép thi lại lần 2 nhưng yêu cầu giữ nguyên lịch sử lượt thi 1 (`4.0` điểm). Tại sao lệnh `CREATE TABLE` ở trên lại chặn yêu cầu này, và bạn thiết kế lại khóa chính thế nào?',
    appliedAnswerPoints: [
      '`PRIMARY KEY (exam_id, student_id)` allows only ONE row per `(exam_id, student_id)`, forcing the instructor to either fail on `INSERT` or overwrite the `4.0` row.',
      'Fix: Use a surrogate primary key `attempt_id` (or composite key `(exam_id, student_id, attempt_number)`) and store `is_retake` + `retake_reason`.',
    ],
    appliedMisconception: 'Overwriting the original attempt row and losing the audit trail of the first attempt.',
  },
  {
    code: 'ORDER_HEADER_VS_LINE_GRAIN',
    topic: 'Separating Header Entity (Orders) from Detail Entity (OrderLines)',
    objective: 'Explain why multi-item transactions require a two-table Header-Detail pattern',
    conceptFocusEn: 'Why does almost every retail and e-commerce database split a customer purchase into two tables—`Orders` (Order Header) and `OrderLines` (Order Details)—instead of using a single `Sales` table?',
    conceptFocusVi: 'Tại sao hầu hết mọi CSDL bán lẻ và thương mại điện tử đều tách một giao dịch mua hàng thành 2 bảng — `Orders` (Thông tin chung đơn hàng) và `OrderLines` (Chi tiết dòng hàng) — thay vì gộp chung vào một bảng `Sales` duy nhất?',
    contradictionEn: 'Which attributes belong in the `Orders` header table (`order_date`, `customer_id`, `payment_method`, `cashier_id`) versus which attributes belong in `OrderLines` (`product_id`, `quantity`, `unit_price_at_purchase`)? Why?',
    contradictionVi: 'Những thuộc tính nào thuộc về bảng đầu đơn `Orders` (`order_date`, `customer_id`, `payment_method`, `cashier_id`) và những thuộc tính nào thuộc về bảng dòng hàng `OrderLines` (`product_id`, `quantity`, `unit_price_at_purchase`)? Giải thích tại sao.',
    misconception: 'Putting `product_id` and `quantity` inside the `Orders` table (which restricts every customer to buying only 1 product per receipt!).',
    followUp: 'If a customer buys 4 different textbooks in one checkout, how many rows are created in `Orders` and how many in `OrderLines`?',
    appliedTitle: 'Diagnosing Single-Table Order Design Flaw',
    appliedTable: `Single-Table "Orders_Flat":
order_id | order_date | customer_id | cashier_id | product_id | qty | unit_price
---------+------------+-------------+------------+------------+-----+-----------
ORD_100  | 2026-10-12 | CUST_01     | STAFF_09   | P_NOTEBOOK |  2  |   25,000
ORD_100  | 2026-10-12 | CUST_01     | STAFF_09   | P_PEN_BLUE |  3  |   10,000
ORD_100  | 2026-10-12 | CUST_01     | STAFF_09   | P_RULER    |  1  |   15,000`,
    appliedQuestionEn: 'Look at `ORD_100` in `Orders_Flat` above. State two concrete problems with this single-table design (one regarding redundancy/anomalies and one regarding counting how many orders `CUST_01` placed), and show the row counts after splitting into `Orders` and `OrderLines`.',
    appliedQuestionVi: 'Quan sát đơn `ORD_100` trong bảng gộp `Orders_Flat` ở trên. Hãy nêu 2 vấn đề cụ thể của thiết kế 1 bảng này (một về dư thừa dữ liệu và một về việc đếm số đơn hàng của `CUST_01`), đồng thời cho biết số dòng ở mỗi bảng sau khi tách thành `Orders` và `OrderLines`.',
    appliedAnswerPoints: [
      'Problem 1: Header attributes (`order_date`, `customer_id`, `cashier_id`) are repeated on all 3 rows.',
      'Problem 2: Naive `COUNT(*)` on `Orders_Flat` counts `3` (line items) instead of `1` order!',
      'After splitting: `Orders` has `1` row (`ORD_100`), and `OrderLines` has `3` rows.',
    ],
    appliedMisconception: 'Saying `Orders` has 3 rows after splitting.',
  },
  {
    code: 'STATUS_LIFECYCLE_MODELING',
    topic: 'Modeling State Transitions and Timestamps',
    objective: 'Design schemas that track lifecycle states and transition timestamps',
    conceptFocusEn: 'In our Oral Exam Studio, an attempt moves through states: `NOT_STARTED -> IN_PROGRESS -> PENDING_FINALIZE -> COMPLETED` (or `ABSENT` / `DEFERRED`). Why is storing clear state enums plus `started_at` and `completed_at` timestamps much better than a single boolean column `is_done`?',
    conceptFocusVi: 'Trong ứng dụng Oral Exam Studio, một lượt thi đi qua các trạng thái: `Chưa thi -> Đang thi -> Chờ hoàn tất -> Hoàn tất` (hoặc `Vắng` / `Hoãn`). Tại sao việc lưu trạng thái tường minh kèm mốc `started_at`, `completed_at` tốt hơn nhiều so với chỉ dùng một cột boolean `is_done` (Đúng/Sai)?',
    contradictionEn: 'If a coffee shop delivery order only has `is_completed BOOLEAN`, why can customer service not distinguish between an order that is currently being brewed, an order out with the rider, and an order that was cancelled?',
    contradictionVi: 'Nếu đơn giao đồ uống của quán cà phê chỉ có duy nhất một cột `is_completed BOOLEAN` (0 hoặc 1), tại sao nhân viên chăm sóc khách hàng không thể phân biệt được đơn đang pha chế, đơn đang trên đường giao và đơn đã bị hủy?',
    misconception: 'Using a single boolean `is_finished` column to model multi-stage business workflows.',
    followUp: 'What invariant should hold between `status = "COMPLETED"` and the `completed_at` column?',
    appliedTitle: 'Auditing Boolean Flag Ambiguity in Exam Attempts',
    appliedTable: `student_id | is_completed | total_score
-----------+--------------+------------
00231001   |      0       |    NULL
00231002   |      0       |    NULL
00231003   |      0       |    NULL`,
    appliedQuestionEn: 'In the naive table above, Student `00231001` has not been called yet, `00231002` is currently answering Question 1 in the room, and `00231003` was absent with medical leave. Why does `is_completed = 0` fail the instructor, and what status values are required?',
    appliedQuestionVi: 'Trong bảng thiết kế sơ sài ở trên, Sinh viên `00231001` chưa tới lượt gọi, `00231002` đang ngồi trả lời Câu 1 trong phòng thi, còn `00231003` vắng có phép. Tại sao cột `is_completed = 0` không đáp ứng được nhu cầu quản lý phòng thi, và cần những giá trị trạng thái nào?',
    appliedAnswerPoints: [
      '`is_completed = 0` collapses four completely different operational realities (`NOT_STARTED`, `IN_PROGRESS`, `PENDING_FINALIZE`, `ABSENT`, `DEFERRED`) into a single `0`.',
      'The instructor cannot filter who to call next vs who is absent vs who has an unfinished draft session.',
      'Requires an explicit `status` enum column plus `status_reason` for Absent/Deferred.',
    ],
    appliedMisconception: 'Assuming `total_score IS NULL` is enough to distinguish "Not Started" from "Absent" or "In Progress".',
  },
  {
    code: 'TIME_VARIANT_ATTRIBUTES',
    topic: 'Modeling Time-Variant Data (Slowly Changing Attributes)',
    objective: 'Decide when attribute changes require historical effective-date tracking',
    conceptFocusEn: 'Suppose a student transfers from major `"Marketing"` to `"Business Analytics"` in Semester 3. Under what reporting requirement is overwriting `Students.major` acceptable, and under what requirement do you need a `StudentMajorHistory(student_id, major, effective_from, effective_to)` table?',
    conceptFocusVi: 'Giả sử một sinh viên chuyển ngành từ `"Marketing"` sang `"Phân tích kinh doanh"` ở Học kỳ 3. Trong nhu cầu báo cáo nào thì việc ghi đè cột `Students.major` là chấp nhận được, và trong yêu cầu nào thì bắt buộc phải có bảng lịch sử `StudentMajorHistory(student_id, major, effective_from, effective_to)`?',
    contradictionEn: 'At CampusMart, if an employee is promoted from Cashier to Shift Supervisor in October, why does overwriting their `hourly_wage` in the `Employees` table break September payroll recalculations if payroll reads directly from `Employees.hourly_wage`?',
    contradictionVi: 'Tại CampusMart, nếu một nhân viên được thăng chức từ Thu ngân lên Giám sát ca vào tháng 10, tại sao việc ghi đè cột `hourly_wage` (lương theo giờ) trong bảng `Employees` lại làm lệch bảng tính lương tháng 9 nếu công thức lương đọc trực tiếp từ `Employees.hourly_wage`?',
    misconception: 'Overwriting mutable attributes in place without asking stakeholders whether historical point-in-time reporting is required.',
    followUp: 'What two ways can you preserve September’s hourly wage accuracy?',
    appliedTitle: 'Payroll Discrepancy After Promotion Overwrite',
    appliedTable: `Employees (Current):               WorkShifts (September):
emp_id | role       | hourly_wage   shift_id | emp_id | hours_worked
-------+------------+------------   ---------+--------+-------------
E01    | Supervisor |   50,000      SH_901   | E01    |      80
(Note: In September E01 was a Cashier earning 30,000 VND/hr; promoted Oct 1 to 50,000 VND/hr)`,
    appliedQuestionEn: 'Calculate what E01 actually earned for 80 hours in September (`30,000/hr`) versus what a query `SELECT hours_worked * hourly_wage FROM WorkShifts JOIN Employees USING(emp_id)` outputs on October 5. How do you fix the data model?',
    appliedQuestionVi: 'Hãy tính mức lương thực tế của E01 cho 80 giờ làm việc trong tháng 9 (lúc đơn giá là `30.000đ/giờ`) so với kết quả của câu truy vấn nối bảng `WorkShifts JOIN Employees` chạy vào ngày 05/10. Bạn sửa mô hình dữ liệu như thế nào?',
    appliedAnswerPoints: [
      'True September pay = `80 * 30,000 = 2,400,000 VND`.',
      'Querying on Oct 5 uses the overwritten `50,000 VND/hr` rate and outputs `80 * 50,000 = 4,000,000 VND` (overstating September payroll by `1,600,000 VND`!).',
      'Fix: Snapshot `hourly_wage_at_shift` on `WorkShifts` (or maintain `EmployeeWageHistory` with effective dates).',
    ],
    appliedMisconception: 'Joining historical work shifts to a mutable current-wage column without effective dates or shift snapshots.',
  },
  {
    code: 'GRANULARITY_REQUIREMENT_DESIGN',
    topic: 'Choosing the Right Table Grain During Requirements Gathering',
    objective: 'Define the exact business meaning of a single row ("what does one row represent?")',
    conceptFocusEn: 'Before creating any table, a database designer must state its "grain" in one sentence: "One row in this table represents exactly one ____." Why does failing to declare the grain lead to mixed-grain tables?',
    conceptFocusVi: 'Trước khi tạo bất kỳ bảng nào, người thiết kế CSDL phải phát biểu rõ "độ mịn" (grain) của bảng trong một câu: "Mỗi dòng trong bảng này đại diện cho đúng một ____." Tại sao không xác định rõ độ mịn ngay từ đầu lại dẫn đến bảng bị trộn lẫn nhiều cấp độ dữ liệu?',
    contradictionEn: 'State the exact grain of (1) `Orders`, (2) `OrderLines`, and (3) `Products` at CampusMart.',
    contradictionVi: 'Hãy phát biểu chính xác mỗi dòng (grain) đại diện cho cái gì trong 3 bảng: (1) `Orders`, (2) `OrderLines`, và (3) `Products` tại CampusMart.',
    misconception: 'Adding columns to a table without checking whether they match the grain of a single row in that table.',
    followUp: 'In our Oral Exam Studio, what does one row in `Attempts` represent versus one row in `QuestionAssignments`?',
    appliedTitle: 'Spotting Mixed-Grain Columns in an Internship Table',
    appliedTable: `Proposed Table: Company_Internships
company_id | company_name | total_company_employees | student_id | student_gpa | evaluation_score`,
    appliedQuestionEn: 'Look at `Company_Internships` above. Identify the two different grains mixed inside this single table and split the columns cleanly into their proper tables.',
    appliedQuestionVi: 'Quan sát bảng `Company_Internships` ở trên. Hãy chỉ ra 2 cấp độ dữ liệu (grains) khác nhau đang bị trộn lẫn trong bảng này và tách các cột về đúng bảng của chúng.',
    appliedAnswerPoints: [
      'Mixed grains: Company-level grain (`company_id, company_name, total_company_employees`), Student-level grain (`student_id, student_gpa`), and Placement-level grain (`evaluation_score` for a specific student at a company).',
      'Split into: `Companies(company_id, company_name, total_company_employees)`, `Students(student_id, student_gpa)`, and `Placements(placement_id, student_id, company_id, evaluation_score)`.',
    ],
    appliedMisconception: 'Keeping `total_company_employees` repeated on every student placement row.',
  },
  {
    code: 'COMPOSITE_VS_ATOMIC_ATTRIBUTES',
    topic: 'Composite vs. Atomic Attributes Determined by Query Requirements',
    objective: 'Decide when an attribute like Address or Name should be decomposed into sub-parts',
    conceptFocusEn: 'Whether an attribute is "atomic enough" depends on business requirements. Give a CampusMart scenario where storing `delivery_address` as a single text column is fine, and a second scenario where it MUST be split into `building_code`, `room_number`, and `campus_zone`.',
    conceptFocusVi: 'Một thuộc tính đã "đủ nguyên tử" hay chưa phụ thuộc vào yêu cầu nghiệp vụ. Hãy nêu một tình huống tại CampusMart mà lưu `delivery_address` thành 1 cột văn bản là đủ, và một tình huống bắt buộc phải tách thành `building_code`, `room_number`, `campus_zone`.',
    contradictionEn: 'If the university registrar needs to sort student rosters alphabetically by Vietnamese given name (`Tên`) rather than family name (`Họ`), why does storing only a single `full_name` string cause sorting headaches?',
    contradictionVi: 'Nếu Phòng Đào tạo cần sắp xếp danh sách phòng thi theo chữ cái của `Tên` tiếng Việt (ví dụ: An, Bình, Chi) thay vì `Họ`, tại sao chỉ lưu một cột `full_name` gộp chung lại gây khó khăn khi sắp xếp bằng SQL?',
    misconception: 'Thinking atomicity is an absolute physical law independent of how the business queries, sorts, or groups the data.',
    followUp: 'If delivery riders group orders by `campus_zone` (East Dorm vs West Academic Block), why must `campus_zone` be its own column?',
    appliedTitle: 'Dorm Delivery Routing with Unsplit Address Text',
    appliedTable: `order_id | raw_delivery_address
---------+-------------------------------------
ORD_01   | Room 302, Building B2, East Dorm
ORD_02   | B2 - P.405 (East Dormitory)
ORD_03   | East Dorm Bldg B2, Rm 101`,
    appliedQuestionEn: 'A CampusMart rider wants to pick up all orders going to `Building B2` in one trip using `GROUP BY building_code`. Why do the 3 rows above fail to group together, and what schema change solves this?',
    appliedQuestionVi: 'Nhân viên giao hàng của CampusMart muốn gom tất cả các đơn giao tới tòa nhà `B2` trong một chuyến bằng `GROUP BY building_code`. Tại sao 3 dòng trên không thể gom nhóm cùng nhau, và cần thay đổi lược đồ như thế nào?',
    appliedAnswerPoints: [
      'Because `raw_delivery_address` is a composite free-text field, `"Building B2"`, `"B2"`, and `"Bldg B2"` appear at different positions with different spellings.',
      'Decompose into structured columns: `campus_zone`, `building_code` (standardized e.g. `"B2"`), and `room_number`.',
    ],
    appliedMisconception: 'Trying to parse free-text addresses with complex `SUBSTR` logic instead of capturing structured `building_code` at checkout.',
  },
  {
    code: 'DERIVED_VS_STORED_DECISION',
    topic: 'Modeling Derived Attributes vs. Stored Base Facts',
    objective: 'Distinguish base attributes from calculated values in data models',
    conceptFocusEn: 'In an ERD and relational schema, why do we store `birth_date` instead of `current_age`, and `quantity`, `unit_price` instead of only `line_total`? Under what specific condition do we also store a snapshot of a calculation?',
    conceptFocusVi: 'Trong sơ đồ ERD và lược đồ quan hệ, tại sao chúng ta lưu `birth_date` thay vì `current_age`, và lưu `quantity`, `unit_price` thay vì chỉ lưu `line_total`? Trong điều kiện cụ thể nào chúng ta mới lưu thêm kết quả tính toán dạng snapshot?',
    contradictionEn: 'In our Oral Exam Studio, `q1_grade` has 3 criterion scores (`0–2`, `0–2`, `0–1`). Why should `total_score` be computed deterministically as the sum of the criterion scores rather than allowing a user to type `q1_score = 4.0` while the criteria sum to `2.5`?',
    contradictionVi: 'Trong ứng dụng Oral Exam Studio, điểm Câu 1 gồm 3 tiêu chí (`0–2`, `0–2`, `0–1`). Tại sao tổng điểm Câu 1 phải được tính tự động từ tổng 3 tiêu chí thay vì cho phép gõ tay một con số rời rạc mâu thuẫn với điểm thành phần?',
    misconception: 'Allowing independent manual edits to both base components and their derived sum without enforcing equality.',
    followUp: 'If any of the 3 rubric criteria is still `NULL`, what must the derived `total_score` be?',
    appliedTitle: 'Detecting Criterion-vs-Total Contradiction in Exam Grade',
    appliedTable: `attempt_id | crit_accuracy (0-2) | crit_reasoning (0-2) | crit_example (0-1) | stored_q1_total
-----------+---------------------+----------------------+--------------------+----------------
ATT_101    |         1.50        |         1.50         |        0.50        |      3.50
ATT_102    |         2.00        |         1.00         |        NULL        |      3.00`,
    appliedQuestionEn: 'Inspect `ATT_101` and `ATT_102` above. Explain why `ATT_101` is valid while `ATT_102` violates the grading data model rules of HSB3102E Oral Exam Studio.',
    appliedQuestionVi: 'Quan sát 2 bản ghi `ATT_101` và `ATT_102` ở trên. Hãy giải thích vì sao `ATT_101` hợp lệ còn `ATT_102` vi phạm quy tắc mô hình chấm điểm của HSB3102E Oral Exam Studio.',
    appliedAnswerPoints: [
      'In `ATT_101`, all 3 criteria are non-null and sum to `1.50 + 1.50 + 0.50 = 3.50`.',
      'In `ATT_102`, `crit_example` is `NULL` (not yet graded!), so the question is incomplete; storing `stored_q1_total = 3.00` wrongly treats the ungraded criterion as `0` and allows premature finalization.',
      'When any criterion is `NULL`, `q1_total` must remain `NULL`.',
    ],
    appliedMisconception: 'Treating a `NULL` criterion score as `0` when computing `stored_q1_total`.',
  },
  {
    code: 'SELF_REFERENCING_HIERARCHY',
    topic: 'Modeling Hierarchies and Self-Referencing Entities',
    objective: 'Represent organizational or category hierarchies using a unary foreign key',
    conceptFocusEn: 'At CampusMart, shift supervisors are also employees stored in the `Employees` table, and each cashier reports to a shift supervisor. How do you model this reporting hierarchy using only the `Employees` table?',
    conceptFocusVi: 'Tại CampusMart, giám sát ca cũng là nhân viên được lưu trong bảng `Employees`, và mỗi thu ngân báo cáo trực tiếp cho một giám sát ca. Làm thế nào để mô hình hóa cấu trúc cấp bậc này chỉ ngay trong bảng `Employees`?',
    contradictionEn: 'In a product catalog, `"Stationery"` is a top-level category, and `"Gel Pens"` and `"Notebooks"` are subcategories under `"Stationery"`. Why is `Categories(category_id, name, parent_category_id)` more flexible than creating separate tables `Level1_Cat`, `Level2_Cat`, `Level3_Cat`?',
    contradictionVi: 'Trong danh mục hàng hóa, `"Văn phòng phẩm"` là nhóm cha, còn `"Bút gel"` và `"Sổ tay"` là nhóm con trực thuộc. Tại sao thiết kế tự tham chiếu `Categories(category_id, name, parent_category_id)` linh hoạt hơn việc tạo các bảng cố định `Level1_Cat`, `Level2_Cat`, `Level3_Cat`?',
    misconception: 'Thinking a Foreign Key can only reference a different table and can never reference the Primary Key of the same table.',
    followUp: 'What value does `parent_category_id` (or `manager_id`) have for a top-level root category (or the store director)?',
    appliedTitle: 'Tracing Self-Referencing Employee Table',
    appliedTable: `emp_id | full_name   | role          | supervisor_id
-------+-------------+---------------+--------------
E01    | Tran Lan    | Store Manager | NULL
E02    | Le Minh     | Shift Lead    | E01
E03    | Nguyen An   | Cashier       | E02
E04    | Pham Hoa    | Cashier       | E02`,
    appliedQuestionEn: 'Using the `Employees` table above, identify who `Nguyen An (E03)` reports to directly, who sits at the top of the hierarchy (and how the database represents that), and what foreign key constraint links `supervisor_id`.',
    appliedQuestionVi: 'Dựa vào bảng `Employees` ở trên, hãy cho biết `Nguyen An (E03)` báo cáo trực tiếp cho ai, ai là người đứng đầu chuỗi phân cấp (CSDL biểu diễn điều đó thế nào), và khóa ngoại trên cột `supervisor_id` tham chiếu tới đâu.',
    appliedAnswerPoints: [
      '`Nguyen An (E03)` has `supervisor_id = E02`, so he reports directly to `Le Minh (Shift Lead)`.',
      '`Tran Lan (E01)` is at the top of the hierarchy, represented by `supervisor_id IS NULL`.',
      '`supervisor_id` is a unary/self-referencing Foreign Key referencing `Employees(emp_id)`.',
    ],
    appliedMisconception: 'Storing `"NONE"` as a string in `supervisor_id` (which would violate the Foreign Key to `emp_id`!) instead of `NULL`.',
  },
  {
    code: 'POLYMORPHIC_BUYER_MODELING',
    topic: 'Modeling Different Customer Types (Individual Students vs. Campus Clubs)',
    objective: 'Model shared and type-specific attributes cleanly without sparse confusion',
    conceptFocusEn: 'CampusMart sells to both individual students (who have `student_id`, `major`) and official university clubs/departments (which have `budget_code`, `faculty_advisor`). Explain the modeling trade-off between a single `Customers` table with `customer_type` versus subtype tables.',
    conceptFocusVi: 'CampusMart bán hàng cho cả cá nhân sinh viên (có `student_id`, `major`) lẫn các Câu lạc bộ/Phòng ban của trường (có `budget_code`, `faculty_advisor`). Hãy giải thích sự đánh đổi khi thiết kế một bảng `Customers` duy nhất kèm `customer_type` so với việc tách bảng con chuyên biệt.',
    contradictionEn: 'Why is creating two completely disconnected tables (`Student_Orders` and `Club_Orders`) a bad idea when the finance team needs to query total daily store revenue across all buyers?',
    contradictionVi: 'Tại sao việc tách hẳn thành 2 bảng đơn hàng rời rạc (`Student_Orders` và `Club_Orders`) lại gây bất lợi khi bộ phận tài chính cần tổng hợp doanh thu hằng ngày của toàn cửa hàng?',
    misconception: 'Duplicating the entire `Orders` and `OrderLines` tables for every new customer segment.',
    followUp: 'How does keeping a unified `Customers(customer_id, customer_type, ...)` supertype simplify the Foreign Key in `Orders`?',
    appliedTitle: 'Unified `Orders` Reference to Supertype `Customers`',
    appliedTable: `Customers (Supertype):
customer_id | customer_type | display_name         | tax_or_student_code
------------+---------------+----------------------+--------------------
CUST_01     | STUDENT       | Le Hoang Nam         | 00231088
CUST_02     | CAMPUS_CLUB   | AI & Robotics Club   | CLUB-BUDGET-2026`,
    appliedQuestionEn: 'Explain how the unified `Customers` table above allows `Orders(order_id, customer_id, order_date)` to enforce a single strict Foreign Key (`customer_id -> Customers.customer_id`) while still supporting segment-by-segment reporting.',
    appliedQuestionVi: 'Hãy giải thích cách bảng `Customers` hợp nhất ở trên giúp bảng `Orders(order_id, customer_id, order_date)` chỉ cần duy trì một Khóa ngoại chặt chẽ duy nhất (`customer_id -> Customers.customer_id`) mà vẫn thống kê được doanh thu theo từng phân khúc khách hàng.',
    appliedAnswerPoints: [
      'Every buyer—whether an individual student or a campus club—gets a unique `customer_id` in `Customers`.',
      '`Orders.customer_id` points to a single table (`Customers`), avoiding nullable dual foreign keys (`student_id`, `club_id`).',
      'Analysts can easily run `GROUP BY c.customer_type` to compare Student vs Campus Club revenue.',
    ],
    appliedMisconception: 'Creating separate `Orders` tables for each buyer type.',
  },
  {
    code: 'SURROGATE_VS_NATURAL_REQ',
    topic: 'Identifying Mutable Natural Attributes vs. Stable Identifiers',
    objective: 'Avoid choosing mutable business attributes (like email or room number) as primary identifiers',
    conceptFocusEn: 'Why is using a student’s `email` or `phone_number` as the primary key referenced by 10 other tables dangerous when the student changes their phone number or switches email providers?',
    conceptFocusVi: 'Tại sao việc chọn `email` hoặc `phone_number` của sinh viên làm khóa chính để 10 bảng khác tham chiếu tới lại gây rủi ro khi sinh viên đổi số điện thoại hoặc đổi địa chỉ email?',
    contradictionEn: 'A campus coffee shop uses `drink_name` (e.g., `"Iced Caramel Macchiato"`) as the Primary Key of `Drinks` and Foreign Key in `OrderLines`. What happens when the owner rebrands the drink to `"Salted Caramel Iced Latte"`?',
    contradictionVi: 'Một quán cà phê dùng tên đồ uống `drink_name` (ví dụ: `"Iced Caramel Macchiato"`) làm Khóa chính của bảng `Drinks` và làm Khóa ngoại trong `OrderLines`. Chuyện gì xảy ra khi chủ quán đổi tên món đó thành `"Salted Caramel Iced Latte"`?',
    misconception: 'Assuming human-readable display names (`product_name`, `company_name`) never change over the lifetime of a business.',
    followUp: 'Even if we use an immutable `product_id` (`P01`) as Primary Key, should we still put a `UNIQUE` constraint on `sku_barcode`?',
    appliedTitle: 'Evaluating Candidate Primary Keys for Partner Companies',
    appliedTable: `Candidate Columns in Partner_Companies:
1. company_display_name  (e.g., "TechViet Solutions" -> rebrands to "TechViet AI")
2. hr_contact_email      (e.g., "lan.hr@techviet.vn" -> HR staff changes)
3. company_id            (e.g., "COMP_0042" — immutable system ID)
4. national_tax_code     (e.g., "0108992341" — unique legal identifier)`,
    appliedQuestionEn: 'Evaluate the 4 columns above. Why are (1) and (2) poor choices for Primary Key, and how should (3) and (4) be configured together in the `Partner_Companies` table?',
    appliedQuestionVi: 'Hãy đánh giá 4 cột ở trên. Tại sao cột (1) và (2) là lựa chọn tồi để làm Khóa chính, và nên kết hợp cột (3) cùng cột (4) như thế nào trong bảng `Partner_Companies`?',
    appliedAnswerPoints: [
      '(1) `company_display_name` changes during rebranding; (2) `hr_contact_email` changes whenever HR staff turns over.',
      'Configure (3) `company_id` as the immutable `PRIMARY KEY` used by foreign keys (`Internships.company_id`), and place a `UNIQUE NOT NULL` constraint on (4) `national_tax_code` to prevent duplicate company registrations.',
    ],
    appliedMisconception: 'Using `hr_contact_email` as the primary identifier of a company.',
  },
  {
    code: 'DEFAULT_VALUES_AND_NULLABILITY',
    topic: 'Designing Safe Default Values vs. Explicit User Input',
    objective: 'Decide when a database `DEFAULT` is helpful vs when it masks missing input',
    conceptFocusEn: 'Explain why setting `DEFAULT CURRENT_TIMESTAMP` on `created_at` or `DEFAULT "DRAFT"` on `review_status` is good database design, whereas setting `DEFAULT 0` on `exam_score` is a dangerous anti-pattern.',
    conceptFocusVi: 'Hãy giải thích vì sao việc đặt `DEFAULT CURRENT_TIMESTAMP` cho cột `created_at` hoặc `DEFAULT "DRAFT"` cho cột `review_status` là thiết kế CSDL tốt, trong khi đặt `DEFAULT 0` cho cột điểm thi `exam_score` lại là một thiết kế sai lầm nguy hiểm.',
    contradictionEn: 'In our Oral Exam Studio, why must newly generated AI questions default to `review_status = "DRAFT"` rather than `DEFAULT "APPROVED"`?',
    contradictionVi: 'Trong hệ thống Oral Exam Studio, tại sao các câu hỏi mới tạo hoặc mới nhập từ bên ngoài bắt buộc phải có mặc định `review_status = "DRAFT"` thay vì `DEFAULT "APPROVED"`?',
    misconception: 'Adding `DEFAULT 0` or `DEFAULT "APPROVED"` to every column just to avoid handling `NULL` or review steps.',
    followUp: 'What is the "fail-safe default" principle when designing status columns for exam questions or financial approvals?',
    appliedTitle: 'Auditing Dangerous Column Defaults in Schema DDL',
    appliedTable: `CREATE TABLE Exam_Grades (
  attempt_id TEXT PRIMARY KEY,
  q1_score REAL DEFAULT 0.0,
  q2_score REAL DEFAULT 0.0,
  review_approved INTEGER DEFAULT 1
);`,
    appliedQuestionEn: 'Identify two critical flaws in the `DEFAULT` clauses of `Exam_Grades` above when an attempt row is first created at the start of an oral exam.',
    appliedQuestionVi: 'Hãy chỉ ra 2 lỗi nghiêm trọng trong các mệnh đề `DEFAULT` của bảng `Exam_Grades` ở trên khi một dòng lượt thi vừa mới được khởi tạo lúc bắt đầu gọi sinh viên.',
    appliedAnswerPoints: [
      'Flaw 1: `q1_score DEFAULT 0.0` and `q2_score DEFAULT 0.0` immediately assign zero points to an ungraded student instead of `NULL`, allowing the attempt to look "already graded with 0/10".',
      'Flaw 2: `review_approved DEFAULT 1` marks the grade as approved before the instructor has even listened to the student!',
      'Correct defaults: `q1_score REAL DEFAULT NULL`, `q2_score REAL DEFAULT NULL`, `review_approved INTEGER DEFAULT 0`.',
    ],
    appliedMisconception: 'Thinking `DEFAULT 0.0` is harmless because "the teacher will probably overwrite it later".',
  },
  {
    code: 'SCOPE_CREEP_OVERMODELING',
    topic: 'Aligning Data Model Scope with Actual Business Requirements',
    objective: 'Avoid both under-modeling critical rules and over-engineering unneeded complexity',
    conceptFocusEn: 'Why should a database model for a single-campus store (CampusMart) be grounded in its actual operational requirements rather than copying a 200-table international customs & multi-tariff shipping schema?',
    conceptFocusVi: 'Tại sao mô hình dữ liệu cho cửa hàng nội khu CampusMart cần bám sát yêu cầu nghiệp vụ thực tế thay vì sao chép nguyên xi lược đồ 200 bảng về thuế hải quan quốc tế của một tập đoàn đa quốc gia?',
    contradictionEn: 'Conversely, in our HSB3102E Oral Exam Studio, why must the `Exams` table allow selecting which specific lectures (e.g. `01` to `05`) are included in each midterm exam rather than hardcoding that every exam always draws from all 8 lectures?',
    contradictionVi: 'Ngược lại, trong ứng dụng HSB3102E Oral Exam Studio, tại sao bảng cấu hình đợt thi `Exams` bắt buộc phải cho phép giảng viên chọn phạm vi các bài học đã dạy (ví dụ: Bài 01 đến Bài 05) cho từng đợt thi thay vì gán cứng rằng thi giữa kỳ lúc nào cũng bốc cả 8 bài?',
    misconception: 'Hardcoding business scope assumptions (like "midterm always covers all 8 chapters") instead of making scope a configurable data attribute.',
    followUp: 'What happens if the midterm takes place in Week 6 when only Lectures 01–05 have been taught, and the app hardcoded all 8 lectures?',
    appliedTitle: 'Designing Configurable Lecture Scope for Midterm Exam',
    appliedTable: `Exam_Config Row:
exam_id  | title              | selected_lectures       | include_integrated
---------+--------------------+-------------------------+-------------------
EX_MID01 | Giữa kỳ K68 - Ca 1 | ["01","02","03","04"]   | false`,
    appliedQuestionEn: 'Based on the `Exam_Config` row above, if the Question Bank contains 500 questions across Lectures `01`–`08` plus `INTEGRATED`, which questions are eligible to be drawn for `EX_MID01` and why is this configuration essential?',
    appliedQuestionVi: 'Dựa vào cấu hình `Exam_Config` ở trên, nếu Ngân hàng có 500 câu trải đều từ Bài `01`–`08` và câu `INTEGRATED` (Tích hợp), những câu hỏi nào mới đủ điều kiện tham gia rút đề cho đợt `EX_MID01` và tại sao cấu hình này lại thiết yếu?',
    appliedAnswerPoints: [
      'Only `APPROVED` (non-archived) questions whose `lecture_ids` belong strictly to `["01", "02", "03", "04"]` are eligible; Lectures `05`–`08` and `INTEGRATED` questions are excluded.',
      'This prevents unfair testing of untaught material (Lectures 05–08) while still letting the full 8-lecture bank live in the same database.',
    ],
    appliedMisconception: 'Deleting Lectures 05–08 from the database just to run a Week 5 midterm exam.',
  },
];

// ============================================================================
// LECTURE 04: Relational Model, ERDs and Relationships (15 specs = 30 questions)
// ============================================================================
const LECTURE_04_SPECS: CompactTopicSpec[] = [
  {
    code: 'ONE_TO_MANY_FK_PLACEMENT',
    topic: 'Foreign Key Placement in 1:N (One-to-Many) Relationships',
    objective: 'Place the foreign key on the correct side of a 1:N relationship without creating repeating columns',
    conceptFocusEn: 'State the fundamental rule for placing a Foreign Key in a 1:N (One-to-Many) relationship (for example, `1 Class` has `N Students`, or `1 Customer` places `N Orders`). Why does placing the Foreign Key on the "1" side fail?',
    conceptFocusVi: 'Hãy nêu quy tắc cốt lõi khi đặt Khóa ngoại (Foreign Key) trong mối quan hệ 1:N (Một-Nhiều, ví dụ: `1 Lớp` có `N Sinh viên`, hoặc `1 Khách hàng` đặt `N Đơn hàng`). Tại sao nếu đặt Khóa ngoại ở phía "1" thì thiết kế sẽ thất bại?',
    contradictionEn: 'A student puts `order_id` inside the `Customers` table to link customers and orders. Explain what happens the second time the same customer buys something at CampusMart.',
    contradictionVi: 'Một sinh viên đặt cột `order_id` vào bên trong bảng `Customers` để liên kết khách hàng với đơn hàng. Hãy giải thích chuyện gì sẽ xảy ra khi khách hàng đó quay lại CampusMart mua hàng lần thứ hai.',
    misconception: 'Placing the foreign key on the "One" side (`Customers.order_id` or `Classes.student_id`), which either restricts the parent to 1 child or forces multi-valued cells.',
    followUp: 'Can the Foreign Key `customer_id` appear multiple times in the `Orders` table? Why?',
    appliedTitle: 'Fixing Wrong-Side Foreign Key in `Suppliers` and `Products`',
    appliedTable: `Rule: 1 Supplier provides N Products; each Product comes from 1 primary Supplier.

Flawed Design by Student:
Suppliers(supplier_id PK, supplier_name, product_id FK)
Products(product_id PK, product_name, unit_price)`,
    appliedQuestionEn: 'Explain why the student’s `Suppliers` table above breaks as soon as Supplier `SUP_01` supplies 20 different products to CampusMart, and rewrite the two table schemas with the Foreign Key on the correct side.',
    appliedQuestionVi: 'Hãy giải thích vì sao bảng `Suppliers` của sinh viên ở trên bị lỗi ngay khi Nhà cung cấp `SUP_01` cung cấp 20 mặt hàng khác nhau cho CampusMart, và viết lại lược đồ 2 bảng với Khóa ngoại đặt đúng phía.',
    appliedAnswerPoints: [
      'In the flawed design, `supplier_id` is the PK of `Suppliers`, so `SUP_01` can only appear once and can store only one `product_id`!',
      'In a 1:N relationship (`1 Supplier : N Products`), the Foreign Key ALWAYS goes on the "Many" (`N`) side (`Products`).',
      'Corrected schema: `Suppliers(supplier_id PK, supplier_name)` and `Products(product_id PK, product_name, unit_price, supplier_id FK -> Suppliers.supplier_id)`.',
    ],
    appliedMisconception: 'Putting `product_id_1, product_id_2, product_id_3` inside `Suppliers`.',
  },
  {
    code: 'MANY_TO_MANY_ASSOCIATIVE',
    topic: 'Resolving M:N (Many-to-Many) Relationships with Associative Entities',
    objective: 'Transform a conceptual M:N relationship into two 1:N relationships via a junction table',
    conceptFocusEn: 'Why can relational databases not implement a Many-to-Many (`M:N`) relationship directly between two tables (`Orders` and `Products`, or `Students` and `Courses`) using only a single Foreign Key? How do you resolve it?',
    conceptFocusVi: 'Tại sao CSDL quan hệ không thể cài đặt trực tiếp mối quan hệ Nhiều-Nhiều (`M:N`) giữa hai bảng (`Orders` và `Products`, hoặc `Students` và `Courses`) chỉ bằng một Khóa ngoại đơn lẻ? Bạn giải quyết mối quan hệ `M:N` này bằng cách nào?',
    contradictionEn: 'When you create an associative (junction) entity between `Orders` and `Products` (`OrderLines`), why is `OrderLines` more than just two bare foreign keys `(order_id, product_id)`? What relationship-specific attributes live there?',
    contradictionVi: 'Khi tạo thực thể kết hợp (bảng trung gian) giữa `Orders` và `Products` (tức bảng `OrderLines`), tại sao `OrderLines` không chỉ chứa mỗi hai khóa ngoại `(order_id, product_id)`? Những thuộc tính nghiệp vụ nào bắt buộc phải nằm ở bảng trung gian này?',
    misconception: 'Putting `quantity` inside `Products` or inside `Orders` instead of inside the associative entity `OrderLines`.',
    followUp: 'In which direction do the crows-foot ("many") symbols point between `Orders`, `OrderLines`, and `Products`?',
    appliedTitle: 'Resolving M:N Between Coffee Drinks and Ingredients',
    appliedTable: `Business Rules:
- A Coffee Drink (drink_id, drink_name) uses 1 or more Ingredients.
- An Ingredient (ing_id, ing_name, unit) is used in 0 or more Coffee Drinks.
- Each Drink requires a specific amount (amount_needed, e.g., 18g beans + 150ml milk) of each Ingredient.`,
    appliedQuestionEn: 'Design the associative (junction) table that resolves the M:N relationship between `Drinks` and `Ingredients`. State its table name, its Primary Key, its Foreign Keys, and where `amount_needed` must be placed.',
    appliedQuestionVi: 'Hãy thiết kế bảng trung gian (associative table) giải quyết quan hệ M:N giữa `Drinks` (Đồ uống) và `Ingredients` (Nguyên liệu). Nêu rõ tên bảng, Khóa chính, các Khóa ngoại và vị trí đặt thuộc tính `amount_needed` (định lượng nguyên liệu cần cho món đó).',
    appliedAnswerPoints: [
      'Create associative table `RecipeItems` (or `DrinkIngredients`).',
      'Composite Primary Key: `(drink_id, ing_id)`, where `drink_id` is FK -> `Drinks(drink_id)` and `ing_id` is FK -> `Ingredients(ing_id)`.',
      '`amount_needed` MUST be placed in `RecipeItems` because the amount (`150ml` milk for Latte vs `60ml` milk for Macchiato) depends on the specific `(drink_id, ing_id)` pair!',
    ],
    appliedMisconception: 'Placing `amount_needed` in `Ingredients` (which would force every drink to use the exact same amount of milk).',
  },
  {
    code: 'OPTIONAL_VS_MANDATORY_PARTICIPATION',
    topic: 'Optional (`0..*` / `0..1`) vs. Mandatory (`1..*` / `1..1`) Participation',
    objective: 'Translate ERD participation minimums (circle vs bar) into NULL vs NOT NULL foreign keys',
    conceptFocusEn: 'In Crow’s Foot ERD notation, explain the difference between a circle (`0`, optional participation) and a vertical bar (`|`, mandatory participation) on a relationship line. How is optional vs mandatory participation on the parent side enforced on a Foreign Key column in SQL?',
    conceptFocusVi: 'Trong ký hiệu sơ đồ ERD chân chim (Crow’s Foot), hãy giải thích sự khác biệt giữa ký hiệu vòng tròn (`0`, tham gia tùy chọn) và vạch thẳng đứng (`|`, tham gia bắt buộc). Khi chuyển sang bảng SQL, tính tùy chọn hay bắt buộc ở đầu "1" được cài đặt trên cột Khóa ngoại bằng từ khóa gì?',
    contradictionEn: 'At CampusMart, an order can be placed either by a registered member (`customer_id`) or by an anonymous walk-in buyer paying cash. Should `Orders.customer_id` be `NOT NULL` or `NULL`-able? What if it is an online delivery order?',
    contradictionVi: 'Tại CampusMart, một đơn hàng tại quầy có thể do thành viên đã đăng ký (`customer_id`) mua hoặc do khách vãng lai trả tiền mặt không lưu tên. Cột `Orders.customer_id` nên là `NOT NULL` hay cho phép `NULL`? Điều này thay đổi thế nào nếu là đơn đặt giao hàng trực tuyến?',
    misconception: 'Thinking that a Foreign Key column in SQL is always automatically `NOT NULL`.',
    followUp: 'If `Orders.customer_id` is nullable for walk-in buyers, which JOIN type (`INNER JOIN` vs `LEFT JOIN`) must you use when listing all orders with customer names?',
    appliedTitle: 'Reading Minimum and Maximum Cardinalities on an ERD',
    appliedTable: `ERD Notation Snippet:
[Customer] |o------<| [Order] ||------|< [OrderLine]

Legend:
|o = Zero or One (0..1)
|| = Exactly One (1..1)
<| or |< = One or Many (1..*)`,
    appliedQuestionEn: 'Read the Crow’s Foot ERD above and state two business rules it encodes: (1) Can an `Order` exist without a `Customer`? (2) Can an `Order` exist with zero `OrderLine` rows?',
    appliedQuestionVi: 'Đọc sơ đồ ERD chân chim ở trên và trả lời 2 quy tắc nghiệp vụ: (1) Một `Order` (Đơn hàng) có thể tồn tại mà không gắn với `Customer` nào không? (2) Một `Order` có thể tồn tại mà không có dòng `OrderLine` nào không?',
    appliedAnswerPoints: [
      '(1) Yes: the `|o` (`0..1`) next to `Customer` means an `Order` is associated with zero or one `Customer` (`Orders.customer_id` is nullable for walk-in guests).',
      '(2) No: the `|<` (`1..*`) next to `OrderLine` means every `Order` must have at least one `OrderLine` (and each `OrderLine` belongs to `||` = exactly one `Order`).',
    ],
    appliedMisconception: 'Reading the cardinality symbol on the wrong end of the relationship line.',
  },
  {
    code: 'ONE_TO_ONE_RELATIONSHIP_JUSTIFICATION',
    topic: 'When to Use 1:1 Relationships vs. Merging into One Table',
    objective: 'Justify valid architectural reasons for splitting 1:1 entities',
    conceptFocusEn: 'If two entities have a strict `1:1` relationship (e.g., `Student` and `Student_Health_Record`), why don’t we always merge all their columns into a single table? Give two valid reasons to keep them as two separate `1:1` tables.',
    conceptFocusVi: 'Nếu hai thực thể có mối quan hệ `1:1` (ví dụ: `Student` và `Student_Health_Record`), tại sao chúng ta không gộp chung tất cả các cột vào một bảng duy nhất? Hãy nêu 2 lý do hợp lý để tách chúng thành hai bảng `1:1` riêng biệt.',
    contradictionEn: 'In a `1:1` relationship implemented via a Foreign Key (e.g. `Internship_Contract` referencing `Placement(placement_id)`), what SQL constraint must be added to the Foreign Key column so it cannot accidentally become `1:N`?',
    contradictionVi: 'Khi cài đặt mối quan hệ `1:1` bằng Khóa ngoại (ví dụ bảng `Internship_Contract` có cột `placement_id` tham chiếu tới `Placements`), cần phải thêm ràng buộc SQL nào vào cột Khóa ngoại đó để nó không bị biến thành quan hệ `1:N`?',
    misconception: 'Forgetting to put a `UNIQUE` constraint (or PK) on the Foreign Key column when implementing a `1:1` relationship.',
    followUp: 'What happens if you add `placement_id REFERENCES Placements(placement_id)` without `UNIQUE`?',
    appliedTitle: 'Enforcing 1:1 Official Exam Attempt Constraint',
    appliedTable: `CREATE TABLE Official_Certificate (
  cert_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  issued_date TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);`,
    appliedQuestionEn: 'The university rule states: "Each student can be issued at most ONE graduation certificate (`1:0..1`)." Look at the `CREATE TABLE` above. Why can this table currently store 5 certificates for the same student, and what single keyword fixes it?',
    appliedQuestionVi: 'Quy chế trường quy định: "Mỗi sinh viên chỉ được cấp tối đa MỘT chứng chỉ tốt nghiệp (`1:0..1`)." Quan sát lệnh `CREATE TABLE` ở trên. Tại sao bảng này hiện tại vẫn cho phép lưu 5 chứng chỉ cho cùng một sinh viên, và chỉ cần thêm từ khóa nào để khóa chặt thành quan hệ `1:1`?',
    appliedAnswerPoints: [
      'A `FOREIGN KEY` alone always permits `1:N` (the same `student_id` can repeat across many rows in `Official_Certificate`).',
      'Fix: Add `UNIQUE` to `student_id` (`student_id TEXT NOT NULL UNIQUE`), or make `student_id` itself the `PRIMARY KEY`.',
    ],
    appliedMisconception: 'Believing `FOREIGN KEY` automatically restricts references to 1-to-1.',
  },
  {
    code: 'REFERENTIAL_INTEGRITY_ACTIONS',
    topic: 'Referential Integrity Actions (RESTRICT, CASCADE, SET NULL)',
    objective: 'Choose safe ON DELETE behaviors for business vs historical transaction tables',
    conceptFocusEn: 'Compare `ON DELETE RESTRICT`, `ON DELETE CASCADE`, and `ON DELETE SET NULL`. Why is `ON DELETE CASCADE` on `Customers -> Orders` catastrophic for CampusMart’s financial records?',
    conceptFocusVi: 'Hãy so sánh 3 cơ chế toàn vẹn tham chiếu khi xóa: `ON DELETE RESTRICT`, `ON DELETE CASCADE`, và `ON DELETE SET NULL`. Tại sao việc đặt `ON DELETE CASCADE` từ bảng `Customers` sang bảng `Orders` lại là thảm họa đối với sổ sách tài chính của CampusMart?',
    contradictionEn: 'Give one example where `ON DELETE CASCADE` IS appropriate (e.g., deleting an unsubmitted draft shopping cart and its cart items) versus where `ON DELETE RESTRICT` is mandatory.',
    contradictionVi: 'Hãy nêu một ví dụ thực tế mà `ON DELETE CASCADE` LÀ phù hợp (ví dụ: xóa một giỏ hàng nháp chưa thanh toán cùng các dòng trong giỏ đó) so với trường hợp bắt buộc phải dùng `ON DELETE RESTRICT`.',
    misconception: 'Adding `ON DELETE CASCADE` to every foreign key just to stop the database from throwing foreign key errors.',
    followUp: 'In SQLite, are foreign key constraints enforced by default on a brand-new connection unless `PRAGMA foreign_keys = ON;` is executed?',
    appliedTitle: 'Tracing Accidental Revenue Erasure from ON DELETE CASCADE',
    appliedTable: `Schema:
Customers(customer_id PK, name)
Orders(order_id PK, customer_id FK REFERENCES Customers ON DELETE CASCADE, total_vnd)

Action:
Admin deletes inactive customer 'CUST_88' who had 12 paid orders in January totaling 4,800,000 VND.`,
    appliedQuestionEn: 'Trace what the database automatically does when the admin runs `DELETE FROM Customers WHERE customer_id = "CUST_88"` under the schema above, and explain how to fix both the foreign key rule and the customer deactivation process.',
    appliedQuestionVi: 'Hãy mô tả những gì CSDL tự động thực hiện khi quản trị viên chạy lệnh `DELETE FROM Customers WHERE customer_id = "CUST_88"` theo lược đồ trên, và nêu cách sửa lại cả quy tắc Khóa ngoại lẫn quy trình ngừng kích hoạt tài khoản khách hàng.',
    appliedAnswerPoints: [
      '`ON DELETE CASCADE` silently deletes all 12 paid orders (`4,800,000 VND`) belonging to `CUST_88` from the `Orders` table!',
      'January financial reports suddenly drop by 4,800,000 VND and no longer match bank deposits.',
      'Fix: Change to `ON DELETE RESTRICT` and deactivate customers via soft status (`is_active = 0`) instead of `DELETE`.',
    ],
    appliedMisconception: 'Using `ON DELETE CASCADE` on financial or exam history tables.',
  },
  {
    code: 'WEAK_VS_STRONG_ENTITIES',
    topic: 'Identifying Strong vs. Weak / Dependent Entities',
    objective: 'Recognize entities whose existence and identity depend on a parent entity',
    conceptFocusEn: 'In ERD modeling, what is a "weak / dependent entity"? Explain why `OrderLine` (or `QuestionAssignment` inside an `Attempt`) depends on its parent entity (`Order` or `Attempt`) for its business existence.',
    conceptFocusVi: 'Trong mô hình ERD, "thực thể yếu / phụ thuộc" (weak entity) là gì? Hãy giải thích vì sao một dòng hàng `OrderLine` (hoặc một phân công câu hỏi `QuestionAssignment` trong lượt thi `Attempt`) lại phụ thuộc vào thực thể cha (`Order` hoặc `Attempt`) để tồn tại.',
    contradictionEn: 'Can a weak entity like `OrderLine(order_id, line_number, product_id, qty)` identify a unique row across the entire store using only `line_number = 1` without `order_id`? Why or why not?',
    contradictionVi: 'Một thực thể phụ thuộc như `OrderLine(order_id, line_number, product_id, qty)` có thể xác định duy nhất một dòng trên toàn cửa hàng nếu chỉ dùng `line_number = 1` mà không kèm `order_id` hay không? Tại sao?',
    misconception: 'Thinking `line_number` (`1, 2, 3` on each receipt) is globally unique across all orders without combining it with `order_id`.',
    followUp: 'What is the composite Primary Key of `OrderLines` when using receipt `line_number` (`1, 2, 3...`)?',
    appliedTitle: 'Identifying Key of Dependent Entity `QuestionAssignment`',
    appliedTable: `attempt_id | slot_number | question_id | revealed
-----------+-------------+-------------+---------
ATT_01     |      1      | Q_01_A01    |    1
ATT_01     |      2      | Q_04_B02    |    0
ATT_02     |      1      | Q_02_A03    |    1
ATT_02     |      2      | Q_06_B01    |    1`,
    appliedQuestionEn: 'In the `QuestionAssignments` table above, every exam attempt has `slot_number` `1` and `2`. Explain why neither `attempt_id` alone nor `slot_number` alone can be the Primary Key, and write the minimal composite Primary Key.',
    appliedQuestionVi: 'Trong bảng `QuestionAssignments` ở trên, mỗi lượt thi đều có `slot_number` là `1` và `2`. Hãy giải thích vì sao cả `attempt_id` đứng một mình lẫn `slot_number` đứng một mình đều không thể làm Khóa chính, và nêu Khóa chính tổ hợp tối thiểu của bảng này.',
    appliedAnswerPoints: [
      '`attempt_id` repeats twice per attempt (for slots 1 and 2); `slot_number` (`1` or `2`) repeats across every attempt.',
      '`slot_number` is a partial key (discriminator) of a dependent entity.',
      'Minimal composite Primary Key is `(attempt_id, slot_number)`.',
    ],
    appliedMisconception: 'Setting `PRIMARY KEY (attempt_id)` on `QuestionAssignments`, which blocks drawing Question 2!',
  },
  {
    code: 'REPEATING_GROUPS_COLUMNS',
    topic: 'Eliminating Horizontal Repeating Columns (`item1, item2, item3`)',
    objective: 'Identify why numbered columns (`product_1, product_2, product_3`) violate relational design',
    conceptFocusEn: 'A store owner designs an `Orders` table with columns `product_1, qty_1, product_2, qty_2, product_3, qty_3`. Give three concrete reasons why this horizontal repeating-column design fails in practice.',
    conceptFocusVi: 'Một chủ cửa hàng thiết kế bảng `Orders` với các cột ngang `product_1, qty_1, product_2, qty_2, product_3, qty_3`. Hãy nêu 3 lý do cụ thể vì sao thiết kế lặp cột ngang này thất bại trong thực tế.',
    contradictionEn: 'In our Oral Exam Studio, each attempt has 2 questions. Compare storing `QuestionAssignments` as child rows `(attempt_id, slot_number, ...)` versus hardcoding `q1_id, q2_id, q3_id...` if next semester the final exam uses 3 questions instead of 2.',
    contradictionVi: 'Trong ứng dụng Oral Exam Studio, mỗi lượt thi giữa kỳ gồm 2 câu. Hãy so sánh việc thiết kế bảng con `QuestionAssignments(attempt_id, slot_number, ...)` với việc gán cứng các cột ngang nếu học kỳ tới bài thi cuối kỳ yêu cầu rút 3 câu thay vì 2 câu.',
    misconception: 'Thinking `product_1, product_2, product_3` satisfies relational design just because each cell holds a single string.',
    followUp: 'How would you write a query to count total units sold of `"P01"` if it could be sitting in `product_1`, `product_2`, OR `product_3`?',
    appliedTitle: 'Auditing Horizontal Skill Columns in Internship Profiles',
    appliedTable: `Students_Skills_Flat:
student_id | skill_1 | skill_2 | skill_3
-----------+---------+---------+--------
S01        | SQL     | Python  | Excel
S02        | Excel   | SQL     | NULL
S03        | PowerBI | NULL    | NULL`,
    appliedQuestionEn: 'An employer wants to find all students who know `"SQL"`. Why does querying `WHERE skill_1 = "SQL"` miss `S02`, why does this table block a student with 5 skills, and how should it be redesigned?',
    appliedQuestionVi: 'Một nhà tuyển dụng muốn lọc tất cả sinh viên biết `"SQL"`. Tại sao câu lệnh `WHERE skill_1 = "SQL"` lại bỏ sót sinh viên `S02`, tại sao bảng này chặn sinh viên có 5 kỹ năng, và cần thiết kế lại như thế nào?',
    appliedAnswerPoints: [
      'In `S02`, `"SQL"` sits in `skill_2`, so querying only `skill_1` misses her (forcing awkward `WHERE skill_1="SQL" OR skill_2="SQL" OR skill_3="SQL"`).',
      'Students with > 3 skills cannot record their 4th/5th skill without `ALTER TABLE`, while `S03` wastes columns with `NULL`s.',
      'Redesign into `StudentSkills(student_id, skill_name)` with PK `(student_id, skill_name)`.',
    ],
    appliedMisconception: 'Adding `skill_4` through `skill_20` as a "fix" instead of normalizing into rows.',
  },
  {
    code: 'TERNARY_VS_BINARY_RELATIONSHIPS',
    topic: 'Modeling Multi-Party Events (Student + Company + Semester)',
    objective: 'Include time/semester in the key of recurring associative relationships',
    conceptFocusEn: 'Suppose a student can intern at the same company in Summer 2025 and again in Spring 2026. Why is a composite key `(student_id, company_id)` on `Internships` insufficient, and what must be added to the key?',
    conceptFocusVi: 'Giả sử một sinh viên có thể thực tập tại cùng một công ty vào học kỳ Hè 2025 rồi lại thực tập nâng cao tại chính công ty đó vào học kỳ Xuân 2026. Tại sao khóa chính tổ hợp `(student_id, company_id)` trên bảng `Internships` là chưa đủ, và cần bổ sung gì vào khóa?',
    contradictionEn: 'At CampusMart, a supplier delivers the same product (`P01`) across multiple delivery batches on different dates with different wholesale costs. Why can `(supplier_id, product_id)` not be the Primary Key of `SupplyDeliveries`?',
    contradictionVi: 'Tại CampusMart, một nhà cung cấp giao cùng một mặt hàng (`P01`) thành nhiều lô hàng vào các ngày khác nhau với giá nhập sỉ khác nhau. Tại sao cặp `(supplier_id, product_id)` không thể làm Khóa chính của bảng `SupplyDeliveries` (Lô nhập hàng)?',
    misconception: 'Assuming an associative table’s Primary Key is always strictly the two foreign keys `(A_id, B_id)` even when the same `(A, B)` pair can recur over time.',
    followUp: 'What happens on the second delivery of `P01` from `SUP_01` if `PRIMARY KEY (supplier_id, product_id)` is used on `SupplyDeliveries`?',
    appliedTitle: 'Fixing Recurring Enrollment Key Collision',
    appliedTable: `CREATE TABLE Course_Enrollments (
  student_id TEXT,
  course_id TEXT,
  semester_code TEXT,
  final_grade REAL,
  PRIMARY KEY (student_id, course_id)
);`,
    appliedQuestionEn: 'Student `00231040` failed `HSB3102E` in `2025_FALL` and retakes `HSB3102E` in `2026_SPRING`. Why does the `CREATE TABLE` above fail when registering her for `2026_SPRING`, and how should the Primary Key be defined?',
    appliedQuestionVi: 'Sinh viên `00231040` trượt môn `HSB3102E` ở học kỳ `2025_FALL` và đăng ký học lại môn `HSB3102E` ở học kỳ `2026_SPRING`. Tại sao bảng `Course_Enrollments` ở trên lại báo lỗi trùng khóa khi đăng ký học kỳ `2026_SPRING`, và cần sửa Khóa chính như thế nào?',
    appliedAnswerPoints: [
      '`PRIMARY KEY (student_id, course_id)` only allows a student to take a course once in their entire life!',
      'Because enrollments recur by semester, `semester_code` must be part of the composite Primary Key: `PRIMARY KEY (student_id, course_id, semester_code)` (or use an `enrollment_id` PK with `UNIQUE(student_id, course_id, semester_code)`).',
    ],
    appliedMisconception: 'Deleting the `2025_FALL` transcript row just to insert the `2026_SPRING` retake.',
  },
  {
    code: 'ORPHAN_RECORDS_DIAGNOSIS',
    topic: 'Orphan Records and Broken Referential Integrity',
    objective: 'Identify child rows whose foreign key points to a non-existent parent key',
    conceptFocusEn: 'What is an "orphan record" in a relational database? How can orphan records sneak into a SQLite database if `PRAGMA foreign_keys = ON` was not enabled during a CSV import?',
    conceptFocusVi: '"Bản ghi mồ côi" (orphan record) trong CSDL quan hệ là gì? Làm thế nào các bản ghi mồ côi có thể lọt vào CSDL SQLite nếu quên bật `PRAGMA foreign_keys = ON` trong lúc nhập file CSV?',
    contradictionEn: 'Why do orphan rows in `OrderLines` cause total revenue numbers to change depending on whether the analyst queries `SELECT SUM(qty*price) FROM OrderLines` versus `SELECT SUM(qty*price) FROM OrderLines JOIN Products USING(product_id)`?',
    contradictionVi: 'Tại sao sự xuất hiện của các bản ghi mồ côi trong bảng `OrderLines` lại khiến tổng doanh thu bị lệch nhau giữa câu lệnh `SELECT SUM(qty*price) FROM OrderLines` và câu lệnh `SELECT SUM(qty*price) FROM OrderLines JOIN Products USING(product_id)`?',
    misconception: 'Assuming `INNER JOIN` always preserves 100% of rows from the child table even when foreign keys are unvalidated.',
    followUp: 'Write a `LEFT JOIN ... WHERE ... IS NULL` query pattern to hunt down orphan rows in `OrderLines`.',
    appliedTitle: 'Detecting Orphan OrderLines via Anti-Join',
    appliedTable: `Products Table:                  OrderLines Table:
product_id | product_name        line_id | product_id | line_total_vnd
-----------+-------------        --------+------------+---------------
P01        | Notebook              10    | P01        |    50,000
P02        | Gel Pen               11    | P99        |   120,000
                                   12    | P02        |    30,000`,
    appliedQuestionEn: 'Inspect the two tables above. Identify the orphan record in `OrderLines`, calculate the revenue gap between querying `OrderLines` directly vs `INNER JOIN Products`, and explain how to find all such orphan rows with SQL.',
    appliedQuestionVi: 'Quan sát hai bảng ở trên. Hãy chỉ ra bản ghi mồ côi (orphan record) trong bảng `OrderLines`, tính độ lệch doanh thu giữa việc cộng trực tiếp trên `OrderLines` với việc `INNER JOIN Products`, và nêu cách viết SQL để tìm mọi bản ghi mồ côi như vậy.',
    appliedAnswerPoints: [
      '`line_id = 11` is an orphan record because `product_id = "P99"` does not exist in `Products`.',
      'Direct sum on `OrderLines` = `50,000 + 120,000 + 30,000 = 200,000 VND`; `INNER JOIN Products` drops `line_id = 11` and returns `80,000 VND` (a `120,000 VND` gap!).',
      'Detection query: `SELECT ol.* FROM OrderLines ol LEFT JOIN Products p ON ol.product_id = p.product_id WHERE p.product_id IS NULL;`.',
    ],
    appliedMisconception: 'Using `INNER JOIN` to look for orphan records (an `INNER JOIN` hides orphans instead of showing them!).',
  },
  {
    code: 'MULTIPLE_RELATIONSHIPS_SAME_ENTITIES',
    topic: 'Multiple Distinct Relationships Between the Same Two Entities',
    objective: 'Model role-specific foreign keys when two entities relate in more than one way',
    conceptFocusEn: 'In our Oral Exam Studio (or an Order fulfillment system), one staff member creates the exam/order (`created_by_staff_id`) and another staff member grades or approves it (`approved_by_staff_id`). How does a single `Exams` table have TWO foreign keys pointing to the same `Staff` table?',
    conceptFocusVi: 'Trong hệ thống quản lý thi hoặc duyệt đơn hàng, một giảng viên tạo đề (`created_by_staff_id`) và một giảng viên khác chấm/duyệt (`graded_by_staff_id`). Làm thế nào một bảng có thể chứa HAI cột Khóa ngoại cùng tham chiếu tới một bảng `Staff` duy nhất?',
    contradictionEn: 'When writing a SQL query to display both the creator’s name and the grader’s name on the same row, why can you not just write `JOIN Staff ON ...` once without table aliases?',
    contradictionVi: 'Khi viết câu lệnh SQL để hiển thị đồng thời cả Họ tên người tạo đề lẫn Họ tên người chấm trên cùng một dòng kết quả, tại sao không thể chỉ `JOIN Staff` một lần mà bắt buộc phải dùng bí danh bảng (table alias) hai lần?',
    misconception: 'Thinking a child table can have at most one Foreign Key pointing to a given parent table.',
    followUp: 'Show how table aliases (`JOIN Staff AS creator ... JOIN Staff AS grader ...`) resolve the ambiguity.',
    appliedTitle: 'Joining Role-Based Foreign Keys in Peer-Mentoring Table',
    appliedTable: `Students:                        Mentoring_Pairs:
student_id | full_name           pair_id | mentor_id | mentee_id
-----------+------------         --------+-----------+----------
S01        | Le Anh              MP_01   | S01       | S02
S02        | Tran Binh           MP_02   | S01       | S03
S03        | Pham Chi`,
    appliedQuestionEn: 'In `Mentoring_Pairs`, both `mentor_id` and `mentee_id` reference `Students(student_id)`. Explain what happens if an AI writes `SELECT * FROM Mentoring_Pairs m JOIN Students s ON m.mentor_id = s.student_id AND m.mentee_id = s.student_id`, and how to join properly.',
    appliedQuestionVi: 'Trong bảng `Mentoring_Pairs`, cả `mentor_id` (đàn anh hướng dẫn) và `mentee_id` (sinh viên được hướng dẫn) đều tham chiếu tới `Students(student_id)`. Chuyện gì xảy ra nếu AI viết điều kiện `JOIN Students s ON m.mentor_id = s.student_id AND m.mentee_id = s.student_id`? Cần viết JOIN như thế nào cho đúng?',
    appliedAnswerPoints: [
      'Joining a single `Students s` table with `m.mentor_id = s.student_id AND m.mentee_id = s.student_id` only matches rows where `mentor_id = mentee_id` (a student mentoring themselves!), returning `0` rows!',
      'Must join `Students` twice using two aliases: `JOIN Students mentor ON m.mentor_id = mentor.student_id JOIN Students mentee ON m.mentee_id = mentee.student_id`.',
    ],
    appliedMisconception: 'Combining two different role foreign keys with `AND` against a single joined instance of the parent table.',
  },
  {
    code: 'FAN_TRAP_CHASM_TRAP',
    topic: 'Avoiding ERD Pathway Traps (Chasm Trap & Fan Trap)',
    objective: 'Identify broken or ambiguous relationship pathways across three entities',
    conceptFocusEn: 'What is a "Fan Trap" in an ERD? Suppose `1 Department` has `N Instructors` and `1 Department` also offers `N Courses`, with no direct relationship recorded between `Instructors` and `Courses`. Can you tell which instructor teaches which course?',
    conceptFocusVi: '"Bẫy rẻ quạt" (Fan Trap) trong sơ đồ ERD là gì? Giả sử `1 Bộ môn` có `N Giảng viên` và `1 Bộ môn` cũng quản lý `N Học phần`, nhưng không có mối liên kết trực tiếp giữa `Giảng viên` và `Học phần`. Ta có thể biết giảng viên nào dạy học phần nào không?',
    contradictionEn: 'What happens if an analyst joins `Instructors` to `Departments` and then to `Courses` on `dept_id`? How do you restructure the ERD to eliminate the Fan Trap?',
    contradictionVi: 'Chuyện gì xảy ra nếu chuyên viên nối bảng `Instructors` sang `Departments` rồi nối tiếp sang `Courses` qua `dept_id`? Cần chỉnh lại sơ đồ ERD như thế nào để triệt tiêu bẫy Fan Trap này?',
    misconception: 'Assuming that because `Instructors` and `Courses` both share `dept_id`, joining on `dept_id` tells you who teaches what.',
    followUp: 'What is a "Chasm Trap" when an optional relationship (`0..1`) sits in the middle of a join path?',
    appliedTitle: 'Diagnosing Cartesian Explosion from an ERD Fan Trap',
    appliedTable: `Department D01 ("Data Science") has:
- 2 Instructors: I1, I2  (in table Instructors(inst_id, dept_id))
- 3 Courses: C1, C2, C3  (in table Courses(course_id, dept_id))`,
    appliedQuestionEn: 'An analyst runs `SELECT i.inst_id, c.course_id FROM Instructors i JOIN Courses c ON i.dept_id = c.dept_id WHERE i.dept_id = "D01"`. How many rows does this query return, why is the output false, and what relationship is missing in the ERD?',
    appliedQuestionVi: 'Chuyên viên chạy lệnh `SELECT i.inst_id, c.course_id FROM Instructors i JOIN Courses c ON i.dept_id = c.dept_id WHERE i.dept_id = "D01"`. Truy vấn này trả về bao nhiêu dòng, tại sao kết quả đó sai sự thật, và sơ đồ ERD đang thiếu mối quan hệ nào?',
    appliedAnswerPoints: [
      'The query returns `2 * 3 = 6` rows (a Cartesian product within department `D01`, claiming both I1 and I2 teach all 3 courses!).',
      'Joining two independent `1:N` branches (`Departments -> Instructors` and `Departments -> Courses`) on `dept_id` commits a Fan Trap.',
      'Fix: Establish a direct relationship between `Instructors` and `Courses` (e.g., `CourseOfferings(course_id, inst_id, semester)`).',
    ],
    appliedMisconception: 'Joining two sibling `N`-side tables on their shared parent `dept_id`.',
  },
  {
    code: 'ATTRIBUTE_ON_RELATIONSHIP',
    topic: 'Placing Relationship Attributes on the Correct Table',
    objective: 'Determine whether an attribute belongs to an entity or to the relationship between entities',
    conceptFocusEn: 'In a conceptual model, `Student` enrolls in `Course` and receives a `grade`. Why is `grade` an attribute of the enrollment relationship rather than an attribute of `Student` or `Course`?',
    conceptFocusVi: 'Trong mô hình khái niệm, `Sinh viên` đăng ký `Học phần` và nhận được một `điểm số` (`grade`). Tại sao `grade` là thuộc tính của mối quan hệ đăng ký học chứ không phải thuộc tính của riêng `Sinh viên` hay của riêng `Học phần`?',
    contradictionEn: 'When a relationship is `1:N` (e.g. `1 Company` hires `N Interns` for one placement each, and each placement has a `start_date`), where does the relationship attribute `start_date` go when converted into relational tables?',
    contradictionVi: 'Khi mối quan hệ là `1:N` (ví dụ `1 Công ty` tiếp nhận `N Sinh viên thực tập`, mỗi sinh viên thực tập tại 1 công ty và có ngày bắt đầu `start_date`), thuộc tính `start_date` của mối quan hệ sẽ được đặt vào bảng nào khi chuyển sang mô hình quan hệ?',
    misconception: 'Creating an extra third table for every `1:N` relationship just to hold `start_date` (or worse, putting `start_date` on the `1` side `Company`!).',
    followUp: 'Contrast where a relationship attribute goes in `1:N` (on the `N` side) vs in `M:N` (on the associative junction table).',
    appliedTitle: 'Misplaced Relationship Attribute in Supplier Pricing',
    appliedTable: `Rule: CampusMart buys Product P01 from two backup Suppliers (SUP_A at 18,000 VND and SUP_B at 19,500 VND).

Flawed Schema:
Suppliers(supplier_id PK, supplier_name, wholesale_cost)
Products(product_id PK, product_name)`,
    appliedQuestionEn: 'Why does putting `wholesale_cost` inside `Suppliers` (or inside `Products`) fail to model the business rule above? Where must `wholesale_cost` live?',
    appliedQuestionVi: 'Tại sao việc đặt cột `wholesale_cost` (giá nhập sỉ) vào bảng `Suppliers` (hoặc vào bảng `Products`) đều không biểu diễn được quy tắc nghiệp vụ ở trên? Cột `wholesale_cost` bắt buộc phải đặt ở đâu?',
    appliedAnswerPoints: [
      'Putting `wholesale_cost` in `Suppliers` implies a supplier charges the exact same price for every product they sell!',
      'Putting `wholesale_cost` in `Products` allows only one cost per product, ignoring that `SUP_A` charges 18,000 and `SUP_B` charges 19,500.',
      'Must place `wholesale_cost` in the associative table `SupplierProducts(supplier_id, product_id, wholesale_cost)` with PK `(supplier_id, product_id)`.',
    ],
    appliedMisconception: 'Putting `wholesale_cost` in `Products` when multiple suppliers offer the same product at different wholesale prices.',
  },
  {
    code: 'DEGREE_OF_RELATIONSHIP',
    topic: 'Unary (1-Entity), Binary (2-Entity), and Ternary (3-Entity) Relationships',
    objective: 'Identify the degree of a relationship from business rules and ER diagrams',
    conceptFocusEn: 'Define the "degree" of a relationship in an ERD and give one CampusMart or university example each of a Unary (recursive) relationship and a Binary relationship.',
    conceptFocusVi: 'Hãy định nghĩa "bậc của mối quan hệ" (degree of relationship) trong sơ đồ ERD và nêu 1 ví dụ cho quan hệ bậc 1 (Unary/đệ quy) cùng 1 ví dụ cho quan hệ bậc 2 (Binary) trong ngữ cảnh trường đại học hoặc CampusMart.',
    contradictionEn: 'In a university curriculum, Course `HSB3102E` requires Prerequisite Course `MIS2001`. Both are rows in the `Courses` table. Is the prerequisite relationship Unary or Binary, and is its cardinality `1:N` or `M:N`?',
    contradictionVi: 'Trong chương trình đào tạo, học phần `HSB3102E` có học phần tiên quyết là `MIS2001`. Cả hai đều là các dòng trong bảng `Courses`. Mối quan hệ học phần tiên quyết này là bậc 1 (Unary) hay bậc 2 (Binary), và bản số của nó là `1:N` hay `M:N`?',
    misconception: 'Confusing the degree of a relationship (how many entity types participate) with cardinality (`1:1`, `1:N`, `M:N`).',
    followUp: 'How do you implement an `M:N` unary relationship (`CoursePrerequisites`) in SQL?',
    appliedTitle: 'Implementing M:N Unary Course Prerequisite Table',
    appliedTable: `Courses:
course_id | course_title
----------+------------------------------------
MIS101    | Intro to Information Systems
STAT102   | Probability & Statistics
HSB3102E  | Database Design & Development (Requires BOTH MIS101 and STAT102)`,
    appliedQuestionEn: 'Because `HSB3102E` requires TWO prerequisites (`MIS101` and `STAT102`), explain why a single column `prereq_course_id` inside `Courses` is not enough, and design the `Course_Prerequisites` table showing the exact rows for `HSB3102E`.',
    appliedQuestionVi: 'Vì môn `HSB3102E` yêu cầu tới HAI môn tiên quyết (`MIS101` và `STAT102`), hãy giải thích vì sao việc thêm 1 cột `prereq_course_id` ngay trong bảng `Courses` là không đủ, đồng thời thiết kế bảng `Course_Prerequisites` và ghi rõ các dòng dữ liệu cho môn `HSB3102E`.',
    appliedAnswerPoints: [
      'A single `prereq_course_id` column in `Courses` only supports a `1:N` unary hierarchy (at most 1 prerequisite per course).',
      'Since one course can have multiple prerequisites and one course can be a prerequisite for multiple advanced courses, it is an `M:N` unary relationship.',
      'Create `Course_Prerequisites(course_id, prereq_id)` with PK `(course_id, prereq_id)` and two rows: `("HSB3102E", "MIS101")` and `("HSB3102E", "STAT102")`.',
    ],
    appliedMisconception: 'Storing `"MIS101, STAT102"` as a comma-separated string in `Courses.prereq_course_id`.',
  },
  {
    code: 'BRIDGING_COMPOSITE_KEYS',
    topic: 'Propagating Composite Foreign Keys Across Dependent Tables',
    objective: 'Match all columns of a parent composite primary key when declaring a foreign key',
    conceptFocusEn: 'If a parent table `CourseSections` has a composite Primary Key `(course_id, semester_code, section_no)`, what rule must any child table (such as `SectionEnrollments`) follow when declaring a Foreign Key to `CourseSections`?',
    conceptFocusVi: 'Nếu bảng cha `CourseSections` (Lớp học phần) có Khóa chính tổ hợp gồm 3 cột `(course_id, semester_code, section_no)`, bảng con `SectionEnrollments` phải tuân thủ quy tắc gì khi khai báo Khóa ngoại tham chiếu tới `CourseSections`?',
    contradictionEn: 'What happens if `SectionEnrollments` only stores `course_id` and `section_no` (`"HSB3102E"`, `"Sec01"`) without `semester_code`?',
    contradictionVi: 'Chuyện gì sẽ xảy ra nếu bảng `SectionEnrollments` chỉ lưu `course_id` và `section_no` (`"HSB3102E"`, `"Sec01"`) mà bỏ quên cột `semester_code`?',
    misconception: 'Referencing only 1 column of a 2-column or 3-column composite Primary Key.',
    followUp: 'When a composite Primary Key gets 3 or 4 columns wide, why do many engineers introduce a surrogate key (`section_id`) alongside a `UNIQUE(course_id, semester_code, section_no)` constraint?',
    appliedTitle: 'Diagnosing Partial Foreign Key Join Fan-Out',
    appliedTable: `Course_Sections (PK: course_id, semester):
course_id | semester | instructor_name
----------+----------+----------------
HSB3102E  | 2025_2   | Dr. Minh
HSB3102E  | 2026_1   | Dr. Lan

Enrollments (Missing semester!):
student_id | course_id
-----------+----------
00231001   | HSB3102E`,
    appliedQuestionEn: 'Look at `Course_Sections` and `Enrollments` above. Why can we not tell whether student `00231001` was taught by `Dr. Minh` or `Dr. Lan`, and what happens when we join the two tables on `course_id`?',
    appliedQuestionVi: 'Quan sát hai bảng `Course_Sections` và `Enrollments` ở trên. Tại sao chúng ta không thể xác định sinh viên `00231001` học với `TS. Minh` hay `TS. Lan`, và chuyện gì xảy ra khi nối hai bảng này chỉ qua cột `course_id`?',
    appliedAnswerPoints: [
      'Because `Course_Sections` has composite PK `(course_id, semester)`, `course_id = "HSB3102E"` alone matches TWO rows (`2025_2` and `2026_1`).',
      'Joining only on `course_id` duplicates student `00231001` into 2 rows, falsely assigning her to both instructors!',
      'Fix: Include `semester` in `Enrollments` so the Foreign Key `(course_id, semester)` matches the full composite PK.',
    ],
    appliedMisconception: 'Joining on only one column of a composite key.',
  },
  {
    code: 'AI_ERD_CRITIQUE',
    topic: 'Critiquing AI-Generated Database Schemas and ERDs',
    objective: 'Audit an LLM-generated schema against real business edge cases',
    conceptFocusEn: 'When you ask an AI assistant to "Generate a database schema for a campus bookstore", what are the three most common modeling mistakes LLMs make if you do not critique the output?',
    conceptFocusVi: 'Khi bạn yêu cầu một trợ lý AI "Hãy tạo lược đồ CSDL cho cửa hàng sách sinh viên", 3 lỗi mô hình hóa phổ biến nhất mà AI thường mắc phải nếu người thiết kế không kiểm tra lại là gì?',
    contradictionEn: 'Why must a database designer always test an AI-proposed ERD against concrete edge-case scenarios (such as partial refunds, multi-item orders, price changes over time, and walk-in cash customers)?',
    contradictionVi: 'Tại sao người thiết kế CSDL luôn phải kiểm nghiệm sơ đồ ERD do AI đề xuất bằng các tình huống biên cụ thể (như trả hàng một phần, đơn nhiều mặt hàng, thay đổi giá theo thời gian, và khách vãng lai trả tiền mặt)?',
    misconception: 'Accepting the first `CREATE TABLE` script generated by an AI without walking through concrete lifecycle scenarios.',
    followUp: 'Give one concrete edge case in our Oral Exam Studio that a naive AI schema generator usually forgets.',
    appliedTitle: 'Auditing an AI-Generated Coffee Shop Schema',
    appliedTable: `AI-Generated Schema:
CREATE TABLE Coffee_Shop_Orders (
  order_id INT PRIMARY KEY,
  customer_phone TEXT NOT NULL,
  drink_id INT NOT NULL REFERENCES Drinks(drink_id),
  quantity INT NOT NULL
);`,
    appliedQuestionEn: 'Critique the AI-generated `Coffee_Shop_Orders` table above against three real coffee shop situations: (1) A customer orders 1 Latte AND 1 Croissant in the same order; (2) A walk-in customer pays cash and declines to give a phone number; (3) Drink prices increase next month.',
    appliedQuestionVi: 'Hãy phản biện bảng `Coffee_Shop_Orders` do AI tạo ra ở trên trước 3 tình huống thực tế tại quán cà phê: (1) Khách gọi 1 Latte VÀ 1 bánh sừng bò trong cùng một hóa đơn; (2) Khách vãng lai trả tiền mặt và không đọc số điện thoại; (3) Tháng sau quán tăng giá đồ uống.',
    appliedAnswerPoints: [
      '(1) Putting `drink_id` and `quantity` in `Coffee_Shop_Orders` with `order_id PRIMARY KEY` restricts each order to a single menu item! Must split into `Orders` and `OrderLines`.',
      '(2) `customer_phone TEXT NOT NULL` blocks anonymous cash customers (`customer_id`/`phone` must be nullable).',
      '(3) Missing `unit_price_at_purchase`, so next month’s price change will rewrite historical revenue.',
    ],
    appliedMisconception: 'Approving the AI schema because it has valid SQL syntax and a `PRIMARY KEY`.',
  },
];

function buildFamilySeedsForLecture(
  lectureId: LectureId,
  specs: CompactTopicSpec[]
): FamilySeed[] {
  const seeds: FamilySeed[] = [];

  specs.forEach((spec, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const isCoreApproved = idx < 10; // First 10 families per group approved in Official mode (20 approved per lecture)

    // Group A Family (2 distinct conceptual variants)
    seeds.push({
      family_suffix: `L${lectureId}_A${num}_${spec.code}`,
      lecture_ids: [lectureId],
      question_group: 'A_CONCEPT',
      topic: spec.topic,
      learning_objective: spec.objective,
      variants: [
        {
          difficulty_band: idx < 8 ? 'CORE' : 'PROFICIENT',
          approved_by_default: isCoreApproved,
          prompt_en: spec.conceptFocusEn,
          prompt_vi: spec.conceptFocusVi,
          context: `HSB3102E Lecture ${lectureId} — ${spec.topic} (CampusMart & University Scenario).`,
          optional_table_or_diagram: null,
          optional_sql: null,
          expected_key_points: [
            `Core principle of ${spec.topic}: ${spec.objective}.`,
            'Explains the underlying mechanism clearly rather than reciting definitions.',
            'Connects directly to operational/analytical impact in the given scenario.',
          ],
          acceptable_alternatives: [
            'Equivalent explanation using CampusMart, Coffee Shop, or University Internship examples.',
          ],
          common_misconceptions: [spec.misconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: `Accurately explains the core concept of ${spec.topic}.`,
            reasoning_full: 'Provides sound logical justification for why the problem or distinction occurs.',
            application_full: 'Gives a concrete, valid business example illustrating the rule.',
          },
        },
        {
          difficulty_band: idx < 5 ? 'PROFICIENT' : 'ADVANCED',
          approved_by_default: false,
          prompt_en: spec.contradictionEn,
          prompt_vi: spec.contradictionVi,
          context: `HSB3102E Lecture ${lectureId} — Critical Thinking & Counterexample Analysis (${spec.topic}).`,
          optional_table_or_diagram: null,
          optional_sql: null,
          expected_key_points: [
            `Identifies the exact flaw or boundary condition in ${spec.topic}.`,
            'Contrasts the valid vs invalid modeling/operational approach.',
            'Proposes a concrete database design or governance remedy.',
          ],
          acceptable_alternatives: [
            'Illustrating the counterexample with a small 2-row sample table on the whiteboard.',
          ],
          common_misconceptions: [spec.misconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: `Pinpoints the exact edge case or contradiction in ${spec.topic}.`,
            reasoning_full: 'Explains the causal chain from design decision to business impact.',
            application_full: 'States how to configure the schema or process to resolve the issue.',
          },
        },
      ],
    });

    // Group B Family (2 distinct applied/analytical variants with tables/SQL)
    seeds.push({
      family_suffix: `L${lectureId}_B${num}_${spec.code}_APPLIED`,
      lecture_ids: [lectureId],
      question_group: 'B_APPLIED',
      topic: `${spec.topic} — Applied Analysis`,
      learning_objective: `Apply ${spec.topic.toLowerCase()} to audit tables, schemas, or AI outputs`,
      variants: [
        {
          difficulty_band: idx < 8 ? 'PROFICIENT' : 'ADVANCED',
          approved_by_default: isCoreApproved,
          prompt_en: spec.appliedQuestionEn,
          prompt_vi: spec.appliedQuestionVi,
          context: spec.appliedTitle,
          optional_table_or_diagram: spec.appliedTable,
          optional_sql: spec.appliedSql || null,
          expected_key_points: spec.appliedAnswerPoints,
          acceptable_alternatives: [
            'Any equivalent algebraic, SQL, or relational trace that reaches the same verified conclusion.',
          ],
          common_misconceptions: [spec.appliedMisconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: 'Identifies the exact rows, numbers, or schema elements causing the issue.',
            reasoning_full: 'Explains step-by-step why the anomaly or discrepancy occurs on the sample data.',
            application_full: 'Proposes the exact corrected schema, constraint, or query logic.',
          },
        },
        {
          difficulty_band: 'ADVANCED',
          approved_by_default: false,
          prompt_en: `Referring to the scenario "${spec.appliedTitle}" shown below: suppose an AI assistant inspects this data and claims everything is 100% valid for executive decision-making. Audit the data, prove the AI wrong using specific values from the snippet, and state the required fix.`,
          prompt_vi: `Dựa trên tình huống "${spec.appliedTitle}" dưới đây: giả sử trợ lý AI kiểm tra dữ liệu này và khẳng định mọi thứ hoàn toàn hợp lệ 100% để ban giám đốc ra quyết định. Hãy kiểm toán dữ liệu, dùng các giá trị cụ thể trong bảng để chứng minh AI sai và nêu giải pháp khắc phục.`,
          context: `${spec.appliedTitle} — AI Verification & Audit`,
          optional_table_or_diagram: spec.appliedTable,
          optional_sql: spec.appliedSql || null,
          expected_key_points: [
            ...spec.appliedAnswerPoints,
            'Demonstrates how to cross-check AI assurances against primary database evidence.',
          ],
          acceptable_alternatives: [
            'Writing a validation SQL query or schema constraint that catches the defect automatically.',
          ],
          common_misconceptions: [spec.appliedMisconception],
          optional_follow_up: spec.followUp,
          rubric_specifics: {
            accuracy_full: 'Cites specific row/column evidence refuting the AI’s claim.',
            reasoning_full: 'Traces the exact error propagation from the table snippet to the business metric.',
            application_full: 'Specifies the concrete database or query safeguard.',
          },
        },
      ],
    });
  });

  return seeds;
}

export const LECTURES_02_TO_04_BUILT_SEEDS: FamilySeed[] = [
  ...buildFamilySeedsForLecture('02', LECTURE_02_SPECS),
  ...buildFamilySeedsForLecture('03', LECTURE_03_SPECS),
  ...buildFamilySeedsForLecture('04', LECTURE_04_SPECS),
];
