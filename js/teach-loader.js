from pathlib import Path
p = Path("/mnt/data/teach-loader.js")
text = p.read_text(encoding="utf-8")

# Replace single lesson key with priority list.
text = text.replace(
    '  const LESSON_KEY = "patriotDailyLesson";\n',
    '''  const LESSON_KEY = "patriotDailyLesson";
  const TEACH_LESSON_KEY = "patriotTeachLesson";
  const LAST_PLANNED_LESSON_KEY = "patriotLastPlannedLesson";
'''
)

# Replace getSavedLesson function with robust active lesson resolver.
start = text.index('  function getSavedLesson() {')
end = text.index('\n  function addPlannerStyles()', start)
new_func = r'''  function normalizeResources(rawLesson) {
    if (!rawLesson || typeof rawLesson !== "object") {
      return [];
    }

    const possibleValues = [
      rawLesson.resources,
      rawLesson.lessonResources,
      rawLesson.resourceLinks,
      rawLesson.links
    ];

    let resources = possibleValues.find(value => {
      return Array.isArray(value) || typeof value === "string";
    });

    if (typeof resources === "string") {
      try {
        resources = JSON.parse(resources);
      } catch (error) {
        resources = [];
      }
    }

    if (!Array.isArray(resources)) {
      resources = [];
    }

    const normalized = resources
      .map((resource, index) => {
        if (typeof resource === "string") {
          return {
            type: guessResourceType(resource),
            url: resource,
            label: `Resource ${index + 1}`
          };
        }

        const url =
          resource.url ||
          resource.link ||
          resource.href ||
          resource.resourceUrl ||
          "";

        const type =
          resource.type ||
          resource.resourceType ||
          guessResourceType(url);

        const label =
          resource.label ||
          resource.title ||
          resource.name ||
          getDefaultResourceLabel(type);

        return { type, url, label };
      })
      .filter(resource => resource.url);

    if (normalized.length > 0) {
      return normalized;
    }

    const oldSingleLink =
      rawLesson.lessonLink ||
      rawLesson.lessonUrl ||
      rawLesson.resourceUrl ||
      "";

    if (oldSingleLink) {
      return [
        {
          type: guessResourceType(oldSingleLink),
          url: oldSingleLink,
          label: getDefaultResourceLabel(
            guessResourceType(oldSingleLink)
          )
        }
      ];
    }

    return [];
  }

  function guessResourceType(url) {
    const value = String(url || "").toLowerCase();

    if (
      value.includes("docs.google.com/presentation") ||
      value.includes("slides.google.com")
    ) {
      return "slides";
    }

    if (
      value.includes("youtube.com") ||
      value.includes("youtu.be")
    ) {
      return "video";
    }

    if (value.includes("canva.com")) {
      return "canva";
    }

    if (value.includes("studysync")) {
      return "studysync";
    }

    if (value.includes("docs.google.com/document")) {
      return "document";
    }

    if (value.includes(".pdf")) {
      return "pdf";
    }

    return "website";
  }

  function normalizeLesson(rawLesson) {
    const fallback = {
      lessonId: "",
      lessonDate: getTodayText(),
      assignedPeriods: [],
      assignedCourses: [],
      bellringer: "",
      ican: "",
      success: "",
      profileId: "none",
      profileStatement: "",
      agenda: "",
      resources: []
    };

    const lesson = {
      ...fallback,
      ...(rawLesson || {})
    };

    lesson.lessonDate =
      lesson.lessonDate ||
      lesson.date ||
      getTodayText();

    lesson.assignedPeriods =
      lesson.assignedPeriods ||
      lesson.periods ||
      [];

    lesson.assignedCourses =
      lesson.assignedCourses ||
      lesson.courses ||
      [];

    lesson.bellringer =
      lesson.bellringer ||
      lesson.bellRinger ||
      "";

    lesson.ican =
      lesson.ican ||
      lesson.learningTarget ||
      "";

    lesson.success =
      lesson.success ||
      lesson.successCriteria ||
      "";

    lesson.profileId =
      lesson.profileId ||
      lesson.profileComponent ||
      "none";

    lesson.profileStatement =
      lesson.profileStatement ||
      lesson.profileFocus ||
      "";

    lesson.resources = normalizeResources(lesson);

    return lesson;
  }

  function readLessonKey(key) {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    try {
      return normalizeLesson(JSON.parse(saved));
    } catch (error) {
      console.error(`Could not read ${key}.`, error);
      return null;
    }
  }

  function getSavedLesson() {
    const teachLesson = readLessonKey(TEACH_LESSON_KEY);

    if (teachLesson) {
      return teachLesson;
    }

    const dailyLesson = readLessonKey(LESSON_KEY);

    if (dailyLesson) {
      return dailyLesson;
    }

    const lastPlannedLesson =
      readLessonKey(LAST_PLANNED_LESSON_KEY);

    if (lastPlannedLesson) {
      return lastPlannedLesson;
    }

    return normalizeLesson(null);
  }
'''
text = text[:start] + new_func + text[end:]

# Ensure saves update both active keys, not only daily.
text = text.replace(
    '''    localStorage.setItem(
      LESSON_KEY,
      JSON.stringify(lesson)
    );
''',
    '''    localStorage.setItem(
      LESSON_KEY,
      JSON.stringify(lesson)
    );

    localStorage.setItem(
      TEACH_LESSON_KEY,
      JSON.stringify(lesson)
    );

    localStorage.setItem(
      LAST_PLANNED_LESSON_KEY,
      JSON.stringify(lesson)
    );
'''
)

# add a version marker for easy console verification
text = text.replace(
    '  function startTeachLoader() {\n',
    '''  function startTeachLoader() {
    window.PATRIOT_TEACH_LOADER_VERSION = "4";
'''
)

out = Path("/mnt/data/teach-loader-v4.js")
out.write_text(text, encoding="utf-8")
print(out)
