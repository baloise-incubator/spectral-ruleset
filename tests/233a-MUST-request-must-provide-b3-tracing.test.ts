import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST request must provide b3 tracing [233a]', () => {
  test('Assert missing X-B3-Traceid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) => !param['$ref'] || param['$ref'] !== '#/components/parameters/HeaderB3TraceId',
    );

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-tracing',
        message: 'Header X-B3-Traceid, X-B3-Spanid or traceparent (w3c) missing',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert missing X-B3-Spanid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) => !param['$ref'] || param['$ref'] !== '#/components/parameters/HeaderB3SpanId',
    );

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-tracing',
        message: 'Header X-B3-Traceid, X-B3-Spanid or traceparent (w3c) missing',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert b3 tracing headers valid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });

  test('Assert b3 tracing headers valid when using path parameters', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) =>
        !param['$ref'] &&
        param['$ref'] !== '#/components/parameters/HeaderB3TraceId' &&
        param['$ref'] !== '#/components/parameters/HeaderB3SpanId',
    );
    openApi.paths['/example'].parameters = [];
    openApi.paths['/example'].parameters.push({
      $ref: '#/components/parameters/HeaderB3TraceId',
    });
    openApi.paths['/example'].parameters.push({
      $ref: '#/components/parameters/HeaderB3SpanId',
    });

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });

  test('Assert w3c tracing headers valid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters = openApi.paths['/example'].get.parameters.filter(
      (param: { $ref: string }) =>
        !param['$ref'] &&
        param['$ref'] !== '#/components/parameters/HeaderB3TraceId' &&
        param['$ref'] !== '#/components/parameters/HeaderB3SpanId',
    );
    openApi.paths['/example'].get.parameters.push({
      $ref: '#/components/parameters/HeaderW3cTraceparent',
    });

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });

  test('Assert w3c and b3 tracing headers valid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters.push({
      $ref: '#/components/parameters/HeaderW3cTraceparent',
    });

    const result = await lint(openApi, 'baloise');
    expect(result).toEqual([]);
  });
});
