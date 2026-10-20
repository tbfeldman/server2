// 1. Middleware שמוסיף את התאריך הנוכחי לאובייקט ה-req
const addCurrentDate = (req, res, next) => {
  req.currentDate = new Date().toISOString(); // או פורמט תאריך אחר לבחירתך
  next(); // מעבר למידלוור הבא או לראוטר
};

// 2. Middleware שמדפיס את התאריך והמתודה עבור בקשות GET בלבד
const logGetRequest = (req, res, next) => {
  if (req.method === 'GET') {
    console.log(`[GET Request] Date: ${req.currentDate}, Path: ${req.originalUrl}`);
  }
  next();
};

// 3. Middleware שחוסם גישה בימים שישי (אחרי 12:00) ושבת (עד 22:00 בלילה)
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = ראשון, ..., 5 = שישי, 6 = שבת
  const hour = now.getHours();

  // יום שישי (5) אחרי שעה 12:00, או יום שבת (6) עד שעה 22:00
  const isFridayBlocked = (dayOfWeek === 5 && hour >= 12);
  const isSaturdayBlocked = (dayOfWeek === 6 && hour < 22);

  if (isFridayBlocked || isSaturdayBlocked) {
    return res.status(403).json({
      message: "האתר אינו פעיל בזמנים אלו (כניסת/יציאת שבת/סוף שבוע).",
      currentDate: req.currentDate
    });
  }

  next();
};



// 4. Middleware לטיפול בשגיאת נתיב לא נמצא (404 Not Found)
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: {
      message: `הנתיב המבוקש ${req.originalUrl} לא נמצא`,
      type: 'Not Found'
    }
  });
};

// 5. Middleware לטיפול בשגיאות שרת כלליות (Error Handling Middleware)
// שימי לב: חייב שיהיו 4 פרמטרים (err, req, res, next) כדי ש-Express יזהה אותו כ-Error Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    error: {
      message: err.message || 'שגיאת שרת פנימית',
      type: 'server error',
      // מציג את ה-stack רק אם אנחנו במצב פיתוח (development)
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = {
 
  addCurrentDate,
  logGetRequest,
  checkWorkingHours,
  notFoundHandler,
  errorHandler
};