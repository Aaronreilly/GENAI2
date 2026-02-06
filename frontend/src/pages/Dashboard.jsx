import React, { useEffect, useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'
import DashboardPanels from '../components/DashboardPanels'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export default function Dashboard(){
  const [data, setData] = useState({ totalResponses:0, completionRate:0, sentiment:{positive:0,neutral:0,negative:0} });

  useEffect(()=>{
    const es = new EventSource('http://localhost:4000/api/stream');
    es.onmessage = (e)=>{
      try{ const payload = JSON.parse(e.data); setData(payload); }catch(err){}
    }
    return ()=>es.close();
  },[])

  const doughnut = {
    labels:['Positive','Neutral','Negative'],
    datasets:[{ data:[data.sentiment.positive, data.sentiment.neutral, data.sentiment.negative], backgroundColor:['#10B981','#FBBF24','#EF4444'] }]
  }

  const line = {
    labels: Array.from({length:8}, (_,i)=>i+1),
    datasets:[{ label:'Completion Rate (%)', data:Array.from({length:8}, ()=>data.completionRate), borderColor:'#6366F1', backgroundColor:'rgba(99, 102, 241, 0.1)', tension:0.3, fill:true }]
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Analytics Dashboard</h2>
        <p className="text-slate-600">Real-time feedback insights and sentiment analysis</p>
      </div>
      
      <DashboardPanels data={data} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">📋</span>
            <h4 className="font-bold text-lg">Sentiment Distribution</h4>
          </div>
          <Doughnut data={doughnut} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{data.sentiment.positive}</div>
              <div className="text-xs text-slate-600">Positive</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">{data.sentiment.neutral}</div>
              <div className="text-xs text-slate-600">Neutral</div>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{data.sentiment.negative}</div>
              <div className="text-xs text-slate-600">Negative</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">📈</span>
            <h4 className="font-bold text-lg">Completion Rate Trend</h4>
          </div>
          <Line data={line} />
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-600">{data.completionRate}%</div>
            <div className="text-sm text-slate-600">Current completion rate</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg border border-emerald-200">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-sm text-slate-600 mb-1">Total Responses</div>
          <div className="text-3xl font-bold text-emerald-600">{data.totalResponses}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-sm text-slate-600 mb-1">Completion Rate</div>
          <div className="text-3xl font-bold text-blue-600">{data.completionRate}%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="text-4xl mb-2">😊</div>
          <div className="text-sm text-slate-600 mb-1">Positive Sentiment</div>
          <div className="text-3xl font-bold text-purple-600">{Math.round((data.sentiment.positive / (data.totalResponses || 1)) * 100)}%</div>
        </div>
      </div>
    </div>
  )
}
