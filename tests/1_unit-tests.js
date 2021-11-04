const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
    suite("Function solver.validate(puzzle)", function () {
        test("valid puzzle", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            assert.isTrue(solver.validate(puzzle));
            done();
        });

        test("puzzle with invalid char", (done) => {
            const puzzle = "..9..5.1.85.0..A.2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const { error } = solver.validate(puzzle);
            assert.equal(error, 'Invalid characters in puzzle');
            done();
        });

        test("puzzle with invalid length", (done) => {
            const puzzle = "..9..5.1.85..2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const { error } = solver.validate(puzzle);
            assert.equal(error, 'Expected puzzle to be 81 characters long');
            done();
        });
    });

    suite("Function solver.checkRowPlacement(puzzle, coord, value)", function () {
        test("valid value in row", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const [coord, value] = ['A1', '7'];
            assert.isTrue(solver.checkRowPlacement(puzzle, coord, value));
            done();
        });

        test("invalid value in row", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const [coord, value] = ['A1', '1'];
            assert.isFalse(solver.checkRowPlacement(puzzle, coord, value));
            done();
        });
    });

    suite("Function solver.checkColPlacement(puzzle, coord, value)", function () {
        test("valid value in col", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const [coord, value] = ['A2', '6'];
            assert.isTrue(solver.checkColPlacement(puzzle, coord, value));
            done();
        });

        test("invalid value in col", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const [coord, value] = ['A2', '4'];
            assert.isFalse(solver.checkColPlacement(puzzle, coord, value));
            done();
        });
    });

    suite("Function solver.checkRegionPlacement(puzzle, coord, value)", function () {
        test("valid value in region", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const [coord, value] = ['B3', '1'];
            assert.isTrue(solver.checkRegionPlacement(puzzle, coord, value));
            done();
        });

        test("invalid value in region", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const [coord, value] = ['B3', '3'];
            assert.isFalse(solver.checkRegionPlacement(puzzle, coord, value));
            done();
        });
    });

    suite("Function solver.solve(puzzleArray)", function () {
        test("puzzle can be sloved", (done) => {
            const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const arr = puzzle.split('');
            assert.property(solver.solve(arr), 'solution');
            done();
        });

        test("puzzle can't be sloved", (done) => {
            const puzzle = "..9345.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const arr = puzzle.split('');
            const { error } = solver.solve(arr);
            assert.equal(error, 'Puzzle cannot be solved');
            done();
        });

        test("slove puzzle correctly", (done) => {
            const puzzle = "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
            const arr = puzzle.split('');
            const { solution } = solver.solve(arr);
            assert.equal(solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
            done();
        });
    });

});
