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
  let projectsCount = Object.keys(projects).length;
  let newId = projectsCount;
  projects[projectName] = newId;
  lists[newId] = [];
  window.localStorage.setItem("lists", JSON.stringify(lists));
  window.localStorage.setItem("projects", JSON.stringify(projects));
  document.querySelector("#projectAddSuccess").style.display = "block";
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
  if (optionsNode.options[optionsNode.selectedIndex])
    currentProjectId = optionsNode.options[optionsNode.selectedIndex].value;
    currentProjectName = optionsNode.options[optionsNode.selectedIndex].innerHTML;
  console.log("ProjectName", currentProjectName);
  if (window.localStorage.getItem("lists")) {
    notes = JSON.parse(window.localStorage.getItem("lists"))[currentProjectId];
  }
  displayNotes(notes);
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

document.querySelector('#deleteProjectButton').addEventListener("click", (e) => {
  if(currentProjectName && Object.keys(projects).length>1){
    delete projects[currentProjectName];
    window.localStorage.setItem("projects", JSON.stringify(projects));
    displayOptions(projects);
  }
  else{
    document.querySelector("#warning").style.display = "block";
  }
})

document.querySelector("#item-input").addEventListener("submit", (e) => {
  console.log(notes);
  e.preventDefault();
  const newNote = {
    id: Date.now(),
    text: noteInputNode.value,
    tags: tagsInputNode.value.split(","),
  };
  notes.push(newNote);
  lists[currentProjectId] = notes;
  window.localStorage.setItem("lists", JSON.stringify(lists));
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
                    <button class="btn btn-outline-info btn-sm edit-button mx-1">&#9998;</button>
                    <button class="btn btn-outline-danger btn-sm delete-button">X</button>
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
      displayNotes(notes);
      noteInputNode.value = currentNote.text;
      tagsInputNode.value = currentNote.tags;
      lists[currentProjectId] = notes;
      window.localStorage.setItem("lists", JSON.stringify(lists));
    });
  });
}
