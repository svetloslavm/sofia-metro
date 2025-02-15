import { useState } from "react";

import { Map, NavigationControl, FullscreenControl } from "react-map-gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import type { PickingInfo } from "@deck.gl/core";

import { DeckGLOverlay, ViewBoxList } from "components";
import { MetroStation, MetroLine, MapStyle } from "typings";
import { MetroStatus } from "enums";
import { COLOR, INITIAL_VIEW_STATE, MAP_STYLES } from "consts";
import { addBuildingLayer } from "utils";

import lines from "assets/geojson/mgt_metro_26_sofpr_20210308.json";
import stations from "assets/geojson/mgt_metro_spirki_26_sofpr_20210308.json";

import "mapbox-gl/dist/mapbox-gl.css";
import "./MetroMap.css";

export const MetroMap = () => {
  const [mapStyleOrder, setMapStyleOrder] = useState(
    Object.keys(MAP_STYLES) as Array<MapStyle>
  );
  const [mapStyle, setMapStyle] = useState(mapStyleOrder[0]);

  const layers = [
    new GeoJsonLayer<MetroLine>({
      id: "metro_lines",
      data: lines as any,
      lineWidthMinPixels: 4,
      getLineColor: ({ properties }) =>
        properties.sastoyanie === MetroStatus.EXISTING
          ? COLOR.RED
          : COLOR.BLACK,
      pickable: true,
    }),
    new GeoJsonLayer<MetroStation>({
      id: "metro_stations",
      data: stations as any,
      getLineColor: ({ properties }) =>
        properties.layer === MetroStatus.EXISTING ? COLOR.BLUE : COLOR.WHITE,
      getFillColor: ({ properties }) =>
        properties.layer === MetroStatus.EXISTING ? COLOR.BLUE : COLOR.WHITE,
      pickable: true,
    }),
  ];

  const getTooltip = ({ object }: PickingInfo) => {
    if (!object) return null;

    const { id, stancia, layer, sastoyanie } = object.properties;

    return `# ${id}\n${stancia ? `Station: ${stancia}\n` : ""}Status: ${
      layer || sastoyanie
    }`;
  };

  const handleMouseEnter = () => {
    document.querySelectorAll(".viewBoxWrapper .viewBox").forEach((el) => {
      if ((el as HTMLElement).id !== mapStyle) {
        (el as HTMLElement).style.display = "flex";
        (el as HTMLElement).style.opacity = "1";
      }
    });
  };

  const handleMouseLeave = () => {
    document.querySelectorAll(".viewBoxWrapper .viewBox").forEach((el) => {
      if ((el as HTMLElement).id !== mapStyle) {
        (el as HTMLElement).style.display = "none";
      } else {
        (el as HTMLElement).style.display = "flex";
      }
    });
  };

  const handleStyleChange = (style: MapStyle) => {
    setMapStyle(style);
    setMapStyleOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      const currentIndex = newOrder.indexOf(style);

      if (currentIndex > -1) {
        [newOrder[0], newOrder[currentIndex]] = [
          newOrder[currentIndex],
          newOrder[0],
        ];
      }

      return newOrder;
    });

    handleMouseLeave();
  };

  return (
    <div className="mapContainer">
      <div
        className="viewBoxWrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ViewBoxList
          mapStyle={mapStyle}
          mapStyleOrder={mapStyleOrder}
          onStyleChange={handleStyleChange}
        />
      </div>
      <Map
        mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={addBuildingLayer}
      >
        <DeckGLOverlay layers={layers} getTooltip={getTooltip} />
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />
      </Map>
    </div>
  );
};
