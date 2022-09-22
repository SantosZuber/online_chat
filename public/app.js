const socket = io.connect();
let chat = document.getElementById("chat");
let username;

document.getElementById("welcome").style.display = "none";
document.getElementById("chat-page").style.display = "none";

document.getElementById("form").onsubmit = function (e) {
  e.preventDefault();
  if (!document.getElementById("username").value == "") {
    username = document.getElementById("username").value;
    validateUsername(username);
    socket.emit("online", username);
    document.getElementById("login").style.display = "none";
    document.getElementById("welcome").style.display = "flex";
    document.getElementById("welcome-title").innerHTML = `Hello ${username}`;

    //Mejorable con una promesa probablemente ->
    setTimeout(() => {
      document.getElementById("welcome").style.animationName = "dissapear";
      document.getElementById("welcome").style.animationDuration = "1s";
      document.getElementById("welcome").style.animationIterationCount =
        "initial";
      document.getElementById("welcome").style.animationTimingFunction =
        "ease-in";
    }, 2000);
    setTimeout(() => {
      document.getElementById("chat-page").style.display = "flex";
    }, 2000);
    setTimeout(() => {
      document.getElementById("welcome").style.display = "none";
    }, 2999);
  }
};

document.getElementById("input-container").onsubmit = function (e) {
  e.preventDefault();
  if (!document.getElementById("message").value == "") {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let amOrPm = hrs >= 12 ? "pm" : "am";

    let message = {};
    validateMsg(document.getElementById("message").value);
    message.text = document.getElementById("message").value;
    message.date = `${hrs}:${mins}${amOrPm}`;
    socket.emit("message", username, message);
    document.getElementById("message").value = "";
    message = "";
  }
};

socket.on("newmsg", (data) => {
  chat.innerHTML = "";
  data.forEach((e) => {
    const { username, message, date, color } = e;
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<p class="${color}">${username}</p> <p class="msg-text">${message}</p><span>${date}</span>`;
    chat.appendChild(messageElement);
    return;
  });
  chat.scrollBy(0, chat.scrollHeight);
  let music = new Audio("./sound.wav");
  music.play();
  music.loop = false;
  music.playbackRate = 1;
});

socket.on("ping", (data) => {
  chat.innerHTML = "";
  data.forEach((e) => {
    const { username, message, date, color } = e;
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<p class="${color}">${username}</p> <p class="msg-text">${message}</p><span>${date}</span>`;
    chat.appendChild(messageElement);
    return;
  });
  chat.scrollBy(0, chat.scrollHeight);
});

socket.on("newonline", (users) => {
  document.getElementById("users-online-container").innerHTML = "";
  users.forEach((e) => {
    const userElement = document.createElement("span");
    userElement.classList.add("users-online");
    userElement.innerHTML = `<p>🟢 ${e}</p>`;
    document.getElementById("users-online-container").appendChild(userElement);
    return;
  });
});

function validateUsername(data) {
  if (data.includes("<", ">", "*", "/")) {
    data = "";
    alert("Characters like < > * / are not allowed");
    document.location.reload();
  } else if (data.includes(" ")) {
    data = "";
    alert("Spaces are not allowed");
    document.location.reload();
  } else if (data === null) {
    data = "";
  }
}
function validateMsg(data) {
  if (data.includes("<", ">", "*", "/")) {
    data = "";
    alert("Characters like < > * / are not allowed");
    document.location.reload();
  } else if (data === null) {
    data = "";
  }
}
