/* ============================================================
   desk-shell.jsx — desktop dashboard chrome + primitives
   Exposes: DeskShell, StatTile, Panel, StatusBadge, BarChart,
   DataTable, Toolbar, ModeIcon, ConcernTag, EmptyState
   ============================================================ */

const { useState: useStateDesk } = React;

function statusMeta(status) {
  const T = window.THEME;
  return {
    requested: { label: "Requested", bg: "#fff4e0", fg: "#b45309", dot: "#f59e0b" },
    confirmed: { label: "Confirmed", bg: "#e7eeff", fg: "#0f4c81", dot: "#0f4c81" },
    "checked-in": { label: "Checked in", bg: "#e0f2fe", fg: "#0369a1", dot: "#0ea5e9" },
    "in-progress": { label: "In session", bg: "#e7f7f0", fg: "#067a55", dot: "#10b981" },
    completed: { label: "Completed", bg: "#eef2f7", fg: "#475569", dot: "#94a3b8" },
    "no-show": { label: "No-show", bg: "#fee2e2", fg: "#b91c1c", dot: "#ef4444" },
    cancelled: { label: "Cancelled", bg: "#f1f5f9", fg: "#64748b", dot: "#cbd5e1" },
  }[status] || { label: status, bg: "#eef2f7", fg: "#475569", dot: "#94a3b8" };
}

function StatusBadge({ status, size = "md" }) {
  const m = statusMeta(status);
  const pad = size === "sm" ? "3px 9px" : "5px 12px";
  const fs = size === "sm" ? 11 : 12.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: m.bg, color: m.fg, font: `600 ${fs}px 'Inter'`, padding: pad, borderRadius: 999, whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: m.dot }} />{m.label}
    </span>
  );
}

function ModeIcon({ mode, size = 18 }) {
  const m = (window.PORTAL.MODES.find((x) => x.id === mode) || {});
  const colors = { "in-person": "#0e7490", video: "#0f4c81", phone: "#b45309" };
  return <window.Icon name={m.icon || "event"} size={size} color={colors[mode] || "#475569"} />;
}

function ConcernTag({ concern }) {
  const c = window.PORTAL.CONCERNS.find((x) => x.id === concern) || { en: concern, color: "#475569", icon: "label" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.color + "14", color: c.color, font: `600 11.5px 'Inter'`, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
      <window.Icon name={c.icon} size={13} fill={1} />{c.en}
    </span>
  );
}

