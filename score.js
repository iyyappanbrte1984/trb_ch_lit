const questions = [
  {
    id: 1,
    text: "ரா. பொன்ராசனின் உண்மைப் பெயர் என்ன?",
    options: ["ரா. கிருஷ்ணமூர்த்தி", "ரா. கிருஷ்ணன்", "கிருஷ்ணமோகன்", "ரா. கிரிஜா"],
    answer: "b"
  }
];

window.setupQuiz = function () {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  questions.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${q.text}</p>
      ${q.options.map((o,i)=>`
        <label>
          <input type="radio" name="q${q.id}" value="${String.fromCharCode(97+i)}">
          ${o}
        </label><br>
      `).join("")}
    `;
    container.appendChild(div);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit-btn").onclick = async () => {
    let score = 0;
    questions.forEach(q => {
      const sel = document.querySelector(`input[name="q${q.id}"]:checked`);
      if (sel && sel.value === q.answer) score++;
    });

    const { data } = await supabaseClient.auth.getUser();
    if (!data.user) return;

    await supabaseClient.from("results").insert({
      user_id: data.user.id,
      score,
      total: questions.length
    });

    document.getElementById("submit-message").textContent =
      `உங்கள் மதிப்பெண்: ${score}/${questions.length}`;
    loadScores();
  };
});

window.loadScores = async function () {
  const list = document.getElementById("score-list");
  list.innerHTML = "";

  const { data: user } = await supabaseClient.auth.getUser();
  if (!user.user) return;

  const { data } = await supabaseClient
    .from("results")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });

  data.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.score}/${r.total}`;
    list.appendChild(li);
  });
};
