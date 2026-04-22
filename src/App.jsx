import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ─── ROUTINE DATA ────────────────────────────────────────────────────────────
const ROUTINE = {
  "Upper A": {
    label: "UPPER A", subtitle: "Bench Pesado + Espalda",
    accent: "#e63946", days: "Lunes", focus: "CNS + Fuerza",
    exercises: [
      { id:"ua1", name:"Bench Press – Paused", sets:3, targetReps:3, repsLabel:"3", weight:100, increment:2.5, rule:"main", notes:"Pausa 1-2s en pecho. Barra explosiva. 3/3/3 = sube." },
      { id:"ua2", name:"Weighted Pull-Up", sets:2, targetReps:6, repsLabel:"6–8", weight:17.5, increment:2.5, rule:"hyp", notes:"RIR 1. Rango completo. Escápula controlada." },
      { id:"ua3", name:"Dips con Peso", sets:2, targetReps:6, repsLabel:"6–8", weight:30, increment:2.5, rule:"hyp", notes:"30kg extra. RIR 1. Inclinación hacia pecho." },
      { id:"ua4", name:"Seal Row / Barbell Row", sets:3, targetReps:8, repsLabel:"8–10", weight:70, increment:2.5, rule:"vol", notes:"RIR 2. Excéntrico 2s. Retracción escapular." },
      { id:"ua5", name:"Lat Pulldown", sets:2, targetReps:10, repsLabel:"10–12", weight:60, increment:2.5, rule:"vol", notes:"RIR 1–2. Codos hacia caderas al bajar." },
      { id:"ua6", name:"Overhead Triceps Ext.", sets:3, targetReps:10, repsLabel:"10–15", weight:25, increment:2.5, rule:"vol", notes:"Estiramiento profundo cabeza larga. RIR 1." },
      { id:"ua7", name:"Lateral Raises", sets:3, targetReps:12, repsLabel:"12–15", weight:12, increment:1, rule:"vol", notes:"Unilateral. RIR 1. Codo ligeramente doblado." },
      { id:"ua8", name:"Reverse Fly", sets:2, targetReps:12, repsLabel:"12–15", weight:10, increment:1, rule:"vol", notes:"Unilateral. RIR 2. Retracción escápula." },
      { id:"ua9", name:"Incline DB Curl", sets:3, targetReps:8, repsLabel:"8–12", weight:16, increment:2, rule:"hyp", notes:"RIR 2. Supinación completa. Estiramiento bícep." },
    ]
  },
  "Lower A": {
    label: "LOWER A", subtitle: "Squat Pesado + Cuádriceps",
    accent: "#2196f3", days: "Martes", focus: "CNS + Fuerza",
    exercises: [
      { id:"la1", name:"Back Squat – 3×3", sets:3, targetReps:3, repsLabel:"3", weight:100, increment:2.5, rule:"main", notes:"Barra baja. Profundidad completa. Barra rápida." },
      { id:"la2", name:"Paused Squat (accesorio)", sets:3, targetReps:3, repsLabel:"3", weight:70, increment:0, rule:"auto", notes:"70% del squat del día. 2s pausa. Progresa con el principal." },
      { id:"la3", name:"Leg Press", sets:3, targetReps:8, repsLabel:"8–10", weight:180, increment:5, rule:"hyp", notes:"Pie medio-alto. Rango completo sin bloqueo." },
      { id:"la4", name:"Leg Extension", sets:3, targetReps:10, repsLabel:"10–12", weight:109, increment:5, rule:"vol", notes:"RIR 1. Contracción 1s arriba. Unilateral opcional." },
      { id:"la5", name:"Hamstring Curl (Seated)", sets:3, targetReps:8, repsLabel:"8–10", weight:59, increment:2.5, rule:"hyp", notes:"RIR 2. Excéntrico lento 3s. Pie neutro." },
      { id:"la6", name:"Hip Thrust (Smith)", sets:3, targetReps:8, repsLabel:"8–10", weight:145, increment:5, rule:"hyp", notes:"Bloqueo completo 1s. Glúteo máximo." },
      { id:"la7", name:"Standing Calf Raise", sets:4, targetReps:12, repsLabel:"12–20", weight:80, increment:5, rule:"vol", notes:"Pausa 2s arriba. Rango completo. Talón al fondo." },
      { id:"la8", name:"Cable Crunch", sets:3, targetReps:12, repsLabel:"12–15", weight:30, increment:2.5, rule:"vol", notes:"Flexión real de columna. No jalar de cadera." },
    ]
  },
  "Upper B": {
    label: "UPPER B", subtitle: "Bench Volumen + Brazos",
    accent: "#ff9800", days: "Jueves", focus: "Volumen + Hipertrofia",
    exercises: [
      { id:"ub1", name:"Bench Press – 3×5", sets:3, targetReps:5, repsLabel:"5", weight:100, increment:2.5, rule:"main", notes:"Sin pausa. Velocidad concéntrica. 5/5/5 = sube." },
      { id:"ub2", name:"Close Grip Bench", sets:3, targetReps:6, repsLabel:"6–8", weight:85, increment:2.5, rule:"hyp", notes:"70–75% 1RM. Codos 45°. Triceps enfocado." },
      { id:"ub3", name:"DB OHP", sets:3, targetReps:8, repsLabel:"8–10", weight:32, increment:2, rule:"hyp", notes:"RIR 2. 32kg/mano. Press completo sobre cabeza." },
      { id:"ub4", name:"Pull-Ups / Chin-Ups", sets:3, targetReps:8, repsLabel:"8–12", weight:10, increment:2.5, rule:"vol", notes:"RIR 2. +10kg. Alterna agarre cada sesión." },
      { id:"ub5", name:"Chest-Supported Row", sets:3, targetReps:10, repsLabel:"10–12", weight:95, increment:2.5, rule:"vol", notes:"Unilateral. RIR 2. Codo alto." },
      { id:"ub6", name:"Cable Lateral Raise", sets:3, targetReps:15, repsLabel:"15–20", weight:10, increment:1, rule:"vol", notes:"Unilateral cable. RIR 1. Más tensión que mancuerna." },
      { id:"ub7", name:"Curl con Barra", sets:3, targetReps:8, repsLabel:"8–10", weight:30, increment:2.5, rule:"hyp", notes:"RIR 1–2. Supinación. Sin swinging." },
      { id:"ub8", name:"Hammer Curl", sets:2, targetReps:10, repsLabel:"10–12", weight:16, increment:2, rule:"hyp", notes:"Braquial. Agarre neutro. Control excéntrico." },
      { id:"ub9", name:"Triceps Pushdowns", sets:3, targetReps:12, repsLabel:"12–15", weight:25, increment:2.5, rule:"vol", notes:"RIR 1. Cuerda. Codo fijo al costado." },
      { id:"ub10", name:"Face Pull", sets:3, targetReps:15, repsLabel:"15–20", weight:15, increment:1, rule:"vol", notes:"Salud escapular. Rotación externa." },
    ]
  },
  "Lower B": {
    label: "LOWER B", subtitle: "Deadlift + Posterior",
    accent: "#4caf50", days: "Viernes", focus: "CNS + Potencia",
    exercises: [
      { id:"lb1", name:"Deadlift – 5×3", sets:3, targetReps:3, repsLabel:"3", weight:120, increment:2.5, rule:"main", notes:"5 series de 3. Barra rápida. Setup consistente." },
      { id:"lb2", name:"Deficit Deadlift (opc.)", sets:2, targetReps:4, repsLabel:"4", weight:100, increment:2.5, rule:"hyp", notes:"5cm déficit. Técnica de salida. Opcional." },
      { id:"lb3", name:"Romanian Deadlift", sets:3, targetReps:8, repsLabel:"8–10", weight:80, increment:2.5, rule:"hyp", notes:"Tensión continua. Bisagra perfecta. Sin bloqueo." },
      { id:"lb4", name:"Bulgarian Split Squat", sets:3, targetReps:8, repsLabel:"8–10", weight:30, increment:2.5, rule:"hyp", notes:"Bloqueo fuerte arriba. Talón delantero en suelo." },
      { id:"lb5", name:"Hip Thrust (Smith)", sets:3, targetReps:10, repsLabel:"10–12", weight:145, increment:5, rule:"hyp", notes:"Bloqueo fuerte 1s. ~145kg. Glúteo." },
      { id:"lb6", name:"Hamstring Curl (Lying)", sets:3, targetReps:10, repsLabel:"10–12", weight:73, increment:2.5, rule:"vol", notes:"RIR 1–2. Excéntrico controlado 3s." },
      { id:"lb7", name:"Back Extension", sets:3, targetReps:12, repsLabel:"12–15", weight:20, increment:2.5, rule:"vol", notes:"Control total. Erector foco. No hiperextensión." },
      { id:"lb8", name:"Ab Rollout / Plank", sets:3, targetReps:8, repsLabel:"8–10", weight:0, increment:0, rule:"vol", notes:"Anti-extensión. Rollout si puedes, plank cargado si no." },
    ]
  }
};

