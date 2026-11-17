import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'חובה להזין שם משתמש'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'חובה להזין מייל'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'מייל לא תקין']
    },
    phone: {
      type: String,
      required: [true, 'חובה להזין טלפון'],
      match: [/^05\d{8}$/, 'מספר טלפון ישראלי לא תקין']
    },
    password: {
      type: String,
      required: [true, 'חובה להזין סיסמה'],
      minlength: [4, 'סיסמה חייבת להכיל לפחות 4 תווים']
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    // מעקב אחר הספרים שהמשתמש השאיל כרגע (עד 3 ספרים - סעיף 30)
    borrowedBooks: [
      {
        bookCode: { type: Number },
        bookName: { type: String },
        returnDate: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

// מידלוור להצפנת הסיסמה לפני שמירה במסד הנתונים (שלב 33)
userSchema.pre('save', async function (next) {
  // אם הסיסמה לא שונתה, אין צורך להצפין שוב
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export const User = model('User', userSchema);