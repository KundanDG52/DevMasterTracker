import { useState, useMemo, createContext, useContext } from "react";
import { TOPICS, CATS } from "./data/index.js";

/* ==========================================================================
   DEV MASTER TRACKER  -  retro skill roadmap (single file, ASCII-safe)
   - One file, every topic as a switchable section
   - Working docs link per topic + working YouTube SEARCH links (never rot)
   - All code/diagrams are INERT TEXT (never re-evaluated -> no ReferenceErrors)
   - ASCII-only data + kept small (< 128KB) for fragile JSX previews
   ========================================================================== */

const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const img = (q) => "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q);
const ID = (t, si, ki) => t + "|" + si + "|" + ki;

const FONTS = { mono: "'VT323','Courier New',monospace", head: "'Press Start 2P','VT323',monospace" };
// dark + light retro palettes (code/diagram panels stay dark in both, like an editor)
const DARK = {
  bg: "#0d0d0d", panel: "#181818", panel2: "#202020", sidebar: "#080808",
  red: "#ff0033", amber: "#ffb000", green: "#39ff14", cyan: "#00e5ff",
  text: "#ece5d8", mut: "#8a8175", line: "#3a3a3a",
  inputBg: "#000", track: "#000", activeBg: "#1a1a1a", shadow: "#000",
  scan: "rgba(0,0,0,0.18)", vignette: "rgba(0,0,0,0.55)", ...FONTS,
};
const LIGHT = {
  bg: "#efe7d2", panel: "#e7ddc3", panel2: "#ded3b6", sidebar: "#e3d8bb",
  red: "#c20025", amber: "#9a5b00", green: "#1c7a2e", cyan: "#0a6e93",
  text: "#2a2418", mut: "#776c54", line: "#b6aa8a",
  inputBg: "#fffdf3", track: "#cfc4a6", activeBg: "#fff6da", shadow: "#bcae8c",
  scan: "rgba(70,50,0,0.07)", vignette: "rgba(120,100,60,0.20)", ...FONTS,
};
const ThemeCtx = createContext(DARK);
const useT = () => useContext(ThemeCtx);

