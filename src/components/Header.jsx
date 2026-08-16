import { useState } from "react";
import asset from "../utils/asset";

const sectionLinks = [
  { label: "首页", id: "home" },
  { label: "教育", id: "education" },
  { label: "实习", id: "experience" },
  { label: "项目", id: "projects" },
  { label: "尾页", id: "contact" },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const targetTop = id === "home"
      ? 0
      : window.scrollY + el.getBoundingClientRect().top;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSectionClick = (id) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <span className="header-logo-placeholder" aria-hidden="true" />

        <nav className={`header-nav${menuOpen ? " header-nav--open" : ""}`}>
          <ul className="header-nav-list">
            {sectionLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleSectionClick(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-resume-wrap">
          <a
            href={asset("files/Neil-Shi-Resume.pdf")}
            className="header-resume-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            下载简历
          </a>
        </div>

        <button
          type="button"
          className="header-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`header-menu-icon${menuOpen ? " open" : ""}`} />
        </button>
      </div>
    </header>
  );
}
