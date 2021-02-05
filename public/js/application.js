/* eslint-disable func-names */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const navUser = document.getElementById('nav-user');
const modal = document.getElementById('modal-form');
const modalContent = document.querySelector('.modal-content');
// const creatDeck = document.querySelector('.creat-deck');
const addInputDeck = document.querySelector('.add-input-deck') || null;
let formDeckCreate = document.getElementById('form-deck-create');
const creteDeckSubmit = document.querySelector('.submit-deck');
let levelChoice = document.querySelector('.level-choices') || null;
const authForm = document.querySelector('.modal-content');
const topWindow = document.querySelector('.top-window') || null;

if (topWindow) {
  // eslint-disable-next-line no-unused-vars
  document.addEventListener('scroll', (e) => {
    const numCss = 1 - (window.scrollY / 100);
    if (numCss >= -0.5) {
      topWindow.style.cssText = `
        opacity: ${numCss}`;
    }
  });
}

async function fetchUniversal(method, path, data) {
  let response = {};
  try {
    response = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.status === 500) alert(`Ошибка сервера , ${result.message}`);
    return result;
  } catch (err) {
    alert(err.response.data);
  }
}

function openModalForm(type = null, title = null, name = null) {
  modalContent.innerHTML = '';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('open');
  }, 100);

  const formRegister = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/auth/${type}" class="input-field form-auth col s12">
      <div class="input-field col s12">
        <i class="material-icons prefix">person_outline</i>
        <input placeholder="login" name="login" type="text"  class="autocomplete" required>
      </div>
      <div class="input-field col s12">
      <i class="material-icons prefix">person_outline</i>
      <input placeholder="email" name="email" id="email" type="email" class="validate" required>
      <label for="email"></label>
    </div>
      <div class="input-field col s12">
        <i class="material-icons prefix">https</i>
        <input placeholder="password" name="password" type="password" class="autocomplete pass-auth" required>
        <a class="password-control">
        <span class="material-icons eye">visibility</span>
        </a>
      </div>

      <div class="form-error"></div>
      <button type="submit" class="waves-effect answerBtn form-button">${title}</button>

    </form>
  `;

  const formLogin = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/auth/${type}" class="input-field form-auth col s12">
      <div class="input-field col s12">
        <i class="material-icons prefix">person_outline</i>
        <input placeholder="email" name="email" id="email" type="email" class="validate" required>
        <label for="email"></label>
      </div>
      <div class="input-field col s12">
        <i class="material-icons prefix">https</i>
        <input placeholder="password" name="password" type="password" class="autocomplete pass-auth" required>
        <a class="password-control">
        <span class="material-icons eye">visibility</span>
        </a>
      </div>

      <div class="form-error"></div>
      <button type="submit" class="waves-effect answerBtn form-button">${title}</button>

    </form>
  `;

  if (name === 'register') modalContent.insertAdjacentHTML('beforeend', formRegister);
  if (name === 'login') modalContent.insertAdjacentHTML('beforeend', formLogin);

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const data = await fetchUniversal('POST', event.target.action, {
      name: event?.target?.login?.value,
      email: event.target.email.value,
      password: event.target.password.value,
    });

    if (data.message !== 'OK') {
      document.querySelector(".form-error").innerHTML = `
      <p style="color:red">${data.message}</p>
      `;
      // event.target.insertAdjacentHTML(
      //   'beforeend',
      //   `<p style="color:red">${data.message}</p>`,
      // );
    } else {
      modal.style.display = 'none';
      window.location.href = '/';
    }
  });

  document.querySelector('.password-control').addEventListener('click', () => {
    const pass = document.querySelector('.pass-auth');
    if (pass.getAttribute('type') === 'password') {
      pass.setAttribute('type', 'text');
    } else {
      pass.setAttribute('type', 'password');
    }
  });

  modal.addEventListener('click', (e) => {
    const target = e.target.classList.contains('modal-form');
    if (target) {
      modal.style.display = 'none';
      modal.classList.remove('open');
    }
  });
}

navUser.addEventListener('click', (e) => {
  if (e.target.classList.contains('register-user')) {
    openModalForm('register', 'Регистрация', 'register');
  }
  if (e.target.classList.contains('input-user')) {
    openModalForm('login', 'Войти', 'login');
  }
});

const submitFormDeck = (e) => {
  e.preventDefault();
  const questions = [];

  // const colection = new Map();
  const dataArr = Array.from(document.querySelectorAll('.data'), (e) => e.value);

  for (let i = 1; i < dataArr.length; i += 1) {
    const dataObj = {};
    if (i % 2 === 0) {
      dataObj.q = dataArr[i - 1];
      dataObj.a = dataArr[i];
      questions.push(dataObj);
    }
  }

  const data = {
    id: formDeckCreate.id.value,
    title: formDeckCreate.title.value,
    dataArr: questions,
  };

  fetchUniversal('POST', '/editdack', data);
  formDeckCreate.reset();
  window.location.href = '/';
};

