import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use camelCase (never snake-case) for query parameters [130a]', () => {
  test('Detect invalid character in query parameter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters[0].name = 'invalid_query_parameter';
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-camel-case-for-query-parameters',
        message: 'Query parameter name has to be ASCII camelCase',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect invalid character in referenced query parameter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.parameters.QueryParamComponent.name = 'invalid_query_parameter';
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-camel-case-for-query-parameters',
        message: 'Query parameter name has to be ASCII camelCase',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
