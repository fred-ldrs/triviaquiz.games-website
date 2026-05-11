import { db } from './firebase-config.js';
import { CATEGORY_LABELS } from './categories.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const PAGE_SIZE = 10;

const loadingEl  = document.getElementById('loading-state');
const errorEl    = document.getElementById('error-state');
const listEl     = document.getElementById('question-list');
const pagination = document.getElementById('pagination');
const prevBtn    = document.getElementById('prev-btn');
const nextBtn    = document.getElementById('next-btn');
const pageInfo   = document.getElementById('page-info');
const filterEl   = document.getElementById('topic-filter');

let allQuestions = [];
let filtered     = [];
let currentPage  = 1;

async function loadQuestions() {
    loadingEl.hidden  = false;
    errorEl.hidden    = true;
    listEl.hidden     = true;
    pagination.hidden = true;

    try {
        const q = query(
            collection(db, 'community_questions'),
            where('status', 'in', ['approved', 'implemented'])
        );
        const snap = await getDocs(q);
        allQuestions = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        applyFilter();
    } catch (err) {
        console.error('Firestore error:', err);
        loadingEl.hidden = true;
        errorEl.hidden   = false;
        errorEl.textContent = 'Could not load questions. Please try again later.';
    }
}

function applyFilter() {
    const topic = filterEl.value;
    filtered = topic
        ? allQuestions.filter(q => q.topic === topic)
        : allQuestions;
    currentPage = 1;
    render();
}

function render() {
    loadingEl.hidden = true;
    listEl.innerHTML = '';

    if (filtered.length === 0) {
        listEl.innerHTML = '<li class="question-empty">No questions found for this category yet. <a href="../submit/">Be the first to submit one!</a></li>';
        listEl.hidden     = false;
        pagination.hidden = true;
        return;
    }

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const start      = (currentPage - 1) * PAGE_SIZE;
    const pageItems  = filtered.slice(start, start + PAGE_SIZE);

    pageItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'question-item';
        li.innerHTML = `
            <div class="question-text">${escHtml(item.question)}</div>
            <div class="question-answer"><span class="answer-label">Answer:</span> ${escHtml(item.answer)}</div>
            ${item.wrongAnswers && item.wrongAnswers.length
                ? `<div class="question-wrong"><span class="answer-label">Wrong answers:</span> ${item.wrongAnswers.map(w => escHtml(w)).join(', ')}</div>`
                : ''}
            <div class="question-meta">
                <span class="question-category"><i class="fas fa-tag"></i> ${escHtml(item.topic || '')}${item.category ? ' · ' + escHtml(CATEGORY_LABELS[item.category] ?? item.category) : ''}</span>
                ${item.difficulty ? `<span class="question-difficulty difficulty--${escHtml(item.difficulty)}">${escHtml(item.difficulty)}</span>` : ''}
                ${item.author ? `<span class="question-author"><i class="fas fa-user"></i> ${escHtml(item.author)}</span>` : ''}
            </div>`;
        listEl.appendChild(li);
    });

    listEl.hidden     = false;
    pagination.hidden = totalPages <= 1;

    prevBtn.disabled  = currentPage === 1;
    nextBtn.disabled  = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function escHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

prevBtn.addEventListener('click', () => { currentPage--; render(); window.scrollTo(0, 0); });
nextBtn.addEventListener('click', () => { currentPage++; render(); window.scrollTo(0, 0); });
filterEl.addEventListener('change', applyFilter);

loadQuestions();
