import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use snake_case (never camelCase) for query parameters [130]', () => {
  test('Detect invalid character in query parameter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters[0].name = 'invalidQueryParamName';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-snake-case-for-query-parameters',
        message: 'Query parameters must be snake_case',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect invalid character in referenced query parameter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.parameters.QueryParamComponent.name = 'invalidQueryParamName';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-snake-case-for-query-parameters',
        message: 'Query parameters must be snake_case',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
