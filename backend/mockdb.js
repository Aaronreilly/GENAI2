// In-memory mock DB with authentication, users, feedback, and analytics

// Demo users (in production: use MongoDB/PostgreSQL with bcrypt)
const users = [
  { id: 1, email: 'user@example.com', password: 'password123', role: 'user', name: 'John User' },
  { id: 2, email: 'admin@example.com', password: 'admin123', role: 'business', name: 'Jane Admin' },
  { id: 3, email: 'testuser@example.com', password: 'test123', role: 'user', name: 'Test User' }
];

const db = {
  sessions: {},
  users: users,
  feedback: [], // { id, userId, rating, category, comment, sentiment, createdAt, status }
  responses: [], // Legacy responses
  nextFeedbackId: 1,
  nextUserId: 4,
  
  // Auth helpers
  findUserByEmail: function(email) {
    return this.users.find(u => u.email === email);
  },
  
  findUserById: function(id) {
    return this.users.find(u => u.id === id);
  },
  
  createUser: function(email, password, role, name) {
    const newUser = { 
      id: this.nextUserId++, 
      email, 
      password, // In production: use bcrypt
      role,
      name,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  },
  
  // Feedback helpers
  addFeedback: function(userId, rating, category, comment, sentiment) {
    const feedback = {
      id: this.nextFeedbackId++,
      userId,
      rating,
      category,
      comment,
      sentiment,
      status: 'new', // new, reviewed, responded
      createdAt: new Date(),
      response: null
    };
    this.feedback.push(feedback);
    return feedback;
  },
  
  getFeedbackByUser: function(userId) {
    return this.feedback.filter(f => f.userId === userId);
  },
  
  getAllFeedback: function() {
    return this.feedback;
  },
  
  respondToFeedback: function(feedbackId, response) {
    const feedback = this.feedback.find(f => f.id === feedbackId);
    if (feedback) {
      feedback.response = response;
      feedback.status = 'responded';
    }
    return feedback;
  },
  
  // Analytics helpers
  getAnalytics: function() {
    const total = this.feedback.length;
    const positive = this.feedback.filter(f => f.sentiment === 'positive').length;
    const negative = this.feedback.filter(f => f.sentiment === 'negative').length;
    const neutral = total - positive - negative;
    
    const avgRating = total > 0 
      ? (this.feedback.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
      : 0;
    
    // Category breakdown
    const byCategory = {};
    this.feedback.forEach(f => {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    });
    
    return {
      totalFeedback: total,
      avgRating,
      sentiment: { positive, neutral, negative },
      byCategory,
      completionRate: total > 0 ? Math.min(100, (total / 50) * 100).toFixed(1) : 0
    };
  }
};

module.exports = db;
