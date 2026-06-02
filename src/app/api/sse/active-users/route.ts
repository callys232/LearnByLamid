import { NextRequest } from "next/server";

const EVENTS = [
  "started lesson",
  "completed module",
  "passed quiz",
  "enrolled in course",
  "joined live session",
  "earned certificate",
  "left feedback",
];

const NAMES = [
  "Amara O.", "Kwame M.", "Fatima D.", "Emeka N.", "Aisha B.",
  "Kofi A.", "Ngozi E.", "Seun F.", "Chidi I.", "Yewande T.",
];

function randomEvent() {
  return {
    id:        Math.random().toString(36).slice(2),
    user:      NAMES[Math.floor(Math.random() * NAMES.length)],
    action:    EVENTS[Math.floor(Math.random() * EVENTS.length)],
    timestamp: new Date().toISOString(),
  };
}

// Simulates a realistic active user count with slight variation
let baseActive = 134;
function nextActiveCount() {
  baseActive += Math.floor((Math.random() - 0.48) * 5);
  if (baseActive < 80)  baseActive = 80;
  if (baseActive > 300) baseActive = 300;
  return baseActive;
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let tick      = 0;

  const stream = new ReadableStream({
    start(controller) {
      function send() {
        tick++;
        const payload = JSON.stringify({
          activeUsers:   nextActiveCount(),
          recentEvent:   tick % 2 === 0 ? randomEvent() : null,
          dropOffAlert:  tick === 8 ? { module: "Empathy & Discovery", rate: 14 } : null,
          serverTime:    new Date().toISOString(),
        });
        try {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }

      send(); // immediate first update
      const interval = setInterval(send, 5000);

      // Auto-close after 10 min — browser reconnects automatically
      setTimeout(() => {
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      }, 600_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
