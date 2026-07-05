import { generateQuiz } from './cocktailorcolor.js';

const TOTAL = 10;

// DOM refs
const screenEl   = document.getElementById('quiz-screen');
const resultsEl  = document.getElementById('quiz-results');
const qNameEl    = document.getElementById('q-name');
const qCurrentEl = document.getElementById('q-current');
const qTotalEl   = document.getElementById('q-total');
const qBarEl     = document.getElementById('q-bar');
const feedbackEl = document.getElementById('q-feedback');
const btnCocktail= document.getElementById('btn-cocktail');
const btnColor   = document.getElementById('btn-color');
const btnRestart = document.getElementById('btn-restart');
const resScoreEl = document.getElementById('res-score');
const resVerdictEl = document.getElementById('res-verdict');
const reviewListEl = document.getElementById('review-list');

let questions = [];
let current   = 0;
let score     = 0;
let answers   = []; // { name, type, guess, correct }

const VERDICTS = [
    [10, 'Perfect! You\'re a true connoisseur. 🏆'],
    [9,  'Excellent! Almost flawless.'],
    [7,  'Great job! You clearly have taste.'],
    [5,  'Not bad — but a few names fooled you.'],
    [3,  'Tricky, right? Give it another try!'],
    [0,  'The names got you this time. Practice makes perfect!'],
];

function verdict(s) {
    return VERDICTS.find(([min]) => s >= min)[1];
}

function startQuiz() {
    questions  = generateQuiz(TOTAL);
    current    = 0;
    score      = 0;
    answers    = [];
    qTotalEl.textContent = TOTAL;
    resultsEl.hidden  = true;
    screenEl.hidden   = false;
    showQuestion();
}

function showQuestion() {
    const q = questions[current];
    qNameEl.textContent    = q.name;
    qCurrentEl.textContent = current + 1;
    qBarEl.style.width     = `${(current / TOTAL) * 100}%`;
    feedbackEl.textContent = '';
    feedbackEl.className   = 'quiz-feedback';
    btnCocktail.disabled   = false;
    btnColor.disabled      = false;
}

function handleAnswer(guess) {
    btnCocktail.disabled = true;
    btnColor.disabled    = true;

    const q       = questions[current];
    const correct = guess === q.type;
    if (correct) score++;

    answers.push({ name: q.name, type: q.type, guess, correct });

    feedbackEl.textContent = correct
        ? `✓ Correct — ${q.name} is a ${q.type}!`
        : `✗ Nope — ${q.name} is actually a ${q.type}.`;
    feedbackEl.className = 'quiz-feedback ' +
        (correct ? 'quiz-feedback--correct' : 'quiz-feedback--wrong');

    current++;
    if (current < TOTAL) {
        setTimeout(showQuestion, 900);
    } else {
        setTimeout(showResults, 1000);
    }
}

function showResults() {
    // progress bar full
    qBarEl.style.width = '100%';

    resScoreEl.textContent  = score;
    resVerdictEl.textContent = verdict(score);

    reviewListEl.innerHTML = '';
    answers.forEach(a => {
        const li = document.createElement('li');
        li.className = a.correct ? 'r-correct' : 'r-wrong';
        li.innerHTML = `
            <span class="review-name">${a.name}</span>
            <span class="review-badge review-badge--${a.type}">${a.type}</span>
            <span class="review-icon ${a.correct ? 'review-icon--correct' : 'review-icon--wrong'}">
                <i class="fas ${a.correct ? 'fa-check' : 'fa-xmark'}"></i>
            </span>
        `;
        reviewListEl.appendChild(li);
    });

    screenEl.hidden  = true;
    resultsEl.hidden = false;
}

btnCocktail.addEventListener('click', () => handleAnswer('cocktail'));
btnColor.addEventListener('click',    () => handleAnswer('color'));
btnRestart.addEventListener('click',  startQuiz);

startQuiz();
