/* ============================================================
   ui.jsx — theme tokens + shared primitives
   Exposes: window.THEME and UI components on window
   ============================================================ */

const THEME = {
  primary: "#00355f",
  kashmirBlue: "#0f4c81",
  blueTint: "#2d6197",
  saffron: "#f59e0b",
  saffronDeep: "#b45309",
  saffronSoft: "#fff4e0",
  green: "#10b981",
  greenSoft: "#e7f7f0",
  bg: "#f3f6fd",
  surface: "#ffffff",
  surfaceAlt: "#eef3fc",
  ink: "#111c2d",
  inkSoft: "#42474f",
  outline: "#d8e0ee",
  blueSoft: "#e7eeff",
  indiaSaffron: "#ff9933",
  indiaSaffronDeep: "#e07b1f",
  indiaGreen: "#138808",
  indiaGreenSoft: "#eaf6e7",
  navy: "#0b2f6b",
  head: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
};
window.THEME = THEME;

const { useState, useEffect, useRef } = React;

// Material symbol icon
function Icon({ name, size = 24, fill = 0, weight = 400, color, style }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

// Pill chip / badge
function Chip({ children, tone = "blue", style }) {
  const tones = {
    blue: { bg: THEME.blueSoft, fg: THEME.kashmirBlue },
    saffron: { bg: THEME.saffronSoft, fg: THEME.saffronDeep },
    green: { bg: THEME.greenSoft, fg: "#067a55" },
    ghost: { bg: "rgba(255,255,255,0.16)", fg: "#fff" },
  };
  const t = tones[tone] || tones.blue;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: t.bg, color: t.fg, fontFamily: THEME.body, fontWeight: 600,
      fontSize: 11.5, letterSpacing: 0.2, padding: "4px 10px", borderRadius: 999,
      whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
}

// Glass / soft card
function Card({ children, onClick, style, pad = 16, accent = false }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${accent ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.7)"}`,
        borderRadius: 22,
        boxShadow: hover ? "0 12px 30px rgba(15,76,129,0.16)" : "0 5px 18px rgba(15,76,129,0.08)",
        transform: hover && onClick ? "translateY(-3px)" : "none",
        transition: "transform .25s ease, box-shadow .25s ease",
        cursor: onClick ? "pointer" : "default",
        padding: pad,
        ...style,
      }}
    >{children}</div>
  );
}

// Section header w/ optional action
function SectionHead({ title, sub, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ font: `700 21px ${THEME.head}`, color: THEME.ink, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
        {sub && <p style={{ font: `400 13.5px ${THEME.body}`, color: THEME.inkSoft, margin: "3px 0 0" }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{
          font: `600 13px ${THEME.body}`, color: THEME.kashmirBlue, background: "none",
          border: "none", cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2, padding: 0,
        }}>{action}<Icon name="chevron_right" size={16} /></button>
      )}
    </div>
  );
}

// Button
function Btn({ children, onClick, variant = "primary", icon, size = "md", full, style }) {
  const [hover, setHover] = useState(false);
  const pads = size === "sm" ? "9px 14px" : "13px 18px";
  const fs = size === "sm" ? 13 : 15;
  const variants = {
    primary: { background: THEME.kashmirBlue, color: "#fff", border: "none" },
    saffron: { background: THEME.saffron, color: "#3a2400", border: "none" },
    ghost: { background: "transparent", color: THEME.kashmirBlue, border: `1.5px solid ${THEME.outline}` },
    light: { background: THEME.blueSoft, color: THEME.kashmirBlue, border: "none" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...v, font: `600 ${fs}px ${THEME.body}`, padding: pads, borderRadius: 12,
        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 7, width: full ? "100%" : "auto", transition: "filter .2s, transform .1s",
        filter: hover ? "brightness(0.95)" : "none", ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon && <Icon name={icon} size={fs + 4} />}
      {children}
    </button>
  );
}

// Photo with striped placeholder fallback
function Photo({ src, label, style, rounded = 18, overlay }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: rounded,
        background: `repeating-linear-gradient(135deg, ${THEME.surfaceAlt}, ${THEME.surfaceAlt} 10px, #e3eaf8 10px, #e3eaf8 20px)`,
        display: "flex", alignItems: "center", justifyContent: "center", ...style,
      }}>
        <span style={{ font: `500 11px ui-monospace, monospace`, color: THEME.inkSoft, opacity: 0.8, textAlign: "center", padding: 8 }}>
          {label || "image"}
        </span>
      </div>
    );
  }
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: rounded, ...style }}>
      <img src={src} alt={label || ""} onError={() => setErr(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {overlay}
    </div>
  );
}

// Avatar circle with initials
function Avatar({ init, size = 44, tone = "blue" }) {
  const bg = tone === "saffron" ? THEME.saffron : THEME.kashmirBlue;
  const fg = tone === "saffron" ? "#3a2400" : "#fff";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      font: `700 ${size * 0.36}px ${THEME.head}`,
    }}>{init}</div>
  );
}

// Bottom sheet modal
function Sheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column",
      justifyContent: "flex-end", background: "rgba(17,28,45,0.45)", backdropFilter: "blur(2px)",
      animation: "fadeIn .2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: THEME.surface, borderRadius: "26px 26px 0 0", padding: "10px 18px 22px",
        maxHeight: "86%", overflowY: "auto", animation: "slideUp .3s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: THEME.outline, margin: "4px auto 14px" }} />
        {title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ font: `700 19px ${THEME.head}`, color: THEME.ink, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ background: THEME.surfaceAlt, border: "none", borderRadius: 99, width: 32, height: 32, cursor: "pointer", display: "grid", placeItems: "center" }}>
              <Icon name="close" size={18} color={THEME.inkSoft} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Labeled field
function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ font: `600 13px ${THEME.body}`, color: THEME.ink, display: "block", marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", height: 48, borderRadius: 12, border: `1px solid ${THEME.outline}`,
  background: "#fff", padding: "0 14px", font: `400 15px ${THEME.body}`, color: THEME.ink,
  boxSizing: "border-box", outline: "none",
};

Object.assign(window, { Icon, Chip, Card, SectionHead, Btn, Photo, Avatar, Sheet, Field, inputStyle });
