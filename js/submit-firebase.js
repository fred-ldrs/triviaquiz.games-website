import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const form        = document.getElementById('submit-form');
const feedback    = document.getElementById('form-feedback');
const submitBtn   = document.getElementById('submit-btn');
const categoryEl  = document.getElementById('category');
const diffGroup   = document.getElementById('group-difficulty');
const diffEl      = document.getElementById('difficulty');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const question   = form.question.value.trim();
    const answer     = form.answer.value.trim();
    const topic      = form.topic.value;
    const category   = form.category.value;
    const difficulty = form.difficulty.value || null;
    const wrong1     = form.wrong1.value.trim();
    const wrong2     = form.wrong2.value.trim();
    const wrong3     = form.wrong3.value.trim();
    const author     = form.author.value.trim();

    if (!question || !answer || !topic || !category) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.classList.add('form-feedback--error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting\u2026';

    const wrongAnswers = [wrong1, wrong2, wrong3].filter(w => w.length > 0);

    try {
        await addDoc(collection(db, 'community_questions'), {
            question,
            answer,
            topic,
            category,
            difficulty,
            wrongAnswers: wrongAnswers.length > 0 ? wrongAnswers : null,
            author:    author || null,
            status:    'pending',
            createdAt: serverTimestamp()
        });

        form.reset();
        categoryEl.innerHTML = '<option value="">\u2014 Select a topic first \u2014</option>';
        categoryEl.disabled = true;
        diffGroup.hidden = true;
        diffEl.value = '';

        feedback.textContent = '\u2713 Thank you! Your question has been submitted and will be reviewed shortly.';
        feedback.classList.add('form-feedback--success');
    } catch (err) {
        console.error('Firestore error:', err);
        feedback.textContent = 'Something went wrong. Please try again later.';
        feedback.classList.add('form-feedback--error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Question';
    }
});
