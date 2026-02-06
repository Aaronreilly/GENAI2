import React from 'react'

export default function DashboardPanels({ data }){
  const sentimentTotal = data.sentiment.positive + data.sentiment.neutral + data.sentiment.negative || 1;
  const positivePercent = ((data.sentiment.positive / sentimentTotal) * 100).toFixed(1);
  const negativePercent = ((data.sentiment.negative / sentimentTotal) * 100).toFixed(1);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase">Total Responses</div>
            <div className="text-4xl font-bold text-blue-600 mt-2">{data.totalResponses || 0}</div>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg shadow-md border border-emerald-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase">Completion Rate</div>
            <div className="text-4xl font-bold text-emerald-600 mt-2">{data.completionRate?.toFixed(1) || 0}%</div>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border border-green-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase">Positive Sentiment</div>
            <div className="text-4xl font-bold text-green-600 mt-2">{positivePercent}%</div>
          </div>
          <div className="text-4xl">😊</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow-md border border-orange-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase">Needs Attention</div>
            <div className="text-4xl font-bold text-orange-600 mt-2">{negativePercent}%</div>
          </div>
          <div className="text-4xl">⚠️</div>
        </div>
        <p className="text-xs text-slate-600 mt-3">Follow up with dissatisfied users</p>
      </div>
    </div>
  )
}
