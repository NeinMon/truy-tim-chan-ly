let db = null;
let leaderboardMode = "local";
let firebaseApi = null;
let auth = null;
let authApi = null;
let currentUser = null;
let currentView = "home";
let unsubscribeLeaderboard = null;
let questionBank = [];
let timedMode = false;
let timerId = null;
const firebaseSettings = window.TRUTH_FIREBASE_SETTINGS || { enabled: false, config: {} };

const QUESTION_BANK = [
  ["sensory", "Bạn thấy một video viral có hàng triệu lượt xem. Bạn tin ngay vì nhiều người xem chắc đúng. Đây là gì?", ["Nhận thức lý tính", "Chân lý tuyệt đối", "Nhận thức cảm tính", "Thực tiễn kiểm nghiệm"], 2, "Đây là phản ứng dựa vào hiện tượng ban đầu và tác động trực tiếp của cảm giác, chưa phân tích bản chất."],
  ["sensory", "Một bài đăng có hình ảnh gây sốc khiến bạn lập tức tức giận. Trạng thái này chủ yếu thuộc giai đoạn nào?", ["Nhận thức cảm tính", "Suy lý khoa học", "Chân lý khách quan", "Khái niệm"], 0, "Cảm xúc và ấn tượng trực tiếp là biểu hiện của nhận thức cảm tính."],
  ["sensory", "Bạn nhớ lại hình ảnh một thí nghiệm từng xem dù vật không còn trước mắt. Đó là hình thức nào?", ["Khái niệm", "Biểu tượng", "Phán đoán", "Thực tiễn"], 1, "Biểu tượng là hình ảnh sự vật được lưu giữ và tái hiện trong ý thức."],
  ["sensory", "Khi nghe tiếng sấm và thấy chớp, bạn mới ghi nhận hiện tượng bên ngoài. Đây là mức độ nào?", ["Tri giác/cảm giác", "Suy lý", "Chân lý", "Quy luật"], 0, "Cảm giác, tri giác giúp con người tiếp xúc ban đầu với sự vật."],
  ["sensory", "Tin rằng một sản phẩm tốt chỉ vì bao bì đẹp là biểu hiện của điều gì?", ["Lý tính sâu sắc", "Cảm tính dừng ở hiện tượng", "Thực tiễn kiểm nghiệm", "Chân lý cụ thể"], 1, "Bao bì là biểu hiện bên ngoài, chưa cho thấy bản chất chất lượng."],
  ["sensory", "Một sinh viên kết luận bài giảng khó chỉ vì slide có nhiều chữ. Đây là hạn chế của giai đoạn nào?", ["Nhận thức cảm tính", "Nhận thức lý tính", "Thực tiễn", "Chân lý"], 0, "Kết luận này dựa trên ấn tượng ban đầu."],
  ["sensory", "Dạng nào sau đây thuộc nhận thức cảm tính?", ["Khái niệm", "Phán đoán", "Cảm giác", "Suy lý"], 2, "Nhận thức cảm tính gồm cảm giác, tri giác và biểu tượng."],
  ["sensory", "Thấy một bình luận tự tin và lập tức tin theo là lỗi nhận thức nào?", ["Dựa vào dấu hiệu bề ngoài", "Kiểm chứng thực tiễn", "Phân tích logic", "Khái quát khoa học"], 0, "Sự tự tin của người nói không chứng minh nội dung là đúng."],
  ["sensory", "Nhận thức cảm tính có vai trò gì?", ["Vô dụng", "Cung cấp chất liệu ban đầu", "Thay thế hoàn toàn lý tính", "Luôn là chân lý"], 1, "Cảm tính là điểm xuất phát, cung cấp dữ liệu cho tư duy lý tính."],
  ["sensory", "Nếu chỉ dựa vào lượt thích để đánh giá đúng sai, bạn đang bỏ qua điều gì?", ["Hiện tượng", "Số đông", "Phân tích bản chất", "Ấn tượng đầu tiên"], 2, "Lượt thích là hiện tượng xã hội, không thay thế được phân tích bản chất."],

  ["rational", "Bạn bắt đầu kiểm tra nguồn, đối chiếu dữ kiện và phân tích logic. Đây là gì?", ["Cảm tính", "Lý tính", "Cảm giác", "Biểu tượng"], 1, "Nhận thức lý tính dùng khái niệm, phán đoán, suy lý để đi sâu vào bản chất."],
  ["rational", "Khi bạn đặt câu hỏi 'vì sao thông tin này đúng?', bạn đang chuyển sang hoạt động nào?", ["Ghi nhận cảm giác", "Tư duy lý tính", "Tin theo số đông", "Chia sẻ cảm xúc"], 1, "Câu hỏi vì sao buộc người học phân tích nguyên nhân và quan hệ bản chất."],
  ["rational", "Hình thức nào không thuộc nhận thức lý tính?", ["Khái niệm", "Phán đoán", "Suy lý", "Cảm giác"], 3, "Cảm giác thuộc nhận thức cảm tính."],
  ["rational", "Từ nhiều ví dụ tin giả, bạn rút ra khái niệm 'nguồn không đáng tin'. Đây là thao tác gì?", ["Khái quát hóa", "Tin đồn", "Cảm giác", "Ngẫu nhiên"], 0, "Khái quát hóa giúp hình thành khái niệm từ nhiều dữ kiện."],
  ["rational", "Phán đoán nào hợp lý nhất khi gặp câu 'AI nói nên chắc đúng'?", ["AI luôn đúng", "AI có thể sai và cần kiểm chứng", "Không cần nguồn", "Cứ chia sẻ trước"], 1, "Lý tính đòi hỏi đánh giá điều kiện, nguồn và bằng chứng."],
  ["rational", "Suy lý là gì?", ["Cảm nhận màu sắc", "Rút ra kết luận từ các phán đoán", "Nhìn thấy hiện tượng", "Ghi nhớ hình ảnh"], 1, "Suy lý là hình thức tư duy liên kết các phán đoán để tạo kết luận."],
  ["rational", "Một người so sánh thông tin từ sách, báo khoa học và dữ liệu thực tế. Đây là biểu hiện của gì?", ["Cảm tính", "Lý tính", "Mê tín", "Chủ quan"], 1, "Đối chiếu và phân tích là hoạt động lý tính."],
  ["rational", "Nhận thức lý tính giúp con người vượt qua điều gì?", ["Bản chất", "Quy luật", "Hiện tượng bề ngoài", "Kiểm chứng"], 2, "Lý tính giúp không dừng lại ở cái thấy ngay trước mắt."],
  ["rational", "Khi một kết luận mâu thuẫn với dữ kiện, thái độ hợp lý là gì?", ["Giữ kết luận vì thích", "Sửa kết luận theo dữ kiện", "Bỏ qua dữ kiện", "Hỏi số đông"], 1, "Tư duy lý tính cần nhất quán với dữ kiện đã được kiểm tra."],
  ["rational", "Câu 'mọi thông tin viral đều đúng' sai vì điều gì?", ["Khái quát vội vàng", "Quá nhiều bằng chứng", "Đúng tuyệt đối", "Được kiểm nghiệm"], 0, "Từ một vài hiện tượng không thể vội rút ra quy luật phổ biến."],

  ["practice", "Một AI trả lời 'thông tin này đúng'. Bạn quyết định kiểm tra bằng nguồn chính thống. Điều này thể hiện gì?", ["Niềm tin cá nhân", "Chủ nghĩa duy tâm", "Thực tiễn kiểm nghiệm chân lý", "Cảm giác"], 2, "Thực tiễn và nguồn đáng tin là tiêu chuẩn để kiểm tra kết luận."],
  ["practice", "Theo CNDVBC, tiêu chuẩn kiểm nghiệm chân lý là gì?", ["Cảm giác", "Số đông", "Thực tiễn", "Lượt chia sẻ"], 2, "Thực tiễn là tiêu chuẩn khách quan để kiểm nghiệm chân lý."],
  ["practice", "Bạn thử áp dụng một phương pháp học và đo kết quả sau 2 tuần. Việc này thuộc vai trò nào của thực tiễn?", ["Kiểm nghiệm nhận thức", "Tưởng tượng", "Tin đồn", "Cảm xúc"], 0, "Kết quả thực tế giúp kiểm tra nhận định ban đầu."],
  ["practice", "Một giả thuyết khoa học cần điều gì để được chấp nhận?", ["Nghe hay", "Nhiều người thích", "Thực nghiệm và kiểm chứng", "Hình ảnh đẹp"], 2, "Khoa học cần bằng chứng thực nghiệm, không chỉ lời khẳng định."],
  ["practice", "Thực tiễn là cơ sở của nhận thức vì sao?", ["Nó tạo ra nhu cầu và cung cấp chất liệu cho nhận thức", "Nó thay thế tư duy", "Nó luôn đơn giản", "Nó là cảm giác thuần túy"], 0, "Hoạt động thực tiễn đặt ra vấn đề và cung cấp dữ liệu cho nhận thức."],
  ["practice", "Một review quán ăn có thể kiểm chứng tốt nhất bằng cách nào?", ["Chỉ đọc tiêu đề", "So sánh nhiều nguồn và trải nghiệm thực tế", "Tin bình luận đầu tiên", "Tin ảnh quảng cáo"], 1, "Kiểm chứng cần nhiều nguồn và đối chiếu với thực tế."],
  ["practice", "Nếu lý thuyết không phù hợp thực tế, cần làm gì?", ["Điều chỉnh qua kiểm nghiệm", "Cấm kiểm tra", "Tin tuyệt đối", "Bỏ mọi dữ kiện"], 0, "Nhận thức phải được bổ sung, phát triển qua thực tiễn."],
  ["practice", "Hoạt động nào là thực tiễn?", ["Sản xuất, thí nghiệm, hoạt động xã hội", "Mơ mộng", "Nhìn thoáng qua", "Đoán mò"], 0, "Thực tiễn là hoạt động vật chất có mục đích mang tính lịch sử - xã hội."],
  ["practice", "Khi fact-check một tin y tế, nguồn nào đáng dùng hơn?", ["Bài đăng không nguồn", "Cơ quan y tế và nghiên cứu khoa học", "Tin nhắn chuyển tiếp", "Ảnh chế"], 1, "Nguồn chuyên môn và dữ liệu thực tế giúp kiểm nghiệm đáng tin hơn."],
  ["practice", "Thực tiễn có vai trò nào đối với chân lý?", ["Là tiêu chuẩn kiểm nghiệm", "Là cảm xúc", "Là số lượt xem", "Là sự tưởng tượng"], 0, "Chân lý cần được thực tiễn xác nhận."],

  ["truth", "Một thông tin đúng trong hoàn cảnh này nhưng sai trong hoàn cảnh khác. Điều này thể hiện gì?", ["Tính cụ thể của chân lý", "Chân lý không khách quan", "Chủ nghĩa tương đối cực đoan", "Không tồn tại chân lý"], 0, "Chân lý luôn cụ thể, gắn với điều kiện, hoàn cảnh xác định."],
  ["truth", "Chân lý theo CNDVBC là gì?", ["Tri thức phù hợp hiện thực khách quan và được thực tiễn kiểm nghiệm", "Điều ai cũng thích", "Ý kiến của người nổi tiếng", "Cảm giác mạnh nhất"], 0, "Chân lý không phụ thuộc sở thích cá nhân mà phải phù hợp hiện thực khách quan."],
  ["truth", "Tính khách quan của chân lý nghĩa là gì?", ["Nội dung chân lý phù hợp khách thể", "Ai tin thì đúng", "Do cảm xúc quyết định", "Không cần thực tế"], 0, "Chân lý khách quan vì nội dung phản ánh đúng hiện thực khách quan."],
  ["truth", "Chân lý tuyệt đối và chân lý tương đối có quan hệ thế nào?", ["Tách rời hoàn toàn", "Thống nhất biện chứng", "Không liên quan", "Chỉ có tuyệt đối"], 1, "Mỗi chân lý tương đối có yếu tố tuyệt đối và góp phần tiến tới nhận thức đầy đủ hơn."],
  ["truth", "Một kết luận đúng nhưng còn cần bổ sung khi có dữ liệu mới là gì?", ["Chân lý tương đối", "Sai hoàn toàn", "Cảm giác", "Tin đồn"], 0, "Chân lý tương đối phản ánh đúng nhưng chưa đầy đủ, còn phát triển."],
  ["truth", "Câu nào phù hợp với quan điểm duy vật biện chứng về chân lý?", ["Chân lý vừa khách quan vừa cụ thể", "Chân lý chỉ là ý thích", "Số đông tạo ra chân lý", "AI tạo ra chân lý"], 0, "CNDVBC khẳng định chân lý có tính khách quan, cụ thể và được thực tiễn kiểm nghiệm."],
  ["truth", "Vì sao không thể lấy lượt share làm tiêu chuẩn chân lý?", ["Vì lượt share không chứng minh phù hợp hiện thực", "Vì số đông luôn sai", "Vì share là thực nghiệm", "Vì cảm giác luôn đúng"], 0, "Sự phổ biến xã hội không thay thế được kiểm chứng khách quan."],
  ["truth", "Một nhận định y học đúng cần điều kiện nào?", ["Phù hợp bằng chứng và hoàn cảnh áp dụng", "Nghe đáng sợ", "Được lan truyền nhanh", "Có ảnh minh họa"], 0, "Chân lý cụ thể phải xét điều kiện áp dụng."],
  ["truth", "Khi phát hiện kết luận cũ thiếu dữ kiện, thái độ khoa học là gì?", ["Bổ sung, phát triển nhận thức", "Xóa mọi tri thức", "Cố chấp", "Chỉ hỏi AI"], 0, "Nhận thức chân lý là quá trình phát triển."],
  ["truth", "Điều nào không phải đặc điểm cần nhấn mạnh của chân lý?", ["Khách quan", "Cụ thể", "Được thực tiễn kiểm nghiệm", "Phụ thuộc lượt thích"], 3, "Lượt thích không phải tiêu chuẩn chân lý."],

  ["life", "Một clip nói uống nước muối chữa mọi bệnh. Bạn nên làm gì?", ["Làm theo ngay", "Kiểm tra nguồn y tế chính thống", "Share để cứu người", "Tin vì nhiều bình luận"], 1, "Thông tin sức khỏe cần kiểm chứng bằng nguồn chuyên môn."],
  ["life", "AI bịa tên một cuốn sách không có thật. Bài học nhận thức là gì?", ["AI luôn đúng", "Cần kiểm tra nguồn", "Tin nếu câu văn hay", "Không cần học nữa"], 1, "AI có thể tạo câu trả lời sai, nên cần đối chiếu nguồn."],
  ["life", "Một tin đồn trường đổi lịch thi lan nhanh trong nhóm chat. Cách xử lý tốt nhất?", ["Hỏi phòng đào tạo hoặc thông báo chính thức", "Tin người gửi đầu tiên", "Đăng lại ngay", "Chọn theo linh cảm"], 0, "Nguồn chính thức giúp kiểm chứng thông tin liên quan thực tế."],
  ["life", "Bạn thấy review 1 sao nhưng không có bằng chứng. Nên kết luận thế nào?", ["Cửa hàng chắc chắn tệ", "Cần thêm dữ kiện", "Review nào cũng đúng", "Bỏ qua mọi review"], 1, "Một dữ kiện đơn lẻ chưa đủ để kết luận bản chất."],
  ["life", "Một KOL nói một môn học vô dụng. Đánh giá hợp lý là gì?", ["Tin vì nổi tiếng", "Xem mục tiêu, nội dung và ứng dụng thực tế", "Ghét môn đó ngay", "Chỉ hỏi bạn bè"], 1, "Lý tính đòi hỏi phân tích điều kiện và giá trị thực tiễn."],
  ["life", "Bạn thấy ảnh trước/sau giảm cân rất ấn tượng. Dấu hiệu nào cần cảnh giác?", ["Không có nguồn, không có phương pháp rõ ràng", "Ảnh đẹp", "Có màu sắc", "Có chữ lớn"], 0, "Ảnh có thể gây ấn tượng cảm tính nhưng chưa đủ bằng chứng."],
  ["life", "Một app học tập quảng cáo 'giỏi sau 3 ngày'. Bạn nên làm gì?", ["Tin ngay", "Tìm đánh giá, phương pháp và thử nghiệm hợp lý", "Mua vì giảm giá", "Share cho lớp"], 1, "Cần phân tích cơ sở và kiểm chứng bằng trải nghiệm thực tế."],
  ["life", "Câu hỏi nào giúp tránh fake news tốt nhất?", ["Nguồn ở đâu?", "Có bao nhiêu emoji?", "Ai share đầu tiên?", "Màu ảnh có đẹp không?"], 0, "Nguồn là điểm khởi đầu quan trọng của kiểm chứng."],
  ["life", "Khi hai nguồn mâu thuẫn, việc nào hợp lý?", ["Đối chiếu nguồn gốc, bằng chứng và chuyên môn", "Chọn nguồn giật tít hơn", "Tin nguồn mình thích", "Không cần biết"], 0, "Mâu thuẫn dữ kiện cần được phân tích và kiểm chứng."],
  ["life", "Một thông tin nghe hợp lý nhưng không có bằng chứng. Nó nên được xem là gì?", ["Kết luận cuối cùng", "Giả thuyết cần kiểm chứng", "Chân lý tuyệt đối", "Thực tiễn"], 1, "Điều nghe hợp lý vẫn phải qua kiểm chứng."],
].map(([category, question, options, answer, explanation], index) => ({
  id: index + 1,
  category,
  question,
  options,
  answer,
  explanation
}));

