"use strict";
var Ajv = require('ajv');
var ajv = new Ajv({removeAdditional: true});

var schema = {
    type: "object",
    additionalProperties: false,
    properties: {
        title: {
            type: "string"
        },
        date: {
            type: "integer"
        },
        files: {
            type: "object",
            additionalProperties: false,
            properties: {
                full: {
                    type: "string"
                },
                story: {
                    type: "string"
                }
            },
            required: ["full"]
        },
        guests: {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        title: {
                            type: "string"
                        }

                    },
                    required: ["name", "title"]
                }
            ]
        },
        tags: {
            type: "array",
            items: [
                {
                    type: "string"
                }
            ]
        },
        description: {
            type: "string"
        }
    },
    required: ["title", "date"]
};

module.exports.validate = function (data, callback) {
    ajv.validate(schema, data);
    callback(ajv.errors, data);
};
