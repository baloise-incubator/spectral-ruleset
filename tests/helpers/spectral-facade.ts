import { join } from 'path';
import { OpenApiSpec } from './types';
import { IRuleResult, isOpenApiv3, Spectral } from '@stoplight/spectral';

export async function lint(openApi: OpenApiSpec, flavor: 'zalando' | 'baloise' = 'zalando'): Promise<IRuleResult[]> {
  const proxy_opts = process.env.http_proxy ? { proxyUri: process.env.http_proxy } : {};
  const spectral = new Spectral({ ...proxy_opts });
  spectral.registerFormat('oas3', isOpenApiv3);
  await spectral.loadRuleset(join(__dirname, `../../${flavor}.yml`));
  return await spectral.run(openApi);
}
