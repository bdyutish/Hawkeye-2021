import React, { ReactElement } from "react";

//@ts-ignore
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import Button from "../components/Button";
import HUD from "../components/HUD";
import { Link } from "react-router-dom";

import Select from "react-select";
import { get } from "../utils/requests";
import { useAuth } from "../context/AuthContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmlzaGlrYTI1IiwiYSI6ImNrb2R4ODlvcjA1cWEyd3A1eWFqZThsZGMifQ.hk-3XzdHKUYiV5p1SIi_mQ";

export default function Home(): ReactElement {
  const map = React.useRef<any>(null);

  const [selected, setSelected] = React.useState<any>(null);

  const [options, setOptions] = React.useState<any>([]);

  const auth = useAuth();

  React.useEffect(() => {
    map.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/nishika25/ckoh3qfgz2iy517mh3z5atu07",
    });

    map.current.setMaxZoom(3);

    get("/regions").then((data) => {
      setOptions(
        data.map((option: any) => {
          if (
            option._id ===
            auth?.user?.regions[auth?.user?.lastUnlockedIndex].regionid
          ) {
            setSelected({
              value: option._id,
              label: option.name,
              description: option.description,
            });
          }

          return {
            value: option._id,
            label: option.name,
            description: option.description,
          };
        })
      );
    });
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
          onChange={(option) => setSelected(option)}
          options={options}
          isSearchable={false}
          // isRtl={true}
        />
        <i className="fas fa-map-marker-alt"></i>
        <p>{selected?.description}</p>
        <Button
          pathname={`/question/${selected?.value}`}
          state={{ allow: true }}
          link
          name="Start"
        />
      </main>
      <div id="map"></div>
    </div>
  );
}
