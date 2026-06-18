/* ============================================================
   features.jsx — the four interactive "next-gen" tools
   Exposes: EligibilityChecker, RoadmapGenerator, MentorBooking, AICounselor
   ============================================================ */

const { useState: useStateF, useRef: useRefF, useEffect: useEffectF } = React;

const selectStyle = {
  ...window.inputStyle,
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2342474f' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 38,
  cursor: "pointer",
};

/* ---------- 1. Scholarship Eligibility Checker ---------- */
function EligibilityChecker({ lang }) {
  const { THEME, Field, Btn, Chip, Card, Icon } = window;
  const t = (k) => window.tr(lang, k);
  const [form, setForm] = useStateF({ level: "11-12", income: "le2", category: "general", gender: "any", domicile: "yes" });
  const [results, setResults] = useStateF(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function check() {
    const inc = { le2: 2, le35: 3.5, le8: 8, gt8: 20 }[form.income];
    const matched = window.DATA.SCHOLARSHIPS.filter((s) => {
      if (form.domicile !== "yes" && (s.cat === "jk" || s.id === "pmss")) return false;
      if (s.id === "nmms" && form.level !== "8") return false;
      if (s.id === "begum" && form.gender !== "female") return false;
      if ((s.id === "pmss") && inc > 8) return false;
      if ((s.id === "nmms" || s.id === "min" || s.id === "begum") && inc > 3.5 && s.id !== "min") return false;
      if (s.id === "min" && inc > 2) return false;
      if ((s.cat === "minority") && form.category !== "minority") return false;
      return true;
    });
    setResults(matched);
  }

  const opts = (arr) => arr.map(([v, l]) => <option key={v} value={v}>{l}</option>);

  return (
    <div>
      <p style={{ font: `400 14px ${THEME.body}`, color: THEME.inkSoft, margin: "0 0 16px" }}>
        Answer 5 quick questions to instantly see scholarships you may qualify for.
      </p>
      <Field label="Current level">
        <select style={selectStyle} value={form.level} onChange={(e) => set("level", e.target.value)}>
          {opts([["8", "Class 8"], ["9-10", "Class 9–10"], ["11-12", "Class 11–12"], ["ug", "Undergraduate"]])}
        </select>
      </Field>
      <Field label="Annual family income">
        <select style={selectStyle} value={form.income} onChange={(e) => set("income", e.target.value)}>
          {opts([["le2", "Up to ₹2 lakh"], ["le35", "₹2–3.5 lakh"], ["le8", "₹3.5–8 lakh"], ["gt8", "Above ₹8 lakh"]])}
        </select>
      </Field>
      <Field label="Category">
        <select style={selectStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {opts([["general", "General"], ["obc", "OBC"], ["scst", "SC / ST"], ["minority", "Minority"]])}
        </select>
      </Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Gender">
            <select style={selectStyle} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {opts([["any", "Prefer not to say"], ["female", "Female"], ["male", "Male"]])}
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="J&K domicile">
            <select style={selectStyle} value={form.domicile} onChange={(e) => set("domicile", e.target.value)}>
              {opts([["yes", "Yes"], ["no", "No"]])}
            </select>
          </Field>
        </div>
      </div>
      <Btn full variant="saffron" icon="search" onClick={check}>{t("eligibility")}</Btn>

      {results && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon name={results.length ? "verified" : "info"} size={20} color={results.length ? THEME.green : THEME.saffronDeep} fill={1} />
            <span style={{ font: `700 15px ${THEME.head}`, color: THEME.ink }}>
              {results.length ? `${results.length} scholarship${results.length > 1 ? "s" : ""} matched` : "No exact match — broaden your answers"}
            </span>
          </div>
          {results.map((s) => (
            <Card key={s.id} pad={14} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                <strong style={{ font: `700 15px ${THEME.head}`, color: THEME.ink }}>{lang === "ur" ? s.ur : s.en}</strong>
                <Chip tone="green">{s.amount}</Chip>
              </div>
              <p style={{ font: `400 13px ${THEME.body}`, color: THEME.inkSoft, margin: "0 0 8px" }}>{s.elig}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ font: `500 12px ${THEME.body}`, color: THEME.inkSoft }}>⏱ {t("deadline")}: {s.deadline}</span>
                <Btn size="sm" variant="light">{t("apply")}</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- 2. Career Roadmap Generator ---------- */
function RoadmapGenerator({ lang, preselect }) {
  const { THEME, Field, Btn, Chip } = window;
  const t = (k) => window.tr(lang, k);
  const careers = window.DATA.CAREERS;
  const [cid, setCid] = useStateF(preselect || careers[0].id);
  const [stage, setStage] = useStateF("0");
  const [show, setShow] = useStateF(false);
  const career = careers.find((c) => c.id === cid);

  return (
    <div>
      <p style={{ font: `400 14px ${THEME.body}`, color: THEME.inkSoft, margin: "0 0 16px" }}>
        Pick a goal and where you are now — we'll map the path step by step.
      </p>
      <Field label="Career goal">
        <select style={selectStyle} value={cid} onChange={(e) => { setCid(e.target.value); setShow(false); }}>
          {careers.map((c) => <option key={c.id} value={c.id}>{lang === "ur" ? c.ur : c.en}</option>)}
        </select>
      </Field>
      <Field label="You are at">
        <select style={selectStyle} value={stage} onChange={(e) => setStage(e.target.value)}>
          {career.roadmap.map((s, i) => <option key={i} value={String(i)}>{`Step ${i + 1}: ${s}`}</option>)}
        </select>
      </Field>
      <Btn full variant="saffron" icon="route" onClick={() => setShow(true)}>{t("roadmap")}</Btn>

      {show && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h3 style={{ font: `700 17px ${THEME.head}`, color: THEME.ink, margin: 0 }}>{lang === "ur" ? career.ur : career.en}</h3>
            <Chip tone="green">{career.pay}</Chip>
          </div>
          <div style={{ position: "relative", marginTop: 14, paddingLeft: 6 }}>
            {career.roadmap.map((step, i) => {
              const me = i === Number(stage);
              const done = i < Number(stage);
              const col = done ? THEME.green : me ? THEME.saffron : THEME.kashmirBlue;
              return (
                <div key={i} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i === career.roadmap.length - 1 ? 0 : 22 }}>
                  {i < career.roadmap.length - 1 && (
                    <div style={{ position: "absolute", left: 13, top: 28, bottom: 0, width: 2, background: done ? THEME.green : THEME.outline }} />
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                    background: done ? THEME.green : me ? THEME.saffron : "#fff",
                    border: `2px solid ${col}`, color: done || me ? "#fff" : THEME.kashmirBlue,
                    display: "grid", placeItems: "center", font: `700 13px ${THEME.head}`,
                  }}>{done ? "✓" : i + 1}</div>
                  <div style={{ paddingTop: 3 }}>
                    <div style={{ font: `600 14.5px ${THEME.body}`, color: me ? THEME.saffronDeep : THEME.ink }}>{step}</div>
                    {me && <div style={{ font: `600 11px ${THEME.body}`, color: THEME.saffronDeep, marginTop: 2 }}>◀ You are here</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {career.exams.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <span style={{ font: `600 12px ${THEME.body}`, color: THEME.inkSoft }}>{t("relatedExams")}: </span>
              <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                {career.exams.map((e) => <Chip key={e}>{e}</Chip>)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- 3. Mentor Booking ---------- */
function MentorBooking({ lang, mentor, onConfirm }) {
  const { THEME, Btn, Avatar, Chip } = window;
  const t = (k) => window.tr(lang, k);
  const [slot, setSlot] = useStateF(null);
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Avatar init={mentor.init} size={52} tone="saffron" />
        <div>
          <div style={{ font: `700 16px ${THEME.head}`, color: THEME.ink }}>{lang === "ur" ? mentor.ur : mentor.en}</div>
          <div style={{ font: `400 13px ${THEME.body}`, color: THEME.inkSoft }}>{mentor.role}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
            <Chip tone="blue">{mentor.expertise}</Chip>
            <Chip tone="saffron">★ {mentor.rating}</Chip>
          </div>
        </div>
      </div>
      <div style={{ font: `600 13px ${THEME.body}`, color: THEME.ink, marginBottom: 8 }}>Pick a slot</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {mentor.slots.map((s) => (
          <button key={s} onClick={() => setSlot(s)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 15px", borderRadius: 12, cursor: "pointer", textAlign: "left",
            border: `1.5px solid ${slot === s ? THEME.saffron : THEME.outline}`,
            background: slot === s ? THEME.saffronSoft : "#fff",
            font: `600 14px ${THEME.body}`, color: THEME.ink,
          }}>
            <span><span style={{ marginRight: 8 }}>🗓</span>{s}</span>
            {slot === s && <window.Icon name="check_circle" size={20} color={THEME.saffronDeep} fill={1} />}
          </button>
        ))}
      </div>
      <Btn full variant="saffron" icon="event_available" onClick={() => slot && onConfirm(slot)} style={{ opacity: slot ? 1 : 0.5 }}>
        {t("book")}{slot ? ` · ${slot}` : ""}
      </Btn>
    </div>
  );
}

/* ---------- 4. AI Career Counselor ---------- */
const AI_FLOWS = {
  start: { q: "Hi! I'm your AI Career Counselor. What's on your mind?", chips: ["I'm in Class 10, what stream?", "Which exam for govt job?", "Scholarships for me?", "Suggest a career"] },
};
const AI_REPLIES = [
  { m: /stream|class 10|class 9/i, a: "Great question! Pick your stream by interest + strength:\n• Love math & building? → Science (PCM) → Engineering / IT.\n• Love biology & helping? → Science (PCB) → Medical.\n• Love money & business? → Commerce → CA / management.\n• Love people & ideas? → Arts → Civil services / law / design.\nTry the Career Roadmap Generator to see the full path.", chips: ["Suggest a career", "Which exam for govt job?"] },
  { m: /govt|government|sarkari/i, a: "For government jobs, the main routes are:\n• UPSC — IAS/IPS (national, toughest).\n• JKPSC — J&K state services.\n• SSC CGL — central ministries.\n• Banking (IBPS/SBI) — PO & clerk.\nMost need a graduate degree. Open the Exams hub for syllabus + a prep roadmap.", chips: ["Scholarships for me?", "I'm in Class 10, what stream?"] },
  { m: /scholarship|fund|money|fees/i, a: "There's likely funding for you! Key ones for J&K students:\n• PM Special Scholarship (PMSS) — up to ₹1.25 L/yr.\n• J&K Post-Matric — tuition + stipend.\n• Minority & Begum Hazrat Mahal (for girls).\nRun the Scholarship Eligibility Checker — it matches you in 5 questions.", chips: ["Suggest a career", "Which exam for govt job?"] },
  { m: /career|suggest|confused|what should/i, a: "Tell me what energises you and I'll point you somewhere:\n• Tech & problem-solving → IT & AI or Engineering.\n• Caring for people → Medical or teaching.\n• Kashmir's strengths → Tourism, Handicrafts, Agriculture.\n• Building something of your own → Entrepreneurship (Mission YUVA).\nExplore all 11 paths in the Career Explorer.", chips: ["Scholarships for me?", "Which exam for govt job?"] },
];
function aiAnswer(text) {
  const hit = AI_REPLIES.find((r) => r.m.test(text));
  if (hit) return hit;
  return { a: "Good question. I can help most with choosing a stream, picking competitive exams, finding scholarships, and mapping a career path. Try one of these — or explore the hubs from the menu.", chips: ["I'm in Class 10, what stream?", "Scholarships for me?", "Suggest a career"] };
}

function AICounselor({ lang }) {
  const { THEME, Icon } = window;
  const [msgs, setMsgs] = useStateF([{ who: "ai", text: AI_FLOWS.start.q }]);
  const [chips, setChips] = useStateF(AI_FLOWS.start.chips);
  const [input, setInput] = useStateF("");
  const [typing, setTyping] = useStateF(false);
  const scrollRef = useRefF(null);

  useEffectF(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  function send(text) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { who: "me", text }]);
    setInput("");
    setChips([]);
    setTyping(true);
    setTimeout(() => {
      const r = aiAnswer(text);
      setTyping(false);
      setMsgs((m) => [...m, { who: "ai", text: r.a }]);
      setChips(r.chips || []);
    }, 700);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "4px 2px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.who === "me" ? "flex-end" : "flex-start" }}>
            {m.who === "ai" && (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${THEME.kashmirBlue}, ${THEME.blueTint})`, display: "grid", placeItems: "center", marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                <Icon name="auto_awesome" size={16} color="#fff" fill={1} />
              </div>
            )}
            <div style={{
              maxWidth: "78%", padding: "11px 14px", borderRadius: m.who === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.who === "me" ? THEME.kashmirBlue : "#fff",
              color: m.who === "me" ? "#fff" : THEME.ink,
              border: m.who === "me" ? "none" : `1px solid ${THEME.outline}`,
              font: `400 14px ${THEME.body}`, whiteSpace: "pre-line", lineHeight: 1.5,
              boxShadow: "0 2px 8px rgba(15,76,129,0.06)",
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 4, alignItems: "center", paddingLeft: 38 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.outline, animation: `blink 1s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
      </div>
      {chips.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "8px 2px" }}>
          {chips.map((c) => (
            <button key={c} onClick={() => send(c)} style={{
              font: `600 12.5px ${THEME.body}`, color: THEME.kashmirBlue, background: THEME.blueSoft,
              border: "none", borderRadius: 999, padding: "8px 13px", cursor: "pointer",
            }}>{c}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask anything about your future…"
          style={{ ...window.inputStyle, height: 46, flex: 1 }}
        />
        <button onClick={() => send(input)} style={{
          width: 46, height: 46, borderRadius: 12, border: "none", background: THEME.saffron,
          cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Icon name="send" size={20} color="#3a2400" fill={1} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { EligibilityChecker, RoadmapGenerator, MentorBooking, AICounselor });
