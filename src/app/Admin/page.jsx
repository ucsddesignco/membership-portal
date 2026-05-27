"use client";

import { useState } from "react";

const initialUsers = [
  { id: 1, name: "XXXXX XXXXX", email: "xxxxx@ucsd.edu", role: "Member", joined: "XXXX-XX-XX", status: "active" },
  { id: 2, name: "XXXXX XXXXX", email: "xxxxx@ucsd.edu", role: "Officer", joined: "XXXX-XX-XX", status: "active" },
  { id: 3, name: "XXXXX XXXXX", email: "xxxxx@ucsd.edu", role: "Member", joined: "XXXX-XX-XX", status: "inactive" },
  { id: 4, name: "XXXXX XXXXX", email: "xxxxx@ucsd.edu", role: "Member", joined: "XXXX-XX-XX", status: "active" },
  { id: 5, name: "XXXXX XXXXX", email: "xxxxx@ucsd.edu", role: "Officer", joined: "XXXX-XX-XX", status: "active" },
];

const initialPending = [
  { id: 101, email: "applicant_xx@ucsd.edu", requested: "XX days ago" },
  { id: 102, email: "applicant_xx@ucsd.edu", requested: "XX days ago" },
  { id: 103, email: "applicant_xx@ucsd.edu", requested: "XX days ago" },
];

const initialEvents = [
  { id: 1, title: "XXXXX XXXXX", date: "XXX XX, XXXX", attendees: "XX" },
  { id: 2, title: "XXXXX XXXXX", date: "XXX XX, XXXX", attendees: "XX" },
  { id: 3, title: "XXXXX XXXXX", date: "XXX XX, XXXX", attendees: "XX" },
];

