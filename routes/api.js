'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {      
      let { puzzle, coordinate, value } = req.body;
      let coord = coordinate.toUpperCase();
      const clash = [];

      if (!puzzle || !coord || !value) {
        return res.json({
          error: 'Required field(s) missing'
        });
      }

      let checked = solver.validate(puzzle);

      if (checked !== true) {
        return res.json(checked);
      }

      if (!/^[A-I][1-9]$/.test(coord)) {
        return res.json({
          error: 'Invalid coordinate'
        });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({
          error: 'Invalid value'
        });
      }

      const known_checked = solver.checkKnownPlacement(puzzle, coord, value);
      const row_checked = solver.checkRowPlacement(puzzle, coord, value);
      const col_checked = solver.checkColPlacement(puzzle, coord, value);
      const region_checked = solver.checkRegionPlacement(puzzle, coord, value);

      if (!row_checked) {
        clash.push('row');
      }

      if (!col_checked) {
        clash.push('column');
      }

      if (!region_checked) {
        clash.push('region');
      }

      if (known_checked || clash.length === 0) {
        return res.json({
          valid: true
        });
      }

      return res.json({
        valid: false,
        conflict: clash
      });

    });

  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;

      if (!puzzle) {
        return res.json({
          error: 'Required field missing'
        });
      }

      let checked = solver.validate(puzzle);

      if (checked !== true) {
        return res.json(checked);
      }

      //let str_array = puzzle.split('');
      return res.json(solver.solve(puzzle.split('')));
    });
};
