import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST provide API identifiers [215]', () => {
  test('Detect if `x-api-id` does not match UUID pattern', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.info['x-api-id'] = 'xxx';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-provide-api-identifiers',
        message: '"x-api-id" property must match pattern "^[a-z0-9][a-z0-9-:.]{6,62}[a-z0-9]$"',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
