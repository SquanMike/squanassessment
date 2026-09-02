import PageShell from "@/components/PageShell";
import SurveyBanner from "@/components/SurveyBanner";

/* A short, sayable URL for print and word of mouth: squanprojects.com/survey
   Nothing lives here but the survey call-to-action and the form itself. */

export const metadata = {
  title: "Main Street Construction Impact Survey · Squan Projects",
  description:
    "Businesses affected by the Main Street construction: download, print, complete and return the two-page impact survey to the Office of the Mayor by September 30, 2026.",
};

export default function SurveyPage() {
  return (
    <PageShell
      title="Construction Impact Survey"
      subtitle="For Main Street and downtown businesses — please return by September 30"
    >
      <SurveyBanner />

      <div style={{ marginTop: 22 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#E8A33D",
            marginBottom: 8,
          }}
        >
          Read it here
        </div>
        <object
          data="/Main-Street-Construction-Impact-Survey.pdf"
          type="application/pdf"
          width="100%"
          height="820"
          style={{ border: "1px solid #E2DFD4", borderRadius: 10, display: "block" }}
        >
          <p style={{ fontSize: 15, lineHeight: 1.6, padding: "14px 2px", margin: 0 }}>
            Your browser can&rsquo;t display the form here.{" "}
            <a
              href="/Main-Street-Construction-Impact-Survey.pdf"
              style={{ color: "#1E2A5C", fontWeight: 700 }}
            >
              Open the survey PDF
            </a>{" "}
            instead.
          </p>
        </object>
        <p style={{ fontSize: 12.5, color: "#6B6857", marginTop: 8 }}>
          Two pages. Page 1 is the questions; page 2 explains what this is and what it is not, and
          carries the signature line. Both pages come back to the Borough.
        </p>
      </div>
    </PageShell>
  );
}