const CATEGORIES = {
  sensory: "Nhận thức cảm tính",
  rational: "Nhận thức lý tính",
  practice: "Vai trò thực tiễn",
  truth: "Chân lý",
  life: "Vận dụng đời sống"
};

const CATEGORY_THEORY = {
  sensory: "Nhận thức cảm tính là giai đoạn đầu, phản ánh sự vật qua cảm giác, tri giác và biểu tượng.",
  rational: "Nhận thức lý tính dùng khái niệm, phán đoán và suy lý để đi sâu vào bản chất.",
  practice: "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  truth: "Chân lý là tri thức phù hợp hiện thực khách quan và được thực tiễn kiểm nghiệm; chân lý có tính khách quan, cụ thể.",
  life: "Tình huống đời sống giúp vận dụng lộ trình nhận thức: quan sát, phân tích, kiểm chứng và kết luận."
};

const STUDY_PATH = ["sensory", "rational", "practice", "truth"];

const MODES = [
  { id: "practice", name: "Luyện tập tổng hợp", desc: "Làm 10 câu ngẫu nhiên để ôn toàn bộ quá trình nhận thức và chân lý.", pool: ["sensory", "rational", "practice", "truth", "life"] },
  { id: "case", name: "Vụ án nhận thức", desc: "Đi theo 5 bước điều tra: quan sát, thu thập dữ kiện, phân tích, kiểm nghiệm và kết luận.", pool: ["sensory", "rational", "practice", "truth", "life"] },
  { id: "test", name: "Kiểm tra 5 phút", desc: "Làm bài có đồng hồ đếm ngược để tự đánh giá mức độ nắm kiến thức.", pool: ["sensory", "rational", "practice", "truth", "life"], timed: true }
];

