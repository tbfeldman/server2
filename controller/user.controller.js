import { users } from "../du.js";


export const getAllUser=(req,res)=>{
    res.send(users);
};

export const sighUp=(req,res)=>{
   const { id, nameUser,  mail,   code,BorrowedBook}=req.body;
   const existingUser = users.find(u => u.nameUser === nameUser);
  if (existingUser) {
    return res.status(400).send({ message: 'שם המשתמש כבר קיים במערכת' });
  }
  const newUser={id, nameUser,  mail,   code,BorrowedBook};
  users.push(newUser);

  res.status(201).send({newUser} );
};

export const sighIn=(req,res)=>{
    const {nameUser, code}=req.body;
    const user = users.find(u => u.nameUser === nameUser && u.code===code);
    if (!user) {
        return res.status(401).send({ message: 'שם משתמש או סיסמה שגויים' });
      }
   res.status(201).send({user} );
 };