"use strict";
var async = require("async");
var constants = require("core/constants");
var programModel = require("programs/program-model.js");

/**
 * Register route for getting programs
 * @param req
 * @param res
 */
module.exports.getPrograms = function (req, res) {

    programModel.insert({title:"test"},function(error){
        if(error){
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        }else {
            res.status(200).send("PROGRAM_CREATED");
        }
    });


};



/**
 * Register route
 * @param req
 * @param res
 */
module.exports.createProgram = function (req, res) {

    programModel.insert({title:"test"},function(error){
        if(error){
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        }
    });


};
