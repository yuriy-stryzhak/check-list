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
      <label>
        <input type="checkbox" />
        <span class="js-note-name">${noteField.value}</span> 
        ${smallDesc}
        <button class="btn-more">...</button>
        <!-- <i class="far fa-trash-alt"></i> -->
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
