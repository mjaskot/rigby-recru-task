import { celebrate, Joi } from "celebrate";

export const createAddProductValidator = () =>
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().alphanum().min(2).max(30).required(),
        price: Joi.number().min(1).max(999).required(),
        stock: Joi.number().min(0).max(999).required(),
      })
      .required(),
  });

export const createUpdateProductValidator = () =>
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().alphanum().min(2).max(30).optional(),
        price: Joi.number().min(1).max(999).optional(),
        stock: Joi.number().min(0).max(999).optional(),
      })
      .required(),
  });
