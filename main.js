"use strict";

let cell = 3; // マスの数
const table = document.querySelector("table");
const numbers = document.getElementById("numbers");
const btn = document.getElementById("btn").addEventListener("click", () => {
  cell = Number(document.getElementById("cell").value);
  table.innerHTML = "";
  numbers.innerHTML = "";
  table.style.background = "#e6e6e6";
  if (cell >= 7) {
    numbers.style.width = "100%";
  } else {
    numbers.style.width = "470px";
  }
  init();
});

init();
// ゲーム画面初期化・イベントリスナー設定
function init() {
  for (let i = 0; i < cell + 2; i++) {
    const tr = document.createElement("tr");
    if (i === 0 || i === cell + 1) {
      for (let j = 0; j < cell + 1; j++) {
        const th = document.createElement("th");
        tr.appendChild(th);
      }
    } else {
      for (let k = 0; k < cell + 1; k++) {
        if (k === cell) {
          const th = document.createElement("th");
          tr.appendChild(th);
        } else {
          const td = document.createElement("td");
          td.addEventListener("drop", onDrop);
          td.addEventListener("dragover", onDragover);
          td.addEventListener("dragenter", onDragenter);
          td.addEventListener("dragleave", onDragleave);
          tr.appendChild(td);
        }
      }
    }
    table.appendChild(tr);
  }
  // 入力数字生成
  for (let i = 0; i < cell * cell; i++) {
    const number = document.createElement("div");
    number.className = "number";
    number.draggable = "true";
    number.textContent = i + 1;
    number.addEventListener("dragstart", onDragStart);
    numbers.appendChild(number);
  }
  const remove = document.createElement("div");
  remove.className = "remove";
  remove.draggable = "true";
  remove.textContent = "×";
  numbers.appendChild(remove);
}
// ドラッグ処理
function onDragStart(e) {
  // テキストをdataTransferにセットする
  e.dataTransfer.setData("text", e.target.textContent);
  // イベントの予期せぬ伝播を防ぐための記述
  e.stopPropagation();
}
// ドロップ処理
function onDrop(e) {
  // 追加処理防止
  e.preventDefault();
  // dataTransferからテキストデータを受け取る
  const text = e.dataTransfer.getData("text");
  const number = document.querySelectorAll(".number");
  number.forEach((value) => {
    if (value.textContent === text) {
      value.classList.add("select");
    }
  });
  number.forEach((value) => {
    if (value.textContent === e.target.textContent) {
      value.classList.remove("select");
    }
  });
  e.target.textContent = text;
  this.classList.remove("select2");
  sum();
  is_same();
}
// 操作が要素上へ進入
function onDragenter(e) {
  this.classList.toggle("select2");
}
// 操作が要素上を通過中
function onDragover(e) {
  // 追加処理防止
  e.preventDefault();
  // e.dataTransfer.dropEffect = "move";
}
// 操作が要素上から退出
function onDragleave(e) {
  this.classList.toggle("select2");
}
// 縦横斜めの和・表示
function sum() {
  let z = 0;
  let z2 = 0;
  for (let i = 0; i < cell + 1; i++) {
    let x = 0;
    let y = 0;
    for (let j = 0; j < cell; j++) {
      x += Number(table.rows[i].cells[j].textContent); // 横計算
      y += Number(table.rows[j + 1].cells[i].textContent); // 縦計算
    }
    table.rows[i].cells[cell].innerHTML = `<div class="total">${x}</div>`; // 横合計表示
    table.rows[0].cells[i].innerHTML = `<div class="total">${y}</div>`; // 縦合計表示
  }
  for (let k = 0; k < cell; k++) {
    z += Number(table.rows[cell - k].cells[k].textContent); // 右斜め計算
    z2 += Number(table.rows[k + 1].cells[k].textContent); // 左斜め計算
  }
  table.rows[0].cells[cell].innerHTML = `<div class="total">${z}</div>`; // 右斜め合計表示
  table.rows[cell + 1].cells[cell].innerHTML = `<div class="total">${z2}</div>`; // 左斜め合計表示
}

// 正解か判定
function is_same() {
  let total = [];
  const th = document.querySelector("th");
  for (let i = 0; i < cell + 1; i++) {
    // 横
    total.push(table.rows[0].cells[i].textContent);
    // 縦
    total.push(table.rows[i + 1].cells[cell].textContent);
  }
  if (total.every((v) => v === total[0] && total[0] !== "0")) {
    table.style.background = "pink";
  } else {
    table.style.background = "#e6e6e6";
  }
}
