/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
// класс для создания объекта таймер
// при создании экземпляра передаем круглое число минут, минимум одна минута
// при вызове метода start(display) передаем аргументом элемент на странице

class Timer {
  constructor(startMinutes) {
    this.timeLeft = startMinutes * 60 - 57;

    this.minutes = startMinutes;
    this.seconds = '00';
  }

  start(display, form, session) {
    const countDown = setInterval(() => {
      this.minutes = Math.floor(this.timeLeft / 60);
      this.seconds = this.timeLeft % 60;
      this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
      this.timeLeft -= 1;

      // вывод времени
      display.innerText = `${this.minutes}:${this.seconds}`;

      console.log(this);

      if (this.timeLeft < 0) {
        display.innerText = '0:00';
        // form.requestSubmit();
        console.log(session.roundID);

        downloadHbs('resultHbs', 'result');
        const result = fetchPOST('/deck/finish', { roundID: session.roundID });
        result.numQuest = session.cards.length;
        console.log('&&&&', result.deck);
        form.innerHTML = render(session.resultHbs, { result, wordend: wordEnd(result.pointer) });

        clearInterval(countDown);
      }
    }, 1000);
  }
}
