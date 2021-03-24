import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD not use /api as base path [135]', () => {
  test('Detect path starts with /api', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/api/example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-not-use-api-as-base-path',
        message: 'Path should not start with /api',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
});