const CASES = [
  {
    title: "Hồ sơ AI",
    claim: "AI khẳng định: Con người chỉ sử dụng 10% bộ não.",
    context: "Một bài đăng trích câu trả lời AI, nhận được nhiều chia sẻ và bình luận tin tưởng."
  },
  {
    title: "Hồ sơ y tế",
    claim: "Uống nước muối mỗi sáng có thể chữa hầu hết bệnh thường gặp.",
    context: "Thông tin được lan truyền trong nhóm chat lớp với giọng điệu rất chắc chắn."
  },
  {
    title: "Hồ sơ mạng xã hội",
    claim: "Một video viral chứng minh học triết không có giá trị thực tế.",
    context: "Video có nhiều lượt xem, nhiều bình luận đồng tình nhưng không dẫn nguồn."
  },
  {
    title: "Hồ sơ review giả",
    claim: "Một review 1 sao kết luận toàn bộ dịch vụ là lừa đảo.",
    context: "Review có lời lẽ mạnh, ảnh chụp mờ và không có bằng chứng đối chiếu."
  }
];

const CASE_STEPS = [
  {
    title: "Bước 1: Quan sát hiện tượng",
    category: "sensory",
    question: "Ở bước đầu tiên, thái độ phù hợp nhất là gì?",
    options: ["Tin ngay vì thông tin viral", "Chia sẻ để hỏi ý kiến", "Ghi nhận thông tin và giữ thái độ nghi ngờ", "Bác bỏ ngay lập tức"],
    answer: 2,
    explanation: "Đây là giai đoạn tiếp xúc ban đầu với hiện tượng. Ta chưa đủ cơ sở kết luận đúng/sai."
  },
  {
    title: "Bước 2: Thu thập dữ kiện",
    category: "sensory",
    question: "Dữ kiện nào cần được ưu tiên kiểm tra?",
    options: ["Số lượt thích", "Nguồn gốc, bằng chứng và bối cảnh", "Bình luận cảm xúc", "Cách viết có vẻ tự tin"],
    answer: 1,
    explanation: "Dữ kiện cảm tính là chất liệu ban đầu để chuyển sang phân tích lý tính."
  },
  {
    title: "Bước 3: Phân tích lý tính",
    category: "rational",
    question: "Sau khi có dữ kiện, thao tác nào thể hiện nhận thức lý tính?",
    options: ["Chọn theo cảm giác", "Đối chiếu nguồn và phân tích logic", "Tin theo số đông", "Dừng lại ở hình ảnh ban đầu"],
    answer: 1,
    explanation: "Nhận thức lý tính dùng khái niệm, phán đoán và suy lý để tìm bản chất."
  },
  {
    title: "Bước 4: Kiểm nghiệm thực tiễn",
    category: "practice",
    question: "Điều gì giúp kết luận đáng tin hơn?",
    options: ["Cảm giác cá nhân", "Kiểm chứng bằng nguồn đáng tin và thực tế", "Một bình luận nổi bật", "AI trả lời tự tin"],
    answer: 1,
    explanation: "Thực tiễn là tiêu chuẩn kiểm nghiệm chân lý, giúp xác nhận hoặc bác bỏ nhận thức."
  },
  {
    title: "Bước 5: Kết luận chân lý",
    category: "truth",
    question: "Khi nào kết luận có thể xem là gần với chân lý hơn?",
    options: ["Khi được nhiều người thích", "Khi phù hợp hiện thực khách quan và được kiểm nghiệm", "Khi nghe hợp lý", "Khi được lặp lại nhiều lần"],
    answer: 1,
    explanation: "Chân lý là tri thức phù hợp với hiện thực khách quan và được thực tiễn kiểm nghiệm."
  }
];

const app = document.querySelector("#app");
const playerNameView = document.querySelector("#playerNameView");
const roleView = document.querySelector("#roleView");
const playsView = document.querySelector("#playsView");
const lastScoreView = document.querySelector("#lastScoreView");
const themeToggle = document.querySelector("#themeToggle");
const adminNav = document.querySelector("#adminNav");

let profile = load("truthProfile", { name: "Khách", className: "", role: "player", plays: 0, lastScore: 0 });
let leaderboard = load("truthLeaderboard", []);
let selectedMode = MODES[0].id;
let selectedCategory = "all";
let quiz = null;

function hasFirebaseConfig() {
  const config = firebaseSettings?.config || {};
  return Boolean(
    firebaseSettings?.enabled &&
    config.apiKey &&
    config.projectId &&
    !String(config.apiKey).includes("YOUR_") &&
    !String(config.projectId).includes("YOUR_")
  );
}

async function initFirebase() {
  if (!hasFirebaseConfig()) return;

  try {
    const [appModule, firestoreModule, authModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js")
    ]);

    firebaseApi = firestoreModule;
    authApi = authModule;
    const appInstance = appModule.initializeApp(firebaseSettings.config);
    db = firestoreModule.getFirestore(appInstance);
    auth = authModule.getAuth(appInstance);
    leaderboardMode = "firebase";
    authModule.onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      try {
        if (user) {
          await loadCloudProfile(user);
        } else {
          profile = load("truthProfile", { name: "Khách", className: "", role: "player", plays: 0, lastScore: 0 });
        }
      } catch (error) {
        console.warn("Could not load cloud profile, using local profile.", error);
        profile = load("truthProfile", getDefaultProfile(user));
      }
      syncHud();
      if (currentView === "profile") renderProfile();
      if (currentView === "home") renderHome();
    });
  } catch (error) {
    console.warn("Firebase init failed, using local leaderboard.", error);
    db = null;
    auth = null;
    authApi = null;
    leaderboardMode = "local";
  }
}

function getLeaderboardLabel() {
  return leaderboardMode === "firebase" ? "Bảng xếp hạng chung" : "Bảng xếp hạng cá nhân";
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getDefaultProfile(user = null) {
  return {
    name: user?.displayName || user?.email?.split("@")[0] || "Khách",
    className: "",
    email: user?.email || "",
    role: "player",
    plays: 0,
    lastScore: 0
  };
}

function isAdmin() {
  return profile.role === "admin";
}

async function loadCloudProfile(user) {
  if (!db || !firebaseApi || !user) return;

  const ref = firebaseApi.doc(db, "users", user.uid);
  const snapshot = await firebaseApi.getDoc(ref);

  if (snapshot.exists()) {
    profile = { ...getDefaultProfile(user), ...snapshot.data(), email: user.email || "" };
  } else {
    profile = getDefaultProfile(user);
    await firebaseApi.setDoc(ref, {
      ...profile,
      createdAt: firebaseApi.serverTimestamp(),
      updatedAt: firebaseApi.serverTimestamp()
    });
  }
}

async function saveCloudProfile() {
  if (!db || !firebaseApi || !currentUser) {
    save("truthProfile", profile);
    return;
  }

  try {
    await firebaseApi.setDoc(
      firebaseApi.doc(db, "users", currentUser.uid),
      {
        name: profile.name,
        className: profile.className,
        email: currentUser.email || profile.email || "",
        plays: profile.plays,
        lastScore: profile.lastScore || 0,
        updatedAt: firebaseApi.serverTimestamp()
      },
      { merge: true }
    );

    if (authApi && auth && auth.currentUser && auth.currentUser.displayName !== profile.name) {
      await authApi.updateProfile(auth.currentUser, { displayName: profile.name });
    }
  } catch (error) {
    console.warn("Could not save cloud profile, using local fallback.", error);
    save("truthProfile", profile);
  }
}

function canUseCloudLeaderboard() {
  return Boolean(db && firebaseApi && currentUser);
}

function normalizeQuestion(question, index = 0) {
  return {
    id: question.id || `cloud-${Date.now()}-${index}`,
    category: question.category,
    question: question.question,
    options: question.options,
    answer: Number(question.answer),
    explanation: question.explanation || "Hãy đối chiếu đáp án với khái niệm lý thuyết liên quan.",
    source: question.source || "local"
  };
}

async function loadCloudQuestions() {
  questionBank = QUESTION_BANK.map((item) => ({ ...item, source: "local" }));

  if (!db || !firebaseApi) return;

  try {
    const snapshot = await firebaseApi.getDocs(
      firebaseApi.query(firebaseApi.collection(db, "questions"), firebaseApi.limit(80))
    );
    const cloudQuestions = snapshot.docs
      .map((doc, index) => normalizeQuestion({ id: doc.id, ...doc.data(), source: "cloud" }, index))
      .filter((item) => item.category && item.question && Array.isArray(item.options) && item.options.length === 4);
    questionBank = [...questionBank, ...cloudQuestions];
  } catch (error) {
    console.warn("Could not load cloud questions, using local bank.", error);
  }
}

async function saveCloudQuestion(question) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.addDoc(firebaseApi.collection(db, "questions"), {
    ...question,
    createdBy: currentUser.uid,
    createdAt: firebaseApi.serverTimestamp()
  });
  await loadCloudQuestions();
}

