/* ============================================================
   screens-home.jsx — Home screen + shared layout helpers
   ============================================================ */

const { useState: useStateH } = React;

// page padding wrapper
function Page({ children, pb = 96 }) {
  return <div style={{ padding: `18px 16px ${pb}px` }}>{children}</div>;
}

// horizontal snap scroller
function HScroll({ children }) {
  return (
    <div style={{
      display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6, margin: "0 -16px",
      padding: "2px 16px 6px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
    }}>{children}</div>
  );
}

function HomeScreen({ lang, nav }) {
  const { THEME, Icon, Card, Chip, Btn, Photo, Avatar, SectionHead } = window;
  const D = window.DATA;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  const [q, setQ] = useStateH("");

  return (
    <Page>
      {/* HERO */}
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 22, boxShadow: "0 14px 36px rgba(15,76,129,0.22)" }}>
        <Photo src="assets/kashmir_students.png" label="Kashmiri students, Srinagar library" rounded={0}
          style={{ position: "absolute", inset: 0, height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,53,95,0.45) 0%, rgba(0,53,95,0.82) 78%)` }} />
        <div style={{ position: "relative", padding: "22px 18px 18px", color: "#fff" }}>
          <Chip tone="ghost" style={{ backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <Icon name="verified" size={13} fill={1} color={THEME.saffron} /> {t("welcome")} · خوش آمدید
          </Chip>
          <h1 style={{ font: `700 30px ${THEME.head}`, lineHeight: 1.12, letterSpacing: "-0.02em", margin: "12px 0 8px", whiteSpace: "pre-line" }}>
            {t("heroTitle")}
          </h1>
          <p style={{ font: `400 14px ${THEME.body}`, opacity: 0.92, margin: 0, maxWidth: 320, lineHeight: 1.5 }}>{t("heroSub")}</p>
          {/* search */}
          <div style={{ marginTop: 16, display: "flex", gap: 8, background: "rgba(255,255,255,0.96)", borderRadius: 14, padding: 7, boxShadow: "0 8px 20px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, paddingLeft: 8 }}>
              <Icon name="search" size={20} color={THEME.inkSoft} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")}
                style={{ border: "none", outline: "none", background: "transparent", font: `400 14px ${THEME.body}`, color: THEME.ink, width: "100%" }} />
            </div>
            <button onClick={() => nav.go("careers")} style={{ background: THEME.saffron, color: "#3a2400", border: "none", borderRadius: 10, padding: "0 16px", font: `600 14px ${THEME.body}`, cursor: "pointer" }}>{t("explore")}</button>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
        {D.QUICK.map((a) => (
          <button key={a.to} onClick={() => nav.go(a.to)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: THEME.surface, boxShadow: "0 4px 14px rgba(15,76,129,0.1)", display: "grid", placeItems: "center", border: `1px solid ${THEME.outline}` }}>
              <Icon name={a.mi || a.icon} size={26} color={THEME.kashmirBlue} />
            </div>
            <span style={{ font: `600 11.5px ${THEME.body}`, color: THEME.ink, textAlign: "center" }}>{name(a)}</span>
          </button>
        ))}
      </div>

      {/* TALK TO A COUNSELLOR — headline CTA */}
      <div onClick={() => nav.go("book")} style={{
        display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 20, marginBottom: 24, cursor: "pointer",
        background: `linear-gradient(120deg, ${THEME.kashmirBlue}, ${THEME.blueTint})`, color: "#fff",
        boxShadow: "0 10px 26px rgba(15,76,129,0.28)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ width: 50, height: 50, borderRadius: 15, background: "rgba(245,158,11,0.22)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="diversity_3" size={28} color={THEME.saffron} fill={1} />
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ font: `700 17px ${THEME.head}` }}>{t("counselCta")}</div>
          <div style={{ font: `400 12.5px ${THEME.body}`, opacity: 0.88, marginTop: 2 }}>{t("counselCtaSub")}</div>
        </div>
        <Icon name="arrow_forward" size={22} color={THEME.saffron} />
      </div>

      {/* PATHWAYS */}
      <SectionHead title={t("pathways")} sub={t("pathwaysSub")} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {D.PATHWAYS.map((p) => (
          <Card key={p.en} accent={p.accent} onClick={() => nav.go("careers")} pad={15}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, display: "grid", placeItems: "center", background: p.accent ? THEME.saffronSoft : THEME.blueSoft }}>
                <Icon name={p.icon} size={26} color={p.accent ? THEME.saffronDeep : THEME.kashmirBlue} fill={1} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong style={{ font: `700 16px ${THEME.head}`, color: THEME.ink }}>{name(p)}</strong>
                  {p.accent && <Chip tone="saffron">Start here</Chip>}
                </div>
                <p style={{ font: `400 13px ${THEME.body}`, color: THEME.inkSoft, margin: "3px 0 0" }}>{lang === "ur" ? p.descUr : p.descEn}</p>
              </div>
              <Icon name="chevron_right" size={22} color={THEME.outline} />
            </div>
          </Card>
        ))}
      </div>

      {/* AI BANNER */}
      <div onClick={nav.openAI} style={{
        display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 20, marginBottom: 26, cursor: "pointer",
        background: `linear-gradient(120deg, ${THEME.primary}, ${THEME.kashmirBlue})`, color: "#fff",
        boxShadow: "0 10px 26px rgba(15,76,129,0.28)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(245,158,11,0.25)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="auto_awesome" size={26} color={THEME.saffron} fill={1} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 16px ${THEME.head}` }}>{t("aiCounsel")}</div>
          <div style={{ font: `400 12.5px ${THEME.body}`, opacity: 0.85 }}>{t("askAi")}</div>
        </div>
        <Icon name="arrow_forward" size={22} color={THEME.saffron} />
      </div>

      {/* CAREER EXPLORER */}
      <SectionHead title={t("careersTitle")} sub={t("careersSub")} action={t("viewAll")} onAction={() => nav.go("careers")} />
      <HScroll>
        {D.CAREERS.slice(0, 6).map((c) => (
          <div key={c.id} onClick={() => nav.go("careerDetail", { id: c.id })} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 150 }}>
            <Card pad={14} onClick={() => nav.go("careerDetail", { id: c.id })} style={{ height: 158, display: "flex", flexDirection: "column" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: THEME.blueSoft, display: "grid", placeItems: "center", marginBottom: 10 }}>
                <Icon name={c.mi || c.icon} size={24} color={THEME.kashmirBlue} fill={1} />
              </div>
              <strong style={{ font: `700 14.5px ${THEME.head}`, color: THEME.ink, lineHeight: 1.2 }}>{name(c)}</strong>
              <div style={{ marginTop: "auto" }}><Chip tone="green">{c.tag}</Chip></div>
            </Card>
          </div>
        ))}
      </HScroll>

      {/* SCHOLARSHIPS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("scholarTitle")} sub={t("scholarSub")} action={t("viewAll")} onAction={() => nav.go("scholar")} />
        {D.SCHOLARSHIPS.slice(0, 2).map((s) => (
          <Card key={s.id} pad={14} style={{ marginBottom: 10 }} onClick={() => nav.scholarSheet(s)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
              <strong style={{ font: `700 14.5px ${THEME.head}`, color: THEME.ink }}>{name(s)}</strong>
              <Chip tone="green">{s.amount}</Chip>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: `500 12px ${THEME.body}`, color: THEME.inkSoft }}>
              <Icon name="schedule" size={15} /> {t("deadline")}: {s.deadline}
            </div>
          </Card>
        ))}
        <Btn full variant="ghost" icon="checklist" onClick={() => nav.go("eligibility")} style={{ marginTop: 4 }}>{t("eligibilityChecker")}</Btn>
      </div>

      {/* EXAMS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("examTitle")} sub={t("examSub")} action={t("viewAll")} onAction={() => nav.go("exams")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {D.EXAMS.slice(0, 6).map((e) => (
            <Card key={e.id} pad={12} onClick={() => nav.go("examDetail", { id: e.id })} style={{ textAlign: "center" }}>
              <div style={{ font: `700 16px ${THEME.head}`, color: THEME.kashmirBlue }}>{e.code}</div>
              <div style={{ font: `500 10.5px ${THEME.body}`, color: THEME.inkSoft, marginTop: 3 }}>{e.level}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("skillsTitle")} sub={t("skillsSub")} action={t("viewAll")} onAction={() => nav.go("skills")} />
        <HScroll>
          {D.SKILLS.slice(0, 5).map((s) => (
            <div key={s.id} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 140 }}>
              <Card pad={13} style={{ height: 130 }}>
                <Icon name={s.icon} size={26} color={THEME.saffronDeep} fill={1} />
                <strong style={{ font: `700 13.5px ${THEME.head}`, color: THEME.ink, display: "block", marginTop: 10, lineHeight: 1.2 }}>{name(s)}</strong>
                <div style={{ font: `500 11px ${THEME.body}`, color: THEME.inkSoft, marginTop: 5 }}>{s.dur} · {s.mode}</div>
              </Card>
            </div>
          ))}
        </HScroll>
      </div>

      {/* MENTORS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("mentorsTitle")} sub={t("mentorsSub")} action={t("viewAll")} onAction={() => nav.go("mentors")} />
        <HScroll>
          {D.MENTORS.slice(0, 4).map((m) => (
            <div key={m.id} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 168 }}>
              <Card pad={14} onClick={() => nav.mentorSheet(m)} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Avatar init={m.init} size={52} tone="saffron" /></div>
                <strong style={{ font: `700 14px ${THEME.head}`, color: THEME.ink, display: "block" }}>{name(m)}</strong>
                <div style={{ font: `400 11.5px ${THEME.body}`, color: THEME.inkSoft, margin: "2px 0 8px" }}>{m.role}</div>
                <Chip tone="saffron">★ {m.rating}</Chip>
              </Card>
            </div>
          ))}
        </HScroll>
      </div>

      {/* SUCCESS STORY (featured) */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("storiesTitle")} sub={t("storiesSub")} action={t("viewAll")} onAction={() => nav.go("stories")} />
        <Card pad={0} onClick={() => nav.go("stories")} style={{ overflow: "hidden" }}>
          <Photo src="assets/kashmir_teacher.png" label="Student, Srinagar" rounded={0} style={{ height: 150 }} />
          <div style={{ padding: 16 }}>
            <p style={{ font: `500 15px ${THEME.head}`, color: THEME.ink, margin: "0 0 10px", lineHeight: 1.4 }}>"{D.STORIES[0].quote}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar init={D.STORIES[0].init} size={36} />
              <div>
                <div style={{ font: `700 13.5px ${THEME.head}`, color: THEME.ink }}>{name(D.STORIES[0])}</div>
                <div style={{ font: `400 12px ${THEME.body}`, color: THEME.inkSoft }}>{D.STORIES[0].achievement} · {D.STORIES[0].district}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* NEWS */}
      <div style={{ marginTop: 26 }}>
        <SectionHead title={t("newsTitle")} />
        <Card pad={4}>
          {D.NEWS.map((n, i) => (
            <div key={n.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 12px", borderBottom: i < D.NEWS.length - 1 ? `1px solid ${THEME.outline}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: THEME.saffron, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `600 13.5px ${THEME.body}`, color: THEME.ink, lineHeight: 1.3 }}>{name(n)}</div>
                <div style={{ font: `400 11.5px ${THEME.body}`, color: THEME.inkSoft, marginTop: 2 }}>{n.tag} · {n.date}</div>
              </div>
              <Icon name="chevron_right" size={20} color={THEME.outline} />
            </div>
          ))}
        </Card>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 28, textAlign: "center", padding: "20px 0 4px" }}>
        <div style={{ font: `700 14px ${THEME.head}`, color: THEME.kashmirBlue }}>{t("appName")}</div>
        <p style={{ font: `400 11.5px ${THEME.body}`, color: THEME.inkSoft, margin: "6px auto 0", maxWidth: 280, lineHeight: 1.5 }}>
          © 2026 J&K Youth Empowerment & Career Guidance Department. {t("govLine")}
        </p>
      </div>
    </Page>
  );
}

Object.assign(window, { HomeScreen, Page, HScroll });
