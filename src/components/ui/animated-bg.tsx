"use client";

import { cn } from "@/lib/utils";

type CSSVar = React.CSSProperties & { [key: `--${string}`]: string };

function v(dur: string, delay = "0s"): CSSVar {
  return { "--dur": dur, "--delay": delay } as CSSVar;
}

export function AnimatedBg({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <marker
            id="abg-aw"
            markerWidth="5"
            markerHeight="5"
            refX="4"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L0,5 L5,2.5 z" fill="rgba(255,255,255,0.18)" />
          </marker>
          <marker
            id="abg-ar"
            markerWidth="5"
            markerHeight="5"
            refX="4"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L0,5 L5,2.5 z" fill="rgba(193,33,41,0.38)" />
          </marker>

          <style>{`
            .abg-pulse {
              animation: abg-pulse var(--dur,9s) ease-in-out infinite var(--delay,0s);
            }
            .abg-float {
              animation: abg-float var(--dur,8s) ease-in-out infinite var(--delay,0s);
            }
            .abg-drift {
              animation: abg-drift var(--dur,13s) linear infinite var(--delay,0s);
            }
            .abg-slide {
              animation: abg-slide var(--dur,11s) ease-in-out infinite var(--delay,0s);
            }

            @keyframes abg-pulse {
              0%   { transform: scale(0.78); opacity: 0; }
              35%  { opacity: 1; }
              100% { transform: scale(1.22); opacity: 0; }
            }
            @keyframes abg-float {
              0%   { transform: translateY(0)  translateX(0);   opacity: 0; }
              12%  { opacity: 1; }
              88%  { opacity: 1; }
              100% { transform: translateY(-95px) translateX(14px); opacity: 0; }
            }
            @keyframes abg-drift {
              0%   { transform: translate(0,0);        opacity: 0; }
              14%  { opacity: 0.9; }
              86%  { opacity: 0.9; }
              100% { transform: translate(68px,-52px); opacity: 0; }
            }
            @keyframes abg-slide {
              0%   { transform: translateX(-28px); opacity: 0; }
              15%  { opacity: 1; }
              85%  { opacity: 1; }
              100% { transform: translateX(28px);  opacity: 0; }
            }
          `}</style>
        </defs>

        {/* ── Pulsing rings ── */}
        <circle className="abg-pulse" style={v("8s")}     cx="180"  cy="180" r="110" fill="none" stroke="rgba(255,255,255,0.04)"  strokeWidth="1" />
        <circle className="abg-pulse" style={v("11s","2.5s")} cx="1260" cy="660" r="170" fill="none" stroke="rgba(255,255,255,0.03)"  strokeWidth="1" />
        <circle className="abg-pulse" style={v("9s","1.2s")}  cx="720"  cy="80"  r="75"  fill="none" stroke="rgba(193,33,41,0.13)"   strokeWidth="1" />
        <circle className="abg-pulse" style={v("13s","4s")}   cx="400"  cy="800" r="95"  fill="none" stroke="rgba(193,33,41,0.07)"   strokeWidth="1" />
        <circle className="abg-pulse" style={v("7s","3s")}    cx="1100" cy="220" r="55"  fill="none" stroke="rgba(255,255,255,0.05)"  strokeWidth="1" />
        <circle className="abg-pulse" style={v("10s","5.5s")} cx="620"  cy="500" r="130" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />

        {/* ── Floating dots ── */}
        <circle className="abg-float" style={v("7s")}       cx="155"  cy="520" r="2.5" fill="rgba(255,255,255,0.14)" />
        <circle className="abg-float" style={v("9s","1.8s")}  cx="430"  cy="610" r="2"   fill="rgba(193,33,41,0.48)"  />
        <circle className="abg-float" style={v("11s","0.8s")} cx="910"  cy="760" r="2.5" fill="rgba(255,255,255,0.10)" />
        <circle className="abg-float" style={v("8s","3.2s")}  cx="1310" cy="410" r="2"   fill="rgba(193,33,41,0.42)"  />
        <circle className="abg-float" style={v("10s","0.4s")} cx="660"  cy="290" r="2"   fill="rgba(255,255,255,0.09)" />
        <circle className="abg-float" style={v("6.5s","4.5s")}cx="1060" cy="590" r="2"   fill="rgba(255,255,255,0.11)" />
        <circle className="abg-float" style={v("12s","1.5s")} cx="85"   cy="360" r="3"   fill="rgba(193,33,41,0.30)"  />
        <circle className="abg-float" style={v("8.5s","5s")}  cx="1180" cy="770" r="2"   fill="rgba(255,255,255,0.08)" />
        <circle className="abg-float" style={v("9.5s","7s")}  cx="340"  cy="140" r="2"   fill="rgba(193,33,41,0.25)"  />

        {/* ── Drifting diagonal lines ── */}
        <line className="abg-drift" style={v("14s")}      x1="280" y1="860" x2="460" y2="680" stroke="rgba(255,255,255,0.055)" strokeWidth="1"   />
        <line className="abg-drift" style={v("10s","3s")}  x1="880" y1="90"  x2="1060"y2="270" stroke="rgba(255,255,255,0.045)" strokeWidth="1"   />
        <line className="abg-drift" style={v("16s","7s")}  x1="90"  y1="90"  x2="230" y2="230" stroke="rgba(193,33,41,0.10)"   strokeWidth="0.8" />
        <line className="abg-drift" style={v("12s","5s")}  x1="600" y1="460" x2="740" y2="320" stroke="rgba(255,255,255,0.045)" strokeWidth="0.8" />
        <line className="abg-drift" style={v("18s","2s")}  x1="1180"y1="710" x2="1360"y2="530" stroke="rgba(255,255,255,0.040)" strokeWidth="1"   />
        <line className="abg-drift" style={v("15s","9s")}  x1="500" y1="200" x2="650" y2="50"  stroke="rgba(193,33,41,0.09)"   strokeWidth="0.8" />

        {/* ── Horizontal arrows ── */}
        <line className="abg-slide" style={v("10s")}      x1="190" y1="710" x2="330" y2="710" stroke="rgba(255,255,255,0.09)"  strokeWidth="1" markerEnd="url(#abg-aw)" />
        <line className="abg-slide" style={v("13s","4s")}  x1="990" y1="140" x2="1130"y2="140" stroke="rgba(193,33,41,0.24)"   strokeWidth="1" markerEnd="url(#abg-ar)" />
        <line className="abg-slide" style={v("9s","6s")}   x1="600" y1="380" x2="740" y2="380" stroke="rgba(255,255,255,0.07)"  strokeWidth="1" markerEnd="url(#abg-aw)" />
        <line className="abg-slide" style={v("15s","2s")}  x1="1260"y1="450" x2="1390"y2="450" stroke="rgba(193,33,41,0.18)"   strokeWidth="1" markerEnd="url(#abg-ar)" />
        <line className="abg-slide" style={v("11s","8s")}  x1="50"  y1="250" x2="185" y2="250" stroke="rgba(255,255,255,0.06)"  strokeWidth="1" markerEnd="url(#abg-aw)" />

        {/* ── Vertical arrows ── */}
        <line className="abg-float" style={v("9s","2.5s")} x1="500"  y1="840" x2="500"  y2="700" stroke="rgba(255,255,255,0.07)"  strokeWidth="1" markerEnd="url(#abg-aw)" />
        <line className="abg-float" style={v("11s","6s")}  x1="1350" y1="310" x2="1350" y2="170" stroke="rgba(193,33,41,0.18)"   strokeWidth="1" markerEnd="url(#abg-ar)" />
        <line className="abg-float" style={v("8s","10s")}  x1="820"  y1="890" x2="820"  y2="750" stroke="rgba(255,255,255,0.06)"  strokeWidth="1" markerEnd="url(#abg-aw)" />

        {/* ── Diamonds ── */}
        <polygon className="abg-float" style={v("15s","1s")} points="720,25 737,48 720,71 703,48"      fill="none" stroke="rgba(255,255,255,0.07)"  strokeWidth="1" />
        <polygon className="abg-float" style={v("18s","5s")} points="1400,755 1415,778 1400,801 1385,778" fill="none" stroke="rgba(193,33,41,0.15)"  strokeWidth="1" />
        <polygon className="abg-drift" style={v("20s","3s")} points="250,400 264,420 250,440 236,420"   fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
      </svg>
    </div>
  );
}
