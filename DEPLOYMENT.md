# Deployment & Production Checklist

## Pre-Launch Checklist

### Backend (Node.js + Express)

- [ ] **Environment Variables**
  ```bash
  # Create backend/.env
  PORT=4000
  NODE_ENV=production
  CORS_ORIGIN=https://yourdomain.com
  ```

- [ ] **Error Handling**
  - [ ] Add try-catch in all route handlers
  - [ ] Implement error logging (Winston, Sentry)
  - [ ] Add health check endpoint (`GET /health`)

- [ ] **Security**
  - [ ] Add CORS validation (restrict origins)
  - [ ] Add rate limiting (express-rate-limit)
  - [ ] Add helmet for security headers
  - [ ] Validate input data (joi, yup)
  - [ ] Add HTTPS/TLS support

- [ ] **Database**
  - [ ] Replace mockdb.js with MongoDB/PostgreSQL
  - [ ] Add connection pooling
  - [ ] Create indexes on frequently queried fields
  - [ ] Add database backup strategy

- [ ] **Monitoring**
  - [ ] Add logging (console → file → cloud)
  - [ ] Add APM (Application Performance Monitoring)
  - [ ] Set up alerts for errors and high latency

- [ ] **Testing**
  - [ ] Unit tests for sentiment.js and scaledown.js
  - [ ] Integration tests for /api endpoints
  - [ ] Load testing for /api/stream with 10k concurrent users

### Frontend (React + Vite)

- [ ] **Build Optimization**
  ```bash
  npm run build
  # Output: dist/ folder (~50-100KB gzipped)
  ```

- [ ] **Environment Variables**
  ```javascript
  // Create frontend/.env.production
  VITE_API_URL=https://api.yourdomain.com
  VITE_ANALYTICS_ID=google-analytics-key
  ```

- [ ] **Performance**
  - [ ] Enable code splitting (automatic in Vite)
  - [ ] Lazy load Dashboard and other heavy pages
  - [ ] Add image optimization (WebP, lazy loading)
  - [ ] Minify CSS/JS (automatic in build)

- [ ] **SEO**
  - [ ] Add meta tags (title, description, og:image)
  - [ ] Create robots.txt
  - [ ] Add sitemap.xml
  - [ ] Ensure mobile responsiveness (100 Lighthouse Score)

- [ ] **Security**
  - [ ] Enable CSP (Content Security Policy)
  - [ ] Remove sensitive data from console logs
  - [ ] Use HTTPS only
  - [ ] Add X-Frame-Options header

- [ ] **Analytics**
  - [ ] Integrate Google Analytics / Mixpanel
  - [ ] Track key events (chatbot start, sentiment submitted, dashboard view)

- [ ] **Testing**
  - [ ] Component tests (React Testing Library)
  - [ ] E2E tests (Cypress, Playwright)
  - [ ] Visual regression tests

## Hosting Options

### Backend Deployment

**Option 1: Vercel / Netlify Functions** (Serverless)
```bash
# Deploy Express to Vercel
npm install -g vercel
vercel
```

**Option 2: Heroku** (Easy hosting)
```bash
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]

# Deploy
heroku login
heroku create feedback-bot-api
git push heroku main
```

**Option 3: Docker + AWS EC2 / DigitalOcean**
```bash
docker build -t feedback-bot-api .
docker run -p 4000:4000 feedback-bot-api
```

**Option 4: Self-Hosted (AWS, GCP, Azure)**
- Use PM2 for process management
- Nginx reverse proxy
- SSL certificate from Let's Encrypt

### Frontend Deployment

**Option 1: Vercel** (Recommended)
```bash
vercel --prod
# Automatic preview deploys on every push
```

**Option 2: Netlify**
```bash
npm run build
# Drag dist/ folder to Netlify
# Or: netlify deploy --prod --dir=dist
```

**Option 3: AWS S3 + CloudFront**
```bash
aws s3 cp dist/ s3://your-bucket-name --recursive
```

**Option 4: GitHub Pages**
```bash
# Add to vite.config.js:
export default {
  base: '/feedback-bot/',
  ...
}

npm run build
# Push dist/ to gh-pages branch
```

## Database Integration (MongoDB)

Replace mockdb.js:

```javascript
// backend/config/db.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
```

Create schemas:

```javascript
// backend/models/Response.js
const schema = new mongoose.Schema({
  sessionId: String,
  message: String,
  sentiment: String,
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', schema);
```

## Scaling Strategy

### API Scaling
- Horizontal: Load balance multiple Node.js instances (pm2-cluster)
- Cache responses (Redis)
- Use CDN for static assets (CloudFlare)

### Database Scaling
- Read replicas for analytics queries
- Sharding by sessionId
- Archive old responses to cold storage (S3)

### Real-time Scaling
- Replace EventSource with WebSocket (Socket.io)
- Use Redis Pub/Sub for multi-server sync
- Add message queue (RabbitMQ, Kafka)

## Monitoring & Cost

### Essential Tools
- **Error Tracking:** Sentry ($0–$99/mo)
- **Monitoring:** Datadog ($15+/mo)
- **Logging:** LogRocket ($99+/mo)
- **Analytics:** Mixpanel ($999+/mo) or free tier

### Expected Monthly Costs
- Backend (Heroku): $7–100+
- Database (MongoDB Atlas): $0–500+
- Frontend (Vercel): $0–20
- CDN: $0–50
- Email (SendGrid): $10–300

**Total minimum:** $50–100/mo

## Marketing Checklist

- [ ] Create landing page copy
- [ ] Create demo video (chatbot interaction)
- [ ] Write blog posts about sentiment analysis
- [ ] Create case studies
- [ ] Set up email drip campaign
- [ ] Add testimonials & trust badges
- [ ] Set up live chat support
- [ ] Create API documentation (Swagger/OpenAPI)

## Post-Launch

- [ ] Monitor error rates and response times
- [ ] Gather user feedback on chatbot experience
- [ ] A/B test different survey flows
- [ ] Optimize sentiment keywords based on false positives
- [ ] Plan feature roadmap (advanced NLP, ML-powered follow-ups)

---

**Estimated time to production:** 2–4 weeks  
**Team size:** 1 full-stack dev (or 1 backend + 1 frontend)  
**Expected users at launch:** 100–1000/month
