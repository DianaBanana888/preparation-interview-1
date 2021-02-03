// класс для создания объекта таймер
// при создании экземпляра передаем круглое число минут, минимум одна минута
// при вызове метода start(display) передаем аргументом элемент на странице

class Timer {
  constructor(startMinutes) {
    this.timeLeft = startMinutes * 60;

    this.minutes = startMinutes;
    this.seconds = '00';

    this.on = false;
  }

  start(display) {
    this.on = true;

    const countDown = setInterval(() => {
      if (this.timeLeft <= 0) {
        clearInterval(countDown);
        this.stop();
      }

      this.minutes = Math.floor(this.timeLeft / 60);
      this.seconds = this.timeLeft % 60;
      this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
      this.timeLeft -= 1;

      // вывод времени
      display.innerText = `${this.minutes}:${this.seconds}`;
    }, 1000);
  }

  stop() {
    this.on = false;
  }
}
