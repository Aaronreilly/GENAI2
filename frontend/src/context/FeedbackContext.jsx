import React, { createContext, useState, useCallback } from 'react'

// Global context for sentiment analysis and session tracking
export const FeedbackContext = createContext()

export function FeedbackProvider({ children }) {
  const [sessionId] = useState(`s_${Math.random().toString(36).slice(2, 9)}`)
  const [responses, setResponses] = useState([])
  const [sentimentData, setSentimentData] = useState({})

  const addResponse = useCallback((response) => {
    const withSentiment = { ...response, sessionId, timestamp: Date.now() }
    setResponses((prev) => [...prev, withSentiment])
    setSentimentData((prev) => ({
      ...prev,
      [response.id]: response.sentiment,
    }))
  }, [sessionId])

  const getSummary = useCallback(() => {
    const total = responses.length
    const positive = responses.filter((r) => r.sentiment === 'positive').length
    const negative = responses.filter((r) => r.sentiment === 'negative').length
    const neutral = total - positive - negative

    return {
      sessionId,
      totalResponses: total,
      sentimentBreakdown: { positive, neutral, negative },
      completionRate: Math.min(100, (total / 5) * 100), // Assume 5 questions
    }
  }, [responses, sessionId])

  const value = {
    sessionId,
    responses,
    sentimentData,
    addResponse,
    getSummary,
  }

  return (
    <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
  )
}
