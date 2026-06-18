/* ============================================================
   portal-store.jsx — shared live store + Anantnag seed data
   The "spine": one action ripples across Student, Counsellor,
   Center Desk and Admin. Persisted to localStorage.
   Exposes: window.Store, window.useStore, window.PORTAL
   ============================================================ */

const LS_KEY = "jk_portal_v2";

/* ---------- reference data ---------- */
const CONCERNS = [
  { id: "career", en: "Career guidance", icon: "explore", color: "#0f4c81" },
  { id: "exam", en: "Exam stress", icon: "menu_book", color: "#b45309" },
  { id: "studies", en: "Academics / studies", icon: "school", color: "#0e7490" },
  { id: "wellbeing", en: "Mental well-being", icon: "favorite", color: "#be185d" },
  { id: "scholarship", en: "Scholarship / financial", icon: "payments", color: "#067a55" },
  { id: "personal", en: "Personal / family", icon: "diversity_3", color: "#6d28d9" },
];

const MODES = [
  { id: "in-person", en: "In-person at District Center", icon: "location_on", sub: "Youth Empowerment & Development Center, Anantnag" },
  { id: "video", en: "Video call", icon: "videocam", sub: "From home, via secure link" },
  { id: "phone", en: "Phone call", icon: "call", sub: "Counsellor calls your number" },
];

// Anantnag institutions (representative subset; district totals = 78 HSS + 10 colleges)
const INSTITUTIONS = [
  { id: "i1", type: "hss", name: "GHSS Anantnag (Boys)", block: "Anantnag", students: 1180 },
  { id: "i2", type: "hss", name: "GGHSS Anantnag (Girls)", block: "Anantnag", students: 1240 },
  { id: "i3", type: "hss", name: "GHSS Bijbehara", block: "Bijbehara", students: 960 },
  { id: "i4", type: "hss", name: "GHSS Dooru", block: "Dooru", students: 720 },
  { id: "i5", type: "hss", name: "GHSS Kokernag", block: "Kokernag", students: 680 },
  { id: "i6", type: "hss", name: "HSS Pahalgam", block: "Pahalgam", students: 540 },
  { id: "i7", type: "hss", name: "HSS Mattan", block: "Mattan", students: 610 },
  { id: "i8", type: "hss", name: "HSS Achabal", block: "Achabal", students: 580 },
  { id: "i9", type: "hss", name: "HSS Qazigund", block: "Qazigund", students: 700 },
  { id: "i10", type: "hss", name: "HSS Srigufwara", block: "Srigufwara", students: 520 },
  { id: "c1", type: "college", name: "Govt Degree College Anantnag", block: "Anantnag", students: 3400 },
  { id: "c2", type: "college", name: "Women's College Anantnag", block: "Anantnag", students: 2600 },
  { id: "c3", type: "college", name: "GDC Bijbehara", block: "Bijbehara", students: 1900 },
  { id: "c4", type: "college", name: "GDC Dooru", block: "Dooru", students: 1450 },
  { id: "c5", type: "college", name: "GDC Kokernag", block: "Kokernag", students: 1280 },
];

const COUNSELLORS = [
  { id: "co1", name: "Dr. Ayesha Khan", init: "AK", expertise: "Career & Higher Education", tags: ["career", "scholarship"], onDuty: true, room: "Room 1" },
  { id: "co2", name: "Dr. Mehak Jan", init: "MJ", expertise: "Clinical Psychologist", tags: ["wellbeing", "personal"], onDuty: true, room: "Room 2" },
  { id: "co3", name: "Bilal Ahmad", init: "BA", expertise: "Career · IT & Engineering", tags: ["career", "studies"], onDuty: true, room: "Room 3" },
  { id: "co4", name: "Sana Mir", init: "SM", expertise: "Competitive Exams", tags: ["exam", "career"], onDuty: false, room: "Room 1" },
  { id: "co5", name: "Dr. Iqbal Rather", init: "IR", expertise: "Counselling Psychologist", tags: ["wellbeing", "exam", "personal"], onDuty: true, room: "Room 4" },
  { id: "co6", name: "Rukhsar Jan", init: "RJ", expertise: "Vocational & Skills", tags: ["studies", "career"], onDuty: false, room: "Room 2" },
];

