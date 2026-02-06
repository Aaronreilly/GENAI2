// Simple rule-based sentiment analysis with improvements
const positive = ["good","great","love","excellent","awesome","happy","satisfied","easy","fast","amazing","wonderful","fantastic","brilliant","perfect","outstanding"];
const negative = ["bad","terrible","hate","awful","frustrat","difficult","slow","angry","disappointed","poor","worst","useless","broken","issue","problem","bug"];

// Keywords for auto-tagging
const keywords = {
  speed: ["slow", "fast", "quick", "speed", "lag", "latency"],
  support: ["support", "help", "response", "customer", "service", "contact"],
  ui: ["interface", "ui", "button", "confusing", "hard", "easy", "simple"],
  price: ["price", "cost", "expensive", "cheap", "afford", "value"],
  quality: ["quality", "feature", "product", "works", "broken", "issue"],
  security: ["safe", "secure", "password", "data", "privacy", "hack"]
};

function analyzeText(text){
  const t = (text||"").toLowerCase();
  let score = 0;
  const detectedKeywords = [];
  const detectedTags = [];
  
  // Sentiment scoring
  positive.forEach(w=>{ if(t.includes(w)){ score += 1; detectedKeywords.push(w); }});
  negative.forEach(w=>{ if(t.includes(w)){ score -= 1; detectedKeywords.push(w); }});

  // Determine sentiment
  let sentiment = 'neutral';
  if(score > 0) sentiment = 'positive';
  if(score < 0) sentiment = 'negative';

  // Confidence (higher confidence for extreme scores)
  const confidence = Math.min(0.95, Math.max(0.5, 0.5 + Math.abs(score)*0.15));

  // Auto-tag feedback based on keywords
  Object.entries(keywords).forEach(([tag, words]) => {
    if(words.some(w => t.includes(w))) {
      detectedTags.push(tag);
    }
  });

  return { 
    sentiment, 
    confidence: Number(confidence.toFixed(2)), 
    keywords: detectedKeywords,
    tags: [...new Set(detectedTags)], // Remove duplicates
    intensity: Math.abs(score) // How strong the sentiment is
  };
}

module.exports = { analyzeText };
