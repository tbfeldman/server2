const express = require('express');
const bookRouter = require('./project/routes.js/book.route');

const app = express();
const PORT = 5000;

// מאפשר לשרת לקרוא נתוני JSON
app.use(express.json());

// חיבור הראוטר של הספרים תחת הכתובת /books
app.use('/books', bookRouter);

// הרצת השרת
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});