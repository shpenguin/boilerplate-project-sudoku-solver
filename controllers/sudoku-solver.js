class SudokuSolver {

  constructor() {
      this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      this.regions = [
          [0, 1, 2, 9, 10, 11, 18, 19, 20],
          [3, 4, 5, 12, 13, 14, 21, 22, 23],
          [6, 7, 8, 15, 16, 17, 24, 25, 26],
          [27, 28, 29, 36, 37, 38, 45, 46, 47],
          [30, 31, 32, 39, 40, 41, 48, 49, 50],
          [33, 34, 35, 42, 43, 44, 51, 52, 53],
          [54, 55, 56, 63, 64, 65, 72, 73, 74],
          [57, 58, 59, 66, 67, 68, 75, 76, 77],
          [60, 61, 62, 69, 70, 71, 78, 79, 80]
      ];
  }

  validate(puzzleString) {

      if (/[^1-9||.]/.test(puzzleString)) {
          return { error: 'Invalid characters in puzzle' };
      }

      if (puzzleString.length !== 81) {
          return { error: 'Expected puzzle to be 81 characters long' };
      }

      return true;
  }

  check(puzzleString, coordinate, value) {

      if (!puzzleString || !coordinate || !value) {
          return { error: 'Required field(s) missing' };
      }

      let flag = this.validate(puzzleString);
      let coord = coordinate.toUpperCase();

      if (flag !== true) {
          return flag;
      }

      if (!/^[A-I][1-9]$/.test(coord)) {
          return { error: 'Invalid coordinate' };
      }

      if (!/^[1-9]$/.test(value)) {
          return { error: 'Invalid value' };
      }

      const checkKnownPlacement = () => {
          let [row, col] = [...coord];
          row = this.rows.indexOf(row) * 9;
          col = col - 1;
          let idx = row + col;

          if (puzzleString[idx] === value) {
              return true;
          }

          return false;
      };

      const checkRowPlacement = () => {
          let idx = this.rows.indexOf(coord[0]) * 9;
          const subStr = puzzleString.slice(idx, idx + 9);
          return !subStr.includes(value);
      };

      const checkColPlacement = () => {
          let col = coord[1] - 1;

          for (let i = 0; i < 9; i++) {
              let idx = i * 9 + col;

              if (puzzleString[idx] === value) {
                  return false;
              }
          }

          return true;
      };

      const checkRegionPlacement = () => {
          let [row, col] = [...coord];
          col = Math.trunc((col - 1) / 3);

          if (row > 'F') {
              row = 6;
          } else if (row > 'C') {
              row = 3;
          } else {
              row = 0;
          }

          return !this.regions[row + col]
              .map(v => puzzleString[v])
              .includes(value);
      };

      const k_val = checkKnownPlacement();
      const conflicts = [];

      if (!checkRowPlacement()) {
          conflicts.push('row');
      }

      if (!checkColPlacement()) {
          conflicts.push('column');
      }

      if (!checkRegionPlacement()) {
          conflicts.push('region');
      }

      if (k_val || conflicts.length === 0) {
          return { valid: true };
      }

      return {
          valid: false,
          conflict: conflicts
      };
  }

  solve(puzzleString) {

      if (!puzzleString) {
          return { error: 'Required field missing' };
      }

      let flag = this.validate(puzzleString);

      if (flag !== true) {
          return flag;
      }

      let array = puzzleString.split('');

      const handleSolve = (puzzleArray) => {
          const strArr = puzzleArray.slice(0);
          let count = 0, countAll = 0;

          for (let i = 0; i < 81; i++) {

              if (strArr[i] === '.') {
                  countAll++;
                  let row = Math.trunc(i / 9) * 9;
                  let col = i % 9;
                  let Arr = strArr.slice(row, row + 9);

                  for (let j = 0; j < 9; j++) {
                      let idx = j * 9 + col;
                      Arr.push(strArr[idx]);
                  }

                  let hor = Math.trunc(row / 27) * 3;
                  let ver = Math.trunc(col / 3);
                  let region = this.regions[hor + ver];
                  Arr = Arr.concat(region.map(v => strArr[v]));

                  let sumArr = Arr
                      .filter((val, k, self) => self.indexOf(val) === k && val !== '.');

                  if (sumArr.length === 8) {
                      strArr[i] = '' + sumArr.reduce((sum, cur) => sum - cur, 45);
                      count++;
                  }
              }
          }

          if (count === countAll) {
              return { solution: strArr.join('') };
          }

          if (count !== 0) {
              return handleSolve(strArr);
          }

          return { error: 'Puzzle cannot be solved' };
      };

      return handleSolve(array);
  }
}

module.exports = SudokuSolver;

