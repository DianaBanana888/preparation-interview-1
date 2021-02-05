/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
// класс для создания объекта таймер
// при создании экземпляра передаем круглое число минут, минимум одна минута
// при вызове метода start(display) передаем аргументом элемент на странице

class Timer {
  constructor(startMinutes) {
    this.timeLeft = startMinutes * 60;

    this.minutes = startMinutes;
    this.seconds = '00';
  }

  start(display, decksContainer, session) {
    const countDown = setInterval(async () => {
      this.minutes = Math.floor(this.timeLeft / 60);
      this.seconds = this.timeLeft % 60;
      this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
      this.timeLeft -= 1;

      // вывод времени
      display.innerText = `${this.minutes}:${this.seconds}`;

      if (this.timeLeft < 0) {
        display.innerText = '0:00';

        downloadHbs('resultHbs', 'result');
        const result = await fetchPOST('/deck/finish', { roundID: session.roundID });
        result.numQuest = session.cards.length;
        decksContainer.innerHTML = render(session.resultHbs, { result, wordend: wordEnd(result.pointer) });
        resetSession();
        clearInterval(countDown);
      }
    }, 1000);
  }
}
