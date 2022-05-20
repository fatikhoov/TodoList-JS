const inputTask = document.getElementById('sendTask')
const btnCreate = document.getElementById('btnAddTask')
const wrapper = document.querySelector('.itemsTask')

let tasks
let todoitemElems = []

//проверкахранилища на содержимое
!localStorage.tasks
  ? (tasks = [])
  : (tasks = JSON.parse(localStorage.getItem('tasks')))

//конструктор массива
function Task(info) {
  this.title = info
  this.completed = false
}

//создание шаблона задач
const addItems = (tasks, index) => {
  return `
  <div class="itemTaskWrapper col s12 ${tasks.completed ? 'checked' : ''}">
  <div class="title"> 
  <span class="titleText">${index + 1}</span>
  <label for="checkboxItems${index}"><input type="checkbox" id="checkboxItems${index}" ${
    tasks.completed ? 'checked' : ''
  } onclick="completedTask(${index})"/><span class="titleText">${
    tasks.title
  }</span>
   </label> 
    </div>
<div class="btnItems">
  <button class="btn" id="btnRemove" onclick="removeTask(${index})">Удалить</button>
  </div></div>`
}

//фильтр задач по активным и выполненным
const filterTasks = () => {
  const activeTasks =
    tasks.length && tasks.filter((items) => items.completed == false)
  const complTasks =
    tasks.length && tasks.filter((items) => items.completed == true)
  tasks = [...activeTasks, ...complTasks]
}

//запись задач в html
const writeWrapper = () => {
  wrapper.innerHTML = ''
  if (tasks.length > 0) {
    filterTasks()
    tasks.forEach((item, index) => {
      wrapper.innerHTML += addItems(item, index)
    })
  }
  todoitemElems = document.querySelectorAll('.itemTaskWrapper')
}
writeWrapper()

//запись в хранилище
const addStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
const updateApp = () => {
  addStorage()
  writeWrapper()
}
//прослушиватель клика
btnCreate.addEventListener('click', () => {
  tasks.push(new Task(inputTask.value))
  updateApp()
  inputTask.value = ''
})

//задача выполнена-не выполнена
const completedTask = (index) => {
  if (!tasks[index].completed) {
    tasks[index].completed = true
    todoitemElems[index].classList.remove('checked')
  } else {
    tasks[index].completed = false
    todoitemElems[index].classList.add('checked')
  }
  updateApp()
}

//удаление
const removeTask = (index) => {
  todoitemElems[index].classList.add('removeTask')
  setTimeout(() => {
    tasks.splice(index, 1)
    updateApp()
  }, 500)
}
