// routes/book.route.js
const express = require('express');
const router = express.Router();
let { books } = require('../db'); // קובץ הספרים שלך
let { users } = require('../users'); // קובץ המשתמשים

// 1. קבלת כל הספרים - כולל Pagination וחיפוש לפי שם
router.get('/', (req, res) => {
  const { limit = 10, page = 1, search = '' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let filteredBooks = books;
  if (search) {
    filteredBooks = books.filter(book =>
      book.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  res.json({
    page: pageNum,
    limit: limitNum,
    totalResults: filteredBooks.length,
    totalPages: Math.ceil(filteredBooks.length / limitNum),
    data: paginatedBooks
  });
});

// 2. קבלת ספר לפי קוד
router.get('/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

// 3. הוספת ספר
router.post('/', (req, res) => {
  const { code, name, category, price } = req.body;

  const existingBook = books.find(b => b.code === code);
  if (existingBook) {
    return res.status(400).json({ message: "Book code already exists" });
  }

  const newBook = {
    code,
    name,
    category,
    price,
    isBorrowed: false,
    borrowHistory: []
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. עדכון ספר (ללא השאלות)
router.put('/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { name, category, price } = req.body;
  if (name !== undefined) book.name = name;
  if (category !== undefined) book.category = category;
  if (price !== undefined) book.price = price;

  res.json(book);
});

// 5. ביצוע השאלה (כולל עדכון המשתמש שהשאיל)
router.patch('/:code/borrow', (req, res) => {
  const code = parseInt(req.params.code);
  const { userId } = req.body;

  const book = books.find(b => b.code === code);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.isBorrowed) {
    return res.status(400).json({ message: "Book is already borrowed" });
  }

  // חיפוש המשתמש כדי לעדכן את רשימת הספרים המושאלים שלו
  const user = users.find(u => u.code === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // עדכון סטטוס הספר והיסטוריית השאלות
  book.isBorrowed = true;
  book.borrowHistory.push({
    borrowDate: new Date().toISOString().split('T')[0],
    userId: userId
  });

  // הוספת קוד הספר למערך הספרים המושאלים של המשתמש
  if (!user.borrowedBooks) {
    user.borrowedBooks = [];
  }
  user.borrowedBooks.push(book.code);

  res.json({ message: "Book borrowed successfully", book });
});

// 6. ביצוע החזרה (כולל הסרת הספר מהמשתמש שהחזירו)
router.patch('/:code/return', (req, res) => {
  const code = parseInt(req.params.code);
  const book = books.find(b => b.code === code);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.isBorrowed) {
    return res.status(400).json({ message: "Book is not currently borrowed" });
  }

  // מציאת המשתמש האחרון שהשאיל את הספר כדי להסיר אותו מרשימתו
  const lastHistory = book.borrowHistory[book.borrowHistory.length - 1];
  if (lastHistory) {
    const user = users.find(u => u.code === lastHistory.userId);
    if (user && user.borrowedBooks) {
      user.borrowedBooks = user.borrowedBooks.filter(bookCode => bookCode !== code);
    }
  }

  // עדכון סטטוס הספר ללא מושאל
  book.isBorrowed = false;
  res.json({ message: "Book returned successfully", book });
});

// 7. מחיקת ספר לפי קוד
router.delete('/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const index = books.findIndex(b => b.code === code);

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deletedBook = books.splice(index, 1);
  res.json({ message: "Book deleted successfully", book: deletedBook[0] });
});

module.exports = router;