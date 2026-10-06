// ==========================================
// INTERACTIVE TO-DO LIST
// ==========================================

// Get HTML elements
const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

// Current filter
let currentFilter = "all";

// ==========================================
// LOAD TASKS FROM LOCAL STORAGE
// ==========================================

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    // Apply filter
    if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }

    // Empty message
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.className = "empty-message";

        if (tasks.length === 0) {

            emptyMessage.textContent =
                "No tasks yet. Add your first task!";

        } else {

            emptyMessage.textContent =
                "No tasks found.";

        }

        taskList.appendChild(emptyMessage);

        updateTaskCount();

        return;
    }


    // Create tasks
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {

            li.classList.add("completed");

        }


        // Complete button
        const completeButton =
            document.createElement("button");

        completeButton.className = "complete-btn";

        completeButton.type = "button";

        completeButton.setAttribute(
            "aria-label",
            "Complete task"
        );


        // Task text
        const taskText =
            document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";


        // Complete event
        completeButton.addEventListener(
            "click",
            function () {

                toggleTask(task.id);

            }
        );


        // Delete event
        deleteButton.addEventListener(
            "click",
            function () {

                deleteTask(task.id);

            }
        );


        // Add elements
        li.appendChild(completeButton);

        li.appendChild(taskText);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });


    updateTaskCount();

}


// ==========================================
// ADD TASK
// ==========================================

todoForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const text = taskInput.value.trim();

        // Don't add empty task
        if (text === "") {

            taskInput.focus();

            return;

        }


        // Create task object
        const newTask = {

            id: Date.now(),

            text: text,

            completed: false

        };


        // Add task
        tasks.unshift(newTask);


        // Save
        saveTasks();


        // Clear input
        taskInput.value = "";


        // Update UI
        displayTasks();


        // Focus input
        taskInput.focus();

    }
);


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    displayTasks();

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    displayTasks();

}


// ==========================================
// FILTER TASKS
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            // Remove active class
            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            // Add active class
            button.classList.add("active");


            // Change filter
            currentFilter =
                button.dataset.filter;


            // Display
            displayTasks();

        }
    );

});


// ==========================================
// CLEAR COMPLETED TASKS
// ==========================================

clearCompleted.addEventListener(
    "click",
    function () {

        tasks = tasks.filter(
            task => !task.completed
        );


        saveTasks();

        displayTasks();

    }
);


// ==========================================
// UPDATE TASK COUNT
// ==========================================

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    if (activeTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${activeTasks} tasks remaining`;

    }

}


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayTasks();
