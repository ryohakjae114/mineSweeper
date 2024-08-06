const cell = [[], [], [], [], [], [], [], [], []];
addEventListener("load", () => {
  createGrid();
  initCells();
  placeMines();
});

function createGrid() {
  const displayGridTbody = document.getElementById('gridTbody');
  for (let i = 0; i < 9; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const td = document.createElement('td');
      tr.appendChild(td);
    }
    displayGridTbody.appendChild(tr);
  }
}

function initCells() {
  cell.forEach(line => {
    for (let i = 0; i < 9; i++) {
      line[i] = false;
    }
  });
}

function placeMines() {
  for (let i = 0; i < 20; i++) {
    let placeMine = decidePlace();
    while (cell[placeMine[0]][placeMine[1]]) {
      placeMine = decidePlace();
    }
    cell[placeMine[0]][placeMine[1]] = true;
  }
}

function decidePlace() {
  const x = getRandomInt(9);
  const y = getRandomInt(9);
  return [x, y];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
