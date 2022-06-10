const addBtn = document.querySelector('.js-add');
const noteField = document.querySelector('.js-note');
const descField = document.querySelector('.js-desc');

const list = document.querySelector('.js-list');

let smallDesc = '';

function uniqId() {
  let id = Math.random() * 10000;
  return ~~id;
}


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
    noteField.classList += ' error';
  } else {

    let tagId = checkUId();

    let isDescInclude = descField.value.trim().length;
    if (isDescInclude) {
      smallDesc = `<small class="js-note-desc" data-uid="desc-${tagId}"> ${descField.value} </small>`;
    }

    let newData = `
      <label class="js-item">
        <input type="checkbox" />
        <span class="js-note-name" data-uid="note-${tagId}">${noteField.value}</span> 
        ${smallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions">
          <button class="btn btn-del"><i class="far fa-trash-alt"></i></button>
        </div>
      </label>
    `;

    list.insertAdjacentHTML('afterbegin', newData);

    // Set to Local Storage
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

  if (~btnClassList.value.indexOf('btn-more')) {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'block';
  }

  if (~btnClassList.value.indexOf('btn-del') || ~e.target.parentElement.classList.value.indexOf('btn-del')) {
    e.target.closest('.js-item').remove();
  }

})

