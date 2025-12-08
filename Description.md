 # 📋 مستند فنی جامع پروژه Life Sync MVP

## 🎯 اطلاعات کلی پروژه

**نام پروژه:** Life Sync - اپلیکیشن توسعه فردی  
**مرحله فعلی:** MVP Version 1.0  
**تیم:** توسعه‌دهنده + روانشناس (محتوا)  
**مخاطبان:** افراد 16-36 سال (دانشجویان، فریلنسرها)

---

## 🏗️ معماری فنی

### Stack Technology

**Frontend:**
- Next.js 14+ / React
- State Management: Zustand یا Jotai
- UI Components: shadcn/ui
- Charts: Recharts
- Styling: Tailwind CSS

**Backend:**
- Next.js API Routes (App Router)
- Runtime: Node.js

**Database:**
- PostgreSQL (hosted on Supabase یا Neon.tech)
- ORM: Prisma

**Authentication:**
- NextAuth.js v4+
- Strategy: JWT + Credentials Provider
- Password Hashing: bcryptjs

**Deployment:**
- Platform: Vercel (پیشنهادی)
- Database: Supabase/Neon
- Environment: Production + Development

---

## 📦 ساختار پروژه

life-sync/
├── prisma/
│   ├── schema.prisma          # مدل دیتابیس کامل
│   └── migrations/            # فایل‌های migration
│
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── tasks/         # Task management
│   │   │   ├── categories/    # Category management
│   │   │   ├── goals/         # Goal management
│   │   │   ├── habits/        # Habit tracking
│   │   │   ├── mood/          # Mood tracking (4D system)
│   │   │   ├── journal/       # Journaling
│   │   │   ├── pomodoro/      # Pomodoro timer
│   │   │   ├── reports/       # Weekly/monthly reports
│   │   │   └── notifications/ # Notification system
│   │   │
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Main dashboard
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                # shadcn components
│   │   ├── features/          # Feature-specific components
│   │   └── shared/            # Shared components
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── utils.ts           # Helper functions
│   │   └── validators.ts      # Input validation schemas
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript types/interfaces
│   │
│   └── middleware.ts          # Route protection
│
├── .env.local                 # Environment variables
├── .env.example              # Example env file
├── package.json
├── tsconfig.json
└── next.config.js


---

## 🗄️ Database Schema - موجودیت‌های اصلی

### 1. User Model
**جدول:** `users`

**فیلدها:**
- `id`: String (CUID) - Primary Key
- `email`: String (Unique) - ایمیل کاربر
- `password`: String (Hashed) - رمز عبور هش‌شده
- `emailVerified`: Boolean - وضعیت تأیید ایمیل
- `firstName`: String (Optional) - نام
- `middleName`: String (Optional) - نام میانی
- `lastName`: String (Optional) - نام خانوادگی
- `profilePicture`: String (Optional) - URL عکس پروفایل
- `age`: Int (Optional) - سن
- `gender`: Enum (Optional) - جنسیت
- `country`: String (Optional) - کشور
- `createdAt`: DateTime - تاریخ ثبت‌نام
- `updatedAt`: DateTime - آخرین بروزرسانی

**Relations:**
- One-to-Many: Tasks, Categories, Goals, Habits, Journals, Moods, PomodoroSessions, Notifications

---

### 2. Category Model
**جدول:** `categories`

**فیلدها:**
- `id`: String (CUID) - Primary Key
- `userId`: String (Foreign Key → users)
- `title`: String - عنوان دسته‌بندی
- `icon`: String (Optional) - آیکون
- `color`: String (Optional) - رنگ
- `timeEstimate`: Int (Optional) - تخمین زمان به دقیقه

**Relations:**
- Many-to-One: User
- One-to-Many: Tasks

**Business Logic:**
- محاسبه پیشرفت کل دسته‌بندی بر اساس تسک‌های کامل‌شده
- نمودار پیشرفت برای هر دسته‌بندی

---

### 3. Task Model
**جدول:** `tasks`

