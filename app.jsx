/* ============================================================
   app.jsx — shell: chrome, navigation, language, sheets
   ============================================================ */

const { useState: useStateA, useEffect: useEffectA } = React;

const TABS = [
  { id: "home", icon: "home", screen: "home", labelKey: "home" },
  { id: "careers", icon: "explore", screen: "careers", labelKey: "careers" },
  { id: "counsel", icon: "diversity_3", screen: "mySessions", labelKey: "talk" },
  { id: "scholar", icon: "school", screen: "scholar", labelKey: "scholar" },
  { id: "more", icon: "grid_view", screen: "more", labelKey: "more" },
];

// which bottom tab "owns" a screen
const SCREEN_TAB = {
  home: "home", careers: "careers", careerDetail: "careers", roadmap: "careers",
  scholar: "scholar", eligibility: "scholar", exams: "home", examDetail: "home",
  book: "counsel", mySessions: "counsel", sessionDetail: "counsel", studentChat: "counsel",
  skills: "more", schemes: "more", mentors: "more", stories: "more", about: "more", more: "more",
};

const TITLE_KEY = {
  careers: "careersTitle", careerDetail: "careersTitle", roadmap: "roadmapGen",
  scholar: "scholarTitle", eligibility: "eligibilityChecker", exams: "examTitle",
  examDetail: "examTitle", skills: "skillsTitle", schemes: "schemesTitle",
  mentors: "mentorsTitle", stories: "storiesTitle", about: "aboutTitle", more: "more",
  book: "talkTitle", mySessions: "mySessionsTitle", sessionDetail: "mySessionsTitle", studentChat: "talkTitle",
};

