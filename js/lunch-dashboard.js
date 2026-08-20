/*
==========================================
PATRIOT COMMAND
Lunch Dashboard Tracker
Version 1
==========================================
*/
(function () {
  "use strict";

  if (!document.body?.classList.contains("patriot-page-dashboard")) {
    return;
  }

  const LUNCH_START_KEY = "Lunch Start";
  const LUNCH_END_KEY = "Lunch End";

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem("patriotTeacherProfile") || "null");
    } catch (error) {
      return null;
    }
  }

  function timeToDate(value) {
    const text = String(value || "").trim();
    if (!/^\d{2}:\d{2}$/.test(text)) return null;
    const [hour, minute] = text.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  }

  function formatClock(value) {
    const date = timeToDate(value);
    if (!date) return "";
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatRemaining(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function addStyles() {
    if (document.getElementById("patriot-lunch-dashboard-styles")) return;

    const style = document.createElement("style");
    style.id = "patriot-lunch-dashboard-styles";
    style.textContent = `
      .patriot-lunch-card {
        margin-top: 12px;
        padding: 12px 14px;
        color: #20283a;
        background: linear-gradient(135deg, rgba(255,226,105,.2), rgba(255,255,255,.94));
        border: 1px solid rgba(42,67,163,.12);
        border-left: 5px solid #2a43a3;
        border-radius: 12px;
        box-shadow: 0 5px 16px rgba(42,67,163,.08);
      }

      .patriot-lunch-card.active {
        border-left-color: #39764d;
      }

      .patriot-lunch-card.warning {
        background: linear-gradient(135deg, rgba(255,226,105,.32), rgba(255,255,255,.96));
        border-left-color: #cf1b13;
      }

      .patriot-lunch-card-title {
        margin: 0 0 3px;
        color: #2a43a3;
        font-family: "Literata", Georgia, serif;
        font-size: .88rem;
        font-weight: 750;
      }

      .patriot-lunch-card.warning .patriot-lunch-card-title {
        color: #cf1b13;
      }

      .patriot-lunch-card-status {
        margin: 0;
        font-size: .78rem;
        font-weight: 750;
      }

      .patriot-lunch-card-meta {
        margin: 4px 0 0;
        color: #657087;
        font-size: .63rem;
        font-weight: 650;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureCard() {
    let card = document.getElementById("patriot-lunch-card");
    if (card) return card;

    const currentClass = document.querySelector(".current-class");
    if (!currentClass) return null;

    card = document.createElement("section");
    card.id = "patriot-lunch-card";
    card.className = "patriot-lunch-card";
    card.setAttribute("aria-live", "polite");
    card.innerHTML = `
      <h3 class="patriot-lunch-card-title">Lunch</h3>
      <p class="patriot-lunch-card-status">Lunch time is not set.</p>
      <p class="patriot-lunch-card-meta"></p>
    `;

    currentClass.insertAdjacentElement("afterend", card);
    return card;
  }

  function updateLunchCard() {
    const card = ensureCard();
    if (!card) return;

    const profile = readProfile();
    const classes = profile?.classes || {};
    const lunchStart = String(classes[LUNCH_START_KEY] || "").trim();
    const lunchEnd = String(classes[LUNCH_END_KEY] || "").trim();
    const status = card.querySelector(".patriot-lunch-card-status");
    const meta = card.querySelector(".patriot-lunch-card-meta");

    card.classList.remove("active", "warning");

    if (!lunchStart || !lunchEnd) {
      status.textContent = "Lunch time is not set.";
      meta.textContent = "Add Lunch Start and Lunch End in Teacher Settings.";
      return;
    }

    const start = timeToDate(lunchStart);
    const end = timeToDate(lunchEnd);
    const now = new Date();

    if (!start || !end || end <= start) {
      status.textContent = "Lunch time needs to be checked.";
      meta.textContent = "Lunch End must be later than Lunch Start.";
      return;
    }

    meta.textContent = `${formatClock(lunchStart)}–${formatClock(lunchEnd)}`;

    if (now < start) {
      const diff = start - now;
      status.textContent = `Lunch starts in ${formatRemaining(diff)}.`;
      return;
    }

    if (now >= start && now < end) {
      const diff = end - now;
      const warning = diff <= 5 * 60 * 1000;
      card.classList.add(warning ? "warning" : "active");
      status.textContent = warning
        ? `Lunch is almost over — ${formatRemaining(diff)} remaining.`
        : `Lunch now · ${formatRemaining(diff)} remaining.`;
      return;
    }

    status.textContent = "Lunch is over for today.";
  }

  function start() {
    addStyles();
    updateLunchCard();
    window.setInterval(updateLunchCard, 1000);

    window.addEventListener("storage", event => {
      if (event.key === "patriotTeacherProfile") {
        updateLunchCard();
      }
    });

    window.addEventListener("patriot-teacher-settings-synced", updateLunchCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
