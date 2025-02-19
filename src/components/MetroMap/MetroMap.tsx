import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Map,
  NavigationControl,
  MapRef,
  MapEvent,
  Layer,
} from "react-map-gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { center } from "@turf/turf";
import type { PickingInfo } from "@deck.gl/core";

import { DeckGLOverlay, ViewBoxList } from "components";
import { MetroStation, MetroLine, MapStyle } from "typings";
import { MetroStatus } from "enums";
import { COLOR, INITIAL_VIEW_STATE, MAP_STYLES } from "consts";
import {
  metroEntrancesLayer,
  metroAccessibilityLayer,
  buildings3DLayer,
} from "utils";

import lines from "assets/geojson/mgt_metro_26_sofpr_20210308.json";
import stations from "assets/geojson/mgt_metro_spirki_26_sofpr_20210308.json";

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

  const filterExistingFeatures = (data: any) =>
    data.features
      .filter(
        (feature: any) =>
          feature.properties.layer === MetroStatus.EXISTING ||
          feature.properties.sastoyanie === MetroStatus.EXISTING
      )
      .sort((a: any, b: any) =>
        (a.properties.stancia ?? "").localeCompare(b.properties.stancia ?? "")
      );

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
      new GeoJsonLayer<MetroLine>({
        id: "metro_lines",
        data: isPlannedVisible ? lines : filterExistingFeatures(lines),
        lineWidthMinPixels: 4,
        getLineColor: ({ properties }) =>
          properties.sastoyanie === MetroStatus.EXISTING
            ? COLOR.RED
            : COLOR.BLACK,
        pickable: true,
      }),
      new GeoJsonLayer<MetroStation>({
        id: "metro_stations",
        data: isPlannedVisible ? stations : filterExistingFeatures(stations),
        lineWidthMinPixels: 4,
        getLineColor: ({ properties }) =>
          properties.layer === MetroStatus.EXISTING ? COLOR.BLUE : COLOR.WHITE,
        getFillColor: ({ properties }) =>
          properties.layer === MetroStatus.EXISTING ? COLOR.BLUE : COLOR.WHITE,
        pickable: true,
      }),
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
      features: filterExistingFeatures(lines),
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

  const flyToStation = (feature: any) => {
    const featureCCenter = center(feature);
    const [lng, lat] = featureCCenter.geometry.coordinates;

    mapRef.current?.flyTo({
      zoom: 16.5,
      center: [lng, lat],
      essential: true,
    });
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
      {/*TODO: Extract in separate component MapStyleToggle*/}
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
      {/* TODO: Extract in separate component */}
      <div className="sidebar">
        {/* TODO: Extract in separate component, use visible */}
        <div>
          <input
            type="checkbox"
            checked={isPlannedVisible}
            onChange={togglePlanned}
          />
          Planned
          <br />
          <input
            type="checkbox"
            checked={areEntrancesVisible}
            onChange={toggleEntrances}
          />
          Entrances
          <br />
          <input
            type="checkbox"
            checked={isAccessibilityVisible}
            onChange={toggleAccessibility}
          />
          Accessibility
        </div>
        <h3>Stations</h3>
        <hr />
        <ul
          style={{
            fontSize: 14,
            listStyleType: "none",
            paddingLeft: 10,
            height: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          {(isPlannedVisible
            ? stations.features
            : filterExistingFeatures(stations)
          )?.map((feature) => (
            <li
              // TODO: Add styles in css, after extracting in separate component
              style={{ cursor: "pointer", fontSize: 13, lineHeight: 1.8 }}
              key={feature.properties.id}
              onClick={() => flyToStation(feature)}
            >
              {feature.properties.stancia ?? feature.properties.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
