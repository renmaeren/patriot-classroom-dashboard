/* Patriot Command — Library Reservations */
(function () {
  "use strict";

  const form = document.getElementById("reservation-form");
  if (!form) return;

  const dateInput = document.getElementById("reservation-date");
  const periodInput = document.getElementById("reservation-period");
  const customField = document.getElementById("custom-time-field");
  const customInput = document.getElementById("custom-time");
  const teacherInput = document.getElementById("teacher-name");
  const countInput = document.getElementById("student-count");
  const purposeInput = document.getElementById("purpose");
  const submitButton = document.getElementById("submit-button");
  const statusBox = document.getElementById("status");
  const list = document.getElementById("reservation-list");

  const profileKey = "patriotTeacherProfile";

  let anotherButton = document.getElementById("make-another-reservation");
  if (!anotherButton) {
    anotherButton = document.createElement("button");
    anotherButton.id = "make-another-reservation";
    anotherButton.type = "button";
    anotherButton.textContent = "Make Another Reservation";
    anotherButton.hidden = true;
    anotherButton.style.width = "100%";
    anotherButton.style.minHeight = "42px";
    anotherButton.style.marginTop = "9px";
    anotherButton.style.border = "1px solid #2a43a3";
    anotherButton.style.borderRadius = "9px";
    anotherButton.style.color = "#2a43a3";
    anotherButton.style.background = "#ffffff";
    anotherButton.style.fontWeight = "800";
    anotherButton.style.cursor = "pointer";
    statusBox.insertAdjacentElement("afterend", anotherButton);
  }

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem(profileKey) || "{}");
    } catch (_) {
      return {};
    }
  }

  function getCredentials() {
    const auth = window.PATRIOT_AUTH || {};
    const user = auth.getUser?.() || auth.user || window.PATRIOT_USER || null;
    const token = String(auth.getIdToken?.() || auth.idToken || "").trim();
    return {
      email: String(user?.email || "").trim().toLowerCase(),
      token
    };
  }

  function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = `status show ${type || "ok"}`;
  }

  function clearStatus() {
    statusBox.textContent = "";
    statusBox.className = "status";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function post(action, data) {
    const credentials = getCredentials();
    if (!credentials.email || !credentials.token) {
      throw new Error("Please sign in with Google before using Library Reservations.");
    }
    const url = String(window.GOOGLE_SCRIPT_URL || "").trim();
    if (!url) throw new Error("Patriot Command cloud service is unavailable.");

    const body = new URLSearchParams({
      action,
      teacherEmail: credentials.email,
      idToken: credentials.token,
      ...(data || {})
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString()
    });
    const result = await response.json();
    if (!response.ok || !result || result.success !== true) {
      throw new Error(result?.message || "The reservation request could not be completed.");
    }
    return result;
  }

  function renderReservations(reservations) {
    const items = Array.isArray(reservations) ? reservations : [];
    if (!items.length) {
      list.innerHTML = '<div class="empty">No library reservations are currently scheduled for this date.</div>';
      return;
    }

    list.innerHTML = items.map(item => {
      const time = item.period === "Other / Custom Time" ? item.customTime : item.period;
      const count = item.studentCount ? ` · ${escapeHtml(item.studentCount)} students` : "";
      return `<div class="reservation"><strong>${escapeHtml(time || "Reserved")}</strong><span>${escapeHtml(item.teacherName || "Teacher")}${count}</span><span>${escapeHtml(item.purpose || "")}</span></div>`;
    }).join("");
  }

  async function loadReservations() {
    const date = dateInput.value;
    if (!date) {
      list.innerHTML = '<div class="empty">Choose a date to check library availability.</div>';
      return;
    }
    list.innerHTML = '<div class="empty">Checking availability…</div>';
    try {
      const result = await post("getLibraryReservations", { date });
      renderReservations(result.reservations);
      submitButton.disabled = false;
    } catch (error) {
      list.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
      submitButton.disabled = true;
    }
  }

  function syncAuthState() {
    const credentials = getCredentials();
    submitButton.disabled = !(credentials.email && credentials.token && dateInput.value);
    if (!credentials.email || !credentials.token) {
      showStatus("Sign in with Google to check availability and reserve the library.", "error");
    } else if (statusBox.textContent.includes("Sign in with Google")) {
      clearStatus();
    }
  }

  function resetForAnotherReservation() {
    clearStatus();
    periodInput.value = "";
    customInput.value = "";
    customInput.required = false;
    customField.hidden = true;
    countInput.value = "";
    purposeInput.value = "";
    anotherButton.hidden = true;
    syncAuthState();
    periodInput.focus();
  }

  const profile = readProfile();
  teacherInput.value = profile.name || profile.teacherName || "";
  dateInput.min = new Date().toISOString().slice(0, 10);

  periodInput.addEventListener("change", () => {
    const isCustom = periodInput.value === "Other / Custom Time";
    customField.hidden = !isCustom;
    customInput.required = isCustom;
  });

  dateInput.addEventListener("change", () => {
    clearStatus();
    anotherButton.hidden = true;
    loadReservations();
  });

  anotherButton.addEventListener("click", resetForAnotherReservation);

  form.addEventListener("submit", async event => {
    event.preventDefault();
    clearStatus();
    anotherButton.hidden = true;

    const period = periodInput.value;
    const customTime = customInput.value.trim();
    if (period === "Other / Custom Time" && !customTime) {
      showStatus("Enter the custom reservation time.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting…";

    try {
      const result = await post("saveLibraryReservation", {
        date: dateInput.value,
        period,
        customTime,
        teacherName: teacherInput.value.trim(),
        studentCount: countInput.value.trim(),
        purpose: purposeInput.value.trim()
      });
      showStatus(result.message || "Library reservation saved!", "ok");
      anotherButton.hidden = false;
      await loadReservations();
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      submitButton.textContent = "Submit Reservation Request";
      syncAuthState();
    }
  });

  window.addEventListener("patriot-auth-changed", () => {
    syncAuthState();
    if (dateInput.value) loadReservations();
  });

  setTimeout(syncAuthState, 500);
  setTimeout(syncAuthState, 1800);
})();
