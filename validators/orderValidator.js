import Joi from "joi";

export const placeOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
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