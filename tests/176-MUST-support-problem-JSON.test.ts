import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST support problem JSON [176]', () => {
  test('Detect if 4xx response != application/problem+json', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses['404'].content = {
      'application/json': openApi.paths['/example'].get.responses['404'].content['application/problem+json'],
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-problem-json-for-errors',
        message: 'Error response must be application/problem+json',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if 5xx response != application/problem+json', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].patch.responses['500'].content = {
      'application/json': openApi.paths['/example'].patch.responses['500'].content['application/problem+json'],
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-problem-json-for-errors',
        message: 'Error response must be application/problem+json',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if application/problem+json has invalid schema', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].patch.responses['500'].content['application/problem+json'].schema = {
      type: 'object',
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-valid-problem-json-schema',
        message: "Problem json must have property 'type' with type 'string' and format 'uri'",
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
