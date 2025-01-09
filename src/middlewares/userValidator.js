const Joi = require("joi");

// Schema for creating a user
const userCreateSchema = Joi.object({
  Name: Joi.string().min(3).required(),
  Email: Joi.string().email().required(),
  Phone_no: Joi.string().required(), // 10-15 digits
  Password: Joi.string().required(),
  status: Joi.number().default(0).valid(0, 1),
  Permission: Joi.number().integer().required(),
  role: Joi.array().items(Joi.number()).default([1]), // Default role as [1]
  // role: Joi.number().required(),
  //created_on: Joi.date().default(() => new Date()),
});

// Schema for updating a user
const userUpdateSchema = Joi.object({
  Name: Joi.string().min(3),
  Email: Joi.string().email(),
}); // Ensure at least one field is provided for an update
//NAME,PHONE,STATUS,PERMISSION,ROLE

// Schema for user login
const userLoginSchema = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().required(),
}); // Ensure email and password fields provided for login

const validateUser = (req, res, next) => {
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

const validateAtUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateUser,
  validateAtUpdate,
  validateLogin,
};
