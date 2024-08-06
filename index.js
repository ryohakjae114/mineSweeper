'use strict';
const cell = [[], [], [], [], [], [], [], [], []];
let freeCellCount = 0;

addEventListener("load", () => {
  createGrid();
  initCells();
  placeMines(20);
  document.querySelectorAll('td').forEach((td) => {
    td.addEventListener('click', () => {
      freeCell(Number(td.dataset.y), Number(td.dataset.x));
    });
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
      td.classList.add('p-3');
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

function freeCell(y, x) {
  freeCellCount++;
  cell[y][x]['free'] = true;

  if (cell[y][x]['mine']) {
    if (freeCellCount === 1) {
      cell[y][x]['mine'] = false;
      document.querySelector(`[data-y="${y}"][data-x="${x}"]`).innerText = 'セーフ';
      placeMines(1);
    } else {
      // 地雷だった時の処理 
      gameOver();
    }
  } else {
    // クリックされて地雷じゃなくて、隣接する地雷の数を表示する
    const displayCell = document.querySelector(`[data-y="${y}"][data-x="${x}"]`);
    let neighborMinesCount = 0;
    for (let neighborY = y - 1; neighborY <= y + 1; neighborY++) {
      let count = 0;
      for (let neighborX = x - 1; neighborX <= x + 1; neighborX++) {
        if (cell[neighborY] !== undefined && cell[neighborY][neighborX] !== undefined && cell[neighborY][neighborX]['mine'] === true) {
          neighborMinesCount++;
        }
        count++;
        console.log(count)
      }
    }
    displayCell.innerText = neighborMinesCount;
  }
  return;
}

function gameOver() {
  alert('爆発しました');
  // ゲーム終了後、ボタンを押してもイベントが発火しないようにする
  document.querySelectorAll('td').forEach((td) => {
    td.removeEventListener('click', () => {
      freeCell(Number(td.dataset.y), Number(td.dataset.x));
    });
  });
}
