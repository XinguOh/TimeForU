const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001; // Ensure this is different from your front-end port

app.use(bodyParser.json());

// CORS headers to allow requests from your front-end domain
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// POST endpoint for creating an event
app.post('/create-event', (req, res) => {
  const { startDate, endDate, startTime, endTime } = req.body;

  // Here, you would typically save the event data to a database
  console.log('Creating event with the following details:', startDate, endDate, startTime, endTime);

  // Send a response back to the front-end
  res.json({ message: 'Event created successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
