const addBtn = document.querySelector('.js-add');
const noteField = document.querySelector('.js-note');
const descField = document.querySelector('.js-desc');

const list = document.querySelector('.js-list');


addBtn.addEventListener('click', function () {

  let newData = `
    <label>
      <input type="checkbox" /><span class="js-note-name">${noteField.value}</span> <small class="js-note-desc"> ${descField.value} </small>
      <button class="btn-more">...</button>
      <!-- <i class="far fa-trash-alt"></i> -->
    </label>
  `;

  list.innerHTML += newData;

})
