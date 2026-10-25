import Joi from "joi";

export const newBookSchame = Joi.object({
    name: Joi.string().alphanum().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().valid('kids', 'metach', 'happy', 'other').required()
});