**فیلدها:**
- `id`: String (CUID) - Primary Key
- `userId`: String (Foreign Key → users)
- `categoryId`: String (Optional, Foreign Key → categories)
- `title`: String - عنوان تسک
- `description`: String (Optional) - توضیحات
- `parentTaskId`: String (Optional, Self-Reference) - تسک والد (برای Subtask)
- `priority`: Enum - سطح اولویت (URGENT, MEDIUM, NON_URGENT)
- `status`: Enum - وضعیت (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `timeEstimate`: Int (Optional) - تخمین زمان (دقیقه)
- `difficulty`: Enum (Optional) - سختی (EASY, MEDIUM, HARD)
- `importance`: Enum (Optional) - اهمیت (LOW, MEDIUM, HIGH, CRITICAL)
- `progress`: Float (0-100) - درصد پیشرفت
- `dueDate`: DateTime (Optional) - ددلاین
- `completedAt`: DateTime (Optional) - زمان تکمیل
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relations:**
- Many-to-One: User, Category
- Self-Reference: Parent/Child Tasks (Subtasks)
- One-to-Many: PomodoroSessions

**Business Logic:**
- محاسبه خودکار `progress` بر اساس Subtasks
- تبدیل خودکار `status` به COMPLETED وقتی `progress = 100`
- ست کردن `completedAt` هنگام تکمیل

---

### 4. Goal Model
**جدول:** `goals`

**فیلدها:**
- `id`: String (CUID)
- `userId`: String (Foreign Key → users)
- `title`: String - عنوان هدف
- `description`: String (Optional)
- `type`: Enum - نوع (SHORT_TERM, LONG_TERM, YEARLY)
- `targetValue`: Float (Optional) - مقدار هدف
- `currentValue`: Float (Default: 0) - مقدار فعلی
- `unit`: String (Optional) - واحد (صفحه، کیلومتر، ...)
- `startDate`: DateTime - تاریخ شروع
- `endDate`: DateTime (Optional) - تاریخ پایان
- `status`: Enum - وضعیت (NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority`: Enum
- `actualProgress`: Float (0-100) - پیشرفت واقعی
- `expectedProgress`: Float (0-100) - پیشرفت مورد انتظار
- `completedAt`: DateTime (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relations:**
- Many-to-One: User
- One-to-Many: Milestones

**Business Logic:**
- **Dual Progress System:**
  - `actualProgress` = (currentValue / targetValue) × 100
  - `expectedProgress` محاسبه بر اساس روزهای گذشته و تاریخ endDate
- **Prediction Engine:** "با این سرعت در X روز به هدف می‌رسید"

---

### 5. Milestone Model
**جدول:** `milestones`

**فیلدها:**
- `id`: String (CUID)
- `goalId`: String (Foreign Key → goals)
- `title`: String - عنوان مرحله
- `description`: String (Optional)
- `targetValue`: Float (Optional)
- `order`: Int - ترتیب نمایش
- `isCompleted`: Boolean (Default: false)
- `completedAt`: DateTime (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relations:**
- Many-to-One: Goal

---

### 6. Habit Model
**جدول:** `habits`

**فیلدها:**
- `id`: String (CUID)
- `userId`: String (Foreign Key → users)
- `title`: String - عنوان عادت
- `description`: String (Optional)
- `icon`: String (Optional)
- `color`: String (Optional)
- `frequency`: Enum - تکرار (DAILY, WEEKLY, CUSTOM)
- `targetDays`: Int[] - آرایه روزهای هفته [0-6]
- `streak`: Int (Default: 0) - تعداد روزهای متوالی
- `bestStreak`: Int (Default: 0) - بهترین رکورد
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relations:**
- Many-to-One: User
- One-to-Many: HabitCompletions

**Business Logic:**
- محاسبه خودکار `streak` بر اساس تاریخ آخرین completion
- بروزرسانی `bestStreak` اگر `streak` جدید بیشتر باشد

---

### 7. HabitCompletion Model
**جدول:** `habit_completions`

**فیلدها:**
- `id`: String (CUID)
- `habitId`: String (Foreign Key → habits)
- `date`: DateTime - تاریخ انجام
- `completed`: Boolean (Default: true)
- `note`: String (Optional)
- `createdAt`: DateTime

**Constraints:**
- Unique Constraint: (habitId, date) - یک عادت فقط یکبار در روز ثبت می‌شود

---

### 8. Mood Model (سیستم 4 بعدی)
**جدول:** `moods`

**فیلدها:**
- `id`: String (CUID)
- `userId`: String (Foreign Key → users)
- `selectedMoodIds`: Int[] - آرایه IDهای احساسات انتخاب‌شده (1-48)
- `energyLevel`: Float (-1 to +1) - سطح انرژی محاسبه‌شده
- `valence`: Float (-1 to +1) - ارزش هیجانی محاسبه‌شده
- `note`: String (Optional) - یادداشت
- `tags`: String[] - تگ‌ها
- `date`: DateTime - تاریخ
- `time`: String - زمان
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relations:**
- Many-to-One: User
- One-to-Many: MoodEmotions

**لیست 48 احساس (4 کوادرانت):**

**Quadrant 1 - High Energy + Positive (IDs: 1-12)**
1. Energized - پرانرژی
2. Excited - هیجان‌زده
3. Curious - کنجکاو
4. Happy - خوشحال
5. Upbeat - مثبت‌اندیش
6. Confident - با اعتماد به نفس
7. Hopeful - امیدوار
8. Pleased - خرسند
9. Motivated - با انگیزه
10. Focused - متمرکز
11. Success - موفق
12. Empowered - توانمند

**Quadrant 2 - High Energy + Negative (IDs: 13-24)**
13. Frightened - ترسیده
14. Peeved - دلخور
15. Anxious - مضطرب
16. Embarrassed - شرمنده
17. Worried - دلواپس
18. Frustrated - ناامید
19. Angry - خشمگین
20. Contempt - تحقیر
21. Envious - حسود
22. Restless - بی‌قرار
23. Confused - گیج
24. FOMO - ترس از دست دادن

**Quadrant 3 - Low Energy + Negative (IDs: 25-36)**
25. Bored - بی‌حوصله
26. Tired - خسته
27. Apathetic - بی‌تفاوت
28. Lonely - تنها
29. Discouraged - ناامید
30. Insecure - ناامن
31. Ashamed - شرمنده
32. Depressed - افسرده
33. Humiliated - تحقیرشده
34. Sad - غمگین
35. Lost - گم‌شده
36. Numb - بی‌حس

**Quadrant 4 - Low Energy + Positive (IDs: 37-48)**
37. Calm - آرام
38. Good - خوب
39. Chill - خونسرد
40. Understood - درک‌شده
41. Balanced - متعادل
42. Thankful - سپاس‌گزار
43. Safe - امن
44. Loved - دوست‌داشتنی
45. Blessed - خوشبخت
46. Included - پذیرفته‌شده
47. Valued - ارزشمند
48. Satisfied - راضی

**الگوریتم محاسبه Dimensions:**
برای هر emotion ID انتخاب‌شده:
  - Energy: اگر ID بین 1-24 باشد → +1، اگر 25-48 باشد → -1
  - Valence: اگر ID بین (1-12) یا (37-48) → +1، اگر (13-36) → -1

energyLevel = مجموع Energy / تعداد کل احساسات
valence = مجموع Valence / تعداد کل احساسات


---

### 9. MoodEmotion Model
**جدول:** `mood_emotions`

**فیلدها:**
- `id`: String (CUID)
- `moodId`: String (Foreign Key → moods)
- `emotionId`: Int (1-48) - شناسه احساس
- `intensity`: Int (1-5) - شدت احساس
- `createdAt`: DateTime

**Relations:**
- Many-to-One: Mood

---

### 10. Journal Model
**جدول:** `journals`

**فیلدها:**
- `id`: String (CUID)
- `userId`: String (Foreign Key → users)
- `title`: String (Optional) - عنوان
- `content`: String - محتوای ژورنال
- `tags`: String[] - تگ‌ها
- `moodSnapshot`: JSON (Optional) - اسنپ‌شات از مود روز
- `date`: DateTime - تاریخ
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relations:**
- Many-to-One: User

---

### 11. PomodoroSession Model
**جدول:** `pomodoro_sessions`

**فیلدها:**
- `id`: String (CUID)
- `userId`: String (Foreign Key → users)
- `taskId`: String (Optional, Foreign Key → tasks)
- `workDuration`: Int (Default: 25) - مدت کار (دقیقه)
- `breakDuration`: Int (Default: 5) - مدت استراحت (دقیقه)
- `startedAt`: DateTime - زمان شروع
- `completedAt`: DateTime (Optional) - زمان پایان
- `status`: Enum (IN_PROGRESS, COMPLETED, CANCELLED)
- `createdAt`: DateTime

**Relations:**
- Many-to-One: User, Task

**Business Logic:**
- لینک‌شدن به تسک خاص (اختیاری)
- ثبت زمان کار واقعی برای گزارش‌دهی
- امکان توقف و از سرگیری

---

### 12. Notification Model
**جدول:** `notifications`

**فیلدها:**
- `id`: String (CUID)
- `userId`: String (Foreign Key → users)
- `type`: Enum - نوع نوتیفیکیشن
- `title`: String - عنوان
- `message`: String - پیام
- `relatedId`: String (Optional) - ID آیتم مرتبط
- `relatedType`: String (Optional) - نوع آیتم (task, goal, habit, ...)
- `isRead`: Boolean (Default: false)
- `readAt`: DateTime (Optional)
- `createdAt`: DateTime

**Notification Types:**
- `TASK_REMINDER`: یادآوری وظیفه
- `GOAL_REMINDER`: یادآوری هدف
- `HABIT_REMINDER`: یادآوری عادت
- `EVALUATION_REMINDER`: یادآوری ارزیابی (هفتگی/ماهانه/فصلی)
- `PSYCHOLOGY_QUOTE`: جملات روانشناختی انگیزشی
- `ACHIEVEMENT`: دستاورد و بج

---

## 🔐 Authentication Flow

### ثبت‌نام (Registration)
1. دریافت: email, password, firstName, lastName
2. اعتبارسنجی ورودی‌ها
3. بررسی تکراری نبودن email
4. Hash کردن password با bcrypt (salt rounds: 12)
5. ایجاد User با `emailVerified: false`
6. ارسال ایمیل تأیید (لینک با token)
7. پاسخ: userId + پیام موفقیت

### ورود (Login)
1. دریافت: email, password
2. جستجوی User
3. مقایسه password با bcrypt.compare()
4. بررسی `emailVerified === true`
5. صدور JWT Token
6. ذخیره Session

### تأیید ایمیل (Email Verification)
1. دریافت token از لینک ایمیل
2. اعتبارسنجی token
3. بروزرسانی `emailVerified: true`
4. ریدایرکت به صفحه ورود

### بازیابی رمز عبور
1. دریافت email
2. ارسال لینک بازیابی (token با expiration)
3. صفحه تنظیم رمز جدید
4. Hash و ذخیره password جدید

---

## 📡 API Endpoints - فهرست کامل

### Authentication
- `POST /api/auth/register` - ثبت‌نام کاربر جدید
- `POST /api/auth/login` - ورود (NextAuth handled)
- `POST /api/auth/verify-email` - تأیید ایمیل
- `POST /api/auth/forgot-password` - درخواست بازیابی
- `POST /api/auth/reset-password` - تنظیم رمز جدید
- `PATCH /api/auth/change-password` - تغییر رمز (لاگین شده)

### Profile
- `GET /api/profile` - دریافت اطلاعات پروفایل
- `PATCH /api/profile` - بروزرسانی پروفایل
- `POST /api/profile/picture` - آپلود عکس پروفایل

### Categories
- `GET /api/categories` - لیست دسته‌بندی‌ها
- `POST /api/categories` - ایجاد دسته‌بندی
- `PATCH /api/categories/[id]` - بروزرسانی
- `DELETE /api/categories/[id]` - حذف
- `GET /api/categories/[id]/progress` - گزارش پیشرفت

### Tasks
- `GET /api/tasks` - لیست تسک‌ها (با فیلتر)
- `POST /api/tasks` - ایجاد تسک
- `GET /api/tasks/[id]` - جزئیات تسک
- `PATCH /api/tasks/[id]` - بروزرسانی
- `DELETE /api/tasks/[id]` - حذف
- `POST /api/tasks/[id]/subtasks` - افزودن Subtask
- `PATCH /api/tasks/[id]/complete` - تکمیل تسک

### Goals
- `GET /api/goals` - لیست اهداف
- `POST /api/goals` - ایجاد هدف
- `GET /api/goals/[id]` - جزئیات هدف
- `PATCH /api/goals/[id]` - بروزرسانی
- `DELETE /api/goals/[id]` - حذف
- `POST /api/goals/[id]/milestones` - افزودن Milestone
- `PATCH /api/goals/[id]/progress` - بروزرسانی پیشرفت
- `GET /api/goals/[id]/prediction` - پیش‌بینی زمان تکمیل

### Habits
- `GET /api/habits` - لیست عادت‌ها
- `POST /api/habits` - ایجاد عادت
- `GET /api/habits/[id]` - جزئیات عادت
- `PATCH /api/habits/[id]` - بروزرسانی
- `DELETE /api/habits/[id]` - حذف
- `POST /api/habits/[id]/complete` - ثبت انجام عادت
- `GET /api/habits/[id]/streak` - محاسبه streak

### Mood
- `GET /api/mood` - لیست مودها (با فیلتر تاریخ)
- `POST /api/mood` - ثبت مود جدید
- `GET /api/mood/[id]` - جزئیات مود
- `GET /api/mood/analytics` - تحلیل مود (scatter plot data)
- `GET /api/mood/calendar` - داده برای mood calendar

### Journal
- `GET /api/journal` - لیست ژورنال‌ها
- `POST /api/journal` - ایجاد ژورنال
- `GET /api/journal/[id]` - جزئیات ژورنال
- `PATCH /api/journal/[id]` - بروزرسانی
- `DELETE /api/journal/[id]` - حذف

### Pomodoro
- `GET /api/pomodoro` - لیست جلسات
- `POST /api/pomodoro/start` - شروع جلسه
- `PATCH /api/pomodoro/[id]/complete` - پایان جلسه
- `GET /api/pomodoro/stats` - آمار پومودورو

### Reports
- `GET /api/reports/weekly` - گزارش هفتگی
- `GET /api/reports/monthly` - گزارش ماهانه
- `GET /api/reports/evaluation` - ارزیابی (هفتگی/ماهانه/فصلی)

### Notifications
- `GET /api/notifications` - لیست نوتیفیکیشن‌ها
- `PATCH /api/notifications/[id]/read` - خواندن نوتیفیکیشن
- `PATCH /api/notifications/read-all` - خواندن همه

---

## 🎨 UI/UX Components - لیست موردنیاز

### Dashboard
- **Overview Card**: خلاصه وضعیت روز
- **Task Summary Widget**: تسک‌های امروز
- **Goal Progress Cards**: پیشرفت اهداف
- **Habit Tracker Widget**: عادت‌های امروز
- **Mood Quick Log**: ثبت سریع مود
- **Recent Activity Timeline**: فعالیت‌های اخیر

### Task Management
- **Task List View**: لیست تسک‌ها با فیلتر و سورت
- **Task Card Component**: نمایش یک تسک
- **Subtask Nested List**: نمایش ساختار درختی
- **Priority Badge**: نشان اولویت (رنگ‌بندی)
- **Progress Bar**: نوار پیشرفت
- **Category Tag**: تگ دسته‌بندی

### Goal Management
- **Goal Card**: کارت هدف با progress bars
- **Dual Progress Chart**: دو progress bar (actual vs expected)
- **Milestone List**: لیست مراحل
- **Prediction Display**: نمایش پیش‌بینی تکمیل

### Mood Tracking
- **48-Emotion Selector**: انتخابگر احساسات (4 quadrant layout)
- **Scatter Plot Chart**: نمودار پراکنش (energy vs valence)
- **Mood Calendar Heatmap**: تقویم رنگی مودها
- **Emotion Intensity Slider**: اسلایدر شدت احساس (1-5)

### Habit Tracking
- **Habit Card**: کارت عادت
- **Streak Counter**: نمایش streak
- **Calendar Heatmap**: تقویم انجام عادت
- **Completion Button**: دکمه ثبت انجام

### Journal
- **Rich Text Editor**: ویرایشگر متن
- **Tag Input**: ورودی تگ
- **Mood Integration**: نمایش مود روز
- **Journal Card**: کارت ژورنال در لیست

### Pomodoro
- **Timer Display**: نمایش تایمر بزرگ
- **Task Selector**: انتخاب تسک
- **Settings Panel**: تنظیمات work/break duration
- **Session History**: تاریخچه جلسات

### Reports
- **Weekly Summary Card**: خلاصه هفتگی
- **Time Spent Chart**: نمودار زمان صرف‌شده
- **Completion Rate Chart**: نمودار نرخ تکمیل
- **Evaluation Form**: فرم ارزیابی

---

## 📊 Business Logic - محاسبات کلیدی

### Task Progress Calculation
اگر تسک Subtask دارد:
  progress = (تعداد Subtask های COMPLETED / کل Subtasks) × 100
در غیر این صورت:
  progress بصورت دستی توسط کاربر


### Goal Progress System
actualProgress = (currentValue / targetValue) × 100

روزهای گذشته = (امروز - startDate)
کل روزها = (endDate - startDate)
expectedProgress = (روزهای گذشته / کل روزها) × 100

پیش‌بینی تکمیل:
  روزهای باقی‌مانده = (targetValue - currentValue) / نرخ پیشرفت روزانه


### Habit Streak Calculation
بررسی آخرین completion:
  اگر دیروز انجام شده → streak++
  اگر امروز انجام شده → streak ثابت
  اگر بیش از 1 روز فاصله → streak = 1

اگر streak > bestStreak:
  bestStreak = streak


### Mood Dimensions
مشاهده شد در بخش Mood Model


### Weekly Report Data
- تعداد کل تسک‌های تکمیل‌شده
- زمان کل صرف‌شده (از Pomodoro)
- تعداد اهداف در حال انجام
- نرخ موفقیت عادت‌ها
- میانگین مود هفته


---

## 🔔 Notification System

### نوع نوتیفیکیشن‌ها
1. **Task Reminder**: یادآوری تسک‌های مهم نزدیک به deadline
2. **Goal Reminder**: یادآوری بروزرسانی پیشرفت اهداف
3. **Habit Reminder**: یادآوری انجام عادت‌های روزانه
4. **Evaluation Reminder**: یادآوری ارزیابی هفتگی/ماهانه/فصلی
5. **Psychology Quote**: جملات انگیزشی روانشناختی (content by روانشناس)
6. **Achievement**: بج‌ها و دستاوردها

### Timing Logic
- Task: 1 ساعت قبل از dueDate
- Habit: زمان تعیین‌شده توسط کاربر
- Evaluation: هر یکشنبه 20:00 (هفتگی)، اول ماه (ماهانه)، اول فصل (فصلی)
- Quote: روزانه 9:00 صبح

---

## 🔒 Security Considerations

### Authentication Security
- Password hashing با bcrypt (12 rounds)
- JWT tokens با expiration
- HttpOnly cookies برای tokens
- CSRF protection
- Rate limiting برای login attempts

### Data Protection
- Input validation همه endpoints
- SQL Injection prevention (Prisma ORM)
- XSS prevention در frontend
- Authorization check در همه protected routes

### Privacy
- User data isolation (همیشه فیلتر با userId)
- Soft delete برای داده‌های حساس (امکان بازگردانی)
- Encryption at rest برای فیلدهای حساس (اختیاری)
- GDPR compliance: امکان export و delete کامل داده‌ها
- Audit logs برای عملیات حساس

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # برای Prisma Migrate

# NextAuth
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Service (برای verification & password reset)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@lifesync.app"

# Optional: File Storage
UPLOAD_DIR="/uploads"
MAX_FILE_SIZE=5242880 # 5MB

# Optional: External APIs
OPENAI_API_KEY="sk-..." # برای فازهای آینده
```

---

## 📈 Data Validation Rules

### Task Validation
```typescript
TaskCreateSchema:
  title: required, min: 3, max: 200
  description: optional, max: 2000
  priority: enum [URGENT, MEDIUM, NON_URGENT]
  status: enum [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
  timeEstimate: optional, min: 1 (دقیقه)
  difficulty: optional, enum [EASY, MEDIUM, HARD]
  importance: optional, enum [LOW, MEDIUM, HIGH, CRITICAL]
  progress: min: 0, max: 100
  dueDate: optional, must be future date
  categoryId: optional, must exist
  parentTaskId: optional, must exist, نباید circular reference ایجاد کند
```

### Goal Validation
```typescript
GoalCreateSchema:
  title: required, min: 3, max: 200
  type: enum [SHORT_TERM, LONG_TERM, YEARLY]
  targetValue: optional, min: 0
  currentValue: default: 0, min: 0, max: targetValue
  unit: optional, max: 50
  startDate: required
  endDate: optional, must be after startDate
  priority: enum [LOW, MEDIUM, HIGH, CRITICAL]
```

### Habit Validation
```typescript
HabitCreateSchema:
  title: required, min: 3, max: 100
  frequency: enum [DAILY, WEEKLY, CUSTOM]
  targetDays: array of integers [0-6], required if frequency = WEEKLY
  icon: optional, max: 50
  color: optional, hex color format
```

### Mood Validation
```typescript
MoodCreateSchema:
  selectedMoodIds: required, array, min: 1, max: 48
  note: optional, max: 1000
  tags: optional, array of strings, max 10 tags
  date: required, ISO date
  time: required, HH:mm format
```

### Journal Validation
```typescript
JournalCreateSchema:
  title: optional, max: 200
  content: required, min: 10, max: 10000
  tags: optional, array of strings
  date: required
```

---

## 🗂️ Prisma Schema - کد کامل

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==================== ENUMS ====================

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum TaskPriority {
  URGENT
  MEDIUM
  NON_URGENT
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TaskDifficulty {
  EASY
  MEDIUM
  HARD
}

enum TaskImportance {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum GoalType {
  SHORT_TERM
  LONG_TERM
  YEARLY
}

enum GoalStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum HabitFrequency {
  DAILY
  WEEKLY
  CUSTOM
}

enum PomodoroStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum NotificationType {
  TASK_REMINDER
  GOAL_REMINDER
  HABIT_REMINDER
  EVALUATION_REMINDER
  PSYCHOLOGY_QUOTE
  ACHIEVEMENT
}

// ==================== MODELS ====================

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String
  emailVerified   Boolean  @default(false)
  
  // Profile Information
  firstName       String?
  middleName      String?
  lastName        String?
  profilePicture  String?
  age             Int?
  gender          Gender?
  country         String?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  categories      Category[]
  tasks           Task[]
  goals           Goal[]
  habits          Habit[]
  journals        Journal[]
  moods           Mood[]
  pomodoroSessions PomodoroSession[]
  notifications   Notification[]
  
  @@map("users")
}

model Category {
  id            String   @id @default(cuid())
  userId        String
  title         String
  icon          String?
  color         String?
  timeEstimate  Int?     // به دقیقه
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks         Task[]
  
  @@map("categories")
}

model Task {
  id            String          @id @default(cuid())
  userId        String
  categoryId    String?
  
  title         String
  description   String?
  
  // Subtask Support
  parentTaskId  String?
  parentTask    Task?           @relation("TaskSubtasks", fields: [parentTaskId], references: [id], onDelete: Cascade)
  subtasks      Task[]          @relation("TaskSubtasks")
  
  // Properties
  priority      TaskPriority    @default(MEDIUM)
  status        TaskStatus      @default(PENDING)
  timeEstimate  Int?            // دقیقه
  difficulty    TaskDifficulty?
  importance    TaskImportance?
  progress      Float           @default(0) // 0-100
  
  // Dates
  dueDate       DateTime?
  completedAt   DateTime?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  // Relations
  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category?       @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  pomodoroSessions PomodoroSession[]
  
  @@map("tasks")
}

model Goal {
  id                String      @id @default(cuid())
  userId            String
  
  title             String
  description       String?
  type              GoalType
  
  // Progress Tracking
  targetValue       Float?
  currentValue      Float       @default(0)
  unit              String?     // "صفحه", "کیلومتر", etc.
  
  // Dates
  startDate         DateTime
  endDate           DateTime?
  
  // Status
  status            GoalStatus  @default(NOT_STARTED)
  priority          TaskImportance @default(MEDIUM)
  
  // Dual Progress
  actualProgress    Float       @default(0) // 0-100
  expectedProgress  Float       @default(0) // 0-100
  
  completedAt       DateTime?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  // Relations
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  milestones        Milestone[]
  
  @@map("goals")
}

model Milestone {
  id            String    @id @default(cuid())
  goalId        String
  
  title         String
  description   String?
  targetValue   Float?
  order         Int       // ترتیب نمایش
  
  isCompleted   Boolean   @default(false)
  completedAt   DateTime?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  goal          Goal      @relation(fields: [goalId], references: [id], onDelete: Cascade)
  
  @@map("milestones")
}

model Habit {
  id            String            @id @default(cuid())
  userId        String
  
  title         String
  description   String?
  icon          String?
  color         String?
  
  frequency     HabitFrequency    @default(DAILY)
  targetDays    Int[]             // [0,1,2,3,4,5,6] for days of week
  
  streak        Int               @default(0)
  bestStreak    Int               @default(0)
  
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  // Relations
  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  completions   HabitCompletion[]
  
  @@map("habits")
}

model HabitCompletion {
  id            String    @id @default(cuid())
  habitId       String
  
  date          DateTime  @db.Date
  completed     Boolean   @default(true)
  note          String?
  
  createdAt     DateTime  @default(now())
  
  // Relations
  habit         Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  @@unique([habitId, date]) // یک عادت فقط یکبار در روز
  @@map("habit_completions")
}

model Mood {
  id                String          @id @default(cuid())
  userId            String
  
  // 48 Emotions System
  selectedMoodIds   Int[]           // Array of emotion IDs (1-48)
  
  // Calculated Dimensions
  energyLevel       Float           // -1 to +1
  valence           Float           // -1 to +1
  
  // Additional Data
  note              String?
  tags              String[]
  
  date              DateTime        @db.Date
  time              String          // HH:mm format
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  // Relations
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  emotions          MoodEmotion[]
  
  @@map("moods")
}

model MoodEmotion {
  id            String    @id @default(cuid())
  moodId        String
  
  emotionId     Int       // 1-48
  intensity     Int       // 1-5
  
  createdAt     DateTime  @default(now())
  
  // Relations
  mood          Mood      @relation(fields: [moodId], references: [id], onDelete: Cascade)
  
  @@map("mood_emotions")
}

model Journal {
  id            String    @id @default(cuid())
  userId        String
  
  title         String?
  content       String    @db.Text
  tags          String[]
  
  // Optional mood snapshot
  moodSnapshot  Json?     // {emotionIds: [...], energy: X, valence: Y}
  
  date          DateTime  @db.Date
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("journals")
}

model PomodoroSession {
  id              String          @id @default(cuid())
  userId          String
  taskId          String?
  
  workDuration    Int             @default(25) // دقیقه
  breakDuration   Int             @default(5)  // دقیقه
  
  startedAt       DateTime
  completedAt     DateTime?
  
  status          PomodoroStatus  @default(IN_PROGRESS)
  
  createdAt       DateTime        @default(now())
  
  // Relations
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  task            Task?           @relation(fields: [taskId], references: [id], onDelete: SetNull)
  
  @@map("pomodoro_sessions")
}

model Notification {
  id            String             @id @default(cuid())
  userId        String
  
  type          NotificationType
  title         String
  message       String
  
  // Related entity (optional)
  relatedId     String?
  relatedType   String?            // "task", "goal", "habit", etc.
  
  isRead        Boolean            @default(false)
  readAt        DateTime?
  
  createdAt     DateTime           @default(now())
  
  // Relations
  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}
```

---

## 🎯 API Implementation Examples

### مثال 1: ایجاد Task با Subtasks

**Endpoint:** `POST /api/tasks`

```typescript
// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      categoryId, 
      priority, 
      timeEstimate, 
      difficulty, 
      importance, 
      dueDate,
      subtasks // Array of subtask objects
    } = body;

    // Validation
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: 'عنوان باید حداقل 3 کاراکتر باشد' },
        { status: 400 }
      );
    }

    // Create main task with subtasks
    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        title,
        description,
        categoryId,
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        timeEstimate,
        difficulty,
        importance,
        dueDate: dueDate ? new Date(dueDate) : null,
        subtasks: subtasks ? {
          create: subtasks.map((sub: any) => ({
            userId: session.user.id,
            title: sub.title,
            description: sub.description,
            priority: sub.priority || 'MEDIUM',
            status: 'PENDING',
          }))
        } : undefined
      },
      include: {
        subtasks: true,
        category: true
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد تسک' },
      { status: 500 }
    );
  }
}
```

---

### مثال 2: محاسبه Dual Progress برای Goal

**Endpoint:** `GET /api/goals/[id]`

```typescript
// src/app/api/goals/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        milestones: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!goal) {
      return NextResponse.json({ error: 'هدف یافت نشد' }, { status: 404 });
    }

    // محاسبه Actual Progress
    const actualProgress = goal.targetValue
      ? (goal.currentValue / goal.targetValue) * 100
      : 0;

    // محاسبه Expected Progress
    let expectedProgress = 0;
    if (goal.endDate) {
      const now = new Date();
      const start = new Date(goal.startDate);
      const end = new Date(goal.endDate);
      
      const totalDays = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysPassed = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      expectedProgress = Math.min(
        (daysPassed / totalDays) * 100,
        100
      );
    }

    // پیش‌بینی زمان تکمیل
    let prediction = null;
    if (goal.targetValue && goal.currentValue > 0 && goal.endDate) {
      const now = new Date();
      const start = new Date(goal.startDate);
      const daysPassed = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const progressRate = goal.currentValue / daysPassed; // واحد در روز
      const remainingValue = goal.targetValue - goal.currentValue;
      const estimatedDaysRemaining = Math.ceil(remainingValue / progressRate);
      
      const completionDate = new Date(now);
      completionDate.setDate(completionDate.getDate() + estimatedDaysRemaining);
      
      prediction = {
        estimatedDays: estimatedDaysRemaining,
        completionDate: completionDate.toISOString(),
        progressRate: progressRate.toFixed(2),
        message: `با این سرعت، ${estimatedDaysRemaining} روز دیگر به هدف می‌رسید`
      };
    }

    // بروزرسانی progress در دیتابیس
    await prisma.goal.update({
      where: { id: goal.id },
      data: {
        actualProgress,
        expectedProgress
      }
    });

    return NextResponse.json({
      ...goal,
      actualProgress,
      expectedProgress,
      prediction
    });
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json({ error: 'خطا در دریافت هدف' }, { status: 500 });
  }
}
```

---

### مثال 3: ثبت Mood با محاسبه Energy/Valence

**Endpoint:** `POST /api/mood`

```typescript
// src/app/api/mood/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// Emotion Configuration (1-48)
const EMOTION_CONFIG = {
  // High Energy + Positive (1-12)
  highEnergyPositive: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  // High Energy + Negative (13-24)
  highEnergyNegative: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  // Low Energy + Negative (25-36)
  lowEnergyNegative: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
  // Low Energy + Positive (37-48)
  lowEnergyPositive: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
};

