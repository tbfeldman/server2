import { Schema, model } from "mongoose";

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
      match: [/^\S+@\S+\.\S+$/, 'מייל ייחודי, הפכי לאותיות קטנות'] // בדיקת תקינות למייל
    },
    phone: {
      type: String,
      required: [true, 'חובה להזין טלפון'],
      match: [/^05\d{8}$/, 'מספר טלפון תקين (במצעות ביטוי רגולרי שבודק תקינות של טלפון בישראל)'] // לדוגמה מספר ישראלי
    },
    password: {
      type: String,
      required: [true, 'חובה להזין סיסמה'],
      minlength: [4, 'סיסמה - לפחות 4 תווים']
    },
    registrationDate: {
      type: Date,
      default: Date.now // תאריך הרשמה - תאריך נוכחי (מתעדכן אוטומטית)
    },
    borrowings: [
      {
        bookCode: { type: Number },
        bookName: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const User = model('User', userSchema);