import Joi from "joi";

export const newUserSchame = Joi.object({
    username: Joi.string().alphanum().required(),
    email: Joi.string.email(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
   
});