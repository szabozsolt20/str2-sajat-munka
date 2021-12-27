export let timeDisplay = document.querySelector('#time');

let counterSec = 0;
let counterMin = 0;
let runStatus = false;

function refreshTime() {
  counterSec++;
  if (counterSec > 59) {
    counterSec = 0;
    counterMin++;
  }

  timeDisplay.textContent = `${counterMin < 10 ? "0" + counterMin : counterMin}:${counterSec < 10 ? "0" + counterSec : counterSec}`;
}

let stopid = []
export const startTime = () => {
  if (!runStatus) {
    timeDisplay.textContent = "00:00";
    stopid.push(setInterval(refreshTime, 1000));
  }
  runStatus = true;
}
export const stopTime = () => {
  clearInterval(stopid[stopid.length - 1]);
  stopid.pop();
  counterSec = 0;
  counterMin = 0;
  runStatus = false;
}
