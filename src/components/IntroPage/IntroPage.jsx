import "./IntroPage.css";

function IntroPage({ onEnter }) {
  return (
    <div className="intro-page">
      <div className="intro-overlay">
        <div className="intro-card">
          <p className="intro-label">Kasane Wildlife Field Tool</p>

          <h1>Safari Map Tracker</h1>

          <p className="intro-description">
            A simple Project to replicate a map that shows users surrounding activities in Kasane Game Park!
          </p>

          <div className="intro-features">
            <span>🐘 Animal sightings</span>
            <span>🚨 SOS alerts</span>
            <span>☠️ Carcass hotspots</span>
            <span>⛺ Temporary campsites</span>
            <span>🛰️ Satellite / hybrid map</span>
          </div>

          <button className="intro-enter-button" onClick={onEnter}>
            Enter Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;