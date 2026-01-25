const Joi = require("joi");

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "owner", "admin").default("user"),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Property validation schemas
const propertySchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string(),
    country: Joi.string().default("Ethiopia"),
  }).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid(
    "apartment",
    "house",
    "villa",
    "land",
    "commercial",
  ),
  bedrooms: Joi.number().min(0),
  bathrooms: Joi.number().min(0),
  area: Joi.number().min(0),
  amenities: Joi.array().items(Joi.string()),
});

module.exports = {
  registerSchema,
  loginSchema,
  propertySchema,
};
