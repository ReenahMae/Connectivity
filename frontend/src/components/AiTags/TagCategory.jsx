import React from "react";
import TagBadge from "./TagBadge";

export default function TagCategory({ title, icon, tags }) {
  return (
    <div className="category-box">
      <div className="category-header">
        <span>{icon}</span> {title}
      </div>

      <div>
        {tags.map((tag, i) => (
          <TagBadge key={i} {...tag} />
        ))}
      </div>
    </div>
  );
}
