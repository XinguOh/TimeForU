// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // JSON 파싱을 위한 미들웨어

// 임시 저장소
let events = {};

app.post('/api/events', (req, res) => {
  const { startDate, endDate, startTime, endTime } = req.body;
  // UUID 또는 다른 방법으로 유니크한 ID 생성
  const eventId = Date.now().toString(); // 예시로 Date.now() 사용
  events[eventId] = req.body;
  
  // 생성된 랜덤 링크 반환
  res.json({ link: `http://localhost:5000/events/${eventId}` });
});

app.get('/events/:id', (req, res) => {
  const { id } = req.params;
  if (events[id]) {
    res.json(events[id]);
  } else {
    res.status(404).send('Event not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
