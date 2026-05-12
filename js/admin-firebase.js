import { db } from './firebase-config.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    orderBy,
    query
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ─── Config ───────────────────────────────────────────────────────────────────
// Create this user once in Firebase Console → Authentication → Add user
const ADMIN_EMAIL = 'frederik@triviaquiz.games';

const VALID_STATUSES = ['pending', 'approved', 'implemented', 'declined', 'duplicate', 'needs_edit'];

// ─── DOM ──────────────────────────────────────────────────────────────────────
const gateEl     = document.getElementById('gate');
const adminEl    = document.getElementById('admin');
const pwInput    = document.getElementById('pw-input');
const loginBtn   = document.getElementById('login-btn');
const logoutBtn  = document.getElementById('logout-btn');
const gateError  = document.getElementById('gate-error');
const listEl     = document.getElementById('question-list');
const loadingEl  = document.getElementById('admin-loading');
const emptyEl    = document.getElementById('admin-empty');
const statsBar   = document.getElementById('stats-bar');
const filterTabs = document.querySelectorAll('.filter-tab');

// ─── State ────────────────────────────────────────────────────────────────────
const auth = getAuth();
let allQuestions  = [];
let currentFilter = 'pending';

// ─── Auth ─────────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, user => {
    if (user) {
        gateEl.style.display  = 'none';
        adminEl.style.display = 'block';
        loadQuestions();
    } else {
        gateEl.style.display  = 'flex';
        adminEl.style.display = 'none';
    }
});

loginBtn.addEventListener('click', login);
pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

async function login() {
    gateError.textContent = '';
    loginBtn.disabled = true;
    try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, pwInput.value);
    } catch {
        gateError.textContent = 'Incorrect password.';
        pwInput.value = '';
        pwInput.focus();
    } finally {
        loginBtn.disabled = false;
    }
}

logoutBtn.addEventListener('click', () => signOut(auth));

// ─── Load data ────────────────────────────────────────────────────────────────
async function loadQuestions() {
    loadingEl.hidden = false;
    emptyEl.hidden   = true;
    listEl.innerHTML = '';
    statsBar.hidden  = true;

    try {
        const q    = query(collection(db, 'community_questions'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        allQuestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        updateStats();
        renderFiltered();
    } catch (err) {
        console.error('Firestore error:', err);
        loadingEl.textContent = 'Error loading questions.';
    }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function updateStats() {
    const counts = Object.fromEntries(VALID_STATUSES.map(s => [s, 0]));
    allQuestions.forEach(q => { if (q.status in counts) counts[q.status]++; });

    document.getElementById('stat-total').textContent       = allQuestions.length;
    document.getElementById('stat-pending').textContent     = counts.pending;
    document.getElementById('stat-approved').textContent    = counts.approved;
    document.getElementById('stat-implemented').textContent = counts.implemented;
    document.getElementById('stat-declined').textContent    = counts.declined;
    statsBar.hidden = false;

    const cntPending = document.getElementById('cnt-pending');
    cntPending.textContent = counts.pending ? `(${counts.pending})` : '';
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderFiltered() {
    loadingEl.hidden = true;
    const items = currentFilter === 'all'
        ? allQuestions
        : allQuestions.filter(q => q.status === currentFilter);

    listEl.innerHTML = '';
    if (items.length === 0) { emptyEl.hidden = false; return; }
    emptyEl.hidden = true;
    items.forEach(item => listEl.appendChild(buildCard(item)));
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderFiltered();
    });
});

// ─── Card builder ─────────────────────────────────────────────────────────────
function buildCard(item) {
    const card  = document.createElement('div');
    card.className   = 'question-card';
    card.dataset.status = item.status;
    card.dataset.id     = item.id;

    const date     = item.createdAt?.toDate?.()?.toLocaleDateString('de-DE') ?? '–';
    const wrongHtml = item.wrongAnswers?.length
        ? `<div class="card-wrong"><strong>Wrong answers:</strong> ${item.wrongAnswers.map(escHtml).join(', ')}</div>`
        : '';

    card.innerHTML = `
        <div class="card-question">${escHtml(item.question)}</div>
        <div class="card-answer"><i class="fas fa-check"></i> ${escHtml(item.answer)}</div>
        ${wrongHtml}
        <div class="card-meta">
            <span><i class="fas fa-tag"></i> ${escHtml(item.topic ?? '')}${item.category ? ' · ' + escHtml(item.category) : ''}</span>
            ${item.difficulty ? `<span><i class="fas fa-signal"></i> ${escHtml(item.difficulty)}</span>` : ''}
            ${item.author    ? `<span><i class="fas fa-user"></i> ${escHtml(item.author)}</span>` : ''}
            <span><i class="fas fa-calendar-alt"></i> ${date}</span>
            <span class="status-badge badge-${escHtml(item.status)}">${escHtml(item.status)}</span>
        </div>
        <div class="card-actions" id="actions-${item.id}">
            ${buildActions(item.status, item.id)}
        </div>
    `;
    return card;
}

function buildActions(currentStatus, id) {
    const buttons = [
        { status: 'approved',    label: '✓ Approve',     cls: 'approve'     },
        { status: 'implemented', label: '★ Implemented', cls: 'implemented' },
        { status: 'declined',    label: '✗ Decline',     cls: 'decline'     },
        { status: 'duplicate',   label: '= Duplicate',   cls: 'duplicate'   },
        { status: 'needs_edit',  label: '✎ Needs Edit',  cls: 'needs-edit'  },
        { status: 'pending',     label: '↩ Reset',       cls: ''            },
    ];
    return buttons
        .filter(b => b.status !== currentStatus)
        .map(b =>
            `<button class="action-btn ${b.cls}"
                data-status="${escHtml(b.status)}"
                data-id="${escHtml(id)}"
                aria-label="Set status to ${escHtml(b.status)}">${b.label}</button>`
        )
        .join('');
}

// ─── Status update (event delegation) ────────────────────────────────────────
listEl.addEventListener('click', async e => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;

    const newStatus = btn.dataset.status;
    const id        = btn.dataset.id;

    // Validate inputs to prevent unexpected Firestore writes
    if (!VALID_STATUSES.includes(newStatus) || !id) return;

    const actionsEl = document.getElementById(`actions-${id}`);
    actionsEl?.querySelectorAll('button').forEach(b => b.disabled = true);

    try {
        await updateDoc(doc(db, 'community_questions', id), { status: newStatus });

        // Update local state
        const item = allQuestions.find(q => q.id === id);
        if (item) item.status = newStatus;

        updateStats();

        // Update card in-place
        const card = listEl.querySelector(`.question-card[data-id="${id}"]`);
        if (card) {
            card.dataset.status = newStatus;
            const badge = card.querySelector('.status-badge');
            if (badge) {
                badge.className   = `status-badge badge-${newStatus}`;
                badge.textContent = newStatus;
            }
            if (actionsEl) actionsEl.innerHTML = buildActions(newStatus, id);
        }

        // Remove from view if it no longer matches the active filter
        if (currentFilter !== 'all' && currentFilter !== newStatus) {
            card?.remove();
            if (!listEl.children.length) emptyEl.hidden = false;
        }
    } catch (err) {
        console.error('Update failed:', err);
        actionsEl?.querySelectorAll('button').forEach(b => b.disabled = false);
        alert('Failed to update status. See console for details.');
    }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
