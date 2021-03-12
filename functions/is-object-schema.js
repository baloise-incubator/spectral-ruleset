'use strict';

const check = (schema) => {
  const combinedSchemas = [...(schema.anyOf || []), ...(schema.oneOf || []), ...(schema.allOf || [])];
  if (combinedSchemas.length > 0) {
    combinedSchemas.forEach(check);
  } else if (schema.type !== 'object') {
    throw 'Schema type is not `object`';
  } else if (schema.additionalProperties) {
    throw 'Schema is a map';
  }
};

module.exports = (actual) => {
  try {
    check(actual);
  } catch (ex) {
    return [
      {
        message: ex,
      },
    ];
  }
};
