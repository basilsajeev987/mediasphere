import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button, Input, StarsText, Badge } from "../components/UI.jsx";
import StarRating from "../components/StarRating.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function MediaView() {
  const { id } = useParams();
  const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const { token, isAuthed } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [p, c, r] = await Promise.all([
      fetch(`${api}/api/media/${id}`).then((x) => x.json()),
      fetch(`${api}/api/media/${id}/comments`).then((x) => x.json()),
      fetch(`${api}/api/media/${id}/ratings`).then((x) => x.json()),
    ]);

    setPost(p);
    setComments(c.items || []);
    setRatings(r.items || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function addComment() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${api}/api/media/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to comment");
      }

      setText("");
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitRating() {
    if (rating < 1) return;
    setBusy(true);
    try {
      const res = await fetch(`${api}/api/media/${id}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: rating }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to rate");
      }

      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!post) {
    return (
      <Card className="p-8 text-center">
        <div className="text-lg font-semibold">Loading…</div>
      </Card>
    );
  }

  const img =
    post.thumbnailViewUrl ||
    post.mediaViewUrl ||
    post.thumbnailUrl ||
    post.mediaUrl;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="overflow-hidden lg:col-span-3">
        <div className="bg-black/30">
          <img
            src={img}
            alt={post.title}
            className="w-full max-h-[520px] object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{post.title}</h1>
              <p className="text-white/70 mt-1">{post.caption}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {post.location ? <Badge>📍 {post.location}</Badge> : null}
                {(post.peoplePresent || []).map((p) => (
                  <Badge key={p}>👤 {p}</Badge>
                ))}
              </div>
            </div>

            <div className="text-right">
              <StarsText value={post?.stats?.avgRating || 0} />
              <div className="text-xs text-white/50 mt-1">
                {post?.stats?.ratingCount || 0} ratings ·{" "}
                {post?.stats?.commentCount || 0} comments
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-5">
        <Card className="p-5">
          <div className="font-semibold">Rate this</div>
          <div className="text-sm text-white/60 mt-1">
            Click stars and submit
          </div>

          <div className="mt-3">
            <StarRating
              value={rating}
              onChange={setRating}
              disabled={busy || !isAuthed}
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              onClick={submitRating}
              disabled={busy || !isAuthed || rating < 1}
            >
              Submit Rating
            </Button>
            {!isAuthed ? (
              <div className="text-xs text-white/50">
                <Link className="text-cyan-300 hover:underline" to="/login">
                  Login
                </Link>{" "}
                to rate.
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-semibold">Comments</div>

          <div className="mt-3 flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isAuthed ? "Write a comment…" : "Login to comment"}
              disabled={!isAuthed}
            />
            <Button
              onClick={addComment}
              disabled={busy || !isAuthed || !text.trim()}
            >
              Post
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <div className="text-sm text-white/60">No comments yet.</div>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="text-xs text-white/50">
                    {c.userDisplayName} ·{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-1 text-sm">{c.text}</div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-semibold">Who rated</div>
          <div className="text-sm text-white/60 mt-1">Recent ratings</div>

          <div className="mt-3 space-y-2">
            {ratings.length === 0 ? (
              <div className="text-sm text-white/60">No ratings yet.</div>
            ) : (
              ratings.slice(0, 20).map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div className="text-sm">{r.userDisplayName}</div>
                  <div className="text-sm text-white/70">⭐ {r.value}</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
