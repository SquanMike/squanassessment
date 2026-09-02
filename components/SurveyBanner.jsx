"use client";
/* ============================================================
   SEPTEMBER 2026 — Main Street Construction Impact Survey
   ============================================================
   A prominent call-to-action at the top of the home page, the
   Main Street page and /survey.

   Three boxes side by side:
     1. THE SURVEY       — the form to print, fill in and return
     2. THE VIDEO        — the Mayor on what's happening
     3. THE PRESENTATION — the full slide deck on downtown

   Everything worth changing is in the constants below.
   The banner hides itself the day after DEADLINE.
   ============================================================ */

import { useEffect, useState } from "react";
import { NAVY, NAVY_DEEP, GOLD } from "@/lib/constants";

const DEADLINE = "2026-09-30";          // last day to return the survey
const SHOW_ANYWAY = false;              // true = ignore the deadline, keep showing

/* ---- 1. the survey -------------------------------------------------------- */
const PDF = "/Main-Street-Construction-Impact-Survey.pdf";
const PDF_THUMB = "/survey-thumb.png";  // page 1 of the form, cropped

/* Where completed forms go. Both pages come back to the Borough. */
const RETURN_ADDRESS = "Borough of Manasquan, Office of the Mayor, 201 East Main Street";
const RETURN_EMAIL = "mayor@manasquan-nj.gov";   // set to "" to remove the email option

/* ---- 2. the video --------------------------------------------------------- */
/* This is the Mayor's overview from the August 31 Council meeting.
   VIDEO_LENGTH is what tells people how much of their evening it costs, so keep
   it accurate — "4:12" or "18:30" style. Leave it "" and the time badge simply
   doesn't render, rather than showing a wrong number.
   Nothing loads from YouTube until someone clicks: the card is a thumbnail,
   and the player is only created on demand, on the no-cookie domain. */
const VIDEO_ID = "EHOhKXio0aM";
const VIDEO_TITLE = "The Mayor's overview to Council";
const VIDEO_LENGTH = "Under 15 min";   // exact runtime ("12:40") is better if you have it
const VIDEO_NOTE = "From the Council meeting on Monday, August 31 — the construction, the roundabout schedule, and why we're asking.";

/* ---- 3. the presentation -------------------------------------------------- */
const DECK_URL = "/main-street-presentation.html";
const DECK_POSTER = "/main-street-poster.png";
const DECK_TITLE = "The Main Street presentation";
const DECK_BADGE = "19 slides";
const DECK_NOTE = "Every idea on the table for downtown, start to finish.";

/* One accent colour per box, so the three read as three separate things
   rather than one long stripe. All from the Borough palette — no red. */
const ACCENT_FORM = GOLD;        // gold — the thing we're actually asking for
const ACCENT_VIDEO = "#4FA3C4";  // ocean, lightened to carry on navy
const ACCENT_DECK = "#7E96D6";   // a lighter Borough blue

