import React from 'react'
import Chatbot from '../components/Chatbot'
import InsightWidget from '../components/InsightWidget'

export default function Landing(){
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <section className="space-y-8">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Feedback Collection Bot</h1>
            <p className="text-xl text-slate-700 leading-relaxed">Collect conversational feedback with AI-powered chatbots — <span className="font-bold text-indigo-600">80% faster insights, 50% higher completion, 75% survey compression.</span></p>
          </div>
          
          <div className="flex gap-4">
            <a href="/demo" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all hover:scale-105">Try Live Demo →</a>
            <a href="/contact" className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-all">Get Started</a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-3 items-start p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-bold text-slate-900">Real-time Sentiment Analysis</h4>
                <p className="text-sm text-slate-600">Instantly understand customer emotions</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-bold text-slate-900">ScaleDown Survey Compression</h4>
                <p className="text-sm text-slate-600">Skip irrelevant questions automatically</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-slate-900">Smart Follow-ups</h4>
                <p className="text-sm text-slate-600">Context-aware questions for deeper insights</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Live Insights</h3>
            <InsightWidget />
          </div>
          <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 className="font-bold text-white">Try the Chatbot</h3>
            </div>
            <div className="p-4">
              <Chatbot />
            </div>
          </div>
        </aside>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-bold text-lg mb-2">Intelligent Routing</h3>
          <p className="text-slate-600 text-sm">Automatically adapt questions based on responses</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="font-bold text-lg mb-2">Real-time Analytics</h3>
          <p className="text-slate-600 text-sm">Track sentiment trends and actionable insights</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-all">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-bold text-lg mb-2">Easy Integration</h3>
          <p className="text-slate-600 text-sm">API-first design for seamless deployment</p>
        </div>
      </div>
    </div>
  )
}
