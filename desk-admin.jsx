/* ============================================================
   desk-admin.jsx — District Administration dashboard
   Pages: overview, institutions, counsellors, reports
   Exposes: window.AdminApp
   ============================================================ */

const { useState: useStateAd } = React;
const AD_ACCENT = "#067a55";

function AdminApp({ user, onLogout }) {
  const { DeskShell } = window;
  const [page, setPage] = useStateAd("overview");
  const nav = [
    { id: "overview", icon: "monitoring", label: "Overview" },
    { id: "institutions", icon: "apartment", label: "Institutions" },
    { id: "counsellors", icon: "psychology", label: "Counsellors" },
    { id: "reports", icon: "insights", label: "Reports" },
  ];
  return (
    <DeskShell role="District Admin" user={user} nav={nav} active={page} onNav={setPage} onLogout={onLogout} accent={AD_ACCENT}>
      {page === "overview" ? <AdOverview />
        : page === "institutions" ? <AdInstitutions />
        : page === "counsellors" ? <AdCounsellors />
        : <AdReports />}
    </DeskShell>
  );
}

function useStats() {
  const s = window.useStore(); const P = window.PORTAL;
  const ap = s.appointments;
  const completed = ap.filter((a) => a.status === "completed").length;
  const pending = ap.filter((a) => ["requested", "confirmed", "checked-in", "in-progress"].includes(a.status)).length;
  const noShow = ap.filter((a) => a.status === "no-show").length;
  const concernCounts = P.CONCERNS.map((c) => ({ label: c.en, value: ap.filter((a) => a.concern === c.id).length, color: c.color }));
  const modeCounts = P.MODES.map((m) => ({ label: m.en.split(" at")[0], value: ap.filter((a) => a.mode === m.id).length, color: { "in-person": "#0e7490", video: "#0f4c81", phone: "#b45309" }[m.id] }));
  return { s, P, ap, completed, pending, noShow, concernCounts, modeCounts };
}

