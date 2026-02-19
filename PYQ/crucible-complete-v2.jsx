import { useState, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CHAPTERS = {
  "Class 11": [
    { id: "som",    name: "Some Basic Concepts", cat: "Physical",  total: { mains: 87,  adv: 34 }, done: 72,  difficulty: "easy"   },
    { id: "ssa",    name: "Structure of Atom",   cat: "Physical",  total: { mains: 124, adv: 56 }, done: 98,  difficulty: "medium" },
    { id: "cp",     name: "Classification & Periodicity", cat: "Physical", total: { mains: 96, adv: 40 }, done: 45, difficulty: "medium" },
    { id: "cb",     name: "Chemical Bonding",    cat: "Physical",  total: { mains: 143, adv: 78 }, done: 30,  difficulty: "hard"   },
    { id: "thermo", name: "Thermodynamics",      cat: "Physical",  total: { mains: 112, adv: 62 }, done: 0,   difficulty: "hard"   },
    { id: "ceq",    name: "Chemical Equilibrium",cat: "Physical",  total: { mains: 88,  adv: 44 }, done: 20,  difficulty: "hard"   },
    { id: "ieq",    name: "Ionic Equilibrium",   cat: "Physical",  total: { mains: 76,  adv: 38 }, done: 15,  difficulty: "hard"   },
    { id: "redox",  name: "Redox Reactions",     cat: "Inorganic", total: { mains: 65,  adv: 22 }, done: 65,  difficulty: "easy"   },
    { id: "pblk11", name: "P Block (Class 11)",  cat: "Inorganic", total: { mains: 72,  adv: 30 }, done: 40,  difficulty: "medium" },
    { id: "goc",    name: "GOC",                 cat: "Organic",   total: { mains: 156, adv: 88 }, done: 120, difficulty: "hard"   },
    { id: "stereo", name: "Stereochemistry",     cat: "Organic",   total: { mains: 74,  adv: 50 }, done: 50,  difficulty: "medium" },
    { id: "hc",     name: "Hydrocarbons",        cat: "Organic",   total: { mains: 102, adv: 45 }, done: 88,  difficulty: "medium" },
    { id: "poc11",  name: "Practical Org. Chem", cat: "Practical", total: { mains: 48,  adv: 10 }, done: 30,  difficulty: "easy"   },
  ],
  "Class 12": [
    { id: "arom",   name: "Aromatic Compounds",  cat: "Organic",   total: { mains: 88,  adv: 56 }, done: 60,  difficulty: "medium" },
    { id: "sol",    name: "Solutions",           cat: "Physical",  total: { mains: 78,  adv: 32 }, done: 50,  difficulty: "medium" },
    { id: "elec",   name: "Electrochemistry",    cat: "Physical",  total: { mains: 98,  adv: 48 }, done: 34,  difficulty: "hard"   },
    { id: "kin",    name: "Chemical Kinetics",   cat: "Physical",  total: { mains: 89,  adv: 42 }, done: 22,  difficulty: "hard"   },
    { id: "pblk12", name: "P Block (Class 12)",  cat: "Inorganic", total: { mains: 108, adv: 52 }, done: 5,   difficulty: "medium" },
    { id: "df",     name: "D & F Block",         cat: "Inorganic", total: { mains: 114, adv: 58 }, done: 45,  difficulty: "hard"   },
    { id: "coord",  name: "Coordination Cmpds",  cat: "Inorganic", total: { mains: 138, adv: 76 }, done: 55,  difficulty: "hard"   },
    { id: "halo",   name: "Haloalkanes & Haloarenes", cat: "Organic", total: { mains: 88, adv: 36 }, done: 15, difficulty: "medium" },
    { id: "alc",    name: "Alcohols, Phenols & Ethers", cat: "Organic", total: { mains: 76, adv: 28 }, done: 0, difficulty: "medium" },
    { id: "ald",    name: "Aldehydes & Ketones", cat: "Organic",   total: { mains: 94,  adv: 44 }, done: 40,  difficulty: "hard"   },
    { id: "amine",  name: "Amines",              cat: "Organic",   total: { mains: 68,  adv: 24 }, done: 30,  difficulty: "medium" },
    { id: "acid",   name: "Carboxylic Acids",    cat: "Organic",   total: { mains: 68,  adv: 26 }, done: 68,  difficulty: "easy"   },
    { id: "bio",    name: "Biomolecules",        cat: "Organic",   total: { mains: 82,  adv: 18 }, done: 10,  difficulty: "easy"   },
    { id: "salt",   name: "Salt Analysis",       cat: "Practical", total: { mains: 54,  adv: 20 }, done: 54,  difficulty: "easy"   },
    { id: "ppc",    name: "Practical Phy. Chem", cat: "Practical", total: { mains: 44,  adv: 14 }, done: 44,  difficulty: "easy"   },
  ],
};

const WEAK_AREAS = [
  { chapter: "Electrochemistry", accuracy: 34, topic: "Nernst Equation",   id: "elec"  },
  { chapter: "Thermodynamics",   accuracy: 28, topic: "Gibbs Free Energy", id: "thermo"},
  { chapter: "Chemical Bonding", accuracy: 41, topic: "MOT",               id: "cb"    },
];

const CAT_COLOR  = { Physical: "#38bdf8", Organic: "#a78bfa", Inorganic: "#34d399", Practical: "#fbbf24" };
const DIFF_COLOR = { easy: "#34d399", medium: "#fbbf24", hard: "#f87171" };
const CLS_COLOR  = { "Class 11": "#38bdf8", "Class 12": "#a78bfa" };
const CLS_NUM    = { "Class 11": "11", "Class 12": "12" };
const EXAM_COLOR = { mains: "#38bdf8", advanced: "#f87171", both: "#a78bfa" };
const EXAM_LABEL = { mains: "JEE Mains", advanced: "JEE Advanced", both: "Both" };
const ALL_CHS    = Object.values(CHAPTERS).flat();

function pct(done, total) { return total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100)); }
function getTotal(ch, exam) {
  if (exam === "mains") return ch.total.mains;
  if (exam === "advanced") return ch.total.adv;
  return ch.total.mains + ch.total.adv;
}
function selTotal(sel, exam) {
  return ALL_CHS.filter(c => sel.has(c.id)).reduce((s, c) => s + getTotal(c, exam), 0);
}

