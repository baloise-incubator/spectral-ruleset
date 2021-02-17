"use strict";

module.exports = (actual, {expected}) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    return [
      {
        message: `${JSON.stringify(actual)} must equal ${JSON.stringify(expected)}.`,
      },
    ];
  }
};