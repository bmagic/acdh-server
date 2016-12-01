"use strict";

//Load dependencies
var router = require("express").Router();
var programController = require("programs/program-controller");


//Define routes
router.get("/", programController.getPrograms);
router.post("/", programController.createProgram);


module.exports = router;

