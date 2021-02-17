import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint, OpenApiSpec, copyOpenApiSpec } from './util';

describe('4. Meta information', () => {
  let basicOpenApi: OpenApiSpec;

  beforeAll(async () => {
    basicOpenApi = await loadOpenApiSpec('./basic-openapi.yml');
  });

  describe('MUST contain API meta information [218]', () => {
    let openApi: OpenApiSpec;

    beforeEach(() => {
      openApi = copyOpenApiSpec(basicOpenApi);
    });

    test('#/info exists', async () => {
      delete openApi.info;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info',
          message: 'Missing `#/info`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/title exists', async () => {
      delete openApi.info.title;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-title',
          message: 'Missing `#/info/title`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/version exists', async () => {
      delete openApi.info.version;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-version',
          message: 'Missing `#/info/version`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/description exists', async () => {
      delete openApi.info.description;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-description',
          message: 'Missing `#/info/description`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/contact exists', async () => {
      delete openApi.info.contact;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-contact',
          message: 'Missing `#/info/contact`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/contact/name exists', async () => {
      delete openApi.info.contact.name;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-contact-name',
          message: 'Missing `#/info/contact/name`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/contact/url exists', async () => {
      delete openApi.info.contact.url;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-contact-url',
          message: 'Missing `#/info/contact/url`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/contact/email exists', async () => {
      delete openApi.info.contact.email;
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-contact-email',
          message: 'Missing `#/info/contact/email`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/x-api-id exists', async () => {
      delete openApi.info['x-api-id'];
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-x-api-id',
          message: 'Missing `#/info/x-api-id`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });

    test('#/info/x-audience exists', async () => {
      delete openApi.info['x-audience'];
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-have-info-x-audience',
          message: 'Missing `#/info/x-audience`',
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });
  });

  describe('MUST use semantic versioning [116]', () => {
    test('#/info/version matches SemVer pattern', async () => {
      const openApi = copyOpenApiSpec(basicOpenApi);
      openApi.info.version = '47.11';
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-use-semantic-versioning',
          message: "Value `#/info/version` must match the pattern '^[0-9]+\\.[0-9]+\\.[0-9]+$'",
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });
  });

  describe('MUST provide API identifiers [215]', () => {
    test('#/info/x-api-id matches UUID pattern', async () => {
      const openApi = copyOpenApiSpec(basicOpenApi);
      openApi.info['x-api-id'] = 'xxx';
      const result = await lint(openApi);
      expect(result).toEqual([
        expect.objectContaining({
          code: 'must-provide-api-identifiers',
          message: "Value `#/info/x-api-id` must match the pattern '^[a-z0-9][a-z0-9-:.]{6,62}[a-z0-9]$'",
          severity: DiagnosticSeverity.Error,
        }),
      ]);
    });
  });
});