const stats = [
  { label: "total members", value: "XXX" },
  { label: "active this month", value: "XXX" },
  { label: "pending approvals", value: "XX" },
  { label: "upcoming events", value: "XX" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  // Members state
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Member", status: "active" });

  // Pending state
  const [pending, setPending] = useState(initialPending);

  // Events state
  const [events, setEvents] = useState(initialEvents);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", attendees: "0" });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Member actions
  const removeUser = (id) => setUsers(users.filter((u) => u.id !== id));
  const saveEditUser = () => {
    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };
  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { ...newUser, id: Date.now(), joined: new Date().toISOString().slice(0, 10) }]);
    setNewUser({ name: "", email: "", role: "Member", status: "active" });
    setShowAddUser(false);
  };

  // Pending actions
  const approvePending = (id) => setPending(pending.filter((p) => p.id !== id));
  const denyPending = (id) => setPending(pending.filter((p) => p.id !== id));

  // Event actions
  const removeEvent = (id) => setEvents(events.filter((e) => e.id !== id));
  const saveEditEvent = () => {
    setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)));
    setEditingEvent(null);
  };
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setNewEvent({ title: "", date: "", attendees: "0" });
    setShowAddEvent(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300 }}>

      {/* Top Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", borderBottom: "1px solid #1f1f1f" }}>
        <span style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" }}>
          Design Co — Admin
        </span>
        <button style={outlineBtn}>log out</button>
      </nav>

      <div style={{ display: "flex", minHeight: "calc(100vh - 73px)" }}>

        {/* Sidebar */}
        <aside style={{ width: 200, borderRight: "1px solid #1f1f1f", padding: "40px 0", flexShrink: 0 }}>
          {["overview", "members", "events"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              display: "block", width: "100%", padding: "12px 32px", background: "none", border: "none",
              textAlign: "left", color: activeTab === tab ? "#f0f0f0" : "#555", fontSize: 13,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
              borderLeft: activeTab === tab ? "1px solid #f0f0f0" : "1px solid transparent", transition: "color 0.2s",
            }}>
              {tab}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "48px 56px" }}>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 300, marginBottom: 48, letterSpacing: "-0.02em" }}>overview</h1>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#1f1f1f" }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ background: "#0f0f0f", padding: "32px 28px" }}>
                    <div style={{ fontSize: 36, fontWeight: 300, marginBottom: 8 }}>{s.value}</div>
                    <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 56 }}>
                <h2 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: 24 }}>
                  pending approvals ({pending.length})
                </h2>
                {pending.length === 0 && (
                  <div style={{ fontSize: 13, color: "#444", padding: "16px 0" }}>no pending approvals</div>
                )}
                {pending.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #1a1a1a" }}>
                    <div>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>{p.email}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>requested {p.requested}</div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button style={solidBtn} onClick={() => approvePending(p.id)}>approve</button>
                      <button style={outlineBtn} onClick={() => denyPending(p.id)}>deny</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === "members" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em" }}>members</h1>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    placeholder="search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ background: "#1a1a1a", border: "none", borderBottom: "1px solid #333", color: "#f0f0f0", padding: "8px 16px", fontSize: 13, width: 220, outline: "none", fontFamily: "inherit", fontWeight: 300 }}
                  />
                  <button style={solidBtn} onClick={() => setShowAddUser(true)}>+ add member</button>
                </div>
              </div>

              {/* Add Member Form */}
              {showAddUser && (
                <div style={{ background: "#181818", border: "1px solid #2a2a2a", padding: "24px", marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
                  {[
                    { placeholder: "name", key: "name" },
                    { placeholder: "email", key: "email" },
                  ].map(({ placeholder, key }) => (
                    <input key={key} placeholder={placeholder} value={newUser[key]}
                      onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                      style={{ ...inputStyle }} />
                  ))}
                  <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={inputStyle}>
                    <option>Member</option>
                    <option>Officer</option>
                  </select>
                  <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })} style={inputStyle}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={solidBtn} onClick={addUser}>save</button>
                    <button style={outlineBtn} onClick={() => setShowAddUser(false)}>cancel</button>
                  </div>
                </div>
              )}

              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px", borderBottom: "1px solid #1f1f1f", paddingBottom: 12, marginBottom: 4 }}>
                {["name", "email", "role", "status", ""].map((h) => (
                  <div key={h} style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444" }}>{h}</div>
                ))}
              </div>

              {filtered.map((user) => (
                <div key={user.id}>
                  {editingUser?.id === user.id ? (
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px", padding: "12px 0", borderBottom: "1px solid #1f1f1f", alignItems: "center", gap: 8 }}>
                      <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} style={inputStyle} />
                      <input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} style={inputStyle} />
                      <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} style={inputStyle}>
                        <option>Member</option>
                        <option>Officer</option>
                      </select>
                      <select value={editingUser.status} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })} style={inputStyle}>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ ...solidBtn, padding: "6px 12px" }} onClick={saveEditUser}>save</button>
                        <button style={{ ...outlineBtn, padding: "6px 12px" }} onClick={() => setEditingUser(null)}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px", padding: "16px 0", borderBottom: "1px solid #141414", alignItems: "center" }}>
                      <div style={{ fontSize: 14 }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>{user.email}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{user.role}</div>
                      <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: user.status === "active" ? "#6ee7b7" : "#555" }}>{user.status}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ ...outlineBtn, padding: "6px 12px", fontSize: 11 }} onClick={() => setEditingUser(user)}>edit</button>
                        <button style={{ ...outlineBtn, padding: "6px 12px", fontSize: 11, color: "#e05a5a", borderColor: "#3a1a1a" }} onClick={() => removeUser(user.id)}>remove</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em" }}>events</h1>
                <button style={solidBtn} onClick={() => setShowAddEvent(true)}>+ new event</button>
              </div>

              {/* Add Event Form */}
              {showAddEvent && (
                <div style={{ background: "#181818", border: "1px solid #2a2a2a", padding: "24px", marginBottom: 32, display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
                  <input placeholder="event title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} style={inputStyle} />
                  <input placeholder="date (e.g. Jun 3, 2026)" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} style={inputStyle} />
                  <input placeholder="expected rsvps" value={newEvent.attendees} onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })} style={inputStyle} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={solidBtn} onClick={addEvent}>save</button>
                    <button style={outlineBtn} onClick={() => setShowAddEvent(false)}>cancel</button>
                  </div>
                </div>
              )}

              {events.map((event) => (
                <div key={event.id}>
                  {editingEvent?.id === event.id ? (
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, padding: "16px 0", borderBottom: "1px solid #1a1a1a", alignItems: "center" }}>
                      <input value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} style={inputStyle} />
                      <input value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} style={inputStyle} />
                      <input value={editingEvent.attendees} onChange={(e) => setEditingEvent({ ...editingEvent, attendees: e.target.value })} style={inputStyle} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={solidBtn} onClick={saveEditEvent}>save</button>
                        <button style={outlineBtn} onClick={() => setEditingEvent(null)}>cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: "1px solid #1a1a1a" }}>
                      <div>
                        <div style={{ fontSize: 16, marginBottom: 6, fontWeight: 300 }}>{event.title}</div>
                        <div style={{ fontSize: 12, color: "#555", letterSpacing: "0.06em" }}>{event.date}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <div style={{ fontSize: 12, color: "#555" }}>{event.attendees} rsvps</div>
                        <button style={solidBtn} onClick={() => setEditingEvent(event)}>edit</button>
                        <button style={{ ...outlineBtn, color: "#e05a5a", borderColor: "#3a1a1a" }} onClick={() => removeEvent(event.id)}>delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const solidBtn = {
  background: "#f0f0f0", border: "none", color: "#0f0f0f",
  padding: "8px 18px", fontSize: 12, letterSpacing: "0.06em",
  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 400,
};

const outlineBtn = {
  background: "none", border: "1px solid #333", color: "#888",
  padding: "8px 18px", fontSize: 12, letterSpacing: "0.06em",
  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 300,
};

const inputStyle = {
  background: "#111", border: "none", borderBottom: "1px solid #333",
  color: "#f0f0f0", padding: "8px 12px", fontSize: 13,
  outline: "none", fontFamily: "inherit", fontWeight: 300, width: "100%",
};