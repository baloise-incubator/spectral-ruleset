import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('CAN use correct URI versioning [115a]', () => {
  test('Assert that invalid path fails', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example/v34/v1'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'can-use-correct-uri-versioning',
        message: 'Path can contain correct URI versioning',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Assert that invalid path fails', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/v1/example/v34'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'can-use-correct-uri-versioning',
        message: 'Path can contain correct URI versioning',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert providing version in path is correct', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/v1/example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });
  test('Assert providing longer version in path is correct', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/v189/example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });

  test('Assert providing version in path is correct', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example/v1'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });
  test('Assert providing longer version in path is correct', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example/v189'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });

  test('Assert given no version in path is ok', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });
});
