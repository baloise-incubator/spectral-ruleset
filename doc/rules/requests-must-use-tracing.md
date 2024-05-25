# MUST request must provide tracing headers
The following header parameter must be provided for any request:

- `X-B3-Traceid`
- `X-B3-Spanid`
or
- `traceparent`

Specification: You can find the specification for b3 [here](https://github.com/openzipkin/b3-propagation) and w3c [here](https://www.w3.org/TR/trace-context/) 
Rationale: We have an internal survey with all developers and the decision was b3 [Internal link](https://confluence.baloisenet.com/atlassian/x/LxWJj).