const YT_WATCH = `https://youtu.be/${VIDEO_ID}`;
const YT_EMBED = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
const YT_THUMB = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const YT_THUMB_FALLBACK = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export default function SurveyBanner({ showPresentation = true }) {
  // Rendered on the server too, so the day count is computed after mount
  // to keep the server and browser markup identical.
  const [days, setDays] = useState(null);
  const [past, setPast] = useState(false);
  // 0 = big thumbnail, 1 = smaller one, 2 = neither loaded, so the card falls
  // back to plain Borough navy rather than a broken image.
  const [thumbStep, setThumbStep] = useState(0);
  // null when nothing is open; otherwise { src, title, external }
  const [playing, setPlaying] = useState(null);

  const playVideo = () => setPlaying({ src: YT_EMBED, title: VIDEO_TITLE, external: YT_WATCH });
  const playDeck = () => setPlaying({ src: DECK_URL, title: DECK_TITLE, external: DECK_URL });

  useEffect(() => {
    const end = new Date(DEADLINE + "T23:59:59");
    const left = Math.ceil((end - new Date()) / 86400000);
    setDays(left);
    setPast(left < 0);
  }, []);

  // Escape closes the pop-out, and the page behind it stops scrolling while it's up.
  useEffect(() => {
    if (!playing) return;
    const onKey = (e) => { if (e.key === "Escape") setPlaying(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [playing]);

  if (past && !SHOW_ANYWAY) return null;

  return (
    <section
      aria-labelledby="survey-banner-title"
      style={{
        marginTop: 18,
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
        border: `1px solid ${NAVY_DEEP}`,
        borderTop: `6px solid ${GOLD}`,
        borderRadius: 12,
        color: "#fff",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(19,28,66,0.18)",
      }}
    >
      <div style={{ padding: "16px 18px 18px" }}>
        {/* kicker row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 9, marginBottom: 9 }}>
          <span
            className="mpc-condensed"
            style={{
              background: GOLD, color: NAVY_DEEP, fontWeight: 700, fontSize: 12,
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "3px 9px", borderRadius: 5,
            }}
          >
            September · Action needed
          </span>
          {days !== null && days >= 0 && (
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#F4C97F", letterSpacing: "0.02em" }}>
              {days === 0 ? "Last day — due today" : `${days} day${days === 1 ? "" : "s"} left to return it`}
            </span>
          )}
        </div>

        {/* the ask, full width above the boxes */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
          <img
            className="mpc-survey-seal"
            src="/brand/office-seal.png"
            alt=""
            width="52"
            height="52"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <h2
              id="survey-banner-title"
              className="mpc-condensed mpc-survey-title"
              style={{
                margin: 0, fontSize: 25, lineHeight: 1.1, fontWeight: 700,
                letterSpacing: "0.02em", textTransform: "uppercase", color: "#fff",
              }}
            >
              Main Street Construction Impact Survey
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.5, color: "#DDE3F5", maxWidth: "88ch" }}>
              If your business has been affected by the Main Street construction, the Office of the
              Mayor is asking you to complete this two-page survey and return it by{" "}
              <strong style={{ color: "#fff", whiteSpace: "nowrap" }}>Wednesday, September&nbsp;30</strong>.
              It takes a few minutes, and good-faith estimates are fine.
            </p>
            <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.5, color: "#B9C2DE", maxWidth: "88ch" }}>
              This is how we measure the size of the impact. No fund exists yet, and returning the
              form is not an application for payment — but nothing can be decided until we know the
              scale of the need.
            </p>
          </div>
        </div>

        {/* three boxes */}
        <div className="mpc-survey-cols" style={{ marginTop: 16 }}>
          {/* ---- 1. the survey — the one thing we're actually asking for ---- */}
          <MediaCard
            primary
            icon="form"
            accent={ACCENT_FORM}
            kind="The form"
            eyebrow="Start here"
            thumb={PDF_THUMB}
            thumbFit="top"
            thumbBg="#fff"
            href={PDF}
            ariaLabel="Open the survey PDF"
            badge="PDF · 2 pages"
            title="Print it and fill it in"
            note="Two pages — the questions, then one page to read and sign."
          >
            <a
              href={PDF}
              download="Manasquan-Main-Street-Construction-Impact-Survey.pdf"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "11px 15px",
                borderRadius: 8, textDecoration: "none", lineHeight: 1.2,
                background: GOLD, color: NAVY_DEEP, border: `2px solid ${GOLD}`,
              }}
            >
              <span aria-hidden="true">⬇</span> Download the survey
            </a>
            <a href={PDF} target="_blank" rel="noopener noreferrer" style={LINK}>
              Open to print ↗
            </a>
          </MediaCard>

          {/* ---- 2. the video ---- */}
          <MediaCard
            icon="video"
            accent={ACCENT_VIDEO}
            kind="The video"
            eyebrow="Watch first — it's short"
            thumb={thumbStep === 0 ? YT_THUMB : thumbStep === 1 ? YT_THUMB_FALLBACK : null}
            onThumbError={() => setThumbStep((s) => s + 1)}
            onClick={playVideo}
            ariaLabel={`Play the video: ${VIDEO_TITLE}${VIDEO_LENGTH ? `, ${VIDEO_LENGTH} long` : ""}`}
            play
            badge={VIDEO_LENGTH || null}
            title={VIDEO_TITLE}
            note={VIDEO_NOTE}
          >
            <button type="button" onClick={playVideo} style={LINK_BTN}>Play it here</button>
            <a href={YT_WATCH} target="_blank" rel="noopener noreferrer" style={LINK}>
              Watch on YouTube ↗
            </a>
          </MediaCard>

          {/* ---- 3. the presentation ---- */}
          {showPresentation && (
            <MediaCard
              icon="slides"
              accent={ACCENT_DECK}
              kind="The slides"
              eyebrow="The full picture"
              thumb={DECK_POSTER}
              onClick={playDeck}
              ariaLabel={`Open ${DECK_TITLE}`}
              play
              badge={DECK_BADGE}
              title={DECK_TITLE}
              note={DECK_NOTE}
            >
              <button type="button" onClick={playDeck} style={LINK_BTN}>Open it here</button>
              <a href={DECK_URL} target="_blank" rel="noopener noreferrer" style={LINK}>
                New window ↗
              </a>
            </MediaCard>
          )}
        </div>

        {/* how to return it */}
        <div
          style={{
            marginTop: 16, paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            display: "grid", gap: 11,
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          }}
        >
          <ReturnItem n="1" label="Print both pages">
            Page 1 is the questions. Page 2 explains what this is and what it is not — please read it
            and sign at the bottom.
          </ReturnItem>
          <ReturnItem n="2" label="Fill it in">
            Use your records if you have them handy. A good-faith estimate is fine if you don&rsquo;t.
          </ReturnItem>
          <ReturnItem n="3" label="Return both pages by Sept. 30">
            Drop off or mail to {RETURN_ADDRESS}, Manasquan, NJ 08736.
            {RETURN_EMAIL ? (
              <>
                {" "}Or scan or photograph both pages and email them to{" "}
                <a href={`mailto:${RETURN_EMAIL}?subject=Main%20Street%20Construction%20Impact%20Survey`}
                   style={{ color: "#F4C97F", fontWeight: 700 }}>
                  {RETURN_EMAIL}
                </a>.
              </>
            ) : null}
          </ReturnItem>
        </div>

        <p style={{ margin: "13px 0 0", fontSize: 12, lineHeight: 1.55, color: "#9FA9CB" }}>
          Questions about the survey? Call the Office of the Mayor at 732-223-0544, or{" "}
          <a href="/ask" style={{ color: "#F4C97F", fontWeight: 700 }}>ask us here</a>.
        </p>
      </div>

      {playing && <MediaOverlay media={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}

const LINK = { fontSize: 12.5, fontWeight: 700, color: "#F4C97F", whiteSpace: "nowrap" };
const LINK_BTN = {
  background: "none", border: "none", padding: 0, cursor: "pointer",
  font: "inherit", fontSize: 12.5, fontWeight: 700, color: "#F4C97F",
  textDecoration: "underline", whiteSpace: "nowrap",
};

/* One of the three boxes. The thumbnail is a link when `href` is given and a
   button when `onClick` is; either way the whole picture is the target, which
   is what makes people click it. */
const CARD_ICONS = {
  form: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8.5h6M9 12.5h6M9 16.5h4"/>',
  video: '<path d="M8 5.5l10 6.5-10 6.5z"/>',
  slides: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8.5 20h7"/>',
};

function MediaCard({
  icon, accent, kind, eyebrow, thumb, thumbFit, thumbBg, onThumbError, href, onClick,
  ariaLabel, play, badge, title, note, primary, children,
}) {
  const frame = {
    display: "block", width: "100%", padding: 0, cursor: "pointer", textDecoration: "none",
    background: thumbBg || "rgba(255,255,255,0.06)",
    border: `1.5px solid ${accent}`,
    borderRadius: 9, overflow: "hidden", position: "relative", lineHeight: 0,
    aspectRatio: "16 / 9",
  };

  const inner = (
    <>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          onError={onThumbError}
          style={{
            display: "block", width: "100%", height: "100%",
            objectFit: "cover", objectPosition: thumbFit || "center",
          }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            display: "block", width: "100%", height: "100%",
            background: `linear-gradient(150deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
          }}
        />
      )}
      {play && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(19,28,66,0.10) 0%, rgba(19,28,66,0.20) 55%, rgba(10,14,34,0.70) 100%)",
            }}
          />
          <span
            className="mpc-playbtn"
            aria-hidden="true"
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 50, height: 50, borderRadius: "50%",
              background: GOLD, border: "3px solid rgba(255,255,255,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
            }}
          >
            <span
              style={{
                borderLeft: `15px solid ${NAVY_DEEP}`, borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent", marginLeft: 4,
              }}
            />
          </span>
        </>
      )}
      {badge && (
        <span
          style={{
            position: "absolute", right: 8, bottom: 8,
            background: "rgba(10,14,34,0.86)", color: "#fff",
            fontSize: 11.5, fontWeight: 700, lineHeight: 1,
            padding: "5px 8px", borderRadius: 5,
            letterSpacing: "0.02em", fontVariantNumeric: "tabular-nums",
          }}
        >
          {badge}
        </span>
      )}
    </>
  );

  return (
    <div
      className={`mpc-subcard${primary ? " mpc-subcard-primary" : ""}`}
      style={{ borderTop: `4px solid ${accent}` }}
    >
      {/* icon + type header — this is what makes three boxes read as three
          different things. Deliberately NOT numbered: the 1-2-3 further down
          is the sequence for returning the form, and two numbered runs on one
          banner would read as one list. */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
            background: accent,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 24 24" width="16" height="16"
            fill={icon === "video" ? NAVY_DEEP : "none"}
            stroke={NAVY_DEEP} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: CARD_ICONS[icon] }}
          />
        </span>
        <span style={{ minWidth: 0 }}>
          <span
            className="mpc-condensed"
            style={{
              display: "block", fontSize: 15, fontWeight: 700, color: "#fff",
              letterSpacing: "0.07em", textTransform: "uppercase", lineHeight: 1.1,
            }}
          >
            {kind}
          </span>
          <span
            style={{
              display: "block", fontSize: 11, fontWeight: 700, color: accent,
              letterSpacing: "0.13em", textTransform: "uppercase", marginTop: 1,
            }}
          >
            {eyebrow}
          </span>
        </span>
      </div>

      {href ? (
        <a className="mpc-playcard" href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} style={frame}>
          {inner}
        </a>
      ) : (
        <button type="button" className="mpc-playcard" onClick={onClick} aria-label={ariaLabel} style={frame}>
          {inner}
        </button>
      )}

      <div className="mpc-condensed" style={{ fontSize: 15.5, fontWeight: 700, color: "#fff", letterSpacing: "0.03em", marginTop: 9 }}>
        {title}
      </div>
      <p style={{ margin: "2px 0 0", fontSize: 12.5, lineHeight: 1.5, color: "#B9C2DE" }}>{note}</p>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 10 }}>
        {children}
      </div>
    </div>
  );
}

/* Whatever was clicked, played in place — a full-screen layer over the page with
   the video or the deck in a frame, a way out, and a link to its own window.
   The YouTube frame is only ever created after a click, so nothing is requested
   from YouTube while someone is just reading the page. */
function MediaOverlay({ media, onClose }) {
  const isVideo = media.src.includes("youtube-nocookie.com");
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={media.title}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "#0A0E22",
        display: "flex", flexDirection: "column",
        padding: "clamp(8px, 2vw, 24px)",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap", marginBottom: 10, flexShrink: 0,
        }}
      >
        <div className="mpc-condensed" style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {media.title}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href={media.external}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 13.5, fontWeight: 700, color: NAVY_DEEP, background: GOLD,
              padding: "9px 14px", borderRadius: 8, textDecoration: "none",
            }}
          >
            {isVideo ? "Watch on YouTube ↗" : "Open in a new window ↗"}
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label={isVideo ? "Close the video" : "Close the presentation"}
            style={{
              font: "inherit", fontSize: 13.5, fontWeight: 700, color: "#fff",
              background: "transparent", border: "1.5px solid rgba(255,255,255,0.5)",
              padding: "9px 14px", borderRadius: 8, cursor: "pointer",
            }}
          >
            Close ✕
          </button>
        </div>
      </div>
      <iframe
        src={media.src}
        title={media.title}
        onClick={(e) => e.stopPropagation()}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          flex: 1, width: "100%", border: "none", borderRadius: 10,
          background: isVideo ? "#000" : "#fff", minHeight: 0,
        }}
      />
    </div>
  );
}

function ReturnItem({ n, label, children }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
          background: "rgba(232,163,61,0.22)", border: `1.5px solid ${GOLD}`,
          color: GOLD, fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
        }}
      >
        {n}
      </span>
      <div>
        <div className="mpc-condensed" style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {label}
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#C3CBE6", marginTop: 1 }}>{children}</div>
      </div>
    </div>
  );
}
