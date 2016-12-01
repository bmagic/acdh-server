"use strict";
var JaySchema = require("jayschema");
var js = new JaySchema();

var schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"}
    },
    "required": ["title"]
};

module.exports.validate = function(obj,callback){

    js.validate(obj,schema,function(error){
        callback(error);
    });
};
