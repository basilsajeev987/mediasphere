import { Link } from "react-router-dom";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold 
      bg-white text-slate-950 hover:bg-white/90 active:bg-white/80 transition disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold 
      bg-white/10 text-white hover:bg-white/15 active:bg-white/20 transition disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-white/40
      focus:outline-none focus:ring-2 focus:ring-cyan-400/40 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-white/40
      focus:outline-none focus:ring-2 focus:ring-cyan-400/40 ${className}`}
      {...props}
    />
  );
}

export function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

export function StarsText({ value = 0 }) {
  const v = Math.round(Number(value || 0) * 10) / 10;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <span>⭐</span>
      <span>{v.toFixed(1)}</span>
    </span>
  );
}

export function MediaCard({ post }) {
  const img =
    post.thumbnailViewUrl ||
    post.mediaViewUrl ||
    post.thumbnailUrl ||
    post.mediaUrl;

  return (
    <Link to={`/media/${post._id}`} className="block group">
      <Card className="overflow-hidden">
        <div className="aspect-[4/3] bg-black/30">
          <img
            src={img}
            alt={post.title}
            className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{post.title}</h3>
              <p className="text-sm text-white/60 line-clamp-2">
                {post.caption}
              </p>
            </div>
            <div className="text-right text-xs text-white/60">
              <div>⭐ {Number(post?.stats?.avgRating || 0).toFixed(1)}</div>
              <div>{post?.stats?.commentCount || 0} comments</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {post.location ? <Badge>📍 {post.location}</Badge> : null}
            {(post.peoplePresent || []).slice(0, 2).map((p) => (
              <Badge key={p}>👤 {p}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
