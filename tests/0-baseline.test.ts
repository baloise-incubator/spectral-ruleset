import { loadOpenApiSpec, lint } from './util';

test('basic-openapi.yml should satisfy all rules', async () => {
  const basicOpenApi = await loadOpenApiSpec('./basic-openapi.yml');
  const result = await lint(basicOpenApi);
  expect(result).toHaveLength(0);
});
