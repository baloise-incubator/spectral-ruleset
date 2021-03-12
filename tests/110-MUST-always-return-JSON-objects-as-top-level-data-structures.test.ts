import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST always return JSON objects as top-level data structures [110]', () => {
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
