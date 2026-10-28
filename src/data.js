
export const PAGES = [
  ["home", "Home"],
  ["feedback", "Feedback"],
  ["students", "Students"],
  ["summary", "Summary"],
  ["admin", "Admin"],
  ["contact", "Contact"]
];

export const SUBJ = [
  "Data Structures",
  "Operating Systems",
  "Digital Electronics",
  "Thermodynamics",
  "Library Services",
  "Campus Facilities"
];

export const MOOD = [
  "",
  "😞",
  "😕",
  "😐",
  "🙂",
  "🤩"
];

export const DEPTS = [
  "CSE",
  "ECE",
  "IT",
  "MECH",
  "EEE"
];

export const ST0 = [
  ["S101", "Aarav Reddy", "CSE", "3rd Year"],
  ["S102", "Priya Sharma", "ECE", "2nd Year"],
  ["S103", "Rahul Verma", "IT", "4th Year"],
  ["S104", "Sneha Kumari", "CSE", "1st Year"],
  ["S105", "Karthik Rao", "MECH", "3rd Year"],
  ["S106", "Ananya Das", "EEE", "2nd Year"],
  ["S107", "Vikram Singh", "IT", "1st Year"],
  ["S108", "Meera Nair", "ECE", "4th Year"]
];

export const FB0 = [
  [0, 5, "Aarav", "Clear explanations and great lab sessions."],
  [0, 4, "Priya", "Loved the practice problems."],
  [1, 4, "Rahul", "Good depth, a bit fast-paced."],
  [2, 4, "Sneha", "Labs really helped me understand circuits."],
  [3, 3, "Karthik", "Needs more worked examples."],
  [4, 5, "Ananya", "Quiet space and very helpful staff."],
  [5, 3, "Vikram", "Canteen queues are too long."],
  [1, 5, "Meera", "Excellent notes and doubt sessions."],
  [4, 4, "Aarav", "More new books would be great."],
  [5, 2, "Priya", "Wi-Fi is unreliable in the hostel block."]
].map((e, i) => ({
  id: i + 1,
  s: SUBJ[e[0]],
  r: e[1],
  name: e[2],
  text: e[3],
  t: Date.now() - i * 3600000
}));
