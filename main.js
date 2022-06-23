if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}

const showFormBtn = document.querySelector('.js-show_form');

const addBtn = document.querySelector('.js-add');
const noteField = document.querySelector('.js-note');
const descField = document.querySelector('.js-desc');

const list = document.querySelector('.js-list');

let smallDesc = '';

function uniqId() {
  let id = Math.random() * 10000;
  return ~~id;
}

const body = document.querySelector('body');

body.addEventListener('click', function (e) {

  if (!e.target.classList.contains('btn')) {

    let moreBtn = document.querySelectorAll('.js-more');
    let blockControls = document.querySelectorAll('.js-item_controls');

    moreBtn.forEach(function (elem) {
      elem.classList.remove('hide');
    })

    blockControls.forEach(function (elem) {
      elem.classList.remove('active');
    })

  }
})

/**
 * show additionat form
 */

function toggle(el) {

  if (!el.classList.contains('show')) {
    setTimeout(() => {
      el.classList.add('show');
      showFormBtn.classList.add('show');
    });
    el.style.display = 'flex';
  }
  else {
    el.classList.remove('show');
    showFormBtn.classList.remove('show');
    setTimeout(() => {
      noteField.placeholder = 'Add your note...';
      noteField.classList.remove('error');
      el.style.display = 'none';
    }, 100);
  }
}

showFormBtn.addEventListener('click', function () {
  window.navigator.vibrate(200);
  let setBlock = document.querySelector('.set');

  toggle(setBlock);
});


addBtn.addEventListener('click', function () {

  function checkUId() {
    let noteName = document.getElementsByClassName('js-note-name');

    let id = uniqId();
    let ifNotUniq = [];

    for (let i = 0; i < noteName.length; i += 1) {

      if (`note-${id}` === noteName[i].dataset.uid) {
        ifNotUniq.push('true');
      }
    }

    if (ifNotUniq.includes('true')) {
      checkUId();
    } else {
      return id;
    }
  }

  if (!noteField.value.trim().length) {
    noteField.value = '';
    noteField.placeholder = 'This field must be filled';
    noteField.classList.add('error');
  } else {

    let tagId = checkUId();

    let isDescInclude = descField.value.trim().length;
    if (isDescInclude) {
      smallDesc = `<small class="js-note-desc" data-uid="desc-${tagId}"> ${descField.value} </small>`;
    }

    let newData = `
      <label class="js-item">
        <input class="js-check" type="checkbox" data-uid="check-${tagId}" />
        <span class="js-note-name" data-uid="note-${tagId}">${noteField.value}</span> 
        ${smallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions js-item_controls">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-del">Del</button>
        </div>
      </label>
    `;

    list.insertAdjacentHTML('afterbegin', newData);

    // Set to Local Storage
    localStorage.setItem(`check-${tagId}`, false)
    localStorage.setItem(`note-${tagId}`, noteField.value);
    if (isDescInclude) localStorage.setItem(`desc-${tagId}`, descField.value);

    noteField.value = '';
    descField.value = '';
    smallDesc = '';

  }
})

noteField.addEventListener('focus', function () {
  this.classList.remove('error');
})

noteField.addEventListener('blur', function () {
  this.placeholder = 'Add your note...';
})

list.addEventListener('click', function (e) {
  let btnClassList = e.target.classList;

  if (btnClassList.contains('js-more')) {
    e.target.classList.add('hide');
    e.target.nextElementSibling.classList.add('active');
  }

  //remove item
  if (btnClassList.contains('btn-del')) {
    e.target.closest('.js-item').remove();

    //remove from local storage
    let dataNote = e.target.closest('.js-item').querySelector('.js-note-name').dataset.uid;
    let dataCheck = e.target.closest('.js-item').querySelector('.js-check').dataset.uid;
    let dataDesc = e.target.closest('.js-item').querySelector('.js-note-desc');
    let dataToRemove = [dataNote, dataCheck];

    if (dataDesc !== null) {
      dataDesc = dataDesc.dataset.uid;
      dataToRemove.push(dataDesc);
    }

    dataToRemove.forEach(k => localStorage.removeItem(k));

  }

})

/**
 * Get from Local Storage
 */

let itemsArr = [];
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  itemsArr.push(parseInt(key.match(/\d+/)));
}
let uniqItem = new Set(itemsArr);

for (const iterator of uniqItem) {
  let storageSmallDesc = '';
  let storageDesc = localStorage.getItem('desc-' + iterator);
  let storageCheck = localStorage.getItem('check-' + iterator);

  if (storageDesc !== null) {
    storageSmallDesc = `<small class="js-note-desc" data-uid="desc-${iterator}"> ${storageDesc} </small>`;
  }

  let storageData = `
      <label class="js-item">
        <input class="js-check" type="checkbox" data-uid="check-${iterator}" />
        <span class="js-note-name" data-uid="note-${iterator}">${localStorage.getItem('note-' + iterator)}</span> 
        ${storageSmallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions js-item_controls">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-del">Del</button>
        </div>
      </label>
    `;

  list.insertAdjacentHTML('afterbegin', storageData);

  if (storageCheck == 'true') {
    document.querySelector('.js-check').checked = true;
  }
}

//Store checked element
list.addEventListener('change', function (e) {
  let checkIndex = e.target.dataset.uid;

  if (e.target.checked) {
    localStorage.setItem(checkIndex, true);
  } else {
    localStorage.setItem(checkIndex, false);
  }
})






// Code to handle install prompt on desktop

let deferredPrompt;
const installBtn = document.querySelector('.install-button');
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    installBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
