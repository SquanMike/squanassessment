"use client";
/* Public Main Street page: the presentation + a feedback form.
   Submissions POST to /api/main-street-feedback (stored privately + emailed).
   No public results. */

import { useState } from "react";
import PageShell from "./PageShell";
import SurveyBanner from "./SurveyBanner";
import { NAVY, GOLD, INK } from "@/lib/constants";

const FOR = "#2E6B3E";       // brand green (Completed)
const AGAINST = "#B45309";   // brand burnt-amber (RED in constants; never scarlet)
const UNSURE = "#5B6472";
const MUTED = "#6B6857";
const LINE = "#E2DFD4";

const IDEAS = [
  { key: "bid", n: 1, name: "Business Improvement District", desc: "A downtown organization funded to handle programs, marketing, and upkeep.",
    icon: '<path d="M20 5l13 4.2v8.6c0 8.7-5.4 13.9-13 17.7-7.6-3.8-13-9-13-17.7V9.2z"/>' },
  { key: "signs", n: 2, name: "Gateway parking signs", desc: "Clear signs at the entrances directing drivers to the municipal lots.",
    icon: '<rect x="8.5" y="7" width="23" height="13" rx="2"/><path d="M20 20v13M14 33h12"/><path d="M16.5 11v5.2M16.5 11h3.2a1.9 1.9 0 0 1 0 3.8h-3.2"/>' },
  { key: "calming", n: 3, name: "Calmed side streets", desc: "Turn restrictions on Pearce & Parker (seasonal), plus a permanent close of Miller Preston.",
    icon: '<path d="M5 21h30"/><rect x="10.5" y="15" width="5" height="18" rx="2.5"/><rect x="24.5" y="15" width="5" height="18" rx="2.5"/>' },
  { key: "trolley", n: 4, name: "The trolley & its stop", desc: "A downtown trolley loop that connects the outer lots to Main Street.",
    icon: '<rect x="7" y="11" width="26" height="17" rx="3"/><path d="M7 21h26M13 28l-2 4M27 28l2 4M20 5v6"/>' },
  { key: "parking", n: 5, name: "Parallel parking + bike lanes", desc: "Reconfigure on-street parking and add bike lanes (the biggest change).",
    icon: '<rect x="7" y="7" width="26" height="26" rx="3"/><path d="M15.5 27V13h6.5a4.4 4.4 0 0 1 0 8.8h-6.5"/>' },
  { key: "garage", n: 6, name: "A parking garage", desc: "A structured parking deck — somewhere on Main Street or in the Plaza.",
    status: "Not under consideration",
    statusNote: "This one is on the list only because residents asked us to look at it. The Mayor and Council do not support building a garage and do not believe the town needs one, and it is not being pursued. It is still here so you can tell us what you think.",
    icon: '<path d="M6 16 L20 8 L34 16"/><rect x="8.5" y="16" width="23" height="18"/><path d="M8.5 23h23M8.5 29h23"/>' },
];
const ABOUT = ["Overall — all the ideas", ...IDEAS.map((i) => i.name)];
const STANCES = [
  { v: "for", label: "In favor", color: FOR },
  { v: "against", label: "Against", color: AGAINST },
  { v: "unsure", label: "Not sure", color: UNSURE },
];

const kick = { fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD };
const lbl = { display: "block", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: NAVY, marginBottom: 6 };
const inputStyle = { width: "100%", fontSize: 16, padding: "11px 13px", border: `1.5px solid #D8CFB6`, borderRadius: 9, background: "#fff", color: INK, fontFamily: "inherit", boxSizing: "border-box" };