function DeskShell({ role, user, nav, active, onNav, onLogout, children, accent }) {
  const T = window.THEME;
  const P = window.PORTAL;
  const ac = accent || T.kashmirBlue;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, fontFamily: T.body }}>
      <div style={{ display: "flex", height: 3, flexShrink: 0 }}>
        <div style={{ flex: 1, background: T.indiaSaffron }} />
        <div style={{ flex: 1, background: "#fff" }} />
        <div style={{ flex: 1, background: T.indiaGreen }} />
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* sidebar */}
      <aside style={{ width: 248, flexShrink: 0, background: T.primary, color: "#fff", display: "flex", flexDirection: "column", padding: "20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 8px 18px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: ac, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <window.Icon name="hub" size={21} color="#fff" fill={1} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ font: `700 14px ${T.head}` }}>{role}</div>
            <div style={{ font: `400 11px ${T.body}`, opacity: 0.7 }}>Anantnag Center</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 16, flex: 1 }}>
          {nav.map((n) => {
            const on = active === n.id;
            return (
              <button key={n.id} onClick={() => onNav(n.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 11, cursor: "pointer",
                border: "none", textAlign: "left", width: "100%", transition: "background .15s",
                background: on ? "rgba(255,255,255,0.14)" : "transparent",
                color: on ? "#fff" : "rgba(255,255,255,0.72)", font: `${on ? 600 : 500} 13.5px ${T.body}`,
              }}>
                <window.Icon name={n.icon} size={20} fill={on ? 1 : 0} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge ? <span style={{ background: T.saffron, color: "#3a2400", font: `700 10px ${T.body}`, borderRadius: 999, padding: "2px 7px" }}>{n.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px 12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: ac, display: "grid", placeItems: "center", font: `700 13px ${T.head}`, flexShrink: 0 }}>{user.init}</div>
            <div style={{ lineHeight: 1.25, minWidth: 0 }}>
              <div style={{ font: `600 12.5px ${T.body}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ font: `400 11px ${T.body}`, opacity: 0.65 }}>{user.sub}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)", background: "transparent", color: "rgba(255,255,255,0.8)", cursor: "pointer", font: `600 12.5px ${T.body}` }}>
            <window.Icon name="logout" size={17} /> Switch portal
          </button>
        </div>
      </aside>

      {/* main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {children}
      </div>
      </div>
    </div>
  );
}

function Topbar({ title, sub, right }) {
  const T = window.THEME;
  return (
    <header style={{ flexShrink: 0, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${T.outline}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <div>
        <h1 style={{ font: `700 21px ${T.head}`, color: T.ink, margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
        {sub && <p style={{ font: `400 13px ${T.body}`, color: T.inkSoft, margin: "2px 0 0" }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>{right}</div>
    </header>
  );
}

function Scroll({ children }) {
  return <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>{children}</div>;
}

function StatTile({ icon, label, value, delta, color, sub }) {
  const T = window.THEME;
  const c = color || T.kashmirBlue;
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.outline}`, borderRadius: 18, padding: 18, boxShadow: "0 3px 12px rgba(15,76,129,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: c + "16", display: "grid", placeItems: "center" }}>
          <window.Icon name={icon} size={23} color={c} fill={1} />
        </div>
        {delta && <span style={{ font: `600 11.5px ${T.body}`, color: delta.up ? "#067a55" : "#b91c1c", background: (delta.up ? "#e7f7f0" : "#fee2e2"), padding: "3px 9px", borderRadius: 999 }}>{delta.up ? "▲" : "▼"} {delta.val}</span>}
      </div>
      <div style={{ font: `800 28px ${T.head}`, color: T.ink, letterSpacing: "-0.01em" }}>{value}</div>
      <div style={{ font: `500 12.5px ${T.body}`, color: T.inkSoft, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft, marginTop: 6, opacity: 0.8 }}>{sub}</div>}
    </div>
  );
}

function Panel({ title, sub, right, children, pad = 20, style }) {
  const T = window.THEME;
  return (
    <section style={{ background: "#fff", border: `1px solid ${T.outline}`, borderRadius: 18, boxShadow: "0 3px 12px rgba(15,76,129,0.05)", ...style }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${T.outline}` }}>
          <div>
            <h3 style={{ font: `700 16px ${T.head}`, color: T.ink, margin: 0 }}>{title}</h3>
            {sub && <p style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, margin: "2px 0 0" }}>{sub}</p>}
          </div>
          {right}
        </div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </section>
  );
}

function BarChart({ data, max }) {
  const T = window.THEME;
  const mx = max || Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ font: `500 12.5px ${T.body}`, color: T.ink }}>{d.label}</span>
            <span style={{ font: `700 12.5px ${T.head}`, color: T.inkSoft }}>{d.value}</span>
          </div>
          <div style={{ height: 9, borderRadius: 99, background: T.surfaceAlt, overflow: "hidden" }}>
            <div style={{ width: `${(d.value / mx) * 100}%`, height: "100%", borderRadius: 99, background: d.color || T.kashmirBlue, transition: "width .5s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Donut({ segments, size = 132, label, total }) {
  const T = window.THEME;
  const tot = total || segments.reduce((a, s) => a + s.value, 0) || 1;
  let acc = 0;
  const stops = segments.map((s) => {
    const start = (acc / tot) * 360; acc += s.value;
    const end = (acc / tot) * 360;
    return `${s.color} ${start}deg ${end}deg`;
  }).join(", ");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: `conic-gradient(${stops})`, position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 18, background: "#fff", borderRadius: "50%", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ font: `800 24px ${T.head}`, color: T.ink }}>{tot}</div>
            <div style={{ font: `400 10.5px ${T.body}`, color: T.inkSoft }}>{label}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: s.color }} />
            <span style={{ font: `500 12.5px ${T.body}`, color: T.ink }}>{s.label}</span>
            <span style={{ font: `700 12.5px ${T.head}`, color: T.inkSoft, marginLeft: "auto" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Th({ children, w, right }) {
  return <th style={{ textAlign: right ? "right" : "left", font: `600 11.5px 'Inter'`, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, padding: "0 14px 10px", width: w, whiteSpace: "nowrap" }}>{children}</th>;
}
function Td({ children, right, style }) {
  return <td style={{ textAlign: right ? "right" : "left", padding: "13px 14px", font: `400 13.5px 'Inter'`, color: "#111c2d", borderTop: "1px solid #eef2f7", verticalAlign: "middle", ...style }}>{children}</td>;
}

function MiniAvatar({ init, color, size = 34 }) {
  const T = window.THEME;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: (color || T.kashmirBlue), color: "#fff", display: "grid", placeItems: "center", font: `700 ${size * 0.36}px ${T.head}`, flexShrink: 0 }}>{init}</div>;
}

function Pill({ children, color }) {
  const T = window.THEME;
  const c = color || T.kashmirBlue;
  return <span style={{ font: `600 11.5px ${T.body}`, color: c, background: c + "14", padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>{children}</span>;
}

function EmptyState({ icon, text }) {
  const T = window.THEME;
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: T.inkSoft }}>
      <window.Icon name={icon || "inbox"} size={40} color={T.outline} />
      <div style={{ font: `500 14px ${T.body}`, marginTop: 10 }}>{text}</div>
    </div>
  );
}

Object.assign(window, { DeskShell, Topbar, Scroll, StatTile, Panel, BarChart, Donut, StatusBadge, ModeIcon, ConcernTag, Th, Td, MiniAvatar, Pill, EmptyState, statusMeta });
