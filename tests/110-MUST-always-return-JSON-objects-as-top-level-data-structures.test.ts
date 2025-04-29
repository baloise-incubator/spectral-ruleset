import { DiagnosticSeverity } from '@stoplight/types';
import { lint, loadOpenApiSpec, OpenApiSpec } from './helpers';

function addResponseContent(openApiSpec: OpenApiSpec, contentType: string): OpenApiSpec {
  const updatedSpec = { ...openApiSpec };
  updatedSpec.paths['/example'] ??= {};
  updatedSpec.paths['/example'].get ??= {};
  updatedSpec.paths['/example'].get.responses ??= {};
  updatedSpec.paths['/example'].get.responses['200'] ??= {};
  updatedSpec.paths['/example'].get.responses['200'].content ??= {};

  updatedSpec.paths['/example'].get.responses['200'].content[contentType] = {
    schema: {
      type: 'array',
    },
  };

  return updatedSpec;
}

describe('MUST always return JSON objects as top-level data structures [110]', () => {
  test('Validate json content type', async () => {
    let openApiSpec = await loadOpenApiSpec('base-openapi.yml');
    openApiSpec = addResponseContent(openApiSpec, 'application/json');

    const lintResult = await lint(openApiSpec);

    expect(lintResult).toEqual([
      expect.objectContaining({
        code: 'must-always-return-json-objects-as-top-level-data-structures',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Validate specific content type', async () => {
    let openApiSpec = await loadOpenApiSpec('base-openapi.yml');
    openApiSpec = addResponseContent(openApiSpec, 'application/x.zalando.cart+json;version=2');

    const lintResult = await lint(openApiSpec);

    expect(lintResult).toEqual([
      expect.objectContaining({
        code: 'must-always-return-json-objects-as-top-level-data-structures',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Ignore non-JSON content types like PDF', async () => {
    let openApiSpec = await loadOpenApiSpec('base-openapi.yml');
    openApiSpec = addResponseContent(openApiSpec, 'application/pdf');

    const lintResult = await lint(openApiSpec);

    expect(lintResult).toEqual([
      expect.objectContaining({
        code: 'should-prefer-standard-media-type-names',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
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
