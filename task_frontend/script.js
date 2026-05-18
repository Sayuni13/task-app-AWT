const API = "http://localhost/API_Task_App/API_BE";

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");
    document.getElementById("message").innerText = "";

    if (pageId === "tasks") {
        document.getElementById("topTabs").style.display = "none";
    } else {
        document.getElementById("topTabs").style.display = "flex";
    }
}

function showMessage(text) {
    document.getElementById("message").innerText = text;
}

function registerUser() {
    let username = document.getElementById("regUsername").value;
    let password = document.getElementById("regPassword").value;

    fetch(API + "/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        showMessage("Registered successfully. Now login!");
        document.getElementById("regUsername").value = "";
        document.getElementById("regPassword").value = "";
        showPage("login");
    });
}

function loginUser() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    fetch(API + "/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);

            document.getElementById("loginUsername").value = "";
            document.getElementById("loginPassword").value = "";

            document.getElementById("taskList").innerHTML = "";
            showPage("tasks");
        } else {
            showMessage("Login failed");
        }
    });
}

function addTask() {
    let task = document.getElementById("taskInput").value;
    let token = localStorage.getItem("token");

    fetch(API + "/add_task.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            task: task
        })
    })
    .then(res => res.json())
    .then(data => {
        showMessage("Task added successfully");
        document.getElementById("taskInput").value = "";
        document.getElementById("taskList").innerHTML = "";
    });
}

function getTasks() {
    let token = localStorage.getItem("token");

    fetch(API + "/get_task.php", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("taskList");
        list.innerHTML = "";

        data.forEach(item => {
            if (item.task !== "") {
                let li = document.createElement("li");
                li.innerText = item.task;
                list.appendChild(li);
            }
        });
    });
}

function clearTasks() {
    document.getElementById("taskList").innerHTML = "";
    showMessage("Tasks hidden");
}

function logoutUser() {
    let token = localStorage.getItem("token");

    fetch(API + "/logout.php", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        localStorage.removeItem("token");
        document.getElementById("taskList").innerHTML = "";
        showPage("login");
        showMessage("Logged out successfully");
    });
}