const STUDENTS = [
  { id: "st1", name: "Insha Jan", init: "IJ", instId: "i2", cls: "Class 12 · Science", phone: "98xxxxxx21", area: "Anantnag" },
  { id: "st2", name: "Faisal Lone", init: "FL", instId: "i3", cls: "Class 11 · Science", phone: "98xxxxxx02", area: "Bijbehara" },
  { id: "st3", name: "Rukhsar Bano", init: "RB", instId: "c2", cls: "BA 2nd yr", phone: "98xxxxxx33", area: "Anantnag" },
  { id: "st4", name: "Adil Wani", init: "AW", instId: "i4", cls: "Class 12 · Commerce", phone: "98xxxxxx41", area: "Dooru" },
  { id: "st5", name: "Hina Qadri", init: "HQ", instId: "c1", cls: "BSc 1st yr", phone: "98xxxxxx55", area: "Anantnag" },
  { id: "st6", name: "Zaid Bhat", init: "ZB", instId: "i6", cls: "Class 11 · Arts", phone: "98xxxxxx67", area: "Pahalgam" },
  { id: "st7", name: "Mehvish Akhtar", init: "MA", instId: "i5", cls: "Class 12 · Science", phone: "98xxxxxx78", area: "Kokernag" },
  { id: "st8", name: "Owais Dar", init: "OD", instId: "c3", cls: "BCom 3rd yr", phone: "98xxxxxx89", area: "Bijbehara" },
];

const DAYS = ["Today", "Tomorrow", "Wed", "Thu", "Fri"];
const TIMES = ["09:30", "10:30", "11:30", "12:30", "02:00", "03:00", "04:00", "05:00"];

let _idc = 100;
const uid = (p) => `${p}${++_idc}`;

// seed appointments across statuses / modes / concerns
const seedAppts = () => ([
  { id: "ap1", studentId: "st1", counsellorId: "co1", mode: "in-person", concern: "career", topic: "Confused between Engineering and Medical after Class 12", day: "Today", time: "10:30", room: "Room 1", status: "checked-in", createdVia: "online", notes: "", actionPlan: [] },
  { id: "ap2", studentId: "st4", counsellorId: "co1", mode: "in-person", concern: "scholarship", topic: "Which scholarships can I get for B.Com?", day: "Today", time: "11:30", room: "Room 1", status: "confirmed", createdVia: "online", notes: "", actionPlan: [] },
  { id: "ap3", studentId: "st7", counsellorId: "co5", mode: "video", concern: "exam", topic: "Severe stress before NEET", day: "Today", time: "12:30", room: "—", status: "in-progress", createdVia: "online", notes: "", actionPlan: [] },
  { id: "ap4", studentId: "st2", counsellorId: "co3", mode: "phone", concern: "career", topic: "Career options in IT without coding background", day: "Today", time: "02:00", room: "—", status: "requested", createdVia: "online", notes: "", actionPlan: [] },
  { id: "ap5", studentId: "st3", counsellorId: "co2", mode: "in-person", concern: "wellbeing", topic: "Feeling low and unmotivated this semester", day: "Today", time: "03:00", room: "Room 2", status: "requested", createdVia: "desk", notes: "", actionPlan: [] },
  { id: "ap6", studentId: "st6", counsellorId: "co1", mode: "in-person", concern: "career", topic: "What can I do after Arts stream?", day: "Tomorrow", time: "10:30", room: "Room 1", status: "confirmed", createdVia: "online", notes: "", actionPlan: [] },
  { id: "ap7", studentId: "st5", counsellorId: "co3", mode: "video", concern: "studies", topic: "Time management for BSc + competitive prep", day: "Tomorrow", time: "11:30", room: "—", status: "requested", createdVia: "online", notes: "", actionPlan: [] },
  { id: "ap8", studentId: "st8", counsellorId: "co1", mode: "in-person", concern: "career", topic: "Government job vs private after BCom", day: "Yesterday", time: "11:30", room: "Room 1", status: "completed", createdVia: "online",
    notes: "Bright, leaning toward banking. Discussed IBPS timeline and risk of over-preparing for too many exams.",
    actionPlan: [
      { t: "Register for IBPS PO 2026 notification alerts", done: false },
      { t: "Start with quantitative aptitude — 1 hr/day", done: false },
      { t: "Take the free NCS mock test this week", done: false },
      { t: "Follow-up session in 3 weeks", done: false },
    ] },
  { id: "ap9", studentId: "st1", counsellorId: "co1", mode: "in-person", concern: "career", topic: "Stream-to-career roadmap review", day: "Yesterday", time: "09:30", room: "Room 1", status: "no-show", createdVia: "online", notes: "", actionPlan: [] },
]);

const seedMessages = () => ({
  "st1_co1": [
    { from: "counsellor", text: "Hi Insha! Saw your booking. Before we meet, what subjects do you enjoy most right now?", ts: "Today 09:10" },
    { from: "student", text: "I like Biology but my parents want Engineering. I'm really confused.", ts: "Today 09:18" },
    { from: "counsellor", text: "That's a very common and solvable situation. Let's map both paths today at 10:30 — come to Room 1.", ts: "Today 09:22" },
  ],
  "st8_co1": [
    { from: "counsellor", text: "Great session yesterday. I've added your action plan — check 'My Sessions'.", ts: "Yesterday 12:10" },
    { from: "student", text: "Thank you so much, this really helped me focus.", ts: "Yesterday 13:02" },
  ],
});

