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
    {
      value: '',
      label: '',
    },
    {
      value: '',
      label: '',
    },
    {
      value: '',
      label: '',
    },
    {
      value: '',
      label: '',
    },
    {
      value: '',
      label: '',
    },
  ]);

  const auth = useAuth();

  const pinElement1 = React.useRef(document.createElement('i')).current;
  pinElement1.className = 'fas fa-map-marker-alt map-marker';
  pinElement1.style.fontSize = 20 + 'px';

  const pinElement2 = React.useRef(document.createElement('i')).current;
  pinElement2.className = 'fas fa-map-marker-alt map-marker';
  pinElement2.style.fontSize = 20 + 'px';

  const pinElement3 = React.useRef(document.createElement('i')).current;
  pinElement3.className = 'fas fa-map-marker-alt map-marker';
  pinElement3.style.fontSize = 20 + 'px';

  const pinElement4 = React.useRef(document.createElement('i')).current;
  pinElement4.className = 'fas fa-map-marker-alt map-marker';
  pinElement4.style.fontSize = 20 + 'px';

  const pinElement5 = React.useRef(document.createElement('i')).current;
  pinElement5.className = 'fas fa-map-marker-alt map-marker';
  pinElement5.style.fontSize = 20 + 'px';

  const pinElement6 = React.useRef(document.createElement('i')).current;
  pinElement6.className = 'fas fa-map-marker-alt map-marker';
  pinElement6.style.fontSize = 20 + 'px';

  const pins = [
    pinElement1,
    pinElement2,
    pinElement3,
    pinElement4,
    pinElement5,
    pinElement6,
  ];

  React.useEffect(() => {
    if (!selected) return;
    if (selected.locked) pinElement1.style.color = selected.color;
    else pinElement1.style.color = selected.color;
    // map.current.flyTo({
    //   center: selected.coords,
    //   essential: true,
    //   zoom: 6,
    // });
  }, [selected]);

  React.useEffect(() => {
    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/nishika25/ckoh3qfgz2iy517mh3z5atu07',
      // zoom: 10,
    });

    const markers = pins.map((pin) => {
      return new mapboxgl.Marker(pin).setLngLat([0, 0]);
    });

    //@ts-ignore
    map.current.on('load', () => {
      markers.forEach((marker: any) => {
        marker.addTo(map.current);
      });

      map.current.setMaxZoom(3);
    });

    get('/regions').then((data) => {
      setOptions(
        data.map((option: any, index: number) => {
          const lastUnlockedIndex = auth?.user?.lastUnlockedIndex || 0;
          const completed = auth?.user?.regions[index].isCompleted;

          console.log(JSON.parse(option.colorData).coords);

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
              locked: index > lastUnlockedIndex,
              completed,
              coords: JSON.parse(option.colorData).coords,
            });
          }

          return {
            value: option._id,
            label: option.name,
            description: option.description,
            color: JSON.parse(option.colorData).color,
            pin: JSON.parse(option.colorData).pin,
            button: JSON.parse(option.colorData).button,
            locked: index > lastUnlockedIndex,
            completed,
            coords: JSON.parse(option.colorData).coords,
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
        <Dropdown
          setter={setSelected}
          defaultIndex={auth?.user?.lastUnlockedIndex || 0}
          options={options}
        />
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
