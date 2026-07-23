/*
  PATRIOT CLASSROOM DASHBOARD
  School schedule data

  Times use the 24-hour clock:
  07:40 = 7:40 AM
  13:20 = 1:20 PM
*/

const regularBellSchedule = [
  {
    name: "1st Period",
    start: "07:40",
    end: "08:23",
    type: "class"
  },
  {
    name: "Passing Period",
    start: "08:23",
    end: "08:27",
    type: "transition"
  },
  {
    name: "2nd Period",
    start: "08:27",
    end: "09:10",
    type: "class"
  },
  {
    name: "Second Chance Breakfast",
    start: "09:10",
    end: "09:18",
    type: "breakfast"
  },
  {
    name: "3rd Period",
    start: "09:18",
    end: "10:01",
    type: "class"
  },
  {
    name: "Passing Period",
    start: "10:01",
    end: "10:05",
    type: "transition"
  },
  {
    name: "4th Period",
    start: "10:05",
    end: "10:48",
    type: "class"
  },
  {
    name: "Passing Period",
    start: "10:48",
    end: "10:52",
    type: "transition"
  },
  {
    name: "Advisory",
    start: "10:52",
    end: "11:17",
    type: "advisory"
  },
  {
    name: "Passing Period",
    start: "11:17",
    end: "11:21",
    type: "transition"
  },
  {
    name: "5th Period",
    start: "11:21",
    end: "12:29",
    type: "class"
  },
  {
    name: "Passing Period",
    start: "12:29",
    end: "12:33",
    type: "transition"
  },
  {
    name: "6th Period",
    start: "12:33",
    end: "13:16",
    type: "class"
  },
  {
    name: "Passing Period",
    start: "13:16",
    end: "13:20",
    type: "transition"
  },
  {
    name: "7th Period",
    start: "13:20",
    end: "14:03",
    type: "class"
  },
  {
    name: "Passing Period",
    start: "14:03",
    end: "14:07",
    type: "transition"
  },
  {
    name: "8th Period",
    start: "14:07",
    end: "14:50",
    type: "class"
  }
];

const lunchSchedule = [
  {
    name: "Lunch 1",
    start: "11:17",
    end: "11:42"
  },
  {
    name: "Lunch 2",
    start: "11:45",
    end: "12:10"
  },
  {
    name: "Lunch 3",
    start: "12:23",
    end: "12:48"
  },
  {
    name: "Lunch 4",
    start: "12:51",
    end: "13:16"
  }
];

/*
  This tells the dashboard which schedule to use.
  Later, it can automatically choose regular, club,
  testing, early-release, or other schedules.
*/

const bellSchedule = regularBellSchedule;
