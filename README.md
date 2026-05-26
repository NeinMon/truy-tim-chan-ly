# TRUY TÌM CHÂN LÝ

Interactive Philosophy Quiz Platform về phần **2.3.2. Lý luận nhận thức duy vật biện chứng**.

Sản phẩm là một nền tảng mini học tập có thể tái sử dụng, chia sẻ cho sinh viên khác và mở rộng thêm nhiều bộ câu hỏi triết học sau này.

## Tính năng

- Trang chủ chọn chế độ chơi
- 5 chế độ: AI nói thật hay sai, Fake News Hunter, Social Media Investigation, Truth Detective, Philosophy Challenge
- Ngân hàng 50 câu hỏi chia 5 chủ đề
- Random 10 câu mỗi lượt chơi
- Hồ sơ người chơi, lịch sử luyện tập, điểm gần nhất
- Đăng ký/đăng nhập bằng Firebase Authentication
- Hồ sơ người chơi lưu ở Firestore theo tài khoản
- Leaderboard public bằng Firebase Firestore
- Leaderboard realtime bằng Firestore listener
- Lịch sử lượt chơi lưu trong `users/{uid}/attempts`
- Thống kê cá nhân theo chủ đề từ lịch sử luyện tập
- Quên mật khẩu qua Firebase Authentication
- Phân quyền `player` và `admin`
- Admin Panel: xem user, cấp/hạ quyền quản lý, xóa điểm leaderboard sai
- Chế độ ôn câu sai, bản đồ kiến thức, phiếu tổng kết học tập
- Admin thêm câu hỏi vào Firestore
- Chế độ thi nhanh 5 phút và vụ án nhận thức theo câu chuyện 5 bước
- Fallback leaderboard local nếu chưa cấu hình Firebase
- Achievement sau mỗi lượt chơi
- Analytics mini theo chủ đề sai/đúng
- Share kết quả bằng Web Share API hoặc copy link
- Dark/light mode
- Chơi lại nhiều lần

## Cấu trúc file

```text
truy-tim-chan-ly/
├── .nojekyll
├── firebase-config.js
├── index.html
├── style.css
├── script.js
└── README.md
```

## Cách bật Firebase

1. Vào https://console.firebase.google.com/
2. Tạo project mới.
3. Thêm Web App.
4. Copy Firebase config.
5. Mở `firebase-config.js`.
6. Đổi `enabled: false` thành `enabled: true`.
7. Dán config thật vào object `config`.
8. Vào `Authentication` -> `Get started`.
9. Trong tab `Sign-in method`, bật `Email/Password`.
10. Vào `Firestore Database` -> `Create database`.
11. Chọn region gần Việt Nam nếu có.
12. Vào tab `Rules` và dùng rule demo bên dưới.

Rule phân quyền demo cho bài thuyết trình:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    match /users/{userId} {
      allow read: if signedIn() && (request.auth.uid == userId || isAdmin());

      allow create: if signedIn() &&
        request.auth.uid == userId &&
        request.resource.data.role == "player";

      allow update: if signedIn() && (
        (
          request.auth.uid == userId &&
          request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(["name", "className", "email", "plays", "lastScore", "updatedAt"])
        ) ||
        isAdmin()
      );

      match /attempts/{attemptId} {
        allow read: if signedIn() && (request.auth.uid == userId || isAdmin());
        allow create: if signedIn() && request.auth.uid == userId;
      }
    }

    match /leaderboard/{docId} {
      allow read: if true;
      allow create: if
        signedIn() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.name is string &&
        request.resource.data.name.size() <= 28 &&
        request.resource.data.score is number &&
        request.resource.data.total is number &&
        request.resource.data.percent is number &&
        request.resource.data.elapsed is number;

      allow delete: if isAdmin();
    }

    match /questions/{questionId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

Tạo tài khoản quản lý đầu tiên:

1. Đăng ký tài khoản trên web.
2. Vào Firebase Console -> Firestore Database -> collection `users`.
3. Mở document có UID của tài khoản đó.
4. Thêm/sửa field `role` thành string `admin`.
5. Refresh web, nút `Quản lý` sẽ xuất hiện.

Phân quyền:

- Người chơi: chơi quiz, sửa tên/lớp của chính mình, tạo lịch sử chơi, tạo điểm leaderboard.
- Người chơi không được: xem danh sách user, đổi quyền, xóa leaderboard, sửa câu hỏi.
- Quản lý: xem dashboard, đổi role user, xóa điểm leaderboard sai.
- Ngân hàng câu hỏi nằm trong `script.js`, người chơi không sửa được qua giao diện; muốn sửa phải có quyền sửa repository/deploy.

Lưu ý: rule này phù hợp demo/học tập. Nếu dùng sản phẩm thật lâu dài, nên thêm Cloud Functions để xác thực điểm số và chống spam.

## Cách chạy

Mở `index.html` bằng trình duyệt. Không cần cài đặt thư viện.

## Deploy GitHub Pages

1. Push code lên branch `main`.
2. Vào `Settings` -> `Pages`.
3. Chọn `Deploy from a branch`.
4. Chọn branch `main`, folder `/root`.
5. Bấm `Save`.

## Gợi ý thuyết trình

“Nhóm em không chỉ làm một sản phẩm phục vụ thuyết trình mà xây dựng một nền tảng mini học tập có thể tái sử dụng, chia sẻ cho sinh viên khác và mở rộng thêm nhiều bộ câu hỏi triết học sau này.”
