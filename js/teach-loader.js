from pathlib import Path
import re

src = Path("/mnt/data/Pasted text(85).txt")
text = src.read_text(encoding="utf-8")

# Bump internal loader version.
text = text.replace(
    'window.PATRIOT_TEACH_LOADER_VERSION =\n    "6";',
    'window.PATRIOT_TEACH_LOADER_VERSION =\n    "7";'
)

# Replace canEmbed + createEmbedUrl block.
start = text.index("  function canEmbed(resource) {")
end = text.index("\n  /*\n  ==========================================\n  RESOURCE SELECTION", start)

replacement = r'''  function canEmbed(resource) {
    return Boolean(
      resource &&
      isValidUrl(
        resource.url
      )
    );
  }

  function createEmbedUrl(resource) {
    const url =
      resource.url;

    /*
    ========================================
    GOOGLE SLIDES
    ========================================
    */

    if (
      resource.type === "slides" &&
      url.includes(
        "docs.google.com/presentation"
      )
    ) {
      const baseUrl =
        url.split("?")[0];

      if (
        baseUrl.includes("/edit")
      ) {
        return baseUrl.replace(
          "/edit",
          "/embed"
        );
      }

      if (
        baseUrl.includes("/present")
      ) {
        return baseUrl.replace(
          "/present",
          "/embed"
        );
      }

      return baseUrl;
    }

    /*
    ========================================
    GOOGLE DOCS
    ========================================
    */

    if (
      resource.type === "document" &&
      url.includes(
        "docs.google.com/document"
      )
    ) {
      const baseUrl =
        url.split("?")[0];

      if (
        baseUrl.includes("/edit")
      ) {
        return baseUrl.replace(
          "/edit",
          "/preview"
        );
      }

      return baseUrl;
    }

    /*
    ========================================
    GOOGLE SHEETS
    ========================================
    */

    if (
      resource.type === "spreadsheet" &&
      url.includes(
        "docs.google.com/spreadsheets"
      )
    ) {
      const baseUrl =
        url.split("?")[0];

      if (
        baseUrl.includes("/edit")
      ) {
        return baseUrl.replace(
          "/edit",
          "/preview"
        );
      }

      return baseUrl;
    }

    /*
    ========================================
    GOOGLE FORMS
    ========================================
    */

    if (
      resource.type === "form" &&
      url.includes(
        "docs.google.com/forms"
      )
    ) {
      const baseUrl =
        url.split("?")[0];

      if (
        baseUrl.includes("/edit")
      ) {
        return baseUrl.replace(
          "/edit",
          "/viewform?embedded=true"
        );
      }

      if (
        baseUrl.includes("/viewform")
      ) {
        return (
          baseUrl +
          "?embedded=true"
        );
      }

      return baseUrl;
    }

    /*
    ========================================
    YOUTUBE
    ========================================
    */

    if (
      resource.type === "video" ||
      resource.type === "youtube"
    ) {
      try {
        const parsedUrl =
          new URL(url);

        if (
          parsedUrl.hostname.includes(
            "youtu.be"
          )
        ) {
          const videoId =
            parsedUrl.pathname
              .replace("/", "")
              .split("?")[0];

          return (
            "https://www.youtube.com/embed/" +
            videoId
          );
        }

        if (
          parsedUrl.hostname.includes(
            "youtube.com"
          )
        ) {
          const videoId =
            parsedUrl.searchParams.get(
              "v"
            );

          if (videoId) {
            return (
              "https://www.youtube.com/embed/" +
              videoId
            );
          }

          if (
            parsedUrl.pathname.includes(
              "/embed/"
            )
          ) {
            return url;
          }

          if (
            parsedUrl.pathname.includes(
              "/shorts/"
            )
          ) {
            const shortId =
              parsedUrl.pathname
                .split("/shorts/")[1]
                .split("/")[0];

            return (
              "https://www.youtube.com/embed/" +
              shortId
            );
          }
        }
      } catch (error) {
        console.error(
          "Could not prepare YouTube link.",
          error
        );
      }
    }

    /*
    All other valid resources are attempted
    directly inside the central Teach iframe.
    */

    return url;
  }
'''

text = text[:start] + replacement + text[end:]

# Replace selectResource function.
start = text.index("  function selectResource(")
end = text.index("\n  function displayLessonResources(", start)

select_replacement = r'''  function selectResource(
    resource,
    selectedButton
  ) {
    document
      .querySelectorAll(
        ".resource-tab"
      )
      .forEach(button => {
        button.classList.remove(
          "active"
        );

        button.setAttribute(
          "aria-pressed",
          "false"
        );
      });

    selectedButton.classList.add(
      "active"
    );

    selectedButton.setAttribute(
      "aria-pressed",
      "true"
    );

    const frame =
      document.getElementById(
        "lesson-frame"
      );

    const originalPlaceholder =
      document.getElementById(
        "lesson-placeholder"
      );

    const openPlaceholder =
      document.getElementById(
        "resource-open-placeholder"
      );

    const headerOpenLink =
      document.getElementById(
        "open-lesson-link"
      );

    if (originalPlaceholder) {
      originalPlaceholder.style.display =
        "none";
    }

    /*
    Every valid lesson resource is attempted
    in the central Teach workspace.

    Some outside websites may refuse iframe
    display through their own security policy.
    The header link remains available as the
    fallback in those cases.
    */

    if (headerOpenLink) {
      headerOpenLink.href =
        resource.url;

      headerOpenLink.textContent =
        "Open in New Tab";

      headerOpenLink.style.display =
        "inline-flex";
    }

    if (openPlaceholder) {
      openPlaceholder.classList.remove(
        "show"
      );
    }

    if (
      !frame ||
      !canEmbed(resource)
    ) {
      return;
    }

    frame.src =
      createEmbedUrl(
        resource
      );

    frame.style.display =
      "block";
  }
'''

text = text[:start] + select_replacement + text[end:]

out = Path("/mnt/data/teach-loader-v7.js")
out.write_text(text, encoding="utf-8")

print(f"Created: {out}")
print(f"Characters: {len(text):,}")
