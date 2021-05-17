import React, { ReactElement } from "react";

//@ts-ignore
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

export default function Home(): ReactElement {
  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }, []);

  return (
    <div className="home" id="map">
      HOME
    </div>
  );
}