/* ---------- overview ---------- */
function AdOverview() {
  const T = window.THEME;
  const { Topbar, Scroll, StatTile, Panel, BarChart, Donut, MiniAvatar, ConcernTag, StatusBadge, Pill } = window;
  const { s, P, ap, completed, pending, concernCounts, modeCounts } = useStats();
  const totalStudents = P.DISTRICT.hss * 850 + P.DISTRICT.colleges * 2100; // representative district population
  const recent = [...ap].slice(0, 6);

  return (
    <React.Fragment>
      <Topbar title="District overview" sub={`${P.DISTRICT.name} · ${P.DISTRICT.hss} schools · ${P.DISTRICT.colleges} colleges · 1 counselling center`}
        right={<Pill color={AD_ACCENT}>Live data</Pill>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
          <StatTile icon="groups" label="Students connected" value={(totalStudents / 1000).toFixed(0) + "k"} color="#0f4c81" sub={`${P.DISTRICT.hss + P.DISTRICT.colleges} institutions`} />
          <StatTile icon="forum" label="Counselling requests" value={ap.length} color={AD_ACCENT} delta={{ up: true, val: "this week" }} />
          <StatTile icon="task_alt" label="Sessions completed" value={completed} color="#b45309" />
          <StatTile icon="pending_actions" label="In progress / pending" value={pending} color="#0ea5e9" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
          <Panel title="Top concerns" sub="What students are reaching out about">
            <BarChart data={concernCounts} />
          </Panel>
          <Panel title="Session mode" sub="Online vs. in-person at center">
            <Donut label="sessions" segments={modeCounts} />
          </Panel>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Panel title="Recent counselling activity" pad={8}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {recent.map((a) => {
                  const st = P.sel.student(s, a.studentId); const inst = P.sel.inst(s, st.instId);
                  return (
                    <tr key={a.id}>
                      <window.Td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><MiniAvatar init={st.init} size={30} color={AD_ACCENT} /><div><div style={{ fontWeight: 600 }}>{st.name}</div><div style={{ font: `400 11px 'Inter'`, color: T.inkSoft }}>{inst.block}</div></div></div></window.Td>
                      <window.Td><ConcernTag concern={a.concern} /></window.Td>
                      <window.Td right><StatusBadge status={a.status} size="sm" /></window.Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>
          <Panel title="Center utilization" sub="Today at Anantnag center">
            <UtilizationView />
          </Panel>
        </div>
      </Scroll>
    </React.Fragment>
  );
}

function UtilizationView() {
  const T = window.THEME;
  const { s, P } = useStats();
  const onDuty = s.counsellors.filter((c) => c.onDuty).length;
  const capacity = onDuty * 8; // 8 slots/day
  const booked = s.appointments.filter((a) => a.day === "Today").length;
  const pct = Math.min(100, Math.round((booked / Math.max(capacity, 1)) * 100));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 8 }}>
        <span style={{ font: `800 34px ${T.head}`, color: T.ink }}>{pct}%</span>
        <span style={{ font: `500 13px ${T.body}`, color: T.inkSoft, marginBottom: 7 }}>{booked} of ~{capacity} slots</span>
      </div>
      <div style={{ height: 12, borderRadius: 99, background: T.surfaceAlt, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${AD_ACCENT}, #10b981)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[["Counsellors on duty", `${onDuty} / ${s.counsellors.length}`], ["Rooms in use", "4 / 4"], ["Avg wait", "12 min"], ["Outreach camps", s.camps.filter((c) => c.status === "scheduled").length]].map(([k, v]) => (
          <div key={k} style={{ background: T.bg, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ font: `800 18px ${T.head}`, color: T.ink }}>{v}</div>
            <div style={{ font: `500 11.5px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- institutions ---------- */
function AdInstitutions() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, StatTile, Th, Td, Pill } = window;
  const { s, P } = useStats();
  const [type, setType] = useStateAd("all");
  let list = s.institutions;
  if (type !== "all") list = list.filter((i) => i.type === type);

  return (
    <React.Fragment>
      <Topbar title="Institutions" sub={`${P.DISTRICT.hss} Higher Secondary Schools · ${P.DISTRICT.colleges} Colleges`}
        right={<div style={{ display: "flex", gap: 6 }}>{[["all", "All"], ["hss", "Schools"], ["college", "Colleges"]].map(([id, l]) => (
          <button key={id} onClick={() => setType(id)} style={{ padding: "7px 14px", borderRadius: 999, cursor: "pointer", font: `600 12.5px 'Inter'`, border: type === id ? "none" : `1px solid ${T.outline}`, background: type === id ? AD_ACCENT : "#fff", color: type === id ? "#fff" : T.inkSoft }}>{l}</button>
        ))}</div>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 18 }}>
          <StatTile icon="school" label="Higher Sec. Schools" value={P.DISTRICT.hss} color="#0f4c81" sub="onboarded to portal" />
          <StatTile icon="account_balance" label="Colleges" value={P.DISTRICT.colleges} color={AD_ACCENT} sub="onboarded to portal" />
          <StatTile icon="diversity_3" label="Avg participation" value="64%" color="#b45309" sub="across institutions" />
        </div>
        <Panel pad={8} title={`Showing ${list.length} of ${P.DISTRICT.hss + P.DISTRICT.colleges} (representative sample)`}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Institution</Th><Th>Type</Th><Th>Block</Th><Th right>Students</Th><Th right>Requests</Th><Th>Participation</Th></tr></thead>
            <tbody>
              {list.map((inst) => {
                const reqs = s.appointments.filter((a) => { const st = P.sel.student(s, a.studentId); return st && st.instId === inst.id; }).length;
                const part = 45 + (inst.id.charCodeAt(1) * 7) % 50;
                return (
                  <tr key={inst.id}>
                    <Td><span style={{ fontWeight: 600 }}>{inst.name}</span></Td>
                    <Td><Pill color={inst.type === "hss" ? "#0f4c81" : AD_ACCENT}>{inst.type === "hss" ? "School" : "College"}</Pill></Td>
                    <Td>{inst.block}</Td>
                    <Td right>{inst.students.toLocaleString()}</Td>
                    <Td right>{reqs}</Td>
                    <Td><div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 130 }}><div style={{ flex: 1, height: 7, borderRadius: 99, background: T.surfaceAlt, overflow: "hidden" }}><div style={{ width: `${part}%`, height: "100%", background: AD_ACCENT }} /></div><span style={{ font: `600 11.5px 'Inter'`, color: T.inkSoft }}>{part}%</span></div></Td>
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

/* ---------- counsellors ---------- */
function AdCounsellors() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, MiniAvatar, BarChart } = window;
  const { s, P } = useStats();
  const load = s.counsellors.map((c) => ({ label: c.name, value: s.appointments.filter((a) => a.counsellorId === c.id).length, color: AD_ACCENT }));
  return (
    <React.Fragment>
      <Topbar title="Counsellors" sub="Workload and specialisation" />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 18, alignItems: "start" }}>
          <Panel title="Caseload by counsellor"><BarChart data={load} /></Panel>
          <Panel title="Team" pad={8}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><window.Th>Counsellor</window.Th><window.Th>Specialisation</window.Th><window.Th>Room</window.Th><window.Th right>Sessions</window.Th><window.Th>Status</window.Th></tr></thead>
              <tbody>
                {s.counsellors.map((c) => (
                  <tr key={c.id}>
                    <window.Td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><MiniAvatar init={c.init} size={32} color={AD_ACCENT} /><span style={{ fontWeight: 600 }}>{c.name}</span></div></window.Td>
                    <window.Td>{c.expertise}</window.Td>
                    <window.Td>{c.room}</window.Td>
                    <window.Td right>{s.appointments.filter((a) => a.counsellorId === c.id).length}</window.Td>
                    <window.Td><span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `600 12px 'Inter'`, color: c.onDuty ? "#067a55" : "#94a3b8" }}><span style={{ width: 7, height: 7, borderRadius: 99, background: c.onDuty ? "#10b981" : "#cbd5e1" }} />{c.onDuty ? "On duty" : "Off"}</span></window.Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </Scroll>
    </React.Fragment>
  );
}

/* ---------- reports ---------- */
function AdReports() {
  const T = window.THEME;
  const { Topbar, Scroll, Panel, BarChart, Donut } = window;
  const { s, P, ap, completed, noShow, concernCounts, modeCounts } = useStats();
  const blockData = [...new Set(s.institutions.map((i) => i.block))].map((b, i) => ({
    label: b, value: s.appointments.filter((a) => { const st = P.sel.student(s, a.studentId); const inst = st && P.sel.inst(s, st.instId); return inst && inst.block === b; }).length,
    color: ["#0f4c81", "#0e7490", "#067a55", "#b45309", "#6d28d9", "#be185d"][i % 6],
  })).filter((d) => d.value > 0);
  const statusData = ["requested", "confirmed", "checked-in", "in-progress", "completed", "no-show"].map((st) => ({ label: window.statusMeta(st).label, value: ap.filter((a) => a.status === st).length, color: window.statusMeta(st).dot }));

  return (
    <React.Fragment>
      <Topbar title="Reports" sub="District-level insights for planning" right={<button style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: `1px solid ${T.outline}`, background: "#fff", cursor: "pointer", font: `600 12.5px 'Inter'`, color: T.ink }}><window.Icon name="download" size={16} /> Export</button>} />
      <Scroll>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
          <Panel title="Demand by block" sub="Where counselling is most needed"><BarChart data={blockData} /></Panel>
          <Panel title="Pipeline status" sub="Where requests stand"><BarChart data={statusData} /></Panel>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Panel title="Concern distribution"><Donut label="total" segments={concernCounts.filter((c) => c.value > 0)} /></Panel>
          <Panel title="Key outcomes">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Completion rate", `${Math.round((completed / Math.max(ap.length, 1)) * 100)}%`, "#067a55"], ["No-show rate", `${Math.round((noShow / Math.max(ap.length, 1)) * 100)}%`, "#b91c1c"], ["Students reached (camps)", s.camps.reduce((a, c) => a + c.registered, 0), "#0f4c81"], ["Avg response time", "1.4 days", "#b45309"]].map(([k, v, c]) => (
                <div key={k} style={{ background: T.bg, borderRadius: 13, padding: 16 }}>
                  <div style={{ font: `800 24px ${T.head}`, color: c }}>{v}</div>
                  <div style={{ font: `500 12px ${T.body}`, color: T.inkSoft, marginTop: 3 }}>{k}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Scroll>
    </React.Fragment>
  );
}

window.AdminApp = AdminApp;
