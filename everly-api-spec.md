# Everly API Specification

> **Version:** 1.0.0 · **Base URL:** `https://api.everly.app/v1`  
> **Auth:** Bearer JWT (`Authorization: Bearer <accessToken>`)  
> **Content-Type:** `application/json`

---

## Conventions chung

### Envelope Response

Tất cả response đều bọc trong envelope:

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "requestId": "uuid", "timestamp": "ISO8601" }
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mô tả lỗi",
    "details": {}
  },
  "meta": { "requestId": "uuid", "timestamp": "ISO8601" }
}
```

### Pagination

```json
// Request params: ?page=1&limit=20
// Response meta:
"pagination": {
  "page": 1,
  "limit": 20,
  "total": 150,
  "totalPages": 8,
  "hasNext": true,
  "hasPrev": false
}
```

### Error Codes chuẩn

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Token không hợp lệ / hết hạn |
| `FORBIDDEN` | 403 | Không có quyền |
| `NOT_FOUND` | 404 | Resource không tồn tại |
| `VALIDATION_ERROR` | 422 | Request body không hợp lệ |
| `COUPLE_NOT_FOUND` | 404 | Chưa kết nối với partner |
| `PRO_REQUIRED` | 403 | Tính năng yêu cầu Couple PRO |
| `STORAGE_LIMIT` | 413 | Vượt quá dung lượng (free: 500MB) |

---

## UC-01 · Auth & Onboarding

### POST `/auth/register`

Đăng ký tài khoản mới bằng email/password. Gửi OTP về email để verify.

**Request**
```json
{
  "email": "user@example.com",
  "password": "Min8Chars!",
  "name": "Nguyen Van A"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "otpSentTo": "user@example.com",
    "otpExpiresAt": "2026-06-06T10:05:00Z"
  }
}
```

**Nghiệp vụ:**
- Validate email format, password >= 8 chars (uppercase + số + ký tự đặc biệt)
- Hash password bằng bcrypt (cost 12)
- Tạo user với `status = PENDING_VERIFY`
- Generate 6-digit OTP, lưu Redis với TTL 5 phút
- Gửi email OTP

---

### POST `/auth/verify-otp`

Xác thực OTP sau đăng ký hoặc forgot password.

**Request**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "purpose": "REGISTER" // "REGISTER" | "RESET_PASSWORD"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nguyen Van A",
      "avatar": null,
      "status": "ACTIVE",
      "coupleId": null,
      "isProfileComplete": false
    }
  }
}
```

**Nghiệp vụ:**
- Check OTP đúng + chưa hết hạn
- Nếu `purpose = REGISTER`: update `status = ACTIVE`, trả về tokens
- Nếu `purpose = RESET_PASSWORD`: trả về `resetToken` 1 lần dùng (TTL 10 phút)
- Xóa OTP khỏi Redis sau khi dùng

---

### POST `/auth/login`

**Request**
```json
{
  "email": "user@example.com",
  "password": "Min8Chars!"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nguyen Van A",
      "avatar": "https://cdn.everly.app/avatars/uuid.jpg",
      "coupleId": "uuid-or-null",
      "isProfileComplete": true,
      "isPro": false
    }
  }
}
```

**Nghiệp vụ:**
- Verify password hash
- accessToken TTL: 15 phút; refreshToken TTL: 30 ngày
- Lưu refreshToken hash vào DB (invalidate khi logout)

---

### POST `/auth/login/oauth`

Đăng nhập bằng Google / Apple OAuth.

**Request**
```json
{
  "provider": "GOOGLE", // "GOOGLE" | "APPLE"
  "idToken": "google-or-apple-id-token"
}
```

**Response 200** — cùng shape với `/auth/login`

**Nghiệp vụ:**
- Verify idToken với Google/Apple API
- Upsert user: nếu email đã tồn tại → merge account, nếu chưa → tạo mới với `status = ACTIVE`
- Không cần OTP verify cho OAuth

---

### POST `/auth/refresh`

