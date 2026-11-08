import { Book } from "../models/book.model.js";

// א) בקשת כל הספרים
export const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).send({
            message: 'הבקשה התקבלה בהצלחה',
            date: req.currentDate,
            data: books
        });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
};

// ב) קבלת ספר לפי קוד
export const getBookByCode = async (req, res, next) => {
    try {
        const bookCode = Number(req.params.code);
        const book = await Book.findOne({ code: bookCode });
        
        if (!book) {
            return res.status(404).send({ message: 'הספר לא נמצא' });
        }
        res.status(200).send({ date: req.currentDate, book });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
};

// ג) הוספת ספר
export const addBook = async (req, res, next) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).send(savedBook);
    } catch (error) {
        next({ status: 400, message: error.message });
    }
};

// ד) קבלת ספרים לפי קטגוריה (פונקציה נוספת שנדרשה בסעיף 29)
export const getBooksByCategory = async (req, res, next) => {
    try {
        const categoryName = req.params.category;
        const books = await Book.find({ category: categoryName });
        
        res.status(200).send({
            message: `ספרים בקטגוריה ${categoryName}`,
            count: books.length,
            data: books
        });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
};