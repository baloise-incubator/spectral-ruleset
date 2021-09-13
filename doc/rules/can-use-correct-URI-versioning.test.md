# CAN use correct URI versioning: ^((?!.*\/v\d+(\/.*)?\/v\d+)\/.*)$  [115a]

A version can be contained in the path, but must not. The following entries are allowed:
* /v1/example
* /v189/example
* /example/v1
* /example/v189
* /example

The following are not allowed:
* /example/v34/v1
* /v1/example/v34

The following paths offend rule [126](https://opensource.zalando.com/restful-api-guidelines/#126)
* /V1/example
* /example/V1


Rationale: We had an internal survey with all developers and the decision was:
We want to use a correct version number in URI (optionally):
[Internal link](https://confluence.baloisenet.com/atlassian/display/BALMATE/RfA+Versioning+of+Restful+APIs).