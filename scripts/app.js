var importantIcon = "fas fa-star";
var nonImportantIcon = "far fa-star";
var isImportant = false;
var isHidden = false;
var notHiddenIcon = "fa-eye";
var hiddenIcon = "fa-eye-slash";

function saveTask() {
  console.log("Task saved");

  let title = $("#txtTitle").val();
  let dueDate = $("#txtDueDate").val();
  let description = $("#txtDescription").val();
  let tag = $("#txtTag").val();
  let color = $("#txtColor").val();
  let category = $("#txtCategory").val();

  console.log(title, dueDate, description, tag, color, category);

  let task = new Task(title, dueDate, description, tag, color, category);
  console.log(task);

  //http request
  $.ajax({
    type: "POST",
    url: "https://fsdiapi.azurewebsites.net/api/tasks",
    data: JSON.stringify(task),
    contentType: "application/json",
    success: function(response){
      console.log("Server says...", response);
      displayTask(task);
      clearInputs();
    },
    error: function(details){
      console.log("Save failed ...", details);
      alert("Error! we could not save your task")
    }
  });
  
}

function displayTask(task) {
    console.log("Title: ", task.title);console.log("Due date: ", task.dueDate);
    console.log("Description: ", task.description);
    console.log("Tag: ", task.tag);
    console.log("Color: ", task.color);
    console.log("Category: ", task.category);

    let syntax = `
        <div class="task" style="border-left: 5px solid ${task.color}">
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div class="task-date">
                <h3>${task.dueDate}</h3>
            </div>
            <div class="task-extra">
                <h3>${task.category}</h3>
                <h3>${task.tag}</h3>
            </div>
        </div>
        `;
    $(".taskList").append(syntax);
}

function clearInputs(){
    console.log("Clearing...");
    $(".form-control").val("");
    $(".form-select").val("");
}

function changeIcon() {
  if (!isImportant) {
    //change the icon to important
    $("#important").removeClass(nonImportantIcon).addClass(importantIcon);
    console.log("Star click");
    isImportant = true;
  } else {
    // change the icon to no important
    $("#important").removeClass(importantIcon).addClass(nonImportantIcon);
    isImportant = false;
  }
}

function hideInfo() {
  if (!isHidden) {
    console.log("Section hid");
    $("#eyeIcon").removeClass(notHiddenIcon).addClass(hiddenIcon);
    $("section.info").hide();
    isHidden = true;
  } else {
    $("#eyeIcon").removeClass(hiddenIcon).addClass(notHiddenIcon);
    $("section.info").show();
    isHidden = false;
  }
}

function testRequest(){
  //this is a test http request
  $.ajax({
    type: "get",
    url:"https://fsdiapi.azurewebsites.net/",
    success: function(data){
      console.log("Success: ", data);
    },
    error: function(details){
      console.log("Error: ", details);
    }
  });
}

function fetchTasks(){
  // send a get request
  // do not pass data
  $.ajax({
    type: "get",
    url: "https://fsdiapi.azurewebsites.net/api/tasks",
    success: function(response){
      // console log the response
      console.log("Server says...OK");

      let allTasks = JSON.parse(response);
      // travel the array
      let myName = "Julian";
      for(let i=0; i<allTasks.length; i++){
        // send every task to displayTask
        task =allTasks[i];
        
        if(task.name==myName){
          displayTask(task);
        }
      }
    },
    error: function(details){
      console.log("Sorry...", details);
    }
  });
  
  
}
function init() {
  console.log("Task Manager");

  //load prev data
  fetchTasks();
  // catch events
  $("#btnSave").click(saveTask);
  $("#important").click(changeIcon);
  $("#hideBtn").click(hideInfo);
}

window.onload = init;

/* 
To clear all tasks
- Send a DELETE request to https://fsdiapi.azurewebsites.net/api/tasks/clear/<name>
*/