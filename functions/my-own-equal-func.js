"use strict";

module.exports = (targetVal, opts) => {
  const { value } = opts;
  if (targetVal !== value) {
    return [
      {
        message: `Value must equal {value}.`,
      },
    ];
  }
};