import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    code: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'חובה להזין את שם הספר'],
      minlength: [2, 'שם ספר חייב להכיל לפחות 2 תווים'],
      maxlength: [20, 'שם ספר יכול להכיל עד 20 תווים'],
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'חובה לבחור קטגוריה'],
      enum: ['metach', 'kids', 'sci-fi', 'romance', 'other'] // מתוך רשימת ערכים לבחירתך
    },
    price: {
      type: Number,
      required: [true, 'חובה להזין מחיר'],
      min: [0, 'מחיר אינו יכול להיות שלילי']
    },
    isBorrowed: {
      type: Boolean,
      default: false
    },
    borrowHistory: [
      {
        borrowDate: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Book = model('Book', bookSchema);