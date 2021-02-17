import { DiagnosticSeverity } from "@stoplight/types"
import { loadOpenApiSpec, lint, OpenApiSpec, copyOpenApiSpec } from './util'

describe('OpenAPI linter', () => {
  let basicOpenApi: OpenApiSpec;

  beforeAll(async () => {
    basicOpenApi = await loadOpenApiSpec('./basic-openapi.yml')
  });

  it('should accept basic api spec', async () => {
    const result = await lint(basicOpenApi)
    expect(result).toHaveLength(0)
  });

  describe('license rules', () => {
    let openApi: OpenApiSpec;

    beforeEach(() => {
      openApi = copyOpenApiSpec(basicOpenApi);
    });
  
    it('should assert info.license exists', async () => {
      delete openApi.info.license

      const result = await lint(openApi)

      expect(result).toEqual([expect.objectContaining({
        code: 'should-have-license',
        message: 'should have a license',
        severity: DiagnosticSeverity.Warning
      })])
    });
    
    it('should assert info.license.name equals GNU', async () => {
      openApi.info.license.name = "MIT"

      const result = await lint(openApi)

      expect(result).toEqual([expect.objectContaining({
        code: 'should-be-gnu-licensed',
        message: 'should be GNU licensed',
        severity: DiagnosticSeverity.Warning
      })])
    });
  });
});