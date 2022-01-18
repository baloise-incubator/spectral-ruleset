import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use semantic versioning [116]', () => {
  test('Detect if `version` does not match SemVer pattern', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.info.version = '47.11';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-semantic-versioning',
        message:
          '"version" property must match pattern "^[0-9]+\\.[0-9]+\\.[0-9]+(-[0-9a-zA-Z-]+(\\.[0-9a-zA-Z-]+)*)?$"',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if `version` does match SemVer pattern', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.info.version = '47.11.1';
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });
  test('Detect if `version` does match SemVer pattern with snapshot', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.info.version = '47.11.1-SNAPSHOT';
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });
  test('Detect if `version` does not match SemVer pattern with snapshot', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.info.version = '47.11-SNAPSHOT';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-semantic-versioning',
        message:
          '"version" property must match pattern "^[0-9]+\\.[0-9]+\\.[0-9]+(-[0-9a-zA-Z-]+(\\.[0-9a-zA-Z-]+)*)?$"',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
