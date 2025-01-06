// const Joi = require("joi");

// // Schema for creating a user
// const userCreateSchema = Joi.object({
//   name: Joi.string().min(3).required(),
//   email: Joi.string().email().required(),
//   role: Joi.number().required(),
//   department_id: Joi.number().required(),
//   section_id: Joi.number().required(),
//   company_id: Joi.number().required(),
//   location_id: Joi.number().required(),
//   phone: Joi.string().min(10).max(13).required(),
//   address: Joi.string().required(),
//   shift_id: Joi.number().required(),
//   password: Joi.string().required(),
// });

// // Schema for updating a user
// const userUpdateSchema = Joi.object({
//   name: Joi.string().min(3),
//   email: Joi.string().email(),
// }); // Ensure at least one field is provided for an update

// // Schema for user login
// const userLoginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// }); // Ensure email and password fields provided for login

// const validateUser = (req, res, next) => {
//   const { error } = userCreateSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       status: 400,
//       message: error.details[0].message,
//     });
//   }
//   next();
// };

// const validateAtUpdate = (req, res, next) => {
//   const { error } = userUpdateSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       status: 400,
//       message: error.details[0].message,
//     });
//   }
//   next();
// };

// const validateLogin = (req, res, next) => {
//   const { error } = userLoginSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       status: 400,
//       message: error.details[0].message,
//     });
//   }
//   next();
// };

// module.exports = { validateUser, validateAtUpdate, validateLogin };
