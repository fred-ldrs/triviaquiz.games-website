// Submit form UI – topic → category → difficulty
// Runs independently of Firebase so dropdowns work even before Firebase loads.

const CATEGORIES = {
    'Bitcoin': [
        { value: 'General Knowledge', label: 'General Knowledge' },
        { value: 'History',           label: 'History' },
        { value: 'Culture',           label: 'Culture' },
        { value: 'Tech',              label: 'Tech' }
    ],
    'Board Game': [
        { value: 'award',                 label: 'Award' },
        { value: 'designer_artist',       label: 'Designer / Artist' },
        { value: 'original_publisher',    label: 'Original Publisher' },
        { value: 'original_release_year', label: 'Original Release Year' },
        { value: 'setting',               label: 'Setting' },
        { value: 'mechanic',              label: 'Mechanic' },
        { value: 'misc_facts',            label: 'Misc Facts' }
    ]
};

const topicEl    = document.getElementById('topic');
const categoryEl = document.getElementById('category');
const diffGroup  = document.getElementById('group-difficulty');
const diffEl     = document.getElementById('difficulty');

topicEl.addEventListener('change', () => {
    const topic = topicEl.value;
    if (!topic) {
        categoryEl.innerHTML = '<option value="">\u2014 Select a topic first \u2014</option>';
        categoryEl.disabled = true;
        diffGroup.hidden = true;
        return;
    }
    categoryEl.innerHTML = '<option value="">\u2014 Select a category \u2014</option>' +
        CATEGORIES[topic].map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    categoryEl.disabled = false;
    diffGroup.hidden = (topic !== 'Bitcoin');
    if (topic !== 'Bitcoin') diffEl.value = '';
});
