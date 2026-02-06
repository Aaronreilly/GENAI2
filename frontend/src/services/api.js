import axios from 'axios'

const API_BASE = 'http://localhost:4000/api'

// Sentiment Analysis API
export const analyzeSentiment = async (text) => {
  try {
    const res = await axios.post(`${API_BASE}/sentiment`, { text })
    return res.data.result
  } catch (err) {
    console.error('Sentiment API error:', err)
    return { sentiment: 'neutral', confidence: 0.5, keywords: [] }
  }
}

// Chat & ScaleDown API
export const sendChatMessage = async (sessionId, message, type = 'open', score = null) => {
  try {
    const res = await axios.post(`${API_BASE}/chat`, {
      sessionId,
      message,
      type,
      score,
    })
    return res.data
  } catch (err) {
    console.error('Chat API error:', err)
    return {
      success: false,
      reply: { text: 'Sorry, unable to reach the server.' },
      next: [],
    }
  }
}

// Real-time Analytics Stream
export const createAnalyticsStream = (onData, onError) => {
  const es = new EventSource(`${API_BASE}/stream`)

  es.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data)
      onData(payload)
    } catch (err) {
      console.error('Stream parse error:', err)
    }
  }

  es.onerror = (err) => {
    console.error('Stream error:', err)
    if (onError) onError(err)
    es.close()
  }

  return es
}
