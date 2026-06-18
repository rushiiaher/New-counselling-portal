/* ============================================================
   desk-counsellor.jsx — Counsellor dashboard
   Pages: overview, caseload, session console, messages, availability
   Exposes: window.CounsellorApp
   ============================================================ */

const { useState: useStateCo } = React;
const CO_ACCENT = "#b45309";

function CounsellorApp({ user, onLogout }) {
  const T = window.THEME;
  const { DeskShell } = window;
  const meId = user.coId;
  const [page, setPage] = useStateCo("overview");
  const [openAppt, setOpenAppt] = useStateCo(null);
  const [openThread, setOpenThread] = useStateCo(null);

  const s = window.useStore();
  const P = window.PORTAL;
  const myAppts = s.appointments.filter((a) => a.counsellorId === meId);
  const pending = myAppts.filter((a) => a.status === "requested").length;

  const nav = [
    { id: "overview", icon: "dashboard", label: "Overview" },
    { id: "requests", icon: "inbox", label: "Requests", badge: pending || null },
    { id: "caseload", icon: "groups", label: "My caseload" },
    { id: "messages", icon: "forum", label: "Messages" },
    { id: "availability", icon: "schedule", label: "Availability" },
  ];

  function go(p) { setPage(p); setOpenAppt(null); setOpenThread(null); }

  return (
    <DeskShell role="Counsellor" user={user} nav={nav} active={page} onNav={go} onLogout={onLogout} accent={CO_ACCENT}>
      {openAppt
        ? <SessionConsole appt={myAppts.find((a) => a.id === openAppt)} onBack={() => setOpenAppt(null)} />
        : page === "overview" ? <CoOverview meId={meId} user={user} onOpen={setOpenAppt} go={go} />
        : page === "requests" ? <CoRequests meId={meId} />
        : page === "caseload" ? <CoCaseload meId={meId} onOpen={setOpenAppt} />
        : page === "messages" ? <CoMessages meId={meId} openThread={openThread} setOpenThread={setOpenThread} />
        : <CoAvailability user={user} meId={meId} />}
    </DeskShell>
  );
}

