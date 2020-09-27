let lists = JSON.parse(window.localStorage.getItem("lists")) || {};
const projects = JSON.parse(window.localStorage.getItem("projects")) || {};

const toDoList = document.querySelector("#toDoList");
const noteInputNode = document.querySelector("#titleInput");
const tagsInputNode = document.querySelector("#tagsInput");
const projectNameNode = document.querySelector("#projectName");
const optionsNode = document.querySelector("#inputGroupSelect");
let currentProjectId;
let currentProjectName;
let notes;

document.querySelector("#projectForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let projectName = projectNameNode.value;
  let newId = uuidv4();
  projects[projectName] = newId;
  lists[newId] = [];
  window.localStorage.setItem("lists", JSON.stringify(lists));
  window.localStorage.setItem("projects", JSON.stringify(projects));
  document.querySelector("#projectAddSuccess").classList.remove("d-none");
  document.querySelector("#projectAddSuccess").classList.add("show");
  projectNameNode.value = null;
  displayOptions(projects);
});

function displayOptions(projects) {
  let optionsHTML = "";
  Object.keys(projects).forEach((project) => {
    optionsHTML = optionsHTML.concat(
      `<option value="${projects[project]}">${project}</option>`
    );
  });
  optionsNode.innerHTML = optionsHTML;
  if (optionsNode.options[optionsNode.selectedIndex]) {
    currentProjectId = optionsNode.options[optionsNode.selectedIndex].value;
    currentProjectName =
      optionsNode.options[optionsNode.selectedIndex].innerHTML;
    console.log("ProjectName", currentProjectName);
  }
  if (window.localStorage.getItem("lists")) {
    notes = JSON.parse(window.localStorage.getItem("lists"))[currentProjectId];
    console.log(notes, currentProjectId);
  }
  if (document.querySelector(".show-completed").checked)
    displayNotes(notes, true);
  else displayNotes(notes);
}
displayOptions(projects);

optionsNode.addEventListener("change", (e) => {
  currentProjectId = optionsNode.options[optionsNode.selectedIndex].value;
  currentProjectName = optionsNode.options[optionsNode.selectedIndex].innerHTML;
  console.log("ProjectName", currentProjectName);
  if (window.localStorage.getItem("lists")) {
    notes = JSON.parse(window.localStorage.getItem("lists"))[currentProjectId];
  }
  displayNotes(notes);
});

document
  .querySelector("#deleteProjectButton")
  .addEventListener("click", (e) => {
    if (currentProjectName && Object.keys(projects).length > 1) {
      delete projects[currentProjectName];
      delete lists[currentProjectId];
      window.localStorage.setItem("projects", JSON.stringify(projects));
      window.localStorage.setItem("lists", JSON.stringify(lists));
      displayOptions(projects);
    } else {
      document.querySelector("#warning").classList.remove("d-none");
      document.querySelector("#warning").classList.add("show");
    }
  });

document.querySelector("#item-input").addEventListener("submit", (e) => {
  console.log(notes);
  e.preventDefault();
  const newNote = {
    id: Date.now(),
    text: noteInputNode.value,
    tags: tagsInputNode.value.split(","),
    complete: false,
  };
  notes.push(newNote);
  lists[currentProjectId] = notes;
  window.localStorage.setItem("lists", JSON.stringify(lists));
  noteInputNode.value = null;
  tagsInputNode.value = null;
  if (document.querySelector(".show-completed").checked)
    displayNotes(notes, true);
  else displayNotes(notes);
});

function displayNotes(notes, completed = false, toDoListHtml = "") {
  if (notes) {
    if (completed) {
      notes = notes.filter((note) => {
        if (note.complete) {
          return note;
        }
      });
    }
    notes.forEach((note) => {
      let tags = "";
      note.tags.forEach((tag) => {
        tags = tags.concat(
          `<span class="badge badge-info mr-2 p-2">${tag}</span>`
        );
      });
      let checked = note.complete ? "checked" : "";
      let d = new Date();
      let currentDate =
        "" + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      toDoListHtml = toDoListHtml.concat(`
            <div class="col-sm-12 mb-3 p-2 to-do-item">
                <div class="d-flex justify-content-between">
                  <span>${note.text}</span>
                  <div id='${note.id}' class="input-group-text">
                    <button class="btn btn-outline-info btn-sm edit-button mx-1">&#9998;</button>
                    <button class="btn btn-outline-danger btn-sm delete-button">X</button>
                    <input class="check ml-2 card-check" type="checkbox" name="checkbox" ${checked}>
                  </div>
                </div>
                <div class="d-flex justify-content-between mt-4">
                  <div class="">
                    ${tags}
                  </div>
                  <div class="">
                    ${currentDate}
                  </div>
                </div>
            </div>
    `);
    });
    toDoList.innerHTML = toDoListHtml;
    addDeleteNodeListeners();
    updateNodeListeners();
    addCompleteNodeListeners();
  }
}

function addDeleteNodeListeners() {
  document.querySelectorAll(".delete-button").forEach((node) => {
    node.addEventListener("click", (e) => {
      let spliceIndex = 0;
      notes.some((note, index) => {
        if (note.id === +e.target.parentElement.getAttribute("id")) {
          spliceIndex = index;
          return true;
        }
      });
      notes.splice(spliceIndex, 1);
      if (document.querySelector(".show-completed").checked)
        displayNotes(notes, true);
      else displayNotes(notes);
      lists[currentProjectId] = notes;
      window.localStorage.setItem("lists", JSON.stringify(lists));
    });
  });
}
function updateNodeListeners() {
  document.querySelectorAll(".edit-button").forEach((node) => {
    node.addEventListener("click", (e) => {
      let spliceIndex = 0;
      let currentNote = {};
      notes.some((note, index) => {
        if (note.id === +e.target.parentElement.getAttribute("id")) {
          spliceIndex = index;
          currentNote = note;
          return true;
        }
      });
      notes.splice(spliceIndex, 1);
      if (document.querySelector(".show-completed").checked)
        displayNotes(notes, true);
      else displayNotes(notes);
      noteInputNode.value = currentNote.text;
      tagsInputNode.value = currentNote.tags;
      lists[currentProjectId] = notes;
      window.localStorage.setItem("lists", JSON.stringify(lists));
    });
  });
}
function addCompleteNodeListeners() {
  let k = document.querySelectorAll(".card-check");
  k.forEach((node) => {
    node.addEventListener("change", (e) => {
      console.log(e.target.parentElement);
      notes.some((note, index) => {
        if (note.id === +e.target.parentElement.getAttribute("id")) {
          console.log(e.target.checked);
          if (e.target.checked) {
            note.complete = true;
          } else {
            note.complete = false;
          }
        }
      });
      lists[currentProjectId] = notes;
      window.localStorage.setItem("lists", JSON.stringify(lists));
      if (document.querySelector(".show-completed").checked)
        displayNotes(notes, true);
      else displayNotes(notes);
    });
  });
}

function hide() {
  document.querySelectorAll(".close").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.classList.add("d-none");
    });
  });
}
hide();

document.querySelector(".show-completed").addEventListener("change", (e) => {
  if (e.target.checked) {
    displayNotes(notes, true);
  } else {
    displayNotes(notes);
  }
});
