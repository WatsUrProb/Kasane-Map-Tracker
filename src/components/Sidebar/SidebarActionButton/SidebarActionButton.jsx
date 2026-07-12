import "./SidebarActionButton.css";

function SidebarActionButton({
  children,
  onClick,
  isActive,
  variant = "default",
}) {
  return (
    <button
      className={`sidebar-action-button sidebar-action-button-${variant} ${
        isActive ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}

export default SidebarActionButton;
