import { Router } from 'express';
import { users } from '../user.js'; // ודאי אם שם הקובץ הוא user.js או users.js בהתאם למה שקיים אצלך

const router = Router();
// הצגת כל המשתמשים
router.get('/', (req, res) => {
  res.json(users);
});

// הרשמה (sign-up)
router.post('/sign-up', (req, res) => {
  const { code, username, email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = { code, username, email, password, borrowedBooks: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

// התחברות (sign-in)
router.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Signed in successfully", user });
});

export default router;