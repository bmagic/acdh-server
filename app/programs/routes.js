"use strict";

//Load dependencies
var router = require("express").Router();
var programController = require("programs/program-controller");
var auth = require("users/middlewares/auth");


//Define routes
router.get("/", programController.getPrograms);
router.put("/", auth.isAdmin, programController.createProgram);
router.put("/:id", auth.isAdmin, programController.updateProgram);
router.delete("/:id", auth.isAdmin, programController.deleteProgram);

module.exports = router;

