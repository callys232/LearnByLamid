"use client";

import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Header, AccessDenied } from "@/components/layout";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";
import { mockUsers, currentUser } from "@/mock/users";
import { relativeTime } from "@/lib/utils";

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function AdminUsersPage() {
  if (!["admin", "super_admin"].includes(currentUser.role)) {
    return <AccessDenied requiredRole="admin" />;
  }
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((user) => {
      const matchesFilter =
        filter === "all" ? true : user.verificationStatus === filter;
      const matchesSearch =
        q === "" ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, users]);

  const counts = useMemo(
    () => ({
      all: users.length,
      pending: users.filter((u) => u.verificationStatus === "pending").length,
      approved: users.filter((u) => u.verificationStatus === "approved").length,
      rejected: users.filter((u) => u.verificationStatus === "rejected").length,
    }),
    [users],
  );

  function approveUser(userId: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, verificationStatus: "approved" } : user,
      ),
    );
  }

  function rejectUser(userId: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, verificationStatus: "rejected" } : user,
      ),
    );
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div>
      <Header
        title="User Management"
        subtitle={`${users.length} users · LAMID tenant`}
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search users..."
            leftIcon={<Search className="h-4 w-4" />}
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="primary" size="md" className="shrink-0">
            <UserPlus className="h-4 w-4" /> Invite user
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                filter === key
                  ? "border-primary text-text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  filter === key
                    ? "bg-primary/20 text-primary"
                    : "bg-surface text-text-muted"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="px-0 pb-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs font-medium text-text-muted">
                    User
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-text-muted">
                    Role
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-text-muted hidden sm:table-cell">
                    XP
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-text-muted hidden md:table-cell">
                    Streak
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-text-muted hidden lg:table-cell">
                    Last Active
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-text-muted"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary shrink-0">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {user.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              user.role === "super_admin"
                                ? "danger"
                                : user.role === "admin"
                                  ? "primary"
                                  : user.role === "instructor"
                                    ? "warning"
                                    : "default"
                            }
                          >
                            {user.role.replace("_", " ")}
                          </Badge>
                          {user.verificationStatus && (
                            <Badge
                              variant={
                                user.verificationStatus === "approved"
                                  ? "success"
                                  : user.verificationStatus === "pending"
                                    ? "warning"
                                    : "danger"
                              }
                            >
                              {user.verificationStatus}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell text-text-secondary">
                        {user.xp.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-xs text-orange-400">
                          {user.streak}d
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-xs text-text-muted">
                        {relativeTime(user.lastActiveAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.verificationStatus === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => approveUser(user.id)}
                                className="rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectUser(user.id)}
                                className="rounded-md border border-red-900/40 px-2.5 py-1 text-xs text-red-400 hover:bg-red-900/20 transition-all"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                            >
                              Edit role
                            </button>
                          )}
                          <button
                            type="button"
                            className="rounded-md border border-red-900/40 px-2.5 py-1 text-xs text-red-400 hover:bg-red-900/20 transition-all"
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
