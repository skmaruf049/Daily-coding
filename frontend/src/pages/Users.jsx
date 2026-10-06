import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { PageHeader, SearchInput, EmptyState, SkeletonRows, Avatar, TableCard, tableStyles } from "../AdminPannel/ui";
import { color, font } from "../AdminPannel/theme";

export default function Users() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("USERS ERROR:", err);
      setError("Couldn't load users.");
    }
  };

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={users ? `${users.length} registered` : "Loading…"}
      >
        <SearchInput value={query} onChange={setQuery} placeholder="Search name or email" />
      </PageHeader>

      <TableCard>
        {error && <EmptyState title="Something went wrong" hint={error} />}

        {!error && users === null && <SkeletonRows rows={6} />}

        {!error && users && filtered.length === 0 && (
          <EmptyState
            title={query ? "No matches" : "No users yet"}
            hint={query ? "Try a different search." : "Registered users will appear here."}
          />
        )}

        {!error && users && filtered.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>User</th>
                  <th style={tableStyles.th}>Email</th>
                  <th style={tableStyles.th}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td style={tableStyles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={u.name} />
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tableStyles.td, color: color.textSecondary }}>{u.email}</td>
                    <td style={{ ...tableStyles.td, color: color.textSecondary, fontFamily: font.mono, fontSize: 13 }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
}
