import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint, OpenApiSpec } from './helpers';

describe('MUST provide API audience [219]', () => {
  let openApi: OpenApiSpec;

  beforeEach(async () => {
    openApi = await loadOpenApiSpec('base-openapi.yml');
  });

  test('Detect missing `info.x-audience`', async () => {
    delete openApi.info['x-audience'];
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-provide-api-audience',
        message: 'Missing or wrong `info.x-audience`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect wrong `info.x-audience`', async () => {
    openApi.info['x-audience'] = 'internal-api';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-provide-api-audience',
        message: 'Missing or wrong `info.x-audience`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
