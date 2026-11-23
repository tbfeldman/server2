import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

async function hashPasswordInUpdate() {
  const update = this.getUpdate();
  if (!update || Array.isArray(update)) return;

  const passwordFields = [
    [update, "password"],
    [update.$set, "password"],
    [update.$setOnInsert, "password"]
  ];

  for (const [fields, key] of passwordFields) {
    if (fields && Object.prototype.hasOwnProperty.call(fields, key) && fields[key] !== undefined) {
      fields[key] = await bcrypt.hash(fields[key], 10);
    }
  }

  this.setUpdate(update);
}

userSchema.pre(
  ["updateOne", "updateMany", "findOneAndUpdate", "replaceOne", "findOneAndReplace"],
  hashPasswordInUpdate
);

export const User = model('User', userSchema);