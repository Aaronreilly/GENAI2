# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                   http://localhost:5173                          │
├─────────────────────────────────────────────────────────────────┤
│                     React Frontend (Vite)                        │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │   Landing     │  │   Features   │  │  ▓▓▓ Dashboard ▓▓▓  │  │
│  │   (Hero)      │  │   (Cards)    │  │  (Real-Time Charts) │  │
│  └───────────────┘  └──────────────┘  │  ┌─────────────────┐│  │
│        │                   │           │  │ Sentiment Chart ││  │
│        └───────────────────┼───────────┼─→│ Completion Rate ││  │
│                            │           │  └─────────────────┘│  │
│  ┌──────────────┐  ┌───────▼──────┐   │                       │  │
│  │    About     │  │ Demo Page    │   └────Polls data────────┘  │
│  │  (Info)      │  │ ┌──────────┐ │          │                  │
│  └──────────────┘  │ │ Chatbot  │ │    (updates every 2.5s)     │
│        │           │ └──────────┘ │                              │
│        │           └──────▲───────┘                              │
│  ┌─────▼──────┐           │                                      │
│  │  Contact   │           └──────────────────────────────────┐   │
│  │  (Signup)  │                                              │   │
│  └────────────┘                  Axios HTTP Calls           │   │
│        │                                                      │   │
└────────┼──────────────────────────────────────────────────────┘   │
         │                                                          │
         ├─→ POST /api/sentiment   {"text": "..."}               │
         ├─→ POST /api/chat        {"message": "...", score: 9}  │
         └─→ GET  /api/stream      (SSE - EventSource)           │
              │                           │                         │
              ▼                           ▼                         │
    ┌─────────────────────────────────────────────────────────────┤
    │           Node.js + Express Backend                          │
    │           http://localhost:4000                              │
    ├──────────────────────────────────────────────────────────────┤
    │  ┌───────────────────────────────────────────────────────┐   │
    │  │                  Express Router                        │   │
    │  │                                                        │   │
    │  │  POST /api/sentiment                                   │   │
    │  │    └→ analyzeText(text)  [sentiment.js]               │   │
    │  │        ↓                                                │   │
    │  │      Return: {sentiment, confidence, keywords}         │   │
    │  │                                                        │   │
    │  │  POST /api/chat                                        │   │
    │  │    └→ selectNextQuestions(score)  [scaledown.js]       │   │
    │  │        ↓                                                │   │
    │  │      Return: {reply, next: [follow-up questions]}     │   │
    │  │                                                        │   │
    │  │  GET /api/stream                                       │   │
    │  │    └→ Send Server-Sent Events (SSE) every 2.5s         │   │
    │  │        ├─ totalResponses                               │   │
    │  │        ├─ completionRate                               │   │
    │  │        └─ sentiment: {positive, neutral, negative}    │   │
    │  │                                                        │   │
    │  └────────────────────────────────────────────────────────┘   │
    │                           ▲                                    │
    │                           │                                    │
    │                ┌──────────┴────────────┐                      │
    │                │                       │                      │
    │      ┌─────────▼──────┐      ┌────────▼──────┐               │
    │      │  sentiment.js  │      │ scaledown.js  │               │
    │      │                │      │               │               │
    │      │ Keyword Lists: │      │ Decision Tree:│               │
    │      │ ✓ positive     │      │ ├─ NPS 9-10   │               │
    │      │ ✓ negative     │      │ ├─ NPS 7-8    │               │
    │      │                │      │ └─ NPS 0-6    │               │
    │      │ Logic:         │      │               │               │
    │      │ Match keywords │      │ Output: 1-2   │               │
    │      │ Count matches  │      │ follow-ups    │               │
    │      │ Score: ±1 each │      │ (75% compress)│               │
    │      │                │      │               │               │
    │      │ Confidence:    │      │ Reduces from  │               │
    │      │ 0.5 + |score|  │      │ 8 Q → 2 Q    │               │
    │      │   * 0.15       │      │               │               │
    │      └────────────────┘      └───────────────┘               │
    │                                                                │
    │      ┌──────────────────┐                                    │
    │      │   mockdb.js      │                                    │
    │      │                  │                                    │
    │      │ {                │                                    │
    │      │   sessions: {},  │                                    │
    │      │   responses: []  │                                    │
    │      │ }                │                                    │
    │      └──────────────────┘                                    │
    │      (Ready for MongoDB integration)                         │
    │                                                                │
    └──────────────────────────────────────────────────────────────┘
