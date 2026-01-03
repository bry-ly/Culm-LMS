# LMS Platform Improvement Plan

## Current State Analysis

**Overall Completeness: 55%**

Your LMS has solid foundations in:
- Course creation and management (chapters, lessons, video uploads)
- Stripe payment integration
- Progress tracking and video playback
- Basic admin dashboard with charts
- Authentication with Better Auth

---

## Priority 1: Essential Features (Should Have)

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Search** | Full-text search in course catalog | Medium | High |
| **Reviews & Ratings** | Course reviews, star ratings, written feedback | Medium | High |
| **Instructor Role** | Add instructor role separate from admin | Low | High |
| **User Management UI** | Admin panel to manage users, view enrollments, ban users | Medium | High |
| **Video Transcripts** | Upload transcripts for video lessons with searchable text | Medium | Medium |
| **Email Notifications** | Welcome emails, enrollment confirmations, course completion | Medium | Medium |

### Search Implementation
```prisma
// Add to schema.prisma
model Course {
  // ... existing fields
  searchVector Unsupported("tsvector")?
}

// Create indexes for search
// Use PostgreSQL full-text search or a third-party service like Algolia
```

### Reviews & Ratings Schema
```prisma
model Review {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])
  
  @@unique([userId, courseId]) // One review per user per course
}
```

### Instructor Role
- Add `instructor` enum value to existing role enum
- Create instructor permission middleware
- Build instructor dashboard (`/instructor`)
- Allow instructors to create their own courses

---

## Priority 2: Engagement Features (Nice to Have)

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Q&A Discussions** | Per-lesson and per-course discussion forums | High | High |
| **Notes** | Personal notes per lesson with markdown support | Medium | Medium |
| **Course Certificates** | PDF certificates on course completion | Low | High |
| **Achievement Badges** | Gamification badges for milestones | Medium | Medium |
| **Wishlist** | Save courses for later purchase | Low | Medium |
| **Resume Playback** | Remember video position across sessions | Low | Medium |

### Q&A Discussions Schema
```prisma
model Discussion {
  id        String   @id @default(cuid())
  courseId  String?
  lessonId  String?
  userId    String
  parentId  String?  // For nested replies
  content   String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  course    Course?  @relation(fields: [courseId], references: [id])
  lesson    Lesson?  @relation(fields: [lessonId], references: [id])
  parent    Discussion? @relation("Replies", fields: [parentId], references: [id])
  replies   Discussion[] @relation("Replies")
}
```

### Personal Notes Schema
```prisma
model Note {
  id        String   @id @default(cuid())
  userId    String
  lessonId  String
  content   String   @db.Text  // Markdown content
  timestamp Float?   // Video timestamp reference
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  
  @@unique([userId, lessonId])
}
```

### Wishlist Schema
```prisma
model Wishlist {
  userId    String
  courseId  String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])
  
  @@id([userId, courseId])
}
```

### Resume Playback
Modify `LessonProgress` model:
```prisma
model LessonProgress {
  id            String   @id @default(cuid())
  userId        String
  lessonId      String
  isCompleted   Boolean  @default(false)
  videoPosition Float?   // Last watched position in seconds
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([userId, lessonId])
}
```

---

## Priority 3: Assessment & Certification

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Quiz Builder** | Create quizzes with multiple choice, true/false, fill-in | High | High |
| **Assignments** | File upload assignments with grading | High | High |
| **Progress Assessments** | Pre/post course assessments | Medium | Medium |
| **Certificates API** | API for external certificate verification | Low | Medium |

### Quiz Schema
```prisma
model Quiz {
  id        String   @id @default(cuid())
  lessonId  String   @unique // One quiz per lesson
  title     String
  passingScore Int   @default(70) // Percentage
  
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  questions Question[]
}

model Question {
  id          String   @id @default(cuid())
  quizId      String
  type        String   // multiple_choice, true_false, fill_blank
  question    String
  options     Json?    // For multiple choice: [{id: "a", text: "..."}]
  correctAnswer String
  explanation String?
  points      Int      @default(1)
  order       Int
  
  quiz        Quiz     @relation(fields: [quizId], references: [id])
}

model QuizAttempt {
  id        String   @id @default(cuid())
  userId    String
  quizId    String
  answers   Json     // {questionId: selectedAnswer}
  score     Float
  passed    Boolean
  startedAt DateTime @default(now())
  completedAt DateTime?
  
  user      User     @relation(fields: [userId], references: [id])
  quiz      Quiz     @relation(fields: [quizId], references: [id])
}
```

