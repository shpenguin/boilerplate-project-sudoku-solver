const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve with puzzle', function () {
        test('solve puzzle available', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'
                })
                .end(function (err, res) {
                    assert.equal(res.body.solution, '473891265851726394926345817568913472342687951197254638734162589685479123219538746');
                    done();
                });
        });

        test('solve with no puzzle', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('solve with invalid chars in puzzle', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: '.7.890..A.5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('solve with puzzle of invalid length', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: '.7.89..5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('solve puzzle unavailable', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: '..9345.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    suite('POST /api/check', function () {
        test('successful check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'A1',
                    value: '7'
                })
                .end(function (err, res) {
                    assert.isTrue(res.body.valid);
                    done();
                });
        });

        test('check with single conflict', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'D3',
                    value: '3'
                })
                .end(function (err, res) {
                    const { valid, conflict } = res.body;
                    assert.isFalse(valid);
                    assert.equal(conflict.length, 1);
                    assert.equal(conflict[0], 'row');
                    done();
                });
        });

        test('check with two conflicts', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'G3',
                    value: '9'
                })
                .end(function (err, res) {
                    const { valid, conflict } = res.body;
                    assert.isFalse(valid);
                    assert.equal(conflict.length, 2);
                    assert.equal(conflict[0], 'row');
                    assert.equal(conflict[1], 'column');
                    done();
                });
        });

        test('check with all conflicts', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'B3',
                    value: '2'
                })
                .end(function (err, res) {
                    const { valid, conflict } = res.body;
                    assert.isFalse(valid);
                    assert.equal(conflict.length, 3);
                    assert.equal(conflict[0], 'row');
                    assert.equal(conflict[1], 'column');
                    assert.equal(conflict[2], 'region');
                    done();
                });
        });

        test('missing field needed', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    coordinate: 'B3',
                    value: '2'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, "Required field(s) missing");
                    done();
                });
        });

        test('check with puzzle of invalid char', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..90.5.1.85.4..D.2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'B3',
                    value: '1'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('check with puzzle of invalid length', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9.5.1.85.4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'B3',
                    value: '1'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('check with invalid coordinate', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'K8',
                    value: '1'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        test('check with invalid value', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'D5',
                    value: '0'
                })
                .end(function (err, res) {
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
    });

});