**Request**
```json
{ "refreshToken": "eyJ..." }
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..." // rotate refresh token
  }
}
```

---

### POST `/auth/forgot-password`

**Request**
```json
{ "email": "user@example.com" }
```

**Response 200** — luôn trả success dù email không tồn tại (tránh email enumeration)
```json
{
  "success": true,
  "data": { "message": "Nếu email tồn tại, OTP đã được gửi." }
}
```

---

### POST `/auth/reset-password`

**Request**
```json
{
  "resetToken": "one-time-token-from-otp-verify",
  "newPassword": "NewPass123!"
}
```

**Response 200**
```json
{ "success": true, "data": { "message": "Mật khẩu đã được đặt lại." } }
```

---

### POST `/auth/logout`

**Headers:** Authorization required

**Request**
```json
{ "refreshToken": "eyJ..." }
```

**Response 200**
```json
{ "success": true, "data": { "message": "Đã đăng xuất." } }
```

**Nghiệp vụ:** Xóa refreshToken khỏi DB, xóa push token thiết bị.

---

### PUT `/auth/profile/setup`

Hoàn thiện profile lần đầu sau đăng ký (isProfileComplete = false).

**Request** (multipart/form-data hoặc JSON + S3 pre-signed URL)
```json
{
  "name": "Nguyen Van A",
  "birthday": "1998-02-02",
  "gender": "MALE", // "MALE" | "FEMALE" | "OTHER"
  "avatar": "https://s3.../avatar.jpg" // URL sau khi upload lên S3
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nguyen Van A",
    "birthday": "1998-02-02",
    "gender": "MALE",
    "avatar": "https://cdn.everly.app/avatars/uuid.jpg",
    "isProfileComplete": true
  }
}
```

---

### POST `/couples/invite`

Tạo invite link/QR để kết nối với partner.

**Response 201**
```json
{
  "success": true,
  "data": {
    "inviteCode": "EVERLY-XXXX-XXXX",
    "inviteLink": "https://everly.app/invite/EVERLY-XXXX-XXXX",
    "qrData": "base64-qr-image",
    "expiresAt": "2026-06-09T00:00:00Z" // 3 ngày
  }
}
```

**Nghiệp vụ:**
- Mỗi user chỉ có 1 active invite tại một thời điểm
- Không thể tạo invite nếu đã có coupleId
- Code unique, TTL 3 ngày

---

### POST `/couples/accept-invite`

**Request**
```json
{ "inviteCode": "EVERLY-XXXX-XXXX" }
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "coupleId": "uuid",
    "partner": {
      "id": "uuid",
      "name": "Tran Thi B",
      "avatar": "https://...",
    },
    "anniversaryDate": null, // cần setup
    "connectedAt": "2026-06-06T10:00:00Z"
  }
}
```

**Nghiệp vụ:**
- Không thể accept invite của chính mình
- Không thể accept nếu cả 2 đã có couple
- Tạo Couple record, set coupleId cho cả 2 users
- Invalidate invite code sau khi dùng
- Gửi notification cho cả 2

---

### PUT `/couples/anniversary`

Thiết lập ngày kỷ niệm (anniversary date).

**Request**
```json
{ "anniversaryDate": "2023-02-14" }
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "coupleId": "uuid",
    "anniversaryDate": "2023-02-14",
    "daysCount": 1208
  }
}
```

---

## UC-02 · Home

### GET `/home`

Lấy toàn bộ data cho màn Home trong 1 request.

**Response 200**
```json
{
  "success": true,
  "data": {
    "daysCounter": {
      "count": 1208,
      "anniversaryDate": "2023-02-14",
      "label": "ngày bên nhau"
    },
    "nextMilestone": {
      "id": "uuid",
      "title": "1500 ngày",
      "daysRemaining": 292,
      "targetDate": "2027-04-04"
    },
    "recentMemories": [
      {
        "id": "uuid",
        "title": "Đà Nẵng trip",
        "coverImage": "https://...",
        "date": "2026-05-20",
        "mediaCount": 12
      }
    ],
    "partnerActivity": {
      "lastSeen": "2026-06-06T08:30:00Z",
      "recentAction": {
        "type": "ADDED_MEMORY",
        "description": "đã thêm kỷ niệm mới",
        "timestamp": "2026-06-06T08:25:00Z"
      }
    }
  }
}
```

