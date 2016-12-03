"use strict";
var async = require("async");
var programModel = require("programs/program-model.js");
var programSchema = require("programs/program-schema");
var HttpStatus = require('http-status-codes');
var applicationStorage = require("core/application-storage");


module.exports.getPrograms = function (req, res) {
    var logger = applicationStorage.logger;
    var criteria = {};
    if (req.query.search) {
        //criteria = {$or:[{tags:{$regex: req.query.search, $options: "i"}}]}
        //criteria = {$or:[{$text:{$search: req.query.search}},{tags:{$regex: req.query.search, $options: "i"}}]}
        criteria = {$text: {$search: req.query.search}};

    }

    programModel.find(criteria, 20, function (error, programs) {
        if (error) {
            logger.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
        } else {
            res.status(HttpStatus.OK).json(programs);
        }
    });
};

module.exports.getTags = function (req, res) {
    var logger = applicationStorage.logger;
    var criteria = {};
    if (req.query.search) {
        criteria = {$or: [{tags: {$regex: req.query.search, $options: "i"}}]}
    }
    programModel.findTags(criteria, function (error, programs) {
        if (error) {
            logger.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
        } else {
            res.status(HttpStatus.OK).json(programs);
        }
    });
};

module.exports.createProgram = function (req, res) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            programSchema.validate(req.body, function (error, program) {
                if (error) {
                    logger.error(error);
                    res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST));
                } else {
                    callback(null, program);
                }
            });
        },
        function (program) {
            programModel.insert(program, function (error) {
                if (error) {
                    logger.error(error);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
                } else {
                    res.status(HttpStatus.CREATED).send(HttpStatus.getStatusText(HttpStatus.CREATED));
                }
            });
        }
    ]);
};

module.exports.updateProgram = function (req, res) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            programSchema.validate(req.body, function (error, program) {
                if (error) {
                    logger.error(error);
                    res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST));
                } else {
                    callback(null, program);
                }
            });
        },
        function (program) {
            programModel.update(req.param.id, program, function (error) {
                if (error) {
                    logger.error(error);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
                } else {
                    res.status(HttpStatus.OK).send(HttpStatus.getStatusText(HttpStatus.OK));
                }
            });
        }
    ]);
};
