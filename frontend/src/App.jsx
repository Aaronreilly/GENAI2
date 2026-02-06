import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Features from './pages/Features'
import Demo from './pages/Demo'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent(){
  const { isAuthenticated, isAdmin, token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header - Only show for logged-in users with role-based navigation */}
      {token && isAuthenticated && (
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
            <Link to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-3xl">🤖</span> FeedbackBot
            </Link>
            <nav className="flex gap-6 items-center">
              {isAdmin ? (
                <>
                  <Link to="/features" className="text-white/80 hover:text-white font-medium transition-colors">Features</Link>
                  <Link to="/dashboard" className="text-white/80 hover:text-white font-medium transition-colors">Statistics</Link>
                  <Link to="/admin/dashboard" className="text-white/80 hover:text-white font-medium transition-colors">Admin Panel</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="text-white/80 hover:text-white font-medium transition-colors">Home</Link>
                  <Link to="/demo" className="text-white/80 hover:text-white font-medium transition-colors">Feedback Bot</Link>
                  <Link to="/about" className="text-white/80 hover:text-white font-medium transition-colors">About</Link>
                  <Link to="/user/dashboard" className="text-white/80 hover:text-white font-medium transition-colors">My Feedback</Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      <main className={token ? "" : ""}>
        <Routes>
          {/* Public routes - only accessible when logged in */}
          <Route path="/" element={<Landing/>} />
          <Route path="/features" element={<Features/>} />
          <Route path="/demo" element={<Demo/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          
          {/* Auth route */}
          <Route path="/login" element={<Login/>} />
          
          {/* Legacy dashboard */}
          <Route path="/dashboard" element={<Dashboard/>} />
          
          {/* Protected routes */}
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="business">
                <AdminDashboard/>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback - redirect based on auth status */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </main>

      {/* Footer - Hidden when logged in */}
      {token ? null : (
        <footer className="bg-slate-900 text-white mt-16 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-slate-400">
            <p>© 2024 Feedback Collection Bot. Collect smarter feedback. Powered by AI.</p>
          </div>
        </footer>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}
