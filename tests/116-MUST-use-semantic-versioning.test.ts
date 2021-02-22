import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use semantic versioning [116]', () => {
  test('#/info/version matches SemVer pattern', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.info.version = '47.11';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-semantic-versioning',
        message: '`version` property should match pattern `^[0-9]+\\.[0-9]+\\.[0-9]+$`',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
