const taskList = [
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

// DOM
function addTaskToDom(task) {
  const { id, name, description, done, dueDate } = task;
  const isExpired = isDateExpired(dueDate);
  const dateText = dueDate
    ? dueDate.getDate() + "-" + dueDate.getMonth() + "-" + dueDate.getFullYear()
    : "";

  const browserSupportsTemplate =
    "content" in document.createElement("template");

  if (browserSupportsTemplate) {
    const template = document.querySelector("#taskTemplate");
    const taskElement = template.content.cloneNode(true).children[0];
    const checkbox = taskElement.querySelector(".todolist__task-input");
    const nameField = taskElement.querySelector(".todolist__task-name");
    const descriptionField = taskElement.querySelector(
      ".todolist__task-description"
    );
    const dateField = taskElement.querySelector(".todolist__task-date");

    taskElement.setAttribute("id", id);
    taskElement.setAttribute("done", done);
    taskElement.setAttribute("onclick", "handleClick(this)");

    checkbox.checked = done;

    nameField.textContent = name;
    descriptionField.textContent = description;

    dateField.setAttribute("expired", isExpired);
    dateField.textContent = dateText;

    taskListElement.appendChild(taskElement);
  }
}

// EVENT
function handleClick(taskElem) {
  console.log("click");
  const allClasses = event.target.classList;
  allClasses.includes = [].includes;

  if (allClasses.includes("form-check-input")) {
    changeTaskState(taskElem);
  } else if (allClasses.includes("todolist__task-delete")) {
    // COMB
    deleteTask(taskElem);
  }
}

// COMB
function deleteTask(taskElem) {
  const taskId = parseInt(taskElem.getAttribute("id"));
  const taskIndex = taskList.findIndex((task) => task.id === taskId);
  taskList.splice(taskIndex, 1);

  taskElem.remove();
  console.log(taskList);
}

// COMB : update task
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

// DOM
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

// DOM
taskList.forEach((task) => addTaskToDom(task));

// EVENT
const showOnlyCompletedButton = document.getElementById("show-all");
showOnlyCompletedButton.addEventListener("click", (event) => {
  displayTasksAccordingToQuery();
});

// EVENT
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

    taskList.push(createdTask);
    addTaskToDom(createdTask);
  } else {
    nameInput.classList.toggle("invalid", true);
  }
});

function isFormValid(formData) {
  return formData.name;
}
