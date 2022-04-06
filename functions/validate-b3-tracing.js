'use strict';

export default (targetValue) => {
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

  if (b3Params.length !== 2 || !b3Params.every((param) => param.in === 'header')) {
    return [
      {
        message: `B3 header X-B3-Traceid or X-B3-Spanid missing`,
      },
    ];
  }

  return [];
};
