# MUST query parameter names must be ASCII camelCase: ^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$ [130a]

Query parameter names are restricted to ASCII strings. The first character must be a lowercase letter and subsequent characters can be a letter or a number.

Rationale: We have an internal survey with all developers and the decision was camelCase [Internal link](https://confluence.baloisenet.com/atlassian/x/DAyakg).