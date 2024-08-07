'use strict';
let cell;
let freeCellCount;
let setFlagCount = 0;

const displayFlagCount = document.getElementById('flagCount');
const displayResetButton = document.getElementById('resetButton');
const displayGridTbody = document.getElementById('gridTbody');

addEventListener("load", () => {
  initGame();
});

displayResetButton.addEventListener('click', () => {
  resetGame();
})

function initGame() {
  displayResetButton.innerText = '😊';
  cell = [[], [], [], [], [], [], [], [], []];
  freeCellCount = 0;
  setFlagCount = 0;
  displayFlagCount.innerText = setFlagCount;
  createGrid();
  initCells();
  placeMines(10);
}

function resetGame() {
  while (displayGridTbody.firstChild) {
    displayGridTbody.removeChild(displayGridTbody.firstChild);
  }
  initGame();
}

function createGrid() {
  for (let y = 0; y < 9; y++) {
    const tr = document.createElement('tr');
    for (let x = 0; x < 9; x++) {
      const td = document.createElement('td');
      td.dataset.y = y;
      td.dataset.x = x;
      td.classList.add('cell', 'notFreeCell', 'fs-6');
      td.setAttribute('align', 'center');
      td.setAttribute('valign', 'middle');
      td.addEventListener('click', () => {
        clickCell(Number(td.dataset.y), Number(td.dataset.x));
      });
      td.addEventListener('contextmenu', (e) => {
        toggleFlag(Number(td.dataset.y), Number(td.dataset.x));
        e.preventDefault();
      })
      tr.appendChild(td);
    }
    displayGridTbody.appendChild(tr);
  }
}

function initCells() {
  cell.forEach(row => {
    for (let x = 0; x < 9; x++) {
      row[x] = {};
      row[x]['mine'] = false;
      row[x]['free'] = false;
    }
  });
}

function placeMines(count) {
  for (let i = 0; i < count; i++) {
    let placeMine = randomPosition();
    while (cell[placeMine[0]][placeMine[1]]['mine']) {
      placeMine = randomPosition();
    }
    cell[placeMine[0]][placeMine[1]]['mine'] = true;
  }
}

function randomPosition() {
  const y = getRandomInt(9);
  const x = getRandomInt(9);
  return [y, x];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function clickCell(y, x) {
  if (cell[y][x]['mine']) {
    if (freeCellCount === 0) {
      cell[y][x]['mine'] = false;
      searchDisplayCell(y, x).classList.add('freeCell');
      placeMines(1);
      freeCell(y, x);
    } else {
      gameOver();
    }
  } else {
    freeCell(y, x);
  }
}

function toggleFlag(y, x) {
  const displayCell = searchDisplayCell(y, x);
  if (cell[y][x]['free'] === false) {
    if (displayCell.innerText === '🚩') {
      displayCell.innerText = ''
      setFlagCount--;
    } else {
      displayCell.innerText = '🚩';
      setFlagCount++;
    }
    displayFlagCount.innerText = setFlagCount;
  }
}



function freeCell(y, x) {
  const displayCell = searchDisplayCell(y, x);
  if (displayCell !== null && cell[y][x]['free'] === false) {
    const countMinesAround = calcCountMinesAround(y, x);
    if (displayCell.innerText === '🚩') {
      toggleFlag(y, x);
    }
    displayCell.innerText = countMinesAround;
    displayCell.classList.add('freeCell');
    cell[y][x]['free'] = true;
    freeCellCount++;
    if (freeCellCount === 71) {
      alert('成功!');
    }
    if (countMinesAround === 0) {
      for (let neighborY = y - 1; neighborY <= y + 1; neighborY++) {
        for (let neighborX = x - 1; neighborX <= x + 1; neighborX++) {
          freeCell(neighborY, neighborX);
        }
      }
    }
  } else {
    return;
  }
}

function calcCountMinesAround(y, x) {
  let neighborMinesCount = 0;
  for (let neighborY = y - 1; neighborY <= y + 1; neighborY++) {
    for (let neighborX = x - 1; neighborX <= x + 1; neighborX++) {
      if (cell[neighborY] !== undefined && cell[neighborY][neighborX] !== undefined && cell[neighborY][neighborX]['mine'] === true) {
        neighborMinesCount++;
      }
    }
  }
  return neighborMinesCount;
}

function gameOver() {
  displayResetButton.innerText = '😅';
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (cell[y][x]['mine'] === true) {
        const displayCell = searchDisplayCell(y, x);
        displayCell.innerText = '💣';
      }
    }
  }
  alert('爆発しました');
}

function searchDisplayCell(y, x) {
  return document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
}
