import { useState } from "react";
import { ArcLayer, GeoJsonLayer } from "deck.gl";
import { LayerProps } from "react-map-gl/mapbox";
import { Feature, Geometry, FeatureCollection } from "geojson";

import { COLOR } from "consts";
import { getExistingFeatures } from "utils";
import { MetroStatus } from "enums";
import {
  MetroLine,
  MetroStationGeometry,
  MetroStationProperties,
} from "typings";

import accessibility from "assets/geojson/metro_400_800_1200m_25_sofpr_20190000.json";
import lines from "assets/geojson/mgt_metro_26_sofpr_20210308.json";
import stations from "assets/geojson/mgt_metro_spirki_26_sofpr_20210308.json";
import metroEntrances from "assets/geojson/mgt_metro_spirki_vhodove_25_osm_20200402.json";

export const useMapLayers = (
  isPlannedVisible: boolean,
  isAccessibilityVisible: boolean,
  areEntrancesVisible: boolean
) => {
  const [hoveredObject, setHoveredObject] = useState<Feature<Geometry> | null>(
    null
  );
  const [clickedStation, setClickedStation] =
    useState<Feature<MetroStationGeometry> | null>(null);

  const buildings3DLayer: LayerProps = {
    id: "3d-buildings",
    source: "composite",
    "source-layer": "building",
    filter: ["==", "extrude", "true"],
    type: "fill-extrusion",
    minzoom: 13,
    paint: {
      "fill-extrusion-color": "#aaa",
      "fill-extrusion-height": [
        "interpolate",
        ["linear"],
        ["zoom"],
        13,
        0,
        13.05,
        ["get", "height"],
      ],
      "fill-extrusion-base": [
        "interpolate",
        ["linear"],
        ["zoom"],
        13,
        0,
        13.05,
        ["get", "min_height"],
      ],
      "fill-extrusion-opacity": 0.6,
    },
  };

  const metroAccessibilityLayer = new GeoJsonLayer({
    id: "metro_accessibility",
    data: accessibility as FeatureCollection<Geometry>,
    lineWidthMinPixels: 1,
    getLineColor: COLOR.BLACK,
    pickable: true,
    opacity: 0.01,
    visible: isAccessibilityVisible,
    getFillColor: ({ properties }) => {
      if (hoveredObject?.properties?.objectid === properties.objectid)
        return COLOR.YELLOW;

      if (properties.tobreak <= 400) return COLOR.RED_01;
      if (properties.tobreak <= 800) return COLOR.RED_02;

      return COLOR.RED;
    },
    onHover: ({ object }) => {
      setHoveredObject(object);
    },
    updateTriggers: {
      getFillColor: [hoveredObject],
    },
  });

  const metroLinesLayer = new GeoJsonLayer<MetroLine>({
    id: "metro_lines",
    data: isPlannedVisible
      ? (lines as FeatureCollection<Geometry>)
      : ({
          type: "FeatureCollection",
          features: getExistingFeatures(lines),
        } as FeatureCollection<Geometry>),
    lineWidthMinPixels: 4,
    getLineColor: ({ properties }) =>
      properties.sastoyanie === MetroStatus.EXISTING ? COLOR.RED : COLOR.BLACK,
    pickable: true,
  });

  const metroStationsLayer = new GeoJsonLayer<
    MetroStationProperties,
    MetroStationGeometry
  >({
    id: "metro_stations",
    data: isPlannedVisible
      ? (stations as FeatureCollection<Geometry>)
      : ({
          type: "FeatureCollection",
          features: getExistingFeatures(stations) as Feature<Geometry>[],
        } as FeatureCollection<Geometry>),
    lineWidthMinPixels: 4,
    getLineWidth: 4,
    getLineColor: ({ properties }) =>
      properties.layer === MetroStatus.EXISTING
        ? COLOR.LIGHT_YELLOW
        : COLOR.WHITE,
    getFillColor: ({ properties }) =>
      properties.layer === MetroStatus.EXISTING
        ? COLOR.LIGHT_YELLOW
        : COLOR.WHITE,
    onHover: ({ object }) => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.style.cursor = object ? "pointer" : "";
      }
    },
    onClick: ({ object }) => {
      setClickedStation(object);
    },
    pickable: true,
  });

  const metroEntrancesLayer = new GeoJsonLayer({
    id: "metroEntrances",
    data: metroEntrances as FeatureCollection<Geometry>,
    getLineColor: COLOR.BLACK,
    getFillColor: COLOR.RED,
    getPointRadius: 5,
    getLineWidth: 2,
    pickable: true,
    visible: areEntrancesVisible,
  });

  const metroConnectionsLayer = clickedStation
    ? new ArcLayer({
        id: "metroConnections",
        data:
          clickedStation.geometry.connections?.map((target) => ({
            source: clickedStation.geometry.center,
            target,
          })) || [],
        getSourcePosition: ({ source }) => source,
        getTargetPosition: ({ target }) => target,
        getSourceColor: COLOR.YELLOW,
        getTargetColor: COLOR.LIGHT_YELLOW,
        getWidth: 5,
        getHeight: 0.65,
      })
    : null;

  return {
    buildings3DLayer,
    metroAccessibilityLayer,
    metroLinesLayer,
    metroStationsLayer,
    metroEntrancesLayer,
    metroConnectionsLayer,
  };
};
