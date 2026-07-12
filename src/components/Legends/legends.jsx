import "./legends.css";

import pawIconUrl from "../../assets/icons/paw.svg";
import deadIconUrl from "../../assets/icons/dead.svg";
import campsiteIconUrl from "../../assets/icons/tent.svg";
import filmIconUrl from "../../assets/icons/film.svg";
import helpIconUrl from "../../assets/icons/help.svg";

const markerTypes = [
  {
    label: "Animal",
    icon: pawIconUrl,
    className: "marker-type-icon-animal",
  },
  {
    label: "Carcass",
    icon: deadIconUrl,
    className: "marker-type-icon-carcass",
  },
  {
    label: "Campsite",
    icon: campsiteIconUrl,
    className: "marker-type-icon-campsite",
  },
  {
    label: "Film Crew",
    icon: filmIconUrl,
    className: "marker-type-icon-filmCrew",
  },
  {
    label: "SOS",
    icon: helpIconUrl,
    className: "marker-type-icon-sos",
  },
];

function Legend() {
  return (
    <div className="marker-types">
      {markerTypes.map((type) => (
        <div className="marker-type-item" key={type.label}>
          <span className={`marker-type-icon ${type.className}`}>
            <img src={type.icon} alt={type.label} />
          </span>

          <span>{type.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend;