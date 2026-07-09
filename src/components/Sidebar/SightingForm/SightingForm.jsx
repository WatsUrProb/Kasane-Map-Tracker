import { useState } from "react";
import "./SightingForm.css";

function SightingForm({ selectedPosition, onAddSighting }) {
  const [formData, setFormData] = useState({
    category: "animal",
    animalType: "elephant",
    groupType: "single",
    count: 1,
    behaviour: "peaceful",
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onAddSighting(formData);
  }

  return (
    <form className="sighting-form" onSubmit={handleSubmit}>
      <h3>New Sighting</h3>

      {!selectedPosition ? (
        <p className="location-warning">Click on the map to choose a location.</p>
      ) : (
        <p className="location-success">
          Location selected: {selectedPosition.lat.toFixed(4)},{" "}
          {selectedPosition.lng.toFixed(4)}
        </p>
      )}

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="animal">Animal</option>
          <option value="carcass">Carcass Hotspot</option>
          <option value="campsite">Temporary Campsite</option>
          <option value="filmCrew">Film Crew Vehicle</option>
        </select>
      </label>

      {formData.category === "animal" && (
        <>
          <label>
            Animal Type
            <select
              name="animalType"
              value={formData.animalType}
              onChange={handleChange}
            >
              <option value="elephant">Elephant</option>
              <option value="lion">Lion</option>
              <option value="leopard">Leopard</option>
              <option value="buffalo">Buffalo</option>
              <option value="giraffe">Giraffe</option>
              <option value="zebra">Zebra</option>
              <option value="hyena">Hyena</option>
              <option value="wildDog">Wild Dog</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Single or Herd
            <select
              name="groupType"
              value={formData.groupType}
              onChange={handleChange}
            >
              <option value="single">Single</option>
              <option value="pair">Pair</option>
              <option value="herd">Herd</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>

          <label>
            Number of Animals
            <input
              type="number"
              name="count"
              min="1"
              value={formData.count}
              onChange={handleChange}
            />
          </label>

          <label>
            Behaviour
            <select
              name="behaviour"
              value={formData.behaviour}
              onChange={handleChange}
            >
              <option value="peaceful">Peaceful</option>
              <option value="aggressive">Aggressive</option>
              <option value="moving">Moving</option>
              <option value="feeding">Feeding</option>
              <option value="resting">Resting</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
        </>
      )}

      <label>
        Description
        <textarea
          name="description"
          placeholder="Example: elephant herd moving near river trail..."
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="submit-sighting-button">
        Add to Map
      </button>
    </form>
  );
}

export default SightingForm;