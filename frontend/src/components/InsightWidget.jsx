import React from 'react'

const insights = [
  { text: 'Users who use emoji reactions complete surveys 40% faster.', icon: '⚡' },
  { text: 'Positive sentiment correlates with 8.5x NPS likelihood.', icon: '📈' },
  { text: 'Single-question surveys show 75% higher completion.', icon: '🎯' },
  { text: 'Email follow-ups see 25% higher response rate within 24h', icon: '📧' },
  { text: 'Users mentioning "easy" are 6x more likely to recommend.', icon: '👍' },
]

export default function InsightWidget(){
  const [insight, setInsight] = React.useState(null)
  React.useEffect(()=>{
    const randomInsight = insights[Math.floor(Math.random()*insights.length)]
    setInsight(randomInsight)
  },[])

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 border-l-4 border-indigo-600 rounded-lg hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{insight?.icon || '💡'}</div>
        <div>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span>Insight of the Day</span>
          </h4>
          <p className="text-slate-700 leading-relaxed">{insight?.text || 'Loading insight...'}</p>
        </div>
      </div>
    </div>
  )
}