const ALL_EXERCISES = Object.values(ROUTINE).flatMap(d => d.exercises);
const RULE_COLORS   = { main:"#e63946", hyp:"#ff9800", vol:"#2196f3", auto:"#9c27b0" };
const RULE_LABELS   = { main:"Fuerza", hyp:"Hipertrofia", vol:"Volumen", auto:"Auto" };

// ─── PROGRESSION LOGIC ───────────────────────────────────────────────────────
function checkProgression(ex, repsArr) {
  if (!repsArr || repsArr.length < ex.sets) return false;
  return repsArr.slice(0, ex.sets).every(r => Number(r) >= ex.targetReps);
}

function getProgStatus(ex, logs) {
  if (ex.rule === "auto") return { status:"auto", label:"Auto", color:"#9c27b0" };
  const exLogs = logs
    .filter(l => l.ex_id === ex.id)
    .sort((a,b) => new Date(a.logged_at) - new Date(b.logged_at));
  if (!exLogs.length) return { status:"pending", label:"Sin datos", color:"#555" };

  const last    = exLogs[exLogs.length - 1];
  const hit     = checkProgression(ex, last.reps);

  if (ex.rule === "vol") {
    if (exLogs.length < 2)
      return hit
        ? { status:"halfway", label:"⏳ 1 sem más", color:"#ff9800" }
        : { status:"fail",    label:"❌ Repite",    color:"#e63946" };
    const prevHit = checkProgression(ex, exLogs[exLogs.length - 2].reps);
    if (hit && prevHit) return { status:"up",      label:"✅ SUBE",       color:"#4caf50" };
    if (hit)            return { status:"halfway",  label:"⏳ 1 sem más",  color:"#ff9800" };
    return                     { status:"fail",     label:"❌ Repite",     color:"#e63946" };
  }

  return hit
    ? { status:"up",   label:"✅ SUBE",   color:"#4caf50" }
    : { status:"fail", label:"❌ Repite", color:"#e63946" };
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [mode,     setMode]     = useState("login"); // login | signup | sent
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMode("sent");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    width:"100%", padding:"12px 16px", borderRadius:10, marginBottom:12,
    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
    color:"#fff", fontSize:15, outline:"none", fontFamily:"inherit",
  };

  if (mode === "sent") return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", display:"flex",
                  alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:16 }}>📬</div>
        <h2 style={{ color:"#fff", fontWeight:800, marginBottom:8 }}>Revisa tu email</h2>
        <p style={{ color:"#888", fontSize:14, lineHeight:1.6 }}>
          Enviamos un link de confirmación a <b style={{color:"#ccc"}}>{email}</b>.
          Confírmalo y luego inicia sesión.
        </p>
        <button onClick={() => setMode("login")} style={{
          marginTop:20, padding:"12px 28px", borderRadius:10, border:"none",
          background:"#e63946", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
        }}>Ir a iniciar sesión</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", display:"flex",
                  alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:360, width:"100%" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36 }}>
          <div style={{ width:36, height:36, background:"#e63946", borderRadius:8,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18, fontWeight:900, color:"#fff" }}>P</div>
          <span style={{ fontWeight:800, fontSize:18, color:"#fff" }}>Powerlifting Tracker</span>
        </div>
        <h2 style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:6 }}>
          {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
        </h2>
        <p style={{ color:"#666", fontSize:13, marginBottom:24, lineHeight:1.5 }}>
          {mode === "login"
            ? "Inicia sesión para sincronizar tu progreso entre dispositivos."
            : "Crea tu cuenta para acceder desde cualquier dispositivo."}
        </p>
        <input type="email" placeholder="tu@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} style={inp} />
        <input type="password" placeholder="Contraseña"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} style={inp} />

        {error && (
          <div style={{ padding:"10px 14px", background:"rgba(230,57,70,0.15)",
                        border:"1px solid rgba(230,57,70,0.3)", borderRadius:8,
                        color:"#e63946", fontSize:13, marginBottom:14 }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading || !email || !password} style={{
          width:"100%", padding:"13px", borderRadius:10, border:"none",
          background: email && password ? "#e63946" : "#222",
          color: email && password ? "#fff" : "#555",
          fontWeight:700, fontSize:15, cursor: email && password ? "pointer" : "default",
          transition:"all 0.2s", marginBottom:14,
        }}>
          {loading ? "Cargando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>

        <p style={{ textAlign:"center", color:"#555", fontSize:13 }}>
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ color:"#e63946", cursor:"pointer", fontWeight:600 }}>
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── SET INPUT ────────────────────────────────────────────────────────────────
function SetInput({ value, onChange, target }) {
  const num  = Number(value);
  const hit  = value !== "" && !isNaN(num) && num >= target;
  const miss = value !== "" && !isNaN(num) && num < target;
  return (
    <input type="number" min="0" max="30"
      value={value} onChange={e => onChange(e.target.value)} placeholder="—"
      style={{
        width:44, height:38, textAlign:"center",
        background: hit ? "rgba(76,175,80,0.18)" : miss ? "rgba(230,57,70,0.18)" : "rgba(255,255,255,0.07)",
        border:`1.5px solid ${hit ? "#4caf50" : miss ? "#e63946" : "rgba(255,255,255,0.18)"}`,
        borderRadius:6, color: hit ? "#4caf50" : miss ? "#e63946" : "#fff",
        fontSize:15, fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
        outline:"none", transition:"all 0.15s",
      }}
    />
  );
}

// ─── EXERCISE ROW ─────────────────────────────────────────────────────────────
function ExerciseRow({ ex, weight, logs, onLogSession, onWeightEdit, accent, currentWeek }) {
  const [expanded,      setExpanded]      = useState(false);
  const [sessionReps,   setSessionReps]   = useState(Array(ex.sets).fill(""));
  const [sessionWeight, setSessionWeight] = useState(weight);
  const [editingWeight, setEditingWeight] = useState(false);
  const [editVal,       setEditVal]       = useState(weight);
  const [saving,        setSaving]        = useState(false);

  useEffect(() => { setSessionWeight(weight); setEditVal(weight); }, [weight]);

  const progStatus = getProgStatus(ex, logs);
  const canLog     = ex.rule !== "auto" && sessionReps.every(r => r !== "");
  const exLogs     = logs
    .filter(l => l.ex_id === ex.id)
    .sort((a,b) => new Date(b.logged_at) - new Date(a.logged_at))
    .slice(0, 4);

  async function handleLog() {
    if (!canLog) return;
    setSaving(true);
    await onLogSession(ex.id, sessionReps.map(Number), sessionWeight);
    setSessionReps(Array(ex.sets).fill(""));
    setSaving(false);
  }

  return (
    <div style={{
      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
      borderLeft:`3px solid ${RULE_COLORS[ex.rule]}`,
      borderRadius:10, marginBottom:8, overflow:"hidden",
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
                    cursor:"pointer", flexWrap:"wrap" }}
           onClick={() => setExpanded(e => !e)}>

        <span style={{
          fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20,
          background:`${RULE_COLORS[ex.rule]}22`, color:RULE_COLORS[ex.rule],
          border:`1px solid ${RULE_COLORS[ex.rule]}44`, whiteSpace:"nowrap",
          fontFamily:"'JetBrains Mono',monospace", flexShrink:0,
        }}>{RULE_LABELS[ex.rule]}</span>

        <span style={{ flex:1, fontWeight:600, fontSize:13.5, color:"#f0f0f0", minWidth:100 }}>
          {ex.name}
        </span>

        <span style={{ fontSize:12, color:"#aaa", whiteSpace:"nowrap" }}>
          {ex.sets}×<span style={{ color:accent, fontWeight:700 }}>{ex.repsLabel}</span>
        </span>

        <div onClick={e => e.stopPropagation()}>
          {editingWeight ? (
            <input autoFocus type="number" value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onBlur={() => { onWeightEdit(ex.id, Number(editVal)); setEditingWeight(false); }}
              onKeyDown={e => { if(e.key==="Enter"){ onWeightEdit(ex.id, Number(editVal)); setEditingWeight(false); }}}
              style={{ width:62, background:"#1a1a2e", border:`1px solid ${accent}`,
                       borderRadius:6, color:"#fff", textAlign:"center",
                       fontSize:14, fontFamily:"'JetBrains Mono',monospace", padding:"3px 4px" }}
            />
          ) : (
            <span onClick={() => { setEditVal(weight); setEditingWeight(true); }}
              title="Click para editar peso"
              style={{ fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer",
                       background:"rgba(255,255,255,0.08)", padding:"3px 10px", borderRadius:6,
                       border:"1px solid rgba(255,255,255,0.15)",
                       fontFamily:"'JetBrains Mono',monospace" }}>
              {weight} kg
            </span>
          )}
        </div>

        <span style={{ fontSize:11, fontWeight:700, color:progStatus.color,
                       whiteSpace:"nowrap", minWidth:88, textAlign:"right" }}>
          {progStatus.label}
        </span>

        <span style={{ color:"#555", fontSize:14, transition:"transform 0.2s",
                       transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)",
                      padding:"14px 16px", background:"rgba(0,0,0,0.2)" }}>
          <p style={{ margin:"0 0 14px", fontSize:11.5, color:"#888", fontStyle:"italic" }}>
            {ex.notes}
          </p>

          <div style={{ display:"flex", alignItems:"flex-end", gap:10, flexWrap:"wrap" }}>
            {Array(ex.sets).fill(0).map((_, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:9, color:"#555", fontFamily:"'JetBrains Mono',monospace" }}>S{i+1}</span>
                <SetInput
                  value={sessionReps[i]}
                  onChange={v => setSessionReps(prev => { const n=[...prev]; n[i]=v; return n; })}
                  target={ex.targetReps}
                />
              </div>
            ))}

            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:9, color:"#555", fontFamily:"'JetBrains Mono',monospace" }}>PESO</span>
              <input type="number" value={sessionWeight}
                onChange={e => setSessionWeight(Number(e.target.value))}
                style={{ width:62, height:38, textAlign:"center",
                         background:"rgba(255,255,255,0.07)", border:`1.5px solid ${accent}55`,
                         borderRadius:6, color:"#fff", fontSize:14, fontWeight:700,
                         fontFamily:"'JetBrains Mono',monospace", outline:"none" }}
              />
            </div>

            <button onClick={handleLog} disabled={!canLog || saving} style={{
              padding:"9px 18px", borderRadius:8, border:"none", alignSelf:"flex-end",
              background: canLog && !saving ? accent : "#222",
              color: canLog && !saving ? "#fff" : "#444",
              fontWeight:700, fontSize:12, cursor: canLog && !saving ? "pointer" : "default",
              transition:"all 0.15s", letterSpacing:"0.04em",
            }}>
              {saving ? "..." : "REGISTRAR"}
            </button>

            {progStatus.status === "up" && ex.rule !== "vol" && (
              <div style={{ padding:"6px 12px", background:"rgba(76,175,80,0.12)",
                            borderRadius:8, border:"1px solid rgba(76,175,80,0.3)",
                            alignSelf:"flex-end" }}>
                <span style={{ fontSize:11, color:"#4caf50", fontWeight:700 }}>
                  Próximo: {weight + ex.increment} kg
                </span>
              </div>
            )}
          </div>

          {exLogs.length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:10, color:"#555", fontFamily:"'JetBrains Mono',monospace",
                            marginBottom:6, letterSpacing:"0.08em" }}>HISTORIAL</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {exLogs.map((log, i) => {
                  const allHit = log.reps.every(r => r >= ex.targetReps);
                  return (
                    <div key={i} style={{
                      padding:"5px 10px", borderRadius:7, fontSize:11,
                      background: allHit ? "rgba(76,175,80,0.1)" : "rgba(230,57,70,0.1)",
                      border:`1px solid ${allHit ? "rgba(76,175,80,0.3)" : "rgba(230,57,70,0.3)"}`,
                      fontFamily:"'JetBrains Mono',monospace",
                    }}>
                      <span style={{ color:"#888" }}>S{log.week} </span>
                      <span style={{ color: allHit ? "#4caf50" : "#e63946", fontWeight:700 }}>
                        {log.reps.join("/")}
                      </span>
                      <span style={{ color:"#666" }}> @{log.weight}kg</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,        setUser]        = useState(null);
  const [authReady,   setAuthReady]   = useState(false);
  const [weights,     setWeights]     = useState({});
  const [logs,        setLogs]        = useState([]);
  const [activeDay,   setActiveDay]   = useState("Upper A");
  const [activeTab,   setActiveTab]   = useState("training");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [syncing,     setSyncing]     = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) loadData(); }, [user]);

  async function loadData() {
    setSyncing(true);
    const { data: wData } = await supabase
      .from("weights").select("ex_id, weight").eq("user_id", user.id);
    const wMap = {};
    ALL_EXERCISES.forEach(ex => { wMap[ex.id] = ex.weight; });
    (wData || []).forEach(row => { wMap[row.ex_id] = row.weight; });
    setWeights(wMap);

    const { data: lData } = await supabase
      .from("sessions").select("*").eq("user_id", user.id)
      .order("logged_at", { ascending: true });
    setLogs(lData || []);
    setSyncing(false);
  }

  async function handleLogSession(exId, reps, weight) {
    const ex = ALL_EXERCISES.find(e => e.id === exId);
    const { data: newLog, error } = await supabase
      .from("sessions")
      .insert({ user_id: user.id, ex_id: exId, week: currentWeek, reps, weight })
      .select().single();
    if (error) { console.error(error); return; }

    const newLogs = [...logs, newLog];
    setLogs(newLogs);

    const exLogs = newLogs
      .filter(l => l.ex_id === exId)
      .sort((a,b) => new Date(a.logged_at) - new Date(b.logged_at));

    const hit = checkProgression(ex, reps);
    let newWeight = weights[exId];

    if (ex.rule !== "auto") {
      if (ex.rule === "vol" && exLogs.length >= 2) {
        const prevHit = checkProgression(ex, exLogs[exLogs.length - 2].reps);
        if (hit && prevHit) newWeight += ex.increment;
      } else if (ex.rule !== "vol" && hit) {
        newWeight += ex.increment;
      }
    }

    if (newWeight !== weights[exId]) await saveWeight(exId, newWeight);
  }

  async function saveWeight(exId, val) {
    await supabase.from("weights").upsert(
      { user_id: user.id, ex_id: exId, weight: val, updated_at: new Date().toISOString() },
      { onConflict: "user_id,ex_id" }
    );
    setWeights(prev => ({ ...prev, [exId]: val }));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setWeights({}); setLogs([]);
  }

  if (!authReady) return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", display:"flex",
                  alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#555", fontSize:14 }}>Cargando...</div>
    </div>
  );

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d10", color:"#fff",
                  fontFamily:"'Inter','Helvetica Neue',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#111; }
        ::-webkit-scrollbar-thumb { background:#333; border-radius:3px; }
      `}</style>

      {/* Topbar */}
      <div style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(10px)",
                    borderBottom:"1px solid rgba(255,255,255,0.07)",
                    padding:"0 20px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex",
                      alignItems:"center", justifyContent:"space-between", height:54 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, background:"#e63946", borderRadius:6,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:14, fontWeight:900 }}>P</div>
            <span style={{ fontWeight:800, fontSize:14 }}>PL Tracker</span>
            {syncing && (
              <span style={{ fontSize:10, color:"#555", fontFamily:"'JetBrains Mono',monospace" }}>
                sync...
              </span>
            )}
          </div>

          <div style={{ display:"flex", gap:2 }}>
            {[["training","Rutina"],["guide","Progresión"]].map(([key,label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding:"5px 12px", borderRadius:7, border:"none", cursor:"pointer",
                background: activeTab===key ? "rgba(230,57,70,0.2)" : "transparent",
                color: activeTab===key ? "#e63946" : "#666",
                fontWeight:600, fontSize:12, transition:"all 0.15s",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:10, color:"#555" }}>SEM</span>
              <select value={currentWeek} onChange={e => setCurrentWeek(Number(e.target.value))}
                style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:6,
                         color:"#fff", padding:"3px 6px", fontSize:13,
                         fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>
                {Array.from({length:16},(_,i) => <option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
            </div>
            <button onClick={handleSignOut} style={{
              padding:"5px 10px", borderRadius:6, border:"1px solid #333",
              background:"transparent", color:"#555", cursor:"pointer", fontSize:11,
            }}>Salir</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px" }}>

        {activeTab === "training" && (
          <>
            {/* Day tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:20,
                          overflowX:"auto", paddingBottom:4 }}>
              {Object.keys(ROUTINE).map(dk => {
                const d = ROUTINE[dk];
                const isActive = activeDay === dk;
                return (
                  <button key={dk} onClick={() => setActiveDay(dk)} style={{
                    padding:"9px 18px", borderRadius:10, border:"none", cursor:"pointer",
                    background: isActive ? d.accent : "rgba(255,255,255,0.05)",
                    color: isActive ? "#fff" : "#666",
                    fontWeight:700, fontSize:13, transition:"all 0.2s",
                    whiteSpace:"nowrap", flexShrink:0,
                    boxShadow: isActive ? `0 4px 20px ${d.accent}44` : "none",
                  }}>
                    <div style={{ fontSize:9, opacity:0.7, marginBottom:1, letterSpacing:"0.05em" }}>
                      {d.days}
                    </div>
                    {d.label}
                  </button>
                );
              })}
            </div>

            {(() => {
              const d = ROUTINE[activeDay];
              return (
                <>
                  <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between",
                                marginBottom:18, paddingBottom:14,
                                borderBottom:`2px solid ${d.accent}33` }}>
                    <div>
                      <div style={{ fontSize:11, color:d.accent, fontWeight:700,
                                    letterSpacing:"0.12em", fontFamily:"'JetBrains Mono',monospace",
                                    marginBottom:3 }}>
                        {d.days} · {d.focus}
                      </div>
                      <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#fff" }}>
                        {d.label}
                        <span style={{ fontSize:13, fontWeight:400, color:"#666", marginLeft:10 }}>
                          {d.subtitle}
                        </span>
                      </h2>
                    </div>
                    <span style={{ fontSize:11, color:"#555" }}>
                      {d.exercises.length} ejercicios
                    </span>
                  </div>
                  {d.exercises.map(ex => (
                    <ExerciseRow
                      key={ex.id}
                      ex={ex}
                      weight={weights[ex.id] ?? ex.weight}
                      logs={logs}
                      onLogSession={handleLogSession}
                      onWeightEdit={saveWeight}
                      accent={d.accent}
                      currentWeek={currentWeek}
                    />
                  ))}
                </>
              );
            })()}
          </>
        )}

        {activeTab === "guide" && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:16 }}>
              Reglas de Progresión
            </h2>
            {[
              { key:"main", color:"#e63946", label:"Fuerza — 3×3 / 5×3",
                rule:"Completa TODOS los sets al target con barra rápida → +2.5 kg. Un solo set fallido = repite.",
                ex:"3/3/2 → ❌ Repite  ·  3/3/3 → ✅ Sube +2.5kg" },
              { key:"hyp", color:"#ff9800", label:"Hipertrofia — 2–3×6–10",
                rule:"Todos los sets al tope del rango → +2.5 kg. Cualquier set bajo el mínimo = mantén.",
                ex:"8/8 → ✅ Sube  ·  8/6 → ❌ Repite" },
              { key:"vol", color:"#2196f3", label:"Volumen — 2–3×10–15",
                rule:"Tope en TODOS los sets durante 2 sesiones consecutivas → sube. Solo 1 sesión al tope = espera.",
                ex:"Sem1: 15/15, Sem2: 15/15 → ✅ Sube  ·  Solo Sem1 → ⏳ 1 sem más" },
              { key:"auto", color:"#9c27b0", label:"Auto — % del Principal",
                rule:"Calculado automáticamente como % del lift principal. No requiere registro.",
                ex:"Paused Squat = 70% del Back Squat del día" },
            ].map(r => (
              <div key={r.key} style={{
                background:"rgba(255,255,255,0.04)", borderRadius:10,
                padding:"14px 16px", borderLeft:`3px solid ${r.color}`, marginBottom:10,
              }}>
                <span style={{ fontSize:10, fontWeight:700, color:r.color, padding:"2px 8px",
                               background:`${r.color}22`, borderRadius:20, display:"inline-block",
                               fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>
                  {r.label}
                </span>
                <p style={{ margin:"0 0 6px", fontSize:13, color:"#ccc", lineHeight:1.55 }}>{r.rule}</p>
                <p style={{ margin:0, fontSize:11.5, color:"#666",
                            fontFamily:"'JetBrains Mono',monospace", fontStyle:"italic" }}>{r.ex}</p>
              </div>
            ))}

            <div style={{ marginTop:28, padding:"14px 16px", background:"rgba(255,255,255,0.04)",
                          border:"1px solid rgba(255,255,255,0.08)", borderRadius:10 }}>
              <div style={{ fontSize:10, color:"#555", marginBottom:6,
                            fontFamily:"'JetBrains Mono',monospace" }}>CUENTA</div>
              <div style={{ fontSize:13, color:"#aaa", marginBottom:4 }}>{user.email}</div>
              <div style={{ fontSize:11, color:"#555", lineHeight:1.5 }}>
                Datos sincronizados en la nube. Accede con este email desde cualquier dispositivo.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}