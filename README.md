# Code Editor Backend

Backend API برای پروژه Code Editor با Node.js و Express.js

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- npm یا yarn

### نصب
```bash
npm install
```

### اجرا در حالت توسعه
```bash
npm run dev
```

### ساخت برای پروداکشن
```bash
npm run build
npm start
```

## API Endpoints

### 🗂 مدیریت فایل‌ها

#### دریافت ساختار فایل‌ها
```
GET /api/files
```

#### دریافت محتوای فایل
```
GET /api/files/:fileId/content
```

#### بروزرسانی محتوای فایل
```
PUT /api/files/:fileId/content
Body: { "content": "محتوای جدید فایل" }
```

#### ایجاد فایل جدید
```
POST /api/files
Body: {
  "name": "نام فایل",
  "fileType": "html|css|js",
  "parentId": "شناسه پوشه والد (اختیاری)"
}
```

### 📁 مدیریت فولدرها

#### ایجاد فولدر جدید
```
POST /api/folders
Body: {
  "name": "نام فولدر",
  "parentId": "شناسه پوشه والد (اختیاری)"
}
```

#### تغییر وضعیت فولدر (باز/بسته)
```
PUT /api/folders/:folderId/toggle
```

### 🗑 حذف

#### حذف فایل یا فولدر
```
DELETE /api/items/:itemId
```

### 🔄 عمومی

#### ریست پروژه
```
POST /api/reset
```

#### بررسی وضعیت سرور
```
GET /api/health
```

## ساختار پروژه

```
backend/
├── src/
│   ├── server.ts          # سرور اصلی
│   ├── fileService.ts     # سرویس مدیریت فایل‌ها
│   └── types.ts           # تایپ‌های TypeScript
├── dist/                  # فایل‌های کامپایل شده
├── package.json
└── tsconfig.json
```

## ویژگی‌های پشتیبانی شده

- ✅ ایجاد، خواندن، بروزرسانی و حذف فایل‌ها
- ✅ ایجاد و حذف فولدرها  
- ✅ ساختار فولدری تو در تو
- ✅ پشتیبانی از فرمت‌های HTML، CSS، JS
- ✅ مدیریت وضعیت باز/بسته فولدرها
- ✅ CORS برای ارتباط با فرانت‌اند
- ✅ مدیریت خطا
- ✅ TypeScript

## نکات توسعه

- سرور روی پورت 3001 اجرا می‌شود
- داده‌ها در حافظه نگهداری می‌شوند (برای اهداف دمو)
- برای محیط پروداکشن، پایگاه داده مناسب اضافه کنید

## متغیرهای محیطی

```bash
PORT=3001  # پورت سرور (پیش‌فرض: 3001)
```