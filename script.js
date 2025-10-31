//
// How this file works (in simple terms):
// - Saves your tasks in your browser so they stay after refresh (no account needed)
// - Lets you add a task, mark it done, edit it, delete one, or delete all
// - Updates the number of tasks automatically
//

// Retrieve tasks saved in your browser, or start with an empty list
let todo = JSON.parse(localStorage.getItem("todo")) || [];
// Get the on-page elements we will work with
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// When the page is ready, connect buttons and show any saved tasks
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the page from doing anything special on Enter
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

// Add a new task using the text typed in the box
function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    // 'disabled: false' means the task is not completed yet
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

// Show all tasks on the page
function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
        <button class="delete-task-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoList.appendChild(p);
  });
  // Update the number of tasks shown to the user
  todoCount.textContent = todo.length;
}

// Click a task's text to edit it; click outside the box to save changes
function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

// Tick/untick the circle to mark a task as done or not done
function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

// Remove a single task
function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

// Remove every task at once
function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

// Save the current list of tasks in the browser
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}