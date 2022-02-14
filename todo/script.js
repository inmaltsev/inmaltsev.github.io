const list = [
  {
    id: 1,
    listId: 2,
    name: "Name for task",
    description: "uncompleted task for today",
    done: false,
    dueDate: new Date("2022-02-11T00:00:00.000Z"),
  },
  {
    id: 2,
    listId: 2,
    name: "Another big task",
    description: "completed task for today",
    done: true,
    dueDate: new Date("2022-02-11T00:00:00.000Z"),
  },
  {
    id: 3,
    listId: 2,
    name: "Name for task",
    description: "completed task for tomorrow",
    done: true,
    dueDate: new Date("2022-02-12T00:00:00.000Z"),
  },
  {
    id: 4,
    listId: 2,
    name: "Name for task",
    description: "uncompleted task for tomorrow",
    done: false,
    dueDate: new Date("2022-02-12T00:00:00.000Z"),
  },
  {
    id: 5,
    listId: 2,
    name: "Name for task",
    description: "completed task for yesterday",
    done: true,
    dueDate: new Date("2022-02-10T00:00:00.000Z"),
  },
  {
    id: 6,
    listId: 2,
    name: "Name for task",
    description: "uncompleted task for yesterday",
    done: false,
    dueDate: new Date("2022-02-10T00:00:00.000Z"),
  },
];

const taskListElement = document.getElementById("taskList");

function generateTaskDomObject(task) {
  const { id, name, description, done, dueDate } = task;
  const isExpired = isDateExpired(dueDate);
  const dateText = dueDate
    ? dueDate.getFullYear() + "-" + dueDate.getMonth() + "-" + dueDate.getDate()
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
    const oldValue = taskElem.getAttribute("done") === "true";
    taskElem.setAttribute("done", !oldValue);
    displayTasksAccordingToQuery();
  } else if (allClasses.includes("todolist__task-delete")) {
    const taskId = parseInt(taskElem.getAttribute("id"));
    const taskIndex = list.findIndex((task) => task.id === taskId);
    list.splice(taskIndex, 1);

    taskElem.remove();
    console.log(list);
  }
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

list.forEach((task) => generateTaskDomObject(task));

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
  allTasks.forEach((task) => {
    const isDone = task.getAttribute("done") === "true";
    if (isDone) {
      task.classList.toggle("none", true);
    }
  });
}

function showAllTasks() {
  const allTasks = taskListElement.children;
  allTasks.forEach = [].forEach;
  allTasks.forEach((task) => task.classList.toggle("none", false));
}

const createTaskForm = document.forms.createTask;
createTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(createTaskForm);
  const createdTask = Object.fromEntries(formData);

  const nameInput = document.getElementsByClassName(
    "todolist__create-task--name"
  )[0];

  if (!createdTask.name) {
    nameInput.classList.toggle("invalid", true);
  } else {
    nameInput.classList.toggle("invalid", false);
    createTaskForm.reset();

    createdTask.dueDate = createdTask.dueDate
      ? new Date(createdTask.dueDate)
      : null;

    list.push(createdTask);
    generateTaskDomObject(createdTask);
  }
});
