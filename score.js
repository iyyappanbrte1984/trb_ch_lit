// இது login.js-ல் உள்ள supabaseClient instance-ஐ reuse செய்கிறது

// உங்கள் 100 MCQ question-கள் array (சுருக்கமாக சில மட்டும் example)
const questions = [
  {
    id: 1,
    text: "ரா. பொன்ராசனின் உண்மைப் பெயர் என்ன?",
    options: ["ரா. கிருஷ்ணமூர்த்தி", "ரா. கிருஷ்ணன்", "கிருஷ்ணமோகன்", "ரா. கிரிஜா"],
    answer: "b"
  },
  {
    id: 2,
    text: "ரா. பொன்ராசன் பிறந்த வருடம் எது?",
    options: ["1920", "1925", "1927", "1930"],
    answer: "c"
  },
  // ... உங்கள் எல்லா 100 கேள்விகளையும் இதே format-ல் சேர்க்கவும் ...
];

let quizStartTime = null;

window.setupQuiz = function () {
  const container = document.getElementById('questions-container');
  const totalQuestionsEl = document.getElementById('total-questions');
  const scoreDisplay = document.getElementById('score-display');

  container.innerHTML = '';
  scoreDisplay.textContent = '0';

  questions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';
    const optsHtml = q.options.map((opt, i) => {
      const letter = String.fromCharCode(97 + i); // a,b,c,d
      return `
        <label class="option">
          <input type="radio" name="q${q.id}" value="${letter}">
          ${letter}) ${opt}
        </label>
      `;
    }).join('');
    div.innerHTML = `
      <div class="question-text">${idx + 1}. ${q.text}</div>
      ${optsHtml}
    `;
    container.appendChild(div);
  });

  totalQuestionsEl.textContent = questions.length.toString();
  quizStartTime = Date.now();
  startTimer();
};

let timerInterval = null;
function startTimer() {
  const timeDisplay = document.getElementById('time-display');
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!quizStartTime) return;
    const sec = Math.floor((Date.now() - quizStartTime) / 1000);
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    timeDisplay.textContent = `${m}:${s}`;
  }, 1000);
}

// Submit & save
document.getElementById('submit-btn').addEventListener('click', async () => {
  const scoreDisplay = document.getElementById('score-display');
  const submitMessage = document.getElementById('submit-message');

  let score = 0;
  questions.forEach(q => {
    const sel = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (sel && sel.value === q.answer) {
      score++;
    }
  });

  scoreDisplay.textContent = score.toString();
  const durationSeconds = Math.floor((Date.now() - quizStartTime) / 1000);

  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData.user) {
    submitMessage.textContent = 'Login செய்ய வேண்டியுள்ளது.';
    return;
  }

  const { error } = await supabaseClient
    .from('results')
    .insert({
      user_id: userData.user.id,
      score,
      total: questions.length,
      duration_seconds: durationSeconds
    });

  if (error) {
    submitMessage.textContent = 'Marks save செய்ய முடியவில்லை: ' + error.message;
  } else {
    submitMessage.textContent = `உங்கள் மதிப்பெண் ${score}/${questions.length} backend-ல் சேமிக்கப்பட்டுள்ளது.`;
    if (window.loadScores) {
      window.loadScores();
    }
  }
});

// Previous scores
window.loadScores = async function () {
  const list = document.getElementById('score-list');
  list.innerHTML = '';

  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData.user) return;

  const { data, error } = await supabaseClient
    .from('results')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    const li = document.createElement('li');
    li.textContent = 'Marks load error: ' + error.message;
    list.appendChild(li);
    return;
  }

  if (!data || data.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'முந்தைய முயற்சிகள் எதுவும் இல்லை.';
    list.appendChild(li);
    return;
  }

  data.forEach(r => {
    const li = document.createElement('li');
    const d = new Date(r.created_at);
    li.textContent = `${d.toLocaleString()} – ${r.score}/${r.total} (நேரம்: ${r.duration_seconds} விநாடிகள்)`;
    list.appendChild(li);
  });
};
