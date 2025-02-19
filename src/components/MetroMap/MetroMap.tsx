import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map, NavigationControl, MapRef, Layer } from "react-map-gl/mapbox";
import type { PickingInfo } from "@deck.gl/core";

import { DeckGLOverlay, MapStyleToggle, Sidebar } from "components";
import { MapStyle } from "typings";
import { INITIAL_VIEW_STATE, MAP_STYLES } from "consts";
import {
  metroEntrancesLayer,
  metroAccessibilityLayer,
  buildings3DLayer,
  getExistingFeatures,
  metrLinesLayer,
  metrStationsLayer,
} from "utils";

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

  /////////////////////
  // extract in utils
  // const test = stations.features.map((stationFeature) => {
  //   const stationName = stationsNames.features.find((stationsNamesFeature) => {
  //     const stationPoint = point(
  //       stationsNamesFeature.geometry.coordinates.flat()
  //     );
  //     const stationPolygon = polygon(
  //       stationFeature.geometry.coordinates.flat()
  //     );

  //     return booleanPointInPolygon(stationPoint, stationPolygon);
  //   });
  //   console.log({ stationName });

  //   return {
  //     ...stationFeature,
  //     properties: {
  //       ...stationFeature.properties,
  //       stancia: stationName?.properties.name,
  //     },
  //   };
  // });

  const layers = useMemo(
    () => [
      metroAccessibilityLayer(isAccessibilityVisible),
      metrLinesLayer(isPlannedVisible),
      metrStationsLayer(isPlannedVisible),
      metroEntrancesLayer(areEntrancesVisible),
    ],
    [isPlannedVisible, isAccessibilityVisible, areEntrancesVisible]
  );

  const getTooltip = ({ layer, object }: PickingInfo) => {
    if (!object) return null;

    // TODO: Create tooltips for all layers.
    //console.log({ layer, object });
    //switch (layer?.id) {
    //  case "metro_lines":
    //    return `Line: ${object.properties.id}`;
    //  case "metro_stations":
    //    return `Station: ${object.properties.stancia ?? object.properties.id}`;
    //  case "metro_accessibility":
    //    return `Accessibility: ${object.properties.id}`;
    //  default:
    //    break;
    //}

    const { id, stancia, sastoyanie, name } = object.properties;

    return `# ${id}\n${stancia ? `Station: ${stancia}\n` : ""}Status: ${
      layer || sastoyanie
    }\n${name}`;
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

  const fitMapToBounds = (data: any) => {
    const bounds = data.features.reduce(
      (acc: any, feature: any) => {
        const [minLng, minLat, maxLng, maxLat] = acc;
        const coordinates = feature.geometry.coordinates.flat(Infinity);
        const lng = coordinates[0];
        const lat = coordinates[1];

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
  };

  const fitMapToFeatures = useCallback(() => {
    const existingFeatures = {
      type: "FeatureCollection",
      features: getExistingFeatures(lines),
    };

    if (isPlannedVisible) {
      fitMapToBounds(lines);
    } else {
      fitMapToBounds(existingFeatures);
    }
  }, [isPlannedVisible]);

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
        mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
        initialViewState={INITIAL_VIEW_STATE}
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
