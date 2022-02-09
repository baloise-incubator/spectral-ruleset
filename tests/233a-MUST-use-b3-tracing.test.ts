import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use b3 tracing [233a]', () => {
  test('Assert missing x-b3-traceid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) => !param['$ref'] || param['$ref'] !== '#/components/parameters/HeaderB3TraceId',
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

  test('Assert missing x-b3-spanid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) => !param['$ref'] || param['$ref'] !== '#/components/parameters/HeaderB3SpanId',
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
