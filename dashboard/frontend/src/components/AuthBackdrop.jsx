/**
 * Wraps the sign-in card in a themed backdrop: the background is filled with
 * multiple staggered marquee rows (varying speed/direction/opacity) reading
 * like a wall of system telemetry, plus a slow-pulsing violet glow behind
 * the card and a bold status ticker anchored at the bottom.

 */

// Short varied lines to seed the background rows — mixed so no two rows
// read identically even though they loop.
const FEED_LINES = [
  "PROJECT PHOENIX — LAUNCH IN T-MINUS 59:55",
  "ARCHITECTURE REPOSITORY: CORRUPTED",
  "LEAD SOLUTION ARCHITECT: OFFLINE",
  "DATABASE LATENCY: RISING",
  "AWAITING CANDIDATE AUTHENTICATION…",
  "ENGINEERING WAR ROOM — ACCESS RESTRICTED",
];

const ROW_COUNT = 9;

function buildRow(index) {
  // Deterministic-ish variation per row so it's not visually uniform.
  const offset = (index * 3) % FEED_LINES.length;
  const lines = [...FEED_LINES.slice(offset), ...FEED_LINES.slice(0, offset)];
  const text = lines.join("   ·   ");
  const reverse = index % 2 === 1;
  const duration = 50 + (index % 4) * 14; // 50–92s, varied per row
  const opacity = 0.15 + (index % 3) * 0.06; // 0.15–0.27, subtle depth
  const fontSize = 11 + (index % 3); // 11–13px
  return { text, reverse, duration, opacity, fontSize, key: `row-${index}` };
}

export default function AuthBackdrop({ children }) {
  const rows = Array.from({ length: ROW_COUNT }, (_, i) => buildRow(i));
  const tickerText = FEED_LINES.join("   ·   ");

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background filled with staggered data-stream rows */}
      <div className="bg-marquee-field" aria-hidden="true">
        {rows.map((row) => (
          <div
            key={row.key}
            className="bg-marquee-row"
            style={{ opacity: row.opacity, color: "#f2b93b" }}
          >
            <div
              className={`bg-marquee-row-track mono${row.reverse ? " reverse" : ""}`}
              style={{
                animationDuration: `${row.duration}s`,
                fontSize: row.fontSize,
              }}
            >
              <span>{row.text}</span>
              <span>{row.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Slow-pulsing violet glow, like the poster's ring glow behind the hand */}
      <div className="auth-bg-glow" aria-hidden="true" />

      {/* Sign-in card sits above the background layers */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