// ─── MINI BAR ─────────────────────────────────────────────────────────────────
function Bar({ value, color, h = 3 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: h, overflow: "hidden", width: "100%" }}>
      <div style={{
        width: `${Math.max(value > 0 ? 2 : 0, value)}%`, height: "100%",
        background: color, borderRadius: 99,
        transition: "width 0.55s cubic-bezier(.4,0,.2,1)",
        boxShadow: value > 0 ? `0 0 6px ${color}55` : "none",
      }} />
    </div>
  );
}

// ─── CHAPTER ROW (inside sheet) ───────────────────────────────────────────────
function ChapterRow({ ch, selected, onToggle, exam }) {
  const total  = getTotal(ch, exam);
  const p      = pct(ch.done, total);
  const isSel  = selected.has(ch.id);
  const accent = CAT_COLOR[ch.cat];

  return (
    <div
      onClick={() => onToggle(ch.id)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 16px",
        background: isSel ? `${accent}10` : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer", transition: "background 0.12s", userSelect: "none",
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        border: `1.5px solid ${isSel ? accent : "rgba(255,255,255,0.2)"}`,
        background: isSel ? accent : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {isSel && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>

      {/* Name + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontSize: 14, color: isSel ? "#fff" : "rgba(255,255,255,0.75)", fontWeight: isSel ? 600 : 400, lineHeight: 1.2 }}>
            {ch.name}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: DIFF_COLOR[ch.difficulty], boxShadow: `0 0 4px ${DIFF_COLOR[ch.difficulty]}` }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{total}Q</span>
          </div>
        </div>
        <Bar value={p} color={p === 100 ? "#34d399" : accent} h={3} />
      </div>
    </div>
  );
}

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────────
function ChapterSheet({ cls, chapters, selected, onToggle, onClose, onSelectAll, onClearClass, exam }) {
  const color    = CLS_COLOR[cls];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ   = chapters.reduce((s, c) => s + getTotal(c, exam), 0);
  const selQ     = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + getTotal(c, exam), 0);

  // Group by category
  const grouped = {};
  chapters.forEach(ch => { (grouped[ch.cat] = grouped[ch.cat] || []).push(ch); });

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d0f1a", borderRadius: "22px 22px 0 0",
          border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none",
          maxHeight: "82vh", display: "flex", flexDirection: "column",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.7)",
          animation: "sheetUp 0.3s cubic-bezier(.32,.72,0,1)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Sheet header */}
        <div style={{ padding: "8px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#000" }}>
                {CLS_NUM[cls]}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{cls}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{chapters.length} chapters · {totalQ.toLocaleString()} questions</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>

          {/* Selection summary bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: selCount > 0 ? color : "rgba(255,255,255,0.3)", fontWeight: selCount > 0 ? 600 : 400 }}>
              {selCount > 0 ? `${selCount} selected · ${selQ.toLocaleString()} Qs` : "Tap chapters to select"}
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onSelectAll} style={{ fontSize: 12, color: color, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>All</button>
              {selCount > 0 && <button onClick={onClearClass} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Clear</button>}
            </div>
          </div>
        </div>

        {/* Scrollable chapter list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {Object.entries(grouped).map(([cat, chs]) => (
            <div key={cat}>
              <div style={{ padding: "8px 16px 4px", display: "flex", alignItems: "center", gap: 8, position: "sticky", top: 0, background: "#0d0f1a", zIndex: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: CAT_COLOR[cat], flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: CAT_COLOR[cat], textTransform: "uppercase" }}>{cat}</span>
              </div>
              {chs.map(ch => <ChapterRow key={ch.id} ch={ch} selected={selected} onToggle={onToggle} exam={exam} />)}
            </div>
          ))}
          <div style={{ height: 20 }} />
        </div>

        {/* Sheet done button */}
        <div style={{ padding: "12px 16px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: selCount > 0 ? color : "rgba(255,255,255,0.08)",
            color: selCount > 0 ? "#000" : "rgba(255,255,255,0.4)",
            fontSize: 14, fontWeight: 800, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}>
            {selCount > 0 ? `✓ Done — ${selCount} chapter${selCount > 1 ? "s" : ""} selected` : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CLASS CARD (home screen) ─────────────────────────────────────────────────
function ClassCard({ cls, chapters, selected, onOpen, exam }) {
  const color    = CLS_COLOR[cls];
  const selCount = chapters.filter(c => selected.has(c.id)).length;
  const totalQ   = chapters.reduce((s, c) => s + getTotal(c, exam), 0);
  const doneQ    = chapters.reduce((s, c) => s + Math.min(c.done, getTotal(c, exam)), 0);
  const p        = pct(doneQ, totalQ);
  const selQ     = chapters.filter(c => selected.has(c.id)).reduce((s, c) => s + getTotal(c, exam), 0);

  const C = 2 * Math.PI * 18;

  return (
    <div
      onClick={onOpen}
      style={{
        flex: 1, padding: "16px", borderRadius: 16, cursor: "pointer",
        background: selCount > 0 ? `${color}12` : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${selCount > 0 ? color + "55" : "rgba(255,255,255,0.08)"}`,
        transition: "all 0.2s", userSelect: "none",
        position: "relative", overflow: "hidden",
        boxShadow: selCount > 0 ? `0 0 20px ${color}20` : "none",
      }}
    >
      {/* Ambient glow */}
      {selCount > 0 && <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, pointerEvents: "none" }} />}

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#000", flexShrink: 0 }}>
            {CLS_NUM[cls]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{cls}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{chapters.length} chapters</div>
          </div>
        </div>

        {/* Mini ring */}
        <svg width="42" height="42" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4"/>
          <circle cx="21" cy="21" r="18" fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - p / 100)}
            transform="rotate(-90 21 21)"
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)" }}
          />
          <text x="21" y="21" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="9" fontWeight="800" fontFamily="monospace">{p}%</text>
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "monospace", lineHeight: 1 }}>{totalQ.toLocaleString()}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Total Qs</div>
        </div>
        {selCount > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "monospace", lineHeight: 1 }}>{selQ.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Selected Qs</div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <Bar value={p} color={color} h={3} />

      {/* Selection badge or tap hint */}
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {selCount > 0 ? (
          <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: "3px 9px", borderRadius: 99, border: `1px solid ${color}33` }}>
            {selCount} selected
          </span>
        ) : (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Tap to select chapters</span>
        )}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.35 }}>
          <path d="M4 2L9 7L4 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── TEST MODAL ────────────────────────────────────────────────────────────────
function TestModal({ count, exam, onClose, onStart }) {
  const [qCount, setQCount] = useState(20);
  const [diff,   setDiff]   = useState("mix");
  const [timer,  setTimer]  = useState(true);

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      flex: 1, padding: "10px 4px", borderRadius: 10, cursor: "pointer",
      background: active ? "#7c3aed" : "rgba(255,255,255,0.06)",
      border: `1px solid ${active ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
      color: active ? "#fff" : "rgba(255,255,255,0.45)",
      fontSize: 14, fontWeight: 600, transition: "all 0.15s",
      fontFamily: "'DM Sans', sans-serif",
    }}>{label}</button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)", display: "flex", alignItems: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0d0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "22px 22px 0 0", padding: "16px 18px 40px", width: "100%", boxShadow: "0 -20px 60px rgba(0,0,0,0.7)", animation: "sheetUp 0.28s cubic-bezier(.32,.72,0,1)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)", margin: "0 auto 18px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Configure Test</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{count.toLocaleString()} Qs · {EXAM_LABEL[exam]}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 10, textTransform: "uppercase" }}>Questions</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[10, 20, 30, 45].map(n => <Chip key={n} label={n} active={qCount===n} onClick={() => setQCount(n)} />)}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 10, textTransform: "uppercase" }}>Difficulty</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["mix","Mixed"],["easy","Easy"],["hard","Hard"]].map(([v,l]) => <Chip key={v} label={l} active={diff===v} onClick={() => setDiff(v)} />)}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 15px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>Timer</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>~{Math.round(qCount * 1.5)} min for {qCount} questions</div>
          </div>
          <div onClick={() => setTimer(t => !t)} style={{ width: 48, height: 26, borderRadius: 99, cursor: "pointer", background: timer ? "#7c3aed" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: timer ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        <button onClick={() => onStart({ qCount, diff, timer })} style={{
          width: "100%", padding: "16px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
          color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
          letterSpacing: "0.06em", boxShadow: "0 6px 24px rgba(124,58,237,0.45)",
          fontFamily: "'DM Sans', sans-serif",
        }}>START SIMULATION →</button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CrucibleHome() {
  const [exam,      setExam]      = useState("mains");
  const [selected,  setSelected]  = useState(new Set());
  const [openSheet, setOpenSheet] = useState(null); // "Class 11" | "Class 12" | null
  const [showTest,  setShowTest]  = useState(false);
  const [toast,     setToast]     = useState(null);

  const examColor = EXAM_COLOR[exam];
  const totalQ    = ALL_CHS.reduce((s, c) => s + getTotal(c, exam), 0);
  const doneQ     = ALL_CHS.reduce((s, c) => s + Math.min(c.done, getTotal(c, exam)), 0);
  const mastered  = ALL_CHS.filter(c => pct(c.done, getTotal(c, exam)) === 100).length;
  const overPct   = pct(doneQ, totalQ);
  const selQ      = selTotal(selected, exam);
  const hasSel    = selected.size > 0;
  const C         = 2 * Math.PI * 30;

  function toggle(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }
  function handleStart(cfg) { setShowTest(false); notify(`🚀 ${cfg.qCount}-Q ${EXAM_LABEL[exam]} test starting…`); }

  function selectAllInClass(cls) {
    setSelected(prev => { const n = new Set(prev); CHAPTERS[cls].forEach(c => n.add(c.id)); return n; });
  }
  function clearClass(cls) {
    setSelected(prev => { const n = new Set(prev); CHAPTERS[cls].forEach(c => n.delete(c.id)); return n; });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-text-size-adjust: 100%; }
        body { background: #080a0f; overscroll-behavior: none; }
        button { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes up      { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes glow    { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080a0f", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingBottom: hasSel ? 116 : 40 }}>

        {/* ── NAV ── */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,10,15,0.94)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔥</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.06em" }}>THE CRUCIBLE</div>
                <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Forge Your Rank</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Online</span>
            </div>
          </div>
          {/* Exam switcher */}
          <div style={{ display: "flex", gap: 6, padding: "0 16px 12px" }}>
            {["mains","advanced","both"].map(e => {
              const c = EXAM_COLOR[e]; const active = exam === e;
              return (
                <button key={e} onClick={() => { setExam(e); setSelected(new Set()); }} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 9,
                  border: `1px solid ${active ? c+"55" : "rgba(255,255,255,0.08)"}`,
                  background: active ? `${c}1a` : "rgba(255,255,255,0.04)",
                  color: active ? c : "rgba(255,255,255,0.35)",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                  {e === "mains" ? "JEE Mains" : e === "advanced" ? "JEE Advanced" : "Both"}
                </button>
              );
            })}
          </div>
        </nav>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 14px" }}>

          {/* ── GREETING ── */}
          <div style={{ marginBottom: 22, animation: "up 0.3s ease" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>{EXAM_LABEL[exam]} Prep</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px,6vw,34px)", fontWeight: 400, lineHeight: 1.2 }}>
              What will you<br /><em style={{ color: examColor }}>conquer today?</em>
            </h1>
          </div>

          {/* ── PROGRESS CARD ── */}
          <div style={{ marginBottom: 20, animation: "up 0.35s ease" }}>
            <div style={{
              background: "linear-gradient(145deg,rgba(124,58,237,0.13),rgba(10,12,20,0.9))",
              border: "1px solid rgba(124,58,237,0.22)", borderRadius: 18,
              padding: "18px 16px 14px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
                {/* Ring */}
                <svg width="76" height="76" viewBox="0 0 76 76" style={{ flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor={examColor}/>
                    </linearGradient>
                  </defs>
                  <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7"/>
                  <circle cx="38" cy="38" r="30" fill="none" stroke="url(#rg)" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C*(1-overPct/100)} transform="rotate(-90 38 38)"
                    style={{ transition:"stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }}/>
                  <text x="38" y="35" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="14" fontWeight="800" fontFamily="monospace">{overPct}%</text>
                  <text x="38" y="48" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="'DM Sans',sans-serif">complete</text>
                </svg>
                {/* Stats */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your Progress</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
                    {[
                      { label: "Attempted", val: doneQ.toLocaleString(),              color: "#7c3aed" },
                      { label: "Total Qs",  val: totalQ.toLocaleString(),              color: examColor },
                      { label: "Mastered",  val: `${mastered}/${ALL_CHS.length}`,     color: "#34d399" },
                      { label: "Accuracy",  val: "72%",                               color: "#fbbf24" },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15 }}>🔥</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>14-day streak</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["M","T","W","T","F","S","S"].map((d,i) => (
                    <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: i<5?"rgba(251,191,36,0.2)":"rgba(255,255,255,0.05)", border:`1px solid ${i<5?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.07)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:i<5?"#fbbf24":"rgba(255,255,255,0.2)" }}>{d}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── FOCUS ZONE ── */}
          <div style={{ marginBottom: 22, animation: "up 0.4s ease" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>⚡ Focus Zone</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {WEAK_AREAS.map(area => (
                <div key={area.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px", borderRadius:12, background:"rgba(248,113,113,0.06)", border:"1px solid rgba(248,113,113,0.18)" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{area.chapter}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:"#f87171", fontFamily:"monospace" }}>{area.accuracy}%</span>
                    </div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:6 }}>{area.topic}</div>
                    <Bar value={area.accuracy} color="#f87171" h={3} />
                  </div>
                  <button onClick={() => { setSelected(new Set([area.id])); notify(`🎯 ${area.chapter} ready — tap Take Test`); }}
                    style={{ padding:"7px 12px", borderRadius:7, border:"1px solid rgba(248,113,113,0.35)", background:"transparent", color:"#f87171", fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", flexShrink:0 }}>
                    DRILL
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── CLASS CARDS — the key UX change ── */}
          <div style={{ animation: "up 0.45s ease" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>
              📚 Select Chapters
            </p>
            {/* Two cards side by side */}
            <div style={{ display: "flex", gap: 10 }}>
              {Object.entries(CHAPTERS).map(([cls, chs]) => (
                <ClassCard key={cls} cls={cls} chapters={chs} selected={selected} exam={exam}
                  onOpen={() => setOpenSheet(cls)} />
              ))}
            </div>
            {hasSel && (
              <button onClick={() => setSelected(new Set())} style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "center", padding: "4px" }}>
                Clear all selections
              </button>
            )}
          </div>
        </div>

        {/* ── ACTION DOCK ── */}
        {hasSel && (
          <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:60, padding:"10px 14px 28px", background:"linear-gradient(to top,rgba(8,10,15,1) 55%,rgba(8,10,15,0.5) 80%,transparent)", backdropFilter:"blur(20px)", animation:"up 0.2s ease" }}>
            <div style={{ maxWidth:640, margin:"0 auto" }}>
              {/* Summary pill */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px 5px 6px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:99 }}>
                  <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.07em", color:exam==="mains"?"#000":"#fff", background:examColor, borderRadius:99, padding:"2px 8px", lineHeight:1.5 }}>
                    {EXAM_LABEL[exam].toUpperCase()}
                  </span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"monospace" }}>{selected.size} ch</span>
                  <span style={{ width:1, height:12, background:"rgba(255,255,255,0.12)" }} />
                  <span style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:"monospace" }}>
                    {selQ.toLocaleString()} <span style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.45)" }}>Qs</span>
                  </span>
                </div>
              </div>
              {/* Buttons */}
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => notify("📖 Opening browse mode…")} style={{ flex:1, height:52, borderRadius:14, cursor:"pointer", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.13)", color:"rgba(255,255,255,0.8)", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{opacity:.7}}><rect x="3" y="3" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="10" width="6" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  Browse
                </button>
                <button onClick={() => setShowTest(true)} style={{ flex:1.6, height:52, borderRadius:14, cursor:"pointer", border:"none", background:"linear-gradient(140deg,#7c3aed,#5b21b6)", color:"#fff", fontSize:15, fontWeight:800, letterSpacing:"0.04em", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 4px 22px rgba(124,58,237,0.45),inset 0 1px 0 rgba(255,255,255,0.15)", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, borderRadius:14, background:"linear-gradient(140deg,rgba(167,139,250,0.25) 0%,transparent 55%)", animation:"glow 2.5s ease-in-out infinite", pointerEvents:"none" }} />
                  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" style={{position:"relative"}}><circle cx="10" cy="11" r="7" stroke="white" strokeWidth="1.6"/><path d="M10 7.5V11.5L12.5 13" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 2.5H12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  <span style={{position:"relative"}}>Take Test</span>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{position:"relative",opacity:.7}}><path d="M2 7H12M8 3L12 7L8 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <p style={{ textAlign:"center", marginTop:8, fontSize:10, color:"rgba(255,255,255,0.18)", letterSpacing:"0.04em" }}>Browse hides solutions · Test is timed</p>
            </div>
          </div>
        )}

        {/* ── CHAPTER SHEET ── */}
        {openSheet && (
          <ChapterSheet
            cls={openSheet}
            chapters={CHAPTERS[openSheet]}
            selected={selected}
            onToggle={toggle}
            onClose={() => setOpenSheet(null)}
            onSelectAll={() => selectAllInClass(openSheet)}
            onClearClass={() => clearClass(openSheet)}
            exam={exam}
          />
        )}

        {/* ── TEST MODAL ── */}
        {showTest && <TestModal count={selQ} exam={exam} onClose={() => setShowTest(false)} onStart={handleStart} />}

        {/* ── TOAST ── */}
        {toast && (
          <div style={{ position:"fixed", top:76, left:"50%", transform:"translateX(-50%)", background:"rgba(13,15,24,0.96)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:10, padding:"9px 18px", fontSize:13, color:"#fff", zIndex:200, backdropFilter:"blur(20px)", animation:"up 0.2s ease", boxShadow:"0 8px 30px rgba(0,0,0,0.5)", whiteSpace:"nowrap" }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
