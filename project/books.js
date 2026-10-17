// db.js
const books = [
  {
    code: 1,
    name: "cold blood",
    category: "metach",
    price: 98,
    isBorrowed: false,
    borrowHistory: [] 
  },
  {
    code: 2,
    name: "dani gamadi",
    category: "kids",
    price: 65,
    isBorrowed: false,
    borrowHistory: [
      { borrowDate: "2026-01-10", userId: 1 }
    ]
  }
];

module.exports = { books };