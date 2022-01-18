import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint, OpenApiSpec } from './helpers';

describe('MUST contain API meta information [218]', () => {
  let openApi: OpenApiSpec;

  beforeEach(async () => {
    openApi = await loadOpenApiSpec('base-openapi.yml');
  });

  test('Detect missing `info`', async () => {
    delete openApi.info;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'oas3-schema',
        message: 'Object must have required property "info".',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect if `info` is not an object', async () => {
    openApi.info = 1;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'oas3-schema',
        message: '"info" property type must be object.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.title`', async () => {
    delete openApi.info.title;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'oas3-schema',
        message: '"info" property must have required property "title".',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.version`', async () => {
    delete openApi.info.version;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'oas3-schema',
        message: '"info" property must have required property "version".',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.description`', async () => {
    delete openApi.info.description;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-have-info-description',
        message: 'Missing `info.description`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.contact`', async () => {
    delete openApi.info.contact;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-have-info-contact-email',
      }),
      expect.objectContaining({
        code: 'must-have-info-contact-name',
      }),
      expect.objectContaining({
        code: 'must-have-info-contact-url',
      }),
    ]);
  });

  test('Detect missing `info.contact.name`', async () => {
    delete openApi.info.contact.name;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-have-info-contact-name',
        message: 'Missing `info.contact.name`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.contact.url`', async () => {
    delete openApi.info.contact.url;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-have-info-contact-url',
        message: 'Missing `info.contact.url`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.contact.email`', async () => {
    delete openApi.info.contact.email;
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-have-info-contact-email',
        message: 'Missing `info.contact.email`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });

  test('Detect missing `info.x-api-id`', async () => {
    delete openApi.info['x-api-id'];
    const result = await lint(openApi);
    expect(result).toEqual([
      expect.objectContaining({
        code: 'must-have-info-x-api-id',
        message: 'Missing `info.x-api-id`.',
        severity: DiagnosticSeverity.Error,
      }),
    ]);
  });
});
