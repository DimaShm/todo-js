const root = document.getElementById('todoapp');
const newTodoField = document.querySelector('.new-todo');
const list = document.querySelector('.todo-list');
const allCheck = document.querySelector('.check-all');
const clearCheckList = document.querySelector('.todo-clear');

newTodoField.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return;
  }
  if (newTodoField.value.trim() !== '') {
    addLItem();
  }  
})

const addLItem = () => {
  const inputId = +new Date;

  list.insertAdjacentHTML ('beforeend', `
    <li class="todo-item">
      <div class="container">
        <input class="checkbox check-list" type="checkbox" id=${inputId}>
        <label class="todo-label" for=${inputId}>${newTodoField.value}</label>
        <button class="todo-delete">delete</button>
      </div>
    </li>
  `);

  newTodoField.value = '';
  countNotCheckedItem();
}


const visibleClearCompleted = (x) => {
  x === 0 
  ? clearCheckList.style = 'visibility: hidden'
  : clearCheckList.style = 'visibility: visible';
}

const addCheckOnAllCheck = () => {
  const yesCheckedItem = [...list.querySelectorAll('.check-list')];
  if (yesCheckedItem.every(x => x.checked) && yesCheckedItem.length > 0) {
    allCheck.checked = true;
  } else {
    allCheck.checked = false;
  }
}

clearCheckList.addEventListener('click', () => {
  let completed = list.querySelectorAll('.check-list:checked');
  console.log(completed.length);
  completed.forEach(x => x.checked === true ? x.closest('li').remove() : x);
  completed = list.querySelectorAll('.check-list:checked');
  visibleClearCompleted(completed.length);
  addCheckOnAllCheck();
})


const countNotCheckedItem = () => {
  const count = root.querySelector('.todo-count');
  const notCheckedItem = list.querySelectorAll('.check-list:not(:checked)');
  count.innerHTML = notCheckedItem.length;
  addCheckOnAllCheck();
}

list.addEventListener('click', (event) => {
  const element = event.target;

  if (!element.classList.contains('todo-delete')) {
    return;
  }

  element.closest('.todo-item').remove();
  countNotCheckedItem();
})


list.addEventListener('click', (event) => {
  const completed = list.querySelectorAll('.check-list:checked');
  const element = event.target;
  if (!element.classList.contains('check-list')) {
    return;
  }
  const labels = document.querySelectorAll('.todo-label');
  labels.forEach((x) => {
    if (x.htmlFor === element.id) {
      element.checked 
      ? x.style = 'text-decoration: line-through;'
      : x.style = 'text-decoration: none;'
    }
  });
  countNotCheckedItem();
  visibleClearCompleted(completed.length);
})

allCheck.addEventListener('change', (event) => {
  const element = event.target;
  const checks = document.querySelectorAll('.check-list');
  const labels = document.querySelectorAll('.todo-label');
   if (element.checked) {
    checks.forEach(x => x.checked = true);
    labels.forEach(x => x.style = 'text-decoration: line-through;');
    clearCheckList.style = 'visibility: visible';  
   } else {
    checks.forEach(x => x.checked = false);
    labels.forEach(x => x.style = 'text-decoration: none;')
    clearCheckList.style = 'visibility: hidden';
   }

  let completed = list.querySelectorAll('.check-list:checked');
  visibleClearCompleted(completed.length);
  countNotCheckedItem();
})


