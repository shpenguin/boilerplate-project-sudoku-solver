class SudokuSolver {

  validate(puzzleString) {

    if (/[^1-9||.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    return true;
  }

  convertCoord(coord) {
    const puzzleArr = [
      "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9",
      "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9",
      "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9",
      "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9",
      "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9",
      "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9",
      "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9",
      "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9",
      "I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9"
    ];

    return puzzleArr.indexOf(coord);
  }

  handleRegions() {
    return [
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

  checkKnownPlacement(puzzleString, coord, value) {
    let idx = this.convertCoord(coord);

    if (puzzleString[idx] === value) {
      return true;
    } else {
      return false;
    }

  }

  checkRowPlacement(puzzleString, coord, value) {
    /*const map = puzzleMap(puzzleString);

    let rowArray = puzzleArr
                    .filter(v => v[0] === coord[0].toUpperCase())
                    .map(v => map[v]);

    const rowArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    let row = rowArr.indexOf(coord[0].toUpperCase());*/
    let row = Math.trunc(this.convertCoord(coord) / 9);
    let idx = row * 9;
    //let col = coord[1] - 1;
    const subStr = puzzleString.slice(idx, idx + 9);

    /*if (oddArr[col] === value) {
      return true;
    } else {
      return !oddArr.includes(value);
    }*/

    return !subStr.includes(value);
  }

  checkColPlacement(puzzleString, coord, value) {
    /*const map = puzzleMap(puzzleString);

    let rowArray = puzzleArr
                    .filter(v => v[1] === coord[1])
                    .map(v => map[v]);*/

    let col = this.convertCoord(coord) % 9;

    for (let i = 0; i < 9; i++) {
      let idx = i * 9 + col;

      if (puzzleString[idx] === value) {
        return false;
      }

    }

    return true;
  }

  checkRegionPlacement(puzzleString, coord, value) {
    /*const map = puzzleMap(puzzleString);
    let target;
    const regions = [
      ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
      ['A4', 'A5', 'A6', 'B4', 'B5', 'B6', 'C4', 'C5', 'C6'],
      ['A7', 'A8', 'A9', 'B7', 'B8', 'B9', 'C7', 'C8', 'C9'],
      ['D1', 'D2', 'D3', 'E1', 'E2', 'E3', 'F1', 'F2', 'F3'],
      ['D4', 'D5', 'D6', 'E4', 'E5', 'E6', 'F4', 'F5', 'F6'],
      ['D7', 'D8', 'D9', 'E7', 'E8', 'E9', 'F7', 'F8', 'F9'],
      ['G1', 'G2', 'G3', 'H1', 'H2', 'H3', 'I1', 'I2', 'I3'],
      ['G4', 'G5', 'G6', 'H4', 'H5', 'H6', 'I4', 'I5', 'I6'],
      ['G7', 'G8', 'G9', 'H7', 'H8', 'H9', 'I7', 'I8', 'I9']
    ];

    for (let item of regions) {
      if (item.includes(coord.toUpperCase())) {
        target = item;
        break;
      }
    }

    let rowArray = target.map(v => map[v]);

    const rowArr = [A, B, C, D, E, F, G, H, I];
    let row = rowArr.indexOf(coord[0].toUpperCase());
    let col = coord[1] - 1;*/
    let idx = this.convertCoord(coord);
    const regions = this.handleRegions();

    for (let item of regions) {
      if (item.includes(idx)) {
        return !item
          .map(v => puzzleString[v])
          .includes(value);
      }
    }

  }

  solve(puzzleArray) {
    const strArr = puzzleArray;
    const regions = this.handleRegions();
    let count = 0;

    for (let i = 0; i < 81; i++) {
      let char = strArr[i];

      if (char === '.') {
        let row = Math.trunc(i / 9) * 9;
        let col = i % 9;
        let Arr = strArr.slice(row, row + 9);

        for (let j = 0; j < 9; j++) {
          let idx = j * 9 + col;
          Arr.push(strArr[idx]);
        }

        /*strArr.forEach((item, j) => {
          if ((j - col) % 9 === 0) {
            colArr.push(item);
          }
        });*/

        for (let item of regions) {
          if (item.includes(i)) {
            let region = item.map(v => strArr[v]);
            Arr = Arr.concat(region);
            break;
          }
        }

        let sumArr = Arr.filter((val, k, self) => {
          return self.indexOf(val) === k && val !== '.';
        });

        if (sumArr.length === 8) {
          strArr[i] = sumArr.reduce((sum, cur) => sum - cur, 45);
          count++;
        }

      }

    }

    if (count === 0 && strArr.includes('.')) {
      return { error: 'Puzzle cannot be solved' };
    }
    
    return (strArr.includes('.')) ? this.solve(strArr) : strArr.join('');

  }
}

module.exports = SudokuSolver;

