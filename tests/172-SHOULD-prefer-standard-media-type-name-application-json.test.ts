import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD prefer standard media type name application/json [172]', () => {
  test('Detect non-standard media type name', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses['200'].content = {
      'application/x.zalando.cart+json': {
        schema: { type: 'object' },
      },
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-prefer-standard-media-type-names',
        message: 'Custom media types should only be used for versioning',
        severity: DiagnosticSeverity.Warning,
        path: ['paths', '/example', 'get', 'responses', '200', 'content', 'application/x.zalando.cart+json'],
      }),
    ]);
  });
  test('Allow application/json, application/problem+json, and versioned media type names', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses = {
      '200': {
        content: {
          'application/json': {
            schema: { type: 'object' },
          },
        },
      },
      '201': {
        content: {
          'application/x.zalando.cart+json;version=2': {
            schema: { type: 'object' },
          },
        },
      },
      '404': {
        content: {
          'application/problem+json': {
            schema: { type: 'object' },
          },
        },
      },
    };
    const result = await lint(openApi);
    expect(result.filter((r) => r.code === 'should-prefer-standard-media-type-names')).toEqual([]);
  });
});
