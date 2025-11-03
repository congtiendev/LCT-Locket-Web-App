const ValidationException = require('@exceptions/validation.exception');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    throw new ValidationException('Validation failed', errors);
  }

  req.body = value;
  next();
};

module.exports = validate;
