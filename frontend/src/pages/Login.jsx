import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successTimeout, setSuccessTimeout] = useState(null);
  
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isAdmin } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        // Login: role is determined by backend based on email
        result = await login(email, password);
        if (result.success) {
          // Redirect based on role from server
          const userRole = result.user.role;
          navigate(userRole === 'business' ? '/admin/dashboard' : '/user/dashboard');
        } else {
          setError(result.error || 'Authentication failed');
        }
      } else {
        // Register: use selected role
        result = await register(email, password, name, role);
        if (result.success) {
          // Show success confirmation
          setSuccessMessage(`✅ Account Created Successfully!\n\nWelcome, ${name}!\n\nYour ${role === 'business' ? 'Admin' : 'User'} account has been created.\n\nClick "Back to Login" to proceed.`);
          
          // Clear form
          setEmail('');
          setPassword('');
          setName('');
          setRole('user');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-5xl">🤖</div>
            <h1 className="text-3xl font-black text-slate-900">FeedbackBot</h1>
            <p className="text-slate-600">Intelligent Feedback Management</p>
          </div>

          {/* Success Confirmation - Full Screen, Only Message */}
          {successMessage ? (
            <div className="text-center space-y-6">
              <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
                <p className="text-green-700 font-bold text-lg whitespace-pre-line">
                  {successMessage}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsLogin(true);
                  setSuccessMessage('');
                  setEmail('');
                  setPassword('');
                  setName('');
                  setRole('user');
                }}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Tab Toggle */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 rounded font-semibold transition-all ${
                    isLogin 
                      ? 'bg-white text-indigo-600 shadow' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 rounded font-semibold transition-all ${
                    !isLogin 
                      ? 'bg-white text-indigo-600 shadow' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="user">📝 Regular User (Give Feedback)</option>
                  <option value="business">👨‍💼 Business / Admin (Manage Feedback)</option>
                </select>
              </div>
            )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold">⚠️ {error}</p>
            </div>
          )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-slate-600">
            <p>The system uses role-based access for secure feedback management.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
