import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";

// השאלת ספר למשתמש
export const borrowBook = async (req, res, next) => {
    try {
        const { bookCode, userId, returnDate } = req.body;

        // 1. בדיקה שהספר קיים והאם הוא פנוי להשאלה
        const book = await Book.findOne({ code: bookCode });
        if (!book) {
            return res.status(404).send({ message: 'הספר לא נמצא' });
        }
        if (book.isBorrowed) {
            return res.status(400).send({ message: 'הספר כבר מושאל למשתמש אחר' });
        }

        // 2. בדיקה שהמשתמש קיים והאם יש לו מקום להשאיל (עד 3 ספרים)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'המשתמש לא נמצא' });
        }
        if (user.borrowedBooks.length >= 3) {
            return res.status(400).send({ message: 'המשתמש הגיע למגבלה של 3 ספרים מושאלים' });
        }

        // 3. עדכון מצב הספר והוספה להיסטוריה
        book.isBorrowed = true;
        book.borrowHistory.push({
            borrowDate: new Date().toISOString().split('T')[0],
            userId: user._id
        });
        await book.save();

        // 4. הוספת הספר לרשימת הספרים המושאלים של המשתמש
        user.borrowedBooks.push({
            bookCode: book.code,
            bookName: book.name,
            returnDate: returnDate || 'לא צוין'
        });
        await user.save();

        res.status(200).send({
            message: 'הספר הושאל בהצלחה',
            book,
            userBorrowedBooks: user.borrowedBooks
        });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
};

// החזרת ספר
export const returnBook = async (req, res, next) => {
    try {
        const { bookCode, userId } = req.body;

        // 1. מציאת הספר ובדיקה אם היה מושאל
        const book = await Book.findOne({ code: bookCode });
        if (!book) {
            return res.status(404).send({ message: 'הספר לא נמצא' });
        }
        if (!book.isBorrowed) {
            return res.status(400).send({ message: 'הספר לא היה מושאל' });
        }

        // 2. מציאת המשתמש
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'המשתמש לא נמצא' });
        }

        // 3. עדכון מצב הספר לפנוי
        book.isBorrowed = false;
        await book.save();

        // 4. הסרת הספר מרשימת הספרים המושאלים הפעילים של המשתמש
        user.borrowedBooks = user.borrowedBooks.filter(b => b.bookCode !== bookCode);
        await user.save();

        res.status(200).send({
            message: 'הספר הוחזר בהצלחה',
            book
        });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
};