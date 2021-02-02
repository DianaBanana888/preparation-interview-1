/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const navUser = document.getElementById('nav-user');
const modal = document.getElementById('modal-form');
const modalContent = document.querySelector('.modal-content');
// const creatDeck = document.querySelector('.creat-deck');
const addInputDeck = document.querySelector('.add-input-deck') || null;
let formDeckCreate = document.getElementById('form-deck-create');
const creteDeckSubmit = document.querySelector('.submit-deck');
const authForm = document.querySelector('.modal-content');

async function fetchUniversal(method, path, data) {
  console.log(path);
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
    if (response.status === 500) alert(`Ошибка сервера , ${resData.message}`);
    return result;
  } catch (err) { console.log(`This is your mistake ${err.message}`); }
}

function openModalForm(type = null, title = null, name = null) {
  modalContent.innerHTML = '';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('open');
  }, 100);

  const form = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/auth/${type}" class="input-field col s12">
      <div class="input-field col s12">
        <i class="material-icons prefix">person_outline</i>
        <input name="login" type="text"  class="autocomplete">
      </div>
      <div class="input-field col s12">
        <i class="material-icons prefix">https</i>
        <input name="password" type="password" class="autocomplete pass-auth">
        <a class="password-control">Показать пароль</a>
      </div>

      <button type="submit" class="waves-effect waves-teal btn-flat form-button">${title}</button>
        
    </form>
  `;

  modalContent.insertAdjacentHTML('beforeend', form);
  formFromRegister = document.forms.register;

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const data = await fetchUniversal('POST', event.target.action, {
      login: event.target.login.value,
    });
    console.log(data);
    if (data.message !== 'OK') {
      event.target.insertAdjacentHTML(
        'beforeend',
        `<p style="color:red">${data.message}</p>`,
      );
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

// creatDeck.addEventListener('click', async (e) => {
//   e.preventDefault();
//   await fetchUniversal('GET', '');
// });

const submitFormDeck = async (e) => {
  e.preventDefault();
  const questions = [];

  // const colection = new Map();
  const dataArr = Array.from(document.querySelectorAll('.data'), (event) => event.value);

  for (let i = 1; i < dataArr.length; i += 1) {
    const dataObj = {};
    if (i % 2 === 0) {
      dataObj.q = dataArr[i - 1];
      dataObj.a = dataArr[i];
      questions.push(dataObj);
    }
  }

  console.log(questions);

  const data = {
    id: formDeckCreate.id.value,
    title: formDeckCreate.title.value,
    dataArr: questions,
  };

  await fetchUniversal('POST', '/editdack', data);
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
  const template = Handlebars.compile(hbs);
  return template(data);
};

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

const decksContainer = document.querySelector('.container');
decksContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('startBtn')) {
    const deckID = event.target.parentElement.parentElement.id.slice(5);
    try {
      const response = await fetch(`/deck/${deckID}`);
      const resData = await response.json();
      session.roundID = resData.roundID;
      session.cards = [...resData.cards];
    } catch (err) {
      console.log(err);
    }

    await downloadHbs('cardHbs', 'card');
    decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });
  }
});

decksContainer.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (event.target.classList.contains('card-form')) {
    const resData = await fetchPOST('/deck/check', {
      questID: session.cards[session.pointer],
      userAnswer: event.target.userAnswer.value,
      roundID: session.roundID,
    });

    if (resData) {
      await downloadHbs('rightHbs', 'right');
      decksContainer.innerHTML = render(session.rightHbs, {
        card: session.cards[session.pointer],
        userAnswer: event.target.userAnswer.value,
      });
    } else {
      await downloadHbs('wrongHbs', 'wrong');
      decksContainer.innerHTML = render(session.wrongHbs, {
        card: session.cards[session.pointer],
        userAnswer: event.target.userAnswer.value,
      });
    }
  }

  if (event.target.classList.contains('next')) {
    session.pointer += 1;
    if (session.pointer < session.cards.length) {
      decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });
    } else {
      await downloadHbs('resultHbs', 'result');
      const result = await fetchPOST('/deck/finish', { roundID: session.roundID });
      result.numQuest = session.cards.length;
      decksContainer.innerHTML = render(session.resultHbs, { result });
    }
  }

  if (event.target.classList.contains('again')) {
    decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });
  }

  if (event.target.classList.contains('finish')) {
    resetSession();
    window.location.href = '/';
  }
});