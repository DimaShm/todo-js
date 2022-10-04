const root = document.getElementById('todoapp');
const newTodoField = document.querySelector('.new-todo');
const list = document.querySelector('.todo-list');
const toogleBtn = document.getElementById('toogle');
const allBtn = document.getElementById('all');
const activeBtn = document.getElementById('active');
const completedBtn = document.getElementById('completed');
const clearBtn = document.getElementById('clearBtn');
const footer = document.querySelector('.container--footer');
let todos = [];

window.onload = () => {
  if (!localStorage.getItem('todo')) {
    return; 
  }
  todos = JSON.parse(localStorage.getItem('todo'));
  fillTodoList(todos);
  clearBtnVisibility();
  filterBtnsVisibility();
  footerVisibility();
  toogleBtnCheck();
  countItemLeft();
}

function fillTodoList(visibleTodos) {
  visibleTodos.forEach(todo => {
    const newItem = createTodo(todo.labelId, todo.value, todo.id, todo.checked);
    list.append(newItem);
  })
}

function createTodo (
  labelId = +new Date,
  value = newTodoField.value,
  todoId = +new Date * 2,
  todoChecked = false,
) {
  const newItem = document.createElement('li');
  newItem.id = todoId;
  newItem.innerHTML = `
    <div class="container">
      <input
        class="checkbox check-list" 
        type="checkbox" 
        id=${labelId}
      >
      <label class="todo-label" for=${labelId}>${value}</label>
      <button 
        class="delete-button"
        style="visibility: visible"
      >
        delete
      </button>
    </div>`

    if (todoChecked) {
      const checkbox = newItem.querySelector('.check-list');
      const label = newItem.querySelector('.todo-label');
      checkbox.checked = true;
      label.style = 'text-decoration: line-through;'
    }

  return newItem; 
}

newTodoField.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return;
  }
  if (newTodoField.value.trim() !== '') {
    addItem();
  }  
})

function addItem() {
  const newItem = createTodo();
  const label = newItem.querySelector('.todo-label');

  list.append(newItem);
  todos.push({
    id: newItem.id,
    value: label.textContent,
    labelId: label.htmlFor,
  });
  localStorage.setItem('todo', JSON.stringify(todos));
  newTodoField.value = '';
  footerVisibility();
  filterBtnsVisibility();
  countItemLeft();
  toogleBtnCheck()
}

function toogleBtnCheck() {
  const checkboxes = [...list.querySelectorAll('.check-list')];

  !checkboxes.length
    ? toogleBtn.style = 'visibility: hidden'
    : toogleBtn.style = 'visibility: visible';

  checkboxes.length && checkboxes.every(checkbox => checkbox.checked)
    ? toogleBtn.checked = true
    : toogleBtn.checked = false;
}

allBtn.addEventListener('click', () => {
  allBtn.disabled = true;
  activeBtn.disabled = false;
  completedBtn.disabled = false;
  filterTodo('all');
});

activeBtn.addEventListener('click', () => {
  activeBtn.disabled = true;
  allBtn.disabled = false;
  completedBtn.disabled = false;
  filterTodo('active');
});

completedBtn.addEventListener('click', () => {
  completedBtn.disabled = true;
  activeBtn.disabled = false;
  allBtn.disabled = false;
  filterTodo('completed');
});


function filterTodo(key) {
  const todoList = document.querySelectorAll('li');
  todoList.forEach(item => item.remove());
  switch (key) {
    case 'all':
      fillTodoList(todos);
    break;

    case 'active':
      fillTodoList([...todos].filter(todo => !todo.checked));
    break;

    case 'completed':
      fillTodoList([...todos].filter(todo => todo.checked));
    break;

    default:
      fillTodoList(todos);
  }

  clearBtnVisibility();
  footerVisibility();
  filterBtnsVisibility();
  toogleBtnCheck();
}

clearBtn.addEventListener('click', () => {
  let completedItems = list.querySelectorAll('.check-list:checked');
  completedItems.forEach(x => {
    const todoItem = x.closest('li');
    todoItem.remove();
    todos = todos.filter(item => item.id !== todoItem.id);
    localStorage.setItem('todo', JSON.stringify(todos));
  });  
  clearBtnVisibility();
  footerVisibility();
  filterBtnsVisibility();
  toogleBtnCheck();
});

function countItemLeft() {
  const count = root.querySelector('.todo-count');
  const notCompletedItems = list.querySelectorAll('.check-list:not(:checked)');
  count.innerHTML = notCompletedItems.length;
}

function onCheckItem(checkbox) {
  const labels = document.querySelectorAll('.todo-label');
  labels.forEach((label) => {
    if (label.htmlFor === checkbox.id) {
      checkbox.checked 
      ? label.style = 'text-decoration: line-through'
      : label.style = 'text-decoration: none';
    }
  });
}

list.addEventListener('click', (event) => {
  const element = event.target;
  const todoItem = element.closest('li');

  if (element.classList.contains('check-list')) {
    todos.forEach(todo => {
      if (todo.id === todoItem.id) {
        todo.checked = element.checked;
        } 
      })
   localStorage.setItem('todo', JSON.stringify(todos));
   onCheckItem(element);
  } 

  if (element.classList.contains('delete-button')) {
    todos = todos.filter(item => item.id !== todoItem.id);
    todoItem.remove();
    localStorage.setItem('todo', JSON.stringify(todos));
  }

  countItemLeft();
  footerVisibility();
  clearBtnVisibility();
  filterBtnsVisibility();
  toogleBtnCheck();
});

toogleBtn.addEventListener('change', (event) => {
  const element = event.target;
  const checkboxes = document.querySelectorAll('.check-list');
  const labels = document.querySelectorAll('.todo-label');

  if (element.checked) {
    checkboxes.forEach(checkbox => checkbox.checked = true);
    labels.forEach(label => label.style = 'text-decoration: line-through');
    todos.forEach(todo => todo.checked = true);
    clearBtn.style = 'visibility: visible';
  } 

  if (!element.checked) {
    checkboxes.forEach(checkbox => checkbox.checked = false);
    labels.forEach(label => label.style = 'text-decoration: none');
    todos.forEach(todo => todo.checked = false);
    clearBtn.style = 'visibility: hidden';
   }
  
  clearBtnVisibility();
  filterBtnsVisibility();
  countItemLeft();
  localStorage.setItem('todo', JSON.stringify(todos));
});

function clearBtnVisibility() {
  const completed = list.querySelectorAll('.check-list:checked');
  completed.length
    ? clearBtn.style = 'visibility: visible'
    : clearBtn.style = 'visibility: hidden';
}

function footerVisibility() {
  todos.length
    ? footer.style = 'visibility: visible'
    : footer.style = 'visibility: hidden';
}

function filterBtnsVisibility() {
  const activeTodos = todos.some(todo => !todo.checked);
  const completedTodos = todos.some(todo => todo.checked);
  activeBtn.style = 'visibility: hidden';
  completedBtn.style = 'visibility: hidden';
  allBtn.style = 'visibility: hidden';

  if (footer.style.visibility === 'hidden') {
    return;
  }

  if (activeTodos) {
    activeBtn.style = 'visibility: visible';
  }

  if (completedTodos) {
    completedBtn.style = 'visibility: visible';
  }

  if (completedTodos | activeTodos) {
    allBtn.style = 'visibility: visible';
  }
}

