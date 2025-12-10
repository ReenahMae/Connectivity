import React from "react";

export default function TagFilters({ selected, onSelect }) {
  const filters = ["All", "Subjects", "Topics", "Priority", "Status"];

  return (
    <div className="filter-buttons">
      {filters.map((f) => (
        <button
          key={f}
          className={`filter-btn ${selected === f ? "active" : ""}`}
          onClick={() => onSelect(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
