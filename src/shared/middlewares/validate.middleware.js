const ValidationException = require('@exceptions/validation.exception');

/**
 * Validate request data (body, query, or params)
 * @param {Object} schema - Joi schema
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const data = req[source];

  const { error, value } = schema.validate(data, {
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

  req[source] = value;
  next();
};

module.exports = validate;