function calculateDimensions(emotionIds: number[]) {
  let totalEnergy = 0;
  let totalValence = 0;

  emotionIds.forEach(id => {
    // Energy calculation
    if (EMOTION_CONFIG.highEnergyPositive.includes(id) || 
        EMOTION_CONFIG.highEnergyNegative.includes(id)) {
      totalEnergy += 1;
    } else {
      totalEnergy -= 1;
    }

    // Valence calculation
    if (EMOTION_CONFIG.highEnergyPositive.includes(id) || 
        EMOTION_CONFIG.lowEnergyPositive.includes(id)) {
      totalValence += 1;
    } else {
      totalValence -= 1;
    }
  });

  const count = emotionIds.length;
  return {
    energyLevel: totalEnergy / count,  // -1 to +1
    valence: totalValence / count      // -1 to +1
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { selectedMoodIds, emotions, note, tags, date, time } = body;

    // Validation
    if (!selectedMoodIds || selectedMoodIds.length === 0) {
      return NextResponse.json(
        { error: 'حداقل یک احساس را انتخاب کنید' },
        { status: 400 }
      );
    }

    // محاسبه dimensions
    const { energyLevel, valence } = calculateDimensions(selectedMoodIds);

    // ایجاد mood record
    const mood = await prisma.mood.create({
      data: {
        userId: session.user.id,
        selectedMoodIds,
        energyLevel,
        valence,
        note,
        tags: tags || [],
        date: new Date(date),
        time,
        emotions: {
          create: emotions.map((e: any) => ({
            emotionId: e.id,
            intensity: e.intensity || 3
          }))
        }
      },
      include: {
        emotions: true
      }
    });

    return NextResponse.json(mood, { status: 201 });
  } catch (error) {
    console.error('Error creating mood:', error);
    return NextResponse.json({ error: 'خطا در ثبت مود' }, { status: 500 });
  }
}
```

---

## 📊 Analytics & Reports

### Weekly Report Calculation

```typescript
// src/lib/reports.ts
import prisma from '@/lib/prisma';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function generateWeeklyReport(userId: string) {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  // تسک‌های تکمیل‌شده
  const completedTasks = await prisma.task.count({
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: {
        gte: weekStart,
        lte: weekEnd
      }
    }
  });

  // زمان صرف‌شده (Pomodoro)
  const pomodoroSessions = await prisma.pomodoroSession.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      startedAt: {
        gte: weekStart,
        lte: weekEnd
      }
    }
  });

  const totalMinutes = pomodoroSessions.reduce(
    (sum, session) => sum + session.workDuration,
    0
  );

  // عادت‌ها
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          date: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      }
    }
  });

  const habitSuccessRate = habits.length > 0
    ? (habits.reduce((sum, h) => sum + h.completions.length, 0) / 
       (habits.length * 7)) * 100
    : 0;

  // میانگین مود
  const moods = await prisma.mood.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd
      }
    }
  });

  const avgEnergy = moods.length > 0
    ? moods.reduce((sum, m) => sum + m.energyLevel, 0) / moods.length
    : 0;

  const avgValence = moods.length > 0
    ? moods.reduce((sum, m) => sum + m.valence, 0) / moods.length
    : 0;

  return {
    period: { start: weekStart, end: weekEnd },
    tasks: {
      completed: completedTasks,
      totalMinutes
    },
    habits: {
      successRate: habitSuccessRate.toFixed(2)
    },
    mood: {
      avgEnergy: avgEnergy.toFixed(2),
      avgValence: avgValence.toFixed(2),
      totalLogs: moods.length
    }
  };
}
```

---

## 🚀 Development Roadmap

### Phase 1: MVP Core (فعلی)
✅ Authentication & Profile  
✅ Task Management (با Subtasks)  
✅ Goal System (Dual Progress)  
✅ Habit Tracking  
✅ Mood System (48 emotions, 4D)  
✅ Journal  
✅ Pomodoro  
✅ Basic Reports  
✅ Notifications  

### Phase 2: Enhanced Features
- Calendar Integration
- Advanced Analytics Dashboard
- Data Export (JSON, CSV, PDF)
- Backup & Restore System
- Multi-device Sync Optimization

### Phase 3: AI Integration
- AI Goal Breakdown (تبدیل هدف به steps)
- Smart Daily Planning
- Mood Pattern Analysis
- Predictive Insights
- Personalized Psychology Quotes

### Phase 4: Collaboration
- Shared Tasks
- Group Goals
- Accountability Partners
- Comments & Activity Feed
- Team Challenges

### Phase 5: Wellness Expansion
- Water Intake Tracker
- Meal Planner
- Fitness Tracker
- Sleep Manager
- Meditation Timer

### Phase 6: Financial Module
- Expense Tracking
- Budget Planning
- Financial Goals
- Recurring Bills
- Reports & Charts

### Phase 7: Content Management
- Personal Library
- Reading Goals
- Travel Planner
- Contacts & Birthdays
- Document Scanner

### Phase 8: Customization
- Theme Builder
- Widget System
- Layout Customization
- Custom Fields
- Automation Rules

### Phase 9: Mobile Native
- React Native App
- Offline Mode
- Push Notifications
- Biometric Login
- Home Screen Widgets

### Phase 10: Platform Expansion
- Telegram Bot
- Desktop App (Electron)
- Browser Extension
- API for Third-party
- Physical Products (Planner, Journal)

---

## 🛠️ Development Guidelines

### Code Structure
- **API Routes:** یک فایل برای هر entity (`tasks/route.ts`, `goals/route.ts`)
- **Validation:** استفاده از Zod برای schema validation
- **Error Handling:** try-catch در همه endpoints + proper status codes
- **Type Safety:** TypeScript strict mode
- **Code Style:** Prettier + ESLint

### Database Best Practices
- **Indexes:** برای فیلدهای پرجستجو (userId, date, status)
- **Transactions:** برای عملیات multi-step
- **Cascading Deletes:** تعریف صحیح relations
- **Migrations:** همیشه از Prisma migrate استفاده شود

### Performance
- **Pagination:** برای لیست‌های طولانی
- **Caching:** استفاده از React Query برای client-side
- **Database Queries:** Optimize با select و include
- **Image Optimization:** Next.js Image component

### Testing Strategy
- **Unit Tests:** توابع کمکی و محاسبات
- **Integration Tests:** API endpoints
- **E2E Tests:** فلوهای کاربری کلیدی (Playwright)
- **Coverage Target:** حداقل 70%

---

## 📝 نکات نهایی برای Implementation

### اولویت‌بندی توسعه
1. **Week 1-2:** Setup project + Authentication + Database
2. **Week 3-4:** Task & Category Management
3. **Week 5-6:** Goal System + Milestones
4. **Week 7-8:** Habit Tracking + Streaks
5. **Week 9-10:** Mood System (48 emotions)
6. **Week 11-12:** Journal + Pomodoro
7. **Week 13-14:** Dashboard + Reports
8. **Week 15-16:** Notifications + Polish
9. **Week 17-18:** Testing + Bug Fixes
10. **Week 19-20:** Deployment + Documentation

### Deployment Checklist
- [ ] Environment variables تنظیم شده
- [ ] Database migrations اجرا شده
- [ ] Email service پیکربندی شده
- [ ] Domain و SSL تنظیم شده
- [ ] Monitoring tools نصب شده (Sentry)
- [ ] Backup strategy تعریف شده
- [ ] Load testing انجام شده
- [ ] Security audit انجام شده
- [ ] User documentation آماده شده
- [ ] Marketing materials آماده شده

---

## 🎓 Resources & Documentation

### فنی
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org
- **shadcn/ui:** https://ui.shadcn.com
- **Recharts:** https://recharts.org

### Design
- **Figma Community:** UI Kits برای Dashboard
- **Dribbble:** الهام برای UI/UX
- **Color Palettes:** Coolors.co


### محتوای روانشناسی
- **منابع علمی:** مقالات معتبر از PubMed، APA PsycNet
- **کتاب‌های پایه:**
  - Atomic Habits - James Clear
  - Getting Things Done - David Allen
  - The Psychology of Habit - Wendy Wood
  - Emotional Intelligence - Daniel Goleman
- **مدل‌های روانشناسی:**
  - Circumplex Model of Affect (Russell, 1980)
  - SMART Goal Framework
  - Habit Loop (Cue-Routine-Reward)
  - Self-Determination Theory

---

## 🔧 Advanced API Implementation

### مثال 4: Habit Streak Calculation

**Endpoint:** `GET /api/habits/[id]/streak`

```typescript
// src/app/api/habits/[id]/streak/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        completions: {
          orderBy: { date: 'desc' },
          take: 100 // آخرین 100 روز
        }
      }
    });

    if (!habit) {
      return NextResponse.json({ error: 'عادت یافت نشد' }, { status: 404 });
    }

    // محاسبه Current Streak
    let currentStreak = 0;
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      
      const completed = habit.completions.find(
        c => format(new Date(c.date), 'yyyy-MM-dd') === dateStr
      );

      if (completed?.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // محاسبه Best Streak
    let bestStreak = 0;
    let tempStreak = 0;
    
    const sortedCompletions = habit.completions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < sortedCompletions.length; i++) {
      if (sortedCompletions[i].completed) {
        tempStreak++;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    // بروزرسانی در دیتابیس
    await prisma.habit.update({
      where: { id: habit.id },
      data: {
        streak: currentStreak,
        bestStreak: Math.max(bestStreak, habit.bestStreak)
      }
    });

    // آمار هفتگی
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const completed = habit.completions.find(
        c => format(new Date(c.date), 'yyyy-MM-dd') === dateStr
      );
      return {
        date: dateStr,
        completed: !!completed?.completed,
        dayName: format(date, 'EEEE')
      };
    });

    // نرخ موفقیت کلی
    const totalDays = habit.completions.length;
    const completedDays = habit.completions.filter(c => c.completed).length;
    const successRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    return NextResponse.json({
      habitId: habit.id,
      currentStreak,
      bestStreak: Math.max(bestStreak, habit.bestStreak),
      successRate: successRate.toFixed(2),
      last7Days,
      totalCompletions: completedDays,
      stats: {
        thisWeek: last7Days.filter(d => d.completed).length,
        thisMonth: habit.completions.filter(c => {
          const completionDate = new Date(c.date);
          const thisMonth = new Date().getMonth();
          return completionDate.getMonth() === thisMonth && c.completed;
        }).length
      }
    });
  } catch (error) {
    console.error('Error calculating streak:', error);
    return NextResponse.json(
      { error: 'خطا در محاسبه streak' },
      { status: 500 }
    );
  }
}
```

---

### مثال 5: Dashboard Summary API

**Endpoint:** `GET /api/dashboard/summary`

```typescript
// src/app/api/dashboard/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);

    // تسک‌های امروز
    const todayTasks = await prisma.task.findMany({
      where: {
        userId,
        dueDate: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      include: {
        category: true,
        subtasks: true
      }
    });

    const urgentTasks = todayTasks.filter(t => t.priority === 'URGENT');
    const completedToday = todayTasks.filter(t => t.status === 'COMPLETED');

    // اهداف فعال
    const activeGoals = await prisma.goal.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS'
      },
      include: {
        milestones: true
      }
    });

    // اهدافی که عقب‌تر از برنامه هستند
    const behindSchedule = activeGoals.filter(
      g => g.actualProgress < g.expectedProgress - 10
    );

    // عادت‌های امروز
    const todayDay = today.getDay(); // 0 = Sunday
    const todayHabits = await prisma.habit.findMany({
      where: {
        userId,
        OR: [
          { frequency: 'DAILY' },
          {
            frequency: 'WEEKLY',
            targetDays: { has: todayDay }
          }
        ]
      },
      include: {
        completions: {
          where: {
            date: todayStart
          }
        }
      }
    });

    const completedHabits = todayHabits.filter(
      h => h.completions.length > 0 && h.completions[0].completed
    );

    // Pomodoro امروز
    const todayPomodoros = await prisma.pomodoroSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: todayStart,
          lte: todayEnd
        },
        status: 'COMPLETED'
      }
    });

    const totalFocusMinutes = todayPomodoros.reduce(
      (sum, p) => sum + p.workDuration,
      0
    );

    // آخرین مود
    const latestMood = await prisma.mood.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        emotions: true
      }
    });

    // نوتیفیکیشن‌های خوانده‌نشده
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    // آمار هفتگی
    const weekStats = {
      tasksCompleted: await prisma.task.count({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      }),
      focusHours: (await prisma.pomodoroSession.aggregate({
        where: {
          userId,
          status: 'COMPLETED',
          startedAt: {
            gte: weekStart,
            lte: weekEnd
          }
        },
        _sum: {
          workDuration: true
        }
      }))._sum.workDuration || 0,
      journalEntries: await prisma.journal.count({
        where: {
          userId,
          date: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      })
    };

    // تولید پیشنهادات هوشمند
    const suggestions = [];

    if (urgentTasks.length > 0) {
      suggestions.push({
        type: 'warning',
        message: `${urgentTasks.length} تسک فوری امروز دارید`,
        action: 'tasks'
      });
    }

    if (behindSchedule.length > 0) {
      suggestions.push({
        type: 'info',
        message: `${behindSchedule.length} هدف از برنامه عقب‌تر هستند`,
        action: 'goals'
      });
    }

    if (todayHabits.length > 0 && completedHabits.length === 0) {
      suggestions.push({
        type: 'reminder',
        message: `${todayHabits.length} عادت امروز را هنوز انجام نداده‌اید`,
        action: 'habits'
      });
    }

    if (!latestMood || 
        new Date(latestMood.date).toDateString() !== today.toDateString()) {
      suggestions.push({
        type: 'reminder',
        message: 'حال و هوای امروز خود را ثبت کنید',
        action: 'mood'
      });
    }

    return NextResponse.json({
      today: {
        tasks: {
          total: todayTasks.length,
          completed: completedToday.length,
          urgent: urgentTasks.length,
          progress: todayTasks.length > 0 
            ? (completedToday.length / todayTasks.length) * 100 
            : 0
        },
        habits: {
          total: todayHabits.length,
          completed: completedHabits.length,
          progress: todayHabits.length > 0
            ? (completedHabits.length / todayHabits.length) * 100
            : 0
        },
        focus: {
          minutes: totalFocusMinutes,
          hours: (totalFocusMinutes / 60).toFixed(1),
          sessions: todayPomodoros.length
        }
      },
      goals: {
        active: activeGoals.length,
        behindSchedule: behindSchedule.length,
        onTrack: activeGoals.length - behindSchedule.length
      },
      mood: latestMood ? {
        energy: latestMood.energyLevel,
        valence: latestMood.valence,
        emotions: latestMood.selectedMoodIds.length,
        timestamp: latestMood.createdAt
      } : null,
      weekStats,
      notifications: {
        unread: unreadNotifications
      },
      suggestions
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت داشبورد' },
      { status: 500 }
    );
  }
}
```

---

### مثال 6: Mood Visualization Data

**Endpoint:** `GET /api/mood/visualization`

```typescript
// src/app/api/mood/visualization/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { subDays, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = subDays(new Date(), days);

    const moods = await prisma.mood.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      },
      include: {
        emotions: true
      }
    });

    // 1. Scatter Plot Data (Energy vs Valence)
    const scatterData = moods.map(m => ({
      date: format(new Date(m.date), 'yyyy-MM-dd'),
      time: m.time,
      energy: m.energyLevel,
      valence: m.valence,
      emotionCount: m.selectedMoodIds.length,
      note: m.note || ''
    }));

    // 2. Timeline Data (روند زمانی)
    const timelineData = moods.map(m => ({
      date: format(new Date(m.date), 'yyyy-MM-dd'),
      energy: m.energyLevel,
      valence: m.valence,
      mood: getMoodLabel(m.energyLevel, m.valence)
    }));

    // 3. Emotion Frequency (احساسات پرتکرار)
    const emotionFrequency: Record<number, number> = {};
    moods.forEach(m => {
      m.selectedMoodIds.forEach(id => {
        emotionFrequency[id] = (emotionFrequency[id] || 0) + 1;
      });
    });

    const topEmotions = Object.entries(emotionFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => ({
        emotionId: parseInt(id),
        emotionName: getEmotionName(parseInt(id)),
        count,
        percentage: ((count / moods.length) * 100).toFixed(1)
      }));

    // 4. Quadrant Distribution (توزیع در چهار ربع)
    const quadrants = {
      highEnergyPositive: 0,   // پرانرژی و مثبت
      highEnergyNegative: 0,   // پرانرژی و منفی
      lowEnergyPositive: 0,    // کم‌انرژی و مثبت
      lowEnergyNegative: 0     // کم‌انرژی و منفی
    };

    moods.forEach(m => {
      if (m.energyLevel > 0 && m.valence > 0) {
        quadrants.highEnergyPositive++;
      } else if (m.energyLevel > 0 && m.valence <= 0) {
        quadrants.highEnergyNegative++;
      } else if (m.energyLevel <= 0 && m.valence > 0) {
        quadrants.lowEnergyPositive++;
      } else {
        quadrants.lowEnergyNegative++;
      }
    });

    // 5. Weekly Pattern (الگوی هفتگی)
    const weeklyPattern: Record<string, { energy: number; valence: number; count: number }> = {
      'Sunday': { energy: 0, valence: 0, count: 0 },
      'Monday': { energy: 0, valence: 0, count: 0 },
      'Tuesday': { energy: 0, valence: 0, count: 0 },
      'Wednesday': { energy: 0, valence: 0, count: 0 },
      'Thursday': { energy: 0, valence: 0, count: 0 },
      'Friday': { energy: 0, valence: 0, count: 0 },
      'Saturday': { energy: 0, valence: 0, count: 0 }
    };

    moods.forEach(m => {
      const dayName = format(new Date(m.date), 'EEEE');
      if (weeklyPattern[dayName]) {
        weeklyPattern[dayName].energy += m.energyLevel;
        weeklyPattern[dayName].valence += m.valence;
        weeklyPattern[dayName].count++;
      }
    });

    const weeklyAverage = Object.entries(weeklyPattern).map(([day, data]) => ({
      day,
      avgEnergy: data.count > 0 ? (data.energy / data.count).toFixed(2) : 0,
      avgValence: data.count > 0 ? (data.valence / data.count).toFixed(2) : 0,
      entries: data.count
    }));

    // 6. Monthly Calendar (تقویم ماهانه)
    const calendarData = moods.map(m => ({
      date: format(new Date(m.date), 'yyyy-MM-dd'),
      mood: getMoodLabel(m.energyLevel, m.valence),
      intensity: Math.sqrt(m.energyLevel ** 2 + m.valence ** 2), // فاصله از مرکز
      color: getMoodColor(m.energyLevel, m.valence)
    }));

    return NextResponse.json({
      period: {
        days,
        from: format(startDate, 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd'),
        totalEntries: moods.length
      },
      scatterPlot: scatterData,
      timeline: timelineData,
      topEmotions,
      quadrants,
      weeklyPattern: weeklyAverage,
      calendar: calendarData,
      summary: {
        avgEnergy: moods.length > 0 
          ? (moods.reduce((sum, m) => sum + m.energyLevel, 0) / moods.length).toFixed(2)
          : 0,
        avgValence: moods.length > 0
          ? (moods.reduce((sum, m) => sum + m.valence, 0) / moods.length).toFixed(2)
          : 0,
        mostCommonQuadrant: Object.entries(quadrants)
          .sort(([, a], [, b]) => b - a)[0][0]
      }
    });
  } catch (error) {
    console.error('Error fetching mood visualization:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت داده‌های تجسم' },
      { status: 500 }
    );
  }
}

