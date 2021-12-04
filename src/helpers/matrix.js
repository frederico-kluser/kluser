let interval;

const enums = {
  COLOR: {
    BLACK: '#020204',
    GREEN: '#204829',
    TRANSPARENT: 'transparent',
  },
  CHARACTERS: [
    '｢',
    '｣',
    '､',
    'ｦ',
    'ｧ',
    'ｨ',
    'ｩ',
    'ｪ',
    'ｫ',
    'ｬ',
    'ｭ',
    'ｮ',
    'ｯ',
    'ｰ',
    'ｱ',
    'ｲ',
    'ｳ',
    'ｴ',
    'ｵ',
    'ｶ',
    'ｷ',
    'ｸ',
    'ｹ',
    'ｺ',
    'ｻ',
    'ｼ',
    'ｽ',
    'ｾ',
    'ｿ',
    'ﾀ',
    'ﾁ',
    'ﾂ',
    'ﾃ',
    'ﾄ',
    'ﾅ',
    'ﾆ',
    'ﾇ',
    'ﾈ',
    'ﾉ',
    'ﾊ',
    'ﾋ',
    'ﾌ',
    'ﾍ',
    'ﾎ',
    'ﾏ',
    'ﾐ',
    'ﾑ',
    'ﾒ',
    'ﾓ',
    'ﾔ',
    'ﾕ',
    'ﾖ',
    'ﾗ',
    'ﾘ',
    'ﾙ',
    'ﾚ',
    'ﾛ',
    'ﾜ',
    'ﾝ',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ],
};

// -----------------------------------------------------------------------------

const { columns } = process.stdout;
// const { columns, rows } = process.stdout;
const rows = 10;
const { CHARACTERS, COLOR } = enums;

const getProbability = (percent = 0) => percent > Math.floor(Math.random() * 100) + 1;
const getRandomNumber = (limit = 0) => Math.floor(Math.random() * limit);
const getRandomCharacter = () => CHARACTERS[getRandomNumber(CHARACTERS.length)];

const MatrixArrDraw = [];

class Matrix {
  constructor(row, column) {
    this.column = column;
    this.row = row;
    this.life = rows;
    this.letter = ' ';
    this.color = COLOR.TRANSPARENT;

    if (!this.row) {
      this.changeLetter(2);
    }
  }

  changeLetter(probability = 100) {
    if (getProbability(probability)) {
      this.letter = getRandomCharacter();
      this.color = COLOR.GREEN;
    }
  }

  // eslint-disable-next-line complexity
  passTime() {
    if (!this.life) {
      this.delete();
    } else if (this.letter !== ' ') {
      this.life -= 1;
      this.changeLetter(5);
    } else if (!this.row) {
      let allColumnEmpty = true;

      for (let row = 0; row < rows; row += 1) {
        if (MatrixArrDraw[row][this.column].letter !== ' ') {
          allColumnEmpty = false;
        }
      }

      if (allColumnEmpty) {
        this.changeLetter(2);
      }
    } else if (MatrixArrDraw[this.row - 1][this.column].letter !== ' ') {
      this.changeLetter();
    }
  }

  delete() {
    this.life = rows;
    this.letter = ' ';
  }
}

const generateOutput = () => {
  console.clear();
  let draw = '';

  MatrixArrDraw.forEach((line) => {
    line.forEach((character) => {
      draw += character.letter;
    });
    draw += '\n';
  });

  console.log(draw);
};

const changeCharacter = () => {
  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let colum = 0; colum < columns; colum += 1) {
      MatrixArrDraw[row][colum].passTime();
    }
  }

  generateOutput();
};

let globalExecute = false;
const executeCheck = (execute) => {
  if (execute && !globalExecute) {
    globalExecute = true;
    return true;
  }

  if (globalExecute) {
    clearInterval(interval);
    console.clear();
    globalExecute = false;
  }

  return false;
};

const matrixRain = (execute = true) => {
  if (executeCheck(execute)) {
    if (!MatrixArrDraw.length) {
      for (let row = 0; row < rows; row += 1) {
        MatrixArrDraw.push([]);
        for (let colum = 0; colum < columns; colum += 1) {
          MatrixArrDraw[row].push(new Matrix(row, colum));
        }
      }

      generateOutput();
    }

    interval = setInterval(() => {
      changeCharacter();
    }, 150);
  }
};

module.exports = matrixRain;