// inert detail generator for skills without hand-authored detail
function genDetail(topic, skill) {
  const N = topic.name;
  const s = skill.toLowerCase();
  return {
    def:
      skill + " is a core part of " + N + " - specifically, the piece responsible for \"" + s + "\" inside a real " + N + " system. " +
      "Start with the mental model (what problem it solves and why it exists), because the syntax only makes sense once the intent is clear. " +
      "Then learn the day-to-day API or workflow, and finally the trade-offs: where it shines, where it breaks down, and what it costs in performance, complexity and maintenance. " +
      "In interviews and on the job you are judged less on knowing that " + skill + " exists and more on knowing exactly when to reach for it - and when a simpler option is the smarter call.",
    dia:
      "+-----------------------------+\n" +
      "|  INPUT / TRIGGER            |\n" +
      "+--------------+--------------+\n" +
      "               |\n" +
      "               v\n" +
      "      +------------------+\n" +
      "      | " + skill.slice(0, 15).padEnd(15) + " |\n" +
      "      |   (core step)    |\n" +
      "      +---+----------+---+\n" +
      "          |          |\n" +
      "      success     failure / edge\n" +
      "          |          |\n" +
      "          v          v\n" +
      "     [ RESULT ]  [ handle + retry ]",
    code:
      "// " + skill + " - minimal shape in " + N + "\n" +
      "// 1) set up / configure the primitive\n" +
      "// 2) wire it into the main flow\n" +
      "// 3) cover the failure + edge cases\n" +
      "// 4) measure before you optimise\n" +
      "//\n" +
      "// Use the Official Documentation link above for the\n" +
      "// exact, version-correct API for your setup.",
    notes: [
      { h: "In plain terms", b: skill + " is how " + N + " deals with " + s + ". Picture one well-defined step that takes some input, applies the rule or logic for " + s + ", and hands back a predictable result the rest of the system can build on." },
      { h: "How it works", b: "The shape is almost always: receive input -> prepare/validate it -> run the core operation -> return a result, with an explicit branch for errors and edge cases. The exact API changes per stack, but once you know that flow you can pick up any implementation from the docs fast." },
      { h: "When to use it", b: "Reach for " + skill + " when the problem it solves is genuinely present in your design - not by default. It earns its place when it removes duplication, improves reliability, or unlocks scale; otherwise a simpler approach is usually the better engineering call." },
      { h: "Watch out for", b: "Most real bugs come from skipping the failure path, assuming the happy case always holds, or adopting it just in case. Confirm the version-correct behaviour in the official docs, and cover one success and one failure case with a quick test." },
    ],
    use: "In practice, " + skill + " comes up whenever a " + N + " system has to handle " + s + " reliably - somewhere in the request/render path, the data layer, or the build and deploy step depending on where it fits. The larger the system or its traffic, the more its correctness and performance start to matter.",
    adv: [
      "Targets a specific, recurring " + N + " problem instead of an ad-hoc workaround",
      "Makes the code easier to reason about and review when used deliberately",
      "Backed by mature docs, examples and tooling you can lean on",
      "The understanding transfers across projects, teams and similar tools",
      "Lets you justify a design decision clearly - useful in reviews and interviews",
    ],
    dis: [
      "Adds a concept the whole team must understand to maintain it",
      "Tempting to reach for even when a simpler solution would do",
      "Carries a real cost - setup, boilerplate, memory or latency",
      "Failure and edge cases are easy to overlook until they hit production",
      "Hard to tune well without first measuring the actual impact",
    ],
    co: "It is standard on teams shipping production " + N + ", and is exactly the kind of detail reviewers and interviewers use to tell a junior from a senior - they care less that you know it exists and more that you know when it helps and when it hurts.",
    alt: "Weigh it against the neighbouring options in the " + N + " ecosystem; the right pick is whichever makes the single most important trade-off (speed, safety, simplicity) go your way.",
    vid: [
      { t: skill + " - full tutorial", q: N + " " + skill + " tutorial" },
      { t: N + " crash course", q: N + " crash course full course" },
      { t: skill + " deep dive", q: N + " " + skill + " explained" },
    ],
    iq: [
      { q: "What is " + skill + ", and why does it matter in " + N + "?",
        a: skill + " is the part of " + N + " that handles " + s + ". It matters because it directly affects correctness, performance and how maintainable the system stays as it grows - which is exactly why interviewers probe it instead of pure syntax." },
      { q: "What are the main trade-offs or common pitfalls of " + skill + "?",
        a: "The usual traps: using it where a simpler approach would do, skipping the error/edge-case paths, and never measuring its real cost. Used well it improves clarity and reliability; used blindly it adds complexity and hidden performance problems." },
      { q: "When would you choose " + skill + " over an alternative?",
        a: "Reach for it when the problem it targets is genuinely your bottleneck, and prefer the simpler option otherwise. A strong answer names one or two alternatives in the " + N + " ecosystem and states the single trade-off that decides between them." },
    ],
  };
}
function getDetail(topic, skill) {
  const base = genDetail(topic, skill);
  const hand = topic.detail && topic.detail[skill];
  return hand ? { ...base, ...hand } : base;
}