export default function MainStreetPage() {
  const [stances, setStances] = useState({});
  const [type, setType] = useState("Comment");
  const [wantReply, setWantReply] = useState(false);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(null);

  const setStance = (key, v) => setStances((p) => ({ ...p, [key]: p[key] === v ? undefined : v }));

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      about: fd.get("about") || "Overall",
      message: (fd.get("message") || "").trim(),
      firstName: (fd.get("firstName") || "").trim(),
      lastName: (fd.get("lastName") || "").trim(),
      email: (fd.get("email") || "").trim(),
      phone: (fd.get("phone") || "").trim(),
      wantReply,
      website: fd.get("website") || "", // honeypot
      stances: Object.fromEntries(Object.entries(stances).filter(([, v]) => v)),
    };
    if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) { setNote("Please fill in your first name, last name, email, and phone."); return; }
    if (!payload.message) { setNote("Please add a comment or question."); return; }
    setSending(true); setNote("");
    try {
      const r = await fetch("/api/main-street-feedback", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) setDone(payload);
      else throw new Error(j.error || "failed");
    } catch {
      setSending(false);
      setNote("Sorry — that didn’t go through. Please try again, or email mayor@manasquan-nj.gov directly.");
    }
  }

  return (
    <PageShell title="Main Street" subtitle="A menu of ideas for our downtown — take a look, then weigh in.">
      {/* September 2026 — construction impact survey, businesses only */}
      {/* no presentation card here — the presentation itself is right below */}
      <div style={{ marginTop: -4, marginBottom: 22 }}><SurveyBanner showPresentation={false} /></div>

      {/* Presentation */}
      <div style={kick}>The presentation</div>
      <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: NAVY, fontSize: 26, margin: "6px 0 8px" }}>See all the ideas in a few minutes.</h2>
      <p style={{ fontSize: 16, color: INK, margin: "0 0 14px", lineHeight: 1.55 }}>
        Three things are funded and getting done this fall — the roundabout, the Route&nbsp;71 &amp; Main work, and new pavers for the worn brick.
        Everything else is a <b>menu of ideas to weigh</b> — nothing is decided. Watch the short presentation, then weigh in below.
      </p>
      <a href="/main-street-presentation.html" aria-label="Open the presentation"
         style={{ display: "block", position: "relative", border: `3px solid ${INK}`, borderRadius: 12, overflow: "hidden" }}>
        <img src="/main-street-poster.png" alt="Open the Main Street presentation" style={{ display: "block", width: "100%" }} />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(19,28,66,.22)" }}>
          <span style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.94)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ borderLeft: `22px solid ${NAVY}`, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", marginLeft: 5 }} />
          </span>
        </span>
      </a>
      <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, textAlign: "center", marginTop: 8, fontWeight: 700 }}>
        Click to open · arrow keys or on-screen arrows to move · press F for full screen
      </div>

      <hr style={{ border: 0, borderTop: `1px solid ${LINE}`, margin: "26px 0" }} />

      {/* Feedback */}
      <div style={kick}>Your feedback</div>
      <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: NAVY, fontSize: 26, margin: "6px 0 8px" }}>Tell us what you think.</h2>
      <p style={{ fontSize: 16, color: INK, margin: "0 0 6px", lineHeight: 1.55 }}>
        For each idea, tell us if you’re in favor or against — then add a comment or a question. Everything goes to Town Hall. Skip any you don’t have a view on.
      </p>

      {done ? (
        <div style={{ background: "#EAF3EC", border: `1.5px solid ${FOR}`, borderRadius: 12, padding: 20, color: NAVY, fontSize: 17, marginTop: 16 }}>
          <b>Thank you — your {String(done.type).toLowerCase()} was sent to Town Hall.</b>{done.wantReply ? " We’ll be in touch." : ""}
          <div style={{ marginTop: 10, fontSize: 14 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setDone(null); setSending(false); setStances({}); setWantReply(false); setNote(""); }} style={{ color: NAVY }}>Submit another response</a>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

          <div style={{ display: "grid", gap: 12 }}>
            {IDEAS.map((it) => (
              <div key={it.key} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "13px 15px", background: "#fff", display: "flex", gap: 13, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", background: NAVY, color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.n}</div>
                <svg viewBox="0 0 40 40" width="30" height="30" fill="none" stroke={NAVY} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }} dangerouslySetInnerHTML={{ __html: it.icon }} />
                <div style={{ flex: 1, minWidth: 170 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: NAVY, lineHeight: 1.15 }}>{it.name}</div>
                    {it.status && (
                      <span style={{
                        background: UNSURE, color: "#fff", fontSize: 10.5, fontWeight: 700,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap",
                      }}>
                        {it.status}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: MUTED, marginTop: 2 }}>{it.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 7, flex: "none" }}>
                  {STANCES.map((st) => {
                    const on = stances[it.key] === st.v;
                    return (
                      <button type="button" key={st.v} onClick={() => setStance(it.key, st.v)} aria-pressed={on}
                        style={{ cursor: "pointer", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 12.5, padding: "8px 12px", borderRadius: 8,
                          border: `1.5px solid ${on ? st.color : "#D8CFB6"}`, background: on ? st.color : "#fff", color: on ? "#fff" : MUTED }}>
                        {st.label}
                      </button>
                    );
                  })}
                </div>
                {it.statusNote && (
                  <div style={{
                    flexBasis: "100%", fontSize: 13, lineHeight: 1.55, color: INK,
                    background: "#F1EFE7", border: `1px solid ${LINE}`,
                    borderLeft: `3px solid ${UNSURE}`, borderRadius: 7, padding: "9px 11px",
                  }}>
                    {it.statusNote}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={lbl}>Is this a comment or a question?</label>
            <div style={{ display: "inline-flex", border: `1.5px solid #D8CFB6`, borderRadius: 9, overflow: "hidden" }}>
              {["Comment", "Question"].map((t) => (
                <button type="button" key={t} onClick={() => setType(t)}
                  style={{ cursor: "pointer", padding: "10px 20px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 13.5, border: "none",
                    background: type === t ? NAVY : "#fff", color: type === t ? "#fff" : MUTED }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={lbl} htmlFor="about">Mainly about…</label>
            <select id="about" name="about" style={inputStyle} defaultValue={ABOUT[0]}>
              {ABOUT.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={lbl} htmlFor="message">Your comment or question</label>
            <textarea id="message" name="message" required placeholder="Tell us what you think, or ask a question…" style={{ ...inputStyle, minHeight: 118, resize: "vertical" }} />
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={lbl}>Your details <span style={{ color: AGAINST }}>(required)</span></label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <input name="firstName" type="text" required placeholder="First name" autoComplete="given-name" style={inputStyle} />
              <input name="lastName" type="text" required placeholder="Last name" autoComplete="family-name" style={inputStyle} />
              <input name="email" type="email" required placeholder="Email" autoComplete="email" style={inputStyle} />
              <input name="phone" type="tel" required placeholder="Phone" autoComplete="tel" style={inputStyle} />
            </div>
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontSize: 16, color: INK, cursor: "pointer" }}>
            <input type="checkbox" checked={wantReply} onChange={(e) => setWantReply(e.target.checked)} style={{ marginTop: 4, width: 18, height: 18 }} />
            <span>I’d like a response from Town Hall</span>
          </label>

          <div style={{ marginTop: 20 }}>
            <button type="submit" disabled={sending}
              style={{ background: GOLD, color: NAVY, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 15, padding: "13px 22px", border: "none", borderRadius: 9, cursor: "pointer", opacity: sending ? 0.6 : 1 }}>
              {sending ? "Sending…" : "Send to Town Hall"}
            </button>
          </div>
          <div style={{ fontSize: 13, color: note ? AGAINST : MUTED, marginTop: 10 }}>
            {note || "Your details go only to Town Hall and are never shown publicly."}
          </div>
        </form>
      )}
    </PageShell>
  );
}