**Nghiệp vụ:** Chỉ trả data nếu user đã kết nối couple. Cache 60s per couple.

---

## UC-03 · Memories

### GET `/memories`

Lấy danh sách kỷ niệm theo timeline (grouped by tháng/năm).

**Query params:** `?page=1&limit=20&view=TIMELINE&tag=uuid&startDate=2026-01-01&endDate=2026-12-31`

**Response 200**
```json
{
  "success": true,
  "data": {
    "view": "TIMELINE",
    "groups": [
      {
        "label": "Tháng 6, 2026",
        "year": 2026,
        "month": 6,
        "memories": [
          {
            "id": "uuid",
            "title": "Café sáng",
            "description": "...",
            "date": "2026-06-01",
            "coverImage": "https://cdn.everly.app/memories/uuid/cover.jpg",
            "mediaCount": 3,
            "tags": [{ "id": "uuid", "name": "date", "color": "#FF6B6B" }],
            "createdBy": { "id": "uuid", "name": "Nguyen Van A" }
          }
        ]
      }
    ]
  },
  "meta": { "pagination": { ... } }
}
```

---

### POST `/memories`

Tạo kỷ niệm mới.

**Request**
```json
{
  "title": "Café sáng",
  "description": "Buổi sáng đẹp ở The Coffee House",
  "date": "2026-06-01",
  "location": {
    "name": "The Coffee House",
    "lat": 10.7769,
    "lng": 106.7009
  },
  "tagIds": ["uuid1", "uuid2"],
  "mediaKeys": ["s3-key-1.jpg", "s3-key-2.jpg"] // keys sau khi upload S3
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Café sáng",
    "description": "Buổi sáng đẹp ở The Coffee House",
    "date": "2026-06-01",
    "location": { "name": "The Coffee House", "lat": 10.7769, "lng": 106.7009 },
    "tags": [{ "id": "uuid", "name": "date", "color": "#FF6B6B" }],
    "media": [
      {
        "id": "uuid",
        "type": "IMAGE",
        "url": "https://cdn.everly.app/memories/uuid/photo1.jpg",
        "thumbnailUrl": "https://cdn.everly.app/memories/uuid/thumb1.jpg",
        "order": 1,
        "sizeBytes": 1048576
      }
    ],
    "coupleId": "uuid",
    "createdBy": { "id": "uuid", "name": "Nguyen Van A" },
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

**Nghiệp vụ:**
- Validate mediaKeys tồn tại và thuộc về couple (check S3 metadata)
- Kiểm tra storage quota: free ≤ 500MB
- Gửi notification cho partner
- Tạo thumbnail nếu là ảnh (async via queue)

---

### GET `/memories/:id`

**Response 200** — object memory đầy đủ như trên

---

### PUT `/memories/:id`

Chỉ người tạo memory hoặc partner trong couple được sửa.

**Request** — partial update, chỉ gửi field cần thay đổi
```json
{
  "title": "Café sáng (updated)",
  "tagIds": ["uuid1"]
}
```

**Response 200** — object memory đã update

---

### DELETE `/memories/:id`

**Response 200**
```json
{ "success": true, "data": { "message": "Đã xóa kỷ niệm." } }
```

**Nghiệp vụ:** Xóa soft (set deletedAt). Media files trên S3 xóa async sau 24h (grace period).

---

### GET `/memories/calendar`

Lấy danh sách ngày có memory cho calendar view.

**Query:** `?year=2026&month=6`

**Response 200**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 6,
    "days": [
      {
        "date": "2026-06-01",
        "count": 2,
        "preview": "https://cdn.everly.app/.../thumb.jpg"
      }
    ]
  }
}
```

---

