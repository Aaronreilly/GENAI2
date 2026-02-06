#!/usr/bin/env node
// Quick API test suite for Feedback Collection Bot
// Run: node test-api.js

const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 4000,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  console.log('🧪 API Test Suite\n');

  try {
    // Test 1: Positive sentiment
    console.log('Test 1: Sentiment Analysis (Positive)');
    let res = await post('/api/sentiment', { text: 'This is amazing and excellent!' });
    console.log('✓ Result:', res.result);
    console.assert(res.result.sentiment === 'positive', 'Should be positive');
    console.log('');

    // Test 2: Negative sentiment
    console.log('Test 2: Sentiment Analysis (Negative)');
    res = await post('/api/sentiment', { text: 'This is terrible and awful' });
    console.log('✓ Result:', res.result);
    console.assert(res.result.sentiment === 'negative', 'Should be negative');
    console.log('');

    // Test 3: Neutral sentiment
    console.log('Test 3: Sentiment Analysis (Neutral)');
    res = await post('/api/sentiment', { text: 'The weather is nice today' });
    console.log('✓ Result:', res.result);
    console.assert(res.result.sentiment === 'neutral', 'Should be neutral');
    console.log('');

    // Test 4: Chat with NPS score 9
    console.log('Test 4: Chat & ScaleDown (NPS=9, Promoter)');
    res = await post('/api/chat', { sessionId: 's_1', message: 'Great product!', type: 'nps', score: 9 });
    console.log('✓ Bot Reply:', res.reply.text);
    console.log('✓ Follow-ups:', res.next.map(q => q.text));
    console.assert(res.next.length > 0, 'Should have follow-ups');
    console.log('');

    // Test 5: Chat with NPS score 2
    console.log('Test 5: Chat & ScaleDown (NPS=2, Detractor)');
    res = await post('/api/chat', { sessionId: 's_2', message: 'Disappointed', type: 'nps', score: 2 });
    console.log('✓ Bot Reply:', res.reply.text);
    console.log('✓ Follow-ups:', res.next.map(q => q.text));
    console.assert(res.next.length >= 2, 'Should have 2 follow-ups for detractors');
    console.log('');

    console.log('✅ All tests passed!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    console.log('\nMake sure backend is running: node backend/index.js');
  }
}

test();
