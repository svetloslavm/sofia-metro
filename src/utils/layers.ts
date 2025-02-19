import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { LayerProps } from "react-map-gl/mapbox";
import { COLOR } from "consts";
import { MetroStatus } from "enums";
import { getExistingFeatures } from "utils";
import { MetroLine, MetroStation } from "typings";

import metroEntrances from "assets/geojson/mgt_metro_spirki_vhodove_25_osm_20200402.json";
import accessibility from "assets/geojson/metro_400_800_1200m_25_sofpr_20190000.json";
import entrances from "assets/geojson/mgt_metro_spirki_vhodove_25_osm_20200402.json";
import lines from "assets/geojson/mgt_metro_26_sofpr_20210308.json";
import stations from "assets/geojson/mgt_metro_spirki_26_sofpr_20210308.json";

import entranceDownArrow from "assets/svg/metro-transport-signal-down.svg";

export const metroEntrancesLayer = (areEntrancesVisible: boolean) =>
  new GeoJsonLayer({
    id: "metroEntrances",
    data: metroEntrances as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    getLineColor: COLOR.BLACK,
    getFillColor: COLOR.RED,
    getPointRadius: 5,
    getLineWidth: 2,
    pickable: true,
    visible: areEntrancesVisible,
  });

export const metroAccessibilityLayer = (isAccessibilityVisible: boolean) =>
  new GeoJsonLayer({
    id: "metro_accessibility",
    data: accessibility as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    lineWidthMinPixels: 2,
    getLineColor: COLOR.BLACK,
    getFillColor: (d) => {
      const toBreak = d.properties.tobreak;
      if (toBreak <= 400) return COLOR.LIGHT_RED;
      if (toBreak <= 800) return COLOR.SALMON;
      return COLOR.RED;
    },
    pickable: true,
    opacity: 0.01,
    visible: isAccessibilityVisible,
  });

export const buildings3DLayer: LayerProps = {
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

export const matroEntranceIcon = (areEntrancesVisible: boolean) =>
  new IconLayer({
    id: "metro_entrances",
    data: entrances.features,
    getIcon: () => "entrance",
    getPosition: (d) => d.geometry.coordinates[0],
    iconAtlas: entranceDownArrow,
    iconMapping: {
      entrance: {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 100,
        mask: false,
      },
    },
    sizeScale: 10, // Add size scale
    getSize: 5, // Add size accessor
    pickable: false,
    visible: areEntrancesVisible,
    onHover: ({ object }) => console.log(object), // Add logging for debugging
  });

export const metrLinesLayer = (isPlannedVisible: boolean) =>
  new GeoJsonLayer<MetroLine>({
    id: "metro_lines",
    data: isPlannedVisible ? lines : getExistingFeatures(lines),
    lineWidthMinPixels: 4,
    getLineColor: ({ properties }) =>
      properties.sastoyanie === MetroStatus.EXISTING ? COLOR.RED : COLOR.BLACK,
    pickable: true,
  });

export const metrStationsLayer = (isPlannedVisible: boolean) =>
  new GeoJsonLayer<MetroStation>({
    id: "metro_stations",
    data: isPlannedVisible ? stations : getExistingFeatures(stations),
    lineWidthMinPixels: 4,
    getLineColor: ({ properties }) =>
      properties.layer === MetroStatus.EXISTING ? COLOR.BLUE : COLOR.WHITE,
    getFillColor: ({ properties }) =>
      properties.layer === MetroStatus.EXISTING ? COLOR.BLUE : COLOR.WHITE,
    pickable: true,
  });
