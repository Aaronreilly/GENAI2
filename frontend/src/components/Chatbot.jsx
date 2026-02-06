import React, { useState, useRef } from 'react'
import axios from 'axios'

const FOLLOWUP_SUGGESTIONS = {
  positive: [
    { id: 'positive1', text: 'What did you like most?' },
    { id: 'positive2', text: 'Would you recommend us?' },
    { id: 'positive3', text: 'Any suggestions for improvement?' }
  ],
  neutral: [
    { id: 'neutral1', text: 'What could we improve?' },
    { id: 'neutral2', text: 'Any specific issues?' },
    { id: 'neutral3', text: 'How can we better serve you?' }
  ],
  negative: [
    { id: 'negative1', text: 'What went wrong?' },
    { id: 'negative2', text: 'How can we fix this?' },
    { id: 'negative3', text: 'Would you give us another chance?' }
  ]
}

export default function Chatbot({ compact }){
  const [messages, setMessages] = useState([
    {from:'bot', text:'Hi! I\'m your Feedback Bot 🤖', type:'text'},
    {from:'bot', text:'How would you rate your experience?', type:'text'}
  ]);
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [followups, setFollowups] = useState([])
  const sessionId = useRef(`s_${Math.random().toString(36).slice(2,9)}`)

  const getSentimentLevel = (score) => score >= 4 ? 'positive' : score === 3 ? 'neutral' : 'negative'

  const send = async (type='open', score, text) => {
    const msgText = text || input;
    if(!msgText && score === undefined) return;
    
    if(msgText) setMessages(prev=>[...prev, {from:'user', text: msgText, type:'text'}]);
    if(score !== undefined) setMessages(prev=>[...prev, {from:'user', text: `Rated: ${score}/5`, type:'rating'}]);
    setInput('');
    setFollowups([]);

    setTyping(true)
    try{
      const res = await axios.post('http://localhost:4000/api/chat', { 
        sessionId: sessionId.current, 
        message: msgText || score, 
        type, 
        score 
      })
      const { reply, next } = res.data || {}
      
      setTimeout(()=>{
        setTyping(false)
        setMessages(prev=>[...prev, {from:'bot', text: reply?.text || 'Thanks for sharing your feedback! This helps us improve.', type:'text'}])
        
        // Smart follow-ups based on score
        if(score !== undefined){
          const sentiment = getSentimentLevel(score)
          const suggestions = FOLLOWUP_SUGGESTIONS[sentiment].slice(0, 2)
          setFollowups(suggestions)
        } else if(next && next.length){
          setFollowups(next.slice(0, 2))
        }
      }, reply?.typing || 800)
    }catch(err){ 
      setTyping(false)
      setMessages(prev=>[...prev,{from:'bot', text:'Thanks for your feedback! We appreciate your input.', type:'text'}]) 
    }
  }

  const handleFollowup = (question) => {
    send('follow', undefined, question.text)
  }

  const quickEmoji = async (emoji, value)=>{
    setMessages(prev=>[...prev, {from:'user', text:emoji, type:'emoji'}]);
    await send('csat', value);
  }

  return (
    <div className={`rounded-lg p-4 ${compact? 'text-sm':'min-h-[420px] shadow-lg'} bg-white border border-slate-100` }>
      <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2 custom-scrollbar">
        {messages.map((m,i)=> (
          <div key={i} className={`animate-fadeIn ${m.from==='bot'? 'text-left':'text-right'}`}>
            <div className={`inline-block px-4 py-2.5 rounded-lg font-medium ${
              m.from==='bot' 
                ? 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 rounded-bl-none' 
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-md'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="text-left animate-fadeIn">
            <div className="inline-block px-4 py-2.5 bg-slate-100 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {followups.length > 0 && (
        <div className="mb-4 space-y-2 animate-slideUp">
          <p className="text-xs text-slate-500 font-semibold uppercase">Quick replies</p>
          <div className="flex flex-wrap gap-2">
            {followups.map((q, i) => (
              <button 
                key={q.id || i}
                onClick={() => handleFollowup(q)}
                className="text-xs px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 transition-all hover:scale-105"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {!compact && (
        <>
          <div className="mb-4 space-y-2">
            <label className="text-xs text-slate-500 font-semibold uppercase">Rate your experience</label>
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5].map(n => (
                <button 
                  key={n}
                  onClick={()=>quickEmoji(['😞','😐','😐','😊','😄'][n-1], n)}
                  className="w-10 h-10 text-lg hover:scale-125 transition-transform hover:bg-slate-100 rounded-full"
                >
                  {['😞','😐','😐','😊','😄'][n-1]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input 
              value={input} 
              onChange={e=>setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && send('open')}
              className="flex-1 border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" 
              placeholder="Share your thoughts..." 
            />
            <button 
              onClick={()=>send('open')} 
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  )
}
