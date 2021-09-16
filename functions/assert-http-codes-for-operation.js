module.exports = (targetValue, { wellUnderstood }, paths) => {
  const result = [];
  if (targetValue === null || typeof targetValue !== 'object') {
    return result;
  }
  for (const verb of Object.keys(targetValue)) {
    const responses = targetValue[verb].responses || {};
    if (responses === null || typeof responses !== 'object') {
      continue;
    }
    for (const code of Object.keys(responses)) {
      if (!(code in wellUnderstood)) {
        result.push({
          message: `${code} is not a well-understood HTTP status code`,
          path: [...paths.target, verb, 'responses', code],
        });
        continue;
      }
      const allowedVerbs = wellUnderstood[code].map((verb) => verb.toUpperCase());
      const upperCaseVerb = verb.toUpperCase();
      if (!allowedVerbs.includes('ALL') && !allowedVerbs.includes(upperCaseVerb)) {
        result.push({
          message: `${code} is not a well-understood HTTP status code for ${upperCaseVerb}`,
          path: [...paths.target, verb, 'responses', code],
        });
      }
    }
  }
  return result;
};
