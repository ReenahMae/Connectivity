import React, { useState } from "react";
import "./AiTags.css";
import TagFilters from "./TagFilters";
import TagCategory from "./TagCategory";
import { tagCategories } from "./data";

const AiTagsPage = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="aitags-container">

      {/* HEADER */}
      <div className="aitags-header">
        <h1>✨ AI Tags</h1>
        <p>Smart tags automatically generated from your notes</p>
      </div>

      {/* SEARCH */}
      <div className="search-bar-wrapper">
        <input className="search-input" placeholder="Search tags..." />
      </div>

      {/* FILTER BUTTONS */}
      <TagFilters selected={filter} onSelect={setFilter} />

      {/* CATEGORIES */}
      {tagCategories
        .filter((c) => c.show.includes(filter))
        .map((cat, i) => (
          <TagCategory key={i} {...cat} />
        ))}

      {/* FOOTER */}
      <div className="tags-footer">
        <div>
          <div className="footer-number">12</div>
          <div className="footer-label">Total Tags</div>
        </div>
        <div>
          <div className="footer-number">5</div>
          <div className="footer-label">Subjects</div>
        </div>
        <div>
          <div className="footer-number">94</div>
          <div className="footer-label">Tagged Notes</div>
        </div>
        <div>
          <div className="footer-number">94%</div>
          <div className="footer-label">Auto-Tagged</div>
        </div>
      </div>
    </div>
  );
};

export default AiTagsPage;
