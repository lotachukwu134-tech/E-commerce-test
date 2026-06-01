import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const validate = (Schema) => (req, res, next) => {
  const { error } = Schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({
      success: false,
      errors: error.details.map((d) => d.message),
    });
  next();
};

export default validate;