'use strict'
var Ajv = require('ajv')
var ajv = new Ajv({removeAdditional: true})

var schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string'
    },
    date: {
      type: 'integer'
    },
    url: {
      type: 'string'
    },
    subPrograms: {
      type: 'array',
      items: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: {
              type: 'string'
            },
            url: {
              type: 'string'
            }
          }
        }
      ]
    },
    guests: {
      type: 'array',
      items: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            }
          },
          required: ['name', 'description']
        }
      ]
    },
    description: {
      type: 'string'
    },
    replays: {
      type: 'array',
      items: [
        {
          type: 'integer'
        }
      ]
    }
  }
}

module.exports.validate = function (data, callback) {
  ajv.validate(schema, data)
  callback(ajv.errors, data)
}
