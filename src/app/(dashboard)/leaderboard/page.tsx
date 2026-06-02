"use client";

import { useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  BreadcrumbNav,
} from "@/components/ui";
import { mockUsers, currentUser } from "@/mock/users";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Level system ────────────────────────────────────────────────────────────

const LEVELS = [
  {
    level: 1,
    name: "Novice",
    min: 0,
    max: 499,
    dot: "bg-slate-400",
    badge: "bg-slate-500/20 text-slate-300",
  },
  {
    level: 2,
    name: "Explorer",
    min: 500,
    max: 1_499,
    dot: "bg-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
  },
  {
    level: 3,
    name: "Learner",
    min: 1_500,
    max: 2_999,
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  {
    level: 4,
    name: "Scholar",
    min: 3_000,
    max: 5_999,
    dot: "bg-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
  },
  {
    level: 5,
    name: "Expert",
    min: 6_000,
    max: 11_999,
    dot: "bg-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
  {
    level: 6,
    name: "Master",
    min: 12_000,
    max: 24_999,
    dot: "bg-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
  },
  {
    level: 7,
    name: "Champion",
    min: 25_000,
    max: 49_999,
    dot: "bg-red-400",
    badge: "bg-red-500/20 text-red-300",
  },
  {
    level: 8,
    name: "Legend",
    min: 50_000,
    max: Infinity,
    dot: "bg-text-primary",
    badge: "bg-surface-active text-text-primary",
  },
] as const;

const XP_REWARDS = [
  { action: "Course Enrolled", xp: 25 },
  { action: "Course Completed", xp: 500 },
  { action: "Lesson Completed", xp: 10 },
  { action: "Quiz Passed", xp: 50 },
  { action: "Perfect Quiz", xp: 100 },
  { action: "Streak Milestone", xp: 100 },
] as const;

function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

type Period = "week" | "month" | "all";

// ─── Component ───────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("all");

  const ranked = [...mockUsers]
    .filter((u) => u.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = ranked.slice(0, 3);
  const myRank = ranked.find((u) => u.id === currentUser.id)?.rank ?? null;

  // Podium: 2nd (left), 1st (centre), 3rd (right)
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

  const podiumStyles = [
    { bg: "bg-slate-400/10 border-slate-400/20", ring: "", height: "pt-6" },
    {
      bg: "bg-yellow-400/10 border-yellow-400/30",
      ring: "ring-1 ring-yellow-400/40",
      height: "pt-0",
    },
    { bg: "bg-orange-400/10 border-orange-400/20", ring: "", height: "pt-6" },
  ];

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <Header
        title="Leaderboard"
        subtitle="Compete with learners and earn your rank."
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-6">
        {/* Top bar: breadcrumb + Your Rank */}
        <div className="flex items-center justify-between">
          <BreadcrumbNav crumbs={[{ label: "Leaderboard" }]} />
          {myRank && (
            <div className="rounded-xl border border-primary/30 bg-primary/8 px-5 py-2.5 text-right">
              <p className="text-xs text-text-muted">Your Rank</p>
              <p className="text-xl font-bold text-primary">#{myRank}</p>
            </div>
          )}
        </div>

        {/* Period tabs */}
        <div className="flex gap-2">
          {(["week", "month", "all"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                period === p
                  ? "bg-primary text-white shadow-primary-sm"
                  : "border border-border text-text-secondary hover:bg-surface hover:text-text-primary",
              )}
            >
              {p === "week"
                ? "This Week"
                : p === "month"
                  ? "This Month"
                  : "All Time"}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* ── Main ── */}
          <div className="space-y-4">
            {/* Podium */}
            <div className="grid grid-cols-3 gap-3 items-end">
              {podium.map((user, pi) => {
                const lvl = getLevel(user.xp);
                const style = podiumStyles[pi];
                const isFirst = user.rank === 1;
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all",
                      style.bg,
                      style.ring,
                      style.height,
                    )}
                  >
                    <span
                      className="text-2xl leading-none"
                      aria-label={`Rank ${user.rank}`}
                    >
                      {medals[user.rank - 1]}
                    </span>
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full text-base font-bold text-white shrink-0",
                        isFirst
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                          : "bg-surface-active",
                      )}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <p className="text-sm font-semibold text-text-primary leading-tight">
                      {user.name.split(" ")[0]}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        isFirst ? "text-yellow-400" : "text-primary",
                      )}
                    >
                      {formatNumber(user.xp)} XP
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        lvl.badge,
                      )}
                    >
                      Lv.{lvl.level} {lvl.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Full table */}
            <Card>
              <CardContent className="px-0 pb-0">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {ranked.map((user) => {
                      const lvl = getLevel(user.xp);
                      const isMe = user.id === currentUser.id;
                      return (
                        <tr
                          key={user.id}
                          className={cn(
                            "transition-colors",
                            isMe
                              ? "bg-primary/5 ring-1 ring-inset ring-primary/15"
                              : "hover:bg-surface",
                          )}
                        >
                          {/* Rank */}
                          <td className="px-4 py-3 w-10 text-center">
                            <span className="text-sm font-bold tabular-nums text-text-muted">
                              {user.rank <= 3 ? (
                                <span aria-label={`Rank ${user.rank}`}>
                                  {medals[user.rank - 1]}
                                </span>
                              ) : (
                                user.rank
                              )}
                            </span>
                          </td>

                          {/* User info */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-active text-sm font-bold text-text-primary">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="font-semibold text-text-primary text-sm">
                                    {user.name}
                                    {isMe && (
                                      <span className="ml-1 text-[10px] text-primary">
                                        (you)
                                      </span>
                                    )}
                                  </p>
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0",
                                      lvl.badge,
                                    )}
                                  >
                                    Lv.{lvl.level} {lvl.name}
                                  </span>
                                </div>
                                {user.headline && (
                                  <p className="text-xs text-text-muted truncate mt-0.5">
                                    {user.headline}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Streak */}
                          <td className="px-4 py-3 hidden sm:table-cell text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Flame className="h-3 w-3 text-orange-400 shrink-0" />
                              <span className="text-xs text-text-secondary tabular-nums">
                                {user.streak}d
                              </span>
                            </div>
                          </td>

                          {/* XP */}
                          <td className="px-4 py-3 text-right">
                            <p
                              className={cn(
                                "font-bold tabular-nums text-sm",
                                user.rank === 1
                                  ? "text-yellow-400"
                                  : "text-primary",
                              )}
                            >
                              {formatNumber(user.xp)}
                            </p>
                            <p className="text-[10px] text-text-muted">XP</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-4">
            {/* Level System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" /> Level System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pb-4">
                {LEVELS.map((lvl) => {
                  const myLvl = getLevel(currentUser.xp);
                  const isMine = myLvl.level === lvl.level;
                  return (
                    <div
                      key={lvl.level}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 transition-colors",
                        isMine && "bg-primary/8 ring-1 ring-primary/20",
                      )}
                    >
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full shrink-0",
                          lvl.dot,
                        )}
                      />
                      <span className="text-xs font-bold text-text-muted w-7 shrink-0">
                        Lv.{lvl.level}
                      </span>
                      <span
                        className={cn(
                          "text-xs flex-1 font-medium",
                          isMine ? "text-primary" : "text-text-primary",
                        )}
                      >
                        {lvl.name}
                      </span>
                      <span className="text-[10px] text-text-muted tabular-nums whitespace-nowrap">
                        {lvl.max === Infinity
                          ? `${formatNumber(lvl.min)}+ XP`
                          : `${formatNumber(lvl.min)}–${formatNumber(lvl.max)}`}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* XP Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span aria-hidden="true">⚡</span> XP Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pb-4">
                {XP_REWARDS.map(({ action, xp }) => (
                  <div
                    key={action}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-xs text-text-secondary">
                      {action}
                    </span>
                    <span className="text-xs font-bold text-primary shrink-0">
                      +{xp} XP
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
