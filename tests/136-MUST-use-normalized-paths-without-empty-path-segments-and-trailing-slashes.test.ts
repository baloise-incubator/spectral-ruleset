import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use normalized paths without empty path segments and trailing slashes [136]', () => {
  test('Detect empty path segment', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/some//example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-normalized-paths-without-empty-path-segments',
        message: 'Empty path segments are not allowed',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect path with trailing slash', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/foo/'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-normalized-paths-without-trailing-slash',
        message: 'Path with trailing slash is not allowed',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
