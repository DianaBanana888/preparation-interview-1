// логика отображения таймера на странице partials/timer.hbs

const timerDisplay = document.querySelector('div.timer');
const btn = document.querySelector('button.timer');
timerDisplay.innerText = '';

btn.addEventListener('click', e => {

  const timer = new Timer(1); // .on = false;
  timer.start(timerDisplay); // .on = true;

});
