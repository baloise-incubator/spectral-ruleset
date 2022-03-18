import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST request must provide b3 tracing [233a]', () => {
  test('Assert missing X-B3-Traceid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) => !param['$ref'] || param['$ref'] !== '#/components/parameters/HeaderB3Traceid',
    );

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-b3-tracing',
        message: 'B3 header X-B3-Traceid or X-B3-Spanid missing',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert missing X-B3-Spanid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) => !param['$ref'] || param['$ref'] !== '#/components/parameters/HeaderB3Spanid',
    );

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-b3-tracing',
        message: 'B3 header X-B3-Traceid or X-B3-Spanid missing',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert b3 tracing headers valid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });
});