async function updateCloudQuestion(questionId, question) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.updateDoc(firebaseApi.doc(db, "questions", questionId), {
    ...question,
    updatedAt: firebaseApi.serverTimestamp()
  });
  await loadCloudQuestions();
}

async function deleteCloudQuestion(questionId) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.deleteDoc(firebaseApi.doc(db, "questions", questionId));
  await loadCloudQuestions();
}

async function saveLeaderboardResult(result) {
  const normalizedResult = {
    name: result.name.slice(0, 28),
    className: (profile.className || "").slice(0, 36),
    userId: currentUser?.uid || "local",
    mode: result.mode,
    score: result.score,
    total: result.total,
    percent: result.percent,
    rank: result.rank,
    elapsed: result.elapsed,
    date: result.date,
    createdAtMs: Date.now()
  };

  if (canUseCloudLeaderboard()) {
    try {
      await firebaseApi.addDoc(firebaseApi.collection(db, "leaderboard"), {
        ...normalizedResult,
        createdAt: firebaseApi.serverTimestamp()
      });
      return;
    } catch (error) {
      console.warn("Could not save Firebase leaderboard result, using local fallback.", error);
      leaderboardMode = "local";
    }
  }

  leaderboard.unshift(normalizedResult);
  leaderboard = leaderboard
    .sort((a, b) => b.percent - a.percent || a.elapsed - b.elapsed || b.createdAtMs - a.createdAtMs)
    .slice(0, 20);
  save("truthLeaderboard", leaderboard);
}

async function saveAttempt(result) {
  const attempt = {
    userId: currentUser?.uid || "local",
    name: result.name.slice(0, 28),
    mode: result.mode,
    score: result.score,
    total: result.total,
    percent: result.percent,
    rank: result.rank,
    elapsed: result.elapsed,
    date: result.date,
    categoryStats: getCategoryStats(quiz.answers),
    createdAtMs: Date.now()
  };

  if (db && firebaseApi && currentUser) {
    try {
      await firebaseApi.addDoc(firebaseApi.collection(db, "users", currentUser.uid, "attempts"), {
        ...attempt,
        createdAt: firebaseApi.serverTimestamp()
      });
      return;
    } catch (error) {
      console.warn("Could not save cloud attempt, using local fallback.", error);
    }
  }

  const localAttempts = load("truthAttempts", []);
  localAttempts.unshift(attempt);
  save("truthAttempts", localAttempts.slice(0, 30));
}

async function getAttemptEntries() {
  if (db && firebaseApi && currentUser) {
    try {
      const snapshot = await firebaseApi.getDocs(
        firebaseApi.query(
          firebaseApi.collection(db, "users", currentUser.uid, "attempts"),
          firebaseApi.orderBy("createdAtMs", "desc"),
          firebaseApi.limit(12)
        )
      );
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn("Could not load cloud attempts, using local fallback.", error);
    }
  }

  return load("truthAttempts", []).slice(0, 12);
}

async function getAdminData() {
  if (!db || !firebaseApi || !isAdmin()) {
    return { users: [], leaderboardEntries: [] };
  }

  const [usersSnapshot, leaderboardSnapshot, questionsSnapshot] = await Promise.all([
    firebaseApi.getDocs(
      firebaseApi.query(firebaseApi.collection(db, "users"), firebaseApi.limit(100))
    ),
    firebaseApi.getDocs(
      firebaseApi.query(
        firebaseApi.collection(db, "leaderboard"),
        firebaseApi.orderBy("percent", "desc"),
        firebaseApi.limit(50)
      )
    ),
    firebaseApi.getDocs(
      firebaseApi.query(firebaseApi.collection(db, "questions"), firebaseApi.limit(50))
    )
  ]);

  return {
    users: usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    leaderboardEntries: leaderboardSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    questions: questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  };
}

async function updateUserRole(userId, role) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.updateDoc(firebaseApi.doc(db, "users", userId), {
    role,
    updatedAt: firebaseApi.serverTimestamp()
  });
}

async function deleteLeaderboardEntry(entryId) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.deleteDoc(firebaseApi.doc(db, "leaderboard", entryId));
}

function getAggregateStats(attempts) {
  const aggregate = {};

  attempts.forEach((attempt) => {
    Object.entries(attempt.categoryStats || {}).forEach(([category, stat]) => {
      aggregate[category] ||= { total: 0, correct: 0 };
      aggregate[category].total += stat.total || 0;
      aggregate[category].correct += stat.correct || 0;
    });
  });

  return aggregate;
}

function getWrongQuestionIds() {
  return load("truthWrongQuestionIds", []);
}

function saveWrongQuestionIds(ids) {
  save("truthWrongQuestionIds", [...new Set(ids)].slice(0, 30));
}

function getQuestionById(id) {
  return questionBank.find((item) => String(item.id) === String(id));
}

function getConceptTips(categoryStats) {
  const sorted = Object.entries(categoryStats).sort((a, b) => percent(a[1].correct, a[1].total) - percent(b[1].correct, b[1].total));
  const weakest = sorted[0]?.[0];
  const strongest = sorted[sorted.length - 1]?.[0];
  const reading = weakest === "life"
    ? "Nên đọc lại lộ trình cảm tính -> lý tính -> thực tiễn -> chân lý trong mục 2.3.2, rồi vận dụng vào tình huống đời sống."
    : weakest
      ? `Nên đọc lại phần ${CATEGORIES[weakest]} trong mục 2.3.2.`
      : "Nên đọc lại giáo trình từ trang 274 đến 283.";
  return {
    strongest: strongest ? CATEGORIES[strongest] : "Chưa đủ dữ liệu",
    weakest: weakest ? CATEGORIES[weakest] : "Chưa đủ dữ liệu",
    concepts: [
      "Nhận thức đi từ cảm tính đến lý tính.",
      "Thực tiễn là tiêu chuẩn kiểm nghiệm chân lý.",
      "Chân lý có tính khách quan và tính cụ thể."
    ],
    reading
  };
}

function renderKnowledgeMap(categoryStats) {
  const hasStudyData = STUDY_PATH.some((category) => categoryStats[category]?.total);
  return `
    <div class="knowledge-map">
      ${STUDY_PATH.map((category, index) => {
        const stat = categoryStats[category] || { total: 0, correct: 0 };
        const value = percent(stat.correct, stat.total);
        return `
          <div class="knowledge-step">
            <span>${index + 1}</span>
            <strong>${CATEGORIES[category]}</strong>
            <div class="meter"><span style="width:${value}%"></span></div>
            <small>${stat.total ? `${value}% đúng` : "Chưa có dữ liệu"}</small>
          </div>
        `;
      }).join("")}
    </div>
    ${hasStudyData ? "" : `<p class="muted" style="margin-top: 12px;">Lượt này chưa có câu thuộc 4 bước lý thuyết. Nếu muốn xem đủ bản đồ, hãy chọn "Trộn tất cả chủ đề" hoặc ôn từng chủ đề lý thuyết.</p>`}
  `;
}

