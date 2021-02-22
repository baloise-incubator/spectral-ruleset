import { lint, loadOpenApiSpec } from './helpers';

test('base-openapi.yml should satisfy all rules', async () => {
  const basicOpenApi = await loadOpenApiSpec('base-openapi.yml');
  const result = await lint(basicOpenApi);
  expect(result).toHaveLength(0);
});
