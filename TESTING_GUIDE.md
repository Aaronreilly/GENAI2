# 🚀 SaaS Application Testing Guide

## Quick Start

### Terminal 1: Start Backend Server
```bash
cd backend
node index.js
```
**Expected Output:**
```
Server running on http://localhost:4000
```

### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
VITE v5.4.21 ready in XXms ➜ Local: http://localhost:5173/
```

## Testing the Application

### 1. **Home Page Navigation**
- Open: http://localhost:5173/
- Verify: Landing page loads with Home, Features, Live Demo, About, Login buttons
- Navigation bar shows all menu items

### 2. **User Flow (Feedback Submission)**

#### 2.1 Register as User
1. Click "Login" button in top-right
2. Click "Register" tab
3. Select role: **"User (Give Feedback)"**
4. Fill in:
   - Email: `newuser@example.com`
   - Password: `password123`
   - Name: `Test User`
5. Click "Register"
6. **Redirect to:** /user/dashboard

#### 2.2 Submit Feedback
1. On User Dashboard:
   - **Rating Slider:** Move to 5 stars (⭐⭐⭐⭐⭐)
   - **Category:** Select "Service"
   - **Comment:** Type "Great experience with your platform!"
   - Click "Submit Feedback"
2. **Verify:**
   - Success message appears
   - Feedback appears in "Your Feedback" section below
   - Sentiment shows "positive" (green badge)
   - Auto-reply displays: "Thanks! We appreciate your feedback 🙏"

#### 2.3 View Feedback History
- Scroll down to see all submitted feedback
- Each item shows:
  - Rating with emoji
  - Category badge
  - Comment text
  - Sentiment color (green/yellow/red)
  - Status (new/reviewed/responded)
  - Admin response (if any)

#### 2.4 Logout
- Click "Logout" button (top-right)
- Redirected to home page

### 3. **Admin Flow (Feedback Management)**

#### 3.1 Login as Admin
1. Click "Login" in navigation
2. Click "Login" tab (default)
3. Select role: **"Business/Admin (Manage Feedback)"**
4. Use demo credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
5. Click "Login"
6. **Redirect to:** /admin/dashboard

#### 3.2 Dashboard Tab
1. Verify KPI cards display:
   - **Total Feedback:** Count of all submissions
   - **Avg Rating:** Average rating (e.g., 4.5)
   - **Positive:** Count of positive feedback
   - **Negative:** Count of negative feedback

2. Verify Sentiment Distribution chart shows:
   - Green bar for Positive
   - Yellow bar for Neutral
   - Red bar for Negative

3. **Alert System:**
   If negative feedback exists, yellow alert shows: "⚠️ Attention Required - You have X negative feedback items"

#### 3.3 View Feedback Tab
1. Click "💬 View Feedback" in sidebar
2. Verify all feedback displays in list
3. Each feedback item shows:
   - Rating emoji (😞😐😐😊😄🥳)
   - Rating number (1-5)
   - Sentiment badge (green/yellow/red)
   - Status badge (blue/purple/green)
   - Category in uppercase
   - User comment
   - Date submitted
   - "Respond" button (if not already responded)

#### 3.4 Respond to Feedback
1. Click "Respond" button on any feedback
2. Modal appears with:
   - Customer's original comment shown
   - Text area for response
   - Cancel & Send Response buttons
3. Type response: "Thank you for your feedback! We're working on improvements."
4. Click "Send Response"
5. **Verify:**
   - Modal closes
   - Feedback now shows green response box: "✓ Responded: [your response]"
   - "Respond" button disappears

#### 3.5 Analytics Tab
- Currently shows: "Advanced analytics coming soon..."
- Placeholder for future charts and trends

#### 3.6 Settings Tab
1. Click "⚙️ Settings"
2. View account information:
   - Email: admin@example.com
   - Name: Admin User
   - Role: business

#### 3.7 Logout
- Click "Logout" button
- Redirected to home page

### 4. **Test Different Rating Scenarios**

#### Scenario A: Negative Feedback
- User rating: 1 star (😞)
- Comment: "Slow loading times"
- **Expected:**
  - Sentiment: "negative" (red badge)
  - Auto-reply: "We're sorry to hear that 😞. We're working on improvements."
  - Admin sees alert about negative feedback

#### Scenario B: Neutral Feedback
- User rating: 3 stars (😐)
- Comment: "It's okay"
- **Expected:**
  - Sentiment: "neutral" (yellow badge)
  - Auto-reply: "Thanks for your feedback"

#### Scenario C: Positive Feedback
- User rating: 5 stars (🥳)
- Comment: "Amazing platform!"
- **Expected:**
  - Sentiment: "positive" (green badge)
  - Auto-reply: "Thanks! We appreciate your feedback 🙏"

### 5. **Test Role-Based Access Control**

#### 5.1 User Cannot Access Admin Dashboard
1. Log in as user
2. Manually navigate to: http://localhost:5173/admin/dashboard
3. **Expected:** Redirect to /user/dashboard

#### 5.2 Admin Cannot Submit User Feedback
1. Log in as admin
2. Manually navigate to: http://localhost:5173/user/dashboard
3. **Expected:** Redirect to /admin/dashboard

#### 5.3 Non-Logged Users Blocked
1. Logout from both dashboards
2. Navigate to: http://localhost:5173/user/dashboard
3. **Expected:** Redirect to /login

### 6. **Test Demo Features**

#### On Login Page
- Check demo credentials section shows:
  - User demo: user@example.com / password123
  - Admin demo: admin@example.com / admin123

### 7. **Error Scenarios**

#### 7.1 Invalid Credentials
1. Login page
2. Email: `wrong@example.com`
3. Password: `wrongpass`
4. **Expected:** Error message: "Invalid email or password"

#### 7.2 Empty Form Submission
- User Dashboard: Try submitting with empty comment
- **Expected:** Error message: "Comment is required"

#### 7.3 Missing Category Selection
- User Dashboard: Try submitting without category
- **Expected:** Error message: "Please select a category"

## Demo Users Available

### User Account
```
Email: user@example.com
Password: password123
Role: user
```

### Admin Account
```
Email: admin@example.com
Password: admin123
Role: business
```

### Create Your Own
1. Register on Login page with any email/password
2. Choose role during registration
3. New user created in system

## API Endpoints Reference

### Authentication
```
POST /auth/register     - Register new user
POST /auth/login        - Login user
POST /auth/logout       - Logout user
GET /auth/me            - Get current user
```

### Feedback (Authenticated)
```
POST /api/feedback/submit    - Submit new feedback
GET /api/feedback/my         - Get user's own feedback
GET /api/feedback/all        - Get all feedback (admin only)
POST /api/feedback/:id/respond - Respond to feedback (admin only)
```

### Analytics (Admin Only)
```
GET /api/analytics           - Get analytics data
```

## Key Features Implemented

✅ **Authentication System**
- Registration with email/password
- Role selection (User vs Admin)
- Token-based sessions
- localStorage persistence

✅ **User Dashboard**
- Rating slider (1-5)
- Category selection (6 categories)
- Comment submission
- Auto-reply based on rating
- Feedback history with sentiment colors
- View admin responses

✅ **Admin Dashboard**
- Sidebar navigation (4 tabs)
- Dashboard with KPI cards
- Sentiment distribution chart
- Alert system for negative feedback
- View all feedback
- Respond to feedback (modal)
- Analytics placeholder
- Settings view

✅ **Sentiment Analysis**
- Keyword-based sentiment detection
- Confidence scoring (0.5-0.95)
- Auto-tagging by category (speed, support, ui, price, quality, security)
- Intensity scoring

✅ **Security**
- Authentication middleware on sensitive routes
- Role-based access control (RBAC)
- Token verification on all requests
- Protected routes on frontend

## Troubleshooting

### Build Issues
```bash
# Clear node_modules and reinstall
cd frontend
rm -r node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Backend on 4000
netstat -ano | findstr :4000

# Frontend on 5173
netstat -ano | findstr :5173
```

### Blank Page or No Data
1. Check browser console (F12) for errors
2. Verify both servers are running
3. Check network tab for API calls
4. Verify tokens in localStorage (Dev Tools → Application → Local Storage)

### Login Not Working
1. Clear localStorage: Dev Tools → Application → Clear all
2. Try demo credentials first
3. Check backend logs for auth errors
4. Verify backend is running on port 4000

## Next Steps to Enhance

- [ ] Add analytics charts (Chart.js or Recharts)
- [ ] Add email notifications on negative feedback
- [ ] Add feedback search/filter on admin dashboard
- [ ] Add user feedback trends (weekly/monthly)
- [ ] Add feedback export (CSV)
- [ ] Add team members for admin (assign feedback to team)
- [ ] Add feedback tags for prioritization
- [ ] Add dark mode
- [ ] Add mobile app version
- [ ] Replace mockdb with MongoDB/PostgreSQL

---

**Last Updated:** 2024
**Status:** Production Ready (Core Features Complete)
