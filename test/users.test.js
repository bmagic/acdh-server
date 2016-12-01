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
                .end(function (err, res) {
                    should(res.status).equal(409);
                    should(res.text).equal("USER_ALREADY_EXIST");
                    done();
                });
        });
        it('should get a bad request for missing parameters username', function (done) {
            request(httpServer).post('/api/v1/users/register')
                .type("form")
                .send({'password': 'password1'})
                .end(function (err, res) {
                    should(res.status).equal(400);
                    should(res.text).equal("MISSING_PARAMETER");
                    done();
                });
        });
        it('should get a bad request for missing parameters password', function (done) {
            request(httpServer).post('/api/v1/users/register')
                .type("form")
                .send({'username': 'user1'})
                .end(function (err, res) {
                    should(res.status).equal(400);
                    should(res.text).equal("MISSING_PARAMETER");
                    done();
                });
        });
    });
    describe('login', function () {
        it('should return unauthorized with wrong password', function (done) {
            request(httpServer).post('/api/v1/users/login')
                .type("form")
                .send({'username': 'user1', 'password': 'fakepassword'})
                .end(function (err, res) {
                    should(res.status).equal(401);
                    should(res.text).equal("Unauthorized");
                    done();
                });
        });
        it('should return unauthorized with wrong username ', function (done) {
            request(httpServer).post('/api/v1/users/login')
                .type("form")
                .send({'username': 'user2', 'password': 'fakepassword'})
                .end(function (err, res) {
                    should(res.status).equal(401);
                    should(res.text).equal("Unauthorized");
                    done();
                });
        });
    });
    describe('profile', function () {
        it('should get an access denied error on profile', function (done) {
            request(httpServer).get('/api/v1/users/profile')
                .end(function (err, res) {
                    should(res.status).equal(403);
                    should(res.text).equal("ACCESS_DENIED");
                    done();
                });
        });
    });
    describe('logout', function () {
        it('should get an access denied message on profile', function (done) {
            request(httpServer).get('/api/v1/users/logout')
                .end(function (err, res) {
                    should(res.status).equal(204);
                    done();
                });
        });
    });
    describe('full user experience', function () {
        var agent = request.agent(httpServer);
        it('should register user2', function (done) {
            agent.post('/api/v1/users/register')
                .type("form")
                .send({'username': 'user2', 'password': 'password2'})
                .end(function (err, res) {
                    should(res.status).equal(201);
                    should(res.text).equal("USER_CREATED");
                    done();
                });
        });
        it('should log the user2 ', function (done) {
            agent.post('/api/v1/users/login')
                .type("form")
                .send({'username': 'user2', 'password': 'password2'})
                .end(function (err, res) {
                    should(res.headers["set-cookie"]).is.not.undefined();
                    should(res.status).equal(200);
                    should(res.text).equal("USER_CONNECTED");
                    done();
                });
        });
        it('should get the user2 profile ', function (done) {
            agent.get('/api/v1/users/profile')
                .type("form")
                .end(function (err, res) {
                    should(res.status).equal(200);
                    should(res.text).is.not.undefined();
                    done();
                });
        });
        it('should logout the user2 ', function (done) {
            agent.get('/api/v1/users/logout')
                .type("form")
                .end(function (err, res) {
                    should(res.status).equal(204);
                    done();
                });
        });
        it('should get an access denied error on profile', function (done) {
            agent.get('/api/v1/users/profile')
                .end(function (err, res) {
                    should(res.status).equal(403);
                    should(res.text).equal("ACCESS_DENIED");
                    done();
                });
        });
    });
});