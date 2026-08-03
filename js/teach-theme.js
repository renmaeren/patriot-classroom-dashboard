/*
==========================================
PATRIOT COMMAND
Teach Theme Manager
Version 1
==========================================

Controls the teacher's selected Teach theme.

Permanent Teach themes:
- Patriot
- Calm
- Boho
- Midnight
- Rainbow
- Vintage
- Classic

Future seasonal styles:
- Fall
- Halloween
- Thanksgiving
- Christmas
- Winter
- Valentine's Day
- Spring
*/

(function () {
  "use strict";

  const THEME_STORAGE_KEY =
    "patriotTeachTheme";

  const SEASONAL_STORAGE_KEY =
    "patriotSeasonalStyle";

  const DEFAULT_THEME =
    "patriot";

  const DEFAULT_SEASONAL_STYLE =
    "none";

  const TEACH_THEMES = {
    patriot: {
      id:
        "patriot",

      name:
        "Patriot",

      icon:
        "★",

      description:
        "The official Patriot Command experience, designed to showcase school pride."
    },

    calm: {
      id:
        "calm",

      name:
        "Calm",

      icon:
        "○",

      description:
        "A clean, focused, and distraction-free classroom style."
    },

    boho: {
      id:
        "boho",

      name:
        "Boho",

      icon:
        "🌿",

      description:
        "Warm earth tones and natural details for a cozy, welcoming classroom."
    },

    midnight: {
      id:
        "midnight",

      name:
        "Midnight",

      icon:
        "🌙",

      description:
        "A dark, high-contrast style made for projectors and low-light classrooms."
    },

    rainbow: {
      id:
        "rainbow",

      name:
        "Rainbow",

      icon:
        "🌈",

      description:
        "Bright, colorful, and energetic with plenty of playful classroom personality."
    },

    vintage: {
      id:
        "vintage",

      name:
        "Vintage",

      icon:
        "📚",

      description:
        "Inspired by timeless libraries, classic books, and the love of reading."
    },

    classic: {
      id:
        "classic",

      name:
        "Classic",

      icon:
        "🍎",

      description:
        "Traditional classroom charm with chalkboard, notebook, and teacher-inspired details."
    }
  };

  const SEASONAL_STYLES = {
    none: {
      id:
        "none",

      name:
        "Off"
    },

    fall: {
      id:
        "fall",

      name:
        "Fall"
    },

    halloween: {
      id:
        "halloween",

      name:
        "Halloween"
    },

    thanksgiving: {
      id:
        "thanksgiving",

      name:
        "Thanksgiving"
    },

    christmas: {
      id:
        "christmas",

      name:
        "Christmas"
    },

    winter: {
      id:
        "winter",

      name:
        "Winter"
    },

    valentines: {
      id:
        "valentines",

      name:
        "Valentine's Day"
    },

    spring: {
      id:
        "spring",

      name:
        "Spring"
    }
  };

  function cleanText(value) {
    return String(
      value ||
      ""
    )
      .trim()
      .toLowerCase();
  }

  function isTeachPage() {
    const fileName =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    return (
      fileName ===
        "classroom.html" ||
      fileName ===
        "teach.html"
    );
  }

  function getSavedTheme() {
    const savedTheme =
      cleanText(
        window.localStorage
          .getItem(
            THEME_STORAGE_KEY
          )
      );

    if (
      Object.prototype.hasOwnProperty.call(
        TEACH_THEMES,
        savedTheme
      )
    ) {
      return savedTheme;
    }

    return DEFAULT_THEME;
  }

  function getSavedSeasonalStyle() {
    const savedStyle =
      cleanText(
        window.localStorage
          .getItem(
            SEASONAL_STORAGE_KEY
          )
      );

    if (
      Object.prototype.hasOwnProperty.call(
        SEASONAL_STYLES,
        savedStyle
      )
    ) {
      return savedStyle;
    }

    return DEFAULT_SEASONAL_STYLE;
  }

  function applyTheme(
    themeId,
    options = {}
  ) {
    const requestedTheme =
      cleanText(
        themeId
      );

    const validTheme =
      Object.prototype.hasOwnProperty.call(
        TEACH_THEMES,
        requestedTheme
      )
        ? requestedTheme
        : DEFAULT_THEME;

    const shouldSave =
      options.save !==
      false;

    if (shouldSave) {
      window.localStorage
        .setItem(
          THEME_STORAGE_KEY,
          validTheme
        );
    }

    if (isTeachPage()) {
      document.documentElement
        .setAttribute(
          "data-teach-theme",
          validTheme
        );

      document.body
        ?.setAttribute(
          "data-teach-theme",
          validTheme
        );
    }

    window.dispatchEvent(
      new CustomEvent(
        "patriot-teach-theme-changed",
        {
          detail: {
            themeId:
              validTheme,

            theme:
              TEACH_THEMES[
                validTheme
              ]
          }
        }
      )
    );

    return TEACH_THEMES[
      validTheme
    ];
  }

  function applySeasonalStyle(
    styleId,
    options = {}
  ) {
    const requestedStyle =
      cleanText(
        styleId
      );

    const validStyle =
      Object.prototype.hasOwnProperty.call(
        SEASONAL_STYLES,
        requestedStyle
      )
        ? requestedStyle
        : DEFAULT_SEASONAL_STYLE;

    const shouldSave =
      options.save !==
      false;

    if (shouldSave) {
      window.localStorage
        .setItem(
          SEASONAL_STORAGE_KEY,
          validStyle
        );
    }

    if (isTeachPage()) {
      document.documentElement
        .setAttribute(
          "data-seasonal-style",
          validStyle
        );

      document.body
        ?.setAttribute(
          "data-seasonal-style",
          validStyle
        );
    }

    window.dispatchEvent(
      new CustomEvent(
        "patriot-seasonal-style-changed",
        {
          detail: {
            styleId:
              validStyle,

            style:
              SEASONAL_STYLES[
                validStyle
              ]
          }
        }
      )
    );

    return SEASONAL_STYLES[
      validStyle
    ];
  }

  function initializeTeachTheme() {
    applyTheme(
      getSavedTheme(),
      {
        save:
          false
      }
    );

    applySeasonalStyle(
      getSavedSeasonalStyle(),
      {
        save:
          false
      }
    );
  }

  function getThemeList() {
    return Object.values(
      TEACH_THEMES
    ).map(
      theme => ({
        ...theme
      })
    );
  }

  function getSeasonalStyleList() {
    return Object.values(
      SEASONAL_STYLES
    ).map(
      style => ({
        ...style
      })
    );
  }

  window.PatriotTeachTheme = {
    themes:
      TEACH_THEMES,

    seasonalStyles:
      SEASONAL_STYLES,

    getThemeList,

    getSeasonalStyleList,

    getSavedTheme,

    getSavedSeasonalStyle,

    applyTheme,

    applySeasonalStyle,

    initialize:
      initializeTeachTheme
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeTeachTheme
    );
  } else {
    initializeTeachTheme();
  }

  console.log(
    "Patriot Teach Theme Manager v1 loaded."
  );
})();