### POST `/memories/presign`

Lấy pre-signed URL để upload file lên S3 trực tiếp từ client.

**Request**
```json
{
  "files": [
    { "filename": "photo1.jpg", "contentType": "image/jpeg", "sizeBytes": 2048000 },
    { "filename": "video1.mp4", "contentType": "video/mp4", "sizeBytes": 15000000 }
  ]
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "uploads": [
      {
        "s3Key": "uploads/couple-uuid/temp/uuid-photo1.jpg",
        "presignedUrl": "https://s3.amazonaws.com/...?X-Amz-Signature=...",
        "expiresAt": "2026-06-06T10:15:00Z" // 15 phút
      }
    ],
    "storageUsed": 104857600,
    "storageLimit": 524288000, // 500MB free
    "storageRemaining": 419430400
  }
}
```

**Nghiệp vụ:**
- Validate tổng size không vượt storage limit còn lại
- Chỉ cho phép MIME types: image/jpeg, image/png, image/heic, video/mp4, video/quicktime
- File size tối đa mỗi file: ảnh 10MB, video 100MB (free), unlimited (PRO)

---

### GET `/memories/tags`

Lấy danh sách tags của couple.

**Response 200**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "date", "color": "#FF6B6B", "count": 12 },
    { "id": "uuid", "name": "travel", "color": "#4ECDC4", "count": 8 }
  ]
}
```

---

### POST `/memories/tags`

**Request**
```json
{ "name": "date", "color": "#FF6B6B" }
```

**Response 201** — tag object mới

---

### GET `/memories/our-story-video` *(PRO)*

Tạo/lấy Our Story Video từ memories.

**Query:** `?year=2026`

**Response 200**
```json
{
  "success": true,
  "data": {
    "status": "READY", // "PROCESSING" | "READY" | "NOT_GENERATED"
    "videoUrl": "https://cdn.everly.app/stories/couple-uuid/2026.mp4",
    "thumbnailUrl": "https://...",
    "durationSeconds": 45,
    "generatedAt": "2026-01-01T00:00:00Z"
  }
}
```

**Nghiệp vụ:** PRO only. Video được generate async (FFmpeg), gửi notification khi xong. Cache 7 ngày.

---

## UC-04 · Milestones

### GET `/milestones`

Lấy danh sách milestones (system + custom).

**Query:** `?type=ALL&status=UPCOMING` (type: `ALL|SYSTEM|CUSTOM`; status: `ALL|UPCOMING|REACHED`)

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "SYSTEM",
      "title": "1000 ngày",
      "description": "1000 ngày bên nhau",
      "targetDate": "2025-11-10",
      "daysRemaining": -208,
      "isReached": true,
      "reachedAt": "2025-11-10T00:00:00Z",
      "icon": "🎉"
    },
    {
      "id": "uuid",
      "type": "CUSTOM",
      "title": "Lần đầu đi du lịch cùng nhau",
      "description": "Chuyến đi Đà Lạt",
      "targetDate": "2024-04-15",
      "daysRemaining": -418,
      "isReached": true,
      "reachedAt": "2024-04-15T00:00:00Z",
      "icon": null,
      "coverImage": "https://..."
    },
    {
      "id": "uuid",
      "type": "SYSTEM",
      "title": "1500 ngày",
      "targetDate": "2027-04-04",
      "daysRemaining": 292,
      "isReached": false,
      "icon": "💍"
    }
  ]
}
```

**Nghiệp vụ:** System milestones được auto-generate khi couple tạo (100, 200, 300, 500, 1000, 1500, 2000 ngày; 1, 2, 3, 5, 10 năm). Sắp xếp theo targetDate.

---

### POST `/milestones`

Tạo custom milestone.

**Request**
```json
{
  "title": "Lần đầu nói 'I love you'",
  "description": "Buổi tối ở công viên",
  "targetDate": "2023-03-20",
  "coverImage": "https://s3-key...",
  "icon": "❤️"
}
```

**Response 201** — milestone object

---

