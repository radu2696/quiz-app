// State object
var state = {
  questions: [
    {
      text: "John F. Kennedy was assassinated in",
      choices: ["1973", "Dallas", "1958", "Austin"],
      correctChoiceIndex: 1,
      feedback: "JFK was assassinated while driving through Dallas in November 1963.",
    },
    {
      text: "Who fought in the war of 1812?",
      choices: ["Andrew Jackson", "Arthur Wellsley", "Otto von Bismarck", "Napoleon"],
      correctChoiceIndex: 0,
      feedback: "Andrew Jackson was the commanding general of the Battle of New Orleans in 1815. Napoleon also fought during this time, but in the aptly named Napoleonic wars.",
    },
    {
      text: "Which general famously stated 'I shall return'?",
      choices: ["Bull Halsey", "George Patton", "Douglas MacArthur", "Omar Bradley"],
      correctChoiceIndex: 2,
      feedback: "Douglas MacArthur famously stated 'I shall return' after leaving Bataan in 1942 fleeing from the conquering Japanese. He in fact did return.",
    },
    {
      text: "Adolf Hitler was born in which country?",
      choices: ["France", "Germany", "Austria", "Hungary"],
      correctChoiceIndex: 2,
      feedback:"Hitler was born in Lintz, Austria near the German border.",
    },
    {
      text: "World War I began in which year?",
      choices: ["1923", "1914", "1938", "1917"],
      correctChoiceIndex: 1,
      feedback:"World War I began shortly after the assassination of Arch-Duke Ferdinand of the Austro-Hungarian empire in 1914.",
    },
     {
      text: "American involvement in the Korean War took place in which decade?",
      choices: ["1970s", "1950s", "1920s", "1960s"],
      correctChoiceIndex: 1,
      feedback:"The American involvement in the Korean war lasted from 1950-1953.",
    },
    {
      text: "The Battle of Hastings in 1066 was fought in which country?",
      choices: ["France", "Russia", "England", "Norway"],
      correctChoiceIndex: 2,
      feedback:"The battle of Hastings was the definitive battle between the Saxons and the Normans for control of England. William the Conqueror defeated King Herod of the Saxons at Hastings.",
    },
    {
      text: "The Magna Carta was published by the King of which country?",
      choices: ["France", "Austria", "Italy", "England"],
      correctChoiceIndex: 3,
      feedback:"The Magna Carta was created in 1215 issued by King John I of England. It was a document that signed away much of the King's power and is one of the first major political documents.",
    }
  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
};

// State modification functions
function setRoute(state, route) {
  state.route = route;
};

function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

function answerQuestion(state, answer) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  /*selectFeedback(state);*/
  setRoute(state, 'answer-feedback');
};

/*function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};
*/
function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'final-feedback');
  }
  else {
    setRoute(state, 'question');
  }
};

// Render functions
function renderApp(state, elements) {
  // default to hiding all routes, then show the current route
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  }); 
  elements[state.route].show();

  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  else if (state.route === 'question') {
      renderQuestionPage(state, elements[state.route]);
  }
  else if (state.route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.route]);
  }
  else if (state.route === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.route]);
  }
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
function renderStartPage(state, element) {
};

function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

function renderFinalFeedbackPage(state, element) {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

function renderChoices(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
  var html = state.lastAnswerCorrect ?
      "<h1 class='user-was-correct'>Correct</h1>" :
      "<h1 class='user-was-incorrect'>This is not correct</h1>";
  element.html(html);
};


function renderAnswerFeedbackText(state, element) {
  var text = state.questions[state.currentQuestionIndex].feedback;
  element.text(text);
};

//Sets the text for the button to "Next question"( if there are more questions to answear) or "Show me the results" if every question has been asnweared. 
function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next question" : "Show me the results";
  element.text(text);
};

function renderFinalFeedbackText(state, element) {
  var text = "You got " + state.score + " out of " +
    state.questions.length + " questions right.";

    if(state.score>state.questions.length/2)
      text = text + " Excelent!";
    else if(state.score<state.questions.length)
      text = text + " I am sure you will do better next time!";
  element.text(text);
};

// Event handlers
var PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

//event listerner for start game button
$("form[name='game-start']").submit(function(event) {
  event.preventDefault();
  setRoute(state, 'question');
  renderApp(state, PAGE_ELEMENTS);
});


//even listener for restart game button
$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

//event listener to record play choice for every question
$("form[name='current-question']").submit(function(event) {
  event.preventDefault();
  var answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

//even listener for see next question button
$(".see-next").click(function(event) {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});


//function to render every element
$(function() { renderApp(state, PAGE_ELEMENTS); });