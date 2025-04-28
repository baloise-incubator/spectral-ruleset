import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST always return JSON objects as top-level data structures [110]', () => {
  test('Ensure PDF content type is ignored', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');

    // Ensure structure exists
    openApi.paths['/example'] ??= {};
    openApi.paths['/example'].get ??= {};
    openApi.paths['/example'].get.responses ??= {};
    openApi.paths['/example'].get.responses['200'] ??= {};
    openApi.paths['/example'].get.responses['200'].content ??= {};

    // Test unversioned application/pdf
    openApi.paths['/example'].get.responses['200'].content['application/pdf'] = {
      schema: {
        type: 'array',
      },
    };

    const result = await lint(openApi);

    // Expect only a warning for the Zalando rule, but NO errors from must-always-return-json-objects-as-top-level-data-structures
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-prefer-standard-media-type-names',
        severity: DiagnosticSeverity.Warning, // Confirm that this is only a warning
      }),
    ]); // No errors should be raised for non-JSON content
  });

  test('Detect if top-level data structure does not have a type', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example = {};
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-always-return-json-objects-as-top-level-data-structures',
        message: 'Top-level data structure must be an object',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if top-level data structure is an array', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example = {
      type: 'array',
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-always-return-json-objects-as-top-level-data-structures',
        message: 'Top-level data structure must be an object',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if top-level data structure is anyOf object or array', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example = {
      description: 'fooooo',
      anyOf: [
        {
          $ref: '#/components/schemas/Problem', // type: object
        },
      ],
    };
    const result = await lint(openApi);
    expect(result).toEqual([]);
    openApi.components.schemas.Example = {
      anyOf: [
        {
          type: 'array',
        },
        {
          $ref: '#/components/schemas/Problem', // type: object
        },
      ],
    };
    const result2 = await lint(openApi);
    expect(result2).toEqual([
      expect.objectContaining({
        code: 'must-always-return-json-objects-as-top-level-data-structures',
        message: 'Top-level data structure must be an object',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
  test('Detect if top-level data structure is a map', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example = {
      type: 'object',
      additionalProperties: {
        type: 'integer',
      },
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-always-return-json-objects-as-top-level-data-structures',
        message: 'Top-level data structure must be an object',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