### PUT `/milestones/:id`

Chỉ custom milestone mới được sửa. System milestone không thể sửa.

**Response 200** — milestone object updated

---

### DELETE `/milestones/:id`

Chỉ custom milestone. **Response 200**

---

### GET `/milestones/love-map` *(PRO)*

Lấy Love Map — bản đồ các địa điểm kỷ niệm.

**Response 200**
```json
{
  "success": true,
  "data": {
    "pins": [
      {
        "id": "uuid",
        "label": "First date",
        "lat": 10.7769,
        "lng": 106.7009,
        "memoryId": "uuid",
        "coverImage": "https://..."
      }
    ],
    "totalPins": 15
  }
}
```

---

## UC-05 · Explore

### GET `/explore/daily-challenge`

Lấy daily challenge hôm nay.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "2026-06-06",
    "question": "Chia sẻ một kỷ niệm mà bạn không bao giờ quên về partner của mình.",
    "category": "MEMORIES", // "MEMORIES" | "DREAMS" | "DAILY" | "LOVE_LANGUAGE"
    "streak": {
      "current": 7,
      "longest": 14,
      "completedToday": false,
      "partnerCompletedToday": true
    }
  }
}
```

---

### POST `/explore/daily-challenge/:id/answer`

Trả lời daily challenge.

**Request**
```json
{
  "answer": "Kỷ niệm đẹp nhất là lần đầu gặp nhau tại quán cà phê...",
  "isVisibleToPartner": true
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "answer": "...",
    "completedAt": "2026-06-06T10:00:00Z",
    "streak": {
      "current": 8,
      "isStreakExtended": true
    },
    "partnerAnswer": null // null nếu partner chưa trả lời
  }
}
```

**Nghiệp vụ:**
- Mỗi user chỉ trả lời 1 lần/ngày
- Khi cả 2 đã trả lời → reveal cả 2 đáp án, gửi notification
- Streak tăng khi cả 2 hoàn thành cùng ngày; reset nếu bỏ 1 ngày

---

### GET `/explore/time-capsules`

Lấy danh sách time capsules.

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Letter to us in 1 year",
      "sealedAt": "2026-01-01T00:00:00Z",
      "openAt": "2027-01-01T00:00:00Z",
      "status": "SEALED", // "SEALED" | "UNLOCKED"
      "daysUntilOpen": 209,
      "previewText": "Locked 🔒"
    },
    {
      "id": "uuid",
      "title": "Ước mơ năm ngoái",
      "sealedAt": "2025-01-01T00:00:00Z",
      "openAt": "2026-01-01T00:00:00Z",
      "status": "UNLOCKED",
      "content": "Chúng mình ước mơ...",
      "mediaUrls": ["https://..."]
    }
  ],
  "meta": {
    "usedCount": 2,
    "limit": 3, // free: 3, PRO: unlimited
    "isPro": false
  }
}
```

---

### POST `/explore/time-capsules`

**Request**
```json
{
  "title": "Letter to us in 1 year",
  "content": "Chúng mình ước mơ...",
  "openAt": "2027-06-06T00:00:00Z",
  "mediaKeys": ["s3-key-1.jpg"]
}
```

**Response 201** — capsule object

**Nghiệp vụ:**
- Free: tối đa 3 capsules; PRO: unlimited
- `openAt` phải >= 24h từ hiện tại
- Sau khi seal, nội dung được encrypt; chỉ decrypt khi đến openAt
- Gửi notification unlock khi đến openAt

---

### GET `/explore/time-capsules/:id`

Chỉ trả nội dung đầy đủ nếu `status = UNLOCKED`.

---

### DELETE `/explore/time-capsules/:id`

Chỉ xóa được capsule còn SEALED. **Response 200**

---

### GET `/explore/ai-insights` *(PRO)*

AI Love Insights — phân tích sức khỏe mối quan hệ.

