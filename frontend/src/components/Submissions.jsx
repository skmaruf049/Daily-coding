import { useEffect, useState } from "react";
import api from "../api";

export default function Submissions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    const res = await api.get("/submissions");
    setSubs(res.data);
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>🧑‍💻 Submissions</h2>

      <table style={{ width: "100%", background: "#0f172a" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s, i) => (
            <tr key={i}>
              <td>{s.user_name}</td>
              <td>{s.problem_title}</td>
              <td>{s.status}</td>
              <td>{s.language}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
