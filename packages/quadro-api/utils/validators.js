const Joi = require('joi');
const _ = require('lodash');
const { ValidationError } = require('./appError');

const validationResult = (schema, data) => {
  // Joi validation options
  const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
  };

  const result = schema.validate(data, validationOptions);

  if (result.error) {
    const details = _.map(result.error.details, ({ message, type, path }) => ({
      message: message.replace(/['"]/g, ''),
      field: path.toString(),
      type,
    }));

    throw new ValidationError(
      'Validation failed. Please enter all required values correctly',
      400,
      details,
    );
  } else return data;
};

const validateRegisterData = data => {
  const schema = Joi.object().keys({
    firstName: Joi.string().min(2).max(50).required()
.messages({
      'any.required': 'Firstname field is required',
      'string.empty': 'Please enter your firstname',
      'string.min': 'Your firstname should have a minimum length of {#limit}',
      'string.max': 'Your firstname should have a maximum length of {#limit}',
    }),
    lastName: Joi.string().min(2).max(50).required()
.messages({
      'any.required': 'Lastname field is required',
      'string.empty': 'Please enter your lastname',
      'string.min': 'Your lastname should have a minimum length of {#limit}',
      'string.max': 'Your lastname should have a maximum length of {#limit}',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email field is required',
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Please enter an email address',
    }),
    role: Joi.string().valid('user').default('user').messages({
      'any.only': 'Account role must be "user"',
    }),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{6,}$/)
      .required()
      .messages({
        'any.required': 'Password field is required',
        'string.empty': 'Please enter a password',
        'string.min': 'Your password should have a minimum length of {#limit}',
        'string.pattern.base':
          'Your password MUST include a number, a lowercase letter and an uppercase letter',
      }),
  });

  return validationResult(schema, data);
};

const validateLoginData = data => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required().messages({
      'any.required': 'Email field is required',
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Please enter an email address',
    }),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{6,}$/)
      .required()
      .messages({
        'any.required': 'Password field is required',
        'string.empty': 'Please enter a password',
        'string.min': 'Your password should have a minimum length of {#limit}',
        'string.pattern.base':
          'Your password MUST include a number, a lowercase letter and an uppercase letter',
      }),
  });

  return validationResult(schema, data);
};

module.exports = {
  validateRegisterData,
  validateLoginData,
};
