import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST not use URI versioning [115]', () => {
  test('Detect if path contains version number (e.g. v1)', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/v1/example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-not-use-uri-versioning',
        message: 'Path must not contain versioning',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
