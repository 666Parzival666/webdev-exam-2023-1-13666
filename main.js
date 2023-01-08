let counter = 0;

function createTask (name, desc, status, taskId) {
    let task = {name, desc, status, taskId};
    localStorage.setItem("task-" + task.taskId, JSON.stringify(task));
    return task;
}

function getTaskByID(taskId) {
    return JSON.parse(localStorage.getItem("task-" + taskId));
}

function clickBtnArrow(event) {
    let taskObj = event.target.closest(".task");
    let taskId = taskObj.id;
    let task = getTaskByID(taskId);

    if (task.status == "to-do") {
        task.status = "done";
    } else {
        task.status = "to-do";
    }
    localStorage.setItem("task-" + task.taskId, JSON.stringify(task));

    let listStatus = document.querySelector(".data-" + task.status);
    listStatus.append(taskObj);
}

function taskElemCreate(taskObject) {
    let elem = document.getElementById("task-template");
    let clonedElem = elem.content.firstElementChild.cloneNode(true);
    
    let arrows = clonedElem.querySelectorAll(".arrow");
    for (let arrow of arrows) {
        arrow.onclick = clickBtnArrow;
    }

    clonedElem.querySelector(".task-name").innerHTML = taskObject.name;
    clonedElem.id = taskObject.taskId;
    return clonedElem;
}

function documentAppend(task) {
    let clone = taskElemCreate(task);
    let list = document.querySelector(".data-" + task.status);
    list.append(clone);
}

function localStorageCheck() {
    let key;
    let localStorageItem;
    for (let i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        localStorageItem = localStorage.getItem(key);
        localStorageItem = JSON.parse(localStorageItem);
        documentAppend(localStorageItem);
        counter = Math.max(counter, localStorageItem.taskId);
    }
    counter++;
}

function newTask (event) {
    let form = event.target.closest(".modal").querySelector("form");
    let name = form.elements['task-name'].value;
    let desc = form.elements['task-desc'].value;
    let status = form.elements['task-status'].value;
    let action = form.elements['action'].value;
    let taskId = form.elements['task-id'].value;
    if (action == "create") {
        let task = createTask(name, desc, status, counter);
        counter += 1;
        documentAppend(task);
    } else if (action == "edit") {
        let task = getTaskByID(taskId);
        task.name = name;
        task.desc = desc;
        task.status = status;
        localStorage.setItem("task-" + task.taskId, JSON.stringify(task));
        let taskObj = document.getElementById(taskId);
        taskObj.querySelector('.task-name').innerHTML = name;
    }
    
}

function quantityCheck(event) { //event.target - объект списка
    let eventObj = event.target;
    let counterObj = eventObj.closest(".card").querySelector(".task-counter");
    let eventNumber = eventObj.children.length;
    counterObj.innerHTML = eventNumber;
}

function taskDelete(event) {
    let modalObj = event.target;
    let taskId = event.relatedTarget.closest(".task").id;
    let task = getTaskByID(taskId);
    modalObj.querySelector(".taskOnRemove").innerHTML = task.name;
    modalObj.querySelector("form").elements["taskID"].value = task.taskId;
}

function deleteOnClick(event) {
    let modalObj = event.target.closest(".modal");
    let taskID = modalObj.querySelector("form").elements["taskID"].value;
    localStorage.removeItem("task-" + taskID);
    let taskObj = document.getElementById(taskID);
    taskObj.remove();
}

function openModal(event) {
    let form = event.target.querySelector('form');
    let action = event.relatedTarget.dataset.action;
    form.elements["action"].value = action;
    if (action == "edit") {
        let taskId = event.relatedTarget.closest('.task').id;
        form.elements["task-id"].value = taskId;
        let task = getTaskByID(taskId);
        form.elements["task-name"].value = task.name;
        form.elements["task-desc"].value = task.desc;
        form.elements["task-status"].closest('.row').classList.add('d-none');
        let modaltitle = event.target.querySelector('.modal-title');
        modaltitle.innerHTML = "Редактирование задачи";
        let actionbut = document.getElementById("create-btn");
        actionbut.innerHTML = "Сохранить";
    }
    
}

window.onload = function () { //show.bs.modal id="removeTaskModal"
    let lists = document.querySelectorAll(".data-to-do, .data-done");
    let removeModal = document.getElementById("removeTaskModal");
    removeModal.addEventListener('show.bs.modal', taskDelete);
    for (let list of lists) {
        list.addEventListener('DOMSubtreeModified', quantityCheck);
    }
    localStorageCheck();
    let btn = document.getElementById("create-btn");
    btn.onclick = newTask;
    let btnDelete = document.querySelector(".btn-delete");
    btnDelete.onclick = deleteOnClick;

    let arrows = document.querySelectorAll(".arrow");
    for (let arrow of arrows) {
        arrow.onclick = clickBtnArrow;
    }

    let taskModal = document.querySelector(".btn-modal");
    taskModal.addEventListener('show.bs.modal', openModal);
    
};