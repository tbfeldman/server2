import { books } from "../db.js";

export const get=(req,res)=>{
    res.send({message: 'הבקשה התקבלה בהצלחה',
      date:  req.currentDate,data:books});
};
export const getById=(req,res)=>{
    const bookId=Number(req.params.id);
    const book=books.find(x=>x.id===bookId);
    if(!book){
        return res.status(404).send({message:'the book isnot find'});
    }
    res.send({date:  req.currentDate,book});

};

export const addBook=(req,res)=>{
    const { value, error } = newBookSchame.validate(req.body);

    if (error)
        return next({ status: 409, msg: error });
    else {
        req.body = value;
        req.body.id = Date.now();
        books.push(newB);
        res.status(201).send(newB);
    }
   
};

export const updateById=(req,res)=>{
    const bookId=Number(req.params.id);
    const bookIndex=books.findIndex(b=>b.id===bookId);
    if (bookIndex === -1) {
        return res.status(404).send({ message: 'הספר לא נמצא' });
      }
    const update=req.body;
    books[bookIndex] = {
        ...books[bookIndex],
        ...update,
        id: bookId // וידוא שהקוד המקורי אינו משתנה בטעות
      }; 
      res.send(books[bookIndex]); 
};

export const addBorrow=(req,res)=>{
const bookId=Number(req.params.id);
const bookIndex=books.findIndex(b=>b.id===bookId);
const {customerCode}=req.body;
if (bookIndex === -1) {
    return res.status(404).send({ message: 'הספר לא נמצא' });
  }
  if (books[bookIndex].isBorrowed) {
    return res.status(400).send({ message: 'הספר כבר מושאל' });
  }
  books[bookIndex].isBorrowed=true;
  books[bookIndex].Borroweds.push({
    date:new Date().toISOString().split('T')[0],
    customerCode
  });
  res.send(books[bookIndex]);
};

export const addReturen=(req,res)=>{
    const bookId=Number(req.params.id);
    const bookIndex=books.findIndex(b=>b.id===bookId);
    if (bookIndex === -1) {
        return res.status(404).send({ message: 'הספר לא נמצא' });
      }
      if (!books[bookIndex].isBorrowed) {
        return res.status(400).send({ message: 'הספר לא היה מושאל' });
      }  
      books[bookIndex].isBorrowed=false;
      res.send(books[bookIndex]);
};

export const dellete=(req,res)=>{
    const bookId = Number(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).send({ message: 'הספר לא נמצא' });
  }
  const deleteB=books.splice(bookIndex,1);
  res.send(deleteB[0]);
};