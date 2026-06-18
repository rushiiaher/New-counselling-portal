/* ============================================================
   portal.jsx — top-level shell / router
   entry → login → role app. Student = phone frame, staff = desktop.
   ============================================================ */

const { useState: useStatePt, useEffect: useEffectPt, useRef: useRefPt } = React;

// who each role logs in as
const ROLE_USER = {
  student: { studentId: "st1" },
  counsellor: { coId: "co1", name: "Dr. Ayesha Khan", init: "AK", sub: "Career & Higher Ed" },
  desk: { name: "Front Desk", init: "FD", sub: "Operator · Anantnag" },
  admin: { name: "rushiiaher", init: "RU", sub: "District Admin" },
};

function StudentFrame({ session, onLogout }) {
  const T = window.THEME;
  const ref = useRefPt(null);
  const [isMobileView, setIsMobileView] = useStatePt(true);

  useEffectPt(() => {
    function fit() {
      const el = ref.current; if (!el) return;
      const w = 412 + 16, h = 892 + 16;
      const s = Math.min(1, (window.innerWidth - 32) / w, (window.innerHeight - 120) / h);
      el.style.transform = `scale(${s})`;
    }
    if (isMobileView) {
      fit(); window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }
  }, [isMobileView]);

  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "9px 15px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)",
    color: "#fff", cursor: "pointer", font: `600 13px ${T.body}`, backdropFilter: "blur(6px)",
  };

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 30% 20%, #2a3650 0%, #1a2230 60%, #141a26 100%)", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 18, left: 18, zIndex: 50, display: "flex", gap: 12 }}>
        <button onClick={onLogout} style={btnStyle}>
          <window.Icon name="logout" size={16} /> Switch portal
        </button>
        <button onClick={() => setIsMobileView(!isMobileView)} style={btnStyle}>
          <window.Icon name={isMobileView ? "desktop_windows" : "phone_iphone"} size={16} />
          {isMobileView ? "Desktop View" : "Mobile View"}
        </button>
      </div>
      
      {isMobileView ? (
        <div ref={ref} style={{ transformOrigin: "center center" }}>
          <window.AndroidDevice>
            <window.App session={session} />
          </window.AndroidDevice>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 900, height: "100vh", background: "#fff", boxShadow: "0 0 40px rgba(0,0,0,0.5)", position: "relative", display: "flex", flexDirection: "column" }}>
          <window.App session={session} />
        </div>
      )}
    </div>
  );
}

function Portal() {
  const [stage, setStage] = useStatePt(() => {
    try { return JSON.parse(localStorage.getItem("jk_portal_stage")) || { view: "entry" }; } catch (e) { return { view: "entry" }; }
  });

  useEffectPt(() => { try { localStorage.setItem("jk_portal_stage", JSON.stringify(stage)); } catch (e) {} }, [stage]);

  const pick = (role) => setStage({ view: "login", role });
  const login = () => setStage({ view: "app", role: stage.role });
  const logout = () => setStage({ view: "entry" });

  if (stage.view === "entry") {
    return <div style={{ height: "100vh", overflowY: "auto" }}><window.EntryScreen onPick={pick} /></div>;
  }
  if (stage.view === "login") {
    return <div style={{ height: "100vh", overflowY: "auto" }}><window.LoginScreen role={stage.role} onBack={logout} onLogin={login} /></div>;
  }

  // app view
  const role = stage.role;
  const user = ROLE_USER[role];
  if (role === "student") return <StudentFrame session={user} onLogout={logout} />;

  const Apps = { counsellor: window.CounsellorApp, desk: window.CenterApp, admin: window.AdminApp };
  const RoleApp = Apps[role];
  return <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}><RoleApp user={user} onLogout={logout} /></div>;
}

window.Portal = Portal;