### Assignment Schema
```prisma
model Assignment {
  id          String   @id @default(cuid())
  lessonId    String   @unique
  title       String
  description String
  dueDate     DateTime?
  maxScore    Int      @default(100)
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  submissions AssignmentSubmission[]
}

model AssignmentSubmission {
  id           String   @id @default(cuid())
  assignmentId String
  userId       String
  fileUrl      String?  // S3 key
  content      String?  // Text submission
  grade        Float?
  feedback     String?
  submittedAt  DateTime @default(now())
  gradedAt     DateTime?
  
  assignment   Assignment @relation(fields: [assignmentId], references: [id])
  user         User       @relation(fields: [userId], references: [id])
  
  @@unique([assignmentId, userId])
}
```

### Certificate Schema
```prisma
model Certificate {
  id          String   @id @default(cuid())
  userId      String
  courseId    String
  certificateNumber String @unique
  issuedAt    DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
  course      Course   @relation(fields: [courseId], references: [id])
  
  @@unique([userId, courseId])
}
```

---

## Priority 4: Payments & Monetization

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Subscription Plans** | Monthly/yearly recurring subscriptions | Medium | High |
| **Coupons & Discounts** | Promo codes for courses | Medium | High |
| **Payment History** | Invoices and transaction history for users | Medium | Medium |
| **Free Enrollment** | Free course registration option | Low | Medium |
| **Team/Group Pricing** | Bulk purchase discounts | Medium | High |

### Coupon Schema
```prisma
model Coupon {
  id            String   @id @default(cuid())
  code          String   @unique
  type          String   // percent, fixed
  value         Float    // Discount amount or percentage
  courseId      String?  //null = sitewide
  maxUses       Int?
  usedCount     Int      @default(0)
  expiresAt     DateTime?
  isActive      Boolean  @default(true)
  
  course        Course?  @relation(fields: [courseId], references: [id])
}
```

### Subscription Schema
```prisma
model SubscriptionPlan {
  id          String   @id @default(cuid())
  name        String
  description String?
  priceMonthly Float
  priceYearly  Float
  features    Json?    // Array of feature strings
  
  stripePriceIdMonthly  String?
  stripePriceIdYearly   String?
  isActive    Boolean  @default(true)
  
  subscriptions Subscription[]
}

model Subscription {
  id              String   @id @default(cuid())
  userId          String
  planId          String
  stripeSubscriptionId String @unique
  status          String   // active, canceled, past_due
  currentPeriodEnd DateTime
  cancelAtPeriodEnd Boolean @default(false)
  
  user            User     @relation(fields: [userId], references: [id])
  plan            SubscriptionPlan @relation(fields: [planId], references: [id])
}
```

### Order Schema
```prisma
model Order {
  id            String   @id @default(cuid())
  userId        String
  totalAmount   Float
  status        String   // pending, completed, refunded
  stripePaymentId String?
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  items         OrderItem[]
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  courseId  String
  price     Float
  
  order     Order  @relation(fields: [orderId], references: [id])
  course    Course @relation(fields: [courseId], references: [id])
}
```

---

## Priority 5: Admin & Analytics

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Course Analytics** | Views, completion rates, avg time per lesson | Medium | High |
| **Revenue Dashboard** | Detailed revenue reports, refunds tracking | Medium | High |
| **Course Approvals** | Workflow for reviewing instructor-submitted courses | Medium | Medium |
| **Bulk Operations** | Bulk publish, delete, export courses | Medium | Medium |
| **Audit Logging** | Track all admin actions | Medium | Medium |

