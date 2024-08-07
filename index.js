'use strict';
const cell = [[], [], [], [], [], [], [], [], []];
let freeCellCount = 0;

addEventListener("load", () => {
  createGrid();
  initCells();
  placeMines(20);
  document.querySelectorAll('td').forEach((td) => {
    td.addEventListener('click', () => {
      clickCell(Number(td.dataset.y), Number(td.dataset.x));
    });
    td.addEventListener('contextmenu', (e) => {
      setFlag(Number(td.dataset.y), Number(td.dataset.x));
      e.preventDefault();
    })
  });
});

function createGrid() {
  const displayGridTbody = document.getElementById('gridTbody');
  for (let y = 0; y < 9; y++) {
    const tr = document.createElement('tr');
    for (let x = 0; x < 9; x++) {
      const td = document.createElement('td');
      td.dataset.y = y;
      td.dataset.x = x;
      td.innerText = 'セーフ'; // デバッグ用
      td.classList.add('p-3', 'notFreeCell');
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
    const displayCell = document.querySelector(`[data-y="${placeMine[0]}"][data-x="${placeMine[1]}"]`);
    displayCell.innerText = '地雷';
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
      document.querySelector(`[data-y="${y}"][data-x="${x}"]`).innerText = 'セーフ';
      document.querySelector(`[data-y="${y}"][data-x="${x}"]`).classList.add('freeCell');
      placeMines(1);
      freeCell(y, x);
    } else {
      // 地雷だった時の処理 
      gameOver();
    }
  } else {
    // クリックされて地雷じゃなくて、隣接する地雷の数を表示する
    freeCell(y, x);
  }
  return;
}

function setFlag(y, x) {
  const displayCell = document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
  displayCell.innerText = '🚩';
}



function freeCell(y, x) {
  const displayCell = document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
  if (displayCell !== null && cell[y][x]['free'] === false) {
    const countMinesAround = countMinesAroundCalc(y, x);
    displayCell.innerText = countMinesAround;
    displayCell.classList.add('freeCell');
    cell[y][x]['free'] = true;
    freeCellCount++;
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
  alert('爆発しました');
  // ゲーム終了後、ボタンを押してもイベントが発火しないようにする
  document.querySelectorAll('td').forEach((td) => {
    td.removeEventListener('click', () => {
      clickCell(Number(td.dataset.y), Number(td.dataset.x));
    });
  });
}
