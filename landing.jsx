/* ============================================================
   landing.jsx — Indian-government style portal homepage (NCS vibe)
   Overrides window.EntryScreen with a full gov landing page.
   Also exposes window.GovUtilityBar + window.TricolorStrip for reuse.
   ============================================================ */

const { useState: useStateLd, useEffect: useEffectLd } = React;

/* ---------- shared chrome ---------- */
function TricolorStrip({ h = 4 }) {
  const T = window.THEME;
  return (
    <div style={{ display: "flex", height: h }}>
      <div style={{ flex: 1, background: T.indiaSaffron }} />
      <div style={{ flex: 1, background: "#fff" }} />
      <div style={{ flex: 1, background: T.indiaGreen }} />
    </div>
  );
}

function Emblem({ size = 34, light }) {
  const T = window.THEME;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${light ? "rgba(255,255,255,0.75)" : T.navy}`, display: "grid", placeItems: "center", flexShrink: 0, background: light ? "rgba(255,255,255,0.08)" : "#fff" }}>
      <img src="assets/ashok_stambh.svg" style={{ width: size * 0.6, height: size * 0.6, objectFit: "contain", filter: light ? "brightness(0) invert(1)" : "none" }} alt="Emblem" />
    </div>
  );
}

function GovUtilityBar() {
  const T = window.THEME;
  const [fs, setFs] = useStateLd(0);
  const ico = (path) => `https://betacloud.ncs.gov.in${path}`; // not used; placeholders below
  return (
    <div>
      <TricolorStrip h={5} />
      <div style={{ background: T.navy, color: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "6px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 15 }}>🇮🇳</span>
            <span style={{ font: `600 12px ${T.body}`, letterSpacing: 0.2 }}>Government of Jammu &amp; Kashmir</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ font: `400 12px ${T.body}`, opacity: 0.85 }}>District Administration, Anantnag</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: `600 12px ${T.body}` }}>
              <window.Icon name="call" size={14} /> Helpline 1514
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="#main" style={{ font: `500 12px ${T.body}`, color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>Skip to main</a>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {[["A-", -1], ["A", 0], ["A+", 1]].map(([l, v]) => (
                <button key={l} onClick={() => setFs(v)} style={{ width: 22, height: 20, borderRadius: 5, cursor: "pointer", border: "1px solid rgba(255,255,255,0.3)", background: fs === v ? T.indiaSaffron : "transparent", color: fs === v ? "#3a2400" : "#fff", font: `700 ${l === "A-" ? 9 : l === "A" ? 11 : 12}px ${T.body}`, padding: 0, lineHeight: 1 }}>{l}</button>
              ))}
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <div style={{ display: "flex", gap: 8 }}>
              {["public", "share", "mail"].map((i) => <window.Icon key={i} name={i} size={15} color="rgba(255,255,255,0.85)" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GovHeader({ onPick }) {
  const T = window.THEME;
  const links = ["Home", "About the Center", "Find a Counsellor", "Schemes", "Contact"];
  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${T.outline}`, boxShadow: "0 2px 10px rgba(11,47,107,0.05)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 22px", display: "flex", alignItems: "center", gap: 16 }}>
        <Emblem size={46} />
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ font: `800 18px ${T.head}`, color: T.navy, letterSpacing: "-0.01em" }}>District Counseling &amp; Career Portal</div>
          <div style={{ font: `500 11.5px ${T.body}`, color: T.inkSoft }}>Youth Empowerment &amp; Development Center · Anantnag, J&amp;K</div>
        </div>
        <nav style={{ display: "flex", gap: 22 }}>
          {links.map((l, i) => (
            <a key={l} href="#" onClick={(e) => { e.preventDefault(); if (i !== 0) onPick("student"); else window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ font: `${i === 0 ? 700 : 500} 13.5px ${T.body}`, color: i === 0 ? T.navy : T.inkSoft, textDecoration: "none", borderBottom: i === 0 ? `2px solid ${T.indiaSaffron}` : "2px solid transparent", paddingBottom: 4 }}>{l}</a>
          ))}
        </nav>
        <button onClick={() => document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "none", background: T.indiaSaffron, color: "#3a2400", cursor: "pointer", font: `700 13.5px ${T.body}` }}>
          <window.Icon name="login" size={17} /> Login / Register
        </button>
      </div>
    </header>
  );
}

/* ---------- section heading with tricolor tick ---------- */
function GovHeading({ kicker, title, sub, center }) {
  const T = window.THEME;
  return (
    <div style={{ marginBottom: 26, textAlign: center ? "center" : "left" }}>
      {kicker && <div style={{ font: `700 12px ${T.body}`, color: T.indiaSaffronDeep, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{kicker}</div>}
      <h2 style={{ font: `800 28px ${T.head}`, color: T.navy, margin: 0, letterSpacing: "-0.02em" }}>{title}</h2>
      <div style={{ display: "flex", gap: 4, marginTop: 12, justifyContent: center ? "center" : "flex-start" }}>
        <span style={{ width: 26, height: 4, borderRadius: 9, background: T.indiaSaffron }} />
        <span style={{ width: 14, height: 4, borderRadius: 9, background: "#cbd5e1" }} />
        <span style={{ width: 26, height: 4, borderRadius: 9, background: T.indiaGreen }} />
      </div>
      {sub && <p style={{ font: `400 15px ${T.body}`, color: T.inkSoft, margin: "14px auto 0", maxWidth: center ? 620 : "none", lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}

const Wrap = ({ children, bg, id }) => {
  const T = window.THEME;
  return <section id={id} style={{ background: bg || "transparent", padding: "54px 22px" }}><div style={{ maxWidth: 1180, margin: "0 auto" }}>{children}</div></section>;
};

/* ---------- hero ---------- */
function Hero({ onPick }) {
  const T = window.THEME; const P = window.PORTAL;
  return (
    <div id="main" style={{ position: "relative", background: `linear-gradient(115deg, ${T.navy} 0%, ${T.primary} 55%, #0e5a8a 100%)`, color: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.14, backgroundImage: "url(assets/kashmir_students.png)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", right: -80, top: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,153,51,0.12)" }} />
      <div style={{ position: "absolute", left: -60, bottom: -90, width: 260, height: 260, borderRadius: "50%", background: "rgba(19,136,8,0.12)" }} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 22px 62px", position: "relative", display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 40, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "7px 15px", borderRadius: 999, font: `600 12.5px ${T.body}`, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: T.indiaSaffron }} /> An e-Governance initiative · {P.DISTRICT.hss} Schools · {P.DISTRICT.colleges} Colleges
          </div>
          <h1 style={{ font: `800 44px ${T.head}`, margin: "0 0 16px", lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            Guiding every student of <span style={{ color: T.indiaSaffron }}>Anantnag</span> toward a brighter future
          </h1>
          <p style={{ font: `400 16.5px ${T.body}`, opacity: 0.9, lineHeight: 1.6, margin: "0 0 26px", maxWidth: 520 }}>
            One official platform connecting students, counsellors and the District Administration with the Youth Empowerment &amp; Development Center — for career guidance, counselling and well-being.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onPick("student")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, border: "none", background: T.indiaSaffron, color: "#3a2400", cursor: "pointer", font: `700 15px ${T.body}` }}>
              <window.Icon name="school" size={20} fill={1} /> I'm a Student
            </button>
            <button onClick={() => document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", font: `600 15px ${T.body}` }}>
              All portals <window.Icon name="arrow_downward" size={18} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["groups", "12,400+", "Students reached this year"], ["psychology", "6", "Expert counsellors on duty"], ["event_available", "Free", "Confidential · always free of cost"]].map(([ic, n, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 16, padding: "16px 18px", backdropFilter: "blur(6px)" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(255,153,51,0.22)", display: "grid", placeItems: "center", flexShrink: 0 }}><window.Icon name={ic} size={25} color={T.indiaSaffron} fill={1} /></div>
              <div><div style={{ font: `800 22px ${T.head}` }}>{n}</div><div style={{ font: `400 12.5px ${T.body}`, opacity: 0.82 }}>{l}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- quick "what are you looking for" ---------- */
function QuickStrip({ onPick }) {
  const T = window.THEME;
  const items = [
    { icon: "diversity_3", label: "Talk to a Counsellor", role: "student" },
    { icon: "location_on", label: "Visit the Center", role: "student" },
    { icon: "menu_book", label: "Career Information", role: "student" },
    { icon: "school", label: "Find Scholarships", role: "student" },
  ];
  return (
    <div style={{ maxWidth: 1180, margin: "-34px auto 0", padding: "0 22px", position: "relative", zIndex: 5 }}>
      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 16px 40px rgba(11,47,107,0.16)", border: `1px solid ${T.outline}`, padding: 10, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {items.map((it) => (
          <button key={it.label} onClick={() => onPick(it.role)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 13, cursor: "pointer", border: "none", background: "transparent", transition: "background .15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = T.bg} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: T.blueSoft, display: "grid", placeItems: "center", flexShrink: 0 }}><window.Icon name={it.icon} size={24} color={T.primary} fill={1} /></div>
            <span style={{ font: `700 14px ${T.head}`, color: T.navy, textAlign: "left" }}>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- role cards ---------- */
function Portals({ onPick }) {
  const T = window.THEME;
  const ROLES = window.PORTAL_ROLES;
  return (
    <Wrap id="portals">
      <GovHeading kicker="Secure Sign-in" title="Access your portal" center sub="Choose how you'd like to sign in. Each portal is role-based and access-controlled to keep counselling records confidential." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
        {ROLES.map((r) => <PortalCard key={r.id} r={r} onPick={() => onPick(r.id)} />)}
      </div>
    </Wrap>
  );
}

function PortalCard({ r, onPick }) {
  const T = window.THEME;
  const [hover, setHover] = useStateLd(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: "#fff", border: `1px solid ${hover ? r.color : T.outline}`, borderRadius: 18, overflow: "hidden",
      transition: "transform .2s, box-shadow .2s", transform: hover ? "translateY(-5px)" : "none",
      boxShadow: hover ? `0 18px 40px ${r.color}26` : "0 4px 16px rgba(11,47,107,0.06)", display: "flex", flexDirection: "column",
    }}>
      <div style={{ height: 5, background: r.color }} />
      <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: r.color + "16", display: "grid", placeItems: "center" }}>
          <window.Icon name={r.icon} size={30} color={r.color} fill={1} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: `800 19px ${T.head}`, color: T.navy }}>{r.title}</div>
          <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft, marginTop: 4, lineHeight: 1.45 }}>{r.sub}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, font: `500 11.5px ${T.body}`, color: T.inkSoft }}>
          <window.Icon name={r.device === "Mobile app" ? "phone_iphone" : "desktop_windows"} size={15} /> {r.device}
        </div>
        <button onClick={onPick} style={{ width: "100%", padding: "12px 0", borderRadius: 11, border: "none", cursor: "pointer", background: hover ? r.color : T.bg, color: hover ? "#fff" : T.navy, font: `700 13.5px ${T.body}`, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background .15s, color .15s" }}>
          <window.Icon name="login" size={17} /> Sign in
        </button>
      </div>
    </div>
  );
}

/* ---------- services / sectors grid ---------- */
function Services() {
  const T = window.THEME; const P = window.PORTAL;
  return (
    <Wrap bg={T.bg} id="services">
      <GovHeading kicker="What we offer" title="Counselling & guidance services" sub="Free, confidential support across the areas students need most." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {P.CONCERNS.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: `1px solid ${T.outline}`, borderRadius: 16, padding: 20, display: "flex", gap: 15, alignItems: "flex-start" }}>
            <div style={{ width: 50, height: 50, borderRadius: 13, background: c.color + "15", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <window.Icon name={c.icon} size={26} color={c.color} fill={1} />
            </div>
            <div>
              <div style={{ font: `700 16px ${T.head}`, color: T.navy }}>{c.en}</div>
              <div style={{ font: `400 13px ${T.body}`, color: T.inkSoft, marginTop: 4, lineHeight: 1.45 }}>{SERVICE_DESC[c.id]}</div>
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  );
}
const SERVICE_DESC = {
  career: "Stream selection, course & career roadmaps tailored to you.",
  exam: "Manage exam pressure with proven coping strategies.",
  studies: "Study skills, time management and academic planning.",
  wellbeing: "Confidential support for stress, anxiety and motivation.",
  scholarship: "Find and apply for scholarships you're eligible for.",
  personal: "A safe space to talk through personal and family matters.",
};

/* ---------- updates / announcements ---------- */
function Updates() {
  const T = window.THEME;
  const news = window.DATA.NEWS;
  const tagColor = { Scholarship: T.indiaGreen, Exam: T.indiaSaffronDeep, Skills: T.primary, Event: "#6d28d9" };
  return (
    <Wrap id="updates">
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36, alignItems: "start" }}>
        <div>
          <GovHeading kicker="Stay informed" title="Notices & announcements" />
          <div style={{ background: "#fff", border: `1px solid ${T.outline}`, borderRadius: 16, overflow: "hidden" }}>
            {news.map((n, i) => (
              <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderTop: i ? `1px solid ${T.outline}` : "none" }}>
                <div style={{ width: 46, height: 46, borderRadius: 11, background: T.bg, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <window.Icon name="campaign" size={22} color={tagColor[n.tag] || T.primary} fill={1} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: `600 14.5px ${T.head}`, color: T.ink, lineHeight: 1.35 }}>{n.en}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ font: `700 10.5px ${T.body}`, color: tagColor[n.tag] || T.primary, background: (tagColor[n.tag] || T.primary) + "16", padding: "2px 8px", borderRadius: 999 }}>{n.tag}</span>
                    <span style={{ font: `400 11.5px ${T.body}`, color: T.inkSoft }}>{n.date}</span>
                  </div>
                </div>
                <window.Icon name="chevron_right" size={20} color={T.outline} />
              </div>
            ))}
          </div>
        </div>
        {/* the center card */}
        <div>
          <GovHeading kicker="Visit us" title="The Center" />
          <div style={{ background: "#fff", border: `1px solid ${T.outline}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ height: 130, background: "url(assets/kashmir_workshop.png) center/cover", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent, ${T.navy}cc)` }} />
              <TricolorStrip h={4} />
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ font: `700 16px ${T.head}`, color: T.navy }}>Youth Empowerment &amp; Development Center</div>
              <div style={{ display: "flex", gap: 8, margintop: 8, alignItems: "flex-start", marginTop: 10 }}>
                <window.Icon name="location_on" size={17} color={T.indiaSaffronDeep} fill={1} />
                <span style={{ font: `400 13px ${T.body}`, color: T.inkSoft, lineHeight: 1.45 }}>District Anantnag, Jammu &amp; Kashmir — open Mon–Sat, 9:30 AM to 5:00 PM</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                <window.Icon name="call" size={17} color={T.indiaGreen} fill={1} />
                <span style={{ font: `600 13px ${T.body}`, color: T.ink }}>Helpline 1514 · Toll-free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

