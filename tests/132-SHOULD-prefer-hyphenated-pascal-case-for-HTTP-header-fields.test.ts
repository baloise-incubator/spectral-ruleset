import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

describe('SHOULD prefer hyphenated-pascal-case for HTTP header fields [132]', () => {
  test('Detect invalid character in header parameter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.parameters[2].name = 'InvalidHeaderParamName';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-use-hyphenated-pascal-case-for-header-parameters',
        message: 'Header parameters should be Hyphenated-Pascal-Case',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
  test('Detect invalid character in referenced header parameter', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.components.parameters.HeaderParamComponent.name = 'InvalidHeaderParamName';
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'should-use-hyphenated-pascal-case-for-header-parameters',
        message: 'Header parameters should be Hyphenated-Pascal-Case',
        severity: DiagnosticSeverity.Warning,
      }),
    ]);
  });
});
