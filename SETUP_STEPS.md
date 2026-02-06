# COMPLETE SETUP INSTRUCTIONS - Feedback Collection Bot

## Prerequisites

Ensure you have Node.js 16+ installed (download from https://nodejs.org/)

Verify:
```
node --version
npm --version
```

## Installation & Running

### Step 1: Backend Setup

```bash
cd backend
npm install
node index.js
```

**Expected output:**
```
Backend listening on 4000
```

**Keep this running in a separate terminal!**

### Step 2: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
VITE v5.2.0  ready in ... ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 3: Open in Browser

Visit: **http://localhost:5173/**

---

## Testing the API

Once backend is running, test endpoints:

```bash
# Test Sentiment Analysis
curl -X POST http://localhost:4000/api/sentiment \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"This is amazing!\"}"
```

Expected response:
```json
{
  "success": true,
  "result": {
    "sentiment": "positive",
    "confidence": 0.8,
    "keywords": ["amazing"]
  }
}
```

```bash
# Test Chat & ScaleDown
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"s_123\",\"message\":\"Great product\",\"type\":\"nps\",\"score\":9}"
```

Expected response:
```json
{
  "success": true,
  "reply": {
    "text": "Thanks for your feedback — that helps a lot! Can I ask a quick follow-up?",
    "typing": 800
  },
  "next": [
    {"id": "promote", "text": "What did you like most?"}
  ]
}
```

```bash
# Test Real-time Analytics Stream
curl http://localhost:4000/api/stream
```

Expected output (continuous event stream):
```
data: {"totalResponses":5240,"completionRate":72.3,"sentiment":{"positive":2100,"neutral":1200,"negative":940},"timestamp":1707142800000}
```

---

## Pages to Explore

- **http://localhost:5173/** — Landing with hero & chatbot preview
- **http://localhost:5173/features** — Feature cards & chatbot demo
- **http://localhost:5173/demo** — Live interactive chatbot
- **http://localhost:5173/dashboard** — Admin analytics with charts
- **http://localhost:5173/about** — How it works
- **http://localhost:5173/contact** — Sign-up form

---

## Key Features

### Chatbot Interaction

- Type messages into the input field
- Click emoji buttons (😊😐😞) for quick sentiment feedback
- Bot responds and may ask follow-up questions
- Typing indicator shows while bot "thinks"

### Sentiment Analysis

Messages are analyzed server-side:
- Positive keywords: good, great, love, excellent, awesome, happy, satisfied, easy, fast, amazing
- Negative keywords: bad, terrible, hate, awful, difficult, slow, angry, disappointed, poor

**Example:**
- Input: "This is good" → sentiment: "positive"
- Input: "This is bad" → sentiment: "negative"
- Input: "It's okay" → sentiment: "neutral"

### ScaleDown Survey Logic

Questions are dynamically selected based on NPS/CSAT/CES score:

**For NPS:**
- Score 9–10: Ask what they liked (promoter follow-up)
- Score 7–8: Ask for improvements (passive follow-up)
- Score 0–6: Ask what went wrong + contact option (detractor follow-up)

**Result:** ~75% survey compression (from 8 questions → 1–2 follow-ups)

### Dashboard Analytics

Real-time SSE connection updates:
- Total responses counter
- Completion rate line chart
- Sentiment distribution donut chart
- Recommended actions widget
- Positive sentiment percentage

---

## File Structure

```
intel_web/
├── backend/
│   ├── index.js                  (Express server)
│   ├── mockdb.js                 (In-memory store)
│   ├── package.json
│   ├── routes/
│   │   └── api.js                (API endpoints)
│   └── services/
│       ├── sentiment.js          (Sentiment analysis)
│       └── scaledown.js          (Question selection)
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── src/
│   │   ├── App.jsx               (Router)
│   │   ├── main.jsx              (React entry)
│   │   ├── index.css             (Tailwind styles)
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Demo.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   └── components/
│   │       ├── Chatbot.jsx       (Interactive chat)
│   │       ├── InsightWidget.jsx (Insight of the day)
│   │       └── DashboardPanels.jsx (KPI cards)
└── README.md

```

---

## Troubleshooting

**Backend won't start**
- Check if port 4000 is in use: `netstat -ano | findstr :4000`
- Change PORT in backend/index.js

**Frontend won't load**
- Check if port 5173 is in use
- Try: `npm run dev -- --port 5174`

**Chatbot doesn't respond**
- Ensure backend is running on `http://localhost:4000`
- Check browser console for CORS errors
- Verify `/api/chat` endpoint works with curl test above

**No analytics updates**
- Browser must stay on Dashboard page
- Check `/api/stream` endpoint with curl above

---

## Next Steps for Production

- [ ] Add MongoDB/PostgreSQL
- [ ] User authentication (JWT)
- [ ] Email follow-ups integration
- [ ] Advanced NLP (spaCy, Azure Text Analytics)
- [ ] PDF/CSV export
- [ ] Rate limiting & security headers
- [ ] Error logging & monitoring
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

---

## Support

For questions or issues, refer to the [README.md](./README.md) for architecture details.

Built with ❤️ for SaaS founders and customer success teams.