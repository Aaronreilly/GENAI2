import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    rating: 5,
    category: 'service',
    comment: ''
  });

  const categories = ['Service', 'Product', 'Support', 'Pricing', 'Other'];

  // Fetch user's feedback
  useEffect(() => {
    if (token) {
      fetchFeedback();
    }
  }, [token]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/feedback/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setFeedback(res.data.feedback);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        'http://localhost:4000/api/feedback/submit',
        {
          rating: parseInt(formData.rating),
          category: formData.category,
          comment: formData.comment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccess(res.data.autoReply);
        setFormData({ rating: 5, category: 'service', comment: '' });
        setShowForm(false);
        
        // Refresh feedback list
        setTimeout(() => {
          fetchFeedback();
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRatingEmoji = (rating) => {
    const emojis = ['😞', '😐', '😐', '😊', '😄', '🥳'];
    return emojis[rating] || '😊';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Welcome, {user?.name}! 👋</h1>
            <p className="text-indigo-100">Share your feedback and help us improve</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Top CTA */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-indigo-600">
            <h2 className="text-2xl font-bold mb-2">📝 Give Feedback</h2>
            <p className="text-slate-600 mb-6">Share your experience with us in just a minute.</p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {showForm ? 'Cancel' : 'Give Feedback'}
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-2">📊 Your Impact</h2>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-indigo-600">{feedback.length}</p>
              <p className="text-slate-600">feedback submissions</p>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        {showForm && (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h3 className="text-2xl font-bold mb-6">Share Your Feedback</h3>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  How would you rate your experience? {getRatingEmoji(formData.rating)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-2">
                  <span>😞 Bad</span>
                  <span>😐 Okay</span>
                  <span>😊 Good</span>
                  <span>😄 Great</span>
                  <span>🥳 Excellent</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.toLowerCase()})}
                      className={`p-3 rounded-lg font-semibold transition-all border-2 ${
                        formData.category === cat.toLowerCase()
                          ? 'bg-indigo-100 border-indigo-600 text-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold mb-2">Your Comment</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  placeholder="Tell us what you think..."
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <p className="text-green-700 font-semibold">{success}</p>
          </div>
        )}

        {/* Feedback History */}
        <div>
          <h3 className="text-2xl font-bold mb-6">📋 Your Feedback History</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading...</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="bg-white p-12 rounded-lg text-center">
              <p className="text-2xl mb-2">No feedback yet</p>
              <p className="text-slate-600">Start by clicking "Give Feedback" above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-600">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{getRatingEmoji(item.rating)}</span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.rating}/5 • {item.category}
                        </p>
                        <p className={`text-sm font-semibold ${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)} tone
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 mb-4">{item.comment}</p>
                  
                  {item.response && (
                    <div className="p-4 bg-blue-50 border-l-2 border-blue-400 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Admin Response:</p>
                      <p className="text-blue-800">{item.response}</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-500 mt-3">
                    Status: <span className="font-semibold">{item.status.toUpperCase()}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