**Response 200**
```json
{
  "success": true,
  "data": {
    "healthScore": 82,
    "trend": "UP", // "UP" | "DOWN" | "STABLE"
    "lastUpdated": "2026-06-01T00:00:00Z",
    "dimensions": [
      { "name": "Kỷ niệm chung", "score": 90, "description": "Bạn tạo rất nhiều kỷ niệm đẹp." },
      { "name": "Tương tác hàng ngày", "score": 75, "description": "Streak challenge 8 ngày liên tiếp." },
      { "name": "Sự kiện đặc biệt", "score": 80, "description": "Đã kỷ niệm 1000 ngày bên nhau." }
    ],
    "suggestion": "Hãy thử thêm một chuyến du lịch ngắn để làm mới mối quan hệ!",
    "nextUpdateAt": "2026-07-01T00:00:00Z"
  }
}
```

**Nghiệp vụ:** PRO only. AI score tính dựa trên: số memories/tháng, streak, milestones đã đạt, activity. Refresh 1 lần/tháng.

---

### GET `/explore/gift-suggestions`

Gợi ý quà tặng (affiliate hoặc curated list).

**Query:** `?occasion=ANNIVERSARY&budget=500000` (budget đơn vị VND)

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Custom Couple Photo Book",
      "description": "In ảnh kỷ niệm thành sách đẹp",
      "imageUrl": "https://...",
      "priceRange": { "min": 200000, "max": 500000, "currency": "VND" },
      "category": "PERSONALIZED",
      "affiliateUrl": "https://shopee.vn/..."
    }
  ]
}
```

---

## UC-06 · Notifications

### GET `/notifications`

**Query:** `?page=1&limit=20&unreadOnly=false`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "MILESTONE_REMINDER",
      "title": "1 ngày nữa đến 1500 ngày 🎉",
      "body": "Đã sắp đến cột mốc 1500 ngày bên nhau rồi!",
      "data": { "milestoneId": "uuid" },
      "isRead": false,
      "createdAt": "2026-06-05T09:00:00Z"
    },
    {
      "id": "uuid",
      "type": "PARTNER_MEMORY",
      "title": "Nguyen Van A đã thêm kỷ niệm mới",
      "body": "\"Café sáng\" — xem ngay nhé!",
      "data": { "memoryId": "uuid" },
      "isRead": true,
      "createdAt": "2026-06-06T08:25:00Z"
    }
  ],
  "meta": {
    "unreadCount": 3,
    "pagination": { ... }
  }
}
```

**Notification types:**

| Type | Trigger |
|------|---------|
| `MILESTONE_REMINDER` | D-1 trước milestone |
| `MILESTONE_REACHED` | Đúng ngày milestone |
| `PARTNER_MEMORY` | Partner thêm memory mới |
| `PARTNER_CHALLENGE` | Partner đã trả lời challenge |
| `CAPSULE_UNLOCKED` | Time capsule đến ngày mở |
| `ANNIVERSARY_REMINDER` | D-7, D-1 trước ngày kỷ niệm năm |
| `AI_INSIGHTS_READY` | Báo cáo AI insights tháng mới |
| `COUPLE_CONNECTED` | Partner accept invite |

---

### PUT `/notifications/:id/read`

**Response 200**
```json
{ "success": true, "data": { "id": "uuid", "isRead": true } }
```

---

### PUT `/notifications/read-all`

**Response 200**
```json
{ "success": true, "data": { "markedRead": 5 } }
```

---

### POST `/notifications/push-token`

Đăng ký push token thiết bị (FCM/APNs).

**Request**
```json
{
  "token": "fcm-or-apns-token",
  "platform": "IOS", // "IOS" | "ANDROID"
  "deviceId": "unique-device-id"
}
```

**Response 200**
```json
{ "success": true, "data": { "registered": true } }
```

---

### PUT `/notifications/settings`

Cấu hình loại notification muốn nhận.

**Request**
```json
{
  "milestoneReminder": true,
  "partnerActivity": true,
  "capsuleUnlock": true,
  "anniversaryReminder": true,
  "aiInsights": false,
  "dailyChallengeReminder": true,
  "challengeReminderTime": "20:00" // giờ local
}
```

