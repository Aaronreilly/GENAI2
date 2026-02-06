import React from 'react'

export default function About(){
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">How It Works</h2>
        <p className="text-lg text-slate-600">Our AI-powered platform transforms traditional surveys into engaging conversations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="text-4xl flex-shrink-0">1♯</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Conversational Collection</h3>
              <p className="text-slate-600">Engage users with natural, adaptive chat flows that feel like real conversations, not surveys.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl flex-shrink-0">2️⃣</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Real-time Sentiment Analysis</h3>
              <p className="text-slate-600">Instantly detect emotions and sentiment from responses with AI-powered NLP.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl flex-shrink-0">3️⃣</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Smart Follow-ups</h3>
              <p className="text-slate-600">Generate context-aware follow-up questions based on sentiment and previous responses.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl flex-shrink-0">4️⃣</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Advanced Analytics</h3>
              <p className="text-slate-600">Track sentiment trends, completion rates, and extract actionable insights automatically.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span> ScaleDown Engine
            </h4>
            <p className="text-slate-700">Automatically compress surveys by skipping irrelevant questions based on responses. <span className="font-semibold">75% shorter surveys</span> with the same insights.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🧠</span> AI-Powered Insights
            </h4>
            <p className="text-slate-700">Extract keywords, identify pain points, and generate actionable recommendations from sentiment data.</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">📡</span> Real-time Streaming
            </h4>
            <p className="text-slate-700">Server-sent events keep your dashboard updated instantly as responses come in.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Data Privacy & Security</h3>
        <p className="text-white/90 mb-4">This demo uses in-memory storage for simplicity. For production deployments, we recommend:</p>
        <ul className="space-y-2 text-white/80">
          <li>✓ Integrate with your own database (PostgreSQL, MongoDB, etc.)</li>
          <li>✓ Use HTTPS and secure API keys for transport</li>
          <li>✓ Implement encryption for sensitive feedback data</li>
          <li>✓ Set up proper access controls and audit logs</li>
        </ul>
      </div>
    </div>
  )
}
