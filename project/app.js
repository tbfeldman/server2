// app.js
const express = require('express');
const apiRouter = require('./routes/index.route');

// ייבוא ה-Middlewares המותאמים אישית
const { 
  addCurrentDate, 
  logGetRequest, 
  checkWorkingHours 
} = require('./middlewares/customMiddleware');

const app = express();

app.use(express.json());

// --- הפעלת ה-Middlewares לפי הסדר הנכון ---
// 1. הוספת התאריך לכל הבקשות שמגיעות לשרת
app.use(addCurrentDate);

// 2. בדיקת שעות הפעילות (חסימה במידת הצורך)
app.use(checkWorkingHours);

// 3. הדפסת לוג עבור בקשות מסוג GET
app.use(logGetRequest);
// ----------------------------------------

// חיבור הנתב הראשי תחת הקידומת /api
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Library API!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});