### Course Analytics Data
Track these metrics:
- Total views per course
- Unique viewers
- Enrollment rate (views → enrollments)
- Completion rate (enrolled → completed)
- Average time per lesson
- Drop-off points (where users stop)
- Revenue per course

### Audit Log Schema
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String   // Admin who performed action
  action    String   // created, updated, deleted, etc.
  entity    String   // Course, User, Lesson, etc.
  entityId  String
  changes   Json?    // Before/after values
  ipAddress String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Priority 6: Content Enhancements

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Lesson Types** | Text lessons, downloadable resources | Medium | Medium |
| **Course Prerequisites** | Require course completion before enrolling | Low | Medium |
| **Learning Paths** | Group courses into structured tracks | Medium | High |
| **Course Bundles** | Package multiple courses at discount | Medium | High |

### Lesson Types Extension
```prisma
enum LessonType {
  video
  text
  quiz
  assignment
  download
}

model Lesson {
  // ... existing fields
  type        LessonType @default(video)
  content     String?    @db.Text  // For text lessons
  fileUrl     String?    // For downloadable resources
  duration    Int?       // Duration in seconds for non-video
}
```

### Learning Path Schema
```prisma
model LearningPath {
  id          String   @id @default(cuid())
  title       String
  description String?
  thumbnail   String?
  
  courses     LearningPathCourse[]
}

model LearningPathCourse {
  id              String @id @default(cuid())
  learningPathId  String
  courseId        String
  order           Int
  
  learningPath    LearningPath @relation(fields: [learningPathId], references: [id])
  course          Course       @relation(fields: [courseId], references: [id])
  
  @@unique([learningPathId, courseId])
}
```

### Course Bundle Schema
```prisma
model Bundle {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Float    // Bundle price (usually discounted)
  isActive    Boolean  @default(true)
  
  courses     BundleCourse[]
}

model BundleCourse {
  id        String @id @default(cuid())
  bundleId  String
  courseId  String
  
  bundle    Bundle @relation(fields: [bundleId], references: [id])
  course    Course @relation(fields: [courseId], references: [id])
  
  @@unique([bundleId, courseId])
}
```

---

## Priority 7: Integrations

| Feature | Description | Effort | Impact |
|---------|-------------|--------|--------|
| **Video Hosting** | Mux/Vimeo integration for better streaming | Medium | High |
| **Email Marketing** | Mailchimp/ConvertKit for course promotions | Medium | Medium |
| **Analytics** | Google Analytics/Mixpanel tracking | Low | Medium |
| **Slack** | Notifications to Slack channels | Medium | Medium |
| **Webhooks** | Custom webhooks for integrations | Medium | Medium |

### Mux Integration Example
```typescript
// lib/mux.ts
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// Create upload URL
export async function createUploadUrl() {
  return await mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL,
    new_asset_settings: {
      playback_policy: ['public'],
      encoding_tier: 'baseline',
    },
  });
}
```

### Webhook Schema
```prisma
model Webhook {
  id          String   @id @default(cuid())
  url         String
  secret      String
  events      Json     // ['order.completed', 'user.created', etc.]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  deliveries  WebhookDelivery[]
}

model WebhookDelivery {
  id        String   @id @default(cuid())
  webhookId String
  event     String
  payload   Json
  status    String   // success, failed
  response  String?
  attemptedAt DateTime @default(now())
  
  webhook    Webhook @relation(fields: [webhookId], references: [id])
}
```

---

## Quick Wins (High Impact, Low Effort)

1. **Add Instructor Role**
   - Modify role enum in schema
   - Create permission middleware
   - Build instructor dashboard

2. **Search Functionality**
   - Add PostgreSQL full-text search indexes
   - Create search API endpoint
   - Add search bar to courses page

3. **Resume Playback**
   - Add `videoPosition` field to LessonProgress
   - Update video player to save position periodically
   - Auto-seek on load

4. **Wishlist**
   - Create Wishlist table
   - Add heart icon on course cards
   - Create wishlist page

