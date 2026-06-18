/* ============================================================
   student-counselling.jsx — student-side counselling (mobile)
   Screens: BookCounselling, MySessions, SessionDetail, StudentChat
   Exposes them on window; wired into the student app router.
   ============================================================ */

const { useState: useStateSc } = React;

/* ---------- Talk to a counsellor: booking flow ---------- */
function BookCounselling({ lang, nav, session }) {
  const { THEME: T, Icon, Card, Btn, Page, SecIntro, Avatar } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const [step, setStep] = useStateSc(1);
  const [concern, setConcern] = useStateSc(null);
  const [mode, setMode] = useStateSc(null);
  const [coId, setCoId] = useStateSc(null);
  const [slot, setSlot] = useStateSc(null);
  const studentId = session.studentId;

  const matches = coId ? null : s.counsellors.filter((c) => !concern || c.tags.includes(concern));
  const slots = ["Today · 03:00", "Tomorrow · 10:30", "Tomorrow · 11:30", "Wed · 09:30", "Wed · 04:00"];

  function confirm() {
    const [day, time] = slot.split(" · ");
    P.actions.book({ studentId, counsellorId: coId, mode, concern, topic: topic || "General " + (P.CONCERNS.find((c) => c.id === concern) || {}).en, day, time });
    setStep(5);
  }
  const [topic, setTopic] = useStateSc("");

  const StepHead = ({ n, title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 26, height: 26, borderRadius: 99, background: T.kashmirBlue, color: "#fff", display: "grid", placeItems: "center", font: `700 12px ${T.head}` }}>{n}</span>
      <h2 style={{ font: `700 18px ${T.head}`, color: T.ink, margin: 0 }}>{title}</h2>
    </div>
  );

  if (step === 5) {
    const co = P.sel.counsellor(s, coId);
    return (
      <Page>
        <div style={{ textAlign: "center", padding: "30px 10px" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: T.greenSoft, display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
            <Icon name="check_circle" size={52} color={T.green} fill={1} />
          </div>
          <h1 style={{ font: `700 24px ${T.head}`, color: T.ink, margin: "0 0 8px" }}>Request sent!</h1>
          <p style={{ font: `400 14px ${T.body}`, color: T.inkSoft, margin: "0 0 4px", lineHeight: 1.5 }}>
            {co.name} will confirm your {P.MODES.find((m) => m.id === mode).en.split(" at")[0].toLowerCase()} session.
          </p>
          <p style={{ font: `600 14px ${T.head}`, color: T.kashmirBlue, margin: "0 0 26px" }}>{slot}</p>
          <Card pad={16} style={{ textAlign: "left", marginBottom: 18 }}>
            <div style={{ font: `600 13px ${T.body}`, color: T.inkSoft, marginBottom: 8 }}>What happens next</div>
            {["The counsellor reviews and confirms your slot", mode === "in-person" ? "Visit the Anantnag center — desk checks you in" : "You'll get a secure link / call at the time", "After the session, your action plan appears here"].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
                <Icon name="check" size={16} color={T.green} style={{ marginTop: 2 }} /><span style={{ font: `400 13px ${T.body}`, color: T.ink, lineHeight: 1.4 }}>{x}</span>
              </div>
            ))}
          </Card>
          <Btn full variant="primary" onClick={() => nav.go("mySessions")}>View my sessions</Btn>
          <button onClick={() => nav.go("home")} style={{ marginTop: 12, background: "none", border: "none", color: T.inkSoft, font: `600 13px ${T.body}`, cursor: "pointer" }}>Back to home</button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <SecIntro lang={lang} title="Talk to a counsellor" sub="Free & confidential · Anantnag center" />
      {/* progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[1, 2, 3, 4].map((n) => <div key={n} style={{ flex: 1, height: 5, borderRadius: 99, background: n <= step ? T.kashmirBlue : T.outline }} />)}
      </div>

      {step === 1 && (
        <div>
          <StepHead n={1} title="What do you need help with?" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {P.CONCERNS.map((c) => (
              <Card key={c.id} pad={15} accent={concern === c.id} onClick={() => { setConcern(c.id); setStep(2); }} style={{ borderColor: concern === c.id ? c.color : undefined }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: c.color + "16", display: "grid", placeItems: "center", marginBottom: 10 }}>
                  <Icon name={c.icon} size={24} color={c.color} fill={1} />
                </div>
                <strong style={{ font: `700 14px ${T.head}`, color: T.ink }}>{c.en}</strong>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <StepHead n={2} title="How would you like to meet?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {P.MODES.map((m) => (
              <Card key={m.id} pad={15} accent={mode === m.id} onClick={() => { setMode(m.id); setStep(3); }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: T.blueSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon name={m.icon} size={24} color={T.kashmirBlue} fill={1} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{m.en}</strong>
                    <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{m.sub}</div>
                  </div>
                  <Icon name="chevron_right" size={22} color={T.outline} />
                </div>
              </Card>
            ))}
          </div>
          <BackLink onClick={() => setStep(1)} />
        </div>
      )}

      {step === 3 && (
        <div>
          <StepHead n={3} title="Choose a counsellor" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {matches.map((c) => (
              <Card key={c.id} pad={15} accent={coId === c.id} onClick={() => { setCoId(c.id); setStep(4); }}>
                <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                  <Avatar init={c.init} size={48} tone={c.onDuty ? "blue" : "saffron"} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ font: `700 15px ${T.head}`, color: T.ink }}>{c.name}</strong>
                    <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft }}>{c.expertise}</div>
                    <div style={{ marginTop: 5, font: `600 11px ${T.body}`, color: c.onDuty ? T.green : T.saffronDeep }}>{c.onDuty ? "● Available today" : "○ Limited slots"}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <BackLink onClick={() => setStep(2)} />
        </div>
      )}

      {step === 4 && (
        <div>
          <StepHead n={4} title="Pick a time & add details" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {slots.map((sl) => (
              <button key={sl} onClick={() => setSlot(sl)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 15px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                border: `1.5px solid ${slot === sl ? T.kashmirBlue : T.outline}`, background: slot === sl ? T.blueSoft : "#fff", font: `600 14px ${T.body}`, color: T.ink,
              }}>
                <span><Icon name="event" size={17} color={T.kashmirBlue} style={{ verticalAlign: "-3px", marginRight: 8 }} />{sl}</span>
                {slot === sl && <Icon name="check_circle" size={20} color={T.kashmirBlue} fill={1} />}
              </button>
            ))}
          </div>
          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ font: `600 13px ${T.body}`, color: T.ink, display: "block", marginBottom: 6 }}>Tell your counsellor briefly (optional)</span>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. I'm confused between Engineering and Medical…" style={{ width: "100%", minHeight: 80, borderRadius: 12, border: `1px solid ${T.outline}`, padding: 12, font: `400 14px ${T.body}`, color: T.ink, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </label>
          <Btn full variant="saffron" icon="send" onClick={confirm} style={{ opacity: slot ? 1 : 0.5 }}>Request session</Btn>
          <BackLink onClick={() => setStep(3)} />
        </div>
      )}
    </Page>
  );
}
function BackLink({ onClick }) {
  const T = window.THEME;
  return <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: T.inkSoft, font: `600 13px ${T.body}`, cursor: "pointer", margin: "16px auto 0", padding: 8 }}><window.Icon name="arrow_back" size={16} /> Back</button>;
}

/* ---------- My Sessions ---------- */
function MySessions({ lang, nav, session }) {
  const { THEME: T, Icon, Card, Btn, Page, SecIntro, Avatar, Chip } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const mine = s.appointments.filter((a) => a.studentId === session.studentId);
  const order = { "in-progress": 0, "checked-in": 1, confirmed: 2, requested: 3, completed: 4, "no-show": 5, cancelled: 6 };
  const sorted = [...mine].sort((a, b) => order[a.status] - order[b.status]);

  if (mine.length === 0) {
    return (
      <Page>
        <SecIntro lang={lang} title="My sessions" />
        <Card pad={28} style={{ textAlign: "center" }}>
          <Icon name="event_available" size={44} color={T.outline} />
          <p style={{ font: `500 15px ${T.head}`, color: T.ink, margin: "12px 0 4px" }}>No sessions yet</p>
          <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "0 0 18px" }}>Book a free session with a counsellor.</p>
          <Btn variant="saffron" icon="add" onClick={() => nav.go("book")}>Talk to a counsellor</Btn>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <SecIntro lang={lang} title="My sessions" sub={`${mine.length} session(s)`} />
      <Btn full variant="saffron" icon="add" onClick={() => nav.go("book")} style={{ marginBottom: 16 }}>Book a new session</Btn>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((a) => {
          const co = P.sel.counsellor(s, a.counsellorId);
          const m = P.MODES.find((x) => x.id === a.mode);
          const sm = window.statusMeta(a.status);
          return (
            <Card key={a.id} pad={15} onClick={() => nav.go("sessionDetail", { id: a.id })}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <Avatar init={co.init} size={42} tone="blue" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ font: `700 14.5px ${T.head}`, color: T.ink }}>{co.name}</strong>
                  <div style={{ font: `400 12px ${T.body}`, color: T.inkSoft }}>{co.expertise}</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sm.bg, color: sm.fg, font: `600 11px ${T.body}`, padding: "4px 10px", borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: sm.dot }} />{sm.label}
                </span>
              </div>
              <p style={{ font: `400 13px ${T.body}`, color: T.ink, margin: "0 0 10px", lineHeight: 1.4 }}>"{a.topic}"</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Chip tone="blue"><Icon name={m.icon} size={12} fill={1} style={{ verticalAlign: "-2px" }} /> {m.en.split(" at")[0]}</Chip>
                <Chip tone="saffron"><Icon name="event" size={12} style={{ verticalAlign: "-2px" }} /> {a.day} · {a.time}</Chip>
                {a.mode === "in-person" && a.room !== "—" && <Chip tone="green"><Icon name="meeting_room" size={12} style={{ verticalAlign: "-2px" }} /> {a.room}</Chip>}
                {a.actionPlan && a.actionPlan.length > 0 && <Chip tone="green">✓ Action plan ready</Chip>}
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
}

/* ---------- session detail (status timeline + action plan + chat link) ---------- */
function SessionDetail({ lang, nav, params, session }) {
  const { THEME: T, Icon, Card, Btn, Page, Avatar, Chip } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const a = s.appointments.find((x) => x.id === params.id);
  if (!a) { nav.go("mySessions"); return null; }
  const co = P.sel.counsellor(s, a.counsellorId);
  const m = P.MODES.find((x) => x.id === a.mode);
  const steps = a.mode === "in-person"
    ? [["Requested", "requested"], ["Confirmed", "confirmed"], ["Checked in", "checked-in"], ["In session", "in-progress"], ["Completed", "completed"]]
    : [["Requested", "requested"], ["Confirmed", "confirmed"], ["In session", "in-progress"], ["Completed", "completed"]];
  const order = ["requested", "confirmed", "checked-in", "in-progress", "completed"];
  const curIdx = a.status === "no-show" || a.status === "cancelled" ? -1 : order.indexOf(a.status);

  return (
    <Page>
      <Card pad={18} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 13, alignItems: "center", marginBottom: 14 }}>
          <Avatar init={co.init} size={50} tone="blue" />
          <div style={{ flex: 1 }}>
            <strong style={{ font: `700 17px ${T.head}`, color: T.ink }}>{co.name}</strong>
            <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft }}>{co.expertise}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip tone="blue"><Icon name={m.icon} size={12} fill={1} style={{ verticalAlign: "-2px" }} /> {m.en.split(" at")[0]}</Chip>
          <Chip tone="saffron"><Icon name="event" size={12} style={{ verticalAlign: "-2px" }} /> {a.day} · {a.time}</Chip>
          {a.mode === "in-person" && a.room !== "—" && <Chip tone="green"><Icon name="meeting_room" size={12} style={{ verticalAlign: "-2px" }} /> {a.room}</Chip>}
        </div>
      </Card>

      {(a.status === "no-show" || a.status === "cancelled") ? (
        <Card pad={16} style={{ marginBottom: 16, background: "#fef2f2", borderColor: "#fecaca" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="info" size={20} color="#b91c1c" fill={1} />
            <span style={{ font: `500 13.5px ${T.body}`, color: "#b91c1c" }}>This session was marked {a.status === "no-show" ? "as a no-show" : "cancelled"}. You can book again anytime.</span>
          </div>
        </Card>
      ) : (
        <Card pad={18} style={{ marginBottom: 16 }}>
          <div style={{ font: `700 14px ${T.head}`, color: T.ink, marginBottom: 14 }}>Status</div>
          {steps.map(([label, st], i) => {
            const stIdx = order.indexOf(st);
            const done = stIdx < curIdx; const now = stIdx === curIdx;
            return (
              <div key={st} style={{ display: "flex", gap: 13, position: "relative", paddingBottom: i === steps.length - 1 ? 0 : 16 }}>
                {i < steps.length - 1 && <div style={{ position: "absolute", left: 12, top: 26, bottom: 0, width: 2, background: done ? T.green : T.outline }} />}
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: done ? T.green : now ? T.kashmirBlue : "#fff", border: `2px solid ${done ? T.green : now ? T.kashmirBlue : T.outline}`, color: done || now ? "#fff" : T.outline, display: "grid", placeItems: "center" }}>
                  <Icon name={done ? "check" : now ? "schedule" : "circle"} size={done || now ? 15 : 8} fill={1} />
                </div>
                <div style={{ font: `${now ? 700 : 500} 14px ${T.body}`, color: now ? T.kashmirBlue : done ? T.ink : T.inkSoft, paddingTop: 3 }}>{label}{now && " — now"}</div>
              </div>
            );
          })}
        </Card>
      )}

      {a.actionPlan && a.actionPlan.length > 0 && (
        <Card pad={18} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Icon name="checklist" size={20} color={T.saffronDeep} fill={1} />
            <div style={{ font: `700 15px ${T.head}`, color: T.ink }}>Your action plan</div>
          </div>
          <p style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, margin: "0 0 14px" }}>From {co.name}. Tap to mark done.</p>
          {a.actionPlan.map((it, i) => (
            <button key={i} onClick={() => P.actions.toggleActionItem(a.id, i)} style={{ display: "flex", gap: 11, alignItems: "flex-start", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "8px 0", borderTop: i ? `1px solid ${T.outline}` : "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, marginTop: 1, background: it.done ? T.green : "#fff", border: `2px solid ${it.done ? T.green : T.outline}`, display: "grid", placeItems: "center" }}>
                {it.done && <Icon name="check" size={15} color="#fff" />}
              </div>
              <span style={{ font: `500 14px ${T.body}`, color: it.done ? T.inkSoft : T.ink, textDecoration: it.done ? "line-through" : "none", lineHeight: 1.4 }}>{it.t}</span>
            </button>
          ))}
        </Card>
      )}

      {a.notes && (
        <Card pad={16} style={{ marginBottom: 16 }}>
          <div style={{ font: `700 13px ${T.head}`, color: T.ink, marginBottom: 6 }}>Counsellor's summary</div>
          <p style={{ font: `400 13.5px ${T.body}`, color: T.inkSoft, margin: 0, lineHeight: 1.5 }}>{a.notes}</p>
        </Card>
      )}

      <Btn full variant="primary" icon="forum" onClick={() => nav.go("studentChat", { coId: a.counsellorId })}>Message {co.name.split(" ")[0]}</Btn>
    </Page>
  );
}

