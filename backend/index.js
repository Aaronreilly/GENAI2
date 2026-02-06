const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', api);

app.get('/', (req, res)=>{
  res.send('Feedback Collection Bot API running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Backend listening on ${PORT}`));
