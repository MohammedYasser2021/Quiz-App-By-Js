// select elements
let countSpan = document.querySelector('.count span')
let bullets = document.querySelector('.bullets')
let bulletSpansContainer = document.querySelector('.bullets .spans')
let quizArea = document.querySelector('.quiz-area')
let answersArea = document.querySelector('.answers-area')
let submitAnswer = document.querySelector('.submit-btn')
let resultsDiv = document.querySelector('.results')
let countdownSpan = document.querySelector('.count-down')

// set options
let currentIndex = 0
let rightAnswers = 0
let countdownInterval
// get questions function
function getQustions() {
  let myRequest = new XMLHttpRequest()

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText)
      let questionsCount = questionsObject.length

      // create bullets + set questions count
      createBullets(questionsCount)

      // add questions data
      addQuestions(questionsObject[currentIndex], questionsCount)

      // start count down
      countdown(10, questionsCount)

      // check answers function
      submitAnswer.addEventListener('click', function () {
        // start count down
        clearInterval(countdownInterval)
        countdown(10, questionsCount)
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer

        // increase currentIndex
        currentIndex++

        // check the answer
        checkAnswer(theRightAnswer, questionsCount)

        // empty quizArea
        quizArea.innerHTML = ''
        // empty answersArea
        answersArea.innerHTML = ''

        // add next question
        addQuestions(questionsObject[currentIndex], questionsCount)

        // handle bullets class
        handleBullets()

        // show results
        showResults(questionsCount)
      })
    }
  }
  myRequest.open('GET', 'questions.json', true)
  myRequest.send()
}

getQustions()

// create bullets depend on questions number
function createBullets(num) {
  countSpan.innerHTML = num

  // create spans
  for (let i = 0; i < num; i++) {
    // create bullet spans
    let bulletSpan = document.createElement('span')
    // check if first span, add class on to it
    if (i === 0) {
      bulletSpan.className = 'on'
    }
    // append bullets to the bullets container
    bulletSpansContainer.appendChild(bulletSpan)
  }
}

// function add questions
function addQuestions(obj, count) {
  if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement('h2')

    // create question text
    let questionText = document.createTextNode(`${obj.title} ?`)

    // append question text to h2 question title
    questionTitle.appendChild(questionText)

    // append h2 question title to quiz area
    quizArea.appendChild(questionTitle)

    // create answers of question
    for (let i = 1; i <= 4; i++) {
      // create main div
      let answerDiv = document.createElement('div')
      answerDiv.className = 'answer'

      // create input
      let answerInput = document.createElement('input')
      answerInput.type = 'radio'
      answerInput.id = `answer_${i}`
      answerInput.name = 'question'
      answerInput.dataset.answer = obj[`answer_${i}`]

      // make first input is checked
      if (i === 1) {
        answerInput.checked = 'checked'
      }
      // create label
      let answerLabel = document.createElement('label')
      answerLabel.setAttribute('for', `answer_${i}`)
      let answerLabelText = document.createTextNode(obj[`answer_${i}`])
      answerLabel.appendChild(answerLabelText)

      // append label and input to main div
      answerDiv.appendChild(answerInput)
      answerDiv.appendChild(answerLabel)

      // append main div to answers area
      answersArea.appendChild(answerDiv)
    }
  }
}

// check answer function

function checkAnswer(theRAnswer, count) {
  let answers = document.getElementsByName('question')
  let theChoosenAnswer
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer
    }
  }

  if (theRAnswer === theChoosenAnswer) {
    rightAnswers++
  }
}

// handle bullets function
function handleBullets() {
  let bulletsSpans = document.querySelectorAll('.bullets .spans span')
  let arrayOfSpans = Array.from(bulletsSpans)

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add('on')
    }
  })
}

// show results
function showResults(count) {
  let theResult
  if (currentIndex === count) {
    quizArea.remove()
    answersArea.remove()
    submitAnswer.remove()
    bullets.remove()

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good">Good</span>, You Answered ${rightAnswers} From ${count}`
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span>, You Answered ${rightAnswers} From ${count}`
    } else {
      theResult = `<span class="bad">Weak</span>, You Answered ${rightAnswers} From ${count}`
    }
    resultsDiv.innerHTML = theResult
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60)
      seconds = parseInt(duration % 60)

      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      if (seconds < 10) {
        seconds = `0${seconds}`
      }

      countdownSpan.innerHTML = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`
      if (--duration < 0) {
        clearInterval(countdownInterval)
        submitAnswer.click()
      }
    }, 1000)
  }
}
