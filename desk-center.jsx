/* ============================================================
   desk-center.jsx — Center front desk & operations
   Pages: queue board, appointments, walk-in register, camps, roster
   Exposes: window.CenterApp
   ============================================================ */

const { useState: useStateCt } = React;
const CT_ACCENT = "#0e7490";

function CenterApp({ user, onLogout }) {
  const { DeskShell } = window;
  const [page, setPage] = useStateCt("queue");
  const s = window.useStore();
  const todayInPerson = s.appointments.filter((a) => a.day === "Today" && a.mode === "in-person" && ["confirmed", "checked-in", "in-progress"].includes(a.status));

  const nav = [
    { id: "queue", icon: "list_alt", label: "Today's queue", badge: todayInPerson.length || null },
    { id: "appts", icon: "event", label: "All appointments" },
    { id: "walkin", icon: "person_add", label: "Walk-in / register" },
    { id: "camps", icon: "campaign", label: "Camps & outreach" },
    { id: "roster", icon: "badge", label: "Duty roster" },
  ];

  return (
    <DeskShell role="Center Desk" user={user} nav={nav} active={page} onNav={setPage} onLogout={onLogout} accent={CT_ACCENT}>
      {page === "queue" ? <QueueBoard />
        : page === "appts" ? <AllAppts />
        : page === "walkin" ? <WalkIn />
        : page === "camps" ? <Camps />
        : <Roster />}
    </DeskShell>
  );
}

