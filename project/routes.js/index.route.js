// routes/index.route.js
const express = require('express');
const router = express.Router();

const bookRouter = require('./book.route');
const userRouter = require('./user.route');

// הגדרת נתיבים ראשיים
router.use('/books', bookRouter);
router.use('/users', userRouter);

module.exports = router;