const seedCamps = () => ([
  { id: "cm1", instId: "i6", title: "Career Awareness Camp", day: "Tomorrow", counsellorId: "co3", registered: 42, status: "scheduled" },
  { id: "cm2", instId: "i5", title: "Exam Stress Workshop", day: "Fri", counsellorId: "co5", registered: 65, status: "scheduled" },
  { id: "cm3", instId: "i3", title: "Scholarship Drive", day: "Yesterday", counsellorId: "co1", registered: 88, status: "completed" },
]);

function freshState() {
  return {
    institutions: INSTITUTIONS,
    counsellors: COUNSELLORS,
    students: [...STUDENTS],
    appointments: seedAppts(),
    messages: seedMessages(),
    camps: seedCamps(),
    notifications: [],
  };
}

/* ---------- store core ---------- */
const Store = {
  _state: null,
  _subs: new Set(),
  _load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) { this._state = JSON.parse(raw); return; }
    } catch (e) {}
    this._state = freshState();
    this._persist();
  },
  _persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(this._state)); } catch (e) {} },
  get() { if (!this._state) this._load(); return this._state; },
  set(updater) {
    const next = typeof updater === "function" ? updater(this.get()) : updater;
    this._state = { ...this._state, ...next };
    this._persist();
    this._subs.forEach((f) => f());
  },
  subscribe(fn) { this._subs.add(fn); return () => this._subs.delete(fn); },
  reset() { this._state = freshState(); this._persist(); this._subs.forEach((f) => f()); },
};

/* ---------- derived helpers ---------- */
const sel = {
  student: (s, id) => s.students.find((x) => x.id === id),
  counsellor: (s, id) => s.counsellors.find((x) => x.id === id),
  inst: (s, id) => s.institutions.find((x) => x.id === id),
  apptsFor: (s, role, id) => s.appointments.filter((a) => (role === "student" ? a.studentId === id : a.counsellorId === id)),
  thread: (s, stId, coId) => s.messages[`${stId}_${coId}`] || [],
};

/* ---------- actions (the ripple) ---------- */
const actions = {
  book({ studentId, counsellorId, mode, concern, topic, day, time }) {
    const room = mode === "in-person" ? (Store.get().counsellors.find((c) => c.id === counsellorId) || {}).room || "Room 1" : "—";
    const appt = { id: uid("ap"), studentId, counsellorId, mode, concern, topic, day, time, room, status: "requested", createdVia: "online", notes: "", actionPlan: [] };
    Store.set((s) => ({ appointments: [appt, ...s.appointments] }));
    return appt.id;
  },
  setStatus(apptId, status) {
    Store.set((s) => ({ appointments: s.appointments.map((a) => a.id === apptId ? { ...a, status } : a) }));
  },
  complete(apptId, { notes, actionPlan }) {
    Store.set((s) => ({ appointments: s.appointments.map((a) => a.id === apptId ? { ...a, status: "completed", notes, actionPlan } : a) }));
  },
  toggleActionItem(apptId, idx) {
    Store.set((s) => ({ appointments: s.appointments.map((a) => {
      if (a.id !== apptId) return a;
      const ap = a.actionPlan.map((it, i) => i === idx ? { ...it, done: !it.done } : it);
      return { ...a, actionPlan: ap };
    }) }));
  },
  sendMessage(stId, coId, from, text) {
    const key = `${stId}_${coId}`;
    Store.set((s) => ({ messages: { ...s.messages, [key]: [...(s.messages[key] || []), { from, text, ts: "Just now" }] } }));
  },
  addStudent({ name, instId, cls, phone, area }) {
    const init = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const st = { id: uid("st"), name, init, instId, cls, phone, area, createdVia: "desk" };
    Store.set((s) => ({ students: [...s.students, st] }));
    return st.id;
  },
  batchRegister(campId, n) {
    Store.set((s) => ({ camps: s.camps.map((c) => c.id === campId ? { ...c, registered: c.registered + n } : c) }));
  },
  setDuty(coId, onDuty) {
    Store.set((s) => ({ counsellors: s.counsellors.map((c) => c.id === coId ? { ...c, onDuty } : c) }));
  },
};

/* ---------- React hook ---------- */
const { useState: _uS, useEffect: _uE } = React;
function useStore(selector) {
  const [, force] = _uS(0);
  _uE(() => Store.subscribe(() => force((n) => n + 1)), []);
  const s = Store.get();
  return selector ? selector(s) : s;
}

window.Store = Store;
window.useStore = useStore;
window.PORTAL = { CONCERNS, MODES, INSTITUTIONS, COUNSELLORS, STUDENTS, DAYS, TIMES, sel, actions,
  DISTRICT: { name: "Anantnag", hss: 78, colleges: 10, center: "District Youth Empowerment & Development Center" } };