// Helper Functions
function getMoodLabel(energy: number, valence: number): string {
  if (energy > 0 && valence > 0) return 'پرانرژی و مثبت';
  if (energy > 0 && valence <= 0) return 'پرانرژی و منفی';
  if (energy <= 0 && valence > 0) return 'آرام و مثبت';
  return 'کم‌انرژی و منفی';
}

function getMoodColor(energy: number, valence: number): string {
  if (energy > 0 && valence > 0) return '#22c55e'; // green
  if (energy > 0 && valence <= 0) return '#ef4444'; // red
  if (energy <= 0 && valence > 0) return '#3b82f6'; // blue
  return '#6b7280'; // gray
}

function getEmotionName(id: number): string {
  const emotionMap: Record<number, string> = {
    // High Energy + Positive (1-12)
    1: 'پرانرژی', 2: 'هیجان‌زده', 3: 'کنجکاو', 4: 'خوشحال',
    5: 'مثبت‌اندیش', 6: 'با اعتماد به نفس', 7: 'امیدوار', 8: 'خرسند',
    9: 'با انگیزه', 10: 'متمرکز', 11: 'موفق', 12: 'توانمند',
    
    // High Energy + Negative (13-24)
    13: 'ترسیده', 14: 'دلخور', 15: 'مضطرب', 16: 'شرمنده',
    17: 'دلواپس', 18: 'ناامید', 19: 'خشمگین', 20: 'تحقیرشده',
    21: 'حسود', 22: 'بی‌قرار', 23: 'گیج', 24: 'ترس از دست دادن',
    
    // Low Energy + Negative (25-36)
    25: 'بی‌حوصله', 26: 'خسته', 27: 'بی‌تفاوت', 28: 'تنها',
    29: 'دلسرد', 30: 'ناامن', 31: 'شرمنده', 32: 'افسرده',
    33: 'تحقیرشده', 34: 'غمگین', 35: 'گم‌شده', 36: 'بی‌حس',
    
    // Low Energy + Positive (37-48)
    37: 'آرام', 38: 'خوب', 39: 'خونسرد', 40: 'درک‌شده',
    41: 'متعادل', 42: 'سپاس‌گزار', 43: 'امن', 44: 'دوست‌داشتنی',
    45: 'خوشبخت', 46: 'پذیرفته‌شده', 47: 'ارزشمند', 48: 'راضی'
  };
  
  return emotionMap[id] || 'نامشخص';
}
```

---

## 🗄️ Database Optimization

### Indexes برای Performance

```prisma
// اضافه کردن به schema.prisma

