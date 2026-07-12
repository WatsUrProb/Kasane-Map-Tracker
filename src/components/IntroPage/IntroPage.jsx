import MatrixButton from "./MatrixButton/MatrixButton";
import "./IntroPage.css";

function IntroPage({ onEnter }) {
  return (
    <div className="intro-page matrix-bg">
      <div className="matrix-rain"></div>

      <div className="intro-matrix-container">
        <p className="intro-label">Live Safari Field System</p>

        <h1 className="matrix-text" data-text="Safari Map Tracker">
          Safari Map Tracker
        </h1>

        <p className="intro-description">
          Real-time wildlife sightings, SOS alerts, verified reports, and
          field activity tracking around Kasane.
        </p>

        <div className="intro-features">
          <span>Live sightings</span>
          <span>SOS alerts</span>
          <span>Verified reports</span>
          <span>Map tracking</span>
        </div>

        <MatrixButton onClick={onEnter}>Enter Map</MatrixButton>
      </div>
    </div>
  );
}

export default IntroPage;
