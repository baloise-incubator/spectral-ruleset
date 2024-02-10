'use strict';

function isB3Valid(targetValue) {
  if (!Array.isArray(targetValue)) {
    return [
      {
        message: `No array given, provide $.paths.*.*.parameters`,
      },
    ];
  }

  const b3Params = targetValue.filter(
    (param) =>
      param.name && (param.name.toLowerCase() === 'x-b3-traceid' || param.name.toLowerCase() === 'x-b3-spanid'),
  );

  return !(b3Params.length !== 2 || !b3Params.every((param) => param.in === 'header'));
}

export default (targetValue) => {
  if (targetValue.parameters && isB3Valid(targetValue.parameters)) {
    return [];
  }

  const hasInvalidEntry = Object.keys(targetValue)
    .filter((verb) =>
      ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'].includes(verb.toLowerCase()),
    )
    .map((verb) => targetValue[verb])
    .some((operation) => operation.parameters && !isB3Valid(operation.parameters));

  if (hasInvalidEntry) {
    return [
      {
        message: `B3 header X-B3-Traceid or X-B3-Spanid missing`,
      },
    ];
  }

  return [];
};
