// =========== D A R K AND L I G H T MODE ==================

var toggleBtn = document.getElementById("checkbox");

toggleBtn.addEventListener("change", () => {
  if (toggleBtn.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

// ===== RESET VALUES ==========

function reset() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirmPassword").value = "";
  document.getElementById("userName").value = "";
}

// ======== S I G N U P  FUNCTION ==================

function signUp(e) {
  e.preventDefault();

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confrimPassword = document.getElementById("confirmPassword").value;
  var userName = document.getElementById("userName").value;

  //    =====  CONDITIONS   =====  VALIDATIONS

  if (!email || !password || !confrimPassword) {
    Swal.fire({
      title: "ERROR!",
      text: "Please fill all inputs!",
      icon: "error",
    });
    return;
  }

  if (password.length < 6) {
    Swal.fire({
      title: "ERROR!",
      text: "password should have at least 6 characters!",
      icon: "error",
    });
    return;
  }

  if (password !== confrimPassword) {
    Swal.fire({
      title: "ERROR!",
      text: "confrim password dosn't match!",
      icon: "error",
    });
    return;
  }

  var userId = crypto.randomUUID();

  var currentUser = {
    userName,
    email,
    password,
    id: userId,
  };

  // ===== for SAME EMAIL  checking ================
  var usersData = JSON.parse(localStorage.getItem("users"));
  console.log(usersData);

  if (usersData) {
    var emailChack = usersData.find((obj) => {
      console.log(obj);

      return obj.email == email;
    });
  }

  if (emailChack) {
    Swal.fire({
      title: "ERROR!",
      text: "This email is already exist!",
      icon: "error",
    });
    return;
  }

  //  ======== for FIRST TIME  when no user in save ===========

  var userRecord = [];

  var usersData = JSON.parse(localStorage.getItem("users"));

  if (!usersData) {
    userRecord.push(currentUser);
  } else {
    userRecord = usersData;

    userRecord.push(currentUser);
  }
  console.log(usersData);

  localStorage.setItem("users", JSON.stringify(userRecord));

  Swal.fire({
    title: "SUCCESS!",
    text: "Your account has been Signup!",
    icon: "success",
  });

  reset();
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 2000);
}

// =========== L O G I N FUNCTION ========================

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  //   ========= user F I N D I N G  ===========

  var usersData = JSON.parse(localStorage.getItem("users"));

  var getUser = usersData.find((obj) => {
    return obj.email == email && obj.password == password;
  });

  if (getUser) {
    // console.log(getUser);

    localStorage.setItem("currentUser", JSON.stringify(getUser));
    setTimeout(() => {
      window.location.href = "./deshBord/desh.html";
    }, 2000);
  } else {
    // alert("signup first");
    Swal.fire({
      title: "ERROR!",
      text: " Signup first!",
      icon: "error",
    });
  }
}
