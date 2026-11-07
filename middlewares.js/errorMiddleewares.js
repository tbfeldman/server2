// middlewares/errors.js

// 404 - נתיב לא נמצא
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
};

// שגיאת שרת כללית (חובה 4 פרמטרים כדי ש־Express תזהה שזה errorHandler)
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};