/* ---------- student chat ---------- */
function StudentChat({ lang, nav, params, session }) {
  const { THEME: T, Icon, Avatar } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const coId = params.coId || s.appointments.find((a) => a.studentId === session.studentId)?.counsellorId;
  const co = P.sel.counsellor(s, coId);
  const thread = P.sel.thread(s, session.studentId, coId);
  const [draft, setDraft] = useStateSc("");
  const scrollRef = React.useRef(null);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [thread.length]);
  function send() { if (draft.trim()) { P.actions.sendMessage(session.studentId, coId, "student", draft); setDraft(""); } }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 16px", borderBottom: `1px solid ${T.outline}`, background: "#fff" }}>
        <Avatar init={co.init} size={40} tone="blue" />
        <div><div style={{ font: `700 14px ${T.head}`, color: T.ink }}>{co.name}</div><div style={{ font: `400 11.5px ${T.body}`, color: T.green }}>● Usually replies within a day</div></div>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 11, background: T.bg }}>
        {thread.length === 0 && <div style={{ textAlign: "center", color: T.inkSoft, font: `400 13px ${T.body}`, marginTop: 30 }}>Say hello to your counsellor 👋</div>}
        {thread.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "student" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "78%", padding: "10px 13px", borderRadius: m.from === "student" ? "15px 15px 4px 15px" : "15px 15px 15px 4px", background: m.from === "student" ? T.kashmirBlue : "#fff", color: m.from === "student" ? "#fff" : T.ink, border: m.from === "student" ? "none" : `1px solid ${T.outline}`, font: `400 14px ${T.body}`, lineHeight: 1.45 }}>
              {m.text}<div style={{ font: `400 10px ${T.body}`, opacity: 0.6, marginTop: 4 }}>{m.ts}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${T.outline}`, background: "#fff" }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" style={{ ...window.inputStyle, flex: 1 }} />
        <button onClick={send} style={{ width: 46, borderRadius: 12, border: "none", background: T.kashmirBlue, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="send" size={19} fill={1} /></button>
      </div>
    </div>
  );
}

Object.assign(window, { BookCounselling, MySessions, SessionDetail, StudentChat });
