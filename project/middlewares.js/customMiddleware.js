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

module.exports = {
  addCurrentDate,
  logGetRequest,
  checkWorkingHours
};