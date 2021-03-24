import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST specify success and error responses [151]', () => {
  test('Detect default response is missing', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    delete openApi.paths['/example'].get.responses.default;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-specify-default-response',
        message: 'Operation does not contain a default response',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect default response is not problem json', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses.default.content = {
      'application/json': openApi.paths['/example'].get.responses.default.content['application/problem+json'],
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-problem-json-as-default-response',
        message: 'Operation must use problem json as default response',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
