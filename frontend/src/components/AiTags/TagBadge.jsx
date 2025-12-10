export default function TagBadge({ label, count, color }) {
  return (
    <span
      className="tag-pill"
      style={{
        backgroundColor: `${color}20`,
        borderColor: `${color}60`,
        color: color,
      }}
    >
      🏷 {label} ({count})
    </span>
  );
}
