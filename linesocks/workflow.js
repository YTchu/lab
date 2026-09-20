"use strict";
// Page flow and interactions built on the shared socks renderer.
const ui = (s) => document.querySelector(s);
let draft = { mood: "happy", weather: "sunny", time: scenarioTime() },
  weatherRequest = 0,
  weatherReady = false;
const main = ui(".app"),
  preview = ui(".preview-section");
const moodSection = ui('[aria-labelledby="mood-title"]'),
  weatherSection = ui('[aria-labelledby="weather-title"]');
const sceneSection = ui(".scene-editor"),
  activitySection = ui('[aria-labelledby="activity-title"]'),
  thoughtSection = ui('[aria-labelledby="description-title"]'),
  exportSection = ui(".export-section");
function element(tag, cls, html) {
  const e = document.createElement(tag);
  e.className = cls;
  e.innerHTML = html;
  return e;
}
moodSection.id = "mood-section";
moodSection.classList.add("flow-panel");
weatherSection.classList.add("flow-panel");
ui("#mood-title").textContent = "01 / 今天感覺如何？ · MOOD";
ui("#weather-title").textContent = "02 / 天氣 · WEATHER";
main.insertBefore(moodSection, preview);
const conditions = element("div", "flow-conditions", "");
conditions.id = "flow-conditions";
conditions.hidden = false;
main.insertBefore(conditions, preview);
conditions.append(weatherSection);
ui(".intro").after(moodSection, conditions, preview);
const makeToday = element("button", "flow-primary make-today", "MAKE TODAY'S SOCKS");
makeToday.id = "make-today";
makeToday.type = "button";
makeToday.disabled = true;
preview.id = "socks-preview";
makeToday.setAttribute("aria-controls", "socks-preview");
makeToday.setAttribute("aria-expanded", "false");
conditions.after(makeToday);
const resultControls = element("details", "flow-result-controls", "");
resultControls.hidden = true;
resultControls.open = false;
resultControls.dataset.expanded = "false";
const resultSummary = element(
  "summary", "flow-result-summary",
  '<span>編輯今日心情</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>',
);
main.insertBefore(resultControls, ui("footer"));
resultControls.append(resultSummary, thoughtSection, activitySection);
resultControls.after(exportSection);
let resultExpanded = false;
let resultAnimation = null;
resultSummary.setAttribute("aria-expanded", "false");
resultSummary.addEventListener("click", (event) => {
  event.preventDefault();
  resultExpanded = !resultExpanded;
  resultSummary.setAttribute("aria-expanded", String(resultExpanded));
  resultControls.dataset.expanded = String(resultExpanded);
  const startHeight = resultControls.getBoundingClientRect().height;
  resultAnimation?.cancel();
  resultAnimation = null;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resultControls.open = resultExpanded;
    resultControls.style.removeProperty("overflow");
    return;
  }
  resultControls.open = resultExpanded;
  const endHeight = resultControls.getBoundingClientRect().height;
  // Keep content mounted while closing, then restore native details behavior.
  resultControls.open = true;
  resultControls.style.overflow = "hidden";
  const animation = resultControls.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    { duration: 220, easing: "cubic-bezier(0.2, 0, 0, 1)" },
  );
  resultAnimation = animation;
  animation.onfinish = () => {
    if (resultAnimation !== animation) return;
    resultControls.open = resultExpanded;
    resultControls.style.removeProperty("overflow");
    resultAnimation = null;
  };
});
// Keep packaging and scene color controls directly below the relocated preview.
const packaging = ui(".packaging-control");
preview.after(packaging, sceneSection);
// Keep editable content mounted inside the initially collapsed result panel.
thoughtSection.hidden = false;
activitySection.hidden = false;
makeToday.addEventListener("click", () => {
  if (!weatherReady) return;
  for (const section of [preview, packaging, sceneSection, resultControls, exportSection]) {
    section.hidden = false;
  }
  applySelection();
  syncSockThumbnailVisibility();
  makeToday.setAttribute("aria-expanded", "true");
  preview.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
});
thoughtSection.classList.add("flow-panel");
activitySection.classList.add("flow-panel");
ui("#description-title").textContent = "03 / 給今天的話 · THOUGHT";
ui("#mood-note").hidden = false;
ui("#mood-note").readOnly = false;
ui("#note-help").textContent = "也可寫下你的心情";
// Face details for the horizontal mood picker.
const moodPickerFaces = {
  happy: "M9 9v1 M15 9v1 M7 14h10c-1 5-9 5-10 0Z",
  calm: "M9 9v1 M15 9v1 M7.5 15q4.5 4 9 0",
  tired: "M8 10h2 M14 10h2 M8 16h8",
  sad: "M9 9h.01 M15 9h.01 M8 17q4-4 8 0",
  anxious: "M9 9v1 M15 9v1 M8 16h8",
};
function renderMoodPickerIcon(svg, value) {
  renderIconPaths(svg, value);
  if (moodPickerFaces[value])
    svg
      .querySelector("path")
      .setAttribute("d", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 " + moodPickerFaces[value]);
}
// A manual choice invalidates any pending automatic result.
async function selectLocalWeather() {
  const request = ++weatherRequest;
  weatherReady = false;
  makeToday.disabled = true;
  const button = ui("#weather-choice button");
  button.disabled = true;
  ui("#weather-message").textContent = "正在取得所在地天氣…";
  try {
    await refreshAutomaticWeather();
    if (request !== weatherRequest) return;
    const found = {
      sunny: "sunny", partly_cloudy: "cloudy", cloudy: "cloudy",
      rainy: "rainy", fog: "cloudy", snow: "rainy", storm: "stormy", wind: "windy",
    }[automaticWeather.icon];
    draft.weather = found || randomPick(["sunny", "cloudy", "rainy", "windy", "stormy"]);
    ui("#weather-message").textContent = found
      ? "當地天氣。或選擇你的心情天氣"
      : "可以選擇你的心情天氣";
    weatherReady = true;
    syncDraftButtons();
  } finally {
    button.disabled = false;
  }
}

function bindDraft() {
  for (const [id, key] of [
    ["mood-choice", "mood"],
    ["weather-choice", "weather"],
  ]) {
    const group = ui("#" + id);
    [...group.children].forEach((b, index) => {
      const value = textChoices.find((row) => row[0] === id)[1][index][0];
      if (key === "mood") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        renderMoodPickerIcon(svg, value);
        b.prepend(svg);
      }
      b.addEventListener("click", async () => {
        if (key === "mood") conditions.hidden = false;
        if (value === "auto") {
          await selectLocalWeather();
          return;
        } else {
          draft[key] = value;
          if (key === "weather") {
            weatherRequest++;
            weatherReady = true;
            ui("#weather-message").textContent = "你的心情天氣";
          }
        }
        syncDraftButtons();
      });
    });
  }
  syncDraftButtons();
}
// Use one heading layout for section labels and optional status messages.
function formatSectionHeading(title, message) {
  const label = element("span", "section-heading-label", "");
  label.textContent = [...title.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join("")
    .trim();
  const row = element("span", "weather-heading-row", "");
  const line = element("span", "weather-heading-line", "");
  line.setAttribute("aria-hidden", "true");
  row.append(label, line);
  if (message) {
    message.classList.add("section-heading-message");
    row.append(message);
  }
  title.replaceChildren(row);
  title.classList.add("section-line-title");
}
const weatherMessage = element("span", "", "也可以選擇你想要的天氣");
weatherMessage.id = "weather-message";
weatherMessage.setAttribute("role", "status");
formatSectionHeading(ui("#weather-title"), weatherMessage);
for (const title of document.querySelectorAll(
  "#mood-title, #activity-title",
)) {
  formatSectionHeading(title);
}
formatSectionHeading(ui("#description-title"), ui("#note-help"));

function syncDraftButtons() {
  makeToday.disabled = !weatherReady;
  for (const [id, key] of [
    ["mood-choice", "mood"],
    ["weather-choice", "weather"],
  ]) {
    const options = textChoices.find((row) => row[0] === id)[1];
    [...ui("#" + id).children].forEach((b, i) =>
      b.setAttribute("aria-pressed", String(options[i][0] === draft[key])),
    );
  }
}
function updateResult() {
  ui("#mood-note").dataset.edited = String(noteEdited);
  ui("#note-help").textContent = "也可寫下你的心情";
}
function applySelection() {
  moodState.mood = draft.mood;
  weatherSelection = draft.weather;
  committedTime = draft.time;
  noteEdited = false;
  workflowGenerating = true;
  try {
    syncMoodScenario(true);
  } finally {
    workflowGenerating = false;
  }
  updateResult();
  draw();
}
ui("#regenerate-activity").addEventListener("click", () => {
  const options = currentScenario.activityOptions.filter((id) => id !== currentActivity);
  if (!options.length) return;
  currentActivity = randomPick(options);
  const action = scenarioData.actionCatalog[currentActivity];
  moodState.thought = action.lucideIcon;
  moodState.activityLabel = activityEnglishLabels[currentActivity] || currentActivity.toUpperCase();
  const output = ui("#activity-result");
  output.replaceChildren();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  renderIconPaths(svg, moodState.thought);
  const label = document.createElement("span");
  label.textContent = action.label + " · " + moodState.activityLabel;
  output.append(svg, label);
  generateScenarioStripes();
  draw();
});
ui(".export-actions").prepend(ui("#share-preview"));
const story = ui('input[name="export-size"][value="1920"]');
story.checked = true;
const post = ui('input[name="export-size"][value="1350"]');
post.closest("label").before(story.closest("label"));
story.closest("label").lastChild.textContent = " Story 9:16";
post.closest("label").lastChild.textContent = " Instagram Post 4:5";
const panel = element(
  "dialog",
  "flow-share-panel",
  '<form method="dialog"><button aria-label="關閉分享面板">✕</button></form><h2>分享今天的心情</h2><p>儲存圖片後，分享至限時動態或貼文。</p><button type="button" id="fallback-download">DOWNLOAD PNG ↓</button><button type="button" id="copy-thought">複製心情文字</button><p id="share-message" role="status"></p>',
);
document.body.append(panel);
ui("#share-preview").addEventListener("click", async () => {
  try {
    const blob = await createPreviewPNG(story.checked ? 1920 : 1350);
    const file = new File([blob], "line-socks.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "LINE SOCKS", text: acceptedNote });
    } else panel.showModal();
  } catch (error) {
    if (error.name !== "AbortError") ui("#status").textContent = "分享未完成，請重試或下載 PNG。";
  }
});
ui("#fallback-download").addEventListener("click", () => savePreview());
ui("#copy-thought").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(acceptedNote);
    ui("#share-message").textContent = "已複製。";
  } catch {
    ui("#share-message").textContent = acceptedNote;
  }
});
bindDraft();
acceptScenarioData(SCENARIOS);

selectLocalWeather();
