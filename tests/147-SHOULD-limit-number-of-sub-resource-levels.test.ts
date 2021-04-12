import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD limit number of sub-resource levels [147]', () => {
  test('Detect > 3 sub-resource levels', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example/foo/bar/baz/boo'] = openApi.paths['/example'];
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-limit-number-of-sub-resource-levels',
        message: 'Sub-resource levels should by <= 3',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
  test('Ignore resource identifiers when counting sub-resource levels', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example/{id}/foo/{foo-id}/bar/{bar-id}/baz/{baz-id}'] = openApi.paths['/example'];
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });
});
