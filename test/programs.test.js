process.env.NODE_ENV = 'test';
var request = require("supertest");
var server = require("../server");
var httpServer = server.httpServer;
var config = server.config;
var mongo = require('mongodb').MongoClient;
var should = require("should");
var HttpStatus = require('http-status-codes');
var sinon = require('sinon');


describe('Programs tests', function () {

    before(function (done) {
        mongo.connect(config.database, function (error, db) {
            done(error);
        });
    });
    describe('get programs', function () {
        var agent = request.agent(httpServer);
        it('should get a list of programs', function (done) {
            agent.get('/api/v1/programs')
                .end(function (err, res) {
                    should(res.status).equal(HttpStatus.OK);
                    should(res.body).is.Array();
                    done();
                });
        });
    });
    describe('insert a new program', function () {
        var agent = request.agent(httpServer);

        it('should get a forbidden error', function (done) {
            agent.put('/api/v1/programs')
                .send({something: "wrong"})
                .end(function (err, res) {
                    should(res.status).equal(HttpStatus.FORBIDDEN);
                    should(res.text).equal(HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
                    done();
                });
        });

        //TODO Test INSERT Wrong
        //TODO Test INSERT GOOD with extra to be removed
        //TODO Test INSERT GOOD
        //TODO Test PUT WRONG ID
        //TODO Test PUT WRONG

    });
});