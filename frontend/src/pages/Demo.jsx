import React from 'react'
import Chatbot from '../components/Chatbot'

export default function Demo(){
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Live Demo</h2>
        <p className="text-lg text-slate-600">Interact with the chatbot and see analytics update in real-time</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-xl border border-slate-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 -m-6 mb-6 rounded-t-lg">
            <h3 className="font-bold text-white">Interactive Feedback Bot</h3>
          </div>
          <Chatbot />
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-slate-900 mb-3">What happens here?</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>✓ Real-time sentiment analysis</li>
              <li>✓ Smart follow-up generation</li>
              <li>✓ Conversation tracking</li>
              <li>✓ Analytics updates</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-bold text-slate-900 mb-3">Try it out!</h4>
            <p className="text-sm text-slate-600 mb-3">Rate your experience using emojis or write your own feedback.</p>
            <a href="/dashboard" className="text-indigo-600 font-semibold text-sm hover:text-indigo-700">View Dashboard →</a>
          </div>
        </div>
      </div>
    </div>
  )
}
