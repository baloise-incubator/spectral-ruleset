import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('MUST define a format for number and integer types [171]', () => {
  test('Assert number format wrong', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.foo.properties.bar = { type: 'number', format: 'not-valid' };

    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-define-a-format-for-number-types',
        message: 'Numeric properties must have valid format specified',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert integer format wrong', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.foo.properties.bar = { type: 'integer', format: 'not-valid' };

    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-define-a-format-for-integer-types',
        message: 'Numeric properties must have valid format specified',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert number format missing', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.foo.properties.bar = { type: 'number' };

    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-define-a-format-for-number-types',
        message: 'Numeric properties must have valid format specified',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert integer format missing', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.foo.properties.bar = { type: 'integer' };

    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-define-a-format-for-integer-types',
        message: 'Numeric properties must have valid format specified',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Assert number format valid', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    const result = await lint(openApi);
    expect(result).toEqual([]);
  });
});
