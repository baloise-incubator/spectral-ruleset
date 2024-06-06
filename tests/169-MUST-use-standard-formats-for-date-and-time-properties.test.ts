import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST use standard formats for date and time properties [169]', () => {
  test('Providing an example should not warn', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });

  test('Not providing an example should warn', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    delete openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties.rule169.example;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-standard-formats-for-date-and-time-properties-example',
        message: 'You should provide an example for rule169.example',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });

  test('Not providing an example in a nested structure should warn', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');

    openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties = {
      ...openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties,
      rule169nested: {
        type: 'object',
        properties: {
          second: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    };

    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-standard-formats-for-date-and-time-properties-example',
        message: 'You should provide an example for second.example',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });

  test.each(['date-time', 'date', 'time', 'duration', 'period'])(
    'Not providing an example for format %s should warn',
    async (format) => {
      const openApi = await loadOpenApiSpec('base-openapi.yml');

      openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties = {
        ...openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties,
        rule169format: {
          type: 'string',
          format,
        },
      };

      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-use-standard-formats-for-date-and-time-properties-example',
          message: 'You should provide an example for rule169format.example',
          severity: DiagnosticSeverity.Warning,
        }),
      ]);
    },
  );

  test('Not using UTC should warn', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].patch.requestBody.content['application/json'].schema.properties.rule169.example =
      '2015-05-28T14:07:17+00:00';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-use-standard-formats-for-date-and-time-properties-utc',
        message: 'You should UTC for example',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });

  test('null properties should not matter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses['200'].content['application/json']['examples'] = {
      default: {
        $ref: '#/components/examples/ExampleResponse',
      },
    };

    openApi.components['examples'] = {
      ExampleResponse: {
        summary: 'example response with empty name',
        value: {
          name: null,
        },
      },
    };

    const result = await lint(openApi);
    expect(result).toHaveLength(0);
  });
});
