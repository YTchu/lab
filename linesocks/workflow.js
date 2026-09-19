"use strict";
// Page flow and interactions built on the shared socks renderer.
const ui = (s) => document.querySelector(s);
let draft = { mood: "happy", weather: "sunny", time: scenarioTime() },
  weatherRequest = 0;
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
// Retain the existing vertical spacing below weather controls.
conditions.append(element("p", "flow-hint", ""));
ui(".intro").after(preview);
const resultControls = element("div", "flow-result-controls", "");
main.insertBefore(resultControls, ui("footer"));
resultControls.append(thoughtSection, activitySection, exportSection);
// Keep packaging and scene color controls directly below the relocated preview.
const packaging = ui(".packaging-control");
preview.after(packaging, sceneSection);
thoughtSection.classList.add("flow-panel");
activitySection.classList.add("flow-panel");
ui("#description-title").textContent = "給今天的話 · THOUGHT";
ui("#mood-note").hidden = false;
ui("#mood-note").readOnly = false;
ui("#note-help").textContent = "也可寫下你的心情";
ui("#regenerate-activity").textContent = "換一個 ↻";
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
          const request = ++weatherRequest;
          b.disabled = true;
          ui("#weather-message").textContent = "正在取得當地天氣…";
          await refreshAutomaticWeather();
          b.disabled = false;
          if (request !== weatherRequest) return;
          const found = {
            sunny: "sunny",
            partly_cloudy: "cloudy",
            cloudy: "cloudy",
            rainy: "rainy",
            fog: "cloudy",
            snow: "rainy",
            storm: "stormy",
            wind: "windy",
          }[automaticWeather.icon];
          if (found) {
            draft.weather = found;
            ui("#weather-message").textContent = "已取得當地天氣，也可以手動調整";
          } else ui("#weather-message").textContent = "暫時無法取得天氣，請手動選擇";
        } else {
          draft[key] = value;
          if (key === "weather") {
            weatherRequest++;
            ui("#weather-message").textContent = "已使用手動天氣";
          }
        }
        syncDraftButtons();
        applySelection();
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
applySelection();
