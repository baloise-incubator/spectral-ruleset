# MUST request must use b3 tracing headers
The following header parameter are mandatory for any request:

- `x-b3-traceid`
- `x-b3-spanid`

Specification: You can find the specification for b3 [here](https://github.com/openzipkin/b3-propagation)  
Rationale: We have an internal survey with all developers and the decision was b3 [Internal link](https://confluence.baloisenet.com/atlassian/x/LxWJj).