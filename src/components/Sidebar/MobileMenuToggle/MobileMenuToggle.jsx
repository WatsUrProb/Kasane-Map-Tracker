import "./MobileMenuToggle.css";

function MobileMenuToggle({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      className={`mobile-menu-toggle ${isOpen ? "open" : ""}`}
      onClick={onToggle}
      aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
      aria-expanded={isOpen}
    >
      <span className="mobile-menu-line line-one"></span>
      <span className="mobile-menu-line line-two"></span>
      <span className="mobile-menu-line line-three"></span>
    </button>
  );
}

export default MobileMenuToggle;