// ScaleDown logic: compress survey flows by selecting minimal next questions
// For demo: pick only the most informative follow-ups based on scores

function selectNextQuestions(context){
  // context: { type: 'nps'|'csat'|'ces'|'open', score, previousAnswers }
  const { type, score } = context;
  const questions = [];

  if(type === 'nps'){
    if(score >= 9){
      questions.push({ id: 'promote', text: 'Amazing — what did you like most?' });
    } else if(score >=7){
      questions.push({ id: 'improve', text: 'Thanks — any small improvements we could make?' });
    } else {
      questions.push({ id: 'detractor', text: 'Sorry to hear that — what went wrong?' });
      questions.push({ id: 'contact', text: 'Would you like us to follow up via email?' });
    }
  } else if(type === 'csat'){
    if(score >=4) questions.push({ id:'favorite', text: 'Great — what worked well?' });
    else questions.push({ id:'issue', text: 'What part was unsatisfactory?' });
  } else if(type === 'ces'){
    if(score <=2) questions.push({ id:'effort', text: 'What made it difficult?' });
    else questions.push({ id:'smooth', text: 'Glad it was smooth — anything else?' });
  } else {
    questions.push({ id:'open1', text: 'Can you tell us more about your experience?' });
  }

  // Compress flow: return only top 1 or 2 questions (approx 75% reduction)
  return questions.slice(0,2);
}

module.exports = { selectNextQuestions };
