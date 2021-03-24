'use strict';

/*
Minimal required problem json schema:

type: object
properties:
  type:
    type: string
    format: uri
  title:
    type: string
  status:
    type: integer
    format: int32
  detail:
    type: string
  instance:
    type: string
    format: uri
*/

module.exports = (targetValue) => {
  if (targetValue.type !== 'object') {
    return [
      {
        message: "Problem json must have type 'object'",
      },
    ];
  }
  const type = (targetValue.properties || {}).type || {};
  if (type.type !== 'string' || type.format !== 'uri') {
    return [
      {
        message: "Problem json must have property 'type' with type 'string' and format 'uri'",
      },
    ];
  }
  const title = (targetValue.properties || {}).title || {};
  if (title.type !== 'string') {
    return [
      {
        message: "Problem json must have property 'title' with type 'string'",
      },
    ];
  }
  const status = (targetValue.properties || {}).status || {};
  if (status.type !== 'integer' || status.format !== 'int32') {
    return [
      {
        message: "Problem json must have property 'status' with type 'integer' and format 'in32'",
      },
    ];
  }
  const detail = (targetValue.properties || {}).detail || {};
  if (detail.type !== 'string') {
    return [
      {
        message: "Problem json must have property 'detail' with type 'string'",
      },
    ];
  }
  const instance = (targetValue.properties || {}).instance || {};
  if (instance.type !== 'string' || instance.format !== 'uri') {
    return [
      {
        message: "Problem json must have property 'instance' with type 'string' and format 'uri'",
      },
    ];
  }
  return [];
};
