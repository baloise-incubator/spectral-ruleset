import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD used open-ended list of values (x-extensible-enum) for enumerations [112]', () => {
  test('Detect regular enum', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.schemas.Example.properties.xenum = {
      type: 'string',
      enum: ['FOO', 'BAR'],
    };
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-use-x-extensible-enum',
        message: 'Should use `x-extensible-enum` instead of `enum`',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
});