**Response 200** — settings object đã update

---

## UC-07 · Profile & Settings

### GET `/users/me`

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nguyen Van A",
    "birthday": "1998-02-02",
    "gender": "MALE",
    "avatar": "https://cdn.everly.app/avatars/uuid.jpg",
    "isPro": true,
    "proExpiresAt": "2027-06-06T00:00:00Z",
    "stats": {
      "memoriesCount": 42,
      "milestonesReached": 5,
      "currentStreak": 8,
      "longestStreak": 14
    },
    "couple": {
      "id": "uuid",
      "anniversaryDate": "2023-02-14",
      "daysCount": 1208,
      "theme": "SAKURA",
      "storageUsed": 209715200,
      "storageLimit": 524288000
    }
  }
}
```

---

### PUT `/users/me`

**Request** — partial update
```json
{
  "name": "Nguyen Van A Updated",
  "birthday": "1998-02-02",
  "avatar": "https://s3-key..."
}
```

**Response 200** — user object updated

---

### PUT `/couples/theme`

Đổi theme cho couple. Free: 3 themes; PRO: thêm 3 themes.

**Request**
```json
{
  "theme": "SAKURA"
  // FREE: "DEFAULT" | "MINIMAL" | "VINTAGE"
  // PRO:  "SAKURA" | "AURORA" | "OCEAN"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "theme": "SAKURA",
    "isPro": true
  }
}
```

**Nghiệp vụ:** Validate PRO themes chỉ khi `isPro = true`.

---

### DELETE `/users/me`

Xóa tài khoản. Yêu cầu xác nhận bằng password.

**Request**
```json
{ "password": "CurrentPass123!" }
```

**Response 200**
```json
{ "success": true, "data": { "message": "Tài khoản sẽ bị xóa sau 30 ngày. Bạn có thể đăng nhập lại để hủy." } }
```

**Nghiệp vụ:**
- Soft delete: set `deletedAt`, `status = PENDING_DELETE`
- Nếu đăng nhập lại trong 30 ngày → restore
- Sau 30 ngày: xóa cứng user, media S3, rời couple (partner vẫn giữ data couple)

---

### DELETE `/couples/disconnect`

Ngắt kết nối couple. Cả 2 mất coupleId nhưng data memories/milestones được giữ.

**Request**
```json
{ "password": "CurrentPass123!" }
```

**Response 200**
```json
{ "success": true, "data": { "message": "Đã ngắt kết nối." } }
```

---

## UC-08 · Couple PRO

### GET `/subscriptions/plans`

**Response 200**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "COUPLE_PRO_YEARLY",
        "name": "Couple PRO",
        "price": 19.99,
        "currency": "USD",
        "billingPeriod": "YEARLY",
        "features": [
          "Our Story Video",
          "Love Map",
          "Unlimited Time Capsules",
          "AI Love Insights",
          "3 Premium Themes",
          "Unlimited Storage"
        ],
        "storeProductId": {
          "ios": "com.everly.app.pro.yearly",
          "android": "everly_pro_yearly"
        }
      }
    ]
  }
}
```

---

### POST `/subscriptions/verify`

Verify purchase từ App Store / Google Play sau khi user mua trong app.

**Request**
```json
{
  "platform": "IOS", // "IOS" | "ANDROID"
  "receipt": "base64-receipt-or-purchase-token",
  "productId": "com.everly.app.pro.yearly"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "isPro": true,
    "plan": "COUPLE_PRO_YEARLY",
    "activatedAt": "2026-06-06T10:00:00Z",
    "expiresAt": "2027-06-06T10:00:00Z",
    "storageLimit": -1 // -1 = unlimited
  }
}
```

**Nghiệp vụ:**
- Server verify receipt với Apple/Google API
- Không lưu thông tin payment card
- Subscription apply cho cả couple (cả 2 user đều isPro = true)
- Webhook nhận renewal/cancel từ store → update DB
- Khi hết hạn: PRO features lock, data vẫn giữ nguyên