function renderCategoryMeters(categoryStats) {
  const entries = Object.entries(categoryStats);
  if (!entries.length) {
    return `<p class="muted">Chưa có dữ liệu thống kê cho lượt này.</p>`;
  }

  return `
    <div class="category-meter">
      ${entries.map(([category, stat]) => {
        const value = percent(stat.correct, stat.total);
        return `
          <div class="meter-row">
            <span>${CATEGORIES[category]}</span>
            <div class="meter"><span style="width:${value}%"></span></div>
            <strong>${value}%</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderDeepExplanation(item, selectedIndex) {
  return `
    <div class="deep-explain">
      <p><strong>Vì sao đáp án đúng?</strong> ${item.explanation}</p>
      <p><strong>Vì sao các đáp án còn lại chưa đúng?</strong> Các lựa chọn khác hoặc dừng ở cảm giác/số đông, hoặc chưa có kiểm chứng, hoặc không đúng khái niệm của chủ đề ${CATEGORIES[item.category]}.</p>
      <p><strong>Liên hệ lý thuyết:</strong> ${CATEGORY_THEORY[item.category]}</p>
    </div>
  `;
}

async function getLeaderboardEntries() {
  if (db) {
    try {
      const snapshot = await firebaseApi.getDocs(
        firebaseApi.query(
          firebaseApi.collection(db, "leaderboard"),
          firebaseApi.orderBy("percent", "desc"),
          firebaseApi.limit(30)
        )
      );
      return snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.percent - a.percent || a.elapsed - b.elapsed || (b.createdAtMs || 0) - (a.createdAtMs || 0))
        .slice(0, 10);
    } catch (error) {
      console.warn("Could not load Firebase leaderboard, using local fallback.", error);
      leaderboardMode = "local";
    }
  }

  leaderboard = load("truthLeaderboard", []);
  return leaderboard
    .sort((a, b) => b.percent - a.percent || a.elapsed - b.elapsed || (b.createdAtMs || 0) - (a.createdAtMs || 0))
    .slice(0, 10);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function percent(value, total) {
  return total ? Math.round((value / total) * 100) : 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function getRank(scorePercent) {
  if (scorePercent >= 90) return "Nhà truy tìm chân lý";
  if (scorePercent >= 70) return "Bậc thầy lý tính";
  if (scorePercent >= 50) return "Đang tiến gần chân lý";
  return "Cần kiểm chứng thêm";
}

function syncHud() {
  playerNameView.textContent = profile.name || "Khách";
  roleView.textContent = isAdmin() ? "Quản lý" : "Người học";
  playsView.textContent = profile.plays || 0;
  lastScoreView.textContent = `${profile.lastScore || 0}%`;
  if (adminNav) adminNav.hidden = !isAdmin();
}

function setView(view) {
  currentView = view;
  if (unsubscribeLeaderboard && view !== "leaderboard") {
    unsubscribeLeaderboard();
    unsubscribeLeaderboard = null;
  }
  if (view === "admin") return renderAdmin();
  if (view === "profile") return renderProfile();
  if (view === "leaderboard") return renderLeaderboard();
  renderHome();
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("truthTheme", isDark ? "dark" : "light");
});

if (localStorage.getItem("truthTheme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}

function renderHome() {
  currentView = "home";
  const modeCards = MODES.map((mode) => `
    <button class="mode-card ${mode.id === selectedMode ? "active" : ""}" data-mode="${mode.id}">
      <strong>${mode.name}</strong>
      <span>${mode.desc}</span>
    </button>
  `).join("");

  app.innerHTML = `
    <div class="hero-grid">
      <section class="hero-copy">
      <p class="eyebrow">Nền tảng câu hỏi triết học tương tác</p>
      <h1>TRUY TÌM CHÂN LÝ</h1>
        <p class="lead">Chọn một hình thức luyện tập, trả lời câu hỏi, xem giải thích và nhận phiếu tổng kết để biết phần cần ôn.</p>
        <div class="chip-row">
          <span class="chip good">50 câu hỏi</span>
          <span class="chip">5 chủ đề</span>
          <span class="chip">Câu hỏi ngẫu nhiên</span>
          <span class="chip warn">${getLeaderboardLabel()}</span>
          <span class="chip ${currentUser ? "good" : "warn"}">${currentUser ? "Đã đăng nhập" : "Đăng nhập để lưu điểm"}</span>
        </div>
        <div class="hero-actions">
          <button class="primary-btn" id="quickStart">Bắt đầu làm câu hỏi</button>
          <button class="secondary-btn" id="reviewWrongBtn">Ôn câu sai</button>
          <button class="secondary-btn" data-jump="profile">Cập nhật hồ sơ</button>
        </div>
      </section>

      <aside class="panel">
        <h2>Chọn hình thức học</h2>
        <p class="muted">Mỗi hình thức có mục đích riêng: luyện tổng hợp, điều tra theo câu chuyện, hoặc kiểm tra nhanh trong 5 phút.</p>
        <div class="mode-grid">${modeCards}</div>

        <h3 style="margin-top: 20px;">Bộ câu hỏi</h3>
        <label class="field">
          <span>Chủ đề luyện tập</span>
          <select id="categorySelect">
            <option value="all">Trộn tất cả chủ đề</option>
            ${Object.entries(CATEGORIES).map(([id, name]) => `<option value="${id}" ${selectedCategory === id ? "selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
        <label class="field inline-field">
          <span>Đồng hồ 5 phút</span>
          <input id="timedModeInput" type="checkbox" ${timedMode ? "checked" : ""}>
        </label>
      </aside>
    </div>
  `;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMode = button.dataset.mode;
      renderHome();
    });
  });
  document.querySelector("#categorySelect").addEventListener("change", (event) => {
    selectedCategory = event.target.value;
  });
  document.querySelector("#timedModeInput").addEventListener("change", (event) => {
    timedMode = event.target.checked;
  });
  document.querySelector("#quickStart").addEventListener("click", startQuiz);
  document.querySelector("#reviewWrongBtn").addEventListener("click", startWrongReview);
  document.querySelector("[data-jump='profile']").addEventListener("click", renderProfile);
}

function startQuiz() {
  currentView = "quiz";
  const mode = MODES.find((item) => item.id === selectedMode);

  if (mode.id === "case") {
    startCaseInvestigation(mode);
    return;
  }

  let pool = questionBank.filter((question) => mode.pool.includes(question.category));

  if (selectedCategory !== "all") {
    pool = questionBank.filter((question) => question.category === selectedCategory);
  }

  quiz = {
    mode,
    questions: shuffle(pool).slice(0, 10),
    index: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    deadline: (timedMode || mode.timed) ? Date.now() + 5 * 60 * 1000 : null,
    caseFile: null
  };

  startTimer();
  renderQuestion();
}

function startCaseInvestigation(mode) {
  const caseFile = CASES[Math.floor(Math.random() * CASES.length)];
  quiz = {
    mode,
    questions: CASE_STEPS.map((step, index) => normalizeQuestion({
      id: `case-${index}`,
      category: step.category,
      question: step.question,
      options: step.options,
      answer: step.answer,
      explanation: step.explanation,
      source: "case"
    }, index)),
    steps: CASE_STEPS,
    index: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    deadline: (timedMode || mode.timed) ? Date.now() + 5 * 60 * 1000 : null,
    caseFile
  };
  startTimer();
  renderQuestion();
}

function startWrongReview() {
  const wrongQuestions = getWrongQuestionIds().map(getQuestionById).filter(Boolean);
  if (!wrongQuestions.length) {
    alert("Chưa có câu sai để ôn. Hãy làm một lượt câu hỏi trước.");
    return;
  }

  quiz = {
    mode: { id: "review", name: "Ôn lại câu sai", pool: [] },
    questions: shuffle(wrongQuestions).slice(0, 10),
    index: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    deadline: null,
    caseFile: { title: "Ôn lại câu sai", claim: "Luyện lại đúng những câu từng trả lời sai.", context: "" }
  };
  currentView = "quiz";
  renderQuestion();
}

function startTimer() {
  if (timerId) clearInterval(timerId);
  if (!quiz?.deadline) return;
  timerId = setInterval(() => {
    const left = quiz.deadline - Date.now();
    const timer = document.querySelector("#timerView");
    if (timer) timer.textContent = formatTime(left);
    if (left <= 0) {
      clearInterval(timerId);
      timerId = null;
      finishQuiz();
    }
  }, 1000);
}

function formatTime(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minute = Math.floor(seconds / 60);
  const second = String(seconds % 60).padStart(2, "0");
  return `${minute}:${second}`;
}

function renderQuestion() {
  const item = quiz.questions[quiz.index];
  const progress = percent(quiz.index, quiz.questions.length);
  const step = quiz.steps?.[quiz.index];

  app.innerHTML = `
    <div class="play-grid">
      <section class="question-panel">
        <div class="progress-line"><span style="width:${progress}%"></span></div>
        <div class="question-meta">
          <span class="chip">${quiz.mode.name}</span>
          <span class="chip">${CATEGORIES[item.category]}</span>
          <span class="chip">Câu ${quiz.index + 1}/${quiz.questions.length}</span>
          ${quiz.deadline ? `<span class="chip warn" id="timerView">${formatTime(quiz.deadline - Date.now())}</span>` : ""}
        </div>
        ${quiz.caseFile ? `
          <div class="case-note">
            <strong>${quiz.caseFile.title}</strong>
            <p>${quiz.caseFile.context}</p>
            <p><strong>Thông tin cần điều tra:</strong> ${quiz.caseFile.claim}</p>
            ${step ? `<p><strong>${step.title}</strong></p>` : ""}
          </div>
        ` : ""}
        <p class="question-text">${item.question}</p>
        <div class="answers">
          ${item.options.map((option, index) => `
            <button class="answer-btn" data-answer="${index}">
              <span class="answer-key">${String.fromCharCode(65 + index)}</span>
              <span>${option}</span>
            </button>
          `).join("")}
        </div>
        <div id="feedback" class="feedback"></div>
        <div class="row-actions">
          <button class="primary-btn" id="nextQuestion" disabled>${quiz.index === quiz.questions.length - 1 ? "Xem kết quả học tập" : "Câu tiếp theo"}</button>
          <button class="secondary-btn" id="quitQuiz">Dừng bài</button>
        </div>
      </section>

      <aside class="side-panel">
        <h2>Tiến trình làm bài</h2>
        <div class="stats-grid">
          <div class="stat-card"><span>Điểm</span><strong>${quiz.score}/${quiz.questions.length}</strong></div>
          <div class="stat-card"><span>Đúng</span><strong>${percent(quiz.score, Math.max(quiz.index, 1))}%</strong></div>
        </div>
        <p class="muted" style="margin-top: 16px;">Mỗi lượt lấy một bộ câu hỏi ngẫu nhiên để bạn luyện đủ 5 nhóm kiến thức.</p>
      </aside>
    </div>
  `;

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => chooseAnswer(Number(button.dataset.answer)));
  });
  document.querySelector("#nextQuestion").addEventListener("click", () => {
    if (quiz.index === quiz.questions.length - 1) return finishQuiz();
    quiz.index += 1;
    renderQuestion();
  });
  document.querySelector("#quitQuiz").addEventListener("click", () => {
    if (timerId) clearInterval(timerId);
    renderHome();
  });
}

function chooseAnswer(answerIndex) {
  const item = quiz.questions[quiz.index];
  const isCorrect = answerIndex === item.answer;
  const feedback = document.querySelector("#feedback");

  if (isCorrect) quiz.score += 1;
  quiz.answers.push({ id: item.id, category: item.category, correct: isCorrect, selected: answerIndex });

  document.querySelectorAll("[data-answer]").forEach((button) => {
    const index = Number(button.dataset.answer);
    button.disabled = true;
    if (index === item.answer) button.classList.add("correct");
    if (index === answerIndex && !isCorrect) button.classList.add("incorrect");
  });

  feedback.className = `feedback show ${isCorrect ? "good" : "bad"}`;
  feedback.innerHTML = `<strong>${isCorrect ? "Đúng rồi." : "Chưa chính xác."}</strong> ${renderDeepExplanation(item, answerIndex)}`;
  document.querySelector("#nextQuestion").disabled = false;
}

async function finishQuiz() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  const elapsed = Math.max(1, Math.round((Date.now() - quiz.startedAt) / 1000));
  const scorePercent = percent(quiz.score, quiz.questions.length);
  const result = {
    name: profile.name || "Khách",
    mode: quiz.mode.name,
    score: quiz.score,
    total: quiz.questions.length,
    percent: scorePercent,
    rank: getRank(scorePercent),
    elapsed,
    date: new Date().toLocaleDateString("vi-VN")
  };

  profile.plays += 1;
  profile.lastScore = scorePercent;
  await saveCloudProfile();

  await saveLeaderboardResult(result);
  await saveAttempt(result);
  saveWrongQuestionIds(quiz.answers.filter((answer) => !answer.correct).map((answer) => answer.id));
  syncHud();
  renderResult(result);
}

function getAchievements(result) {
  const byCategory = getCategoryStats(quiz.answers);
  const noSensoryMistake = quiz.answers.every((answer) => answer.category !== "sensory" || answer.correct);
  const rationalFull = byCategory.rational?.correct === byCategory.rational?.total && byCategory.rational?.total > 0;
  const practiceFull = byCategory.practice?.correct === byCategory.practice?.total && byCategory.practice?.total > 0;

  return [
    { name: "Nhà truy tìm chân lý", desc: "Đạt trên 90%", unlocked: result.percent >= 90 },
    { name: "Bậc thầy lý tính", desc: "Đúng toàn bộ câu lý tính", unlocked: rationalFull },
    { name: "Kẻ hoài nghi thông minh", desc: "Không sai câu cảm tính", unlocked: noSensoryMistake },
    { name: "Fact-check Master", desc: "Full điểm phần thực tiễn", unlocked: practiceFull }
  ];
}

function getCategoryStats(answers) {
  return answers.reduce((stats, answer) => {
    stats[answer.category] ||= { total: 0, correct: 0 };
    stats[answer.category].total += 1;
    if (answer.correct) stats[answer.category].correct += 1;
    return stats;
  }, {});
}

function renderResult(result) {
  currentView = "result";
  const achievements = getAchievements(result);
  const categoryStats = getCategoryStats(quiz.answers);
  const tips = getConceptTips(categoryStats);
  const wrongCount = quiz.answers.filter((answer) => !answer.correct).length;
  const summaryText = `Tôi đạt ${result.score}/${result.total} (${result.percent}%). Mạnh ở: ${tips.strongest}. Cần ôn: ${tips.weakest}. ${tips.reading}`;
  const shareText = `${summaryText} - TRUY TÌM CHÂN LÝ.`;

  app.innerHTML = `
    <div class="result-grid">
      <section class="panel">
        <p class="eyebrow">Kết quả học tập</p>
        <h2 class="result-title">${result.rank}</h2>
        <div class="stats-grid">
          <div class="stat-card"><span>Điểm</span><strong>${result.score}/${result.total}</strong></div>
          <div class="stat-card"><span>Tỷ lệ đúng</span><strong>${result.percent}%</strong></div>
          <div class="stat-card"><span>Thời gian</span><strong>${result.elapsed}s</strong></div>
          <div class="stat-card"><span>Nhận xét</span><strong>${result.percent >= 70 ? "Ổn" : "Cần ôn"}</strong></div>
        </div>

        <h3 style="margin-top: 22px;">Huy hiệu học tập</h3>
        <div class="achievement-grid">
          ${achievements.map((item) => `
            <div class="achievement-card ${item.unlocked ? "" : "locked"}">
              <strong>${item.unlocked ? "Đạt" : "Chưa đạt"} - ${item.name}</strong>
              <span class="muted">${item.desc}</span>
            </div>
          `).join("")}
        </div>

        <h3 style="margin-top: 22px;">Phiếu tổng kết học tập</h3>
        <div class="summary-sheet">
          <p><strong>Bạn mạnh ở:</strong> ${tips.strongest}</p>
          <p><strong>Cần ôn:</strong> ${tips.weakest}</p>
          <p><strong>3 khái niệm cần nhớ:</strong> ${tips.concepts.join(" - ")}</p>
          <p><strong>Gợi ý đọc lại:</strong> ${tips.reading}</p>
        </div>

        <div class="result-actions">
          <button class="primary-btn" id="playAgain">Làm bộ câu hỏi khác</button>
          <button class="secondary-btn" id="reviewWrongResult" ${wrongCount ? "" : "disabled"}>Ôn lại câu sai</button>
          <button class="secondary-btn" id="shareResult">Chia sẻ kết quả</button>
          <button class="secondary-btn" id="copyResult">Sao chép phiếu tổng kết</button>
        </div>
      </section>

      <aside class="panel">
        <h2>Phân tích học tập</h2>
        <h3>Bản đồ kiến thức</h3>
        ${renderKnowledgeMap(categoryStats)}
        <h3 style="margin-top: 18px;">Thống kê theo phần đã làm</h3>
        ${renderCategoryMeters(categoryStats)}
        <p class="muted" style="margin-top: 18px;">Bản đồ kiến thức bám 4 bước lý thuyết của bài học. Phần vận dụng đời sống dùng để kiểm tra khả năng áp dụng 4 bước đó vào tình huống thực tế.</p>
      </aside>
    </div>
  `;

  document.querySelector("#playAgain").addEventListener("click", startQuiz);
  document.querySelector("#reviewWrongResult").addEventListener("click", startWrongReview);
  document.querySelector("#copyResult").addEventListener("click", () => copyShareText(summaryText));
  document.querySelector("#shareResult").addEventListener("click", async () => {
    if (navigator.share) {
      await navigator.share({ title: "TRUY TÌM CHÂN LÝ", text: shareText, url: location.href });
    } else {
      copyShareText(shareText);
    }
  });
}

async function copyShareText(text) {
  const shareValue = `${text} ${location.href}`;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(shareValue);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = shareValue;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  alert("Đã copy kết quả để chia sẻ.");
}

async function handleAuth(action) {
  const email = document.querySelector("#emailInput")?.value.trim();
  const password = document.querySelector("#passwordInput")?.value;
  const message = document.querySelector("#authMessage");

  if (!email || !password) {
    if (message) message.textContent = "Vui lòng nhập email và mật khẩu.";
    return;
  }

  try {
    if (message) message.textContent = "Đang xử lý...";

    if (action === "register") {
      const credential = await authApi.createUserWithEmailAndPassword(auth, email, password);
      const suggestedName = profile.name && profile.name !== "Khách" ? profile.name : email.split("@")[0];
      await authApi.updateProfile(credential.user, { displayName: suggestedName });
      currentUser = credential.user;
      profile = { ...getDefaultProfile(credential.user), name: suggestedName };
      await saveCloudProfile();
    } else {
      await authApi.signInWithEmailAndPassword(auth, email, password);
    }

    await loadCloudProfile(auth.currentUser);
    syncHud();
    renderProfile();
  } catch (error) {
    const friendly = {
      "auth/email-already-in-use": "Email này đã được đăng ký.",
      "auth/invalid-email": "Email không hợp lệ.",
      "auth/weak-password": "Mật khẩu nên có ít nhất 6 ký tự.",
      "auth/invalid-credential": "Email hoặc mật khẩu chưa đúng.",
      "auth/user-not-found": "Chưa có tài khoản với email này.",
      "auth/wrong-password": "Mật khẩu chưa đúng.",
      "auth/operation-not-allowed": "Chức năng đăng nhập bằng email chưa được bật.",
      "auth/configuration-not-found": "Chức năng đăng nhập chưa được cấu hình hoàn chỉnh.",
      "auth/network-request-failed": "Không kết nối được hệ thống lưu dữ liệu. Kiểm tra mạng hoặc chặn trình duyệt.",
      "auth/too-many-requests": "Hệ thống đang tạm chặn do thử quá nhiều lần. Đợi một lát rồi thử lại."
    };
    if (message) {
      message.textContent = friendly[error.code] || "Không xử lý được tài khoản. Vui lòng thử lại sau.";
    }
  }
}

async function handlePasswordReset() {
  const email = document.querySelector("#emailInput")?.value.trim();
  const message = document.querySelector("#authMessage");

  if (!email) {
    if (message) message.textContent = "Nhập email trước để nhận link đặt lại mật khẩu.";
    return;
  }

  try {
    await authApi.sendPasswordResetEmail(auth, email);
    if (message) message.textContent = "Đã gửi email đặt lại mật khẩu. Kiểm tra hộp thư của bạn.";
  } catch (error) {
    if (message) message.textContent = "Không gửi được email đặt lại mật khẩu. Kiểm tra email hoặc cấu hình Authentication.";
  }
}

async function renderProfile() {
  currentView = "profile";
  const attempts = await getAttemptEntries();
  const aggregateStats = getAggregateStats(attempts);
  const isCloudReady = Boolean(auth && db);
  const authPanel = !isCloudReady
    ? `
      <div class="panel">
        <h2>Tài khoản</h2>
        <p class="muted">Chưa thể đồng bộ tài khoản, hồ sơ đang lưu trên trình duyệt này.</p>
      </div>
    `
    : currentUser
      ? `
        <div class="panel">
          <h2>Tài khoản</h2>
          <p class="muted">Đã đăng nhập bằng <strong>${escapeHtml(currentUser.email || "")}</strong>. Hồ sơ, lịch sử luyện tập và bảng xếp hạng sẽ được đồng bộ.</p>
          <button class="secondary-btn" id="logoutBtn">Đăng xuất</button>
        </div>
      `
      : `
        <div class="panel">
          <h2>Đăng nhập / Đăng ký</h2>
          <p class="muted">Đăng nhập để lưu hồ sơ, lịch sử luyện tập và điểm lên bảng xếp hạng chung.</p>
          <div class="profile-form">
            <label class="field">
              <span>Email</span>
              <input id="emailInput" type="email" autocomplete="email" placeholder="tenban@email.com">
            </label>
            <label class="field">
              <span>Mật khẩu</span>
              <input id="passwordInput" type="password" autocomplete="current-password" placeholder="Tối thiểu 6 ký tự">
            </label>
            <p class="muted" id="authMessage"></p>
            <div class="row-actions">
              <button class="primary-btn" id="loginBtn">Đăng nhập</button>
              <button class="secondary-btn" id="registerBtn">Đăng ký</button>
              <button class="secondary-btn" id="resetPasswordBtn">Quên mật khẩu</button>
            </div>
          </div>
        </div>
      `;

  app.innerHTML = `
    <div class="hero-grid">
      <section class="panel">
        <h2>Hồ sơ người học</h2>
        <div class="profile-form">
          <label class="field">
            <span>Tên hiển thị</span>
            <input id="nameInput" value="${escapeHtml(profile.name)}" maxlength="28" placeholder="Ví dụ: Minh Anh">
          </label>
          <label class="field">
            <span>Lớp/Nhóm</span>
            <input id="classInput" value="${escapeHtml(profile.className)}" maxlength="36" placeholder="Ví dụ: Nhóm 3 - Triết học">
          </label>
          <button class="primary-btn" id="saveProfile">Lưu hồ sơ</button>
        </div>
      </section>

      <aside>
        ${authPanel}
        <div class="panel" style="margin-top: 14px;">
          <h2>Tiến trình</h2>
          <div class="stats-grid">
            <div class="stat-card"><span>Vai trò</span><strong>${isAdmin() ? "Quản lý" : "Người học"}</strong></div>
            <div class="stat-card"><span>Điểm gần nhất</span><strong>${profile.lastScore || 0}%</strong></div>
            <div class="stat-card"><span>Tình trạng</span><strong>${(profile.lastScore || 0) >= 70 ? "Ổn" : "Cần luyện"}</strong></div>
            <div class="stat-card"><span>Lượt luyện</span><strong>${profile.plays}</strong></div>
          </div>
        </div>
      </aside>
    </div>

    <section class="panel profile-insights">
      <div>
        <h2>Lịch sử luyện tập</h2>
        <p class="muted">${currentUser ? "Lưu theo tài khoản đang đăng nhập." : "Đăng nhập để đồng bộ lịch sử giữa nhiều thiết bị."}</p>
      </div>
      <div class="history-grid">
        <div>
          <h3>12 lượt gần nhất</h3>
          <ul class="mini-list">
            ${attempts.length ? attempts.map((attempt) => `
              <li class="leader-row">
                <strong>${attempt.percent}%</strong>
                <span>
                  <strong>${attempt.mode}</strong><br>
                  <span class="muted">${attempt.rank} · ${attempt.score}/${attempt.total} · ${attempt.elapsed}s · ${attempt.date}</span>
                </span>
                <span class="chip">${attempt.percent >= 70 ? "Đạt" : "Ôn lại"}</span>
              </li>
            `).join("") : `<li><span></span><span>Chưa có lịch sử luyện tập.</span><span></span></li>`}
          </ul>
        </div>
        <div>
          <h3>Điểm mạnh/yếu theo chủ đề</h3>
          <div class="category-meter">
            ${Object.keys(aggregateStats).length ? Object.entries(aggregateStats).map(([category, stat]) => {
              const value = percent(stat.correct, stat.total);
              return `
                <div class="meter-row">
                  <span>${CATEGORIES[category]}</span>
                  <div class="meter"><span style="width:${value}%"></span></div>
                  <strong>${value}%</strong>
                </div>
              `;
            }).join("") : `<p class="muted">Chưa đủ dữ liệu để phân tích.</p>`}
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#saveProfile").addEventListener("click", async () => {
    profile.name = document.querySelector("#nameInput").value.trim() || "Khách";
    profile.className = document.querySelector("#classInput").value.trim();
    await saveCloudProfile();
    syncHud();
    renderHome();
  });

  const loginBtn = document.querySelector("#loginBtn");
  const registerBtn = document.querySelector("#registerBtn");
  const resetPasswordBtn = document.querySelector("#resetPasswordBtn");
  const logoutBtn = document.querySelector("#logoutBtn");

  if (loginBtn) loginBtn.addEventListener("click", () => handleAuth("login"));
  if (registerBtn) registerBtn.addEventListener("click", () => handleAuth("register"));
  if (resetPasswordBtn) resetPasswordBtn.addEventListener("click", handlePasswordReset);
  if (logoutBtn) logoutBtn.addEventListener("click", async () => {
    await authApi.signOut(auth);
    currentUser = null;
    profile = load("truthProfile", { name: "Khách", className: "", role: "player", plays: 0, lastScore: 0 });
    syncHud();
    renderProfile();
  });
}

async function renderLeaderboard() {
  currentView = "leaderboard";
  if (unsubscribeLeaderboard) {
    unsubscribeLeaderboard();
    unsubscribeLeaderboard = null;
  }
  app.innerHTML = `
    <section class="panel">
      <h2>Bảng xếp hạng</h2>
      <p class="muted">Đang tải bảng xếp hạng...</p>
    </section>
  `;

  const entries = await getLeaderboardEntries();
  renderLeaderboardEntries(entries);

  if (db && firebaseApi) {
    try {
      const liveQuery = firebaseApi.query(
        firebaseApi.collection(db, "leaderboard"),
        firebaseApi.orderBy("percent", "desc"),
        firebaseApi.limit(10)
      );
      unsubscribeLeaderboard = firebaseApi.onSnapshot(liveQuery, (snapshot) => {
        const liveEntries = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.percent - a.percent || a.elapsed - b.elapsed || (b.createdAtMs || 0) - (a.createdAtMs || 0))
          .slice(0, 10);
        renderLeaderboardEntries(liveEntries);
      });
    } catch (error) {
      console.warn("Could not subscribe leaderboard realtime.", error);
    }
  }
}

function renderLeaderboardEntries(entries) {
  if (currentView !== "leaderboard") return;
  app.innerHTML = `
    <section class="panel">
      <h2>Bảng xếp hạng</h2>
      <div class="chip-row">
        <span class="chip ${leaderboardMode === "firebase" ? "good" : "warn"}">${getLeaderboardLabel()}</span>
        <span class="chip">Top 10 kết quả</span>
        ${db ? `<span class="chip good">Tự cập nhật</span>` : ""}
      </div>
      <p class="muted" style="margin-top: 12px;">${leaderboardMode === "firebase" ? "Bảng xếp hạng này dùng chung cho mọi người khi đăng nhập và làm bài." : "Bảng điểm này chỉ lưu trên trình duyệt hiện tại."}</p>
      <ul class="mini-list" style="margin-top: 18px;">
        ${entries.length ? entries.map((item, index) => `
          <li class="leader-row">
            <strong>#${index + 1}</strong>
            <span>
              <strong>${escapeHtml(item.name)}</strong><br>
              <span class="muted">${item.className ? `${escapeHtml(item.className)} · ` : ""}${item.mode} · ${item.rank} · ${item.elapsed}s · ${item.date}</span>
            </span>
            <strong>${item.percent}%</strong>
          </li>
        `).join("") : `<li><span></span><span>Chưa có lượt luyện tập nào.</span><span></span></li>`}
      </ul>
      <div class="row-actions">
        <button class="primary-btn" id="leaderPlay">Làm câu hỏi để ghi điểm</button>
        ${leaderboardMode === "local" ? `<button class="secondary-btn" id="clearLeader">Xóa bảng điểm trên máy này</button>` : ""}
      </div>
    </section>
  `;

  document.querySelector("#leaderPlay").addEventListener("click", startQuiz);
  const clearButton = document.querySelector("#clearLeader");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      leaderboard = [];
      save("truthLeaderboard", leaderboard);
      renderLeaderboard();
    });
  }
}