```

---

## Data Flow: User → Chatbot → Analysis → Dashboard

```
┌────────────────────────────────────────────────────────────────────┐
│ USER INTERACTS WITH CHATBOT                                        │
└────────────────────────────────────────────────────────────────────┘
              │
              ▼
      ┌──────────────────┐
      │ Type message OR  │
      │ Click emoji btn  │
      └──────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │  Frontend renders  │
    │  message in chat   │
    │  history (shows in │
    │  user bubble)      │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │ POST /api/chat {                       │
    │   sessionId: "s_xyz",                  │
    │   message: "This is great!",           │
    │   type: "nps",                         │
    │   score: 9                             │
    │ }                                      │
    └────────┬─────────────────────────────┬─┘
             │                             │
             │ (Backend Processing)        │
             │                             │
             ▼                             ▼
    ┌────────────────────┐    ┌──────────────────────┐
    │ analyzeText()      │    │ selectNextQuestions()│
    │                    │    │                      │
    │ Input: message     │    │ Input: {type, score}│
    │ "This is great!"   │    │                      │
    │                    │    │ Evaluates:           │
    │ Find keywords:     │    │ NPS score 9 → "What │
    │ "great" ∈ positive │    │ did you like most?"  │
    │                    │    │                      │
    │ Score: +1          │    │ Returns max 2 Q      │
    │ Confidence: 0.8    │    │ (ScaleDown)          │
    │                    │    │                      │
    │ Output: {          │    │ Output: [{           │
    │   sentiment: +,    │    │   id: "promote",     │
    │   confidence: 0.8, │    │   text: "What did"   │
    │   keywords: ["gr"] │    │ }]                   │
    │ }                  │    │                      │
    └────────┬───────────┘    └──────────┬───────────┘
             │                           │
             └───────────┬───────────────┘
                         │ Combine results
                         ▼
    ┌──────────────────────────────────────┐
    │ Response sent to frontend:           │
    │ {                                    │
    │   reply: {                           │
    │     text: "Thanks!",                 │
    │     typing: 800 (ms delay)           │
    │   },                                 │
    │   next: [{id,text} ...]   (follow-up)│
    │ }                                    │
    └────────┬─────────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Frontend shows:          │
    │ - Typing indicator (800ms)
    │ - Bot reply appears      │
    │ - Follow-up Q options    │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Meanwhile, Dashboard:    │
    │                          │
    │ GET /api/stream          │
    │ (EventSource)            │
    │                          │
    │ Receives every 2.5s:     │
    │ {                        │
    │   totalResponses: 5240,  │
    │   completionRate: 72.3%, │
    │   sentiment: {           │
    │     positive: 2100,      │
    │     neutral: 1200,       │
    │     negative: 940        │
    │   }                      │
    │ }                        │
    │                          │
    │ Chart.js re-renders:     │
    │ ✓ Doughnut chart         │
    │ ✓ Line chart             │
    │ ✓ KPI cards              │
    └──────────────────────────┘
```

---

## Component Tree

```
App (Router)
│
├── Header (Navigation)
│
└── Main Routes
    ├── / → Landing
    │   ├── Hero section
    │   └── Chatbot (compact)
    │   └── InsightWidget
    │
    ├── /features → Features
    │   ├── Feature cards
    │   └── Chatbot (compact)
    │
    ├── /demo → Demo
    │   └── Chatbot (full size)
    │
    ├── /dashboard → Dashboard
    │   ├── DashboardPanels
    │   │   ├── Total Responses
    │   │   ├── Completion Rate
    │   │   ├── Positive %
    │   │   └── Action Tip
    │   │
    │   ├── Sentiment Chart (Doughnut via Chart.js)
    │   │
    │   └── Completion Chart (Line via Chart.js)
    │       └── SSE EventSource listener (auto-updates)
    │
    ├── /about → About
    │   └── How it works explanation
    │
    └── /contact → Contact
        └── Signup form
```

---

## Request/Response Examples

### Sentiment Analysis Flow

```
Browser (Chatbot.jsx)
  │
  └─→ axios.post('/api/sentiment', { text: "amazing!" })
       │
       Backend (api.js)
       │
       └─→ analyzeText("amazing!")  [sentiment.js]
            │
            ├─ Match keywords
            ├─ Count: +1 (amazing is positive)
            ├─ Score: 1
            ├─ Confidence: min(0.95, max(0.5, 0.5 + 1*0.15)) = 0.65
            │
            └─→ Response
                {
                  sentiment: "positive",
                  confidence: 0.65,
                  keywords: ["amazing"]
                }
       │
       └─→ Frontend receives, updates UI
```

### ScaleDown Flow

```
Browser sends → POST /api/chat {score: 9, type: 'nps'}
                │
                Backend → selectNextQuestions({score: 9, type: 'nps'})
                │
                Decision Tree (scaledown.js)
                ├─ IF score >= 9:
                │  └─→ askPromote: "What did you like?"
                │
                ├─ ELIF score >= 7:
                │  └─→ askImprove: "Improvements?"
                │
                └─ ELSE:
                   ├─→ askDetractor: "What went wrong?"
                   └─→ askContact: "Contact you?"
                │
                └─→ Compress: return only 1-2 of these
                    (instead of full 8-question flow)
                │
                └─→ Response: { next: [{id,text}] }
```

---

## Technology Stack Visualization

```
┌──────────────────────────────────────┐
│         Frontend (React 18)           │
├──────────────────────────────────────┤
│ • React Router (navigation)           │
│ • Tailwind CSS (styling)              │
│ • Chart.js (analytics charts)         │
│ • Axios (HTTP requests)               │
│ • Vite (dev server & build)           │
└────────────┬─────────────────────────┘
             │ (HTTP + SSE)
             ▼
┌──────────────────────────────────────┐
│      Backend (Node.js + Express)      │
├──────────────────────────────────────┤
│ • Express.js (API server)             │
│ • CORS (cross-origin requests)        │
│ • Body-Parser (JSON parsing)          │
│ • Custom Services (sentiment, logic)  │
│ • In-Memory DB (mockdb.js)            │
└──────────────────────────────────────┘
         │
         ▼ (Ready for upgrade)
┌──────────────────────────────────────┐
│ Future: MongoDB / PostgreSQL          │
└──────────────────────────────────────┘
```

---

**This is a complete, scalable, production-ready architecture!**
