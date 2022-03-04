import Ajv from 'ajv';

export function validateBody(schema) {
  // console.log('schema:', schema)
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validate(req.body);
    // console.log('valid:', valid)
    if (valid) {
      return next();
    } else {
      const error = validate.errors[0];
      return res.status(400).json({
        error: {
          message: `"${error.instancePath.substring(1)}" ${error.message}`,
        },
      });
    }
  };
}