function GovRibbon({ lang }) {
  const T = window.THEME;
  const t = (k) => window.tr(lang, k);
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ display: "flex", height: 4 }}>
        <div style={{ flex: 1, background: T.saffron }} />
        <div style={{ flex: 1, background: "#fff" }} />
        <div style={{ flex: 1, background: T.green }} />
      </div>
      <div style={{ background: T.primary, color: "#fff", padding: "5px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 17, height: 17, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <span style={{ font: `700 8px ${T.head}` }}>JK</span>
        </div>
        <span style={{ font: `500 10px ${T.body}`, opacity: 0.92, letterSpacing: 0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t("govLine")}</span>
      </div>
    </div>
  );
}

function AppHeader({ lang, setLang, screen, canBack, onBack }) {
  const T = window.THEME;
  const t = (k) => window.tr(lang, k);
  const isHome = screen === "home";
  return (
    <div style={{ flexShrink: 0, background: "rgba(243,246,253,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${T.outline}`, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
      {canBack ? (
        <button onClick={onBack} style={iconBtn(T)}><window.Icon name="arrow_back" size={22} color={T.ink} /></button>
      ) : (
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${T.kashmirBlue}, ${T.blueTint})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <window.Icon name="explore" size={19} color="#fff" fill={1} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <img src="assets/portal_logo.png" style={{ height: 26, width: 26, objectFit: "contain" }} alt="Logo" />
        {isHome
          ? <div style={{ font: `700 16px ${T.head}`, color: T.kashmirBlue, letterSpacing: "-0.01em" }}>{t("appName")}</div>
          : <div style={{ font: `700 16px ${T.head}`, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t(TITLE_KEY[screen] || "appName")}</div>}
      </div>
      <button onClick={() => setLang(lang === "en" ? "ur" : "en")} style={{
        display: "flex", alignItems: "center", gap: 5, background: "#fff", border: `1px solid ${T.outline}`,
        borderRadius: 999, padding: "6px 12px", cursor: "pointer", font: `600 12px ${T.body}`, color: T.kashmirBlue, flexShrink: 0,
      }}>
        <window.Icon name="language" size={16} />{t("langName")}
      </button>
    </div>
  );
}
function iconBtn(T) {
  return { width: 32, height: 32, borderRadius: 10, background: "#fff", border: `1px solid ${T.outline}`, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 };
}

function BottomNav({ lang, activeTab, onTab }) {
  const T = window.THEME;
  const t = (k) => window.tr(lang, k);
  return (
    <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderTop: `1px solid ${T.outline}`, display: "flex", padding: "6px 4px 4px" }}>
      {TABS.map((tab) => {
        const on = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTab(tab.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, padding: "5px 0",
          }}>
            <div style={{ padding: "2px 16px", borderRadius: 999, background: on ? T.blueSoft : "transparent", transition: "background .2s" }}>
              <window.Icon name={tab.icon} size={23} color={on ? T.kashmirBlue : T.inkSoft} fill={on ? 1 : 0} />
            </div>
            <span style={{ font: `${on ? 700 : 500} 10px ${T.body}`, color: on ? T.kashmirBlue : T.inkSoft }}>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

function App({ session }) {
  const T = window.THEME;
  const [lang, setLang] = useStateA(() => localStorage.getItem("jk_lang") || "en");
  const [stack, setStack] = useStateA([{ screen: "home" }]);
  const [activeTab, setActiveTab] = useStateA("home");
  const [sheet, setSheet] = useStateA(null); // {type, data}
  const scrollRef = React.useRef(null);

  useEffectA(() => { localStorage.setItem("jk_lang", lang); }, [lang]);

  const cur = stack[stack.length - 1];
  const canBack = stack.length > 1;
  const t = (k) => window.tr(lang, k);

  useEffectA(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [cur.screen]);

  const nav = {
    go: (screen, params) => {
      setStack((s) => [...s, { screen, params }]);
      if (SCREEN_TAB[screen]) setActiveTab(SCREEN_TAB[screen]);
    },
    back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    openAI: () => setSheet({ type: "ai" }),
    scholarSheet: (data) => setSheet({ type: "scholar", data }),
    mentorSheet: (data) => setSheet({ type: "mentor", data }),
    schemeSheet: (data) => setSheet({ type: "scheme", data }),
  };

  const onTab = (id) => {
    const tab = TABS.find((x) => x.id === id);
    setActiveTab(id);
    setStack([{ screen: tab.screen }]);
  };

  const SCREENS = {
    home: window.HomeScreen, careers: window.CareersScreen, careerDetail: window.CareerDetail,
    scholar: window.ScholarScreen, exams: window.ExamsScreen, examDetail: window.ExamDetail,
    skills: window.SkillsScreen, schemes: window.SchemesScreen, mentors: window.MentorsScreen,
    stories: window.StoriesScreen, more: window.MoreScreen, about: window.AboutScreen,
    eligibility: window.EligibilityScreen, roadmap: window.RoadmapScreen,
    book: window.BookCounselling, mySessions: window.MySessions,
    sessionDetail: window.SessionDetail, studentChat: window.StudentChat,
  };
  const ScreenComp = SCREENS[cur.screen] || window.HomeScreen;
  const name = (o) => (lang === "ur" ? o.ur : o.en);

  return (
    <div dir={lang === "ur" ? "rtl" : "ltr"} style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", background: T.bg, overflow: "hidden" }}>
      <GovRibbon lang={lang} />
      <AppHeader lang={lang} setLang={setLang} screen={cur.screen} canBack={canBack} onBack={nav.back} />

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
        <ScreenComp lang={lang} nav={nav} params={cur.params || {}} session={session} />
      </div>

      {/* FAB — AI counselor (hidden when a sheet is open) */}
      {!sheet && (
        <button onClick={nav.openAI} style={{
          position: "absolute", bottom: 78, [lang === "ur" ? "left" : "right"]: 16, zIndex: 40,
          width: 56, height: 56, borderRadius: 18, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${T.saffron}, #fbbf24)`, boxShadow: "0 8px 22px rgba(245,158,11,0.45)",
          display: "grid", placeItems: "center",
        }}>
          <window.Icon name="auto_awesome" size={27} color="#3a2400" fill={1} />
        </button>
      )}

      <BottomNav lang={lang} activeTab={activeTab} onTab={onTab} />

      {/* SHEETS */}
      <window.Sheet open={sheet && sheet.type === "ai"} onClose={() => setSheet(null)} title={t("aiCounsel")}>
        <div style={{ height: 460 }}><window.AICounselor lang={lang} /></div>
      </window.Sheet>

      <window.Sheet open={sheet && sheet.type === "scholar"} onClose={() => setSheet(null)} title={sheet && sheet.type === "scholar" ? name(sheet.data) : ""}>
        {sheet && sheet.type === "scholar" && <ScholarSheet lang={lang} s={sheet.data} />}
      </window.Sheet>

      <window.Sheet open={sheet && sheet.type === "scheme"} onClose={() => setSheet(null)} title={sheet && sheet.type === "scheme" ? name(sheet.data) : ""}>
        {sheet && sheet.type === "scheme" && (
          <div>
            <p style={{ font: `400 14.5px ${T.body}`, color: T.ink, lineHeight: 1.6 }}>{sheet.data.desc}</p>
            <window.Btn full variant="saffron" icon="open_in_new" style={{ marginTop: 8 }}>{t("apply")}</window.Btn>
          </div>
        )}
      </window.Sheet>

      <window.Sheet open={sheet && sheet.type === "mentor"} onClose={() => setSheet(null)} title={t("bookMentor")}>
        {sheet && sheet.type === "mentor" && (
          <window.MentorBooking lang={lang} mentor={sheet.data} onConfirm={(slot) => setSheet({ type: "confirmed", data: { ...sheet.data, slot } })} />
        )}
      </window.Sheet>

      <window.Sheet open={sheet && sheet.type === "confirmed"} onClose={() => setSheet(null)}>
        {sheet && sheet.type === "confirmed" && (
          <div style={{ textAlign: "center", padding: "10px 6px 4px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.greenSoft, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <window.Icon name="check_circle" size={40} color={T.green} fill={1} />
            </div>
            <h3 style={{ font: `700 19px ${T.head}`, color: T.ink, margin: "0 0 6px" }}>{t("confirmed")}</h3>
            <p style={{ font: `400 13.5px ${T.body}`, color: T.inkSoft, margin: "0 0 6px" }}>{name(sheet.data)} · {sheet.data.slot}</p>
            <p style={{ font: `400 12.5px ${T.body}`, color: T.inkSoft, margin: "0 0 18px" }}>{t("confirmedSub")}</p>
            <window.Btn full variant="primary" onClick={() => setSheet(null)}>{t("done")}</window.Btn>
          </div>
        )}
      </window.Sheet>
    </div>
  );
}

function ScholarSheet({ lang, s }) {
  const T = window.THEME;
  const t = (k) => window.tr(lang, k);
  const row = (label, val, tone) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${T.outline}` }}>
      <span style={{ font: `500 13px ${T.body}`, color: T.inkSoft }}>{label}</span>
      <span style={{ font: `700 13.5px ${T.head}`, color: tone || T.ink, textAlign: "right", maxWidth: "62%" }}>{val}</span>
    </div>
  );
  return (
    <div>
      <window.Chip tone="green" style={{ marginBottom: 8 }}>{s.amount}</window.Chip>
      {row(t("amount"), s.amount, "#067a55")}
      {row("Provider", s.provider)}
      {row(t("deadline"), s.deadline, T.saffronDeep)}
      <div style={{ padding: "11px 0" }}>
        <div style={{ font: `500 13px ${T.body}`, color: T.inkSoft, marginBottom: 5 }}>{t("eligibleLabel")}</div>
        <div style={{ font: `400 14px ${T.body}`, color: T.ink, lineHeight: 1.5 }}>{s.elig}</div>
      </div>
      <window.Btn full variant="saffron" icon="open_in_new" style={{ marginTop: 8 }}>{t("apply")}</window.Btn>
    </div>
  );
}

window.App = App;
