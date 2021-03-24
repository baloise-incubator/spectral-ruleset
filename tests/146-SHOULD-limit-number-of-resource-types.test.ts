import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD limit number of resource types [146]', () => {
  test('Detect if more than 8 resource types are defined', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/lorem'] = { ...openApi.paths['/example'] };
    openApi.paths['/ipsum'] = { ...openApi.paths['/example'] };
    openApi.paths['/dolor'] = { ...openApi.paths['/example'] };
    openApi.paths['/sit'] = { ...openApi.paths['/example'] };
    openApi.paths['/amet'] = { ...openApi.paths['/example'] };
    openApi.paths['/consectetur'] = { ...openApi.paths['/example'] };
    openApi.paths['/adipiscing'] = { ...openApi.paths['/example'] };
    openApi.paths['/elit'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-limit-number-of-resource-types',
        message: 'More than 8 resource types found',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
  test('Assert that sub-resources are not counted', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/lorem/ipsum'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/dolor'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/sit'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/amet'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/consectetur'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/adipiscing'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/elit'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/sed'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/eget'] = { ...openApi.paths['/example'] };
    openApi.paths['/lorem/tincidunt'] = { ...openApi.paths['/example'] };
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });
});
