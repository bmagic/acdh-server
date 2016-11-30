process.env.NODE_ENV = 'test';
var request = require("supertest");
var server = require("../server");
var httpServer = server.httpServer;
var config = server.config;
var mongo = require('mongodb').MongoClient;
var should = require("should");


describe('Users tests', function () {
    before(function (done) {
        mongo.connect(config.database, function (error, db) {
            db.dropDatabase(function (error) {
                done(error);
            });
        });
    });
    describe('register', function () {
        it('should register a new user', function (done) {
            request(httpServer).post('/api/v1/users/register')
                .type("form")
                .send({'username': 'user1', 'password': 'password1'})
                .end(function (err, res) {
                    should(res.status).equal(201);
                    should(res.text).equal("USER_CREATED");
                    done();
                });
        });
        it('should get a user already exist error', function (done) {
            request(httpServer).post('/api/v1/users/register')
                .type("form")
                .send({'username': 'user1', 'password': 'password1'})
                .expect(409, "USER_ALREADY_EXIST", done);
        });
        it('should get a bad request for missing parameters username', function (done) {
            request(httpServer).post('/api/v1/users/register')
                .type("form")
                .send({'password': 'password1'})
                .expect(400, "MISSING_PARAMETER", done);
        });
        it('should get a bad request for missing parameters password', function (done) {
            request(httpServer).post('/api/v1/users/register')
                .type("form")
                .send({'username': 'user1'})
                .expect(400, "MISSING_PARAMETER", done);
        });
    });
    describe('login', function () {
        it('should log the user ', function (done) {
            request(httpServer).post('/api/v1/users/login')
                .type("form")
                .send({'username': 'user1', 'password': 'password1'})
                .expect('set-cookie', 'acdh.sid=^.')
                .expect(200, "USER_CONNECTED", done);
        });
        it('should return unauthorized with wrong password', function (done) {
            request(httpServer).post('/api/v1/users/login')
                .type("form")
                .send({'username': 'user1', 'password': 'fakepassword'})
                .expect(401, "Unauthorized", done);
        });
        it('should return unauthorized with wrong username ', function (done) {
            request(httpServer).post('/api/v1/users/login')
                .type("form")
                .send({'username': 'user2', 'password': 'fakepassword'})
                .expect(401, "Unauthorized", done);
        });
    });
    describe('profile', function () {
        it('should get an access denied message on profile', function (done) {
            request(httpServer).get('/api/v1/users/profile')
                .expect(403, "ACCESS_DENIED", done);
        });
    });
});