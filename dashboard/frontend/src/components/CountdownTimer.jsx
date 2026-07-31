import { useEffect, useState } from "react";

export default function CountdownTimer({ endsAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!endsAt) return 0;
    return Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!endsAt) return;

    // Immediately sync time left when endsAt prop loads or changes
    const initialRemaining = Math.max(
      0,
      Math.floor((endsAt - Date.now()) / 1000),
    );
    setTimeLeft(initialRemaining);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Check if less than 10 minutes (600 seconds) remain
  const isWarning = timeLeft <= 600 && timeLeft > 0;

  return (
    <div
      className="mono"
      style={{
        fontWeight: 700,
        fontSize: 50,
        // Switches to red when <= 10 mins remaining
        color: isWarning
          ? "var(--red, #ef4444)"
          : "var(--text-primary, #efe411)",
        // Adds a soft red glow when in the warning zone
        textShadow: isWarning ? "0 0 12px rgba(239, 68, 68, 0.4)" : "none",
        transition: "color 0.3s ease, text-shadow 0.3s ease",
      }}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
