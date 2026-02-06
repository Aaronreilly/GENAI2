import React from 'react'

export default function Contact(){
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Get Started</h2>
        <p className="text-lg text-slate-600">Join thousands of companies collecting smarter feedback</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border border-slate-100 space-y-4">
          <h3 className="font-bold text-lg mb-6">Contact Information</h3>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Full Name</label>
            <input 
              required
              className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              placeholder="John Doe" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Company Email</label>
            <input 
              required
              type="email"
              className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              placeholder="john@company.com" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Company Size</label>
            <select className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Small Business (1-50)</option>
              <option>Mid-size (50-500)</option>
              <option>Enterprise (500+)</option>
              <option>SaaS/Tech</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Tell us about your use case</label>
            <textarea 
              required
              className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-28" 
              placeholder="How would you like to collect feedback?" 
            />
          </div>
          
          <button 
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Request Demo
          </button>
          
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">✓ Thanks! We'll be in touch soon.</p>
            </div>
          )}
        </form>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Quick Setup
            </h4>
            <p className="text-slate-700 text-sm">API-first design means you can be collecting feedback within hours, not weeks.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🚀</span> Dedicated Support
            </h4>
            <p className="text-slate-700 text-sm">Our team will help you customize flows, train models, and optimize for your use case.</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span> Proven Results
            </h4>
            <p className="text-slate-700 text-sm">Clients see 80% faster insights and 50% higher completion rates on average.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">💰</span> Flexible Pricing
            </h4>
            <p className="text-slate-700 text-sm">Start free, pay as you grow. No long-term contracts required.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
