if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}

// get permission to run notifications
let noticePermission;
Notification.requestPermission().then(function (result) {
  noticePermission = result;
});

const noticeBox = document.querySelector('.js-notice-box');
const noticeClose = document.querySelector('.js-notice-close');
const noticeSet = document.querySelector('.js-btn-notice-time');
const noticeDate = document.querySelector('.js-notice-date');
const noticeTime = document.querySelector('.js-notice-time');

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
  window.navigator.vibrate(50);
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
    window.navigator.vibrate([50, 100, 50]);
    noteField.value = '';
    noteField.placeholder = 'This field must be filled';
    noteField.classList.add('error');
  } else {

    window.navigator.vibrate(50);

    let tagId = checkUId();

    let isDescInclude = descField.value.trim().length;
    if (isDescInclude) {
      smallDesc = `<small class="js-note-desc" data-uid="desc-${tagId}">${descField.value}</small>`;
    }

    let newData = `
      <label class="js-item">
        <input class="js-check" type="checkbox" data-uid="check-${tagId}" />
        <span class="js-note-name" data-uid="note-${tagId}">${noteField.value}</span> 
        ${smallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions js-item_controls">
          <button class="btn btn-notice js-btn-notice">Notice</button>
          <button class="btn btn-edit js-btn-edit">Edit</button>
          <button class="btn btn-del js-btn-del">Del</button>
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
  if (btnClassList.contains('js-btn-del')) {
    e.target.closest('.js-item').remove();
    window.navigator.vibrate(50);

    //remove from local storage
    let dataNote = e.target.closest('.js-item').querySelector('.js-note-name').dataset.uid;
    let dataCheck = e.target.closest('.js-item').querySelector('.js-check').dataset.uid;
    let dataDesc = e.target.closest('.js-item').querySelector('.js-note-desc');
    let dataNotice = e.target.closest('.js-item').querySelector('.notice-time');
    let dataToRemove = [dataNote, dataCheck];

    if (dataDesc !== null) {
      dataDesc = dataDesc.dataset.uid;
      dataToRemove.push(dataDesc);
    }

    if (dataNotice !== null) {
      dataNotice = dataNotice.dataset.uid;
      dataToRemove.push(dataNotice);
      location.reload();
    }

    dataToRemove.forEach(k => localStorage.removeItem(k));

  }

  //edit item
  if (btnClassList.contains('js-btn-edit')) {

    let editNote = e.target.closest('.js-item').querySelector('.js-note-name').textContent;
    let editDesc = e.target.closest('.js-item').querySelector('.js-note-desc');
    if (editDesc != null) editDesc = editDesc.textContent;

    noteField.value = editNote;
    if (editDesc) descField.value = editDesc;

    e.target.closest('.js-item').querySelector('.js-btn-del').click();
    if (!showFormBtn.classList.contains('show')) {
      showFormBtn.click();
    }
  }

  //Notice
  if (btnClassList.contains('js-btn-notice')) {

    //Set default data and time to input
    noticeDate.value = new Date().toISOString().substring(0, 10);

    let noticeMakeClock = '' + new Date().getMinutes();
    if (noticeMakeClock.length < 2) noticeMakeClock = '0' + noticeMakeClock;

    noticeTime.value = `${new Date().getHours() + 1}:${noticeMakeClock}`;

    let noticeNote = e.target.closest('.js-item').querySelector('.js-note-name').dataset.uid;
    noticeBox.classList.add('show');
    noticeSet.dataset.notice = noticeNote;

  }

})

noticeBox.addEventListener('click', function (e) {
  if (!e.target.closest('.notice')) {
    noticeBox.classList.remove('show');
  }
})

noticeClose.addEventListener('click', function (e) {
  noticeBox.classList.remove('show');
})

let noticeSetTime;

noticeSet.addEventListener('click', function (e) {

  let time = noticeDate.value + ' ' + noticeTime.value;
  noticeSetTime = Date.parse(time);
  if (time.trim().length > 1) {
    let noticeTimeAlreadySet = document.querySelector('[data-uid="' + e.target.dataset.notice + '"]').closest('.js-item').querySelector('.notice-time');
    if (noticeTimeAlreadySet) noticeTimeAlreadySet.remove();

    let timeToOutput = dateFormat(noticeDate.value, 'dd-MM-yy') + ', ' + noticeTime.value;
    let elem = document.createElement('div');
    elem.className += 'notice-time';
    elem.textContent = timeToOutput;
    elem.dataset.uid = 'notice-' + parseInt(e.target.dataset.notice.match(/\d+/));
    document.querySelector('[data-uid="' + e.target.dataset.notice + '"]').closest('.js-item').insertAdjacentElement('beforeend', elem);
    noticeClose.click();

    //Set notice time to Storage 
    let currentUId = parseInt(e.target.dataset.notice.match(/\d+/));
    localStorage.setItem(`notice-${currentUId}`, time);

    location.reload();

  }
})




/**
 * Get from Local Storage
 */

let noticeArr = [];

let itemsArr = [];
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  itemsArr.push(parseInt(key.match(/\d+/)));
}
let uniqItem = new Set(itemsArr);

for (const iterator of uniqItem) {
  let storageSmallDesc = '',
    storageNoticeHtml = '';
  let storageDesc = localStorage.getItem('desc-' + iterator);
  let storageNote = localStorage.getItem('note-' + iterator);
  let storageCheck = localStorage.getItem('check-' + iterator);
  let storageNotice = localStorage.getItem('notice-' + iterator);



  if (storageDesc !== null) {
    storageSmallDesc = `<small class="js-note-desc" data-uid="desc-${iterator}">${storageDesc}</small>`;
  }


  let noticeObj = {};
  if (storageNotice !== null) {
    noticeObj[Date.parse(storageNotice)] = storageNote;
    noticeObj['notice'] = `notice-${iterator}`;
    noticeArr.push(noticeObj);
    //change date format
    let dateSplit = storageNotice.split(' ');
    storageNotice = dateFormat(dateSplit[0], 'dd-MM-yy') + ', ' + dateSplit[1];

    storageNoticeHtml = `<div class="notice-time" data-uid="notice-${iterator}">${storageNotice}</div>`;
  }

  let storageData = `
      <label class="js-item">
        <input class="js-check" type="checkbox" data-uid="check-${iterator}" />
        <span class="js-note-name" data-uid="note-${iterator}">${storageNote}</span> 
        ${storageSmallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions js-item_controls">
          <button class="btn btn-notice js-btn-notice">Notice</button>
          <button class="btn btn-edit js-btn-edit">Edit</button>
          <button class="btn btn-del js-btn-del">Del</button>
        </div>
        ${storageNoticeHtml}
      </label>
    `;

  list.insertAdjacentHTML('afterbegin', storageData);

  if (storageCheck == 'true') {
    document.querySelector('.js-check').checked = true;
  }
}

let noticeInterval = setInterval(() => {
  let currentTime = Date.parse(new Date());
  for (let i = 0; i < noticeArr.length; i++) {
    const element = noticeArr[i];
    for (let el in element) {
      if (el == currentTime) showNotification(element[el]);
      if (el < currentTime) {
        document.querySelector(`[data-uid="${element['notice']}"`).classList.add('closed')
      }
    }
  }
}, 1000);


//Store checked element
list.addEventListener('change', function (e) {
  let checkIndex = e.target.dataset.uid;

  if (e.target.checked) {
    window.navigator.vibrate(50);
    localStorage.setItem(checkIndex, true);
  } else {
    localStorage.setItem(checkIndex, false);
  }
})


function showNotification(noteName) {
  var d = new Date();
  if (noticePermission === 'granted') {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.showNotification('TodoIt', {
        body: noteName,
        icon: 'contract.png',
        // badge: '<URL String>', // icon for Mobile
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: 'vibration-sample',
        timestamp: Date.parse(d),
      });
    });
  }
}



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

//date formatting function
function dateFormat(inputDate, format) {
  //parse the input date
  const date = new Date(inputDate);

  //extract the parts of the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //replace the month
  format = format.replace("MM", month.toString().padStart(2, "0"));

  //replace the year
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  }

  //replace the day
  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
}
