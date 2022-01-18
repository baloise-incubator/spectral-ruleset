import { OpenApiSpec } from './types';
import { IRuleResult, Spectral } from '@stoplight/spectral-core';
import { createHttpAndFileResolver } from '@stoplight/spectral-ref-resolver';
import ProxyAgent from 'proxy-agent';
import * as path from '@stoplight/path';
import * as fs from 'fs';
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/dist/loader/node';
import { fetch } from '@stoplight/spectral-runtime';

export async function lint(openApi: OpenApiSpec, flavor: 'zalando' | 'baloise' = 'zalando'): Promise<IRuleResult[]> {
  const resolver = process.env.http_proxy
    ? {
        resolver: createHttpAndFileResolver({ agent: new ProxyAgent(process.env.http_proxy) }),
      }
    : {};
  const spectral = new Spectral(resolver);
  const ruleSet = await bundleAndLoadRuleset(path.join(__dirname, '../../', `${flavor}.yml`), { fs, fetch });
  spectral.setRuleset(ruleSet);
  return await spectral.run(openApi);
}
