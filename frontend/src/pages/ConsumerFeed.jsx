import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Input,
  Button,
  GhostButton,
  MediaCard,
} from "../components/UI.jsx";

export default function ConsumerFeed() {
  const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");

  const hasFilters = useMemo(
    () => q || location || people,
    [q, location, people]
  );

  async function loadFeed() {
    setLoading(true);
    try {
      const r = await fetch(`${api}/api/media?page=1&limit=30`);
      const data = await r.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function runSearch() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (location) params.set("location", location);
      if (people) params.set("people", people);

      const r = await fetch(`${api}/api/media/search?${params.toString()}`);
      const data = await r.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-white/60">
            Browse posts and search by text, location, or people.
          </p>
        </div>
        <GhostButton onClick={loadFeed} disabled={loading}>
          Refresh
        </GhostButton>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title/caption…"
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g., Manchester)"
          />
          <Input
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="People (e.g., Basil)"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={runSearch} disabled={loading}>
            {loading ? "Loading…" : "Search"}
          </Button>
          <GhostButton
            onClick={() => {
              setQ("");
              setLocation("");
              setPeople("");
              loadFeed();
            }}
            disabled={loading || !hasFilters}
          >
            Clear
          </GhostButton>
        </div>
      </Card>

      {items.length === 0 && !loading ? (
        <Card className="p-8 text-center">
          <div className="text-lg font-semibold">No posts yet</div>
          <p className="text-white/60 mt-1">
            Publish from Creator Studio to see it here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <MediaCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
