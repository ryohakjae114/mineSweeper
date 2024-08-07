'use strict';
let cell;
let freeCellCount;
let setFlagCount = 0;

const displayFlagCount = document.getElementById('flagCount');

addEventListener("load", () => {
  initGame();
});

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
  resetGame();
})

function initGame() {
  resetButton.innerText = '😊';
  cell = [[], [], [], [], [], [], [], [], []];
  freeCellCount = 0;
  setFlagCount = 0;
  displayFlagCount.innerText = setFlagCount;
  createGrid();
  initCells();
  placeMines(10);
}

function resetGame() {
  const tbody = document.getElementById('gridTbody');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  initGame();
}

function createGrid() {
  const displayGridTbody = document.getElementById('gridTbody');
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
    let placeMine = decidePlace();
    while (cell[placeMine[0]][placeMine[1]]['mine']) {
      placeMine = decidePlace();
    }
    cell[placeMine[0]][placeMine[1]]['mine'] = true;
  }
}

function decidePlace() {
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
      document.querySelector(`[data-y="${y}"][data-x="${x}"]`).classList.add('freeCell');
      placeMines(1);
      freeCell(y, x);
    } else {
      gameOver();
    }
  } else {
    freeCell(y, x);
  }
  return;
}

function toggleFlag(y, x) {
  const displayCell = document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
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
  const displayCell = document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
  if (displayCell !== null && cell[y][x]['free'] === false) {
    const countMinesAround = countMinesAroundCalc(y, x);
    if (displayCell.innerText === '🚩') {
      toggleFlag(y, x);
    } else {
      displayCell.innerText = countMinesAround;
    }
    displayCell.classList.add('freeCell');
    cell[y][x]['free'] = true;
    freeCellCount++;
      console.log(freeCellCount);
    if (freeCellCount === 71) {
      alert('成功!');
      // ゲーム終了後、ボタンを押してもイベントが発火しないようにする
      document.querySelectorAll('td').forEach((td) => {
        td.removeEventListener('click', () => {
          clickCell(Number(td.dataset.y), Number(td.dataset.x));
        });
      });
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

function countMinesAroundCalc(y, x) {
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
  resetButton.innerText = '😅';
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (cell[y][x]['mine'] === true) {
        const displayCell = document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
        displayCell.innerText = '💣';
      }
    }
  }
  alert('爆発しました');
  
  // ゲーム終了後、ボタンを押してもイベントが発火しないようにする
  document.querySelectorAll('td').forEach((td) => {
    td.removeEventListener('click', () => {
      clickCell(Number(td.dataset.y), Number(td.dataset.x));
    });
  });
}
