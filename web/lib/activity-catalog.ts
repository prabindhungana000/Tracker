export type ActivityItem = {
  id: string;
  name: string;
  met: number;
  note: string;
};

export const ACTIVITY_CATALOG: ActivityItem[] = [
  { id: "act-1", name: "Walking", met: 3.8, note: "Normal walking pace" },
  { id: "act-2", name: "Fast Walking", met: 5, note: "Brisk outdoor walk" },
  { id: "act-3", name: "Running", met: 9.8, note: "Steady running pace" },
  { id: "act-4", name: "Cycling", met: 7.5, note: "Moderate cycling" },
  { id: "act-5", name: "Strength Training", met: 6, note: "Gym or bodyweight session" },
  { id: "act-6", name: "Jump Rope", met: 12, note: "Continuous skipping" },
  { id: "act-7", name: "Swimming", met: 8.3, note: "Moderate lap swimming" },
  { id: "act-8", name: "Yoga", met: 2.8, note: "Flow or mat routine" },
  { id: "act-9", name: "Stair Climbing", met: 8.8, note: "Repeated stair work" },
  { id: "act-10", name: "Football", met: 7, note: "Match or strong practice" },
];