/* ---------- queue board ---------- */
function QueueBoard() {
  const T = window.THEME;
  const { Topbar, Scroll, StatTile, Panel, MiniAvatar, ModeIcon, ConcernTag, EmptyState } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const today = s.appointments.filter((a) => a.day === "Today" && a.mode === "in-person");
  const cols = [
    { id: "confirmed", title: "Arriving", icon: "schedule", desc: "Confirmed for today" },
    { id: "checked-in", title: "Waiting", icon: "chair", desc: "Checked in at desk" },
    { id: "in-progress", title: "In session", icon: "record_voice_over", desc: "With counsellor now" },
  ];
  const nowServing = today.filter((a) => a.status === "in-progress");

  function Card({ a }) {
    const st = P.sel.student(s, a.studentId); const co = P.sel.counsellor(s, a.counsellorId);
    return (
      <div style={{ background: "#fff", border: `1px solid ${T.outline}`, borderRadius: 13, padding: 13, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
          <MiniAvatar init={st.init} size={34} color={CT_ACCENT} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: `600 13.5px ${T.head}`, color: T.ink }}>{st.name}</div>
            <div style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft }}>{a.time} · {a.room}</div>
          </div>
          <span style={{ font: `700 12px ${T.head}`, color: CT_ACCENT }}>{a.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 11 }}>
          <ConcernTag concern={a.concern} />
          <span style={{ font: `500 11px ${T.body}`, color: T.inkSoft, whiteSpace: "nowrap" }}>{co.name.split(" ").slice(-1)}</span>
        </div>
        {a.status === "confirmed" && <button onClick={() => P.actions.setStatus(a.id, "checked-in")} style={qBtn("#0ea5e9")}><window.Icon name="how_to_reg" size={16} /> Check in</button>}
        {a.status === "checked-in" && <button onClick={() => P.actions.setStatus(a.id, "in-progress")} style={qBtn("#10b981")}><window.Icon name="login" size={16} /> Send in</button>}
        {a.status === "in-progress" && <button onClick={() => P.actions.setStatus(a.id, "completed")} style={qBtn(CT_ACCENT)}><window.Icon name="check" size={16} /> Mark done</button>}
      </div>
    );
  }

  return (
    <React.Fragment>
      <Topbar title="Today's queue" sub={`${P.DISTRICT.center} · 15 June 2026`}
        right={<span style={{ display: "inline-flex", alignItems: "center", gap: 7, font: `600 13px ${T.body}`, color: "#067a55", background: "#e7f7f0", padding: "8px 14px", borderRadius: 999 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: "#10b981" }} />Center open</span>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
          <StatTile icon="event" label="In-person today" value={today.length} color={CT_ACCENT} />
          <StatTile icon="chair" label="Waiting now" value={today.filter((a) => a.status === "checked-in").length} color="#0ea5e9" />
          <StatTile icon="record_voice_over" label="In session" value={nowServing.length} color="#10b981" />
          <StatTile icon="person_off" label="No-shows" value={today.filter((a) => a.status === "no-show").length} color="#b91c1c" />
        </div>

        {nowServing.length > 0 && (
          <div style={{ background: `linear-gradient(120deg, ${T.primary}, ${CT_ACCENT})`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, color: "#fff", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ font: `700 13px ${T.head}`, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>Now serving</span>
            {nowServing.map((a) => {
              const st = P.sel.student(s, a.studentId);
              return <span key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.16)", padding: "7px 14px", borderRadius: 999, font: `600 13px ${T.body}` }}><window.Icon name="meeting_room" size={16} />{st.name} · {a.room}</span>;
            })}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {cols.map((c) => {
            const list = today.filter((a) => a.status === c.id).sort((a, b) => a.time.localeCompare(b.time));
            return (
              <Panel key={c.id} pad={14} title={<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><window.Icon name={c.icon} size={18} color={CT_ACCENT} fill={1} />{c.title} ({list.length})</span>} sub={c.desc}>
                {list.length === 0 ? <EmptyState icon="inbox" text="Empty" /> : list.map((a) => <Card key={a.id} a={a} />)}
              </Panel>
            );
          })}
        </div>
      </Scroll>
    </React.Fragment>
  );
}
function qBtn(color) { return { width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 9, border: "none", background: color, color: "#fff", cursor: "pointer", font: `700 12.5px 'Inter'` }; }

/* ---------- all appointments ---------- */
function AllAppts() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, MiniAvatar, ModeIcon, ConcernTag, StatusBadge, Th, Td } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const [day, setDay] = useStateCt("all");
  let list = s.appointments;
  if (day !== "all") list = list.filter((a) => a.day === day);

  return (
    <React.Fragment>
      <Topbar title="All appointments" sub={`${list.length} record(s)`}
        right={<div style={{ display: "flex", gap: 6 }}>{["all", ...P.DAYS].map((d) => (
          <button key={d} onClick={() => setDay(d)} style={{ padding: "7px 13px", borderRadius: 999, cursor: "pointer", font: `600 12px 'Inter'`, border: day === d ? "none" : `1px solid ${T.outline}`, background: day === d ? CT_ACCENT : "#fff", color: day === d ? "#fff" : T.inkSoft }}>{d === "all" ? "All" : d}</button>
        ))}</div>} />
      <Scroll>
        <Panel pad={8}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Student</Th><Th>Counsellor</Th><Th>Concern</Th><Th>Mode</Th><Th>When</Th><Th>Source</Th><Th>Status</Th></tr></thead>
            <tbody>
              {list.map((a) => {
                const st = P.sel.student(s, a.studentId); const co = P.sel.counsellor(s, a.counsellorId);
                return (
                  <tr key={a.id}>
                    <Td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><MiniAvatar init={st.init} size={30} color={CT_ACCENT} /><span style={{ fontWeight: 600 }}>{st.name}</span></div></Td>
                    <Td>{co.name}</Td>
                    <Td><ConcernTag concern={a.concern} /></Td>
                    <Td><ModeIcon mode={a.mode} size={17} /></Td>
                    <Td>{a.day} · {a.time}</Td>
                    <Td><span style={{ font: `600 11px 'Inter'`, color: a.createdVia === "desk" ? "#b45309" : "#0f4c81", background: a.createdVia === "desk" ? "#fff4e0" : "#e7eeff", padding: "3px 9px", borderRadius: 999 }}>{a.createdVia === "desk" ? "Desk" : "Online"}</span></Td>
                    <Td><StatusBadge status={a.status} size="sm" /></Td>
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

/* ---------- walk-in / register ---------- */
function WalkIn() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, Field, MiniAvatar } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const [form, setForm] = useStateCt({ name: "", instId: P.INSTITUTIONS[0].id, cls: "", phone: "", area: "", concern: "career", counsellorId: P.COUNSELLORS[0].id, time: P.TIMES[0] });
  const [done, setDone] = useStateCt(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const sel = { ...window.inputStyle, appearance: "none", cursor: "pointer", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2342474f' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 };

  function submit() {
    if (!form.name.trim()) return;
    const sid = P.actions.addStudent({ name: form.name, instId: form.instId, cls: form.cls || "—", phone: form.phone || "—", area: form.area || "—" });
    P.actions.book({ studentId: sid, counsellorId: form.counsellorId, mode: "in-person", concern: form.concern, topic: "Walk-in registered at center desk", day: "Today", time: form.time });
    setDone(form.name);
    setForm({ name: "", instId: P.INSTITUTIONS[0].id, cls: "", phone: "", area: "", concern: "career", counsellorId: P.COUNSELLORS[0].id, time: P.TIMES[0] });
  }

  return (
    <React.Fragment>
      <Topbar title="Walk-in / register student" sub="Create a record for students without an account (camps, no phone, in-person visits)" />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, alignItems: "start" }}>
          <Panel title="Student details">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1 / -1" }}><Field label="Full name"><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Asha Bano" style={window.inputStyle} /></Field></div>
              <Field label="Institution"><select value={form.instId} onChange={(e) => set("instId", e.target.value)} style={sel}>{P.INSTITUTIONS.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></Field>
              <Field label="Class / course"><input value={form.cls} onChange={(e) => set("cls", e.target.value)} placeholder="e.g. Class 12 · Science" style={window.inputStyle} /></Field>
              <Field label="Phone (optional)"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98xxxxxxxx" style={window.inputStyle} /></Field>
              <Field label="Area / block"><input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Bijbehara" style={window.inputStyle} /></Field>
            </div>
          </Panel>
          <Panel title="Assign session">
            <Field label="Concern"><select value={form.concern} onChange={(e) => set("concern", e.target.value)} style={sel}>{P.CONCERNS.map((c) => <option key={c.id} value={c.id}>{c.en}</option>)}</select></Field>
            <Field label="Counsellor"><select value={form.counsellorId} onChange={(e) => set("counsellorId", e.target.value)} style={sel}>{P.COUNSELLORS.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.expertise}</option>)}</select></Field>
            <Field label="Time today"><select value={form.time} onChange={(e) => set("time", e.target.value)} style={sel}>{P.TIMES.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
            <button onClick={submit} style={{ width: "100%", marginTop: 6, padding: "13px 0", borderRadius: 12, border: "none", background: CT_ACCENT, color: "#fff", cursor: "pointer", font: `700 14px 'Inter'`, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <window.Icon name="person_add" size={19} fill={1} /> Register &amp; add to queue
            </button>
            {done && (
              <div style={{ marginTop: 14, padding: "11px 14px", borderRadius: 11, background: "#e7f7f0", display: "flex", gap: 9, alignItems: "center" }}>
                <window.Icon name="check_circle" size={18} color="#067a55" fill={1} />
                <span style={{ font: `500 13px ${T.body}`, color: "#067a55" }}><strong>{done}</strong> registered and added to today's queue.</span>
              </div>
            )}
          </Panel>
        </div>
      </Scroll>
    </React.Fragment>
  );
}

/* ---------- camps & outreach ---------- */
function Camps() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, MiniAvatar, EmptyState } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const [add, setAdd] = useStateCt({});
  return (
    <React.Fragment>
      <Topbar title="Camps & outreach" sub="Counselling drives at schools and colleges" />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
          <window.StatTile icon="campaign" label="Camps scheduled" value={s.camps.filter((c) => c.status === "scheduled").length} color={CT_ACCENT} />
          <window.StatTile icon="groups" label="Students reached" value={s.camps.reduce((a, c) => a + c.registered, 0)} color="#0f4c81" />
          <window.StatTile icon="task_alt" label="Camps completed" value={s.camps.filter((c) => c.status === "completed").length} color="#067a55" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {s.camps.map((c) => {
            const inst = P.sel.inst(s, c.instId); const co = P.sel.counsellor(s, c.counsellorId);
            return (
              <Panel key={c.id} pad={18}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: CT_ACCENT + "16", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <window.Icon name="campaign" size={26} color={CT_ACCENT} fill={1} />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ font: `700 16px ${T.head}`, color: T.ink }}>{c.title}</div>
                    <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{inst.name} · {inst.block} · {c.day} · {co.name}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ font: `800 22px ${T.head}`, color: CT_ACCENT }}>{c.registered}</div>
                    <div style={{ font: `500 11px ${T.body}`, color: T.inkSoft }}>registered</div>
                  </div>
                  <window.StatusBadge status={c.status === "completed" ? "completed" : "confirmed"} />
                  {c.status === "scheduled" && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input type="number" min="1" placeholder="+ batch" value={add[c.id] || ""} onChange={(e) => setAdd((a) => ({ ...a, [c.id]: e.target.value }))} style={{ ...window.inputStyle, width: 96, height: 42 }} />
                      <button onClick={() => { const n = parseInt(add[c.id]); if (n > 0) { P.actions.batchRegister(c.id, n); setAdd((a) => ({ ...a, [c.id]: "" })); } }} style={{ padding: "11px 16px", borderRadius: 10, border: "none", background: CT_ACCENT, color: "#fff", cursor: "pointer", font: `700 13px 'Inter'`, whiteSpace: "nowrap" }}>Register batch</button>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </Scroll>
    </React.Fragment>
  );
}

/* ---------- duty roster ---------- */
function Roster() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, MiniAvatar, Pill } = window;
  const s = window.useStore(); const P = window.PORTAL;
  const onDuty = s.counsellors.filter((c) => c.onDuty).length;
  return (
    <React.Fragment>
      <Topbar title="Duty roster" sub={`${onDuty} of ${s.counsellors.length} counsellors on duty`}
        right={<Pill color={CT_ACCENT}>4 rooms · 8 slots/day</Pill>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {s.counsellors.map((c) => {
            const load = s.appointments.filter((a) => a.counsellorId === c.id && a.day === "Today").length;
            return (
              <Panel key={c.id} pad={18}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <MiniAvatar init={c.init} size={48} color={c.onDuty ? CT_ACCENT : "#94a3b8"} />
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `700 15px ${T.head}`, color: T.ink }}>{c.name}</div>
                    <div style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft }}>{c.expertise} · {c.room}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button onClick={() => P.actions.setDuty(c.id, !c.onDuty)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 999, border: "none", cursor: "pointer", font: `700 12px 'Inter'`, background: c.onDuty ? "#e7f7f0" : "#f1f5f9", color: c.onDuty ? "#067a55" : "#64748b" }}>
                      <span style={{ width: 7, height: 7, borderRadius: 99, background: c.onDuty ? "#10b981" : "#94a3b8" }} />{c.onDuty ? "On duty" : "Off"}
                    </button>
                    <div style={{ font: `500 11.5px ${T.body}`, color: T.inkSoft, marginTop: 6 }}>{load} today</div>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </Scroll>
    </React.Fragment>
  );
}

window.CenterApp = CenterApp;
