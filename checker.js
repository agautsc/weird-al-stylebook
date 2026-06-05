const draft = document.querySelector("#draft");
const form = document.querySelector("#checker-form");
const findingsList = document.querySelector("#findings");
const severityValue = document.querySelector("#severity");
const verdict = document.querySelector("#verdict");
const wordCount = document.querySelector("#word-count");
const issueCount = document.querySelector("#issue-count");
const sampleButton = document.querySelector("#sample-button");
const clearButton = document.querySelector("#clear-button");

const rules = [
  {
    title: "Your vs. you're",
    regex: /\byour\s+(an|going|not|the|very|welcome|wrong|right|doing|supposed|able)\b/gi,
    suggestion: "Try \"you're\" if you mean \"you are.\"",
    al: "A tiny apostrophe just filed a missing-person report.",
    severity: 3
  },
  {
    title: "Its vs. it's",
    regex: /\bits\s+(raining|not|going|been|time|a|the|very)\b/gi,
    suggestion: "Use \"it's\" when you mean \"it is\" or \"it has.\"",
    al: "Possession and contraction are different instruments in the same polka band.",
    severity: 3
  },
  {
    title: "Should of",
    regex: /\b(should|could|would|must|might)\s+of\b/gi,
    suggestion: "Use \"$1 have.\"",
    al: "The phrase wanted to be a helping verb and took a wrong turn.",
    severity: 4
  },
  {
    title: "Could care less",
    regex: /\bcould care less\b/gi,
    suggestion: "Use \"couldn't care less\" unless you do, in fact, care some amount.",
    al: "Mathematically, this insult still has room to care.",
    severity: 4
  },
  {
    title: "For all intensive purposes",
    regex: /\bfor all intensive purposes\b/gi,
    suggestion: "Use \"for all intents and purposes.\"",
    al: "The purposes are not intensive. They are just disappointed.",
    severity: 5
  },
  {
    title: "Alot",
    regex: /\balot\b/gi,
    suggestion: "Use \"a lot.\"",
    al: "Two words. One space. Everybody breathe.",
    severity: 2
  },
  {
    title: "Irregardless",
    regex: /\birregardless\b/gi,
    suggestion: "Use \"regardless.\"",
    al: "This word arrived wearing a fake mustache.",
    severity: 3
  },
  {
    title: "Literally",
    regex: /\bliterally\s+(died|exploded|melted|starved|froze)\b/gi,
    suggestion: "If this did not physically happen, consider \"figuratively\" or remove it.",
    al: "If this is literal, please stop editing and seek assistance.",
    severity: 3
  },
  {
    title: "Double negative",
    regex: /\b(?:don't|do not|didn't|did not|can't|cannot|won't|will not)\s+\w+\s+(?:no|nothing|none|nobody|nowhere)\b/gi,
    suggestion: "Use one negative unless you are writing blues lyrics or formal logic.",
    al: "Two negatives walked in. Only one should leave.",
    severity: 3
  },
  {
    title: "Repeated word",
    regex: /\b([a-z]+)\s+\1\b/gi,
    suggestion: "Remove the duplicate word.",
    al: "The echo effect is charming on stage, less so in prose.",
    severity: 2
  },
  {
    title: "Exclamation surplus",
    regex: /!{2,}/g,
    suggestion: "Use one exclamation point, then let the sentence do its job.",
    al: "Punctuation volume knob found at eleven.",
    severity: 2
  },
  {
    title: "Mystery ellipsis",
    regex: /\.{4,}|…{2,}/g,
    suggestion: "Use a single ellipsis or a period.",
    al: "The sentence appears to be backing slowly out of the room.",
    severity: 2
  }
];

const sampleText = "Your going to love this alot!!! I should of proofread it, but for all intensive purposes its fine. I literally died when I saw the the typo.";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getMatches(text) {
  return rules.flatMap((rule) => {
    const matches = [...text.matchAll(rule.regex)];
    return matches.map((match) => ({
      ...rule,
      phrase: match[0],
      index: match.index
    }));
  }).sort((a, b) => a.index - b.index);
}

function getVerdict(score, issues) {
  if (!draft.value.trim()) return "Awaiting evidence.";
  if (issues === 0) return "Clean enough to send without a ceremonial accordion solo.";
  if (score <= 3) return "Mostly harmless. A light editorial eyebrow raise.";
  if (score <= 7) return "Noticeable word crimes. Fix before the parody writes itself.";
  return "High alert. The grammar police have requested backup vocals.";
}

function renderReport() {
  const text = draft.value;
  const matches = getMatches(text);
  const words = text.trim().match(/\b[\w'-]+\b/g) || [];
  const score = Math.min(10, matches.reduce((sum, item) => sum + item.severity, 0));

  wordCount.textContent = words.length;
  issueCount.textContent = matches.length;
  severityValue.textContent = score;
  verdict.textContent = getVerdict(score, matches.length);

  if (!text.trim()) {
    findingsList.innerHTML = '<li class="empty">Type something and summon the accordion of accountability.</li>';
    return;
  }

  if (matches.length === 0) {
    findingsList.innerHTML = '<li class="empty">No obvious Word Crimes detected. The desk remains suspicious, but impressed.</li>';
    return;
  }

  findingsList.innerHTML = matches.map((item) => `
    <li>
      <span class="finding-type">${escapeHtml(item.title)}</span>
      <strong>${escapeHtml(item.phrase)}</strong>
      <p>${escapeHtml(item.suggestion)}</p>
      <em>${escapeHtml(item.al)}</em>
    </li>
  `).join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderReport();
});

draft.addEventListener("input", renderReport);

sampleButton.addEventListener("click", () => {
  draft.value = sampleText;
  renderReport();
  draft.focus();
});

clearButton.addEventListener("click", () => {
  draft.value = "";
  renderReport();
  draft.focus();
});

renderReport();
