import "./CloseButton.css";

function CloseButton({ onClick, ariaLabel = "Close" }) {
  return (
    <button
      type="button"
      className="animated-close-button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="close-line left">
        <span className="circle-left"></span>
        <span className="circle-right"></span>
      </span>

      <span className="close-line right">
        <span className="circle-left"></span>
        <span className="circle-right"></span>
      </span>
    </button>
  );
}

export default CloseButton;