---

### GET `/subscriptions/status`

**Response 200**
```json
{
  "success": true,
  "data": {
    "isPro": true,
    "plan": "COUPLE_PRO_YEARLY",
    "expiresAt": "2027-06-06T10:00:00Z",
    "autoRenew": true,
    "managementUrl": "https://apps.apple.com/account/subscriptions"
  }
}
```

---

## UC-09 · Media & Storage

### GET `/storage/usage`

**Response 200**
```json
{
  "success": true,
  "data": {
    "usedBytes": 209715200,
    "limitBytes": 524288000,
    "usedFormatted": "200 MB",
    "limitFormatted": "500 MB",
    "percentUsed": 40.0,
    "breakdown": {
      "images": 157286400,
      "videos": 52428800,
      "other": 0
    },
    "isPro": false
  }
}
```

---

### DELETE `/storage/media/:mediaId`

Xóa một file media riêng lẻ (không xóa memory chứa nó).

**Response 200**
```json
{
  "success": true,
  "data": {
    "freedBytes": 2048000,
    "newUsedBytes": 207667200
  }
}
```

**Nghiệp vụ:** Xóa record DB + file S3. Cập nhật storage counter.

---

## Middleware & Cross-cutting

### Auth Middleware

Tất cả routes ngoại trừ `/auth/*` và `/subscriptions/plans` đều require `Authorization: Bearer <accessToken>`.

### Couple Middleware

Routes dưới `/memories`, `/milestones`, `/explore`, `/home` require user đã có `coupleId`. Trả `COUPLE_NOT_FOUND` nếu chưa kết nối.

### PRO Middleware

Áp dụng cho 5 tính năng:
- `GET /memories/our-story-video`
- `GET /milestones/love-map`
- `POST /explore/time-capsules` (khi đã đủ 3)
- `GET /explore/ai-insights`
- `PUT /couples/theme` (PRO themes)

Trả `PRO_REQUIRED` kèm:
```json
{
  "error": {
    "code": "PRO_REQUIRED",
    "message": "Tính năng này chỉ dành cho Couple PRO",
    "details": {
      "feature": "AI_INSIGHTS",
      "upgradeUrl": "everly://upgrade"
    }
  }
}
```

### Rate Limiting

| Route group | Limit |
|-------------|-------|
| `/auth/*` | 10 req/min/IP |
| `/memories/presign` | 20 req/min/user |
| `/explore/ai-insights` | 5 req/day/couple |
| Các routes khác | 100 req/min/user |

---

## Database Schema tóm tắt

```
users              → id, email, password_hash, name, birthday, gender, avatar, 
                     status, couple_id, is_pro, pro_expires_at, deleted_at

couples            → id, user1_id, user2_id, anniversary_date, theme, 
                     storage_used_bytes, connected_at

memories           → id, couple_id, created_by, title, description, date, 
                     location_json, deleted_at

memory_media       → id, memory_id, s3_key, url, thumbnail_url, type, 
                     size_bytes, order

tags               → id, couple_id, name, color

memory_tags        → memory_id, tag_id

milestones         → id, couple_id, type(SYSTEM|CUSTOM), title, description, 
                     target_date, is_reached, reached_at, cover_image, icon

time_capsules      → id, couple_id, created_by, title, content_encrypted, 
                     open_at, sealed_at, status, media_keys

daily_challenges   → id, question, category, date (global table)

challenge_answers  → id, challenge_id, user_id, answer, is_visible, completed_at

streaks            → id, couple_id, current, longest, last_completed_date

notifications      → id, user_id, type, title, body, data_json, is_read, created_at

push_tokens        → id, user_id, token, platform, device_id

notification_settings → id, user_id, ...flags

subscriptions      → id, couple_id, plan, platform, receipt_hash, 
                     activated_at, expires_at, auto_renew, status

invite_codes       → id, user_id, code, expires_at, used_at
```

---

*Document này là living spec — cập nhật khi implementation thay đổi.*
