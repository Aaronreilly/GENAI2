import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    if (token) {
      if (activeTab === 'dashboard' || activeTab === 'feedback') {
        fetchData();
      }
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch analytics
      const analyticsRes = await axios.get('http://localhost:4000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }

      // Fetch all feedback
      const feedbackRes = await axios.get('http://localhost:4000/api/feedback/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (feedbackRes.data.success) {
        setFeedback(feedbackRes.data.feedback);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const handleRespond = async (feedbackId) => {
    if (!response.trim()) return;
    setResponding(true);

    try {
      const res = await axios.post(
        `http://localhost:4000/api/feedback/${feedbackId}/respond`,
        { response },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update feedback list
        setFeedback(feedback.map(f => 
          f.id === feedbackId ? res.data.feedback : f
        ));
        setSelectedFeedback(null);
        setResponse('');
      }
    } catch (err) {
      console.error('Error responding:', err);
    }
    setResponding(false);
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
        return 'bg-green-100 text-green-700 border-green-300';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'reviewed':
        return 'bg-purple-100 text-purple-700';
      case 'responded':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-slate-400">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white p-6 overflow-y-auto">
          <nav className="space-y-3">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'feedback', label: '💬 View Feedback', icon: '💬' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' },
              { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Overview</h2>
              
              {loading || !analytics ? (
                <div className="text-center py-12">Loading analytics...</div>
              ) : (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Total Feedback</div>
                      <div className="text-4xl font-black text-blue-600">{analytics.totalFeedback}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Avg Rating</div>
                      <div className="text-4xl font-black text-green-600">{analytics.avgRating} ⭐</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-600">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Positive</div>
                      <div className="text-4xl font-black text-purple-600">{analytics.sentiment.positive}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-600">
                      <div className="text-sm font-semibold text-slate-600 mb-1">Negative</div>
                      <div className="text-4xl font-black text-red-600">{analytics.sentiment.negative}</div>
                    </div>
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Sentiment Distribution</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Positive', value: analytics.sentiment.positive, color: 'bg-green-500' },
                        { label: 'Neutral', value: analytics.sentiment.neutral, color: 'bg-yellow-500' },
                        { label: 'Negative', value: analytics.sentiment.negative, color: 'bg-red-500' }
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">{item.label}</span>
                            <span className="text-slate-600">{item.value}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{
                                width: `${analytics.totalFeedback > 0 ? (item.value / analytics.totalFeedback) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Issues Alert */}
                  {analytics.sentiment.negative > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                      <h4 className="font-bold text-red-900 mb-2">⚠️ Attention Required</h4>
                      <p className="text-red-800">You have {analytics.sentiment.negative} negative feedback items that need attention.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">All Feedback</h2>
              
              {loading ? (
                <div className="text-center py-12">Loading feedback...</div>
              ) : feedback.length === 0 ? (
                <div className="bg-white p-12 rounded-lg text-center">
                  <p className="text-2xl text-slate-600">No feedback yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-4xl">{getRatingEmoji(item.rating)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-slate-900">{item.rating}/5</span>
                              <span className={`text-xs px-2 py-1 rounded border ${getSentimentColor(item.sentiment)}`}>
                                {item.sentiment}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(item.status)}`}>
                                {item.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{item.category.toUpperCase()}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-slate-700 mb-4 p-3 bg-slate-50 rounded">{item.comment}</p>

                      {item.response ? (
                        <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
                          <p className="text-sm font-semibold text-green-900 mb-1">✓ Responded:</p>
                          <p className="text-green-800">{item.response}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedFeedback(item)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Analytics</h2>
              <div className="bg-white p-8 rounded-lg shadow text-center text-slate-600">
                <p>Advanced analytics coming soon...</p>
                <p className="text-sm mt-2">Trends, charts, and detailed reports</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Account Information</h3>
                    <p className="text-slate-600">Email: {user?.email}</p>
                    <p className="text-slate-600">Name: {user?.name}</p>
                    <p className="text-slate-600">Role: {user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Respond to Feedback</h3>
            
            <div className="mb-6 p-4 bg-slate-50 rounded">
              <p className="font-semibold text-slate-900 mb-2">Customer said:</p>
              <p className="text-slate-700">{selectedFeedback.comment}</p>
            </div>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              rows="4"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedFeedback.id)}
                disabled={responding || !response.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {responding ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
