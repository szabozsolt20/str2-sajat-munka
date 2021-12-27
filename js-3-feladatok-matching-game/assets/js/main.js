
import { startTime, stopTime, timeDisplay, } from './time.js'

let cardContent = [ //a kártya képeket tartalmazó tömb, amit permutálok majd.
  '<i class="fas fa-chess-rook"></i>',
  '<i class="fas fa-chess-queen"></i>',
  '<i class="fas fa-chess-knight"></i>',
  '<i class="fas fa-chess-king"></i>',
  '<i class="fas fa-chess-pawn"></i>',
  '<i class="fas fa-chess-rook"></i>',
  '<i class="fas fa-chess-queen"></i>',
  '<i class="fas fa-chess-knight"></i>',
  '<i class="fas fa-chess-king"></i>',
  '<i class="fas fa-chess-pawn"></i>',
];
let cards = []; //a kártyák állapotát leíró tömb (benne minden kártya egy objektum)
let sn = 0;// a kattintott div sorszámának egy változó
let gameTime = false; //elkezdődött-e a játék
let flipCounter = 0;


const flip_oda = (container) => { //lefordít
  if (container.classList.contains('forgat-vissza')) {
    container.classList.remove('forgat-vissza');
  }
  container.classList.add('forgat-oda');
}
const flip_vissza = (container) => { //visszafordít
  if (container.classList.contains('forgat-oda')) {
    container.classList.remove('forgat-oda');
  }
  container.classList.add('forgat-vissza');
}

const flip = function () {//ez "átfordítja" a kártyákat tartalmazó div-et (a divek-ben így tudtam korábban megadni működőre: onclick='flip.call(this)')
  if (!gameTime) { gameTime = true; startTime() }; //első kattra indul az idő
  sn = this.classList[1][this.classList[1].length - 1];// a kattintott div sorszámát adja vissza
/* ELLENŐRZÉSHEZ:
  console.log(this);
  console.log(sn);
  console.log(cards[sn].flippable);
  console.log(!cards[sn].flip_state);
  console.log(flippableUpSideCount());
 */  if (cards[sn].flippable && !cards[sn].flip_state && flippableUpSideCount() < 2) { //ha nem megtalált, és le van fordítva, 
    //és 0, vagy 1 db van még felfordítva
    flip_oda(this);
    cards[sn].flip_state = true; //beállítom az állapotobjektumban az állapotát: true: felfordítva, false: lefordítva
    flipCounter++; // ps/ptlan van felfordítva

    //console.log(cards);

    if (flipCounter % 2 == 0) { //Minden második felfordításra végezzük csak el
      cards.forEach((item, index) => {
        if ((sn != index) && (item.content == cards[sn].content) && item.flip_state) {//ha egyenlő a képtartalom egy már felfordított kártya 
          //képtartalmával(kivéve önmagát!)
          cards[sn].flippable = false;//akkor megtalálttá válik
          cards[index].flippable = false; // és a párja is
        }
      });

      setTimeout(() => { //ha nem pár, akkor visszaforgatom
        cards.forEach((item, index) => {
          if (item.flip_state && item.flippable) { flip_vissza(document.querySelector(`[class*="flip-card_${index}"]`)); item.flip_state = false; }
        });
      }, 1000);

    }

  }

  if (cards.reduce((a, next) => a + !next.flippable, 0) == 8) { //ha már csak 1 pár maradt, az magától fordul:
    cards.forEach((item, index) => {
      if (!item.flip_state) { flip_oda(document.querySelector(`[class*="flip-card_${index}"]`)); }
    });

    //igen, belegondolva: alkalmasan összeszerkesztett szövegek rangsorolását bízom a JS-re, hogy az első cserét, majd az összes többit
    //is a várt módon hajtsa végre(ha kell) ("+2": a maguktól forduló kártyák miatt):
    document.querySelector('#actualScore').textContent = `${flipCounter + 2} lépésben (${timeDisplay.textContent} idő alatt)`;
    if ((flipCounter + 2).toString() < document.querySelector('#globalScore').textContent) {
      document.querySelector('#globalScore').textContent = `${flipCounter + 2} lépésben (${timeDisplay.textContent} idő alatt)`;
    };

    stopTime();
    setTimeout(() => { stopGame(); }, 5000);
  }
};

const flippableUpSideCount = () => { //aktuálisan ennyi darab nem megtalált kártya van felfordítva
  return cards.reduce((a, next) => a + (next.flip_state && next.flippable), 0);
}

const initGame = () => {

  cardContent.sort(() => 0.5 - Math.random()); //megkeverem a kártya tartalmakat tartalmazó tömböt

  for (let i = 0; i < 10; i++) { //feltöltöm a click eseménykezelőket, a lefordított képeket és az állapot-tömböt
    document.querySelector(`[class*="flip-card_${i}"]`).addEventListener("click", flip);
    document.querySelector(`[class*="flip-card-back_${i}"]`).innerHTML = cardContent[i];

    let card = new Object();

    card.id = i;
    card.flip_state = false;
    card.flippable = true;
    card.content = cardContent[i];

    cards.push(card);

  }
}
const stopGame = () => {
  timeDisplay.textContent = "00:00";
  gameTime = false;
  flipCounter = 0;
  cards = [];
  for (let i = 0; i < 10; i++) { //kiürítem a click eseménykezelőket, és az állapot-tömböt(mert a initGame() újratölti ezeket)
    //képek maradhatnak, úgyis felűlíródnak, és lefordítom a konténereket.
    const container = document.querySelector(`[class*="flip-card_${i}"]`);
    container.removeEventListener("click", flip);

    //cards.pop();// Így is lehetne, persze
    flip_vissza(container);
  }
  initGame();
}

initGame(); //legelső alkalommal is le kell futnia egyszer, amikor betölt az oldal