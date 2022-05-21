const inputTask = document.getElementById('sendTask')
const btnCreate = document.getElementById('btnAddTask')
const btnShow = document.getElementById('btnShow')
const wrapper = document.querySelector('.itemsTask')
const serveTask = document.querySelector('.serveTask')

let tasks
let show = true
let cont = []
let todoitemElems = []

//прослушиватель клика добавить задачу
btnCreate.addEventListener('click', () => {
  tasks.push(new Task(inputTask.value))
  updateApp()
  inputTask.value = ''
})
//прослушиватель клика загрузить задачи с сервера
btnShow.addEventListener('click', () => {
  if (!show) {
    serveTask.classList.add('show')
    show = true
  } else {
    setTimeout(() => {
      resp()
    }, 1000)
    serveTask.classList.remove('show')
    show = false
  }
})

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

//запись в хранилище
const addStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
const updateApp = () => {
  addStorage()
  writeWrapper()
}

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

//удаление своих задач
const removeTask = (index) => {
  todoitemElems[index].classList.add('removeTask')
  setTimeout(() => {
    tasks.splice(index, 1)
    updateApp()
  }, 500)
}

//конструктор html задач сервера
const contHtml = (item, cont) => {
  let id = cont[item].id
  return `
<div class="card"> 
<div class="itemTaskWrapper col s12 ${cont[item].completed ? 'checked' : ''}">
<div class="title"> 
<span class="titleText">${id}</span>
 <span class="titleText">${cont[item].title} </span>  
  </div><span class="titleText orange">${
    !cont[item].completed ? 'задача не решена' : 'задача решена'
  } </span> 
<div class="btnItems">
<button class="btn" id="btnRemove" onclick="serveRemoveTask(${item})">Удалить</button>
</div></div>
`
}

//вызов задач с сервера
async function fetchServe() {
  const x = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
  const cont = await x.json()
  return cont
}

//фильтр задач по активным и выполненным
const filterServe = (cont) => {
  const activeT =
    cont.length && cont.filter((items) => items.completed == false)
  const complT = cont.length && cont.filter((items) => items.completed == true)
  cont = [...activeT, ...complT]
  return cont
}

//создаем макет
async function innerHtmlTasks(cont) {
  for (const item in cont) {
    serveTask.innerHTML += contHtml(item, cont)
  }
  cardElems = document.querySelectorAll('.card')
}

//общая функция вызова и сборки задач с сервера
async function resp() {
  cont = await fetchServe()
  cont = await filterServe(cont)
  serveTask.innerHTML = ''
  await innerHtmlTasks(cont)
}

//удаление
function serveRemoveTask(item) {
  cardElems[item].classList.add('removeTask')
  setTimeout(() => {
    cont.splice(item, 1)
    serveTask.innerHTML = ''
    innerHtmlTasks(cont)
  }, 500)
}

writeWrapper()
