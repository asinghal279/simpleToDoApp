// let currentProject =

const notes = JSON.parse(window.localStorage.getItem("notes")) || [];
const projects = JSON.parse(window.localStorage.getItem("projects")) || {};

const toDoList = document.querySelector("#toDoList");
const noteInputNode = document.querySelector("#titleInput");
const tagsInputNode = document.querySelector("#tagsInput");
const projectNameNode = document.querySelector("#projectName");
const optionsNode = document.querySelector("#inputGroupSelect");

document.querySelector("#projectForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let projectName = projectNameNode.value;
  let projectsCount = Object.keys(projects).length;
  let newId = projectsCount;
  projects[projectName] = newId;
  window.localStorage.setItem("projects", JSON.stringify(projects));
  projectNameNode.value = null;
  displayOptions(projects);
});

function displayOptions(projects) {
  let optionsHTML = "";
  Object.keys(projects).forEach((project) => {
    console.log("here", projects[project], project);
    optionsHTML = optionsHTML.concat(
      `<option value="${projects[project]}">${project}</option>`
    );
  });
  console.log(optionsHTML);
  optionsNode.innerHTML = optionsHTML;
}
displayOptions(projects);

document.querySelector("#item-input").addEventListener("submit", (e) => {
  console.log("here");
  e.preventDefault();
  const newNote = {
    id: Date.now(),
    text: noteInputNode.value,
    tags: tagsInputNode.value.split(","),
  };
  notes.push(newNote);
  window.localStorage.setItem("notes", JSON.stringify(notes));
  noteInputNode.value = null;
  tagsInputNode.value = null;
  displayNotes([newNote], toDoList.innerHTML);
});

function displayNotes(notes, toDoListHtml = "") {
  if (notes) {
    notes.forEach((note) => {
      let tags = "";
      note.tags.forEach((tag) => {
        tags = tags.concat(
          `<span class="badge badge-info mr-2 p-2">${tag}</span>`
        );
      });
      toDoListHtml = toDoListHtml.concat(`
            <div class="col-sm-12 mb-3 p-2 to-do-item">
                <div class="d-flex justify-content-between">
                  <span>${note.text}</span>
                  <div id='${note.id}'>
                    <button class="btn btn-info btn-sm edit-button">&#9998;</button>
                    <button class="btn btn-danger btn-sm delete-button">X</button>
                  </div>
                </div>
                <div class="col-sm-12 p-0">
                    ${tags}
                </div>
            </div>
    `);
    });
    toDoList.innerHTML = toDoListHtml;
    addDeleteNodeListeners();
    updateNodeListeners();
  }
}

displayNotes(notes);

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
      displayNotes(notes);
      window.localStorage.setItem("notes", JSON.stringify(notes));
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
      displayNotes(notes);
      noteInputNode.value = currentNote.text;
      tagsInputNode.value = currentNote.tags;
      window.localStorage.setItem("notes", JSON.stringify(notes));
    });
  });
}