model Task {
  // ... existing fields
  
  @@index([userId, status])
  @@index([userId, dueDate])
  @@index([userId, priority])
  @@index([categoryId])
  @@index([parentTaskId])
}

model Goal {
  // ... existing fields
  
  @@index([userId, status])
  @@index([userId, endDate])
  @@index([userId, type])
}

model Habit {
  // ... existing fields
  
  @@index([userId, frequency])
}

model HabitCompletion {
  // ... existing fields
  
  @@index([habitId, date])
  @@index([date])
}

model Mood {
  // ... existing fields
  
  @@index([userId, date])
  @@index([date])
}

model Journal {
  // ... existing fields
  
  @@index([userId, date])
}

model Notification {
  // ... existing fields
  
  @@index([userId, isRead])
  @@index([userId, createdAt])
}
```

---

## 🎨 Frontend Integration Examples

### Task List Component (مثال)

```typescript
// src/components/tasks/TaskList.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  category?: {
    title: string;
    color: string;
  };
}

export function TaskList() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?filter=${filter}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<Task[]>;
    }
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const toggleComplete = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      data: {
        status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
      }
    });
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')}>همه</button>
        <button onClick={() => setFilter('today')}>امروز</button>
        <button onClick={() => setFilter('urgent')}>فوری</button>
      </div>

      {tasks?.map(task => (
        <div key={task.id} className="p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.status === 'COMPLETED'}
              onChange={() => toggleComplete(task)}
            />
            <span className={task.status === 'COMPLETED' ? 'line-through' : ''}>
              {task.title}
            </span>
            {task.category && (
              <span 
                className="px-2 py-1 text-xs rounded"
                style={{ backgroundColor: task.category.color }}
              >
                {task.category.title}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 📱 Notification System Implementation

### Background Job برای Reminders

```typescript
// src/lib/notifications/scheduler.ts
import prisma from '@/lib/prisma';
import { sendEmail } from './email';
import { sendPushNotification } from './push';

export async function scheduleDailyReminders() {
  const now = new Date();
  const users = await prisma.user.findMany({
    where: {
      emailVerified: true
    }
  });

  for (const user of users) {
    // تسک‌های امروز
    const todayTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: { not: 'COMPLETED' },
        dueDate: {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999))
        }
      }
    });

    if (todayTasks.length > 0) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'TASK_REMINDER',
          title: 'تسک‌های امروز',
          message: `${todayTasks.length} تسک برای امروز دارید`
        }
      });

      // ارسال ایمیل (اختیاری)
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: 'یادآوری: تسک‌های امروز',
          html: `<p>شما ${todayTasks.length} تسک برای امروز دارید.</p>`
        });
      }
    }

    // عادت‌های امروز
    const todayDay = now.getDay();
    const todayHabits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        OR: [
          { frequency: 'DAILY' },
          {
            frequency: 'WEEKLY',
            targetDays: { has: todayDay }
          }
        ]
      },
      include: {
        completions: {
          where: {
            date: new Date(now.setHours(0, 0, 0, 0))
          }
        }
      }
    });

    const pendingHabits = todayHabits.filter(h => h.completions.length === 0);

    if (pendingHabits.length > 0) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'HABIT_REMINDER',
          title: 'عادت‌های امروز',
          message: `${pendingHabits.length} عادت امروز را فراموش نکنید`
        }
      });
    }

    // جمله روانشناسی روزانه
    const psychologyQuote = await getRandomPsychologyQuote();
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'PSYCHOLOGY_QUOTE',
        title: 'جمله امروز',
        message: psychologyQuote
      }
    });
  }
}

async function getRandomPsychologyQuote(): Promise<string> {
  const quotes = [
    'هر روز فرصتی تازه برای پیشرفت است.',
    'کوچک‌ترین گام‌ها می‌توانند بزرگ‌ترین تغییرات را بسازند.',
    'موفقیت حاصل تکرار روزانه است، نه اقدام یکباره.',
    'خودآگاهی اولین گام برای رشد شخصی است.',
    'عادت‌های امروز، زندگی فردا را می‌سازند.'
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Cron Job Setup (با Vercel Cron یا Node-cron)
// در vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/daily-reminders",
//     "schedule": "0 8 * * *"
//   }]
// }
```
