import React, { ReactElement } from "react";

//@ts-ignore
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import Button from "../components/Button";
import HUD from "../components/HUD";
import { Link } from "react-router-dom";

import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

mapboxgl.accessToken =
  "pk.eyJ1IjoibmlzaGlrYTI1IiwiYSI6ImNrb2R4ODlvcjA1cWEyd3A1eWFqZThsZGMifQ.hk-3XzdHKUYiV5p1SIi_mQ";

export default function Home(): ReactElement {
  const map = React.useRef<any>(null);

  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    map.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/nishika25/ckoh3qfgz2iy517mh3z5atu07",
    });

    map.current.setMaxZoom(3);

    // map.current.style.stylesheet.layers.forEach(function (layer: any) {
    //   if (layer.type === "symbol") {
    //     map.current.removeLayer(layer.id);
    //   }
    // });
  }, []);

  return (
    <div className="home">
      <h1>Hawkeye</h1>
      <h2>Select Your Region</h2>
      <HUD />
      <main>
        <Select
          className="react-select"
          value={selected}
          // onChange={this.handleChange}
          options={options}
        />
        <i className="fas fa-map-marker-alt"></i>
        <p>
          Gather people of your country to fight back the politicians and
          corruption..
        </p>
        <Button
          pathname={`/question/${"6096ec69f165570143f6d968"}`}
          state={{ allow: true }}
          link
          name="Start"
        />
      </main>
      <div id="map"></div>
    </div>
  );
}
