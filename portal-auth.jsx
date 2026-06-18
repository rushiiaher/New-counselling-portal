/* ============================================================
   portal-auth.jsx — entry (choose portal) + login screens
   Exposes: window.EntryScreen, window.LoginScreen
   ============================================================ */

const { useState: useStateAuth } = React;

const ROLES = [
  { id: "student", icon: "school", title: "Student", sub: "Class 8–12, college & alumni", color: "#0f4c81", device: "Mobile app" },
  { id: "counsellor", icon: "psychology", title: "Counsellor", sub: "Center counselling staff", color: "#b45309", device: "Dashboard" },
  { id: "desk", icon: "support_agent", title: "Center Desk", sub: "Front desk & operations", color: "#0e7490", device: "Dashboard" },
  { id: "admin", icon: "admin_panel_settings", title: "District Admin", sub: "Administration & monitoring", color: "#067a55", device: "Dashboard" },
];

function GovHeaderBar() {
  return window.GovUtilityBar ? <window.GovUtilityBar /> : null;
}

function EntryScreen({ onPick }) {
  const T = window.THEME;
  const P = window.PORTAL;
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <GovHeaderBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 22px 60px" }}>
        <div style={{ maxWidth: 940, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.saffronSoft, color: T.saffronDeep, padding: "7px 16px", borderRadius: 999, font: `600 12.5px ${T.body}`, marginBottom: 18 }}>
              <window.Icon name="hub" size={16} fill={1} /> One platform · {P.DISTRICT.hss} schools · {P.DISTRICT.colleges} colleges · 1 counselling center
            </div>
            <h1 style={{ font: `800 40px ${T.head}`, color: T.ink, margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              District Counseling &amp; Career Portal
            </h1>
            <p style={{ font: `400 16px ${T.body}`, color: T.inkSoft, margin: "0 auto", maxWidth: 560, lineHeight: 1.55 }}>
              Connecting students, counsellors and the District Administration with the
              Youth Empowerment &amp; Development Center, Anantnag. Choose your portal to continue.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {ROLES.map((r) => (
              <RoleCard key={r.id} r={r} onPick={() => onPick(r.id)} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36, font: `400 12.5px ${T.body}`, color: T.inkSoft }}>
            <window.Icon name="lock" size={14} style={{ verticalAlign: "-2px", marginRight: 4 }} />
            Secure login · Counselling records are confidential and access-controlled.
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ r, onPick }) {
  const T = window.THEME;
  const [hover, setHover] = useStateAuth(false);
  return (
    <button onClick={onPick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      textAlign: "left", cursor: "pointer", background: "#fff", border: `1px solid ${hover ? r.color : T.outline}`,
      borderRadius: 20, padding: 22, transition: "transform .2s, box-shadow .2s, border-color .2s",
      transform: hover ? "translateY(-4px)" : "none", boxShadow: hover ? `0 16px 36px ${r.color}22` : "0 4px 16px rgba(15,76,129,0.07)",
      display: "flex", flexDirection: "column", gap: 14, minHeight: 188,
    }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: r.color + "18", display: "grid", placeItems: "center" }}>
        <window.Icon name={r.icon} size={30} color={r.color} fill={1} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: `700 19px ${T.head}`, color: T.ink }}>{r.title}</div>
        <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{r.sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ font: `600 11px ${T.body}`, color: r.color, background: r.color + "14", padding: "4px 10px", borderRadius: 999 }}>{r.device}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, font: `600 13px ${T.body}`, color: r.color }}>
          Enter <window.Icon name="arrow_forward" size={16} />
        </span>
      </div>
    </button>
  );
}

const DEMO_CREDS = {
  student: { user: "insha.jan", label: "Student ID", hint: "GGHSS Anantnag · Class 12" },
  counsellor: { user: "dr.ayesha", label: "Staff ID", hint: "Dr. Ayesha Khan · Career & Higher Ed" },
  desk: { user: "desk.anantnag", label: "Operator ID", hint: "Front Desk · Anantnag Center" },
  admin: { user: "rushiahertech@gmail.com", label: "Admin Email", hint: "rushiiaher · District Administration" },
};

function LoginScreen({ role, onBack, onLogin }) {
  const T = window.THEME;
  const r = ROLES.find((x) => x.id === role);
  const cred = DEMO_CREDS[role];
  const [u, setU] = useStateAuth(cred.user);
  const [p, setP] = useStateAuth("••••••••");

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <GovHeaderBar />
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
        {/* left brand panel */}
        <div style={{ background: `linear-gradient(150deg, ${T.primary}, ${r.color})`, color: "#fff", padding: "56px 52px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", right: 40, bottom: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.16)", display: "grid", placeItems: "center", marginBottom: 26 }}>
            <window.Icon name={r.icon} size={36} color="#fff" fill={1} />
          </div>
          <h2 style={{ font: `800 32px ${T.head}`, margin: "0 0 14px", letterSpacing: "-0.02em" }}>{r.title} Portal</h2>
          <p style={{ font: `400 15px ${T.body}`, opacity: 0.9, lineHeight: 1.6, maxWidth: 360, margin: 0 }}>
            {role === "student" && "Book counselling, talk to your counsellor, track your action plan and explore careers — all in one place."}
            {role === "counsellor" && "Manage your caseload, run sessions, record notes and set action plans for the students you guide."}
            {role === "desk" && "Run the center: appointment queue, walk-in check-in, outreach camps and counsellor duty roster."}
            {role === "admin" && "Monitor participation across every institution, track counselling demand and plan district programs."}
          </p>
        </div>

        {/* right form */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ width: "100%", maxWidth: 360 }}>
            <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", font: `600 13px ${T.body}`, color: T.inkSoft, padding: 0, marginBottom: 26 }}>
              <window.Icon name="arrow_back" size={17} /> All portals
            </button>
            <h3 style={{ font: `800 26px ${T.head}`, color: T.ink, margin: "0 0 6px" }}>Sign in</h3>
            <p style={{ font: `400 14px ${T.body}`, color: T.inkSoft, margin: "0 0 26px" }}>{cred.hint}</p>

            <window.Field label={cred.label}>
              <input value={u} onChange={(e) => setU(e.target.value)} style={window.inputStyle} />
            </window.Field>
            <window.Field label="Password / OTP">
              <input type="password" value={p} onChange={(e) => setP(e.target.value)} style={window.inputStyle} />
            </window.Field>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 22px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, font: `400 13px ${T.body}`, color: T.inkSoft, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: r.color, width: 15, height: 15 }} /> Remember me
              </label>
              <span style={{ font: `600 13px ${T.body}`, color: r.color, cursor: "pointer" }}>Forgot?</span>
            </div>

            <button onClick={onLogin} style={{
              width: "100%", height: 50, borderRadius: 13, border: "none", cursor: "pointer",
              background: r.color, color: "#fff", font: `700 15px ${T.body}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <window.Icon name="login" size={20} /> Sign in to {r.title} Portal
            </button>

            <div style={{ marginTop: 20, padding: "11px 14px", borderRadius: 12, background: T.saffronSoft, display: "flex", gap: 9, alignItems: "flex-start" }}>
              <window.Icon name="info" size={16} color={T.saffronDeep} fill={1} style={{ marginTop: 1 }} />
              <span style={{ font: `400 12px ${T.body}`, color: T.saffronDeep, lineHeight: 1.45 }}>
                Demo prototype — credentials are pre-filled. Just press <strong>Sign in</strong> to explore this role.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.EntryScreen = EntryScreen;
window.LoginScreen = LoginScreen;
window.PORTAL_ROLES = ROLES;