if (addInputDeck) {
  addInputDeck.addEventListener('click', () => {
    const inputs = `
      <div class="row inputs-form-deck">
      <input type="hidden" class="" name="id" value="false" />
      <div class="input-field col s5">
        <i class="material-icons prefix">live_help</i>
        <input class="data" required placeholder="Вопрос" name="question"   type="text" >
      </div>
      <div class="input-field col s6">
        <i class="material-icons prefix">chat_bubble</i>
        <input class="data" required placeholder="Ответ" name="answer" type="text" >
      </div>
      <i class="material-icons remove-question">clear</i>
    </div>
      `;
    const lengthInputFormDeck = () => {
      const lengthInputsForm = document.querySelectorAll('.inputs-form-deck').length;
      if (lengthInputsForm >= 4) {
        creteDeckSubmit.classList.remove('disabled');
      } else {
        creteDeckSubmit.classList.add('disabled');
      }
    };
    document.querySelector('.questions-wrapper').insertAdjacentHTML('afterbegin', inputs);
    lengthInputFormDeck();

    const removes = document.querySelectorAll('.remove-question');
    removes.forEach((el) => el.addEventListener('click', (e) => {
      e.target.parentNode.remove();
      lengthInputFormDeck();
    }));

    formDeckCreate = document.getElementById('form-deck-create');
    formDeckCreate.removeEventListener('submit', submitFormDeck);
    formDeckCreate.addEventListener('submit', submitFormDeck);
  });
}

// formDeckCreate.addEventListener('submit', function (e) {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('questions', formDeckCreate);
//   console.log(formData)

//   fetchUniversal('POST', '/editdack', formData)

// })
// function fooDeck() {
//   formDeckCreate.addEventListener('submit', submitFormDeck)
// }

const session = {
  roundID: '',
  cards: [],
  pointer: 0,
  cardHbs: '',
  rightHbs: '',
  wrongHbs: '',
  resultHbs: '',
};

const resetSession = () => {
  session.roundID = '';
  session.cards = [];
  session.pointer = 0;
};

const downloadHbs = async (key, fileName) => {
  if (!session[key]) {
    try {
      const hbsRes = await fetch(`/deck/${fileName}.hbs`);
      session[key] = await hbsRes.text();
    } catch (err) {
      console.log(err);
    }
  }
};
const render = (hbs, data) => {
  // eslint-disable-next-line no-undef
  const template = Handlebars.compile(hbs);

  return template(data);
};

// eslint-disable-next-line consistent-return
const fetchPOST = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

// Click start button

const decksContainer = document.querySelector('.container');

async function levelButton(fileName, deckID) {
  console.log(deckID);
  try {
    const hbsRes = await fetch(`/${fileName}.hbs`);
    const text = await hbsRes.text();
    return decksContainer.innerHTML = render(text, { deckID: deckID.id });
  } catch (err) {
    console.log(err);
  }
}

decksContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('startBtn')) {
    let deckID = event.target.parentElement.parentElement.id.slice(5);
    try {
      const response = await fetch(`/deck/${deckID}`);
      deckID = await response.json();
      if (deckID.message === 'Войдите или зарегистрируйтесь') {
        openModalForm('login', 'Войти', 'login');
      } else {
        levelButton('buttonOfLevel', deckID)
          .then(() => {
            choicePost();
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

const timerDisplay = document.querySelector('.timer');
const levelDisplay = document.querySelector('.sidebar-level');
const deckDisplay = document.querySelector('.sidebar-deck');

function choicePost() {
  levelChoice = document.querySelector('.level-choices');
  levelChoice.addEventListener('click', async (e) => {
    if (e.target.classList.contains('level-button')) {
      const data = {
        level: e.target.name,
        id: levelChoice.dataset.deckid,
      };

      await fetchPOST('/deck', data)
        .then(async (resData) => {
          session.roundID = resData.roundID;
          session.cards = [...resData.cards];

          await downloadHbs('cardHbs', 'card');
          decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });
        });

      // отображение уровня
      if (data.level === '1') {
        levelDisplay.innerText = 'Вы решаете легкий уровень';
      } else if (data.level === '2') {
        levelDisplay.innerText = 'Вы решаете средний уровень';
      } else if (data.level === '3') {
        levelDisplay.innerText = 'Вы решаете высокий уровень';
      }

      // создание и запуск таймера
      const timer = new Timer(1);
      timer.start(timerDisplay, decksContainer, session);
    }
  });
}

decksContainer.addEventListener('submit', async function (event) {
  event.preventDefault();

  const values = this.querySelectorAll('input');

  let answer = '';

  values.forEach((val) => {
    if (val.checked) {
      answer = val.value;
    }
  });

  if (event.target.classList.contains('card-form')) {
    const resData = await fetchPOST('/deck/check', {
      questID: session.cards[session.pointer],
      userAnswer: answer, // []
      roundID: session.roundID,
    });
  }

  console.log(session.cards);

  session.pointer += 1;
  if ((session.pointer < session.cards.length) && (timerDisplay.innerText !== '0:00')) {
    decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });
  } else {
    await downloadHbs('resultHbs', 'result');
    const result = await fetchPOST('/deck/finish', { roundID: session.roundID });
    result.numQuest = session.cards.length;
    console.log('&&&&', result.deck);
    decksContainer.innerHTML = render(session.resultHbs, { result, wordend: wordEnd(result.pointer) });
  }

  if (event.target.classList.contains('finish')) {
    resetSession();
    window.location.href = '/';
  }
});

function wordEnd(n) {
  // const w_d = ['', 'а', 'ов'];
  const wd = Math.abs(n) % 100;
  const wd1 = n % 10;
  if (wd > 10 && wd < 20) { return 'ов'; }
  if (wd1 > 1 && wd1 < 5) { return 'а'; }
  if (wd1 === 1) { return ''; }
  return 'ов';
}
