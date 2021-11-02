'use strict'
const cellak = Array.from(document.querySelectorAll('.cella'));
let jel = ["O", "X"];
let a = 0; // let tartalom = new Array(9).fill("X"); // tartalom = tartalom.map(item => "W");

cellak.forEach(item => {
    item.innerHTML = "";
    item.addEventListener("click",
        () => {
            if (item.innerHTML == "") {
                a++;
                item.textContent = jel[a % 2];
                jel[a % 2];
                ellenorzes(jel[a % 2])
            }
        })
});

let ellenorzes = (jel) => {
    let x = 0;
    let o = 0;
    for (let i = 0; i < 9; i++) {
        if (i % 3 == 0 &&
            (cellak[i].textContent + cellak[i + 1].textContent + cellak[i + 2].textContent == jel + jel + jel)) {
            alert("Győzött: " + jel); ujrakezdes();
        }
        if (i < 3 &&
            (cellak[i].textContent + cellak[i + 3].textContent + cellak[i + 6].textContent == jel + jel + jel)) {
            alert("Győzött: " + jel); ujrakezdes();
        }
        if ((i == 4 && cellak[4].textContent) &&
            ((cellak[4].textContent == cellak[2].textContent) && (cellak[4].textContent == cellak[6].textContent) ||
                (cellak[4].textContent == cellak[0].textContent) && (cellak[4].textContent == cellak[8].textContent))) {
            alert("Győzött: " + jel); ujrakezdes();
        }
    };
}
let ujrakezdes = () => {a = 0; cellak.forEach(item => item.innerHTML = "")
};