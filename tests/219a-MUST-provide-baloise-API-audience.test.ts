import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint, OpenApiSpec } from './helpers';

describe('MUST provide baloise API audience [219a]', () => {
  let openApi: OpenApiSpec;

  beforeEach(async () => {
    openApi = await loadOpenApiSpec('base-openapi.yml');
  });

  test('Detect missing `info.x-audience`', async () => {
    delete openApi.info['x-audience'];
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-provide-baloise-api-audience',
        message: 'Missing or wrong `info.x-audience`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect wrong `info.x-audience`', async () => {
    openApi.info['x-audience'] = 'internal-api';
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-provide-baloise-api-audience',
        message: 'Missing or wrong `info.x-audience`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Allowed values for `info.x-audience`', async () => {
    const allowedValues = [
      'team-internal',
      'domain-internal',
      'company-internal',
      'external-partner',
      'external-public',
    ];
    for (const audienceValue of allowedValues) {
      openApi.info['x-audience'] = audienceValue;
      const result = await lint(openApi, 'baloise');
      expect(result).toHaveLength(0);
    }
  });
});