/* ---------- free-of-cost / notice band ---------- */
function NoticeBand() {
  const T = window.THEME;
  return (
    <div style={{ background: T.saffronSoft, borderTop: `1px solid ${T.indiaSaffron}55`, borderBottom: `1px solid ${T.indiaSaffron}55` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "grid", placeItems: "center", flexShrink: 0, border: `1px solid ${T.indiaSaffron}55` }}>
          <window.Icon name="verified_user" size={24} color={T.indiaSaffronDeep} fill={1} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 15px ${T.head}`, color: "#7a3e09" }}>All services are free of cost and confidential.</div>
          <div style={{ font: `400 13px ${T.body}`, color: "#8a5a2a", marginTop: 2 }}>The Center never charges any fee for counselling, registration or guidance. Beware of anyone claiming otherwise.</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- footer ---------- */
function GovFooter() {
  const T = window.THEME;
  const cols = [
    { h: "The Portal", links: ["About the Center", "For Students", "For Counsellors", "For Institutions"] },
    { h: "Quick Links", links: ["Book Counselling", "Find a Counsellor", "Scholarships", "Career Information"] },
    { h: "Resources", links: ["Student Handbook", "FAQs", "Disclaimer", "Privacy Policy"] },
  ];
  return (
    <footer style={{ background: T.navy, color: "#fff" }}>
      <TricolorStrip h={4} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 22px 28px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
            <Emblem size={40} light />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ font: `800 16px ${T.head}` }}>District Counseling Portal</div>
              <div style={{ font: `400 11.5px ${T.body}`, opacity: 0.7 }}>Anantnag, Jammu &amp; Kashmir</div>
            </div>
          </div>
          <p style={{ font: `400 13px ${T.body}`, opacity: 0.78, lineHeight: 1.6, margin: "0 0 14px", maxWidth: 320 }}>
            An e-Governance initiative of the District Administration, Anantnag and the Youth Empowerment &amp; Development Center.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["public", "share", "mail", "call"].map((i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center" }}><window.Icon name={i} size={17} color="#fff" /></div>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div style={{ font: `700 13.5px ${T.head}`, marginBottom: 14, color: T.indiaSaffron }}>{c.h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {c.links.map((l) => <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{ font: `400 13px ${T.body}`, color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span style={{ font: `400 12px ${T.body}`, opacity: 0.7 }}>© 2026 District Administration, Anantnag. Content managed by the Youth Empowerment &amp; Development Center.</span>
          <span style={{ font: `400 12px ${T.body}`, opacity: 0.7 }}>Last updated: 15 June 2026 · Best viewed in modern browsers</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- the landing assembly ---------- */
function EntryScreen({ onPick }) {
  const T = window.THEME;
  return (
    <div style={{ minHeight: "100%", background: T.bg }}>
      <GovUtilityBar />
      <GovHeader onPick={onPick} />
      <Hero onPick={onPick} />
      <QuickStrip onPick={onPick} />
      <Portals onPick={onPick} />
      <Services />
      <Updates />
      <NoticeBand />
      <GovFooter />
    </div>
  );
}

window.EntryScreen = EntryScreen;
window.GovUtilityBar = GovUtilityBar;
window.TricolorStrip = TricolorStrip;
window.GovEmblem = Emblem;
