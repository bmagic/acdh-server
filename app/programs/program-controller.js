"use strict";
var async = require("async");
var constants = require("core/constants");
var programModel = require("programs/program-model.js");


module.exports.getPrograms = function (req, res) {
    programModel.find(10, function (error, programs) {
        if (error) {
            if (error.name = "HttpError") {
                res.status(error.errorCode).send(error.message);
            }
        } else {
            res.status(200).json(programs);
        }
    });
};

module.exports.createProgram = function (req, res) {
    programModel.insert(req.body, function (error) {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.status(200).send(constants.PROGRAM_CREATED);
        }
    });
};

module.exports.updateProgram = function (req, res) {
    programModel.update(req.param.id, req.body, function (error) {
        if (error) {
            res.status(error.errorCode).send(error.message);
        } else {
            res.status(200).send(constants.PROGRAM_UPDATED);
        }
    });
};
