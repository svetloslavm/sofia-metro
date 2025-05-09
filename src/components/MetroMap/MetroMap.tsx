import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map, NavigationControl, MapRef, Layer } from "react-map-gl/mapbox";
import { PickingInfo } from "@deck.gl/core";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

import { DeckGLOverlay, MapStyleToggle, Sidebar } from "components";
import { MapStyle } from "typings";
import { INITIAL_VIEW_STATE, MAP_STYLES } from "consts";
import { getExistingFeatures } from "utils";
import { useMapLayers } from "hooks";

import lines from "assets/geojson/mgt_metro_26_sofpr_20210308.json";

import "mapbox-gl/dist/mapbox-gl.css";
import "./MetroMap.css";

export const MetroMap = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [mapStyleOrder, setMapStyleOrder] = useState(
    Object.keys(MAP_STYLES) as Array<MapStyle>
  );
  const [mapStyle, setMapStyle] = useState(mapStyleOrder[0]);
  const [isPlannedVisible, setIsPlannedVissible] = useState(false);
  const [isAccessibilityVisible, setIsAccessibilityVisible] = useState(false);
  const [areEntrancesVisible, setAreEntrancesVisible] = useState(false);

  const {
    metroAccessibilityLayer,
    metroLinesLayer,
    metroStationsLayer,
    metroEntrancesLayer,
    buildings3DLayer,
    metroConnectionsLayer,
  } = useMapLayers(
    isPlannedVisible,
    isAccessibilityVisible,
    areEntrancesVisible
  );

  const layers = useMemo(
    () => [
      metroAccessibilityLayer,
      metroLinesLayer,
      metroStationsLayer,
      metroEntrancesLayer,
      metroConnectionsLayer,
    ],
    [
      metroAccessibilityLayer,
      metroLinesLayer,
      metroStationsLayer,
      metroEntrancesLayer,
      metroConnectionsLayer,
    ]
  );

  const getTooltip = ({ object }: PickingInfo) => {
    if (!object) return null;

    let tooltip = "";
    const { type } = object.geometry;
    const { stancia, layer, sastoyanie, name, frombreak, tobreak, wheelchair } =
      object.properties;

    if (type === "MultiPoint" && name)
      tooltip += `Type: Metro entrance\nName: ${name}\n`;
    if (name && type !== "MultiPoint")
      tooltip += `Accessibility: ${frombreak} - ${tobreak} meter\n`;
    if (type === "MultiPolygon") tooltip += `Type: Metro station\n`;
    if (type === "MultiLineString") tooltip += `Type: Metro line\n`;

    if (stancia) tooltip += `Station: ${stancia}\n`;
    if (layer)
      tooltip += `Status: ${layer.charAt(0).toUpperCase() + layer.slice(1)}\n`;
    if (sastoyanie)
      tooltip += `Status: ${
        sastoyanie.charAt(0).toUpperCase() + sastoyanie.slice(1)
      }\n`;
    if (wheelchair) tooltip += `Wheelchair: ${wheelchair}\n`;

    return {
      text: tooltip,
      className: "deck-tooltip",
    };
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

  const togglePlanned = useCallback(() => {
    setIsPlannedVissible(!isPlannedVisible);
  }, [isPlannedVisible]);

  const toggleAccessibility = useCallback(() => {
    setIsAccessibilityVisible(!isAccessibilityVisible);
  }, [isAccessibilityVisible]);

  const toggleEntrances = useCallback(() => {
    setAreEntrancesVisible(!areEntrancesVisible);
  }, [areEntrancesVisible]);

  const fitMapToBounds = useCallback(
    (features: GeoJSON.Feature[]) => {
      const bounds = features.reduce(
        (acc: number[], feature: Feature<Geometry, GeoJsonProperties>) => {
          const [minLng, minLat, maxLng, maxLat] = acc;
          const [lng, lat] = feature.geometry.coordinates.flat(Infinity);

          return [
            Math.min(minLng, lng),
            Math.min(minLat, lat),
            Math.max(maxLng, lng),
            Math.max(maxLat, lat),
          ];
        },
        [Infinity, Infinity, -Infinity, -Infinity]
      );

      if (mapRef.current) {
        mapRef.current.fitBounds(
          [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ],
          {
            pitch: mapRef.current.getPitch(),
            padding: {
              top: isPlannedVisible ? 200 : 150,
              right: isPlannedVisible ? 300 : 100,
              bottom: isPlannedVisible ? 50 : 50,
              left: isPlannedVisible ? 0 : 100,
            },
            duration: 1000,
          }
        );
      }
    },
    [isPlannedVisible]
  );

  const fitMapToFeatures = useCallback(() => {
    const existingFeatures = {
      type: "FeatureCollection",
      features: getExistingFeatures(lines),
    };

    if (isPlannedVisible) {
      fitMapToBounds(lines.features as Feature<Geometry, GeoJsonProperties>[]);
    } else {
      fitMapToBounds(
        existingFeatures.features as Feature<Geometry, GeoJsonProperties>[]
      );
    }
  }, [isPlannedVisible, fitMapToBounds]);

  const handleMapLoad = () => {
    fitMapToFeatures();
  };

  useEffect(() => {
    fitMapToFeatures();
  }, [fitMapToFeatures]);

  return (
    <div className="mapContainer">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={handleMapLoad}
      >
        <DeckGLOverlay layers={layers} getTooltip={getTooltip} />
        <NavigationControl position="bottom-right" />
        <Layer {...buildings3DLayer} />
      </Map>
      <MapStyleToggle
        mapStyle={mapStyle}
        mapStyleOrder={mapStyleOrder}
        onStyleChange={handleStyleChange}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Sidebar
        mapRef={mapRef}
        isPlannedVisible={isPlannedVisible}
        togglePlanned={togglePlanned}
        areEntrancesVisible={areEntrancesVisible}
        toggleEntrances={toggleEntrances}
        isAccessibilityVisible={isAccessibilityVisible}
        toggleAccessibility={toggleAccessibility}
      />
    </div>
  );
};
