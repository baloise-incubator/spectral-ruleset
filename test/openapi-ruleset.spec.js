const { Spectral, isOpenApiv3 } = require("@stoplight/spectral");
const { DiagnosticSeverity } = require("@stoplight/types");
const { join } = require('path');
const expect = require('chai').expect

const util = require('./util.js');

const lint = async (openApi) => {
  const opts = process.env.http_proxy ? { proxyUri: process.env.http_proxy } : {}
  const spectral = new Spectral(opts)
  spectral.registerFormat("oas3", isOpenApiv3);
  await spectral.loadRuleset(join(__dirname, '../.spectral.yml'));
  return await spectral.run(openApi)
}

describe('OpenAPI linter', () => {
  let basicOpenApi;

  before(async () => {
    basicOpenApi = await util.loadYaml('./basic-openapi.yml')
  });

  it('should accept basic api spec', async () => {
    const result = await lint(basicOpenApi)
    expect(result, `errors: ${JSON.stringify(result)}`).to.be.empty
  });

  describe('license rules', () => {
    let openApi;

    beforeEach(() => {
      openApi = JSON.parse(JSON.stringify(basicOpenApi)); // deep copy
    });
  
    it('should assert info.license exists', async () => {
      delete openApi["info"]["license"]

      const result = await lint(openApi)

      expect(result).to.have.length(1)
      expect(result[0]['code']).to.equal('should-have-license')
      expect(result[0]['message']).to.equal('should have a license')
      expect(result[0]['severity']).to.equal(DiagnosticSeverity.Warning)
    });

    it('should assert info.license.name equals GNU', async () => {
      openApi["info"]["license"]["name"] = "MIT"

      const result = await lint(openApi)

      expect(result).to.have.length(1)
      expect(result[0]['code']).to.equal('should-be-gnu-licensed')
      expect(result[0]['message']).to.equal('should be GNU licensed')
      expect(result[0]['severity']).to.equal(DiagnosticSeverity.Warning)
    });
  });

  

 
});