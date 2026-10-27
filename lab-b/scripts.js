class Todo {
  constructor() {
    this.tasks = [];
    this.loadTasks();
    this.taskId = Math.max(-1, ...this.tasks.map(task => task.id)) + 1;
    this.term = "";
  }
  draw() {
    const toDoList = document.getElementById("todo-list");
    toDoList.innerHTML = "";
    for(const task of this.getFilteredTasks()){
      const newDiv = document.createElement("div");
      newDiv.className = "task";
      const taskName = document.createElement("span");
      if (this.term.length >= 2) {
        const name = task.name;
        const searchText = this.term.toLowerCase();
        const lowerName = name.toLowerCase();
        let start = 0;
        let index = lowerName.indexOf(searchText, start);
        while (index !== -1) {
          taskName.appendChild(document.createTextNode(name.slice(start, index)));
          const mark = document.createElement("mark");
          mark.textContent = name.slice(index, index + searchText.length);
          taskName.appendChild(mark);
          start = index + searchText.length;
          index = lowerName.indexOf(searchText, start);
        }
        taskName.appendChild(document.createTextNode(name.slice(start)));
      } else {
        taskName.textContent = task.name;
      }
      const taskDate = document.createElement("span");
      taskDate.textContent = task.date ? task.date : "";
      const button = document.createElement("button");
      button.textContent = "Usuń";
      button.addEventListener("click", () =>{
        this.removeTask(task.id);
      })
      newDiv.appendChild(taskName);
      newDiv.appendChild(taskDate);
      newDiv.appendChild(button);
      toDoList.appendChild(newDiv);
      newDiv.addEventListener("click", () => {
        if (newDiv.querySelector("input")) {
          return;
        }
        const taskNameInput = document.createElement("input");
        taskNameInput.type = "text";
        taskNameInput.value = task.name;
        taskNameInput.minLength = 3;
        taskNameInput.maxLength = 255;
        taskNameInput.required = true;
        const taskDateInput = document.createElement("input");
        taskDateInput.type = "date";
        taskDateInput.value = task.date;
        newDiv.replaceChild(taskNameInput, taskName);
        newDiv.replaceChild(taskDateInput, taskDate);
        newDiv.addEventListener("focusout", (event) => {
          if (newDiv.contains(event.relatedTarget)) {
            return;
          }
          this.editTask(task.id, taskNameInput.value, taskDateInput.value);
        });
        taskNameInput.focus();
      });
    }
  }
  addTask(name, date){
    name = name.trim();
    if(name.length < 3 || name.length > 255){
      alert("Nazwa zadania musi byc dłuższa niż 3 litery i krótsza niż 255")
      return false;
    }
    if(date){
      const now = new Date();
      const taskDate = new Date(date);
      if(taskDate<now){
        alert("Data zadania musi byc w przyszłości lub pusta")
        return false;
      }
    }
    const newTask = {id: this.taskId++, name:name, date: date};
    this.tasks.push(newTask);
    this.saveTasks();
    this.draw();
    return true;
  }
  removeTask(id){
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.draw();
  }
  editTask(id, name, date){
    const task = this.tasks.find(task => task.id === id);
    if(!task){
      return false;
    }
    name = name.trim();
    if(name.length < 3 || name.length>255){
      alert("Nazwa zadania musi byc dłuższa niż 3 litery i krótsza niż 255")
      return false;
    }
    if(date){
      const now = new Date();
      const taskDate = new Date(date);
      if(taskDate<now){
        alert("Data zadania musi byc w przyszłości lub pusta")
        return false;
      }
    }
    task.name=name;
    task.date=date;
    this.saveTasks();
    this.draw();
    return true
  }
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks !== null) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
  getFilteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }
    return this.tasks.filter(task => task.name.toLowerCase().includes(this.term.toLowerCase()));
  }
}
document.todo = new Todo();
document.todo.draw();

const form = document.getElementById("add-task");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const name = document.getElementById("task-name").value;
  const date = document.getElementById("task-date").value;
  if (document.todo.addTask(name, date)) {
    form.reset();
  }});

const search = document.getElementById("search");
search.addEventListener("input", function() {
  document.todo.term = search.value;
  document.todo.draw();});
