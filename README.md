# TRUY TÌM CHÂN LÝ

Interactive Philosophy Learning Platform về phần **2.3.2. Lý luận nhận thức duy vật biện chứng**.

## Tính năng chính

- 3 hình thức học rõ ràng: Luyện tập tổng hợp, Vụ án nhận thức, Kiểm tra 5 phút
- Ngân hàng 50 câu hỏi chia 5 chủ đề
- Ôn lại câu sai
- Giải thích sâu sau mỗi câu
- Bản đồ kiến thức và phiếu tổng kết học tập
- Hồ sơ người học, lịch sử luyện tập, điểm gần nhất
- Đăng ký/đăng nhập bằng Firebase Authentication
- Bảng kết quả chung bằng Firebase Firestore
- Admin Panel: quản lý người dùng, duyệt bảng kết quả, thêm/sửa/xóa câu hỏi
- Huy hiệu học tập nhẹ, không dùng điểm ảo hay cấp độ
- Dark/light mode

## Firestore Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    function isOwner(userId) {
      return signedIn() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();

      allow create: if isOwner(userId) &&
        request.resource.data.role == "player";

      allow update: if
        (
          isOwner(userId) &&
          request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(["name", "className", "email", "plays", "lastScore", "updatedAt"]) &&
          request.resource.data.role == resource.data.role
        ) ||
        isAdmin();

      allow delete: if isAdmin();

      match /attempts/{attemptId} {
        allow read: if isOwner(userId) || isAdmin();
        allow create: if isOwner(userId) &&
          request.resource.data.userId == request.auth.uid;
        allow update, delete: if isAdmin();
      }
    }

    match /leaderboard/{docId} {
      allow read: if true;

      allow create: if signedIn() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.name is string &&
        request.resource.data.name.size() <= 28 &&
        request.resource.data.score is number &&
        request.resource.data.total is number &&
        request.resource.data.percent is number &&
        request.resource.data.elapsed is number;

      allow update: if false;
      allow delete: if isAdmin();
    }

    match /questions/{questionId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

## Tạo quản lý đầu tiên

1. Đăng ký tài khoản trên web.
2. Vào Firebase Console -> Firestore Database -> collection `users`.
3. Mở document của tài khoản đó.
4. Sửa field `role` thành string `admin`.
5. Refresh web, nút `Quản lý` sẽ xuất hiện.
