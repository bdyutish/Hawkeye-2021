/* eslint import/no-webpack-loader-syntax: off */

import React, { ReactElement } from 'react';

//@ts-ignore
// import mapboxgl from '!mapbox-gl/dist/mapbox-gl.js';
import mapboxgl from '!mapbox-gl';

import Button from '../components/Button';
import HUD from '../components/HUD';

import { get } from '../utils/requests';
import { useAuth } from '../context/AuthContext';

import Dropdown from '../components/Dropdown';
import Loading from '../components/Loading';
import { coordinates, mapdData } from '../utils/data';
import { useMediaQuery } from 'react-responsive';
import hawk from '../assets/hawk.svg';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

mapboxgl.accessToken = mapdData.token;
// 'pk.eyJ1IjoibmlzaGlrYTI1IiwiYSI6ImNrb2R4ODlvcjA1cWEyd3A1eWFqZThsZGMifQ.hk-3XzdHKUYiV5p1SIi_mQ';

export default function Home(): ReactElement {
  const map = React.useRef<any>(null);

  const isPhone = useMediaQuery({
    query: '(max-device-width: 800px)',
  });

  const [selected, setSelected] = React.useState<any>(null);

  const [zeroIndex, setZeroIndex] = React.useState(false);

  const [mapLoading, setMapLoading] = React.useState(true);

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
  const history = useHistory();
  const { addToast } = useToasts();

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
    map.current = new mapboxgl.Map({
      container: 'map',
      style: mapdData.styleUrl,
      // style: 'mapbox://styles/nishika25/ckoh3qfgz2iy517mh3z5atu07',
      // zoom: 10,
    });

    const markers = pins.map((pin, index: number) => {
      return new mapboxgl.Marker(pin).setLngLat(coordinates[index].coords);
    });

    pins.forEach((pin: any, index: number) => {
      pin.style.color = coordinates[index].color;
      // pin.style.color = '#888';
    });

    //@ts-ignore
    map.current.on('load', () => {
      setMapLoading(false);

      markers.forEach((marker: any) => {
        marker.addTo(map.current);
      });

      map.current.setMaxZoom(3);
      map.current.setMinZoom(2);
    });

    get('/regions').then((data) => {
      setOptions(
        data.map((option: any, index: number) => {
          const lastUnlockedIndex = auth?.user?.lastUnlockedIndex || 0;

          const completed = auth?.user?.regions[index].isCompleted;

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

  if (isPhone) {
    return (
      <div className="home home--phone">
        <img
          style={{
            zIndex: zeroIndex ? 0 : 25,
          }}
          src={hawk}
          alt=""
          className="hawk"
          id="hawkk"
        />
        <div className="main">
          <h1 style={{ zIndex: zeroIndex ? 0 : 25 }}>Welcome Player</h1>
          <h2
            style={{
              zIndex: zeroIndex ? 0 : 25,
              color: selected?.color || '#585FFF',
            }}
          >
            Select your region
          </h2>
          <aside style={{ zIndex: zeroIndex ? 0 : 25 }}>
            <Dropdown
              setter={(val: any) => {
                auth?.setCurrentRegion(val.label);
                setSelected(val);
                try {
                  map.current.flyTo({
                    center: val.coords,
                    essential: true,
                    zoom: 6,
                  });
                } catch (err) {}
              }}
              defaultIndex={auth?.user?.lastUnlockedIndex || 0}
              options={options}
            />
            <p>{selected?.description}</p>
            {!selected?.completed && !selected?.locked && (
              <Button
                name="Start"
                onClick={() => {
                  if (selected.locked) {
                    addToast('Region Locked', { appearance: 'error' });
                    return;
                  }
                  if (selected.completed) {
                    addToast('Region Completed', { appearance: 'success' });
                    return;
                  }
                  history.push(`/question/${selected?.value}`);
                }}
              />
            )}
            {selected?.completed && (
              <h3 className="home-completed home-detail">Region Completed</h3>
            )}
            {selected?.locked && (
              <h3 className="home-locked home-detail">Region Locked</h3>
            )}
          </aside>{' '}
        </div>
        <div id="map"></div>
        <HUD
          onOpen={() => setZeroIndex(true)}
          onClose={() => setZeroIndex(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="home">
        {!mapLoading && (
          <>
            <img
              style={{
                zIndex: zeroIndex ? 0 : 25,
              }}
              className="hawk"
              src={hawk}
              id="hawkk"
              alt=""
            />
            <h1
              style={{
                zIndex: zeroIndex ? 0 : 25,
              }}
            >
              HAWKEYE
            </h1>
            <h2
              style={{
                zIndex: zeroIndex ? 0 : 25,
                color: selected?.color || '#585FFF',
              }}
            >
              Select Your Region
            </h2>
            <main style={{ zIndex: zeroIndex ? 0 : 25 }}>
              <Dropdown
                setter={(val: any) => {
                  auth?.setCurrentRegion(val.label);
                  setSelected(val);
                  try {
                    map.current.flyTo({
                      center: val.coords,
                      essential: true,
                      zoom: 6,
                    });
                  } catch (err) {}
                }}
                defaultIndex={auth?.user?.lastUnlockedIndex || 0}
                options={options}
              />
              <p>{selected?.description}</p>
              {!selected?.completed && !selected?.locked && (
                <Button
                  // pathname={`/question/${selected?.value}`}
                  // state={{ allow: true }}
                  // link
                  name="Start"
                  onClick={() => {
                    if (selected.locked) {
                      addToast('Region Locked', { appearance: 'error' });
                      return;
                    }
                    if (selected.completed) {
                      addToast('Region Completed', { appearance: 'success' });
                      return;
                    }
                    history.push(`/question/${selected?.value}`);
                  }}
                />
              )}
              {selected?.completed && (
                <h3 className="home-completed home-detail">Region Completed</h3>
              )}
              {selected?.locked && (
                <h3 className="home-locked home-detail">Region Locked</h3>
              )}
            </main>{' '}
          </>
        )}
        <div id="map"></div>
        <HUD
          onOpen={() => setZeroIndex(true)}
          onClose={() => setZeroIndex(false)}
        />
      </div>
    </>
  );
}