5. **Free Enrollment**
   - Add free option in checkout flow
   - Skip Stripe for free courses
   - Direct enrollment on payment success

6. **Video Transcripts**
   - Add `transcript` field to Lesson
   - Add transcript upload in admin
   - Display transcript below video

---

## Recommended Implementation Order

| Week | Features | Deliverables |
|------|----------|--------------|
| **1** | Search + Wishlist | Search bar, wishlist page, heart buttons |
| **2** | Instructor Role | Role enum update, permission middleware, instructor dashboard |
| **2-3** | Reviews & Ratings | Review form, star ratings, sorting by rating |
| **3** | User Management UI | Users table, ban/unban, view enrollments |
| **3-4** | Certificates | Certificate generation, download page, verification API |
| **4-6** | Quizzes | Quiz builder, question types, attempt tracking |
| **6-8** | Subscriptions | Subscription plans, billing portal, recurring billing |

---

## Database Schema Changes Summary

### New Tables Needed
1. `Review` - Course reviews and ratings
2. `Discussion` - Q&A forums
3. `Note` - Personal lesson notes
4. `Wishlist` - Saved courses
5. `Coupon` - Promo codes
6. `SubscriptionPlan` / `Subscription` - Recurring billing
7. `Order` / `OrderItem` - Transaction history
8. `Quiz` / `Question` / `QuizAttempt` - Assessments
9. `Assignment` / `AssignmentSubmission` - Homework
10. `Certificate` - Completion certificates
11. `LearningPath` / `LearningPathCourse` - Course groupings
12. `Bundle` / `BundleCourse` - Course packages
13. `AuditLog` - Admin action tracking
14. `Webhook` / `WebhookDelivery` - Webhook system

### Modified Tables
1. `Lesson` - Add `type`, `content`, `fileUrl`, `duration`
2. `LessonProgress` - Add `videoPosition`
3. User role enum - Add `instructor`

---

## API Endpoints to Create

### Search
- `GET /api/courses/search?q=query`

### Reviews
- `POST /api/courses/[id]/reviews`
- `GET /api/courses/[id]/reviews`
- `PUT /api/reviews/[id]`
- `DELETE /api/reviews/[id]`

### Wishlist
- `GET /api/user/wishlist`
- `POST /api/courses/[id]/wishlist`
- `DELETE /api/courses/[id]/wishlist`

### Discussions
- `GET /api/courses/[id]/discussions`
- `POST /api/courses/[id]/discussions`
- `POST /api/discussions/[id]/reply`

### Notes
- `GET /api/lessons/[id]/notes`
- `POST /api/lessons/[id]/notes`
- `PUT /api/notes/[id]`
- `DELETE /api/notes/[id]`

### Certificates
- `GET /api/certificates/[id]/verify`
- `GET /api/certificates/[id]/download`

### Quizzes
- `POST /api/quizzes`
- `GET /api/quizzes/[id]`
- `POST /api/quizzes/[id]/attempts`
- `GET /api/quizzes/[id]/attempts`

### Assignments
- `POST /api/assignments`
- `POST /api/assignments/[id]/submit`
- `PUT /api/assignments/[id]/grade`

### Subscriptions
- `GET /api/subscriptions/plans`
- `POST /api/subscriptions`
- `GET /api/subscriptions/current`
- `DELETE /api/subscriptions`

### Coupons
- `POST /api/coupons/validate`

---

## UI Pages to Create

1. `/courses?search=query` - Search results
2. `/dashboard/wishlist` - Wishlist page
3. `/courses/[slug]/reviews` - Reviews page
4. `/instructor` - Instructor dashboard
5. `/dashboard/certificates` - Certificates page
6. `/dashboard/subscriptions` - Subscription management
7. `/admin/users` - User management
8. `/admin/courses/[id]/analytics` - Course analytics
9. `/admin/audit-logs` - Audit log viewer

---

## Next Steps

1. Choose priority features to implement first
2. Create database migration for new tables
3. Build API endpoints for chosen features
4. Create UI components for new features
5. Test thoroughly before deploying

---

*Last Updated: January 2026*
