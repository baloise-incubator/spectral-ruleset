import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST property names must be ASCII camelCase [118a]', () => {
  test('Detect property names in response schema', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].patch.responses['200'].content['application/json'].schema.properties = {
      foo: { properties: { Bar: {} } },
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-camel-case-for-property-names',
        message: 'Property name has to be ASCII camelCase',
        severity: DiagnosticSeverity.Error,
        path: [
          'paths',
          '/example',
          'patch',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'foo',
          'properties',
          'Bar',
        ],
      }),
    ]);
  });
  test('Detect property names in requestBody schema', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties = {
      foo: { properties: { Bar: {} } },
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-camel-case-for-property-names',
        message: 'Property name has to be ASCII camelCase',
        severity: DiagnosticSeverity.Error,
        path: [
          'paths',
          '/example',
          'patch',
          'requestBody',
          'content',
          'application/json',
          'schema',
          'properties',
          'foo',
          'properties',
          'Bar',
        ],
      }),
    ]);
  });
  test('Detect property names in response ref schema', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties = {
      foo: { type: 'array', items: { properties: { Bar: {} } } },
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-camel-case-for-property-names',
        message: 'Property name has to be ASCII camelCase',
        severity: DiagnosticSeverity.Error,
        path: [
          'paths',
          '/example',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'foo',
          'items',
          'properties',
          'Bar',
        ],
      }),
    ]);
  });
});
