const addBtn = document.querySelector('.js-add');
const noteField = document.querySelector('.js-note');
const descField = document.querySelector('.js-desc');

const list = document.querySelector('.js-list');

let smallDesc = '';

addBtn.addEventListener('click', function () {

  if (!noteField.value.trim().length) {
    noteField.value = '';
    noteField.placeholder = 'This field must be filled';
    noteField.classList += ' error';
  } else {

    if (descField.value.trim().length) {
      smallDesc = `<small class="js-note-desc"> ${descField.value} </small>`;
    }

    let newData = `
      <label class="js-item">
        <input type="checkbox" />
        <span class="js-note-name">${noteField.value}</span> 
        ${smallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions">
          <button class="btn btn-del"><i class="far fa-trash-alt"></i></button>
        </div>
      </label>
    `;

    list.insertAdjacentHTML('afterbegin', newData);

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

