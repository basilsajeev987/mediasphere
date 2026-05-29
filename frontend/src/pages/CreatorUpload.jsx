import { useState } from "react";
import { Card, Input, Textarea, Button, Badge } from "../components/UI.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function CreatorUpload() {
  const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const { token, user, isAuthed } = useAuth();

  const isCreator = isAuthed && user?.role === "creator";

  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState(null);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");

  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");

  async function publish() {
    try {
      if (!isCreator) throw new Error("Creator access required.");
      if (!file) throw new Error("Please select an image.");
      if (!title.trim()) throw new Error("Title is required.");

      setStatus("Requesting upload URL…");
      setProgress(10);

      const initRes = await fetch(`${api}/api/creator/uploads/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      const initData = await initRes.json().catch(() => ({}));
      if (!initRes.ok)
        throw new Error(initData?.error || "Failed to init upload");

      const { uploadUrl, blobUrl } = initData;

      setStatus("Uploading to Azure Blob…");
      setProgress(45);

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!putRes.ok) {
        const t = await putRes.text().catch(() => "");
        throw new Error(
          `Blob upload failed (${putRes.status}) ${t}`.slice(0, 160)
        );
      }

      setStatus("Saving post metadata…");
      setProgress(80);

      const peoplePresent = people
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const metaRes = await fetch(`${api}/api/creator/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaType,
          mediaUrl: blobUrl,
          title,
          caption,
          location,
          peoplePresent,
        }),
      });

      const metaData = await metaRes.json().catch(() => ({}));
      if (!metaRes.ok)
        throw new Error(metaData?.error || "Failed to create post");

      setProgress(100);
      setStatus("✅ Published! Go to Explore to view it.");

      setFile(null);
      setTitle("");
      setCaption("");
      setLocation("");
      setPeople("");
      setPreviewUrl("");
    } catch (e) {
      setProgress(0);
      setStatus("❌ " + e.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Creator Studio</h1>
        <p className="text-white/60">
          Creators can upload images to Azure Blob and publish posts.
        </p>
      </div>

      {!isAuthed ? (
        <Card className="p-6">
          <div className="text-lg font-semibold">Login required</div>
          <p className="text-white/60 mt-1">
            <Link className="text-cyan-300 hover:underline" to="/login">
              Login
            </Link>{" "}
            first.
          </p>
        </Card>
      ) : !isCreator ? (
        <Card className="p-6">
          <div className="text-lg font-semibold">Creator role required</div>
          <p className="text-white/60 mt-1">
            Your account role is <b>{user?.role}</b>. For coursework, set your
            role to <b>creator</b> in MongoDB Atlas.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="p-5 lg:col-span-3 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Creator</Badge>
              <Badge>Azure Blob Upload</Badge>
              <Badge>Private container + Read SAS</Badge>
            </div>

            <div>
              <label className="text-sm text-white/70">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              >
                <option value="image">Image</option>
                <option value="video">Video (later)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-white/70">Select Image</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-white/70
                         file:mr-4 file:rounded-xl file:border-0
                         file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950
                         hover:file:bg-white/90"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setFile(f || null);
                  setPreviewUrl(f ? URL.createObjectURL(f) : "");
                }}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Title</label>
              <Input
                className="mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Caption</label>
              <Textarea
                className="mt-1"
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-white/70">Location</label>
                <Input
                  className="mt-1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-white/70">
                  People (comma-separated)
                </label>
                <Input
                  className="mt-1"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={publish} disabled={!file || !title.trim()}>
              Upload & Publish
            </Button>

            {progress > 0 ? (
              <div className="w-full rounded-xl bg-white/10 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : null}

            {status ? (
              <div className="text-sm text-white/80">{status}</div>
            ) : null}
          </Card>

          <Card className="overflow-hidden lg:col-span-2">
            <div className="p-5 border-b border-white/10">
              <div className="font-semibold">Preview</div>
              <div className="text-sm text-white/60">
                Local preview before upload
              </div>
            </div>
            <div className="aspect-[4/3] bg-black/30">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/50 text-sm">
                  Select an image to preview
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
