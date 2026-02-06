const express = require('express');
const router = express.Router();
const { analyzeText } = require('../services/sentiment');
const { selectNextQuestions } = require('../services/scaledown');
const db = require('../mockdb');

// ============ AUTH MIDDLEWARE ============
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.body.token;
  if (!token || !db.sessions[token]) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  req.userId = db.sessions[token];
  next();
};

// ============ AUTH ENDPOINTS ============

// POST /api/auth/register
router.post('/auth/register', (req, res) => {
  const { email, password, name, role } = req.body || {};
  
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  if (db.findUserByEmail(email)) {
    return res.status(400).json({ success: false, error: 'Email already exists' });
  }
  
  const user = db.createUser(email, password, role || 'user', name);
  const token = 'token_' + Math.random().toString(36).slice(2, 15);
  db.sessions[token] = user.id;
  
  res.json({ 
    success: true, 
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

// POST /api/auth/login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }
  
  const user = db.findUserByEmail(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
  
  const token = 'token_' + Math.random().toString(36).slice(2, 15);
  db.sessions[token] = user.id;
  
  res.json({ 
    success: true, 
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

// POST /api/auth/logout
router.post('/auth/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) delete db.sessions[token];
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/auth/me', requireAuth, (req, res) => {
  const user = db.findUserById(req.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// ============ FEEDBACK ENDPOINTS ============

// POST /api/feedback/submit
router.post('/feedback/submit', requireAuth, (req, res) => {
  const { rating, category, comment } = req.body || {};
  
  // Validation
  if (!rating || !comment || !category) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, error: 'Rating must be 1-5' });
  }
  
  // Sentiment analysis
  const sentiment = analyzeText(comment).sentiment;
  
  // Auto-reply based on rating
  let autoReply = '';
  if (rating >= 4) {
    autoReply = 'Thank you for the positive feedback! We\'re glad you\'re satisfied.';
  } else if (rating === 3) {
    autoReply = 'Thanks for your feedback. We\'re working to improve your experience.';
  } else {
    autoReply = 'We\'re sorry to hear about your experience. Our team will look into this.';
  }
  
  const feedback = db.addFeedback(req.userId, rating, category, comment, sentiment);
  
  res.json({ 
    success: true, 
    feedback,
    autoReply,
    message: 'Feedback submitted successfully!'
  });
});

// GET /api/feedback/my
router.get('/feedback/my', requireAuth, (req, res) => {
  const feedback = db.getFeedbackByUser(req.userId);
  res.json({ success: true, feedback });
});

// GET /api/feedback/all (Admin only)
router.get('/feedback/all', requireAuth, (req, res) => {
  const user = db.findUserById(req.userId);
  if (user.role !== 'business') {
    return res.status(403).json({ success: false, error: 'Only admins can view all feedback' });
  }
  
  const feedback = db.getAllFeedback();
  res.json({ success: true, feedback });
});

// POST /api/feedback/:id/respond (Admin only)
router.post('/feedback/:id/respond', requireAuth, (req, res) => {
  const user = db.findUserById(req.userId);
  if (user.role !== 'business') {
    return res.status(403).json({ success: false, error: 'Only admins can respond' });
  }
  
  const { response } = req.body || {};
  if (!response) {
    return res.status(400).json({ success: false, error: 'Response text required' });
  }
  
  const feedback = db.respondToFeedback(parseInt(req.params.id), response);
  if (!feedback) {
    return res.status(404).json({ success: false, error: 'Feedback not found' });
  }
  
  res.json({ success: true, feedback });
});

// GET /api/analytics (Admin only)
router.get('/analytics', requireAuth, (req, res) => {
  const user = db.findUserById(req.userId);
  if (user.role !== 'business') {
    return res.status(403).json({ success: false, error: 'Only admins can view analytics' });
  }
  
  const analytics = db.getAnalytics();
  res.json({ success: true, analytics });
});

// ============ LEGACY SENTIMENT/CHAT ENDPOINTS ============

router.post('/sentiment', (req, res)=>{
  const { text } = req.body || {};
  const result = analyzeText(text);
  res.json({ success: true, result });
});

router.post('/chat', (req, res)=>{
  const { sessionId, message, type, score } = req.body || {};
  
  // AI-powered response generation based on sentiment and context
  let reply = { text: '', typing: 900 };
  
  // If user provided text feedback, analyze sentiment
  if (message && typeof message === 'string' && score === undefined) {
    const analysis = analyzeText(message);
    const sentiment = analysis.sentiment;
    const tags = analysis.tags || [];
    
    // Generate contextual AI responses based on sentiment
    if (sentiment === 'positive') {
      const positiveResponses = [
        `That's wonderful to hear! 🎉 We're thrilled you're happy with ${tags[0] ? 'our ' + tags[0] : 'our service'}. Your kind words motivate us to keep improving!`,
        `Excellent feedback! 👍 Thank you for the positive words. We'd love to keep delivering this level of quality to you.`,
        `We're so glad you're satisfied! Your support fuels our passion to serve you even better. 💪`,
        `That makes our day! 🌟 Thank you for acknowledging our efforts. How can we continue to exceed your expectations?`
      ];
      reply.text = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    } else if (sentiment === 'neutral') {
      const neutralResponses = [
        `Thanks for sharing your thoughts with us. We're always looking to improve. What would make your experience better?`,
        `We appreciate your feedback! It helps us understand what's working and what needs adjustment. Any specific suggestions?`,
        `Thanks for the input! We're committed to continuous improvement. Is there anything specific you'd like to see change?`,
        `We value your perspective. To better serve you next time, what would you suggest we focus on?`
      ];
      reply.text = neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
    } else if (sentiment === 'negative') {
      const negativeResponses = [
        `We're truly sorry to hear about your experience. 😢 Your feedback is invaluable to us. Can you tell us more about what went wrong? Our team wants to make this right.`,
        `We apologize that we didn't meet your expectations. We take your concerns seriously and would like to help resolve this. What specifically would help?`,
        `We're sorry to hear this. Your feedback helps us improve. Our team is committed to turning this around for you. What's the main issue?`,
        `We regret that your experience wasn't positive. We'd love the opportunity to make it better. What happened that we can address?`
      ];
      reply.text = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
    }
  } 
  // If user provided a rating score
  else if (score !== undefined) {
    if (score >= 4) {
      const happyResponses = [
        'Thank you so much! We\'re thrilled to have made your day better. 😊',
        'That\'s great news! We\'re honored by your positive rating.',
        'You\'ve just made our team\'s day! 🎉 Thank you!'
      ];
      reply.text = happyResponses[Math.floor(Math.random() * happyResponses.length)];
    } else if (score === 3) {
      const neutralResponses = [
        'Thanks for the feedback! We\'re constantly working to improve. Any specific suggestions?',
        'We appreciate your honesty. We\'re always striving to do better.',
        'Thanks for rating us. Help us improve by sharing what we can do better.'
      ];
      reply.text = neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
    } else {
      const sadResponses = [
        'We\'re sorry to hear that. We\'d really like to understand what went wrong and fix it.',
        'Your feedback matters. Please tell us more so we can improve.',
        'We apologize. We want to make this right. Can you share more details?'
      ];
      reply.text = sadResponses[Math.floor(Math.random() * sadResponses.length)];
    }
  }
  
  db.responses.push({ sessionId, message, type, score, ts: Date.now() });
  const next = selectNextQuestions({ type, score });

  res.json({ success: true, reply, next });
});

// SSE stream for realtime analytics
router.get('/stream', (req, res)=>{
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  let count = 0;
  const send = ()=>{
    count += Math.floor(Math.random()*50 + 10);
    const analytics = db.getAnalytics();
    const payload = {
      totalResponses: analytics.totalFeedback,
      completionRate: parseFloat(analytics.completionRate),
      sentiment: analytics.sentiment,
      timestamp: Date.now()
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  send();
  const iv = setInterval(send, 2500);
  req.on('close', ()=>{ clearInterval(iv); });
});

module.exports = router;