function RetroStyle() {
  const T = useT();
  const css =
    "*{box-sizing:border-box;}body{margin:0;background:" + T.bg + ";}" +
    ".dmt-root{position:relative;background:" + T.bg + ";color:" + T.text + ";font-family:" + T.mono + ";min-height:100vh;}" +
    ".dmt-root::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;background:repeating-linear-gradient(0deg," + T.scan + " 0px," + T.scan + " 1px,transparent 1px,transparent 3px);}" +
    ".dmt-root::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;background:radial-gradient(ellipse at center,transparent 60%," + T.vignette + " 100%);}" +
    ".dmt-scroll::-webkit-scrollbar{width:10px;height:10px;}.dmt-scroll::-webkit-scrollbar-track{background:#0a0a0a;}.dmt-scroll::-webkit-scrollbar-thumb{background:" + T.red + ";border:2px solid #0a0a0a;}" +
    ".dmt-blink{animation:dmtblink 1.1s steps(2,start) infinite;}@keyframes dmtblink{50%{opacity:0;}}" +
    ".dmt-btn{font-family:" + T.mono + ";cursor:pointer;transition:all .12s;}.dmt-btn:hover{transform:translate(-1px,-1px);}" +
    ".dmt-link{color:" + T.cyan + ";text-decoration:none;border-bottom:1px dashed " + T.cyan + ";}.dmt-link:hover{color:" + T.amber + ";border-bottom-color:" + T.amber + ";}";
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

function Diagram({ text }) {
  const T = useT();
  return <pre className="dmt-scroll" style={{ background: "#0a0a0a", border: "2px solid " + T.green, color: T.green, padding: "12px 14px", fontSize: 15, lineHeight: 1.5, overflowX: "auto", margin: 0, fontFamily: T.mono, boxShadow: "4px 4px 0 #062a06" }}>{text}</pre>;
}
function Code({ text }) {
  const T = useT();
  return <pre className="dmt-scroll" style={{ background: "#0a0a0a", border: "2px solid " + T.amber, color: "#ffe08a", padding: "12px 14px", fontSize: 15, lineHeight: 1.5, overflowX: "auto", margin: 0, fontFamily: T.mono, boxShadow: "4px 4px 0 #3a2600" }}>{text}</pre>;
}

function SkillDetail({ topic, skill }) {
  const T = useT();
  const d = getDetail(topic, skill);
  const [tab, setTab] = useState("def");
  const tabs = [["def", "MEANING"], ["notes", "NOTES"], ["dia", "DIAGRAM"], ["code", "CODE"], ["pros", "PROS/CONS"], ["ind", "INDUSTRY"], ["iq", "INTERVIEW"], ["res", "VIDEOS"]];
  return (
    <div style={{ border: "2px solid " + T.line, background: T.panel2, marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, padding: 8, flexWrap: "wrap", borderBottom: "2px solid " + T.line }}>
        {tabs.map(([k, l]) => (
          <button key={k} className="dmt-btn" onClick={() => setTab(k)} style={{ padding: "5px 10px", fontSize: 14, border: "2px solid " + (tab === k ? topic.hue : T.line), background: tab === k ? topic.hue : "transparent", color: tab === k ? "#0a0a0a" : T.mut, fontWeight: 700, letterSpacing: 0.5 }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: "14px 16px", fontSize: 16, lineHeight: 1.55 }}>
        {tab === "def" && <div><p style={{ margin: "0 0 12px", color: T.text }}>{d.def}</p><a className="dmt-link" href={topic.docs} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>[DOCS] Official {topic.name} Documentation -&gt;</a></div>}
        {tab === "notes" && (
          <div>
            <p style={{ color: T.amber, fontWeight: 700, margin: "0 0 10px" }}>DETAILED NOTES</p>
            {d.notes.map((n, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <p style={{ margin: "0 0 4px", color: topic.hue, fontWeight: 700 }}>{n.h}</p>
                <p style={{ margin: 0, color: T.text, paddingLeft: 10, borderLeft: "3px solid " + T.line }}>{n.b}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "dia" && (
          <div>
            <Diagram text={d.dia} />
            <a className="dmt-link" href={img(topic.name + " " + skill + " diagram")} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, fontWeight: 700 }}>[IMG] View visual diagrams &amp; explainers -&gt;</a>
          </div>
        )}
        {tab === "code" && <Code text={d.code} />}
        {tab === "pros" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><p style={{ color: T.green, margin: "0 0 6px", fontWeight: 700 }}>+ ADVANTAGES</p>{d.adv.map((a, i) => <p key={i} style={{ margin: "0 0 5px", paddingLeft: 10, borderLeft: "3px solid " + T.green }}>{a}</p>)}</div>
            <div><p style={{ color: T.red, margin: "0 0 6px", fontWeight: 700 }}>- DISADVANTAGES</p>{d.dis.map((a, i) => <p key={i} style={{ margin: "0 0 5px", paddingLeft: 10, borderLeft: "3px solid " + T.red }}>{a}</p>)}</div>
          </div>
        )}
        {tab === "ind" && <div><p style={{ margin: "0 0 10px" }}><b style={{ color: T.amber }}>USE CASES:</b> {d.use}</p><p style={{ margin: 0 }}><b style={{ color: T.amber }}>WHO USES IT:</b> {d.co}</p></div>}
        {tab === "iq" && (
          <div>
            <p style={{ color: T.amber, fontWeight: 700, margin: "0 0 10px" }}>INTERVIEW QUESTIONS &amp; ANSWERS</p>
            {d.iq.map((qa, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < d.iq.length - 1 ? "1px dashed " + T.line : "none" }}>
                <p style={{ margin: "0 0 6px", color: T.cyan, fontWeight: 700 }}>Q{i + 1}. {qa.q}</p>
                <p style={{ margin: 0, color: T.text, paddingLeft: 10, borderLeft: "3px solid " + T.amber }}>{qa.a}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "res" && (
          <div>
            <p style={{ color: T.red, fontWeight: 700, margin: "0 0 8px" }}>YOUTUBE (live search - always works)</p>
            {d.vid.map((v, i) => <p key={i} style={{ margin: "0 0 6px" }}><a className="dmt-link" href={yt(v.q)} target="_blank" rel="noreferrer">&gt; {v.t}</a></p>)}
            <div style={{ marginTop: 12, padding: 10, background: "#0a0a0a", border: "2px solid " + T.cyan }}><b style={{ color: T.cyan }}>ALTERNATIVES:</b> {d.alt}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillRow({ topic, skill, id, checked, onToggle }) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const on = checked[id];
  return (
    <div style={{ borderBottom: "1px solid " + T.line }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer" }}>
        <div onClick={e => { e.stopPropagation(); onToggle(id); }} style={{ width: 18, height: 18, border: "2px solid " + (on ? topic.hue : T.mut), flexShrink: 0, background: on ? topic.hue : "transparent" }} />
        <span style={{ flex: 1, fontSize: 16, color: on ? T.mut : T.text, textDecoration: on ? "line-through" : "none" }}>{skill}</span>
        <span style={{ fontSize: 14, color: open ? topic.hue : T.mut }}>{open ? "[-]" : "[+]"}</span>
      </div>
      {open && <div style={{ padding: "0 12px 12px" }}><SkillDetail topic={topic} skill={skill} /></div>}
    </div>
  );
}

function SectionCard({ topic, si, section, checked, onToggle }) {
  const T = useT();
  const [open, setOpen] = useState(si === 0);
  const total = section.k.length;
  const done = section.k.reduce((n, _, ki) => n + (checked[ID(topic.key, si, ki)] ? 1 : 0), 0);
  const pct = total ? (done / total) * 100 : 0;
  return (
    <div style={{ border: "2px solid " + T.line, marginBottom: 12, background: T.panel, boxShadow: "5px 5px 0 " + T.shadow }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", cursor: "pointer" }}>
        <div style={{ width: 30, height: 30, border: "2px solid " + topic.hue, color: topic.hue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{String(si + 1).padStart(2, "0")}</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 18, color: T.text }}>{section.t}</div><div style={{ fontSize: 14, color: T.mut }}>{section.s}</div></div>
        <span style={{ fontSize: 14, color: T.mut }}>{section.d}</span>
        <span style={{ fontSize: 15, color: done === total ? T.green : topic.hue, fontWeight: 700 }}>{done}/{total}</span>
        <span style={{ fontSize: 15, color: T.mut }}>{open ? "v" : ">"}</span>
      </div>
      <div style={{ height: 4, background: T.track }}><div style={{ height: "100%", width: pct + "%", background: topic.hue, transition: "width .3s" }} /></div>
      {open && <div>{section.k.map((sk, ki) => <SkillRow key={ki} topic={topic} skill={sk} id={ID(topic.key, si, ki)} checked={checked} onToggle={onToggle} />)}</div>}
    </div>
  );
}

function TopicScreen({ topic, checked, onToggle }) {
  const T = useT();
  const total = topic.sections.reduce((n, s) => n + s.k.length, 0);
  const done = topic.sections.reduce((n, s, si) => n + s.k.reduce((m, _, ki) => m + (checked[ID(topic.key, si, ki)] ? 1 : 0), 0), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "22px 18px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ display: "inline-flex", minWidth: 40, height: 30, padding: "0 8px", alignItems: "center", justifyContent: "center", background: topic.hue, color: "#0a0a0a", fontWeight: 700, fontSize: 15 }}>{topic.icon}</span>
        <h1 style={{ margin: 0, fontFamily: T.head, fontSize: 18, color: topic.hue, lineHeight: 1.4 }}>{topic.name}</h1>
        <span style={{ marginLeft: "auto", fontSize: 16, color: T.mut }}>{done}/{total} skills - {pct}%</span>
      </div>
      <p style={{ color: T.text, fontSize: 16, lineHeight: 1.55, margin: "6px 0 14px" }}>{topic.blurb}</p>
      <a className="dmt-link" href={topic.docs} target="_blank" rel="noreferrer" style={{ fontSize: 15, fontWeight: 700 }}>[DOCS] Official Documentation -&gt;</a>
      <div style={{ height: 8, background: T.track, border: "2px solid " + T.line, margin: "16px 0 22px" }}><div style={{ height: "100%", width: pct + "%", background: topic.hue, transition: "width .3s" }} /></div>
      {topic.sections.map((s, si) => <SectionCard key={si} topic={topic} si={si} section={s} checked={checked} onToggle={onToggle} />)}
    </div>
  );
}


export default function DevMasterTracker() {
  const [active, setActive] = useState(TOPICS[0] ? TOPICS[0].key : "");
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState(() => { try { return localStorage.getItem("dmt_mode") || "dark"; } catch (e) { return "dark"; } });
  const T = mode === "light" ? LIGHT : DARK;
  const toggleMode = () => setMode(m => { const n = m === "light" ? "dark" : "light"; try { localStorage.setItem("dmt_mode", n); } catch (e) {} return n; });
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dmt_v2") || "{}"); } catch (e) { return {}; }
  });
  const toggle = (id) => setChecked(prev => {
    const next = { ...prev, [id]: !prev[id] };
    try { localStorage.setItem("dmt_v2", JSON.stringify(next)); } catch (e) {}
    return next;
  });
  const topic = useMemo(() => TOPICS.find(t => t.key === active) || TOPICS[0], [active]);
  const list = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f ? TOPICS.filter(t => t.name.toLowerCase().includes(f)) : TOPICS;
  }, [filter]);

  return (
    <ThemeCtx.Provider value={T}>
    <div className="dmt-root">
      <RetroStyle />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div className="dmt-scroll" style={{ width: 250, flexShrink: 0, background: T.sidebar, borderRight: "3px solid " + T.red, height: "100vh", position: "sticky", top: 0, overflowY: "auto", padding: "16px 10px" }}>
          <div style={{ fontFamily: T.head, fontSize: 13, color: T.red, lineHeight: 1.6, marginBottom: 4 }}>DEV<span style={{ color: T.text }}>.</span>MASTER</div>
          <div style={{ fontSize: 15, color: T.mut, marginBottom: 10 }}>retro skill tracker <span className="dmt-blink" style={{ color: T.green }}>_</span></div>
          <button className="dmt-btn" onClick={toggleMode} style={{ width: "100%", marginBottom: 12, padding: "6px 9px", fontSize: 14, fontWeight: 700, letterSpacing: 1, border: "2px solid " + T.amber, background: "transparent", color: T.amber }}>{mode === "light" ? "[ DARK MODE ]" : "[ LIGHT MODE ]"}</button>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="search topic..." style={{ width: "100%", background: T.inputBg, color: T.green, border: "2px solid " + T.line, padding: "7px 9px", fontFamily: T.mono, fontSize: 15, marginBottom: 12, outline: "none" }} />
          {CATS.map(cat => {
            const items = list.filter(t => t.cat === cat);
            if (!items.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: T.amber, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, borderBottom: "1px dashed " + T.line, paddingBottom: 3 }}>{cat}</div>
                {items.map(t => (
                  <button key={t.key} className="dmt-btn" onClick={() => setActive(t.key)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "6px 9px", marginBottom: 3, fontSize: 16, border: "2px solid " + (active === t.key ? t.hue : "transparent"), background: active === t.key ? T.activeBg : "transparent", color: active === t.key ? t.hue : T.text }}>
                    <span style={{ minWidth: 34, fontSize: 12, fontWeight: 700, color: t.hue, textAlign: "center" }}>{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            );
          })}
          <div style={{ fontSize: 13, color: T.mut, marginTop: 10, borderTop: "1px dashed " + T.line, paddingTop: 8 }}>{TOPICS.length} topics loaded</div>
        </div>
        <div className="dmt-scroll" style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
          {topic && <TopicScreen topic={topic} checked={checked} onToggle={toggle} />}
        </div>
      </div>
    </div>
    </ThemeCtx.Provider>
  );
}
