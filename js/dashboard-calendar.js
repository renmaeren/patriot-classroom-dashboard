/*
==========================================
PATRIOT COMMAND
Dashboard Calendar
Version 2
==========================================
*/

(function () {
  "use strict";

  const WINDOW_DAYS = 14;
  let calendarRefreshTimer = null;
  let calendarRequestPending = false;

  function cleanText(value) {
    return String(value || "").trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getScriptUrl() {
    return cleanText(window.GOOGLE_SCRIPT_URL);
  }

  function getCalendarHost() {
    return document.getElementById("dashboard-calendar");
  }

  function createCallbackName() {
    return (
      "__patriotDashboardCalendar_" +
      Date.now() +
      "_" +
      Math.random().toString(16).slice(2)
    );
  }

  function parseCalendarDate(value) {
    const text = cleanText(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;

    const parts = text.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDateText(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getLocalDateText() {
    return formatDateText(new Date());
  }

  function getWindowEndText() {
    const end = new Date();
    end.setDate(end.getDate() + WINDOW_DAYS - 1);
    return formatDateText(end);
  }

  function formatEventDate(value) {
    const date = parseCalendarDate(value);
    if (!date) return cleanText(value);

    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }

  function getCategoryIcon(category) {
    const text = cleanText(category).toLowerCase();

    if (text.includes("no school")) return "🏫";
    if (text.includes("athletic") || text.includes("sport")) return "🏆";
    if (text.includes("professional") || text.includes("work")) return "📋";
    if (text.includes("meeting")) return "👥";
    return "📅";
  }

  function showCalendarMessage(message) {
    const host = getCalendarHost();
    if (!host) return;

    host.innerHTML = `
      <div class="dashboard-calendar-status">
        ${escapeHtml(message)}
      </div>
    `;
  }

  function buildEventCard(event) {
    const today = getLocalDateText();
    const isToday = event.date === today;
    const time = cleanText(event.time);
    const location = cleanText(event.location);
    const details = cleanText(event.details);
    const category = cleanText(event.category);

    return `
      <article class="dashboard-calendar-event${isToday ? " today" : ""}">
        <div class="dashboard-calendar-date">
          <span class="dashboard-calendar-date-label">
            ${isToday ? "Today" : escapeHtml(formatEventDate(event.date))}
          </span>
        </div>

        <div class="dashboard-calendar-event-copy">
          <div class="dashboard-calendar-event-heading">
            <span class="dashboard-calendar-event-icon" aria-hidden="true">
              ${getCategoryIcon(category)}
            </span>

            <div>
              <h3 class="dashboard-calendar-event-title">
                ${escapeHtml(event.title)}
              </h3>

              ${
                category
                  ? `<span class="dashboard-calendar-event-category">${escapeHtml(category)}</span>`
                  : ""
              }
            </div>
          </div>

          ${
            details
              ? `<p class="dashboard-calendar-event-details">${escapeHtml(details)}</p>`
              : ""
          }

          ${
            time || location
              ? `<div class="dashboard-calendar-event-meta">
                  ${time ? `<span>🕒 ${escapeHtml(time)}</span>` : ""}
                  ${location ? `<span>📍 ${escapeHtml(location)}</span>` : ""}
                </div>`
              : ""
          }
        </div>
      </article>
    `;
  }

  function getEventsForTwoWeekWindow(events) {
    if (!Array.isArray(events)) return [];

    const start = getLocalDateText();
    const end = getWindowEndText();

    return events
      .filter(event => {
        const date = cleanText(event && event.date);
        return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= start && date <= end;
      })
      .sort((a, b) => {
        const dateCompare = cleanText(a.date).localeCompare(cleanText(b.date));
        if (dateCompare !== 0) return dateCompare;

        const timeCompare = cleanText(a.time).localeCompare(cleanText(b.time));
        if (timeCompare !== 0) return timeCompare;

        return cleanText(a.title).localeCompare(cleanText(b.title));
      });
  }

  function renderCalendar(events) {
    const host = getCalendarHost();
    if (!host) return;

    const usableEvents = getEventsForTwoWeekWindow(events);

    if (usableEvents.length === 0) {
      host.innerHTML = `
        <div class="dashboard-calendar-status">
          No events are currently listed for the next two weeks.
        </div>
      `;
      return;
    }

    host.innerHTML = usableEvents.map(buildEventCard).join("");
  }

  function requestCalendar() {
    if (calendarRequestPending) return;

    const scriptUrl = getScriptUrl();
    if (!scriptUrl) {
      showCalendarMessage("The calendar connection is not configured.");
      return;
    }

    calendarRequestPending = true;
    const callbackName = createCallbackName();
    const script = document.createElement("script");

    const timeout = window.setTimeout(function () {
      cleanup();
      showCalendarMessage("The upcoming calendar could not be loaded.");
    }, 15000);

    function cleanup() {
      calendarRequestPending = false;
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = function (response) {
      cleanup();

      if (!response || response.success !== true) {
        console.error(
          response?.message || "The upcoming calendar request failed."
        );

        showCalendarMessage(
          response?.message || "The upcoming calendar could not be loaded."
        );
        return;
      }

      renderCalendar(response.events);
    };

    const url = new URL(scriptUrl);
    url.searchParams.set("action", "getUpcomingEvents");
    url.searchParams.set("days", String(WINDOW_DAYS));
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("cacheBust", String(Date.now()));

    script.src = url.toString();
    script.async = true;
    script.onerror = function () {
      cleanup();
      showCalendarMessage("Patriot Command could not reach the calendar backend.");
    };

    document.head.appendChild(script);
  }

  function startCalendarRefresh() {
    if (calendarRefreshTimer) return;

    calendarRefreshTimer = window.setInterval(requestCalendar, 300000);
  }

  function startDashboardCalendar() {
    requestCalendar();
    startCalendarRefresh();
  }

  window.PatriotDashboardCalendar = {
    refresh: requestCalendar
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startDashboardCalendar);
  } else {
    startDashboardCalendar();
  }

  console.log("Patriot Dashboard Calendar v2 loaded.");
})();
