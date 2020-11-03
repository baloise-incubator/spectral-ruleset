[![Gitpod](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/christiansiegel/spectral-playground) 

# spectral-playground
Playground for experiments with API Linter https://github.com/stoplightio/spectral

```bash
npx @stoplight/spectral lint test/basic-openapi.yml

npx @stoplight/spectral lint kafka-topic.yml --ignore-unknown-format --ruleset kafka-topic-ruleset.yml
```

## run tests

```bash
npm i
npm run test
```