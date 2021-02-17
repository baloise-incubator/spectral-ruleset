import { join } from 'path';
import { default as yaml } from 'js-yaml';
import { default as fsWithCallbacks } from 'fs';
import { IRuleResult, isOpenApiv3, Spectral } from '@stoplight/spectral';
const fs = fsWithCallbacks.promises;

export type OpenApiSpec = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export async function loadOpenApiSpec(path: string): Promise<OpenApiSpec> {
  const fileContents = await fs.readFile(join(__dirname, path), 'utf-8');
  return yaml.load(fileContents);
}

export function copyOpenApiSpec(openApi: OpenApiSpec): OpenApiSpec {
  return JSON.parse(JSON.stringify(openApi));
}

export async function lint(openApi: OpenApiSpec): Promise<IRuleResult[]> {
  const proxy_opts = process.env.http_proxy ? { proxyUri: process.env.http_proxy } : {};
  const spectral = new Spectral({ ...proxy_opts });
  spectral.registerFormat('oas3', isOpenApiv3);
  await spectral.loadRuleset(join(__dirname, '../.spectral.yml'));
  return await spectral.run(openApi);
}
