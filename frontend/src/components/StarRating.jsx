import { useMemo, useState } from "react";

function Star({ filled, disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`text-2xl leading-none transition transform hover:scale-105 focus:outline-none 
      focus:ring-2 focus:ring-cyan-400/40 rounded ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
      {...props}
    >
      <span className={filled ? "text-yellow-300" : "text-white/25"}>★</span>
    </button>
  );
}

export default function StarRating({
  value = 0,
  onChange,
  disabled = false,
  label = "Your rating",
}) {
  const [hover, setHover] = useState(0);
  const shown = useMemo(() => (hover > 0 ? hover : value), [hover, value]);

  function set(v) {
    if (disabled) return;
    onChange?.(v);
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-white/70">{label}</div>

      <div className="inline-flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            filled={i <= shown}
            disabled={disabled}
            onMouseEnter={() => !disabled && setHover(i)}
            onMouseLeave={() => !disabled && setHover(0)}
            onClick={() => set(i)}
            aria-label={`Rate ${i} star`}
          />
        ))}
        <span className="ml-2 text-sm text-white/60">
          {value ? `${value}/5` : "—"}
        </span>
      </div>
    </div>
  );
}
