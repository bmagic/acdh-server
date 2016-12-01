process.env.NODE_ENV = 'test';
var request = require("supertest");
var server = require("../server");
var httpServer = server.httpServer;
var config = server.config;
var mongo = require('mongodb').MongoClient;
var should = require("should");


describe('Programs tests', function () {

    before(function (done) {
        mongo.connect(config.database, function (error, db) {
            db.dropDatabase(function (error) {
                done(error);
            });
        });
    });
    describe('get programs', function () {
        var agent = request.agent(httpServer);
        it('should get a list of programs', function (done) {
            agent.get('/api/v1/programs')
                .end(function (err, res) {
                    should(res.status).equal(200);
                    should(res.body).is.Array();
                    done();
                });
        });
    });
});