async function renderAdmin() {
  currentView = "admin";

  if (!currentUser || !isAdmin()) {
    app.innerHTML = `
      <section class="panel">
        <h2>Khu vực quản lý</h2>
        <p class="muted">Bạn cần đăng nhập bằng tài khoản quản lý để truy cập phần này.</p>
        <div class="row-actions">
          <button class="primary-btn" id="goProfile">Đăng nhập</button>
        </div>
      </section>
    `;
    document.querySelector("#goProfile").addEventListener("click", renderProfile);
    return;
  }

  app.innerHTML = `
    <section class="panel">
      <h2>Khu vực quản lý</h2>
      <p class="muted">Đang tải dữ liệu quản lý...</p>
    </section>
  `;

  try {
    const { users, leaderboardEntries, questions } = await getAdminData();
    const playerCount = users.filter((user) => user.role !== "admin").length;
    const adminCount = users.filter((user) => user.role === "admin").length;

    app.innerHTML = `
      <div class="admin-grid">
        <section class="panel">
          <p class="eyebrow">Khu quản lý</p>
          <h2>Quản lý nền tảng</h2>
          <div class="stats-grid">
            <div class="stat-card"><span>Tài khoản</span><strong>${users.length}</strong></div>
            <div class="stat-card"><span>Người học</span><strong>${playerCount}</strong></div>
            <div class="stat-card"><span>Quản lý</span><strong>${adminCount}</strong></div>
            <div class="stat-card"><span>Điểm đã ghi</span><strong>${leaderboardEntries.length}</strong></div>
            <div class="stat-card"><span>Câu hỏi thêm</span><strong>${questions.length}</strong></div>
          </div>
          <div class="admin-note">
            <strong>Người học không được can thiệp:</strong>
            <p class="muted">Không xem danh sách tài khoản, không đổi vai trò, không xóa bảng xếp hạng, không sửa ngân hàng câu hỏi. Hệ thống phân quyền sẽ chặn các thao tác không hợp lệ.</p>
          </div>
        </section>

        <section class="panel">
          <h2>Người dùng</h2>
          <ul class="mini-list">
            ${users.length ? users.map((user) => `
              <li class="leader-row">
                <strong>${user.role === "admin" ? "QL" : "SV"}</strong>
                <span>
                  <strong>${escapeHtml(user.name || user.email || "Người học")}</strong><br>
                  <span class="muted">${escapeHtml(user.email || "")} · ${escapeHtml(user.className || "Chưa có lớp/nhóm")} · ${user.plays || 0} lượt</span>
                </span>
                ${user.id === currentUser.uid
                  ? `<span class="chip good">Bạn</span>`
                  : `<button class="secondary-btn role-btn" data-user="${user.id}" data-role="${user.role === "admin" ? "player" : "admin"}">${user.role === "admin" ? "Hạ quyền" : "Cấp QL"}</button>`
                }
              </li>
            `).join("") : `<li><span></span><span>Chưa có tài khoản.</span><span></span></li>`}
          </ul>
        </section>

        <section class="panel admin-wide">
          <h2>Thêm câu hỏi</h2>
          <div class="question-editor">
            <input id="adminQuestionId" type="hidden">
            <label class="field"><span>Chủ đề</span><select id="adminQuestionCategory">${Object.entries(CATEGORIES).map(([id, name]) => `<option value="${id}">${name}</option>`).join("")}</select></label>
            <label class="field"><span>Câu hỏi</span><input id="adminQuestionText" placeholder="Nhập câu hỏi"></label>
            <label class="field"><span>A</span><input id="adminOption0"></label>
            <label class="field"><span>B</span><input id="adminOption1"></label>
            <label class="field"><span>C</span><input id="adminOption2"></label>
            <label class="field"><span>D</span><input id="adminOption3"></label>
            <label class="field"><span>Đáp án đúng</span><select id="adminAnswer"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></label>
            <label class="field"><span>Giải thích</span><input id="adminExplanation" placeholder="Giải thích ngắn"></label>
            <button class="primary-btn" id="saveQuestionBtn">Lưu câu hỏi</button>
            <button class="secondary-btn" id="resetQuestionFormBtn">Nhập câu mới</button>
          </div>
          <p class="muted" style="margin-top: 12px;">Câu hỏi quản lý thêm sẽ được đưa vào ngân hàng câu hỏi khi người học làm bài.</p>
          <ul class="mini-list" style="margin-top: 18px;">
            ${questions.length ? questions.map((question) => `
              <li class="leader-row">
                <strong>${CATEGORIES[question.category] || "Khác"}</strong>
                <span>
                  <strong>${escapeHtml(question.question || "")}</strong><br>
                  <span class="muted">${(question.options || []).map(escapeHtml).join(" · ")}</span>
                </span>
                <span class="row-actions compact-actions">
                  <button class="secondary-btn edit-question" data-question="${question.id}">Sửa</button>
                  <button class="secondary-btn danger-btn delete-question" data-question="${question.id}">Xóa</button>
                </span>
              </li>
            `).join("") : `<li><span></span><span>Chưa có câu hỏi thêm từ admin.</span><span></span></li>`}
          </ul>
        </section>

        <section class="panel admin-wide">
          <h2>Duyệt bảng xếp hạng</h2>
          <ul class="mini-list">
            ${leaderboardEntries.length ? leaderboardEntries.map((entry, index) => `
              <li class="leader-row">
                <strong>#${index + 1}</strong>
                <span>
                  <strong>${escapeHtml(entry.name || "Người học")} · ${entry.percent}%</strong><br>
                  <span class="muted">${escapeHtml(entry.mode || "")} · ${escapeHtml(entry.rank || "")} · ${entry.elapsed || 0}s · ${escapeHtml(entry.date || "")}</span>
                </span>
                <button class="secondary-btn danger-btn delete-score" data-entry="${entry.id}">Xóa</button>
              </li>
            `).join("") : `<li><span></span><span>Chưa có kết quả trong bảng xếp hạng.</span><span></span></li>`}
          </ul>
        </section>
      </div>
    `;

    document.querySelectorAll(".role-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        await updateUserRole(button.dataset.user, button.dataset.role);
        renderAdmin();
      });
    });

    document.querySelector("#saveQuestionBtn").addEventListener("click", async () => {
      const options = [0, 1, 2, 3].map((index) => document.querySelector(`#adminOption${index}`).value.trim());
      const question = {
        category: document.querySelector("#adminQuestionCategory").value,
        question: document.querySelector("#adminQuestionText").value.trim(),
        options,
        answer: Number(document.querySelector("#adminAnswer").value),
        explanation: document.querySelector("#adminExplanation").value.trim()
      };
      if (!question.question || options.some((option) => !option) || !question.explanation) {
        alert("Vui lòng nhập đủ câu hỏi, 4 đáp án và giải thích.");
        return;
      }
      const questionId = document.querySelector("#adminQuestionId").value;
      if (questionId) {
        await updateCloudQuestion(questionId, question);
      } else {
        await saveCloudQuestion(question);
      }
      alert("Đã lưu câu hỏi.");
      renderAdmin();
    });

    document.querySelector("#resetQuestionFormBtn").addEventListener("click", () => {
      document.querySelector("#adminQuestionId").value = "";
      document.querySelector("#adminQuestionText").value = "";
      [0, 1, 2, 3].forEach((index) => document.querySelector(`#adminOption${index}`).value = "");
      document.querySelector("#adminExplanation").value = "";
    });

    document.querySelectorAll(".edit-question").forEach((button) => {
      button.addEventListener("click", () => {
        const item = questions.find((question) => question.id === button.dataset.question);
        if (!item) return;
        document.querySelector("#adminQuestionId").value = item.id;
        document.querySelector("#adminQuestionCategory").value = item.category;
        document.querySelector("#adminQuestionText").value = item.question || "";
        [0, 1, 2, 3].forEach((index) => document.querySelector(`#adminOption${index}`).value = item.options?.[index] || "");
        document.querySelector("#adminAnswer").value = String(item.answer || 0);
        document.querySelector("#adminExplanation").value = item.explanation || "";
        document.querySelector("#adminQuestionText").focus();
      });
    });

    document.querySelectorAll(".delete-question").forEach((button) => {
      button.addEventListener("click", async () => {
        await deleteCloudQuestion(button.dataset.question);
        renderAdmin();
      });
    });

    document.querySelectorAll(".delete-score").forEach((button) => {
      button.addEventListener("click", async () => {
        await deleteLeaderboardEntry(button.dataset.entry);
        renderAdmin();
      });
    });
  } catch (error) {
    app.innerHTML = `
      <section class="panel">
        <h2>Khu vực quản lý</h2>
        <p class="muted">Không tải được dữ liệu quản lý. Kiểm tra quyền của tài khoản này rồi thử lại.</p>
      </section>
    `;
  }
}

async function boot() {
  await initFirebase();
  await loadCloudQuestions();
  syncHud();
  renderHome();
}

boot();
