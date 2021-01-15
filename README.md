[![Gitpod](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/christiansiegel/spectral-playground) 

# spectral-playground

Playground for experiments with API Linter https://github.com/stoplightio/spectral

## try it out

```bash
# default openapi ruleset defined in .spectral.yml
npx @stoplight/spectral lint example/example-openapi.yml

# or reference the ruleset via url
npx @stoplight/spectral lint example/example-openapi.yml --ruleset https://raw.githubusercontent.com/christiansiegel/spectral-playground/main/ruleset/openapi-ruleset.yml
```

## run tests

```bash
npm i
npm run test
```
