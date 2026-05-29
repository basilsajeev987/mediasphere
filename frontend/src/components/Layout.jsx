import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { GhostButton, Badge } from "./UI.jsx";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-white/15 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Layout({ children }) {
  const { user, isAuthed, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
            <div>
              <div className="text-base font-semibold leading-tight">
                MediaVault
              </div>
              <div className="text-xs text-white/60 -mt-0.5">Photo sharing</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <NavItem to="/">Explore</NavItem>
            <NavItem to="/creator/upload">Creator</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthed ? (
              <>
                <Badge>
                  {user?.displayName || "User"} · {user?.role}
                </Badge>
                <GhostButton
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                >
                  Logout
                </GhostButton>
              </>
            ) : (
              <>
                <NavItem to="/login">Login</NavItem>
                <NavItem to="/signup">Sign up</NavItem>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-white/10 py-8 mt-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-white/50 flex items-center justify-between">
          <span>© {new Date().getFullYear()} MediaVault</span>
          <span className="hidden sm:inline">
            Built with MERN + Azure Blob + Atlas
          </span>
        </div>
      </footer>
    </div>
  );
}
