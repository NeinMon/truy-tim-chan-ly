# TRUY TÌM CHÂN LÝ

Interactive Philosophy Quiz Platform về phần **2.3.2. Lý luận nhận thức duy vật biện chứng**.

Sản phẩm là một nền tảng mini học tập có thể tái sử dụng, chia sẻ cho sinh viên khác và mở rộng thêm nhiều bộ câu hỏi triết học sau này.

## Tính năng

- Trang chủ chọn chế độ chơi
- 5 chế độ: AI nói thật hay sai, Fake News Hunter, Social Media Investigation, Truth Detective, Philosophy Challenge
- Ngân hàng 50 câu hỏi chia 5 chủ đề
- Random 10 câu mỗi lượt chơi
- Hồ sơ người chơi, cấp độ, XP
- Đăng ký/đăng nhập bằng Firebase Authentication
- Hồ sơ người chơi lưu ở Firestore theo tài khoản
- Leaderboard public bằng Firebase Firestore
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

Rule demo cho bài thuyết trình:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update: if request.auth != null && request.auth.uid == userId;
    }

    match /leaderboard/{docId} {
      allow read: if true;
      allow create: if
        request.auth != null &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.name is string &&
        request.resource.data.name.size() <= 28 &&
        request.resource.data.score is number &&
        request.resource.data.total is number &&
        request.resource.data.percent is number &&
        request.resource.data.elapsed is number;
    }
  }
}
```

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
