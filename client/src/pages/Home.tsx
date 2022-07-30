/* eslint import/no-webpack-loader-syntax: off */

import React, { ReactElement } from "react";

import Button from "../components/Button";
import HUD from "../components/HUD";

import { get } from "../utils/requests";
import { useAuth } from "../context/AuthContext";

import Dropdown from "../components/Dropdown";
import { useMediaQuery } from "react-responsive";
import hawk from "../assets/hawk.svg";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectCoverflow } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/effect-coverflow/effect-coverflow.scss";

import oneImg from "../assets/regions/home/1.png";
import twoImg from "../assets/regions/home/2.png";
import threeImg from "../assets/regions/home/3.png";
import fourImg from "../assets/regions/home/4.png";

SwiperCore.use([EffectCoverflow]);
// https://codesandbox.io/s/swiper-react-coverflow-effect-forked-ov13n9?file=/src/SwiperCoverflow.jsx

export default function Home(): ReactElement {
  const [swiper, setSwiper] = React.useState<any>(null);

  const isPhone = useMediaQuery({
    query: "(max-device-width: 800px)",
  });

  const [selected, setSelected] = React.useState<any>(null);

  const [zeroIndex, setZeroIndex] = React.useState(false);

  const [options, setOptions] = React.useState<any>([
    {
      value: "",
      label: "",
    },
    {
      value: "",
      label: "",
    },
    {
      value: "",
      label: "",
    },
    {
      value: "",
      label: "",
    },
    {
      value: "",
      label: "",
    },
    {
      value: "",
      label: "",
    },
  ]);

  const auth = useAuth();
  const history = useHistory();
  const { addToast } = useToasts();

  React.useEffect(() => {
    if (!swiper || !selected) return;
    if (!selected.label) return;
    swiper.slides.forEach((slide: any, index: number) => {
      if (slide.id === selected.label) swiper.slideTo(index, 700);
    });
  }, [selected]);

  React.useEffect(() => {
    get("/regions").then((data) => {
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

  // const getSwiperRegionName = (swiper: any) => {
  //   swiper;
  // };

  const slideToRegion = (swiper: any, name: string) => {
    if (!swiper || !swiper.slides) return;
    swiper.slides.forEach((slide: any, index: number) => {
      if (slide.id === name) swiper.slideTo(index, 700);
    });
  };

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
              color: selected?.color || "#585FFF",
            }}
          >
            Select your region
          </h2>
          <aside style={{ zIndex: zeroIndex ? 0 : 25 }}>
            <Dropdown
              setter={(val: any) => {
                auth?.setCurrentRegion(val.label);
                setSelected(val);
                if (!swiper) return;
                slideToRegion(swiper, val.label);
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
                    addToast("Region Locked", { appearance: "error" });
                    return;
                  }
                  if (selected.completed) {
                    addToast("Region Completed", { appearance: "success" });
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
          </aside>{" "}
        </div>
        <Swiper
          effect="coverflow"
          className="swiper-mobile"
          grabCursor
          centeredSlides
          slidesPerView={2}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          onSwiper={setSwiper}
          // loop
        >
          <SwiperSlide className="swiper-desktop--slide" id="Apocalypse">
            <img src={oneImg} />
          </SwiperSlide>
          <SwiperSlide className="swiper-desktop--slide" id="Cyberpunk">
            <img src={twoImg} />
          </SwiperSlide>
          <SwiperSlide className="swiper-desktop--slide" id="Solarpunk">
            <img src={threeImg} />
          </SwiperSlide>
          <SwiperSlide className="swiper-desktop--slide" id="Cottagecore">
            <img src={fourImg} />
          </SwiperSlide>
        </Swiper>
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
              color: selected?.color || "#585FFF",
            }}
          >
            Select Your Region
          </h2>
          <main style={{ zIndex: zeroIndex ? 0 : 25 }}>
            <Dropdown
              setter={(val: any) => {
                auth?.setCurrentRegion(val.label);
                setSelected(val);
                if (!swiper) return;
                slideToRegion(swiper, val.label);
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
                    addToast("Region Locked", { appearance: "error" });
                    return;
                  }
                  if (selected.completed) {
                    addToast("Region Completed", { appearance: "success" });
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
          </main>{" "}
        </>

        <Swiper
          effect="coverflow"
          className="swiper-desktop"
          grabCursor
          centeredSlides
          slidesPerView={2}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          onSwiper={setSwiper}
          // loop
        >
          <SwiperSlide className="swiper-desktop--slide" id="Apocalypse">
            <img src={oneImg} />
          </SwiperSlide>
          <SwiperSlide className="swiper-desktop--slide" id="Cyberpunk">
            <img src={twoImg} />
          </SwiperSlide>
          <SwiperSlide className="swiper-desktop--slide" id="Solarpunk">
            <img src={threeImg} />
          </SwiperSlide>
          <SwiperSlide className="swiper-desktop--slide" id="Cottagecore">
            <img src={fourImg} />
          </SwiperSlide>
        </Swiper>
        <HUD
          onOpen={() => setZeroIndex(true)}
          onClose={() => setZeroIndex(false)}
        />
      </div>
    </>
  );
}
