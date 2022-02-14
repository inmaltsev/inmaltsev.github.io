const list = [
  {
    id: 1,
    listId: 2,
    name: "Name for task",
    description: "uncompleted task for today",
    done: false,
    dueDate: new Date(),
  },
  {
    id: 2,
    listId: 2,
    name: "Another big task",
    description: "completed task for today",
    done: true,
    dueDate: new Date(),
  },
  {
    id: 3,
    listId: 2,
    name: "Name for task",
    description: "completed task for past",
    done: true,
    dueDate: new Date("2022-02-12T00:00:00.000Z"),
  },
  {
    id: 4,
    listId: 2,
    name: "Name for task",
    description: "uncompleted task for past",
    done: false,
    dueDate: new Date("2022-02-12T00:00:00.000Z"),
  },
  {
    id: 5,
    listId: 2,
    name: "Name for task",
    description: "completed task for past",
    done: true,
    dueDate: new Date("2022-02-10T00:00:00.000Z"),
  },
  {
    id: 6,
    listId: 2,
    name: "Name for task",
    description: "uncompleted task for past",
    done: false,
    dueDate: new Date("2022-02-10T00:00:00.000Z"),
  },
];

const taskListElement = document.getElementById("taskList");

function addTaskToDom(task) {
  const { id, name, description, done, dueDate } = task;
  const isExpired = isDateExpired(dueDate);
  const dateText = dueDate
    ? dueDate.getDate() + "-" + dueDate.getMonth() + "-" + dueDate.getFullYear()
    : "";
  taskListElement.innerHTML += `
    <li class="form-check container todolist__task" id="${id}" done="${done}" onclick="handleClick(this)">
        <input
          type="checkbox"
          class="form-check-input todolist__task-input" ${done ? "checked" : ""}
          
        />
        
        <label class="form-check-label todolist__task"> 
          <p class="todolist__task-name">${name}</p>
          <p class="todolist__task-description">${description}</p>
        </label>

        <span
        class="todolist__task-date badge rounded-pill bg-primary"
        expired="${isExpired}"
        >
        ${dateText}
        </span>
        <button class="todolist__task-delete btn btn-secondary">Delete</button>
    </li>
  `;
}

function handleClick(taskElem) {
  const allClasses = event.target.classList;
  allClasses.includes = [].includes;

  if (allClasses.includes("form-check-input")) {
    changeTaskState(taskElem);
  } else if (allClasses.includes("todolist__task-delete")) {
    deleteTask(taskElem);
  }
}

function deleteTask(taskElem) {
  const taskId = parseInt(taskElem.getAttribute("id"));
  const taskIndex = list.findIndex((task) => task.id === taskId);
  list.splice(taskIndex, 1);

  taskElem.remove();
  console.log(list);
}

function changeTaskState(taskElem) {
  const oldValue = taskElem.getAttribute("done") === "true";
  taskElem.setAttribute("done", !oldValue);

  displayTasksAccordingToQuery();
}

function isDateExpired(date) {
  if (date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < now;
  } else {
    return false;
  }
}

list.forEach((task) => addTaskToDom(task));

const showOnlyCompletedButton = document.getElementById("show-all");
showOnlyCompletedButton.addEventListener("click", (event) => {
  displayTasksAccordingToQuery();
});

function displayTasksAccordingToQuery() {
  if (showOnlyCompletedButton.checked) {
    hideCompletedTasks();
  } else {
    showAllTasks();
  }
}

function hideCompletedTasks() {
  const allTasks = taskListElement.children;
  allTasks.forEach = [].forEach;
  allTasks.forEach(hideUndoneTask);
}

function hideUndoneTask(task) {
  const isDone = task.getAttribute("done") === "true";
  if (isDone) {
    task.classList.toggle("none", true);
  }
}

function showAllTasks() {
  const allTasks = taskListElement.children;
  allTasks.forEach = [].forEach;
  allTasks.forEach(makeTaskVisible);
}

function makeTaskVisible(task) {
  task.classList.toggle("none", false);
}

const createTaskForm = document.forms.createTask;
createTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(createTaskForm));

  const nameInput = document.getElementById("taskNameInput");

  if (isFormValid(formData)) {
    nameInput.classList.toggle("invalid", false);
    createTaskForm.reset();

    const createdTask = Object.assign(formData);
    createdTask.dueDate = formData.dueDate ? new Date(formData.dueDate) : null;

    list.push(createdTask);
    addTaskToDom(createdTask);
  } else {
    nameInput.classList.toggle("invalid", true);
  }
});

function isFormValid(formData) {
  return formData.name;
}
