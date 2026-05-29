import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Input, Button } from "../components/UI.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const nav = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    const r = await fetch(`${api}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg(data.error || "Login failed");

    setAuth(data.token, data.user);
    nav("/");
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h1 className="text-xl font-bold">Login</h1>
        <p className="text-white/60 mt-1">Login to comment and rate.</p>

        <form className="mt-5 space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm text-white/70">Email</label>
            <Input
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-white/70">Password</label>
            <Input
              className="mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" type="submit">
            Login
          </Button>

          {msg ? <div className="text-sm text-red-300">{msg}</div> : null}

          <div className="text-sm text-white/60">
            No account?{" "}
            <Link className="text-cyan-300 hover:underline" to="/signup">
              Sign up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
