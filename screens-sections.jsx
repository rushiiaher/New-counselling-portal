/* ============================================================
   screens-sections.jsx — all non-home screens
   ============================================================ */

const { useState: useStateS } = React;

/* ---------- Careers ---------- */
function CareersScreen({ lang, nav }) {
  const { THEME, Icon, Card, Chip, Btn, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  return (
    <Page>
      <SecIntro lang={lang} title={t("careersTitle")} sub={t("careersSub")} />
      <Btn full variant="saffron" icon="route" onClick={() => nav.go("roadmap")} style={{ marginBottom: 16 }}>{t("roadmapGen")}</Btn>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {window.DATA.CAREERS.map((c) => (
          <Card key={c.id} pad={14} onClick={() => nav.go("careerDetail", { id: c.id })} style={{ display: "flex", flexDirection: "column", minHeight: 150 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: THEME.blueSoft, display: "grid", placeItems: "center", marginBottom: 10 }}>
              <Icon name={c.mi || c.icon} size={24} color={THEME.kashmirBlue} fill={1} />
            </div>
            <strong style={{ font: `700 14.5px ${THEME.head}`, color: THEME.ink, lineHeight: 1.2 }}>{name(c)}</strong>
            <p style={{ font: `400 11.5px ${THEME.body}`, color: THEME.inkSoft, margin: "5px 0 0", lineHeight: 1.35, flex: 1 }}>{c.desc}</p>
            <div style={{ marginTop: 10 }}><Chip tone="green">{c.tag}</Chip></div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function CareerDetail({ lang, nav, params }) {
  const { THEME, Icon, Card, Chip, Btn, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  const c = window.DATA.CAREERS.find((x) => x.id === params.id);
  return (
    <Page>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 8 }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: `linear-gradient(135deg, ${THEME.kashmirBlue}, ${THEME.blueTint})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name={c.mi || c.icon} size={30} color="#fff" fill={1} />
        </div>
        <div>
          <h1 style={{ font: `700 22px ${THEME.head}`, color: THEME.ink, margin: 0 }}>{name(c)}</h1>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}><Chip tone="green">{c.tag}</Chip><Chip tone="saffron">{t("avgPay")}: {c.pay}</Chip></div>
        </div>
      </div>
      <p style={{ font: `400 15px ${THEME.body}`, color: THEME.inkSoft, lineHeight: 1.55, margin: "14px 0 20px" }}>{c.desc}</p>

      <h3 style={blkH}>{t("prep")}</h3>
      <Card pad={16} style={{ marginBottom: 20 }}>
        {c.roadmap.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 13, position: "relative", paddingBottom: i === c.roadmap.length - 1 ? 0 : 18 }}>
            {i < c.roadmap.length - 1 && <div style={{ position: "absolute", left: 12, top: 26, bottom: 0, width: 2, background: THEME.outline }} />}
            <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: THEME.blueSoft, border: `2px solid ${THEME.kashmirBlue}`, color: THEME.kashmirBlue, display: "grid", placeItems: "center", font: `700 12px ${THEME.head}` }}>{i + 1}</div>
            <div style={{ font: `500 14px ${THEME.body}`, color: THEME.ink, paddingTop: 3 }}>{step}</div>
          </div>
        ))}
      </Card>

      {c.exams.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={blkH}>{t("relatedExams")}</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {c.exams.map((e) => {
              const ex = window.DATA.EXAMS.find((x) => x.code === e || x.code.startsWith(e));
              return <button key={e} onClick={() => ex && nav.go("examDetail", { id: ex.id })} style={chipBtn(THEME)}>{e}</button>;
            })}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <h3 style={blkH}>{t("keySkills")}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {c.skills.map((s) => <Chip key={s} tone="blue">{s}</Chip>)}
        </div>
      </div>

      <Btn full variant="saffron" icon="route" onClick={() => nav.go("roadmap", { preselect: c.id })}>{t("roadmapGen")}</Btn>
    </Page>
  );
}

/* ---------- Scholarships ---------- */
function ScholarScreen({ lang, nav }) {
  const { THEME, Icon, Card, Chip, Btn, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  const [f, setF] = useStateS("all");
  const list = window.DATA.SCHOLARSHIPS.filter((s) => f === "all" || s.cat === f);
  return (
    <Page>
      <SecIntro lang={lang} title={t("scholarTitle")} sub={t("scholarSub")} />
      <div onClick={() => nav.go("eligibility")} style={{ display: "flex", gap: 12, alignItems: "center", padding: 14, borderRadius: 18, marginBottom: 16, cursor: "pointer", background: `linear-gradient(120deg, ${THEME.saffron}, #fbbf24)`, color: "#3a2400", boxShadow: "0 8px 22px rgba(245,158,11,0.32)" }}>
        <Icon name="checklist" size={28} fill={1} />
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 15px ${THEME.head}` }}>{t("eligibilityChecker")}</div>
          <div style={{ font: `400 12px ${THEME.body}`, opacity: 0.8 }}>Match in 5 questions</div>
        </div>
        <Icon name="arrow_forward" size={22} />
      </div>
      <FilterRow items={window.DATA.SCHOLAR_FILTERS} value={f} onChange={setF} lang={lang} />
      {list.map((s) => (
        <Card key={s.id} pad={15} style={{ marginBottom: 12 }} onClick={() => nav.scholarSheet(s)}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
            <strong style={{ font: `700 15px ${THEME.head}`, color: THEME.ink }}>{name(s)}</strong>
            <Chip tone="green">{s.amount}</Chip>
          </div>
          <div style={{ font: `500 12px ${THEME.body}`, color: THEME.inkSoft, marginBottom: 8 }}>{s.provider}</div>
          <p style={{ font: `400 13px ${THEME.body}`, color: THEME.inkSoft, margin: "0 0 10px", lineHeight: 1.45 }}>{s.elig}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, font: `600 12px ${THEME.body}`, color: THEME.saffronDeep }}><Icon name="schedule" size={15} />{s.deadline}</span>
            <Btn size="sm" variant="light">{t("apply")}</Btn>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Exams ---------- */
function ExamsScreen({ lang, nav }) {
  const { THEME, Card, Chip, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  return (
    <Page>
      <SecIntro lang={lang} title={t("examTitle")} sub={t("examSub")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {window.DATA.EXAMS.map((e) => (
          <Card key={e.id} pad={15} onClick={() => nav.go("examDetail", { id: e.id })} style={{ minHeight: 110 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ font: `700 19px ${THEME.head}`, color: THEME.kashmirBlue }}>{e.code}</div>
              <Chip tone="blue">{e.level}</Chip>
            </div>
            <div style={{ font: `600 13px ${THEME.body}`, color: THEME.ink, marginTop: 8, lineHeight: 1.3 }}>{name(e)}</div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function ExamDetail({ lang, nav, params }) {
  const { THEME, Icon, Card, Chip, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  const e = window.DATA.EXAMS.find((x) => x.id === params.id);
  const block = (title, items, icon, ordered) => (
    <div style={{ marginBottom: 18 }}>
      <h3 style={blkH}><Icon name={icon} size={18} color={THEME.kashmirBlue} style={{ verticalAlign: "-3px", marginRight: 6 }} />{title}</h3>
      <Card pad={14}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
            {ordered
              ? <span style={{ font: `700 12px ${THEME.head}`, color: "#fff", background: THEME.saffron, borderRadius: 99, minWidth: 20, height: 20, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</span>
              : <span style={{ width: 6, height: 6, borderRadius: 99, background: THEME.kashmirBlue, marginTop: 7, flexShrink: 0 }} />}
            <span style={{ font: `400 13.5px ${THEME.body}`, color: THEME.ink, lineHeight: 1.45 }}>{it}</span>
          </div>
        ))}
      </Card>
    </div>
  );
  return (
    <Page>
      <h1 style={{ font: `700 26px ${THEME.head}`, color: THEME.kashmirBlue, margin: "0 0 4px" }}>{e.code}</h1>
      <div style={{ font: `600 16px ${THEME.head}`, color: THEME.ink }}>{name(e)}</div>
      <div style={{ marginTop: 10, marginBottom: 18 }}>
        <Chip tone="blue">{e.level}</Chip>
      </div>
      <div style={{ marginBottom: 18 }}>
        <h3 style={blkH}>{t("eligibleLabel")}</h3>
        <Card pad={14}><span style={{ font: `400 14px ${THEME.body}`, color: THEME.ink, lineHeight: 1.5 }}>{e.elig}</span></Card>
      </div>
      {block(t("syllabus"), e.syllabus, "menu_book", false)}
      {block(t("prep"), e.prep, "flag", true)}
      {block(t("resources"), e.res, "library_books", false)}
    </Page>
  );
}

/* ---------- Skills ---------- */
function SkillsScreen({ lang, nav }) {
  const { THEME, Icon, Card, Chip, Btn, Photo, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  return (
    <Page>
      <SecIntro lang={lang} title={t("skillsTitle")} sub={t("skillsSub")} />
      <Photo src="assets/kashmir_workshop.png" label="Skills workshop, Kashmir" style={{ height: 150, marginBottom: 18 }} />
      {window.DATA.SKILLS.map((s) => (
        <Card key={s.id} pad={14} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: THEME.saffronSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name={s.icon} size={26} color={THEME.saffronDeep} fill={1} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ font: `700 15px ${THEME.head}`, color: THEME.ink }}>{name(s)}</strong>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <Chip tone="blue">{s.dur}</Chip><Chip tone="green">{s.mode}</Chip><Chip tone="saffron">{s.level}</Chip>
              </div>
              <div style={{ font: `400 11.5px ${THEME.body}`, color: THEME.inkSoft, marginTop: 6 }}>by {s.provider}</div>
            </div>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Government Schemes ---------- */
function SchemesScreen({ lang, nav }) {
  const { THEME, Icon, Card, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  const [f, setF] = useStateS("all");
  const list = window.DATA.SCHEMES.filter((s) => f === "all" || s.cat.includes(f));
  return (
    <Page>
      <SecIntro lang={lang} title={t("schemesTitle")} sub={t("schemesSub")} />
      <FilterRow items={window.DATA.SCHEME_FILTERS} value={f} onChange={setF} lang={lang} />
      {list.map((s) => (
        <Card key={s.id} pad={15} style={{ marginBottom: 12 }} onClick={() => nav.schemeSheet(s)}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: THEME.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="verified_user" size={22} color="#067a55" fill={1} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ font: `700 15px ${THEME.head}`, color: THEME.ink }}>{name(s)}</strong>
              <p style={{ font: `400 13px ${THEME.body}`, color: THEME.inkSoft, margin: "4px 0 0", lineHeight: 1.45 }}>{s.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Mentors ---------- */
function MentorsScreen({ lang, nav }) {
  const { THEME, Icon, Card, Chip, Btn, Avatar, Photo, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  return (
    <Page>
      <SecIntro lang={lang} title={t("mentorsTitle")} sub={t("mentorsSub")} />
      {window.DATA.MENTORS.map((m) => (
        <Card key={m.id} pad={15} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Avatar init={m.init} size={54} tone="saffron" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ font: `700 15px ${THEME.head}`, color: THEME.ink }}>{name(m)}</strong>
              <div style={{ font: `400 12.5px ${THEME.body}`, color: THEME.inkSoft }}>{m.role}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <Chip tone="blue">{m.expertise}</Chip>
                <Chip tone="green"><Icon name="location_on" size={12} fill={1} style={{ verticalAlign: "-2px" }} />{m.district}</Chip>
                <Chip tone="saffron">★ {m.rating}</Chip>
              </div>
            </div>
          </div>
          <Btn full variant="saffron" icon="calendar_month" onClick={() => nav.mentorSheet(m)} style={{ marginTop: 12 }}>{t("bookMentor")}</Btn>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- Success Stories ---------- */
function StoriesScreen({ lang, nav }) {
  const { THEME, Card, Avatar, Chip, Photo, Page } = window;
  const t = (k) => window.tr(lang, k);
  const name = (o) => (lang === "ur" ? o.ur : o.en);
  const photos = ["assets/kashmir_teacher.png", "assets/kashmir_workshop.png", null, "assets/kashmir_students.png", null];
  return (
    <Page>
      <SecIntro lang={lang} title={t("storiesTitle")} sub={t("storiesSub")} />
      {window.DATA.STORIES.map((s, i) => (
        <Card key={s.id} pad={0} style={{ marginBottom: 14, overflow: "hidden" }}>
          {photos[i] && <Photo src={photos[i]} label={`${s.district} student`} rounded={0} style={{ height: 140 }} />}
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
              <Avatar init={s.init} size={42} tone={i % 2 ? "saffron" : "blue"} />
              <div>
                <strong style={{ font: `700 14.5px ${THEME.head}`, color: THEME.ink }}>{name(s)}</strong>
                <div style={{ font: `400 12px ${THEME.body}`, color: THEME.inkSoft }}>{s.district}</div>
              </div>
            </div>
            <Chip tone="green" style={{ marginBottom: 8 }}>{s.achievement}</Chip>
            <p style={{ font: `500 14.5px ${THEME.head}`, color: THEME.ink, margin: "8px 0 0", lineHeight: 1.45 }}>"{s.quote}"</p>
          </div>
        </Card>
      ))}
    </Page>
  );
}

/* ---------- More ---------- */
function MoreScreen({ lang, nav }) {
  const { THEME, Icon, Card, Page } = window;
  const t = (k) => window.tr(lang, k);
  const items = [
    { icon: "diversity_3", label: t("talkTitle"), to: "book" },
    { icon: "event_note", label: t("mySessionsTitle"), to: "mySessions" },
    { icon: "rocket_launch", label: t("skillsTitle"), to: "skills" },
    { icon: "verified_user", label: t("schemesTitle"), to: "schemes" },
    { icon: "auto_stories", label: t("storiesTitle"), to: "stories" },
    { icon: "emoji_events", label: t("examTitle"), to: "exams" },
    { icon: "route", label: t("roadmapGen"), to: "roadmap" },
    { icon: "checklist", label: t("eligibilityChecker"), to: "eligibility" },
    { icon: "auto_awesome", label: t("aiCounsel"), action: nav.openAI },
    { icon: "info", label: t("aboutTitle"), to: "about" },
  ];
  return (
    <Page>
      <SecIntro lang={lang} title={t("more")} sub={t("appName")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map((it) => (
          <Card key={it.label} pad={16} onClick={it.action || (() => nav.go(it.to))} style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 96 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: THEME.blueSoft, display: "grid", placeItems: "center" }}>
              <Icon name={it.icon} size={24} color={THEME.kashmirBlue} fill={1} />
            </div>
            <span style={{ font: `700 13.5px ${THEME.head}`, color: THEME.ink, lineHeight: 1.25 }}>{it.label}</span>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function AboutScreen({ lang }) {
  const { THEME, Icon, Card, Page } = window;
  const t = (k) => window.tr(lang, k);
  return (
    <Page>
      <SecIntro lang={lang} title={t("aboutTitle")} sub={t("appName")} />
      <Card pad={18}>
        <p style={{ font: `400 15px ${THEME.body}`, color: THEME.ink, lineHeight: 1.6, margin: 0 }}>{t("aboutBody")}</p>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
        {[["11", "Career paths"], ["9", "Exam hubs"], ["6", "Scholarships"]].map(([n, l]) => (
          <Card key={l} pad={14} style={{ textAlign: "center" }}>
            <div style={{ font: `700 26px ${THEME.head}`, color: THEME.saffronDeep }}>{n}</div>
            <div style={{ font: `500 11px ${THEME.body}`, color: THEME.inkSoft, marginTop: 2 }}>{l}</div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

/* ---------- Eligibility / Roadmap full screens ---------- */
function EligibilityScreen({ lang }) {
  const { Page } = window;
  const t = (k) => window.tr(lang, k);
  return <Page><SecIntro lang={lang} title={t("eligibilityChecker")} sub={t("scholarSub")} /><window.EligibilityChecker lang={lang} /></Page>;
}
function RoadmapScreen({ lang, params }) {
  const { Page } = window;
  const t = (k) => window.tr(lang, k);
  return <Page><SecIntro lang={lang} title={t("roadmapGen")} sub={t("careersSub")} /><window.RoadmapGenerator lang={lang} preselect={params && params.preselect} /></Page>;
}

/* ---------- shared bits ---------- */
const blkH = { font: `700 15px 'Plus Jakarta Sans'`, color: "#111c2d", margin: "0 0 9px" };
function chipBtn(THEME) {
  return { font: `600 12.5px 'Inter'`, color: THEME.kashmirBlue, background: THEME.blueSoft, border: "none", borderRadius: 999, padding: "8px 14px", cursor: "pointer" };
}
function SecIntro({ title, sub }) {
  const THEME = window.THEME;
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 style={{ font: `700 26px ${THEME.head}`, color: THEME.ink, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
      {sub && <p style={{ font: `400 14px ${THEME.body}`, color: THEME.inkSoft, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}
function FilterRow({ items, value, onChange, lang }) {
  const THEME = window.THEME;
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -16px 16px", padding: "2px 16px 8px" }}>
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            font: `600 13px ${THEME.body}`, padding: "8px 15px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
            border: on ? "none" : `1px solid ${THEME.outline}`, background: on ? THEME.kashmirBlue : "#fff", color: on ? "#fff" : THEME.inkSoft,
          }}>{lang === "ur" ? it.ur : it.en}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  CareersScreen, CareerDetail, ScholarScreen, ExamsScreen, ExamDetail, SkillsScreen,
  SchemesScreen, MentorsScreen, StoriesScreen, MoreScreen, AboutScreen, EligibilityScreen, RoadmapScreen,
  SecIntro, FilterRow,
});
