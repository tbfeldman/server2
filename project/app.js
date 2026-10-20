// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiRouter = require('./routes/index.route');

// ייבוא ה-Middlewares המותאמים אישית משלב 3
const { 
  addCurrentDate, 
  logGetRequest, 
  checkWorkingHours 
} = require('./middlewares/customMiddleware');

const app = express();

// ==========================================
// 3rd-Party Middlewares (סעיף 11)
// ==========================================

// 1. CORS - מאפשר גישה לשרת מכל פרויקט Client חיצוני לבעיית CORS
app.use(cors());

// 2. Helmet - משפר את אבטחת השרת על ידי הגדרת כותרות HTTP הגנתיות שונות
app.use(helmet());

// 3. Rate Limit (express-rate-limit) - מגביל את כמות הבקשות מכתובת IP מסוימת כדי למנוע העמסת יתר או מתקפות
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 100, // מקסימום 100 בקשות לכל IP במסגרת הזמן
  message: "יותר מדי בקשות מכתובת IP זו, נסה שוב später."
});
app.use(limiter);

// 4. Morgan - מדפיס בטרמינל את נתוני כל בקשה שמגיעה לשרת במצב פיתוח (development)
app.use(morgan('dev'));

// ==========================================

app.use(express.json());

// הפעלת ה-Middlewares המותאמים אישית שיצרנו קודם
app.use(addCurrentDate);
app.use(checkWorkingHours);
app.use(logGetRequest);

// חיבור הנתב הראשי תחת הקידומת /api
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Library API!');
});



// חיבור הנתב הראשי תחת הקידומת /api
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Library API!');
});

// ==========================================
// טיפול בשגיאות (סעיף 13) - חייב להיות בסוף!
// ==========================================

// א. טיפול בנתיב שלא נמצא (404) - מופעל אם אף ראוט אחר לא תפס את הבקשה
app.use(notFoundHandler);

// ב. טיפול בשגיאות הכלליות של השרת (500 וכדומה)
app.use(errorHandler);

// ==========================================

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});