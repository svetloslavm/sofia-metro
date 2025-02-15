import { ReactNode } from "react";
import { MapStyle } from "typings";

import darkModeImg from "assets/images/dark-mode.png";
import lightModeImg from "assets/images/light-mode.png";
import terrainModeImg from "assets/images/terrain-mode.png";

export const MAP_STYLES: Record<MapStyle, { image: ReactNode; label: string }> =
  {
    "dark-v11": {
      image: <img src={darkModeImg} alt="Dark Mode" />,
      label: "Dark",
    },
    "light-v11": {
      image: <img src={lightModeImg} alt="Light Mode" />,
      label: "Light",
    },
    "satellite-streets-v12": {
      image: <img src={terrainModeImg} alt="Terrain Mode" />,
      label: "Terrain",
    },
  };
