var currentUser = null;
var userAllTodos = [];

// ============== G E T I N G - USERNAME AND PRINT ==========

function initial() {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    var crntUserName = currentUser.userName;
    var nameDisplay = document.getElementById("userName");
    nameDisplay.innerHTML = crntUserName.toUpperCase();
  }
  if (!currentUser) {
    return (window.location.href = "../login.html");
  }
  // printPrevTodo();
  crntUserPrevTodo();
}

initial();

// =====P R I N T S  - PREVIOUS TODOS ==============

// function printPrevTodo() {
//   var prevAllTodos = JSON.parse(localStorage.getItem("allTodos"));
//   if (prevAllTodos) {
//     userAllTodos = prevAllTodos;

//     for (var i = 0; i < prevAllTodos.length; i++) {
//       var preTodos = prevAllTodos[i];
//       var preTodoItem = preTodos.todo;
//       var todo_id = preTodos.id;
//       printTodo(preTodoItem, todo_id);
//     }
//   }
// }

// ====== L O G I N U S E R  - TODOS ======

function crntUserPrevTodo() {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  var user_id = currentUser.id;
  var prevAllTodos = JSON.parse(localStorage.getItem("allTodos"));
  if (prevAllTodos) {
    userAllTodos = prevAllTodos.filter((elemt) => {
      return elemt.userId == user_id;
    });

    for (var i = 0; i < prevAllTodos.length; i++) {
      var preTodos = prevAllTodos[i];
      var todo_id = preTodos.id;
      var usreIdInTodo = preTodos.userId;
      if (user_id == usreIdInTodo) {
        printTodo(preTodos.todo, todo_id);
      }
    }
  }
  displayDeleteAll();
}

// ======= DELETEALL BTN ENABLE / DISABLE ================

function displayDeleteAll() {
  var getdeleteBtn = document.getElementById("deleteBtn");

  if (userAllTodos.length) {
    console.log(getdeleteBtn);
    getdeleteBtn.disabled = false;
    getdeleteBtn.style.display = "block";
  } else {
    getdeleteBtn.disabled = true;
    getdeleteBtn.style.display = "none";
  }
}
// ============= E D I T I N G - SELECTED TODO ==============

function editingTodo(p_id, userInp) {
  var updatedTodos = [];

  var preTodos = JSON.parse(localStorage.getItem("allTodos"));

  for (var i = 0; i < preTodos.length; i++) {
    if (p_id == preTodos[i].id) {
      preTodos[i].todo = userInp;
    }
    updatedTodos.push(preTodos[i]);
  }
  localStorage.setItem("allTodos", JSON.stringify(updatedTodos));
}

// ========== D E L E T I N G - SELECTING TODO ============

function deleteTodoObjFromArray(e) {
  var getingP = e.parentNode.parentNode.firstChild;
  var p_id = getingP.id;
  var getingTodoFromLocal = JSON.parse(localStorage.getItem("allTodos"));

  var newArrayAfterDelet = getingTodoFromLocal.filter((elemt) => {
    return elemt.id !== p_id;
  });

  localStorage.setItem("allTodos", JSON.stringify(newArrayAfterDelet));
}

// =====  F U N C T I O N S =========

function addTask() {
  /** GETTING INPUT VALUE  */
  var userInput = document.getElementById("userText");

  // DRY ->  DONOT REPEAT YOURSELF
  var inputValue = userInput.value;
  // TRIM
  if (inputValue.trim() == "") {
    alert("Please enter a task");
    return;
  }

  var uniqueId = crypto.randomUUID();
  var todoItem = {
    id: uniqueId,
    todo: inputValue,
    userId: currentUser.id,
  };

  userAllTodos.push(todoItem);

  /** SET ALL TODOS INTO LOCAL STORAGE */

  localStorage.setItem("allTodos", JSON.stringify(userAllTodos));
  /** PRINT TODOS */

  printTodo(inputValue, uniqueId);
  displayDeleteAll();
  /** REMOVING INPUT VALUE */
  userInput.value = "";
  inputValue = "";
}

function printTodo(inputValue, uniqueId) {
  var todoListContainer = document.getElementById("taskDiv");

  //========= A D D - B U T T O N =======>>>>

  var todoRowContainer = document.createElement("div");
  todoRowContainer.setAttribute(
    "class",
    "rowContainer col-12 row bg-white mt-2"
  );

  /** CREATING PRAG TAG  */
  var p = document.createElement("p");
  var pText = document.createTextNode(inputValue);
  p.setAttribute("class", "pTag col-10");
  p.setAttribute("id", uniqueId);
  p.appendChild(pText);

  // ======== E D I T - B U T T O N =============>>>>
  var editImage = document.createElement("img");
  editImage.setAttribute("src", "./image/edit.png");
  editImage.setAttribute("width", "15");
  editImage.setAttribute("onclick", "editFunc(this)");

  editImage.setAttribute("class", "ms-1 me-1");
  editImage.title = "edit";
  // ======== D E L E T E - B U T T O N ============
  var deleteImg = document.createElement("img");
  deleteImg.setAttribute("src", "./image/bin.png");
  deleteImg.setAttribute("width", "15");
  deleteImg.setAttribute("onclick", "delFunc(this)");

  deleteImg.setAttribute("class", "ms-1 me-1");
  deleteImg.title = "delete";
  // ======== RIGHT CONTAINER=============>>>>this
  var rightDiv = document.createElement("div");
  rightDiv.setAttribute("class", "col-2");

  /** ADDING BUTTONS INTO RIGHT DIV */
  rightDiv.appendChild(editImage);
  rightDiv.appendChild(deleteImg);

  /** ADDING INTO ROW DIV */
  todoRowContainer.appendChild(p);
  todoRowContainer.appendChild(rightDiv);

  /** ADDING INTO MAIN CONTAINER */
  todoListContainer.appendChild(todoRowContainer);
}

// ========== E D I T  =============

function editFunc(e) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to edit this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, edit it!",
  }).then((result) => {
    var selectedNode = e.parentNode.parentNode.firstChild;
    var p_id = selectedNode.id;
    var selectedNodeValue = selectedNode.innerHTML;
    if (result.isConfirmed) {
      var userInp = prompt("Enter new value", selectedNodeValue);
      selectedNode.innerHTML = userInp;

      editingTodo(p_id, userInp);

      Swal.fire({
        title: "EDITED!",
        text: "Your file has been edit.",
        icon: "success",
      });
    }
  });
}

// ===== D E L E T E ================

function delFunc(e) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTodoObjFromArray(e);
      e.parentNode.parentNode.remove();
      displayDeleteAll();

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

// ======== L O G O U T - FUNCTION ==========

function logOut() {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to logout!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      window.location.href = ".././login.html";
    }
  });
}

// =========== D E L E T E A L L - FUNCTION ======================

function deleteAll() {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete all!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      var mainDiv = document.getElementById("taskDiv");
      mainDiv.innerHTML = "";
      displayDeleteAll();
      filterTodos();
    }
  });
}

// ==============

function filterTodos() {
  var userId = currentUser.id;
  var newFilterTodos = userAllTodos.filter((elemt) => {
    return elemt.userId !== userId;
  });
  userAllTodos = newFilterTodos;
  localStorage.setItem("allTodos", JSON.stringify(newFilterTodos));
}
