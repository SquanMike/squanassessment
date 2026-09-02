"use client";
/* The public home page — CTAs, Mayor's message, A–Z directory, timeline,
   map, past projects, updates. Project details are full pages. */

import { useState, useEffect } from "react";
import { PAPER, INK, todayISO, fmtLong, projectSpan, deriveStatus } from "@/lib/constants";
import {
  Header, MayorMessage, NowBanner, Footer, FilterChips, Legend,
  Gantt, CardList, UpdatesFeed, ProjectSearch, PastProjects, TownMap, AZIndex,
} from "./shared";
import { AlertsCTA } from "./alerts";
import { QuestionCTA } from "./questions";
import { FeaturedTiles } from "./SaveTheShore";
import CouncilThanks from "./CouncilThanks";
import SurveyBanner from "./SurveyBanner";

export default function PublicApp({ initialData }) {
  const data = initialData;
  const today = todayISO();

  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("timeline");
  const [search, setSearch] = useState("");

  // phones get the card list by default — the wide timeline is a tap away
  useEffect(() => {
    if (window.matchMedia("(max-width: 640px)").matches) setView("list");
  }, []);

  const open = (id) => { window.location.href = `/projects/${id}`; };

  const all = [...data.projects].sort((a, b) => projectSpan(a).start.localeCompare(projectSpan(b).start));
  const active = all.filter((p) => !p.archived);
  const past = all.filter((p) => p.archived).sort((a, b) => projectSpan(b).end.localeCompare(projectSpan(a).end));

  const statuses = active.map((p) => deriveStatus(p, today));
  const filterOptions = ["All", ...Array.from(new Set(statuses))];
  const matches = (p) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [p.name, p.location, p.description].some((t) => (t || "").toLowerCase().includes(q));
  };
  const visible = (filter === "All" ? active : active.filter((p) => deriveStatus(p, today) === filter)).filter(matches);

  return (
    <div style={{ minHeight: "100vh", background: PAPER, color: INK }}>
      <Header />
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px 64px" }}>
        <SurveyBanner />
        <AlertsCTA />
        <MayorMessage msg={data.mayorMessage} admin={false} />
        <FeaturedTiles />
        <NowBanner projects={active} today={today} onSelect={open} />
        <AZIndex projects={active} today={today} onSelect={open} />
        <section style={{ marginTop: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <h2 className="mpc-h2">Project Schedule</h2>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#6B6857" }}>as of {fmtLong(today)}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flex: "1 1 auto", justifyContent: "flex-end" }}>
              <ProjectSearch value={search} onChange={setSearch} />
              <div style={{ display: "flex", gap: 6 }}>
                {["timeline", "list"].map((v) => (
                  <button key={v} onClick={() => setView(v)} className="mpc-toggle"
                    style={{ background: view === v ? "#1E2A5C" : "#fff", color: view === v ? "#fff" : "#1E2A5C", border: "1.5px solid #1E2A5C" }}>
                    {v === "timeline" ? "Timeline" : "Project List"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <FilterChips options={filterOptions} value={filter} onChange={setFilter} projects={active} today={today} />
          {view === "timeline" ? (
            <Gantt projects={visible} today={today} onSelect={open} admin={false} />
          ) : (
            <CardList projects={visible} today={today} onSelect={open} admin={false} />
          )}
          <Legend />
        </section>
        <TownMap projects={active} today={today} onSelect={open} />
        <PastProjects projects={past.filter(matches)} onSelect={open} />
        <UpdatesFeed updates={data.updates} projects={all} admin={false} onSelectProject={open} />
        <CouncilThanks />
        <QuestionCTA />
      </main>
      <Footer staffHref="/admin" publishedAt={data.publishedAt} />
    </div>
  );
}
