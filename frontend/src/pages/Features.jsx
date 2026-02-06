import React from 'react'
import Chatbot from '../components/Chatbot'

export default function Features(){
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Product Features</h2>
        <p className="text-lg text-slate-600">Everything you need to collect smarter feedback</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-4xl mb-4">💬</div>
          <h4 className="font-bold text-lg mb-3">Conversational Surveys</h4>
          <p className="text-slate-600">Adaptive chat flows, typing indicators, emoji reactions, and natural language processing.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-4xl mb-4">⚙️</div>
          <h4 className="font-bold text-lg mb-3">ScaleDown Logic</h4>
          <p className="text-slate-600">Compress flows and skip irrelevant questions automatically based on sentiment.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="font-bold text-lg mb-3">Analytics & Insights</h4>
          <p className="text-slate-600">Real-time metrics, sentiment trends, and actionable recommendations.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Advanced Capabilities</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <span className="text-indigo-600 text-2xl">✓</span>
              <div>
                <h5 className="font-semibold">Sentiment Analysis</h5>
                <p className="text-sm text-slate-600">AI-powered emotion detection from text</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-purple-600 text-2xl">✓</span>
              <div>
                <h5 className="font-semibold">Smart Follow-ups</h5>
                <p className="text-sm text-slate-600">Context-aware questions based on sentiment</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-indigo-600 text-2xl">✓</span>
              <div>
                <h5 className="font-semibold">Real-time Streaming</h5>
                <p className="text-sm text-slate-600">Server-sent events for live updates</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-purple-600 text-2xl">✓</span>
              <div>
                <h5 className="font-semibold">Session Management</h5>
                <p className="text-sm text-slate-600">Track user conversations over time</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl border border-slate-100">
          <h3 className="font-bold mb-4 text-slate-900">Try it Now</h3>
          <Chatbot />
        </div>
      </div>
    </div>
  )
}
