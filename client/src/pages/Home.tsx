import React, { ReactElement } from 'react';

//@ts-ignore
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import Button from '../components/Button';
import HUD from '../components/HUD';

import { get } from '../utils/requests';
import { useAuth } from '../context/AuthContext';

import Dropdown from '../components/Dropdown';
import Loading from '../components/Loading';

mapboxgl.accessToken =
  'pk.eyJ1IjoibmlzaGlrYTI1IiwiYSI6ImNrb2R4ODlvcjA1cWEyd3A1eWFqZThsZGMifQ.hk-3XzdHKUYiV5p1SIi_mQ';

export default function Home(): ReactElement {
  const map = React.useRef<any>(null);

  const [selected, setSelected] = React.useState<any>(null);

  const [options, setOptions] = React.useState<any>([
    {
      value: '',
      label: '',
    },
  ]);

  const auth = useAuth();

  const pinElement = React.useRef(document.createElement('i')).current;
  pinElement.className = 'fas fa-map-marker-alt map-marker';
  pinElement.style.fontSize = 20 + 'px';

  React.useEffect(() => {
    if (!selected) return;
    pinElement.style.color = selected.color;
  }, [selected]);

  React.useEffect(() => {
    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/nishika25/ckoh3qfgz2iy517mh3z5atu07',
      // zoom: 10,
    });

    //@ts-ignore
    map.current.on('load', () => {
      new mapboxgl.Marker(pinElement)
        .setLngLat([78.486671, 17.385044])
        .addTo(map.current);

      map.current.flyTo({
        center: [78.486671, 17.385044],
        essential: true,
        zoom: 6,
      });
    });

    map.current.setMaxZoom(3);

    get('/regions').then((data) => {
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
              color: JSON.parse(option.colorData).color,
              pin: JSON.parse(option.colorData).pin,
              button: JSON.parse(option.colorData).button,
            });
          }

          return {
            value: option._id,
            label: option.name,
            description: option.description,
            color: JSON.parse(option.colorData).color,
            pin: JSON.parse(option.colorData).pin,
            button: JSON.parse(option.colorData).button,
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
        <Dropdown setter={setSelected} defaultIndex={0} options={options} />
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
