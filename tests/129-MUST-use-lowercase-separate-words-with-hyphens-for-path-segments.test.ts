import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use lowercase separate words with hyphens for path segments [129]', () => {
  test('Detect if path segment contains uppercase characters', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/very-Wrong-example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-lowercase-with-hypens-for-path-segements',
        message: 'Path segments have to be lowercase separate words with hyphens',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if path segment contains underscore character', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/very_wrong_example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-lowercase-with-hypens-for-path-segements',
        message: 'Path segments have to be lowercase separate words with hyphens',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Assert that path parameters are unaffected', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/very-correct-example/{paths_paramsDontMatter}/foo-bar'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });
});