/* ---------- overview ---------- */
function CoOverview({ meId, user, onOpen, go }) {
  const T = window.THEME;
  const { Topbar, Scroll, StatTile, Panel, StatusBadge, ModeIcon, ConcernTag, MiniAvatar, Pill, EmptyState } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const mine = s.appointments.filter((a) => a.counsellorId === meId);
  const today = mine.filter((a) => a.day === "Today");
  const pending = mine.filter((a) => a.status === "requested");
  const completed = mine.filter((a) => a.status === "completed");
  const uniqStudents = new Set(mine.map((a) => a.studentId)).size;

  return (
    <React.Fragment>
      <Topbar title={`Good morning, ${user.name.split(" ").slice(-1)[0] === user.name ? user.name : user.name}`} sub="Anantnag · Today, 15 June 2026"
        right={<Pill color={CO_ACCENT}>{user.sub}</Pill>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
          <StatTile icon="event" label="Today's sessions" value={today.length} color={CO_ACCENT} />
          <StatTile icon="inbox" label="Pending requests" value={pending.length} color="#f59e0b" delta={pending.length ? { up: true, val: "action" } : null} />
          <StatTile icon="groups" label="Students guided" value={uniqStudents} color="#0f4c81" />
          <StatTile icon="task_alt" label="Completed" value={completed.length} color="#067a55" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
          <Panel title="Today's schedule" sub={`${today.length} appointment(s)`} pad={0}>
            {today.length === 0 ? <div style={{ padding: 20 }}><EmptyState icon="event_available" text="No sessions today" /></div> : (
              <div>
                {today.sort((a, b) => a.time.localeCompare(b.time)).map((a, i) => {
                  const st = P.sel.student(s, a.studentId);
                  return (
                    <button key={a.id} onClick={() => onOpen(a.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "none", borderTop: i ? `1px solid ${T.outline}` : "none" }}>
                      <div style={{ textAlign: "center", width: 54, flexShrink: 0 }}>
                        <div style={{ font: `700 15px ${T.head}`, color: T.ink }}>{a.time}</div>
                        <div style={{ font: `500 10px ${T.body}`, color: T.inkSoft }}>{a.room}</div>
                      </div>
                      <MiniAvatar init={st.init} color={CO_ACCENT} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: `600 14px ${T.head}`, color: T.ink }}>{st.name}</div>
                        <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.topic}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <ModeIcon mode={a.mode} />
                        <StatusBadge status={a.status} size="sm" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Needs your action" sub="New requests" right={pending.length ? <Pill color="#f59e0b">{pending.length}</Pill> : null}>
            {pending.length === 0 ? <EmptyState icon="done_all" text="All caught up" /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pending.slice(0, 4).map((a) => {
                  const st = P.sel.student(s, a.studentId);
                  return (
                    <div key={a.id} style={{ border: `1px solid ${T.outline}`, borderRadius: 13, padding: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                        <MiniAvatar init={st.init} size={28} color={CO_ACCENT} />
                        <span style={{ font: `600 13px ${T.head}`, color: T.ink }}>{st.name}</span>
                        <span style={{ marginLeft: "auto", font: `500 11px ${T.body}`, color: T.inkSoft }}>{a.day} {a.time}</span>
                      </div>
                      <ConcernTag concern={a.concern} />
                      <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                        <button onClick={() => window.PORTAL.actions.setStatus(a.id, "confirmed")} style={miniBtn(CO_ACCENT, true)}>Accept</button>
                        <button onClick={() => window.PORTAL.actions.setStatus(a.id, "cancelled")} style={miniBtn(T.inkSoft, false)}>Decline</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </Scroll>
    </React.Fragment>
  );
}

function miniBtn(color, filled) {
  return { flex: 1, padding: "8px 0", borderRadius: 9, cursor: "pointer", font: `600 12.5px 'Inter'`,
    border: filled ? "none" : `1px solid ${color}40`, background: filled ? color : "transparent", color: filled ? "#fff" : color };
}

/* ---------- requests ---------- */
function CoRequests({ meId }) {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, ConcernTag, ModeIcon, MiniAvatar, Th, Td, EmptyState } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const reqs = s.appointments.filter((a) => a.counsellorId === meId && a.status === "requested");
  return (
    <React.Fragment>
      <Topbar title="Counselling requests" sub="Students waiting for you to confirm" />
      <Scroll>
        <Panel pad={reqs.length ? 8 : 20}>
          {reqs.length === 0 ? <EmptyState icon="done_all" text="No pending requests" /> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><Th>Student</Th><Th>Concern</Th><Th>Topic</Th><Th>Mode</Th><Th>When</Th><Th right>Action</Th></tr></thead>
              <tbody>
                {reqs.map((a) => {
                  const st = P.sel.student(s, a.studentId); const inst = P.sel.inst(s, st.instId);
                  return (
                    <tr key={a.id}>
                      <Td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><MiniAvatar init={st.init} size={32} color={CO_ACCENT} /><div><div style={{ fontWeight: 600 }}>{st.name}</div><div style={{ font: `400 11.5px 'Inter'`, color: T.inkSoft }}>{inst.name}</div></div></div></Td>
                      <Td><ConcernTag concern={a.concern} /></Td>
                      <Td><span style={{ display: "block", maxWidth: 240 }}>{a.topic}</span></Td>
                      <Td><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ModeIcon mode={a.mode} size={16} />{P.MODES.find((m) => m.id === a.mode).en.split(" ")[0]}</span></Td>
                      <Td>{a.day} · {a.time}</Td>
                      <Td right><div style={{ display: "inline-flex", gap: 8 }}>
                        <button onClick={() => P.actions.setStatus(a.id, "confirmed")} style={{ ...miniBtn(CO_ACCENT, true), padding: "8px 16px" }}>Accept</button>
                        <button onClick={() => P.actions.setStatus(a.id, "cancelled")} style={{ ...miniBtn(T.inkSoft, false), padding: "8px 14px" }}>Decline</button>
                      </div></Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Panel>
      </Scroll>
    </React.Fragment>
  );
}

/* ---------- caseload ---------- */
function CoCaseload({ meId, onOpen }) {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, ConcernTag, StatusBadge, ModeIcon, MiniAvatar, Th, Td } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const [f, setF] = useStateCo("all");
  let mine = s.appointments.filter((a) => a.counsellorId === meId);
  if (f !== "all") mine = mine.filter((a) => f === "active" ? ["requested", "confirmed", "checked-in", "in-progress"].includes(a.status) : a.status === "completed");
  const order = { "in-progress": 0, "checked-in": 1, confirmed: 2, requested: 3, completed: 4, "no-show": 5, cancelled: 6 };
  mine = [...mine].sort((a, b) => (order[a.status] - order[b.status]));

  return (
    <React.Fragment>
      <Topbar title="My caseload" sub={`${mine.length} session(s)`}
        right={<div style={{ display: "flex", gap: 6 }}>{[["all", "All"], ["active", "Active"], ["completed", "Completed"]].map(([id, l]) => (
          <button key={id} onClick={() => setF(id)} style={{ padding: "7px 14px", borderRadius: 999, cursor: "pointer", font: `600 12.5px 'Inter'`, border: f === id ? "none" : `1px solid ${T.outline}`, background: f === id ? CO_ACCENT : "#fff", color: f === id ? "#fff" : T.inkSoft }}>{l}</button>
        ))}</div>} />
      <Scroll>
        <Panel pad={8}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Student</Th><Th>Concern</Th><Th>Mode</Th><Th>When</Th><Th>Status</Th><Th right></Th></tr></thead>
            <tbody>
              {mine.map((a) => {
                const st = P.sel.student(s, a.studentId); const inst = P.sel.inst(s, st.instId);
                return (
                  <tr key={a.id}>
                    <Td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><MiniAvatar init={st.init} size={32} color={CO_ACCENT} /><div><div style={{ fontWeight: 600 }}>{st.name}</div><div style={{ font: `400 11.5px 'Inter'`, color: T.inkSoft }}>{st.cls} · {inst.block}</div></div></div></Td>
                    <Td><ConcernTag concern={a.concern} /></Td>
                    <Td><ModeIcon mode={a.mode} size={17} /></Td>
                    <Td>{a.day} · {a.time}</Td>
                    <Td><StatusBadge status={a.status} size="sm" /></Td>
                    <Td right><button onClick={() => onOpen(a.id)} style={{ padding: "8px 16px", borderRadius: 9, border: `1px solid ${CO_ACCENT}40`, background: "transparent", color: CO_ACCENT, cursor: "pointer", font: `600 12.5px 'Inter'` }}>Open</button></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </Scroll>
    </React.Fragment>
  );
}

/* ---------- session console ---------- */
function SessionConsole({ appt, onBack }) {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, ConcernTag, StatusBadge, ModeIcon, MiniAvatar, Pill } = window;
  const s = window.useStore(); const P = window.PORTAL;
  if (!appt) { onBack(); return null; }
  const st = P.sel.student(s, appt.studentId);
  const inst = P.sel.inst(s, st.instId);
  const [notes, setNotes] = useStateCo(appt.notes || "");
  const [items, setItems] = useStateCo(appt.actionPlan && appt.actionPlan.length ? appt.actionPlan.map((x) => x.t) : [""]);
  const concern = P.CONCERNS.find((c) => c.id === appt.concern);

  // AI pre-screen summary (mock, concern-aware)
  const preScreen = {
    career: ["Interested in 2+ career paths — needs help narrowing.", "Used the in-app Roadmap Generator for Engineering & Medical.", "Strong in Science subjects per profile."],
    exam: ["Reports high stress ahead of a major exam.", "Searched 'exam stress' and NEET prep in app.", "May benefit from a study + wellbeing plan."],
    studies: ["Struggling with time management / consistency.", "Active in Skills section of the app.", "Open to a structured weekly plan."],
    wellbeing: ["Flagged low mood — handle with care.", "Self-initiated this request.", "Consider follow-up + family context."],
    scholarship: ["Looking for funding options.", "Ran the Scholarship Eligibility Checker.", "Income/category details to confirm."],
    personal: ["Personal/family matter — keep confidential.", "Prefers in-person.", "Build rapport first."],
  }[appt.concern] || [];

  const updItem = (i, v) => setItems((a) => a.map((x, j) => j === i ? v : x));
  const addItem = () => setItems((a) => [...a, ""]);
  const rmItem = (i) => setItems((a) => a.filter((_, j) => j !== i));

  function save(complete) {
    const plan = items.filter((x) => x.trim()).map((t) => ({ t, done: false }));
    if (complete) P.actions.complete(appt.id, { notes, actionPlan: plan });
    else window.Store.set((st2) => ({ appointments: st2.appointments.map((a) => a.id === appt.id ? { ...a, notes, actionPlan: plan } : a) }));
  }

  const canStart = ["confirmed", "checked-in"].includes(appt.status);

  return (
    <React.Fragment>
      <Topbar title="Session console" sub={`${st.name} · ${appt.day} ${appt.time}`}
        right={<button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 10, border: `1px solid ${T.outline}`, background: "#fff", cursor: "pointer", font: `600 12.5px 'Inter'`, color: T.ink }}><window.Icon name="arrow_back" size={16} /> Back</button>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, alignItems: "start" }}>
          {/* student profile + prescreen */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Panel pad={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
                <MiniAvatar init={st.init} size={52} color={CO_ACCENT} />
                <div><div style={{ font: `700 17px ${T.head}`, color: T.ink }}>{st.name}</div><div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft }}>{st.cls}</div></div>
              </div>
              {[["Institution", inst.name], ["Block", inst.block], ["Phone", st.phone], ["Concern", null], ["Mode", null], ["Status", null]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${T.outline}` }}>
                  <span style={{ font: `500 12.5px ${T.body}`, color: T.inkSoft }}>{k}</span>
                  {k === "Concern" ? <ConcernTag concern={appt.concern} /> : k === "Mode" ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, font: `600 12.5px ${T.body}`, color: T.ink }}><ModeIcon mode={appt.mode} size={16} />{P.MODES.find((m) => m.id === appt.mode).en.split(" at")[0]}</span> : k === "Status" ? <StatusBadge status={appt.status} size="sm" /> : <span style={{ font: `600 12.5px ${T.body}`, color: T.ink, textAlign: "right", maxWidth: 170 }}>{v}</span>}
                </div>
              ))}
            </Panel>

            <Panel title="AI pre-screen" sub="From the student app" pad={18} style={{ background: "linear-gradient(180deg,#fffaf2,#fff)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {preScreen.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <window.Icon name="auto_awesome" size={15} color={CO_ACCENT} fill={1} style={{ marginTop: 2 }} />
                    <span style={{ font: `400 13px ${T.body}`, color: T.ink, lineHeight: 1.45 }}>{p}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* topic + notes + action plan */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Panel title="Student's question" pad={18}>
              <p style={{ font: `500 15px ${T.head}`, color: T.ink, margin: 0, lineHeight: 1.5 }}>"{appt.topic}"</p>
              {canStart && appt.status !== "in-progress" && (
                <button onClick={() => P.actions.setStatus(appt.id, "in-progress")} style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11, border: "none", background: "#10b981", color: "#fff", cursor: "pointer", font: `700 13.5px 'Inter'` }}>
                  <window.Icon name="play_circle" size={18} fill={1} /> Start session
                </button>
              )}
            </Panel>

            <Panel title="Private case notes" sub="Visible only to counselling staff" pad={18}>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you discuss? Observations, context, next steps…"
                style={{ width: "100%", minHeight: 130, borderRadius: 12, border: `1px solid ${T.outline}`, padding: 14, font: `400 14px ${T.body}`, color: T.ink, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.5 }} />
            </Panel>

            <Panel title="Action plan" sub="Shared with the student in their app" pad={18}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((it, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "center" }}>
                    <span style={{ width: 24, height: 24, borderRadius: 7, background: CO_ACCENT + "18", color: CO_ACCENT, display: "grid", placeItems: "center", font: `700 11px 'Inter'`, flexShrink: 0 }}>{i + 1}</span>
                    <input value={it} onChange={(e) => updItem(i, e.target.value)} placeholder="e.g. Register for IBPS alerts" style={{ ...window.inputStyle, height: 42 }} />
                    {items.length > 1 && <button onClick={() => rmItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft, display: "grid", placeItems: "center" }}><window.Icon name="close" size={18} /></button>}
                  </div>
                ))}
                <button onClick={addItem} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: `1px dashed ${T.outline}`, borderRadius: 10, padding: "9px 14px", cursor: "pointer", font: `600 12.5px 'Inter'`, color: CO_ACCENT }}>
                  <window.Icon name="add" size={17} /> Add step
                </button>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.outline}` }}>
                <button onClick={() => save(false)} style={{ padding: "11px 18px", borderRadius: 11, border: `1px solid ${T.outline}`, background: "#fff", cursor: "pointer", font: `600 13.5px 'Inter'`, color: T.ink }}>Save draft</button>
                <button onClick={() => save(true)} style={{ flex: 1, padding: "11px 18px", borderRadius: 11, border: "none", background: CO_ACCENT, color: "#fff", cursor: "pointer", font: `700 13.5px 'Inter'`, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <window.Icon name="check_circle" size={18} fill={1} /> Complete session &amp; send plan
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </Scroll>
    </React.Fragment>
  );
}

/* ---------- messages ---------- */
function CoMessages({ meId, openThread, setOpenThread }) {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, MiniAvatar } = window;
  const s = window.useStore(); const P = window.PORTAL;
  // threads = students this counsellor has appts with
  const studentIds = [...new Set(s.appointments.filter((a) => a.counsellorId === meId).map((a) => a.studentId))];
  const [draft, setDraft] = useStateCo("");
  const activeSt = openThread || studentIds[0];
  const thread = activeSt ? P.sel.thread(s, activeSt, meId) : [];

  return (
    <React.Fragment>
      <Topbar title="Messages" sub="Async chat with your students" />
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", overflow: "hidden" }}>
        <div style={{ borderRight: `1px solid ${T.outline}`, overflowY: "auto", background: "#fff" }}>
          {studentIds.map((sid) => {
            const st = P.sel.student(s, sid); const th = P.sel.thread(s, sid, meId);
            const last = th[th.length - 1];
            const on = activeSt === sid;
            return (
              <button key={sid} onClick={() => setOpenThread(sid)} style={{ display: "flex", gap: 11, alignItems: "center", padding: "14px 16px", width: "100%", textAlign: "left", cursor: "pointer", border: "none", borderBottom: `1px solid ${T.outline}`, background: on ? T.surfaceAlt : "#fff" }}>
                <MiniAvatar init={st.init} color={CO_ACCENT} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ font: `600 13.5px ${T.head}`, color: T.ink }}>{st.name}</div>
                  <div style={{ font: `400 12px ${T.body}`, color: T.inkSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{last ? last.text : "No messages yet"}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", background: T.bg, minWidth: 0 }}>
          {activeSt ? (
            <React.Fragment>
              <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                {thread.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.from === "counsellor" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "62%", padding: "10px 14px", borderRadius: m.from === "counsellor" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.from === "counsellor" ? CO_ACCENT : "#fff", color: m.from === "counsellor" ? "#fff" : T.ink, border: m.from === "counsellor" ? "none" : `1px solid ${T.outline}`, font: `400 13.5px ${T.body}`, lineHeight: 1.45 }}>
                      {m.text}<div style={{ font: `400 10px ${T.body}`, opacity: 0.6, marginTop: 4 }}>{m.ts}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, borderTop: `1px solid ${T.outline}`, background: "#fff", display: "flex", gap: 10 }}>
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { P.actions.sendMessage(activeSt, meId, "counsellor", draft); setDraft(""); } }} placeholder="Type a message…" style={{ ...window.inputStyle, flex: 1 }} />
                <button onClick={() => { if (draft.trim()) { P.actions.sendMessage(activeSt, meId, "counsellor", draft); setDraft(""); } }} style={{ width: 48, borderRadius: 12, border: "none", background: CO_ACCENT, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><window.Icon name="send" size={19} fill={1} /></button>
              </div>
            </React.Fragment>
          ) : <window.EmptyState icon="forum" text="No conversations yet" />}
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---------- availability ---------- */
function CoAvailability({ user, meId }) {
  const T = window.THEME;
  const { Topbar, Scroll, Panel } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const me = P.sel.counsellor(s, meId);
  const [slots, setSlots] = useStateCo(() => {
    const init = {}; P.DAYS.forEach((d) => { init[d] = ["09:30", "10:30", "11:30", "03:00"]; }); return init;
  });
  const toggle = (day, time) => setSlots((sl) => ({ ...sl, [day]: sl[day].includes(time) ? sl[day].filter((t) => t !== time) : [...sl[day], time] }));

  return (
    <React.Fragment>
      <Topbar title="My availability" sub="Slots students can book"
        right={<button onClick={() => P.actions.setDuty(meId, !me.onDuty)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: "none", cursor: "pointer", font: `700 13px 'Inter'`, background: me.onDuty ? "#e7f7f0" : "#fee2e2", color: me.onDuty ? "#067a55" : "#b91c1c" }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: me.onDuty ? "#10b981" : "#ef4444" }} />{me.onDuty ? "On duty" : "Off duty"}
        </button>} />
      <Scroll>
        <Panel title="Weekly slots" sub="Tap to toggle a slot on or off">
          <div style={{ display: "grid", gridTemplateColumns: `90px repeat(${P.TIMES.length}, 1fr)`, gap: 8 }}>
            <div />
            {P.TIMES.map((t) => <div key={t} style={{ font: `600 11px ${T.body}`, color: T.inkSoft, textAlign: "center" }}>{t}</div>)}
            {P.DAYS.map((d) => (
              <React.Fragment key={d}>
                <div style={{ font: `700 13px ${T.head}`, color: T.ink, display: "flex", alignItems: "center" }}>{d}</div>
                {P.TIMES.map((t) => {
                  const on = slots[d].includes(t);
                  return <button key={t} onClick={() => toggle(d, t)} style={{ height: 38, borderRadius: 9, cursor: "pointer", border: on ? "none" : `1px solid ${T.outline}`, background: on ? CO_ACCENT : "#fff", color: on ? "#fff" : T.outline, display: "grid", placeItems: "center" }}>
                    <window.Icon name={on ? "check" : "add"} size={16} />
                  </button>;
                })}
              </React.Fragment>
            ))}
          </div>
        </Panel>
      </Scroll>
    </React.Fragment>
  );
}

window.CounsellorApp = CounsellorApp;
