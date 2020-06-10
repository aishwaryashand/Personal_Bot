var messages = [], //array that hold the record of each string in chat
lastUserMessage = "", //keeps track of the most recent input string from the user
botMessage = "", //var keeps track of what the chatbot is going to say
botName = 'Genie', //name of the chatbot
userName = 'You'
talking = false, //when false the speach function doesn't work
state = 0,
select_covid_case = "",
asked_ques = "",
corona_ques = {
  "1": "First tell me the what you want to know about, <br> 1.) Total Cases 2.) Total Deaths 3.) Total Recovered cases",
  "2": "Do you want to know the country having least cases?",
  "3": "Do you want to know the country having maximum cases?"
};

messages.push("<b>" + botName + ":</b> " + "Hi there!");

async function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    lastUserMessage = document.getElementById("chatbox").value; //pulls the value from the chatbox ands sets it to lastUserMessage
    await bots_msg();
    document.getElementById("chatbox").value = ""; //sets the chat box to be clear
    messages.push("<b>" + userName + ":</b> " + lastUserMessage); //adds the value of the chatbox to the array messages
    messages.push("<b>" + botName + ":</b> " + botMessage); //add the chatbot's name and message to the array messages
    Speech(botMessage);
    //outputs the last few array elements of messages to html
    for (var i = 1; i < 8; i++) {
      if (messages[messages.length - i])
        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
    }
  }
}

async function bots_msg(){
  if (state === 0) {
    botMessage = "I can tell you about some facts and myths or about this pandemic."
    state = 1;
  }
  else if(state === 1){
    await $.get("/getpythondata/"+lastUserMessage, function(data){
      if (data != "Umm, I didn't get you..") {
        asked_ques = data;
        state = 2;
      }
      botMessage = data;
    });
  }
  else if (state === 2){
    if (lastUserMessage.toLowerCase().includes("no")){
      botMessage = "What else do you want to know about?";
      state = 1;
    }
    else if (lastUserMessage.toLowerCase().includes("yes")) {
      corona_data_res();
    }
    else {
      botMessage = "Tell me the country name now";
      select_covid_case = lastUserMessage;
      state = 3;
    }
  }
  else if (state === 3){
    setTimeout('', 3000);
    corona_data_res();
  }
}

function corona_data_res(){
  if (corona_data != undefined) {
    if (asked_ques == corona_ques[1]) {
      for (var i = 0; i < corona_data.length; i++) {
        if (lastUserMessage.includes(corona_data[i].country.toLowerCase())){
          if (select_covid_case.includes("total cases") || select_covid_case.includes("1")) {
            botMessage = "Total cases in "+corona_data[i].country + " are " + corona_data[i].total_cases;
          }
          else if (select_covid_case.includes("total deaths") || select_covid_case.includes("deaths") || select_covid_case.includes("2")) {
            botMessage = "Total death cases in "+corona_data[i].country + " are " + corona_data[i].total_deaths;
          }
          else if (select_covid_case.includes("total recovered cases") || select_covid_case.includes("recovered") || select_covid_case.includes("recovered cases") || select_covid_case.includes("3")) {
            botMessage = "Total recovered cases in "+corona_data[i].country + " are " + corona_data[i].total_recovered;
          }
          state = 1;
          break;
        }
        else {
          botMessage = "Please provide proper country name";
        }
      }
    }
    else if (asked_ques == corona_ques[2]){
      botMessage = "Least Cases is in "+corona_data[corona_data.length - 1].country+" with "+corona_data[corona_data.length - 1].total_cases+" total cases.";
    }
    else if (asked_ques == corona_ques[3]){
      botMessage = "Maximum Cases is in "+corona_data[1].country+" with "+corona_data[0].total_cases+" total cases.";
    }
  }
  botMessage+="<br>What else?";
  state = 1;
}

function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    speechSynthesis.speak(utterance);
  }
}

document.onkeypress = keyPress; //runs the keypress() function when a key is pressed
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    newEntry(); //if the key pressed is 'enter' runs the function newEntry()
  }
}

//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}

let corona_data;
$.ajax({
  url: "https://corona-virus-stats.herokuapp.com/api/v1/cases/countries-search?order=total_cases&how=desc&limit=220",
  type: "GET",
  success: function(data){
    if(data.status == "success"){
      corona_data = data.data.rows;
    }
  }
});
