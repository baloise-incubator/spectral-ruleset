import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD declare enum values using UPPER_SNAKE_CASE format [240]', () => {
  test('Detect wrong enum format in x-extensible-enum', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.xenum['x-extensible-enum'] = ['FOO-BAR', 'bar', 'BAZ_CORRECT'];
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-declare-enum-values-using-upper-snake-case-format',
        message: 'Enum values should be in UPPER_SNAKE_CASE format',
        severity: DiagnosticSeverity.Warning,
      }),
      expect.objectContaining({
        code: 'should-declare-enum-values-using-upper-snake-case-format',
        message: 'Enum values should be in UPPER_SNAKE_CASE format',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
  test('Detect wrong enum format in enum', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.enum = {
      type: 'string',
      enum: ['FOO-BAR', 'bar', 'BAZ_CORRECT'],
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-declare-enum-values-using-upper-snake-case-format',
        message: 'Enum values should be in UPPER_SNAKE_CASE format',
        severity: DiagnosticSeverity.Warning,
      }),
      expect.objectContaining({
        code: 'should-declare-enum-values-using-upper-snake-case-format',
        message: 'Enum values should be in UPPER_SNAKE_CASE format',
        severity: DiagnosticSeverity.Warning,
      }),
      expect.objectContaining({
        code: 'should-use-x-extensible-enum', // rule 112
      }),
    ]);
  });
});
