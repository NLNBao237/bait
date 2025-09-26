# API Testing Guide

## Cấu hình môi trường

Tạo file `.env` với nội dung:
```
Mongo_URI=mongodb://localhost:27017/baitest
JWT_SECRET=your-super-secret-jwt-key-here
PORT=2303
```

## Test Flow

### 1. Đăng ký user mới
```http
POST http://localhost:2303/users/register
Content-Type: application/json

{
  "username": "testuser1",
  "password": "password123"
}
```

### 2. Đăng nhập để lấy token
```http
POST http://localhost:2303/users/login
Content-Type: application/json

{
  "username": "testuser1",
  "password": "password123"
}
```

Response sẽ trả về:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Tạo todo (sử dụng token từ bước 2)
```http
POST http://localhost:2303/todos
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "My First Todo",
  "content": "This is my first todo item",
  "status": "pending"
}
```

### 4. Lấy todos của user hiện tại
```http
GET http://localhost:2303/users/me/todos
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Lấy tất cả todos của user (với filter)
```http
GET http://localhost:2303/todos?status=pending&search=first&limit=10&offset=0
Authorization: Bearer YOUR_TOKEN_HERE
```

## Lưu ý quan trọng

- **Mỗi user chỉ thấy todos của riêng mình**
- **Khi tạo todo, nó tự động gán cho user hiện tại**
- **Tất cả endpoints todos đều cần authentication**
- **User không thể xem/sửa/xóa todos của user khác**
