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

class SudokuSolver {

  puzzleMap(puzzleString) {
    const map = {};

    for (let i = 0; i < 81; i++) {
      map[puzzleArr[i]] = puzzleString[i];
    }

    return map;
  }

  validate(puzzleString) {

    if (/[^1-9||.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    return true; String.to
  }

  checkRowPlacement(puzzleString, coord, value) {
    const map = puzzleMap(puzzleString);

    let rowArray = puzzleArr
                    .filter(v => v[0] === coord[0].toUpperCase())
                    .map(v => map[v]);

    return !rowArray.includes(value);
  }

  checkColPlacement(puzzleString, coord, value) {
    const map = puzzleMap(puzzleString);

    let rowArray = puzzleArr
                    .filter(v => v[1] === coord[1])
                    .map(v => map[v]);

    return !rowArray.includes(value);
  }

  checkRegionPlacement(puzzleString, coord, value) {
    const map = puzzleMap(puzzleString);
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

    return !rowArray.includes(value);

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;

