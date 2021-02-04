const navUser = document.getElementById('nav-user');
const modal = document.getElementById('modal-form');
const modalContent = document.querySelector('.modal-content');
const creatDeck = document.querySelector('.creat-deck');
const addInputDeck = document.querySelector('.add-input-deck') || null;
let formDeckCreate = document.getElementById('form-deck-create');
const creteDeckSubmit = document.querySelector('.submit-deck');
let levelChoice = document.querySelector('.level-choices') || null;
let authForm = document.querySelector('.modal-content');
const topWindow = document.querySelector('.top-window') || null


if (topWindow) {
  document.addEventListener('scroll', (e) => {

    topWindow.style.opacity = 1 - (window.scrollY / 120)

  })
}




function openModalForm(type = null, title = null, name = null, message = null) {
  modalContent.innerHTML = '';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('open');
  }, 100);

  const form = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/auth/${type}" class="input-field form-auth col s12">
      <div class="input-field col s12">
        <i class="material-icons prefix">person_outline</i>
        <input name="login" type="text"  class="autocomplete">
      </div>
      <div class="input-field col s12">
        <i class="material-icons prefix">https</i>
        <input name="password" type="password" class="autocomplete pass-auth">
        <a class="password-control">Показать пароль</a>
      </div>

      <button type="submit" class="waves-effect answerBtn form-button">${title}</button>
        
    </form>
  `;

  // Auth modal window
  modalContent.insertAdjacentHTML('beforeend', form);
  formFromRegister = document.forms.register;

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation()
    const data = await fetchUniversal('POST', event.target.action, {
      login: event.target.login.value,
    });
    console.log(data);
    if (data.message !== 'OK') {
      event.target.insertAdjacentHTML(
        'beforeend',
        `<p style="color:red">${data.message}</p>`
      );

    } else {
      modal.style.display = 'none';
      location.href = '/'
    }
  });

  document.querySelector('.password-control').addEventListener('click', () => {
    const pass = document.querySelector('.pass-auth');
    if (pass.getAttribute('type') === 'password') {
      pass.setAttribute('type', 'text')
    } else {
      pass.setAttribute('type', 'password')
    }

  })

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

const submitFormDeck = (e) => {
  e.preventDefault();
  let questions = []


  const colection = new Map()
  let dataArr = Array.from(document.querySelectorAll(`.data`), e => e.value)

  for (let i = 1; i < dataArr.length; i++) {
    let dataObj = {}
    if (i % 2 === 0) {
      dataObj.q = dataArr[i - 1]
      dataObj.a = dataArr[i]
      questions.push(dataObj)
    }
  }



  const data = {
    id: formDeckCreate.id.value,
    title: formDeckCreate.title.value,
    dataArr: questions
  }

  fetchUniversal('POST', '/editdack', data)
  formDeckCreate.reset();
  location.href = '/';
}

async function fetchUniversal(method, path, data) {
  console.log(path);
  let response = {};
  try {
    response = await fetch(path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json();
    if (response.status === 500) alert(`Ошибка сервера , ${resData.message}`);
    return result
  } catch (err) { console.log(`This is your mistake ${err.message}`); }
}



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
      `
    const lengthInputFormDeck = () => {
      let lengthInputsForm = document.querySelectorAll('.inputs-form-deck').length;
      if (lengthInputsForm >= 4) {
        creteDeckSubmit.classList.remove('disabled');
      } else {
        creteDeckSubmit.classList.add('disabled');
      }

    }
    document.querySelector('.questions-wrapper').insertAdjacentHTML('afterbegin', inputs);
    lengthInputFormDeck()

    let removes = document.querySelectorAll('.remove-question');
    removes.forEach(el => el.addEventListener('click', (e) => {
      e.target.parentNode.remove();
      lengthInputFormDeck()
    }))

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
  resultHbs: ''
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
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

// Click start button 

const decksContainer = document.querySelector('.container');

async function levelButton(fileName, deckID) {
  console.log(deckID)
  try {
    const hbsRes = await fetch(`/${fileName}.hbs`);
    const text = await hbsRes.text();
    return decksContainer.innerHTML = render(text, { deckID: deckID.id })

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

      levelButton('buttonOfLevel', deckID)
        .then(() => {
          choicePost()
        })

    } catch (err) {
      console.log(err);
    }
  }
})


function choicePost() {

  levelChoice = document.querySelector('.level-choices');
  levelChoice.addEventListener('click', async (e) => {
    if (e.target.classList.contains('level-button')) {

      const data = {
        level: e.target.name,
        id: levelChoice.dataset.deckid
      }

      await fetchPOST('/deck', data)
        .then(async (resData) => {
          session.roundID = resData.roundID;
          session.cards = [...resData.cards];

          await downloadHbs('cardHbs', 'card');
          decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });


        })

      // создание и запуск таймера
      const timerDisplay = document.querySelector('div.timer');
      const timer = new Timer(3); // .on = true;
      console.log(timer);
      timer.start(timerDisplay); // .on = true;
    }
  })
}


decksContainer.addEventListener('submit', async function (event) {
  event.preventDefault();

  const values = this.querySelectorAll('input')

  let answer = ''

  values.forEach(val => {
    if (val.checked) {
      answer = val.value
      console.log(val.value)
    }
  })



  if (event.target.classList.contains('card-form')) {


    const resData = await fetchPOST('/deck/check', {
      questID: session.cards[session.pointer],
      userAnswer: answer, // []
      roundID: session.roundID,
    });
  }

  console.log(session.cards)



  session.pointer += 1;
  if (session.pointer < session.cards.length) {
    decksContainer.innerHTML = render(session.cardHbs, { card: session.cards[session.pointer] });
  } else {
    await downloadHbs('resultHbs', 'result');
    const result = await fetchPOST('/deck/finish', { roundID: session.roundID })
    result.numQuest = session.cards.length;
    decksContainer.innerHTML = render(session.resultHbs, { result });
  }

  if (event.target.classList.contains('finish')) {
    resetSession();
    window.location.href = '/';
  }
})
