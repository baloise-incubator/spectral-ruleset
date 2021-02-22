import { join } from 'path';
import { default as yaml } from 'js-yaml';
import { default as fsWithCallbacks } from 'fs';
import { OpenApiSpec } from './types';

const fs = fsWithCallbacks.promises;

export async function loadOpenApiSpec(path: string): Promise<OpenApiSpec> {
  const fileContents = await fs.readFile(join(__dirname, '../fixtures', path), 'utf-8');
  return yaml.load(fileContents);
}
