import "./MatrixButton.css";

function MatrixButton({ children, onClick }) {
  return (
    <button className="matrix-button" onClick={onClick}>
      <span className="matrix-button-text">{children}</span>
      <div className="matrix-code-rain"></div>
    </button>
  );
}

export default MatrixButton;