import { wordList } from "./word.js";
import { clickedSound, gameOverSound, victorySound } from "./sounds.js";

const inputs = document.querySelector(".inputs");
const resetBtn = document.querySelector(".reset-btn");
const hint = document.querySelector(".hint span");
const guessLeft = document.querySelector(".guess-left span");
const typingInput = document.querySelector(".typing-input");
const wrongLetter = document.querySelector(".wrong-letter span");
const smileImg = document.querySelector(".smile-img");

let word;
let incorrect = [];
let correct = [];
let maxGuesses;
guessLeft.textContent = 8;

function randomWord() {
  let ranObj = wordList[Math.floor(Math.random() * wordList.length)];
  word = ranObj.word;

  wrongLetter.textContent = "";
  hint.textContent = ranObj.hint;

  maxGuesses = 8;
  guessLeft.textContent = 8;
  incorrect = [];
  correct = [];
  wrongLetter.textContent = incorrect;
  smileImg.src = "icons/smile.svg";

  let html = "";
  for (let i = 0; i < word.length; i++) {
    html += `<input type="text" disabled></input>`;
  }
  inputs.innerHTML = html;
}
randomWord();

function initGame(e) {
  const key = e.target.value;
  if (
    key.match(/^[A-Za-z]+$/) &&
    !incorrect.includes(` ${key}`) &&
    !correct.includes(key)
  ) {
    if (word.includes(key)) {
      //Если буква введенная пользователем есть в слове
      for (let i = 0; i < word.length; i++) {
        if (word[i] == key) {
          smileImg.src = "icons/smile.svg";
          correct.push(key); //Пушим в массив верные буквы
          inputs.querySelectorAll("input")[i].value = key;
        }
      }
    } else {
      smileImg.src = "icons/sad.svg";
      maxGuesses--; //Если ошибаемся количество попыток уменьшается соответственно
      incorrect.push(` ${key}`); //Пушим в массив неверные буквы
    }
    wrongLetter.textContent = incorrect;
    guessLeft.textContent = maxGuesses;
  }
  typingInput.value = "";

  //Небольшая задержка для верного отображения
  setTimeout(() => {
    if (correct.length === word.length) {
      victorySound.play();
      setTimeout(() => {
        alert(`Congratulations! You guest the word ${word.toUpperCase()}`);
        resetBtn.click();
      }, 100);
    } else if (maxGuesses < 1) {
      gameOverSound.play();
      alert("You LOSE. You have no ramaining guesses left");
      for (let i = 0; i < word.length; i++) {
        inputs.querySelectorAll("input")[i].value = word[i];
      }
    }
  });
}

resetBtn.addEventListener("click", randomWord);
document.addEventListener("keydown", () => {
  typingInput.focus();
  clickedSound.play();
});
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
