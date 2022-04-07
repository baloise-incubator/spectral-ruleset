import { DiagnosticSeverity } from '@stoplight/types';
import { loadOpenApiSpec, lint } from './helpers';

// see also: https://github.com/zalando/zally/blob/963c0fb9bec86b1081456266b83e5484235aa2f9/server/zally-ruleset-zalando/src/main/resources/reference.conf#L67-L72
const STANDARD_CODES = [
  // 100
  '100',
  '101',
  // 200
  '200',
  '201',
  '202',
  '203',
  '204',
  '205',
  '206',
  '207',
  // 300
  '300',
  '301',
  '302',
  '303',
  '304',
  '305',
  '307',
  // 400
  '400',
  '401',
  '402',
  '403',
  '404',
  '405',
  '406',
  '407',
  '408',
  '409',
  '410',
  '411',
  '412',
  '413',
  '414',
  '415',
  '416',
  '417',
  '422',
  '423',
  '426',
  '428',
  '429',
  '431',
  // 500
  '500',
  '501',
  '502',
  '503',
  '504',
  '505',
  '511',
  // OpenAPI
  'default',
];

// see also: https://github.com/zalando/zally/blob/963c0fb9bec86b1081456266b83e5484235aa2f9/server/zally-ruleset-zalando/src/main/resources/reference.conf#L30-L65
const WELL_UNDERSTOOD = {
  // Success Codes
  '200': ['ALL'],
  '201': ['POST', 'PUT'],
  '202': ['POST', 'PUT', 'DELETE', 'PATCH'],
  '204': ['PUT', 'DELETE', 'PATCH'],
  '207': ['POST'],

  // Redirection Codes
  '301': ['ALL'],
  '303': ['PATCH', 'POST', 'PUT', 'DELETE'],
  '304': ['GET', 'HEAD'],

  // Client Side Error Codes
  '400': ['ALL'],
  '401': ['ALL'],
  '403': ['ALL'],
  '404': ['ALL'],
  '405': ['ALL'],
  '406': ['ALL'],
  '408': ['ALL'],
  '409': ['POST', 'PUT', 'DELETE', 'PATCH'],
  '410': ['ALL'],
  '412': ['PUT', 'DELETE', 'PATCH'],
  '415': ['POST', 'PUT', 'DELETE', 'PATCH'],
  '422': ['ALL'],
  '423': ['PUT', 'DELETE', 'PATCH'],
  '428': ['ALL'],
  '429': ['ALL'],

  // Server Side Error Codes
  '500': ['ALL'],
  '501': ['ALL'],
  '503': ['ALL'],

  // OpenAPI
  default: ['ALL'],
};

const WELL_UNDERSTOOD_CODES = Object.keys(WELL_UNDERSTOOD);
const SOME_INVALID_CODES = ['102', '199', '208', '308', '418', '427', '432', '506', '512', '600'];
const STANDARD_BUT_NOT_WELL_UNDERSTOOD_CODES = STANDARD_CODES.filter((code) => !(code in WELL_UNDERSTOOD));

describe('MUST use additional standard HTTP status codes [150a]', () => {
  test('Detect non-standard HTTP status codes', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses = [...STANDARD_CODES, ...SOME_INVALID_CODES].reduce(
      (responses, code) => ({
        ...responses,
        [code]: {
          description: `Response for code ${code}`,
        },
      }),
      {},
    );
    const result = await lint(openApi, 'baloise');
    SOME_INVALID_CODES.forEach((code) => {
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'must-use-additional-standard-http-status-codes',
            message: `${code} is not a standardized response code`,
            severity: DiagnosticSeverity.Error,
          }),
        ]),
      );
    });
    STANDARD_CODES.forEach((code) => {
      expect(result).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'must-use-standard-http-status-codes',
            message: `${code} is not a standardized response code`,
            severity: DiagnosticSeverity.Error,
          }),
        ]),
      );
    });
  });
  test('Detect not well-understood HTTP status codes', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'].get.responses = [
      ...WELL_UNDERSTOOD_CODES,
      ...STANDARD_BUT_NOT_WELL_UNDERSTOOD_CODES,
    ].reduce(
      (responses, code) => ({
        ...responses,
        [code]: {
          description: `Response for code ${code}`,
        },
      }),
      {},
    );
    const result = await lint(openApi, 'baloise');
    STANDARD_BUT_NOT_WELL_UNDERSTOOD_CODES.forEach((code) => {
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'should-use-additional-well-understood-http-status-codes',
            message: `${code} is not a well-understood HTTP status code`,
            severity: DiagnosticSeverity.Warning,
          }),
        ]),
      );
    });
    WELL_UNDERSTOOD_CODES.forEach((code) => {
      expect(result).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'should-use-additional-well-understood-http-status-codes',
            message: `${code} is not a well-understood HTTP status code`,
            severity: DiagnosticSeverity.Warning,
          }),
        ]),
      );
    });
  });

  test('Detect not well-understood HTTP status codes for operations', async () => {
    const openApi = await loadOpenApiSpec('base-openapi.yml');
    openApi.paths['/example'] = {
      get: {
        responses: {
          '200': {},
          '201': {}, // not allowed for GET
          '304': {},
        },
      },
      post: {
        responses: {
          '200': {},
          '204': {}, // not allowed for POST
          '415': {},
        },
      },
    };
    const result = await lint(openApi, 'baloise');
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'should-use-additional-well-understood-http-status-codes',
          message: `201 is not a well-understood HTTP status code for GET`,
          severity: DiagnosticSeverity.Warning,
        }),
        expect.objectContaining({
          code: 'should-use-additional-well-understood-http-status-codes',
          message: `204 is not a well-understood HTTP status code for POST`,
          severity: DiagnosticSeverity.Warning,
        }),
      ]),
    );
    expect(result).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: `200 is not a well-understood HTTP status code for GET`,
        }),
        expect.objectContaining({
          message: `304 is not a well-understood HTTP status code for GET`,
        }),
        expect.objectContaining({
          message: `200 is not a well-understood HTTP status code for POST`,
        }),
        expect.objectContaining({
          message: `415 is not a well-understood HTTP status code for POST`,
        }),
      ]),
    );
  });
});
