"use strict";
var Ajv = require('ajv');
var ajv = new Ajv({removeAdditional: true});
var applicationStorage = require("core/application-storage");
var HttpError = require("core/utilities/HttpError");

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
    var logger = applicationStorage.logger;

    ajv.validate(schema, data);

    if (ajv.errors) {
        logger.error(ajv.errors)
        callback(new HttpError(ajv.errorsText(), 400), data)
    } else {
        callback(null, data);
    }


};
